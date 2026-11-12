import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SaqrOrbitNavigation.css';
import { getSaqrLearningAccess } from '../utils/saqrLearningAccess';

type Role = 'student' | 'teacher' | 'admin';
type OrbitItem = {
  key: string;
  to: string;
  ar: string;
  en: string;
  icon: string;
  tint: string;
  roles: Role[];
};
type Burst = { id: number; tx: number; ty: number; rot: number; color: string };

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
}: {
  isAr: boolean;
  userType: string | null;
  onMascotClick: () => void;
  showMascotBubble: boolean;
  bursts: Burst[];
}) {
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeX = useRef<number | null>(null);
  const [page, setPage] = useState(0);
  const [learningAllowed, setLearningAllowed] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const role: Role = userType === 'teacher' ? 'teacher' : userType === 'admin' ? 'admin' : 'student';
  const links = useMemo(() => ITEMS.filter(item => item.roles.includes(role) && (item.key !== 'learning' || learningAllowed)), [role, learningAllowed]);
  useEffect(() => {
    let live = true;
    setLearningAllowed(false);
    if (role === 'student' || role === 'admin') {
      getSaqrLearningAccess().then(result => { if (live) setLearningAllowed(result.allowed); })
        .catch(() => { if (live) setLearningAllowed(false); });
    }
    return () => { live = false; };
  }, [role]);
  const pageCount = Math.max(1, Math.ceil(links.length / 6));
  const visible = links.slice(page * 6, page * 6 + 6);
  useEffect(() => setPage(0), [role]);
  useEffect(() => setPage(current => Math.min(current, pageCount - 1)), [pageCount]);
  // Observe the whole orbit rather than each floating sphere: individual observers
  // previously made visible spheres disappear on desktop and on Safari.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) stage.classList.toggle('is-in-view', entry.isIntersecting);
    }, { threshold: 0.035, rootMargin: '0px 0px -2% 0px' });
    observer.observe(stage);
    stage.classList.add('saqr-orbit-motion-ready');
    return () => { observer.disconnect(); stage.classList.remove('saqr-orbit-motion-ready', 'is-in-view'); };
  }, []);
  const moveLight = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / Math.max(1, bounds.width)));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / Math.max(1, bounds.height)));
    event.currentTarget.style.setProperty('--light-x', (x * 100).toFixed(0) + '%');
    event.currentTarget.style.setProperty('--light-y', (y * 100).toFixed(0) + '%');
    event.currentTarget.style.setProperty('--tilt-x', ((x - .5) * 12).toFixed(1) + 'deg');
    event.currentTarget.style.setProperty('--tilt-y', ((.5 - y) * 12).toFixed(1) + 'deg');
  };
  const clearLight = (event: React.PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.removeProperty('--light-x');
    event.currentTarget.style.removeProperty('--light-y');
    event.currentTarget.style.removeProperty('--tilt-x');
    event.currentTarget.style.removeProperty('--tilt-y');
  };
  useEffect(() => () => { if (navigationTimer.current) clearTimeout(navigationTimer.current); }, []);
  const openLink = (e: React.MouseEvent<HTMLAnchorElement>, destination: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (transitioning) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { navigate(destination); return; }
    setTransitioning(true);
    navigationTimer.current = setTimeout(() => navigate(destination), 490);
  };
  const turnPage = (delta: number) => setPage(current => (current + delta + pageCount) % pageCount);
  return (
    <section className="saqr-orbit-section" dir={isAr ? 'rtl' : 'ltr'} aria-label={isAr ? 'خدمات المكتبة التفاعلية' : 'Interactive library navigation'}>
      <div
        className="saqr-orbit-stage"
        ref={stageRef}
        onTouchStart={event => { swipeX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={event => {
          if (swipeX.current !== null && event.changedTouches[0]) {
            const dx = event.changedTouches[0].clientX - swipeX.current;
            if (Math.abs(dx) > 65 && pageCount > 1) turnPage(dx < 0 ? 1 : -1);
          }
          swipeX.current = null;
        }}
      >
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
          {visible.map((item, index) => (
            <Link key={item.key} to={item.to} className={'saqr-orbit-bubble saqr-orbit-position-' + index}
              style={{ '--bubble-rgb': item.tint, '--bubble-delay': (index * -.43) + 's', '--reveal-delay': (index * 75) + 'ms' } as React.CSSProperties}
              onClick={event => openLink(event, item.to)}
              onPointerMove={moveLight}
              onPointerLeave={clearLight}
              aria-label={isAr ? item.ar : item.en}>
              <span className="saqr-orbit-float">
                <span className="saqr-orbit-glass">
                  <span className="saqr-orbit-glass-shine" aria-hidden="true"/>
                  <OrbitIcon kind={item.icon}/>
                  <span className="saqr-orbit-bubble-label">{isAr ? item.ar : item.en}</span>
                </span>
              </span>
            </Link>
          ))}
        </nav>
        {pageCount > 1 && (
          <div className="saqr-orbit-pagination" role="group" aria-label={isAr ? 'مجموعات الخدمات' : 'Navigation pages'}>
            <button type="button" onClick={() => turnPage(-1)} aria-label={isAr ? 'الخدمات السابقة' : 'Previous services'}>‹</button>
            {Array.from({ length: pageCount }, (_, index) =>
              <button type="button" key={index} aria-label={isAr ? 'صفحة ' + (index + 1) : 'Page ' + (index + 1)}
                aria-current={index === page ? 'page' : undefined} className={index === page ? 'is-active' : ''}
                onClick={() => setPage(index)}><span/></button>)}
            <button type="button" onClick={() => turnPage(1)} aria-label={isAr ? 'الخدمات التالية' : 'Next services'}>›</button>
          </div>
        )}
        <div className={'saqr-orbit-page-transition' + (transitioning ? ' is-visible' : '')} aria-hidden="true"><span/></div>
      </div>
    </section>
  );
}
