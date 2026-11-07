export const PDF_BYTE_CHUNK = 1024 * 1024;

/**
 * Fetch the opening PDF bytes and its total size in ONE request. PDF.js can
 * use initialData directly instead of re-fetching the same first megabyte
 * after a separate Google Drive metadata request.
 */
export async function fetchPdfBootstrap(endpoint: string, signal: AbortSignal, fetcher: typeof fetch = fetch):
  Promise<{ length: number; initialData: Uint8Array }> {
  const response = await fetcher(`${endpoint}&start=0&end=${PDF_BYTE_CHUNK - 1}`, { signal });
  if (response.status !== 206) {
    const error = await response.json().catch(() => ({}));
    throw new Error(typeof error?.code === 'string' ? error.code : 'SOURCE_UNAVAILABLE');
  }
  const match = /^bytes 0-(\d+)\/(\d+)$/.exec(response.headers.get('content-range') || '');
  if (!match) throw new Error('SOURCE_UNAVAILABLE');
  const last = Number(match[1]), length = Number(match[2]);
  if (!Number.isSafeInteger(length) || length < 5 || length > 300 * 1024 * 1024
    || !Number.isSafeInteger(last) || last < 4 || last >= PDF_BYTE_CHUNK || last >= length)
    throw new Error('SOURCE_NOT_PDF');
  const initialData = new Uint8Array(await response.arrayBuffer());
  if (initialData.length !== last + 1
    || new TextDecoder().decode(initialData.subarray(0, 5)) !== '%PDF-')
    throw new Error('SOURCE_NOT_PDF');
  return { length, initialData };
}

/** PDF.js needs one complete callback per requested range, even when HTTP uses smaller parts. */
export async function fetchPdfByteRange(endpoint: string, begin: number, end: number, signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<Uint8Array> {
  if (!Number.isSafeInteger(begin) || !Number.isSafeInteger(end) || begin < 0 || end <= begin || end > 300 * 1024 * 1024)
    throw new Error('INVALID_RANGE');
  const result = new Uint8Array(end - begin);
  const starts = Array.from({ length: Math.ceil((end - begin) / PDF_BYTE_CHUNK) }, (_, index) => begin + index * PDF_BYTE_CHUNK);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(3, starts.length) }, async () => {
    while (cursor < starts.length) {
      const start = starts[cursor++];
      const finish = Math.min(start + PDF_BYTE_CHUNK, end) - 1;
      const response = await fetcher(`${endpoint}&start=${start}&end=${finish}`, { signal });
      if (response.status !== 206) throw new Error('SOURCE_UNAVAILABLE');
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length !== finish - start + 1) throw new Error('SOURCE_UNAVAILABLE');
      result.set(bytes, start - begin);
    }
  }));
  return result;
}
