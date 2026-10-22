import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useTheme } from '../App';

/**
 * Public, visual-only replica of the real EFIPS library home screen.
 * It intentionally contains no Supabase/Firebase calls and never displays
 * any personal, loan, timetable, analytics, or other live records.
 */

type HintState = {
  activeHint: string | null;
  pinnedHint: string | null;
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

const HintTarget: React.FC<HintTargetProps> = ({
  id, title, description, children, className = '', interactive = true,
  tooltipBelow = false, activeHint, pinnedHint, setActiveHint, setPinnedHint
}) => {
  const visible = activeHint === id || pinnedHint === id;
  const toggle = () => {
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
      onMouseEnter={() => {
        setActiveHint(id);
        setPinnedHint(null);
      }}
      onMouseLeave={() => setActiveHint((current) => current === id ? null : current)}
      onClick={toggle}
      onKeyDown={(event) => {
        if (interactive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          toggle();
        }
      }}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={
            'absolute z-[300] ' +
            (tooltipBelow ? 'top-full mt-3' : 'bottom-full mb-3') +
            ' left-1/2 -translate-x-1/2 w-[min(300px,85vw)] rounded-2xl border border-emerald-300/70 dark:border-emerald-700 bg-slate-950 text-white px-4 py-3.5 shadow-2xl shadow-slate-950/25 text-start pointer-events-none'
          }
        >
          <span className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] h-3 w-3 rotate-45 bg-slate-950 border-r border-b border-emerald-300/70 dark:border-emerald-700" />
          <span className="relative block text-sm font-black leading-5">{title}</span>
          <span className="relative mt-1 block text-xs font-medium leading-5 text-slate-200">{description}</span>
          <span className="relative mt-2 block text-[10px] font-bold text-emerald-300">
            {pinnedHint === id ? '✓' : '⌖'} {pinnedHint === id ? 'Tap again to close' : 'Hover or tap to explore'}
          </span>
        </div>
      )}
    </div>
  );
};

const SearchIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SmartIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const BookIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const CreatorIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const StudioIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const ScheduleIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GameIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AdminIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543-.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const EyeIcon = () => <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5-9.5-6.5-9.5-6.5Z" /><circle cx="12" cy="12" r="2.5" /></svg>;

export default function TutorialPage() {
  const { locale, setLocale, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isAr = locale === 'ar';
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [pinnedHint, setPinnedHint] = useState<string | null>(null);
  const hintState: HintState = { activeHint, pinnedHint, setActiveHint, setPinnedHint };
  const label = (ar: string, en: string) => isAr ? ar : en;

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
      id: 'flag-day', title: label('احتفالي', 'Festive'),
      description: label('اكتشف المناسبات والأنشطة الوطنية.', 'Explore national celebrations and activities.'),
      color: 'bg-gradient-to-r from-[#ff0000] via-[#00732f] to-[#000000]', border: 'border-amber-500', icon: <span className="text-2xl leading-none">🇦🇪</span>,
      hint: label('يفتح في الموقع الحقيقي نافذة فعاليات ومواعيد وطنية. هنا يظهر مثال شكلي فقط دون بيانات مباشرة.', 'The live site opens a national events and countdown panel. This is a visual sample only.')
    },
    {
      id: 'studio', title: label('استديو صقر', 'Saqr Studio'),
      description: label('شارك بإبداعاتك الصوتية والبودكاست.', 'Create audio work and contribute to podcasts.'),
      color: 'bg-blue-500', border: 'border-blue-700', icon: <StudioIcon />,
      hint: label('يعرض الاستديو تجربة التسجيل والمحتوى الصوتي. لن يتم تسجيل صوت أو رفع ملف في هذه الجولة.', 'The studio demonstrates audio and podcast tools. This tour will not record audio or upload files.')
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
    { id: 'nav-search', text: label('البحث', 'Search'), description: label('يفتح فهرس البحث عن الكتب.', 'Opens the book search catalogue.') },
    { id: 'nav-digital', text: label('المكتبة الرقمية', 'Digital'), description: label('ينقلك إلى مصادر المكتبة الرقمية.', 'Takes you to digital library resources.') },
    { id: 'nav-creators', text: label('المبدعون', 'Creators'), description: label('مساحة المشاركات والأعمال الإبداعية.', 'A space for creative contributions.') },
    { id: 'nav-games', text: label('الألعاب', 'Games'), description: label('أنشطة تفاعلية للتعلم باللعب.', 'Interactive learning activities.') },
    { id: 'nav-schedule', text: label('الجدول', 'Schedule'), description: label('خدمات جدول المكتبة للمعلمين.', 'Library schedule tools for teachers.') },
    { id: 'nav-ideas', text: label('المقترحات', 'Ideas'), description: label('استعراض وإرسال المقترحات في الموقع الحقيقي.', 'View and submit feedback on the live site.') },
    { id: 'nav-admin', text: label('الإدارة', 'Admin'), description: label('قسم محمي لا يظهر محتواه إلا للمخولين.', 'A protected area visible only to authorized staff.') }
  ];

  return (
    <div dir={dir} className="min-h-screen w-full overflow-x-hidden bg-[#f8fafc] font-sans text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-70 dark:opacity-50">
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute top-[45%] -left-28 h-96 w-96 rounded-full bg-sky-300/15 blur-3xl" />
      </div>

      {/* The real site's pill-shaped navigation, reproduced without live links. */}
      <header className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-2">
        <div className="flex w-full max-w-[98%] items-center justify-between gap-3 rounded-[2rem] border-4 border-white/70 bg-white/70 px-3 py-2.5 shadow-2xl backdrop-blur-2xl dark:border-slate-700/40 dark:bg-slate-900/75 md:w-fit md:gap-4 md:px-4">
          <HintTarget id="school-logo" title={label('هوية المدرسة', 'School identity')} description={label('شعار مدرسة صقر الإمارات الدولية الخاصة، كما يظهر في الموقع الفعلي.', 'The Emirates Falcon International Private School logo used throughout the live site.')} className="shrink-0" {...hintState}>
            <div className="flex items-center gap-2 me-1">
              <img src="/school-logo.png" alt="EFIPS" className="h-8 w-8 shrink-0 object-contain md:h-10 md:w-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          </HintTarget>
          <nav className="no-scrollbar flex h-10 flex-1 items-center overflow-x-auto px-1 md:h-12 md:flex-none">
            <div className="mx-auto flex h-full min-w-max items-center gap-1.5">
              {navItems.map((item, index) => {
                const colors = ['bg-rose-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-teal-500', 'bg-emerald-500', 'bg-rose-600'];
                return (
                  <HintTarget key={item.id} id={item.id} title={item.text} description={item.description} className="shrink-0" {...hintState}>
                    <div className={'rounded-full px-3 py-1.5 text-[10px] font-black transition-all md:px-4 md:py-2 md:text-xs ' + (index === 0 ? colors[index] + ' text-white shadow-md' : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-700')}>
                      {item.text}
                    </div>
                  </HintTarget>
                );
              })}
            </div>
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <HintTarget id="language-switch" title={label('تبديل اللغة', 'Language switch')} description={label('بدّل بين العربية والإنجليزية؛ يتغير اتجاه الصفحة تلقائيًا.', 'Switch between Arabic and English. The page direction adapts automatically.')} interactive={false} className="flex shrink-0" {...hintState}>
              <button type="button" onClick={() => setLocale(isAr ? 'en' : 'ar')} className="h-8 w-8 rounded-full border-2 border-slate-300/80 bg-slate-50/80 text-[10px] font-black text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 md:h-10 md:w-10">
                {isAr ? 'EN' : 'AR'}
              </button>
            </HintTarget>
            <HintTarget id="theme-switch" title={label('الوضع الفاتح والداكن', 'Light and dark mode')} description={label('غيّر مظهر الموقع مع الحفاظ على نفس الألوان والهوية البصرية.', 'Change the site appearance while preserving its visual identity.')} interactive={false} className="flex shrink-0" {...hintState}>
              <button type="button" onClick={toggleTheme} aria-label={label('تغيير المظهر', 'Toggle theme')} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200/80 bg-slate-100/80 text-sm dark:border-slate-600 dark:bg-slate-800 md:h-10 md:w-10">
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
                <div className="rounded-2xl border border-emerald-200 bg-white/90 p-4 shadow-sm dark:border-emerald-800/70 dark:bg-slate-800/90 sm:rounded-3xl sm:p-5">
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
                  {label('أهلاً بك في الجولة التعريفية — المس أو مرّر المؤشر على البطاقات والأيقونات لمعرفة وظائفها.', 'Welcome to the guided tour — hover or tap cards and icons to learn what each feature does.')}
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
              {featureCards.map((card) => (
                <HintTarget key={card.id} id={card.id} title={card.title} description={card.hint} tooltipBelow {...hintState}>
                  <div className={'group relative flex min-h-[140px] cursor-pointer items-center gap-5 overflow-visible rounded-[2.5rem] border-b-8 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:translate-y-1 active:border-b-0 ' + card.color + ' ' + card.border}>
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

          <section className="mt-2 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <HintTarget id="saqr-mascot" title={label('شخصية صقر', 'Saqr mascot')} description={label('اضغط أو المس شخصية صقر في الموقع الحقيقي لمشاهدة التفاعل والرسائل الترحيبية.', 'The live site mascot offers small interactive moments and welcoming messages.')} interactive={false} className="lg:col-span-5 flex flex-col items-center justify-center" {...hintState}>
              <div className="group relative flex cursor-pointer flex-col items-center">
                <img src="/school-logo.png" alt="" className="pointer-events-none absolute inset-0 z-0 m-auto h-72 w-72 object-contain opacity-10 transition-all duration-300 dark:opacity-25 dark:brightness-0 dark:invert" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <img src="/saqr-full.png" alt="Saqr mascot" className="relative z-10 h-60 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 md:h-80" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </HintTarget>

            <div className="grid grid-cols-1 gap-6 lg:col-span-7">
              <HintTarget id="uae-feature" title={label('معلومات عن وطني', 'Information About My Country')} description={label('بطاقة ثقافية تعليمية تعرض معلومة عامة عن دولة الإمارات. استخدمنا خطوطًا بديلة هنا بدلًا من بيانات متغيرة.', 'An educational UAE culture card. This tour uses sample placeholder lines instead of changing live content.')} interactive={false} {...hintState}>
                <div className="relative flex flex-col items-center overflow-hidden rounded-[3rem] border-4 border-amber-400 bg-gradient-to-br from-amber-100 via-amber-50 to-emerald-50 p-8 text-center shadow-2xl dark:border-amber-600 dark:from-slate-900 dark:to-slate-950 md:p-10">
                  <div className="absolute left-0 right-0 top-0 flex h-2.5">
                    <div className="w-1/4 bg-red-600" /><div className="w-1/4 bg-emerald-600" /><div className="w-1/4 bg-white" /><div className="w-1/4 bg-black" />
                  </div>
                  <div className="mt-3 mb-6 flex flex-col items-center gap-3">
                    <div className="rounded-3xl border-2 border-amber-300 bg-white p-3 shadow-md dark:border-amber-600 dark:bg-slate-800">
                      <svg viewBox="0 0 24 24" className="h-10 w-10 text-emerald-700 dark:text-emerald-300" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path strokeLinecap="round" d="M4 6v15m4-13h8m-8 4h8" /></svg>
                    </div>
                    <h3 className="text-xl font-black tracking-wider text-amber-800 dark:text-amber-400 md:text-3xl">{label('معلومات عن وطني', 'Information About My Country')}</h3>
                  </div>
                  <div className="w-full max-w-xl space-y-3" aria-label={label('محتوى مخفي', 'Hidden content')}>
                    <div className="mx-auto h-3 w-11/12 rounded-full bg-amber-200/90 dark:bg-slate-700" />
                    <div className="mx-auto h-3 w-10/12 rounded-full bg-amber-200/70 dark:bg-slate-700" />
                    <div className="mx-auto h-3 w-8/12 rounded-full bg-amber-200/60 dark:bg-slate-700" />
                  </div>
                  <p className="mt-4 text-[10px] font-bold text-slate-500 dark:text-slate-400">{label('معاينة شكل البطاقة — المحتوى الحي مخفي', 'Card style preview — live content hidden')}</p>
                </div>
              </HintTarget>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <HintTarget id="visitor-counter" title={label('عداد الزوار', 'Visitor counter')} description={label('يعرض عدد الزيارات وتاريخها في الموقع الفعلي. الرقم والتاريخ الفعليان مخفيان في المعاينة.', 'Shows site visits and date in the live portal. The real count and date are hidden here.')} interactive={false} {...hintState}>
                  <div className="flex h-full flex-col items-center justify-between rounded-[2rem] border-4 border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-3 w-3 animate-ping rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 md:text-sm">{label('زوار البوابة:', 'Portal Visitors:')}</span>
                    </div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white md:text-4xl">••••</span>
                    <span className="mt-2 text-[11px] font-bold text-slate-400">•• / •• / ••••</span>
                  </div>
                </HintTarget>
                <HintTarget id="national-event" title={label('المناسبات الوطنية', 'National events')} description={label('بطاقة المناسبات والعد التنازلي. التواريخ والأرقام الحية لا تظهر في صفحة التوتوريال.', 'An events and countdown card. Live dates and numbers are not shown in the tutorial.')} interactive={false} {...hintState}>
                  <div className="relative flex h-full flex-col items-center justify-between overflow-hidden rounded-[2rem] border-4 border-emerald-500/80 bg-gradient-to-br from-white via-emerald-50/40 to-rose-50/40 p-6 text-center shadow-xl dark:border-emerald-600 dark:from-slate-900 dark:via-emerald-950/20 dark:to-rose-950/20">
                    <div className="absolute left-0 right-0 top-0 flex h-2">
                      <div className="w-1/4 bg-[#ff0000]" /><div className="w-1/4 bg-[#00732f]" /><div className="w-1/4 bg-white" /><div className="w-1/4 bg-black" />
                    </div>
                    <div className="relative z-10 mt-1 flex items-center justify-center gap-2">
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{label('إجازة عيد الاتحاد', 'UAE National Day Break')}</span>
                    </div>
                    <div className="relative z-10 my-3">
                      <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400">{label('العد التنازلي', 'Countdown')}</span>
                      <span className="mt-1 block bg-gradient-to-r from-red-600 via-emerald-600 to-slate-900 bg-clip-text text-4xl font-black text-transparent">••</span>
                    </div>
                    <span className="relative z-10 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-1 text-[10px] font-black text-slate-700 shadow-sm dark:border-emerald-800 dark:bg-slate-800/90 dark:text-slate-200">{label('تفاصيل الموعد مخفية', 'Event details hidden')}</span>
                  </div>
                </HintTarget>
              </div>
            </div>
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

      <footer className="relative z-10 border-t-4 border-slate-200 px-4 py-6 text-center dark:border-slate-800">
        <p className="text-xs font-black text-slate-500">EFIPS • Library • 2026</p>
        <p className="mt-1 text-[10px] font-semibold text-slate-400">{label('نسخة معاينة — البيانات الحقيقية غير معروضة', 'Preview mode — live data is not displayed')}</p>
      </footer>
    </div>
  );
}
