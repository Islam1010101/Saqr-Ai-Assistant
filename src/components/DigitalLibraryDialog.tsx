import React, { useEffect, useId, useRef } from 'react';
import './digitalLibraryResponsive.css';

/** One scroll surface keeps every book action reachable on short/touch screens. */
export default function DigitalLibraryDialog({ title, onClose, children }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  const titleId = useId();
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLButtonElement>('[data-book-close]')?.focus();
    return () => {
      document.body.style.overflow = oldOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close.current();
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(panel.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), summary, [tabindex="0"]'
    ) || []).filter(element => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  };

  return <div className="efips-digital-dialog-backdrop" onClick={event => {
    if (event.target === event.currentTarget) close.current();
  }}>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId}
      tabIndex={-1} className="efips-digital-dialog-panel bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
      onKeyDown={handleKeyDown}>
      <span id={titleId} className="sr-only">{title}</span>
      {children}
    </div>
  </div>;
}
