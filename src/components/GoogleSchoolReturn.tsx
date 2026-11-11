import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { verifySchoolLoginWithRetry } from '../utils/schoolLoginRetry';

type Step = 'checking' | 'unregistered' | 'school' | 'blocked' | 'failed' | 'retryable';
const copy = {
  ar: {
    title: 'التحقق من حساب المكتبة',
    checking: 'جاري التحقق من بريد Google المدرسي وتحديد بياناتك وصلاحياتك تلقائيًا...',
    unregistered: 'لم نتمكن من مطابقة هذا الحساب بسجل طلاب أو معلمين معتمد. يرجى مراجعة إدارة المكتبة.',
    school: 'يرجى استخدام بريد Google المدرسي المعتمد @falcon-school.com.',
    blocked: 'هذا الحساب غير متاح للدخول حاليًا. يرجى مراجعة إدارة المكتبة.',
    failed: 'تعذر إكمال التحقق الآن. يرجى إعادة المحاولة أو التواصل مع إدارة المكتبة.',
    retryable: 'حدث انقطاع مؤقت أثناء التحقق. نحاول تلقائيًا قبل عرض هذه الرسالة، ويمكنك إعادة المحاولة هنا دون تسجيل الدخول إلى Google مجددًا.',
    retry: 'إعادة التحقق',
    back: 'العودة لتسجيل الدخول',
  },
  en: {
    title: 'Verifying your school library account',
    checking: 'Verifying your school Google address and identifying your approved role and name...',
    unregistered: 'We could not match this account to an approved student or staff record. Please contact the library administrator.',
    school: 'Please use your approved @falcon-school.com Google account.',
    blocked: 'This account is currently not permitted to sign in. Please contact the library administrator.',
    failed: 'Verification could not be completed. Please try again or contact the library administrator.',
    retryable: 'A temporary verification service error occurred. Automatic retries have been attempted. You can try again here without restarting Google sign-in.',
    retry: 'Retry verification',
    back: 'Back to sign-in',
  },
} as const;

type SchoolLoginResponse = {
  role: 'student' | 'teacher' | 'admin';
  profile: {email?: string; student_id?: string; teacher_id?: string; [key: string]: unknown};
};

export default function GoogleSchoolReturn() {
  const [step, setStep] = useState<Step>('checking');
  const [retryKey, setRetryKey] = useState(0);
  const lang = localStorage.getItem('saqr_lang') === 'ar' ? 'ar' : 'en';
  const t = copy[lang];

  useEffect(() => {
    let active = true;
    const finish = async () => {
      setStep('checking');
      try {
        // No EFIPS role is ever granted until the server verifies the Google identity.
        localStorage.removeItem('current_user');
        localStorage.removeItem('user_type');

        // Allow a brief grace period for the OAuth redirect to initialize its session.
        let accessToken = '';
        for (const pause of [0, 350, 850]) {
          if (pause) await new Promise(resolve => setTimeout(resolve, pause));
          if (!active) return;
          const {data, error} = await supabase.auth.getSession();
          if (!active) return;
          if (!error && data.session?.access_token) {
            accessToken = data.session.access_token;
            break;
          }
          if (error?.status && error.status < 500) throw new Error('AUTH');
        }
        if (!accessToken) throw new Error('AUTH');
        const {data: {user}, error: identityError} = await supabase.auth.getUser(accessToken);
        if (!active) return;
        if (identityError) throw new Error(identityError.status === 401 || identityError.status === 403 ? 'AUTH' : 'RETRYABLE');
        if (!user?.email) throw new Error('AUTH');

        try { sessionStorage.removeItem('efips_oauth_school_email'); } catch { /* restricted storage */ }
        const data = await verifySchoolLoginWithRetry<SchoolLoginResponse>(() =>
          supabase.functions.invoke('google-school-login', {
            body: {},
            headers: {Authorization: 'Bearer ' + accessToken},
          }),
        );
        if (!active) return;
        const role = data.role;
        const profile = data.profile;
        if (!['student','teacher','admin'].includes(role) || !profile ||
          (role === 'student' ? !profile.student_id : !profile.teacher_id) ||
          String(profile.email || '').trim().toLowerCase() !== user.email.trim().toLowerCase()) {
          throw new Error('FAILED');
        }

        localStorage.setItem('current_user', JSON.stringify(profile));
        localStorage.setItem('user_type', role);
        const pendingBook = sessionStorage.getItem('efips_drive_reader_return') || '';
        sessionStorage.removeItem('efips_drive_reader_return');
        const match = /^digital:en:(EN_NEW_[0-9]{8}_[0-9]{2})$/.exec(pendingBook);
        window.location.replace(window.location.origin +
          (match ? '/#/digital-library/english?open=' + encodeURIComponent(match[1]) : '/#/home'));
      } catch (caught) {
        if (!active) return;
        try { sessionStorage.removeItem('efips_oauth_school_email'); } catch { /* restricted storage */ }
        const reason = caught instanceof Error ? caught.message : 'FAILED';
        if (reason === 'RETRYABLE') {
          // Keep Google session and callback URL, but never grant EFIPS access.
          setStep('retryable');
          return;
        }
        // Only permanent verification failures invalidate the local Google session.
        await supabase.auth.signOut({scope: 'local'}).catch(() => {});
        if (!active) return;
        setStep(reason === 'SCHOOL' ? 'school'
          : reason === 'BLOCKED' ? 'blocked'
          : reason === 'UNREGISTERED' ? 'unregistered' : 'failed');
        window.history.replaceState(null, '', window.location.origin + '/#/');
      }
    };
    void finish();
    return () => { active = false; };
  }, [retryKey]);

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="relative isolate min-h-[100dvh] overflow-hidden grid place-items-center bg-white dark:bg-black p-5 font-sans">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 w-80 h-80 rounded-full bg-teal-400/20 dark:bg-teal-600/10 blur-3xl animate-pulse" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-24 w-96 h-96 rounded-full bg-sky-400/20 dark:bg-indigo-500/10 blur-3xl animate-pulse" />
      <section role={step === 'checking' ? 'status' : 'alert'} className="relative z-10 w-full max-w-xl rounded-[2.5rem] border border-emerald-200/70 dark:border-emerald-900 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-7 sm:p-10 text-center shadow-2xl">
        <img src="/saqr-full.png" alt={lang === 'ar' ? 'صقر، مساعد المكتبة' : 'Saqr, library assistant'} className="h-40 sm:h-52 w-auto object-contain mx-auto mb-5 drop-shadow-xl animate-float" />
        <h1 className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-100">{t.title}</h1>
        <p className="my-6 text-sm sm:text-base text-slate-700 dark:text-slate-200 font-bold leading-8">{t[step]}</p>
        {step === 'retryable' && <button type="button" onClick={() => setRetryKey(value => value + 1)} className="mb-3 inline-flex min-h-12 px-6 py-3 items-center justify-center rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-black">{t.retry}</button>}
        {step !== 'checking' && <a href="/#/" className="mx-2 inline-flex min-h-12 px-6 py-3 items-center justify-center bg-emerald-700 hover:bg-emerald-800 rounded-2xl text-white text-sm font-black">{t.back}</a>}
      </section>
    </main>
  );
}
