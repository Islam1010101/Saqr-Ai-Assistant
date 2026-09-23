import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ==========================================
// 1. القاموس والترجمة (عربي / إنجليزي)
// ==========================================

const T = {
  ar: {
    title: "تحدي أبطال ديوي",
    subtitle: "ساعد صقر في ترتيب مكتبة المدرسة واختبر ذكاءك!",
    studentName: "اسم البطل / البطلة:",
    namePlaceholder: "اكتب اسمك الثلاثي...",
    grade: "الصف الدراسي:",
    gradePlaceholder: "مثال: الخامس أ",
    start: "الدخول للتحدي",
    rulesTitle: "قواعد التحدي",
    rulesText: "المكتبة مدينة ضخمة! لتسهيل العثور على الكتب، تم تقسيم المعرفة إلى شوارع رئيسية من 000 إلى 900. ضع كل كتاب في الشارع الصحيح!",
    readyBtn: "أنا مستعد!",
    ch1: "التحدي 1: ساعد القارئ",
    ch2: "التحدي 2: صنف الكتاب",
    ch3: "التحدي 3: املأ الرف",
    question: "السؤال",
    time: "الوقت المتبقي",
    points: "النقاط",
    sec: "ث",
    correct: "إجابة صحيحة! أنت بطل!",
    wrong: "للأسف، الرف خاطئ!",
    dragInstruction: "ضع هذه البطاقة في الرف الصحيح",
    dropInstruction: "ضع الكتاب المناسب هنا",
    shelfText: "رف",
    certTitle: "شهادة أخصائي مكتبة",
    certAwardedTo: "تشهد إدارة المكتبة بأن الطالب / الطالبة:",
    certGrade: "بالصف",
    certBody: "قد اجتاز تحدي تصنيف ديوي العشري بنجاح، وأثبت مهارة استثنائية في ترتيب الأرفف وتصنيف مصادر المعرفة بذكاء.",
    certPoints: "النقاط المكتسبة",
    certTime: "وقت الإنجاز",
    certSign: "توقيع أمين المكتبة",
    print: "طباعة وحفظ الشهادة",
    back: "العودة للمكتبة",
    schoolName: "مدرسة صقر الإمارات الدولية الخاصة",
    dept: "قسم المكتبة الرقمية والتفاعلية",
    minutes: "دقيقة و",
    seconds: "ثانية",
    enterDetails: "الرجاء إدخال اسمك وصفك الدراسي لنتمكن من إصدار الشهادة!"
  },
  en: {
    title: "Dewey Heroes Challenge",
    subtitle: "Help Saqr organize the library and test your skills!",
    studentName: "Hero's Name:",
    namePlaceholder: "Enter your full name...",
    grade: "Grade:",
    gradePlaceholder: "e.g., Grade 5A",
    start: "Enter Challenge",
    rulesTitle: "Challenge Rules",
    rulesText: "The library is a huge city! To find books easily, knowledge is divided into main streets from 000 to 900. Place each book in its correct street!",
    readyBtn: "I am ready!",
    ch1: "Challenge 1: Help the Reader",
    ch2: "Challenge 2: Sort the Book",
    ch3: "Challenge 3: Fill the Shelf",
    question: "Question",
    time: "Time Left",
    points: "Points",
    sec: "s",
    correct: "Correct! You are a hero!",
    wrong: "Sorry, wrong shelf!",
    dragInstruction: "Place this card in the correct shelf",
    dropInstruction: "Place the correct book here",
    shelfText: "Shelf",
    certTitle: "Library Specialist Certificate",
    certAwardedTo: "The Library Administration certifies that:",
    certGrade: "Grade",
    certBody: "has successfully completed the Dewey Decimal Classification challenge, showing exceptional skills in organizing library shelves intelligently.",
    certPoints: "Points Earned",
    certTime: "Time Taken",
    certSign: "Librarian Signature",
    print: "Print & Save Certificate",
    back: "Back to Library",
    schoolName: "Emirates Falcon Int'l. Private School",
    dept: "Digital & Interactive Library Dept.",
    minutes: "min and",
    seconds: "sec",
    enterDetails: "Please enter your name and grade so we can issue your certificate!"
  }
};

// ==========================================
// 2. البيانات المبسطة (للأطفال) وبنوك الأسئلة
// ==========================================

const DEWEY_CATEGORIES = [
  { code: "000", ar: "000 حاسب ومعارف", en: "000 Computers", color: "#0ea5e9" },
  { code: "100", ar: "100 تطوير الذات", en: "100 Self Growth", color: "#a855f7" },
  { code: "200", ar: "200 دين وأخلاق", en: "200 Religion", color: "#10b981" },
  { code: "300", ar: "300 مجتمع وقانون", en: "300 Society", color: "#f97316" },
  { code: "400", ar: "400 لغات وقواميس", en: "400 Languages", color: "#ec4899" },
  { code: "500", ar: "500 علوم وفضاء", en: "500 Science", color: "#eab308" },
  { code: "600", ar: "600 تكنولوجيا وطب", en: "600 Tech & Med", color: "#14b8a6" },
  { code: "700", ar: "700 فنون ورياضة", en: "700 Arts & Sports", color: "#6366f1" },
  { code: "800", ar: "800 قصص وحكايات", en: "800 Stories", color: "#f43f5e" },
  { code: "900", ar: "900 تاريخ وجغرافيا", en: "900 History", color: "#ef4444" }
];

const BANK_ASSISTANT = [
  { ar: "أحمد يبحث عن كتاب عن الكواكب والنجوم", en: "Ahmed wants a book about planets and stars", answer: "500" },
  { ar: "مريم تريد قاموساً لتعلم الإنجليزية", en: "Maryam wants a dictionary to learn English", answer: "400" },
  { ar: "عمر يطلب كتاباً عن قصص الأنبياء", en: "Omar asks for a book about Prophets", answer: "200" },
  { ar: "سارة تريد تعلم رسم الشخصيات الكرتونية", en: "Sara wants to learn how to draw cartoons", answer: "700" },
  { ar: "خالد يبحث عن كتاب عن تاريخ الإمارات", en: "Khalid is looking for UAE history", answer: "900" },
  { ar: "فاطمة تحب أجهزة الكمبيوتر والبرمجة", en: "Fatima loves computers and coding", answer: "000" },
  { ar: "يوسف مريض ويريد أن يقرأ عن الفيتامينات", en: "Yousef wants to read about vitamins", answer: "600" },
  { ar: "علي يبحث عن شعر للإذاعة المدرسية", en: "Ali needs a poem for the school radio", answer: "800" },
  { ar: "هدى تريد أن تقرأ عن حقوق الطفل", en: "Huda wants to read about children's rights", answer: "300" },
  { ar: "ماجد يبحث عن كتاب لزيادة ثقته بنفسه", en: "Majid wants a book to build self-confidence", answer: "100" }
];

const BANK_ORBS = [
  { ar: "كتاب: عالم الكمبيوتر والإنترنت", en: "Book: Computers and Internet", answer: "000" },
  { ar: "كتاب: كيف تتحكم في غضبك", en: "Book: How to Control Anger", answer: "100" },
  { ar: "كتاب: أركان الإسلام", en: "Book: Pillars of Islam", answer: "200" },
  { ar: "كتاب: قوانين المرور والشرطة", en: "Book: Traffic Laws & Police", answer: "300" },
  { ar: "كتاب: قواعد اللغة العربية", en: "Book: Arabic Grammar", answer: "400" },
  { ar: "كتاب: الديناصورات والحيوانات", en: "Book: Dinosaurs and Animals", answer: "500" },
  { ar: "كتاب: كيف تصنع سيارة ذكية", en: "Book: How to build a smart car", answer: "600" },
  { ar: "كتاب: قوانين كرة القدم", en: "Book: Football Rules", answer: "700" },
  { ar: "رواية: مغامرات أليس", en: "Novel: Alice's Adventures", answer: "800" },
  { ar: "أطلس: خرائط دول العالم", en: "Atlas: World Maps", answer: "900" }
];

const BANK_SHELVES = [
  { shelf: "500", arCorrect: "أسرار الفضاء", enCorrect: "Space Secrets", arWrongs: ["تاريخ العرب", "كيف ترسم", "قواعد الإملاء"], enWrongs: ["Arab History", "How to Draw", "Spelling Rules"] },
  { shelf: "700", arCorrect: "أبطال السباحة", enCorrect: "Swimming Heroes", arWrongs: ["جسم الإنسان", "الكمبيوتر", "القصة القصيرة"], enWrongs: ["Human Body", "Computers", "Short Stories"] },
  { shelf: "900", arCorrect: "حضارة الفراعنة", enCorrect: "Pharaohs History", arWrongs: ["تعلم الإسبانية", "أخلاق المسلم", "عالم الطيور"], enWrongs: ["Learn Spanish", "Muslim Morals", "Bird World"] },
  { shelf: "600", arCorrect: "السيارات الذكية", enCorrect: "Smart Cars", arWrongs: ["شعر المتنبي", "خريطة أوروبا", "حقوق الإنسان"], enWrongs: ["Poetry", "Europe Map", "Human Rights"] },
  { shelf: "800", arCorrect: "قصة سندريلا", enCorrect: "Cinderella Story", arWrongs: ["لغات البرمجة", "تفسير القرآن", "الجاذبية"], enWrongs: ["Programming", "Quran", "Gravity"] },
  { shelf: "200", arCorrect: "أخلاق المسلم", enCorrect: "Muslim Morals", arWrongs: ["عواصم العالم", "صناعة الأدوية", "كيف تلعب الشطرنج"], enWrongs: ["World Capitals", "Medicine", "Play Chess"] },
  { shelf: "000", arCorrect: "الإنترنت الآمن", enCorrect: "Safe Internet", arWrongs: ["تاريخ الأندلس", "تعلم السباحة", "قصص جحا"], enWrongs: ["History", "Learn Swimming", "Juha Stories"] }
];

const shuffleArray = (array: any[]) => [...array].sort(() => 0.5 - Math.random());

// ==========================================
// 3. المكون الرئيسي للعبة
// ==========================================

const DeweyGame: React.FC = () => {
  // تحديد اللغة بناءً على إعدادات الصفحة
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  
  useEffect(() => {
    const checkLang = () => {
      const currentLang = document.documentElement.lang === 'en' ? 'en' : 'ar';
      setLang(currentLang);
    };
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const dict = T[lang];

  const [stage, setStage] = useState<'intro' | 'learn' | 'challenge1' | 'challenge2' | 'challenge3' | 'certificate'>('intro');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0); 
  const [questionTimer, setQuestionTimer] = useState(20);
  
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (stage.startsWith('challenge')) {
      interval = setInterval(() => setTotalTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

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
      alert(dict.enterDetails);
      return;
    }
    setStage('learn');
  };

  const startChallenge1 = () => {
    setCurrentQuestions(shuffleArray(BANK_ASSISTANT).slice(0, 5));
    setQIndex(0); setQuestionTimer(20); setStage('challenge1'); setActiveDragItem(null);
  };

  const startChallenge2 = () => {
    setCurrentQuestions(shuffleArray(BANK_ORBS).slice(0, 5));
    setQIndex(0); setQuestionTimer(20); setStage('challenge2'); setActiveDragItem(null);
  };

  const startChallenge3 = () => {
    const mixed = shuffleArray(BANK_SHELVES).slice(0, 5).map(q => {
      const correct = lang === 'ar' ? q.arCorrect : q.enCorrect;
      const wrongs = lang === 'ar' ? q.arWrongs : q.enWrongs;
      return {
        shelf: q.shelf,
        correct: correct,
        options: shuffleArray([correct, ...wrongs])
      };
    });
    setCurrentQuestions(mixed);
    setQIndex(0); setQuestionTimer(20); setStage('challenge3'); setActiveDragItem(null);
  };

  const handleTimeout = () => {
    setFeedback('wrong');
    setActiveDragItem(null);
    setTimeout(() => nextQuestion(), 1500);
  };

  const handleAnswer = (droppedAnswer: string) => {
    if (feedback) return; 
    let isCorrect = false;
    if (stage === 'challenge3') {
      isCorrect = droppedAnswer === currentQuestions[qIndex].correct;
    } else {
      isCorrect = droppedAnswer === currentQuestions[qIndex].answer;
    }

    if (isCorrect) {
      setScore(s => s + 20); 
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setActiveDragItem(null);
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
    return `${m > 0 ? m + ' ' + dict.minutes + ' ' : ''}${s} ${dict.seconds}`;
  };

  const onDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
    setActiveDragItem(item);
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (e: React.DragEvent, targetValue: string) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (item) {
      if (stage === 'challenge3') handleAnswer(item);
      else handleAnswer(targetValue);
    }
  };
  const onTouchSelect = (item: string) => setActiveDragItem(item);
  const onTouchDrop = (targetValue: string) => {
    if (activeDragItem) {
      if (stage === 'challenge3') handleAnswer(activeDragItem);
      else handleAnswer(targetValue);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-2 md:p-4 relative overflow-hidden select-none ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        
        .dir-rtl { direction: rtl; }
        .dir-ltr { direction: ltr; }
        
        @media print {
          body * { visibility: hidden; }
          #certificate-area, #certificate-area * { visibility: visible; }
          #certificate-area { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: #fff !important; }
          .no-print { display: none !important; }
        }

        /* مؤثرات صورة البداية */
        .magic-glow {
          animation: pulse-glow 2.5s infinite alternate ease-in-out;
        }
        @keyframes pulse-glow {
          0% { filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.4)); transform: scale(1) translateY(0px); }
          100% { filter: drop-shadow(0 0 35px rgba(245, 158, 11, 0.8)); transform: scale(1.05) translateY(-10px); }
        }

        /* شكل الرف الواقعي (خشبي) */
        .wood-shelf {
          position: relative;
          background: linear-gradient(to bottom, #d97706 0%, #b45309 100%);
          border-bottom: 8px solid #78350f;
          border-radius: 6px;
          box-shadow: inset 0 -4px 10px rgba(0,0,0,0.3), 0 10px 15px rgba(0,0,0,0.4);
          transition: all 0.3s ease;
        }
        .wood-shelf:hover {
          filter: brightness(1.1);
        }
        .wood-shelf-active {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.8), inset 0 -4px 10px rgba(0,0,0,0.3);
          transform: scale(1.02);
        }
        
        /* شكل الكتاب الواقعي */
        .realistic-book {
          position: relative;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-left: 12px solid #cbd5e1;
          border-radius: 4px 12px 12px 4px;
          box-shadow: -3px 4px 10px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        .realistic-book.colored {
          border-left-width: 14px;
        }
        .realistic-book:hover {
          transform: translateY(-5px) rotate(-2deg);
          box-shadow: -5px 10px 15px rgba(0,0,0,0.3);
        }
        .realistic-book-active {
          transform: scale(1.05) translateY(-10px);
          box-shadow: 0 15px 25px rgba(245, 158, 11, 0.5);
          border-color: #f59e0b;
        }

        /* خطوط الشهادة */
        .cert-font {
          font-family: 'Cairo', sans-serif;
        }
      `}</style>

      {/* 1. شاشة البداية */}
      {stage === 'intro' && (
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center animate-fade-in-up relative z-10">
          <img src="/Game.png" alt="Game Logo" className="w-48 h-48 mx-auto mb-6 object-contain magic-glow" onError={(e) => e.currentTarget.style.display = 'none'} />
          <h1 className="text-3xl font-black text-amber-500 mb-2">{dict.title}</h1>
          <p className="text-sm opacity-80 mb-6 font-bold text-slate-600 dark:text-slate-400">{dict.subtitle}</p>
          
          <div className={`space-y-4 mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{dict.studentName}</label>
              <input type="text" placeholder={dict.namePlaceholder} className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{dict.grade}</label>
              <input type="text" placeholder={dict.gradePlaceholder} className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold" value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)} />
            </div>
          </div>
          <button onClick={handleStart} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-lg rounded-xl shadow-[0_10px_20px_rgba(245,158,11,0.3)] transition-transform active:scale-95">
            {dict.start}
          </button>
        </div>
      )}

      {/* 2. شاشة التعلم */}
      {stage === 'learn' && (
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl animate-zoom-in relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-amber-500 mb-4">{dict.rulesTitle}</h2>
          <p className="text-sm md:text-base leading-relaxed mb-8 opacity-90 font-medium text-slate-700 dark:text-slate-300">
            {dict.rulesText}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
            {DEWEY_CATEGORIES.map(cat => (
              <div key={cat.code} className="p-3 rounded-lg text-[10px] md:text-xs font-bold shadow-md text-white transition-transform hover:scale-105" style={{ backgroundColor: cat.color }}>
                {lang === 'ar' ? cat.ar : cat.en}
              </div>
            ))}
          </div>
          <button onClick={startChallenge1} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 text-lg">
            {dict.readyBtn}
          </button>
        </div>
      )}

      {/* 3. شاشات التحديات */}
      {stage.startsWith('challenge') && currentQuestions.length > 0 && (
        <div className="max-w-5xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-8 shadow-2xl animate-fade-in-up relative z-10 flex flex-col h-full min-h-[85vh] md:min-h-0">
          
          <div className="flex justify-between items-center mb-6 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl shadow-inner shrink-0">
            <div>
              <span className="text-amber-500 font-black text-sm md:text-lg">
                {stage === 'challenge1' ? dict.ch1 : stage === 'challenge2' ? dict.ch2 : dict.ch3}
              </span>
              <div className="text-xs opacity-70 mt-1 font-bold">{dict.question} {qIndex + 1} / 5</div>
            </div>
            <div className="flex gap-3 md:gap-4 text-center">
              <div className="bg-white dark:bg-slate-700 px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow">
                <div className="text-[9px] md:text-[10px] opacity-70 font-bold">{dict.time}</div>
                <div className={`font-black text-lg md:text-xl ${questionTimer <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>{questionTimer} {dict.sec}</div>
              </div>
              <div className="bg-white dark:bg-slate-700 px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow">
                <div className="text-[9px] md:text-[10px] opacity-70 font-bold">{dict.points}</div>
                <div className="font-black text-lg md:text-xl text-green-500">{score}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between relative">
            {feedback ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 z-20 backdrop-blur-sm rounded-2xl animate-zoom-in">
                <h3 className={`text-3xl md:text-5xl font-black ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'} animate-bounce`}>
                  {feedback === 'correct' ? dict.correct : dict.wrong}
                </h3>
              </div>
            ) : null}

            {/* الجزء العلوي */}
            <div className="flex flex-col items-center justify-center mb-10 shrink-0 min-h-[160px]">
              {stage === 'challenge3' ? (
                <div 
                  className={`w-full md:w-2/3 h-32 relative wood-shelf flex items-end justify-center pb-4 cursor-pointer ${activeDragItem ? 'wood-shelf-active' : ''}`}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, currentQuestions[qIndex].shelf)}
                  onClick={() => onTouchDrop(currentQuestions[qIndex].shelf)}
                >
                  <div className="absolute -top-6 bg-white dark:bg-slate-800 px-6 py-2 rounded-full font-black text-amber-600 shadow-md border border-amber-200">
                    {dict.shelfText}: {currentQuestions[qIndex].shelf}
                  </div>
                  <p className="text-white/80 font-bold text-sm tracking-widest">{dict.dropInstruction}</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-bold opacity-70 mb-4 text-slate-500">{dict.dragInstruction}</p>
                  <div 
                    draggable
                    onDragStart={(e) => onDragStart(e, 'item')}
                    onClick={() => onTouchSelect('item')}
                    className={`realistic-book p-6 md:p-10 max-w-lg mx-auto cursor-grab active:cursor-grabbing flex items-center justify-center text-center ${activeDragItem ? 'realistic-book-active' : ''}`}
                    style={{ borderColor: '#f59e0b', backgroundColor: '#fff', color: '#0f172a' }}
                  >
                    <h3 className="font-black text-lg md:text-2xl leading-relaxed">
                      {lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en}
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* الجزء السفلي */}
            <div className="flex-1 mt-auto shrink-0 pb-4">
              {stage === 'challenge3' ? (
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestions[qIndex].options.map((opt: string, idx: number) => (
                    <div 
                      key={idx}
                      draggable
                      onDragStart={(e) => onDragStart(e, opt)}
                      onClick={() => onTouchSelect(opt)}
                      className={`realistic-book p-4 font-bold text-sm text-center flex items-center justify-center min-h-[90px] cursor-grab active:cursor-grabbing text-slate-800 ${activeDragItem === opt ? 'realistic-book-active' : ''}`}
                      style={{ borderColor: '#64748b' }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {DEWEY_CATEGORIES.map(cat => (
                    <div 
                      key={cat.code} 
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, cat.code)}
                      onClick={() => onTouchDrop(cat.code)}
                      className={`wood-shelf h-28 flex flex-col justify-end items-center pb-2 cursor-pointer ${activeDragItem ? 'wood-shelf-active' : ''}`}
                    >
                      <div className="bg-white/90 text-slate-900 text-[10px] md:text-xs font-black px-2 py-1 rounded shadow-sm mb-2 text-center w-11/12 truncate" style={{ borderBottom: `4px solid ${cat.color}` }}>
                        {lang === 'ar' ? cat.ar : cat.en}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. شاشة الشهادة الاحترافية */}
      {stage === 'certificate' && (
        <div className="w-full flex flex-col items-center animate-fade-in-up relative z-10">
          <div id="certificate-area" className="cert-font w-[850px] max-w-full bg-white text-slate-900 border-[16px] border-amber-500 p-12 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }}></div>
            
            <div className="flex justify-between items-center border-b-[3px] border-amber-500/30 pb-6 mb-8 relative z-10">
              <img src="/school-logo.png" alt="School Logo" className="w-24 h-24 object-contain drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div className={`text-left ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <h2 className="text-xl md:text-2xl font-black text-red-700 uppercase tracking-widest">{dict.schoolName}</h2>
                <p className="text-sm text-amber-600 font-black mt-2 bg-amber-50 inline-block px-3 py-1 rounded-lg border border-amber-200">{dict.dept}</p>
              </div>
            </div>

            <div className="text-center relative z-10 mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-amber-600 mb-6 drop-shadow-sm">{dict.certTitle}</h1>
              <div className="w-40 h-1.5 bg-red-600 mx-auto rounded-full mb-8"></div>
              
              <p className="text-xl md:text-2xl leading-loose font-bold mb-4 text-slate-700">
                {dict.certAwardedTo}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 my-6 bg-slate-50 inline-block px-12 py-4 rounded-2xl border-2 border-slate-200 shadow-sm">
                {studentName}
              </h2>
              <p className="text-xl md:text-2xl leading-loose font-bold text-slate-700">
                {dict.certGrade} <strong className="text-red-700 text-3xl mx-2">{studentGrade}</strong>
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed mt-8 opacity-90 max-w-3xl mx-auto font-medium text-slate-600">
                {dict.certBody}
              </p>
            </div>

            <div className="flex justify-center gap-10 md:gap-16 text-center relative z-10 bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner">
              <div>
                <div className="text-sm text-slate-500 font-black uppercase mb-2 tracking-wider">{dict.certPoints}</div>
                <div className="text-3xl md:text-4xl font-black text-green-600">{score} <span className="text-xl text-slate-400">/ 300</span></div>
              </div>
              <div className="w-1 bg-slate-200 rounded-full"></div>
              <div>
                <div className="text-sm text-slate-500 font-black uppercase mb-2 tracking-wider">{dict.certTime}</div>
                <div className="text-3xl md:text-4xl font-black text-amber-600">{formatTime(totalTime)}</div>
              </div>
            </div>

            <div className="mt-12 flex justify-between items-end relative z-10 px-4 md:px-10">
              <div className="text-center">
                <p className="text-base md:text-lg font-black text-slate-800 mb-4">{dict.certSign}</p>
                <div className="w-40 md:w-48 h-[2px] bg-slate-800"></div>
              </div>
              <img src="/saqr-avatar.png" alt="Saqr Avatar" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
          </div>

          <div className="mt-8 flex gap-4 no-print relative z-10">
            <button onClick={() => window.print()} className="px-6 py-3 md:px-8 md:py-4 bg-red-600 hover:bg-red-700 text-white font-black text-base md:text-lg rounded-xl shadow-lg transition-transform active:scale-95">
              {dict.print}
            </button>
            <Link to="/" className="px-6 py-3 md:px-8 md:py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black text-base md:text-lg rounded-xl shadow-lg transition-transform active:scale-95">
              {dict.back}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeweyGame;
