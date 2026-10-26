/** EFIPS admin attendance registry, local to this browser until school-admin
 * authentication and protected database policies are in place.
 *
 * library_schedule is a recurring day/period template, not an occurrence log.
 * Never infer "absent" from an unchecked future/past booking.
 */
export type AttendanceMark = 'attended' | 'absent' | 'unmarked';
export type ScheduleSlot = {
  id: string; teacher: string; grade: string; subject: string; user_id?: string;
};
export type AttendanceRow = {
  key: string; date: string; weekday: number; period: number; slotId: string;
  teacher: string; grade: string; subject: string; userId: string;
  mark: AttendanceMark; reviewedAt?: string;
};
export const DAYS_AR = ['الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
export const DAYS_EN = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const DAY_NAMES: Record<string,number> = {
  'الاثنين':0,'الإثنين':0,'monday':0,
  'الثلاثاء':1,'tuesday':1,'الاربعاء':2,'الأربعاء':2,'wednesday':2,
  'الخميس':3,'thursday':3,'الجمعة':4,'friday':4
};
const oneDay = 86400000;
const pad=(n:number)=>String(n).padStart(2,'0');
export const localISODate=(d:Date)=>[d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate())].join('-');
export const startOfWeek=(date:Date):string=>{
  const local=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);
  local.setDate(local.getDate()-(local.getDay()+6)%7);
  return localISODate(local);
};
export const shiftWeek=(iso:string,weeks:number):string=>{
  const d=new Date(iso+'T12:00:00');
  d.setDate(d.getDate()+7*weeks);
  return localISODate(d);
};
export const weekDayISO=(monday:string,day:number):string=>{
  const d=new Date(monday+'T12:00:00');
  d.setDate(d.getDate()+day);
  return localISODate(d);
};
const parseSlotId=(id:string):{weekday:number;period:number}|null=>{
  const match=/^(.+)_([1-8])$/.exec(id);
  if(!match)return null;
  const normalized=match[1].trim().replace(/[\u064b-\u065f\u0670]/g,'').toLowerCase();
  const weekday=DAY_NAMES[normalized];
  const period=Number(match[2]);
  if(weekday===undefined || (weekday===4 && period>4))return null;
  return {weekday,period};
};
export const attendanceStorageKey=(adminId:string,monday:string)=>
  'efips-admin-library-attendance-v1:'+encodeURIComponent(adminId)+':'+monday;
export const parseAttendanceStorage=(text:string|null):AttendanceRow[]=>{
  if(!text)return [];
  try{
    const rows:unknown=JSON.parse(text);
    if(!Array.isArray(rows))return [];
    return rows.filter((row:any)=>row&&typeof row.key==='string'&&
       /^\d{4}-\d{2}-\d{2}$/.test(row.date)&&
       ['attended','absent','unmarked'].includes(row.mark)&&
       typeof row.teacher==='string'&&typeof row.slotId==='string')
      .slice(0,150).map((r:any)=>({
        key:r.key,date:r.date,weekday:Number(r.weekday),period:Number(r.period),
        slotId:r.slotId,teacher:r.teacher,grade:String(r.grade||''),subject:String(r.subject||''),
        userId:String(r.userId||''),mark:r.mark,reviewedAt:r.reviewedAt
      }));
  }catch{return [];}
};
export const generateAttendanceRows=(monday:string,slots:ScheduleSlot[],saved:AttendanceRow[]):AttendanceRow[]=>{
  const byKey=new Map(saved.map(x=>[x.key,x]));
  const seen=new Set<string>();
  for(const slot of slots){
    if(!slot.teacher?.trim())continue;
    const parsed=parseSlotId(slot.id);
    if(!parsed)continue;
    const date=weekDayISO(monday,parsed.weekday);
    // Stable per-occurrence key. Changes in the recurring teacher/subject after
    // marking never silently rewrite historical attendance.
    const key=date+'|'+parsed.weekday+'|'+parsed.period;
    if(seen.has(key))continue;
    seen.add(key);
    if(byKey.has(key))continue;
    byKey.set(key,{
      key,date,weekday:parsed.weekday,period:parsed.period,slotId:slot.id,
      teacher:slot.teacher,grade:slot.grade||'',subject:slot.subject||'',
      userId:slot.user_id||'',mark:'unmarked'
    });
  }
  return [...byKey.values()].sort((a,b)=>a.date.localeCompare(b.date)||a.period-b.period);
};
export const markAttendance=(rows:AttendanceRow[],key:string,mark:AttendanceMark,now=new Date()):AttendanceRow[] =>
  rows.map(row=>row.key===key?{...row,mark,reviewedAt:mark==='unmarked'?undefined:now.toISOString()}:row);
export const attendanceSummary=(rows:AttendanceRow[])=>{
  const attended=rows.filter(r=>r.mark==='attended').length;
  const absent=rows.filter(r=>r.mark==='absent').length;
  const unmarked=rows.filter(r=>r.mark==='unmarked').length;
  return {booked:rows.length,attended,absent,unmarked,reviewed:attended+absent,
    completion:rows.length?Math.round((attended+absent)/rows.length*100):0};
};
export const teacherAttendanceTotals=(rows:AttendanceRow[])=>{
  const result=new Map<string,{teacher:string;attended:number;absent:number;unmarked:number}>();
  for(const row of rows){
    const key=(row.userId||row.teacher).trim().toLowerCase();
    const previous=result.get(key)||{teacher:row.teacher,attended:0,absent:0,unmarked:0};
    previous[row.mark]+=1;
    result.set(key,previous);
  }
  return [...result.values()].sort((a,b)=>b.attended+b.absent-a.attended-a.absent||a.teacher.localeCompare(b.teacher));
};
