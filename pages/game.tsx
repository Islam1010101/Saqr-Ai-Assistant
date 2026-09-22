import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ==========================================
// 1. البيانات وبنوك الأسئلة (تم التوسيع الشامل)
// ==========================================

const DEWEY_CATEGORIES = [
  { code: "000", label: "000 حاسب ومعارف عامة", color: "bg-cyan-500" },
  { code: "100", label: "100 تفكير وتطوير الذات", color: "bg-purple-500" },
  { code: "200", label: "200 ديانات وأخلاق", color: "bg-emerald-500" },
  { code: "300", label: "300 مجتمع وقوانين", color: "bg-orange-500" },
  { code: "400", label: "400 لغات ومعاجم", color: "bg-pink-500" },
  { code: "500", label: "500 علوم طبيعية وفضاء", color: "bg-yellow-500" },
  { code: "600", label: "600 طب وتكنولوجيا", color: "bg-teal-500" },
  { code: "700", label: "700 فنون ورياضة", color: "bg-indigo-500" },
  { code: "800", label: "800 قصص وروايات", color: "bg-rose-500" },
  { code: "900", label: "900 تاريخ وجغرافيا", color: "bg-red-500" }
];

// تحدي 1: مساعد المكتبة (سيناريوهات موسعة)
const BANK_ASSISTANT = [
  { text: "دخل أحمد يبحث عن معلومات حول الكواكب والمجموعة الشمسية، لأي قسم نوجهه؟", answer: "500" },
  { text: "مريم تبحث عن قاموس لتعلم كلمات اللغة الإنجليزية الجديدة.", answer: "400" },
  { text: "عمر يطلب كتاباً يحكي قصص الأنبياء وسيرة الرسول.", answer: "200" },
  { text: "سارة تريد كتاباً يعلمها كيفية رسم شخصيات الأنمي وتلوينها.", answer: "700" },
  { text: "خالد يبحث عن كتاب يشرح تاريخ دولة الإمارات قديماً.", answer: "900" },
  { text: "فاطمة تريد تعلم البرمجة وصناعة المواقع الإلكترونية.", answer: "000" },
  { text: "يوسف مريض ويبحث عن كتاب حول الفيتامينات وكيف يعمل جسم الإنسان.", answer: "600" },
  { text: "علي يبحث عن ديوان شعر ليقرأه في الإذاعة المدرسية.", answer: "800" },
  { text: "هدى تريد معرفة القوانين وحقوق الطفل في المجتمع.", answer: "300" },
  { text: "ماجد يبحث عن كتاب يقرأه لتطوير تفكيره ومهاراته الشخصية وتقوية ثقته بنفسه.", answer: "100" },
  { text: "لجين تريد قراءة حكايات شعبية من التراث الإماراتي القديم.", answer: "300" },
  { text: "ياسين يحتاج لكتاب يشرح له كيفية أداء الصلاة وأحكام التجويد.", answer: "200" },
  { text: "سلمى تحب الديناصورات وتبحث عن كتاب يضم صوراً ومعلومات عنها.", answer: "500" },
  { text: "طارق يريد تعلم كيفية طهي البيتزا وإعداد الحلويات.", answer: "600" },
  { text: "مروان يبحث عن كتاب يضم موسوعة غينيس للأرقام القياسية.", answer: "000" },
  { text: "نورة تريد قراءة قصة خيالية عن أميرة تعيش في قلعة مسحورة.", answer: "800" },
  { text: "سيف يهتم بكرة القدم ويريد كتاباً يشرح قوانين كأس العالم.", answer: "700" },
  { text: "ريم تبحث عن خريطة لقارة آسيا ومعلومات عن عواصم العالم.", answer: "900" },
  { text: "راشد يواجه صعوبة في النحو ويريد كتاباً يشرح قواعد اللغة العربية.", answer: "400" },
  { text: "ليلى تبحث عن كتاب يشرح كيف يعمل العقل البشري ولماذا نحلم.", answer: "100" }
];

// تحدي 2: كرات المكتبة (عناوين كتب موسعة)
const BANK_ORBS = [
  { text: "كتاب 'أسرار البرمجة بلغة بايثون'", answer: "000" },
  { text: "كتاب 'كيف تتحكم في غضبك وتصبح إيجابياً'", answer: "100" },
  { text: "كتاب 'أركان الإسلام والإيمان'", answer: "200" },
  { text: "كتاب 'وظائف الشرطة ودورها في المجتمع'", answer: "300" },
  { text: "كتاب 'القواعد الذهبية في النحو العربي'", answer: "400" },
  { text: "كتاب 'موسوعة الحيوانات المفترسة'", answer: "500" },
  { text: "كتاب 'كيف تصنع روبوتاً في المنزل'", answer: "600" },
  { text: "كتاب 'قوانين كرة القدم وتاريخ كأس العالم'", answer: "700" },
  { text: "كتاب 'رواية البؤساء'", answer: "800" },
  { text: "كتاب 'أطلس العالم وخريطة قارة أوروبا'", answer: "900" },
  { text: "كتاب 'موسوعة المعارف للناشئين'", answer: "000" },
  { text: "كتاب 'الخداع البصري وأسرار التركيز'", answer: "100" },
  { text: "كتاب 'تفسير جزء عم للأطفال'", answer: "200" },
  { text: "كتاب 'الاقتصاد والتجارة ببساطة'", answer: "300" },
  { text: "كتاب 'كيف تتحدث اليابانية في 10 أيام'", answer: "400" },
  { text: "كتاب 'الطقس والمناخ ولماذا تمطر؟'", answer: "500" },
  { text: "كتاب 'عالم السيارات والطائرات'", answer: "600" },
  { text: "كتاب 'تعلم العزف على البيانو'", answer: "700" },
  { text: "كتاب 'حكايات كليلة ودمنة'", answer: "800" },
  { text: "كتاب 'سيرة الشيخ زايد رحمه الله'", answer: "900" }
];

// تحدي 3: رفوف ديوي (موسعة: اختيار الكتاب المناسب للرف)
const BANK_SHELVES = [
  { shelf: "500 علوم طبيعية", correct: "عالم البحار والمحيطات", wrongs: ["تاريخ الأندلس", "كيف ترسم شجرة", "قواعد الإملاء"] },
  { shelf: "700 فنون ورياضة", correct: "أبطال السباحة الأولمبية", wrongs: ["جسم الإنسان والأمراض", "الذكاء الاصطناعي", "قصة سندريلا"] },
  { shelf: "900 تاريخ وجغرافيا", correct: "حضارة الفراعنة", wrongs: ["تعلم الإسبانية", "أخلاق المسلم", "موسوعة الطيور"] },
  { shelf: "600 طب وتكنولوجيا", correct: "كيف تعمل السيارات الذكية", wrongs: ["ديوان المتنبي", "خريطة أوروبا", "حقوق الإنسان"] },
  { shelf: "800 قصص وروايات", correct: "مغامرات أليس في بلاد العجائب", wrongs: ["لغات البرمجة", "تفسير القرآن", "الجاذبية الأرضية"] },
  { shelf: "200 ديانات", correct: "أخلاق المصطفى", wrongs: ["عواصم العالم", "صناعة الأدوية", "كيف تلعب الشطرنج"] },
  { shelf: "000 حاسب ومعارف", correct: "موسوعة الإنترنت الآمن", wrongs: ["تاريخ الدولة الأموية", "تعلم السباحة", "قصص جحا"] },
  { shelf: "100 تفكير وتطوير الذات", correct: "قوة التركيز والذاكرة", wrongs: ["مباريات كأس آسيا", "أشعار عنترة بن شداد", "كيف تعمل الثلاجة"] },
  { shelf: "300 مجتمع وقوانين", correct: "حكايات شعبية من التراث", wrongs: ["الفضاء السحيق", "أحكام التجويد", "الطباعة ثلاثية الأبعاد"] },
  { shelf: "400 لغات ومعاجم", correct: "قاموس أكسفورد المصور", wrongs: ["حرب أكتوبر", "كيف تصنع كيكة", "فن النحت بالصلصال"] },
  { shelf: "900 تاريخ وجغرافيا", correct: "أطلس خرائط العالم", wrongs: ["علم النفس التربوي", "قاموس عربي-إنجليزي", "شخصيات خيالية"] },
  { shelf: "600 طب وتكنولوجيا", correct: "دليل الإسعافات الأولية", wrongs: ["ألعاب الخفة", "قواعد اللغة الفرنسية", "تاريخ الإسلام في الهند"] },
  { shelf: "500 علوم طبيعية", correct: "الجدول الدوري وعلم الكيمياء", wrongs: ["فن الخط العربي", "قصة بيتر بان", "العملات الرقمية"] },
  { shelf: "200 ديانات", correct: "قصص القرآن الكريم", wrongs: ["كيف تبني روبوتا", "الفن الإسلامي (رسم)", "موسوعة الزواحف"] }
];

// دالة خلط المصفوفات العشوائية
const shuffleArray = (array: any[]) => [...array].sort(() => 0.5 - Math.random());

// ==========================================
// 2. المكون الرئيسي للعبة
// ==========================================

const DeweyGame: React.FC = () => {
  const [stage, setStage] = useState<'intro' | 'learn' | 'challenge1' | 'challenge2' | 'challenge3' | 'certificate'>('intro');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0); 
  const [questionTimer, setQuestionTimer] = useState(20);
  
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // حساب الوقت الإجمالي
  useEffect(() => {
    let interval: any;
    if (stage.startsWith('challenge')) {
      interval = setInterval(() => setTotalTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // مؤقت السؤال الفردي
  useEffect(() => {
    let interval: any;
    if (stage.startsWith('challenge') && questionTimer > 0 && !feedback) {
      interval = setInterval(() => setQuestionTimer(t => t - 1), 1000);
    } else if (questionTimer === 0 && !feedback) {
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [stage, questionTimer, feedback]);

  const handleStart = () => {
    if (!studentName.trim() || !studentGrade.trim()) {
      alert("الرجاء إدخال اسمك وصفك الدراسي لنتمكن من إصدار الشهادة المعتمدة!");
      return;
    }
    setStage('learn');
  };

  const startChallenge1 = () => {
    setCurrentQuestions(shuffleArray(BANK_ASSISTANT).slice(0, 5));
    setQIndex(0);
    setQuestionTimer(20);
    setStage('challenge1');
  };

  const startChallenge2 = () => {
    setCurrentQuestions(shuffleArray(BANK_ORBS).slice(0, 5));
    setQIndex(0);
    setQuestionTimer(20);
    setStage('challenge2');
  };

  const startChallenge3 = () => {
    const mixed = shuffleArray(BANK_SHELVES).slice(0, 5).map(q => ({
      ...q,
      options: shuffleArray([q.correct, ...q.wrongs])
    }));
    setCurrentQuestions(mixed);
    setQIndex(0);
    setQuestionTimer(20);
    setStage('challenge3');
  };

  const handleTimeout = () => {
    setFeedback('wrong');
    setTimeout(() => nextQuestion(), 1500);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (feedback) return; 
    if (isCorrect) {
      setScore(s => s + 20); 
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => nextQuestion(), 1500);
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (qIndex < 4) {
      setQIndex(i => i + 1);
      setQuestionTimer(20);
    } else {
      if (stage === 'challenge1') startChallenge2();
      else if (stage === 'challenge2') startChallenge3();
      else setStage('certificate');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m > 0 ? m + ' دقيقة و ' : ''}${s} ثانية`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* ستايل الطباعة للشهادة فقط */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-area, #certificate-area * { visibility: visible; }
          #certificate-area { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: #fff !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* 1. شاشة البداية */}
      {stage === 'intro' && (
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center animate-fade-in-up relative z-10">
          <div className="text-6xl mb-4 animate-bounce">🪐</div>
          <h1 className="text-3xl font-black text-amber-500 mb-2">تحدي تصنيف ديوي</h1>
          <p className="text-sm opacity-80 mb-6 font-bold">ساعدنا في ترتيب مكتبة المدرسة واختبر ذكاءك!</p>
          
          <div className="space-y-4 mb-6 text-right">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block px-2">اسم البطل / البطلة:</label>
              <input 
                type="text" placeholder="اكتب اسمك الثلاثي..." 
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                value={studentName} onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block px-2">الصف الدراسي:</label>
              <input 
                type="text" placeholder="مثال: الخامس أ" 
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)}
              />
            </div>
          </div>
          <button onClick={handleStart} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-lg rounded-xl shadow-[0_10px_20px_rgba(245,158,11,0.3)] transition-transform active:scale-95 hover:-translate-y-1">
            بدء المغامرة 🚀
          </button>
        </div>
      )}

      {/* 2. شاشة التعلم والتوجيه */}
      {stage === 'learn' && (
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl animate-zoom-in relative z-10">
          <h2 className="text-2xl md:text-3xl font-black text-amber-500 mb-4 text-center">ما هو نظام ديوي العشري؟ 🤔</h2>
          <p className="text-sm md:text-base leading-relaxed mb-6 text-center opacity-90 font-medium">
            تخيل أن المكتبة مدينة ضخمة! لتسهيل العثور على الكتب، قام عالم اسمه <strong className="text-red-500">"ملفيل ديوي"</strong> بتقسيم كل المعرفة البشرية إلى 10 شوارع رئيسية (أقسام)، كل شارع له رقم من 000 إلى 900 ولون مميز يسهل حفظه!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {DEWEY_CATEGORIES.map(cat => (
              <div key={cat.code} className={`p-3 rounded-xl text-[10px] md:text-xs font-bold text-white text-center shadow-lg transform transition-transform hover:scale-105 ${cat.color}`}>
                {cat.label}
              </div>
            ))}
          </div>
          <button onClick={startChallenge1} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 text-lg">
            أنا مستعد للتحدي الأول! 💪
          </button>
        </div>
      )}

      {/* 3. شاشات التحديات الثلاثة */}
      {stage.startsWith('challenge') && currentQuestions.length > 0 && (
        <div className="max-w-4xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl animate-fade-in-up relative z-10">
          
          <div className="flex justify-between items-center mb-8 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl shadow-inner">
            <div>
              <span className="text-amber-500 font-black text-lg">
                {stage === 'challenge1' ? 'التحدي 1: مساعد المكتبة 👨‍💻' : stage === 'challenge2' ? 'التحدي 2: كرات المكتبة 🔮' : 'التحدي 3: رفوف ديوي 📚'}
              </span>
              <div className="text-sm opacity-70 mt-1 font-bold">السؤال {qIndex + 1} من 5</div>
            </div>
            <div className="flex gap-6 text-center">
              <div className="bg-white dark:bg-slate-700 px-4 py-2 rounded-xl shadow">
                <div className="text-[10px] opacity-70 font-bold">الوقت المتبقي</div>
                <div className={`font-black text-xl ${questionTimer <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>{questionTimer} ث</div>
              </div>
              <div className="bg-white dark:bg-slate-700 px-4 py-2 rounded-xl shadow">
                <div className="text-[10px] opacity-70 font-bold">النقاط</div>
                <div className="font-black text-xl text-green-500">{score}</div>
              </div>
            </div>
          </div>

          <div className="min-h-[280px] flex flex-col justify-center">
            {feedback ? (
              <div className="text-center animate-zoom-in">
                <div className="text-7xl mb-6">{feedback === 'correct' ? '✅' : '❌'}</div>
                <h3 className={`text-3xl font-black ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                  {feedback === 'correct' ? 'إجابة صحيحة! بطل!' : 'للأسف إجابة خاطئة!'}
                </h3>
              </div>
            ) : (
              <>
                <h3 className="text-xl md:text-2xl font-black mb-10 text-center leading-relaxed text-slate-800 dark:text-white">
                  {stage === 'challenge3' ? (
                    <span>أي كتاب يجب أن نضعه في الرف: <span className="text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-lg">[{currentQuestions[qIndex].shelf}]</span> ؟</span>
                  ) : currentQuestions[qIndex].text}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {stage === 'challenge3' ? (
                    // خيارات التحدي الثالث
                    currentQuestions[qIndex].options.map((opt: string, idx: number) => (
                      <button 
                        key={idx} onClick={() => handleAnswer(opt === currentQuestions[qIndex].correct)}
                        className="col-span-1 md:col-span-2 lg:col-span-1 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-bold text-sm md:text-base transition-all active:scale-95 shadow-sm"
                      >
                        {opt}
                      </button>
                    ))
                  ) : (
                    // خيارات التحديات 1 و 2
                    DEWEY_CATEGORIES.map(cat => (
                      <button 
                        key={cat.code} onClick={() => handleAnswer(cat.code === currentQuestions[qIndex].answer)}
                        className={`p-4 rounded-xl border-2 border-transparent text-white font-black text-xs md:text-sm transition-transform hover:-translate-y-1 active:scale-95 shadow-md ${cat.color}`}
                      >
                        {cat.label}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. شاشة الشهادة الاحترافية */}
      {stage === 'certificate' && (
        <div className="w-full flex flex-col items-center animate-fade-in-up">
          
          <div id="certificate-area" className="w-[850px] max-w-full bg-white text-slate-900 border-[16px] border-amber-500 p-12 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* خلفية جمالية مائية للشهادة */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }}></div>
            
            <div className="flex justify-between items-center border-b-[3px] border-amber-500/30 pb-6 mb-8 relative z-10">
              <img src="/school-logo.png" alt="EFIPS Logo" className="w-28 h-28 object-contain drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div className="text-left">
                <h2 className="text-2xl font-black text-red-700 uppercase tracking-widest">مدرسة صقر الإمارات الدولية الخاصة</h2>
                <p className="text-base text-slate-600 font-bold">Emirates Falcon Int'l. Private School</p>
                <p className="text-sm text-amber-600 font-black mt-1 bg-amber-50 inline-block px-3 py-1 rounded-lg">قسم المكتبة الرقمية والتفاعلية</p>
              </div>
            </div>

            <div className="text-center relative z-10 mb-10">
              <h1 className="text-5xl font-black text-amber-600 mb-6 drop-shadow-sm">شهادة أخصائي مكتبة</h1>
              <div className="w-40 h-1.5 bg-red-600 mx-auto rounded-full mb-8"></div>
              
              <p className="text-2xl leading-loose font-bold mb-4 text-slate-700">
                تشهد إدارة مكتبة مدرسة صقر الإمارات الدولية الخاصة بأن الطالب / الطالبة:
              </p>
              <h2 className="text-4xl font-black text-slate-900 my-6 bg-slate-50 inline-block px-12 py-4 rounded-2xl border-2 border-slate-200 shadow-sm">
                {studentName}
              </h2>
              <p className="text-2xl leading-loose font-bold text-slate-700">
                بالصف الدراسي <strong className="text-red-700 text-3xl mx-2">{studentGrade}</strong>
              </p>
              
              <p className="text-xl leading-relaxed mt-8 opacity-90 max-w-3xl mx-auto font-medium text-slate-600">
                قد اجتاز <strong className="text-slate-900">لعبة تحدي صقر لتصنيف ديوي العشري</strong> بنجاح وتفوق، 
                وأثبت مهارة عالية واستثنائية في تنظيم مصادر المعرفة وترتيب الأرفف المكتبية بذكاء.
              </p>
            </div>

            <div className="flex justify-center gap-16 text-center relative z-10 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner">
              <div>
                <div className="text-sm text-slate-500 font-black uppercase mb-2 tracking-wider">النقاط المكتسبة</div>
                <div className="text-4xl font-black text-green-600">{score} <span className="text-xl text-slate-400">/ 300</span></div>
              </div>
              <div className="w-1 bg-slate-200 rounded-full"></div>
              <div>
                <div className="text-sm text-slate-500 font-black uppercase mb-2 tracking-wider">وقت الإنجاز</div>
                <div className="text-4xl font-black text-amber-600">{formatTime(totalTime)}</div>
              </div>
            </div>

            <div className="mt-14 flex justify-between items-end relative z-10 px-10">
              <div className="text-center">
                <p className="text-lg font-black text-slate-800 mb-4">توقيع أمين المكتبة</p>
                <div className="w-48 h-[2px] bg-slate-800"></div>
              </div>
              
              {/* ختم صقر الذهبي */}
              <div className="w-28 h-28 bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center rounded-full font-black text-5xl shadow-2xl transform -rotate-12 border-4 border-dashed border-white">
                🦅
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4 no-print relative z-10">
            <button onClick={() => window.print()} className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2">
              <span>🖨️</span> طباعة أو حفظ الشهادة PDF
            </button>
            <Link to="/" className="px-8 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black text-lg rounded-xl shadow-lg transition-transform active:scale-95">
              العودة للمكتبة
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};

export default DeweyGame;
