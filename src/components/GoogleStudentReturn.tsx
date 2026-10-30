import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';

type State = 'checking' | 'approval' | 'school' | 'failed';
const translations = {
 ar: {
  checking:'جارٍ التحقق من حساب Google المدرسي وربطه بسجلك المعتمد...',
  approval:'تم التحقق من Google، لكن تعذر ربط الحساب بالسجل المدرسي. تواصل مع إدارة المكتبة دون تعديل بياناتك.',
  school:'هذا ليس حساب Google مدرسيًا معتمدًا. يجب استخدام حساب @falcon-school.com.',
  failed:'تعذر إكمال التحقق الآمن. لم يتم تسجيل الدخول أو تغيير بيانات الطالب.',
  back:'العودة إلى الدخول برقم الطالب',
  title:'التحقق من هوية الطالب'
 },
 en: {
  checking:'Verifying your school Google account and approved student record...',
  approval:'Google sign-in succeeded but the school roster link could not be confirmed. Please contact the library administrator; no records were changed.',
  school:'This is not a verified school Google account. Use your @falcon-school.com account.',
  failed:'Secure verification could not be completed. No student session was created or records changed.',
  back:'Back to Student ID sign-in',
  title:'Student account verification'
 }
} as const;

export default function GoogleStudentReturn() {
 const [state, setState] = useState<State>('checking');
 const running = useRef(false);
 const lang = localStorage.getItem('saqr_lang') === 'ar' ? 'ar' : 'en';
 const t = translations[lang];

 useEffect(() => {
  if (running.current) return;
  running.current = true;
  const finish = async () => {
   try {
    // Do not let a prior local EFIPS ID session grant access on a failed OAuth attempt.
    localStorage.removeItem('user_type');
    localStorage.removeItem('current_user');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.access_token) throw new Error('AUTH');
    const { data, error } = await supabase.functions.invoke('google-student-pilot', {
      body: {},
      headers: { Authorization: 'Bearer ' + session.access_token }
    });
    if (error || !data?.profile?.student_id) {
      if (data?.code === 'SCHOOL_APPROVAL_REQUIRED' || data?.code === 'ACCOUNT_LINK_CONFLICT' || data?.code === 'STUDENT_NOT_FOUND') throw new Error('APPROVAL');
      if (data?.code === 'SCHOOL_GOOGLE_REQUIRED') throw new Error('SCHOOL');
      // Supabase FunctionsHttpError may contain a structured JSON response.
      if (error && 'context' in error && error.context && 'json' in error.context) {
       try {
        const body = await (error.context as Response).json();
        if (['SCHOOL_APPROVAL_REQUIRED','ACCOUNT_LINK_CONFLICT','STUDENT_NOT_FOUND'].includes(body?.code)) throw new Error('APPROVAL');
        if (body?.code === 'SCHOOL_GOOGLE_REQUIRED') throw new Error('SCHOOL');
       } catch (parsed) {
        if (parsed instanceof Error && ['APPROVAL','SCHOOL'].includes(parsed.message)) throw parsed;
       }
      }
      throw new Error('FAILED');
    }
    localStorage.setItem('user_type', 'student');
    localStorage.setItem('current_user', JSON.stringify(data.profile));
    // Only an approved roster mapping is ever stored as current_user.
    window.location.replace(window.location.origin + '/#/home');
   } catch (error) {
    await supabase.auth.signOut().catch(() => {});
    const reason = error instanceof Error ? error.message : '';
    setState(reason === 'APPROVAL' ? 'approval' : reason === 'SCHOOL' ? 'school' : 'failed');
    // The callback marker is removed only after final verification fails.
    window.history.replaceState(null, '', window.location.origin + '/#/');
   }
  };
  void finish();
  // Single navigation effect: do not cancel the callback under React StrictMode.
 }, []);

 return <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-[100dvh] bg-white dark:bg-black flex items-center justify-center p-5 font-sans">
   <section role={state === 'checking' ? 'status' : 'alert'} className="w-full max-w-lg rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-slate-900 p-7 sm:p-10 text-center shadow-xl">
    <img src="/school-logo.png" alt="EFIPS" className="h-20 w-20 object-contain mx-auto mb-6"/>
    <h1 className="font-black text-xl sm:text-2xl text-emerald-800 dark:text-emerald-200">{t.title}</h1>
    <p className="font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-8 my-6">{t[state]}</p>
    {state !== 'checking' && <a href="/#/" className="inline-flex min-h-12 justify-center items-center rounded-2xl bg-emerald-700 px-6 py-3 text-white text-sm font-black hover:bg-emerald-800">{t.back}</a>}
   </section>
 </main>;
}
