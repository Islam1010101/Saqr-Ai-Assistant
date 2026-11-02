import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';

type Step = 'checking' | 'unregistered' | 'school' | 'blocked' | 'failed';
const copy = {
  ar: {
    title: 'التحقق من حساب المكتبة',
    checking: 'جاري التحقق من بريد Google المدرسي وتحديد بياناتك وصلاحياتك تلقائيًا...',
    unregistered: 'لم نتمكن من مطابقة هذا الحساب بسجل طلاب أو معلمين معتمد. يرجى مراجعة إدارة المكتبة.',
    school: 'يرجى استخدام بريد Google المدرسي المعتمد @falcon-school.com.',
    blocked: 'هذا الحساب غير متاح للدخول حاليًا. يرجى مراجعة إدارة المكتبة.',
    failed: 'تعذر إكمال التحقق الآن. يرجى إعادة المحاولة أو التواصل مع إدارة المكتبة.',
    back: 'العودة لتسجيل الدخول',
  },
  en: {
    title: 'Verifying your school library account',
    checking: 'Verifying your school Google address and identifying your approved role and name...',
    unregistered: 'We could not match this account to an approved student or staff record. Please contact the library administrator.',
    school: 'Please use your approved @falcon-school.com Google account.',
    blocked: 'This account is currently not permitted to sign in. Please contact the library administrator.',
    failed: 'Verification could not be completed. Please try again or contact the library administrator.',
    back: 'Back to sign-in',
  },
} as const;

async function errorCode(error: unknown, data: unknown): Promise<string> {
  if (data && typeof data === 'object' && 'code' in data && typeof data.code === 'string') return data.code;
  const ctx = error && typeof error === 'object' && 'context' in error ? error.context : null;
  if (ctx && typeof ctx === 'object' && 'json' in ctx && typeof ctx.json === 'function') {
    try {
      const parsed = await (ctx as Response).json();
      return typeof parsed?.code === 'string' ? parsed.code : '';
    } catch { /* A network failure may have no structured response. */ }
  }
  return '';
}

export default function GoogleSchoolReturn() {
  const [step,setStep] = useState<Step>('checking');
  const once = useRef(false);
  const lang = localStorage.getItem('saqr_lang') === 'ar' ? 'ar' : 'en';
  const t = copy[lang];

  useEffect(() => {
    if (once.current) return;
    once.current = true;
    const finish = async () => {
      try {
        // Invalidate any previous EFIPS client state before validating Google.
        localStorage.removeItem('current_user');
        localStorage.removeItem('user_type');
        const {data:{session},error:sessionError} = await supabase.auth.getSession();
        if (sessionError || !session?.access_token) throw Error('FAILED');
        const {data:{user},error:identityError} = await supabase.auth.getUser(session.access_token);
        if (identityError || !user?.email) throw Error('FAILED');

        // This entry point uses only the Google-selected email. Remove an old
        // manually entered hint, if one survived a login started before release.
        // Verified Google identity and school roles are checked server-side.
        try { sessionStorage.removeItem('efips_oauth_school_email'); } catch { /* restricted storage */ }

        const {data,error} = await supabase.functions.invoke('google-school-login', {
          body: {},
          headers: { Authorization: 'Bearer ' + session.access_token },
        });
        if (error || !data) {
          const code = await errorCode(error,data);
          if (code === 'SCHOOL_GOOGLE_REQUIRED') throw Error('SCHOOL');
          if (code === 'ACCOUNT_DISABLED') throw Error('BLOCKED');
          if (['ACCOUNT_NOT_REGISTERED','ACCOUNT_LINK_CONFLICT'].includes(code)) throw Error('UNREGISTERED');
          throw Error('FAILED');
        }
        const role = data.role;
        const profile = data.profile;
        if (!['student','teacher','admin'].includes(role) || !profile ||
          (role === 'student' ? !profile.student_id : !profile.teacher_id) ||
          String(profile.email || '').trim().toLowerCase() !== user.email.trim().toLowerCase()) throw Error('FAILED');

        localStorage.setItem('current_user',JSON.stringify(profile));
        localStorage.setItem('user_type',role);
        window.location.replace(window.location.origin + '/#/home');
      } catch (caught) {
        try { sessionStorage.removeItem('efips_oauth_school_email'); } catch { /* sessionStorage restricted */ }
        await supabase.auth.signOut().catch(() => {});
        const reason = caught instanceof Error ? caught.message : '';
        setStep(reason === 'SCHOOL' ? 'school'
          : reason === 'BLOCKED' ? 'blocked'
          : reason === 'UNREGISTERED' ? 'unregistered' : 'failed');
        window.history.replaceState(null,'',window.location.origin + '/#/');
      }
    };
    void finish();
  }, []);

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="relative isolate min-h-[100dvh] overflow-hidden grid place-items-center bg-white dark:bg-black p-5 font-sans">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 w-80 h-80 rounded-full bg-teal-400/20 dark:bg-teal-600/10 blur-3xl animate-pulse" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-24 w-96 h-96 rounded-full bg-sky-400/20 dark:bg-indigo-500/10 blur-3xl animate-pulse" />
      <section role={step === 'checking' ? 'status' : 'alert'} className="relative z-10 w-full max-w-xl rounded-[2.5rem] border border-emerald-200/70 dark:border-emerald-900 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-7 sm:p-10 text-center shadow-2xl">
        <img src="/saqr-full.png" alt={lang === 'ar' ? 'صقر، مساعد المكتبة' : 'Saqr, library assistant'} className="h-40 sm:h-52 w-auto object-contain mx-auto mb-5 drop-shadow-xl animate-float" />
        <h1 className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-100">{t.title}</h1>
        <p className="my-6 text-sm sm:text-base text-slate-700 dark:text-slate-200 font-bold leading-8">{t[step]}</p>
        {step !== 'checking' && <a href="/#/" className="inline-flex min-h-12 px-6 py-3 items-center justify-center bg-emerald-700 hover:bg-emerald-800 rounded-2xl text-white text-sm font-black">{t.back}</a>}
      </section>
    </main>
  );
}
