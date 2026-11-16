import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { canAccessNationalIdentity, isNationalIdentityTeacher } from '../src/utils/nationalIdentityAccess.ts';

// The sole teacher exception; never expand this to a role-wide permission.
for (const id of ['HR040', 'hr040', ' HR040 ']) {
  assert.equal(isNationalIdentityTeacher('teacher', id), true);
  assert.equal(canAccessNationalIdentity('teacher', { teacher_id: id }), true);
}
for (const id of ['HR039', 'HR041', 'HR400', 'HR004', '', null, undefined]) {
  assert.equal(isNationalIdentityTeacher('teacher', id), false);
  assert.equal(canAccessNationalIdentity('teacher', { teacher_id: id }), false);
}
assert.equal(canAccessNationalIdentity('teacher', { student_id: 'HR040' }), false);
assert.equal(canAccessNationalIdentity('student', { student_id: 'S0001' }), true);
assert.equal(canAccessNationalIdentity('admin', { teacher_id: 'HR001' }), true);
assert.equal(canAccessNationalIdentity('student', { teacher_id: 'HR040' }), false);
assert.equal(canAccessNationalIdentity('admin', { student_id: 'S0001' }), false);
assert.equal(canAccessNationalIdentity(null, { teacher_id: 'HR040' }), false);
assert.equal(canAccessNationalIdentity('teacher', null), false);

// HR040 remains the sole role-based teacher exception by default.
// Additional individual teachers can ONLY be granted through Google-verified admin-only feature overrides.
const app = readFileSync('App.tsx', 'utf8');
const home = readFileSync('pages/HomePage.tsx', 'utf8');
const orbit = readFileSync('src/components/SaqrOrbitNavigation.tsx', 'utf8');
const page = readFileSync('pages/NationalIdentityPage.tsx', 'utf8');
const tutorial = readFileSync('pages/TutorialPage.tsx', 'utf8');
assert.ok(app.includes('if (canAccessNationalIdentity(role, account))'), 'HR040 legacy route check is preserved');
assert.ok(app.includes('verified.features.national_identity'), 'Additional grants are verified by school Edge Functions');
assert.ok(app.includes('headerFeatures[headerService[link.path]]'), 'Header uses verified individual features');
assert.ok(orbit.includes('getSchoolFeatureAccess(true)'), 'Homepage orbit uses verified per-user grants');
assert.ok(home.includes('teacherId={userData?.teacher_id}'),
  'Homepage passes the school teacher ID to the orbit component');
assert.ok(page.includes('!canAccessNationalIdentity(role, user) && !granted?.features.national_identity'),
  'Teacher identity grant is accepted only after the server-verified route grants access');
assert.ok(page.includes("role + ':' + normalizedId"),
  'Teacher challenge progress remains separated from student/admin progress');
assert.ok(tutorial.includes('tourMode'),
  'Public tutorial remains a role-independent visual preview');
assert.ok(orbit.includes("roles: ['student', 'admin']"),
  'Identity still belongs to students and admins by default');
console.log('PASS: HR040 keeps baseline National Identity, additional teachers need individual server grants');
