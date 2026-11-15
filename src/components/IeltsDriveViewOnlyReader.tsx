import React from 'react';
import DigitalLibraryDialog from './DigitalLibraryDialog';
import { useCloudReader } from '../utils/efipsCloud';
import { digitalReaderSource } from '../utils/digitalReaderSource';
import { schoolDriveFileId } from '../utils/schoolDrivePdfRanges';
import './digitalBookReader.css';

/**
 * IELTS resources are restricted to Google Workspace readers. A school
 * Google login does NOT automatically grant a Google Drive API OAuth scope;
 * Google's media-download endpoint can also be forbidden by the file owner.
 *
 * This IELTS-only viewer embeds Google's own PDF preview. Google enforces
 * file ACLs and viewer download/print/copy restrictions. No PDF bytes,
 * Google API tokens or file download URLs are requested by our application.
 * Other books continue to use the original DigitalBookReader unchanged.
 */
export default function IeltsDriveViewOnlyReader({
  title, source, locale, onBack, onClose,
}: {
  title: string;
  source: string;
  locale: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const ar = locale === 'ar';
  const { user, loading } = useCloudReader();
  const fileId = schoolDriveFileId(source);
  const preview = fileId ? digitalReaderSource(source) : null;
  const verifiedSchoolUser = Boolean(user?.id && user.email?.toLowerCase().endsWith('@falcon-school.com'));
  const canPreview = !loading && verifiedSchoolUser && Boolean(preview);

  return (
    <DigitalLibraryDialog title={title} onClose={onClose} variant="reader">
      <section
        dir={ar ? 'rtl' : 'ltr'}
        className="efips-book-reader efips-book-reader--view-only"
        onContextMenu={event => event.preventDefault()}
        onDragStart={event => event.preventDefault()}
        onKeyDownCapture={event => {
          if ((event.metaKey || event.ctrlKey) && ['s','p'].includes(event.key.toLowerCase())) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <header className="efips-reader-header">
          <div className="efips-reader-brand">
            <img src="/school-logo.png" width={64} height={64} alt={ar ? 'شعار المدرسة' : 'School logo'} />
          </div>
          <h2 dir="auto">{title}</h2>
          <span className="efips-reader-view-only-label">
            {ar ? 'قراءة داخل الموقع فقط' : 'Read online only'}
          </span>
          <nav className="efips-reader-nav" aria-label={ar ? 'أدوات عرض المرجع' : 'Reference viewer controls'}>
            <button type="button" onClick={onBack}>
              {ar ? 'تفاصيل الكتاب' : 'Book details'}
            </button>
            <button type="button" data-book-close onClick={onClose}>
              {ar ? 'إغلاق القارئ' : 'Close reader'}
            </button>
          </nav>
        </header>

        {loading ? (
          <div className="efips-reader-stage flex items-center justify-center px-6 text-center">
            <p role="status" className="font-bold text-emerald-800 dark:text-emerald-200">
              {ar ? 'جاري التحقق من حساب المدرسة...' : 'Checking your school account...'}
            </p>
          </div>
        ) : !verifiedSchoolUser ? (
          <div className="efips-reader-stage flex items-center justify-center px-6 text-center">
            <p role="alert" className="max-w-xl text-sm font-bold leading-8">
              {ar
                ? 'قراءة مراجع IELTS متاحة فقط بعد تسجيل الدخول إلى منصة صقر بحساب Google المدرسي المعتمد.'
                : 'IELTS resources require signing in to Saqr with a verified school Google account.'}
            </p>
          </div>
        ) : !preview ? (
          <div className="efips-reader-stage flex items-center justify-center px-6 text-center">
            <p role="alert" className="font-bold">
              {ar ? 'رابط المرجع غير صالح للمعاينة المدرسية.' : 'This reference cannot be previewed.'}
            </p>
          </div>
        ) : (
          <div className="efips-reader-stage">
            <div className="efips-reader-preview-host" aria-label={ar ? 'معاينة مرجع IELTS' : 'IELTS reference preview'}>
              {canPreview && (
                <iframe
                  key={fileId}
                  src={preview}
                  loading="eager"
                  title={(ar ? 'قراءة: ' : 'Read: ') + title}
                  referrerPolicy="no-referrer"
                  allow="fullscreen"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        )}
      </section>
    </DigitalLibraryDialog>
  );
}
