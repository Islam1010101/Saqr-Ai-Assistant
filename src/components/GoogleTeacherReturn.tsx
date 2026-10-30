import React,{useEffect,useRef,useState} from 'react';
import {supabase} from '../utils/supabase';
export default function GoogleTeacherReturn(){
 const once=useRef(false);const [status,setStatus]=useState<'checking'|'denied'>('checking');
 const lang=localStorage.getItem('saqr_lang')==='ar'?'ar':'en';
 useEffect(()=>{if(once.current)return;once.current=true;void (async()=>{
  try {
   localStorage.removeItem('current_user');localStorage.removeItem('user_type');
   const {data:{session},error}=await supabase.auth.getSession();
   if(error||!session?.access_token)throw Error('No session');
   const result=await supabase.functions.invoke('google-teacher-login',{body:{},headers:{Authorization:'Bearer '+session.access_token}});
   if(result.error||!result.data?.profile?.teacher_id||!['teacher','admin'].includes(result.data?.role))throw Error('Not approved');
   localStorage.setItem('current_user',JSON.stringify(result.data.profile));
   localStorage.setItem('user_type',result.data.role);
   window.location.replace(window.location.origin+'/#/home');
  }catch{await supabase.auth.signOut().catch(()=>{});window.history.replaceState(null,'',window.location.origin+'/#/');setStatus('denied');}
 })()},[]);
 return <main dir={lang==='ar'?'rtl':'ltr'} className="relative isolate min-h-[100dvh] overflow-hidden grid place-items-center bg-white dark:bg-black p-5">
  <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 w-80 h-80 rounded-full bg-teal-400/20 dark:bg-teal-600/10 blur-3xl animate-pulse" />
  <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-24 w-96 h-96 rounded-full bg-sky-400/20 dark:bg-indigo-500/10 blur-3xl animate-pulse" />
  <section className="relative z-10 w-full max-w-xl text-center rounded-[2.5rem] border border-emerald-200/70 dark:border-emerald-900 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-emerald-500/15">
   <img src="/saqr-full.png" alt={lang==='ar' ? 'صقر المساعد الذكي' : 'Saqr, the library assistant'} className="h-40 sm:h-52 w-auto max-w-full object-contain mx-auto mb-5 drop-shadow-xl animate-float"/>
   <h1 className="text-2xl font-black text-emerald-900 dark:text-emerald-100">{lang==='ar'?'دخول المعلمين والإدارة':'Staff Google sign-in'}</h1>
   <p className="my-5 text-slate-700 dark:text-slate-200 font-bold leading-8">{status==='checking'?(lang==='ar'?'جاري التحقق من البريد المدرسي وصلاحيات الحساب...':'Checking school email and account permissions...'):(lang==='ar'?'هذا الحساب غير مصرح له بالدخول. يجب أن يكون بريدك مسجلاً ضمن قائمة المدرسة المعتمدة.':'This Google account is not authorized. Your email must be in the approved staff list.')}</p>
   {status==='denied'&&<a href="/#/" className="inline-flex px-6 py-3 bg-emerald-700 rounded-xl text-white font-black">{lang==='ar'?'العودة لتسجيل الدخول':'Back to login'}</a>}
  </section>
 </main>;
}
