import React, { useEffect, useRef, useState } from 'react';
import DigitalLibraryDialog from './DigitalLibraryDialog';
import PdfBookPages from './PdfBookPages';
import { digitalReaderSource } from '../utils/digitalReaderSource';
import { useCloudReader } from '../utils/efipsCloud';
import { pdfReadingStorageKey, readerDeviceAccount } from '../utils/pdfReadingState';
import './digitalBookReader.css';

export default function DigitalBookReader({ title, source, bookKey, locale, onBack, onClose, schoolOnly = false }: {
  title: string; source: string; bookKey: string; locale: string; onBack: () => void; onClose: () => void;
  /** School-domain PDFs can be previewed by a signed-in school user, not fetched by the anonymous public-PDF endpoint. */
  schoolOnly?: boolean;
}) {
  const ar = locale === 'ar';
  const preview = digitalReaderSource(source);
  const embeddedSchoolPreview = schoolOnly && Boolean(preview);
  const [deviceAccount] = useState(() => readerDeviceAccount());
  const { user } = useCloudReader();
  // Rendering the Drive book must never wait for an additional auth call.
  const storageKey = pdfReadingStorageKey(deviceAccount || user?.id || null, bookKey, preview || source);
  const [error, setError] = useState<Error | null>(null);
  // Open the known book preview on the very first render, no 3-second fallback.
  const [showPreview, setShowPreview] = useState(() => Boolean(preview));
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Keep the on-site PDF reader mounted in the background so that page
  // bookmarks and saved position remain available as soon as it is ready.
  useEffect(() => {
    setError(null); setShowPreview(Boolean(preview)); setReady(false); setAttempt(0);
  }, [bookKey, source, preview, schoolOnly]);
  const retry = () => { setError(null); setReady(false); setAttempt(v => v + 1); };
  const reportReaderError = (failure: Error) => { setError(failure); setShowPreview(true); };
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
          {!error && !schoolOnly && <div className="efips-reader-native" aria-hidden={showPreview}>
            <PdfBookPages key={`${storageKey || bookKey}:${attempt}`} bookKey={bookKey}
              storageKey={storageKey} ar={ar} onReady={() => setReady(true)}
              onError={reportReaderError} />
          </div>}
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
