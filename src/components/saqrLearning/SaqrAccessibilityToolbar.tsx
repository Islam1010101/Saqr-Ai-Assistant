import React, { useEffect, useId, useRef, useState } from 'react';

/**
 * Mounted site-wide only after the server verifies the admin or an individual student's accessibility grant.
 * Display preferences are intentionally temporary and never identify a pupil.
 * The color-friendly preset uses distinct, high-contrast palettes; it does not
 * simulate a color-vision deficiency or pretend to correct medical vision.
 */
type Props = {
  isAr: boolean;
  quiet: boolean;
  onQuietChange: (value: boolean) => void;
};

type ColorMode = 'normal' | 'color-safe' | 'grayscale';
const MIN_ZOOM = 90;
const MAX_ZOOM = 140;

export default function SaqrAccessibilityToolbar({ isAr, quiet, onQuietChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [colorMode, setColorMode] = useState<ColorMode>('normal');
  const regionId = useId();
  const originalSize = useRef<string | null>(null);
  const baselinePx = useRef(16);

  useEffect(() => {
    const root = document.documentElement;
    originalSize.current = root.style.fontSize;
    baselinePx.current = Number.parseFloat(window.getComputedStyle(root).fontSize) || 16;
    return () => {
      root.classList.remove('efips-learning-grayscale', 'efips-learning-color-safe', 'efips-learning-zoomed', 'efips-learning-reduced-motion');
      root.style.fontSize = originalSize.current ?? '';
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('efips-learning-grayscale', colorMode === 'grayscale');
    root.classList.toggle('efips-learning-color-safe', colorMode === 'color-safe');
    root.classList.toggle('efips-learning-zoomed', zoom !== 100);
    root.classList.toggle('efips-learning-reduced-motion', quiet);
    root.style.fontSize = zoom === 100 ? (originalSize.current ?? '') : `${baselinePx.current * zoom / 100}px`;
  }, [colorMode, zoom, quiet]);

  const reset = () => {
    setZoom(100);
    setColorMode('normal');
    onQuietChange(false);
  };

  return <>
    <aside
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed bottom-24 sm:bottom-24 z-[900] flex max-w-[calc(100vw-24px)] flex-col items-start gap-2"
      style={{ insetInlineStart: '12px' }}
      aria-label={isAr ? 'أدوات تسهيل الوصول' : 'Accessibility tools'}
    >
      {expanded && <div id={regionId} role="region"
        aria-label={isAr ? 'شريط إعدادات العرض' : 'Display accessibility settings'}
        className="w-[min(410px,calc(100vw-24px))] max-h-[min(60dvh,440px)] overflow-y-auto rounded-[1.5rem] border-2 border-sky-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-4 shadow-[0_16px_45px_rgba(4,47,70,.25)] space-y-4 text-slate-900 dark:text-white">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black">{isAr ? 'شريط تسهيل الوصول' : 'Accessibility toolbar'}</h2>
          <button type="button" onClick={() => setExpanded(false)}
            className="min-h-11 rounded-xl border border-slate-300 dark:border-slate-700 px-4 font-bold focus-visible:outline-4 focus-visible:outline-sky-500">
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
        <section aria-label={isAr ? 'تكبير وتصغير النص' : 'Text size'} className="space-y-2">
          <p className="font-black text-sm">{isAr ? 'حجم العرض والنص' : 'Display and text size'}</p>
          <div className="flex items-center justify-between gap-2">
            <button type="button" aria-label={isAr ? 'تصغير النص' : 'Decrease text size'}
              disabled={zoom <= MIN_ZOOM} onClick={() => setZoom(v => Math.max(MIN_ZOOM, v - 10))}
              className="min-h-12 min-w-14 rounded-xl border-2 border-sky-400 bg-sky-50 dark:bg-slate-800 font-black text-xl disabled:opacity-40 focus-visible:outline-4 focus-visible:outline-amber-500">
              A−
            </button>
            <output aria-live="polite" className="font-black text-lg tabular-nums">{zoom}%</output>
            <button type="button" aria-label={isAr ? 'تكبير النص' : 'Increase text size'}
              disabled={zoom >= MAX_ZOOM} onClick={() => setZoom(v => Math.min(MAX_ZOOM, v + 10))}
              className="min-h-12 min-w-14 rounded-xl border-2 border-sky-400 bg-sky-50 dark:bg-slate-800 font-black text-xl disabled:opacity-40 focus-visible:outline-4 focus-visible:outline-amber-500">
              A+
            </button>
          </div>
        </section>
        <section aria-label={isAr ? 'إعدادات الألوان' : 'Color settings'} className="space-y-2">
          <p className="font-black text-sm">{isAr ? 'طريقة عرض الألوان' : 'Color display'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {([
              ['normal', isAr ? 'الألوان الأصلية' : 'Original'],
              ['color-safe', isAr ? 'ألوان أوضح' : 'Color-friendly'],
              ['grayscale', isAr ? 'أبيض وأسود' : 'Grayscale']
            ] as [ColorMode, string][]).map(([value, label]) => <button
              key={value} type="button" aria-pressed={colorMode === value} onClick={() => setColorMode(value)}
              className={'min-h-12 rounded-xl border-2 px-3 py-2 text-sm font-black focus-visible:outline-4 focus-visible:outline-amber-500 ' +
                (colorMode === value
                  ? 'border-sky-700 bg-sky-800 text-white ring-2 ring-amber-400'
                  : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white')}>
              {label}
            </button>)}
          </div>
        </section>
        <button type="button" aria-pressed={quiet} onClick={() => onQuietChange(!quiet)}
          className={'w-full min-h-12 rounded-xl border-2 px-4 py-3 font-black focus-visible:outline-4 focus-visible:outline-amber-500 ' +
            (quiet
              ? 'border-sky-800 bg-sky-800 text-white'
              : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800')}>
          {quiet
            ? (isAr ? 'تقليل الحركة مفعّل' : 'Reduced motion is on')
            : (isAr ? 'تقليل الحركة والمؤثرات' : 'Reduce motion and effects')}
        </button>
        <button type="button" onClick={reset}
          className="min-h-11 w-full rounded-xl border-2 border-emerald-700 px-4 py-2.5 font-black text-emerald-900 dark:text-emerald-200 focus-visible:outline-4 focus-visible:outline-sky-500">
          {isAr ? 'استعادة العرض الأصلي' : 'Reset display preferences'}
        </button>
      </div>}
      <button type="button" aria-controls={regionId} aria-expanded={expanded}
        onClick={() => setExpanded(v => !v)}
        className="min-h-14 flex items-center gap-3 rounded-full border-2 border-white/50 bg-[#064B6A] px-5 py-3 font-black text-white shadow-[0_10px_30px_rgba(5,54,79,.35)] hover:bg-[#073F5C] focus-visible:outline-4 focus-visible:outline-amber-400">
        <svg aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16"/>
          <circle cx="9" cy="6" r="2" fill="#064B6A" />
          <circle cx="16" cy="12" r="2" fill="#064B6A" />
          <circle cx="11" cy="18" r="2" fill="#064B6A" />
        </svg>
        <span>{isAr ? 'تسهيل الوصول' : 'Accessibility'}</span>
      </button>
    </aside>
    <style>{`
      /* Display presets apply across the authorized user's entire school site. */
      html.efips-learning-grayscale { filter:grayscale(1) !important; }
      html.efips-learning-color-safe { filter:contrast(1.16) saturate(.82) !important; }
      html.efips-learning-color-safe :is(a,button,[role="button"],input,select,textarea):focus-visible {
        outline:4px solid #FFC857!important; outline-offset:3px!important;
      }
      html.efips-learning-reduced-motion *, html.efips-learning-reduced-motion *::before,
      html.efips-learning-reduced-motion *::after {
        animation-duration:0.01ms!important; animation-iteration-count:1!important;
        transition-duration:0.01ms!important; scroll-behavior:auto!important;
      }
      html.efips-learning-color-safe .saqr-learning-hero { background:#123C60!important; }
      html.efips-learning-color-safe .saqr-learning-option { background-image:none!important; border-color:#FFCA55!important; }
      html.efips-learning-color-safe .saqr-learning-option:nth-child(1) { background-color:#145582!important; }
      html.efips-learning-color-safe .saqr-learning-option:nth-child(2) { background-color:#63427E!important; }
      html.efips-learning-color-safe .saqr-learning-option:nth-child(3) { background-color:#86510D!important; }
      html.efips-learning-color-safe .saqr-learning-page :is(button,a,[role="button"]):focus-visible {
        outline:4px solid #FFCA55!important; outline-offset:3px!important;
      }
      html.efips-learning-color-safe .saqr-learning-page button[aria-pressed="true"] {
        box-shadow:inset 0 0 0 2px #FFCA55!important;
      }
      html.efips-learning-zoomed .saqr-learning-page--overview { height:auto!important;min-height:calc(100dvh - 96px)!important; }
      html.efips-learning-zoomed .saqr-learning-page--overview .saqr-learning-main { height:auto!important; }
    `}</style>
  </>;
}
