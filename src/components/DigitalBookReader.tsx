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
  const { user, loading } = useCloudReader();
  const storageKey = pdfReadingStorageKey(user?.id || readerDeviceAccount(), bookKey, preview || source);
  const [error, setError] = useState<Error | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const back = useRef<HTMLButtonElement>(null);
  useEffect(() => { back.current?.focus(); }, []);
  const downloadDisabled = (error as Error & { code?: string })?.code === 'SOURCE_DOWNLOAD_DISABLED';
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
      {loading ? <p className="efips-reader-note" role="status">{ar ? 'جاري فتح القارئ…' : 'Opening reader…'}</p>
        : error ? <>
          <div className="efips-reader-fallback">
            <p role="alert">{downloadDisabled
              ? (ar ? 'إعدادات هذا الملف في Google Drive تمنع تنزيله، لذلك لا يمكن تشغيل أدوات الصفحات وحفظ الموضع عليه داخل الموقع.' : 'This file’s Google Drive settings disable downloads, so page controls and saved reading position cannot be used inside the site.')
              : (ar ? 'تعذر تحميل ملف الكتاب داخل القارئ. يمكنك استخدام معاينة Drive أو فتح المصدر.' : 'The book could not be loaded in the reader. Use the Drive preview or open the source.')}</p>
            {preview && !showPreview && <button type="button" onClick={() => setShowPreview(true)}>{ar ? 'عرض معاينة Drive' : 'Show Drive preview'}</button>}
            {showPreview && <p>{ar ? 'معاينة Drive لا تحفظ موضع القراءة في الموقع.' : 'Drive preview does not save your reading position on this site.'}</p>}
          </div>
          {showPreview && preview && <iframe src={preview} title={ar ? `معاينة: ${title}` : `Preview: ${title}`} referrerPolicy="no-referrer" allow="fullscreen" allowFullScreen />}
        </> : <PdfBookPages key={storageKey || bookKey} bookKey={bookKey} storageKey={storageKey} ar={ar} onError={setError} />}
    </section>
  </DigitalLibraryDialog>;
}
