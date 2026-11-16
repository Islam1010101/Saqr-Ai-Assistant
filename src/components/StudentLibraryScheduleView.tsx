import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {supabase} from '../utils/supabase';
import {useLanguage} from '../../App';

type Slot={id:string;teacher:string|null;subject:string|null;grade:string|null};
const DAYS_AR=['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
const DAYS_EN=['Monday','Tuesday','Wednesday','Thursday','Friday'];

/** Read-only timetable for individually granted students. Never mounts the booking UI. */
export default function StudentLibraryScheduleView(){
 const {locale,dir}=useLanguage();
 const ar=locale==='ar';
 const [slots,setSlots]=useState<Slot[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState(false);
 useEffect(()=>{
  let live=true;
  const get=async()=>{
   try{
    const {data,error}=await supabase.from('library_schedule').select('id,teacher,subject,grade');
    if(error)throw error;
    if(live){setSlots((data||[]) as Slot[]);setError(false);}
   }catch{if(live){setError(true);setSlots([]);}}
   finally{if(live)setLoading(false);}
  };
  void get();
  return ()=>{live=false};
 },[]);
 return <main dir={dir} className="min-h-screen bg-slate-50 px-3 pb-16 pt-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6">
  <div className="mx-auto max-w-6xl">
   <Link to="/home" className="text-sm font-black text-emerald-700 underline dark:text-emerald-300">{ar?'العودة للرئيسية':'Back to home'}</Link>
   <header className="my-8 rounded-[2rem] border border-emerald-200 bg-white p-6 shadow-lg dark:border-emerald-800 dark:bg-slate-900">
    <h1 className="text-3xl font-black">{ar?'جدول حصص المكتبة':'Library timetable'}</h1>
    <p className="mt-2 text-sm font-semibold leading-7 text-slate-600 dark:text-slate-300">
     {ar?'تم منحك صلاحية الاطلاع على جدول المكتبة فقط. حجز أو تعديل أو حذف الحصص مخصص للمعلمين والإدارة.':'Your account has view-only access. Bookings, edits and cancellations remain restricted to teachers and administrators.'}
    </p>
   </header>
   {loading&&<p role="status" className="rounded-xl bg-white p-5 font-bold dark:bg-slate-900">{ar?'جاري تحميل الحصص...':'Loading timetable...'}</p>}
   {error&&<p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-5 font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">{ar?'تعذر عرض الجدول الآن. حاول مرة أخرى لاحقًا.':'Timetable currently unavailable. Please try again.'}</p>}
   {!loading&&!error&&<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {DAYS_AR.map((day,i)=>{
      const daySlots=slots.filter(s=>s.id.startsWith(day+'_')||s.id.startsWith(DAYS_EN[i]+'_'))
        .sort((a,b)=>Number(a.id.split('_').pop())-Number(b.id.split('_').pop()));
      return <section key={day} className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-md dark:border-emerald-900 dark:bg-slate-900">
       <h2 className="bg-emerald-700 px-5 py-3 text-lg font-black text-white">{ar?day:DAYS_EN[i]}</h2>
       <div className="space-y-2 p-4">
        {daySlots.length===0&&<p className="py-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{ar?'لا توجد حجوزات مسجلة':'No booked periods'}</p>}
        {daySlots.map(s=><article key={s.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
         <strong className="text-sm font-black text-emerald-800 dark:text-emerald-200">{ar?'الحصة':'Period'} {s.id.split('_').pop()}</strong>
         <p className="mt-1 text-sm font-bold">{s.subject||'—'}</p>
         <p className="text-xs text-slate-600 dark:text-slate-300">{s.grade||'—'} · {s.teacher||'—'}</p>
        </article>)}
       </div>
      </section>;
    })}
   </div>}
  </div>
 </main>;
}
