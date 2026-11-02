import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/utils/supabase';
import { useLanguage } from '../App';

const BACKGROUND_VIDEOS = ['/1.mp4', '/2.mp4', '/3.mp4'];

export default function Login() {
  // Use the shared website language so public pages follow the login choice.
  const { locale: lang, setLocale: setLang } = useLanguage();
  const [schoolEmail, setSchoolEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFlag, setShowFlag] = useState(false); // حالة إظهار علم الإمارات عند الضغط على صقر

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

  // One Google login for students, teachers and administrators. The email is
  // used solely as a Google login hint; authorization happens after OAuth.
  const handleSchoolGoogleLogin = async () => {
    setError('');
    const email = schoolEmail.trim().toLowerCase();
    if (!/^[^@\s]+@falcon-school\.com$/.test(email)) {
      setError(lang === 'ar'
        ? 'أدخل البريد المدرسي الصحيح المنتهي بـ @falcon-school.com.'
        : 'Enter your approved @falcon-school.com email address.');
      return;
    }
    setLoading(true);
    try {
      sessionStorage.setItem('efips_oauth_school_email', email);
      // Reuse the existing approved student redirect URL so no Supabase
      // Auth redirect allowlist changes are needed for this release.
      await supabase.auth.signOut();
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/?efips_google_student=1',
          scopes: 'openid email profile',
          queryParams: { prompt: 'select_account', login_hint: email },
        },
      });
      if (googleError) throw googleError;
    } catch {
      try { sessionStorage.removeItem('efips_oauth_school_email'); } catch { /* restricted storage */ }
      setError(lang === 'ar'
        ? 'تعذر بدء الدخول عبر Google المدرسي. حاول مرة أخرى.'
        : 'Could not start school Google sign-in. Please retry.');
      setLoading(false);
    }
  };

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
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-slate-100/50 border-b lg:border-b-0 lg:border-l border-slate-200">
          
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
              <h2 dir="rtl" className="whitespace-nowrap text-[clamp(10px,2.3vw,14px)] font-black leading-tight tracking-tight text-slate-800 drop-shadow-sm">
                مدرسة صقر الإمارات الدولية الخاصة
              </h2>
              <h2 dir="ltr" className="whitespace-nowrap text-[clamp(9px,2.1vw,14px)] font-black leading-tight tracking-tight text-slate-800 drop-shadow-sm">
                Emirates Falcon Int'l Private School
              </h2>
            </div>
          </div>

          <div className="text-center relative z-10 mb-6">
            {/* تم تكبير عنوان مكتبة صقر الإمارات بشكل أكبر وأكثر بروزاً */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 drop-shadow-sm tracking-tight">
              {lang === 'ar' ? 'مكتبة صقر الإمارات' : 'EFIPS Library'}
            </h1>
            <p className="text-slate-700 text-xs sm:text-sm max-w-sm mx-auto font-bold leading-relaxed drop-shadow-sm">
              {lang === 'ar' 
                ? 'اكتشف عالماً من المعرفة، العب، وتعلم مع مساعدك الذكي "صقر"' 
                : 'Discover a world of knowledge, play, and learn with Saqr!'}
            </p>
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
        <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white relative z-10">
          <div className="mb-6 text-center lg:text-start">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm font-bold">
              {lang === 'ar' ? 'نقطة دخول واحدة للطلاب والمعلمين والإدارة. سيتم تحديد حسابك تلقائيًا بعد التحقق.' : 'One sign-in for students, staff and administrators. Your approved role is identified automatically.'}
            </p>
          </div>

          {/* Unified Google-only school login. No role switch or unverified email lookup. */}
          <form className="space-y-5 animate-fade-in" onSubmit={e => { e.preventDefault(); void handleSchoolGoogleLogin(); }}>
            <p className="text-center text-sm font-bold text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'اكتب بريدك المدرسي، ثم أثبت ملكيته عبر Google. ستظهر بياناتك وصلاحياتك المسجلة تلقائيًا.'
                : 'Enter your school email and verify it with Google. Your registered name and permissions are loaded automatically.'}
            </p>
            <div>
              <label htmlFor="efips-school-email" className="block mb-2 text-sm font-black text-slate-700">
                {lang === 'ar' ? 'البريد الإلكتروني المدرسي' : 'School email address'}
              </label>
              <input
                id="efips-school-email"
                type="email"
                name="school-email"
                dir="ltr"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                inputMode="email"
                placeholder="name@falcon-school.com"
                value={schoolEmail}
                onChange={event => { setSchoolEmail(event.target.value); if (error) setError(''); }}
                required
                disabled={loading}
                className="w-full min-h-14 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-bold text-left outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
              />
            </div>
            {error && <div role="alert" className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-3 rounded-2xl text-xs md:text-sm font-bold text-center">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-14 flex items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 px-4 py-4 text-white text-sm md:text-base font-black shadow-lg transition-all disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <svg width="24" height="24" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.3 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.3 13.8 17.7 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.1 24.5c0-1.6-.2-3.2-.5-4.7H24v8.9h12.4c-.5 2.9-2.1 5.4-4.5 7.1l7.3 5.7c4.3-4 6.9-9.8 6.9-17z"/>
                <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.7l7.9-6.1z"/>
                <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-6l-7.3-5.7c-2 1.4-4.7 2.2-8.7 2.2-6.3 0-11.7-4.3-13.5-10.2l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
              </svg>
              {loading
                ? (lang === 'ar' ? 'جارٍ الانتقال إلى Google...' : 'Connecting to Google...')
                : (lang === 'ar' ? 'متابعة الدخول بحساب Google' : 'Continue with Google')}
            </button>
            <p className="text-center text-xs font-semibold text-slate-500 leading-relaxed">
              {lang === 'ar'
                ? 'يُحدد النظام هل أنت طالب أو معلم أو مدير من السجل المدرسي، وليس من البريد المكتوب وحده.'
                : 'Your role is verified against the school records, not assigned from the typed address.'}
            </p>
            <div className="text-center pt-2">
              <Link to="/about" className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all">
                {lang === 'ar' ? 'عن مدرسة صقر الإمارات الدولية الخاصة' : 'More About EFIPS'}
              </Link>
            </div>
          </form>

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
      `}} />
    </div>
  );
}
