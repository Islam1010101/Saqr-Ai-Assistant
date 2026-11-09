import React from 'react';
import type { DigitalLibraryBook } from '../../api/digitalBookData';
import { digitalBookKey } from '../utils/readingPassport';
import { REMAINING_ENGLISH_IMAGE_BOOK_PAGES } from '../data/remainingEnglishImageBooks20261109';
import DigitalBookReader from './DigitalBookReader';

/**
 * Lazy-loaded only for the five newly completed English photo books.
 * Keeps the large page-ID manifest out of the main library catalogue bundle.
 */
export default function RemainingEnglishPhotoBookReader({book,locale,onBack,onClose}:{
  book:DigitalLibraryBook;locale:string;onBack:()=>void;onClose:()=>void;
}){
  const pages=REMAINING_ENGLISH_IMAGE_BOOK_PAGES[String(book.id)];
  if(!pages?.length)return <section role="alert" aria-live="polite">
    {locale==='ar'?'صور هذا الكتاب غير مكتملة.':'This book has no verified image pages.'}
    <button type="button" onClick={onBack}>{locale==='ar'?'العودة لتفاصيل الكتاب':'Back to book details'}</button>
  </section>;
  return <DigitalBookReader title={book.title} source={book.driveLink}
    bookKey={digitalBookKey('en',book)} locale={locale}
    schoolOnly={Boolean(book.requiresSchoolGoogleAccess)}
    sourceSizeBytes={book.fileSizeBytes} imagePages={pages}
    onBack={onBack} onClose={onClose}/>;
}
