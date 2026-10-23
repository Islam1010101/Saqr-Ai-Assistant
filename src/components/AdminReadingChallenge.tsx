import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabase';
import { bookData } from '../../api/bookData';
import { ARABIC_LIBRARY_DATABASE } from '../../pages/ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from '../../pages/EnglishLibraryInternalPage';
import { digitalBookKey, physicalBookKey } from '../utils/readingPassport';

type Completed = { book_key:string; completed_on:string };
type Member = { user_type:'student'|'teacher';school_user_id:string;name_ar:string;name_en:string;grade:string;goal:number|null;completed_count:number;books:Completed[] };
type Report = { month:string;members:Member[];verified_count:number;incomplete:boolean };
const titles = new Map<string,string>([
  ...bookData.map(book=>[physicalBookKey(book),book.title] as [string,string]),
  ...ARABIC_LIBRARY_DATABASE.map(book=>[digitalBookKey('ar',book),book.title] as [string,string]),
  ...ENGLISH_LIBRARY_DATABASE.map(book=>[digitalBookKey('en',book),book.title] as [string,string])
]);
const htmlSafe=(value:unknown)=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]||char));
const currentMonth=()=>{
  const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
};
const schoolLogo='https://www.efipslibrary.online/school-logo.png';

const AdminReadingChallenge:React.FC<{isAr:boolean}> = ({isAr})=>{
  const [month,setMonth]=useState(currentMonth);
  const [role,setRole]=useState<'all'|'student'|'teacher'>('all');
  const [term,setTerm]=useState('');
  const [report,setReport]=useState<Report|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [requested,setRequested]=useState(false);
  const locale=isAr?'ar-EG':'en-US';
  const load=async()=>{
    setError('');setLoading(true);setRequested(true);setReport(null);
    const {data:session}=await supabase.auth.getSession();
    if(!session.session?.access_token){
      setError(isAr?'لا توجد جلسة إدارة موثّقة في Supabase لعرض بيانات الطلاب. الدخول بالكود المدرسي وحده لا يمنح صلاحية التقارير الخاصة.':'A verified Supabase administrator session is required to access private student reports; school ID alone is insufficient.');
      setLoading(false);return;
    }
    const {data,error:fetchError}=await supabase.functions.invoke('admin-reading-challenge',{
      body:{month:month+'-01'},headers:{Authorization:'Bearer '+session.session.access_token}
    });
    if(fetchError || !data || (data as any).error){
      setError((data as any)?.error || (isAr?'تعذر تحميل التقرير. يلزم اعتماد دور الإدارة على الخادم وربط الحسابات المدرسية المعتمدة.':'Unable to load report. Server-side administrator approval and verified school-account mapping are required.'));
    }else{
      setReport(data as Report);
    }
    setLoading(false);
  };
  const members=useMemo(()=>report?.members.filter(member=>{
    const name=isAr?(member.name_ar||member.name_en):(member.name_en||member.name_ar);
    const q=term.trim().toLocaleLowerCase();
    return (role==='all'||member.user_type===role)&&(!q||[name,member.school_user_id,member.grade,...member.books.map(book=>titles.get(book.book_key)||'')].some(v=>String(v).toLocaleLowerCase().includes(q)));
  })||[],[report,role,term,isAr]);
  const overall=useMemo(()=>({
    students:members.filter(r=>r.user_type==='student').length,
    teachers:members.filter(r=>r.user_type==='teacher').length,
    books:members.reduce((sum,r)=>sum+r.completed_count,0),
    goals:members.filter(r=>r.goal!==null&&r.completed_count>=r.goal).length
  }),[members]);
  const print=()=>{
    if(!report)return;
    const w=window.open('','_blank');
    if(!w){setError(isAr?'الرجاء السماح بالنوافذ المنبثقة للطباعة.':'Allow popups to print the report.');return;}
    const date=new Date().toLocaleDateString(locale);
    const monthLabel=new Date(report.month+'T12:00:00').toLocaleDateString(locale,{year:'numeric',month:'long'});
    const headings=isAr?['#','الصفة','الكود','الاسم','الصف','الهدف','العدد','عناوين الكتب المنجزة وتواريخها']:['#','Role','School ID','Name','Grade','Target','Count','Completed titles and dates'];
    const rows=members.map((m,i)=>'<tr><td>'+(i+1)+'</td><td>'+htmlSafe(m.user_type==='student'?(isAr?'طالب':'Student'):(isAr?'معلم':'Teacher'))+'</td><td dir="ltr">'+htmlSafe(m.school_user_id)+'</td><td>'+htmlSafe(isAr?(m.name_ar||m.name_en):(m.name_en||m.name_ar))+'</td><td>'+htmlSafe(m.grade||'—')+'</td><td>'+htmlSafe(m.goal??'—')+'</td><td>'+m.completed_count+'</td><td class="titles">'+(m.books.length?m.books.map(b=>'<div>'+htmlSafe(titles.get(b.book_key)||b.book_key)+' <small>('+htmlSafe(b.completed_on)+')</small></div>').join(''):'—')+'</td></tr>').join('');
    const title=isAr?'تقرير تحدي القراءة الشهري':'Monthly Reading Challenge Report';
    const html='<!doctype html><html lang="'+(isAr?'ar':'en')+'" dir="'+(isAr?'rtl':'ltr')+'"><head><meta charset="utf-8"><title>'+title+' — EFIPS</title><style>'+
      '@page{size:A4 portrait;margin:13mm 11mm 15mm}*{box-sizing:border-box}body{margin:0;background:white;color:#172033;font-family:Cairo,Tahoma,Arial,sans-serif;font-size:10px;line-height:1.6}'+
      '.head{display:flex;align-items:center;gap:14px;border-bottom:3px solid #0d8875;padding:2px 0 12px;margin-bottom:13px}.head img{width:59px;height:59px;object-fit:contain}.head h1{margin:0;color:#0c695e;font-size:17px}.head p{margin:2px 0;font-size:10px}.ribbon{height:5px;display:flex;margin:10px 0 14px}.ribbon i{width:25%}.ribbon i:nth-child(1){background:#d92332}.ribbon i:nth-child(2){background:#009b68}.ribbon i:nth-child(3){background:#d5dbe4}.ribbon i:nth-child(4){background:#111827}'+
      '.meta{display:flex;justify-content:space-between;gap:12px;margin-bottom:12px;color:#475569}.metrics{display:flex;gap:7px;margin:10px 0 15px}.metric{flex:1;border:1px solid #d9e8e6;border-radius:9px;text-align:center;padding:7px;background:#f5fbfa}.metric b{display:block;font-size:17px;color:#0c7163}.metric span{font-size:9px}h2{font-size:12px;color:#0c695e;margin:12px 0 6px}'+
      'table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:9px}thead{display:table-header-group}tr{break-inside:avoid;page-break-inside:avoid}th,td{border:1px solid #cbd5df;padding:5px 4px;vertical-align:top;overflow-wrap:anywhere}th{background:#e8f6f3;color:#0f594e;font-weight:900}tbody tr:nth-child(even){background:#f8fafc}th:nth-child(1){width:5%}th:nth-child(2){width:9%}th:nth-child(3){width:11%}th:nth-child(4){width:15%}th:nth-child(5){width:9%}th:nth-child(6){width:7%}th:nth-child(7){width:7%}th:nth-child(8){width:37%}.titles div{margin-bottom:3px;border-bottom:1px dotted #e2e8f0}.titles small{color:#64748b;white-space:nowrap}.foot{margin-top:18px;padding-top:7px;border-top:1px solid #cbd5e1;color:#64748b;font-size:9px;text-align:center}'+
      '@media print{.no-print{display:none!important}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'+
      '</style></head><body><div class="head"><img src="'+schoolLogo+'" alt="EFIPS"><div><h1>مدرسة صقر الإمارات الدولية الخاصة</h1><p><b>Emirates Falcon International Private School</b></p><p>'+title+'</p></div></div><div class="ribbon"><i></i><i></i><i></i><i></i></div>'+
      '<div class="meta"><span>'+htmlSafe(monthLabel)+'</span><span>'+(isAr?'تاريخ الإصدار: ':'Issued: ')+htmlSafe(date)+'</span></div><div class="metrics">'+
      [[isAr?'الطلاب':'Students',overall.students],[isAr?'المعلمون':'Teachers',overall.teachers],[isAr?'كتب منجزة':'Completed books',overall.books],[isAr?'محققو الهدف':'Goal achieved',overall.goals]].map(([n,v])=>'<div class="metric"><b>'+v+'</b><span>'+n+'</span></div>').join('')+
      '</div><h2>'+title+'</h2><table><thead><tr>'+headings.map(h=>'<th>'+htmlSafe(h)+'</th>').join('')+'</tr></thead><tbody>'+(rows||'<tr><td colspan="8" style="text-align:center">'+(isAr?'لا توجد سجلات موثقة لهذا الشهر':'No verified records for this month')+'</td></tr>')+'</tbody></table>'+
      '<p style="margin-top:9px;color:#64748b;font-size:9px">'+(isAr?'الإنجازات مسجلة ذاتيًا بواسطة القراء؛ ولا تعني التحقق المستقل من قراءة الكتاب كاملًا. السجلات غير المرتبطة بهوية مدرسية معتمدة مستبعدة.':'Reading completion is self-reported, not independent evidence of finishing each book. Unverified school mappings are excluded.')+'</p><div class="foot">EFIPS Library • '+htmlSafe(date)+'</div>'+
      '<script>window.addEventListener("load",()=>{setTimeout(()=>window.print(),500)})</scr'+'ipt></body></html>';
    w.document.open();w.document.write(html);w.document.close();
  };
  return <section dir={isAr?'rtl':'ltr'} className="lg:col-span-4 rounded-[2.25rem] border border-emerald-200/80 dark:border-emerald-800/60 bg-white dark:bg-black p-5 md:p-7 shadow-xl hover:shadow-2xl transition-shadow duration-500">
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3"><span className="rounded-2xl p-3 bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg"><svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 21V5h8v16l-4-3-4 3V4M5 5V2h14v3"/></svg></span><div><h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{isAr?'تقارير تحدي القراءة الشهري':'Monthly Reading Challenge Reports'}</h2><p className="mt-1 text-xs md:text-sm font-medium text-slate-500 dark:text-slate-300">{isAr?'إنجازات الطلاب والمعلمين الموثقة، مع عناوين الكتب والهدف الشهري':'Verified teacher and student progress, book titles and monthly targets'}</p></div></div>
      <div className="flex flex-wrap gap-2">
        <label className="text-xs font-black text-slate-700 dark:text-slate-300 self-center">{isAr?'الشهر':'Month'}</label>
        <input type="month" value={month} onChange={e=>{setMonth(e.target.value);setReport(null);setRequested(false);}} className="rounded-xl px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold" />
        <button type="button" disabled={loading} onClick={()=>void load()} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 hover:-translate-y-0.5 transition-all disabled:opacity-50">{loading?(isAr?'جارٍ التحميل…':'Loading…'):(isAr?'عرض التقرير':'Load report')}</button>
        <button type="button" onClick={print} disabled={!report} className="px-4 py-2 rounded-xl bg-sky-600 text-white font-black text-xs hover:bg-sky-700 hover:-translate-y-0.5 transition-all disabled:opacity-40">{isAr?'طباعة تقرير A4':'Print A4 report'}</button>
      </div>
    </div>
    {error && <p role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 p-4 text-sm font-bold">{error}</p>}
    {!report && !error && <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5 text-sm font-semibold text-slate-600 dark:text-slate-300">{isAr?'اختر الشهر لتحميل سجلات القراءة الموثقة. لا تُستخدم البيانات المخزنة محليًا على أجهزة الطلاب لحساب التقرير المركزي.':'Select a month to load verified reading records. Device-only reading progress is not included in central reports.'}</div>}
    {report && <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          {label:isAr?'الطلاب المشاركون':'Students',value:overall.students,theme:'from-sky-500 to-blue-600'},
          {label:isAr?'المعلمون المشاركون':'Teachers',value:overall.teachers,theme:'from-teal-500 to-emerald-700'},
          {label:isAr?'الكتب المنجزة':'Completed books',value:overall.books,theme:'from-violet-500 to-indigo-600'},
          {label:isAr?'حققوا هدفهم':'Goal reached',value:overall.goals,theme:'from-amber-500 to-orange-600'}
        ].map(c=><div key={c.label} className={'rounded-2xl bg-gradient-to-br '+c.theme+' text-white p-4 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300'}>
          <div className="text-3xl font-black tabular-nums">{c.value}</div><p className="text-xs font-bold mt-2 text-white/95">{c.label}</p>
        </div>)}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <select value={role} onChange={e=>setRole(e.target.value as typeof role)} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white font-bold">
          <option value="all">{isAr?'الطلاب والمعلمون':'All readers'}</option><option value="student">{isAr?'الطلاب':'Students'}</option><option value="teacher">{isAr?'المعلمون':'Teachers'}</option>
        </select>
        <input value={term} onChange={e=>setTerm(e.target.value)} placeholder={isAr?'ابحث بالاسم أو الكود أو الكتاب':'Search name, ID or title'} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white flex-1"/>
      </div>
      {!members.length?<div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-7 text-center text-slate-600 dark:text-slate-300 text-sm font-semibold">{isAr?'لا توجد إنجازات مرتبطة بهويات مدرسية معتمدة لهذا الشهر.':'No reading records linked to verified school identities for this month.'}</div>:
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[720px] border-collapse text-xs md:text-sm">
          <thead className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"><tr>
            {(isAr?['الصفة','الكود','الاسم','الصف','الهدف','كتب منجزة','العناوين']:['Role','School ID','Name','Grade','Target','Completed','Titles']).map(h=><th key={h} className="p-3 text-start font-black">{h}</th>)}
          </tr></thead>
          <tbody>{members.map(m=><tr key={m.user_type+':'+m.school_user_id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-emerald-50/50 dark:hover:bg-slate-900/80 transition-colors">
            <td className="p-3"><span className={'px-2 py-1 rounded-lg font-black '+(m.user_type==='student'?'text-sky-700 bg-sky-100 dark:text-sky-200 dark:bg-sky-900/30':'text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/30')}>{m.user_type==='student'?(isAr?'طالب':'Student'):(isAr?'معلم':'Teacher')}</span></td>
            <td className="p-3 font-mono">{m.school_user_id}</td>
            <td className="p-3 font-bold text-slate-800 dark:text-white">{isAr?(m.name_ar||m.name_en):(m.name_en||m.name_ar)}</td>
            <td className="p-3">{m.grade||'—'}</td><td className="p-3 font-black">{m.goal??'—'}</td>
            <td className="p-3 font-black text-emerald-700 dark:text-emerald-300">{m.completed_count}</td>
            <td className="p-3"><div className="space-y-1.5">{m.books.length?m.books.map((entry,i)=><div key={entry.book_key+i} className="leading-relaxed text-slate-700 dark:text-slate-200"><span className="font-semibold">{titles.get(entry.book_key)||entry.book_key}</span><span className="block text-[11px] text-slate-400">{entry.completed_on}</span></div>):'—'}</div></td>
          </tr>)}</tbody>
        </table>
      </div>}
      <p className="mt-4 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{isAr?'يُحتسب الإنجاز من اختيار القارئ «أنهيت القراءة»، وليس إثباتًا مستقلًا لإكمال الكتاب. السجلات غير الموثقة أو المحفوظة على الأجهزة فقط لا تظهر هنا.':'Completions are self-reported. Unverified identities and device-only records are excluded.'}</p>
    </>}
  </section>;
};
export default AdminReadingChallenge;
