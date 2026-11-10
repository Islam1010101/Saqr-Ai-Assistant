import React from 'react';
import type { DigitalLibraryBook } from '../../api/digitalBookData';
import { digitalBookKey } from '../utils/readingPassport';
import { VERIFIED_ARABIC_IMAGE_PAGES_A } from '../data/verifiedArabicImageBooks20261110A';
import { VERIFIED_ARABIC_IMAGE_PAGES_B } from '../data/verifiedArabicImageBooks20261110B';
import { VERIFIED_NATIONAL_IDENTITY_IMAGE_PAGES } from '../data/verifiedNationalIdentityImageBooks20261110';
import { MIGRATED_ARABIC_PHOTO_PAGES_A } from '../data/migratedArabicPhotoPages20261110A';
import { MIGRATED_ARABIC_PHOTO_PAGES_B } from '../data/migratedArabicPhotoPages20261110B';
import { MIGRATED_ARABIC_PHOTO_PAGES_C } from '../data/migratedArabicPhotoPages20261110C';
import { MIGRATED_ARABIC_PHOTO_PAGES_D } from '../data/migratedArabicPhotoPages20261110D';
import { MIGRATED_ARABIC_PHOTO_PAGES_E } from '../data/migratedArabicPhotoPages20261110E';
import { MIGRATED_ARABIC_PHOTO_PAGES_F } from '../data/migratedArabicPhotoPages20261110F';
import { MIGRATED_ARABIC_PHOTO_PAGES_G } from '../data/migratedArabicPhotoPages20261110G';
import { MIGRATED_ARABIC_PHOTO_PAGES_H } from '../data/migratedArabicPhotoPages20261110H';
import { MIGRATED_ARABIC_PHOTO_PAGES_I } from '../data/migratedArabicPhotoPages20261110I';
import { MIGRATED_ARABIC_PHOTO_PAGES_J } from '../data/migratedArabicPhotoPages20261110J';
import { MIGRATED_ARABIC_PHOTO_PAGES_K } from '../data/migratedArabicPhotoPages20261110K';
import { MIGRATED_ARABIC_PHOTO_PAGES_L } from '../data/migratedArabicPhotoPages20261110L';
import { SERIES_ARABIC_PHOTO_PAGES_A } from '../data/seriesArabicPhotoPages20261110A';
import { SERIES_ARABIC_PHOTO_PAGES_B } from '../data/seriesArabicPhotoPages20261110B';
import { SERIES_ARABIC_PHOTO_PAGES_C } from '../data/seriesArabicPhotoPages20261110C';
import { SERIES_ARABIC_PHOTO_PAGES_D } from '../data/seriesArabicPhotoPages20261110D';
import { SERIES_ARABIC_PHOTO_PAGES_E } from '../data/seriesArabicPhotoPages20261110E';
import { SERIES_ARABIC_PHOTO_PAGES_F } from '../data/seriesArabicPhotoPages20261110F';
import { SERIES_ARABIC_PHOTO_PAGES_G } from '../data/seriesArabicPhotoPages20261110G';
import { SERIES_ARABIC_PHOTO_PAGES_H } from '../data/seriesArabicPhotoPages20261110H';
import { SERIES_ARABIC_PHOTO_PAGES_I } from '../data/seriesArabicPhotoPages20261110I';
import { SERIES_ARABIC_PHOTO_PAGES_J } from '../data/seriesArabicPhotoPages20261110J';
import { SERIES_ARABIC_PHOTO_PAGES_K } from '../data/seriesArabicPhotoPages20261110K';
import { SERIES_ARABIC_PHOTO_PAGES_L } from '../data/seriesArabicPhotoPages20261110L';
import { SERIES_ARABIC_PHOTO_PAGES_M } from '../data/seriesArabicPhotoPages20261110M';
import { SERIES_ARABIC_PHOTO_PAGES_N } from '../data/seriesArabicPhotoPages20261110N';
import { SERIES_ARABIC_PHOTO_PAGES_O } from '../data/seriesArabicPhotoPages20261110O';
import { SERIES_ARABIC_PHOTO_PAGES_P } from '../data/seriesArabicPhotoPages20261110P';
import { SERIES_ARABIC_PHOTO_PAGES_Q } from '../data/seriesArabicPhotoPages20261110Q';
import { SERIES_ARABIC_PHOTO_PAGES_R } from '../data/seriesArabicPhotoPages20261110R';
import { SERIES_ARABIC_PHOTO_PAGES_S } from '../data/seriesArabicPhotoPages20261110S';
import { SERIES_ARABIC_PHOTO_PAGES_T } from '../data/seriesArabicPhotoPages20261110T';
import { SERIES_ARABIC_PHOTO_PAGES_U } from '../data/seriesArabicPhotoPages20261110U';
import { SERIES_ARABIC_PHOTO_PAGES_V } from '../data/seriesArabicPhotoPages20261110V';
import { SERIES_ARABIC_PHOTO_PAGES_W } from '../data/seriesArabicPhotoPages20261110W';
import { SERIES_ARABIC_PHOTO_PAGES_X } from '../data/seriesArabicPhotoPages20261110X';
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
    ?? VERIFIED_NATIONAL_IDENTITY_IMAGE_PAGES[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_A[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_B[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_C[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_D[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_E[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_F[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_G[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_H[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_I[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_J[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_K[id]
    ?? MIGRATED_ARABIC_PHOTO_PAGES_L[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_A[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_B[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_C[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_D[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_E[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_F[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_G[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_H[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_I[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_J[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_K[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_L[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_M[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_N[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_O[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_P[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_Q[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_R[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_S[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_T[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_U[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_V[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_W[id]
    ?? SERIES_ARABIC_PHOTO_PAGES_X[id];

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
