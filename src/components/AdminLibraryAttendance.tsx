import React,{useEffect,useMemo,useState} from 'react';
import {supabase} from '../utils/supabase';
import {attendanceAuth,attendanceAdminSession,attendanceAdminSignIn,fetchCloudAttendance,markCloudAttendance,archiveCloudAttendance} from '../utils/adminAttendanceCloudClient';
import {printA4Html} from '../utils/printA4Html';
import {AttendanceRow,AttendanceMark,DAYS_AR,DAYS_EN,attendanceStorageKey,parseAttendanceStorage,generateAttendanceRows,markAttendance,attendanceSummary,teacherAttendanceTotals,startOfWeek,shiftWeek,weekDayISO,localISODate,ScheduleSlot,isWeekArchived,archivePastAttendanceWeek,canArchiveWeek} from '../utils/adminLibraryAttendance';
const esc=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
const CalendarIcon=()=> <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 2v5M16 2v5M3 10h18"/></svg>;
const AdminLibraryAttendance:React.FC<{locale:string;adminId:string}>=({locale,adminId})=>{
 const ar=locale==='ar',today=localISODate(new Date());
 const [monday,setMonday]=useState(()=>startOfWeek(new Date()));
 const [selectedDay,setSelectedDay]=useState(()=>Math.min((new Date().getDay()+6)%7,4));
 const [slots,setSlots]=useState<ScheduleSlot[]>([]);
 const [rows,setRows]=useState<AttendanceRow[]>([]);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [pdfOpened,setPdfOpened]=useState(false);
 const [confirmSaved,setConfirmSaved]=useState(false);
 const [archived,setArchived]=useState(false);
 const [verified,setVerified]=useState(false);
 const [checkingAdmin,setCheckingAdmin]=useState(true);
 const [adminEmail,setAdminEmail]=useState('');
 const [adminNotice,setAdminNotice]=useState('');
 const [savingMark,setSavingMark]=useState(false);
 useEffect(()=>{
   let alive=true;
   const check=async()=>{
     const session=await attendanceAdminSession();
     if(alive){setVerified(!!session);setCheckingAdmin(false);}
   };
   void check();
   const {data:{subscription}}=attendanceAuth.auth.onAuthStateChange(()=>{void check();});
   return ()=>{alive=false;subscription.unsubscribe();};
 },[]);
 const requestAdminAccess=async()=>{
   setAdminNotice('');
   try{await attendanceAdminSignIn(adminEmail.trim());setAdminNotice(ar?'راجع بريدك المدرسي لفتح رابط التحقق.':'Check your school email for your sign-in link.');}
   catch(e){setAdminNotice(e instanceof Error?e.message:String(e));}
 };
 const load=async()=>{
   setLoading(true);setError('');
   const result=await supabase.from('library_schedule').select('id,teacher,subject,grade,user_id');
   if(result.error)setError(result.error.message);else setSlots((result.data||[]) as ScheduleSlot[]);
   setLoading(false);
 };
 useEffect(()=>{void load();},[]);
 useEffect(()=>{
   let active=true;
   if(!verified){setRows([]);return ()=>{active=false;};}
   setError('');setPdfOpened(false);setConfirmSaved(false);
   const fetchWeek=async()=>{
    try{
     const result=await fetchCloudAttendance(monday);
     if(!active)return;
     setArchived(!!result.archived);
     const saved=(result.rows||[]).map((r:any)=>{
       const date=String(r.session_date),day=(new Date(date+'T12:00:00').getDay()+6)%7;
       const period=Number(String(r.slot_id).match(/_([1-8])$/)?.[1]||0);
       return {key:date+'|'+day+'|'+period,date,weekday:day,period,slotId:String(r.slot_id),
         teacher:String(r.teacher_name||''),grade:String(r.grade||''),subject:String(r.subject||''),
         userId:String(r.teacher_id||''),mark:r.status,reviewedAt:r.recorded_at} as AttendanceRow;
     });
     setRows(result.archived?[]:generateAttendanceRows(monday,slots,saved));
    }catch(e){if(active){setError(e instanceof Error?e.message:String(e));setRows([]);}}
   };
   void fetchWeek();
   return ()=>{active=false;};
 },[monday,slots,verified]);
 const setMark=async(id:string,mark:AttendanceMark)=>{
   const selected=rows.find(r=>r.key===id);
   if(!selected||!verified||savingMark)return;
   setSavingMark(true);
   try{
     await markCloudAttendance(monday,selected,mark);
     setRows(existing=>markAttendance(existing,id,mark));
     setError('');
   }catch(e){setError(e instanceof Error?e.message:String(e));}
   finally{setSavingMark(false);}
 };
 const totals=useMemo(()=>attendanceSummary(rows),[rows]);
 const teachers=useMemo(()=>teacherAttendanceTotals(rows),[rows]);
 const print=()=>{
   const labels=ar?['محجوزة','حضر','لم يحضر','غير مسجلة']:['Booked','Attended','Absent','Unmarked'];
   const metrics=[totals.booked,totals.attended,totals.absent,totals.unmarked].map((n,i)=>'<div class="metric"><b>'+n+'</b><small>'+labels[i]+'</small></div>').join('');
   const rowHtml=rows.map(x=>'<tr>'+[x.date,x.period,x.teacher,x.grade,x.subject,x.mark==='attended'?(ar?'حضر':'Attended'):x.mark==='absent'?(ar?'لم يحضر':'Absent'):(ar?'غير مسجل':'Unmarked')].map(y=>'<td>'+esc(y)+'</td>').join('')+'</tr>').join('');
   const teacherHtml=teachers.map(x=>'<tr>'+[x.teacher,x.attended,x.absent,x.unmarked].map(y=>'<td>'+esc(y)+'</td>').join('')+'</tr>').join('');
   const th=(cells:string[])=>'<tr>'+cells.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr>';
   const doc='<html lang="'+locale+'" dir="'+(ar?'rtl':'ltr')+'"><head><meta charset="UTF-8"/><title>EFIPS Weekly Library Attendance</title><style>@page{size:A4;margin:12mm}body{font:11px Cairo,Tahoma,Arial,sans-serif;line-height:1.65;color:#17343b}h1,h2{color:#06786d}.metrics{display:flex;gap:8px;margin:15px 0}.metric{flex:1;background:#effaf6;border:1px solid #bbdbd0;padding:12px;text-align:center}.metric b{display:block;font-size:22px}.metric small{display:block}table{border-collapse:collapse;width:100%}th,td{border:1px solid #cbd5e1;padding:7px;text-align:start}th{background:#dff3eb}tr{break-inside:avoid}thead{display:table-header-group} .letterhead{display:flex;align-items:center;gap:16px;border-bottom:3px solid #08766a;padding:0 0 14px;margin-bottom:14px}.letterhead img{width:76px;height:76px;object-fit:contain}.letterhead .school{font-size:15px;font-weight:900;color:#096457}.letterhead p{margin:2px 0}.signatures{display:flex;justify-content:space-between;margin-top:30px;gap:20px}.signature{min-width:180px;border-top:1px solid #94a3b8;text-align:center;padding-top:8px}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body><div class="letterhead"><img src="/school-logo.png" alt="EFIPS School Logo"/><div><div class="school">مدرسة صقر الإمارات الدولية الخاصة</div><div>Emirates Falcon International Private School</div><p>Library Department | قسم المكتبة</p></div></div><h1>'+(ar?'تقرير إشغال المكتبة الأسبوعي':'Weekly Library Occupancy Report')+'</h1><p><strong>'+(ar?'الفترة: من الاثنين':'Period: Monday')+' '+esc(monday)+' '+(ar?'إلى الجمعة':'through Friday')+' '+esc(weekDayISO(monday,4))+'</strong></p><div class="metrics">'+metrics+'</div><h2>'+(ar?'تفاصيل الحصص':'Booked periods')+'</h2><table><thead>'+th(ar?['التاريخ','الحصة','المعلم','الصف','المادة','الحالة']:['Date','Period','Teacher','Grade','Subject','Status'])+'</thead><tbody>'+rowHtml+'</tbody></table><h2>'+(ar?'المعلمون':'Teachers')+'</h2><table><thead>'+th(ar?['المعلم','حضر','لم يحضر','غير مسجل']:['Teacher','Attended','Absent','Unmarked'])+'</thead><tbody>'+teacherHtml+'</tbody></table><p>'+(ar?'غير المسجل لا يُحسب غيابًا. بيانات الحضور محفوظة على Supabase، والحجوزات أسبوعية متكررة.':'Unmarked is not an absence. Attendance is stored in Supabase; schedule bookings recur weekly.')+'</p><div class="signatures"><div class="signature">'+(ar?'أمين المكتبة':'Librarian')+'</div><div class="signature">'+(ar?'اعتماد الإدارة':'Administration Approval')+'</div></div></body></html>';
   void printA4Html(doc).then(()=>setPdfOpened(true)).catch(e=>setError(String(e)));
 };
 const cleanup=async()=>{
   if(!verified||!confirmSaved||!pdfOpened||!canArchiveWeek(monday,new Date()))return;
   const ok=window.confirm(ar?'هل تؤكد حفظ التقرير PDF؟ سيتم حذف بيانات حضور هذا الأسبوع من جميع الأجهزة.':'Confirm the PDF is saved. This will remove attendance records for this week on all devices.');
   if(!ok)return;
   try{
     await archiveCloudAttendance(monday);
     setArchived(true);setRows([]);setPdfOpened(false);setConfirmSaved(false);setError('');
     setMonday(shiftWeek(monday,1));
   }catch(e){setError(e instanceof Error?e.message:String(e));}
 };
 const dayStats=DAYS_AR.map((d,i)=>attendanceSummary(rows.filter(r=>r.weekday===i)));
 if(checkingAdmin)return <section className="lg:col-span-4 p-5 rounded-2xl border dark:border-slate-700">{ar?'التحقق من صلاحية إدارة الحضور...':'Checking attendance admin authorization...'}</section>;
 if(!verified)return <section className="lg:col-span-4 p-5 rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
   <h2 className="text-lg font-bold">{ar?'التحقق الآمن لإدارة الحضور':'Secure attendance verification'}</h2>
   <p className="text-sm">{ar?'حضور المعلمين محفوظ مركزيًا، ويتطلب تحققًا إضافيًا للأدمن دون تغيير تسجيل دخول المعلمين.':'Attendance is centralized and needs a separate administrator verification without altering teacher login.'}</p>
   <div className="flex flex-wrap gap-2">
    <input className="border dark:border-slate-600 p-2 rounded-lg bg-transparent" type="email" value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} placeholder={ar?'البريد المدرسي المعتمد':'Approved school email'} />
    <button className="bg-emerald-700 text-white px-4 py-2 rounded-lg" type="button" onClick={()=>void requestAdminAccess()}>{ar?'إرسال رابط التحقق':'Send verification link'}</button>
   </div>{adminNotice&&<p role="status" className="text-sm">{adminNotice}</p>}
 </section>;
 return <section className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 md:p-6 shadow-sm space-y-5">
  <div className="flex flex-wrap gap-4 items-center justify-between"><div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400"><CalendarIcon/><div><h2 className="text-xl font-black">{ar?'إشغال المكتبة وحضور المعلمين':'Library Occupancy and Teacher Attendance'}</h2><p className="text-slate-500 dark:text-slate-400 text-xs">{ar?'الحجوزات اليومية وملخص الأسبوع':'Daily bookings and weekly summary'}</p></div></div>
   <div className="flex flex-wrap gap-2 items-center"><button className="border dark:border-slate-600 p-2 rounded-xl" onClick={()=>setMonday(s=>shiftWeek(s,-1))}>‹</button><strong className="text-xs tabular-nums">{monday} — {weekDayISO(monday,4)}</strong><button className="border dark:border-slate-600 p-2 rounded-xl" onClick={()=>setMonday(s=>shiftWeek(s,1))}>›</button><button className="border dark:border-slate-600 p-2 rounded-xl" onClick={()=>void load()}>{ar?'تحديث':'Refresh'}</button><button className="bg-emerald-700 text-white p-2 rounded-xl" onClick={print}>{ar?'طباعة التقرير الأسبوعي PDF':'Print weekly PDF'}</button></div></div>
  <p className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs p-3">{ar?'الحضور محفوظ بشكل آمن في Supabase ويمكن مراجعته من أي جهاز بعد التحقق من صلاحية الأدمن. الحصة غير المؤشرة ليست غيابًا. تأكد من بيانات الأسابيع السابقة لأن الحجز الأصلي يتكرر أسبوعيًا.':'Attendance is securely stored in Supabase across devices after administrator verification. Unmarked does not count as absent. Recurring bookings are not historical booking snapshots.'}</p>
  {pdfOpened && !archived && canArchiveWeek(monday,new Date()) && <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-wrap gap-3 items-center"><label className="text-sm font-bold flex items-center gap-2"><input type="checkbox" checked={confirmSaved} onChange={e=>setConfirmSaved(e.target.checked)}/>{ar?'أؤكد أنني حفظت تقرير الأسبوع PDF على جهازي':'I confirm the weekly PDF is saved on my device'}</label><button type="button" disabled={!confirmSaved} onClick={cleanup} className="px-3 py-2 rounded-lg bg-rose-700 text-white disabled:opacity-50">{ar?'حذف سجل الأسبوع السابق بعد الحفظ':'Clear last week after saving'}</button></div>}
  {archived && <p className="text-sm border border-emerald-300 rounded-xl p-3">{ar?'تم إخلاء سجل حضور الأسبوع من قاعدة البيانات. لن يُنشأ سجل جديد لنفس الأسبوع.':'Attendance records for this week were cleared centrally and will not be regenerated.'}</p>}
  {error&&<p role="alert" className="text-rose-600 text-sm">{error}</p>}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[{n:totals.booked,label:ar?'المحجوزة':'Booked',color:'text-sky-600'},{n:totals.attended,label:ar?'حضر':'Attended',color:'text-emerald-600'},{n:totals.absent,label:ar?'لم يحضر':'Absent',color:'text-rose-600'},{n:totals.unmarked,label:ar?'غير مسجل':'Unmarked',color:'text-amber-600'}].map(x=><div key={x.label} className="rounded-2xl border dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800"><p className="text-xs text-slate-500 dark:text-slate-300">{x.label}</p><strong className={'text-3xl font-black tabular-nums '+x.color}>{x.n}</strong></div>)}</div>
  <div className="grid md:grid-cols-5 gap-4"><div className="md:col-span-3 rounded-2xl border dark:border-slate-700 p-4"><h3 className="font-bold">{ar?'إحصائيات الأيام':'Daily attendance chart'}</h3><div className="grid grid-cols-5 gap-2 mt-3">{dayStats.map((x,i)=><div key={i} className="text-center"><div className="flex items-end justify-center gap-1 h-32"><div className="w-4 bg-emerald-500 rounded-t" style={{height:x.attended*12}}/><div className="w-4 bg-rose-500 rounded-t" style={{height:x.absent*12}}/><div className="w-4 bg-amber-400 rounded-t" style={{height:x.unmarked*12}}/></div><span className="text-[10px] font-bold">{ar?DAYS_AR[i]:DAYS_EN[i]}</span></div>)}</div><p className="text-xs text-slate-500 mt-3">{ar?'أخضر: حضر · أحمر: غاب · أصفر: غير مسجل':'Green: Attended · Red: Absent · Amber: Unmarked'}</p></div><div className="md:col-span-2 rounded-2xl border dark:border-slate-700 flex flex-col justify-center items-center p-4"><svg viewBox="0 0 140 140" width="155" height="155" role="img" aria-label={ar?'نسبة تسجيل الحضور':'Review rate'}><circle cx="70" cy="70" r="53" fill="none" stroke="#cbd5e1" strokeWidth="12"/><circle cx="70" cy="70" r="53" fill="none" stroke="#059669" strokeWidth="12" strokeDasharray={(totals.completion*3.33)+' 333'} transform="rotate(-90 70 70)"/><text x="70" y="78" textAnchor="middle" fill="currentColor" fontSize="26" fontWeight="bold">{totals.completion}%</text></svg><strong className="text-sm">{ar?'نسبة مراجعة الحصص':'Attendance reviews completed'}</strong></div></div>
  <div className="flex flex-wrap gap-2">{DAYS_AR.map((day,i)=><button key={day} className={'border dark:border-slate-600 rounded-xl px-3 py-2 text-sm font-bold '+(selectedDay===i?'bg-emerald-700 text-white':'')} aria-pressed={selectedDay===i} onClick={()=>setSelectedDay(i)}>{ar?day:DAYS_EN[i]}</button>)}</div>
  <div className="overflow-x-auto border dark:border-slate-700 rounded-2xl"><table className="min-w-[720px] w-full text-sm"><thead className="bg-slate-50 dark:bg-slate-800"><tr>{(ar?['الحصة','اسم المعلم','الصف','المادة','التاريخ','تسجيل الحضور']:['Period','Teacher','Grade','Subject','Date','Attendance']).map(x=><th key={x} className="p-3 text-start">{x}</th>)}</tr></thead><tbody>{rows.filter(x=>x.weekday===selectedDay).map(x=><tr key={x.key} className="border-t dark:border-slate-700"><td className="p-3 font-black">{x.period}</td><td className="p-3">{x.teacher}</td><td className="p-3">{x.grade}</td><td className="p-3">{x.subject}</td><td className="p-3">{x.date}</td><td className="p-3"><div className="flex gap-1"><button disabled={savingMark||x.date>today} aria-pressed={x.mark==='attended'} onClick={()=>setMark(x.key,'attended')} className={'border rounded-lg px-2 py-1 '+(x.mark==='attended'?'bg-emerald-600 text-white':'dark:border-slate-600')}>{ar?'حضر':'Attended'}</button><button disabled={x.date>today} aria-pressed={x.mark==='absent'} onClick={()=>setMark(x.key,'absent')} className={'border rounded-lg px-2 py-1 '+(x.mark==='absent'?'bg-rose-600 text-white':'dark:border-slate-600')}>{ar?'لم يحضر':'Absent'}</button><button onClick={()=>setMark(x.key,'unmarked')} className="border dark:border-slate-600 rounded-lg px-2 py-1">{ar?'إلغاء':'Clear'}</button></div></td></tr>)}{!rows.some(x=>x.weekday===selectedDay)&&<tr><td className="text-center p-7 text-slate-500" colSpan={6}>{loading?(ar?'جار التحميل':'Loading'):(ar?'لا توجد حجوزات لهذا اليوم':'No bookings this day')}</td></tr>}</tbody></table></div>
  <div className="rounded-2xl border dark:border-slate-700 p-4"><h3 className="font-black mb-3">{ar?'ملخص المعلمين':'Teacher summary'}</h3><div className="grid md:grid-cols-3 gap-2">{teachers.map((t,i)=><div key={i} className="rounded-xl border dark:border-slate-700 p-3 text-sm"><strong>{t.teacher}</strong><p className="mt-1"><span className="text-emerald-600">{ar?'حضر':'Attended'}: {t.attended}</span> · <span className="text-rose-600">{ar?'لم يحضر':'Absent'}: {t.absent}</span> · {ar?'غير مسجل':'Unmarked'}: {t.unmarked}</p></div>)}</div></div>
 </section>;
};
export default AdminLibraryAttendance;