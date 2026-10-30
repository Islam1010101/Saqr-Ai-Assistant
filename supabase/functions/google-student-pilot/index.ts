import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

/**
 * EFIPS Google student pilot.
 * The school confirms the official Google email rule is:
 *   verified Google <6-or-7-digit student ID>@falcon-school.com
 * Identity is validated with Google provider identity, then matched to the
 * existing student roster, and persisted to the RLS-protected mapping table.
 *
 * No client-supplied student ID or email is trusted. Never expose service role.
 */
const allow = (origin: string | null) =>
  !!origin && (origin === "https://www.efipslibrary.com" ||
    origin === "https://efipslibrary.com" ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin));

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const cors: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (allow(origin)) cors["Access-Control-Allow-Origin"] = origin!;
  const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" },
    });

  if (req.method === "OPTIONS") return new Response(null, { status: allow(origin) ? 204 : 403, headers: cors });
  if (req.method !== "POST") return json(405, { code: "METHOD_NOT_ALLOWED" });
  if (!allow(origin)) return json(403, { code: "ORIGIN_NOT_ALLOWED" });
  const bearer = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearer || bearer.split(".").length !== 3) return json(401, { code: "AUTH_REQUIRED" });

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) return json(503, { code: "SERVER_UNAVAILABLE" });

  const anon = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error: identityError } = await anon.auth.getUser(bearer);
  if (identityError || !user || !user.email || !user.email_confirmed_at)
    return json(401, { code: "INVALID_GOOGLE_SESSION" });

  const email = user.email.trim().toLowerCase();
  const emailMatch = /^([0-9]{6,7})@falcon-school\.com$/.exec(email);
  if (!emailMatch) return json(403, { code: "SCHOOL_GOOGLE_REQUIRED" });

  // Check the actual Google identity, not editable user_metadata or email hints.
  const hasGoogleIdentity = (user.identities || []).some((i) =>
    i.provider === "google" &&
    String(i.identity_data?.email || "").trim().toLowerCase() === email &&
    i.identity_data?.email_verified === true
  );
  if (!hasGoogleIdentity) return json(403, { code: "SCHOOL_GOOGLE_REQUIRED" });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  // School-managed verified Google account naming convention. The student ID
  // comes exclusively from the provider-verified email, never request content.
  const studentId = emailMatch[1];
  const { data: student, error: studentError } = await admin
    .from("students")
    .select("id,student_id,name_ar,name_en,grade,points,created_at")
    .eq("student_id", studentId)
    .maybeSingle();
  if (studentError) return json(503, { code: "ROSTER_UNAVAILABLE" });
  if (!student) return json(403, { code: "STUDENT_NOT_FOUND" });

  const { data: existing, error: mappingError } = await admin
    .from("efips_verified_school_readers")
    .select("school_user_id,user_type")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (mappingError) return json(503, { code: "VERIFICATION_UNAVAILABLE" });
  if (existing && (existing.user_type !== "student" || existing.school_user_id !== studentId))
    return json(403, { code: "ACCOUNT_LINK_CONFLICT" });

  if (!existing) {
    // Persist the provider-verified mapping for the reading challenge and other
    // features that already require this protected table. Never overwrite a
    // conflicting school-admin-approved mapping.
    const { error: insertError } = await admin.from("efips_verified_school_readers")
      .insert([{ auth_user_id: user.id, user_type: "student", school_user_id: studentId,
        verified_by: "verified_google_school_email" }]);
    if (insertError && insertError.code !== "23505")
      return json(503, { code: "VERIFICATION_UNAVAILABLE" });
    if (insertError) {
      // Another request may have created the mapping concurrently.
      const { data: current, error: checkError } = await admin
        .from("efips_verified_school_readers")
        .select("school_user_id,user_type")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      if (checkError || current?.user_type !== "student" || current?.school_user_id !== studentId)
        return json(403, { code: "ACCOUNT_LINK_CONFLICT" });
    }
  }

  // Audit the successful pilot session; logging issues must not block a verified reader.
  const { error: logError } = await admin.from("login_logs")
    .insert([{ user_id: student.student_id, user_type: "student" }]);
  if (logError) console.error("School OAuth audit insert failed");

  return json(200, { profile: student });
});
