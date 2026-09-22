import React, { useState, useEffect } from 'react';

interface BookItem {
  id: number;
  title: string;
  category: string;
  dewey: string;
  color: string;
}

const BOOKS_BANK: BookItem[] = [
  { id: 1, title: "عالم الذكاء الاصطناعي والإنترنت", category: "المعارف العامة والكمبيوتر", dewey: "000", color: "#38bdf8" },
  { id: 2, title: "أسرار التفكير الإيجابي وتطوير الذات", category: "الفلسفة وعلم النفس", dewey: "100", color: "#c084fc" },
  { id: 3, title: "قصص الأنبياء وسيرة المصطفى", category: "الديانات", dewey: "200", color: "#34d399" },
  { id: 4, title: "حقوق الإنسان والقوانين المدرسية", category: "العلوم الاجتماعية", dewey: "300", color: "#fb923c" },
  { id: 5, title: "قواعد اللغة العربية وآدابها", category: "اللغات", dewey: "400", color: "#f472b6" },
  { id: 6, title: "موسوعة الفضاء والمجرات الكونية", category: "العلوم البحتة والطبيعية", dewey: "500", color: "#facc15" },
  { id: 7, title: "ابتكارات الروبوتات والطب الحديث", category: "العلوم التطبيقية والتقنية", dewey: "600", color: "#2dd4bf" },
  { id: 8, title: "فن الخط العربي والتصميم الرقمي", category: "الفنون والرياضة", dewey: "700", color: "#a78bfa" },
  { id: 9, title: "ديوان المتنبي وأشهر الروايات", category: "الآداب", dewey: "800", color: "#fb7185" },
  { id: 10, title: "تاريخ دولة الإمارات العربية المتحدة", category: "التاريخ والجغرافيا", dewey: "900", color: "#ef4444" },
];

const DEWEY_SECTIONS = [
  { code: "000", label: "000 معارف وكمبيوتر" },
  { code: "100", label: "100 فلسفة ونفس" },
  { code: "200", label: "200 ديانات" },
  { code: "300", label: "300 علوم اجتماعية" },
  { code: "400", label: "400 لغات ومعاجم" },
  { code: "500", label: "500 علوم طبيعية" },
  { code: "600", label: "600 تكنولوجيا وطب" },
  { code: "700", label: "700 فنون وترفيه" },
  { code: "800", label: "800 آداب وشعر" },
  { code: "900", label: "900 تاريخ وجغرافيا" },
];

const DeweyGame: React.FC = () => {
  const [stage, setStage] = useState<'intro' | 'orbChallenge' | 'blitz' | 'certificate'>('intro');
  const [studentName, setStudentName] = useState<string>('');
  const [studentGrade, setStudentGrade] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [falconTip, setFalconTip] = useState<string>('مرحباً بك يا بطل! أنا رفيقك صقر، هل أنت مستعد لتنظيم كرات المعرفة؟');
  const [blitzTimer, setBlitzTimer] = useState<number>(10);
  const [selectedFeedback, setSelectedFeedback] = useState<{ isCorrect: boolean; dewey: string } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 'blitz' && blitzTimer > 0) {
      timer = setTimeout(() => setBlitzTimer(t => t - 1), 1000);
    } else if (stage === 'blitz' && blitzTimer === 0) {
      handleBlitzTimeout();
    }
    return () => clearTimeout(timer);
  }, [stage, blitzTimer]);

  const handleStartGame = () => {
    if (!studentName.trim()) {
      alert("يرجى كتابة اسمك لتسجيل النتيجة وإصدار الشهادة!");
      return;
    }
    setStage('orbChallenge');
    setFalconTip(`انطلق يا ${studentName}! اختر الرف المناسب لكل كتاب يظهر أمامك.`);
  };

  const handleSelectDewey = (deweyCode: string) => {
    const currentBook = BOOKS_BANK[currentIndex];
    const isCorrect = currentBook.dewey === deweyCode;

    if (isCorrect) {
      setScore(s => s + 10);
      setFalconTip(`أحسنت صنعاً! كتاب "${currentBook.title}" يتبع بالفعل تصنيف ${deweyCode}.`);
      setSelectedFeedback({ isCorrect: true, dewey: deweyCode });
    } else {
      setFalconTip(`إجابة غير دقيقة. كتاب "${currentBook.title}" يتبع تصنيف ${currentBook.dewey}.`);
      setSelectedFeedback({ isCorrect: false, dewey: deweyCode });
    }

    setTimeout(() => {
      setSelectedFeedback(null);
      if (currentIndex + 1 < 5) {
        setCurrentIndex(i => i + 1);
      } else {
        setStage('blitz');
        setCurrentIndex(5);
        setBlitzTimer(10);
        setFalconTip('⚡ حان وقت صاعقة ديوي السريعة! أجب بسرعة قبل انتهاء الوقت!');
      }
    }, 800);
  };

  const handleBlitzAnswer = (deweyCode: string) => {
    const currentBook = BOOKS_BANK[currentIndex];
    const isCorrect = currentBook.dewey === deweyCode;

    if (isCorrect) {
      setScore(s => s + 15);
      setFalconTip('⚡ رائع! سرعة ودقة متناهية!');
    } else {
      setFalconTip(`⚡ التصنيف الصحيح كان ${currentBook.dewey}.`);
    }

    proceedNextBlitz();
  };

  const handleBlitzTimeout = () => {
    setFalconTip('⏰ انتهى الوقت لهذا السؤال!');
    proceedNextBlitz();
  };

  const proceedNextBlitz = () => {
    if (currentIndex + 1 < BOOKS_BANK.length) {
      setCurrentIndex(i => i + 1);
      setBlitzTimer(10);
    } else {
      setStage('certificate');
      setFalconTip('🎉 مبارك! لقد أتممت جميع التحديات بجدارة واستحققت وسام أمين المكتبة الذكي!');
    }
  };

  const currentBook = BOOKS_BANK[currentIndex];

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center p-4 md:p-8 text-slate-800 dark:text-slate-100">
      
      {/* شاشة البداية */}
      {stage === 'intro' && (
        <div className="w-full max-w-xl bg-white/70 dark:bg-slate-900/70 border border-white/40 dark:border-slate-700/60 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl text-center">
          <h1 className="text-2xl md:text-3xl font-black mb-3 text-amber-500">مرحباً بك في عالم ديوي 🪐</h1>
          <p className="text-sm md:text-base opacity-80 mb-6 leading-relaxed">
            ساعد الأستاذ صقر في تصنيف كرات الذاكرة المعرفية واستعادة ترتيب رفوف المكتبة الذكية!
          </p>

          <input
            type="text"
            className="w-full p-3.5 mb-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:border-amber-500 text-sm"
            placeholder="اكتب اسمك الثلاثي..."
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          <input
            type="text"
            className="w-full p-3.5 mb-6 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:border-amber-500 text-sm"
            placeholder="الصف الدراسي (مثال: الخامس A)..."
            value={studentGrade}
            onChange={(e) => setStudentGrade(e.target.value)}
          />

          <button
            onClick={handleStartGame}
            className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-lg transition-transform active:scale-95 text-base"
          >
            انطلاق التحدي 🚀
          </button>
        </div>
      )}

      {/* المرحلة الأولى: كرات الذاكرة */}
      {stage === 'orbChallenge' && (
        <div className="w-full max-w-2xl bg-white/70 dark:bg-slate-900/70 border border-white/40 dark:border-slate-700/60 backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-2xl text-center">
          <div className="text-xs md:text-sm font-bold opacity-70 mb-2">
            المرحلة 1: كرات الذاكرة (كتاب {currentIndex + 1} من 5) • النقاط: {score}
          </div>

          <div
            className="w-24 h-24 rounded-full mx-auto my-4 flex items-center justify-center text-3xl shadow-2xl transition-all duration-300"
            style={{
              backgroundColor: currentBook.color,
              boxShadow: `0 0 35px ${currentBook.color}80, inset -6px -6px 15px rgba(0,0,0,0.4)`
            }}
          >
            📖
          </div>

          <h2 className="text-lg md:text-xl font-black mb-2">{currentBook.title}</h2>
          <p className="text-xs md:text-sm opacity-80 mb-6">إلى أي قسم يتبع هذا الكتاب وفق تصنيف ديوي العشري؟</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {DEWEY_SECTIONS.map((sec) => (
              <button
                key={sec.code}
                onClick={() => handleSelectDewey(sec.code)}
                className={`p-3 text-xs md:text-sm font-bold rounded-xl border transition-all active:scale-95 ${
                  selectedFeedback?.dewey === sec.code
                    ? selectedFeedback.isCorrect
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-red-500 text-white border-red-500'
                    : 'bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-amber-500 hover:text-white'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* المرحلة الثانية: صاعقة ديوي */}
      {stage === 'blitz' && (
        <div className="w-full max-w-2xl bg-white/70 dark:bg-slate-900/70 border border-white/40 dark:border-slate-700/60 backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-2xl text-center">
          <div className="flex justify-between items-center mb-4">
            <span className="font-black text-amber-500 text-sm md:text-base">⚡ صاعقة ديوي السريعة!</span>
            <span className={`text-base md:text-lg font-black ${blitzTimer <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-slate-200'}`}>
              ⏳ {blitzTimer} ثوانٍ
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-black mb-6">{currentBook.title}</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {DEWEY_SECTIONS.map((sec) => (
              <button
                key={sec.code}
                onClick={() => handleBlitzAnswer(sec.code)}
                className="p-3 text-xs md:text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40 hover:bg-amber-500 hover:text-white transition-all active:scale-95"
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* شاشة التتويج والشهادة */}
      {stage === 'certificate' && (
        <div className="w-full max-w-xl bg-white/80 dark:bg-slate-900/80 border-2 border-amber-500 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-xl md:text-2xl font-black text-amber-500 mb-2">شهادة فخر واجتياز نظام ديوي</h1>
          <p className="text-base md:text-lg font-bold mb-1">
            تُمنح للبطل / البطلة: <span className="text-red-600 dark:text-red-400">{studentName}</span>
          </p>
          <p className="text-xs md:text-sm opacity-80 mb-4">
            الصف: {studentGrade || 'مشارك متميز'} | مجموع النقاط: <strong className="text-amber-500">{score} نقطة</strong>
          </p>
          <p className="text-xs md:text-sm leading-relaxed opacity-90 mb-6">
            تقديراً لتميزه في تصنيف فئات المعرفة وفهم أصول نظام ديوي العشري بمكتبة المدرسة بنجاح!
          </p>

          <button
            onClick={() => window.print()}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            🖨️ طباعة أو حفظ الشهادة (PDF)
          </button>
        </div>
      )}

      {/* فقاعة إرشاد صقر البصرية */}
      <aside className="fixed bottom-6 right-6 z-40 flex items-end gap-3 pointer-events-none">
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 backdrop-blur-xl p-3 md:p-4 rounded-2xl rounded-br-none shadow-xl max-w-xs text-xs md:text-sm leading-relaxed pointer-events-auto">
          {falconTip}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-2xl backdrop-blur-xl pointer-events-auto">
          🦅
        </div>
      </aside>

    </div>
  );
};

export default DeweyGame;
