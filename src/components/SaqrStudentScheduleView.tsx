import React,{useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {useLanguage} from '../../App';
import {supabase} from '../utils/supabase';

type Slot={id:string;booked:boolean;grade:string};
const DAYS=[
  {ar:'الإثنين',en:'Monday'},
  {ar:'الثلاثاء',en:'Tuesday'},
  {ar:'الأربعاء',en:'Wednesday'},
  {ar:'الخميس',en:'Thursday'},
  {ar:'الجمعة',en:'Friday'}
] as const;

/** Student grants expose timetable availability only: no teacher identities,
 * booking, editing, deleting, or calendar ownership controls.
 */
export default function SaqrStudentScheduleView(){
  const {locale,dir}=useLanguage();
  const ar=locale==='ar';
  const [slots,setSlots]=useState<Slot[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    let active=true;
    const load=async()=>{
      try{
        const {data:{session},error:sessionError}=await supabase.auth.getSession();
        if(sessionError||!session?.access_token)throw Error('SCHOOL_SESSION_REQUIRED');
        const {data,error:invokeError}=await supabase.functions.invoke('efips-feature-access',{
          body:{action:'my-schedule'},
          headers:{Authorization:'Bearer '+session.access_token}
        });
        if(invokeError||data?.ok!==true||data.mode!=='view-only'||!Array.isArray(data.slots))
          throw Error('SCHEDULE_ACCESS_DENIED');
        if(active){setSlots(data.slots);setError('');}
      }catch{if(active){setError(ar?'تعذر عرض جدول المكتبة المخصص للطلاب.':'The student timetable is temporarily unavailable.');setSlots([]);}}
      finally{if(active)setLoading(false);}
    };
    void load();
    window.addEventListener('focus',load);
    return()=>{active=false;window.removeEventListener('focus',load);};
  },[ar]);
  const byKey=useMemo(()=>new Map(slots.map(row=>[row.id,row])),[slots]);
  const found=(day:typeof DAYS[number],period:number)=>
    byKey.get(day.ar+'_'+period)||byKey.get(day.en+'_'+period);
  return <main dir={dir} className="mx-auto max-w-7xl px-3 pb-12 pt-4 text-slate-900 dark:text-white sm:px-6">
    <div className="mb-6 overflow-hidden rounded-[2rem] border-2 border-emerald-200 bg-gradient-to-r from-emerald-700 to-teal-700 p-6 text-white shadow-xl dark:border-emerald-800 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black tracking-widest text-emerald-100">EFIPS LIBRARY · STUDENT VIEW</p>
          <h1 className="mt-2 text-2xl font-black sm:text-4xl">{ar?'جدول زيارات المكتبة':'Library Visit Timetable'}</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-emerald-50">
            {ar?'يمكنك مشاهدة الحصص المتاحة والمحجوزة فقط. حجز الحصص أو تعديلها للمعلمين والإدارة ولا تمنحك صلاحية المشاهدة الحق في الحجز.':
              'View booked and available periods only. Booking, modifying or cancelling visits is restricted to teachers and administrators.'}
          </p>
        </div>
        <Link to="/home" className="min-h-11 rounded-xl border border-white/40 bg-white/15 px-5 py-3 text-sm font-black text-white hover:bg-white/25">
          {ar?'العودة للرئيسية':'Back to home'}
        </Link>
      </div>
    </div>
    {loading&&<p role="status" className="p-6 text-center text-sm font-bold">{ar?'جاري تحميل أوقات الحصص...':'Loading library periods...'}</p>}
    {error&&<p role="alert" className="rounded-2xl border border-rose-300 bg-rose-50 p-5 text-sm font-bold text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
    {!loading&&!error&&<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {DAYS.map((day,dayIndex)=><section key={day.en} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
        <h2 className="bg-emerald-800 px-4 py-3 text-center text-lg font-black text-white">{ar?day.ar:day.en}</h2>
        <div className="space-y-2 p-3">
          {Array.from({length:dayIndex===4?4:8},(_,index)=>index+1).map(period=>{
            const slot=found(day,period);
            return <div key={period} className={'rounded-xl border p-3 '+
              (slot?.booked?'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100':
                'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100')}>
              <div className="flex items-center justify-between gap-2 text-sm font-black">
                <span>{ar?'الحصة':'Period'} {period}</span>
                <span>{slot?.booked?(ar?'محجوزة':'Booked'):(ar?'متاحة':'Available')}</span>
              </div>
              {slot?.booked&&slot.grade&&<p className="mt-1 text-xs font-semibold" dir="auto">{slot.grade}</p>}
            </div>;
          })}
        </div>
      </section>)}
    </div>}
    <p className="mt-5 text-xs font-semibold text-slate-500 dark:text-slate-400">{ar?'هذا العرض للقراءة فقط ولا يتضمن أسماء المعلمين أو أزرار تعديل البيانات.':'Read-only timetable. No teacher names, booking buttons, or edit permissions are provided.'}</p>
  </main>;
}
