import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/utils/supabase';
import { useLanguage } from '../App';
import { startGoogleStudentSignIn, completeGoogleStudentSignIn } from '../src/utils/googleStudentAuth';

// أيقونات مبسطة وخفيفة للـ Light Mode
const StudentIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" /></svg>;
const TeacherIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

const BACKGROUND_VIDEOS = ['/1.mp4', '/2.mp4', '/3.mp4'];

export default function Login() {
  // Use the shared website language so public pages follow the login choice.
  const { locale: lang, setLocale: setLang } = useLanguage();
  const [loginType, setLoginType] = useState<'student' | 'teacher'>('student');
  const [teacherId, setTeacherId] = useState('');
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

  const handleStudentGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await startGoogleStudentSignIn();
    } catch {
      setError(lang === 'ar' ? 'تعذر الاتصال بحساب Google المدرسي.' : 'School Google sign-in could not start.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('efips_student_google')) return;
    let active = true;
    const finish = async () => {
      setLoading(true);
      try {
        const student = await completeGoogleStudentSignIn();
        if (!active || !student) return;
        localStorage.setItem('user_type', 'student');
        localStorage.setItem('current_user', JSON.stringify(student));
        window.history.replaceState(null, '', window.location.pathname + '#/home');
        window.location.reload();
      } catch {
        await supabase.auth.signOut();
        if (active) {
          setError(lang === 'ar' ? 'تعذر التحقق من حساب الطالب المدرسي. تأكد من حساب Google المستخدم.' : 'School Google student verification failed.');
          setLoading(false);
          window.history.replaceState(null, '', window.location.pathname + '#/');
        }
      }
    };
    void finish();
    return () => { active = false; };
  }, []);

  // دالة تسجيل دخول المعلمين والأدمن
  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId.trim()) return;

    setLoading(true);
    setError('');

    try {
      const tId = teacherId.trim().toUpperCase();

      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('teacher_id', tId)
        .single();

      if (error || !data) {
        setError(lang === 'ar' ? 'الرقم الوظيفي غير صحيح.' : 'Invalid Teacher ID.');
        setLoading(false);
        return;
      }

      const isAdmin = data.teacher_id === 'HR785';

      localStorage.setItem('user_type', isAdmin ? 'admin' : 'teacher'); 
      localStorage.setItem('current_user', JSON.stringify(data));
      window.location.href = '#/home';
      await supabase.from('login_logs').insert([{ user_id: tId, user_type: isAdmin ? 'admin' : 'teacher' }]);
      
    } catch (err) {
      setError(lang === 'ar' ? 'حدث خطأ في الاتصال بقاعدة البيانات.' : 'Database connection error.');
    } finally {
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
              {lang === 'ar' ? 'مرحباً بعودتك! يرجى اختيار نوع الحساب.' : 'Welcome back! Please choose account type.'}
            </p>
          </div>

          {/* أزرار التبديل */}
          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] mb-8 border border-slate-200">
            <button
              onClick={() => { setLoginType('student'); setError('');  }}
              className={`flex-1 py-3 px-2 text-xs sm:text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
                loginType === 'student' 
                ? 'bg-white text-blue-600 shadow-md border border-slate-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <StudentIcon /> {lang === 'ar' ? 'بوابة الطلاب' : 'Students'}
            </button>
            <button
              onClick={() => { setLoginType('teacher'); setError(''); setTeacherId(''); }}
              className={`flex-1 py-3 px-2 text-xs sm:text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
                loginType === 'teacher' 
                ? 'bg-white text-indigo-600 shadow-md border border-slate-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <TeacherIcon /> {lang === 'ar' ? 'بوابة المعلمين' : 'Teachers'}
            </button>
          </div>

          {/* فورم الطلاب */}
          {loginType === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-5 animate-fade-in">
              <div className="space-y-2 text-start">
                <label className="block text-xs md:text-sm font-black text-slate-600 px-1">
                  {lang === 'ar' ? 'رقم الطالب (Student ID)' : 'Student ID'}
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل رقمك المكون من 6 أو 7 أرقام' : 'Enter 6 or 7 digits ID'}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-mono text-base md:text-lg tracking-widest text-center shadow-inner"
                  required
                />
              </div>

              {error && (
                <div className="bg-rose-50 border-2 border-rose-200 text-rose-600 p-3 rounded-2xl text-xs md:text-sm font-bold text-center animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-black rounded-[1.5rem] transition-all duration-300 shadow-md hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70 text-sm md:text-base border-b-4 border-blue-700 active:border-b-0"
              >
                {loading ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (lang === 'ar' ? 'دخول للمكتبة' : 'Enter Library')}
              </button>

              {/* الرابط المطلوب إضافته تحت زر الدخول للمكتبة */}
              <div className="text-center pt-2">
                <Link to="/about" className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all">
                  {lang === 'ar' ? 'عن مدرسة صقر الإمارات الدولية الخاصة' : 'More About EFIPS'}
                </Link>
              </div>
            </form>
          ) : (
            /* فورم المعلمين */
            <form onSubmit={handleTeacherLogin} className="space-y-5 animate-fade-in">
              <div className="space-y-2 text-start">
                <label className="block text-xs md:text-sm font-black text-slate-600 px-1">
                  {lang === 'ar' ? 'الرقم الوظيفي للمعلم (EFIPS ID)' : 'Teacher EFIPS ID'}
                </label>

                <input
                  type="text"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  placeholder="HRXXXXX"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-mono text-base md:text-lg tracking-widest text-center uppercase shadow-inner"
                  required
                />
              </div>

              {error && (
                <div className="bg-rose-50 border-2 border-rose-200 text-rose-600 p-3 rounded-2xl text-xs md:text-sm font-bold text-center animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-black rounded-[1.5rem] transition-all duration-300 shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70 text-sm md:text-base border-b-4 border-indigo-700 active:border-b-0"
              >
                {loading ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (lang === 'ar' ? 'دخول المعلم' : 'Teacher Login')}
              </button>

              {/* الرابط المطلوب إضافته تحت زر الدخول للمكتبة */}
              <div className="text-center pt-2">
                <Link to="/about" className="text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-all">
                  {lang === 'ar' ? 'عن مدرسة صقر الإمارات الدولية الخاصة' : 'More About EFIPS'}
                </Link>
              </div>
            </form>
          )}

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
