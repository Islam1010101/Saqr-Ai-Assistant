import type { PDFDocumentLoadingTask } from 'pdfjs-dist';
import { fetchPdfBootstrap, fetchPdfByteRange, PDF_BYTE_CHUNK } from './pdfRangeTransport';

export class PdfReaderError extends Error {
  code: string;
  constructor(code: string) { super(code); this.code = code; }
}
export async function createPdfBookTask(bookKey: string, signal: AbortSignal, onError: (error: Error) => void): Promise<PDFDocumentLoadingTask> {
  const endpoint = `/api/digital-book?book=${encodeURIComponent(bookKey)}`;
  // One network trip returns both the total file size and the first PDF bytes.
  // Import PDF.js concurrently so the phone never waits for a second metadata call.
  const [bootstrap, pdf, worker] = await Promise.all([
    fetchPdfBootstrap(endpoint, signal),
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
  const transport = new BookRange(bootstrap.length, bootstrap.initialData);
  task = pdf.getDocument({ range: transport, rangeChunkSize: PDF_BYTE_CHUNK,
    disableStream: true, disableAutoFetch: true,
    cMapUrl: '/pdfjs/cmaps/', cMapPacked: true,
    standardFontDataUrl: '/pdfjs/standard_fonts/', wasmUrl: '/pdfjs/wasm/',
  });
  signal.addEventListener('abort', () => { rangeController.abort(); void task.destroy(); }, { once: true });
  return task;
}
