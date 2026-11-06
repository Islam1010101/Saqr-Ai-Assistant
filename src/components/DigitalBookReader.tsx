import React, { useEffect, useRef } from 'react';
import DigitalLibraryDialog from './DigitalLibraryDialog';
import { digitalReaderSource } from '../utils/digitalReaderSource';
import './digitalBookReader.css';

export default function DigitalBookReader({ title, source, locale, onBack, onClose }: {
  title: string; source: string; locale: string; onBack: () => void; onClose: () => void;
}) {
  const ar = locale === 'ar';
  const preview = digitalReaderSource(source);
  const back = useRef<HTMLButtonElement>(null);
  useEffect(() => { back.current?.focus(); }, []);
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
      <p className="efips-reader-note">{ar
        ? 'معاينة Google Drive. إذا لم يظهر الكتاب، افتح المصدر. موضع القراءة لا يُحفظ تلقائيًا في هذه المعاينة.'
        : 'Google Drive preview. If the book does not appear, open the source. Your reading position is not saved automatically in this preview.'}</p>
      {preview ? <iframe src={preview} title={ar ? `قراءة: ${title}` : `Read: ${title}`}
        referrerPolicy="no-referrer" allow="fullscreen" allowFullScreen />
        : <p className="efips-reader-unavailable">{ar ? 'هذا المصدر لا يدعم المعاينة الداخلية. استخدم زر فتح المصدر.' : 'This source does not support an embedded preview. Use Open source.'}</p>}
    </section>
  </DigitalLibraryDialog>;
}
