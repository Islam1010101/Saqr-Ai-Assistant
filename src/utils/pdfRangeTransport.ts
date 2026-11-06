export const PDF_BYTE_CHUNK = 1024 * 1024;

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
