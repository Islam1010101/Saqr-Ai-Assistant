import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";
import { normalizeSchoolEmail, resolveSchoolLoginRole } from "./roleSelection.ts";

/**
 * Unified EFIPS Google login. A single endpoint resolves the registered role
 * and official name after verifying the actual Google identity in Supabase.
 * No roster lookups from unverified emails and no service key in the browser.
 * The previous student and teacher endpoints remain intact for old callbacks.
 */
const allowedOrigin = (origin: string | null) => !!origin && (
  origin === "https://www.efipslibrary.com" ||
  origin === "https://efipslibrary.com" ||
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)
);

type DirectoryResponse<T> = {data: T | null; error: {code?: string} | null; status: number};
async function lookupWithRetry<T>(
  stage: string,
  lookup: () => PromiseLike<DirectoryResponse<T>>,
): Promise<DirectoryResponse<T>> {
  let result = await lookup();
  if (result.error) {
    const transient = result.status === 0 || result.status >= 500 ||
      result.error.code === "PGRST000";
    // Safe operational diagnostics: no email, student IDs, tokens or query data.
    console.error("EFIPS school directory lookup failure", {
      stage, status: result.status, code: result.error.code || "UNKNOWN", retry: transient,
    });
    if (transient) {
      await new Promise(resolve => setTimeout(resolve, 250));
      result = await lookup();
      if (result.error) console.error("EFIPS school directory lookup retry failed", {
        stage, status: result.status, code: result.error.code || "UNKNOWN",
      });
    }
  }
  return result;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const headers: Record<string,string> = {
    "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (allowedOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin!;
  const respond = (status: number, data: Record<string,unknown>) =>
    new Response(JSON.stringify(data), {
      status, headers: {...headers, "Content-Type":"application/json", "Cache-Control":"no-store"},
    });

  if (req.method === "OPTIONS")
    return new Response(null, {status: allowedOrigin(origin) ? 204 : 403, headers});
  if (req.method !== "POST") return respond(405, {code: "METHOD_NOT_ALLOWED"});
  if (!allowedOrigin(origin)) return respond(403, {code: "ORIGIN_NOT_ALLOWED"});

  const token = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token || token.split(".").length !== 3) return respond(401, {code:"AUTH_REQUIRED"});
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) return respond(503, {code:"SERVER_UNAVAILABLE"});

  // This call verifies the token with Supabase Auth; its email must be from an
  // email-verified Google identity, never a typed email or user_metadata.
  const auth = createClient(url, anonKey, {auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:authError} = await auth.auth.getUser(token);
  if (authError || !user?.id || !user.email || !user.email_confirmed_at)
    return respond(401, {code:"AUTH_INVALID"});
  const email = normalizeSchoolEmail(user.email);
  if (!/^[^@\s]+@falcon-school\.com$/.test(email))
    return respond(403, {code:"SCHOOL_GOOGLE_REQUIRED"});
  const googleVerified = (user.identities || []).some(identity =>
    identity.provider === "google" &&
    normalizeSchoolEmail(String(identity.identity_data?.email || "")) === email &&
    identity.identity_data?.email_verified === true
  );
  if (!googleVerified) return respond(403, {code:"SCHOOL_GOOGLE_REQUIRED"});

  const admin = createClient(url, serviceKey, {auth:{persistSession:false,autoRefreshToken:false}});
  const [controlResult, staffResult] = await Promise.all([
    lookupWithRetry("access_controls", () => admin.from("efips_account_access_controls").select("disabled_at,login_role").eq("email",email).maybeSingle()),
    lookupWithRetry("staff_accounts", () => admin.from("efips_google_staff_accounts").select("teacher_id,role").eq("email",email).maybeSingle()),
  ]);
  if (controlResult.error || staffResult.error)
    return respond(503, {code:"DIRECTORY_UNAVAILABLE"});
  const control = controlResult.data;
  const staff = staffResult.data;
  if (control?.disabled_at) return respond(403, {code:"ACCOUNT_DISABLED"});
  const role = resolveSchoolLoginRole(email, staff?.role, control?.login_role);
  if (!role) return respond(403, {code:"ACCOUNT_NOT_REGISTERED"});

  if (role === "teacher" || role === "admin") {
    if (!staff?.teacher_id || staff.role !== role)
      return respond(403, {code:"ACCOUNT_NOT_REGISTERED"});
    const [teacherResult, sourceResult] = await Promise.all([
      lookupWithRetry("teacher_profile", () => admin.from("teachers").select("id,teacher_id,name_ar,name_en,created_at").eq("teacher_id",staff.teacher_id).maybeSingle()),
      lookupWithRetry("staff_source", () => admin.from("efips_google_staff_source").select("name_ar,name_en").eq("email",email).maybeSingle()),
    ]);
    if (teacherResult.error || sourceResult.error)
      return respond(503, {code:"DIRECTORY_UNAVAILABLE"});
    if (!teacherResult.data || !sourceResult.data)
      return respond(403, {code:"ACCOUNT_NOT_REGISTERED"});
    const teacher = teacherResult.data, official = sourceResult.data;
    const {error: logError} = await admin.from("login_logs")
      .insert([{user_id:teacher.teacher_id,user_type:role}]);
    if (logError) console.error("EFIPS staff login audit unavailable");
    return respond(200, {role,profile:{
      ...teacher, name_ar:official.name_ar, name_en:official.name_en, email,
    }});
  }

  // The student ID is derived only from the provider-verified institutional
  // address, never the form value. Match an actual school roster row.
  const studentId = email.split("@")[0];
  const {data:student,error:studentError} = await lookupWithRetry("student_profile", () => admin.from("students")
    .select("id,student_id,name_ar,name_en,grade,points,created_at")
    .eq("student_id",studentId).maybeSingle());
  if (studentError) return respond(503, {code:"DIRECTORY_UNAVAILABLE"});
  if (!student) return respond(403, {code:"ACCOUNT_NOT_REGISTERED"});

  const {data:existing,error:mappingError} = await lookupWithRetry("student_mapping", () => admin
    .from("efips_verified_school_readers").select("school_user_id,user_type")
    .eq("auth_user_id",user.id).maybeSingle());
  if (mappingError) return respond(503, {code:"DIRECTORY_UNAVAILABLE"});
  if (existing && (existing.user_type !== "student" || existing.school_user_id !== studentId))
    return respond(403, {code:"ACCOUNT_LINK_CONFLICT"});
  if (!existing) {
    const {error:insertError} = await admin.from("efips_verified_school_readers")
      .insert([{auth_user_id:user.id,user_type:"student",school_user_id:studentId,
        verified_by:"verified_google_school_email"}]);
    if (insertError && insertError.code !== "23505")
      return respond(503, {code:"DIRECTORY_UNAVAILABLE"});
    if (insertError) {
      const {data:latest,error:checkError} = await lookupWithRetry("mapping_conflict", () => admin.from("efips_verified_school_readers")
        .select("school_user_id,user_type").eq("auth_user_id",user.id).maybeSingle());
      if (checkError || latest?.user_type !== "student" || latest.school_user_id !== studentId)
        return respond(403, {code:"ACCOUNT_LINK_CONFLICT"});
    }
  }
  const {error:auditError} = await admin.from("login_logs")
    .insert([{user_id:student.student_id,user_type:"student"}]);
  if (auditError) console.error("EFIPS student login audit unavailable");
  return respond(200, {role:"student",profile:{...student,email}});
});
