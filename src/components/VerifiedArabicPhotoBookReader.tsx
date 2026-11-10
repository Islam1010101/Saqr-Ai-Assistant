import React from 'react';
import type { DigitalLibraryBook } from '../../api/digitalBookData';
import { digitalBookKey } from '../utils/readingPassport';
import { VERIFIED_ARABIC_IMAGE_PAGES_A } from '../data/verifiedArabicImageBooks20261110A';
import { VERIFIED_ARABIC_IMAGE_PAGES_B } from '../data/verifiedArabicImageBooks20261110B';
import { VERIFIED_NATIONAL_IDENTITY_IMAGE_PAGES } from '../data/verifiedNationalIdentityImageBooks20261110';
import DigitalBookReader from './DigitalBookReader';

/** Lazy loaded on book-open; English reader and all original PDF files remain intact.
 * Only use confirmed complete sets of numbered JPEG pages, no macOS ._* files.
 */
export default function VerifiedArabicPhotoBookReader({ book, locale, onBack, onClose }: {
  book: DigitalLibraryBook;
  locale: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const id = String(book.id);
  const pages = VERIFIED_ARABIC_IMAGE_PAGES_A[id]
    ?? VERIFIED_ARABIC_IMAGE_PAGES_B[id]
    ?? VERIFIED_NATIONAL_IDENTITY_IMAGE_PAGES[id];

  if (!pages?.length) {
    return <section role="alert" aria-live="polite">
      {locale === 'ar' ? 'لم تكتمل صور صفحات هذا الكتاب.' : 'Verified pages are unavailable for this book.'}
      <button type="button" onClick={onBack}>
        {locale === 'ar' ? 'العودة لتفاصيل الكتاب' : 'Back to book details'}
      </button>
    </section>;
  }

  return <DigitalBookReader
    title={book.title}
    source={book.driveLink}
    bookKey={digitalBookKey('ar', book)}
    locale={locale}
    imagePages={pages}
    onBack={onBack}
    onClose={onClose}
  />;
}
