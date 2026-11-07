import React, { useEffect, useId, useRef } from 'react';
import './digitalLibraryResponsive.css';

/** One scroll surface keeps every book action reachable on short/touch screens. */
export default function DigitalLibraryDialog({ title, onClose, children, variant = 'details' }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'details' | 'reader';
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

  const focusableElements = () => Array.from(panel.current?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, summary, [tabindex="0"]'
  ) || []).filter(element => !element.hasAttribute('data-dialog-guard') && element.getClientRects().length > 0);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close.current();
    }
    if (event.key !== 'Tab') return;
    const focusable = focusableElements();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  };

  return <div className={`efips-digital-dialog-backdrop${variant === 'reader' ? ' efips-digital-dialog-backdrop-reader' : ''}`} onClick={event => {
    if (event.target === event.currentTarget) close.current();
  }}>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId}
      tabIndex={-1} className={`efips-digital-dialog-panel ${variant === 'reader' ? 'efips-digital-dialog-reader' : ''} bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
      onKeyDown={handleKeyDown}>
      {/* Frame keyboard events cannot bubble across origins; guards catch focus leaving the frame. */}
      <span tabIndex={0} data-dialog-guard className="efips-dialog-focus-guard" onFocus={() => {
        const elements = focusableElements(); (elements[elements.length - 1] || panel.current)?.focus();
      }} />
      <span id={titleId} className="sr-only">{title}</span>
      {children}
      <span tabIndex={0} data-dialog-guard className="efips-dialog-focus-guard" onFocus={() => {
        (focusableElements()[0] || panel.current)?.focus();
      }} />
    </div>
  </div>;
}
