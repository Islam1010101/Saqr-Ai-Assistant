import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLanguage, useTheme } from '../App';
import TutorialFeatureShowcase from './TutorialFeatureShowcase';
import SaqrOrbitNavigation from '../src/components/SaqrOrbitNavigation';
import '../src/components/EFIPSGlassVisualTheme.css';

/**
 * Public, visual-only replica of the real EFIPS library home screen.
 * It intentionally contains no live database calls and never displays
 * any personal, loan, timetable, analytics, or other live records.
 */

type HintState = {
  activeHint: string | null;
  pinnedHint: string | null;
  isAr: boolean;
  setActiveHint: (id: string | null) => void;
  setPinnedHint: (id: string | null) => void;
};

type HintTargetProps = HintState & {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  tooltipBelow?: boolean;
};

type TooltipPosition = { top: number; left: number; below: boolean };

const HintTarget: React.FC<HintTargetProps> = ({
  id,
  title,
  description,
  children,
  className = '',
  interactive = true,
  tooltipBelow = false,
  activeHint,
  pinnedHint,
  isAr,
  setActiveHint,
  setPinnedHint
}) => {
  const visible = activeHint === id || pinnedHint === id;
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);
  const [tipMounted, setTipMounted] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ top: 92, left: 12, below: true });

  const placeTooltip = (element: HTMLElement) => {
    anchorRef.current = element;
    const rect = element.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 24);
    const estimatedHeight = 170;
    const viewportHeight = window.innerHeight;
    let below = tooltipBelow || rect.top < 190;
    let top = below ? rect.bottom + 12 : rect.top - estimatedHeight - 12;

    if (below && top + estimatedHeight > viewportHeight - 8 && rect.top > estimatedHeight + 24) {
      below = false;
      top = rect.top - estimatedHeight - 12;
    } else if (!below && top < 8 && rect.bottom + estimatedHeight + 12 < viewportHeight - 8) {
      below = true;
      top = rect.bottom + 12;
    }

    top = Math.max(8, Math.min(top, viewportHeight - estimatedHeight - 8));
    const left = Math.max(12, Math.min(
      rect.left + rect.width / 2 - width / 2,
      window.innerWidth - width - 12
    ));

    setPosition({ top, left, below });
  };

  useEffect(() => {
    if (!visible) {
      setTipVisible(false);
      const timer = window.setTimeout(() => setTipMounted(false), 300);
      return () => window.clearTimeout(timer);
    }

    setTipMounted(true);
    const frame = window.requestAnimationFrame(() => {
      setTipVisible(true);
      const anchor = anchorRef.current;
      const tooltip = tooltipRef.current;
      if (!anchor || !tooltip) return;

      const rect = anchor.getBoundingClientRect();
      const tipHeight = tooltip.getBoundingClientRect().height;
      let below = tooltipBelow || rect.top < tipHeight + 24;
      let top = below ? rect.bottom + 12 : rect.top - tipHeight - 12;

      if (below && top + tipHeight > window.innerHeight - 8 && rect.top > tipHeight + 20) {
        below = false;
        top = rect.top - tipHeight - 12;
      }

      top = Math.max(8, Math.min(top, window.innerHeight - tipHeight - 8));
      const width = tooltip.getBoundingClientRect().width;
      const left = Math.max(12, Math.min(
        rect.left + rect.width / 2 - width / 2,
        window.innerWidth - width - 12
      ));
      setPosition({ top, left, below });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [visible, tooltipBelow]);

  useEffect(() => {
    if (!visible) return;

    const updatePosition = () => {
      if (anchorRef.current?.isConnected) placeTooltip(anchorRef.current);
    };
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [visible, tooltipBelow]);

  useEffect(() => {
    if (!visible || pinnedHint !== id) return;

    const dismissOutside = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && anchorRef.current?.contains(target)) return;
      setActiveHint((current) => current === id ? null : current);
      setPinnedHint((current) => current === id ? null : current);
    };

    document.addEventListener('pointerdown', dismissOutside, true);
    return () => document.removeEventListener('pointerdown', dismissOutside, true);
  }, [visible, pinnedHint, id, setActiveHint, setPinnedHint]);

  const showHint = (element: HTMLElement) => {
    placeTooltip(element);
    setPinnedHint(null);
    setActiveHint(id);
  };

  const toggleHint = (element: HTMLElement) => {
    placeTooltip(element);
    if (pinnedHint === id) {
      setPinnedHint(null);
      setActiveHint(null);
    } else {
      setPinnedHint(id);
      setActiveHint(id);
    }
  };

  return (
    <div
      className={'relative ' + className}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-expanded={visible}
      aria-label={title}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') showHint(event.currentTarget);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch' && pinnedHint !== id) {
          setActiveHint((current) => current === id ? null : current);
        }
      }}
      onFocus={(event) => showHint(event.currentTarget)}
      onBlur={() => setActiveHint((current) => current === id ? null : current)}
      onClick={(event) => toggleHint(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setPinnedHint((current) => current === id ? null : current);
          setActiveHint((current) => current === id ? null : current);
          return;
        }
        if (interactive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          toggleHint(event.currentTarget);
        }
      }}
    >
      {children}
      {tipMounted && typeof document !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          id={'hint-' + id}
          role="tooltip"
          aria-hidden={!tipVisible}
          className={
            'fixed z-[999999] w-[min(340px,calc(100vw-24px))] max-h-[calc(100dvh-16px)] overflow-y-auto rounded-2xl border-2 border-emerald-300 bg-slate-950/95 px-4 py-3.5 text-start text-white shadow-[0_18px_65px_rgba(2,6,23,0.55)] shadow-emerald-950/20 backdrop-blur-xl transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(.2,.75,.25,1)] ' +
            (tipVisible ? 'translate-y-0 scale-100 opacity-100' : (position.below ? '-translate-y-2 scale-[.97]' : 'translate-y-2 scale-[.97]') + ' opacity-0')
          }
          style={{ top: position.top, left: position.left, pointerEvents: 'none' }}
        >
          <span className={
            'absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-emerald-300 bg-slate-950 ' +
            (position.below ? '-top-[7px] border-l-2 border-t-2' : '-bottom-[7px] border-b-2 border-r-2')
          } />
          <span className="relative block text-[15px] font-black leading-6 text-white">{title}</span>
          <span className="relative mt-1 block text-sm font-semibold leading-6 text-slate-100">{description}</span>
          <span className="relative mt-2 flex items-center gap-1.5 border-t border-white/15 pt-2 text-xs font-black text-emerald-300">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18V6m-5 5 5-5 5 5" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            {pinnedHint === id
              ? (isAr ? 'اضغط مرة أخرى لإغلاق التلميح' : 'Tap again to close this hint')
              : (isAr ? 'مرّر المؤشر أو المس لعرض التفاصيل' : 'Hover or tap to see details')}
          </span>
        </div>,
        document.body
      )}
    </div>
  );
};

type SparkleItem = { id: number; x: number; y: number };
type FlagFlyItem = { id: number; x: number; y: number; rot: number };
type BurstItem = { id: number; tx: number; ty: number; rot: number; color: string };

const StarIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const UaeFlagIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={className + " rounded shadow-sm overflow-hidden"} preserveAspectRatio="none">
    <path fill="#00732f" d="M0 0h640v160H0z" />
    <path fill="#fff" d="M0 160h640v160H0z" />
    <path fill="#000" d="M0 320h640v160H0z" />
    <path fill="#ff0000" d="M0 0h220v480H0z" />
  </svg>
);

const SearchIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SmartIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const BookIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const CreatorIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const StudioIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const ScheduleIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GameIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AdminIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543-.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const EyeIcon = () => <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5-9.5-6.5-9.5-6.5Z" /><circle cx="12" cy="12" r="2.5" /></svg>;


const RevealSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
      const element = sectionRef.current;
      if (!element || typeof IntersectionObserver === 'undefined') return;
      // Reveal just once, ahead of the viewport. Repeated hide/show while
      // scrolling caused re-paints and apparent delayed content on Safari.
      let entered = false;
      const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
              entered = true;
              setIsVisible(true);
              observer.disconnect();
          } else if (!entered) {
              setIsVisible(false);
          }
      }, { threshold: 0, rootMargin: '160px 0px 160px 0px' });
      observer.observe(element);
      return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={'transform transition-all duration-700 ease-in-out ' + (isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-95 opacity-0')}
      style={{ transitionDelay: delay + 'ms' }}
    >
      {children}
    </div>
  );
};

export default function TutorialPage() {
  const { locale, setLocale, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isAr = locale === 'ar';
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [pinnedHint, setPinnedHint] = useState<string | null>(null);
  const hintState: HintState = { activeHint, pinnedHint, isAr, setActiveHint, setPinnedHint };
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);
  const [flyingFlags, setFlyingFlags] = useState<FlagFlyItem[]>([]);
  const [bursts, setBursts] = useState<BurstItem[]>([]);
  const [showBubble, setShowBubble] = useState(false);
  const [readingPreviewOpen, setReadingPreviewOpen] = useState(false);
  const hasSignedInSession = React.useMemo(() => {
    try {
      const type = localStorage.getItem('user_type');
      const user = JSON.parse(localStorage.getItem('current_user') || 'null');
      return Boolean(user && (type === 'student' || type === 'teacher' || type === 'admin'));
    } catch { return false; }
  }, []);

  const label = (ar: string, en: string) => isAr ? ar : en;

  useEffect(() => {
    if (!readingPreviewOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReadingPreviewOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [readingPreviewOpen]);

  const handleMascotInteraction = (event?: React.MouseEvent<HTMLElement>) => {
    const rect = event?.currentTarget.getBoundingClientRect() ?? { left: window.innerWidth / 2 - 110, top: window.innerHeight / 2 - 100, width: 220, height: 200 };
    setShowBubble(true);
    window.setTimeout(() => setShowBubble(false), 3000);

    const newSparkles: SparkleItem[] = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 350,
      y: rect.top + (Math.random() - 0.5) * 200
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    window.setTimeout(() => {
      setSparkles((prev) => prev.filter((item) => !newSparkles.some((next) => next.id === item.id)));
    }, 1500);

    const newFlags: FlagFlyItem[] = Array.from({ length: 12 }).map(() => ({
      id: Math.random(),
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 260,
      y: rect.top + (Math.random() - 0.5) * 140,
      rot: (Math.random() - 0.5) * 45
    }));
    setFlyingFlags((prev) => [...prev, ...newFlags]);
    window.setTimeout(() => {
      setFlyingFlags((prev) => prev.filter((item) => !newFlags.some((next) => next.id === item.id)));
    }, 1800);

    const id = Date.now();
    const colors = ['text-red-500', 'text-blue-500', 'text-yellow-400', 'text-green-500', 'text-emerald-500'];
    const newBursts: BurstItem[] = Array.from({ length: 6 }).map((_, index) => ({
      id: id + index,
      color: colors[Math.floor(Math.random() * colors.length)],
      tx: (Math.random() - 0.5) * 220,
      ty: -90 - Math.random() * 120,
      rot: (Math.random() - 0.5) * 180
    }));
    setBursts((prev) => [...prev, ...newBursts]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((item) => !newBursts.some((next) => next.id === item.id)));
    }, 2500);
  };

  // Documentation for every primary sphere in the real homepage.
  // No private data is accessed; roles and feature information are illustrative.
  const orbitDescriptions: Record<string, string> = {
    catalog: label('ابحث عن الكتب الورقية بعنوان الكتاب أو المؤلف أو الموضوع، وتعرّف إلى موقع الكتاب على الأرفف قبل الاستعارة. سجلات الطلاب غير معروضة في هذه الجولة.', 'Search physical books by title, author or subject, find shelf locations and request books. No private records are shown on this tour.'),
    smart: label('اسأل صقر الذكي عن القراءة، أو عن أي موضوع تعليمي. يساعد في مناقشة الكتب، والكتابة الإبداعية، والتدقيق اللغوي بالعربية والإنجليزية، وتحضير الدروس للمعلمين. لا يتم إرسال أسئلة حقيقية هنا.', 'Ask Saqr about reading or learning, discuss books, write stories, proofread Arabic and English, or prepare teacher lessons. This tour does not submit AI prompts.'),
    digital: label('افتح المكتبات الرقمية العربية والإنجليزية وكتب الهوية الوطنية، ثم اقرأ المحتوى المتاح في قارئ المنصة حسب صلاحية حسابك.', 'Explore Arabic and English digital collections and the National Identity Pavilion, with books opening in the built-in reader according to permissions.'),
    creators: label('استعرض كتابات الطلاب ومشروعاتهم في بوابة المبدعين، وتعرّف إلى كيفية مشاركة أعمال التأليف والإبداع.', 'Explore student authorship, stories and projects in the Creators Portal, and learn how student work is shared.'),
    learning: label('صقر يساعدني يقدّم أنشطة مساعدة في التعلم للطلاب المصرح لهم. الخدمة التجريبية الخاصة لا تظهر إلا للحسابات المؤهلة، ولا تتيح الجولة الدخول إليها.', 'Saqr Helps Me provides learning activities for eligible students. The private pilot appears only to entitled accounts; this tour does not grant access.'),
    identity: label('تعرف إلى معالم دولة الإمارات وتراثها ولغتها عبر جواز صقر الثقافي وكنوز لغتنا ومحقق ذاكرة وطن وتحدي راية المجد، إضافة إلى كتب الهوية الوطنية.', 'Learn about the UAE through the Cultural Passport, Emirati Language Treasures, Heritage Detective, Flag of Glory and a separate national-identity book collection.'),
    challenges: label('يجد الطلاب والإدارة أنشطة بين السطور مع صقر، ورتب المكتبة، واستديو صقر، وتُحتسب النقاط بحسب قواعد كل تحدٍ. المعلم له مدخل مستقل لنشاط بين السطور.', 'Students and administrators explore Between the Lines, Sort the Library and Saqr Studio. Activities follow their own scoring rules. Teachers have a separate Between the Lines entry.'),
    'reading-quest': label('نسخة المعلم من بين السطور مع صقر: اختر عدد الكتب ثم ناقش الشخصيات والأفكار والأحداث بأسئلة تناسب الكتاب ولغة الواجهة.', 'The teacher version of Between the Lines: choose books, then discuss characters, ideas and events through reading-comprehension questions in the chosen interface language.'),
    schedule: label('يستطيع المعلمون عرض الجدول الأسبوعي وحجز حصص المكتبة وإدارة الحجوزات المسموح بها. تظهر مواعيدهم المسجلة فقط عند توفرها.', 'Teachers can view the weekly timetable, reserve library sessions and manage permitted bookings. Their schedule appears only when records exist.'),
    admin: label('لوحة الإدارة للمخولين فقط، وتضم إدارة المستخدمين والأدوار والإحصائيات والحجوزات والاستعارات. بيانات الإدارة غير متاحة لزوار هذه الجولة.', 'The restricted admin dashboard manages roles, users, statistics, bookings and borrowing. Its private data is never exposed to visitors.'),
    mascot: label('صقر هو الشخصية الإرشادية للمكتبة. تظهر جميع فقاعات الخدمات المتاحة حوله معًا دون أسهم أو صفحات إضافية، وتتبدل أماكن الخدمات عشوائيًا عند فتح الواجهة. اضغط على صقر للتفاعل معه، أو اختر فقاعة للتعرف على الخدمة.', 'Saqr is the library guide. Every available service sphere is shown at once, without arrows or extra pages. Service positions shuffle each time the view opens. Tap Saqr for a friendly interaction or choose a sphere to learn about a feature.'),
  };
  const orbitRoles: Record<string, string> = {
    catalog: label('الطلاب والمعلمون والإدارة', 'Students, teachers and admins'),
    smart: label('الطلاب والمعلمون والإدارة', 'Students, teachers and admins'),
    digital: label('الطلاب والمعلمون والإدارة', 'Students, teachers and admins'),
    creators: label('الطلاب والمعلمون والإدارة', 'Students, teachers and admins'),
    learning: label('الطلاب والإدارة بحسب تصريح الخدمة', 'Entitled students and admins'),
    identity: label('الطلاب والإدارة', 'Students and admins'),
    challenges: label('الطلاب والإدارة', 'Students and admins'),
    'reading-quest': label('المعلمون', 'Teachers'),
    schedule: label('المعلمون والإدارة', 'Teachers and admins'),
    admin: label('الإدارة فقط', 'Admins only'),
    mascot: label('جميع الزوار', 'All visitors'),
  };

  const navItems = [
    { id: 'nav-search', text: label('البحث بالمكتبة', 'Search'), description: label('يفتح فهرس البحث عن الكتب.', 'Opens the book search catalogue.') },
    { id: 'nav-digital', text: label('المكتبة الرقمية', 'Digital'), description: label('ينقلك إلى مصادر المكتبة الرقمية.', 'Takes you to digital library resources.') },
    { id: 'nav-creators', text: label('بوابة المبدعين', 'Creators'), description: label('مساحة المشاركات والأعمال الإبداعية.', 'A space for creative contributions.') },
    { id: 'nav-identity', text: label('صقر وهوية وطن', 'UAE Heritage'), description: label('تحديات تراثية وجناح مستقل لكتب الهوية الوطنية؛ تظهر الخدمات بحسب صلاحية الحساب.', 'UAE heritage activities and a separate book pavilion; access follows account permissions.') },
    { id: 'nav-schedule', text: label('جدول المكتبة', 'Schedule'), description: label('خدمات جدول المكتبة للمعلمين.', 'Library schedule tools for teachers.') },
    { id: 'nav-ideas', text: label('مقترحات', 'Ideas'), description: label('استعراض وإرسال المقترحات في الموقع الحقيقي.', 'View and submit feedback on the live site.') },
    { id: 'nav-admin', text: label('الإدارة', 'Admin'), description: label('قسم محمي لا يظهر محتواه إلا للمخولين.', 'A protected area visible only to authorized staff.') }
  ];


  return (
    <div dir={dir} className="tutorial-page min-h-screen w-full overflow-x-hidden bg-white font-sans text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">
      {sparkles.map((sparkle) => (
        <div key={sparkle.id} className="pointer-events-none fixed z-[9998] animate-fade-out" style={{ left: sparkle.x, top: sparkle.y }}>
          <StarIcon className="h-6 w-6 animate-spin text-amber-400 drop-shadow-md" />
        </div>
      ))}
      {flyingFlags.map((flag) => (
        <div key={flag.id} className="pointer-events-none fixed z-[9998] animate-flag-float" style={{ left: flag.x, top: flag.y, transform: 'rotate(' + flag.rot + 'deg)' }}>
          <div className="rounded-lg border border-amber-300 bg-white/90 p-1 shadow-xl"><UaeFlagIcon className="h-6 w-8" /></div>
        </div>
      ))}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-70 dark:opacity-50">
        <div className="tutorial-ambient-glow absolute -top-32 -right-20 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="tutorial-ambient-glow absolute top-[45%] -left-28 h-96 w-96 rounded-full bg-sky-300/15 blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      {/* The real site's pill-shaped navigation, reproduced without live links. */}
      <header className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-2">
        <div className="tutorial-topbar w-full max-w-[98%] px-4 py-2.5 rounded-[2rem] border-4 border-white/70 dark:border-slate-700/40 flex items-center justify-between md:justify-center gap-4 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl">
          <HintTarget id="school-logo" title={label('هوية المدرسة', 'School identity')} description={label('شعار مدرسة صقر الإمارات الدولية الخاصة، كما يظهر في الموقع الفعلي.', 'The Emirates Falcon International Private School logo used throughout the live site.')} className="shrink-0" tooltipBelow {...hintState}>
            <div className="flex items-center gap-2 group flex-shrink-0 me-3 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <img src="/school-logo.png" alt="EFIPS" className="h-8 w-8 md:h-10 md:w-10 object-contain dark:brightness-0 dark:invert shrink-0 transition-transform group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          </HintTarget>
          <nav className="flex-1 overflow-x-auto no-scrollbar flex items-center h-10 md:h-12 px-1">
            <div className="flex items-center gap-1.5 h-full mx-auto min-w-max">
              {navItems.map((item, index) => (
                <HintTarget
                  key={item.id}
                  id={item.id}
                  title={item.text}
                  description={item.description}
                  className="shrink-0"
                  tooltipBelow
                  {...hintState}
                >
                  <div
                    className="px-3 py-1.5 md:px-5 md:py-2 text-[10px] md:text-sm font-black rounded-full transition-all duration-300 shrink-0 animate-fade-in-up text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700"
                    style={{ animationDelay: ((index + 1) * 50) + 'ms' }}
                  >
                    {item.text}
                  </div>
                </HintTarget>
              ))}
            </div>
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <HintTarget id="language-switch" title={label('تبديل اللغة', 'Language switch')} description={label('بدّل بين العربية والإنجليزية؛ يتغير اتجاه الصفحة تلقائيًا.', 'Switch between Arabic and English. The page direction adapts automatically.')} interactive={false} className="flex shrink-0" tooltipBelow {...hintState}>
              <button type="button" onClick={() => setLocale(isAr ? 'en' : 'ar')} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-[10px] border-2 border-slate-300/80 dark:border-slate-600 rounded-full bg-slate-50/80 dark:bg-slate-800/80 animate-fade-in-up">
                {isAr ? 'EN' : 'AR'}
              </button>
            </HintTarget>
            <HintTarget id="theme-switch" title={label('الوضع الفاتح والداكن', 'Light and dark mode')} description={label('غيّر مظهر الموقع مع الحفاظ على نفس الألوان والهوية البصرية.', 'Change the site appearance while preserving its visual identity.')} interactive={false} className="flex shrink-0" tooltipBelow {...hintState}>
              <button type="button" onClick={toggleTheme} aria-label={label('تغيير المظهر', 'Toggle theme')} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 rounded-full text-sm border-2 border-slate-200/80 dark:border-slate-600 animate-fade-in-up">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </HintTarget>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex w-full flex-col items-center p-4 pt-28 transition-colors duration-500 md:p-8 md:pt-28">
        <div className="w-full max-w-[1300px] mt-3 flex flex-col gap-8 md:mt-2 md:gap-10">
          <HintTarget id="welcome-panel" title={label('منطقة الترحيب', 'Welcome panel')} description={label('يعرض الموقع الحقيقي ترحيبًا مخصصًا حسب الحساب. تم إخفاء اسم المستخدم ونوع الحساب في نسخة الزائر.', 'The live site personalizes this area by account. User names and account roles are hidden in this visitor tour.')} interactive={false} {...hintState}>
            <section className="mx-auto max-w-4xl space-y-3 text-center">
              <div className="inline-block rounded-full border-2 border-slate-200 bg-white/90 px-5 py-2 text-xs font-bold text-slate-700 shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 md:text-sm">
                {label('جولة شاملة', 'Complete tour')}
              </div>
              <div className="flex flex-col items-center gap-2 pt-1">
                <span className="text-lg sm:text-xl md:text-2xl font-black tracking-wide text-emerald-700 dark:text-emerald-300">{label('أهلاً بك', 'Welcome')}</span>
                <div className="group relative cursor-default overflow-hidden rounded-[2.5rem] border-2 border-white/90 bg-white/80 px-8 py-3.5 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/80">
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full dark:via-white/10" />
                  <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white sm:text-4xl md:text-5xl">
                    <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">{label('زائر المكتبة', 'Library Visitor')}</span>
                  </h1>
                </div>
              </div>
              <p className="mx-auto max-w-xl pt-2 text-sm font-semibold text-slate-600 dark:text-slate-400 md:text-lg">
                {label('بوابتك الذكية للوصول إلى المعلومات والإبداع.', 'Your smart gateway to knowledge and creativity.')}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {label('نسخة توضيحية للواجهة — اضغط على أي عنصر لمعرفة وظيفته.', 'Illustrative homepage tour — select any element to learn what it does.')}
              </p>
              {hasSignedInSession ? (
                <Link to="/home" className="mt-2 inline-flex min-h-11 items-center rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2.5 text-sm font-black text-white shadow-sm">
                  {label('العودة إلى البوابة', 'Open the real homepage')}
                </Link>
              ) : (
                <Link to="/" className="mt-2 inline-flex min-h-11 items-center rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2.5 text-sm font-black text-white shadow-sm">
                  {label('تسجيل الدخول لاستخدام الخدمات', 'Sign in to use the services')}
                </Link>
              )}
            </section>
          </HintTarget>

          <HintTarget id="news-banner" title={label('جديدنا — يظهر فورًا', 'What\'s New — visible immediately')} description={label('يعرض شريط جديدنا آخر إضافات المكتبة منذ ظهور الصفحة، دون انتظار دخول النص من خارج الشاشة. هذه نسخة توضيحية لا تجلب أخبارًا حية.', 'What\'s New shows library updates as soon as the page appears, without waiting for offscreen scrolling text. This is an illustrative preview, not a live feed.')} interactive={false} {...hintState}>
            <div className="tutorial-news-ribbon relative z-30 mx-auto flex h-14 w-full max-w-5xl items-center overflow-hidden rounded-full border-4 border-amber-300 bg-white shadow-lg dark:border-amber-700 dark:bg-slate-800 md:h-16">
              <div className="relative z-20 flex h-full shrink-0 items-center gap-2 bg-amber-400 px-5 text-xs font-black uppercase text-slate-900 md:px-8 md:text-sm">
                <span className="h-3 w-3 animate-ping rounded-full bg-white" />
                {label('جديدنا', "What's New")}
              </div>
              <div className="flex h-full flex-1 items-center overflow-hidden bg-amber-50 dark:bg-slate-800">
                <div className="min-w-0 px-4 text-xs font-bold leading-6 text-slate-800 dark:text-slate-100 md:text-sm">
                  {label('جديدنا: ألوان مبهجة للبوابة · كتب جديدة في دليل المكتبة · بين السطور حسب نوع الحساب ولغة الواجهة · تحديات صقر للطلاب · راجع استعاراتك وقائمة قراءتك', "What’s New: bright portal colors · new physical books in the catalogue · role- and language-specific reading adventures · student Saqr Challenges · borrowing and reading lists")}
                </div>
              </div>
            </div>
          </HintTarget>

          <section className="w-full" aria-label={label('واجهة صقر التفاعلية بجميع الفقاعات وترتيبها العشوائي','Saqr interactive homepage tour with all spheres in randomized positions')}>
            <SaqrOrbitNavigation isAr={isAr} userType="admin" tourMode
              tourDescriptions={orbitDescriptions} tourRoles={orbitRoles}
              onMascotClick={() => handleMascotInteraction()}
              showMascotBubble={showBubble} bursts={bursts} />
          </section>

          <div className="tutorial-reading-goal w-full max-w-5xl mx-auto">
            <HintTarget id="monthly-reading-goal" title={label('تحدي القراءة الشهري', 'Monthly Reading Challenge')} description={label('اختر هدف القراءة الشهري وسجّل الكتب التي أنهيتها؛ زر «قائمة القراءة» يفتح قائمة منبثقة تضم الكتب المختارة، مع تحديد تمت القراءة أو لم تتم القراءة؛ وتُحتسب الإنجازات المكتملة هذا الشهر فقط. الحسابات الموثقة يمكنها مزامنة التقدم؛ لا توجد بيانات حقيقية في الجولة.', 'Set a monthly reading goal and mark books finished. The Reading list button opens a popup listing selected books with Read / Not read statuses; only books completed during the current month count. Verified accounts may sync progress; this tour shows no real data.')} interactive={false} {...hintState}>
            <section className="homepage-alerts w-full overflow-hidden rounded-[1.75rem] border-2 border-amber-300 dark:border-amber-500/50 bg-gradient-to-br from-blue-600 via-emerald-600 to-teal-600 dark:from-blue-800 dark:via-emerald-800 dark:to-teal-900 p-4 sm:p-5 shadow-xl text-white transition-all hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-3 items-center"><div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-3 text-white shadow-lg"><BookIcon /></div><div><h2 className="text-base md:text-lg font-black text-white">{label('تحدي القراءة الشهري','Monthly Reading Challenge')}</h2><p className="mt-1 text-xs sm:text-sm text-white/90 font-semibold">{label('جواز القارئ — هدف شخصي','Reading Passport — personal goal')}</p></div></div>
                <span className="rounded-xl border border-white/30 bg-white/15 px-3 py-2 text-white font-black">•• / ••</span>
              </div>
              <div className="mt-5 h-2.5 rounded-full bg-white/25 overflow-hidden"><div className="h-full w-2/5 rounded-full bg-gradient-to-r from-amber-200 to-white transition-all duration-700" /></div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={(event) => { event.stopPropagation(); setReadingPreviewOpen(true); }}
                  className="text-start text-xs font-black text-white underline underline-offset-4 hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                  {label('قائمة القراءة', 'Reading list')}
                </button>
                <span className="text-[11px] font-bold text-white/85">{label('معاينة توضيحية بدون بيانات حقيقية','Illustrative preview · no live records')}</span>
              </div>
            </section>
          </HintTarget>
          </div>

          {/* The real homepage shows these sections only with records; sample fields stay masked. */}
          <details className="mx-auto w-full max-w-5xl rounded-[1.5rem] border border-emerald-200 dark:border-emerald-900 bg-white/95 dark:bg-slate-900/95 p-4 shadow-sm">
            <summary className="cursor-pointer min-h-11 flex items-center text-sm sm:text-base font-black text-emerald-800 dark:text-emerald-200">
              {label('متى تظهر حجوزات المعلم وتنبيهات الاستعارة؟', 'When do teacher bookings and borrowing reminders appear?')}
            </summary>
            <p className="mt-2 mb-4 text-sm leading-7 font-semibold text-slate-600 dark:text-slate-300">
              {label('تظهر الأقسام التالية في الصفحة الرئيسية فقط عند وجود سجلات مرتبطة بحساب المستخدم. هذه البطاقات توضيحية ولا تعرض أي أسماء أو بيانات حقيقية.', 'The following panels appear on the real homepage only when records are linked to the user. This is a privacy-safe illustration with no real names or records.')}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <HintTarget id="teacher-schedule-preview" title={label('جدول المعلم', 'Teacher schedule')} description={label('يُعرض جدول حصص المكتبة المحجوزة لهذا الأسبوع للمعلم فقط عند وجود حجوزات. يمكنك مراجعة اليوم والحصة والمادة والصف والانتقال إلى صفحة الجدول.', 'The teacher sees booked library periods only when they exist, with day, period, subject and grade, and a link to the schedule.')} interactive={false} {...hintState}>
                <article className="homepage-alerts rounded-[1.75rem] border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-white to-teal-50 dark:from-slate-900 dark:to-slate-800 p-5 shadow-sm">
                  <h3 className="font-black text-emerald-800 dark:text-emerald-300">{label('جدول استخدام المكتبة الخاص بك', 'Your Library Schedule')}</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{label('حصصك المحجوزة لهذا الأسبوع', 'Your booked periods this week')}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <span className="rounded-xl bg-white/90 dark:bg-slate-700 p-3 text-xs font-bold">{label('اليوم: —','Day: —')}</span>
                    <span className="rounded-xl bg-white/90 dark:bg-slate-700 p-3 text-xs font-bold">{label('الحصة: —','Period: —')}</span>
                  </div>
                </article>
              </HintTarget>
              <HintTarget id="borrow-notification-preview" title={label('تنبيهات الاستعارة', 'Borrowing notifications')} description={label('تُعرض تنبيهات الاستعارة المرتبطة بحساب المستخدم فقط عند وجود استعارات أو مواعيد إرجاع. يستطيع المستخدم فتح تفاصيلها من صفحته الخاصة.', 'Borrowing notifications appear only when there are books or return dates linked to the signed-in account; users access their own details.')} interactive={false} {...hintState}>
                <article className="homepage-alerts rounded-[1.75rem] border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-900 dark:to-slate-800 p-5 shadow-sm">
                  <h3 className="font-black text-emerald-800 dark:text-emerald-300">{label('تنبيهات استعارة الكتب', 'Book Borrowing Alerts')}</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{label('تظهر عند وجود سجلات مرتبطة بحسابك', 'Shown when your account has linked records')}</p>
                  <div className="mt-4 rounded-xl bg-white/90 dark:bg-slate-700 p-3 text-xs font-bold">{label('عنوان الكتاب: — / موعد الإرجاع: —','Book: — / Return date: —')}</div>
                </article>
              </HintTarget>
            </div>
          </details>



          <details className="mx-auto w-full max-w-5xl rounded-[1.5rem] border border-rose-100 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-5 shadow-sm">
            <summary className="cursor-pointer min-h-11 flex items-center text-base font-black text-rose-700 dark:text-rose-300">
              {label('التعرف على تفاصيل التحديات والهوية الوطنية','Explore the activities inside Saqr Challenges and National Identity')}
            </summary>
            <div className="mt-4"><TutorialFeatureShowcase isAr={isAr}/></div>
          </details>

          <HintTarget id="reading-suggestions" title={label('مكتبتي واقتراحات القراءة','My Books & Reading Suggestions')}
            description={label('تُعرض أربعة اقتراحات مبدئيًا بناءً على نوع الحساب والمرحلة والاهتمامات؛ يعرض زر المزيد نافذة مستقلة ببقية الخيارات. الكتب ملونة مثل المكتبتين الرقميتين، وقائمة القراءة ضمن التحدي الشهري مع حالتي تمت القراءة ولم تتم القراءة. لا تُعرض بيانات مستفيدين حقيقية هنا.', 'Four starting recommendations based on role, grade and interests. More choices open in a separate dialog. Cards match the digital libraries, and a monthly reading list with Read / Not read choices. This tour displays no private data.')}
            interactive={false} {...hintState}>
            <section className="relative w-full rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 bg-transparent p-4 sm:p-6 md:p-8">
              <header className="mb-6 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{label('مكتبتي واقتراحات القراءة','My Books & Reading Suggestions')}</h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">{label('كتب ورقية ورقمية حسب نوع الحساب واهتمامات القراءة','Physical and digital books based on account type and reading interests')}</p>
              </header>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex gap-2">
                  <span className="rounded-xl bg-emerald-600 text-white px-4 py-2.5 font-black text-xs">{label('اقتراحات القراءة','Suggestions')}</span>
                  
                </div>
                <span className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">{label('نوع الكتاب: الكل','Book type: All')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { kind:label('كتاب ورقي','Physical book'), color:'from-blue-500 to-sky-500 border-blue-200'},
                  { kind:label('رقمي عربي','Arabic digital'), color:'from-emerald-500 to-teal-400 border-emerald-200'},
                  { kind:label('رقمي إنجليزي','English digital'), color:'from-rose-500 to-pink-500 border-rose-200'},
                  { kind:label('كتاب مقترح','Suggested book'), color:'from-purple-500 to-indigo-500 border-purple-200'}
                ].map((card,index)=><article key={index} className={'homepage-alert-card group min-h-[200px] rounded-[1.75rem] border-4 bg-gradient-to-br p-4 sm:p-5 text-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col gap-4 '+card.color}>
                  <span className="self-start rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[11px] font-black">{card.kind}</span>
                  <div className="flex items-start gap-2 justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-full rounded-full bg-white/80"/>
                      <div className="h-3 w-3/4 rounded-full bg-white/60"/>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-xl border-2 border-white/70 bg-transparent flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4h12v17l-6-4-6 4V4z"/></svg>
                    </div>
                  </div>
                  <div className="h-2.5 w-2/3 rounded-full bg-white/45"/>
                  <span className="mt-auto text-xs font-black rounded-xl bg-white/20 border border-white/40 px-3 py-2 self-start">{label('عرض الكتاب','View book')}</span>
                </article>)}
              </div>
              <div className="mt-5 flex justify-center">
                <span className="rounded-xl border-2 border-emerald-400 bg-transparent px-6 py-3 text-sm font-black text-emerald-700 dark:text-emerald-300">{label('عرض المزيد — نافذة منبثقة','View more — popup dialog')}</span>
              </div>
              <p className="mt-4 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label('معاينة تعليمية بدون بيانات أو استعلامات حقيقية','Sample-only preview with no live data or requests')}</p>
            </section>
          </HintTarget>

          <section className="mt-2 grid w-full grid-cols-1 md:grid-cols-3 items-stretch gap-4 lg:gap-6">
            <>
              <HintTarget id="uae-feature" title={label('معلومات عن وطني', 'Information About My Country')} description={label('بطاقة ثقافية تعليمية تعرض معلومة عامة عن دولة الإمارات. استخدمنا خطوطًا بديلة هنا بدلًا من بيانات متغيرة.', 'An educational UAE culture card. This tour uses sample placeholder lines instead of changing live content.')} interactive={false} {...hintState}>
                <div className="relative flex flex-col items-center overflow-hidden rounded-[3rem] border-4 border-amber-400 bg-gradient-to-br from-amber-100 via-amber-50 to-emerald-50 p-4 md:p-5 text-center shadow-2xl dark:border-amber-600 dark:from-slate-900 dark:to-slate-950">
                  <div className="absolute left-0 right-0 top-0 flex h-2.5">
                    <div className="w-1/4 bg-red-600" /><div className="w-1/4 bg-emerald-600" /><div className="w-1/4 bg-white" /><div className="w-1/4 bg-black" />
                  </div>
                  <div className="mt-2 mb-3 flex flex-col items-center gap-3">
                    <div className="rounded-3xl border-2 border-amber-300 bg-white p-3 shadow-md dark:border-amber-600 dark:bg-slate-800">
                      <svg viewBox="0 0 24 24" className="h-10 w-10 text-emerald-700 dark:text-emerald-300" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path strokeLinecap="round" d="M4 6v15m4-13h8m-8 4h8" /></svg>
                    </div>
                    <h3 className="text-base font-black tracking-wider text-amber-800 dark:text-amber-400 md:text-xl">{label('معلومات عن وطني', 'Information About My Country')}</h3>
                  </div>
                  <div className="w-full max-w-xl space-y-3" aria-label={label('محتوى مخفي', 'Hidden content')}>
                    <div className="mx-auto h-3 w-11/12 rounded-full bg-amber-200/90 dark:bg-slate-700" />
                    <div className="mx-auto h-3 w-10/12 rounded-full bg-amber-200/70 dark:bg-slate-700" />
                    <div className="mx-auto h-3 w-8/12 rounded-full bg-amber-200/60 dark:bg-slate-700" />
                  </div>
                  <p className="mt-4 text-[10px] font-bold text-slate-500 dark:text-slate-400">{label('معاينة شكل البطاقة — المحتوى الحي مخفي', 'Card style preview — live content hidden')}</p>
                </div>
              </HintTarget>

              <>
                <HintTarget id="visitor-counter" title={label('عداد الزوار', 'Visitor counter')} description={label('يعرض عدد الزيارات وتاريخها في الموقع الفعلي. الرقم والتاريخ الفعليان مخفيان في المعاينة.', 'Shows site visits and date in the live portal. The real count and date are hidden here.')} interactive={false} {...hintState}>
                  <div className="homepage-alert-card flex h-full flex-col items-center justify-between rounded-[2rem] border-4 border-slate-200 bg-white p-4 lg:p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-3 w-3 animate-ping rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 md:text-sm">{label('زوار البوابة:', 'Portal Visitors:')}</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white md:text-3xl">••••</span>
                    <span className="mt-2 text-[11px] font-bold text-slate-400">•• / •• / ••••</span>
                  </div>
                </HintTarget>
                <HintTarget id="national-event" title={label('المناسبات الوطنية', 'National events')} description={label('بطاقة المناسبات والعد التنازلي. التواريخ والأرقام الحية لا تظهر في صفحة التوتوريال.', 'An events and countdown card. Live dates and numbers are not shown in the tutorial.')} interactive={false} {...hintState}>
                  <div className="homepage-alert-card relative flex h-full flex-col items-center justify-between overflow-hidden rounded-[2rem] border-4 border-emerald-500/80 bg-gradient-to-br from-white via-emerald-50/40 to-rose-50/40 p-6 text-center shadow-xl dark:border-emerald-600 dark:from-slate-900 dark:via-emerald-950/20 dark:to-rose-950/20">
                    <div className="absolute left-0 right-0 top-0 flex h-2">
                      <div className="w-1/4 bg-[#ff0000]" /><div className="w-1/4 bg-[#00732f]" /><div className="w-1/4 bg-white" /><div className="w-1/4 bg-black" />
                    </div>
                    <div className="relative z-10 mt-1 flex items-center justify-center gap-2">
                      <div className="animate-flag-wave origin-bottom-left"><UaeFlagIcon className="h-4 w-6 rounded-sm shadow" /></div>
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{label('إجازة عيد الاتحاد', 'UAE National Day Break')}</span>
                      <div className="animate-flag-wave-delayed origin-bottom-right"><UaeFlagIcon className="h-4 w-6 rounded-sm shadow" /></div>
                    </div>
                    <div className="relative z-10 my-3">
                      <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400">{label('العد التنازلي', 'Countdown')}</span>
                      <span className="mt-1 block bg-gradient-to-r from-red-600 via-emerald-600 to-slate-900 bg-clip-text text-4xl font-black text-transparent">••</span>
                    </div>
                    <span className="relative z-10 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-1 text-[10px] font-black text-slate-700 shadow-sm dark:border-emerald-800 dark:bg-slate-800/90 dark:text-slate-200">{label('تفاصيل الموعد مخفية', 'Event details hidden')}</span>
                  </div>
                </HintTarget>
              </>
            </>
          </section>

          <section className="rounded-[2rem] border border-emerald-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-emerald-900 dark:bg-slate-900/80 sm:p-7">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-black sm:text-2xl">{label('انتهيت من الجولة؟', 'Finished the tour?')}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{label('يمكنك الرجوع إلى شاشة الدخول لاستخدام الخدمات الفعلية بحساب مدرسي.', 'Return to sign in when you are ready to use live services with a school account.')}</p>
              </div>
              <Link to="/" className="shrink-0 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500">{label('العودة لتسجيل الدخول', 'Back to sign in')}</Link>
            </div>
          </section>
        </div>
      </main>

      {/* Matching floating Saqr control; the tooltip is local and never opens the live assistant. */}
      <HintTarget id="floating-saqr" title={label('مساعد صقر العائم', 'Floating Saqr assistant')} description={label('في الموقع الفعلي يفتح هذا الزر نافذة المساعد. هنا يوضح وظيفته فقط ولا يستدعي خدمة حقيقية.', 'On the live site this button opens the assistant window. Here it explains the feature only and never calls a live service.')} className={'fixed bottom-5 z-[110] ' + (dir === 'rtl' ? 'left-5' : 'right-5')} {...hintState}>
        <div className="group relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] border-4 border-slate-200 bg-white shadow-xl transition-transform duration-300 hover:scale-110 active:scale-95 dark:border-slate-700 dark:bg-slate-800 md:h-20 md:w-20">
          <img src="/saqr-avatar.png" alt="Saqr" className="h-[85%] w-[85%] animate-float object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800" />
          </span>
        </div>
      </HintTarget>

      {readingPreviewOpen && createPortal(
        <div role="presentation" onMouseDown={event => {if(event.target===event.currentTarget)setReadingPreviewOpen(false);}}
          className="fixed inset-0 z-[6000] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-3 sm:p-6">
          <div role="dialog" aria-modal="true" aria-labelledby="tutorial-read-list-title" dir={dir}
            className="w-full max-w-xl overflow-hidden rounded-[2rem] border-2 border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-950 shadow-2xl">
            <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white">
              <div>
                <p className="text-xs font-bold text-white/90">{label('تحدي القراءة الشهري', 'Monthly Reading Challenge')}</p>
                <h2 id="tutorial-read-list-title" className="mt-1 text-xl font-black">{label('قائمة القراءة والتحدي الشهري', 'Reading list & monthly challenge')}</h2>
              </div>
              <button type="button" onClick={() => setReadingPreviewOpen(false)} aria-label={label('إغلاق','Close')}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/15 text-white hover:bg-white/25">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19"/></svg>
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"><BookIcon/></div>
              <p className="font-black text-slate-900 dark:text-white">{label('هنا تظهر الكتب المختارة وحالة قراءتها', 'Selected books and their reading statuses appear here')}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{label('يعرض الموقع الحقيقي الكتب المختارة ويمكن تحديد تمت القراءة أو لم تتم القراءة؛ ويحتسب عداد الشهر الكتب المنجزة خلاله. لا تعرض هذه الجولة بيانات أي طالب.', 'The live site shows each title, author and its Read / Not read status. Books completed this month contribute to the counter. This tour shows no student records.')}</p>
              <span className="mt-4 inline-block rounded-xl bg-amber-50 dark:bg-amber-950/40 px-4 py-2 text-xs font-black text-amber-900 dark:text-amber-200">{label('معاينة آمنة فقط', 'Safe preview only')}</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      <footer className="relative z-10 border-t-4 border-slate-200 px-4 py-6 text-center dark:border-slate-800">
        <p className="text-xs font-black text-slate-500 dark:text-slate-400" dir={dir}>{label("© 2026 جميع الحقوق محفوظة لمدرسة صقر الإمارات الدولية الخاصة.", "© 2026 EFIPS. All rights reserved.")}</p>
        <p className="mt-1 text-[10px] font-semibold text-slate-400">{label('نسخة معاينة — البيانات الحقيقية غير معروضة', 'Preview mode — live data is not displayed')}</p>
      </footer>
      <style>{"\n        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');\n        .tutorial-page, .tutorial-page * { font-family: 'Cairo', sans-serif; }\n        @keyframes burst-steady {\n          0% { transform: translate(0, 0) scale(.5); opacity: 0; }\n          20% { transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(var(--rot)); opacity: 1; }\n          80% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }\n          100% { transform: translate(var(--tx), calc(var(--ty) - 20px)) scale(.8) rotate(var(--rot)); opacity: 0; }\n        }\n        .animate-burst-steady { animation: burst-steady 2s cubic-bezier(.19,1,.22,1) forwards; }\n        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }\n        .animate-float { animation: float 5s ease-in-out infinite; }\n        @keyframes flag-wave { 0%, 100% { transform: rotate(-6deg) scale(1); } 50% { transform: rotate(8deg) scale(1.08) skewY(2deg); } }\n        .animate-flag-wave { animation: flag-wave 2.2s ease-in-out infinite; }\n        .animate-flag-wave-delayed { animation: flag-wave 2.2s ease-in-out 1.1s infinite; }\n        @keyframes flag-float {\n          0% { opacity: 1; transform: scale(.6) translateY(0) rotate(0); }\n          50% { opacity: 1; transform: scale(1.15) translateY(-35px) rotate(12deg); }\n          100% { opacity: 0; transform: scale(.8) translateY(-75px) rotate(-10deg); }\n        }\n        .animate-flag-float { animation: flag-float 1.8s ease-out forwards; }\n        @keyframes fade-out { 0% { opacity: 1; transform: scale(1) translateY(0); } 100% { opacity: 0; transform: scale(.3) translateY(-40px); } }\n        .animate-fade-out { animation: fade-out 1.5s ease-out forwards; }\n        @keyframes tutorial-fade-up { 0% { opacity: 0; transform: translateY(18px) scale(.985); } 100% { opacity: 1; transform: translateY(0) scale(1); } }\n        .tutorial-feature-card { isolation: isolate; transform: translateZ(0); -webkit-tap-highlight-color: transparent; }\n        .tutorial-feature-card::after {\n          content: \"\"; position: absolute; inset: 0; z-index: 1; pointer-events: none; border-radius: inherit;\n          background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,.35) 48%, transparent 70%);\n          transform: translateX(-125%); transition: transform 650ms cubic-bezier(.2,.7,.2,1);\n        }\n        @media (hover: hover) and (pointer: fine) {\n          .tutorial-feature-card:hover { box-shadow: 0 24px 48px rgba(15,23,42,.22); }\n          .tutorial-feature-card:hover::after { transform: translateX(125%); }\n        }\n        .homepage-alert-card { position: relative; overflow: hidden; transform: translateZ(0); transition: transform 260ms cubic-bezier(.2,.75,.25,1), box-shadow 260ms ease, border-color 260ms ease; -webkit-tap-highlight-color: transparent; }\n        .homepage-alert-card::after { content: \"\"; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,.42) 48%, transparent 70%); transform: translateX(-125%); transition: transform 650ms cubic-bezier(.2,.7,.2,1); }\n        @media (hover: hover) and (pointer: fine) { .homepage-alert-card:hover { transform: translateY(-4px) scale(1.008); border-color: rgba(16,185,129,.55); } .homepage-alert-card:hover::after { transform: translateX(125%); } }\n        .homepage-alert-card:active { transform: scale(.985); }\n        @keyframes tutorial-glow { 0%,100% { opacity:.45; transform:scale(1); } 50% { opacity:.85; transform:scale(1.1); } }\n        .tutorial-ambient-glow { animation: tutorial-glow 8s ease-in-out infinite; }\n        @media (prefers-reduced-motion: reduce) {\n          .tutorial-page *, .tutorial-page *::before, .tutorial-page *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }\n        }\n"}</style>
    </div>
  );
}
