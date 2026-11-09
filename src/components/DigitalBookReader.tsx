import React, { useEffect, useRef, useState } from 'react';
import DigitalLibraryDialog from './DigitalLibraryDialog';
import PdfBookPages from './PdfBookPages';
import { digitalReaderSource } from '../utils/digitalReaderSource';
import { useCloudReader } from '../utils/efipsCloud';
import { pdfReadingStorageKey, readerDeviceAccount } from '../utils/pdfReadingState';
import { schoolDriveFileId } from '../utils/schoolDrivePdfRanges';
import { supabase } from '../utils/supabase';
import './digitalBookReader.css';

export default function DigitalBookReader({ title, source, bookKey, locale, onBack, onClose, schoolOnly = false }: {
  title: string; source: string; bookKey: string; locale: string; onBack: () => void; onClose: () => void;
  /** School-domain PDFs can be previewed by a signed-in school user, not fetched by the anonymous public-PDF endpoint. */
  schoolOnly?: boolean;
}) {
  const ar = locale === 'ar';
  const preview = digitalReaderSource(source);
  const embeddedSchoolPreview = schoolOnly && Boolean(preview);
  const schoolFileId = schoolOnly ? schoolDriveFileId(source) : null;
  const [schoolToken,setSchoolToken] = useState<string | null>(null);
  const [checkingSchoolToken,setCheckingSchoolToken] = useState(schoolOnly);
  const [schoolOauthBusy,setSchoolOauthBusy] = useState(false);
  const schoolAccess = schoolOnly && schoolFileId && schoolToken
    ? {fileId:schoolFileId,token:schoolToken} : null;
  const [deviceAccount] = useState(() => readerDeviceAccount());
  const { user } = useCloudReader();
  // Rendering the Drive book must never wait for an additional auth call.
  const storageKey = pdfReadingStorageKey(deviceAccount || user?.id || null, bookKey, preview || source);
  const [error, setError] = useState<Error | null>(null);
  // Open the known book preview on the very first render, no 3-second fallback.
  const [showPreview, setShowPreview] = useState(() => !schoolOnly && Boolean(preview));
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Keep the on-site PDF reader mounted in the background so that page
  // bookmarks and saved position remain available as soon as it is ready.
  useEffect(() => {
    setError(null); setShowPreview(!schoolOnly && Boolean(preview)); setReady(false); setAttempt(0);
  }, [bookKey, source, preview, schoolOnly]);
  useEffect(() => {
    if(!schoolOnly){setCheckingSchoolToken(false);setSchoolToken(null);return;}
    if(!user?.id){setCheckingSchoolToken(false);return;}
    let active=true;
    void supabase.auth.getSession().then(({data,error})=>{
      if(!active)return;
      const session=data.session;
      const sameSchoolAccount=!!session?.user?.email &&
        session.user.id===user.id &&
        session.user.email.toLowerCase().endsWith('@falcon-school.com');
      setSchoolToken(!error && sameSchoolAccount && session?.provider_token
        ? session.provider_token : null);
    }).catch(()=>{if(active)setSchoolToken(null);}).finally(()=>{
      if(active)setCheckingSchoolToken(false);
    });
    return()=>{active=false;};
  },[schoolOnly,user?.id]);
  const enableSchoolReader = async() => {
    if(!schoolOnly || !schoolFileId || !user?.email?.toLowerCase().endsWith('@falcon-school.com'))return;
    setSchoolOauthBusy(true);
    try {
      sessionStorage.setItem('efips_drive_reader_return',bookKey);
      // New consent happens only after this button click. It does NOT alter
      // the normal sign-in scope required by every student or teacher.
      const {error:oauthError}=await supabase.auth.signInWithOAuth({
        provider:'google',
        options:{
          scopes:'https://www.googleapis.com/auth/drive.readonly',
          redirectTo:window.location.origin+'/?efips_google_student=1',
          queryParams:{prompt:'consent',include_granted_scopes:'true'}
        }
      });
      if(oauthError)throw oauthError;
    } catch {
      sessionStorage.removeItem('efips_drive_reader_return');
      setError(new Error('SCHOOL_DRIVE_PERMISSION_REQUIRED'));
      setSchoolOauthBusy(false);
    }
  };
  const retry = () => {
    setError(null); setReady(false); setShowPreview(!schoolOnly && Boolean(preview));
    setAttempt(v => v + 1);
  };
  const reportReaderError = (failure: Error) => { setError(failure); setShowPreview(!schoolOnly); };
  const back = useRef<HTMLButtonElement>(null);
  useEffect(() => { back.current?.focus(); }, []);
  const errorCode = (error as Error & { code?: string })?.code || error?.message;
  const downloadDisabled = errorCode === 'SOURCE_DOWNLOAD_DISABLED';
  const sourceRangeUnsupported = errorCode === 'SOURCE_RANGE_UNSUPPORTED';
  const sourceNotPdf = errorCode === 'SOURCE_NOT_PDF';
  return <DigitalLibraryDialog title={title} onClose={onClose} variant="reader">
    <section className="efips-book-reader" dir={ar ? 'rtl' : 'ltr'}>
      <header className="efips-reader-header">
        <div className="efips-reader-brand">
          <img src="/school-logo.png" width={64} height={64} loading="eager"
            alt={ar ? 'شعار مدرسة صقر الإمارات الدولية الخاصة' : 'Emirates Falcon International Private School logo'} />
        </div>
        <h2 dir="auto">{title}</h2>
        <nav className="efips-reader-nav" aria-label={ar ? 'أدوات القراءة' : 'Reading controls'}>
          <button ref={back} type="button" onClick={onBack}>{ar ? 'تفاصيل الكتاب' : 'Book details'}</button>
          {!schoolOnly && <a href={source} target="_blank" rel="noopener noreferrer">{ar ? 'فتح المصدر في نافذة جديدة' : 'Open source in new tab'}</a>}
          <button type="button" data-book-close onClick={onClose}>{ar ? 'إغلاق القارئ' : 'Close reader'}</button>
        </nav>
      </header>
      <div className="efips-reader-stage">
          {!error && (!schoolOnly || !!schoolAccess) && <div className="efips-reader-native" aria-hidden={showPreview}>
            <PdfBookPages key={`${storageKey || bookKey}:${attempt}`} bookKey={bookKey}
              storageKey={storageKey} ar={ar} schoolAccess={schoolAccess} onReady={() => setReady(true)}
              onError={reportReaderError} />
          </div>}
          {schoolOnly && !showPreview && (!schoolAccess || error) && <section
            className="efips-reader-fallback flex flex-col items-center justify-center gap-4 text-center px-5 py-8"
            role="status" aria-live="polite">
            <h3 className="text-xl font-black text-emerald-800 dark:text-emerald-200">
              {ar?'القراءة داخل ريدر صقر':'Read inside EFIPS Book Reader'}
            </h3>
            <p className="max-w-xl text-sm leading-7 font-semibold">
              {checkingSchoolToken
                ? (ar?'جاري فحص صلاحية القراءة المدرسية...':'Checking your school reading access...')
                : error
                ? (ar?'تعذر تحميل صفحات PDF بحساب Google الحالي. قد تكون الصلاحية منتهية، أو تمنع إعدادات المدرسة قراءة الملف.':'Google could not provide the PDF pages. Your permission may have expired, or your school may restrict this file.')
                : (ar?'لفتح الكتب الكبيرة وحفظ الصفحة داخل ريدر صقر، يحتاج Google إلى إذن قراءة ملفات Drive بحساب المدرسة.':'To read large books and save your page in EFIPS Reader, Google must grant permission to read Drive files with your school account.')}
            </p>
            {!checkingSchoolToken && user?.email?.toLowerCase().endsWith('@falcon-school.com') && <button
              type="button" onClick={() => {void enableSchoolReader();}} disabled={schoolOauthBusy}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black disabled:opacity-60">
              {schoolOauthBusy ? (ar?'جاري الانتقال إلى Google...':'Opening Google...')
                : (ar?'تفعيل ريدر صقر للكتب المدرسية':'Enable EFIPS Full PDF Reader')}
            </button>}
            <p className="max-w-xl text-xs opacity-75 leading-6">
              {ar
              ? 'الموافقة اختيارية وتسمح للتطبيق بقراءة ملفات Google Drive التي يحق لحسابك الوصول إليها. قد تحتاج موافقة مسؤول Google Workspace. لن نرسل رمز Google إلى سيرفر الموقع.'
              : 'Optional Google consent permits the app to read Drive files your account can access. Your Workspace admin may need to approve it. The token stays in your browser.'}
            </p>
            {preview && <button type="button" onClick={() => setShowPreview(true)}
              className="underline text-sky-700 dark:text-sky-300 text-sm font-bold">
              {ar?'جرّب معاينة Google للكتب الصغيرة':'Try Google preview for small PDFs'}
            </button>}
          </section>}
          {showPreview && preview && <div className="efips-reader-preview-host">
            {!embeddedSchoolPreview && <div className="efips-reader-preview-controls" role="status" aria-live="polite">
              {error
                ? <span>{downloadDisabled
                    ? (ar ? 'إعدادات Google Drive تمنع تحميل هذا الكتاب داخل القارئ؛ اقرأه عبر المعاينة.' : 'Drive settings block direct PDF loading. Read with the preview.')
                    : sourceRangeUnsupported
                    ? (ar ? 'هذا المصدر لا يدعم تحميل الصفحات؛ معاينة Drive متاحة للقراءة.' : 'This source does not support page ranges. Use Drive preview.')
                    : sourceNotPdf
                    ? (ar ? 'المصدر لا يرسل ملف PDF صالحًا للقارئ الداخلي.' : 'The source does not return a valid PDF for the internal reader.')
                    : (ar ? 'تعذر فتح القارئ الداخلي؛ يمكنك قراءة الكتاب من معاينة Drive.' : 'The internal reader could not open this book. Read with Drive preview.')}</span>
                : ready
                  ? <span>{ar ? 'القارئ الداخلي وأدوات حفظ الصفحات جاهزة.' : 'The page reader and reading bookmarks are ready.'}</span>
                  : <span>{ar ? 'معاينة الكتاب مفتوحة، وجاري تجهيز أدوات الصفحات والحفظ.' : 'Book preview opened. Page and bookmark tools are loading.'}</span>}
              {ready && !error
                ? <button type="button" onClick={() => setShowPreview(false)}>{ar ? 'استخدام القارئ وحفظ موضع القراءة' : 'Use page reader and save progress'}</button>
                : error
                ? <button type="button" onClick={retry}>{ar ? 'إعادة محاولة القارئ الداخلي' : 'Retry internal reader'}</button>
                : null}
            </div>}
                        <iframe key={embeddedSchoolPreview ? `${bookKey}:${attempt}` : bookKey} src={preview} loading="eager" title={ar ? `معاينة: ${title}` : `Preview: ${title}`}
              referrerPolicy="no-referrer" allow="fullscreen" allowFullScreen />
          </div>}
          {error && !preview && <div className="efips-reader-fallback" role="alert">
            {ar ? 'تعذر فتح هذا الملف داخل القارئ. افتح المصدر في نافذة جديدة.' : 'Could not open this file in the reader. Open the source in a new tab.'}
            <button type="button" onClick={retry}>{ar ? 'إعادة المحاولة' : 'Try again'}</button>
          </div>}
        </div>
    </section>
  </DigitalLibraryDialog>;
}
