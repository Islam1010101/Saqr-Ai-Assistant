import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { supabase } from '../src/utils/supabase';

const translations = {
  ar: {
    welcome: 'بوابة المعرفة في مدرسة صقر الإمارات',
    subWelcome: 'بوابتك الذكية للوصول إلى المعلومات والإبداع.',
    welcomeUser: 'أهلاً بك',
    logout: 'تسجيل الخروج',
    adminBadge: 'مدير النظام',
    teacherBadge: 'حساب معلم',
    studentBadge: 'حساب طالب',
    adminSettings: 'إدارة النظام',
    adminSettingsDesc: 'التحكم الشامل في المنصة والبيانات',
    newsTitle: 'جديدنا',
    newsContent: 'تم إضافة كتب جديدة في القسم العربي، الرجاء زيارة المكتبة للاطلاع عليها | استديو البودكاست متاح الآن للتسجيل ومشاركة إبداعاتكم الصوتية.',
    manualSearch: 'البحث اليدوي',
    manualDesc: 'ابحث عن كتاب محدد في مكتبة المدرسة بسهولة.',
    smartSearch: 'اسأل صقر الذكي',
    smartDesc: 'مساعدك الذكي للبحث والاستفسار.',
    digitalLibrary: 'المكتبة الإلكترونية',
    digitalDesc: 'عالم من الكتب والروايات الرقمية.',
    creators: 'ركن المبدعين',
    creatorsDesc: 'استكشف قصص وابتكارات زملائك المبدعين.',
    scheduleTitle: 'جدول المكتبة',
    scheduleDesc: 'حجز وتنسيق حصص زيارة المكتبة للمعلمين.',
    gameTitle: 'رتب المكتبة',
    gameDesc: 'العب وتعلّم كيفية تصنيف الكتب.',
    saqrStudioBanner: 'استديو صقر',
    saqrStudioDesc: 'سجّل إبداعاتك الصوتية وشارك في البودكاست.',
    bubble: 'فخورين بالإمارات',
    homelandTitle: 'معلومات عن وطني',
    visitorsLabel: 'زوار البوابة',
    upcomingEvents: 'إجازة عيد الاتحاد 55',
    startsIn: 'تبدأ الإجازة خلال',
    dayUnit: 'يوم',
    daysUnit: 'أيام',
    newBadge: 'جديد',
    adminSettingsTitle: 'إدارة النظام',
    borrowTitle: 'مكتبتي المستعارة',
    borrowReturn: 'تاريخ الإرجاع:',
    addToCalendar: 'تذكير التقويم',
    festiveBtn: 'احتفالي',
    festiveDesc: 'العد التنازلي ليوم العلم',
    flagDayModalTitle: 'احتفالي يوم العلم الإماراتي',
    flagDayModalSub: 'العد التنازلي لانطلاق فعاليات ومسابقة تحدي راية المجد والصعود إلى قمة برج خليفة.',
    flagDayModalCountdown: 'متبقي على انطلاق الاحتفال:',
    flagDayModalBtn: 'حفظ والعودة للمنصة',
    dayLabel: 'يوم',
    hourLabel: 'ساعة',
    minLabel: 'دقيقة',
    secLabel: 'ثانية',
    flagDayAlert: 'استعدوا لرفع العلم وجمع النقاط وحصد الأوسمة الوطنية!',
    portalSectionTitle: 'اكتشف بوابتك المعرفية',
    portalSectionDesc: 'كل أدوات القراءة والبحث والإبداع في مكان واحد.',
    nationalDate: '2 ديسمبر 2026',
    returnOverdue: 'انتهت مدة الاستعارة، يرجى إرجاع الكتاب',
    noReturnDate: 'لم يحدد تاريخ الإرجاع',
    daysRemaining: 'متبقي',
    guest: 'زائر',
    schoolPrincipal: 'حساب مدير المدرسة',
    vicePrincipal: 'نائب مدير المدرسة',
    today: 'اليوم',
  },
  en: {
    welcome: "Knowledge Portal at Falcon Int'l School",
    subWelcome: 'Your smart gateway to knowledge and creativity.',
    welcomeUser: 'Welcome,',
    logout: 'Logout',
    adminBadge: 'Admin',
    teacherBadge: 'Teacher',
    studentBadge: 'Student',
    adminSettings: 'System Admin',
    adminSettingsDesc: 'Full platform and data control',
    newsTitle: "What's new",
    newsContent: 'New books have been added to the Arabic section. Visit the library to explore them | Podcast Studio is now live!',
    manualSearch: 'Manual Search',
    manualDesc: 'Find a specific book in the school library.',
    smartSearch: 'Ask Saqr (AI)',
    smartDesc: 'Your smart AI research assistant.',
    digitalLibrary: 'Digital Library',
    digitalDesc: 'A world of digital books and novels.',
    creators: 'Creators Corner',
    creatorsDesc: 'Explore the stories and innovations of your peers.',
    scheduleTitle: 'Library Schedule',
    scheduleDesc: 'Book and coordinate library visits for teachers.',
    gameTitle: 'Library Game',
    gameDesc: 'Play and learn how to classify books.',
    saqrStudioBanner: 'Saqr Studio',
    saqrStudioDesc: 'Record your voice and share it on the podcast.',
    bubble: 'Proud of the UAE',
    homelandTitle: 'About My Country',
    visitorsLabel: 'Portal visitors',
    upcomingEvents: '55th UAE Union Day break',
    startsIn: 'The break starts in',
    dayUnit: 'Day',
    daysUnit: 'Days',
    newBadge: 'NEW',
    adminSettingsTitle: 'System Admin',
    borrowTitle: 'My Borrowed Books',
    borrowReturn: 'Return date:',
    addToCalendar: 'Calendar reminder',
    festiveBtn: 'Celebrate',
    festiveDesc: 'Countdown to UAE Flag Day',
    flagDayModalTitle: 'UAE Flag Day Celebration',
    flagDayModalSub: 'Countdown to Flag Day activities and the Flag of Glory challenge.',
    flagDayModalCountdown: 'Time remaining until the celebration:',
    flagDayModalBtn: 'Save and return',
    dayLabel: 'Days',
    hourLabel: 'Hours',
    minLabel: 'Mins',
    secLabel: 'Secs',
    flagDayAlert: 'Get ready to raise the flag and earn national badges!',
    portalSectionTitle: 'Explore your knowledge portal',
    portalSectionDesc: 'Reading, research and creativity tools — all in one place.',
    nationalDate: '2 December 2026',
    returnOverdue: 'Overdue: please return this book',
    noReturnDate: 'Return date not set',
    daysRemaining: 'remaining',
    guest: 'Guest',
    schoolPrincipal: 'School Principal',
    vicePrincipal: 'Vice Principal',
    today: 'Today',
  },
};

const HOMELAND_FACTS = [
  { ar: 'تأسست دولة الإمارات العربية المتحدة في الثاني من ديسمبر عام 1971م على يد الشيخ زايد بن سلطان آل نهيان، طيب الله ثراه.', en: 'The UAE was founded on December 2, 1971, by Sheikh Zayed bin Sultan Al Nahyan.' },
  { ar: 'هل تعلم أن برج خليفة في دبي هو أطول بناء شيده الإنسان في العالم بارتفاع 828 متراً؟', en: 'Did you know Burj Khalifa is the world’s tallest man-made structure at 828 metres?' },
  { ar: 'مسبار الأمل الإماراتي هو أول مهمة عربية تصل إلى مدار كوكب المريخ لاستكشاف غلافه الجوي.', en: 'The Hope Probe is the first Arab mission to reach Mars to explore its atmosphere.' },
  { ar: 'تعتبر نخلة جميرا من أشهر الجزر الاصطناعية في العالم، ويمكن تمييز شكلها من الجو.', en: 'Palm Jumeirah is one of the world’s best-known man-made islands, recognisable from above.' },
  { ar: 'يعكس متحف اللوفر أبوظبي روح الانفتاح الثقافي والتواصل بين الحضارات.', en: 'Louvre Abu Dhabi reflects cultural openness and dialogue between civilisations.' },
];

interface BurstItem { id: number; tx: number; ty: number; rot: number; color: string; }
interface SparkleItem { id: number; x: number; y: number; }
interface FlagFlyItem { id: number; x: number; y: number; rot: number; }

type IconProps = { className?: string };

const StarIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const UaeFlagIcon = ({ className = 'w-10 h-10' }: IconProps) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-md shadow-sm overflow-hidden`} preserveAspectRatio="none" aria-label="UAE flag" role="img">
    <path fill="#00732f" d="M0 0h640v160H0z" />
    <path fill="#fff" d="M0 160h640v160H0z" />
    <path fill="#000" d="M0 320h640v160H0z" />
    <path fill="#ff0000" d="M0 0h220v480H0z" />
  </svg>
);

const SearchIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SmartIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const BookIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const CreatorIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const StudioIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const ScheduleIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GameIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AdminIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ArrowIcon = () => <svg className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" /></svg>;

const RevealSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.08,
      rootMargin: '-30px 0px -30px 0px',
    });
    const node = sectionRef.current;
    if (node) observer.observe(node);
    return () => { if (node) observer.unobserve(node); observer.disconnect(); };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.99]'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to?: string;
  onClick?: () => void;
  tone: string;
  badge?: string;
  className?: string;
  detail?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, to, onClick, tone, badge, className = '', detail }) => {
  const content = (
    <>
      <div className={`absolute -top-10 -end-8 h-28 w-28 rounded-full opacity-[0.08] blur-xl transition-transform duration-500 group-hover:scale-150 ${tone.split(' ')[0]}`} />
      {badge && <span className="absolute top-4 end-4 rounded-full bg-rose-500 px-3 py-1 text-[10px] font-black tracking-wide text-white shadow-sm">{badge}</span>}
      <div className="relative flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-black/5 transition duration-300 group-hover:-rotate-3 group-hover:scale-110 ${tone}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="mb-1 pe-2 text-base font-black leading-snug text-slate-900 dark:text-white md:text-lg">{title}</h3>
          <p className="text-xs font-medium leading-6 text-slate-500 dark:text-slate-400 md:text-sm">{description}</p>
          {detail}
        </div>
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-300">
          <ArrowIcon />
        </span>
      </div>
    </>
  );
  const base = `group relative flex min-h-[126px] w-full items-center overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 text-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700 sm:p-6 ${className}`;
  if (to) return <Link to={to} className={base}>{content}</Link>;
  return <button type="button" onClick={onClick} className={base}>{content}</button>;
};

const HomePage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  const t = (key: keyof typeof translations.ar) => translations[locale as 'ar' | 'en']?.[key] ?? translations.ar[key];

  const [userData] = useState(() => {
    try {
      const stored = localStorage.getItem('current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [userType] = useState(() => localStorage.getItem('user_type') || null);

  const [bursts, setBursts] = useState<BurstItem[]>([]);
  const [showBubble, setShowBubble] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);
  const [flyingFlags, setFlyingFlags] = useState<FlagFlyItem[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [borrowCountdownNow, setBorrowCountdownNow] = useState(Date.now());
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagTimeLeft, setFlagTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = window.setInterval(() => setBorrowCountdownNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const nowYear = new Date().getFullYear();
    const targetDate = new Date(nowYear, 10, 3, 0, 0, 0);
    if (Date.now() > targetDate.getTime()) targetDate.setFullYear(nowYear + 1);
    const updateFlagCountdown = () => {
      const difference = targetDate.getTime() - Date.now();
      if (difference <= 0) {
        setFlagTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setFlagTimeLeft({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference % 86400000) / 3600000),
        minutes: Math.floor((difference % 3600000) / 60000),
        seconds: Math.floor((difference % 60000) / 1000),
      });
    };
    updateFlagCountdown();
    const interval = window.setInterval(updateFlagCountdown, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const getBorrowCountdown = (returnDate: string) => {
    if (!returnDate) return t('noReturnDate');
    const due = new Date(`${returnDate}T23:59:59`).getTime();
    const remaining = due - borrowCountdownNow;
    if (remaining <= 0) return t('returnOverdue');
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return isAr ? `متبقي ${days} يوم و${hours} ساعة و${minutes} دقيقة و${seconds} ثانية` : `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
  };

  useEffect(() => {
    if (!userData || !userType) window.location.href = '#/';
  }, [userData, userType]);

  useEffect(() => {
    let mounted = true;
    const fetchBorrowings = async () => {
      if (!userData || !userType || userType === 'admin') return;
      const userId = userType === 'student' ? userData.student_id : userData.teacher_id;
      if (!userId) return;
      const { data, error } = await supabase.from('borrowings').select('*').eq('user_id', userId).eq('status', 'active');
      if (!error && data && mounted) setBorrowedBooks(data);
    };
    fetchBorrowings();
    const refresh = window.setInterval(fetchBorrowings, 60000);
    return () => { mounted = false; window.clearInterval(refresh); };
  }, [userData, userType]);

  useEffect(() => {
    const updateCountdown = () => {
      const distance = new Date('2026-12-02T00:00:00').getTime() - Date.now();
      setDaysLeft(distance > 0 ? Math.ceil(distance / 86400000) : 0);
    };
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 60000);
    return () => window.clearInterval(interval);
  }, []);

  const visitorCount = useMemo(() => {
    const baseCount = 3015;
    const startDate = new Date('2026-02-01').getTime();
    const diffDays = Math.floor((Date.now() - startDate) / 86400000);
    return baseCount + Math.max(0, diffDays) * 20;
  }, []);

  const todayDate = useMemo(() => new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }), [locale]);

  const dailyFact = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % HOMELAND_FACTS.length;
    return HOMELAND_FACTS[dayIndex];
  }, [locale]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '#/';
  };

  const getDisplayName = () => {
    if (!userData) return t('guest');
    return isAr ? (userData.name_ar || userData.name_en || t('guest')) : (userData.name_en || userData.name_ar || t('guest'));
  };

  const createGoogleCalendarLink = (bookName: string, returnDate: string) => {
    const date = new Date(returnDate);
    const day = date.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 8);
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', isAr ? `تذكير إرجاع كتاب: ${bookName}` : `Book Return Reminder: ${bookName}`);
    url.searchParams.append('dates', `${day}T060000Z/${day}T070000Z`);
    url.searchParams.append('details', isAr ? `حان موعد إرجاع كتاب "${bookName}" إلى مكتبة مدرسة صقر الإمارات الدولية. شكراً لالتزامك!` : `It's time to return "${bookName}" to the EFIPS library. Thank you!`);
    return url.toString();
  };

  const handleNameClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newSparkles: SparkleItem[] = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 350,
      y: rect.top + (Math.random() - 0.5) * 200,
    }));
    setSparkles(prev => [...prev, ...newSparkles]);
    window.setTimeout(() => setSparkles(prev => prev.filter(s => !newSparkles.some(ns => ns.id === s.id))), 1500);
  };

  const handleNationalDayCelebration = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newFlags: FlagFlyItem[] = Array.from({ length: 12 }).map(() => ({
      id: Math.random(),
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 260,
      y: rect.top + (Math.random() - 0.5) * 140,
      rot: (Math.random() - 0.5) * 45,
    }));
    setFlyingFlags(prev => [...prev, ...newFlags]);
    window.setTimeout(() => setFlyingFlags(prev => prev.filter(f => !newFlags.some(nf => nf.id === f.id))), 1800);
  };

  const handleMascotInteraction = useCallback(() => {
    setShowBubble(true);
    window.setTimeout(() => setShowBubble(false), 3000);
    const id = Date.now();
    const colors = ['text-red-500', 'text-blue-500', 'text-yellow-400', 'text-green-500', 'text-emerald-500'];
    const newBursts: BurstItem[] = Array.from({ length: 6 }).map((_, i) => ({
      id: id + i,
      color: colors[Math.floor(Math.random() * colors.length)],
      tx: (Math.random() - 0.5) * 220,
      ty: -90 - Math.random() * 120,
      rot: (Math.random() - 0.5) * 180,
    }));
    setBursts(prev => [...prev, ...newBursts]);
    window.setTimeout(() => setBursts(current => current.filter(item => !newBursts.some(nb => nb.id === item.id))), 2500);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.05;
    audio.play().catch(() => {});
  }, []);

  const roleBadge = userData?.teacher_id === 'HR001'
    ? t('schoolPrincipal')
    : userData?.teacher_id === 'HR061'
      ? t('vicePrincipal')
      : userType === 'admin' ? t('adminBadge') : userType === 'teacher' ? t('teacherBadge') : t('studentBadge');

  return (
    <div dir={dir} className="home-page relative min-h-[100dvh] overflow-x-hidden bg-slate-50 px-4 pb-10 pt-4 font-sans text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white sm:px-6 md:px-8 md:pt-6">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -start-32 top-24 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/15" />
        <div className="absolute -end-28 top-[38rem] h-96 w-96 rounded-full bg-sky-200/25 blur-3xl dark:bg-sky-900/10" />
      </div>

      {sparkles.map(s => (
        <div key={s.id} className="pointer-events-none fixed z-[9999] animate-fade-out" style={{ left: s.x, top: s.y }}>
          <StarIcon className="h-6 w-6 animate-spin text-amber-400 drop-shadow-md" />
        </div>
      ))}
      {flyingFlags.map(f => (
        <div key={f.id} className="pointer-events-none fixed z-[9999] animate-flag-float" style={{ left: f.x, top: f.y, transform: `rotate(${f.rot}deg)` }}>
          <div className="rounded-lg border border-amber-300 bg-white/90 p-1 shadow-xl"><UaeFlagIcon className="h-6 w-8" /></div>
        </div>
      ))}

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 md:gap-8">
        {/* Top navigation and welcome hero */}
        <RevealSection delay={60}>
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-7 md:rounded-[2.5rem] md:p-10">
            <div className="pointer-events-none absolute -end-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/[0.06]" />
            <div className="pointer-events-none absolute -bottom-28 start-[35%] h-72 w-72 rounded-full bg-teal-300/10 blur-2xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5 md:pb-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm sm:h-14 sm:w-14">
                  <img src="/school-logo.png" alt="" className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-100/80 sm:text-xs">EFIPS · KNOWLEDGE PORTAL</p>
                  <p className="mt-1 max-w-[15rem] truncate text-sm font-black sm:max-w-none sm:text-base">{t('welcome')}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:border-rose-200/50 hover:bg-rose-500/20 active:scale-95 sm:px-5 sm:text-sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" /></svg>
                {t('logout')}
              </button>
            </div>

            <div className="relative grid items-center gap-7 pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 md:pt-8">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-emerald-50 backdrop-blur-sm sm:text-xs">
                  <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_0_4px_rgba(190,242,100,0.12)]" />
                  {roleBadge}
                </span>
                <p className="mt-5 text-sm font-medium text-emerald-50/80 sm:text-base">{t('welcomeUser')}</p>
                <button type="button" onClick={handleNameClick} className="group relative mt-1 inline-flex max-w-full items-center rounded-2xl py-1 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <h1 className="relative break-words text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">{getDisplayName()}</h1>
                  <span className="ms-3 shrink-0 text-amber-300 transition-transform group-hover:rotate-12"><StarIcon className="h-5 w-5" /></span>
                </button>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80 sm:text-base">{t('subWelcome')}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold text-white/90">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/10 px-3 py-2"><UaeFlagIcon className="h-4 w-5" /> {isAr ? 'معاً نحو المعرفة والإبداع' : 'Learning and creating together'}</span>
                  <span className="rounded-full border border-white/15 bg-black/10 px-3 py-2">{todayDate}</span>
                </div>
              </div>
              <div className="hidden md:flex md:items-center md:justify-center">
                <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] p-5 shadow-inner">
                  <div className="absolute inset-3 rounded-full border border-dashed border-white/20" />
                  <img src="/saqr-full.png" alt="Saqr Mascot" className="relative z-10 h-full w-full object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105" />
                  <span className="absolute -bottom-2 -end-1 rounded-xl border border-white/20 bg-white/15 p-2 backdrop-blur-sm"><UaeFlagIcon className="h-6 w-8" /></span>
                </div>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* Borrowed books: kept high on the page because they are time-sensitive */}
        {borrowedBooks.length > 0 && (
          <RevealSection delay={100}>
            <section className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white shadow-sm dark:border-amber-900/70 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 bg-amber-50/70 px-5 py-4 dark:border-amber-900/50 dark:bg-amber-950/20 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl dark:bg-amber-900/50">📚</span>
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white sm:text-lg">{t('borrowTitle')}</h2>
                    <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{isAr ? 'تابع مواعيد الإرجاع بسهولة' : 'Keep track of your return dates'}</p>
                  </div>
                </div>
                <span className="rounded-full border border-amber-200 bg-white px-3 py-1 text-[11px] font-black text-amber-700 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-300">{borrowedBooks.length} {isAr ? 'كتاب' : borrowedBooks.length === 1 ? 'book' : 'books'}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
                {borrowedBooks.map(book => {
                  const overdue = book.return_date && new Date(`${book.return_date}T23:59:59`).getTime() <= borrowCountdownNow;
                  return (
                    <article key={book.id} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-amber-300 hover:bg-amber-50/40 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-amber-900">
                      <h3 className="break-words font-black text-slate-800 dark:text-white">{book.book_name}</h3>
                      <div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span>{t('borrowReturn')}</span><span className="shrink-0">{book.return_date || '—'}</span>
                      </div>
                      <p className={`mt-2 text-xs font-bold leading-6 ${overdue ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`} aria-live="polite">⏳ {getBorrowCountdown(book.return_date)}</p>
                      <a href={createGoogleCalendarLink(book.book_name, book.return_date)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
                        <ScheduleIcon /> {t('addToCalendar')}
                      </a>
                    </article>
                  );
                })}
              </div>
            </section>
          </RevealSection>
        )}

        {/* News ticker */}
        <RevealSection delay={140}>
          <section className="flex min-h-[58px] overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-label={t('newsTitle')}>
            <div className="flex shrink-0 items-center gap-2 bg-emerald-600 px-4 text-xs font-black text-white sm:px-5 sm:text-sm">
              <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" /></span>
              {t('newsTitle')}
            </div>
            <div className="flex min-w-0 flex-1 items-center overflow-hidden bg-emerald-50/60 dark:bg-slate-900">
              <div className={`whitespace-nowrap py-4 text-xs font-bold text-slate-700 dark:text-slate-200 sm:text-sm ${isAr ? 'animate-marquee-rtl' : 'animate-marquee-ltr'}`}>{t('newsContent')}</div>
            </div>
          </section>
        </RevealSection>

        {/* Main action grid */}
        <RevealSection delay={180}>
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-5">
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">{isAr ? 'مساحتك التعليمية' : 'YOUR LEARNING SPACE'}</p>
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">{t('portalSectionTitle')}</h2>
                <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">{t('portalSectionDesc')}</p>
              </div>
              <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 sm:inline-flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> {isAr ? 'متاح من أي جهاز' : 'Optimised for every device'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:gap-4">
              <FeatureCard to="/search" title={t('manualSearch')} description={t('manualDesc')} icon={<SearchIcon />} tone="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" />
              <FeatureCard to="/smart-search" title={t('smartSearch')} description={t('smartDesc')} icon={<SmartIcon />} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" />
              <FeatureCard to="/digital-library" title={t('digitalLibrary')} description={t('digitalDesc')} icon={<BookIcon />} tone="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" />
              <FeatureCard to="/creators" title={t('creators')} description={t('creatorsDesc')} icon={<CreatorIcon />} tone="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" />
              <FeatureCard
                title={t('festiveBtn')}
                description={t('festiveDesc')}
                onClick={() => setShowFlagModal(true)}
                icon={<span className="text-2xl leading-none">🇦🇪</span>}
                tone="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                badge="3 NOV"
                detail={<p className="mt-2 text-[11px] font-black text-emerald-700 dark:text-emerald-400">{flagTimeLeft.days} {t('dayLabel')} · {flagTimeLeft.hours} {t('hourLabel')}</p>}
              />
              {(userType === 'student' || userType === 'admin') && <FeatureCard to="/saqr-studio" title={t('saqrStudioBanner')} description={t('saqrStudioDesc')} icon={<StudioIcon />} tone="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" badge={t('newBadge')} />}
              {(userType === 'teacher' || userType === 'admin') && <FeatureCard to="/schedule" title={t('scheduleTitle')} description={t('scheduleDesc')} icon={<ScheduleIcon />} tone="bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" />}
              {(userType === 'student' || userType === 'admin') && <FeatureCard to="/game" title={t('gameTitle')} description={t('gameDesc')} icon={<GameIcon />} tone="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" badge={t('newBadge')} />}
              {userType === 'admin' && <FeatureCard to="/admin-dashboard" title={t('adminSettingsTitle')} description={t('adminSettingsDesc')} icon={<AdminIcon />} tone="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" className="xl:col-span-3" />}
            </div>
          </section>
        </RevealSection>

        {/* UAE knowledge, mascot and portal information */}
        <section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-5">
          <RevealSection delay={220}>
            <div className="relative flex h-full min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-5 py-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-8 lg:min-h-[390px]">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-600 via-emerald-600 via-60% to-black" />
              <div className="absolute inset-0 flex items-center justify-center"><img src="/school-logo.png" alt="" className="h-64 w-64 object-contain opacity-[0.045] dark:opacity-[0.07]" /></div>
              <div onClick={handleMascotInteraction} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleMascotInteraction(); }} className="group relative z-10 flex cursor-pointer flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" aria-label={isAr ? 'اضغط على صقر للتفاعل' : 'Tap Saqr to interact'}>
                {bursts.map(burst => <div key={burst.id} className={`pointer-events-none absolute z-20 animate-burst-steady ${burst.color}`} style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as React.CSSProperties}><StarIcon className="h-8 w-8 drop-shadow-md" /></div>)}
                {showBubble && <div className="absolute -top-5 z-30 -translate-y-full whitespace-nowrap rounded-2xl border-2 border-rose-400 bg-white px-4 py-2 text-sm font-black text-rose-600 shadow-xl dark:border-rose-500 dark:bg-slate-800 dark:text-rose-300">{t('bubble')} 🇦🇪</div>}
                <img src="/saqr-full.png" alt="Saqr Mascot" className="h-56 animate-float object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105 sm:h-64 lg:h-72" />
                <span className="mt-1 rounded-full bg-emerald-50 px-4 py-1.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{isAr ? 'اضغط على صقر للمفاجأة ✨' : 'Tap Saqr for a surprise ✨'}</span>
              </div>
            </div>
          </RevealSection>

          <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-5">
            <RevealSection delay={260}>
              <article className="relative h-full overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-5 shadow-sm dark:border-amber-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 sm:p-7 md:p-8">
                <div className="absolute inset-x-0 top-0 flex h-1.5"><span className="w-1/4 bg-red-600" /><span className="w-1/4 bg-emerald-600" /><span className="w-1/4 bg-white" /><span className="w-1/4 bg-black" /></div>
                <div className="relative flex items-start gap-4">
                  <div className="shrink-0 rounded-2xl border border-amber-200 bg-white p-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"><UaeFlagIcon className="h-9 w-12 sm:h-11 sm:w-14" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">{isAr ? 'حقيقة اليوم' : 'TODAY’S FACT'}</p>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl">{t('homelandTitle')}</h2>
                  </div>
                  <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 sm:inline-flex">🇦🇪 UAE</span>
                </div>
                <p className="relative mt-5 text-sm font-bold leading-8 text-slate-700 dark:text-slate-200 sm:text-base md:text-lg">{isAr ? dailyFact.ar : dailyFact.en}</p>
                <div className="pointer-events-none absolute -bottom-12 -end-8 h-36 w-36 rounded-full bg-amber-300/20 blur-3xl" />
              </article>
            </RevealSection>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
              <RevealSection delay={320}>
                <article className="flex h-full min-h-[170px] flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('visitorsLabel')}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.196-2.04M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.04M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">{visitorCount.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}</p>
                    <p className="mt-2 text-[11px] font-medium text-slate-400">{todayDate}</p>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" /></div>
                </article>
              </RevealSection>

              <RevealSection delay={360}>
                <article onClick={handleNationalDayCelebration} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleNationalDayCelebration(e as unknown as React.MouseEvent<HTMLElement>); }} className="group relative flex h-full min-h-[170px] cursor-pointer flex-col justify-between overflow-hidden rounded-[1.75rem] border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-emerald-900/60 dark:from-slate-900 dark:to-emerald-950/30 sm:p-6">
                  <div className="absolute inset-x-0 top-0 flex h-1.5"><span className="w-1/4 bg-red-600" /><span className="w-1/4 bg-emerald-600" /><span className="w-1/4 bg-white" /><span className="w-1/4 bg-black" /></div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200">{t('upcomingEvents')}</span>
                    <span className="animate-flag-wave"><UaeFlagIcon className="h-5 w-7" /></span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('startsIn')}</p>
                    <div className="mt-1 flex items-baseline gap-2"><span className="text-4xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">{daysLeft ?? 0}</span><span className="text-xs font-black text-slate-500 dark:text-slate-400">{daysLeft === 1 ? t('dayUnit') : t('daysUnit')}</span></div>
                  </div>
                  <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[10px] font-black text-slate-600 dark:border-emerald-900 dark:bg-slate-900/80 dark:text-slate-300"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> {t('nationalDate')} <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-white">55</span></div>
                  <UaeFlagIcon className="absolute -bottom-2 -end-3 h-16 w-24 -rotate-12 opacity-[0.08] transition-transform duration-500 group-hover:scale-110 dark:opacity-[0.13]" />
                </article>
              </RevealSection>
            </div>
          </div>
        </section>
      </main>

      {/* UAE Flag Day countdown dialog */}
      {showFlagModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-fade-in" dir={dir} role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setShowFlagModal(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="flag-day-title" className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-amber-300 bg-white p-6 text-center shadow-2xl dark:border-amber-700 dark:bg-slate-900 sm:p-8">
            <div className="absolute inset-x-0 top-0 flex h-2.5"><span className="w-1/4 bg-[#ff0000]" /><span className="w-1/4 bg-[#00732f]" /><span className="w-1/4 bg-white" /><span className="w-1/4 bg-black" /></div>
            <button type="button" onClick={() => setShowFlagModal(false)} aria-label={isAr ? 'إغلاق النافذة' : 'Close dialog'} className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-500 transition hover:bg-rose-100 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950">×</button>
            <div className="mx-auto mb-4 mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50"><UaeFlagIcon className="h-9 w-12" /></div>
            <h2 id="flag-day-title" className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">{t('flagDayModalTitle')}</h2>
            <p className="mx-auto mt-2 max-w-sm text-xs font-medium leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">{t('flagDayModalSub')}</p>
            <p className="mt-6 text-xs font-bold text-slate-600 dark:text-slate-300">{t('flagDayModalCountdown')}</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[
                { value: flagTimeLeft.days, label: t('dayLabel'), color: 'text-emerald-600 dark:text-emerald-400' },
                { value: flagTimeLeft.hours, label: t('hourLabel'), color: 'text-sky-600 dark:text-sky-400' },
                { value: flagTimeLeft.minutes, label: t('minLabel'), color: 'text-amber-600 dark:text-amber-400' },
                { value: flagTimeLeft.seconds, label: t('secLabel'), color: 'text-rose-600 dark:text-rose-400' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950 sm:p-3">
                  <p className={`font-mono text-lg font-black sm:text-xl ${item.color}`}>{String(item.value).padStart(2, '0')}</p>
                  <p className="mt-1 text-[9px] font-bold text-slate-400 sm:text-[10px]">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-bold leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">{t('flagDayAlert')}</p>
            <button type="button" onClick={() => setShowFlagModal(false)} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-sm font-black text-white shadow-md transition hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99]">{t('flagDayModalBtn')}</button>
          </section>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
        .home-page, .home-page * { font-family: 'Cairo', sans-serif; }
        @keyframes burst-steady {
          0% { transform: translate(0, 0) scale(.5); opacity: 0; }
          20% { transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(var(--rot)); opacity: 1; }
          80% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
          100% { transform: translate(var(--tx), calc(var(--ty) - 20px)) scale(.8) rotate(var(--rot)); opacity: 0; }
        }
        .animate-burst-steady { animation: burst-steady 2s cubic-bezier(.19, 1, .22, 1) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
        @keyframes flag-wave { 0%, 100% { transform: rotate(-6deg) scale(1); } 50% { transform: rotate(8deg) scale(1.08) skewY(2deg); } }
        .animate-flag-wave { animation: flag-wave 2.2s ease-in-out infinite; }
        @keyframes flag-float { 0% { opacity: 1; transform: scale(.6) translateY(0) rotate(0); } 50% { opacity: 1; transform: scale(1.15) translateY(-35px) rotate(12deg); } 100% { opacity: 0; transform: scale(.8) translateY(-75px) rotate(-10deg); } }
        .animate-flag-float { animation: flag-float 1.8s ease-out forwards; }
        @keyframes marquee-ltr { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        @keyframes marquee-rtl { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-marquee-ltr { animation: marquee-ltr 40s linear infinite; }
        .animate-marquee-rtl { animation: marquee-rtl 40s linear infinite; }
        @keyframes fade-out { 0% { opacity: 1; transform: scale(1) translateY(0); } 100% { opacity: 0; transform: scale(.3) translateY(-40px); } }
        .animate-fade-out { animation: fade-out 1.5s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in .2s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .home-page *, .home-page *::before, .home-page *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
