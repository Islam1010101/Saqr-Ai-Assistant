/**
 * Print the supplied self-contained A4 report without relying on window.open().
 * Retains browser-native text shaping (including Arabic) and supports Save as PDF.
 */
export const printA4Html = (html: string): Promise<void> => new Promise((resolve, reject) => {
  if (typeof document === 'undefined') {
    reject(new Error('Printing requires a browser.'));
    return;
  }

  const frame = document.createElement('iframe');
  frame.setAttribute('title', 'EFIPS A4 Report Print');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.position = 'fixed';
  frame.style.width = '1px';
  frame.style.height = '1px';
  frame.style.opacity = '0';
  frame.style.pointerEvents = 'none';
  frame.style.border = '0';
  frame.style.left = '0';
  frame.style.bottom = '0';

  let completed = false;
  let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
  const cleanup = () => {
    if (cleanupTimer) clearTimeout(cleanupTimer);
    frame.remove();
  };
  const fail = (reason: unknown) => {
    if (completed) return;
    completed = true;
    cleanup();
    reject(reason instanceof Error ? reason : new Error(String(reason)));
  };

  frame.addEventListener('load', () => {
    void (async () => {
      const win = frame.contentWindow;
      const doc = frame.contentDocument;
      if (!win || !doc) throw new Error('Print document could not be initialized.');

      // Allow fonts (including connected Arabic letters) and the school logo to render.
      if (doc.fonts?.ready) {
        await Promise.race([doc.fonts.ready, new Promise<void>(done => setTimeout(done, 2400))]);
      }
      await Promise.all(Array.from(doc.images).map(img => {
        if (img.complete) return Promise.resolve();
        return Promise.race([
          new Promise<void>(done => {
            img.addEventListener('load', () => done(), { once: true });
            img.addEventListener('error', () => done(), { once: true });
          }),
          new Promise<void>(done => setTimeout(done, 2400))
        ]);
      }));

      win.addEventListener('afterprint', cleanup, { once: true });
      win.focus();
      win.print();
      completed = true;
      cleanupTimer = setTimeout(cleanup, 120000);
      resolve();
    })().catch(fail);
  }, { once: true });
  frame.addEventListener('error', () => fail(new Error('The report could not be loaded for printing.')), { once: true });

  document.body.appendChild(frame);
  frame.srcdoc = html;
});
