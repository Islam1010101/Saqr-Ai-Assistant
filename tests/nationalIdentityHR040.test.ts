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

// The route, navbar, orbit and interior activity page all honor this exception.
const app = readFileSync('App.tsx', 'utf8');
const home = readFileSync('pages/HomePage.tsx', 'utf8');
const orbit = readFileSync('src/components/SaqrOrbitNavigation.tsx', 'utf8');
const page = readFileSync('pages/NationalIdentityPage.tsx', 'utf8');
const tutorial = readFileSync('pages/TutorialPage.tsx', 'utf8');
assert.ok(app.includes('if (canAccessNationalIdentity(role, account))'),
  'Both identity routes share the role guard for HR040');
assert.ok(app.includes("link.path === '/saqr-national-identity' ? identityAllowed"),
  'Top navbar must filter the identity option by teacher ID');
assert.ok(app.includes('setIdentityAllowed(canAccessNationalIdentity(role, profile))'),
  'Navbar permission must use the signed-in profile, not only teacher role');
assert.ok(orbit.includes("item.key === 'identity' && isNationalIdentityTeacher(role, teacherId)"),
  'Only HR040 receives the additional homepage bubble');
assert.ok(home.includes('teacherId={userData?.teacher_id}'),
  'Homepage passes the school teacher ID to the orbit component');
assert.ok(page.includes('if (!canAccessNationalIdentity(role, user)) return'),
  'Identity page must not redirect HR040 after the outer route guard passes');
assert.ok(page.includes("role + ':' + normalizedId"),
  'Teacher challenge progress remains separated from student/admin progress');
assert.ok(tutorial.includes('tourMode'),
  'Public tutorial remains a role-independent visual preview');
assert.ok(orbit.includes("roles: ['student', 'admin']"),
  'Identity still belongs to students and admins by default');
console.log('PASS: Only teacher HR040 receives National Identity alongside every student/admin');
