import type { PDFDocumentLoadingTask } from 'pdfjs-dist';
import { fetchPdfByteRange, PDF_BYTE_CHUNK } from './pdfRangeTransport';

export class PdfReaderError extends Error {
  code: string;
  constructor(code: string) { super(code); this.code = code; }
}
export async function createPdfBookTask(bookKey: string, signal: AbortSignal, onError: (error: Error) => void): Promise<PDFDocumentLoadingTask> {
  const endpoint = `/api/digital-book?book=${encodeURIComponent(bookKey)}`;
  // Network metadata and the PDF.js viewer/worker download happen concurrently.
  // Previously the mobile browser waited for Google Drive before even fetching PDF.js.
  const metadata = (async () => {
    const response = await fetch(`${endpoint}&info=1`, { signal });
    const info = await response.json().catch(() => ({}));
    if (!response.ok) throw new PdfReaderError(info.code || 'SOURCE_UNAVAILABLE');
    if (!Number.isSafeInteger(info.length) || info.length < 5 || info.length > 300 * 1024 * 1024)
      throw new PdfReaderError('SOURCE_NOT_PDF');
    return info as { length: number };
  })();
  const [info, pdf, worker] = await Promise.all([
    metadata,
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
  ]);
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  pdf.GlobalWorkerOptions.workerSrc = worker.default;
  const rangeController = new AbortController();
  let task: PDFDocumentLoadingTask;
  class BookRange extends pdf.PDFDataRangeTransport {
    requestDataRange(begin: number, end: number) {
      void fetchPdfByteRange(endpoint, begin, end, rangeController.signal).then(bytes => {
        if (!rangeController.signal.aborted && !signal.aborted) this.onDataRange(begin, bytes);
      }).catch(error => {
        if (!rangeController.signal.aborted && !signal.aborted) { onError(error); void task?.destroy(); }
      });
    }
    abort() { rangeController.abort(); }
  }
  const transport = new BookRange(info.length, new Uint8Array());
  task = pdf.getDocument({ range: transport, rangeChunkSize: PDF_BYTE_CHUNK,
    disableStream: true, disableAutoFetch: true,
    cMapUrl: '/pdfjs/cmaps/', cMapPacked: true,
    standardFontDataUrl: '/pdfjs/standard_fonts/', wasmUrl: '/pdfjs/wasm/',
  });
  signal.addEventListener('abort', () => { rangeController.abort(); void task.destroy(); }, { once: true });
  return task;
}
