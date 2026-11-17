import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabase';
import { printA4Html } from '../utils/printA4Html';

type Row = Record<string, any>;
type Props = { isAr: boolean; students: Row[]; teachers: Row[]; logs: Row[]; loans: Row[]; lessons: Row[] };
type Period = 'month' | 'quarter' | 'custom';
const iso = (d: Date) => [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const today = iso(new Date());
const escapeHtml = (v: unknown) => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
const datePart = (v: unknown) => String(v ?? '').slice(0,10);
const within = (v: unknown, start: string, end: string) => !!v && datePart(v)>=start && datePart(v)<=end;
const status = (v: unknown) => String(v ?? '').trim().toLowerCase().replace(/[\s-]+/g,'_');
const accepted = new Set(['active','approved','confirmed','borrowed','checked_out','checkedout','returned','completed','معار','مستعار','مرتجع','تم_الإرجاع','تم_الارجاع']);
function loanRole(r: Row, studentIds: Set<string>, teacherIds: Set<string>) {
  const role = String(r.user_type || '').toLowerCase();
  if(role==='student'||role==='teacher') return role;
  if(r.teacher_id||r.teacher_code) return 'teacher';
  if(r.student_id||r.student_code) return 'student';
  const id = String(r.user_id||r.borrower_id||'').toLowerCase();
  if(studentIds.has(id)) return 'student';
  if(teacherIds.has(id)) return 'teacher';
  return 'unknown';
}
export default function AdminPeriodReports({isAr,students,teachers,logs,loans,lessons}:Props) {
  const current = new Date();
  const [period,setPeriod] = useState<Period>('month');
  const [month,setMonth] = useState(iso(current).slice(0,7));
  const [quarterYear,setQuarterYear] = useState(current.getFullYear());
  const [quarter,setQuarter] = useState(Math.floor(current.getMonth()/3)+1);
  const [customStart,setCustomStart] = useState(iso(new Date(current.getFullYear(),current.getMonth(),1)));
  const [customEnd,setCustomEnd] = useState(today);
  const [views,setViews] = useState<Row[]>([]);
  const [viewState,setViewState] = useState<'loading'|'ready'|'error'|'partial'>('loading');
  const [errorMessage,setErrorMessage] = useState('');
  const l=(ar:string,en:string)=>isAr?ar:en;
  const range = useMemo(()=>{
    if(period==='custom') return {start:customStart,end:customEnd};
    if(period==='month') {
      const [y,m]=month.split('-').map(Number);
      return {start:iso(new Date(y,m-1,1)),end:iso(new Date(y,m,0))};
    }
    const m=(quarter-1)*3;
    return {start:iso(new Date(quarterYear,m,1)),end:iso(new Date(quarterYear,m+3,0))};
  },[period,month,quarterYear,quarter,customStart,customEnd]);
  const validRange = range.start<=range.end;
  useEffect(()=>{
    if(!validRange) {setViews([]);setViewState('error');setErrorMessage(l('تاريخ البداية بعد النهاية','Start date is after end date'));return;}
    let cancelled=false;
    const load=async()=>{
      setViewState('loading');setErrorMessage('');
      const collected: Row[]=[];
      const pageSize=1000;
      for(let offset=0;offset<20000;offset+=pageSize) {
        const {data,error}=await supabase.from('book_views').select('book_title,language,viewed_at').gte('viewed_at',range.start+'T00:00:00').lt('viewed_at',iso(new Date(new Date(range.end+'T00:00:00').getTime()+86400000))+'T00:00:00').order('viewed_at',{ascending:true}).range(offset,offset+pageSize-1);
        if(cancelled)return;
        if(error){setViews([]);setViewState('error');setErrorMessage(error.message);return;}
        collected.push(...(data||[]));
        if((data||[]).length<pageSize){setViews(collected);setViewState('ready');return;}
      }
      if(!cancelled){setViews(collected);setViewState('partial');}
    };
    void load();
    return ()=>{cancelled=true;};
  },[range.start,range.end,validRange]);
  const metrics=useMemo(()=>{
    const studentIds=new Set(students.map(x=>String(x.student_id||x.id||'').toLowerCase()));
    const teacherIds=new Set(teachers.map(x=>String(x.teacher_id||x.id||'').toLowerCase()));
    const periodLogs=logs.filter(x=>within(x.login_time,range.start,range.end));
    const periodLessons=lessons.filter(x=>within(x.created_at,range.start,range.end));
    const periodLoans=loans.filter(x=>within(x.borrow_date||x.created_at||x.requested_at,range.start,range.end)&&accepted.has(status(x.status)));
    const loanStudent=periodLoans.filter(x=>loanRole(x,studentIds,teacherIds)==='student');
    const loanTeacher=periodLoans.filter(x=>loanRole(x,studentIds,teacherIds)==='teacher');
    const unique=(rows:Row[],field:string)=>new Set(rows.map(x=>String(x[field]||'').toLowerCase()).filter(Boolean)).size;
    return {
      studentCount:students.length,teacherCount:teachers.length,
      studentVisits:periodLogs.filter(x=>x.user_type==='student').length,
      teacherVisits:periodLogs.filter(x=>x.user_type==='teacher').length,
      studentActive:unique(periodLogs.filter(x=>x.user_type==='student'),'user_id'),
      teacherActive:unique(periodLogs.filter(x=>x.user_type==='teacher'),'user_id'),
      loansStudent:loanStudent.length,loansTeacher:loanTeacher.length,
      loansUnclassified:periodLoans.length-loanStudent.length-loanTeacher.length,
      lessons:periodLessons.length,
      lessonTeachers:new Set(periodLessons.map(x=>String(x.teacher_id||x.teacher_name||'').toLowerCase()).filter(Boolean)).size,
      digitalOpens:views.length,
      arabicOpens:views.filter(x=>String(x.language||'').toLowerCase().startsWith('ar')).length,
      englishOpens:views.filter(x=>String(x.language||'').toLowerCase().startsWith('en')).length
    };
  },[students,teachers,logs,loans,lessons,views,range.start,range.end]);
  const rows=[
    [l('الطلاب المسجلون حاليًا','Currently registered students'),metrics.studentCount],
    [l('المعلمون المسجلون حاليًا','Currently registered teachers'),metrics.teacherCount],
    [l('طلاب نشطون (دخول فريد)','Active students (unique logins)'),metrics.studentActive],
    [l('معلمون نشطون (دخول فريد)','Active teachers (unique logins)'),metrics.teacherActive],
    [l('مرات دخول الطلاب','Student login events'),metrics.studentVisits],
    [l('مرات دخول المعلمين','Teacher login events'),metrics.teacherVisits],
    [l('استعارات الطلاب المعتمدة','Approved student loans'),metrics.loansStudent],
    [l('استعارات المعلمين المعتمدة','Approved teacher loans'),metrics.loansTeacher],
    [l('استعارات غير محددة الفئة','Loans with unknown role'),metrics.loansUnclassified],
    [l('تحاضير صقر المسجلة','Recorded Saqr lesson preparations'),metrics.lessons],
    [l('المعلمون الذين أعدوا تحاضير','Teachers with lesson preparations'),metrics.lessonTeachers],
    [l('مرات فتح الكتب الرقمية (ليست قراءات مكتملة)','Digital book opens (not completed reads)'),viewState==='ready'?metrics.digitalOpens:'—'],
    [l('فتح الكتب العربية','Arabic book opens'),viewState==='ready'?metrics.arabicOpens:'—'],
    [l('فتح الكتب الإنجليزية','English book opens'),viewState==='ready'?metrics.englishOpens:'—']
  ] as const;
  const print=()=>{
    if(!validRange||viewState==='loading'||viewState==='partial')return;
    const html=`<!doctype html><html dir="${isAr?'rtl':'ltr'}"><head><meta charset="utf-8"/><title>EFIPS Library period report</title><style>@page{size:A4;margin:15mm}body{font-family:Cairo,Tahoma,Arial,sans-serif;color:#183b35}header{text-align:center;border-bottom:2px solid #087964;padding-bottom:12px}h1{font-size:20px;margin:5px}h2{font-size:13px;font-weight:normal}table{border-collapse:collapse;width:100%;margin-top:18px;font-size:12px}th,td{padding:9px;border-bottom:1px solid #dce6e3;text-align:start}th{background:#ebf7f3}footer{margin-top:20px;font-size:11px;color:#555}tr{break-inside:avoid}</style></head><body><header><h1>${escapeHtml(l('مكتبة مدرسة صقر الإمارات الدولية الخاصة','Emirates Falcon International Private School Library'))}</h1><h2>${escapeHtml(l('تقرير النشاط الدوري','Periodic activity report'))} — ${escapeHtml(range.start)} / ${escapeHtml(range.end)}</h2></header><table><thead><tr><th>${l('المؤشر','Metric')}</th><th>${l('العدد','Count')}</th></tr></thead><tbody>${rows.map(([name,value])=>`<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(value)}</td></tr>`).join('')}</tbody></table><footer>${escapeHtml(l('المصدر: سجلات النظام المتاحة وقت إنشاء التقرير. أعداد المستخدمين الحالية وليست أعدادًا تاريخية. فتح الكتاب لا يثبت إتمام قراءته. الاستعارات غير محددة الفئة معروضة منفصلة. قد تكون السجلات التاريخية غير مكتملة إذا لم تُحفظ سابقًا.','Source: system records available when generated. User directory counts are current, not historical. Book opens do not prove completion. Unknown-role loans are reported separately. Historical data may be incomplete if not previously retained.'))}<p>${escapeHtml(l('تاريخ الإصدار','Generated'))}: ${escapeHtml(new Date().toLocaleString(isAr?'ar-AE':'en-GB'))}</p></footer></body></html>`;
    void printA4Html(html);
  };
  const input='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white';
  return <section className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><div><h3 className="font-black text-xl">{l('التقارير الدورية','Periodic reports')}</h3><p className="text-xs text-slate-500 mt-1">{l('اختر الفترة ثم اطبع تقرير A4 رسميًا','Choose a date range and print an A4 report')}</p></div><button disabled={!validRange||viewState==='loading'||viewState==='partial'} onClick={print} className="rounded-xl bg-emerald-700 disabled:opacity-50 px-4 py-2.5 text-white text-sm font-bold">{l('طباعة / حفظ PDF','Print / Save PDF')}</button></div>
    <div className="flex flex-wrap items-end gap-3 mb-5">
      <label className="text-xs font-bold flex flex-col gap-1">{l('نوع الفترة','Period')}<select className={input} value={period} onChange={e=>setPeriod(e.target.value as Period)}><option value="month">{l('شهري','Monthly')}</option><option value="quarter">{l('فصلي (3 أشهر)','Quarterly (3 months)')}</option><option value="custom">{l('فترة مخصصة','Custom range')}</option></select></label>
      {period==='month'&&<label className="text-xs font-bold flex flex-col gap-1">{l('الشهر','Month')}<input className={input} type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label>}
      {period==='quarter'&&<><label className="text-xs font-bold flex flex-col gap-1">{l('السنة','Year')}<input className={input} type="number" min="2020" max="2100" value={quarterYear} onChange={e=>setQuarterYear(Number(e.target.value))}/></label><label className="text-xs font-bold flex flex-col gap-1">{l('الفصل','Quarter')}<select className={input} value={quarter} onChange={e=>setQuarter(Number(e.target.value))}>{[1,2,3,4].map(n=><option value={n} key={n}>Q{n}</option>)}</select></label></>}
      {period==='custom'&&<><label className="text-xs font-bold flex flex-col gap-1">{l('من','From')}<input className={input} type="date" value={customStart} onChange={e=>setCustomStart(e.target.value)}/></label><label className="text-xs font-bold flex flex-col gap-1">{l('إلى','To')}<input className={input} type="date" value={customEnd} onChange={e=>setCustomEnd(e.target.value)}/></label></>}
      <span className="text-xs text-slate-500 pb-2">{range.start} — {range.end}</span>
    </div>
    {viewState==='loading'&&<p className="text-sm text-slate-500 mb-3">{l('جاري تحميل سجلات فتح الكتب…','Loading book open records…')}</p>}
    {viewState==='error'&&<p className="text-sm text-amber-700 mb-3">{l('تعذرت قراءة سجل فتح الكتب؛ الأرقام الأخرى معروضة دون تقدير هذه القراءة.','Book view history unavailable; other metrics are shown without estimating opens.')} {errorMessage}</p>}
    {viewState==='partial'&&<p className="text-sm text-amber-700 mb-3">{l('تجاوز السجل حد 20 ألف عملية للفترة؛ لن نطبع تقريرًا ناقصًا.','More than 20,000 views in the period; printing is blocked to avoid an incomplete report.')}</p>}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {[[l('الطلاب النشطون','Active students'),metrics.studentActive],[l('المعلمون النشطون','Active teachers'),metrics.teacherActive],[l('الإعارات المعتمدة','Approved loans'),metrics.loansStudent+metrics.loansTeacher],[l('التحاضير المسجلة','Lesson plans'),metrics.lessons]].map(([label,value])=><div key={String(label)} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3"><strong className="block text-2xl text-emerald-700 dark:text-emerald-300">{value}</strong><span className="text-xs">{label}</span></div>)}
    </div>
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-slate-50 dark:bg-slate-800"><th className="text-start p-3">{l('المؤشر','Metric')}</th><th className="text-start p-3">{l('العدد','Count')}</th></tr></thead><tbody>{rows.map(([name,value])=><tr key={name} className="border-b border-slate-100 dark:border-slate-800"><td className="p-3">{name}</td><td className="p-3 font-bold tabular-nums">{value}</td></tr>)}</tbody></table></div>
    <p className="text-xs text-slate-500 mt-4">{l('مهم: أعداد الطلاب والمعلمين المسجلين حالية؛ مرات فتح الكتب ليست قراءات مكتملة. يعتمد التاريخ على السجلات المتاحة، وليس استنتاجًا لبيانات لم تُسجل. الفصل هنا ثلاثة أشهر تقويمية؛ ويمكن اختيار تواريخ الفصل الدراسي الفعلية من «فترة مخصصة».','Note: registered user counts are current, not historical; book opens are not completed reads. Historical results depend on retained records. Quarter means three calendar months; use a custom range for academic terms.')}</p>
  </section>;
}
