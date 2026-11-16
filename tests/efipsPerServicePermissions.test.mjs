import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import test from 'node:test';

const read=p=>readFileSync(p,'utf8');
const baseline='351e42227e089b74317660e7819fd1b85131aedc';
const catalog=read('src/utils/schoolServiceAccess.ts');
const edge=read('supabase/functions/efips-feature-access/index.ts');
const sql=read('supabase/sql/efips_feature_permissions_20261116.sql');
const app=read('App.tsx');
const admin=read('pages/AdminDashboard.tsx');
const modal=read('src/components/admin/AdminFeaturePermissionsDialog.tsx');
const gate=read('src/components/auth/SchoolServiceGate.tsx');
const studentSchedule=read('src/components/SaqrStudentScheduleView.tsx');
const learning=read('supabase/functions/saqr-learning-access/index.ts');
const orbit=read('src/components/SaqrOrbitNavigation.tsx');
const keys=['catalog','digital_library','creators','national_identity','schedule','saqr_learning',
  'challenges','sort_library','studio','reading_quest','podcast'];

test('11 independent role-preserving service switches with tri-state permissions',()=>{
  for(const key of keys) {
    assert.match(catalog,new RegExp("key:'"+key+"'"),key+' missing in client catalog');
    assert.ok(edge.includes('"'+key+'"'),key+' missing in server allowlist');
    assert.ok(sql.includes("'"+key+"'"),key+' missing from constrained DB key list');
  }
  assert.match(modal,/\['default','allow','deny'\]/);
  assert.match(modal,/body:\{action,email,feature_key:key,mode\}/);
  assert.match(modal,/role="dialog" aria-modal="true"/);
  assert.match(admin,/AdminFeaturePermissionsDialog/);
  assert.match(admin,/setFeatureUser\(/);
  assert.match(admin,/handleAccountAccess\(/,'Original role-change controls remain');
  assert.doesNotMatch(modal,/update\(\{role|localStorage\.setItem\('user_type'|action: 'access'/);
});

test('Verified Google admin only changes service flags, RLS forbids browser writes',()=>{
  assert.match(edge,/auth\.auth\.getUser\(token\)/);
  assert.match(edge,/provider==="google"/);
  assert.match(edge,/email_verified===true/);
  assert.match(edge,/findRole\(targetEmail\)/);
  assert.match(edge,/if\(self\.role!=="admin"\)/);
  assert.match(edge,/action==="admin-read"/);
  assert.match(edge,/action==="admin-set"/);
  assert.match(edge,/action==="my-access"/);
  assert.match(edge,/action==="my-schedule"/);
  assert.match(edge,/role:"student"/);
  assert.match(sql,/enable row level security/);
  assert.match(sql,/revoke all on public\.efips_feature_permissions from public, anon, authenticated/);
  assert.match(sql,/grant select, insert, update, delete on public\.efips_feature_permissions to service_role/);
  assert.match(sql,/efips_feature_permissions_audit/);
  assert.doesNotMatch(edge,/update\(\{role|\.from\("efips_google_staff_accounts"\)\.update/);
  assert.doesNotMatch(catalog,/service_role|VITE_SUPABASE_SERVICE|SUPABASE_SECRET_KEY/);
});

test('All governed feature paths are guarded, admin dashboard is never grantable',()=>{
  const routes=[
    ['search','catalog'],['digital-library','digital_library'],
    ['digital-library/english/ielts','digital_library'],
    ['creators','creators'],['saqr-studio','studio'],
    ['saqr-reading-quest','reading_quest'],['saqr-challenges','challenges'],
    ['podcast','podcast'],['game','sort_library'],
    ['schedule','schedule'],['saqr-learning','saqr_learning']
  ];
  for(const [path,key] of routes){
    const line=app.split('\n').find(line=>line.includes('<Route path="/'+path+'"'));
    assert.ok(line?.includes('<SchoolServiceGate feature="'+key+'">'),'Missing route gate for '+path);
  }
  assert.match(app,/snapshot\.overrides\.national_identity===true/);
  assert.match(app,/if\(!snapshot\?\.features\.national_identity\)/);
  assert.match(app,/<ProtectedRoute><AdminDashboard \/><\/ProtectedRoute>/);
  assert.doesNotMatch(catalog,/key:'admin'|key:'admin_dashboard'/);
  assert.match(gate,/if\(!allowed\)return <Navigate to="\/home" replace\/>/);
  assert.match(orbit,/serviceAccess\?\.features\[feature\]!==true/);
  assert.match(orbit,/item\.roles\.includes\(role\)/);
  assert.match(orbit,/tourMode \? ITEMS/,'Tutorial presentation still retains original bubbles');
});

test('Student timetable is only a read-only projection and not booking authority',()=>{
  assert.match(gate,/feature==='schedule'&&role==='student'/);
  assert.match(studentSchedule,/action:'my-schedule'/);
  assert.match(edge,/if\(self\.role!=="student"\)/);
  assert.match(edge,/if\(!features\.schedule\)/);
  assert.match(edge,/mode:"view-only"/);
  assert.match(edge,/booked:Boolean\(row\.teacher\)/);
  assert.doesNotMatch(studentSchedule,/insert\(|update\(|delete\(|upsert\(|handleOpenModal|bookSlotText/);
  assert.doesNotMatch(edge,/return reply\(200,\{ok:true,slots,mode:"view-only",teacher:/);
});

test('Saqr Helps Me server authority preserves existing student entitlement and admin preview',()=>{
  assert.match(learning,/featureOverride\?\.enabled===false/);
  assert.match(learning,/teacher\?\.role==="teacher"/);
  assert.match(learning,/featureOverride\?\.enabled!==true/);
  assert.match(learning,/studentId=email\.split/);
  assert.match(learning,/saqr_learning_access/);
  assert.match(learning,/email==="islam\.ahmed@falcon-school\.com"/);
  assert.match(learning,/viewer:"teacher"/);
});

test('Core Saqr logic and server APIs never change from release baseline',()=>{
  const locked=[
    'pages/SmartSearchPage.tsx','api/chat.ts',
    'src/utils/ieltsSaqrPractice.ts','src/utils/saqrLearning.ts',
    'src/components/DigitalBookReader.tsx','src/components/IeltsListeningPractice.tsx',
    'src/data/ieltsListeningExpanded.ts','pages/SchedulePage.tsx',
    'supabase/functions/google-school-login/index.ts',
    'supabase/functions/admin-verified-library/index.ts'
  ];
  for(const path of locked){
    const previous=execFileSync('git',['show',baseline+':'+path],{encoding:'utf8'});
    assert.equal(read(path),previous,'Unrelated core file changed: '+path);
  }
});
