import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import './SaqrOrbitNavigation.css';
import { getSaqrLearningAccess } from '../utils/saqrLearningAccess';

type Role = 'student' | 'teacher' | 'admin';
export type OrbitItem = {
  key: string;
  to: string;
  ar: string;
  en: string;
  icon: string;
  tint: string;
  roles: Role[];
};
type Burst = { id: number; tx: number; ty: number; rot: number; color: string };

// Evenly spaced positions for all bubbles; only the service-to-position
// assignment is randomized. This prevents overlap/clipping at small widths.
const EXPANDED_ORBIT_SLOTS: Record<number, readonly number[]> = {
  // Odd menus put one bubble on the vertical centerline: both sides stay equal.
  7: [0, 1, 3, 5, 6, 8, 10],
  8: [0, 1, 2, 4, 5, 6, 7, 9],
  9: [0, 1, 2, 4, 5, 6, 7, 9, 10],
  10: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};
const randomizeOrbit = (): string[] => {
  const keys = ITEMS.map(item => item.key);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys;
};

const ITEMS: OrbitItem[] = [
  { key: 'catalog', to: '/search', ar: 'دليل المكتبة', en: 'Library Catalog', icon: 'search', tint: '74, 209, 162', roles: ['student', 'teacher', 'admin'] },
  { key: 'smart', to: '/smart-search', ar: 'صقر الذكي', en: 'Ask Saqr AI', icon: 'spark', tint: '91, 195, 251', roles: ['student', 'teacher', 'admin'] },
  { key: 'digital', to: '/digital-library', ar: 'المكتبة الرقمية', en: 'Digital Library', icon: 'book', tint: '183, 128, 241', roles: ['student', 'teacher', 'admin'] },
  { key: 'creators', to: '/creators', ar: 'بوابة المبدعين', en: 'Creators Portal', icon: 'pen', tint: '249, 132, 180', roles: ['student', 'teacher', 'admin'] },
  { key: 'learning', to: '/saqr-learning', ar: 'صقر يساعدني', en: 'Saqr Helps Me', icon: 'cap', tint: '247, 193, 108', roles: ['student', 'admin'] },
  { key: 'identity', to: '/saqr-national-identity', ar: 'صقر وهوية وطن', en: 'Saqr & Nation', icon: 'flag', tint: '75, 170, 116', roles: ['student', 'admin'] },
  { key: 'challenges', to: '/saqr-challenges', ar: 'تحديات صقر', en: 'Saqr Challenges', icon: 'trophy', tint: '242, 184, 75', roles: ['student', 'admin'] },
  { key: 'reading-quest', to: '/saqr-reading-quest', ar: 'بين السطور', en: 'Between the Lines', icon: 'reading', tint: '80, 157, 229', roles: ['teacher'] },
  { key: 'schedule', to: '/schedule', ar: 'حجز المكتبة', en: 'Library Schedule', icon: 'calendar', tint: '94, 203, 206', roles: ['teacher', 'admin'] },
  { key: 'admin', to: '/admin-dashboard', ar: 'إدارة النظام', en: 'Administration', icon: 'settings', tint: '180, 131, 91', roles: ['admin'] },
];

function OrbitIcon({ kind }: { kind: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const shape: Record<string, React.ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></>,
    spark: <><path d="m12 2 2.1 6.4L20.5 10l-6.4 2.1L12 18.5l-2.1-6.4L3.5 10l6.4-1.6L12 2Z"/><path d="m19 16 1 2.4 2.5 1-2.5 1-1 2.4-1-2.4-2.5-1 2.5-1 1-2.4Z"/></>,
    book: <><path d="M12 6C9 4 6 4 3 5v13c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/><path d="M12 6v13"/></>,
    pen: <><path d="m5 19 4-1 10-10-3-3L6 15l-1 4ZM14 7l3 3M4 21h16"/></>,
    cap: <><path d="m2 9 10-5 10 5-10 5-10-5ZM6 12v5c4 3 8 3 12 0v-5M22 9v7"/></>,
    flag: <><path d="M5 3v18M5 4h14l-3 5 3 5H5"/></>,
    trophy: <><path d="M8 4h8v6a4 4 0 0 1-8 0V4ZM8 6H5a3 3 0 0 0 3 4m8-4h3a3 3 0 0 1-3 4M12 14v5m-5 2h10"/></>,
    reading: <><path d="M12 6C9 4 6 4 3 5v13c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/><path d="M12 6v13M8 9h2m4 0h2"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18m6 5 2 2 4-4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m10 2-.6 2.4-2 1.1L5 4.8 3 8l1.7 1.9v2.3L3 14l2 3.2 2.4-.7 2 1.1L10 20h4l.6-2.4 2-1.1 2.4.7 2-3.2-1.7-1.9V9.8L21 8l-2-3.2-2.4.7-2-1.1L14 2h-4Z"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>{shape[kind] || shape.book}</svg>;
}

export default function SaqrOrbitNavigation({
  isAr,
  userType,
  onMascotClick,
  showMascotBubble,
  bursts,
  tourMode = false,
  tourDescriptions,
  tourRoles,
}: {
  isAr: boolean;
  userType: string | null;
  onMascotClick: () => void;
  showMascotBubble: boolean;
  bursts: Burst[];
  tourMode?: boolean;
  tourDescriptions?: Record<string, string>;
  tourRoles?: Record<string, string>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  // New shuffled order on every fresh mount; stable while the page is open.
  const [randomizedKeys] = useState(randomizeOrbit);
  const [learningAllowed, setLearningAllowed] = useState(false);
  const [hoveredTourKey, setHoveredTourKey] = useState<string | null>(null);
  const [tappedTourKey, setTappedTourKey] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const lastPointerType = useRef<string>('mouse');
  const role: Role = userType === 'teacher' ? 'teacher' : userType === 'admin' ? 'admin' : 'student';
  // The public tutorial is a read-only visual replica, including services hidden by role.
  // The real homepage keeps its existing permissions and entitlement checks.
  const links = useMemo(() => tourMode ? ITEMS : ITEMS.filter(item => item.roles.includes(role) && (item.key !== 'learning' || learningAllowed)), [role, learningAllowed, tourMode]);
  useEffect(() => {
    let live = true;
    setLearningAllowed(false);
    if (tourMode) return () => { live = false; };
    if (role === 'student' || role === 'admin') {
      getSaqrLearningAccess().then(result => { if (live) setLearningAllowed(result.allowed); })
        .catch(() => { if (live) setLearningAllowed(false); });
    }
    return () => { live = false; };
  }, [role, tourMode]);
  const visible = useMemo(() => randomizedKeys.flatMap(key => {
    const item = links.find(link => link.key === key);
    return item ? [item] : [];
  }), [links, randomizedKeys]);
  const expandedOrbit = visible.length > 6;
  const slotIndices = EXPANDED_ORBIT_SLOTS[visible.length];
  // Observe the whole orbit rather than each floating sphere: individual observers
  // previously made visible spheres disappear on desktop and on Safari.
  useEffect(() => {
    const stage = stageRef.current;
    // The tutorial keeps all spheres visible while a description is open.
    // Only the actual homepage uses enter/leave scroll reveals.
    if (tourMode || !stage || typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) stage.classList.toggle('is-in-view', entry.isIntersecting);
    }, { threshold: 0.035, rootMargin: '0px 0px -2% 0px' });
    observer.observe(stage);
    stage.classList.add('saqr-orbit-motion-ready');
    return () => { observer.disconnect(); stage.classList.remove('saqr-orbit-motion-ready', 'is-in-view'); };
  }, [tourMode]);
  const moveLight = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / Math.max(1, bounds.width)));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / Math.max(1, bounds.height)));
    event.currentTarget.style.setProperty('--light-x', (x * 100).toFixed(0) + '%');
    event.currentTarget.style.setProperty('--light-y', (y * 100).toFixed(0) + '%');
    event.currentTarget.style.setProperty('--tilt-x', ((x - .5) * 12).toFixed(1) + 'deg');
    event.currentTarget.style.setProperty('--tilt-y', ((.5 - y) * 12).toFixed(1) + 'deg');
  };
  const clearLight = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty('--light-x');
    event.currentTarget.style.removeProperty('--light-y');
    event.currentTarget.style.removeProperty('--tilt-x');
    event.currentTarget.style.removeProperty('--tilt-y');
  };
  // Only the public tutorial shows these contextual explanations. The real homepage
  // retains its original links, pointer effects and access controls unchanged.
  const activeTourKey = tappedTourKey || hoveredTourKey;
  const tourItem = activeTourKey ? ITEMS.find(item => item.key === activeTourKey) : undefined;
  const tourTitle = tourItem ? (isAr ? tourItem.ar : tourItem.en) : '';
  const tourDescription = activeTourKey ? tourDescriptions?.[activeTourKey] : undefined;
  const tourAudience = activeTourKey ? tourRoles?.[activeTourKey] : undefined;
  const showTourHint = Boolean(tourMode && tourItem && tourDescription);

  const followCursor = (event: React.PointerEvent<HTMLElement>, key: string) => {
    if (!tourMode || event.pointerType === 'touch') return;
    setTappedTourKey(null);
    setHoveredTourKey(key);
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  const closeHover = (event: React.PointerEvent<HTMLElement>, key: string) => {
    if (tourMode && event.pointerType !== 'touch') {
      setHoveredTourKey(current => current === key ? null : current);
    }
  };

  useEffect(() => {
    if (!tourMode || !tappedTourKey) return;
    const dismissOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.saqr-orbit-bubble, [data-saqr-tour-hint]')) return;
      setTappedTourKey(null);
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTappedTourKey(null);
    };
    document.addEventListener('pointerdown', dismissOutside);
    window.addEventListener('keydown', dismissEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      window.removeEventListener('keydown', dismissEscape);
    };
  }, [tourMode, tappedTourKey]);

  useEffect(() => {
    // If access/role changes, close any hint about a no-longer-visible service.
    setHoveredTourKey(null);
    setTappedTourKey(null);
  }, [visible]);

  const viewportWidth = typeof window === 'undefined' ? 1024 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 768 : window.innerHeight;
  const hoverLeft = Math.max(12, Math.min(viewportWidth - 355, cursorPosition.x + 20));
  const hoverTop = Math.max(12, Math.min(viewportHeight - 250,
    cursorPosition.y + 250 > viewportHeight ? cursorPosition.y - 235 : cursorPosition.y + 20));

  return (
    <section className="saqr-orbit-section" dir={isAr ? 'rtl' : 'ltr'} aria-label={isAr ? 'خدمات المكتبة التفاعلية' : 'Interactive library navigation'}>
      <div className="saqr-orbit-stage" data-orbit-layout={expandedOrbit ? 'expanded' : 'compact'} data-orbit-count={visible.length} ref={stageRef}>
        <div className="saqr-orbit-scene">
        <div className="saqr-orbit-halo saqr-orbit-halo-outer" aria-hidden="true" />
        <div className="saqr-orbit-halo saqr-orbit-halo-inner" aria-hidden="true" />
        <div className="saqr-orbit-brand-aura" aria-hidden="true">
          <img src="/school-logo.png" alt="" loading="eager"/>
          <span className="saqr-orbit-red-ellipse"/>
        </div>
        <button type="button" className="saqr-orbit-character" onClick={onMascotClick} aria-label={isAr ? 'تفاعل مع شخصية صقر' : 'Interact with Saqr'}>
          <span className="saqr-orbit-saqr-portrait">
            <img src="/Saqr.png" alt={isAr ? 'شخصية صقر الأصلية من مدرسة صقر الإمارات' : 'Official Saqr mascot'} loading="eager" decoding="async"/>
          </span>
          {showMascotBubble && <span className="saqr-orbit-talk">{isAr ? 'فخورين بالإمارات' : 'Proud of the UAE'}</span>}
          {bursts.map(burst => <svg key={burst.id} className="saqr-orbit-burst" viewBox="0 0 24 24" style={{ '--burst-x': burst.tx + 'px', '--burst-y': burst.ty + 'px', '--burst-rot': burst.rot + 'deg' } as React.CSSProperties} aria-hidden="true"><path d="m12 2 2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2Z" fill="#e1a82c"/></svg>)}
        </button>
        </div>
        <nav aria-label={isAr ? 'روابط خدمات المكتبة' : 'Library service links'} className="saqr-orbit-links">
          {visible.map((item, index) => {
            const bubbleStyle = {
              '--bubble-rgb': item.tint,
              '--bubble-delay': (index * -.43) + 's',
              '--reveal-delay': (index * 75) + 'ms',
            } as React.CSSProperties;
            const bubbleContent = (
              <span className="saqr-orbit-float">
                <span className="saqr-orbit-glass">
                  <span className="saqr-orbit-glass-shine" aria-hidden="true"/>
                  <OrbitIcon kind={item.icon}/>
                  <span className="saqr-orbit-bubble-label">{isAr ? item.ar : item.en}</span>
                </span>
              </span>
            );
            const slot = expandedOrbit ? (slotIndices?.[index] ?? index) : index;
            const className = 'saqr-orbit-bubble saqr-orbit-position-' + slot;
            const ariaLabel = isAr ? item.ar : item.en;
            return tourMode ? (
              <button type="button" key={item.key} className={className} style={bubbleStyle}
                aria-label={ariaLabel}
                aria-expanded={tappedTourKey === item.key}
                aria-describedby={activeTourKey === item.key ? 'saqr-tour-hint-' + item.key : undefined}
                onPointerDown={(event) => { lastPointerType.current = event.pointerType; }}
                onPointerEnter={(event) => followCursor(event, item.key)}
                onPointerMove={(event) => { moveLight(event); followCursor(event, item.key); }}
                onPointerLeave={(event) => { clearLight(event); closeHover(event, item.key); }}
                onFocus={(event) => {
                  if (event.currentTarget.matches(':focus-visible')) {
                    setHoveredTourKey(item.key);
                    const rect = event.currentTarget.getBoundingClientRect();
                    setCursorPosition({ x: rect.right, y: rect.top + rect.height / 2 });
                  }
                }}
                onBlur={() => setHoveredTourKey(key => key === item.key ? null : key)}
                onClick={(event) => {
                  if (lastPointerType.current === 'touch' || event.detail === 0) {
                    setTappedTourKey(current => current === item.key ? null : item.key);
                    setHoveredTourKey(null);
                  }
                }}>
                {bubbleContent}
              </button>
            ) : (
              <Link key={item.key} to={item.to} className={className} style={bubbleStyle}
                onPointerMove={moveLight} onPointerLeave={clearLight} aria-label={ariaLabel}>
                {bubbleContent}
              </Link>
            );
          })}
        </nav>
      </div>
      {showTourHint && typeof document !== 'undefined' && createPortal(
        <div
          data-saqr-tour-hint="true"
          id={'saqr-tour-hint-' + activeTourKey}
          role={tappedTourKey ? 'dialog' : 'tooltip'}
          aria-label={tourTitle}
          dir={isAr ? 'rtl' : 'ltr'}
          className={
            'fixed z-[999999] rounded-[1.3rem] border border-emerald-300/65 bg-slate-950/95 px-4 py-3.5 text-start text-white shadow-[0_20px_55px_rgba(6,26,40,0.42)] backdrop-blur-xl ' +
            (tappedTourKey
              ? 'bottom-4 left-1/2 w-[min(350px,calc(100vw-28px))] max-h-[min(50dvh,380px)] -translate-x-1/2 overflow-y-auto'
              : 'w-[min(335px,calc(100vw-24px))] max-h-[min(300px,calc(100dvh-24px))] overflow-hidden pointer-events-none')
          }
          style={tappedTourKey ? undefined : { left: hoverLeft, top: hoverTop, fontFamily: 'Cairo, sans-serif' }}
        >
          <div className="flex items-start justify-between gap-3">
            <strong className="block text-[15px] font-black leading-7 text-white">{tourTitle}</strong>
            {tappedTourKey && (
              <button type="button" onClick={() => setTappedTourKey(null)}
                aria-label={isAr ? 'إغلاق التلميح' : 'Close hint'}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 text-xl font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300">×</button>
            )}
          </div>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-100">{tourDescription}</p>
          {tourAudience && (
            <p className="mt-2 border-t border-white/20 pt-2 text-xs font-bold leading-5 text-emerald-200">
              {isAr ? 'متاح لـ: ' : 'Available to: '}{tourAudience}
            </p>
          )}
        </div>,
        document.body
      )}
    </section>
  );
}
