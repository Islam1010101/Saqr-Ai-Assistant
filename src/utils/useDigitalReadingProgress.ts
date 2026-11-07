import { useEffect, useMemo, useState } from 'react';
import type { DigitalLibraryBook } from '../../api/digitalBookData';
import { digitalBookKey } from './readingPassport';
import { digitalReaderSource } from './digitalReaderSource';
import { useCloudReader } from './efipsCloud';
import { PDF_READING_CHANGED, pdfReadingStorageKey, readerDeviceAccount, readPdfState, type PdfReadingState } from './pdfReadingState';

/** Read locally stored positions for the current signed-in account and browser only. */
export function useDigitalReadingProgress(books: DigitalLibraryBook[], language: 'ar' | 'en') {
  const { user } = useCloudReader();
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener(PDF_READING_CHANGED, refresh);
    window.addEventListener('storage', refresh);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener(PDF_READING_CHANGED, refresh);
      window.removeEventListener('storage', refresh);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
  return useMemo(() => {
    const account = user?.id || readerDeviceAccount();
    const progress = new Map<string, PdfReadingState>();
    if (!account) return progress;
    for (const book of books) {
      const preview = digitalReaderSource(book.driveLink);
      if (!preview) continue;
      const bookKey = digitalBookKey(language, book);
      const storageKey = pdfReadingStorageKey(account, bookKey, preview);
      const state = readPdfState(storageKey);
      if (state.page > 1 || (state.furthestPage || 0) > 1 || state.bookmarks.length)
        progress.set(bookKey, state);
    }
    return progress;
  }, [books, language, user?.id, revision]);
}
