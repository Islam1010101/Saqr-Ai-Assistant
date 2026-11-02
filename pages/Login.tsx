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

  return (
    <div 
      className="min-h-[100dvh] bg-[#f0f4f8] bg-[url('/bg-pattern-light.svg')] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-500 relative" 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 🌐 أزرار تغيير اللغة في أعلى الشاشة */}
      <div className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex items-center gap-2 z-50`}>
          <button onClick={() => setLang('ar')} className={`px-4 py-1.5 rounded-full font-bold text-xs md:text-sm border-2 transition-all ${lang === 'ar' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400'}`}>العربية</button>
          <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-full font-bold text-xs md:text-sm border-2 transition-all ${lang === 'en' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'}`}>English</button>
      </div>

      <div className="max-w-5xl w-full bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row z-10">
        
        {/* ================= القسم الأول: الهوية البصرية وصقر (مع خلفية الفيديو العشوائية) ================= */}
        <div className="lg:w-1/2 min-w-0 px-4 py-8 sm:px-8 lg:px-8 xl:px-10 lg:py-12 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-slate-100/50 border-b lg:border-b-0 lg:border-l border-slate-200">
          
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
            <div className="absolute inset-0 bg-gradient-to-br from-white/75 via-white/65 to-blue-50/75 backdrop-blur-[1px]"></div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-[80px] animate-pulse-slow"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-[80px] animate-pulse-slow"></div>
          </div>

          <div className="relative z-10 mb-8 flex w-full flex-col items-center justify-center gap-2 text-center">
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

          <div className="text-center relative z-10 mb-6 w-full min-w-0">
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
          <div onClick={handleSaqrClick} className="relative z-10 mt-2 mb-2 lg:mb-0 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center cursor-pointer group">
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
        <div className="lg:w-1/2 min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-8 xl:px-12 flex flex-col justify-center bg-white relative z-10">
          {/* Central title with subtle school-colored motion and SVG accents. */}
          <div className="relative mb-9 flex w-full min-w-0 flex-col items-center justify-center text-center">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-x-5 -top-10 bottom-0 rounded-full bg-gradient-to-r from-blue-200/0 via-emerald-200/45 to-indigo-200/0 blur-3xl efips-login-glow" />
            <div className="relative flex w-full min-w-0 flex-col items-center gap-3 efips-login-title-enter">
              <div aria-hidden="true" className="flex items-center gap-3 text-emerald-600">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-500" />
                <svg className="h-7 w-7 efips-login-spark" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3v5m0 16v5M3 16h5m16 0h5M7 7l3.5 3.5m11 11L25 25M25 7l-3.5 3.5m-11 11L7 25" />
                  <path d="M16 9l2.5 4.5L23 16l-4.5 2.5L16 23l-2.5-4.5L9 16l4.5-2.5L16 9Z" />
                </svg>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-500" />
              </div>
              <h2 className="efips-login-title relative block w-full min-w-0 whitespace-nowrap px-1 py-2 text-center font-black">
                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </h2>
              <span aria-hidden="true" className="efips-login-accent h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-indigo-500" />
            </div>
          </div>

          {/* Google-only entry: no typed email, account-type selector, or instructions. */}
          <div className="space-y-5 animate-fade-in">
            {error && <div role="alert" className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-3 rounded-2xl text-xs md:text-sm font-bold text-center">{error}</div>}
            <div className="relative group">
              <div aria-hidden="true" className="efips-login-button-glow pointer-events-none absolute -inset-1 rounded-[1.8rem] bg-gradient-to-r from-emerald-400/40 via-blue-400/40 to-indigo-400/40 blur-lg opacity-50 transition-opacity duration-500 group-hover:opacity-90" />
              <button
                type="button"
                onClick={() => void handleSchoolGoogleLogin()}
                disabled={loading}
                className="relative w-full min-h-16 flex items-center justify-center gap-3 overflow-hidden rounded-[1.5rem] border border-white/30 bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-700 hover:via-blue-700 hover:to-emerald-700 px-4 py-4 text-white text-base md:text-lg font-black shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-[.99] disabled:cursor-wait disabled:opacity-70 disabled:transform-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-400"
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
        .efips-login-title {
          font-size:clamp(30px,3.8vw,48px);
          line-height:1.8;
          letter-spacing:normal;
          overflow:visible;
          color:#075985!important;
          background:none!important;
          -webkit-text-fill-color:#075985!important;
          background-clip:initial!important;
          filter:none!important;
          text-shadow:0 3px 16px rgba(6,95,120,.12);
        }
        @media(max-width:420px) {
          .efips-brand-heading { font-size:clamp(23px,7.1vw,28px);line-height:1.85; }
          .efips-brand-subtitle { font-size:11.5px; }
          .efips-login-title { font-size:clamp(29px,8.2vw,35px);line-height:1.9; }
        }

        /* Decorative only: respects motion preferences and leaves OAuth unchanged. */
        @keyframes efips-login-enter {
          from { opacity: 0; transform: translateY(20px) scale(.96); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes efips-login-glow-keyframes {
          0%, 100% { opacity: .45; transform: scale(.95); }
          50% { opacity: .8; transform: scale(1.07); }
        }
        @keyframes efips-login-spark-keyframes {
          0%,100% { transform: rotate(-9deg) scale(.94); opacity: .75; }
          50% { transform: rotate(9deg) scale(1.12); opacity: 1; }
        }
        @keyframes efips-login-accent-keyframes {
          0%,100% { transform: scaleX(.78); opacity: .75; }
          50% { transform: scaleX(1.06); opacity: 1; }
        }
        .efips-login-title-enter { animation: efips-login-enter .8s cubic-bezier(.16,1,.3,1) both; }
        .efips-login-title {
          background: linear-gradient(110deg,#1d4ed8 5%,#047857 50%,#4338ca 96%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 5px 15px rgba(16,185,129,.15));
        }
        .efips-login-glow { animation: efips-login-glow-keyframes 6s ease-in-out infinite; }
        .efips-login-spark { animation: efips-login-spark-keyframes 4s ease-in-out infinite; }
        .efips-login-accent { animation: efips-login-accent-keyframes 4s ease-in-out infinite; }
        .efips-login-button-shine {
          background: linear-gradient(115deg,transparent 15%,rgba(255,255,255,.20) 50%,transparent 85%);
        }
        @media(prefers-reduced-motion:reduce) {
          .efips-login-title-enter,.efips-login-glow,.efips-login-spark,.efips-login-accent {
            animation:none!important;
          }
          .efips-login-title-enter { opacity:1!important; transform:none!important; filter:none!important; }
          .efips-login-button-glow,.efips-login-button-shine { transition:none!important; }
        }

      `}} />
    </div>
  );
}
