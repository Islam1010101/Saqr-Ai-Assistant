import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import test from 'node:test';

const read=(f)=>readFileSync(f,'utf8');
const sql=read('supabase/migrations/20261116081000_efips_user_feature_overrides.sql');
const server=read('supabase/functions/efips-feature-access/index.ts');
const learning=read('supabase/functions/saqr-learning-access/index.ts');
const registry=read('src/utils/efipsFeatures.ts');
const app=read('App.tsx');
const orbit=read('src/components/SaqrOrbitNavigation.tsx');
const admin=read('pages/AdminDashboard.tsx');
const manage=read('src/components/AdminUserFeaturePermissions.tsx');
const student=read('src/components/StudentLibraryScheduleView.tsx');
const gate=read('src/components/SchoolFeatureRoute.tsx');
const identity=read('pages/NationalIdentityPage.tsx');

test('Twenty individual entitlements are backend allowlisted, not stored in editable user metadata',()=>{
  const ids=registry.split('\n').map(x=>/^    "id": "([^"]+)"/.exec(x)?.[1]).filter(Boolean);
  assert.equal(ids.length,20);
  assert.equal(new Set(ids).size,20);
  for(const id of ids) assert.ok(server.includes('"'+id+'"')||server.includes("'"+id+"'"),'Edge must recognize '+id);
  for(const id of ids) assert.ok(sql.includes("'"+id+"'"),'SQL checks backend whitelist '+id);
  assert.doesNotMatch(server,/raw_user_meta_data|\.user_metadata\b|localStorage\.|request\.role/);
  assert.match(server,/auth\.auth\.getUser\(token\)/);
  assert.match(server,/identity_data\?\.email_verified===true/);
  assert.match(server,/role!=="admin"/);
  assert.match(server,/TARGET_NOT_FOUND/);
  assert.match(server,/action==="my-access"/);
  assert.match(server,/action==="admin-get"/);
  assert.match(server,/action!=="admin-set"/);
  assert.match(server,/value===null\|\|typeof value==="boolean"/);
});

test('Feature overrides are private, RLS enabled, service-only, and cannot change account roles',()=>{
  assert.match(sql,/enable row level security/);
  assert.match(sql,/revoke all on public\.efips_user_feature_overrides from public, anon, authenticated/);
  assert.match(sql,/grant select,insert,update,delete on public\.efips_user_feature_overrides to service_role/);
  assert.doesNotMatch(sql,/create policy|disable row level security|alter table public\.students|alter table public\.teachers|alter table public\.library_schedule/i);
  assert.match(server,/efips_google_staff_accounts/);
  assert.match(server,/efips_account_access_controls/);
  assert.doesNotMatch(server,/update\(\{role|\.auth\.admin\./);
  assert.match(server,/parent grant enables its unmodified children/i);
});

test('Grant/revoke UI is per-user, bilingual and independent of edit role/disable actions',()=>{
  assert.match(admin,/AdminUserFeaturePermissions/);
  assert.match(manage,/email\}/);
  assert.match(manage,/action:'admin-set'/);
  assert.match(manage,/action:'admin-get'/);
  assert.match(manage,/value="inherit"/);
  assert.match(manage,/value="allow"/);
  assert.match(manage,/value="deny"/);
  assert.match(manage,/حسب الدور/);
  assert.match(manage,/لا يمكن منح خدمات إضافية/);
  assert.match(manage,/record.role==='teacher' && <option value="allow"/);
  assert.match(manage,/record\?\.role==='student'&&value==='allow'/);
  assert.match(admin,/handleAccountAccess\(item, 'role'/);
  assert.match(admin,/handleAccountAccess\(item, disabled \? 'enable' : 'disable'\)/);
});

test('All supported service routes reject denied users before mounting feature pages',()=>{
  const featureRoutes=[
   ['/saqr-national-identity','national_identity'],['/schedule','schedule'],
   ['/saqr-learning','saqr_learning'],['/saqr-challenges','challenges'],
   ['/saqr-reading-quest','reading_quest'],['/saqr-national-identity/anthem','voice_union'],
   ['/game','sort_library'],['/saqr-studio','saqr_studio'],['/podcast','podcast'],
   ['/smart-search','saqr_ai'],['/digital-library','digital_library'],['/creators','creators'],
  ];
  for(const [path,feature] of featureRoutes){
   const start=app.indexOf('path="'+path+'" element=');
   assert.ok(start!==-1,'missing route '+path);
   assert.ok(app.slice(start,start+260).includes('feature="'+feature+'"'),'not gated '+path);
  }
  assert.match(gate,/getSchoolFeatureAccess\(true\)/);
  assert.match(gate,/status==='denied'/);
  assert.match(gate,/<Navigate to="\/home" replace\/>/);
  assert.match(orbit,/schoolAccess\.features\[feature\]===true/);
  assert.match(app,/headerFeatures\[headerService\[link.path\]\]===true/);
  assert.match(identity,/granted\?\.features\.national_identity/);
  assert.match(learning,/featureRule\?\.allowed===false/);
  assert.match(learning,/featureRule\?\.allowed===true/);
});

test('Teachers can gain selected services, while students can only be denied or restored',()=>{
  assert.match(server,/profile.role==="teacher" && typeof choice==="boolean"/);
  assert.match(server,/profile.role==="student" && choice===false/);
  assert.match(server,/targetProfile.role==="student" && value===true/);
  assert.match(server,/STUDENT_ADDITIONAL_GRANTS_FORBIDDEN/);
  assert.match(server,/ADMIN_FEATURES_IMMUTABLE/);
  assert.match(manage,/record.role==='teacher' && <option value="allow"/);
  assert.match(manage,/value="inherit"/);
  assert.match(manage,/value="deny"/);
  assert.match(app,/access.role === 'student' \? <Navigate to="\/home" replace \/> : <SchedulePage \/>/);
  assert.doesNotMatch(app,/access.role === 'student' \? <StudentLibraryScheduleView/);
  assert.match(admin,/staffRoleDirectory\[email.toLowerCase\(\)\] !== 'admin'/);
});

test('No Saqr reasoning engine, provider, book catalog or legacy timetable file changed',()=>{
  const baseline='c6291969a73aefaec4b6388c5748678faef090c9';
  const immutable=['api/chat.ts','pages/SmartSearchPage.tsx','pages/SchedulePage.tsx','api/digitalBookData.ts','pages/game.tsx','pages/SaqrReadingQuestPage.tsx'];
  for(const path of immutable){
    const before=execFileSync('git',['show',baseline+':'+path],{encoding:'utf8'});
    assert.equal(read(path),before,'Protected original module changed: '+path);
  }
});
