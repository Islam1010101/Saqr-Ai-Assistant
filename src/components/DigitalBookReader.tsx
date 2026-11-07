import React, { useEffect, useRef, useState } from 'react';
import DigitalLibraryDialog from './DigitalLibraryDialog';
import PdfBookPages from './PdfBookPages';
import { digitalReaderSource } from '../utils/digitalReaderSource';
import { useCloudReader } from '../utils/efipsCloud';
import { pdfReadingStorageKey, readerDeviceAccount } from '../utils/pdfReadingState';
import './digitalBookReader.css';

export default function DigitalBookReader({ title, source, bookKey, locale, onBack, onClose }: {
  title: string; source: string; bookKey: string; locale: string; onBack: () => void; onClose: () => void;
}) {
  const ar = locale === 'ar';
  const preview = digitalReaderSource(source);
  const [deviceAccount] = useState(() => readerDeviceAccount());
  const { user, loading } = useCloudReader();
  // Start immediately for the already authenticated site user. Do not block on a second
  // Supabase getUser() round trip: it can be slow on mobile data.
  const waitingForIdentity = !deviceAccount && loading;
  const storageKey = pdfReadingStorageKey(deviceAccount || user?.id || null, bookKey, preview || source);
  const [error, setError] = useState<Error | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [slow, setSlow] = useState(false);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (ready || error || waitingForIdentity) return;
    setSlow(false);
    const timer = window.setTimeout(() => setSlow(true), 6500);
    return () => window.clearTimeout(timer);
  }, [bookKey, attempt, ready, error, waitingForIdentity]);
  const retry = () => { setShowPreview(false); setError(null); setReady(false); setSlow(false); setAttempt(v => v + 1); };
  const back = useRef<HTMLButtonElement>(null);
  useEffect(() => { back.current?.focus(); }, []);
  const errorCode = (error as Error & { code?: string })?.code || error?.message;
  const downloadDisabled = errorCode === 'SOURCE_DOWNLOAD_DISABLED';
  const sourceRangeUnsupported = errorCode === 'SOURCE_RANGE_UNSUPPORTED';
  const sourceNotPdf = errorCode === 'SOURCE_NOT_PDF';
  return <DigitalLibraryDialog title={title} onClose={onClose} variant="reader">
    <section className="efips-book-reader" dir={ar ? 'rtl' : 'ltr'}>
      <header>
        <div className="efips-reader-brand">EFIPS Library</div>
        <h2 dir="auto">{title}</h2>
        <nav aria-label={ar ? 'أدوات القراءة' : 'Reading controls'}>
          <button ref={back} type="button" onClick={onBack}>{ar ? 'تفاصيل الكتاب' : 'Book details'}</button>
          <a href={source} target="_blank" rel="noopener noreferrer">{ar ? 'فتح المصدر في نافذة جديدة' : 'Open source in new tab'}</a>
          <button type="button" data-book-close onClick={onClose}>{ar ? 'إغلاق القارئ' : 'Close reader'}</button>
        </nav>
      </header>
      {waitingForIdentity ? <p className="efips-reader-note" role="status">{ar ? 'جاري التحقق من حساب القارئ…' : 'Checking reader account…'}</p>
        : error || showPreview ? <>
          <div className="efips-reader-fallback">
            <p role="alert">{!error
              ? (ar ? 'عرض معاينة Drive أثناء انتظار القارئ الداخلي.' : 'Showing Drive preview while the on-site reader loads.')
              : downloadDisabled
              ? (ar ? 'إعدادات هذا الملف في Google Drive تمنع تنزيله، لذلك لا يمكن تشغيل أدوات الصفحات وحفظ الموضع عليه داخل الموقع.' : 'This file’s Google Drive settings disable downloads, so page controls and saved reading position cannot be used inside the site.')
              : sourceRangeUnsupported
              ? (ar ? 'المصدر لا يدعم تحميل صفحات PDF بشكل جزئي. يمكنك قراءة الكتاب من معاينة Drive مباشرة.' : 'The source does not support PDF byte ranges. Read the book using Drive preview instead.')
              : sourceNotPdf
              ? (ar ? 'المصدر لا يرجع ملف PDF صالحًا للقارئ. تظهر معاينة Drive إن كانت متاحة.' : 'The source did not return a valid PDF. Drive preview is shown when available.')
              : (ar ? 'تعذر تشغيل الصفحات داخل القارئ حاليًا. سنعرض الكتاب من معاينة Drive إن كانت متاحة.' : 'The PDF page reader is unavailable for this file. Drive preview is shown when available.')}</p>
            {preview && <p>{ar ? 'في معاينة Drive لا تتوفر علامات الصفحات وحفظ موضع القراءة داخل الموقع.' : 'In Drive preview, page bookmarks and on-site reading progress are unavailable.'}</p>}
            <button type="button" onClick={retry}>{ar ? 'إعادة محاولة فتح القارئ' : 'Retry page reader'}</button>
          </div>
          {preview && <iframe src={preview} title={ar ? `معاينة: ${title}` : `Preview: ${title}`} referrerPolicy="no-referrer" allow="fullscreen" allowFullScreen />}
        </> : <>
          {!ready && slow && preview && <div className="efips-reader-slow" role="status">
            <span>{ar ? 'تحميل صفحات الكتاب يستغرق وقتًا أطول من المعتاد.' : 'Loading the book pages is taking longer than usual.'}</span>
            <button type="button" onClick={() => setShowPreview(true)}>{ar ? 'اقرأ عبر معاينة Drive الآن' : 'Read with Drive preview now'}</button>
          </div>}
          <PdfBookPages key={`${storageKey || bookKey}:${attempt}`} bookKey={bookKey} storageKey={storageKey} ar={ar} onReady={() => setReady(true)} onError={setError} />
        </>}
    </section>
  </DigitalLibraryDialog>;
}
