import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../../api/digitalBookData.js';
import { NATIONAL_IDENTITY_DIGITAL_BOOKS } from '../../api/nationalIdentityDigitalBooks.js';

export class PdfSourceError extends Error {
  code: string;
  status: number;
  constructor(code: string, status: number) { super(code); this.code = code; this.status = status; }
}
export function readerFileId(key: string): string | null {
  const match = /^digital:(ar|en):([a-zA-Z0-9_-]{1,80})$/.exec(key);
  if (!match) return null;
  const books = match[1] === 'ar' ? [...ARABIC_LIBRARY_DATABASE, ...NATIONAL_IDENTITY_DIGITAL_BOOKS] : ENGLISH_LIBRARY_DATABASE;
  const book = books.find(b => String(b.id) === match[2]);
  // The anonymous byte-range proxy must never serve a school-domain-only
  // PDF, even if its Drive sharing settings change in the future.
  if (!book || book.requiresSchoolGoogleAccess) return null;
  return book.driveLink.match(/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)(?:\/|$)/)?.[1] || null;
}
const MAX_RANGE = 1024 * 1024;
export function readerByteRange(start: unknown, end: unknown): [number, number] | null {
  if (typeof start !== 'string' || typeof end !== 'string' || !/^\d{1,9}$/.test(start) || !/^\d{1,9}$/.test(end)) return null;
  const a = Number(start), b = Number(end);
  return b >= a && b - a < MAX_RANGE && b < 300 * 1024 * 1024 ? [a, b] : null;
}
const allowedDownload = (url: URL) => url.protocol === 'https:' && !url.port && !url.username && !url.password && (
  url.hostname === 'drive.google.com' || url.hostname === 'drive.usercontent.google.com' || url.hostname.endsWith('.googleusercontent.com')
);

function noticeAttribute(tag: string, name: string): string | undefined {
  for (const match of tag.matchAll(/(?:^|\s)([\w-]+)\s*=\s*(["'])(.*?)\2/g))
    if (match[1].toLowerCase() === name) return match[3].replace(/&amp;/g, '&');
  return undefined;
}

/** Follow only Google's ordinary large-file confirmation for this same public book. */
export function publicDownloadConfirmation(html: string, fileId: string): URL | null {
  if (!/Virus scan warning/i.test(html) || !/too large for Google to scan for viruses/i.test(html) ||
      /virus has been detected|file (?:is|was) infected|identified as malicious/i.test(html)) return null;
  const form = [...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/gi)]
    .map(match => match[0]).find(block => noticeAttribute(block.slice(0, block.indexOf('>') + 1), 'id') === 'download-form');
  if (!form) return null;
  try {
    const action = new URL(noticeAttribute(form.slice(0, form.indexOf('>') + 1), 'action') || '');
    if (action.origin !== 'https://drive.usercontent.google.com' || action.pathname !== '/download' ||
        action.username || action.password || action.hash) return null;
    const fields: Record<string, string> = {};
    for (const match of form.matchAll(/<input\b[^>]*>/gi)) {
      const name = noticeAttribute(match[0], 'name'), value = noticeAttribute(match[0], 'value');
      if (name && value && ['id', 'export', 'confirm', 'uuid'].includes(name)) fields[name] = value;
    }
    if (fields.id !== fileId || fields.export !== 'download' || fields.confirm !== 't' ||
        !/^[a-zA-Z0-9_-]{3,180}$/.test(fields.uuid || '')) return null;
    const url = new URL('https://drive.usercontent.google.com/download');
    for (const [name, value] of Object.entries(fields)) url.searchParams.set(name, value);
    return url;
  } catch { return null; }
}

async function readDownloadNotice(response: Response): Promise<string> {
  const reader = response.body!.getReader(), decoder = new TextDecoder();
  let remaining = 65536, text = '';
  try {
    while (remaining > 0) {
      const { value, done } = await reader.read(); if (done) break;
      const part = value.subarray(0, remaining); remaining -= part.length;
      text += decoder.decode(part, { stream: true });
    }
    return text + decoder.decode();
  } finally { await reader.cancel(); }
}

/** Public download only: no Google credentials, cookies, private-file access or arbitrary URLs. */
export async function readPublicPdfRange(fileId: string, start: number, end: number, fetcher: typeof fetch = fetch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  let response: Response;
  let confirmed = false;
  try {
    let url = new URL(`https://drive.google.com/uc?export=download&id=${fileId}`);
    for (let redirects = 0; ; redirects++) {
      if (!allowedDownload(url) || redirects > 4) throw new PdfSourceError('SOURCE_UNAVAILABLE', 502);
      response = await fetcher(url, { redirect: 'manual', signal: controller.signal,
        headers: { Range: `bytes=${start}-${end}`, 'Accept-Encoding': 'identity' } });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const next = response.headers.get('location'); await response.body?.cancel();
        if (!next) throw new PdfSourceError('SOURCE_UNAVAILABLE', 502);
        url = new URL(next, url); continue;
      }
      if (!response.ok || !response.body) throw new PdfSourceError('SOURCE_UNAVAILABLE', 502);
      if ((response.headers.get('content-type') || '').includes('text/html')) {
        const message = await readDownloadNotice(response);
        if (/owner hasn.t given you permission to download|Only the owner and editors can download/i.test(message))
          throw new PdfSourceError('SOURCE_DOWNLOAD_DISABLED', 403);
        const next = !confirmed ? publicDownloadConfirmation(message, fileId) : null;
        if (!next) throw new PdfSourceError('SOURCE_UNAVAILABLE', 502);
        confirmed = true; url = next; continue;
      }
      break;
    }
    if (!response.ok || !response.body) throw new PdfSourceError('SOURCE_UNAVAILABLE', 502);
    const reader = response.body.getReader();
    const range = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(response.headers.get('content-range') || '');
    const length = range ? Number(range[3]) : Number(response.headers.get('content-length'));
    if (!Number.isSafeInteger(length) || length <= 0 || length > 300 * 1024 * 1024) { await reader.cancel(); throw new PdfSourceError('SOURCE_UNAVAILABLE', 502); }
    if (range && Number(range[1]) !== start) { await reader.cancel(); throw new PdfSourceError('SOURCE_UNAVAILABLE', 502); }
    // A small source that ignores Range can be sliced; large sources must support byte ranges.
    if (!range && length > MAX_RANGE) { await reader.cancel(); throw new PdfSourceError('SOURCE_RANGE_UNSUPPORTED', 422); }
    const expected = Math.min(end, length - 1) - start + 1;
    if (expected <= 0) { await reader.cancel(); throw new PdfSourceError('INVALID_RANGE', 416); }
    const data = new Uint8Array(expected); let written = 0; let skip = range ? 0 : start;
    while (written < expected) {
      const { value, done } = await reader.read();
      if (done) break;
      const skipped = Math.min(skip, value.length); skip -= skipped;
      const part = value.subarray(skipped, skipped + expected - written); data.set(part, written); written += part.length;
    }
    await reader.cancel();
    if (written !== expected || (start === 0 && new TextDecoder().decode(data.subarray(0, 5)) !== '%PDF-')) throw new PdfSourceError('SOURCE_NOT_PDF', 422);
    return { data, length };
  } catch (error) {
    if (error instanceof PdfSourceError) throw error;
    throw new PdfSourceError('SOURCE_UNAVAILABLE', 502);
  } finally { clearTimeout(timeout); }
}
