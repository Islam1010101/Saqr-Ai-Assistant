export type PdfReadingState = { page: number; bookmarks: number[]; zoom: number };
export const EMPTY_PDF_STATE: PdfReadingState = { page: 1, bookmarks: [], zoom: 1 };
export const clampPdfPage = (page: number, count: number) => Math.max(1, Math.min(Math.trunc(Number(page) || 1), count));
export const parsePdfPage = (value: string) => Number(value.trim().replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 1776)));
export function readerDeviceAccount(): string | null {
  try {
    const u = JSON.parse(localStorage.getItem('current_user') || '{}');
    const id = u.id || u.user_id || u.student_id || u.teacher_id || u.email;
    return id ? `${localStorage.getItem('user_type') || 'reader'}:${id}` : null;
  } catch { return null; }
}
export const pdfReadingStorageKey = (account: string | null, book: string, source: string) =>
  account ? `efips-pdf-reader-v1:${encodeURIComponent(account)}:${encodeURIComponent(book)}:${encodeURIComponent(source)}` : null;
export function readPdfState(key: string | null): PdfReadingState {
  try {
    const state = JSON.parse(key ? localStorage.getItem(key) || 'null' : 'null');
    if (!state) return EMPTY_PDF_STATE;
    return {
      page: Math.max(1, Math.min(100000, Math.trunc(Number(state.page) || 1))),
      bookmarks: Array.isArray(state.bookmarks) ? [...new Set<number>(state.bookmarks.filter((p: unknown): p is number => Number.isInteger(p) && Number(p) > 0 && Number(p) <= 100000))].slice(0, 200) : [],
      zoom: Math.max(.75, Math.min(2, Number(state.zoom) || 1)),
    };
  } catch { return EMPTY_PDF_STATE; }
}
export function writePdfState(key: string | null, state: PdfReadingState): boolean {
  if (!key) return false;
  try { localStorage.setItem(key, JSON.stringify(state)); return true; } catch { return false; }
}
