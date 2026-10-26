import assert from 'node:assert/strict';
import {startOfWeek,weekDayISO,generateAttendanceRows,attendanceSummary,teacherAttendanceTotals,markAttendance,parseAttendanceStorage,attendanceStorageKey} from '../src/utils/adminLibraryAttendance.ts';
assert.equal(startOfWeek(new Date('2026-10-26T12:00:00')),'2026-10-26');
assert.equal(weekDayISO('2026-10-26',4),'2026-10-30');
const slots=[
 {id:'الإثنين_2',teacher:'Teacher A',grade:'5B',subject:'Arabic',user_id:'TC1'},
 {id:'الخميس_3',teacher:'Teacher B',grade:'9A',subject:'Physics',user_id:'TC2'},
 {id:'الجمعة_6',teacher:'Teacher C',grade:'4A',subject:'Art'},
 {id:'الإثنين_4',teacher:'',grade:'',subject:''}
];
const rows=generateAttendanceRows('2026-10-26',slots,[]);
assert.equal(rows.length,2);
assert.equal(attendanceSummary(rows).unmarked,2);
const attended=markAttendance(rows,rows[0].key,'attended');
const reviewed=markAttendance(attended,rows[1].key,'absent');
assert.deepEqual([attendanceSummary(reviewed).attended,attendanceSummary(reviewed).absent],[1,1]);
assert.equal(teacherAttendanceTotals(reviewed).reduce((sum,x)=>sum+x.attended+x.absent,0),2);
assert.equal(generateAttendanceRows('2026-10-26',[{...slots[0],teacher:'Changed'}],reviewed)[0].teacher,'Teacher A');
assert.equal(parseAttendanceStorage('broken').length,0);
assert.equal(parseAttendanceStorage(JSON.stringify(reviewed)).length,2);
assert.ok(attendanceStorageKey('Admin','2026-10-26').includes('2026-10-26'));
console.log('PASS admin weekly attendance, dates, statuses and snapshots');
