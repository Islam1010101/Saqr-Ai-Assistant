import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeSchoolEmail, resolveSchoolLoginRole } from '../supabase/functions/google-school-login/roleSelection.ts';
import { classifySchoolLoginFailure, verifySchoolLoginWithRetry } from '../src/utils/schoolLoginRetry.ts';

assert.equal(normalizeSchoolEmail('  STUDENT@FALCON-SCHOOL.COM '),'student@falcon-school.com');
assert.equal(resolveSchoolLoginRole('123456@falcon-school.com',null,null),'student');
assert.equal(resolveSchoolLoginRole('1234567@falcon-school.com',null,null),'student');
assert.equal(resolveSchoolLoginRole('STAFF@FALCON-SCHOOL.COM','teacher',null),'teacher');
assert.equal(resolveSchoolLoginRole('principal@falcon-school.com','admin',null),'admin');
assert.equal(resolveSchoolLoginRole('123456@falcon-school.com','teacher',null),'teacher');
assert.equal(resolveSchoolLoginRole('123456@falcon-school.com','teacher','student'),'student');
assert.equal(resolveSchoolLoginRole('teacher@falcon-school.com','teacher','student'),null);
assert.equal(resolveSchoolLoginRole('123456@falcon-school.com',null,'teacher'),null);
assert.equal(resolveSchoolLoginRole('staff@falcon-school.com',null,'teacher'),null);
assert.equal(resolveSchoolLoginRole('staff@falcon-school.com',null,'admin'),null);
assert.equal(resolveSchoolLoginRole('123456@falcon-school.com',null,'both'),'student');
assert.equal(resolveSchoolLoginRole('123456@falcon-school.com','teacher','both'),'teacher');
assert.equal(resolveSchoolLoginRole('123456@external.com','teacher',null),null);
assert.equal(resolveSchoolLoginRole('abc@falcon-school.com',null,null),null);
assert.equal(resolveSchoolLoginRole('12345@falcon-school.com',null,null),null);

const login = readFileSync('pages/Login.tsx','utf8');
const callback = readFileSync('src/components/GoogleSchoolReturn.tsx','utf8');
const server = readFileSync('supabase/functions/google-school-login/index.ts','utf8');
const app = readFileSync('App.tsx','utf8');
// The only login action opens Google's account picker; no email text input.
assert.ok(!login.includes('name="school-email"'));
assert.ok(!login.includes('autoComplete="email"'));
assert.ok(!login.includes('login_hint: email'));
assert.ok(!login.includes('schoolEmail'));
assert.ok(login.includes("queryParams: { prompt: 'select_account' }"));
assert.ok(login.includes('onClick={() => void handleSchoolGoogleLogin()}'));
assert.ok(login.includes("lang === 'ar' ? 'الدخول باستخدام Google' : 'Sign in with Google'"));
assert.ok(login.includes('efips-login-hero'), 'Simplified login header remains');
assert.ok(login.includes('src="/SAQR%20ENTER.png"'), 'Saqr enters as the only sign-in header artwork');
assert.ok(login.includes('efips-heritage-welcome-fade'), 'Heritage greeting fades without changing OAuth');
assert.ok(login.includes('حياك الله في صقر'), 'Requested Emirati welcome phrase is shown on click');
assert.ok(!login.includes('efips-login-uae-halo'), 'Obsolete pulsing login halo was removed');
assert.ok(login.includes('efips-login-title'));
assert.ok(login.includes('prefers-reduced-motion:reduce'));
assert.ok(!login.includes('نقطة دخول واحدة للطلاب والمعلمين والإدارة'));
assert.ok(!login.includes('اكتب بريدك المدرسي، ثم أثبت ملكيته'));
assert.ok(!login.includes('يُحدد النظام هل أنت طالب أو معلم أو مدير'));
assert.ok(login.includes("provider: 'google'"));
assert.ok(!login.includes('setLoginType('));
assert.ok(!login.includes('handleGoogleStudentLogin'));
assert.ok(!login.includes('handleGoogleTeacherLogin'));
assert.ok(login.includes("redirectTo: window.location.origin + '/?efips_google_student=1'"),
  'Use the previously approved OAuth callback to avoid Google/Supabase allowlist changes');
assert.ok(app.includes('GoogleSchoolReturn'));
assert.ok(app.includes('<GoogleSchoolReturn />'));
assert.ok(app.includes('<GoogleTeacherReturn />'),'Allow in-flight old teacher sign-ins');
assert.ok(callback.includes("supabase.auth.getUser(session.access_token)"));
assert.ok(callback.includes("supabase.functions.invoke('google-school-login'"));
assert.ok(callback.includes("sessionStorage.removeItem('efips_oauth_school_email')"));
assert.ok(!callback.includes("sessionStorage.getItem('efips_oauth_school_email')"), 'No typed email comparison after Google OAuth');
assert.ok(!callback.includes('wrong_account'), 'Old manual-email error state removed');
assert.ok(callback.includes("localStorage.setItem('current_user'"));
assert.ok(callback.includes("localStorage.setItem('user_type'"));
assert.ok(callback.includes("await supabase.auth.signOut({scope: 'local'})"));
assert.ok(login.includes("await supabase.auth.signOut({ scope: 'local' })"));
assert.ok(callback.includes("verifySchoolLoginWithRetry"));
assert.ok(callback.includes("setStep('retryable')"));
assert.ok(callback.includes("setRetryKey(value => value + 1)"));
assert.ok(server.includes('lookupWithRetry("staff_accounts"'));
assert.ok(server.includes('lookupWithRetry("teacher_profile"'));
assert.ok(server.includes('lookupWithRetry("student_profile"'));
assert.ok(server.includes("await auth.auth.getUser(token)"));
assert.ok(server.includes('identity.provider === "google"'));
assert.ok(server.includes('identity.identity_data?.email_verified === true'));
assert.ok(server.includes("resolveSchoolLoginRole(email, staff?.role, control?.login_role)"));
assert.ok(server.includes('control?.disabled_at'));
assert.ok(server.includes('efips_google_staff_accounts'));
assert.ok(server.includes('efips_google_staff_source'));
assert.ok(server.includes('efips_verified_school_readers'));
assert.ok(server.includes('login_logs'));
assert.ok(!server.includes('req.json()'),'Server must not accept client-supplied roles or emails');
console.log('PASS: unified school OAuth role resolution, student/staff/admin isolation, original profile keys and backward compatibility');


// Behavioral regressions: transient 503 recovers without a second Google sign-in.
const httpError = (status: number, code: string) => ({
  context: new Response(JSON.stringify({code}), {
    status, headers: {'Content-Type': 'application/json'},
  }),
});
assert.equal(await classifySchoolLoginFailure(httpError(503,'DIRECTORY_UNAVAILABLE'),null),'RETRYABLE');
assert.equal(await classifySchoolLoginFailure(httpError(403,'ACCOUNT_DISABLED'),null),'BLOCKED');
assert.equal(await classifySchoolLoginFailure(httpError(403,'ACCOUNT_NOT_REGISTERED'),null),'UNREGISTERED');
assert.equal(await classifySchoolLoginFailure(httpError(403,'SCHOOL_GOOGLE_REQUIRED'),null),'SCHOOL');
assert.equal(await classifySchoolLoginFailure(httpError(401,'AUTH_INVALID'),null),'AUTH');
let transientAttempts = 0;
const verified = await verifySchoolLoginWithRetry(async () => {
  transientAttempts++;
  return transientAttempts === 1
    ? {data: null, error: httpError(503,'DIRECTORY_UNAVAILABLE')}
    : {data: {role: 'admin'}, error: null};
}, async () => {});
assert.deepEqual(verified,{role:'admin'});
assert.equal(transientAttempts,2);
let rejectedAttempts = 0;
await assert.rejects(() => verifySchoolLoginWithRetry(async () => {
  rejectedAttempts++;
  return {data: null, error: httpError(403,'ACCOUNT_DISABLED')};
}, async () => {}),/BLOCKED/);
assert.equal(rejectedAttempts,1,'Disabled accounts cannot be retried into access');
let exhaustedAttempts = 0;
await assert.rejects(() => verifySchoolLoginWithRetry(async () => {
  exhaustedAttempts++;
  return {data: null, error: httpError(503,'DIRECTORY_UNAVAILABLE')};
}, async () => {}),/RETRYABLE/);
assert.equal(exhaustedAttempts,4,'Retries must be bounded');
console.log('PASS: temporary school login recovery and strict permanent-denial handling');
