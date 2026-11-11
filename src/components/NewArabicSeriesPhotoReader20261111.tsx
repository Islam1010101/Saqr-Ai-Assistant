import React, { useEffect, useState } from 'react';
import type { DigitalLibraryBook } from '../../api/digitalBookData';
import { digitalBookKey } from '../utils/readingPassport';
import { NEW_SERIES_PHOTO_CHUNK_BY_ID } from '../data/newSeriesPhotoRouting20261111';
import DigitalBookReader from './DigitalBookReader';

type Page = {page:number;fileId:string};
type Manifest = Readonly<Record<string,ReadonlyArray<Page>>>;
/** Each book loads only its own small manifest instead of loading the entire 14,635-page collection on mobile. */
const MANIFEST_LOADERS: Record<string, () => Promise<Manifest>> = {
  AB: () => import('../data/seriesArabicPhotoPages20261110AB').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AB),
  AC: () => import('../data/seriesArabicPhotoPages20261110AC').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AC),
  AD: () => import('../data/seriesArabicPhotoPages20261110AD').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AD),
  AE: () => import('../data/seriesArabicPhotoPages20261110AE').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AE),
  AF: () => import('../data/seriesArabicPhotoPages20261110AF').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AF),
  AG: () => import('../data/seriesArabicPhotoPages20261110AG').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AG),
  AH: () => import('../data/seriesArabicPhotoPages20261110AH').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AH),
  AI: () => import('../data/seriesArabicPhotoPages20261110AI').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AI),
  AJ: () => import('../data/seriesArabicPhotoPages20261110AJ').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AJ),
  AK: () => import('../data/seriesArabicPhotoPages20261110AK').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AK),
  AL: () => import('../data/seriesArabicPhotoPages20261110AL').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AL),
  AM: () => import('../data/seriesArabicPhotoPages20261110AM').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AM),
  AN: () => import('../data/seriesArabicPhotoPages20261110AN').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AN),
  AO: () => import('../data/seriesArabicPhotoPages20261110AO').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AO),
  AP: () => import('../data/seriesArabicPhotoPages20261110AP').then(module => module.SERIES_ARABIC_PHOTO_PAGES_AP),
};

export default function NewArabicSeriesPhotoReader20261111({ book, locale, onBack, onClose }: {
  book: DigitalLibraryBook;
  locale: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const id = String(book.id);
  const [pages, setPages] = useState<ReadonlyArray<Page> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setPages(null);
    setFailed(false);
    const load = MANIFEST_LOADERS[NEW_SERIES_PHOTO_CHUNK_BY_ID[id]];
    if (!load) {
      setFailed(true);
      return () => {active = false;};
    }
    void load().then(manifest => {
      if (!active) return;
      const found = manifest[id];
      if (found?.length) setPages(found);
      else setFailed(true);
    }).catch(() => {if (active) setFailed(true);});
    return () => {active = false;};
  }, [id]);

  if (!pages) {
    return <section className="p-8 text-center font-bold text-emerald-700 dark:text-emerald-200" role={failed ? 'alert' : 'status'}>
      {failed ? (locale === 'ar' ? 'تعذر تحميل صور هذا الكتاب.' : 'Could not load the photographed pages.')
        : (locale === 'ar' ? 'جار تجهيز صفحات الكتاب...' : 'Preparing book pages...')}
      {failed && <button type="button" onClick={onBack} className="block mx-auto mt-4 underline">{locale === 'ar' ? 'العودة لتفاصيل الكتاب' : 'Back to book details'}</button>}
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
