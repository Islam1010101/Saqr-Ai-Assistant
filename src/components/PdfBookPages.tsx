import React, { useEffect, useId, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask, PDFDocumentLoadingTask } from 'pdfjs-dist';
import { createPdfBookTask, createSchoolDrivePdfBookTask } from '../utils/pdfBookLoader';
import { clampPdfPage, parsePdfPage, pdfProgressPercent, readPdfState, writePdfState } from '../utils/pdfReadingState';

export default function PdfBookPages({ bookKey, storageKey, ar, onError, onReady, schoolAccess }: {
  bookKey: string; storageKey: string | null; ar: boolean; onError: (error: Error) => void; onReady?: () => void;
  /** Browser-only Google OAuth bearer token for authenticated, range-based school PDFs. */
  schoolAccess?: { fileId: string; token: string } | null;
}) {
  const [initial] = useState(() => readPdfState(storageKey));
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(initial.page);
  const [pageInput, setPageInput] = useState(String(initial.page));
  const [zoom, setZoom] = useState(initial.zoom);
  const furthestPage = useRef(initial.furthestPage || initial.page);
  const [bookmarks, setBookmarks] = useState(initial.bookmarks);
  const [renderedPage, setRenderedPage] = useState(0);
  const [busy, setBusy] = useState(true);
  const [saved, setSaved] = useState<boolean | null>(null);
  const [pageText, setPageText] = useState('');
  const [width, setWidth] = useState(0);
  const [pageError, setPageError] = useState(false);
  const [toolsVisible, setToolsVisible] = useState(() => typeof window === 'undefined' || (window.innerWidth >= 640 && window.innerHeight >= 600));
  const toolsId = useId();
  const surface = useRef<HTMLDivElement>(null);
  const renderedContent = useRef<HTMLDivElement>(null);
  const errorCallback = useRef(onError);
  const readyCallback = useRef(onReady);
  useEffect(() => { errorCallback.current = onError; }, [onError]);
  useEffect(() => { readyCallback.current = onReady; }, [onReady]);
  useEffect(() => {
    const node = surface.current;
    if (!node) return;
    const measure = () => setWidth(node.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') { window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure); }
    const observer = new ResizeObserver(measure); observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const controller = new AbortController(); let task: PDFDocumentLoadingTask | null = null;
    void (async () => {
      task = schoolAccess
        ? await createSchoolDrivePdfBookTask(schoolAccess.fileId, schoolAccess.token, controller.signal, error => errorCallback.current(error))
        : await createPdfBookTask(bookKey, controller.signal, error => errorCallback.current(error));
      const doc = await task.promise;
      if (controller.signal.aborted) return;
      const valid = clampPdfPage(initial.page, doc.numPages);
      setPage(valid); setPageInput(String(valid));
      setBookmarks(old => old.filter(p => p <= doc.numPages)); setPdf(doc);
    })().catch(error => { if (!controller.signal.aborted) errorCallback.current(error); });
    return () => { controller.abort(); void task?.destroy(); };
  }, [bookKey, initial.page, schoolAccess?.fileId, schoolAccess?.token]);
  useEffect(() => {
    if (!pdf || !width) return;
    let disposed = false; let task: RenderTask | undefined;
    setBusy(true); setPageError(false); setPageText('');
    void (async () => {
      const documentPage = await pdf.getPage(page);
      if (disposed) return;
      const original = documentPage.getViewport({ scale: 1 });
      const viewport = documentPage.getViewport({ scale: Math.max(.1, (width - 24) / original.width) * zoom });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2, 4096 / viewport.width, Math.sqrt(16000000 / (viewport.width * viewport.height)));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(viewport.width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(viewport.height * pixelRatio));
      canvas.style.width = `${viewport.width}px`; canvas.style.height = `${viewport.height}px`;
      canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', ar ? `الصفحة ${page}` : `Page ${page}`);
      renderedContent.current?.replaceChildren(canvas);
      task = documentPage.render({ canvas, viewport, transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0] });
      await task.promise;
      if (disposed) return;
      if (surface.current) { surface.current.scrollTop = 0; surface.current.scrollLeft = 0; }
      setRenderedPage(page); setBusy(false); readyCallback.current?.();
      void documentPage.getTextContent().then(content => {
        if (!disposed) setPageText(content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join(''));
      }).catch(() => {});
    })().catch(error => {
      if (!disposed && error?.name !== 'RenderingCancelledException') { setBusy(false); setPageError(true); }
    });
    return () => { disposed = true; task?.cancel(); };
  }, [pdf, page, width, zoom, ar]);
  useEffect(() => {
    if (pdf && renderedPage === page && !busy && !pageError) {
      furthestPage.current = Math.max(furthestPage.current, page);
      setSaved(writePdfState(storageKey, { page, bookmarks, zoom, furthestPage: furthestPage.current,
        totalPages: pdf.numPages, lastReadAt: Date.now() }));
    }
  }, [storageKey, pdf, renderedPage, page, busy, pageError, bookmarks, zoom]);

  const go = (next: number) => {
    if (!pdf) return;
    const valid = clampPdfPage(next, pdf.numPages);
    setPage(valid); setPageInput(String(valid));
  };
  const marked = bookmarks.includes(page);
  const progress = pdf ? pdfProgressPercent({page: renderedPage || page, bookmarks, zoom,
    furthestPage: furthestPage.current, totalPages: pdf.numPages}) : null;
  return <div className="efips-pdf-pages" onKeyDown={event => {
    if (event.target instanceof HTMLElement && ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A'].includes(event.target.tagName)) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); go(page + (event.key === (ar ? 'ArrowLeft' : 'ArrowRight') ? 1 : -1));
    }
  }}>
    <div className="efips-pdf-toolbar" aria-label={ar ? 'الصفحات والتكبير والعلامات' : 'Pages, zoom and bookmarks'}>
      <button type="button" className="efips-pdf-toolbar-toggle" aria-expanded={toolsVisible} aria-controls={toolsId} onClick={() => setToolsVisible(open => !open)}>
        {toolsVisible ? (ar ? 'إخفاء أدوات القراءة' : 'Hide reading tools') : (ar ? 'الصفحات والتكبير والعلامات' : 'Pages, zoom and bookmarks')}
      </button>
      <div id={toolsId} hidden={!toolsVisible}>
      <div className="efips-pdf-pagination">
        <button type="button" disabled={!pdf || page <= 1} onClick={() => go(page - 1)}>{ar ? 'السابقة' : 'Previous'}</button>
        <form onSubmit={event => { event.preventDefault(); go(parsePdfPage(pageInput)); }}>
          <label>{ar ? 'الصفحة' : 'Page'} <input aria-label={ar ? 'رقم الصفحة' : 'Page number'} inputMode="numeric" pattern="[0-9٠-٩۰-۹]+" value={pageInput} disabled={!pdf}
            onChange={event => setPageInput(event.target.value)} /></label>
          <span>{ar ? 'من' : 'of'} {pdf?.numPages || '—'}</span>
          <button type="submit" disabled={!pdf}>{ar ? 'انتقال' : 'Go'}</button>
        </form>
        <button type="button" disabled={!pdf || page >= pdf.numPages} onClick={() => go(page + 1)}>{ar ? 'التالية' : 'Next'}</button>
      </div>
      <div className="efips-pdf-tools">
        <button type="button" aria-label={ar ? 'تصغير الصفحة' : 'Zoom out'} disabled={!pdf || zoom <= .75} onClick={() => setZoom(z => Math.max(.75, +(z - .25).toFixed(2)))}>−</button>
        <span aria-label={ar ? 'التكبير' : 'Zoom'}>{Math.round(zoom * 100)}%</span>
        <button type="button" aria-label={ar ? 'تكبير الصفحة' : 'Zoom in'} disabled={!pdf || zoom >= 2} onClick={() => setZoom(z => Math.min(2, +(z + .25).toFixed(2)))}>+</button>
        <button type="button" disabled={!pdf} onClick={() => setZoom(1)}>{ar ? 'ملاءمة العرض' : 'Fit width'}</button>
        <button type="button" disabled={!pdf || busy || renderedPage !== page} aria-pressed={marked} onClick={() => setBookmarks(old => marked ? old.filter(p => p !== page) : [...old, page].sort((a, b) => a - b).slice(0, 200))}>
          {marked ? (ar ? 'إزالة العلامة' : 'Remove bookmark') : (ar ? 'حفظ علامة' : 'Bookmark page')}
        </button>
        {bookmarks.length > 0 && <select value="" aria-label={ar ? 'الصفحات المحفوظة' : 'Bookmarked pages'} onChange={event => go(Number(event.target.value))}>
          <option value="">{ar ? 'علاماتي' : 'My bookmarks'}</option>
          {bookmarks.map(p => <option key={p} value={p}>{ar ? 'الصفحة' : 'Page'} {p}</option>)}
        </select>}
      </div>
      </div>
    </div>
    <div className="efips-pdf-position" role="status" aria-live="polite">
      {!pdf ? (ar ? 'جاري فتح ملف الكتاب…' : 'Opening book…')
        : busy ? (ar ? 'جاري عرض الصفحة…' : 'Rendering page…')
        : pageError ? (ar ? 'تعذر عرض الصفحة. جرّب صفحة أخرى أو افتح المصدر.' : 'Unable to render this page. Try another page or open the source.')
        : <>{ar ? `الصفحة ${renderedPage} من ${pdf.numPages}` : `Page ${renderedPage} of ${pdf.numPages}`} · {progress === null ? '' : `${progress}% · `}{saved === true
          ? (ar ? 'موضعك وعلاماتك محفوظة على هذا الجهاز.' : 'Your position and bookmarks are saved on this device.')
          : saved === false ? (ar ? 'تعذر حفظ الموضع على هذا الجهاز.' : 'Unable to save your position on this device.') : ''}
          {initial.page > 1 && <button type="button" onClick={() => go(1)}>{ar ? 'البدء من أول الكتاب' : 'Start from the beginning'}</button>}</>}
    </div>
    <div className="efips-pdf-surface" ref={surface} tabIndex={0} aria-busy={busy} aria-label={ar ? 'صفحة الكتاب؛ استخدم الأسهم للتنقل' : 'Book page; use arrow keys to navigate'} dir="ltr">
      <div ref={renderedContent} />
    </div>
    {pageText && <details className="efips-pdf-text"><summary>{ar ? 'نص الصفحة' : 'Page text'}</summary><p dir="auto">{pageText}</p></details>}
  </div>;
}
