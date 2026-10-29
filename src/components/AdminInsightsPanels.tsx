import React, { useMemo } from 'react';
import { printA4Html } from '../utils/printA4Html';
import './adminInsightsVisual.css';

type Person = {student_id?:string;teacher_id?:string;name_ar?:string;name_en?:string;grade?:string;points?:number};
type Row = Record<string, any>;
type Props = {
  isAr:boolean; locale:string; students:Person[];teachers:Person[];
  logs:Row[];schedule:Row[];lessons:Row[];
  activeLoans:Row[];pendingLoans:Row[];allLoans:Row[];
  digitalReads:Row[];digitalAvailable:boolean|null;
  physicalTotal:number;arabicTotal:number;englishTotal:number;
  topBooks:[string,number][]; onOpenTab:(tab:'students'|'teachers'|'borrowings'|'pending'|'reports')=>void;
  onShowReading:()=>void;
};
const safe=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
const role=(l:Row)=>String(l.user_type||'').toLowerCase();
const fmt=(v:number,ar:boolean)=>Number(v||0).toLocaleString(ar?'ar-EG':'en-US');
const palette=['#07866d','#17a6a5','#e1ac50','#5d8bce','#ad72c4'];
function Meter({value,max,index=0}:{value:number;max:number;index?:number}){
 const pct=max>0?Math.min(100,Math.max(0,value/max*100)):0;
 return <div className="ai-meter" role="img" aria-label={String(value)}>
   <span className="ai-meter-fill" style={{width:pct+'%',backgroundColor:palette[index%palette.length]}}/>
 </div>;
}
function ChartCard({title,caption,items,isAr}:{title:string;caption?:string;items:{label:string;value:number}[];isAr:boolean}){
 const max=Math.max(1,...items.map(r=>r.value));
 return <div className="ai-chart-card">
   <h3 className="ai-chart-title">{title}</h3>{caption&&<p className="ai-chart-caption">{caption}</p>}
   {items.length?<div className="ai-chart-rows">{items.map((row,i)=><div key={row.label+'-'+i} className="ai-chart-row">
     <div className="ai-chart-line"><span dir="auto">{row.label}</span><strong className="tabular-nums">{fmt(row.value,isAr)}</strong></div>
     <Meter value={row.value} max={max} index={i}/>
   </div>)}</div>:<p className="ai-no-data">{isAr?'لا توجد سجلات متاحة':'No records available'}</p>}
 </div>;
}
function NumberTile({label,value,note,index=0}:{label:string;value:number|string;note?:string;index?:number}){
 return <div className="ai-number-tile" style={{'--ai-accent':palette[index%palette.length]} as React.CSSProperties}>
   <strong className="ai-number">{value}</strong><span className="ai-number-label">{label}</span>
   {note&&<small className="ai-number-note">{note}</small>}
 </div>;
}
const PanelTitle=({number,title,sub}:{number:string;title:string;sub:string})=><div className="ai-panel-heading">
 <span className="ai-panel-index">{number}</span><div><h2>{title}</h2><p>{sub}</p></div>
 </div>;
export default function AdminInsightsPanels({isAr,locale,students,teachers,logs,schedule,lessons,activeLoans,pendingLoans,allLoans,digitalReads,digitalAvailable,physicalTotal,arabicTotal,englishTotal,topBooks,onOpenTab,onShowReading}:Props){
 const l=(ar:string,en:string)=>isAr?ar:en;
 const teacherMap=useMemo(()=>new Map(teachers.map(p=>[String(p.teacher_id||'').toLowerCase(),p])),[teachers]);
 const studentMap=useMemo(()=>new Map(students.map(p=>[String(p.student_id||'').toLowerCase(),p])),[students]);
 const loginCounts=useMemo(()=>{
  const counts=new Map<string,{code:string;kind:string;count:number}>();
  for(const e of logs){const kind=role(e),code=String(e.user_id||'').trim();if(!code||!['student','teacher','admin'].includes(kind))continue;
   const key=kind+':'+code.toLowerCase(),old=counts.get(key);counts.set(key,{code,kind,count:(old?.count||0)+1});}
  return [...counts.values()].sort((a,b)=>b.count-a.count).slice(0,7).map(p=>{
    const person=p.kind==='student'?studentMap.get(p.code.toLowerCase()):teacherMap.get(p.code.toLowerCase());
    return {label:(isAr?person?.name_ar||person?.name_en:person?.name_en||person?.name_ar)||p.code,value:p.count};
  });
 },[logs,studentMap,teacherMap,isAr]);
 const logStudent=logs.filter(x=>role(x)==='student');
 const logTeacher=logs.filter(x=>role(x)==='teacher');
 const logAdmin=logs.filter(x=>role(x)==='admin');
 const loggedStudents=new Set(logStudent.map(x=>String(x.user_id||'').toLowerCase())).size;
 const loggedTeachers=new Set(logTeacher.map(x=>String(x.user_id||'').toLowerCase())).size;
 const byDay=useMemo(()=>{
  const days=Array.from({length:7},()=>0);
  for(const item of logs){const d=new Date(item.login_time||'');if(Number.isFinite(d.getTime()))days[d.getDay()]++;}
  const labels=isAr?['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return days.map((value,i)=>({label:labels[i],value}));
 },[logs,isAr]);
 const scheduleData=useMemo(()=>{
  const booked=schedule.filter(s=>String(s.teacher||'').trim());
  const byTeacher=new Map<string,{name:string,count:number}>();
  booked.forEach(s=>{const key=String(s.user_id||s.teacher).toLowerCase(),name=String(s.teacher||'');
   const old=byTeacher.get(key);byTeacher.set(key,{name,count:(old?.count||0)+1});});
  const prepared=new Set(lessons.map(s=>String(s.teacher_id||s.teacher_name||'').toLowerCase()).filter(Boolean));
  return {booked:booked.length,teachers:byTeacher.size,unbooked:Math.max(0,teachers.length-byTeacher.size),
    prepared:prepared.size,bookedTeachers:[...byTeacher.values()].sort((a,b)=>b.count-a.count).slice(0,7).map(x=>({label:x.name,value:x.count}))};
 },[schedule,teachers.length,lessons]);
 const borrowed=useMemo(()=>{
  const now=new Date().toISOString().slice(0,10);
  const returned=allLoans.filter(x=>String(x.status||'').toLowerCase()==='returned').length;
  const overdue=activeLoans.filter(x=>x.return_date&&String(x.return_date).slice(0,10)<now).length;
  const byName=new Map<string,number>();[...activeLoans,...pendingLoans].forEach(x=>{let name=String(x.book_name||'').trim();if(name)byName.set(name,(byName.get(name)||0)+1)});
  return {returned,overdue,byName:[...byName].sort((a,b)=>b[1]-a[1]).slice(0,6).map(x=>({label:x[0],value:x[1]}))};
 },[allLoans,activeLoans,pendingLoans]);
 const digitalTotal=digitalReads.reduce((n,r)=>n+Number(r.read_count||0),0);
 const bestBooks=useMemo(()=>[...digitalReads].sort((a,b)=>Number(b.read_count||0)-Number(a.read_count||0)).slice(0,7).map(x=>({label:String(x.book_title||''),value:Number(x.read_count||0)})),[digitalReads]);
 const printableLessons=()=>{
  const rows=lessons.map(r=>'<tr><td>'+safe(r.teacher_name||r.teacher_id)+'</td><td>'+safe(r.lesson_topic)+'</td><td>'+safe(r.plan_type)+'</td><td>'+safe(String(r.created_at||'').slice(0,10))+'</td></tr>').join('');
  const html='<html dir="'+(isAr?'rtl':'ltr')+'"><head><meta charset="utf-8"><title>EFIPS Saqr lesson reports</title><style>@page{size:A4;margin:13mm}body{font-family:Cairo,Tahoma,Arial,sans-serif;color:#153e38}h1{color:#0c7867;font-size:20px}table{width:100%;border-collapse:collapse;font-size:11px}th,td{border:1px solid #b5d3ca;padding:8px;text-align:start}th{background:#e5f8ef}tr{break-inside:avoid}</style></head><body><h1>EFIPS Library — '+safe(l('تقارير التحاضير الذكية بواسطة صقر','Saqr AI lesson preparation reports'))+'</h1><p>'+safe(new Date().toLocaleDateString(locale==='ar'?'ar-EG':'en-US'))+'</p><p>'+safe(l('البيانات من سجلات التحضير المسجلة، ولا تثبت تنفيذ الحصة.','Recorded preparation entries, not proof that a class was taught.'))+'</p><table><thead><tr><th>'+l('المعلم','Teacher')+'</th><th>'+l('الموضوع','Topic')+'</th><th>'+l('النوع','Type')+'</th><th>'+l('التاريخ','Date')+'</th></tr></thead><tbody>'+rows+'</tbody></table></body></html>';
  void printA4Html(html);
 };
 return <div className="ai-insights-root lg:col-span-4">
   <section id="admin-access-report" className="ai-panel">
    <PanelTitle number="01" title={l('قسم الدخول ونشاط المستخدمين','Logins & user activity')} sub={l('إحصاءات حقيقية من سجل الدخول؛ مرات الدخول تختلف عن عدد الأشخاص الفريدين.','Recorded login events are different from unique users.')}/>
    <div className="ai-metric-grid">
     <NumberTile label={l('طلاب دخلوا (فريدون)','Unique student logins')} value={fmt(loggedStudents,isAr)}/>
     <NumberTile label={l('معلمون دخلوا (فريدون)','Unique teacher logins')} value={fmt(loggedTeachers,isAr)} index={1}/>
     <NumberTile label={l('مرات دخول الطلاب','Student login events')} value={fmt(logStudent.length,isAr)} index={2}/>
     <NumberTile label={l('مرات دخول المعلمين','Teacher login events')} value={fmt(logTeacher.length,isAr)} index={3}/>
    </div>
    <div className="ai-duo">
     <ChartCard title={l('الأكثر نشاطًا في الدخول','Top users by logins')} items={loginCounts} isAr={isAr} caption={l('الترتيب حسب سجلات الدخول الفعلية','Based on recorded login events')}/>
     <ChartCard title={l('الدخول حسب يوم الأسبوع','Logins by day of week')} items={byDay} isAr={isAr}/>
    </div>
    {!!logAdmin.length&&<p className="ai-note">{l('مرات دخول الإدارة المسجلة: ','Recorded administrator logins: ')} {fmt(logAdmin.length,isAr)}</p>}
   </section>
   <section id="admin-schedule-report" className="ai-panel">
    <PanelTitle number="02" title={l('جدول الحصص والتحضير الذكي','Timetable & Saqr lesson preparation')} sub={l('الحجوزات من الجدول، والتحاضير من سجلات صقر؛ الحضور والغياب يتم تسجيلهما في التقرير الأسبوعي أسفل الصفحة.','Booking templates and Saqr lesson records; attendance/absence is explicitly marked in the weekly register below.')}/>
    <div className="ai-metric-grid">
     <NumberTile label={l('الحصص المحجوزة بالجدول','Booked timetable periods')} value={scheduleData.booked}/>
     <NumberTile label={l('معلمون لديهم حجز','Teachers with bookings')} value={scheduleData.teachers} index={1}/>
     <NumberTile label={l('معلمون بلا حجز مسجل','Teachers without bookings')} value={scheduleData.unbooked} index={2} note={l('ليس إثباتًا للغياب','Not absence')}/>
     <NumberTile label={l('تقارير التحضير الذكي','Saqr lesson records')} value={lessons.length} index={3}/>
    </div>
    <div className="ai-duo">
     <ChartCard title={l('أكثر المعلمين حجزًا للمكتبة','Most library bookings by teacher')} items={scheduleData.bookedTeachers} isAr={isAr}/>
     <div className="ai-chart-card ai-chart-info">
      <h3 className="ai-chart-title">{l('تقرير المتابعة الشامل','Monitoring and reports')}</h3>
      <p>{l('يعرض تقرير الحضور الأسبوعي أسماء المعلمين الذين حضروا أو لم يحضروا وفق التسجيل الفعلي، ويتيح طباعة PDF. التحاضير المسجلة في صقر متاحة للبحث والطباعة.','The weekly attendance register tracks explicitly marked attended/absent teachers and prints to PDF. Saqr lesson records can be searched and printed.')}</p>
      <div className="ai-card-actions">
       <a href="#admin-attendance">{l('عرض الحضور والغياب','Open attendance register')}</a>
       <button type="button" onClick={()=>onOpenTab('reports')}>{l('سجلات التحضير','Lesson records')}</button>
       <button type="button" onClick={printableLessons} disabled={!lessons.length}>{l('طباعة تقرير تحاضير صقر','Print Saqr lesson report')}</button>
      </div>
      <p className="ai-note">{l('لا نعتبر عدم تسجيل الحضور غيابًا تلقائيًا. سجل الحضور حاليًا محفوظ على المتصفح الخاص بالإدارة.','Unmarked attendance is not counted as absence. The current attendance register is saved in the administrator’s browser.')}</p>
     </div>
    </div>
   </section>
   <section id="admin-borrow-report" className="ai-panel">
    <PanelTitle number="03" title={l('طلبات واستعارات الكتب','Book borrowing & requests')} sub={l('متابعة الإعارات النشطة والطلبات الحالية والمتأخرات، والسجلات المرجعة المتاحة.','Live loans, pending requests, overdue items and available returned records.')}/>
    <div className="ai-metric-grid">
     <NumberTile label={l('استعارات نشطة','Active loans')} value={activeLoans.length}/>
     <NumberTile label={l('طلبات في الانتظار','Pending requests')} value={pendingLoans.length} index={1}/>
     <NumberTile label={l('استعارات متأخرة','Overdue loans')} value={borrowed.overdue} index={2}/>
     <NumberTile label={l('كتب مرجعة مسجلة','Returned records')} value={borrowed.returned} index={3}/>
    </div>
    <div className="ai-duo">
     <ChartCard title={l('العناوين الأكثر طلبًا','Most requested titles')} items={borrowed.byName} isAr={isAr}/>
     <div className="ai-chart-card ai-chart-info">
      <h3 className="ai-chart-title">{l('إدارة حركة الاستعارة','Borrowing operations')}</h3>
      <p>{l('تظل الموافقة والرفض والإرجاع والتسجيل كما هي داخل الجداول الأصلية.','Approval, rejection, return and registration remain in the original management tables.')}</p>
      <div className="ai-card-actions">
       <button type="button" onClick={()=>onOpenTab('pending')}>{l('الطلبات المعلقة','Pending requests')}</button>
       <button type="button" onClick={()=>onOpenTab('borrowings')}>{l('الكتب المستعارة','Active borrowings')}</button>
      </div>
      <p className="ai-note">{l('إحصاء العناوين هنا مبني على الطلبات والإعارات الظاهرة، وليس عدد مرات قراءة الكتاب كاملًا.','Title counts reflect requests and loans, not verified full-book reading.')}</p>
     </div>
    </div>
   </section>
   <section id="admin-reading-report" className="ai-panel">
    <PanelTitle number="04" title={l('تحدي القراءة الشهري مع صقر','Monthly Saqr reading challenge')} sub={l('التقرير المعتمد موجود أدناه ويتطلب جلسة إدارة موثقة لعرض المشاركين والكتب المنجزة، ولا نفترض إنجازات من عدد مرات فتح الكتب.','Verified participant and completed-title reports are available below when a securely authenticated admin session exists.')}/>
    <div className="ai-reading-banner">
     <div><strong>{l('المشاركون والكتب والأهداف','Participants, books & goals')}</strong><p>{l('افتح التقرير لاختيار الشهر والاطلاع على الأكثر إنجازًا، والتطبيق الفعلي للتحدي، وطباعة النتائج.','Choose a month to see verified participation, completions, goal achievements and printable results.')}</p></div>
     <button type="button" onClick={onShowReading}>{l('فتح تقرير تحدي القراءة','Open monthly reading report')}</button>
    </div>
   </section>
   <section id="admin-books-report" className="ai-panel">
    <PanelTitle number="05" title={l('المقتنيات والكتب الأكثر تفاعلًا','Library collection & popular books')} sub={l('إحصاءات الدليل الورقي والرقمي منفصلة عن سجلات الفتح والاستعارة.','Catalog inventory is distinct from digital opens and physical borrowing activity.')}/>
    <div className="ai-metric-grid">
     <NumberTile label={l('كتب الدليل الورقي','Physical catalog titles')} value={fmt(physicalTotal,isAr)}/>
     <NumberTile label={l('المكتبة الرقمية العربية','Arabic digital catalog')} value={fmt(arabicTotal,isAr)} index={1}/>
     <NumberTile label={l('المكتبة الرقمية الإنجليزية','English digital catalog')} value={fmt(englishTotal,isAr)} index={2}/>
     <NumberTile label={l('مرات فتح الكتب الرقمية','Digital book opens')} value={digitalAvailable===false?'—':fmt(digitalTotal,isAr)} index={3}/>
    </div>
    <div className="ai-duo">
     <ChartCard title={l('الأكثر فتحًا في المكتبة الرقمية','Most opened digital books')} caption={l('فتح الكتاب لا يعني إكمال قراءته','An open is not a completed read')} items={digitalAvailable===false?[]:bestBooks} isAr={isAr}/>
     <ChartCard title={l('الأكثر طلبًا للاستعارة','Most borrowed/requested physical titles')} items={topBooks.map(p=>({label:p[0],value:p[1]}))} isAr={isAr}/>
    </div>
   </section>
   <section id="admin-users-report" className="ai-panel">
    <PanelTitle number="06" title={l('إدارة الطلاب والمعلمين','User management')} sub={l('ملخص الحسابات مع إمكانية الوصول لسجلات المستخدمين الأصلية.','Directory overview linked to the original student and teacher records.')}/>
    <div className="ai-metric-grid">
     <NumberTile label={l('الطلاب المسجلون','Registered students')} value={fmt(students.length,isAr)}/>
     <NumberTile label={l('المعلمون المسجلون','Registered teachers')} value={fmt(teachers.length,isAr)} index={1}/>
     <NumberTile label={l('حسابات الإدارة الحالية','Existing administrators')} value={teachers.filter(t=>String(t.teacher_id||'').toUpperCase()==='HR785').length} index={2}/>
     <NumberTile label={l('إجمالي المستخدمين','All directory users')} value={fmt(students.length+teachers.length,isAr)} index={3}/>
    </div>
    <div className="ai-reading-banner ai-role-notice">
      <div><strong>{l('حذف المستخدم وتعديل الصلاحية','Delete users and change access levels')}</strong>
       <p>{l('هذه العمليات لم تُفعّل: نظام الدخول الحالي يعتمد على كود محلي، ولا يمكن تأمين حذف الحسابات أو تحويل طالب إلى معلم أو أدمن بهذه الطريقة. يلزم أولًا تسجيل دخول إداري موثّق مع صلاحيات محفوظة على الخادم.','These operations are not yet enabled: the current local-code login cannot securely authorize deletion or promotion. A server-verified admin identity and protected permissions are required first.')}</p>
       <p className="ai-note">{l('بريد الطالب يعرض وفق قاعدة رقم الطالب @falcon-school.com، وبريد المعلم يظل فارغًا عند عدم وجود عنوان مسجل.','Student email is derived from the school ID rule. Teacher email remains blank where no verified address is stored.')}</p>
      </div>
      <div className="ai-card-actions"><button type="button" onClick={()=>onOpenTab('students')}>{l('سجلات الطلاب','Student records')}</button><button type="button" onClick={()=>onOpenTab('teachers')}>{l('سجلات المعلمين','Teacher records')}</button></div>
    </div>
   </section>
 </div>;
}
