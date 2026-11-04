import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/utils/supabase';
import { useLanguage } from '../App';

const BACKGROUND_VIDEOS = ['/1.mp4', '/2.mp4', '/3.mp4'];

export default function Login() {
  // Use the shared website language so public pages follow the login choice.
  const { locale: lang, setLocale: setLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFlag, setShowFlag] = useState(false); // حالة إظهار علم الإمارات عند الضغط على صقر
  const [entryWelcomeVisible, setEntryWelcomeVisible] = useState(false);
  const [entryWelcomeSequence, setEntryWelcomeSequence] = useState(0);
  const entryWelcomeTimeoutRef = useRef<number | null>(null);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);
  const subtitleTextRef = useRef<HTMLSpanElement>(null);
  const [subtitleScale, setSubtitleScale] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const failedVideosRef = useRef<Set<number>>(new Set());
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  // Keep the original random order, but reuse one video element to avoid extra Safari setup.
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(() =>
    Math.floor(Math.random() * BACKGROUND_VIDEOS.length)
  );

  const requestVideoPlayback = () => {
    const video = videoRef.current;
    if (!video || videoUnavailable || document.hidden) return;
    // Safari must see the video muted and inline before any playback request.
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    if (!video.paused) return;

    const attempt = video.play();
    if (attempt) {
      void attempt.catch(() => {
        // Safari may defer autoplay because of system/browser policy.
        // Retry when media is ready, the tab returns, or the visitor interacts.
      });
    }
  };

  useEffect(() => {
    if (videoUnavailable) return;
    const onResume = () => requestVideoPlayback();
    document.addEventListener('visibilitychange', onResume);
    window.addEventListener('pageshow', onResume);
    window.addEventListener('pointerdown', onResume, { passive: true });
    window.addEventListener('keydown', onResume);
    requestVideoPlayback();
    return () => {
      document.removeEventListener('visibilitychange', onResume);
      window.removeEventListener('pageshow', onResume);
      window.removeEventListener('pointerdown', onResume);
      window.removeEventListener('keydown', onResume);
    };
  }, [currentVideoIndex, videoUnavailable]);

  const handleVideoEnd = () => {
    const candidates = BACKGROUND_VIDEOS.map((_, idx) => idx)
      .filter(idx => idx !== currentVideoIndex && !failedVideosRef.current.has(idx));

    if (!candidates.length) {
      // If just one playable clip remains, repeat it rather than choosing a broken file.
      const video = videoRef.current;
      if (video && !failedVideosRef.current.has(currentVideoIndex)) {
        video.currentTime = 0;
        requestVideoPlayback();
      }
      return;
    }
    setCurrentVideoIndex(candidates[Math.floor(Math.random() * candidates.length)]);
  };

  const handleVideoError = () => {
    failedVideosRef.current.add(currentVideoIndex);
    if (failedVideosRef.current.size >= BACKGROUND_VIDEOS.length) {
      setVideoUnavailable(true);
      return;
    }
    handleVideoEnd();
  };

  // A single Google account picker handles students, staff and admins.
  // The approved role and name are resolved after OAuth by the school directory.
  const handleSchoolGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Clear any old manually-entered-email hint from a previous login attempt.
      // Google is the ONLY source of email; Supabase validates its identity.
      try { sessionStorage.removeItem('efips_oauth_school_email'); } catch { /* restricted storage */ }
      await supabase.auth.signOut();
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/?efips_google_student=1',
          scopes: 'openid email profile',
          queryParams: { prompt: 'select_account' },
        },
      });
      if (googleError) throw googleError;
    } catch {
      setError(lang === 'ar'
        ? 'تعذر بدء الدخول عبر Google المدرسي. حاول مرة أخرى.'
        : 'Could not start school Google sign-in. Please retry.');
      setLoading(false);
    }
  };

  // Preserve the full sentence on exactly one line at every breakpoint.
  // Fit the rendered text to its own available width rather than hiding words
  // or depending on a font-size estimate that fails with Arabic glyphs.
  useEffect(() => {
    let active = true;
    const measure = () => {
      const container = subtitleContainerRef.current;
      const text = subtitleTextRef.current;
      if (!active || !container || !text || !container.clientWidth) return;
      const naturalWidth = text.scrollWidth;
      setSubtitleScale(naturalWidth > 0
        ? Math.min(1, (container.clientWidth - 2) / naturalWidth)
        : 1);
    };
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measure) : null;
    if (subtitleContainerRef.current) resizeObserver?.observe(subtitleContainerRef.current);
    window.addEventListener('resize', measure);
    const frame = window.requestAnimationFrame(measure);
    void document.fonts?.ready.then(measure);
    return () => {
      active = false;
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measure);
      window.cancelAnimationFrame(frame);
    };
  }, [lang]);

  const handleSaqrClick = () => {
    setShowFlag(true);
    setTimeout(() => setShowFlag(false), 3000);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.05; audio.play().catch(() => {});
  };

  // Only the right-panel SAQR ENTER greeting is affected. Leave the
  // original Saqr/video interactions and school Google OAuth untouched.
  useEffect(() => () => {
    if (entryWelcomeTimeoutRef.current !== null) {
      window.clearTimeout(entryWelcomeTimeoutRef.current);
    }
  }, []);

  const handleEntrySaqrClick = () => {
    if (entryWelcomeTimeoutRef.current !== null) {
      window.clearTimeout(entryWelcomeTimeoutRef.current);
    }
    // Increment the key so repeated clicks restart the short entrance/fade.
    setEntryWelcomeSequence(sequence => sequence + 1);
    setEntryWelcomeVisible(true);
    entryWelcomeTimeoutRef.current = window.setTimeout(() => {
      setEntryWelcomeVisible(false);
      entryWelcomeTimeoutRef.current = null;
    }, 3300);
  };

  return (
    <div 
      className="efips-login-page min-h-[100dvh] bg-[#f0f4f8] bg-[url('/bg-pattern-light.svg')] flex items-start justify-center px-3 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:pt-20 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-500 relative" 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 🌐 أزرار تغيير اللغة في أعلى الشاشة */}
      <div className={`efips-login-language absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex items-center gap-2 z-50`}>
          <button onClick={() => setLang('ar')} className={`px-4 py-1.5 rounded-full font-bold text-xs md:text-sm border-2 transition-all ${lang === 'ar' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400'}`}>العربية</button>
          <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-full font-bold text-xs md:text-sm border-2 transition-all ${lang === 'en' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'}`}>English</button>
      </div>

      <div className="efips-login-frame max-w-[1180px] w-full bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row z-10">
        
        {/* ================= القسم الأول: الهوية البصرية وصقر (مع خلفية الفيديو العشوائية) ================= */}
        <div className="efips-login-brand-panel lg:w-1/2 min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:px-8 xl:px-10 lg:py-9 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50/80 to-sky-50/70 border-b lg:border-b-0 lg:border-l border-emerald-100">
          
          {/* Muted inline playback with Safari resume and a static background fallback. */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200">
            {!videoUnavailable && (
              <video
                ref={videoRef}
                src={BACKGROUND_VIDEOS[currentVideoIndex]}
                autoPlay
                muted
                playsInline
                preload="auto"
                onLoadedData={requestVideoPlayback}
                onCanPlay={requestVideoPlayback}
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                className="w-full h-full object-cover object-center"
              />
            )}
            {/* طبقة تفتيح خفيفة لضمان وضوح الشعار والنصوص وشخصية صقر فوق الفيديو */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/65 via-white/55 to-sky-50/60"></div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-[80px] animate-pulse-slow"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-[80px] animate-pulse-slow"></div>
          </div>

          <div className="efips-login-school relative z-10 mb-5 flex w-full flex-col items-center justify-center gap-2 text-center">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 -z-10 rounded-full bg-blue-100 blur-xl transition-all duration-500 group-hover:bg-blue-200"></div>
              <img
                src="/school-logo.png"
                alt="School Logo"
                className="relative z-10 h-16 w-16 object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105 sm:h-20 sm:w-20 md:h-24 md:w-24"
              />
            </div>
            <div className="w-full min-w-0 space-y-1">
              <h2 dir="rtl" className="whitespace-nowrap text-[clamp(10px,2.3vw,14px)] font-black leading-[1.85] text-slate-800 drop-shadow-sm">
                مدرسة صقر الإمارات الدولية الخاصة
              </h2>
              <h2 dir="ltr" className="whitespace-nowrap text-[clamp(9px,2.1vw,14px)] font-black leading-[1.65] text-slate-800 drop-shadow-sm">
                Emirates Falcon Int'l Private School
              </h2>
            </div>
          </div>

          <div className="efips-login-brand-copy text-center relative z-10 mb-4 w-full min-w-0">
            {/* Explicit two-line bilingual brand. Comfortable Arabic line boxes
                keep all dots and letter ascenders outside clipped edges. */}
            <h1
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className="efips-brand-heading mx-auto mb-3 flex w-full min-w-0 flex-col items-center justify-center font-black text-sky-800"
            >
              {lang === 'ar' ? (
                <>
                  <span className="efips-brand-heading-line">المكتبة الرقمية</span>
                  <span className="efips-brand-heading-line">لصقر الإمارات</span>
                </>
              ) : (
                <>
                  <span className="efips-brand-heading-line">EFIPS</span>
                  <span className="efips-brand-heading-line">DIGITAL LIBRARY</span>
                </>
              )}
            </h1>
            <div ref={subtitleContainerRef} className="efips-brand-subtitle-container mx-auto flex w-full min-w-0 items-center justify-center" aria-label={lang === 'ar'
              ? 'اكتشف عالماً من المعرفة، العب، وتعلم مع مساعدك الذكي "صقر"'
              : 'Discover a world of knowledge, play, and learn with Saqr!'}>
              <span
                ref={subtitleTextRef}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                className="efips-brand-subtitle inline-block whitespace-nowrap font-bold text-slate-700"
                style={{ transform: `scaleX(${subtitleScale})`, transformOrigin: 'center center' }}
              >
                {lang === 'ar'
                  ? 'اكتشف عالماً من المعرفة، العب، وتعلم مع مساعدك الذكي "صقر"'
                  : 'Discover a world of knowledge, play, and learn with Saqr!'}
              </span>
            </div>
          </div>

          {/* شخصية صقر التفاعلية مع ظهور علم الإمارات عند الضغط */}
          <div onClick={handleSaqrClick} className="efips-login-brand-mascot relative z-10 mt-1 mb-2 lg:mb-0 w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center cursor-pointer group">
            <div className="absolute bottom-0 w-3/4 h-6 bg-slate-300/40 rounded-[100%] blur-md"></div>
            
            {showFlag && (
              <div className="absolute -top-10 z-30 animate-bounce bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border-2 border-emerald-500 flex items-center gap-2">
                <span className="text-2xl">🇦🇪</span>
                <span className="font-black text-xs text-slate-800">{lang === 'ar' ? 'مرحبا بكم أنا صقر' : 'Wellcome Iam Saqr'}</span>
              </div>
            )}

            <img 
              src="/saqr-full.png" 
              alt="صقر المساعد الذكي" 
              className="w-full h-full object-contain relative z-10 animate-float drop-shadow-lg group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* ================= القسم الثاني: نموذج تسجيل الدخول ================= */}
        <div className="efips-login-signin lg:w-1/2 min-w-0 px-5 pt-7 pb-8 sm:px-8 sm:pt-8 sm:pb-9 lg:px-8 lg:pt-8 xl:px-12 flex flex-col justify-start bg-white relative z-10">
          {/* The sign-in header intentionally contains only the original Saqr
              entrance artwork and the localized title. Heritage appears on click. */}
          <header className="efips-login-hero relative mb-5 flex w-full min-w-0 flex-col items-center justify-center text-center">
            <div className="relative mx-auto flex w-full max-w-[350px] items-center justify-center">
              <img src="/school-logo.png" alt="" aria-hidden="true" className="efips-entry-school-watermark pointer-events-none absolute z-0 h-[86%] w-[85%] object-contain opacity-[0.15] select-none" />
              <button
                type="button"
                onClick={handleEntrySaqrClick}
                aria-label={lang === 'ar'
                  ? 'اضغط على صقر لعرض ترحيب من التراث الإماراتي'
                  : 'Tap Saqr for an Emirati heritage welcome'}
                className="efips-entry-saqr relative z-10 flex h-52 w-48 items-center justify-center rounded-3xl bg-transparent p-0 outline-offset-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-500 sm:h-64 sm:w-60 lg:h-72 lg:w-64"
              >
                <img
                  src="/SAQR%20ENTER.png"
                  alt={lang === 'ar' ? 'شخصية صقر ترحب بزوار المكتبة' : 'Saqr welcomes library visitors'}
                  className="block h-full w-full object-contain drop-shadow-[0_12px_15px_rgba(0,80,62,0.13)] transition-transform duration-300 hover:scale-[1.025]"
                />
              </button>

              {entryWelcomeVisible && (
                <div
                  key={entryWelcomeSequence}
                  className="efips-heritage-burst pointer-events-none absolute inset-0 z-20"
                >
                  {/* Palm tree — date palms are part of the UAE's living heritage. */}
                  <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" stroke="#00843D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-0 top-[9%] h-11 w-11 sm:h-14 sm:w-14">
                    <path d="M30 26c1 9 1 18-1 30M35 27c-1 10-1 20 1 29M23 57h21" />
                    <path d="M32 21c-7-11-18-11-23-5 9-1 15 3 20 11M32 20c-1-13-10-18-19-17 8 5 12 11 16 22M33 20c5-12 16-16 24-12-10 2-16 8-21 18M34 21c12-8 21-6 25 1-10-3-17-1-23 6M32 19c-1-8 1-13 6-17-1 8-1 13-4 20" />
                  </svg>

                  {/* Traditional dhow under sail. */}
                  <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" stroke="#0A83A1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-0 top-[9%] h-11 w-11 sm:h-14 sm:w-14">
                    <path d="M34 8v32M34 11 12 38h22V11ZM38 17l12 21H38M10 44h45l-7 10H19L10 44ZM6 60c5-3 9-3 14 0s9 3 14 0 9-3 14 0 9 3 13 0" />
                  </svg>

                  {/* Desert fort with crenellations. */}
                  <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" stroke="#B58A45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-[20%] left-[2%] h-11 w-11 sm:h-14 sm:w-14">
                    <path d="M8 55V21h9v-7h7v7h15v-7h7v7h10v34M6 55h52M8 30h48M26 55V43a6 6 0 0 1 12 0v12M15 37h5v5h-5zM44 37h5v5h-5z" />
                  </svg>

                  {/* Dallah — traditional Emirati Arabic-coffee hospitality. */}
                  <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" stroke="#CE1126" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-[20%] right-[2%] h-11 w-11 sm:h-14 sm:w-14">
                    <path d="M28 15h15M35 7v8M26 20c-5 6-6 12-6 23 0 8 5 13 15 13 9 0 15-5 15-13 0-11-2-17-7-23H26ZM19 31c-12-1-14-10-11-16 2 7 7 9 13 8M50 28c9-1 13-6 12-13-5 5-8 6-14 6M29 34h14M28 49h15" />
                  </svg>

                  <p role="status" dir="rtl" className="efips-heritage-greeting absolute bottom-0 left-1/2 z-30 w-max max-w-[95%] -translate-x-1/2 rounded-2xl border border-emerald-200 bg-white/95 px-3 py-2 text-center text-base font-black leading-relaxed text-emerald-900 shadow-lg sm:px-5 sm:text-xl">
                    حياك الله في صقر
                  </p>
                </div>
              )}
            </div>
            <h2 className="efips-login-title mt-4 w-full text-center text-3xl font-black leading-[1.85] text-[#065c38] sm:text-4xl">
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </h2>
          </header>

          {/* Google-only entry; school eligibility remains enforced by OAuth and backend. */}
          <div className="space-y-5 animate-fade-in">
            {error && <div role="alert" className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-3 rounded-2xl text-xs md:text-sm font-bold text-center">{error}</div>}
            <div className="relative group">
              <div aria-hidden="true" className="efips-login-button-glow pointer-events-none absolute -inset-1 rounded-[1.8rem] bg-gradient-to-r from-emerald-400/25 via-teal-400/25 to-sky-400/20 blur-md opacity-20 transition-opacity duration-500 group-hover:opacity-60" />
              <button
                type="button"
                onClick={() => void handleSchoolGoogleLogin()}
                disabled={loading}
                className="efips-login-google-button relative w-full min-h-16 flex items-center justify-center gap-3 overflow-hidden rounded-[1.5rem] border border-white/30 bg-gradient-to-r from-[#08795E] via-[#087D77] to-[#197AA1] hover:from-[#066348] hover:via-[#076A64] hover:to-[#12698D] px-4 py-4 text-white text-base md:text-lg font-black shadow-lg shadow-emerald-600/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-[.99] disabled:cursor-wait disabled:opacity-70 disabled:transform-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-400"
              >
                <span aria-hidden="true" className="efips-login-button-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <svg width="26" height="26" viewBox="0 0 48 48" aria-hidden="true" className="relative z-10 shrink-0 rounded-full bg-white p-1">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.3 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.3 13.8 17.7 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.1 24.5c0-1.6-.2-3.2-.5-4.7H24v8.9h12.4c-.5 2.9-2.1 5.4-4.5 7.1l7.3 5.7c4.3-4 6.9-9.8 6.9-17z"/>
                  <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.7l7.9-6.1z"/>
                  <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-6l-7.3-5.7c-2 1.4-4.7 2.2-8.7 2.2-6.3 0-11.7-4.3-13.5-10.2l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
                </svg>
                <span className="relative z-10">
                  {loading
                    ? (lang === 'ar' ? 'جارٍ الانتقال إلى Google...' : 'Connecting to Google...')
                    : (lang === 'ar' ? 'الدخول باستخدام Google' : 'Sign in with Google')}
                </span>
              </button>
            </div>
            <div className="text-center pt-3">
              <Link to="/about" className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all">
                {lang === 'ar' ? 'عن مدرسة صقر الإمارات الدولية الخاصة' : 'More About EFIPS'}
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/tutorial"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-3 text-xs sm:text-sm font-black text-emerald-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
              </svg>
              {lang === 'ar' ? 'جولة افتراضية للبوابة' : 'Website Virtual tour'}
            </Link>
          </div>
          {/* Official institutions — fixed visual order, right to left on every locale. */}
          <nav className="efips-login-partners mt-5 grid grid-cols-3 gap-2 sm:gap-3" dir="rtl"
            aria-label={lang === 'ar' ? 'روابط الجهات التعليمية' : 'Education organizations'}>
            <a href="https://www.moe.gov.ae/" target="_blank" rel="noopener noreferrer"
              title={lang === 'ar' ? 'وزارة التربية والتعليم الإماراتية' : 'UAE Ministry of Education'}
              aria-label={lang === 'ar' ? 'زيارة موقع وزارة التربية والتعليم الإماراتية' : 'Visit UAE Ministry of Education website'}
              className="efips-login-partner flex min-w-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white px-2 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">
              <img src="https://cdn.localized.world/organizations/271/6ff55175-e234-4fde-8566-132254b2d191.png"
                alt={lang === 'ar' ? 'شعار وزارة التربية والتعليم' : 'UAE Ministry of Education logo'}
                className="h-14 w-full object-contain sm:h-[76px]" loading="lazy" decoding="async" />
            </a>
            <a href="https://www.cognia.org/" target="_blank" rel="noopener noreferrer"
              title="Cognia" aria-label="Visit Cognia website"
              className="efips-login-partner flex min-w-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white px-2 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">
              <img src="https://masarschool.com/wp-content/uploads/2024/07/cognia.png"
                alt="Cognia logo" className="h-14 w-full object-contain sm:h-[76px]" loading="lazy" decoding="async" />
            </a>
            <a href="https://www.adek.gov.ae/" target="_blank" rel="noopener noreferrer"
              title={lang === 'ar' ? 'دائرة التعليم والمعرفة أبوظبي' : 'Abu Dhabi Department of Education and Knowledge'}
              aria-label={lang === 'ar' ? 'زيارة موقع دائرة التعليم والمعرفة' : 'Visit Abu Dhabi Department of Education and Knowledge website'}
              className="efips-login-partner flex min-w-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white px-2 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">
              <img src="https://houbarafund.gov.ae/gallery/6DkkgYXTbm1G6H1c8IayktoDEbLNudBPSWa8ki3x.png"
                alt={lang === 'ar' ? 'شعار دائرة التعليم والمعرفة' : 'ADEK logo'}
                className="h-14 w-full object-contain sm:h-[76px]" loading="lazy" decoding="async" />
            </a>
          </nav>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        /* Responsive bilingual typography. The large line box prevents Arabic
           dots from touching an overflow edge, while labels never break. */
        .efips-brand-heading {
          font-size:clamp(26px,3.2vw,45px);
          line-height:1.67;
          letter-spacing:normal;
          text-shadow:0 3px 12px rgba(2,71,94,.12);
          overflow:visible;
        }
        .efips-brand-heading-line {
          display:block;
          width:100%;
          padding-block:.06em;
          white-space:nowrap;
          overflow:visible;
        }
        .efips-brand-subtitle-container {
          min-height:33px;
          overflow:visible;
          white-space:nowrap;
        }
        .efips-brand-subtitle {
          font-size:13px;
          line-height:2;
          letter-spacing:normal;
          white-space:nowrap;
          max-width:none;
          flex-shrink:0;
          will-change:transform;
        }
        /* Only the sign-in header is simplified; other Login styling is intact. */
        .efips-login-title {
          font-size:clamp(28px,4.2vw,40px);
          line-height:1.85;
          color:#065c38;
          -webkit-text-fill-color:#065c38;
        }
        @media(max-width:420px) {
          .efips-brand-heading { font-size:clamp(23px,7.1vw,28px);line-height:1.85; }
          .efips-brand-subtitle { font-size:11.5px; }
          .efips-login-title { font-size:clamp(28px,8vw,34px);line-height:1.9; }
        }
        @keyframes efips-heritage-welcome-fade {
          0% { opacity:0; }
          12%,66% { opacity:1; }
          100% { opacity:0; }
        }
        @keyframes efips-heritage-icon-reveal {
          0% { opacity:0; transform:translateY(8px) scale(.84); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        .efips-heritage-burst { animation:efips-heritage-welcome-fade 3.3s ease-in-out both; }
        .efips-heritage-burst > svg { animation:efips-heritage-icon-reveal .65s ease-out both; }
        .efips-entry-saqr:focus-visible { border-radius:1rem; }
        .efips-login-button-shine {
          background: linear-gradient(115deg,transparent 15%,rgba(255,255,255,.20) 50%,transparent 85%);
        }
        /* Refined split-screen identity on desktop and an efficient, readable
           stacked flow on phones. All interactive artwork and school OAuth remain active. */
        .efips-login-page,.efips-login-page * { font-family:'Cairo',sans-serif!important; }
        .efips-login-page {
          isolation:isolate;
          background:
            radial-gradient(circle at 13% 18%,rgba(16,185,129,.16),transparent 32%),
            radial-gradient(circle at 88% 82%,rgba(14,165,233,.11),transparent 35%),
            linear-gradient(140deg,#f0f9f5,#eef5f6 55%,#f8fafc);
          padding-top:74px!important;
        }
        .efips-login-frame {
          position:relative;
          box-shadow:0 28px 85px rgba(4,65,52,.14);
          border-color:rgba(14,121,92,.14);
        }
        .efips-login-brand-panel {
          isolation:isolate;
          border-color:rgba(14,121,92,.12);
        }
        .efips-login-brand-panel::after {
          content:'';position:absolute;z-index:20;inset:0 0 auto;
          height:5px;pointer-events:none;
          background:linear-gradient(90deg,#ce1126 0 22%,#00843d 22% 57%,#f8fafc 57% 79%,#0f172a 79%);
        }
        .efips-login-school {gap:10px;}
        .efips-login-signin {background:#fff;align-items:center;}
        .efips-login-signin > * {width:100%;max-width:450px;}
        .efips-login-title {text-shadow:none;}
        .efips-login-google-button {box-shadow:0 14px 28px rgba(8,115,86,.16);}
        .efips-login-language {border:1px solid #d6ebe2;background:rgba(255,255,255,.9);border-radius:999px;padding:4px;box-shadow:0 6px 20px rgba(5,75,61,.07);}
        .efips-login-language button {min-height:37px;}
        .efips-login-brand-panel .efips-brand-heading {color:#075f4c;}
        .efips-login-brand-panel .efips-brand-subtitle {color:#355d57;}
        @media (min-width:1024px) {
          .efips-login-page {align-items:center;padding-block:60px 34px!important;padding-inline:26px!important;}
          .efips-login-frame {min-height:min(760px,calc(100dvh - 100px));}
          .efips-login-brand-panel {width:54%!important;padding:42px 42px 34px!important;}
          .efips-login-signin {width:46%!important;justify-content:center!important;padding:45px 44px!important;}
          .efips-login-brand-mascot {width:210px;height:210px;}
          .efips-login-hero {margin-bottom:24px;}
        }
        @media (min-width:640px) and (max-width:1023px) {
          .efips-login-frame {max-width:730px;}
          .efips-login-brand-panel {padding-block:25px 14px!important;}
          .efips-login-brand-mascot {width:145px!important;height:140px!important;}
          .efips-login-signin {padding:25px 55px 35px!important;}
          .efips-entry-saqr {width:200px!important;height:205px!important;}
        }
        /* Phone layout: two equally tall, vertically stacked sections.
           Use available viewport height and allow natural scroll on short phones,
           never clipping the Google controls or school information. */
        @media (max-width:639px) {
          .efips-login-page {
            padding:60px 10px 14px!important;
            align-items:flex-start!important;
          }
          .efips-login-language {top:10px!important;left:auto;right:12px;gap:2px;}
          .efips-login-language button {padding:6px 12px;min-height:34px;font-size:12px;}
          .efips-login-frame {
            display:grid!important;
            grid-template-columns:minmax(0,1fr)!important;
            grid-template-rows:repeat(2,minmax(0,1fr))!important;
            height:max(690px,calc(100dvh - 74px))!important;
            min-height:690px!important;
            border-radius:25px!important;
            box-shadow:0 16px 45px rgba(4,65,52,.13);
          }
          .efips-login-brand-panel {
            display:flex!important;
            flex-direction:column!important;
            justify-content:space-evenly!important;
            align-items:center!important;
            gap:4px!important;
            width:100%!important;
            min-width:0;min-height:0;
            padding:10px 18px 12px!important;
            border-bottom:1px solid rgba(14,121,92,.16)!important;
          }
          .efips-login-school {
            display:flex!important;
            flex-direction:column!important;
            align-items:center!important;
            justify-content:center!important;
            gap:4px!important;
            width:100%!important;
            max-width:100%!important;
            margin:0!important;
            text-align:center!important;
          }
          .efips-login-school img {
            width:clamp(42px,7dvh,55px)!important;
            height:clamp(42px,7dvh,55px)!important;
          }
          .efips-login-school h2 {
            font-size:clamp(10px,2.8vw,12px)!important;
            white-space:normal!important;
            line-height:1.35!important;
            text-align:center!important;
          }
          .efips-login-school .space-y-1 > * + * {margin-top:1px!important;}
          .efips-login-brand-copy {
            width:100%!important;
            max-width:100%!important;
            margin:0!important;
            text-align:center!important;
          }
          .efips-brand-heading {
            font-size:clamp(23px,6vw,29px)!important;
            line-height:1.28!important;
            margin-bottom:4px!important;
          }
          .efips-brand-heading-line {padding-block:0!important;}
          .efips-brand-subtitle-container {
            min-height:0!important;
            white-space:normal!important;
            max-width:100%!important;
          }
          .efips-brand-subtitle {
            font-size:clamp(12px,3.2vw,14px)!important;
            line-height:1.6!important;
            white-space:normal!important;
            width:100%!important;
            max-width:100%!important;
            flex-shrink:1!important;
            text-wrap:balance;
            transform:none!important;
          }
          .efips-login-brand-mascot {
            width:clamp(96px,15dvh,128px)!important;
            height:clamp(100px,16dvh,136px)!important;
            flex-shrink:1;
            margin:0!important;
          }
          .efips-login-signin {
            display:flex!important;
            flex-direction:column!important;
            justify-content:space-evenly!important;
            width:100%!important;
            min-width:0;min-height:0;
            padding:8px 18px 13px!important;
          }
          .efips-login-hero {margin-bottom:2px!important;}
          .efips-entry-saqr {
            width:clamp(92px,13dvh,118px)!important;
            height:clamp(96px,14dvh,122px)!important;
          }
          .efips-login-title {
            margin-top:0!important;
            font-size:clamp(24px,6vw,29px)!important;
            line-height:1.35!important;
          }
          .efips-login-signin .animate-fade-in > * + * {margin-top:4px!important;}
          .efips-login-signin .text-center.pt-3 {padding-top:1px!important;}
          .efips-login-google-button {
            min-height:52px!important;
            padding:9px 12px!important;
            font-size:clamp(14px,3.9vw,16px)!important;
            border-radius:17px!important;
          }
          .efips-login-signin > .mt-6 {margin-top:4px!important;}
          .efips-login-signin > .mt-6 a {padding:7px 12px!important;font-size:13px!important;}
          .efips-login-signin > .efips-login-partners {margin-top:5px!important;gap:6px!important;}
          .efips-login-partner {
            padding:5px 6px!important;
            min-height:48px!important;
            border-radius:12px!important;
          }
          .efips-login-partner img {height:40px!important;}
        }
        @media (max-width:375px) {
          .efips-login-brand-panel {padding-inline:13px!important;}
          .efips-login-signin {padding-inline:13px!important;}
          .efips-login-school h2 {font-size:10px!important;}
        }
        @media (max-width:359px) {
          .efips-brand-heading {font-size:23px!important;}
          .efips-brand-subtitle {font-size:12px!important;}
          .efips-login-brand-mascot {height:96px!important;width:96px!important;}
          .efips-entry-saqr {height:94px!important;width:94px!important;}
        }
        /* Desktop entry is a complete one-viewport composition.
           On unusually short windows allow natural scrolling rather than clipping links. */
        @media (min-width:1024px) and (min-height:600px) {
          .efips-login-page {
            box-sizing:border-box; height:100dvh!important; min-height:100dvh!important;
            padding:14px 24px!important; align-items:center!important; overflow:visible;
          }
          .efips-login-frame {
            height:min(790px, calc(100dvh - 28px))!important;
            min-height:0!important; max-height:calc(100dvh - 28px)!important;
          }
          .efips-login-brand-panel {
            padding:clamp(14px,2.3dvh,26px) 30px!important;
            justify-content:space-evenly!important;
          }
          .efips-login-school { margin-bottom:clamp(5px,1dvh,10px)!important; gap:8px!important; }
          .efips-login-school img { width:clamp(72px,12dvh,106px)!important; height:clamp(72px,12dvh,106px)!important; }
          .efips-login-school h2 {font-size:clamp(12px,1.8dvh,15px)!important;line-height:1.5!important;}
          .efips-login-brand-panel .efips-brand-heading {
            font-size:clamp(38px,5.7dvh,54px)!important; line-height:1.22!important; margin-bottom:8px!important;
          }
          .efips-brand-heading-line {padding-block:.02em!important;}
          .efips-brand-subtitle-container {min-height:0!important;white-space:normal!important;max-width:540px!important;}
          .efips-brand-subtitle {
            font-size:clamp(17px,2.5dvh,21px)!important;line-height:1.6!important;
            width:100%!important;max-width:100%!important;white-space:normal!important;
            flex-shrink:1!important;text-wrap:balance;transform:none!important;
          }
          .efips-login-brand-mascot {
            width:clamp(170px,31dvh,280px)!important; height:clamp(170px,31dvh,280px)!important;
            margin-block:5px 0!important;
          }
          .efips-login-signin {
            justify-content:space-evenly!important; padding:clamp(12px,2.1dvh,24px) 34px!important;
          }
          .efips-login-hero {margin-bottom:clamp(5px,1dvh,9px)!important;}
          .efips-entry-saqr {
            width:clamp(170px,31dvh,280px)!important; height:clamp(170px,31dvh,280px)!important;
          }
          .efips-login-title {
            font-size:clamp(32px,4.8dvh,44px)!important;
            line-height:1.5!important; margin-top:3px!important;
          }
          .efips-login-signin > .animate-fade-in > * + * {margin-top:clamp(8px,1.5dvh,14px)!important;}
          .efips-login-google-button {
            min-height:clamp(54px,7.5dvh,68px)!important; padding:10px 14px!important; font-size:clamp(17px,2.2dvh,20px)!important;
          }
          .efips-login-google-button svg {width:30px!important;height:30px!important;}
          .efips-login-signin .text-center.pt-3 {padding-top:0!important;}
          .efips-login-signin .animate-fade-in > .text-center a {font-size:clamp(14px,1.9dvh,17px)!important;}
          .efips-login-signin > .mt-6 {margin-top:0!important;}
          .efips-login-signin > .mt-6 a {font-size:clamp(14px,2dvh,18px)!important;padding:10px 16px!important;}
          .efips-login-signin > .mt-6 svg {width:24px!important;height:24px!important;}
          .efips-login-signin > .efips-login-partners {margin-top:0!important;gap:8px!important;}
          .efips-login-partner {padding:7px 10px!important; min-height:clamp(66px,10dvh,96px)!important; border-radius:14px!important;}
          .efips-login-partner img {height:clamp(56px,9dvh,86px)!important;}
        }
        @media(prefers-reduced-motion:reduce) {
          .efips-heritage-burst,.efips-heritage-burst > svg { animation:none!important; opacity:1!important; transform:none!important; }
          .efips-entry-saqr img,.efips-login-button-glow,.efips-login-button-shine { transition:none!important; }
        }

      `}} />
    </div>
  );
}
