import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getTeacherLibrarySlots, type TeacherLibrarySlot } from '../src/utils/teacherLibrarySchedule.ts';

const teacher = 'HR045';
const rows: TeacherLibrarySlot[] = [
  {id:'الخميس_8',user_id:'HR045',teacher:'Name A',subject:'Science',grade:'7A'},
  {id:'Monday_3',user_id:'HR045',teacher:'Name A',subject:'English',grade:'9B'},
  {id:'الثلاثاء_1',user_id:'HR045',teacher:'Name A',subject:'Arabic',grade:'5C'},
  {id:'Wednesday_5',user_id:'HR999',teacher:'Name A',subject:'History',grade:'10'},
  {id:'Friday_1',user_id:null,teacher:'Name A',subject:'Art',grade:'8'},
  {id:'Monday_4',user_id:'HR045',teacher:'Name A',subject:'Math',grade:'9A'},
  {id:'Monday_12',user_id:'HR045',teacher:'Name A',subject:'Invalid',grade:'8'},
  {id:'invalid',user_id:'HR045',teacher:'Name A',subject:'Invalid',grade:'8'},
];
assert.deepEqual(getTeacherLibrarySlots(rows,teacher).map(s=>s.id),
  ['Monday_3','Monday_4','الثلاثاء_1','الخميس_8']);
assert.equal(getTeacherLibrarySlots(rows,'HR999').length,1);
assert.deepEqual(getTeacherLibrarySlots(rows,'HR111'),[],
  'Teacher with no selected periods should receive no cards');
assert.deepEqual(getTeacherLibrarySlots(rows,null),[],
  'Absent teacher identity must never show someone else’s slots');
assert.deepEqual(getTeacherLibrarySlots(rows,'HR046'),[],
  'Matching display name without matching teacher ID must not display slots');
assert.deepEqual(getTeacherLibrarySlots([],teacher),[]);
assert.deepEqual(getTeacherLibrarySlots(rows,' hr045 ').map(s=>s.id),
  ['Monday_3','Monday_4','الثلاثاء_1','الخميس_8']);
const homepage=readFileSync('pages/HomePage.tsx','utf8');
const schedule=readFileSync('pages/SchedulePage.tsx','utf8');
assert.ok(homepage.includes("const canSeeOwnLibrarySchedule = userType === 'teacher' || userType === 'admin'") &&
  homepage.includes("canSeeOwnLibrarySchedule && teacherSchedule.length > 0") &&
  homepage.includes("if (!canSeeOwnLibrarySchedule || !teacherId)"),
  'Only teacher and admin accounts with their own saved bookings display schedule cards');
assert.ok(homepage.includes(".from('library_schedule')") && homepage.includes(".eq('user_id', teacherId)"),
  'Homepage reads only selected teacher slots from the shared booking table');
assert.ok(homepage.includes('getTeacherLibrarySlots('));
const catalog = readFileSync('pages/SearchPage.tsx','utf8');
assert.ok(catalog.includes("if (userType !== 'student' && userType !== 'teacher' && userType !== 'admin')"),
  'Only student, teacher, and admin accounts may request borrowings');
assert.ok(catalog.includes("const userId = userType === 'student' ? currentUser.student_id : currentUser.teacher_id;"),
  'Staff borrowing continues to use the existing school teacher ID');
assert.ok(homepage.includes("table: 'library_schedule'"),
  'Schedule should respond to booking/deletion updates');
assert.ok(homepage.includes("window.addEventListener('focus', onFocus)"));
assert.ok(homepage.includes("window.setInterval(() => { void fetchTeacherSchedule(); }, 60000)"));
assert.ok(homepage.includes('{borrowedBooks.length > 0 && ('),
  'Borrowings notifications remain independently visible');
assert.ok(!homepage.includes('borrowedBooks.length > 0 || teacherSchedule.length > 0'),
  'Do not show an empty alerts section for schedules');
assert.ok(schedule.includes(".from('library_schedule').upsert(slotData)"),
  'Original booking flow preserved');
assert.ok(schedule.includes(".from('library_schedule').delete().eq('id', key)"),
  'Original deletion flow preserved');
console.log('PASS teacher schedule filter, owner isolation, bilingual sorting, conditional visibility and updates');
