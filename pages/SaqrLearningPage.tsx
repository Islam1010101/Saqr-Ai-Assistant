import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { getSaqrLearningAccess, type LearningFeatures } from '../src/utils/saqrLearningAccess';
import ReadTogether from '../src/components/saqrLearning/ReadTogether';
import PictureLearning from '../src/components/saqrLearning/PictureLearning';
import StepByStep from '../src/components/saqrLearning/StepByStep';
import CalmDisplay from '../src/components/saqrLearning/CalmDisplay';

type FeatureName = keyof LearningFeatures;
type Feature = {
  key: FeatureName;
  ar: string;
  en: string;
  hintAr: string;
  hintEn: string;
  color: string;
  baseColor: string;
  border: string;
};

const features: Feature[] = [
  {
    key: 'read_together', ar: 'اقرأ معي', en: 'Read with me',
    hintAr: 'اسمع صقر وجاوب على أسئلة القصة', hintEn: 'Listen and answer little story questions',
    color: 'from-[#1489CF] to-[#45B7E8]', baseColor: 'bg-sky-50 dark:bg-sky-950/30', border: 'border-[#176C9B]'
  },
  {
    key: 'picture_guidance', ar: 'تعلم بالصور', en: 'Learn with pictures',
    hintAr: 'اكتشف الصور وأجب عن الأسئلة', hintEn: 'Explore illustrated picture questions',
    color: 'from-[#8755C9] to-[#B47CE6]', baseColor: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-[#6A389D]'
  },
  {
    key: 'focus_steps', ar: 'مهمة خطوة بخطوة', en: 'Step by step',
    hintAr: 'أنجز مهام صغيرة على راحتك', hintEn: 'Complete small tasks at your own pace',
    color: 'from-[#D88B21] to-[#F4BC4A]', baseColor: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-[#AE6613]'
  },
  {
    key: 'calm_display', ar: 'عرض هادئ', en: 'Calm view',
    hintAr: 'تحكم في الحركة وحجم النص', hintEn: 'Control motion and text size',
    color: 'from-[#08775A] to-[#32B38C]', baseColor: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-[#06563F]'
  }
];

function ActivityIcon({ kind, className = 'w-10 h-10' }: { kind: FeatureName; className?: string }) {
  const shared = { className, viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 2.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (kind === 'read_together') return <svg {...shared} aria-hidden="true">
    <path d="M24 10C17 5 10 6 4 8v29c7-2 15-1 20 4 5-5 13-6 20-4V8c-6-2-13-3-20 2Z" />
    <path d="M24 10v31M11 17h8M11 24h8M29 17h8M29 24h8" />
    <path d="M35 31c3-2 5-1 5 2s-2 4-5 4" />
  </svg>;
  if (kind === 'picture_guidance') return <svg {...shared} aria-hidden="true">
    <rect x="5" y="7" width="38" height="34" rx="6" /><circle cx="17" cy="18" r="4" />
    <path d="m10 34 10-11 7 7 6-8 8 12" /><path d="M10 45h28" />
  </svg>;
  if (kind === 'focus_steps') return <svg {...shared} aria-hidden="true">
    <rect x="9" y="6" width="30" height="37" rx="5" />
    <path d="m15 17 3 3 6-7M28 18h5M15 30l3 3 6-7M28 31h5" />
  </svg>;
  return <svg {...shared} aria-hidden="true">
    <path d="M33 8a17 17 0 1 0 7 24A16 16 0 0 1 33 8Z" />
    <path d="M34 17h10M39 12v10M7 12h6M10 9v6" />
  </svg>;
}

export default function SaqrLearningPage() {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  const userName = (() => {
    try {
      const account = JSON.parse(localStorage.getItem('current_user') || '{}');
      const fullName = String(
        (isAr ? account?.name_ar : account?.name_en) ||
        account?.name_ar || account?.name_en || account?.name || account?.full_name || ''
      ).trim();
      const parts = fullName.split(/\s+/).filter(Boolean);
      return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0] || '';
    } catch {
      return '';
    }
  })();
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied' | 'error'>('loading');
  const [settings, setSettings] = useState<LearningFeatures | null>(null);
  const [viewer, setViewer] = useState<'admin' | 'student' | null>(null);
  const [active, setActive] = useState<FeatureName | null>(null);
  const [large, setLarge] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const activityRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let mounted = true;
    getSaqrLearningAccess().then(value => {
      if (!mounted) return;
      setSettings(value.features);
      setViewer(value.viewer);
      setStatus(value.allowed ? 'allowed' : 'denied');
    }).catch(() => { if (mounted) setStatus('error'); });
    return () => { mounted = false; };
  }, []);

  const selectActivity = (key: FeatureName) => {
    if (!settings?.[key]) return;
    setActive(key);
    if (key === 'calm_display') setQuiet(true);
    window.requestAnimationFrame(() => {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches || quiet ? 'auto' : 'smooth';
      activityRef.current?.scrollIntoView({ behavior, block: 'start' });
    });
  };
  const current = features.find(item => item.key === active);

  return <div dir={dir} className={'saqr-learning-page min-h-[85dvh] overflow-x-hidden bg-white dark:bg-black text-slate-900 dark:text-slate-100 font-sans px-3 sm:px-5 py-6 md:py-10 ' +
    (quiet ? 'saqr-learning-page--calm' : '')}>
    <main className="relative mx-auto max-w-[1220px] space-y-6 md:space-y-9">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <Link to="/home" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-black text-emerald-800 dark:text-emerald-200 shadow-sm hover:border-emerald-400 transition-colors">
          <svg aria-hidden="true" viewBox="0 0 24 24" className={'w-5 h-5 ' + (isAr ? 'rotate-180' : '')} fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
          {isAr ? 'العودة للرئيسية' : 'Back to home'}
        </Link>
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-slate-500 dark:text-slate-300">
          <img src="/school-logo.png" alt="" className="h-9 w-9 object-contain" />
          {isAr ? 'مكتبة صقر الإمارات' : 'EFIPS Library'}
        </div>
      </div>

      {status === 'loading' && <div role="status" className="py-20 text-center font-black text-emerald-800 dark:text-emerald-200">
        {isAr ? 'جارٍ التحقق من حسابك المدرسي...' : 'Checking school access...'}
      </div>}
      {status === 'error' && <div role="alert" className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-slate-900 p-8 text-center font-bold text-amber-900 dark:text-amber-200">
        {isAr ? 'تعذر التحقق الآن. أعد المحاولة أو ارجع للرئيسية.' : 'Access verification is temporarily unavailable.'}
      </div>}
      {status === 'denied' && <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-8 text-center font-bold">
        {isAr ? 'هذه المساحة غير متاحة لهذا الحساب.' : 'This learning space is not available for this account.'}
      </div>}

      {status === 'allowed' && settings && <>
        <header className="saqr-learning-hero relative isolate overflow-hidden rounded-[2rem] sm:rounded-[2.8rem] border-2 border-emerald-800/30 bg-[#07543E] p-5 sm:p-9 md:p-11 text-white shadow-[0_20px_55px_rgba(4,78,57,.2)]">
          <div aria-hidden="true" className="saqr-learning-decoration pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -start-14 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
            <div className="absolute bottom-[-130px] end-[12%] h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="absolute top-0 end-0 flex h-2 w-44 overflow-hidden rounded-bl-xl">
              <span className="w-1/4 bg-[#CE1126]" /><span className="w-1/4 bg-[#00843D]" /><span className="w-1/4 bg-white" /><span className="w-1/4 bg-black" />
            </div>
            <svg viewBox="0 0 170 170" className="saqr-learning-orbit absolute top-0 start-[44%] h-32 w-32 opacity-25" fill="none" stroke="#B0EEE0" strokeWidth="2" aria-hidden="true"><circle cx="85" cy="85" r="62" strokeDasharray="5 9" /><circle cx="85" cy="85" r="42" /></svg>
          </div>
          <div className="relative grid gap-5 sm:grid-cols-[1.2fr_.8fr] items-center">
            <div className="relative z-20 space-y-3 text-center sm:text-start">
              <p className="saqr-learning-greeting block text-2xl sm:text-3xl lg:text-4xl font-black leading-[1.4] text-amber-100 break-words">
                {isAr ? (userName ? 'أهلًا بك يا ' : 'أهلًا بك!') : (userName ? 'Welcome, ' : 'Welcome!')}
                {userName && <span dir="auto" className="text-white">{userName}</span>}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.5]">{isAr ? 'صقر يساعدني' : 'Saqr Helps Me'}</h1>
              <p className="max-w-xl text-base sm:text-lg lg:text-xl leading-[1.9] font-semibold text-emerald-50/95">
                {isAr ? 'أهلًا بك في عالم صقر! اسمع القصص، اختار الصور، وخد وقتك في كل مغامرة.' :
                  'Welcome to Saqr’s world! Listen to stories, choose pictures, and enjoy every little adventure.'}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                <span className="rounded-xl bg-white/10 border border-white/25 px-3 py-2 text-xs sm:text-sm font-black">{isAr ? 'أنشطة تفاعلية' : 'Interactive activities'}</span>
                <span className="rounded-xl bg-white/10 border border-white/25 px-3 py-2 text-xs sm:text-sm font-black">{isAr ? 'بدون مؤقت' : 'No time limits'}</span>
                <span className="rounded-xl bg-white/10 border border-white/25 px-3 py-2 text-xs sm:text-sm font-black">{isAr ? 'عربي وإنجليزي' : 'Arabic & English'}</span>
              </div>
              {viewer === 'admin' && <p className="inline-flex items-center rounded-xl border border-amber-200/60 bg-amber-100/15 px-4 py-2 text-xs font-black text-amber-100">
                {isAr ? 'وضع معاينة الأدمن' : 'Admin preview mode'}
              </p>}
            </div>
            <div className="relative mx-auto w-full max-w-[310px] sm:max-w-[390px] h-[220px] sm:h-[320px] lg:h-[370px] flex items-end justify-center">
              <span aria-hidden="true" className="saqr-learning-decoration saqr-learning-aura absolute bottom-4 h-[75%] w-[78%] rounded-full bg-gradient-to-br from-emerald-300/35 via-sky-300/20 to-amber-300/20 blur-[45px]" />
              <span aria-hidden="true" className="saqr-learning-decoration saqr-learning-floating-symbol absolute top-[12%] start-[6%] grid place-items-center h-14 w-14 rounded-2xl bg-white/15 border border-white/25 text-amber-200 shadow-xl rotate-[-12deg]"><ActivityIcon kind="read_together" className="h-8 w-8" /></span>
              <span aria-hidden="true" className="saqr-learning-decoration saqr-learning-floating-symbol saqr-learning-symbol-late absolute top-[30%] end-[3%] grid place-items-center h-12 w-12 rounded-xl bg-white/15 border border-white/25 text-sky-200 shadow-xl rotate-[12deg]"><ActivityIcon kind="picture_guidance" className="h-7 w-7" /></span>
              <img src="/Saqr%20Hellping.png" alt={isAr ? 'شخصية صقر تساعد الطلاب' : 'Saqr helping students'}
                className="saqr-learning-mascot relative z-10 h-full w-full object-contain object-bottom drop-shadow-[0_16px_22px_rgba(0,0,0,.25)]"
                decoding="async" />
            </div>
          </div>
        </header>

        <div aria-label={isAr ? 'خطوات رحلتك' : 'Your journey steps'} className="grid grid-cols-3 gap-2 sm:gap-3">
          {[isAr ? '1. اختار' : '1. Choose', isAr ? '2. اسمع' : '2. Listen', isAr ? '3. جاوب' : '3. Answer'].map((label, index) =>
            <div key={index} className="min-h-14 sm:min-h-16 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900 bg-emerald-50 dark:bg-slate-900 flex items-center justify-center px-2 py-3 text-center text-base sm:text-lg font-black text-emerald-900 dark:text-emerald-100">
              {label}
            </div>)}
        </div>

        <section aria-labelledby="saqr-learning-tools" className="space-y-5">
          <div className="flex flex-wrap gap-3 items-end justify-between px-1">
            <div>
              <p className="text-xs font-black tracking-wide text-emerald-700 dark:text-emerald-400">{isAr ? 'رحلتك مع صقر' : 'YOUR LEARNING JOURNEY'}</p>
              <h2 id="saqr-learning-tools" className="mt-1 text-2xl sm:text-3xl font-black">{isAr ? 'ماذا تريد أن تفعل اليوم؟' : 'What will you try today?'}</h2>
              <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-300 font-semibold">{isAr ? 'اختر نشاطًا ثم ابدأ باللعب أو القراءة.' : 'Choose an activity and start reading or playing.'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setLarge(v => !v)} aria-pressed={large}
                className={'min-h-12 rounded-full border-2 px-4 py-3 text-sm sm:text-base font-black transition-colors focus-visible:outline-4 focus-visible:outline-sky-400 ' +
                  (large ? 'border-sky-700 bg-sky-700 text-white' : 'border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sky-800 dark:text-sky-200')}>
                {large ? (isAr ? 'الخط كبير' : 'Large text on') : (isAr ? 'كبر الخط' : 'Larger text')}
              </button>
              {settings.calm_display && <button type="button" onClick={() => setQuiet(v => !v)} aria-pressed={quiet}
              className={'min-h-12 rounded-full border-2 px-4 py-3 text-sm sm:text-base font-black transition-colors focus-visible:outline-4 focus-visible:outline-sky-400 ' +
                (quiet ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-emerald-200 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300')}>
              {quiet ? (isAr ? 'إيقاف العرض الهادئ' : 'Exit calm view') : (isAr ? 'عرض هادئ' : 'Calm view')}
              </button>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {features.filter(x => settings[x.key]).map((item, index) => <button key={item.key} type="button"
              onClick={() => selectActivity(item.key)} aria-pressed={active === item.key}
              className={'saqr-learning-option group relative isolate flex flex-col items-start min-h-[200px] sm:min-h-[240px] overflow-hidden rounded-[1.8rem] border-b-[7px] p-5 sm:p-6 text-start shadow-lg transition-[transform,box-shadow] duration-300 focus-visible:outline-4 focus-visible:outline-sky-400 bg-gradient-to-br ' +
                item.color + ' ' + item.border + (active === item.key ? ' ring-4 ring-amber-300 dark:ring-amber-600' : '')}>
              <span aria-hidden="true" className="saqr-learning-decoration absolute -end-8 -top-8 h-36 w-36 rounded-full border-[22px] border-white/10" />
              <span className="relative grid place-items-center h-16 w-16 rounded-2xl bg-white/20 border border-white/30 text-white shadow-sm group-hover:rotate-3 transition-transform">
                <ActivityIcon kind={item.key} />
              </span>
              <span className="relative mt-auto pt-6 block font-black text-white text-xl sm:text-2xl leading-snug">{isAr ? item.ar : item.en}</span>
              <span className="relative mt-2 text-sm sm:text-base font-semibold text-white/95 leading-7">{isAr ? item.hintAr : item.hintEn}</span>
              <span aria-hidden="true" className="absolute end-4 bottom-3 text-white/80 text-lg">{String(index + 1).padStart(2, '0')}</span>
            </button>)}
          </div>
        </section>

        {current && settings[current.key] && <section ref={activityRef} aria-labelledby="saqr-learning-current"
          className={'saqr-learning-detail scroll-mt-24 rounded-[2rem] border-2 border-emerald-200 dark:border-emerald-900 bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 md:p-9 shadow-lg ' + (quiet ? 'shadow-none' : '')}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 dark:border-emerald-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center rounded-xl bg-emerald-700 text-white p-2.5"><ActivityIcon kind={current.key} className="h-7 w-7" /></span>
              <div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{isAr ? 'نشاطي الآن' : 'MY ACTIVITY'}</p>
                <h2 id="saqr-learning-current" className="text-xl sm:text-2xl font-black">{isAr ? current.ar : current.en}</h2>
              </div>
            </div>
            <button type="button" onClick={() => setActive(null)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 min-h-11 font-black text-sm hover:border-emerald-400 focus-visible:outline-4 focus-visible:outline-sky-400">
              {isAr ? 'إغلاق النشاط' : 'Close activity'}
            </button>
          </div>
          {current.key === 'read_together' && <ReadTogether isAr={isAr} large={large} quiet={quiet} isAdmin={viewer === 'admin'} />}
          {current.key === 'picture_guidance' && <PictureLearning isAr={isAr} large={large} />}
          {current.key === 'focus_steps' && <StepByStep isAr={isAr} large={large} />}
          {current.key === 'calm_display' && <CalmDisplay isAr={isAr} quiet={quiet} onQuietChange={setQuiet} large={large} onLargeChange={setLarge} />}
        </section>}

        <div className="rounded-[1.6rem] border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/20 p-5 sm:p-6 flex flex-wrap justify-between items-center gap-3">
          <p className="font-bold text-sm leading-7 text-slate-700 dark:text-slate-200">
            {isAr ? 'صقر معك خطوة بخطوة، ويمكنك تكرار الأنشطة كما تحب.' :
              'Saqr is with you, one step at a time. Repeat activities whenever you like.'}
          </p>
          <Link to="/home" className="rounded-xl bg-emerald-700 text-white px-5 py-3 font-black text-sm hover:bg-emerald-800">{isAr ? 'العودة للمكتبة' : 'Back to library'}</Link>
        </div>
      </>}
    </main>
    <style>{String.raw`
      @keyframes saqr-learning-float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-11px) } }
      @keyframes saqr-learning-glow { 0%,100% { opacity:.65;transform:scale(.96) } 50% { opacity:.95;transform:scale(1.05) } }
      @keyframes saqr-learning-orbit { to { transform:rotate(360deg) } }
      @keyframes saqr-learning-greeting-appear {
        from { opacity:0;transform:translateY(14px) }
        to { opacity:1;transform:translateY(0) }
      }
      .saqr-learning-greeting { animation:saqr-learning-greeting-appear .9s ease-out both }
      .saqr-learning-mascot { animation:saqr-learning-float 5.5s ease-in-out infinite }
      .saqr-learning-aura { animation:saqr-learning-glow 7s ease-in-out infinite }
      .saqr-learning-orbit { animation:saqr-learning-orbit 36s linear infinite }
      .saqr-learning-floating-symbol { animation:saqr-learning-float 4.5s ease-in-out infinite }
      .saqr-learning-symbol-late { animation-delay:-2.2s }
      @media (hover:hover) and (pointer:fine) {
        .saqr-learning-option:hover { transform:translateY(-8px) scale(1.012);box-shadow:0 21px 32px rgba(8,69,62,.23) }
      }
      @media (hover:none) and (pointer:coarse) {
        .saqr-learning-floating-symbol,.saqr-learning-orbit { animation:none }
      }
      .saqr-learning-page--calm .saqr-learning-decoration { display:none!important }
      .saqr-learning-page--calm .saqr-learning-greeting { animation:none!important }
      .saqr-learning-page--calm .saqr-learning-mascot,.saqr-learning-page--calm .saqr-learning-option { animation:none!important;transition:none!important;transform:none!important;box-shadow:none!important }
      .saqr-learning-page--calm .saqr-learning-hero { background:#07543E }
      .saqr-learning-page--calm .saqr-learning-option { background-image:none!important;background-color:#0D7456 }
      .saqr-learning-page--calm .saqr-learning-option:nth-child(2) { background-color:#46558B }
      .saqr-learning-page--calm .saqr-learning-option:nth-child(3) { background-color:#9D6B19 }
      .saqr-learning-page--calm .saqr-learning-option:nth-child(4) { background-color:#08644B }
      @media (prefers-reduced-motion:reduce) {
        .saqr-learning-page *, .saqr-learning-page *::before, .saqr-learning-page *::after { animation:none!important;transition:none!important;scroll-behavior:auto!important }
        .saqr-learning-option:hover { transform:none!important }
      }
    `}</style>
  </div>;
}
