import React, {useMemo} from 'react';
import {Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

type Section = 'overview'|'reports'|'library'|'analytics'|'attendance'|'reading'|'children'|'orison'|'management'|'add-books';
type Input = {
 isAr: boolean;
 physical: number;
 arabic: number;
 english: number;
 nationalDigital: number;
 logins: ReadonlyArray<{login_time?:string|null;user_type?:string|null}>;
 operations: {active:number;pending:number;overdue:number;lessonPlans:number;digitalOpens:number};
 digitalAvailable: boolean|null;
 onNavigate: (section:Section)=>void;
};
const COLORS = ['#0e897b','#3592ba','#826bd0','#d4a34c'];
const number=(v:number,isAr:boolean)=>Math.max(0,v).toLocaleString(isAr?'ar-EG':'en-US');
const smooth=(value:number)=>Math.max(0,Number.isFinite(value)?value:0);

export default function AdminExecutiveCharts({
 isAr,physical,arabic,english,nationalDigital,logins,operations,digitalAvailable,onNavigate
}:Input){
 const lang=isAr?'ar-EG':'en-US';
 const holdings=useMemo(()=>[
  {name:isAr?'كتب ورقية':'Physical books',value:smooth(physical),color:COLORS[0]},
  {name:isAr?'رقمية عربية':'Arabic digital',value:smooth(arabic),color:COLORS[1]},
  {name:isAr?'رقمية إنجليزية':'English digital',value:smooth(english),color:COLORS[2]},
  {name:isAr?'هوية وطنية رقمية':'National identity digital',value:smooth(nationalDigital),color:COLORS[3]}
 ],[isAr,physical,arabic,english,nationalDigital]);
 const total=holdings.reduce((sum,item)=>sum+item.value,0);
 const recentLogins=useMemo(()=>{
  const dateKeys=Array.from({length:7},(_,i)=>{
   const date=new Date();date.setHours(12,0,0,0);date.setDate(date.getDate()-(6-i));
   return {key:`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`,label:date.toLocaleDateString(lang,{weekday:'short'}),students:0,teachers:0};
  });
  const byDate=new Map(dateKeys.map(row=>[row.key,row]));
  for(const log of logins){
   if(!log.login_time)continue;
   const date=new Date(log.login_time);
   if(!Number.isFinite(date.getTime()))continue;
   const key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
   const row=byDate.get(key);
   if(row){if(log.user_type==='student')row.students++;if(log.user_type==='teacher')row.teachers++;}
  }
  return dateKeys;
 },[logins,lang]);
 const loginTotal=recentLogins.reduce((sum,row)=>sum+row.students+row.teachers,0);
 const activity=useMemo(()=>[
  {name:isAr?'النشطة':'Active',count:smooth(operations.active),color:'#0e897b'},
  {name:isAr?'معلّقة':'Pending',count:smooth(operations.pending),color:'#d29b3f'},
  {name:isAr?'متأخرة':'Overdue',count:smooth(operations.overdue),color:'#d26d73'}
 ],[isAr,operations.active,operations.pending,operations.overdue]);
 const panel='efips-admin-chart-card group min-w-0 overflow-hidden rounded-[1.6rem] border border-slate-200/90 bg-white p-4 shadow-[0_9px_30px_-25px_rgba(15,58,55,.65)] sm:p-5 dark:border-slate-700 dark:bg-slate-900';
 const eyebrow='text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400';
 const chartTooltip={borderRadius:14,border:'1px solid #cbd5e1',boxShadow:'0 14px 30px -16px rgba(15,23,42,.25)',color:'#162f3b',fontSize:12};
 return <section className="lg:col-span-4 space-y-4" aria-label={isAr?'مركز المؤشرات البصرية':'Visual indicators center'}>
   <div className="efips-admin-chart-card relative isolate overflow-hidden rounded-[1.8rem] border border-emerald-800/20 bg-gradient-to-br from-[#064e4b] via-[#0d746c] to-[#147e83] p-5 text-white shadow-[0_18px_45px_-28px_rgba(3,85,77,.75)] sm:p-7">
    <div className="pointer-events-none absolute -top-16 -end-12 h-52 w-52 rounded-full border-[30px] border-white/5" aria-hidden="true"/>
    <div className="pointer-events-none absolute -bottom-20 end-20 h-40 w-40 rounded-full border-[25px] border-white/5" aria-hidden="true"/>
    <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
     <div className="min-w-0">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold">
       <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m4 17 5-5 4 3 7-8"/><path d="M15 7h5v5"/></svg>
       {isAr?'الملخص التنفيذي للمكتبة':'Library executive snapshot'}
      </div>
      <h3 className="mt-3 text-xl font-black tracking-tight sm:text-2xl">{isAr?'كل مؤشرات المكتبة، في نظرة واحدة':'Your library at a glance'}</h3>
      <p className="mt-2 max-w-2xl text-xs leading-7 text-emerald-50/80 sm:text-sm">
       {isAr?'الأرقام من الفهرس والسجلات الحالية. تفاصيل كل مؤشر والتقارير الأصلية موجودة كما هي في أقسامها.':
       'Figures come from existing catalogs and records. Original reports and every administrative tool are preserved in their sections.'}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
       {[
        {label:isAr?'مقتنيات مسجلة':'Cataloged holdings',value:total},
        {label:isAr?'إعارات نشطة':'Active loans',value:operations.active},
        {label:isAr?'طلبات للمراجعة':'Pending requests',value:operations.pending},
        {label:isAr?'تحاضير مسجلة':'Lesson reports',value:operations.lessonPlans}
       ].map((metric,index)=><div key={metric.label} className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
        <div className="text-2xl font-black tabular-nums sm:text-3xl">{number(metric.value,isAr)}</div>
        <div className="mt-1 text-[11px] leading-5 text-emerald-50/85">{metric.label}</div>
        <div className="mt-3 h-0.5 w-9 rounded-full bg-white/50"/>
       </div>)}
      </div>
     </div>
     <div className="flex flex-wrap gap-2 lg:max-w-52 lg:flex-col">
      <button type="button" onClick={()=>onNavigate('add-books')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-emerald-900 shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>{isAr?'إضافة كتاب':'Add a book'}
      </button>
      <button type="button" onClick={()=>onNavigate('reports')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-black text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 5h16v14H4zM7 15l3-4 3 2 3-4"/></svg>{isAr?'التقارير':'Reports'}
      </button>
     </div>
    </div>
   </div>
   <div className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
    <article className={panel}>
     <div className="flex flex-wrap items-start justify-between gap-2">
      <div><p className={eyebrow}>{isAr?'الانفوجرافيك 01':'Infographic 01'}</p>
       <h4 className="mt-1 font-black text-slate-900 dark:text-white">{isAr?'توزيع المقتنيات':'Collection composition'}</h4>
       <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{isAr?'بدون تكرار الورقي الوطني':'National print books included in physical total'}</p></div>
      <button type="button" onClick={()=>onNavigate('library')} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">{isAr?'الفهرس':'Catalog'}</button>
     </div>
     <div className="relative mt-3 h-[185px] w-full" role="img" aria-label={isAr?'رسم دائري لنسب أنواع الكتب':'Donut chart of catalog formats'}>
      {total>0?<ResponsiveContainer width="100%" height="100%">
       <PieChart><Pie data={holdings} dataKey="value" nameKey="name" innerRadius={55} outerRadius={78} paddingAngle={3} stroke="none" isAnimationActive={false}>
        {holdings.map(d=><Cell key={d.name} fill={d.color}/>)}
       </Pie><Tooltip contentStyle={chartTooltip} formatter={(value)=>number(Number(value),isAr)}/></PieChart>
      </ResponsiveContainer>:<div className="grid h-full place-content-center text-xs text-slate-400">{isAr?'لا توجد مقتنيات مسجلة':'No holdings yet'}</div>}
      {total>0&&<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="text-xl font-black text-emerald-800 dark:text-emerald-300 tabular-nums">{number(total,isAr)}</strong><span className="text-[10px] text-slate-500 dark:text-slate-400">{isAr?'إجمالي':'Total'}</span></div>}
     </div>
     <div className="grid grid-cols-2 gap-x-3 gap-y-2">
      {holdings.map(item=><div key={item.name} className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
       <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{backgroundColor:item.color}}/>
       <span className="min-w-0 flex-1 truncate">{item.name}</span>
       <strong className="tabular-nums text-slate-900 dark:text-white">{number(item.value,isAr)}</strong>
      </div>)}
     </div>
    </article>
    <article className={panel}>
     <div className="flex flex-wrap items-start justify-between gap-2"><div>
      <p className={eyebrow}>{isAr?'الانفوجرافيك 02':'Infographic 02'}</p>
      <h4 className="mt-1 font-black text-slate-900 dark:text-white">{isAr?'حركة الدخول خلال 7 أيام':'Seven-day login activity'}</h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{isAr?'مرات الدخول، وليس عدد الحسابات':'Sign-in events, not unique accounts'}</p>
     </div><button type="button" onClick={()=>onNavigate('analytics')} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">{isAr?'التفاصيل':'Details'}</button></div>
     <div className="mt-4 h-[185px] min-w-0" role="img" aria-label={isAr?'رسم نشاط الدخول خلال أسبوع':'Weekly login area chart'}>
      <ResponsiveContainer width="100%" height="100%"><AreaChart data={recentLogins} margin={{top:6,right:2,left:-32,bottom:0}}>
       <defs><linearGradient id="efips-admin-logins-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0e897b" stopOpacity=".25"/><stop offset="100%" stopColor="#0e897b" stopOpacity="0"/></linearGradient>
       <linearGradient id="efips-admin-logins-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3592ba" stopOpacity=".18"/><stop offset="100%" stopColor="#3592ba" stopOpacity="0"/></linearGradient></defs>
       <CartesianGrid vertical={false} stroke="#cbd5e1" strokeOpacity=".35" strokeDasharray="3 4"/>
       <XAxis dataKey="label" tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false}/>
       <YAxis allowDecimals={false} tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false}/>
       <Tooltip contentStyle={chartTooltip} formatter={(value)=>number(Number(value),isAr)}/>
       <Area type="monotone" dataKey="students" name={isAr?'طلاب':'Students'} stroke="#0e897b" strokeWidth={2.5} fill="url(#efips-admin-logins-a)" isAnimationActive={false}/>
       <Area type="monotone" dataKey="teachers" name={isAr?'معلمون':'Teachers'} stroke="#3592ba" strokeWidth={2.5} fill="url(#efips-admin-logins-b)" isAnimationActive={false}/>
      </AreaChart></ResponsiveContainer>
     </div>
     <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs"><div className="flex gap-3 text-slate-600 dark:text-slate-300">
      <span><i className="me-1 inline-block h-2 w-2 rounded-full bg-emerald-600"/>{isAr?'طلاب':'Students'}</span>
      <span><i className="me-1 inline-block h-2 w-2 rounded-full bg-sky-500"/>{isAr?'معلمون':'Teachers'}</span>
     </div><strong className="text-emerald-800 dark:text-emerald-300">{number(loginTotal,isAr)} {isAr?'دخول':'logins'}</strong></div>
     {loginTotal===0&&<p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{isAr?'لا توجد سجلات دخول خلال الأسبوع':'No recorded sign-ins this week'}</p>}
    </article>
    <article className={panel}>
     <div className="flex flex-wrap items-start justify-between gap-2"><div>
      <p className={eyebrow}>{isAr?'الانفوجرافيك 03':'Infographic 03'}</p>
      <h4 className="mt-1 font-black text-slate-900 dark:text-white">{isAr?'حالة الإعارات والطلبات':'Borrowings & requests'}</h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{isAr?'المتأخر جزء من الإعارات النشطة':'Overdue is part of active borrowing'}</p>
     </div><button type="button" onClick={()=>onNavigate('management')} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">{isAr?'إدارة':'Manage'}</button></div>
     <div className="mt-4 h-[185px] min-w-0" role="img" aria-label={isAr?'رسم مقارنة حالات الإعارات':'Borrowing status bar chart'}>
      <ResponsiveContainer width="100%" height="100%"><BarChart data={activity} margin={{top:6,right:0,left:-34,bottom:0}}>
       <CartesianGrid stroke="#cbd5e1" strokeOpacity=".35" vertical={false} strokeDasharray="3 4"/>
       <XAxis dataKey="name" tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false}/>
       <YAxis tick={{fontSize:10,fill:'#64748b'}} allowDecimals={false} axisLine={false} tickLine={false}/>
       <Tooltip contentStyle={chartTooltip} formatter={(value)=>number(Number(value),isAr)}/>
       <Bar dataKey="count" name={isAr?'عدد':'Count'} barSize={36} radius={[7,7,2,2]} isAnimationActive={false}>
        {activity.map(d=><Cell key={d.name} fill={d.color}/>)}
       </Bar>
      </BarChart></ResponsiveContainer>
     </div>
     <div className="mt-3 grid grid-cols-3 gap-2 text-center">
      {activity.map(item=><div key={item.name} className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800"><strong className="block text-base font-black text-slate-900 dark:text-white tabular-nums">{number(item.count,isAr)}</strong><span className="text-[10px] text-slate-500 dark:text-slate-400">{item.name}</span></div>)}
     </div>
    </article>
   </div>
   <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
    <span>{isAr?'جميع الرسوم من بيانات المنصة الحالية؛ لا توجد تقديرات أو أرقام مفترضة.':'Charts use existing platform records, not estimated figures.'}</span>
    <span>{digitalAvailable===false?(isAr?'إحصائيات فتح الكتب الرقمية غير متاحة حاليًا':'Digital book-open metrics unavailable'):(isAr?'مرات فتح الكتب الرقمية: ':'Digital book opens: ')+number(operations.digitalOpens,isAr)}</span>
   </div>
 </section>;
}
