import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";
import { learningStories } from "./stories.ts";
import { learningQuestions } from "./questions.ts";

// Azure Speech runs on the server only; never send a subscription key to the browser.
// The child-facing API accepts only our published classroom story/line identifiers.
const safeOrigin = (origin: string) => origin === "https://www.efipslibrary.com" ||
  origin === "https://efipslibrary.com" || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
const escaped = (text: string) => text.replace(/[&<>"']/g, ch =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[ch] || ch);
const allowedRates = [0.75, 0.9, 1, 1.15] as const;

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const headers: Record<string, string> = {
    "Vary": "Origin", "Cache-Control": "no-store",
    "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  if (safeOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin;
  const respond = (status: number, data: object) => new Response(JSON.stringify(data), {
    status, headers: { ...headers, "Content-Type": "application/json; charset=utf-8" }
  });

  if (req.method === "OPTIONS") return new Response(null, { status: safeOrigin(origin) ? 204 : 403, headers });
  if (req.method !== "POST" || !safeOrigin(origin)) return respond(403, { error: "FORBIDDEN" });

  const jwt = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!jwt) return respond(401, { error: "AUTH_REQUIRED" });
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anon || !service) return respond(503, { error: "SERVICE_UNAVAILABLE" });

  const auth = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error: authError } = await auth.auth.getUser(jwt);
  if (authError || !user?.email || !user.email_confirmed_at) return respond(401, { error: "INVALID_SESSION" });
  const email = user.email.toLowerCase().trim();
  if (!/^[^@\s]+@falcon-school\.com$/.test(email) ||
    !user.identities?.some(i => i.provider === "google" &&
      i.identity_data?.email_verified === true &&
      String(i.identity_data?.email || "").toLowerCase() === email))
    return respond(403, { error: "SCHOOL_GOOGLE_REQUIRED" });

  const db = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: control, error: controlError } = await db.from("efips_account_access_controls")
    .select("disabled_at,login_role").eq("email", email).maybeSingle();
  if (controlError || control?.disabled_at) return respond(403, { error: "ACCESS_DENIED" });

  if (email === "islam.ahmed@falcon-school.com") {
    const { data: staff, error } = await db.from("efips_google_staff_accounts").select("teacher_id,role").eq("email", email).maybeSingle();
    if (error || staff?.role !== "admin" || !staff.teacher_id ||
      (control?.login_role && control.login_role !== "admin")) return respond(403, { error: "ADMIN_REQUIRED" });
  } else {
    if (!/^\d{6,7}@falcon-school\.com$/.test(email) ||
      (control?.login_role && control.login_role !== "student" && control.login_role !== "both"))
      return respond(403, { error: "STUDENT_ONLY" });
    const id = email.split("@")[0];
    const [{ data: student, error: studentError }, { data: permit, error: permitError },
      { data: mapping, error: mappingError }] = await Promise.all([
      db.from("students").select("student_id").eq("student_id", id).maybeSingle(),
      db.from("saqr_learning_access").select("enabled,read_together").eq("student_id", id).maybeSingle(),
      db.from("efips_verified_school_readers").select("school_user_id,user_type").eq("auth_user_id", user.id).maybeSingle()
    ]);
    if (studentError || permitError || mappingError || !student || !permit?.enabled || !permit?.read_together ||
      (mapping && (mapping.school_user_id !== id || mapping.user_type !== "student")))
      return respond(403, { error: "LEARNING_ACCESS_DENIED" });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return respond(400, { error: "INVALID_BODY" }); }
  const key = Deno.env.get("AZURE_SPEECH_KEY") || "";
  const region = (Deno.env.get("AZURE_SPEECH_REGION") || "").toLowerCase().trim();
  const configured = key.length > 8 && /^[a-z0-9-]{2,35}$/.test(region);

  if (body.action === "status") return respond(200, {
    configured, arabicVoice: "ar-AE-HamdanNeural", englishVoice: "en-US-GuyNeural"
  });
  if (body.action !== "speak" && body.action !== "speak-question") return respond(400, { error: "UNSUPPORTED_ACTION" });
  if (!configured) return respond(503, { error: "AZURE_NOT_CONFIGURED" });

  const story = learningStories.find(item => item.id === body.storyId);
  const lineIndex = body.lineIndex;
  const locale = body.locale;
  const rate = body.rate;
  const question = body.action === "speak-question"
    ? learningQuestions.find(item => item.storyId === body.storyId && item.id === body.questionId)
    : undefined;
  const validLine = body.action === "speak" && typeof lineIndex === "number" &&
    Number.isInteger(lineIndex) && lineIndex >= 0 && !!story && lineIndex < story.ar.length;
  const validQuestion = body.action === "speak-question" && !!story && !!question;
  if ((!validLine && !validQuestion) || (locale !== "ar" && locale !== "en") ||
    typeof rate !== "number" || !allowedRates.includes(rate as typeof allowedRates[number]))
    return respond(400, { error: "INVALID_STORY_REQUEST" });

  // Basic per-account rolling limit helps contain Azure cost. Only auth UUID and time are retained.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: usageError } = await db.from("saqr_learning_voice_usage")
    .select("id", { count: "exact", head: true })
    .eq("auth_user_id", user.id).gte("requested_at", since);
  if (usageError) return respond(503, { error: "VOICE_QUOTA_UNAVAILABLE" });
  if ((count || 0) >= 180) return respond(429, { error: "VOICE_DAILY_LIMIT" });
  const { error: claimError } = await db.from("saqr_learning_voice_usage")
    .insert({ auth_user_id: user.id });
  if (claimError) return respond(503, { error: "VOICE_QUOTA_UNAVAILABLE" });

  // Only text from the approved fictional stories/questions may be spoken.
  const spokenText = question
    ? (locale === "ar" ? question.promptAr : question.promptEn)
    : (locale === "ar" ? story!.ar[lineIndex as number] : story!.en[lineIndex as number]);
  const voice = locale === "ar" ? "ar-AE-HamdanNeural" : "en-US-GuyNeural";
  const lang = locale === "ar" ? "ar-AE" : "en-US";
  const percent = Math.round((rate - 1) * 100);
  const rateString = percent > 0 ? "+" + percent + "%" : percent + "%";
  const pause = question ? '<break time="220ms"/>' : '';
  const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="' + lang +
    '"><voice name="' + voice + '" xml:lang="' + lang + '"><prosody rate="' + rateString + '">' +
    pause + escaped(spokenText) + '</prosody></voice></speak>';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const azure = await fetch("https://" + region + ".tts.speech.microsoft.com/cognitiveservices/v1", {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "EFIPS-Library-Saqr-Learning"
      },
      body: ssml, signal: controller.signal
    });
    if (!azure.ok) return respond(502, { error: "AZURE_SPEECH_UNAVAILABLE" });
    const audio = await azure.arrayBuffer();
    if (!audio.byteLength || audio.byteLength > 500000) return respond(502, { error: "INVALID_SPEECH_AUDIO" });
    return new Response(audio, {
      status: 200,
      headers: { ...headers, // Supabase functions-js parses application/octet-stream as Blob; audio/mpeg as UTF-8 text.
      // Preserve the MP3 encoding, and mark the original media type for clarity.
      "Content-Type": "application/octet-stream", "X-Saqr-Audio-Type": "audio/mpeg", "X-Saqr-Voice": voice }
    });
  } catch {
    return respond(503, { error: "SPEECH_REQUEST_FAILED" });
  } finally {
    clearTimeout(timeout);
  }
});
