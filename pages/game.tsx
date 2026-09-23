لقد قمت بتعديل القسم رقم `900` ليكون باللغة العربية **"تاريخ وجغرافيا"** وباللغة الإنجليزية **"History & Geography"** ليتناسب تماماً مع أسئلة الخرائط والجغرافيا، مع الحفاظ التام على باقي تفاصيل ومحتوى الصفحة دون أي تغيير آخر.

إليك الكود المحدث بالكامل لملف `pages/game.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ==========================================
// 1. القاموس والترجمة (عربي / إنجليزي)
// ==========================================

const T = {
  ar: {
    title: "تحدي أبطال المعرفة",
    subtitle: "مرحباً بك! ساعدنا في ترتيب مكتبة المدرسة لتصبح بطلاً.",
    studentName: "اسم البطل / البطلة:",
    namePlaceholder: "اكتب اسمك الثلاثي هنا...",
    grade: "الصف الدراسي:",
    gradePlaceholder: "مثال: الخامس أ",
    start: "الدخول للتحدي",
    rulesTitle: "كيف نلعب؟",
    rulesText: "المكتبة مثل مدينة كبيرة! لكي لا تضيع الكتب، قمنا بتقسيمها إلى شوارع ملونة. في التحديات القادمة، رتب الكتب بوضع كل كتاب في الشارع المناسب له!",
    readyBtn: "أنا مستعد للانطلاق!",
    ch1: "التحدي الأول: مساعدة القراء",
    ch2: "التحدي الثاني: تصنيف الكتب",
    ch3: "التحدي الثالث: ترتيب الأرفف",
    question: "المهمة",
    time: "الوقت",
    points: "النقاط",
    sec: "ث",
    correct: "عمل رائع! أنت بطل حقيقي!",
    wrong: "حاول مرة أخرى يا بطل!",
    dragInstruction: "أين نضع هذا الكتاب؟",
    dropInstruction: "أي كتاب ينتمي لهذا الرف؟",
    shelfText: "رف",
    certTitle: "شهادة أمين المكتبة المتميز",
    certAwardedTo: "تشهد إدارة المكتبة بأن البطل / البطلة:",
    certGrade: "بالصف",
    certBody: "قد اجتاز تحدي ترتيب المكتبة بنجاح وتفوق، وأثبت مهارة استثنائية وذكاءً كبيراً في تصنيف المعرفة وتنظيم الأرفف.",
    certPoints: "مجموع النقاط",
    certTime: "وقت الإنجاز",
    certDate: "تاريخ الإصدار:",
    certSign: "توقيع أمين المكتبة",
    print: "طباعة وحفظ الشهادة",
    back: "العودة للمكتبة",
    schoolName: "مدرسة صقر الإمارات الدولية الخاصة",
    dept: "قسم المكتبة الرقمية والتفاعلية",
    minutes: "دقيقة و",
    seconds: "ثانية",
    enterDetails: "الرجاء إدخال اسمك وصفك لنتمكن من تجهيز شهادتك!"
  },
  en: {
    title: "Knowledge Heroes Challenge",
    subtitle: "Welcome! Help us organize the school library to become a hero.",
    studentName: "Hero's Name:",
    namePlaceholder: "Enter your full name...",
    grade: "Grade:",
    gradePlaceholder: "e.g., Grade 5A",
    start: "Enter Challenge",
    rulesTitle: "How to Play?",
    rulesText: "The library is like a big city! To keep books from getting lost, we divided them into colorful streets. Put each book in its correct street!",
    readyBtn: "I am ready to go!",
    ch1: "Challenge 1: Help the Readers",
    ch2: "Challenge 2: Sort the Books",
    ch3: "Challenge 3: Fill the Shelves",
    question: "Task",
    time: "Time Left",
    points: "Points",
    sec: "s",
    correct: "Great job! You are a hero!",
    wrong: "Try again, hero!",
    dragInstruction: "Where does this book go?",
    dropInstruction: "Which book belongs to this shelf?",
    shelfText: "Shelf",
    certTitle: "Outstanding Librarian Certificate",
    certAwardedTo: "The Library Administration certifies that the hero:",
    certGrade: "Grade",
    certBody: "has successfully passed the library organization challenge, showing exceptional skill and high intelligence in classifying knowledge.",
    certPoints: "Total Points",
    certTime: "Time Taken",
    certDate: "Issue Date:",
    certSign: "Librarian Signature",
    print: "Print & Save Certificate",
    back: "Back to Library",
    schoolName: "Emirates Falcon Int'l. Private School",
    dept: "Digital & Interactive Library Dept.",
    minutes: "min and",
    seconds: "sec",
    enterDetails: "Please enter your name and grade so we can prepare your certificate!"
  }
};

// ==========================================
// 2. بنوك الأسئلة الموسعة والمتنوعة
// ==========================================

const DEWEY_CATEGORIES = [
  { code: "000", ar: "حاسب ومعارف", en: "Computers", color: "#0ea5e9" },
  { code: "100", ar: "تطوير الذات", en: "Self Growth", color: "#a855f7" },
  { code: "200", ar: "دين وأخلاق", en: "Religion", color: "#10b981" },
  { code: "300", ar: "مجتمع وقانون", en: "Society", color: "#f97316" },
  { code: "400", ar: "لغات وقواميس", en: "Languages", color: "#ec4899" },
  { code: "500", ar: "علوم وفضاء", en: "Science", color: "#eab308" },
  { code: "600", ar: "تكنولوجيا وطب", en: "Tech & Med", color: "#14b8a6" },
  { code: "700", ar: "فنون ورياضة", en: "Arts & Sports", color: "#6366f1" },
  { code: "800", ar: "قصص وحكايات", en: "Stories", color: "#f43f5e" },
  { code: "900", ar: "تاريخ وجغرافيا", en: "History & Geography", color: "#ef4444" }
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
  { ar: "ماجد يبحث عن كتاب لزيادة ثقته بنفسه", en: "Majid wants a book to build self-confidence", answer: "100" },
  { ar: "ليلى تبحث عن خريطة قارات العالم", en: "Laila is searching for a world map", answer: "900" },
  { ar: "سعيد يريد قراءة قصة مغامرات شيقة", en: "Saeed wants an exciting adventure story", answer: "800" },
  { ar: "راشد يسأل عن معلومات تخص عالم النباتات", en: "Rashed asks about plant biology", answer: "500" },
  { ar: "منى تريد تعلم كيفية الإسعافات الأولية", en: "Mona wants to learn first aid basics", answer: "600" }
];

const BANK_ORBS = [
  { ar: "كتاب: عالم الكمبيوتر والإنترنت", en: "Book: Computers and Internet", answer: "000" },
  { ar: "كتاب: كيف تتحكم في غضبك", en: "Book: How to Control Anger", answer: "100" },
  { ar: "كتاب: أركان الإسلام", en: "Book: Pillars of Islam", answer: "200" },
  { ar: "كتاب: قوانين المرور", en: "Book: Traffic Laws", answer: "300" },
  { ar: "كتاب: قواعد اللغة العربية", en: "Book: Arabic Grammar", answer: "400" },
  { ar: "كتاب: الديناصورات والحيوانات", en: "Book: Dinosaurs and Animals", answer: "500" },
  { ar: "كتاب: كيف تصنع سيارة ذكية", en: "Book: How to build a smart car", answer: "600" },
  { ar: "كتاب: قوانين كرة القدم", en: "Book: Football Rules", answer: "700" },
  { ar: "رواية: مغامرات أليس", en: "Novel: Alice's Adventures", answer: "800" },
  { ar: "أطلس: خرائط دول العالم", en: "Atlas: World Maps", answer: "900" },
  { ar: "كتاب: التفكير الإيجابي", en: "Book: Positive Thinking", answer: "100" },
  { ar: "كتاب: الفضاء الخارجي والمجرات", en: "Book: Outer Space & Galaxies", answer: "500" },
  { ar: "كتاب: تاريخ الصحراء العربية", en: "Book: Arabian Desert History", answer: "900" },
  { ar: "كتاب: فن الخط العربي", en: "Book: Arabic Calligraphy Art", answer: "700" }
];

const BANK_SHELVES = [
  { shelfCode: "500", arShelf: "علوم وفضاء", enShelf: "Science", arCorrect: "أسرار الفضاء", enCorrect: "Space Secrets", arWrongs: ["تاريخ العرب", "كيف ترسم", "قواعد الإملاء"], enWrongs: ["Arab History", "How to Draw", "Spelling Rules"] },
  { shelfCode: "700", arShelf: "فنون ورياضة", enShelf: "Arts & Sports", arCorrect: "أبطال السباحة", enCorrect: "Swimming Heroes", arWrongs: ["جسم الإنسان", "الكمبيوتر", "القصة القصيرة"], enWrongs: ["Human Body", "Computers", "Short Stories"] },
  { shelfCode: "900", arShelf: "تاريخ وجغرافيا", enShelf: "History & Geography", arCorrect: "حضارة الفراعنة", enCorrect: "Pharaohs History", arWrongs: ["تعلم الإسبانية", "أخلاق المسلم", "عالم الطيور"], enWrongs: ["Learn Spanish", "Muslim Morals", "Bird World"] },
  { shelfCode: "600", arShelf: "تكنولوجيا وطب", enShelf: "Tech & Med", arCorrect: "السيارات الذكية", enCorrect: "Smart Cars", arWrongs: ["شعر المتنبي", "خريطة أوروبا", "حقوق الإنسان"], enWrongs: ["Poetry", "Europe Map", "Human Rights"] },
  { shelfCode: "800", arShelf: "قصص وحكايات", enShelf: "Stories", arCorrect: "قصة سندريلا", enCorrect: "Cinderella Story", arWrongs: ["لغات البرمجة", "تفسير القرآن", "الجاذبية"], enWrongs: ["Programming", "Quran", "Gravity"] },
  { shelfCode: "200", arShelf: "دين وأخلاق", enShelf: "Religion", arCorrect: "أخلاق المسلم", enCorrect: "Muslim Morals", arWrongs: ["عواصم العالم", "صناعة الأدوية", "الشطرنج"], enWrongs: ["World Capitals", "Medicine", "Chess"] },
  { shelfCode: "000", arShelf: "حاسب ومعارف", enShelf: "Computers", arCorrect: "الإنترنت الآمن", enCorrect: "Safe Internet", arWrongs: ["تاريخ الأندلس", "تعلم السباحة", "قصص جحا"], enWrongs: ["History", "Learn Swimming", "Juha Stories"] },
  { shelfCode: "100", arShelf: "تطوير الذات", enShelf: "Self Growth", arCorrect: "قوة الثقة بالنفس", enCorrect: "Self Confidence", arWrongs: ["أحكام الصيام", "البرمجة بلغة بايثون", "تاريخ القارات"], enWrongs: ["Fasting", "Python", "Continents"] },
  { shelfCode: "300", arShelf: "مجتمع وقانون", enShelf: "Society", arCorrect: "حقوق الطفل والدستور", enCorrect: "Children's Rights", arWrongs: ["علم الفلك", "الرسم بالزيت", "قواميس اللغات"], enWrongs: ["Astronomy", "Oil Painting", "Dictionaries"] },
  { shelfCode: "400", arShelf: "لغات وقواميس", enShelf: "Languages", arCorrect: "المعجم الوسيط للغة", enCorrect: "Language Lexicon", arWrongs: ["رياضة القفز", "أسرار البحار", "الذكاء الاصطناعي"], enWrongs: ["Jumping", "Deep Sea", "AI"] }
];

const shuffleArray = (array: any[]) => [...array].sort(() => 0.5 - Math.random());

// ==========================================
// 3. المكون الرئيسي للعبة
// ==========================================

const DeweyGame: React.FC = () => {
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
  const [issueDate, setIssueDate] = useState('');

  useEffect(() => {
    const dateStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setIssueDate(dateStr);
  }, [lang, stage]);

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
      const displayShelf = lang === 'ar' ? q.arShelf : q.enShelf;
      return {
        shelfCode: q.shelfCode,
        displayShelf: displayShelf,
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
          #certificate-area, #certificate-area * { visibility: visible !important; }
          #certificate-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }

        .magic-glow {
          animation: pulse-glow 2s infinite alternate ease-in-out;
        }
        @keyframes pulse-glow {
          0% { filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.4)); transform: scale(1) translateY(0px); }
          100% { filter: drop-shadow(0 0 35px rgba(245, 158, 11, 0.9)); transform: scale(1.03) translateY(-8px); }
        }
        
        .float-anim {
          animation: floating 3s ease-in-out infinite;
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .wood-shelf {
          position: relative;
          background: linear-gradient(to bottom, #d97706 0%, #b45309 100%);
          border-bottom: 10px solid #78350f;
          border-radius: 6px;
          box-shadow: inset 0 -4px 10px rgba(0,0,0,0.3), 0 10px 15px rgba(0,0,0,0.4);
          transition: all 0.3s ease;
        }
        .wood-shelf:hover {
          filter: brightness(1.15);
          transform: translateY(-2px);
        }
        .wood-shelf-active {
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.9), inset 0 -4px 10px rgba(0,0,0,0.3);
          transform: scale(1.03);
          border-bottom-color: #f59e0b;
        }
        
        .realistic-book {
          position: relative;
          background: linear-gradient(135deg, #ffffff, #f1f5f9);
          border-left: 14px solid #cbd5e1;
          border-radius: 4px 16px 16px 4px;
          box-shadow: -4px 6px 12px rgba(0,0,0,0.15);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .realistic-book:hover {
          transform: translateY(-5px) rotate(-1deg);
          box-shadow: -6px 12px 20px rgba(0,0,0,0.2);
        }
        .realistic-book-active {
          transform: scale(1.08) translateY(-10px);
          box-shadow: 0 15px 30px rgba(245, 158, 11, 0.5);
          border-left-color: #f59e0b;
        }

        .cert-font {
          font-family: 'Cairo', sans-serif !important;
        }
      `}</style>

      {/* 1. شاشة البداية */}
      {stage === 'intro' && (
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center animate-fade-in-up relative z-10">
          <img src="/Game.png" alt="Game Logo" className="w-48 h-48 mx-auto mb-4 object-contain magic-glow" onError={(e) => e.currentTarget.style.display = 'none'} />
          <h1 className="text-3xl font-black text-amber-500 mb-2">{dict.title}</h1>
          <p className="text-sm opacity-90 mb-8 font-bold text-slate-600 dark:text-slate-400">{dict.subtitle}</p>
          
          <div className={`space-y-4 mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{dict.studentName}</label>
              <input type="text" placeholder={dict.namePlaceholder} className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{dict.grade}</label>
              <input type="text" placeholder={dict.gradePlaceholder} className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold" value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)} />
            </div>
          </div>
          <button onClick={handleStart} className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xl rounded-2xl shadow-[0_10px_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 float-anim">
            {dict.start}
          </button>
        </div>
      )}

      {/* 2. شاشة التعلم */}
      {stage === 'learn' && (
        <div className="max-w-3xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl animate-zoom-in relative z-10 text-center">
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-amber-500 magic-glow" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          </div>
          <h2 className="text-3xl font-black text-amber-500 mb-4">{dict.rulesTitle}</h2>
          <p className="text-base md:text-lg leading-relaxed mb-10 opacity-90 font-bold text-slate-700 dark:text-slate-300">
            {dict.rulesText}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {DEWEY_CATEGORIES.map(cat => (
              <div key={cat.code} className="p-4 rounded-2xl text-[11px] md:text-sm font-black shadow-lg text-white float-anim" style={{ backgroundColor: cat.color, animationDelay: `${Math.random()}s` }}>
                {lang === 'ar' ? cat.ar : cat.en}
              </div>
            ))}
          </div>
          <button onClick={startChallenge1} className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-black rounded-2xl shadow-lg transition-transform active:scale-95 text-xl">
            {dict.readyBtn}
          </button>
        </div>
      )}

      {/* 3. شاشات التحديات */}
      {stage.startsWith('challenge') && currentQuestions.length > 0 && (
        <div className="max-w-5xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-8 shadow-2xl animate-fade-in-up relative z-10 flex flex-col h-full min-h-[85vh] md:min-h-0">
          
          {/* شريط الإحصائيات العلوية */}
          <div className="flex justify-between items-center mb-8 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl shadow-inner shrink-0">
            <div>
              <span className="text-amber-500 font-black text-base md:text-xl">
                {stage === 'challenge1' ? dict.ch1 : stage === 'challenge2' ? dict.ch2 : dict.ch3}
              </span>
              <div className="text-xs md:text-sm opacity-70 mt-1 font-bold">{dict.question} {qIndex + 1} / 5</div>
            </div>
            <div className="flex gap-3 md:gap-6 text-center">
              <div className="bg-white dark:bg-slate-700 px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-md border border-slate-200 dark:border-slate-600">
                <div className="text-[10px] md:text-xs opacity-70 font-black uppercase">{dict.time}</div>
                <div className={`font-black text-xl md:text-2xl ${questionTimer <= 5 ? 'text-red-500 magic-glow' : 'text-slate-800 dark:text-white'}`}>{questionTimer} <span className="text-sm">{dict.sec}</span></div>
              </div>
              <div className="bg-white dark:bg-slate-700 px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-md border border-slate-200 dark:border-slate-600">
                <div className="text-[10px] md:text-xs opacity-70 font-black uppercase">{dict.points}</div>
                <div className="font-black text-xl md:text-2xl text-green-500">{score}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between relative">
            
            {/* التغذية الراجعة (رائع / خطأ) */}
            {feedback ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 z-30 backdrop-blur-md rounded-2xl animate-zoom-in">
                {feedback === 'correct' ? (
                  <svg className="w-32 h-32 text-green-500 mb-6 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-32 h-32 text-red-500 mb-6 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                )}
                <h3 className={`text-3xl md:text-5xl font-black ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                  {feedback === 'correct' ? dict.correct : dict.wrong}
                </h3>
              </div>
            ) : null}

            {/* الجزء العلوي */}
            <div className="flex flex-col items-center justify-center mb-10 shrink-0 min-h-[160px] relative z-20">
              {stage === 'challenge3' ? (
                <div 
                  className={`w-full md:w-2/3 h-36 relative wood-shelf flex items-end justify-center pb-5 cursor-pointer ${activeDragItem ? 'wood-shelf-active' : ''}`}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, currentQuestions[qIndex].shelfCode)}
                  onClick={() => onTouchDrop(currentQuestions[qIndex].shelfCode)}
                >
                  <div className="absolute -top-8 bg-amber-50 dark:bg-slate-800 px-8 py-3 rounded-full font-black text-amber-600 shadow-lg border-2 border-amber-200 dark:border-amber-700 text-lg md:text-xl">
                    {dict.shelfText}: {currentQuestions[qIndex].displayShelf}
                  </div>
                  <p className="text-amber-100 font-bold text-sm md:text-base tracking-widest">{dict.dropInstruction}</p>
                </div>
              ) : (
                <div className="text-center w-full">
                  <p className="text-sm md:text-base font-black opacity-70 mb-6 text-slate-500 bg-slate-100 dark:bg-slate-800 inline-block px-4 py-2 rounded-full">{dict.dragInstruction}</p>
                  <div 
                    draggable
                    onDragStart={(e) => onDragStart(e, 'item')}
                    onClick={() => onTouchSelect('item')}
                    className={`realistic-book p-6 md:p-10 max-w-xl mx-auto cursor-grab active:cursor-grabbing flex items-center justify-center text-center ${activeDragItem ? 'realistic-book-active' : 'float-anim'}`}
                    style={{ borderLeftColor: '#f59e0b', color: '#0f172a' }}
                  >
                    <h3 className="font-black text-xl md:text-3xl leading-relaxed drop-shadow-sm">
                      {lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en}
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* الجزء السفلي */}
            <div className="flex-1 mt-auto shrink-0 pb-6 relative z-10">
              {stage === 'challenge3' ? (
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {currentQuestions[qIndex].options.map((opt: string, idx: number) => (
                    <div 
                      key={idx}
                      draggable
                      onDragStart={(e) => onDragStart(e, opt)}
                      onClick={() => onTouchSelect(opt)}
                      className={`realistic-book p-5 md:p-6 font-black text-sm md:text-lg text-center flex items-center justify-center min-h-[100px] cursor-grab active:cursor-grabbing text-slate-800 ${activeDragItem === opt ? 'realistic-book-active' : ''}`}
                      style={{ borderLeftColor: '#cbd5e1' }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
                  {DEWEY_CATEGORIES.map(cat => (
                    <div 
                      key={cat.code} 
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, cat.code)}
                      onClick={() => onTouchDrop(cat.code)}
                      className={`wood-shelf h-32 md:h-36 flex flex-col justify-end items-center pb-3 cursor-pointer ${activeDragItem ? 'wood-shelf-active' : ''}`}
                    >
                      <div className="bg-white/95 text-slate-900 text-xs md:text-sm font-black px-3 py-2 rounded-lg shadow-md mb-2 text-center w-11/12 truncate" style={{ borderBottom: `4px solid ${cat.color}` }}>
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

      {/* 4. شاشة الشهادة الاحترافية المتوافقة تماماً مع طباعة A4 */}
      {stage === 'certificate' && (
        <div className="w-full flex flex-col items-center animate-fade-in-up relative z-10">
          <div 
            id="certificate-area" 
            className="cert-font bg-white text-slate-900 border-[14px] border-amber-500 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between"
            style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
          >
            {/* خلفية جمالية مائية للشهادة */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }}></div>
            
            {/* رأس الشهادة */}
            <div className="flex justify-between items-center border-b-[4px] border-amber-500/30 pb-6 mb-6 relative z-10">
              <img src="/school-logo.png" alt="School Logo" className="w-24 h-24 object-contain drop-shadow-xl" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div className={`text-left ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <h2 className="text-xl md:text-2xl font-black text-red-700 uppercase tracking-widest">{dict.schoolName}</h2>
                <p className="text-xs md:text-sm text-amber-600 font-black mt-2 bg-amber-50 inline-block px-3 py-1.5 rounded-xl border border-amber-200">{dict.dept}</p>
                <p className="text-xs text-slate-500 font-bold mt-1">{dict.certDate} {issueDate}</p>
              </div>
            </div>

            {/* محتوى الشهادة */}
            <div className="text-center relative z-10 my-auto">
              <h1 className="text-3xl md:text-5xl font-black text-amber-600 mb-6 drop-shadow-sm">{dict.certTitle}</h1>
              <div className="w-36 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
              
              <p className="text-lg md:text-2xl leading-relaxed font-bold mb-4 text-slate-700">
                {dict.certAwardedTo}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 my-4 bg-slate-50 inline-block px-12 py-4 rounded-2xl border-2 border-slate-200 shadow-md">
                {studentName}
              </h2>
              <p className="text-base md:text-2xl leading-relaxed font-bold text-slate-700 mt-2">
                {dict.certGrade} <strong className="text-red-700 text-2xl md:text-3xl mx-2">{studentGrade}</strong>
              </p>
              
              <p className="text-sm md:text-lg leading-relaxed mt-6 opacity-90 max-w-3xl mx-auto font-bold text-slate-600">
                {dict.certBody}
              </p>
            </div>

            {/* إحصائيات الشهادة */}
            <div className="flex justify-center gap-8 md:gap-16 text-center relative z-10 bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 shadow-inner my-6">
              <div>
                <div className="text-xs md:text-sm text-slate-500 font-black uppercase mb-1 tracking-wider">{dict.certPoints}</div>
                <div className="text-2xl md:text-4xl font-black text-green-600">{score} <span className="text-lg text-slate-400">/ 300</span></div>
              </div>
              <div className="w-1 bg-slate-200 rounded-full"></div>
              <div>
                <div className="text-xs md:text-sm text-slate-500 font-black uppercase mb-1 tracking-wider">{dict.certTime}</div>
                <div className="text-2xl md:text-4xl font-black text-amber-600">{formatTime(totalTime)}</div>
              </div>
            </div>

            {/* توقيع الشهادة */}
            <div className="flex justify-between items-end relative z-10 px-4 md:px-8 mt-4">
              <div className="text-center">
                <p className="text-base md:text-lg font-black text-slate-800 mb-4">{dict.certSign}</p>
                <div className="w-40 md:w-56 h-[2px] bg-slate-800"></div>
              </div>
              <img src="/saqr-avatar.png" alt="Saqr Avatar" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
          </div>

          <div className="mt-10 flex gap-6 no-print relative z-10 pb-10">
            <button onClick={() => window.print()} className="px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-lg md:text-xl rounded-2xl shadow-[0_10px_20px_rgba(220,38,38,0.3)] transition-transform active:scale-95">
              {dict.print}
            </button>
            <Link to="/" className="px-8 py-4 md:px-10 md:py-5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black text-lg md:text-xl rounded-2xl shadow-lg transition-transform active:scale-95">
              {dict.back}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeweyGame;

```
