import type { PDFDocumentLoadingTask } from 'pdfjs-dist';

export class PdfReaderError extends Error {
  code: string;
  constructor(code: string) { super(code); this.code = code; }
}
export async function createPdfBookTask(bookKey: string, signal: AbortSignal, onError: (error: Error) => void): Promise<PDFDocumentLoadingTask> {
  const endpoint = `/api/digital-book?book=${encodeURIComponent(bookKey)}`;
  const response = await fetch(`${endpoint}&info=1`, { signal });
  const info = await response.json();
  if (!response.ok) throw new PdfReaderError(info.code || 'SOURCE_UNAVAILABLE');
  if (!Number.isSafeInteger(info.length) || info.length < 5 || info.length > 300 * 1024 * 1024) throw new PdfReaderError('SOURCE_NOT_PDF');
  const [pdf, worker] = await Promise.all([
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
  ]);
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  pdf.GlobalWorkerOptions.workerSrc = worker.default;
  const rangeController = new AbortController();
  let task: PDFDocumentLoadingTask;
  class BookRange extends pdf.PDFDataRangeTransport {
    requestDataRange(begin: number, end: number) {
      void (async () => {
        for (let start = begin; start < end; start += 262144) {
          const finish = Math.min(start + 262144, end) - 1;
          const r = await fetch(`${endpoint}&start=${start}&end=${finish}`, { signal: rangeController.signal });
          if (r.status !== 206) throw new PdfReaderError('SOURCE_UNAVAILABLE');
          const bytes = new Uint8Array(await r.arrayBuffer());
          if (bytes.length !== finish - start + 1) throw new PdfReaderError('SOURCE_UNAVAILABLE');
          this.onDataRange(start, bytes);
        }
      })().catch(error => {
        if (!rangeController.signal.aborted && !signal.aborted) { onError(error); void task?.destroy(); }
      });
    }
    abort() { rangeController.abort(); }
  }
  const transport = new BookRange(info.length, new Uint8Array());
  task = pdf.getDocument({ range: transport, rangeChunkSize: 262144,
    disableStream: true, disableAutoFetch: true,
    cMapUrl: '/pdfjs/cmaps/', cMapPacked: true,
    standardFontDataUrl: '/pdfjs/standard_fonts/', wasmUrl: '/pdfjs/wasm/',
  });
  signal.addEventListener('abort', () => { rangeController.abort(); void task.destroy(); }, { once: true });
  return task;
}
