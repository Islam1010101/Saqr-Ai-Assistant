import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Read-only regression checks before any RLS migration.
// This suite deliberately does not connect to Supabase, change login code,
// modify roles, touch account permissions, or deploy anything.
const read = path => readFileSync(path, 'utf8');

test('Google OAuth and school role resolution remain server-verified', () => {
  const login = read('pages/Login.tsx');
  const callback = read('src/components/GoogleSchoolReturn.tsx');
  const server = read('supabase/functions/google-school-login/index.ts');
  const resolver = read('supabase/functions/google-school-login/roleSelection.ts');

  assert.match(login, /provider: 'google'/);
  assert.match(callback, /supabase\.auth\.getUser\(accessToken\)/);
  assert.match(callback, /supabase\.functions\.invoke\('google-school-login'/);
  assert.match(callback, /localStorage\.setItem\('user_type', role\)/);
  assert.match(server, /auth\.auth\.getUser\(token\)/);
  assert.match(server, /identity\.provider === "google"/);
  assert.match(server, /identity\.identity_data\?\.email_verified === true/);
  assert.match(server, /resolveSchoolLoginRole\(email, staff\?\.role, control\?\.login_role\)/);
  assert.match(server, /control\?\.disabled_at/);
  assert.match(resolver, /staffRole === 'admin' \|\| staffRole === 'teacher'/);
  assert.doesNotMatch(server, /req\.json\(\)/, 'Login cannot accept caller-supplied roles or emails');
});

test('Per-user service entitlements are separate from login role changes', () => {
  const feature = read('supabase/functions/efips-feature-access/index.ts');
  const access = read('src/utils/efipsFeatureAccess.ts');
  const route = read('src/components/SchoolFeatureRoute.tsx');

  assert.match(feature, /efips_user_feature_overrides/);
  assert.match(feature, /efips_google_staff_accounts/);
  assert.match(access, /supabase\.functions\.invoke\('efips-feature-access'/);
  assert.match(route, /getSchoolFeatureAccess\(true\)/);
  assert.match(route, /result\.features\[feature\]===true/);
  assert.doesNotMatch(feature, /\.auth\.admin\./);
});

test('Schedule keeps teacher ownership rule and admin exception', () => {
  const schedule = read('pages/SchedulePage.tsx');
  assert.match(schedule, /current\?\.user_id && current\.user_id !== userData\.teacher_id && userType !== 'admin'/);
  assert.match(schedule, /userType !== 'admin' && current\?\.user_id !== userData\.teacher_id/);
  assert.match(schedule, /supabase\.from\('library_schedule'\)/);
});

test('Student timetable remains a read-only view, never a booking control', () => {
  const source = read('src/components/StudentLibraryScheduleView.tsx');
  assert.match(source, /from\('library_schedule'\)\.select\('id,teacher,subject,grade'\)/);
  assert.doesNotMatch(source, /\.insert\(|\.upsert\(|\.update\(|\.delete\(|handleSave|handleDeleteSlot/);
});

test('Borrowing service checks verified token and school identity', () => {
  const source = read('supabase/functions/admin-verified-library/index.ts');
  assert.match(source, /auth\.getUser\(jwt\)/);
  assert.match(source, /i\.provider==="google"/);
  assert.match(source, /efips_google_staff_accounts/);
  assert.match(source, /if\(staff\?\.role!=="admin"\)/);
  assert.match(source, /if\(action==="request"\)/);
  assert.match(source, /borrowings/);
});

test('Personal cloud shelf updates require the logged-in reader identity', () => {
  const source = read('src/utils/efipsCloud.ts');
  assert.match(source, /const user = await getVerifiedReader\(\)/);
  assert.match(source, /user\.id !== uid/);
  assert.match(source, /from\('efips_read_later'\)/);
  assert.match(source, /from\('efips_reading_goals'\)/);
  assert.match(source, /from\('efips_reading_completions'\)/);
});

test('Public browser client does not contain a privileged service key', () => {
  const client = read('src/utils/supabase.ts');
  assert.match(client, /createClient\(SUPABASE_URL, SUPABASE_ANON_KEY\)/);
  assert.doesNotMatch(client, /SUPABASE_SERVICE_ROLE_KEY|service_role|sb_secret_/);
});

test('Existing direct-data access is flagged for migration before RLS is enabled', () => {
  const schedule = read('pages/SchedulePage.tsx');
  const admin = read('pages/AdminDashboard.tsx');
  const saqr = read('pages/SmartSearchPage.tsx');
  const paths = [
    ["schedule", schedule, /from\('library_schedule'\)/],
    ["admin-dashboard", admin, /from\('login_logs'\)/],
    ["admin-borrowings", admin, /from\('borrowings'\)/],
    ["saqr-lesson-reports", saqr, /from\('lesson_reports'\)/],
  ];
  const present = paths.filter(([, src, regex]) => regex.test(src)).map(([name]) => name);
  assert.equal(present.length, paths.length, 'Review direct access paths before any RLS activation');
  console.log('RLS migration blockers (existing code, no changes applied):', present.join(', '));
});
