import React, { useState } from 'react';
import { supabase } from '../src/utils/supabase';

// أيقونات مبسطة وخفيفة للـ Light Mode
const StudentIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" /></svg>;
const TeacherIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

export default function Login() {
  // اللغة الافتراضية أصبحت الإنجليزية ('en')
  const [lang, setLang] = useState<'ar' | 'en'>('en');
  const [loginType, setLoginType] = useState<'student' | 'teacher'>('student');
  const [studentId, setStudentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFlag, setShowFlag] = useState(false); // حالة إظهار علم الإمارات عند الضغط على صقر

  // دالة تسجيل دخول الطلاب
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId.trim())
        .single();

      if (error || !data) {
        setError(lang === 'ar' ? 'رقم الطالب غير صحيح، يرجى المحاولة مرة أخرى.' : 'Invalid Student ID.');
      } else {
        localStorage.setItem('user_type', 'student');
        localStorage.setItem('current_user', JSON.stringify(data));
        window.location.href = '#/home'; 
        await supabase.from('login_logs').insert([{ user_id: studentId.trim(), user_type: 'student' }]);
      }
    } catch (err) {
      setError(lang === 'ar' ? 'حدث خطأ في الاتصال بقاعدة البيانات.' : 'Database connection error.');
    } finally {
      setLoading(false);
    }
  };

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

      const isAdmin = data.teacher_id === 'PASS254177';

      localStorage.setItem('user_type', isAdmin ? 'admin' : 'teacher'); 
      localStorage.setItem('current_user', JSON.stringify(data));
      window.location.href = '#/home';
      
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
        
        {/* ================= القسم الأول: الهوية البصرية وصقر ================= */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-slate-100/50 border-b lg:border-b-0 lg:border-l border-slate-200">
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-[80px] animate-pulse-slow"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-[80px] animate-pulse-slow"></div>
          </div>

          <div className="flex items-center justify-center w-full gap-3 md:gap-5 mb-8">
            <div className="flex-1 text-left">
              <h2 className="text-slate-800 font-black text-[10px] sm:text-xs md:text-sm leading-snug">
                مدرسة صقر الإمارات<br className="hidden sm:block"/> الدولية الخاصة
              </h2>
            </div>
            
            {/* تم إمالة شعار المدرسة بحدود 30 درجة لليمين */}
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl group-hover:bg-blue-200 transition-all duration-500 -z-10"></div>
              <img 
                src="/school-logo.png" 
                alt="School Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain relative z-10 rotate-[30deg] transition-transform duration-500 group-hover:rotate-[38deg]"
              />
            </div>

            <div className="flex-1 text-right" dir="ltr">
              <h2 className="text-slate-800 font-black text-[10px] sm:text-xs md:text-sm leading-snug">
                Emirates Falcon Int'l<br className="hidden sm:block"/> Private School
              </h2>
            </div>
          </div>

          <div className="text-center z-10 mb-6">
            {/* تم تكبير عنوان المكتبة الذكية بشكل أكبر وأكثر بروزاً */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 drop-shadow-sm tracking-tight">
              {lang === 'ar' ? 'المكتبة الذكية' : 'Smart Library'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto font-bold leading-relaxed">
              {lang === 'ar' 
                ? 'اكتشف عالماً من المعرفة، العب، وتعلم مع مساعدك الذكي "صقر"' 
                : 'Discover a world of knowledge, play, and learn with Saqr!'}
            </p>
          </div>

          {/* شخصية صقر التفاعلية مع ظهور علم الإمارات عند الضغط */}
          <div onClick={handleSaqrClick} className="relative mt-2 mb-2 lg:mb-0 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center cursor-pointer group">
            <div className="absolute bottom-0 w-3/4 h-6 bg-slate-300/40 rounded-[100%] blur-md"></div>
            
            {showFlag && (
              <div className="absolute -top-10 z-30 animate-bounce bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border-2 border-emerald-500 flex items-center gap-2">
                <span className="text-2xl">🇦🇪</span>
                <span className="font-black text-xs text-slate-800">{lang === 'ar' ? 'الإمارات العظمى' : 'Proud UAE'}</span>
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
        <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white relative">
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
              onClick={() => { setLoginType('student'); setError(''); setStudentId(''); }}
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
            </form>
          ) : (
            /* فورم المعلمين */
            <form onSubmit={handleTeacherLogin} className="space-y-5 animate-fade-in">
              <div className="space-y-2 text-start">
                <label className="block text-xs md:text-sm font-black text-slate-600 px-1">
                  {lang === 'ar' ? 'الرقم الوظيفي للمعلم (ADEK ID)' : 'Teacher ADEK ID'}
                </label>
                
                <div className={`text-[10px] md:text-xs font-bold text-indigo-600 mb-2 px-1 flex items-start gap-1`}>
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{lang === 'ar' ? 'تلميح: الرقم الوظيفي الخاص بك يبدأ دائماً بكلمة PASS متبوعاً بالأرقام.' : 'Hint: Your official ID always starts with PASS followed by numbers.'}</span>
                </div>

                <input
                  type="text"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  placeholder="PASSXXXXX"
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
            </form>
          )}
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
