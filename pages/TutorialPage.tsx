import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLanguage, useTheme } from '../App';

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
    if (!sectionRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '-50px 0px -50px 0px' }
    );
    observer.observe(sectionRef.current);
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
  const label = (ar: string, en: string) => isAr ? ar : en;

  useEffect(() => {
    if (!readingPreviewOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReadingPreviewOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [readingPreviewOpen]);

  const handleMascotInteraction = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
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

  const featureCards = [
    {
      id: 'manual-search', title: label('البحث اليدوي', 'Manual Search'),
      description: label('البحث عن كتاب داخل مكتبة المدرسة والوصول إلى مكانه.', 'Search the school library catalogue and locate a book.'),
      color: 'bg-sky-400', border: 'border-sky-600', icon: <SearchIcon />,
      hint: label('ابحث بعنوان الكتاب أو مؤلفه، ثم افتح البطاقة لمعرفة مكانه. هذه المعاينة لا تتصل بفهرس الكتب الحقيقي.', 'Search by title or author, then open a card to learn its sample location. This tour does not connect to the live catalogue.')
    },
    {
      id: 'smart-search', title: label('اسأل صقر الذكي', 'Ask Saqr (AI)'),
      description: label('مساعدك الذكي للبحث والاستفسار.', 'Your smart assistant for research and questions.'),
      color: 'bg-emerald-400', border: 'border-emerald-600', icon: <SmartIcon />,
      hint: label('اطلب اقتراح كتاب أو اكتب سؤالاً باللغة الطبيعية. في الجولة ستظهر لك تلميحات فقط ولن تُرسل رسالتك إلى أي خدمة.', 'Ask for book recommendations or use natural language. In this tour, prompts only reveal guidance and are not sent to a service.')
    },
    {
      id: 'digital-library', title: label('المكتبة الإلكترونية', 'Digital Library'),
      description: label('عالم من الكتب والروايات الرقمية.', 'A world of digital books and novels.'),
      color: 'bg-indigo-400', border: 'border-indigo-600', icon: <BookIcon />,
      hint: label('تعرّف على أقسام القراءة الرقمية وطريقة استكشاف الموارد المتاحة بحسب صلاحيات حسابك.', 'Explore digital reading sections and resources available to your account.')
    },
    {
      id: 'creators', title: label('ركن المبدعين', 'Creators Corner'),
      description: label('استكشف إبداعات ومشاركات زملائك.', 'Explore creative work shared by students.'),
      color: 'bg-purple-400', border: 'border-purple-600', icon: <CreatorIcon />,
      hint: label('مساحة لاستعراض الأعمال والمشروعات الإبداعية. محتوى المشاركات الحقيقية مخفي في هذه الجولة.', 'A space for creative work and projects. Real submissions are hidden in this tour.')
    },
    {
      id:'reading-quest',title:label('بين السطور مع صقر','Between the Lines with Saqr'),
      description:label('أسئلة موثقة من كتب عربية وإنجليزية تناسب الطلاب والمعلمين.','Source-backed questions from school books, matched to account and language.'),
      color:'bg-emerald-700',border:'border-emerald-900',icon:<BookIcon/>,
      hint:label('للمعلم بطاقة على الرئيسية، وللطالب ضمن تحديات صقر. اختر عدد الكتب واقرأ من مكتبة المدرسة ثم أجب عن 5 إلى 10 أسئلة لكل كتاب.','Teachers open the challenge from Home. Students enter through Saqr Challenges. Choose book count, read at your library and answer 5–10 questions per book.')
    },
    {
      id: 'national-identity', title: label('صقر وهوية وطن', 'Saqr & National Identity'),
      description: label('رحلات ثقافية إماراتية للطلاب.', 'UAE heritage learning for students and administrators.'),
      color: 'bg-gradient-to-br from-[#075B49] via-[#087555] to-[#116759]', border: 'border-emerald-900',
      icon: <svg className="h-9 w-9" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M24 11C18 7 11 7 5 9v29c7-2 14-1 19 3 5-4 12-5 19-3V9c-6-2-13-2-19 2ZM24 11v30"/><path d="m30 19 3-6 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="currentColor" fillOpacity=".24"/></svg>,
      hint: label('جواز صقر الثقافي وكنوز لغتنا ومحقق ذاكرة الوطن وتحدي راية المجد بعشرة أسئلة عن علم الإمارات، بالإضافة إلى جناح مستقل لكتب الهوية الوطنية. نقاط اللعبة حسب صلاحية الحساب. المعاينة لا تشغّل الألعاب.',
        'Explore the Cultural Passport, Language Treasures, Heritage Research Detective, a 10-question UAE Flag Challenge and the separate National Identity Pavilion. Only students receive game points. This tour does not launch games.')
    },
    {
      id: 'studio', title: label('استديو صقر', 'Saqr Studio'),
      description: label('سجّل بودكاست بعنوانه ثم راجع حلقتك قبل إرسال MP3.', 'Record a titled podcast, review it, and submit one MP3.'),
      color: 'bg-blue-500', border: 'border-blue-700', icon: <StudioIcon />,
      hint: label('تعرّف على تسجيل الصوت ومعاينة المؤثرات وإرسال حلقة MP3 بعنوانها واسم الطالب وصفه؛ الجولة لا تسجل ولا ترفع ملفات.', 'Explore recording, preview effects, and one MP3 podcast submission with title, student name and grade. No audio is recorded or uploaded during this tour.')
    },
    {
      id: 'schedule', title: label('جدول المكتبة', 'Library Schedule'),
      description: label('تنظيم وحجز زيارات المكتبة للمعلمين.', 'Organize and book teacher library visits.'),
      color: 'bg-teal-500', border: 'border-teal-700', icon: <ScheduleIcon />,
      hint: label('يمكن للمعلمين الاطلاع على الحصص المتاحة وحجوزاتهم. بيانات الحجوزات والأسماء الفعلية مخفية هنا.', 'Teachers can view available periods and reservations. Real schedules and names are hidden here.')
    },
    {
      id: 'game', title: label('رتب المكتبة', 'Library Game'),
      description: label('العب وتعلّم تصنيف الكتب.', 'Play and learn how books are classified.'),
      color: 'bg-amber-400 text-slate-900', border: 'border-amber-600', icon: <GameIcon />,
      hint: label('تجربة تعليمية تفاعلية تساعد الطلاب على فهم تصنيف ديوي وتنظيم الكتب.', 'An interactive learning activity that helps students understand Dewey Decimal Classification.')
    },
    {
      id: 'admin', title: label('إدارة النظام', 'System Admin'),
      description: label('أدوات إدارة المنصة والبيانات.', 'Platform and data administration tools.'),
      color: 'bg-rose-500', border: 'border-rose-700', icon: <AdminIcon />,
      hint: label('هذه الأدوات مخصصة للإدارة فقط؛ لا يمكن فتح لوحة الإدارة أو عرض بياناتها من صفحة الزائر.', 'Administration tools are restricted. This visitor tour cannot open the admin dashboard or expose its records.')
    }
  ];

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
    <div dir={dir} className="tutorial-page min-h-screen w-full overflow-x-hidden bg-[#f8fafc] font-sans text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">
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
        <div className="w-full max-w-[98%] px-4 py-2.5 rounded-[2rem] border-4 border-white/70 dark:border-slate-700/40 flex items-center justify-between md:justify-center gap-4 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl">
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
                {label('وضع الجولة التعريفية', 'Guided preview mode')}
              </div>
              <div className="flex flex-col items-center gap-2 pt-1">
                <span className="text-base font-normal tracking-wide text-slate-500 dark:text-slate-400 md:text-xl">{label('أهلاً بك', 'Welcome')}</span>
                <div className="group relative cursor-default overflow-hidden rounded-[2.5rem] border-2 border-white/90 bg-white/80 px-8 py-3.5 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/80">
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full dark:via-white/10" />
                  <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white sm:text-4xl md:text-5xl">
                    <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">{label('زائر المكتبة', 'Library Visitor')}</span>
                  </h1>
                </div>
              </div>
              <p className="mx-auto max-w-xl pt-2 text-sm font-normal text-slate-600 dark:text-slate-400 md:text-lg">
                {label('بوابتك الذكية للوصول إلى المعلومات والإبداع.', 'Your smart gateway to knowledge and creativity.')}
              </p>
            </section>
          </HintTarget>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
          <HintTarget id="monthly-reading-goal" title={label('تحدي القراءة الشهري', 'Monthly Reading Challenge')} description={label('اختر هدف القراءة الشهري وسجّل الكتب التي أنهيتها؛ زر «قائمة القراءة» يفتح قائمة منبثقة تضم الكتب المكتملة خلال الشهر نفسه، بنفس عدد العداد. الحسابات الموثقة يمكنها مزامنة التقدم؛ لا توجد بيانات حقيقية في الجولة.', 'Set a monthly reading goal and mark books finished. The Reading list button opens a popup listing this month’s completed books, matching the counter. Verified accounts may sync progress; this tour shows no real data.')} interactive={false} {...hintState}>
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


            <HintTarget id="saqr-mascot" title={label('شخصية صقر', 'Saqr mascot')} description={label('اضغط أو المس شخصية صقر في الموقع الحقيقي لمشاهدة التفاعل والرسائل الترحيبية.', 'The live site mascot offers small interactive moments and welcoming messages.')} interactive={false} className="min-w-0 flex flex-col items-center justify-center" {...hintState}>
              <div onClick={handleMascotInteraction} className="group relative flex cursor-pointer flex-col items-center">
                {bursts.map((burst) => (
                  <div key={burst.id} className={'pointer-events-none absolute z-[100] animate-burst-steady ' + burst.color} style={{ '--tx': burst.tx + 'px', '--ty': burst.ty + 'px', '--rot': burst.rot + 'deg' } as React.CSSProperties}>
                    <StarIcon className="h-8 w-8 drop-shadow-md" />
                  </div>
                ))}
                {showBubble && (
                  <div className="animate-bounce absolute -top-14 z-30 rounded-2xl border-4 border-rose-500 bg-white px-6 py-2.5 text-sm font-black text-rose-600 shadow-2xl dark:bg-slate-800 dark:text-rose-400 md:text-base">
                    {label('فخورين بالإمارات', 'Proud of the UAE')} <UaeFlagIcon className="inline-block h-5 w-7 align-middle" />
                  </div>
                )}
                <img src="/school-logo.png" alt="" className="pointer-events-none absolute inset-0 z-0 m-auto h-48 w-48 md:h-56 md:w-56 object-contain opacity-10 transition-all duration-300 dark:opacity-25 dark:brightness-0 dark:invert" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <img src="/saqr-full.png" alt="Saqr mascot" className="relative z-10 h-40 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 md:h-56" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </HintTarget>


          </div>

          {/* Notifications are rendered with deliberately masked sample fields. */}
          <HintTarget id="notifications" title={label('التنبيهات الشخصية', 'Personal notifications')} description={label('تظهر هنا تذكيرات الاستعارات ومواعيد استخدام المكتبة عندما تكون متاحة لحسابك. القيم الشخصية محجوبة بالكامل.', 'Borrowing reminders and library bookings appear here when available. Personal values are deliberately masked.')} interactive={false} {...hintState}>
            <section className="homepage-alerts relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/80 to-teal-50/70 p-4 shadow-[0_18px_55px_rgba(15,118,110,0.13)] dark:border-emerald-900/80 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 sm:p-6 md:rounded-[2.5rem] md:p-8">
              <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />
              <div className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl dark:bg-teal-400/10" />
              <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-7">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/15 sm:h-14 sm:w-14">
                    <BookIcon />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl md:text-3xl">{label('تنبيهاتك', 'Your Notifications')}</h2>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">{label('تذكيرات الاستعارات وجدول استخدام المكتبة', 'Borrowing reminders and your library schedule')}</p>
                  </div>
                </div>
                <span className="inline-flex self-start items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-2 text-xs font-black text-emerald-800 shadow-sm dark:border-emerald-800 dark:bg-slate-800/80 dark:text-emerald-300">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" /> {label('•• تنبيه تجريبي', '•• demo items')}
                </span>
              </div>
              <div className="relative grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-white/90 p-4 shadow-sm dark:border-amber-800/70 dark:bg-slate-800/90 sm:rounded-3xl sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"><BookIcon /></div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-[11px] font-extrabold text-slate-500 dark:text-slate-400">{label('عنوان الكتاب', 'Book title')}</p>
                      <p className="font-black text-slate-900 dark:text-white">••••••••••••••</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-900/70">
                    <p className="mb-1 text-[11px] font-extrabold text-slate-500 dark:text-slate-400">{label('تاريخ الإرجاع', 'Return date')}</p>
                    <p className="font-black text-rose-600 dark:text-rose-400">•• / •• / ••••</p>
                    <p className="mt-1.5 text-xs font-extrabold leading-relaxed text-emerald-700 dark:text-emerald-300">{label('تفاصيل مخفية في الجولة', 'Details hidden in this tour')}</p>
                  </div>
                </div>
                <div className="homepage-alert-card rounded-2xl border border-emerald-200 bg-white/90 p-4 shadow-sm dark:border-emerald-800/70 dark:bg-slate-800/90 sm:rounded-3xl sm:p-5">
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="h-8 w-1.5 rounded-full bg-emerald-600" />
                    <h3 className="text-base font-black text-slate-800 dark:text-white sm:text-lg">{label('جدول استخدام المكتبة', 'Library Schedule')}</h3>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/70">
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{label('اليوم والحصة', 'Day and period')}</p>
                    <p className="mt-1 font-black text-slate-800 dark:text-white">•••••• ••</p>
                    <div className="mt-3 h-2 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-2 h-2 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              </div>
              <p className="relative mt-4 text-[10px] font-bold text-slate-500 dark:text-slate-400">{label('هذه بطاقات شكلية فقط؛ لا توجد استعارات أو جداول حقيقية في صفحة الجولة.', 'These are visual placeholders only. No live loans or schedules are loaded here.')}</p>
            </section>
          </HintTarget>

          <HintTarget id="news-banner" title={label('شريط الأخبار والتنبيهات', 'News and announcements')} description={label('يعرض الأخبار العامة والتنويهات المهمة من المكتبة. النص هنا توضيحي وليس إعلانًا حيًا.', 'Displays library news and important announcements. This text is illustrative, not a live announcement.')} interactive={false} {...hintState}>
            <div className="relative z-30 mx-auto flex h-14 w-full max-w-5xl items-center overflow-hidden rounded-full border-4 border-amber-300 bg-white shadow-lg dark:border-amber-700 dark:bg-slate-800 md:h-16">
              <div className="relative z-20 flex h-full shrink-0 items-center gap-2 bg-amber-400 px-5 text-xs font-black uppercase text-slate-900 md:px-8 md:text-sm">
                <span className="h-3 w-3 animate-ping rounded-full bg-white" />
                {label('جديدنا', "What's New")}
              </div>
              <div className="flex h-full flex-1 items-center overflow-hidden bg-amber-50 dark:bg-slate-800">
                <div className="whitespace-nowrap px-4 text-xs font-bold text-slate-800 dark:text-slate-100 md:text-base">
                  {label('بين السطور مع صقر: تحدي قراءة الكتب | تحدي راية المجد: عشرة أسئلة جديدة عن العلم | جناح الهوية الوطنية: اكتشف الكتب والمؤلفين | قائمة قراءتك الشهرية | سجل صوتك في بودكاست صقر | جديد الكتب بانتظارك!', "Between the Lines with Saqr: read and answer | Explore the National Identity Pavilion | Ten UAE flag questions | Track your monthly reading | Record a Saqr Podcast MP3 | Discover the latest books in our library!")}
                </div>
              </div>
            </div>
          </HintTarget>

          {/* The cards preserve the exact colors, borders, radii, and icon artwork from HomePage. */}
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">{label('جولة تفاعلية', 'Interactive tour')}</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">{label('استكشف خدمات المكتبة', 'Explore library services')}</h2>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{label('المس أي بطاقة لعرض التلميح', 'Tap any card to pin its feature hint')}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((card, index) => (
                <HintTarget key={card.id} id={card.id} title={card.title} description={card.hint} tooltipBelow {...hintState}>
                  <div style={{ animation: 'tutorial-fade-up .65s ease-out ' + (index * 65) + 'ms both' }} className={'tutorial-feature-card group relative flex min-h-[140px] cursor-pointer items-center gap-5 overflow-hidden rounded-[2.5rem] border-b-8 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:translate-y-1 active:border-b-0 ' + card.color + ' ' + card.border}>
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.4rem]">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-125" />
                    </div>
                    <div className={'relative z-10 shrink-0 rounded-2xl bg-white/20 p-3.5 backdrop-blur-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ' + (card.id === 'game' ? 'text-slate-900' : '')}>
                      {card.icon}
                    </div>
                    <div className="relative z-10 min-w-0">
                      <h3 className="mb-1 text-xl font-black tracking-tight md:text-2xl">{card.title}</h3>
                      <p className="text-xs font-normal leading-snug opacity-90 md:text-sm">{card.description}</p>
                      <p className="mt-2 text-[10px] font-black opacity-90">{label('مرّر المؤشر أو المس للتفاصيل', 'Hover or tap for details')}</p>
                    </div>
                    {card.id === 'studio' || card.id === 'game' ? (
                      <span className="absolute right-4 top-4 rounded-full bg-rose-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md">{label('جديد', 'NEW')}</span>
                    ) : null}
                  </div>
                </HintTarget>
              ))}
            </div>
          </section>

          <section aria-labelledby="heritage-tour-title" className="rounded-[2rem] border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/15 p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">{label('داخل قسم صقر وهوية وطن', 'INSIDE SAQR & NATIONAL IDENTITY')}</p>
                <h2 id="heritage-tour-title" className="mt-1 text-lg sm:text-xl font-black text-slate-900 dark:text-white">{label('تحديات ثقافية وجناح الهوية الوطنية', 'Cultural challenges and the National Identity Pavilion')}</h2>
              </div>
              <span className="rounded-full border border-emerald-200 bg-white dark:bg-slate-900 dark:border-emerald-900 px-3 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">{label('حسب صلاحية الحساب', 'Role-based access')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id:'heritage-passport', ar:'جواز صقر الثقافي', en:'Saqr Cultural Passport', arHint:'جولة قراءة وبحث عبر الإمارات السبع للحصول على الأختام.', enHint:'Explore all seven emirates with reading tasks and collect stamps.', color:'from-emerald-700 to-teal-600', icon:'passport' },
                { id:'heritage-words', ar:'كنوز لغتنا الإماراتية', en:'Emirati Language Treasures', arHint:'مفردات تراثية وأسئلة وجمل من تأليف الطالب.', enHint:'Heritage vocabulary, comprehension questions and sentences.', color:'from-amber-600 to-orange-600', icon:'weave' },
                { id:'heritage-detective', ar:'محقق ذاكرة الوطن', en:'Heritage Research Detective', arHint:'ملفات مبنية على المصادر لتدريب الطالب على التحقق من المعلومات.', enHint:'Source-based research files for learning how to verify facts.', color:'from-sky-700 to-indigo-700', icon:'document' },
                { id:'heritage-flag', ar:'تحدي راية المجد', en:'Flag Day Challenge', arHint:'لعبة رفع العلم عبر معالم الإمارات؛ النقاط حسب صلاحية الحساب، ولا تفتح اللعبة داخل الجولة.', enHint:'Ten progressive, randomized questions about the UAE flag in your selected language. This is a preview only.', color:'from-emerald-700 to-slate-900', icon:'flag' }
              ].map(activity => (
                <HintTarget key={activity.id} id={activity.id} title={label(activity.ar,activity.en)} description={label(activity.arHint,activity.enHint)} tooltipBelow {...hintState}>
                  <div className="overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
                    <div className={'flex items-center justify-between bg-gradient-to-br '+activity.color+' p-4 text-white'}>
                      {activity.icon === 'flag'
                        ? <UaeFlagIcon className="h-9 w-12"/>
                        : <svg viewBox="0 0 48 48" className="h-10 w-10" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            {activity.icon==='passport'?<><path d="M24 11C18 7 11 7 5 9v29c7-2 14-1 19 3 5-4 12-5 19-3V9c-6-2-13-2-19 2ZM24 11v30"/><path d="m18 23 4 4 8-9"/></>
                              :activity.icon==='weave'?<><path d="M6 8h36v32H6zM6 16h36M6 32h36M14 8v32M30 8v32M22 8v32M38 8v32"/><path d="m14 24 8-8 8 8-8 8-8-8Z"/></>
                              :<><path d="M12 5h17l9 9v29H12zM29 5v10h9M18 23h14M18 29h14M18 35h9"/><circle cx="31" cy="36" r="7"/></>}
                          </svg>}
                      <span className="rounded-full bg-white/15 border border-white/25 px-2 py-1 text-[10px] font-bold">{label('اكتشف', 'Discover')}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="min-h-[46px] font-black text-sm leading-6 text-slate-900 dark:text-white">{label(activity.ar,activity.en)}</h3>
                      <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">{label(activity.arHint,activity.enHint)}</p>
                    </div>
                  </div>
                </HintTarget>
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{label('هذه معاينة تعليمية للأنشطة؛ لا يتم تسجيل تقدم أو منح نقاط هنا.', 'This is a visual tour only. No progress or game points are recorded here.')}</p>
          </section>

          <HintTarget id="reading-suggestions" title={label('مكتبتي واقتراحات القراءة','My Books & Reading Suggestions')}
            description={label('تُعرض أربعة اقتراحات مبدئيًا بناءً على نوع الحساب والمرحلة والاهتمامات؛ يعرض زر المزيد نافذة مستقلة ببقية الخيارات. الكتب ملونة مثل المكتبتين الرقميتين، وقائمة القراءة لاحقًا منفصلة. لا تُعرض بيانات مستفيدين حقيقية هنا.', 'Four starting recommendations based on role, grade and interests. More choices open in a separate dialog. Cards match the digital libraries, with a separate read-later list. This tour displays no private data.')}
            interactive={false} {...hintState}>
            <section className="relative w-full rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 bg-transparent p-4 sm:p-6 md:p-8">
              <header className="mb-6 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{label('مكتبتي واقتراحات القراءة','My Books & Reading Suggestions')}</h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">{label('كتب ورقية ورقمية حسب نوع الحساب واهتمامات القراءة','Physical and digital books based on account type and reading interests')}</p>
              </header>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex gap-2">
                  <span className="rounded-xl bg-emerald-600 text-white px-4 py-2.5 font-black text-xs">{label('اقتراحات القراءة','Suggestions')}</span>
                  <span className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-2.5 font-black text-xs">{label('القراءة لاحقًا','Read later')}</span>
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
                <h2 id="tutorial-read-list-title" className="mt-1 text-xl font-black">{label('قائمة الكتب المكتملة', 'Completed reading list')}</h2>
              </div>
              <button type="button" onClick={() => setReadingPreviewOpen(false)} aria-label={label('إغلاق','Close')}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/15 text-white hover:bg-white/25">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19"/></svg>
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"><BookIcon/></div>
              <p className="font-black text-slate-900 dark:text-white">{label('هنا تظهر الكتب التي أُكملت خلال الشهر الحالي', 'Books completed this month appear here')}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{label('يعرض الموقع الحقيقي اسم الكتاب والمؤلف وتاريخ الإتمام، ويطابق عدد الكتب العداد أعلى التحدي. لا تعرض هذه الجولة بيانات أي طالب.', 'The live site shows each title, author and completion date, matching the counter above the challenge. This tour shows no student records.')}</p>
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
