import './challengesMobileResponsive.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { supabase } from '../src/utils/supabase';
import './gameIntroVisual.css';

// -----------------------------------------------------------------------------
// Library Heroes — playful, responsive Dewey Decimal learning game.
// Theme is inherited from the website (html/body .dark or data-theme="dark").
// -----------------------------------------------------------------------------
type Lang = 'ar' | 'en';
type GameStage = 'intro' | 'learn' | 'tut1' | 'challenge1' | 'tut2' | 'challenge2' | 'tut3' | 'challenge3' | 'certificate';
type Feedback = 'correct' | 'wrong' | null;

const T = {
  ar: {
    title: 'تحدّي أبطال المكتبة', subtitle: 'مغامرة ممتعة لترتيب الكتب وفتح وسام أمين المكتبة الصغير!', studentName: 'اسم البطل', grade: 'الصف الدراسي', start: 'هيا نبدأ المغامرة!', rulesTitle: 'مرحباً بك في مدينة الكتب!', rulesText: 'المكتبة مدينة مليئة بالمعرفة، وكل شارع فيها له رقم ولون. تعلّم التصنيفات، ثم اسحب الكتب إلى أماكنها الصحيحة، وساعد صاروخك في إصابة كواكب المعرفة!', readyBtn: 'فهمت، إلى التدريب!',
    ch1: 'المهمة ١: ساعد القرّاء', ch2: 'المهمة ٢: صائد كواكب المعرفة', ch3: 'المهمة ٣: رتّب الأرفف', question: 'السؤال', time: 'الوقت', points: 'النقاط', sec: 'ث', correct: 'إجابة مذهلة! أنت بطل المعرفة!', wrong: 'محاولة رائعة! تعلّم وحاول من جديد.', dragInstruction: 'اسحب بطاقة الكتاب إلى الرف صاحب التصنيف الصحيح', dropInstruction: 'أفلت الكتاب هنا', shelfText: 'الرف المطلوب', certTitle: 'شهادة أمين المكتبة الصغير المتميز', certAwardedTo: 'تُمنح هذه الشهادة للبطل / البطلة', certGrade: 'الصف الدراسي', certBody: 'لإتمام مغامرة تنظيم الكتب والتعرّف على تصنيفات ديوي العشري. لقد أظهر شغفاً بالمعرفة ومهارة رائعة في مساعدة القرّاء وتنظيم المكتبة.', certPoints: 'النقاط', certTime: 'وقت الإنجاز', certDate: 'تاريخ الإصدار:', certSign: 'اعتماد أمين المكتبة', print: 'طباعة الشهادة', back: 'العودة للمكتبة', schoolName: 'مدرسة صقر الإمارات الدولية الخاصة', dept: 'قسم المكتبة الرقمية والتفاعلية', minutes: 'دقيقة و', seconds: 'ثانية', fireBtn: 'أطلق شعاع المعرفة!', shootInstruction: 'حرّك الصاروخ نحو التصنيف الصحيح ثم أطلق الشعاع!', tutorialBtn: 'أنا جاهز، لنلعب!', tutCh1Title: 'المهمة ١: ساعد القرّاء', tutCh1Desc: 'اقرأ ما يبحث عنه الطالب. اسحب بطاقة السؤال وأفلتها على الرف المناسب. كل إجابة صحيحة تمنحك ٢٠ نقطة!', tutCh2Title: 'المهمة ٢: صائد كواكب المعرفة', tutCh2Desc: 'اقرأ عنوان الكتاب، ثم حرّك الصاروخ أسفل كوكب التصنيف الصحيح وأطلق شعاع المعرفة. كل إصابة صحيحة = ٢٠ نقطة!', tutCh3Title: 'المهمة ٣: رتّب الأرفف', tutCh3Desc: 'شاهد التصنيف المكتوب فوق الرف، ثم اسحب عنوان الكتاب الصحيح من البطاقات وضعه على الرف. كل إجابة صحيحة = ٢٠ نقطة!', pointsSaved: 'رائع! تم حفظ نقاطك في ملفك 🌟', progress: 'تقدّم المغامرة', loading: 'نجهّز مغامرتك...', step: 'المرحلة', missionTip: 'تلميحة البطل', timeUp: 'انتهى الوقت! لا بأس، المحاولة القادمة فرصتك!', savedPending: 'جارٍ حفظ النقاط...', savedFail: 'تعذّر حفظ النقاط الآن. أبلغ أمين المكتبة إذا استمرت المشكلة.', badge: 'وسام أمين المكتبة الصغير', chapter: 'مهمة', outOf: 'من',
  },
  en: {
    title: "Library Heroes Challenge", subtitle: 'A playful adventure to sort books and earn your Junior Librarian badge!', studentName: "Hero's name", grade: 'Grade', start: 'Start the adventure!', rulesTitle: 'Welcome to Book City!', rulesText: 'The library is a city of knowledge, and each colorful street has a number. Learn the categories, put books on the right shelves, and guide your rocket to the planets of knowledge!', readyBtn: 'Got it — let’s train!',
    ch1: 'Mission 1: Help the Readers', ch2: 'Mission 2: Knowledge Planet Blaster', ch3: 'Mission 3: Fill the Shelves', question: 'Question', time: 'Time', points: 'Points', sec: 's', correct: 'Brilliant answer! Knowledge hero!', wrong: 'Great try! Learn and give it another go.', dragInstruction: 'Drag the book card to the matching category shelf', dropInstruction: 'Drop the book here', shelfText: 'Target shelf', certTitle: 'Outstanding Junior Librarian Certificate', certAwardedTo: 'This certificate is proudly awarded to', certGrade: 'Grade', certBody: 'For completing the library adventure and learning the Dewey Decimal categories. You showed curiosity, a love of knowledge, and excellent skill in organizing books for readers.', certPoints: 'Score', certTime: 'Time taken', certDate: 'Issue date:', certSign: 'Librarian approval', print: 'Print certificate', back: 'Back to library', schoolName: "Emirates Falcon International Private School", dept: 'Digital & Interactive Library Department', minutes: 'min and', seconds: 'sec', fireBtn: 'Fire the knowledge beam!', shootInstruction: 'Move the rocket under the right category, then fire!', tutorialBtn: "I'm ready — let's play!", tutCh1Title: 'Mission 1: Help the Readers', tutCh1Desc: 'Read what the student needs. Drag the question card to the matching shelf. Every correct answer earns 20 points!', tutCh2Title: 'Mission 2: Knowledge Planet Blaster', tutCh2Desc: 'Read the book title, move the rocket under the correct category planet, then fire your knowledge beam. Every hit earns 20 points!', tutCh3Title: 'Mission 3: Fill the Shelves', tutCh3Desc: 'Check the category on the target shelf, then drag the matching book title onto it. Every correct answer earns 20 points!', pointsSaved: 'Amazing! Your points were saved 🌟', progress: 'Adventure progress', loading: 'Preparing your adventure...', step: 'Stage', missionTip: 'Hero tip', timeUp: 'Time is up! No worries — you can do better next time!', savedPending: 'Saving your points...', savedFail: 'Points could not be saved right now. Please contact the librarian if this continues.', badge: 'Junior Librarian Badge', chapter: 'Mission', outOf: 'of',
  },
} satisfies Record<Lang, Record<string, string>>;

const DEWEY_CATEGORIES = [
  { code: '000', ar: '000: حاسب ومعارف عامة', en: '000: Computers & General', shortAr: 'حاسب ومعارف', shortEn: 'Computers', color: '#0284c7', emoji: '💻' },
  { code: '100', ar: '100: تطوير الذات وفلسفة', en: '100: Self Growth & Philosophy', shortAr: 'تطوير الذات', shortEn: 'Mind & Self', color: '#9333ea', emoji: '🧠' },
  { code: '200', ar: '200: دين وأخلاق', en: '200: Religion & Ethics', shortAr: 'دين وأخلاق', shortEn: 'Religion', color: '#16a34a', emoji: '🌱' },
  { code: '300', ar: '300: مجتمع وقانون', en: '300: Society & Law', shortAr: 'مجتمع وقانون', shortEn: 'Society', color: '#ea580c', emoji: '🤝' },
  { code: '400', ar: '400: لغات وقواميس', en: '400: Languages & Lexicons', shortAr: 'لغات وقواميس', shortEn: 'Languages', color: '#db2777', emoji: '🔤' },
  { code: '500', ar: '500: علوم وفضاء', en: '500: Science & Space', shortAr: 'علوم وفضاء', shortEn: 'Science', color: '#ca8a04', emoji: '🔭' },
  { code: '600', ar: '600: تكنولوجيا وطب', en: '600: Tech & Medicine', shortAr: 'تقنية وطب', shortEn: 'Tech & Med', color: '#0d9488', emoji: '🧬' },
  { code: '700', ar: '700: فنون ورياضة', en: '700: Arts & Sports', shortAr: 'فنون ورياضة', shortEn: 'Arts & Sport', color: '#4f46e5', emoji: '🎨' },
  { code: '800', ar: '800: قصص وحكايات', en: '800: Literature & Stories', shortAr: 'قصص وحكايات', shortEn: 'Stories', color: '#e11d48', emoji: '📖' },
  { code: '900', ar: '900: تاريخ وجغرافيا', en: '900: History & Geography', shortAr: 'تاريخ وجغرافيا', shortEn: 'History', color: '#dc2626', emoji: '🌍' },
];

const BANK_ASSISTANT = [
  { ar: 'أحمد يبحث عن كتب حول الكواكب والمجموعات الشمسية', en: 'Ahmed is researching planets and solar systems', answer: '500' },
  { ar: 'مريم تريد قاموساً للترجمة بين العربية والإنجليزية', en: 'Maryam wants a dictionary to translate Arabic and English', answer: '400' },
  { ar: 'عمر يريد كتاباً عن قصص الأنبياء ومعجزاتهم', en: 'Omar wants a book about stories of the Prophets', answer: '200' },
  { ar: 'سارة تريد تعلم رسم الشخصيات وتصميم اللوحات', en: 'Sarah wants to learn cartoon drawing and painting', answer: '700' },
  { ar: 'خالد يبحث عن تاريخ قيام اتحاد دولة الإمارات', en: 'Khalid is researching the history of the UAE Union', answer: '900' },
  { ar: 'فاطمة تحب برمجة الكمبيوتر وتصميم المواقع', en: 'Fatima loves computer programming and web design', answer: '000' },
  { ar: 'يوسف يريد دليلاً عن الفيتامينات وصحة الإنسان', en: 'Yousef wants a guide to vitamins and human health', answer: '600' },
  { ar: 'علي يطلب ديوان شعر لإلقائه في الإذاعة المدرسية', en: 'Ali needs a poem for the school assembly', answer: '800' },
  { ar: 'هدى تكتب بحثاً عن حقوق الطفل وقوانين الأسرة', en: 'Huda is writing about children’s rights and family law', answer: '300' },
  { ar: 'ماجد يبحث عن كتاب لبناء الثقة بالنفس وتطوير الذات', en: 'Majid wants a guide to confidence and personal growth', answer: '100' },
  { ar: 'ليلى تبحث عن أطلس يوضح تضاريس قارات العالم', en: 'Laila is looking for a world atlas', answer: '900' },
  { ar: 'سعيد يريد رواية مغامرات في الغابات الاستوائية', en: 'Saeed wants an adventure novel set in a rainforest', answer: '800' },
  { ar: 'راشد يسأل عن عالم الحشرات وعجائب النباتات', en: 'Rashed is curious about insects and plants', answer: '500' },
  { ar: 'منى ترغب في كتيب للإسعافات الأولية المنزلية', en: 'Mona wants a home first-aid handbook', answer: '600' },
  { ar: 'حسن يسأل عن قواعد النطق في اللغة الفرنسية', en: 'Hassan wants to learn French pronunciation', answer: '400' },
  { ar: 'نورة تبحث عن موسوعة الروبوت والاختراعات التقنية', en: 'Noura wants an encyclopedia of robotics and inventions', answer: '600' },
  { ar: 'طارق يريد قراءة السيرة النبوية', en: 'Tariq wants to read about the Prophet’s life', answer: '200' },
  { ar: 'عبير تبحث عن طرق التغلب على التوتر', en: 'Abeer is looking for ways to manage stress', answer: '100' },
  { ar: 'جمال يحتاج كتاباً عن استراتيجيات الشطرنج', en: 'Jamal needs a book about chess strategies', answer: '700' },
  { ar: 'سالم يريد شرحاً لأمن المعلومات وحماية الحسابات', en: 'Salem wants to learn cybersecurity and account safety', answer: '000' },
];

const BANK_ORBS = [
  { ar: 'كتاب: الذكاء الاصطناعي ومستقبل الحاسوب', en: 'Book: AI and the Future of Computing', answer: '000' },
  { ar: 'كتاب: إدارة الغضب والتفكير الإيجابي', en: 'Book: Anger Management and Positive Thinking', answer: '100' },
  { ar: 'كتاب: أركان الإسلام والعقيدة الصحيحة', en: 'Book: Pillars of Islam and Faith', answer: '200' },
  { ar: 'كتاب: قوانين المرور والسلامة في المجتمع', en: 'Book: Traffic Safety and Community Laws', answer: '300' },
  { ar: 'كتاب: قواعد النحو والإعراب الميسّر', en: 'Book: Arabic Grammar Made Easy', answer: '400' },
  { ar: 'كتاب: الثقوب السوداء والمجرات البعيدة', en: 'Book: Black Holes and Distant Galaxies', answer: '500' },
  { ar: 'كتاب: الهندسة الميكانيكية وصناعة الطائرات', en: 'Book: Engineering and Aircraft Design', answer: '600' },
  { ar: 'كتاب: أسرار الغوص والتصوير تحت الماء', en: 'Book: Scuba Diving and Underwater Photography', answer: '700' },
  { ar: 'رواية: مغامرات وقصص عالمية', en: 'Novel: Adventures and World Fables', answer: '800' },
  { ar: 'كتاب: تاريخ القلاع والحصون القديمة', en: 'Book: Ancient Castles and Fortresses', answer: '900' },
];

const BANK_SHELVES = [
  { shelfCode: '500', arShelf: '500: علوم وفضاء', enShelf: '500: Science & Space', arCorrect: 'أسرار الفضاء وقوانين الجاذبية', enCorrect: 'Space Secrets & Gravity', arWrongs: ['تاريخ الدولة العباسية', 'تعلّم الرسم الزيتي', 'قواعد الإملاء العربية'], enWrongs: ['Abbasid History', 'Oil Painting', 'Arabic Spelling'] },
  { shelfCode: '700', arShelf: '700: فنون ورياضة', enShelf: '700: Arts & Sports', arCorrect: 'قوانين السباحة والجمباز', enCorrect: 'Swimming & Gymnastics Rules', arWrongs: ['تشريح خلايا الكبد', 'برمجة المواقع', 'تحليل القصة القصيرة'], enWrongs: ['Liver Anatomy', 'Web Programming', 'Short Story Analysis'] },
  { shelfCode: '900', arShelf: '900: تاريخ وجغرافيا', enShelf: '900: History & Geography', arCorrect: 'تاريخ قلاع وحصون الإمارات', enCorrect: 'History of UAE Forts', arWrongs: ['محادثات بالإسبانية', 'أخلاق المؤمن', 'حياة الطيور المائية'], enWrongs: ['Spanish Dialogues', 'Ethics', 'Water Birds'] },
  { shelfCode: '600', arShelf: '600: تكنولوجيا وطب', enShelf: '600: Tech & Medicine', arCorrect: 'صناعة الروبوت والسيارات الذكية', enCorrect: 'Robotics & Smart Cars', arWrongs: ['ديوان شعر المتنبي', 'أطلس أوروبا', 'حقوق المواطنة'], enWrongs: ['Poetry Collection', 'Atlas of Europe', 'Citizenship Rights'] },
  { shelfCode: '800', arShelf: '800: قصص وحكايات', enShelf: '800: Literature & Stories', arCorrect: 'حكايات كليلة ودمنة', enCorrect: 'Kalila wa Dimna Fables', arWrongs: ['لغات البرمجة السحابية', 'تفسير سورة الكهف', 'قوانين الديناميكا الحرارية'], enWrongs: ['Cloud Coding', 'Quran Exegesis', 'Thermodynamics'] },
];

const shuffleArray = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const DeweyGame: React.FC = () => {
  const { locale } = useLanguage();
  const lang: Lang = locale === 'en' ? 'en' : 'ar';
  const dict = T[lang];

  const [userData, setUserData] = useState<any>(null);
  const [userType, setUserType] = useState<'student' | 'teacher' | 'admin' | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [pointsSaved, setPointsSaved] = useState(false);
  const [pointsSaveFailed, setPointsSaveFailed] = useState(false);
  const pointsSaveLock = useRef(false);

  const [stage, setStage] = useState<GameStage>('intro');
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(20);
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [issueDate, setIssueDate] = useState('');
  const [ch1Options, setCh1Options] = useState<any[]>([]);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [dragItemInfo, setDragItemInfo] = useState<{ id: string; type: 'q' | 'opt'; content?: string } | null>(null);
  const [hoveredDropZone, setHoveredDropZone] = useState<string | null>(null);
  const [rocketPos, setRocketPos] = useState(1);
  const [ch2Options, setCh2Options] = useState<any[]>([]);
  const [isShooting, setIsShooting] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  const isDraggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragDataRef = useRef<{ id: string; type: 'q' | 'opt'; content?: string } | null>(null);
  const floatingElementRef = useRef<HTMLDivElement | null>(null);
  const dropZonesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const stageRef = useRef(stage);
  const handleAnswerRef = useRef<(answer: string) => void>(() => undefined);
  const handleTimeoutRef = useRef<() => void>(() => undefined);
  stageRef.current = stage;

  useEffect(() => {
    const storedUser = localStorage.getItem('current_user');
    const storedType = localStorage.getItem('user_type');
    if (!storedUser || !storedType) {
      window.location.href = '/login';
      return;
    }
    if (storedType === 'teacher') {
      window.location.href = '/home';
      return;
    }
    try {
      const user = JSON.parse(storedUser);
      setUserData(user);
      setUserType(storedType as 'student' | 'admin');
      const displayName = lang === 'ar' ? (user.name_ar || user.name_en || user.full_name || user.name) : (user.name_en || user.name_ar || user.full_name || user.name);
      setStudentName(storedType === 'admin' ? (lang === 'ar' ? 'أدمن (تجريبي)' : 'Admin (Demo)') : (displayName || (lang === 'ar' ? 'بطل المكتبة' : 'Library Hero')));
      setStudentGrade(storedType === 'admin' ? '—' : String(user.grade || user.class_name || '—'));
    } catch {
      window.location.href = '/login';
    }
  }, [lang]);

  useEffect(() => {
    const dateStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    setIssueDate(dateStr);
  }, [lang, stage]);

  useEffect(() => {
    if (stage.startsWith('challenge')) {
      document.body.classList.add('hide-site-header');
    } else {
      document.body.classList.remove('hide-site-header');
    }
    return () => document.body.classList.remove('hide-site-header');
  }, [stage]);

  useEffect(() => {
    if (!stage.startsWith('challenge')) return;
    const interval = window.setInterval(() => setTotalTime(t => t + 1), 1000);
    return () => window.clearInterval(interval);
  }, [stage]);

  const cleanupDrag = useCallback(() => {
    isDraggingRef.current = false;
    pointerIdRef.current = null;
    dragDataRef.current = null;
    setIsDraggingState(false);
    setDragItemInfo(null);
    setHoveredDropZone(null);
    if (floatingElementRef.current) floatingElementRef.current.style.display = 'none';
  }, []);

  const nextQuestion = useCallback(() => {
    cleanupDrag();
    setFeedback(null);
    setIsShooting(false);
    setTimeExpired(false);
    if (qIndex < 4) {
      const nextIdx = qIndex + 1;
      setQIndex(nextIdx);
      setQuestionTimer(20);
      if (stage === 'challenge1') generateCh1Options(currentQuestions[nextIdx]?.answer);
      else if (stage === 'challenge2') {
        generateCh2Options(currentQuestions[nextIdx]?.answer);
        setRocketPos(1);
      }
    } else {
      if (stage === 'challenge1') setStage('tut2');
      else if (stage === 'challenge2') setStage('tut3');
      else if (stage === 'challenge3') setStage('certificate');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, stage, currentQuestions, cleanupDrag]);

  const handleAnswer = useCallback((providedAnswer: string) => {
    if (feedback || !currentQuestions[qIndex]) return;
    const question = currentQuestions[qIndex];
    const isCorrect = stage === 'challenge3' ? providedAnswer === question.correct : providedAnswer === question.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 20);
    cleanupDrag();
    window.setTimeout(() => nextQuestion(), 1350);
  }, [feedback, currentQuestions, qIndex, stage, cleanupDrag, nextQuestion]);
  handleAnswerRef.current = handleAnswer;

  const handleTimeout = useCallback(() => {
    if (feedback || !stageRef.current.startsWith('challenge')) return;
    setFeedback('wrong');
    setTimeExpired(true);
    cleanupDrag();
    window.setTimeout(() => nextQuestion(), 1350);
  }, [feedback, cleanupDrag, nextQuestion]);
  handleTimeoutRef.current = handleTimeout;

  useEffect(() => {
    if (!stage.startsWith('challenge') || feedback) return;
    if (questionTimer <= 0) {
      handleTimeoutRef.current();
      return;
    }
    const interval = window.setInterval(() => setQuestionTimer(t => Math.max(0, t - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [stage, questionTimer, feedback]);

  useEffect(() => {
    if (stage !== 'certificate' || userType !== 'student' || !userData || score <= 0 || pointsSaved || pointsSaveLock.current) return;
    const savePoints = async () => {
      pointsSaveLock.current = true;
      setPointsSaveFailed(false);
      try {
        const { data: student, error: readError } = await supabase.from('students').select('points').eq('student_id', userData.student_id).single();
        if (readError) throw readError;
        const newPoints = (Number(student?.points ?? userData.points) || 0) + score;
        const { error: updateError } = await supabase.from('students').update({ points: newPoints }).eq('student_id', userData.student_id);
        if (updateError) throw updateError;
        const updatedUser = { ...userData, points: newPoints };
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setPointsSaved(true);
      } catch (error) {
        console.error('Failed to save Dewey game points:', error);
        setPointsSaveFailed(true);
      } finally {
        pointsSaveLock.current = false;
      }
    };
    void savePoints();
  }, [stage, userType, userData, score, pointsSaved]);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => { if (isDraggingRef.current) e.preventDefault(); };
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, []);

  const handleStart = () => {
    setScore(0); setTotalTime(0); setQuestionTimer(20); setPointsSaved(false); setPointsSaveFailed(false); setFeedback(null); setTimeExpired(false); pointsSaveLock.current = false; setStage('learn');
  };

  function generateCh1Options(correctAnswer: string) {
    if (!correctAnswer) return;
    const correctObj = DEWEY_CATEGORIES.find(c => c.code === correctAnswer)!;
    const wrongOptions = shuffleArray(DEWEY_CATEGORIES.filter(c => c.code !== correctAnswer)).slice(0, 3);
    setCh1Options(shuffleArray([correctObj, ...wrongOptions]));
  }
  function generateCh2Options(correctAnswer: string) {
    if (!correctAnswer) return;
    const correctObj = DEWEY_CATEGORIES.find(c => c.code === correctAnswer)!;
    const wrongOptions = shuffleArray(DEWEY_CATEGORIES.filter(c => c.code !== correctAnswer)).slice(0, 3);
    setCh2Options(shuffleArray([correctObj, ...wrongOptions]));
  }

  const startChallenge1 = () => {
    const qList = shuffleArray(BANK_ASSISTANT).slice(0, 5);
    setCurrentQuestions(qList); setQIndex(0); setQuestionTimer(20); setFeedback(null); setTimeExpired(false); generateCh1Options(qList[0].answer); setStage('challenge1');
  };
  const startChallenge2 = () => {
    const qList = shuffleArray(BANK_ORBS).slice(0, 5);
    setCurrentQuestions(qList); setQIndex(0); setQuestionTimer(20); setFeedback(null); setTimeExpired(false); setRocketPos(1); generateCh2Options(qList[0].answer); setStage('challenge2');
  };
  const startChallenge3 = () => {
    const mixed = shuffleArray(BANK_SHELVES).slice(0, 5).map(q => {
      const correct = lang === 'ar' ? q.arCorrect : q.enCorrect;
      const wrongs = lang === 'ar' ? q.arWrongs : q.enWrongs;
      return { shelfCode: q.shelfCode, displayShelf: lang === 'ar' ? q.arShelf : q.enShelf, correct, options: shuffleArray([correct, ...wrongs.slice(0, 3)]) };
    });
    setCurrentQuestions(mixed); setQIndex(0); setQuestionTimer(20); setFeedback(null); setTimeExpired(false); setStage('challenge3');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60); const s = seconds % 60;
    return `${m > 0 ? `${m} ${dict.minutes} ` : ''}${s} ${dict.seconds}`;
  };
  const updateFloatingPos = (x: number, y: number) => {
    if (floatingElementRef.current) floatingElementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(1.04)`;
  };
  const checkDropZones = (x: number, y: number) => {
    let found: string | null = null;
    dropZonesRef.current.forEach((el, key) => {
      if (!el?.isConnected) return;
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) found = key;
    });
    setHoveredDropZone(found);
    return found;
  };
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>, id: string, type: 'q' | 'opt', content?: string) => {
    if (feedback || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault(); pointerIdRef.current = e.pointerId; isDraggingRef.current = true;
    const item = { id, type, content }; dragDataRef.current = item; setDragItemInfo(item); setIsDraggingState(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* Pointer capture is optional. */ }
    if (floatingElementRef.current) { floatingElementRef.current.style.display = 'flex'; updateFloatingPos(e.clientX, e.clientY); }
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !dragDataRef.current || (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current)) return;
      e.preventDefault(); updateFloatingPos(e.clientX, e.clientY); checkDropZones(e.clientX, e.clientY);
    };
    const onUp = (e: PointerEvent) => {
      if (!isDraggingRef.current || !dragDataRef.current || (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current)) return;
      const droppedOn = checkDropZones(e.clientX, e.clientY); const item = dragDataRef.current; const activeStage = stageRef.current;
      if (droppedOn) handleAnswerRef.current(activeStage === 'challenge3' ? (item.content || item.id) : droppedOn);
      cleanupDrag();
    };
    const onCancel = (e: PointerEvent) => { if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return; cleanupDrag(); };
    window.addEventListener('pointermove', onMove, { passive: false }); window.addEventListener('pointerup', onUp); window.addEventListener('pointercancel', onCancel);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onCancel); };
  }, [cleanupDrag]);

  const handleShoot = useCallback(() => {
    if (feedback || isShooting || !ch2Options[rocketPos]) return;
    setIsShooting(true);
    try { const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1666/1666-preview.mp3'); audio.volume = 0.12; void audio.play().catch(() => undefined); } catch { /* Audio is optional. */ }
    const answer = ch2Options[rocketPos].code;
    window.setTimeout(() => handleAnswerRef.current(answer), 280);
  }, [rocketPos, ch2Options, feedback, isShooting]);

  useEffect(() => {
    if (stage !== 'challenge2' || feedback) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); setRocketPos(p => lang === 'ar' ? Math.max(0, p - 1) : Math.min(3, p + 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setRocketPos(p => lang === 'ar' ? Math.min(3, p + 1) : Math.max(0, p - 1)); }
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleShoot(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stage, lang, handleShoot, feedback]);

  if (!userData) return <div className="dewey-game dewey-loading" dir={lang === 'ar' ? 'rtl' : 'ltr'}><span className="loading-book">📚</span><strong>{dict.loading}</strong></div>;

  const renderTutorial = (mission: 1 | 2 | 3) => {
    const data = mission === 1
      ? { title: dict.tutCh1Title, desc: dict.tutCh1Desc, icon: '📚', color: '#0284c7', start: startChallenge1, hint: lang === 'ar' ? 'لاحظ رقم الرف ولونه قبل السحب.' : 'Check the shelf number and color before dragging.', visual: ['🧒🏻', '📘', '🗄️'] }
      : mission === 2
      ? { title: dict.tutCh2Title, desc: dict.tutCh2Desc, icon: '🚀', color: '#db2777', start: startChallenge2, hint: lang === 'ar' ? 'حرّك الصاروخ خطوة خطوة نحو الكوكب الصحيح.' : 'Move the rocket one step at a time toward the right planet.', visual: ['🪐', '✨', '🚀'] }
      : { title: dict.tutCh3Title, desc: dict.tutCh3Desc, icon: '🏆', color: '#d97706', start: startChallenge3, hint: lang === 'ar' ? 'اقرأ اسم التصنيف على الرف أولاً.' : 'Read the category name on the shelf first.', visual: ['📗', '🧠', '🏆'] };
    return (
      <section className="game-panel tutorial-panel" style={{ ['--mission-color' as any]: data.color }} aria-labelledby={`tutorial-${mission}`}>
        <div className="tutorial-topline"><span className="mission-pill">{dict.chapter} {mission} {dict.outOf} 3</span><span className="tutorial-stars" aria-hidden="true">⭐ ⭐ ⭐</span></div>
        <div className="tutorial-illustration" aria-hidden="true"><span>{data.visual[0]}</span><span className="tutorial-arrow">➜</span><span>{data.visual[1]}</span><span className="tutorial-arrow">➜</span><span>{data.visual[2]}</span></div>
        <div className="tutorial-icon" aria-hidden="true">{data.icon}</div>
        <h2 id={`tutorial-${mission}`} className="panel-title">{data.title}</h2>
        <p className="panel-copy">{data.desc}</p>
        <div className="hero-tip"><span aria-hidden="true">💡</span><div><strong>{dict.missionTip}</strong><p>{data.hint}</p></div></div>
        <div className="tutorial-progress" aria-label={`${dict.progress}: ${mission} / 3`}><span style={{ width: `${(mission / 3) * 100}%` }} /></div>
        <button onClick={data.start} className="primary-action" style={{ background: `linear-gradient(135deg, ${data.color}, color-mix(in srgb, ${data.color} 66%, #4338ca))` }}>{dict.tutorialBtn} <span aria-hidden="true">🚀</span></button>
      </section>
    );
  };

  return (
    <div className={`dewey-game ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'} ${stage.startsWith('challenge') ? 'gameplay-mode' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        .dewey-game { --ink:#172033; --muted:#536176; --panel:#fff; --line:#dbe5ef; --shadow:0 20px 60px rgba(23,37,58,.13); box-sizing:border-box; min-height:100vh; min-height:100dvh; width:100%; padding:clamp(10px,2vw,28px); display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; isolation:isolate; overflow-x:hidden; color:var(--ink); background-color:#fff!important; background-image:radial-gradient(ellipse at 8% 8%,rgba(45,212,191,.10),transparent 30%),radial-gradient(ellipse at 92% 88%,rgba(96,165,250,.10),transparent 34%); font-family:'Cairo',ui-sans-serif,system-ui,sans-serif; }
        .dewey-game * { box-sizing:border-box; font-family:'Cairo',ui-sans-serif,system-ui,sans-serif; }
        .dewey-game::before { content:''; position:fixed; inset:0; z-index:-1; pointer-events:none; opacity:.35; background-image:radial-gradient(rgba(100,116,139,.28) .8px,transparent .8px); background-size:23px 23px; }
        /* The website owns theme state. These selectors follow its global theme without local state or controls. */
        html.dark .dewey-game, body.dark .dewey-game, .dark .dewey-game, html[data-theme='dark'] .dewey-game, body[data-theme='dark'] .dewey-game, [data-bs-theme='dark'] .dewey-game, html[data-mode='dark'] .dewey-game { --ink:#f8fafc; --muted:#b7c3d4; --panel:#111827; --line:#303d50; --shadow:0 22px 70px rgba(0,0,0,.42); color:var(--ink); background-color:#050505!important; background-image:radial-gradient(ellipse at 8% 8%,rgba(13,148,136,.17),transparent 32%),radial-gradient(ellipse at 92% 88%,rgba(59,130,246,.15),transparent 34%); }
        html.dark .dewey-game::before, body.dark .dewey-game::before, .dark .dewey-game::before, html[data-theme='dark'] .dewey-game::before, body[data-theme='dark'] .dewey-game::before, [data-bs-theme='dark'] .dewey-game::before, html[data-mode='dark'] .dewey-game::before { opacity:.22; background-image:radial-gradient(rgba(203,213,225,.24) .8px,transparent .8px); }
        .dewey-game .dir-rtl { direction:rtl; } .dewey-game.dir-rtl { direction:rtl; } .dewey-game.dir-ltr { direction:ltr; }
        body.hide-site-header header, body.hide-site-header nav, body.hide-site-header .site-header, body.hide-site-header [role='banner'], body.hide-site-header nav-bar { display:none!important; }
        .game-shell { width:min(100%,820px); position:relative; z-index:1; }
        .game-panel { width:100%; color:var(--ink); background:rgba(255,255,255,.96); border:1px solid var(--line); border-radius:30px; padding:clamp(18px,4vw,34px); box-shadow:var(--shadow); position:relative; overflow:hidden; }
        .game-panel::before { content:''; position:absolute; top:-50px; inset-inline-end:-35px; width:150px; height:150px; border-radius:50%; background:var(--mission-color,rgba(20,184,166,.10)); opacity:.10; pointer-events:none; }
        html.dark .dewey-game .game-panel, body.dark .dewey-game .game-panel, .dark .dewey-game .game-panel, html[data-theme='dark'] .dewey-game .game-panel, body[data-theme='dark'] .dewey-game .game-panel, [data-bs-theme='dark'] .dewey-game .game-panel, html[data-mode='dark'] .dewey-game .game-panel { color:#f8fafc; background:rgba(17,24,39,.96); }
        .game-panel > * { position:relative; z-index:1; }
        .hero-brand { display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:10px; }
        .hero-logo-wrap { width:clamp(88px,17vw,128px); aspect-ratio:1; border-radius:28px; display:grid; place-items:center; background:linear-gradient(140deg,#fef3c7,#fde68a 45%,#d1fae5); border:3px solid white; box-shadow:0 14px 30px rgba(245,158,11,.18); overflow:hidden; transform:rotate(-3deg); }
        .hero-logo-wrap img { width:90%; height:90%; object-fit:contain; }
        .fallback-logo { font-size:clamp(42px,7vw,60px); line-height:1; }
        .game-kicker { display:inline-flex; align-items:center; gap:7px; background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; border-radius:999px; padding:6px 12px; font-size:11px; font-weight:900; margin-bottom:10px; }
        .game-title { margin:0; color:#0f766e; font-size:clamp(25px,5vw,38px); font-weight:900; line-height:1.25; letter-spacing:-.4px; }
        html.dark .dewey-game .game-title, body.dark .dewey-game .game-title, .dark .dewey-game .game-title, html[data-theme='dark'] .dewey-game .game-title, body[data-theme='dark'] .dewey-game .game-title, [data-bs-theme='dark'] .dewey-game .game-title, html[data-mode='dark'] .dewey-game .game-title { color:#5eead4; }
        .game-subtitle { color:var(--muted); font-size:clamp(12px,2vw,15px); font-weight:700; line-height:1.9; margin:8px auto 20px; max-width:580px; }
        .profile-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:14px 16px; display:grid; grid-template-columns:1fr 1fr; gap:12px; text-align:start; margin:18px 0 20px; }
        html.dark .dewey-game .profile-card, body.dark .dewey-game .profile-card, .dark .dewey-game .profile-card, html[data-theme='dark'] .dewey-game .profile-card, body[data-theme='dark'] .dewey-game .profile-card, [data-bs-theme='dark'] .dewey-game .profile-card, html[data-mode='dark'] .dewey-game .profile-card { background:#080d16; border-color:#334155; }
        .profile-field { display:flex; align-items:center; gap:10px; min-width:0; } .profile-field + .profile-field { border-inline-start:1px solid #d9e2ec; padding-inline-start:12px; } html.dark .dewey-game .profile-field + .profile-field, .dark .dewey-game .profile-field + .profile-field { border-color:#334155; }
        .profile-icon { width:38px; height:38px; border-radius:14px; display:grid; place-items:center; flex:0 0 auto; background:#fff7ed; font-size:20px; } .profile-label { font-size:10px; font-weight:900; color:#b45309; margin-bottom:3px; } .profile-value { font-size:13px; font-weight:900; color:var(--ink); overflow-wrap:anywhere; }
        .primary-action,.secondary-action { min-height:50px; width:100%; border:0; border-radius:16px; display:flex; align-items:center; justify-content:center; gap:9px; padding:12px 18px; font-weight:900; font-size:clamp(14px,2.5vw,17px); cursor:pointer; touch-action:manipulation; transition:transform .18s ease,filter .18s ease,box-shadow .18s ease; }
        .primary-action { color:#fff; background:linear-gradient(135deg,#10b981,#0f766e); box-shadow:0 7px 0 rgba(6,95,70,.24),0 14px 22px rgba(16,185,129,.18); } .primary-action:hover { filter:brightness(1.06); transform:translateY(-2px); } .primary-action:active { transform:translateY(2px); box-shadow:0 2px 0 rgba(6,95,70,.24); }
        .secondary-action { color:#334155; background:#f1f5f9; border:1px solid #dbe4ef; } html.dark .dewey-game .secondary-action, .dark .dewey-game .secondary-action { color:#e2e8f0;background:#1e293b;border-color:#334155; }
        .primary-action:focus-visible,.secondary-action:focus-visible,.game-action:focus-visible { outline:3px solid #38bdf8; outline-offset:3px; }
        .panel-title { font-size:clamp(22px,4vw,30px); font-weight:900; line-height:1.35; margin:8px 0 10px; color:var(--ink); }
        .panel-copy { color:var(--muted); font-weight:700; font-size:clamp(13px,2.2vw,16px); line-height:2; margin:0 auto 18px; max-width:620px; }
        .learn-heading { text-align:center; margin-bottom:16px; } .learn-icon { width:70px;height:70px;border-radius:24px;display:grid;place-items:center;margin:0 auto 12px;background:linear-gradient(135deg,#fef3c7,#fde68a);font-size:38px;box-shadow:0 12px 22px rgba(245,158,11,.15); }
        .category-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin:18px 0; }
        .category-tile { display:flex; align-items:center; gap:10px; min-height:64px; border-radius:16px; padding:10px; color:white; box-shadow:0 7px 14px rgba(15,23,42,.12); text-align:start; border:2px solid rgba(255,255,255,.45); }
        .category-tile-emoji { width:34px;height:34px;border-radius:12px;background:rgba(255,255,255,.20);display:grid;place-items:center;font-size:20px;flex:0 0 auto; }
        .category-tile-text { font-weight:900;font-size:clamp(10px,1.7vw,12px);line-height:1.5; }
        .learn-footer { margin-top:14px; padding-top:14px; border-top:1px solid var(--line); }
        .tutorial-panel { --mission-color:#0284c7; max-width:600px; margin:auto; text-align:center; }
        .tutorial-topline { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:14px; }
        .mission-pill { background:color-mix(in srgb,var(--mission-color) 12%,white); border:1px solid color-mix(in srgb,var(--mission-color) 30%,white); color:var(--mission-color); padding:6px 11px; border-radius:999px; font-size:11px; font-weight:900; }
        .tutorial-stars { font-size:clamp(12px,2vw,18px); letter-spacing:2px; }
        .tutorial-illustration { min-height:110px; border-radius:22px; display:flex; align-items:center; justify-content:center; gap:clamp(5px,2vw,18px); padding:16px 10px; margin-bottom:14px; background:linear-gradient(135deg,color-mix(in srgb,var(--mission-color) 12%,white),#f8fafc); border:1px dashed color-mix(in srgb,var(--mission-color) 35%,white); font-size:clamp(28px,7vw,50px); }
        html.dark .dewey-game .tutorial-illustration, .dark .dewey-game .tutorial-illustration { background:linear-gradient(135deg,#172033,#0b1220);border-color:#334155; }
        .tutorial-arrow { color:var(--mission-color);font-size:clamp(18px,4vw,28px);font-weight:900; }
        .tutorial-icon { width:70px;height:70px;display:grid;place-items:center;margin:-4px auto 8px;border-radius:24px;background:color-mix(in srgb,var(--mission-color) 12%,white);border:2px solid color-mix(in srgb,var(--mission-color) 25%,white);font-size:40px;box-shadow:0 8px 18px rgba(15,23,42,.08); }
        .hero-tip { display:flex;align-items:flex-start;gap:10px;text-align:start;background:#fffbeb;border:1px solid #fde68a;border-radius:16px;padding:12px 14px;margin:18px 0;color:#78350f; } .hero-tip>span { font-size:22px; } .hero-tip strong { display:block;font-size:12px;font-weight:900;margin-bottom:2px; } .hero-tip p { font-size:12px;line-height:1.8;margin:0;font-weight:700; }
        html.dark .dewey-game .hero-tip, .dark .dewey-game .hero-tip { background:#2a1c0b;border-color:#854d0e;color:#fde68a; }
        .tutorial-progress { height:8px;border-radius:999px;background:#e2e8f0;overflow:hidden;margin:14px 0 18px; } .tutorial-progress span { display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#34d399,#38bdf8);transition:width .3s ease; }
        .dewey-loading { gap:12px;font-size:16px;font-weight:900; } .loading-book { font-size:56px;animation:book-bob 1s ease-in-out infinite alternate; }
        @keyframes book-bob { from{transform:translateY(3px) rotate(-5deg)} to{transform:translateY(-8px) rotate(5deg)} }
        @keyframes sparkle-pop { 0%{transform:scale(.85) rotate(-5deg)} 50%{transform:scale(1.07) rotate(3deg)} 100%{transform:scale(1) rotate(0)} }
        .magic-glow { animation:sparkle-pop 2.4s ease-in-out infinite; }
        .gameplay-mode { justify-content:flex-start; padding:clamp(6px,1.4vw,18px); }
        .compact-layout { width:min(100%,1100px); min-height:min(720px,94dvh); display:flex;flex-direction:column;gap:12px;padding:clamp(10px,2vw,22px);border-radius:28px;border:1px solid var(--line);background:var(--panel);box-shadow:var(--shadow);color:var(--ink); }
        html.dark .dewey-game .compact-layout,body.dark .dewey-game .compact-layout,.dark .dewey-game .compact-layout,html[data-theme='dark'] .dewey-game .compact-layout,body[data-theme='dark'] .dewey-game .compact-layout,[data-bs-theme='dark'] .dewey-game .compact-layout,html[data-mode='dark'] .dewey-game .compact-layout { background:#101010;border-color:#2b3340; }
        .challenge-topbar { display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-radius:20px;background:#f1f5f9;border:1px solid #dbe4ef;flex:0 0 auto; } html.dark .dewey-game .challenge-topbar,.dark .dewey-game .challenge-topbar { background:#171c26;border-color:#303a4a; }
        .challenge-title { font-size:clamp(13px,2.4vw,20px);font-weight:900;color:#0f766e;display:block;line-height:1.5; } html.dark .dewey-game .challenge-title,.dark .dewey-game .challenge-title { color:#5eead4; }
        .challenge-meta { font-size:11px;font-weight:800;color:var(--muted); }
        .stat-row { display:flex;gap:7px; } .stat-card { min-width:64px;padding:6px 9px;border-radius:14px;background:#fff;border:1px solid #dbe4ef;text-align:center; } html.dark .dewey-game .stat-card,.dark .dewey-game .stat-card { background:#090d14;border-color:#303a4a; }
        .stat-label { display:block;color:var(--muted);font-size:9px;font-weight:900; } .stat-value { display:block;font-size:clamp(15px,2.6vw,22px);font-weight:900;line-height:1.3;color:#0f766e; } .timer-danger { color:#e11d48!important;animation:timer-wiggle .45s ease-in-out infinite alternate; } @keyframes timer-wiggle { to{transform:scale(1.12)} }
        .progress-labels { display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:10px;font-weight:900;margin-bottom:5px; } .progress-track { height:8px;border-radius:999px;overflow:hidden;background:#e2e8f0; } .progress-fill { height:100%;border-radius:inherit;background:linear-gradient(90deg,#10b981,#38bdf8,#f59e0b);transition:width .35s ease; }
        html.dark .dewey-game .progress-track,.dark .dewey-game .progress-track { background:#263244; }
        .challenge-board { flex:1;min-height:0;display:flex;flex-direction:column;justify-content:space-between;gap:14px;position:relative;overflow:hidden; }
        .question-wrap { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;flex:0 0 auto; }
        .drag-hint { display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;background:#ecfeff;color:#0e7490;border:1px solid #a5f3fc;font-weight:900;font-size:11px; } html.dark .dewey-game .drag-hint,.dark .dewey-game .drag-hint { background:#0b2530;color:#67e8f9;border-color:#155e75; }
        .realistic-book { position:relative;min-height:64px;background:linear-gradient(145deg,#fff,#f1f5f9);border:1px solid #cbd5e1;border-inline-start:8px solid #f59e0b;border-radius:12px 20px 20px 12px;box-shadow:0 8px 16px rgba(15,23,42,.10),inset 0 1px 0 white;color:#1e293b;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease; }
        .realistic-book:active { transform:scale(.985); } html.dark .dewey-game .realistic-book,.dark .dewey-game .realistic-book { background:linear-gradient(145deg,#1f2937,#111827);border-color:#3f4c60;border-inline-start-color:#fbbf24;color:#f8fafc;box-shadow:0 8px 18px rgba(0,0,0,.25); }
        .question-book { width:min(100%,650px);padding:clamp(14px,2vw,24px);display:flex;align-items:center;justify-content:center;gap:12px;text-align:center;cursor:grab;border-width:1px;border-inline-start-width:9px;touch-action:none; }
        .question-book-icon { flex:0 0 auto;font-size:clamp(26px,4vw,38px); } .question-book-text { font-size:clamp(13px,2.7vw,20px);font-weight:900;line-height:1.8; }
        .shelf-grid { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;width:100%;align-items:stretch; }
        .wood-shelf { position:relative;min-height:90px;border-radius:16px 16px 12px 12px;padding:10px 8px 9px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:9px;background:linear-gradient(180deg,#dba66a,#a86f3d);border:2px solid #f5d0a1;border-bottom:8px solid #704421;box-shadow:inset 0 -2px 4px rgba(60,35,12,.15),0 8px 14px rgba(15,23,42,.12);transition:transform .15s ease,filter .15s ease,box-shadow .15s ease;cursor:default; }
        .shelf-label { max-width:100%;display:flex;align-items:center;justify-content:center;gap:5px;padding:6px 8px;border-radius:11px;background:rgba(15,23,42,.93);color:white;font-weight:900;font-size:clamp(10px,1.9vw,13px);text-align:center;line-height:1.4;border-bottom:3px solid var(--shelf-color,#14b8a6); }
        .shelf-emoji { font-size:clamp(19px,3vw,26px);filter:drop-shadow(0 3px 2px rgba(0,0,0,.15)); }
        .drop-target { min-height:82px;touch-action:none;cursor:grab;display:flex;align-items:center;justify-content:center;padding:10px;font-weight:900;font-size:clamp(10px,2vw,14px);text-align:center;line-height:1.6; }
        .is-hovered { outline:4px solid #facc15!important;outline-offset:2px;filter:brightness(1.12);transform:translateY(-3px) scale(1.015); }
        .shelf-drop-zone { width:min(100%,700px);min-height:112px;margin:12px auto 6px;position:relative;display:flex;align-items:center;justify-content:center;border-radius:20px; }
        .shelf-drop-zone .shelf-label { position:absolute;top:-10px;z-index:2;max-width:95%;background:#fffbeb;color:#78350f;border:1px solid #fbbf24;white-space:normal; }
        .shelf-drop-zone .drop-message { margin-top:20px;color:#fff7ed;font-size:12px;font-weight:900; }
        .drag-ghost { position:fixed;left:0;top:0;z-index:9999;display:none;pointer-events:none;align-items:center;justify-content:center;max-width:220px;min-height:58px;padding:12px;border:2px solid #fbbf24;background:#fffbeb;color:#422006;border-radius:14px;box-shadow:0 15px 40px rgba(0,0,0,.28);font-weight:900;text-align:center;will-change:transform; }
        .space-arena { flex:1;min-height:280px;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:clamp(10px,2vw,20px);border-radius:22px;border:2px solid #25354e;background-color:#050b1c;color:#f8fafc;background-image:radial-gradient(circle at 14% 25%,rgba(34,211,238,.17),transparent 24%),radial-gradient(circle at 85% 65%,rgba(129,140,248,.22),transparent 28%),radial-gradient(circle at 50% 8%,rgba(255,255,255,.10),transparent 30%); }
        .space-arena::before { content:'✦  ·   ✧  ·  ✦  ·   ✧  ·  ✦';position:absolute;inset:16% 0 auto;text-align:center;letter-spacing:18px;color:#bae6fd;opacity:.32;font-size:22px;pointer-events:none; }
        .space-question { position:relative;z-index:2;max-width:720px;margin:0 auto 10px;padding:10px 14px;border-radius:16px;background:rgba(15,23,42,.92);border:1px solid #334155;color:#fef3c7;text-align:center;font-size:clamp(12px,2.4vw,18px);font-weight:900;line-height:1.7; }
        .planet-row { display:flex;justify-content:space-between;gap:5px;position:relative;z-index:2;flex:0 0 auto; }
        .planet-column { display:flex;flex-direction:column;align-items:center;gap:7px;width:25%;min-width:0; }
        .planet-chip { width:clamp(50px,8vw,86px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1px;padding:4px;text-align:center;color:white;font-weight:900;font-size:clamp(8px,1.4vw,11px);line-height:1.3;border:3px solid rgba(255,255,255,.72);box-shadow:0 0 0 5px rgba(255,255,255,.05),0 0 25px color-mix(in srgb,var(--planet-color) 55%,transparent);animation:planet-float 3s ease-in-out infinite alternate; }
        .planet-code { font-size:clamp(10px,1.8vw,14px);font-weight:900; } @keyframes planet-float { to{transform:translateY(-5px)} }
        .rocket-field { flex:1;min-height:115px;position:relative;margin:8px 0 12px; }
        .rocket-lanes { position:absolute;inset:0;display:flex;justify-content:space-between;padding-inline:2%;pointer-events:none; }
        .rocket-lane { width:25%;display:flex;justify-content:center;border-inline-start:1px dashed rgba(103,232,249,.17); }
        .rocket-row { position:absolute;inset-inline:0;bottom:2px;display:flex;justify-content:space-between;padding-inline:2%;z-index:4; }
        .rocket-slot { width:25%;display:flex;justify-content:center;align-items:flex-end;min-height:72px;position:relative; }
        .rocket-svg { width:clamp(38px,7vw,66px);height:clamp(38px,7vw,66px);color:#67e8f9;filter:drop-shadow(0 0 12px rgba(34,211,238,.7));animation:rocket-hover .55s ease-in-out infinite alternate; }
        @keyframes rocket-hover { to{transform:translateY(-5px) rotate(3deg)} }
        .laser-beam { position:absolute;bottom:45px;width:5px;height:35px;background:#67e8f9;box-shadow:0 0 12px #22d3ee,0 0 24px #0891b2;border-radius:10px;animation:shoot-up .28s linear forwards;z-index:20; }
        @keyframes shoot-up { from{bottom:45px;opacity:1} to{bottom:100%;opacity:0} }
        .rocket-controls { display:flex;justify-content:center;gap:10px;align-items:center;z-index:5; }
        .rocket-control { min-width:48px;min-height:45px;padding:8px 14px;border:1px solid #155e75;border-radius:14px;background:#0e2940;color:#67e8f9;font-weight:900;font-size:20px;cursor:pointer; }
        .rocket-fire { flex:1;max-width:300px;background:linear-gradient(135deg,#22d3ee,#2563eb);border-color:#7dd3fc;color:#082f49;font-size:13px;letter-spacing:.2px; }
        .feedback-overlay { position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(2,6,23,.93);color:white;z-index:50;backdrop-filter:blur(8px);border-radius:20px;text-align:center;padding:20px; }
        .feedback-icon { display:grid;place-items:center;width:76px;height:76px;border-radius:50%;font-size:42px;border:3px solid currentColor;box-shadow:0 0 30px currentColor;animation:feedback-pop .36s ease-out; }
        .feedback-overlay.correct .feedback-icon { color:#34d399;background:rgba(16,185,129,.14); } .feedback-overlay.wrong .feedback-icon { color:#fb7185;background:rgba(244,63,94,.14); }
        .feedback-title { font-size:clamp(19px,4vw,30px);font-weight:900;line-height:1.5;margin:0; } .feedback-subtitle { font-size:12px;opacity:.82;font-weight:700; }
        @keyframes feedback-pop { from{transform:scale(.4) rotate(-15deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        .certificate-panel { width:min(95%,720px);background:white;color:#0f172a;border:5px double #d97706;border-radius:28px;padding:clamp(16px,4vw,36px);box-shadow:0 24px 70px rgba(2,8,23,.22); }
        .cert-font { font-family:'Cairo',sans-serif!important; } .cert-header { display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:2px solid #f59e0b;padding-bottom:14px;margin-bottom:16px; }
        .cert-school { font-size:clamp(11px,2vw,17px);font-weight:900;line-height:1.6; } .cert-dept { display:inline-block;margin-top:4px;padding:3px 8px;border-radius:7px;background:#fffbeb;color:#92400e;font-weight:800;font-size:10px; }
        .cert-name { display:inline-block;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:8px 20px;color:#0f172a;font-size:clamp(18px,4vw,28px);font-weight:900;margin:12px 0;overflow-wrap:anywhere; }
        .cert-stats { display:flex;justify-content:center;gap:clamp(20px,6vw,60px);padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:16px;margin:20px 0; }
        .cert-stat-label { font-size:10px;color:#64748b;font-weight:900; } .cert-stat-value { font-size:clamp(19px,4vw,28px);font-weight:900;color:#047857; }
        .cert-buttons { width:min(95%,720px);display:flex;gap:10px;margin-top:14px; } .cert-buttons a,.cert-buttons button { min-height:48px;display:flex;align-items:center;justify-content:center;flex:1;border:0;border-radius:14px;font-weight:900;text-decoration:none;padding:10px;cursor:pointer; }
        .saved-chip { display:inline-block;background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;border-radius:999px;padding:5px 10px;font-size:11px;font-weight:900; }
        .cert-font, #certificate-area-print { font-family:'Cairo',sans-serif!important; }
        @media (min-width:680px) { .category-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.shelf-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.wood-shelf{min-height:132px}.challenge-board{gap:18px}.question-book{min-height:105px} }
        @media (max-width:480px) { .dewey-game{padding:8px}.game-panel{border-radius:24px;padding:17px}.profile-card{padding:11px;gap:8px}.profile-icon{width:32px;height:32px;font-size:17px}.profile-value{font-size:11px}.challenge-topbar{padding:8px;gap:5px}.stat-card{min-width:53px;padding:5px}.compact-layout{min-height:94dvh;border-radius:20px;padding:9px;gap:9px}.category-tile{min-height:58px;padding:8px}.shelf-grid{gap:8px}.wood-shelf{min-height:80px}.space-arena{min-height:290px}.cert-buttons{flex-direction:column} }
        @media (max-height:650px) and (orientation:landscape) { .compact-layout{min-height:98dvh;gap:6px}.space-arena{min-height:190px}.tutorial-illustration{min-height:70px}.tutorial-icon{width:52px;height:52px;font-size:30px}.tutorial-panel{padding:14px}.panel-copy{margin-bottom:8px}.hero-tip{margin:8px 0;padding:8px} }
        @media (prefers-reduced-motion:reduce) { .dewey-game *, .dewey-game *::before,.dewey-game *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important} }
        @media print { @page{size:A4 portrait;margin:0} html,body{width:210mm!important;height:297mm!important;margin:0!important;padding:0!important;background:#fff!important;overflow:hidden!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important} body *{visibility:hidden!important} #certificate-print-container,#certificate-print-container *{visibility:visible!important} #certificate-print-container{position:fixed!important;inset:0!important;width:210mm!important;height:297mm!important;padding:8mm!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;background:#fff!important} #certificate-area-print{width:194mm!important;height:275mm!important;box-sizing:border-box!important;border:12px double #b45309!important;border-radius:20px!important;padding:12mm!important;background:#fff!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important;page-break-inside:avoid!important;break-inside:avoid!important} .no-print{display:none!important} }
      `}</style>

      <div ref={floatingElementRef} className="drag-ghost" style={{ width: dragItemInfo?.type === 'q' ? 230 : 175, fontSize: dragItemInfo?.type === 'q' ? '13px' : '12px' }}>
        {dragItemInfo?.content || (currentQuestions[qIndex] ? (lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en) : '')}
      </div>

      {stage === 'intro' && (
        <main className="game-shell game-panel game-intro-stage" style={{ textAlign: 'center' }}>
          <div className="game-intro-ambient" aria-hidden="true" />
          <div className="game-intro-hero">
            <div className="game-intro-copy">
              <span className="game-kicker">✨ {dict.badge} ✨</span>
              <h1 className="game-title">{dict.title}</h1>
              <p className="game-subtitle">{dict.subtitle}</p>
            </div>
            <div className="game-intro-art">
              <span className="game-intro-halo" aria-hidden="true" />
              <span className="game-intro-ring" aria-hidden="true" />
              <span className="game-intro-ring game-intro-ring--second" aria-hidden="true" />
              <span className="game-intro-float game-intro-float--book" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6c-3-2-7-2-9-1v14c3-1 7-1 9 1 3-2 7-2 9-1V5c-3-1-7-1-9 1Zm0 0v14"/></svg>
              </span>
              <span className="game-intro-float game-intro-float--idea" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6m-5 3h4M8 15a7 7 0 1 1 8 0c-1 .7-1.5 1.4-1.5 3h-5C9.5 16.4 9 15.7 8 15zM12 2v2"/></svg>
              </span>
              <span className="game-intro-float game-intro-float--star" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 2.6 7.3L22 12l-7.4 2.7L12 22l-2.6-7.3L2 12l7.4-2.7L12 2Z"/></svg>
              </span>
              <span className="game-intro-float game-intro-float--shelves" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4zM10 4v16m4-16v16M4 16h16M6 8h2m9 2 1 4"/></svg>
              </span>
              <span className="game-intro-spark game-intro-spark--one" aria-hidden="true" />
              <span className="game-intro-spark game-intro-spark--two" aria-hidden="true" />
              <span className="game-intro-character-fallback" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2"><path d="M24 12C16 7 10 7 4 10v30c8-2 14-2 20 3 6-5 12-5 20-3V10c-7-3-13-3-20 2Zm0 0v31"/></svg>
              </span>
              <img className="game-intro-character" src="/Game.png" alt={lang === 'ar' ? 'شخصية صقر بطل المكتبة' : 'Saqr, the Library Hero'} onError={e => { e.currentTarget.style.display = 'none'; }} />
            </div>
          </div>
          <div className="game-intro-details">
            <div className="profile-card">
              <div className="profile-field"><span className="profile-icon" aria-hidden="true">🦸</span><div><div className="profile-label">{dict.studentName}</div><div className="profile-value">{studentName}</div></div></div>
              <div className="profile-field"><span className="profile-icon" aria-hidden="true">🎓</span><div><div className="profile-label">{dict.grade}</div><div className="profile-value">{studentGrade || '—'}</div></div></div>
            </div>
            <button onClick={handleStart} className="primary-action">{dict.start} <span className="game-intro-button-icon" aria-hidden="true">🚀</span></button>
            <p className="game-subtitle game-intro-note" style={{ marginBottom: 0, marginTop: 15, fontSize: 11 }}>📘 ٣ مهام ممتعة · ⭐ نقاط ومكافآت · 🏆 شهادة إنجاز</p>
          </div>
        </main>
      )}

      {stage === 'learn' && (
        <main className="game-shell game-panel">
          <div className="learn-heading"><div className="learn-icon" aria-hidden="true">🗺️</div><span className="game-kicker">🌟 {dict.step} 0 / 3</span><h2 className="panel-title">{dict.rulesTitle}</h2><p className="panel-copy">{dict.rulesText}</p></div>
          <div className="category-grid">
            {DEWEY_CATEGORIES.map(cat => <div key={cat.code} className="category-tile" style={{ background: `linear-gradient(135deg,${cat.color},color-mix(in srgb,${cat.color} 70%,#0f172a))` }}><span className="category-tile-emoji" aria-hidden="true">{cat.emoji}</span><span className="category-tile-text">{lang === 'ar' ? cat.ar : cat.en}</span></div>)}
          </div>
          <div className="learn-footer"><button onClick={() => setStage('tut1')} className="primary-action">{dict.readyBtn} <span aria-hidden="true">👉</span></button></div>
        </main>
      )}

      {stage === 'tut1' && renderTutorial(1)}
      {stage === 'tut2' && renderTutorial(2)}
      {stage === 'tut3' && renderTutorial(3)}

      {stage.startsWith('challenge') && currentQuestions.length > 0 && (
        <main className="compact-layout">
          <header className="challenge-topbar">
            <div><span className="challenge-title">{stage === 'challenge1' ? dict.ch1 : stage === 'challenge2' ? dict.ch2 : dict.ch3}</span><span className="challenge-meta">{dict.question} {qIndex + 1} / 5</span></div>
            <div className="stat-row"><div className="stat-card"><span className="stat-label">⏱ {dict.time}</span><span className={`stat-value ${questionTimer <= 5 ? 'timer-danger' : ''}`}>{questionTimer}{dict.sec}</span></div><div className="stat-card"><span className="stat-label">⭐ {dict.points}</span><span className="stat-value">{score}</span></div></div>
          </header>
          <div aria-label={`${dict.progress}: ${qIndex + 1} / 5`}><div className="progress-labels"><span>{dict.progress}</span><span>{qIndex + 1} / 5</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${((qIndex + 1) / 5) * 100}%` }} /></div></div>

          <div className="challenge-board">
            {feedback && <div className={`feedback-overlay ${feedback}`} role="status" aria-live="polite"><div className="feedback-icon" aria-hidden="true">{feedback === 'correct' ? '✓' : '↻'}</div><h3 className="feedback-title">{timeExpired ? dict.timeUp : feedback === 'correct' ? dict.correct : dict.wrong}</h3><span className="feedback-subtitle">{feedback === 'correct' ? '+20 ⭐' : '💪 لا تستسلم، البطل يتعلم من كل محاولة!'}</span></div>}

            {stage !== 'challenge2' && <>
              <div className="question-wrap">
                {stage === 'challenge3' ? (
                  <div ref={el => { if (el) dropZonesRef.current.set(currentQuestions[qIndex].shelfCode, el); else dropZonesRef.current.delete(currentQuestions[qIndex].shelfCode); }} className={`wood-shelf shelf-drop-zone ${hoveredDropZone === currentQuestions[qIndex].shelfCode ? 'is-hovered' : ''}`}>
                    <div className="shelf-label">🎯 {dict.shelfText}: {currentQuestions[qIndex].displayShelf}</div><div className="shelf-emoji" aria-hidden="true">🗄️</div><p className="drop-message">{dict.dropInstruction}</p>
                  </div>
                ) : <>
                  <span className="drag-hint">☝️ {dict.dragInstruction}</span>
                  <div onPointerDown={e => handleDragStart(e, 'question-card', 'q')} className="realistic-book question-book" style={{ touchAction: 'none', opacity: isDraggingState && dragDataRef.current?.type === 'q' ? .24 : 1 }}>
                    <span className="question-book-icon" aria-hidden="true">📘</span><h3 className="question-book-text">{lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en}</h3><span aria-hidden="true">↕️</span>
                  </div>
                </>}
              </div>
              <div className="shelf-grid">
                {stage === 'challenge3' ? currentQuestions[qIndex].options.map((opt: string, idx: number) => <div key={`${qIndex}-${opt}`} onPointerDown={e => handleDragStart(e, opt, 'opt', opt)} className={`realistic-book drop-target ${isDraggingState && dragDataRef.current?.id === opt ? 'dragging-source' : ''}`} style={{ touchAction: 'none', opacity: isDraggingState && dragDataRef.current?.id === opt ? .25 : 1 }}><span aria-hidden="true" style={{ fontSize: 23, marginInlineEnd: 6 }}>{['📕','📗','📙','📘'][idx]}</span>{opt}</div>) : ch1Options.map(cat => <div key={cat.code} ref={el => { if (el) dropZonesRef.current.set(cat.code, el); else dropZonesRef.current.delete(cat.code); }} className={`wood-shelf ${hoveredDropZone === cat.code ? 'is-hovered' : ''}`}><span className="shelf-emoji" aria-hidden="true">{cat.emoji}</span><div className="shelf-label" style={{ ['--shelf-color' as any]: cat.color }}>{cat.code} · {lang === 'ar' ? cat.shortAr : cat.shortEn}</div></div>)}
              </div>
            </>}

            {stage === 'challenge2' && (
              <div className="space-arena">
                <p className="drag-hint" style={{ alignSelf: 'center', marginBottom: 10 }}>{dict.shootInstruction}</p>
                <div className="space-question">{lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en}</div>
                <div className="planet-row">{ch2Options.map((opt, idx) => <div key={opt.code} className="planet-column"><div className="planet-chip" style={{ background: `radial-gradient(circle at 28% 25%,#fff8,transparent 30%),${opt.color}`, ['--planet-color' as any]: opt.color, outline: rocketPos === idx ? '3px solid #facc15' : 'none', outlineOffset: 3 }}><span style={{ fontSize: 22 }}>{opt.emoji}</span><span className="planet-code">{opt.code}</span><span>{lang === 'ar' ? opt.shortAr : opt.shortEn}</span></div>{rocketPos === idx && <span style={{ color: '#fde68a', fontSize: 11, fontWeight: 900 }}>🎯</span>}</div>)}</div>
                <div className="rocket-field"><div className="rocket-lanes">{[0,1,2,3].map(i => <div className="rocket-lane" key={i} />)}</div><div className="rocket-row">{[0,1,2,3].map(pos => <div className="rocket-slot" key={pos}>{rocketPos === pos && <><svg className="rocket-svg" fill="currentColor" viewBox="0 0 24 24" aria-label="Rocket"><path d="M12 2.5 8 10h8l-4-7.5ZM7.4 11.5 4.5 20l7.5-3 7.5 3-2.9-8.5H7.4Z"/><path d="M9.5 18.5 8 22l4-2 4 2-1.5-3.5" fill="#fb923c"/></svg>{isShooting && <div className="laser-beam" style={{ left: '50%', transform: 'translateX(-50%)' }} />}</>}</div>)}</div></div>
                <div className="rocket-controls"><button className="rocket-control" onClick={() => setRocketPos(p => lang === 'ar' ? Math.min(3, p + 1) : Math.max(0, p - 1))} aria-label={lang === 'ar' ? 'تحريك الصاروخ يميناً' : 'Move rocket left'}>{lang === 'ar' ? '◀' : '◀'}</button><button className="rocket-control rocket-fire" onClick={handleShoot} disabled={!!feedback || isShooting}>{dict.fireBtn} 🚀</button><button className="rocket-control" onClick={() => setRocketPos(p => lang === 'ar' ? Math.max(0, p - 1) : Math.min(3, p + 1))} aria-label={lang === 'ar' ? 'تحريك الصاروخ يساراً' : 'Move rocket right'}>▶</button></div>
              </div>
            )}
          </div>
        </main>
      )}

      {stage === 'certificate' && (
        <div className="game-shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div id="certificate-print-container" style={{ display: 'none' }}>
            <div id="certificate-area-print" className="certificate-panel cert-font" style={{ height: '275mm', width: '194mm', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="cert-header"><img src="/school-logo.png" alt="School logo" style={{ width: 75, height: 75, objectFit: 'contain' }} onError={e => { e.currentTarget.style.display = 'none'; }} /><div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}><div className="cert-school">{dict.schoolName}</div><span className="cert-dept">{dict.dept}</span><div style={{ fontSize: 10, color: '#64748b', marginTop: 5 }}>{dict.certDate} {issueDate}</div></div></div>
              <div style={{ textAlign: 'center', margin: 'auto 0' }}><div style={{ fontSize: 30, fontWeight: 900, color: '#b45309' }}>{dict.certTitle}</div><div style={{ width: 120, height: 4, borderRadius: 99, background: '#f59e0b', margin: '14px auto' }} /><p style={{ fontWeight: 800 }}>{dict.certAwardedTo}</p><div className="cert-name">{studentName}</div><p style={{ fontWeight: 800 }}>{dict.certGrade}: <strong style={{ color: '#92400e' }}>{studentGrade}</strong></p><p style={{ fontSize: 13, lineHeight: 2, color: '#475569', marginTop: 20 }}>{dict.certBody}</p></div>
              <div className="cert-stats"><div><div className="cert-stat-label">{dict.certPoints}</div><div className="cert-stat-value">{score} / 300</div></div><div><div className="cert-stat-label">{dict.certTime}</div><div className="cert-stat-value" style={{ color: '#b45309' }}>{formatTime(totalTime)}</div></div></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}><div style={{ fontWeight: 900 }}>{dict.certSign}<div style={{ width: 140, borderTop: '2px solid #334155', marginTop: 18 }} /></div><img src="/saqr-avatar.png" alt="Saqr mascot" style={{ width: 80, height: 80, objectFit: 'contain' }} onError={e => { e.currentTarget.style.display = 'none'; }} /></div>
            </div>
          </div>
          <section className="certificate-panel cert-font" style={{ width: '100%' }}>
            <div className="cert-header"><img src="/school-logo.png" alt="School logo" style={{ width: 58, height: 58, objectFit: 'contain' }} onError={e => { e.currentTarget.style.display = 'none'; }} /><div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}><div className="cert-school">{dict.schoolName}</div><span className="cert-dept">{dict.dept}</span><div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{dict.certDate} {issueDate}</div></div></div>
            <div style={{ textAlign: 'center', padding: '12px 0' }}><div style={{ fontSize: 'clamp(20px,4vw,30px)', fontWeight: 900, color: '#b45309', lineHeight: 1.5 }}>{dict.certTitle}</div><div style={{ width: 95, height: 4, borderRadius: 99, background: '#f59e0b', margin: '10px auto 16px' }} /><p style={{ fontSize: 13, fontWeight: 800, color: '#475569' }}>{dict.certAwardedTo}</p><div className="cert-name">{studentName}</div><p style={{ fontSize: 13, fontWeight: 800, color: '#475569' }}>{dict.certGrade}: <strong style={{ color: '#92400e' }}>{studentGrade}</strong></p><p style={{ fontSize: 12, lineHeight: 1.9, color: '#475569', marginTop: 14 }}>{dict.certBody}</p></div>
            <div className="cert-stats"><div><div className="cert-stat-label">{dict.certPoints}</div><div className="cert-stat-value">{score} <span style={{ fontSize: 11, color: '#94a3b8' }}>/ 300</span></div></div><div style={{ width: 1, background: '#fde68a' }} /><div><div className="cert-stat-label">{dict.certTime}</div><div className="cert-stat-value" style={{ color: '#b45309' }}>{formatTime(totalTime)}</div></div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 10 }}><div style={{ fontSize: 12, fontWeight: 900, color: '#1e293b' }}>{dict.certSign}<div style={{ width: 110, borderTop: '2px solid #334155', marginTop: 16 }} /></div><img src="/saqr-avatar.png" alt="Saqr mascot" style={{ width: 58, height: 58, objectFit: 'contain' }} onError={e => { e.currentTarget.style.display = 'none'; }} /></div>
            <div style={{ textAlign: 'center', marginTop: 14 }}>{pointsSaved ? <span className="saved-chip">{dict.pointsSaved}</span> : pointsSaveFailed ? <span style={{ color: '#be123c', fontSize: 11, fontWeight: 900 }}>{dict.savedFail}</span> : userType === 'student' && score > 0 ? <span style={{ color: '#64748b', fontSize: 11, fontWeight: 800 }}>{dict.savedPending}</span> : null}</div>
          </section>
          <div className="cert-buttons no-print"><button onClick={() => window.print()} style={{ background: 'linear-gradient(135deg,#f59e0b,#ea580c)', color: '#fff' }}>🖨️ {dict.print}</button><Link to="/home" style={{ background: '#0f766e', color: '#fff' }}>🏠 {dict.back}</Link></div>
        </div>
      )}
    </div>
  );
};

export default DeweyGame;
