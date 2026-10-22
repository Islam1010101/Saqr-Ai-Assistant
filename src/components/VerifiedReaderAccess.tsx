import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../App';
import { requestReaderCode, verifyReaderCode, useCloudReader } from '../utils/efipsCloud';

const VerifiedReaderAccess: React.FC = () => {
  const { locale } = useLanguage();
  const ar = locale === 'ar';
  const { user, loading } = useCloudReader();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const onRequest = () => setOpen(true);
    window.addEventListener('efips-request-reader-verification', onRequest);
    return () => window.removeEventListener('efips-request-reader-verification', onRequest);
  }, []);
  useEffect(() => { if (user) { setOpen(false); setToken(''); setNotice(''); } }, [user?.id]);
  const request = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setNotice('');
    try {
      await requestReaderCode(email);
      setSent(true);
      setNotice(ar ? 'إن كان البريد متاحًا، ستصلك رسالة برمز التحقق.' : 'A verification message will arrive if the address is available.');
    } catch(e) {
      setNotice(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  };
  const confirm = async (event: React.FormEvent) => {
    event.preventDefault();setBusy(true);setNotice('');
    try {
      await verifyReaderCode(email, token);
      setOpen(false);setToken('');
      window.dispatchEvent(new Event('efips-cloud-auth-changed'));
    } catch(e) {setNotice(e instanceof Error ? e.message : String(e));}
    finally {setBusy(false);}
  };
  return <>
    {!loading && <button type="button" onClick={()=>setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-white/85 dark:bg-slate-800/85 border border-emerald-200 dark:border-emerald-700 px-4 py-2 text-xs font-black text-emerald-700 dark:text-emerald-300 shadow-sm hover:scale-105 active:scale-95 transition-transform">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7 12 13l8-6M4 6h16v12H4z"/></svg>
      {user ? (ar ? 'قائمة القراءة متصلة ببريد موثّق' : 'Verified reading account connected') : (ar ? 'تفعيل المزامنة والتقييمات العامة' : 'Enable sync & public ratings')}
    </button>}
    {open && !user && <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4" onClick={()=>setOpen(false)}>
      <div dir={ar?'rtl':'ltr'} role="dialog" aria-modal="true" aria-label={ar?'التحقق من حساب القراءة':'Verify reading account'} className="w-full max-w-md rounded-[2rem] border-2 border-emerald-200 dark:border-emerald-700 shadow-2xl bg-white dark:bg-slate-900 p-6" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between gap-3 items-center mb-4">
          <h2 className="text-xl font-black text-emerald-800 dark:text-emerald-300">{ar?'تأكيد حساب القراءة':'Verify your reading account'}</h2>
          <button type="button" onClick={()=>setOpen(false)} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white" aria-label={ar?'إغلاق':'Close'}>✕</button>
        </div>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 mb-4">{ar?'للمزامنة بين الأجهزة والتقييم العام للكتب، استخدم بريدًا تملك الوصول إليه. هذا التحقق مستقل عن رقم دخول المدرسة، ولا يمنح صلاحيات الإدارة.':'Use an email address you can access to sync saved books and submit public ratings. This is separate from your school ID and grants no administration privileges.'}</p>
        <form onSubmit={sent?confirm:request} className="space-y-3">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">{ar?'البريد الإلكتروني':'Email address'}
            <input autoComplete="email" type="email" required value={email} onChange={e=>{setEmail(e.target.value);setSent(false);setToken('');}} className="mt-1 block w-full rounded-xl border border-emerald-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3" dir="ltr"/>
          </label>
          {sent && <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">{ar?'رمز التحقق':'Verification code'}
            <input inputMode="numeric" pattern="[0-9]{6,8}" autoComplete="one-time-code" required value={token} onChange={e=>setToken(e.target.value.replace(/\D/g,'').slice(0,8))} className="mt-1 block w-full rounded-xl border border-emerald-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3" dir="ltr"/>
          </label>}
          {notice && <p role="status" className="text-sm text-amber-800 dark:text-amber-300">{notice}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-emerald-600 text-white py-3 font-black hover:bg-emerald-700 disabled:opacity-50">{busy?(ar?'جارٍ التحقق…':'Working…'):sent?(ar?'تأكيد الرمز':'Confirm code'):(ar?'إرسال رمز التحقق':'Send verification code')}</button>
        </form>
      </div>
    </div>}
  </>;
};
export default VerifiedReaderAccess;
