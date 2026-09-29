import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// إعداد اتصال Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Login({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const [loginType, setLoginType] = useState<'student' | 'teacher'>('student');
  const [studentId, setStudentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        window.location.href = '/home'; 
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
    if (!teacherId.trim() || !password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const tId = teacherId.trim().toUpperCase(); // تحويل الحروف لكبيرة لضمان التطابق مع قاعدة البيانات

      // البحث عن المعلم في قاعدة البيانات
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

      // 🔐 نظام التحقق من كلمة المرور (مدرس عادي = pass | أدمن = PASS254177)
      const isAdmin = data.teacher_id === 'PASS254177';
      const correctPassword = isAdmin ? 'PASS254177' : 'pass';

      if (password !== correctPassword) {
        setError(lang === 'ar' ? 'كلمة المرور غير صحيحة.' : 'Incorrect password.');
        setLoading(false);
        return;
      }

      // تم الدخول بنجاح!
      localStorage.setItem('user_type', isAdmin ? 'admin' : 'teacher'); // حفظ صلاحية الأدمن
      localStorage.setItem('current_user', JSON.stringify(data));
      window.location.href = '/home';
      
    } catch (err) {
      setError(lang === 'ar' ? 'حدث خطأ في الاتصال بقاعدة البيانات.' : 'Database connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#0f172a] bg-[url('/bg-pattern.svg')] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-blue-500 selection:text-white" 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl w-full bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* ================= القسم الأول: الهوية البصرية وصقر ================= */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border-b lg:border-b-0 lg:border-l border-slate-700/50">
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px]"></div>
          </div>

          <div className="flex items-center justify-center w-full gap-3 md:gap-6 mb-10">
            <div className="flex-1 text-left">
              <h2 className="text-white font-bold text-xs sm:text-sm md:text-base leading-snug drop-shadow-md">
                مدرسة صقر الإمارات<br className="hidden sm:block"/> الدولية الخاصة
              </h2>
            </div>
            
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-500"></div>
              <img 
                src="/school-logo.png" 
                alt="School Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain relative z-10 drop-shadow-xl"
              />
            </div>

            <div className="flex-1 text-right" dir="ltr">
              <h2 className="text-white font-bold text-xs sm:text-sm md:text-base leading-snug drop-shadow-md">
                Emirates Falcon Int'l<br className="hidden sm:block"/> Private School
              </h2>
            </div>
          </div>

          <div className="text-center z-10 mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-4 drop-shadow-sm">
              {lang === 'ar' ? 'المكتبة الذكية' : 'Smart Library'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-sm mx-auto font-medium">
              {lang === 'ar' 
                ? 'اكتشف عالماً من المعرفة، العب، وتعلم مع مساعدك الذكي "صقر"' 
                : 'Discover a world of knowledge, play, and learn with Saqr!'}
            </p>
          </div>

          <div className="relative mt-4 mb-4 lg:mb-0 w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            <div className="absolute w-3/4 h-3/4 bg-blue-500/40 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 w-4/5 h-8 bg-blue-400/20 rounded-[100%] blur-md"></div>
            <img 
              src="/saqr-full.png" 
              alt="صقر المساعد الذكي" 
              className="w-full h-full object-contain relative z-10 animate-float drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
          </div>
        </div>

        {/* ================= القسم الثاني: نموذج تسجيل الدخول ================= */}
        <div className="lg:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-slate-800/80">
          <div className="mb-8 text-center lg:text-start">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {lang === 'ar' ? 'مرحباً بعودتك! اختر نوع حسابك للمتابعة.' : 'Welcome back! Choose your account type.'}
            </p>
          </div>

          {/* أزرار التبديل */}
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-slate-700/50">
            <button
              onClick={() => { setLoginType('student'); setError(''); setPassword(''); }}
              className={`flex-1 py-3.5 px-2 text-sm sm:text-base font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                loginType === 'student' 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              🎓 {lang === 'ar' ? 'دخول الطلاب' : 'Students'}
            </button>
            <button
              onClick={() => { setLoginType('teacher'); setError(''); setStudentId(''); }}
              className={`flex-1 py-3.5 px-2 text-sm sm:text-base font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                loginType === 'teacher' 
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              👨‍🏫 {lang === 'ar' ? 'دخول المعلمين' : 'Teachers'}
            </button>
          </div>

          {/* فورم الطلاب */}
          {loginType === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  {lang === 'ar' ? 'رقم الطالب (Student ID)' : 'Student ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-xl">🆔</span>
                  </div>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder={lang === 'ar' ? 'أدخل رقمك المكون من 6 أو 7 أرقام' : 'Enter your 6-7 digit ID'}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-slate-500 font-mono text-lg tracking-widest text-center"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center animate-pulse">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/50 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 text-lg"
              >
                {loading ? (
                  <span className="animate-pulse">{lang === 'ar' ? 'جاري التحقق من الهوية...' : 'Verifying...'}</span>
                ) : (
                  <><span>{lang === 'ar' ? 'دخول للمكتبة' : 'Enter Library'}</span> 🚀</>
                )}
              </button>
            </form>
          ) : (
            /* فورم المعلمين (يحتوي على ID وباسورد) */
            <form onSubmit={handleTeacherLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  {lang === 'ar' ? 'الرقم الوظيفي للمعلم (Teacher ID)' : 'Teacher ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-xl">👨‍🏫</span>
                  </div>
                  <input
                    type="text"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="PASSXXXXX"
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white placeholder-slate-500 font-mono text-lg tracking-widest text-center uppercase"
                    required
                  />
                </div>
              </div>

              {/* حقل كلمة المرور الجديد */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  {lang === 'ar' ? 'كلمة المرور (Password)' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-xl">🔒</span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={lang === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white placeholder-slate-500 text-center text-lg tracking-widest"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center animate-pulse">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-900/50 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 text-lg"
              >
                {loading ? (
                  <span className="animate-pulse">{lang === 'ar' ? 'جاري التحقق من الهوية...' : 'Verifying...'}</span>
                ) : (
                  <><span>{lang === 'ar' ? 'دخول المعلم' : 'Teacher Login'}</span> ✨</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
