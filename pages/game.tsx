import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// 🚀 استيراد الاتصال من الملف المركزي بدلاً من كتابته هنا
import { supabase } from '../src/utils/supabase';

// ==========================================
// 1. القاموس والترجمة (عربي / إنجليزي)
// ==========================================
const T = {
    ar: {
        title: "تحدي أبطال المكتبة",
        subtitle: "مرحباً بك! ساعدنا في ترتيب مكتبة المدرسة لتصبح أمين مكتبة.",
        studentName: "اسم البطل:",
        grade: "الصف الدراسي:",
        start: "انطلاق المغامرة",
        rulesTitle: "كيف نلعب؟",
        rulesText: "المكتبة مثل مدينة كبيرة مقسمة لشوارع ملونة بالأرقام! في التحديات، اسحب الكتب للشوارع الصحيحة واستخدم صاروخك الفضائي لإصابة الأهداف!",
        readyBtn: "أنا مستعد، فلننطلق!",
        ch1: "التحدي الأول: مساعدة القراء",
        ch2: "التحدي الثاني: تصويب الفضاء",
        ch3: "التحدي الثالث: ترتيب الأرفف",
        question: "المهمة",
        time: "الوقت",
        points: "النقاط",
        sec: "ث",
        correct: "إجابة رائعة! نقطة إضافية للبطل!",
        wrong: "حاول مجدداً يا بطل!",
        dragInstruction: "اسحب الكتاب وأفلته على الرف المناسب",
        dropInstruction: "ضع الكتاب هنا",
        shelfText: "الرف المستهدف",
        certTitle: "شهادة أمين المكتبة المتميز",
        certAwardedTo: "تشهد إدارة المكتبة المدرسية بأن البطل / البطلة:",
        certGrade: "بالصف الدراسي:",
        certBody: "قد اجتاز تحدي تصنيف وترتيب المكتبة بنجاح باهر وتفوق استثنائي، وأثبت ذكاءً رفيعاً ومعرفة عميقة بتنظيم العلوم والمعارف وفق تصنيف ديوي العشري المعتمد.",
        certPoints: "النقاط المحققة",
        certTime: "وقت الإنجاز",
        certDate: "تاريخ الإصدار:",
        certSign: "اعتماد أمين المكتبة",
        print: "طباعة وحفظ الشهادة",
        back: "العودة للمكتبة",
        schoolName: "مدرسة صقر الإمارات الدولية الخاصة",
        dept: "قسم المكتبة الرقمية والتفاعلية",
        minutes: "دقيقة و",
        seconds: "ثانية",
        fireBtn: "إطلاق الليزر",
        shootInstruction: "حرك الصاروخ بالأسهم واضغط زر الإطلاق أو المسافة لتصيب الكوكب المناسب!",
        tutorialBtn: "فهمت القواعد، ابدأ التحدي",
        tutCh1Title: "التحدي 1: مساعدة القراء",
        tutCh1Desc: "اقرأ ما يبحث عنه الطالب، ثم اسحب البطاقة وضعها في الرف المناسب. الإجابة الصحيحة = 20 نقطة!",
        tutCh2Title: "التحدي 2: تصويب الفضاء",
        tutCh2Desc: "اقرأ عنوان الكتاب، وحرّك صاروخك تحت كوكب التصنيف الصحيح ثم أطلق الليزر. الإجابة الصحيحة = 20 نقطة!",
        tutCh3Title: "التحدي 3: ترتيب الأرفف",
        tutCh3Desc: "انظر للرف المطلوب في الأعلى، ثم اسحب الكتاب الصحيح من الخيارات بالأسفل وضعه عليه. الإجابة الصحيحة = 20 نقطة!",
        pointsSaved: "تمت إضافة النقاط لملفك بنجاح! 🌟",
        lightMode: "الوضع الفاتح",
        darkMode: "الوضع الداكن",
        switchToLight: "التبديل إلى الوضع الفاتح",
        switchToDark: "التبديل إلى الوضع الداكن",
        progress: "تقدم المغامرة"
    },
    en: {
        title: "Library's Heroes",
        subtitle: "Welcome! Help us organize the library to become a Librarian.",
        studentName: "Hero's Name:",
        grade: "Grade:",
        start: "Start Adventure",
        rulesTitle: "Game Rules",
        rulesText: "The library is a vast city divided into colorful numbered avenues! Drag books to their correct shelves and shoot cosmic targets with your rocket!",
        readyBtn: "I am Ready, Let's Go!",
        ch1: "Challenge 1: Help Readers",
        ch2: "Challenge 2: Space Shooter",
        ch3: "Challenge 3: Fill Shelves",
        question: "Mission",
        time: "Timer",
        points: "Score",
        sec: "s",
        correct: "Brilliant Job! Super Hero!",
        wrong: "Try again, champion!",
        dragInstruction: "Drag the card & drop it onto the correct shelf",
        dropInstruction: "Drop book onto shelf",
        shelfText: "Target Shelf",
        certTitle: "Outstanding Librarian Certificate",
        certAwardedTo: "The School Library Administration certifies that Hero:",
        certGrade: "Grade:",
        certBody: "has successfully mastered the library organization challenge with flying colors, demonstrating exceptional knowledge in classifying books using the Dewey Decimal System.",
        certPoints: "Score Achieved",
        certTime: "Time Taken",
        certDate: "Issue Date:",
        certSign: "Librarian Signature",
        print: "Print & Save Certificate",
        back: "Back to Library",
        schoolName: "Emirates Falcon Int'l. Private School",
        dept: "Digital & Interactive Library Dept.",
        minutes: "min and",
        seconds: "sec",
        fireBtn: "FIRE LASER",
        shootInstruction: "Move the rocket with arrows and press Fire or Space to hit the target planet!",
        tutorialBtn: "Got it, Start Challenge",
        tutCh1Title: "Challenge 1: Help Readers",
        tutCh1Desc: "Read what the student needs, then drag the question card to the matching shelf. Each correct answer = 20 pts!",
        tutCh2Title: "Challenge 2: Space Shooter",
        tutCh2Desc: "Read the book title, position your rocket beneath the correct category planet and shoot! Each hit = 20 pts!",
        tutCh3Title: "Challenge 3: Fill Shelves",
        tutCh3Desc: "Check the designated shelf category above, then drag the matching book from below onto it. Each correct book = 20 pts!",
        pointsSaved: "Points saved to your profile successfully! 🌟",
        lightMode: "Light mode",
        darkMode: "Dark mode",
        switchToLight: "Switch to light mode",
        switchToDark: "Switch to dark mode",
        progress: "Adventure progress"
    }
};

// ==========================================
// 2. تصنيفات ديوي وبنك الأسئلة (كما هي)
// ==========================================
const DEWEY_CATEGORIES = [
    { code: "000", ar: "000: حاسب ومعارف عامة", en: "000: Computers & General", shortAr: "حاسب ومعارف", shortEn: "Computers", color: "#0284c7" },
    { code: "100", ar: "100: تطوير الذات وفلسفة", en: "100: Self Growth & Mind", shortAr: "تطوير الذات", shortEn: "Mind & Self", color: "#9333ea" },
    { code: "200", ar: "200: دين وأخلاق", en: "200: Religion & Ethics", shortAr: "دين وأخلاق", shortEn: "Religion", color: "#16a34a" },
    { code: "300", ar: "300: مجتمع وقانون", en: "300: Society & Law", shortAr: "مجتمع وقانون", shortEn: "Society", color: "#ea580c" },
    { code: "400", ar: "400: لغات وقواميس", en: "400: Languages & Lexicons", shortAr: "لغات وقواميس", shortEn: "Languages", color: "#db2777" },
    { code: "500", ar: "500: علوم وفضاء", en: "500: Science & Astronomy", shortAr: "علوم وفضاء", shortEn: "Science", color: "#ca8a04" },
    { code: "600", ar: "600: تكنولوجيا وطب", en: "600: Tech & Medicine", shortAr: "تكنولوجيا وطب", shortEn: "Tech & Med", color: "#0d9488" },
    { code: "700", ar: "700: فنون ورياضة", en: "700: Arts & Sports", shortAr: "فنون ورياضة", shortEn: "Arts & Sport", color: "#4f46e5" },
    { code: "800", ar: "800: قصص وحكايات", en: "800: Literature & Stories", shortAr: "قصص وحكايات", shortEn: "Stories", color: "#e11d48" },
    { code: "900", ar: "900: تاريخ وجغرافيا", en: "900: History & Geography", shortAr: "تاريخ وجغرافيا", shortEn: "History", color: "#dc2626" }
];

const BANK_ASSISTANT = [
    { ar: "أحمد يبحث عن كتب حول الكواكب والمجموعات الشمسية", en: "Ahmed is researching planets and solar systems", answer: "500" },
    { ar: "مريم تريد قاموساً شاملاً للترجمة بين العربية والإنجليزية", en: "Maryam wants a dictionary to translate between Arabic and English", answer: "400" },
    { ar: "عمر يطلب كتاباً موثوقاً عن قصص الأنبياء ومعجزاتهم", en: "Omar asks for a book about stories of the Prophets", answer: "200" },
    { ar: "سارة تريد تعلم أساسيات رسم الشخصيات وتصميم اللوحات", en: "Sara wants to learn cartoon drawing and oil painting", answer: "700" },
    { ar: "خالد يبحث عن وثائق تاريخية حول قيام اتحاد دولة الإمارات", en: "Khalid is searching for historical UAE union documents", answer: "900" },
    { ar: "فاطمة تحب برمجة الكمبيوتر وتصميم المواقع الإلكترونية", en: "Fatima loves computer programming and web development", answer: "000" },
    { ar: "يوسف مريض ويريد قراءة دليل الفيتامينات وصحة الإنسان", en: "Yousef is sick and wants to read about vitamins and human health", answer: "600" },
    { ar: "علي يطلب ديوان شعر فصيح لإلقائه في الإذاعة المدرسية", en: "Ali needs a classical Arabic poem for the morning assembly", answer: "800" },
    { ar: "هدى تقرأ بحثاً مدرسياً عن حقوق الطفل وقوانين الأسرة", en: "Huda is writing a school paper on children's rights and family laws", answer: "300" },
    { ar: "ماجد يبحث عن كتاب يساعده في بناء الثقة بالنفس وتطوير الذات", en: "Majid seeks a guide on self-confidence and personal growth", answer: "100" },
    { ar: "ليلى تبحث عن أطلس خرائط يوضح تضاريس قارات العالم", en: "Laila is searching for a world atlas of physical landforms", answer: "900" },
    { ar: "سعيد يريد قراءة رواية مغامرات مشوقة في الغابات الاستوائية", en: "Saeed wants an exciting adventure novel set in rainforests", answer: "800" },
    { ar: "راشد يسأل عن تصنيف عالم الحشرات وعجائب النباتات", en: "Rashed is curious about insect biology and plant secrets", answer: "500" },
    { ar: "منى ترغب في دراسة كتيب سريع للإسعافات الأولية المنزلية", en: "Mona wants a quick handbook on home first aid basics", answer: "600" },
    { ar: "حسن يسأل عن كتاب لتعلم قواعد النطق في اللغة الفرنسية", en: "Hassan wants to learn French pronunciation grammar", answer: "400" },
    { ar: "نورة تبحث عن موسوعة الاختراعات التكنولوجية والروبوت", en: "Noura looks for an encyclopedia on technological robotics", answer: "600" },
    { ar: "طارق يقرأ عن السيرة النبوية وغزوات صدر الإسلام", en: "Tariq wants to read about the Prophet's life and early battles", answer: "200" },
    { ar: "عبير تبحث عن كيفية التغلب على التوتر وحل النزاعات النفسية", en: "Abeer searches for emotional balance and stress relief techniques", answer: "100" },
    { ar: "جمال يحتاج كتاباً لشرح استراتيجيات الفوز في لعبة الشطرنج", en: "Jamal needs a book on competitive chess tactics", answer: "700" },
    { ar: "سالم يريد كتاباً لشرح أمن المعلومات وحماية الحسابات من الاختراق", en: "Salem wants to learn cybersecurity and password defense", answer: "000" }
];

const BANK_ORBS = [
    { ar: "كتاب: الذكاء الاصطناعي ومستقبل الحاسوب", en: "Book: AI and the Future of Computing", answer: "000" },
    { ar: "كتاب: إدارة الغضب والتفكير الإيجابي", en: "Book: Anger Management and Positive Mindset", answer: "100" },
    { ar: "كتاب: أركان الإسلام والعقيدة الصحيحة", en: "Book: Pillars of Islam & Proper Faith", answer: "200" },
    { ar: "كتاب: قوانين المرور والسلامة في المجتمع", en: "Book: Traffic Safety & Community Laws", answer: "300" },
    { ar: "كتاب: قواعد النحو والإعراب الميسر", en: "Book: Arabic Grammar and Morphology", answer: "400" },
    { ar: "كتاب: الثقوب السوداء والمجرات البعيدة", en: "Book: Black Holes & Deep Space Galaxies", answer: "500" },
    { ar: "كتاب: الهندسة الميكانيكية وصناعة الطائرات", en: "Book: Aerospace Engineering & Aviation", answer: "600" },
    { ar: "كتاب: أسرار رياضة الغوص والتصوير تحت الماء", en: "Book: Scuba Diving & Underwater Photography", answer: "700" },
    { ar: "رواية: مغامرات بائعة الكبريت والقصص العالمية", en: "Novel: The Little Match Girl and World Fables", answer: "800" },
    { ar: "كتاب: تاريخ القلاع والحصون القديمة في الجزيرة", en: "Book: Ancient Arabian Castles & Fortresses", answer: "900" }
];

const BANK_SHELVES = [
    { shelfCode: "500", arShelf: "500: علوم وفضاء", enShelf: "500: Science & Space", arCorrect: "أسرار الفضاء وقوانين الجاذبية", enCorrect: "Space Secrets & Gravity Laws", arWrongs: ["تاريخ الدولة العباسية", "تعلم الرسم الزيتي", "قواعد الإملاء في العربية"], enWrongs: ["Abbasid History", "Oil Painting", "Spelling Rules"] },
    { shelfCode: "700", arShelf: "700: فنون ورياضة", enShelf: "700: Arts & Sports", arCorrect: "قوانين بطولات السباحة والجمباز", enCorrect: "Swimming & Gymnastics Rules", arWrongs: ["تشريح خلايا الكبد", "برمجة المواقع بلغة HTML", "تحليل القصة القصيرة"], enWrongs: ["Liver Anatomy", "HTML Web Design", "Short Story Analysis"] },
    { shelfCode: "900", arShelf: "900: تاريخ وجغرافيا", enShelf: "900: History & Geography", arCorrect: "تاريخ قلاع وحصون دولة الإمارات", enCorrect: "History of UAE Forts & Castles", arWrongs: ["محادثات بالإسبانية", "أخلاق المؤمن الصادق", "حياة الطيور المائية"], enWrongs: ["Spanish Dialogues", "Believer's Morals", "Water Birds Biology"] },
    { shelfCode: "600", arShelf: "600: تكنولوجيا وطب", enShelf: "600: Tech & Medicine", arCorrect: "صناعة الروبوت والسيارات الذكية", enCorrect: "Robotics & Smart Autonomous Cars", arWrongs: ["ديوان شعر المتنبي", "أطلس قارة أوروبا", "حقوق المواطنة الصالحة"], enWrongs: ["Mutanabbi Poems", "Europe Map Atlas", "Civic Rights"] },
    { shelfCode: "800", arShelf: "800: قصص وحكايات", enShelf: "800: Literature & Stories", arCorrect: "حكايات كليلة ودمنة الشهيرة", enCorrect: "Kalila wa Dimna Fables", arWrongs: ["لغات البرمجة السحابية", "تفسير سورة الكهف", "قوانين الديناميكا الحرارية"], enWrongs: ["Cloud Coding", "Quran Exegesis", "Thermodynamics"] }
];

const shuffleArray = <T,>(array: T[]): T[] => {
    // Fisher–Yates avoids the biased ordering of sort(() => Math.random() - 0.5).
    const result = [...array];
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

// ==========================================
// 3. المكون الرئيسي للعبة
// ==========================================
const DeweyGame: React.FC = () => {
    const { locale } = useLanguage();
    const lang = locale as 'ar' | 'en';
    const dict = T[lang];

    // ==========================================
    // المصادقة وجلب بيانات المستخدم
    // ==========================================
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof window === 'undefined') return 'dark';
        try {
            const saved = window.localStorage.getItem('dewey-game-theme');
            if (saved === 'light' || saved === 'dark') return saved;
        } catch {
            // Fall back to the device preference if storage is unavailable.
        }
        try {
            return window.matchMedia?.('(prefers-color-scheme: light)')?.matches ? 'light' : 'dark';
        } catch {
            return 'dark';
        }
    });

    const [userData, setUserData] = useState<any>(null);
    const [userType, setUserType] = useState<'student' | 'teacher' | 'admin' | null>(null);
    const [studentName, setStudentName] = useState('');
    const [studentGrade, setStudentGrade] = useState('');
    const [pointsSaved, setPointsSaved] = useState(false);

    useEffect(() => {
        try {
            window.localStorage.setItem('dewey-game-theme', theme);
        } catch {
            // The game still works when storage is disabled by browser privacy settings.
        }
    }, [theme]);

    useEffect(() => {
        const storedUser = localStorage.getItem('current_user');
        const storedType = localStorage.getItem('user_type');

        if (storedUser && storedType) {
            // منع دخول المعلمين للعبة
            if (storedType === 'teacher') {
                window.location.href = '/home';
                return;
            }
            
            let user: any;
            try {
                user = JSON.parse(storedUser);
            } catch {
                window.location.href = '/login';
                return;
            }
            setUserData(user);
            setUserType(storedType as 'student' | 'admin');
            
            // تعبئة البيانات تلقائياً
            const name = lang === 'ar' ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
            setStudentName(storedType === 'admin' ? (lang === 'ar' ? 'أدمن (تجريبي)' : 'Admin (Demo)') : name);
            setStudentGrade(storedType === 'admin' ? 'N/A' : (user.grade || ''));
        } else {
            window.location.href = '/login';
        }
    }, [lang]);

    const [stage, setStage] = useState<'intro' | 'learn' | 'tut1' | 'challenge1' | 'tut2' | 'challenge2' | 'tut3' | 'challenge3' | 'certificate'>('intro');
    
    const [score, setScore] = useState(0);
    const [totalTime, setTotalTime] = useState(0); 
    const [questionTimer, setQuestionTimer] = useState(20);
    
    const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
    const [qIndex, setQIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [issueDate, setIssueDate] = useState('');

    const [ch1Options, setCh1Options] = useState<any[]>([]);

    // === متغيرات السحب والإفلات ===
    const [isDraggingState, setIsDraggingState] = useState(false);
    const [dragItemInfo, setDragItemInfo] = useState<{ id: string, type: 'q' | 'opt', content?: string } | null>(null);
    const [hoveredDropZone, setHoveredDropZone] = useState<string | null>(null);

    const isDraggingRef = useRef(false);
    const pointerIdRef = useRef<number | null>(null);
    const dragDataRef = useRef<{ id: string, type: 'q' | 'opt', content?: string } | null>(null);
    const floatingElementRef = useRef<HTMLDivElement | null>(null);
    const dropZonesRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const stageRef = useRef(stage);
    stageRef.current = stage;
    const handleAnswerRef = useRef<(providedAnswer: string) => void>(() => undefined);

    // === متغيرات لعبة الصاروخ ===
    const [rocketPos, setRocketPos] = useState(1);
    const [ch2Options, setCh2Options] = useState<any[]>([]);
    const [isShooting, setIsShooting] = useState(false);

    // إخفاء شريط رأس الموقع
    useEffect(() => {
        if (stage.startsWith('challenge')) {
            document.body.classList.add('hide-site-header');
        } else {
            document.body.classList.remove('hide-site-header');
        }
        return () => document.body.classList.remove('hide-site-header');
    }, [stage]);

    useEffect(() => {
        const dateStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
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

    // حفظ النقاط في قاعدة البيانات عند الوصول للشهادة
    useEffect(() => {
        if (stage === 'certificate' && userType === 'student' && userData && score > 0 && !pointsSaved) {
            const updatePoints = async () => {
                const newPoints = (userData.points || 0) + score;
                const { error } = await supabase
                    .from('students')
                    .update({ points: newPoints })
                    .eq('student_id', userData.student_id);
                
                if (!error) {
                    const updatedUser = { ...userData, points: newPoints };
                    localStorage.setItem('current_user', JSON.stringify(updatedUser));
                    setUserData(updatedUser);
                    setPointsSaved(true);
                }
            };
            updatePoints();
        }
    }, [stage, userType, userData, score, pointsSaved]);

    useEffect(() => {
        const preventDefault = (e: TouchEvent) => {
            if (isDraggingRef.current) e.preventDefault();
        };
        document.addEventListener('touchmove', preventDefault, { passive: false });
        return () => document.removeEventListener('touchmove', preventDefault);
    }, []);

    const handleStart = () => {
        setScore(0);
        setTotalTime(0);
        setQuestionTimer(20);
        setPointsSaved(false);
        setFeedback(null);
        setStage('learn');
    };

    const generateCh1Options = (correctAnswer: string) => {
        const correctObj = DEWEY_CATEGORIES.find(c => c.code === correctAnswer)!;
        const wrongOptions = shuffleArray(DEWEY_CATEGORIES.filter(c => c.code !== correctAnswer)).slice(0, 3);
        setCh1Options(shuffleArray([correctObj, ...wrongOptions]));
    };

    const startChallenge1 = () => {
        const qList = shuffleArray(BANK_ASSISTANT).slice(0, 5);
        setCurrentQuestions(qList);
        setQIndex(0); 
        setQuestionTimer(20); 
        generateCh1Options(qList[0].answer);
        setStage('challenge1');
    };

    const startChallenge2 = () => {
        const qList = shuffleArray(BANK_ORBS).slice(0, 5);
        setCurrentQuestions(qList);
        setQIndex(0); 
        setQuestionTimer(20); 
        setStage('challenge2'); 
        setRocketPos(1);
        generateCh2Options(qList[0].answer);
    };

    const generateCh2Options = (correctAnswer: string) => {
        const correctObj = DEWEY_CATEGORIES.find(c => c.code === correctAnswer)!;
        const wrongOptions = shuffleArray(DEWEY_CATEGORIES.filter(c => c.code !== correctAnswer)).slice(0, 3);
        setCh2Options(shuffleArray([correctObj, ...wrongOptions]));
    };

    const startChallenge3 = () => {
        const mixed = shuffleArray(BANK_SHELVES).slice(0, 5).map(q => {
            const correct = lang === 'ar' ? q.arCorrect : q.enCorrect;
            const wrongs = lang === 'ar' ? q.arWrongs : q.enWrongs;
            return {
                shelfCode: q.shelfCode,
                displayShelf: lang === 'ar' ? q.arShelf : q.enShelf,
                correct: correct,
                options: shuffleArray([correct, ...wrongs.slice(0, 3)])
            };
        });
        setCurrentQuestions(mixed);
        setQIndex(0); 
        setQuestionTimer(20); 
        setStage('challenge3');
    };

    const nextQuestion = () => {
        setFeedback(null);
        setIsShooting(false);
        if (qIndex < 4) {
            const nextIdx = qIndex + 1;
            setQIndex(nextIdx);
            setQuestionTimer(20);
            if (stage === 'challenge1') {
                generateCh1Options(currentQuestions[nextIdx].answer);
            } else if (stage === 'challenge2') {
                generateCh2Options(currentQuestions[nextIdx].answer);
                setRocketPos(1);
            }
        } else {
            if (stage === 'challenge1') setStage('tut2');
            else if (stage === 'challenge2') setStage('tut3');
            else setStage('certificate');
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m > 0 ? m + ' ' + dict.minutes + ' ' : ''}${s} ${dict.seconds}`;
    };

    // === Pointer-based drag and drop (mouse, pen, and touch) ===
    const updateFloatingPos = (clientX: number, clientY: number) => {
        if (floatingElementRef.current) {
            floatingElementRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%) scale(1.04)`;
        }
    };

    const checkDropZones = (clientX: number, clientY: number) => {
        let foundZone: string | null = null;
        dropZonesRef.current.forEach((el, key) => {
            if (!el || !el.isConnected) return;
            const rect = el.getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
                foundZone = key;
            }
        });
        setHoveredDropZone(foundZone);
        return foundZone;
    };

    const cleanupDrag = useCallback(() => {
        isDraggingRef.current = false;
        pointerIdRef.current = null;
        dragDataRef.current = null;
        setIsDraggingState(false);
        setDragItemInfo(null);
        setHoveredDropZone(null);
        if (floatingElementRef.current) {
            floatingElementRef.current.style.display = 'none';
        }
    }, []);

    const handleDragStart = (e: React.PointerEvent<HTMLDivElement>, id: string, type: 'q' | 'opt', content?: string) => {
        if (feedback || (e.pointerType === 'mouse' && e.button !== 0)) return;
        e.preventDefault();
        pointerIdRef.current = e.pointerId;
        isDraggingRef.current = true;
        const itemObj = { id, type, content };
        dragDataRef.current = itemObj;
        setDragItemInfo(itemObj);
        setIsDraggingState(true);

        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // Pointer capture is an enhancement; coordinate-based hit testing remains available.
        }
        if (floatingElementRef.current) {
            floatingElementRef.current.style.display = 'flex';
            updateFloatingPos(e.clientX, e.clientY);
        }
    };

    const handleAnswer = (providedAnswer: string) => {
        if (feedback || !currentQuestions[qIndex]) return;
        let isCorrect = false;
        if (stage === 'challenge3') {
            isCorrect = providedAnswer === currentQuestions[qIndex].correct;
        } else {
            isCorrect = providedAnswer === currentQuestions[qIndex].answer;
        }

        if (isCorrect) {
            setScore(s => s + 20);
            setFeedback('correct');
        } else {
            setFeedback('wrong');
        }
        cleanupDrag();
        window.setTimeout(() => nextQuestion(), 1400);
    };
    handleAnswerRef.current = handleAnswer;

    const handleTimeout = () => {
        if (feedback) return;
        setFeedback('wrong');
        cleanupDrag();
        window.setTimeout(() => nextQuestion(), 1400);
    };

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!isDraggingRef.current || !dragDataRef.current) return;
            if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
            e.preventDefault();
            updateFloatingPos(e.clientX, e.clientY);
            checkDropZones(e.clientX, e.clientY);
        };

        const handlePointerUp = (e: PointerEvent) => {
            if (!isDraggingRef.current || !dragDataRef.current) return;
            if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;

            const droppedOn = checkDropZones(e.clientX, e.clientY);
            const draggedItem = dragDataRef.current;
            const activeStage = stageRef.current;
            if (droppedOn) {
                if (activeStage === 'challenge3') {
                    handleAnswerRef.current(draggedItem.content || draggedItem.id);
                } else {
                    handleAnswerRef.current(droppedOn);
                }
            }
            cleanupDrag();
        };

        const handlePointerCancel = (e: PointerEvent) => {
            if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
            cleanupDrag();
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerCancel);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerCancel);
        };
    }, [cleanupDrag]);

    // === Rocket Shooter ===
    const handleShoot = useCallback(() => {
        if (feedback || isShooting || !ch2Options[rocketPos]) return;
        setIsShooting(true);
        const shotCategory = ch2Options[rocketPos].code;
        
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1666/1666-preview.mp3');
        audio.volume = 0.15; 
        audio.play().catch(()=>{});

        setTimeout(() => {
            handleAnswer(shotCategory);
        }, 280);
    }, [rocketPos, ch2Options, feedback, isShooting]);

    useEffect(() => {
        if (stage !== 'challenge2' || feedback) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                setRocketPos(p => (lang === 'ar' ? Math.max(0, p - 1) : Math.min(3, p + 1)));
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setRocketPos(p => (lang === 'ar' ? Math.min(3, p + 1) : Math.max(0, p - 1)));
            } else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleShoot();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [stage, lang, handleShoot, feedback]);

    if (!userData) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white animate-pulse">جاري تحميل اللعبة...</div>;
    }

    return (
        <div className={`dewey-game ${theme === 'light' ? 'light-mode' : 'dark-mode'} min-h-screen min-h-[100dvh] bg-slate-900 text-slate-100 font-sans flex flex-col items-center justify-center p-2 md:p-4 relative select-none ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'} ${stage.startsWith('challenge') ? 'overflow-hidden touch-none' : 'overflow-y-auto'}`}>
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                .dir-rtl { direction: rtl; }
                .dir-ltr { direction: ltr; }
                body.hide-site-header header, body.hide-site-header nav, body.hide-site-header .site-header, body.hide-site-header [role="banner"], body.hide-site-header nav-bar { display: none !important; }
                
                @media print {
                    @page { size: A4 portrait; margin: 0; }
                    html, body { width: 210mm !important; height: 297mm !important; margin: 0 !important; padding: 0 !important; background: #ffffff !important; overflow: hidden !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    body * { visibility: hidden !important; }
                    #certificate-print-container, #certificate-print-container * { visibility: visible !important; }
                    #certificate-print-container { position: fixed !important; left: 0 !important; top: 0 !important; width: 210mm !important; height: 297mm !important; margin: 0 !important; padding: 8mm !important; box-sizing: border-box !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; background: #ffffff !important; }
                    #certificate-area-print { width: 194mm !important; height: 275mm !important; box-sizing: border-box !important; border: 12px double #b45309 !important; border-radius: 20px !important; padding: 12mm !important; background: #ffffff !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; page-break-inside: avoid !important; break-inside: avoid !important; page-break-after: avoid !important; }
                }

                .magic-glow { animation: pulse-glow 2s infinite alternate ease-in-out; }
                @keyframes pulse-glow { 0% { filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)); transform: scale(1) translateY(0px); } 100% { filter: drop-shadow(0 0 25px rgba(245, 158, 11, 0.9)); transform: scale(1.02) translateY(-2px); } }
                
                .float-anim { animation: floating 3s ease-in-out infinite; }
                @keyframes floating { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }

                .wood-shelf { position: relative; background: linear-gradient(180deg, #b45309 0%, #78350f 100%); border-bottom: 6px solid #451a03; border-radius: 10px; box-shadow: inset 0 -2px 6px rgba(0,0,0,0.5), 0 6px 12px rgba(0,0,0,0.4); transition: all 0.15s ease-out; }
                
                .realistic-book { position: relative; background: linear-gradient(135deg, #1e293b, #0f172a); border-left: 8px solid #f59e0b; border-radius: 4px 10px 10px 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }

                .laser-beam { position: absolute; bottom: 45px; width: 4px; height: 35px; background: #22d3ee; box-shadow: 0 0 12px #06b6d4, 0 0 25px #0891b2; border-radius: 10px; animation: shoot-up 0.28s linear forwards; z-index: 20; }
                @keyframes shoot-up { 0% { bottom: 45px; opacity: 1; } 100% { bottom: 100%; opacity: 0; } }

                .cert-font { font-family: 'Cairo', sans-serif !important; }
                
                .compact-layout { display: flex; flex-direction: column; height: 100%; max-height: 95vh; justify-content: space-between; }

                /* A layered, lightweight backdrop that stays decorative and never blocks input. */
                .dewey-game {
                    --surface-line: rgba(148,163,184,.22);
                    isolation: isolate;
                    background-image:
                        radial-gradient(ellipse at 12% 8%, rgba(20,184,166,.14), transparent 36%),
                        radial-gradient(ellipse at 88% 86%, rgba(59,130,246,.14), transparent 34%);
                    font-family: 'Cairo', ui-sans-serif, system-ui, sans-serif;
                }
                .dewey-game::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    z-index: -1;
                    pointer-events: none;
                    opacity: .5;
                    background-image: radial-gradient(rgba(148,163,184,.28) .7px, transparent .7px);
                    background-size: 22px 22px;
                }
                .dewey-game.light-mode {
                    color: #172033 !important;
                    background-color: #f2f7fc !important;
                    background-image:
                        radial-gradient(ellipse at 10% 5%, rgba(13,148,136,.13), transparent 38%),
                        radial-gradient(ellipse at 90% 90%, rgba(59,130,246,.10), transparent 35%);
                }
                .dewey-game.light-mode::before { opacity: .35; background-image: radial-gradient(rgba(71,85,105,.2) .7px, transparent .7px); }
                .dewey-game.light-mode [class*="bg-slate-950"],
                .dewey-game.light-mode [class*="bg-slate-900"],
                .dewey-game.light-mode [class*="bg-slate-800"] {
                    background-color: rgba(255,255,255,.88) !important;
                }
                .dewey-game.light-mode [class*="border-slate-700"] { border-color: rgba(100,116,139,.28) !important; }
                .dewey-game.light-mode .text-slate-100,
                .dewey-game.light-mode .text-slate-200,
                .dewey-game.light-mode .text-slate-300 { color: #263449 !important; }
                .dewey-game.light-mode .text-slate-400 { color: #526176 !important; }
                .dewey-game.light-mode .text-white { color: #1f2937 !important; }
                .dewey-game.light-mode button.text-white,
                .dewey-game.light-mode .dewey-category,
                .dewey-game.light-mode .planet-chip { color: #fff !important; }
                .dewey-game.light-mode .realistic-book {
                    background: linear-gradient(135deg, #ffffff 0%, #edf4fb 100%);
                    color: #1f2937;
                    border-color: #0f766e;
                    box-shadow: 0 8px 22px rgba(15,23,42,.10);
                }
                .dewey-game.light-mode .realistic-book h3,
                .dewey-game.light-mode .realistic-book span { color: #1e293b; }
                .dewey-game.light-mode .realistic-book.text-amber-300 { color: #92400e !important; }
                .dewey-game.light-mode .wood-shelf {
                    background: linear-gradient(180deg, #d9a66b 0%, #a86f3d 100%);
                    border-bottom-color: #704421;
                    box-shadow: inset 0 -2px 6px rgba(60,35,12,.18), 0 6px 14px rgba(15,23,42,.12);
                }
                .dewey-game.light-mode .space-arena,
                .dewey-game.light-mode .space-arena [class*="bg-slate"] {
                    background-color: #07172e !important;
                    color: #f8fafc !important;
                }
                .dewey-game.light-mode .space-arena {
                    background-image: radial-gradient(circle at 20% 20%, rgba(34,211,238,.14), transparent 25%), radial-gradient(circle at 80% 65%, rgba(99,102,241,.18), transparent 30%) !important;
                }
                .glass-card { box-shadow: 0 18px 55px rgba(2,8,23,.16); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
                .game-action { min-height: 44px; touch-action: manipulation; transition: transform .18s ease, box-shadow .18s ease, filter .18s ease; }
                .game-action:hover { filter: brightness(1.04); }
                .game-action:focus-visible { outline: 3px solid #38bdf8; outline-offset: 3px; }
                .drop-target { min-height: 82px; }
                .progress-track { height: 7px; overflow: hidden; border-radius: 999px; background: rgba(148,163,184,.2); }
                .progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg,#14b8a6,#38bdf8,#f59e0b); transition: width .35s ease; }
                .dewey-game .realistic-book { transition: box-shadow .18s ease, border-color .18s ease, filter .18s ease; }
                .dewey-game .realistic-book:active { filter: brightness(1.05); }
                .dewey-game .realistic-book, .dewey-game .wood-shelf { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
                @media (max-width: 420px) {
                    .compact-layout { max-height: 96dvh; }
                    .dewey-game .drop-target { min-height: 70px; }
                }
                @media (max-height: 650px) and (orientation: landscape) {
                    .compact-layout { max-height: 98dvh; }
                    .dewey-game .float-anim { animation-duration: 4.5s; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .dewey-game *, .dewey-game *::before, .dewey-game *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            {!stage.startsWith('challenge') && (
                <button
                    type="button"
                    onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
                    aria-label={theme === 'dark' ? dict.switchToLight : dict.switchToDark}
                    title={theme === 'dark' ? dict.switchToLight : dict.switchToDark}
                    className="fixed top-3 right-3 z-[100] print:hidden flex min-h-11 items-center gap-2 rounded-full border border-slate-500/30 bg-slate-800/90 px-3 py-2 text-xs font-black text-amber-300 shadow-xl backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                    <span aria-hidden="true" className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
                    <span>{theme === 'dark' ? dict.lightMode : dict.darkMode}</span>
                </button>
            )}

            {/* --- العنصر الممسوك --- */}
            <div 
                ref={floatingElementRef}
                className="fixed pointer-events-none z-[9999] realistic-book p-3 font-black text-center items-center justify-center bg-slate-900 text-amber-300 shadow-2xl border-2 border-amber-400 hidden will-change-transform"
                style={{ left: 0, top: 0, width: dragItemInfo?.type === 'q' ? '210px' : '150px', minHeight: '50px', fontSize: dragItemInfo?.type === 'q' ? '0.85rem' : '0.8rem' }}
            >
                {dragItemInfo?.content || (currentQuestions[qIndex] ? (lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en) : '')}
            </div>

            {/* 1. شاشة البداية */}
            {stage === 'intro' && (
                <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl text-center animate-fade-in-up relative z-10 glass-card">
                    <img src="/Game.png" alt="Game Logo" className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-3 object-contain magic-glow" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <h1 className="text-2xl md:text-3xl font-black text-amber-400 mb-1">{dict.title}</h1>
                    <p className="text-xs md:text-sm text-slate-300 mb-5 font-bold">{dict.subtitle}</p>
                    
                    {/* عرض بيانات المستخدم التلقائية بدلاً من حقول الإدخال */}
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 mb-6 text-start flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">👤</span>
                            <div>
                                <p className="text-[10px] text-amber-400 font-bold uppercase">{dict.studentName}</p>
                                <p className="text-sm font-black text-white">{studentName}</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-slate-700"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🎓</span>
                            <div>
                                <p className="text-[10px] text-amber-400 font-bold uppercase">{dict.grade}</p>
                                <p className="text-sm font-black text-white">{studentGrade}</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleStart} className="game-action w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-base md:text-xl rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95 float-anim tracking-wide">
                        {dict.start}
                    </button>
                </div>
            )}

            {/* 2. شاشة التعلم */}
            {stage === 'learn' && (
                <div className="max-w-3xl w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-4 md:p-8 shadow-2xl animate-zoom-in relative z-10 text-center flex flex-col max-h-[90dvh] my-auto glass-card">
                    <div className="overflow-y-auto flex-1 px-1 pb-2">
                        <div className="w-14 h-14 md:w-20 md:h-20 bg-amber-500/10 border border-amber-500/30 rounded-full mx-auto flex items-center justify-center mb-2 shrink-0">
                            <svg className="w-8 h-8 md:w-10 md:h-10 text-amber-400 magic-glow" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-amber-400 mb-1">{dict.rulesTitle}</h2>
                            <p className="text-xs md:text-base leading-relaxed mb-3 text-slate-300 font-bold">
                                {dict.rulesText}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-2 content-start px-1">
                            {DEWEY_CATEGORIES.map(cat => (
                                <div key={cat.code} className="dewey-category p-2.5 rounded-xl text-[10px] md:text-xs font-black shadow-md text-white flex items-center justify-center text-center border border-white/10" style={{ backgroundColor: cat.color }}>
                                    {lang === 'ar' ? cat.ar : cat.en}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-2 pb-1 shrink-0 w-full bg-slate-800 border-t border-slate-700">
                        <button onClick={() => setStage('tut1')} className="game-action w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 text-base md:text-xl border-b-4 border-emerald-800 active:border-b-0">
                            {dict.readyBtn}
                        </button>
                    </div>
                </div>
            )}

            {/* شاشات التعليمات */}
            {stage === 'tut1' && (
                <div className="max-w-md w-full bg-slate-800/90 border border-sky-500/50 rounded-3xl p-6 shadow-2xl text-center animate-zoom-in relative z-10">
                    <span className="text-4xl mb-2 block">📚</span>
                    <h2 className="text-xl md:text-2xl font-black text-sky-400 mb-2">{dict.tutCh1Title}</h2>
                    <p className="text-xs md:text-base leading-relaxed font-bold text-slate-300 mb-6">{dict.tutCh1Desc}</p>
                    <button onClick={startChallenge1} className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-black text-base md:text-lg rounded-xl shadow-lg active:scale-95">{dict.tutorialBtn}</button>
                </div>
            )}
            {stage === 'tut2' && (
                <div className="max-w-md w-full bg-slate-800/90 border border-rose-500/50 rounded-3xl p-6 shadow-2xl text-center animate-zoom-in relative z-10">
                    <span className="text-4xl mb-2 block">🚀</span>
                    <h2 className="text-xl md:text-2xl font-black text-rose-400 mb-2">{dict.tutCh2Title}</h2>
                    <p className="text-xs md:text-base leading-relaxed font-bold text-slate-300 mb-6">{dict.tutCh2Desc}</p>
                    <button onClick={startChallenge2} className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-base md:text-lg rounded-xl shadow-lg active:scale-95">{dict.tutorialBtn}</button>
                </div>
            )}
            {stage === 'tut3' && (
                <div className="max-w-md w-full bg-slate-800/90 border border-amber-500/50 rounded-3xl p-6 shadow-2xl text-center animate-zoom-in relative z-10">
                    <span className="text-4xl mb-2 block">🏆</span>
                    <h2 className="text-xl md:text-2xl font-black text-amber-400 mb-2">{dict.tutCh3Title}</h2>
                    <p className="text-xs md:text-base leading-relaxed font-bold text-slate-300 mb-6">{dict.tutCh3Desc}</p>
                    <button onClick={startChallenge3} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base md:text-lg rounded-xl shadow-lg active:scale-95">{dict.tutorialBtn}</button>
                </div>
            )}

            {/* 3. شاشات التحديات */}
            {stage.startsWith('challenge') && currentQuestions.length > 0 && (
                <div className="max-w-5xl w-full h-[94vh] md:h-auto md:min-h-0 bg-slate-900 border-2 border-slate-700 rounded-3xl p-3 md:p-6 shadow-2xl animate-fade-in-up relative z-10 compact-layout">
                    
                    <div className="flex justify-between items-center mb-2 bg-slate-800/80 border border-slate-700 p-2 md:p-3 rounded-2xl shadow-inner shrink-0">
                        <div>
                            <span className="text-amber-400 font-black text-xs md:text-lg block tracking-wide">
                                {stage === 'challenge1' ? dict.ch1 : stage === 'challenge2' ? dict.ch2 : dict.ch3}
                            </span>
                            <span className="text-[10px] md:text-xs text-slate-400 font-bold">{dict.question} {qIndex + 1} / 5</span>
                        </div>
                        <div className="flex gap-2 text-center">
                            <div className="bg-slate-900 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-slate-700 min-w-[50px]">
                                <div className="text-[8px] md:text-xs text-slate-400 font-black">{dict.time}</div>
                                <div className={`font-black text-sm md:text-xl ${questionTimer <= 5 ? 'text-rose-500 animate-ping' : 'text-cyan-400'}`}>{questionTimer}</div>
                            </div>
                            <div className="bg-slate-900 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-slate-700 min-w-[50px]">
                                <div className="text-[8px] md:text-xs text-slate-400 font-black">{dict.points}</div>
                                <div className="font-black text-sm md:text-xl text-emerald-400">{score}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3 shrink-0 px-1" aria-label={`${dict.progress}: ${qIndex + 1} / 5`}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-[9px] md:text-xs font-bold text-slate-400">
                            <span>{dict.progress}</span>
                            <span>{qIndex + 1} / 5</span>
                        </div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${((qIndex + 1) / 5) * 100}%` }} />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
                        {feedback && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-50 backdrop-blur-md rounded-2xl animate-zoom-in">
                                {feedback === 'correct' ? (
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_#10b981]">
                                        <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-500/20 border-2 border-rose-400 rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_#f43f5e]">
                                        <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </div>
                                )}
                                <h3 className={`text-lg md:text-3xl font-black ${feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {feedback === 'correct' ? dict.correct : dict.wrong}
                                </h3>
                            </div>
                        )}

                        {stage !== 'challenge2' && (
                            <>
                                <div className="flex flex-col items-center justify-center shrink-0 min-h-[85px] md:min-h-[140px] relative z-20 mb-2">
                                    {stage === 'challenge3' ? (
                                        <div 
                                            ref={(el) => { if (el) dropZonesRef.current.set(currentQuestions[qIndex].shelfCode, el); else dropZonesRef.current.delete(currentQuestions[qIndex].shelfCode); }}
                                            className={`w-full md:w-2/3 h-16 md:h-20 relative wood-shelf flex items-center justify-center shadow-2xl my-2 cursor-pointer transition-all duration-150 ${hoveredDropZone === currentQuestions[qIndex].shelfCode ? 'ring-4 ring-amber-400 brightness-125 scale-105' : ''}`}
                                        >
                                            <div className="absolute -top-3.5 md:-top-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 px-5 py-1 rounded-full font-black text-slate-950 shadow-xl border-2 border-amber-200 text-xs md:text-base w-fit max-w-[92%] text-center truncate tracking-wide">
                                                {dict.shelfText}: {currentQuestions[qIndex].displayShelf}
                                            </div>
                                            <p className="text-amber-100 font-bold text-[10px] md:text-xs tracking-wider mt-3 opacity-95">
                                                {dict.dropInstruction}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center w-full">
                                            <p className="text-[10px] md:text-sm font-black text-amber-400 mb-1.5 bg-slate-800/60 inline-block px-3 py-1 rounded-full border border-slate-700">{dict.dragInstruction}</p>
                                            <div 
                                                onPointerDown={(e) => handleDragStart(e, 'q', 'q')}
                                                className={`realistic-book p-3.5 md:p-6 max-w-[280px] md:max-w-xl mx-auto cursor-grab active:cursor-grabbing flex items-center justify-center text-center float-anim border border-slate-700 shadow-xl`}
                                                style={{ touchAction: 'none', opacity: isDraggingState && dragDataRef.current?.type === 'q' ? 0.25 : 1 }}
                                            >
                                                <h3 className="font-black text-xs md:text-xl text-white leading-relaxed pointer-events-none">
                                                    {lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en}
                                                </h3>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 shrink-0 relative z-10 w-full overflow-hidden flex flex-col justify-end pb-1 md:pb-2">
                                    {stage === 'challenge3' ? (
                                        <div className="grid grid-cols-2 gap-2 md:gap-4 w-full">
                                            {currentQuestions[qIndex].options.map((opt: string, idx: number) => (
                                                <div 
                                                    key={idx}
                                                    onPointerDown={(e) => handleDragStart(e, opt, 'opt', opt)}
                                                    className={`realistic-book p-2.5 md:p-4 font-black text-[10px] md:text-sm text-center flex items-center justify-center min-h-[60px] md:min-h-[80px] cursor-grab active:cursor-grabbing text-slate-200 border border-slate-700/80 hover:border-amber-400/80 drop-target`}
                                                    style={{ touchAction: 'none', opacity: isDraggingState && dragDataRef.current?.id === opt ? 0.25 : 1 }}
                                                >
                                                    <span className="pointer-events-none leading-snug px-1">{opt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full">
                                            {ch1Options.map(cat => (
                                                <div 
                                                    key={cat.code} 
                                                    ref={(el) => { if (el) dropZonesRef.current.set(cat.code, el); else dropZonesRef.current.delete(cat.code); }}
                                                    className={`wood-shelf h-20 md:h-32 flex flex-col justify-end items-center pb-2 cursor-pointer transition-all duration-150 ${hoveredDropZone === cat.code ? 'ring-4 ring-amber-400 brightness-125 scale-105' : ''}`}
                                                >
                                                    <div className="bg-slate-900/90 text-white text-[10px] md:text-sm font-black px-2 py-1 md:px-3 md:py-2 rounded-lg shadow mb-1 text-center w-[92%] truncate pointer-events-none border border-slate-700" style={{ borderBottom: `3px solid ${cat.color}` }}>
                                                        {lang === 'ar' ? cat.shortAr : cat.shortEn}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {stage === 'challenge2' && (
                            <div className="space-arena flex-1 flex flex-col bg-slate-950 rounded-2xl overflow-hidden relative border-2 border-slate-800 shadow-inner p-2 md:p-4">
                                <div className="text-center mb-1 md:mb-3 z-20 shrink-0">
                                    <p className="text-[9px] md:text-xs font-black text-cyan-400 mb-0.5">{dict.shootInstruction}</p>
                                    <div className="bg-slate-900/90 border border-slate-700 text-amber-300 p-2 md:p-3 rounded-xl inline-block max-w-[280px] md:max-w-xl text-[11px] md:text-lg font-black shadow-lg leading-tight">
                                        {lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en}
                                    </div>
                                </div>

                                <div className="flex justify-between w-full px-1 md:px-10 relative z-20 shrink-0 mt-2">
                                    {ch2Options.map((opt, idx) => (
                                        <div key={idx} className="flex flex-col items-center w-1/4 px-0.5">
                                            <div className="planet-chip w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center font-black text-[8px] md:text-xs text-white shadow-[0_0_12px_rgba(255,255,255,0.2)] float-anim text-center leading-tight p-0.5 border border-white/20" style={{ backgroundColor: opt.color, animationDelay: `${idx * 0.2}s` }}>
                                                {lang === 'ar' ? opt.shortAr : opt.shortEn}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-1 relative mt-2 md:mt-6">
                                    <div className="absolute inset-0 flex justify-between px-1 md:px-10 pointer-events-none opacity-10">
                                        {[0, 1, 2, 3].map(i => <div key={i} className="w-1/4 flex justify-center"><div className="w-px h-full bg-cyan-400 border-dashed border-l"></div></div>)}
                                    </div>

                                    <div className="absolute bottom-0 w-full flex justify-between px-1 md:px-10 pb-1 md:pb-3 z-30">
                                        {[0, 1, 2, 3].map(pos => (
                                            <div key={pos} className="w-1/4 flex justify-center relative">
                                                {rocketPos === pos && (
                                                    <>
                                                        <svg className="w-8 h-8 md:w-16 md:h-16 text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2.5l-4.5 9h9zM7.5 13L5 21l7-3 7 3-2.5-8H7.5z" />
                                                        </svg>
                                                        {isShooting && <div className="laser-beam left-1/2 -translate-x-1/2"></div>}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:hidden flex justify-between items-center mt-1 gap-1.5 z-30 shrink-0">
                                    <button onClick={() => setRocketPos(p => (lang === 'ar' ? Math.min(3, p + 1) : Math.max(0, p - 1)))} className="game-action flex-1 bg-slate-800 text-cyan-400 p-2.5 rounded-xl active:bg-slate-700 text-lg font-black shadow border border-slate-700">
                                        {lang === 'ar' ? '►' : '◄'}
                                    </button>
                                    <button onClick={handleShoot} className="game-action flex-[2] bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 p-2.5 rounded-xl active:scale-95 font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                        {dict.fireBtn}
                                    </button>
                                    <button onClick={() => setRocketPos(p => (lang === 'ar' ? Math.max(0, p - 1) : Math.min(3, p + 1)))} className="game-action flex-1 bg-slate-800 text-cyan-400 p-2.5 rounded-xl active:bg-slate-700 text-lg font-black shadow border border-slate-700">
                                        {lang === 'ar' ? '◄' : '►'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 4. شاشة الشهادة (الطباعة والعرض) */}
            {stage === 'certificate' && (
                <div className="w-full flex flex-col items-center animate-fade-in-up relative z-10 pt-2 pb-16 print:pt-0 print:pb-0 overflow-y-auto max-h-[100dvh]">
                    
                    <div id="certificate-print-container" className="hidden print:flex">
                        <div id="certificate-area-print" className="cert-font text-slate-900">
                            <div className="flex justify-between items-center border-b-2 border-amber-600 pb-3 mb-2">
                                <img src="/school-logo.png" alt="School Logo" className="w-20 h-20 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                                <div className={`text-left ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                    <h2 className="text-lg font-black text-slate-900 leading-tight">{dict.schoolName}</h2>
                                    <p className="text-xs text-amber-700 font-bold mt-1">{dict.dept}</p>
                                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">{dict.certDate} {issueDate}</p>
                                </div>
                            </div>

                            <div className="text-center my-auto py-2">
                                <h1 className="text-3xl font-black text-amber-700 mb-2">{dict.certTitle}</h1>
                                <div className="w-32 h-1 bg-amber-500 mx-auto rounded-full mb-3"></div>
                                
                                <p className="text-base font-bold text-slate-700 mb-1">
                                    {dict.certAwardedTo}
                                </p>
                                <h2 className="text-2xl font-black text-slate-900 my-2 bg-slate-50 inline-block px-8 py-2 rounded-xl border border-slate-300">
                                    {studentName}
                                </h2>
                                <p className="text-base font-bold text-slate-700 mt-1">
                                    {dict.certGrade} <strong className="text-amber-800 text-xl mx-1">{studentGrade}</strong>
                                </p>
                                
                                <p className="text-xs leading-relaxed mt-4 max-w-lg mx-auto font-bold text-slate-600">
                                    {dict.certBody}
                                </p>
                            </div>

                            <div className="flex justify-center gap-12 text-center bg-amber-50/70 p-4 rounded-xl border border-amber-200 my-2">
                                <div>
                                    <div className="text-[10px] text-slate-600 font-black uppercase mb-0.5">{dict.certPoints}</div>
                                    <div className="text-2xl font-black text-emerald-700">{score} <span className="text-xs text-slate-400">/ 300</span></div>
                                </div>
                                <div className="w-0.5 bg-amber-200"></div>
                                <div>
                                    <div className="text-[10px] text-slate-600 font-black uppercase mb-0.5">{dict.certTime}</div>
                                    <div className="text-2xl font-black text-amber-800">{formatTime(totalTime)}</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end px-6 mt-2">
                                <div className="text-center">
                                    <p className="text-sm font-black text-slate-800 mb-2">{dict.certSign}</p>
                                    <div className="w-36 h-0.5 bg-slate-800"></div>
                                </div>
                                <img src="/saqr-avatar.png" alt="Saqr Avatar" className="w-20 h-20 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                        </div>
                    </div>

                    <div className="cert-font bg-white text-slate-900 border-4 md:border-8 border-amber-500 rounded-3xl shadow-2xl p-5 md:p-8 w-[95%] max-w-xl my-2 print:hidden flex flex-col justify-between">
                        <div className="flex justify-between items-center border-b-2 border-amber-400 pb-3 mb-3">
                            <img src="/school-logo.png" alt="School Logo" className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow" onError={(e) => e.currentTarget.style.display = 'none'} />
                            <div className={`text-left ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h2 className="text-xs md:text-lg font-black text-slate-900 leading-tight">{dict.schoolName}</h2>
                                <p className="text-[10px] md:text-xs text-amber-700 font-bold mt-1 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-200">{dict.dept}</p>
                                <p className="text-[9px] md:text-[11px] text-slate-500 font-bold mt-0.5">{dict.certDate} {issueDate}</p>
                            </div>
                        </div>

                        <div className="text-center my-auto py-2">
                            <h1 className="text-lg md:text-3xl font-black text-amber-600 mb-1">{dict.certTitle}</h1>
                            <div className="w-24 md:w-32 h-1 bg-amber-500 mx-auto rounded-full mb-3"></div>
                            
                            <p className="text-xs md:text-sm font-bold text-slate-700 mb-1">
                                {dict.certAwardedTo}
                            </p>
                            <h2 className="text-base md:text-2xl font-black text-slate-900 my-1 bg-slate-50 inline-block px-6 py-1.5 rounded-xl border border-slate-300 shadow-sm">
                                {studentName}
                            </h2>
                            <p className="text-xs md:text-sm font-bold text-slate-700 mt-1">
                                {dict.certGrade} <strong className="text-amber-800 text-sm md:text-lg mx-1">{studentGrade}</strong>
                            </p>
                            
                            <p className="text-[11px] md:text-xs leading-relaxed mt-2 max-w-md mx-auto font-bold text-slate-600">
                                {dict.certBody}
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 md:gap-12 text-center bg-amber-50/70 p-2.5 md:p-4 rounded-xl border border-amber-200 my-3 relative">
                            {pointsSaved && (
                                <div className="absolute -top-3 right-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce">
                                    {dict.pointsSaved}
                                </div>
                            )}
                            <div>
                                <div className="text-[9px] md:text-xs text-slate-600 font-black uppercase mb-0.5">{dict.certPoints}</div>
                                <div className="text-lg md:text-2xl font-black text-emerald-700">{score} <span className="text-[10px] text-slate-400">/ 300</span></div>
                            </div>
                            <div className="w-0.5 bg-amber-200"></div>
                            <div>
                                <div className="text-[9px] md:text-xs text-slate-600 font-black uppercase mb-0.5">{dict.certTime}</div>
                                <div className="text-lg md:text-2xl font-black text-amber-700">{formatTime(totalTime)}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-end px-2 md:px-4 mt-1">
                            <div className="text-center">
                                <p className="text-xs md:text-sm font-black text-slate-800 mb-2">{dict.certSign}</p>
                                <div className="w-24 md:w-36 h-0.5 bg-slate-800"></div>
                            </div>
                            <img src="/saqr-avatar.png" alt="Saqr Avatar" className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                    </div>

                    <div className="mt-3 flex gap-3 no-print relative z-10 w-[95%] max-w-xl pb-6">
                        <button onClick={() => window.print()} className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm md:text-base rounded-xl shadow-lg active:scale-95 text-center">
                            {dict.print}
                        </button>
                        <Link to="/home" className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm md:text-base rounded-xl shadow-md active:scale-95 text-center flex items-center justify-center border border-slate-700">
                            {dict.back}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeweyGame;
