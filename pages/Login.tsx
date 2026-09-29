import React, { useState } from 'react';
import { supabase } from '../src/utils/supabase';

const StudentIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" /></svg>;
const TeacherIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

export default function Login() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [loginType, setLoginType] = useState<'student' | 'teacher'>('student');
  const [studentId, setStudentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // دالة تسجيل دخول الطلاب (بحث ذكي ومرن)
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = studentId.trim();
    if (!cleanId) return;

    setLoading(true);
    setError('');

    try {
      console.log("جاري البحث عن رقم الطالب:", cleanId);

      // محاولة البحث بالعامود student_id (كـ نص)
      let { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', cleanId)
        .limit(1);

      // إذا لم يتم العثور عليه، نجرب البحث كـ رقم (integer) أو بعامود id
      if (!data || data.length === 0) {
        const numId = Number(cleanId);
        if (!isNaN(numId)) {
          const res = await supabase
            .from('students')
            .select('*')
            .eq('student_id', numId)
            .limit(1);
          data = res.data;
          error = res.error;
        }
      }

      // محاولة أخيرة بالعامود البديل id إذا وجد
      if (!data || data.length === 0) {
        const res = await supabase
          .from('students')
          .select('*')
          .eq('id', cleanId)
          .limit(1);
        data = res.data;
        error = res.error;
      }

      console.log("نتيجة بحث الطالب النهائية:", { data, error });

      if (error || !data || data.length === 0) {
        setError(lang === 'ar' ? 'رقم الطالب غير موجود في قاعدة البيانات.' : 'Student ID not found.');
      } else {
        const studentRecord = data[0];
        localStorage.setItem('user_type', 'student');
        localStorage.setItem('current_user', JSON.stringify(studentRecord));
        window.location.href = '#/home'; 
      }
    } catch (err) {
      console.error("خطأ غير متوقع:", err);
      setError(lang === 'ar' ? 'حدث خطأ في الاتصال بقاعدة البيانات.' : 'Database connection error.');
    } finally {
      setLoading(false);
    }
  };

  // دالة تسجيل دخول المعلمين
  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = teacherId.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setError('');

    try {
      console.log("جاري البحث عن الرقم الوظيفي للمعلم:", cleanId);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('teacher_id', cleanId)
        .maybeSingle();

      console.log("نتيجة بحث المعلم:", { data, error });

      if (error || !data) {
        setError(lang === 'ar' ? 'الرقم الوظيفي غير موجود في قاعدة البيانات.' : 'Teacher ID not found.');
        setLoading(false);
        return;
      }

      const isAdmin = data.teacher_id === 'PASS254177';

      localStorage.setItem('user_type', isAdmin ? 'admin' : 'teacher'); 
      localStorage.setItem('current_user', JSON.stringify(data));
      window.location.href = '#/home';
      
    } catch (err) {
      console.error("خطأ غير متوقع:", err);
      setError(lang === 'ar' ? 'حدث خطأ في الاتصال بقاعدة البيانات.' : 'Database connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-[100dvh] bg-[#f0f4f8] bg-[url('/bg-pattern-light.svg')] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-500 relative" 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex items-center gap-2 z-50`}>
          <button onClick={() => setLang('ar')} className={`px-4 py-1.5 rounded-full font-bold text-xs md:text-sm border-2 transition-all ${lang === 'ar' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400'}`}>العربية</button>
          <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-full font-bold text-xs md:text-sm border-2 transition-all ${lang === 'en' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'}`}>English</button>
      </div>

      <div className="max-w-5xl w-full bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row z-10">
        
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-slate-100/50 border-b lg:border-b-0 lg:border-l border-slate-200">
          <div className="text-center z-10 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
              {lang === 'ar' ? 'المكتبة الذكية' : 'Smart Library'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto font-bold leading-relaxed">
              {lang === 'ar' ? 'مدرسة صقر الإمارات الدولية الخاصة' : 'Emirates Falcon Int. Private School'}
            </p>
          </div>
          <div className="relative mt-2 w-40 h-40 sm:w-56 sm:h-56 flex items-center justify-center">
            <img src="/saqr-full.png" alt="صقر" className="w-full h-full object-contain relative z-10 animate-float" />
          </div>
        </div>

        <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-6 text-center lg:text-start">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </h2>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] mb-8 border border-slate-200">
            <button
              onClick={() => { setLoginType('student'); setError(''); setStudentId(''); }}
              className={`flex-1 py-3 px-2 text-xs sm:text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                loginType === 'student' ? 'bg-white text-blue-600 shadow-md border border-slate-200' : 'text-slate-500'
              }`}
            >
              <StudentIcon /> {lang === 'ar' ? 'بوابة الطلاب' : 'Students'}
            </button>
            <button
              onClick={() => { setLoginType('teacher'); setError(''); setTeacherId(''); }}
              className={`flex-1 py-3 px-2 text-xs sm:text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                loginType === 'teacher' ? 'bg-white text-indigo-600 shadow-md border border-slate-200' : 'text-slate-500'
              }`}
            >
              <TeacherIcon /> {lang === 'ar' ? 'بوابة المعلمين' : 'Teachers'}
            </button>
          </div>

          {loginType === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-5">
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخل رقم الطالب' : 'Enter Student ID'}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] text-slate-800 font-mono text-center shadow-inner text-lg font-bold"
                required
              />
              {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-2xl text-xs font-bold text-center">{error}</div>}
              <button type="submit" disabled={loading} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-[1.5rem] shadow-md transition-all">
                {loading ? '...' : (lang === 'ar' ? 'دخول' : 'Login')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTeacherLogin} className="space-y-5">
              <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="PASSXXXXX"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] text-slate-800 font-mono text-center uppercase shadow-inner text-lg font-bold"
                required
              />
              {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-2xl text-xs font-bold text-center">{error}</div>}
              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-md transition-all">
                {loading ? '...' : (lang === 'ar' ? 'دخول المعلم' : 'Teacher Login')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
