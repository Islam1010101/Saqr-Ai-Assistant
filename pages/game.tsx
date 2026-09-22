import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ==========================================
// 1. البيانات وبنوك الأسئلة
// ==========================================

const DEWEY_CATEGORIES = [
  { code: "000", label: "000 معارف وحاسب", color: "border-cyan-500 text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" },
  { code: "100", label: "100 تطوير الذات", color: "border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" },
  { code: "200", label: "200 ديانات وأخلاق", color: "border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" },
  { code: "300", label: "300 مجتمع وقانون", color: "border-orange-500 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20" },
  { code: "400", label: "400 لغات ومعاجم", color: "border-pink-500 text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20" },
  { code: "500", label: "500 علوم طبيعية", color: "border-yellow-500 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" },
  { code: "600", label: "600 طب وتكنولوجيا", color: "border-teal-500 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20" },
  { code: "700", label: "700 فنون ورياضة", color: "border-indigo-500 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" },
  { code: "800", label: "800 قصص وروايات", color: "border-rose-500 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20" },
  { code: "900", label: "900 تاريخ وجغرافيا", color: "border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20" }
];

// تحدي 1: مساعد المكتبة (سيناريوهات موسعة)
const BANK_ASSISTANT = [
  { text: "أحمد يبحث عن معلومات حول الكواكب والمجموعة الشمسية", answer: "500" },
  { text: "مريم تبحث عن قاموس لتعلم كلمات الإنجليزية", answer: "400" },
  { text: "عمر يطلب كتاباً يحكي سيرة الرسول", answer: "200" },
  { text: "سارة تريد تعلم كيفية رسم شخصيات الأنمي", answer: "700" },
  { text: "خالد يبحث عن تاريخ دولة الإمارات قديماً", answer: "900" },
  { text: "فاطمة تريد تعلم صناعة المواقع الإلكترونية", answer: "000" },
  { text: "يوسف يبحث عن كتاب حول الفيتامينات وجسم الإنسان", answer: "600" },
  { text: "علي يبحث عن ديوان شعر للإذاعة المدرسية", answer: "800" },
  { text: "هدى تريد معرفة القوانين وحقوق الطفل", answer: "300" },
  { text: "ماجد يبحث عن كتاب لتطوير تفكيره وثقته بنفسه", answer: "100" }
];

// تحدي 2: كرات المكتبة (عناوين كتب موسعة)
const BANK_ORBS = [
  { text: "كتاب: أسرار البرمجة بلغة بايثون", answer: "000" },
  { text: "كتاب: كيف تتحكم في غضبك", answer: "100" },
  { text: "كتاب: أركان الإسلام والإيمان", answer: "200" },
  { text: "كتاب: وظائف الشرطة ودورها", answer: "300" },
  { text: "كتاب: القواعد الذهبية في النحو", answer: "400" },
  { text: "كتاب: موسوعة الحيوانات المفترسة", answer: "500" },
  { text: "كتاب: كيف تصنع روبوتاً في المنزل", answer: "600" },
  { text: "كتاب: قوانين وتاريخ كأس العالم", answer: "700" },
  { text: "رواية: البؤساء", answer: "800" },
  { text: "أطلس: خريطة قارة أوروبا", answer: "900" }
];

// تحدي 3: رفوف ديوي (موسعة: اختيار الكتاب المناسب للرف)
const BANK_SHELVES = [
  { shelf: "500 علوم طبيعية", correct: "عالم البحار والمحيطات", wrongs: ["تاريخ الأندلس", "كيف ترسم شجرة", "قواعد الإملاء"] },
  { shelf: "700 فنون ورياضة", correct: "أبطال السباحة الأولمبية", wrongs: ["جسم الإنسان والأمراض", "الذكاء الاصطناعي", "قصة سندريلا"] },
  { shelf: "900 تاريخ وجغرافيا", correct: "حضارة الفراعنة", wrongs: ["تعلم الإسبانية", "أخلاق المسلم", "موسوعة الطيور"] },
  { shelf: "600 طب وتكنولوجيا", correct: "السيارات الذكية", wrongs: ["ديوان المتنبي", "خريطة أوروبا", "حقوق الإنسان"] },
  { shelf: "800 قصص وروايات", correct: "مغامرات أليس في بلاد العجائب", wrongs: ["لغات البرمجة", "تفسير القرآن", "الجاذبية الأرضية"] },
  { shelf: "200 ديانات", correct: "أخلاق المصطفى", wrongs: ["عواصم العالم", "صناعة الأدوية", "كيف تلعب الشطرنج"] },
  { shelf: "000 حاسب ومعارف", correct: "الإنترنت الآمن", wrongs: ["تاريخ الدولة الأموية", "تعلم السباحة", "قصص جحا"] }
];

const shuffleArray = (array: any[]) => [...array].sort(() => 0.5 - Math.random());

// ==========================================
// 2. مكون اللعبة الرئيسي
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

  // حالة لتتبع العنصر المسحوب (للسحب والإفلات أو النقر)
  const [activeDragItem, setActiveDragItem] = useState<string | null>(null);

  // حساب الوقت الإجمالي
  useEffect(() => {
    let interval: any;
    if (stage.startsWith('challenge')) {
      interval = setInterval(() => setTotalTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // مؤقت السؤال
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
      alert("الرجاء إدخال اسمك وصفك الدراسي لنتمكن من إصدار الشهادة!");
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
    const mixed = shuffleArray(BANK_SHELVES).slice(0, 5).map(q => ({
      ...q,
      options: shuffleArray([q.correct, ...q.wrongs])
    }));
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
    return `${m > 0 ? m + ' دقيقة و ' : ''}${s} ثانية`;
  };

  // ==============================================
  // دوال السحب والإفلات (Drag & Drop)
  // ==============================================
  const onDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
    setActiveDragItem(item);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // ضروري للسماح بالإفلات
  };

  const onDrop = (e: React.DragEvent, targetValue: string) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (item) {
      if (stage === 'challenge3') handleAnswer(item);
      else handleAnswer(targetValue);
    }
  };

  // بديل للموبايل: تحديد ثم إفلات بالنقر
  const onTouchSelect = (item: string) => setActiveDragItem(item);
  const onTouchDrop = (targetValue: string) => {
    if (activeDragItem) {
      if (stage === 'challenge3') handleAnswer(activeDragItem);
      else handleAnswer(targetValue);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-2 md:p-4 relative overflow-hidden select-none">
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-area, #certificate-area * { visibility: visible; }
          #certificate-area { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: #fff !important; }
          .no-print { display: none !important; }
        }
        /* تأثير الدولاب الفارغ */
        .shelf-slot {
          box-shadow: inset 0 10px 20px rgba(0,0,0,0.1);
        }
        .dark .shelf-slot {
          box-shadow: inset 0 10px 20px rgba(0,0,0,0.4);
        }
      `}</style>

      {/* 1. شاشة البداية */}
      {stage === 'intro' && (
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center animate-fade-in-up relative z-10">
          <div className="text-6xl mb-4 animate-bounce">🪐</div>
          <h1 className="text-3xl font-black text-amber-500 mb-2">تحدي تصنيف ديوي</h1>
          <p className="text-sm opacity-80 mb-6 font-bold">رتب أرفف المكتبة عبر السحب والإفلات!</p>
          
          <div className="space-y-4 mb-6 text-right">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block px-2">اسم البطل / البطلة:</label>
              <input type="text" placeholder="اكتب اسمك الثلاثي..." className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block px-2">الصف الدراسي:</label>
              <input type="text" placeholder="مثال: الخامس أ" className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold" value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)} />
            </div>
          </div>
          <button onClick={handleStart} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-lg rounded-xl shadow-[0_10px_20px_rgba(245,158,11,0.3)] transition-transform active:scale-95">
            بدء المغامرة 🚀
          </button>
        </div>
      )}

      {/* 2. شاشة التعلم */}
      {stage === 'learn' && (
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl animate-zoom-in relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-amber-500 mb-4">قواعد اللعبة 💡</h2>
          <p className="text-sm md:text-base leading-relaxed mb-6 opacity-90 font-medium">
            في التحديات القادمة، ستجد <strong className="text-red-500">دواليب مكتبة فارغة</strong> في الأسفل. 
            كل ما عليك فعله هو قراءة البطاقة أو الكتاب في الأعلى، ثم <strong>سحبه وإفلاته</strong> داخل الرف الصحيح!
            <br/><br/>
            <span className="text-xs opacity-70">(ملاحظة: إذا كنت تستخدم الموبايل، يمكنك النقر على البطاقة ثم النقر على الرف لتوصيلها).</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {DEWEY_CATEGORIES.map(cat => (
              <div key={cat.code} className={`p-3 rounded-xl border-b-4 text-[10px] md:text-xs font-bold shadow-sm ${cat.color}`}>
                {cat.label}
              </div>
            ))}
          </div>
          <button onClick={startChallenge1} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 text-lg">
            أنا مستعد للسحب والإفلات! 💪
          </button>
        </div>
      )}

      {/* 3. شاشات التحديات (السحب والإفلات) */}
      {stage.startsWith('challenge') && currentQuestions.length > 0 && (
        <div className="max-w-4xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-8 shadow-2xl animate-fade-in-up relative z-10 flex flex-col h-full min-h-[85vh] md:min-h-0">
          
          {/* شريط الإحصائيات */}
          <div className="flex justify-between items-center mb-6 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl shadow-inner shrink-0">
            <div>
              <span className="text-amber-500 font-black text-sm md:text-lg">
                {stage === 'challenge1' ? 'التحدي 1: ساعد المستفيد 👨‍💻' : stage === 'challenge2' ? 'التحدي 2: صنف الكرة 🔮' : 'التحدي 3: املأ الرف 📚'}
              </span>
              <div className="text-xs opacity-70 mt-1 font-bold">السؤال {qIndex + 1} من 5</div>
            </div>
            <div className="flex gap-4 text-center">
              <div className="bg-white dark:bg-slate-700 px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow">
                <div className="text-[9px] md:text-[10px] opacity-70 font-bold">الوقت</div>
                <div className={`font-black text-lg md:text-xl ${questionTimer <= 5 ? 'text-red-500 animate-pulse' : ''}`}>{questionTimer} ث</div>
              </div>
              <div className="bg-white dark:bg-slate-700 px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow">
                <div className="text-[9px] md:text-[10px] opacity-70 font-bold">النقاط</div>
                <div className="font-black text-lg md:text-xl text-green-500">{score}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between relative">
            {feedback ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 z-20 backdrop-blur-sm rounded-xl animate-zoom-in">
                <div className="text-7xl mb-6">{feedback === 'correct' ? '✅' : '❌'}</div>
                <h3 className={`text-3xl font-black ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                  {feedback === 'correct' ? 'إفلات مثالي! بطل!' : 'للأسف، الرف خاطئ!'}
                </h3>
              </div>
            ) : null}

            {/* الجزء العلوي: العنصر القابل للسحب أو الرف الهدف */}
            <div className="flex flex-col items-center justify-center mb-8 shrink-0 min-h-[160px]">
              {stage === 'challenge3' ? (
                // في التحدي 3، الأعلى هو الرف الهدف، والأسفل هي الكتب
                <div 
                  className={`w-full md:w-2/3 p-6 rounded-2xl border-4 border-dashed transition-all shelf-slot bg-slate-100 dark:bg-slate-800 ${activeDragItem ? 'border-amber-500 scale-105 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-300 dark:border-slate-600'}`}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, currentQuestions[qIndex].shelf)}
                  onClick={() => onTouchDrop(currentQuestions[qIndex].shelf)}
                >
                  <div className="text-center">
                    <p className="text-sm font-bold opacity-70 mb-2 text-slate-500">أفلت الكتاب المناسب هنا 👇</p>
                    <h3 className="text-2xl font-black text-amber-500">رف: {currentQuestions[qIndex].shelf}</h3>
                  </div>
                </div>
              ) : (
                // في التحدي 1 و 2، الأعلى هو العنصر القابل للسحب
                <div className="text-center">
                  <p className="text-sm font-bold opacity-70 mb-4 text-slate-500">اسحب هذه البطاقة إلى الرف الصحيح 👇</p>
                  <div 
                    draggable
                    onDragStart={(e) => onDragStart(e, 'item')}
                    onClick={() => onTouchSelect('item')}
                    className={`cursor-grab active:cursor-grabbing p-6 md:p-8 rounded-2xl border-2 shadow-xl transition-all duration-300 max-w-lg mx-auto ${stage === 'challenge2' ? 'rounded-full aspect-square flex items-center justify-center text-center bg-gradient-to-br from-amber-200 to-amber-500 text-slate-900 w-48 h-48 border-amber-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'} ${activeDragItem ? 'ring-4 ring-amber-500 scale-105' : 'hover:scale-105'}`}
                  >
                    <h3 className={`font-black leading-relaxed ${stage === 'challenge2' ? 'text-lg' : 'text-xl md:text-2xl'}`}>
                      {currentQuestions[qIndex].text}
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* الجزء السفلي: الأرفف الفارغة أو الكتب المتوفرة */}
            <div className="flex-1 mt-auto shrink-0">
              {stage === 'challenge3' ? (
                // التحدي 3: الكتب القابلة للسحب بالأسفل
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestions[qIndex].options.map((opt: string, idx: number) => (
                    <div 
                      key={idx}
                      draggable
                      onDragStart={(e) => onDragStart(e, opt)}
                      onClick={() => onTouchSelect(opt)}
                      className={`cursor-grab active:cursor-grabbing p-4 rounded-xl border-l-4 border-b-2 bg-white dark:bg-slate-800 shadow-md font-bold text-sm text-center flex items-center justify-center min-h-[80px] transition-all ${activeDragItem === opt ? 'ring-4 ring-amber-500 border-amber-500 scale-105' : 'border-slate-300 hover:border-amber-400'}`}
                    >
                      📖 {opt}
                    </div>
                  ))}
                </div>
              ) : (
                // التحديات 1 و 2: الأرفف الفارغة بالأسفل
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {DEWEY_CATEGORIES.map(cat => (
                    <div 
                      key={cat.code} 
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, cat.code)}
                      onClick={() => onTouchDrop(cat.code)}
                      className={`shelf-slot cursor-pointer flex flex-col items-center justify-center text-center p-3 rounded-xl border-2 border-dashed transition-all min-h-[90px] ${activeDragItem ? 'border-amber-500 animate-pulse bg-amber-50 dark:bg-amber-900/10' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 bg-slate-100/50 dark:bg-slate-800/50'}`}
                    >
                      <div className={`text-[10px] md:text-xs font-black px-2 py-1 rounded mb-1 bg-white dark:bg-slate-900 shadow-sm border-b-2 ${cat.color.split(' ')[0]}`}>
                        {cat.label}
                      </div>
                      <div className="text-xl opacity-30">📥</div>
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
          <div id="certificate-area" className="w-[850px] max-w-full bg-white text-slate-900 border-[16px] border-amber-500 p-12 rounded-2xl shadow-2xl relative overflow-hidden">
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
                قد اجتاز <strong className="text-slate-900">لعبة تحدي صقر لتصنيف ديوي العشري (الإصدار التفاعلي)</strong> بنجاح وتفوق، 
                وأثبت مهارة عالية في ترتيب الأرفف المكتبية وتصنيف المعرفة بذكاء.
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
