import React from 'react';
import type {DigitalLibraryBook} from '../../api/digitalBookData';
import {digitalBookKey} from '../utils/readingPassport';
import DigitalBookReader from './DigitalBookReader';
import {VERIFIED_HARRY_POTTER_ARABIC_PAGES_A} from '../data/photoOnlyHarryPotter20261110A';
import {VERIFIED_HARRY_POTTER_ARABIC_PAGES_B} from '../data/photoOnlyHarryPotter20261110B';
import {VERIFIED_NG_PAGES_A} from '../data/photoOnlyNationalGeographic20261110A';
import {VERIFIED_NG_PAGES_B} from '../data/photoOnlyNationalGeographic20261110B';
import {VERIFIED_NG_PAGES_C} from '../data/photoOnlyNationalGeographic20261110C';
import {VERIFIED_NEW_UAE_HERITAGE_PAGES} from '../data/photoOnlyNewHeritage20261110';
import {ADDITIONAL_ARABIC_PHOTO_PAGES} from '../data/additionalArabicPhotoBooks20261110';

/** Lazy-loaded photo-only reader, reusing the same EFIPS full-screen features as English books.
 * No source PDF is required. Never enumerate or render ._* macOS sidecar files.
 */
export default function PhotoOnlyArabicBookReader({book,locale,onBack,onClose}:{
 book:DigitalLibraryBook;locale:string;onBack:()=>void;onClose:()=>void;
}){
 const id=String(book.id);
 const pages=VERIFIED_HARRY_POTTER_ARABIC_PAGES_A[id]
   ??VERIFIED_HARRY_POTTER_ARABIC_PAGES_B[id]
   ??VERIFIED_NG_PAGES_A[id]
   ??VERIFIED_NG_PAGES_B[id]
   ??VERIFIED_NG_PAGES_C[id]
   ??VERIFIED_NEW_UAE_HERITAGE_PAGES[id]
   ??ADDITIONAL_ARABIC_PHOTO_PAGES[id];
 if(!pages?.length||pages.length!==book.pageCount){
  return <section role="alert" aria-live="polite" className="p-5 text-center">
    {locale==='ar'?'صور صفحات هذا الكتاب لم تكتمل مراجعتها.':'The verified page set for this title is unavailable.'}
    <button type="button" onClick={onBack}>{locale==='ar'?'العودة إلى بيانات الكتاب':'Back to book details'}</button>
  </section>;
 }
 return <DigitalBookReader title={book.title} source={book.driveLink}
   bookKey={digitalBookKey('ar',book)} locale={locale}
   imagePages={pages} onBack={onBack} onClose={onClose}/>;
}
