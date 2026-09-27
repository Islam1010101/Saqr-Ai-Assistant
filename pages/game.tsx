import React, { useState, useEffect, useCallback, useRef } from 'react';
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
        rulesText: "المكتبة مثل مدينة كبيرة! قمنا بتقسيم الكتب إلى شوارع ملونة. في التحديات اسحب الكتب لأماكنها، وفي تحدي الفضاء استخدم صاروخك لإصابة التصنيف الصحيح!",
        readyBtn: "أنا مستعد للانطلاق!",
        ch1: "التحدي الأول: مساعدة القراء",
        ch2: "التحدي الثاني: تصويب الفضاء",
        ch3: "التحدي الثالث: ترتيب الأرفف",
        question: "المهمة",
        time: "الوقت",
        points: "النقاط",
        sec: "ث",
        correct: "عمل رائع! أنت بطل حقيقي!",
        wrong: "حاول مرة أخرى يا بطل!",
        dragInstruction: "اسحب هذا الكتاب إلى الرف المناسب",
        dropInstruction: "أفلت الكتاب هنا",
        shelfText: "المطلوب رف",
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
        enterDetails: "الرجاء إدخال اسمك وصفك لنتمكن من تجهيز شهادتك!",
        fireBtn: "إطلاق",
        shootInstruction: "استخدم الأسهم للحركة و Space للرماية!",
        tutorialBtn: "فهمت، ابدأ التحدي",
        tutCh1Title: "مساعدة القراء",
        tutCh1Desc: "اسحب طلب الطالب وأفلته على الرف الصحيح. 20 نقطة لكل إجابة!",
        tutCh2Title: "تصويب الفضاء",
        tutCh2Desc: "حرك الصاروخ وأطلق النار على كوكب التصنيف الصحيح. 20 نقطة لكل إجابة!",
        tutCh3Title: "ترتيب الأرفف",
        tutCh3Desc: "اسحب الكتاب المناسب وضعه على الرف المطلوب. 20 نقطة لكل إجابة!"
    },
    en: {
        title: "Knowledge Heroes",
        subtitle: "Welcome! Help us organize the library to become a hero.",
        studentName: "Hero's Name:",
        namePlaceholder: "Enter your full name...",
        grade: "Grade:",
        gradePlaceholder: "e.g., Grade 5A",
        start: "Enter Challenge",
        rulesTitle: "How to Play?",
        rulesText: "The library is a big city! Drag books to their shelves, and use your rocket in the Space Challenge to shoot the correct category!",
        readyBtn: "I am ready to go!",
        ch1: "Challenge 1: Help Readers",
        ch2: "Challenge 2: Space Shooter",
        ch3: "Challenge 3: Fill Shelves",
        question: "Task",
        time: "Time Left",
        points: "Points",
        sec: "s",
        correct: "Great job! You are a hero!",
        wrong: "Try again, hero!",
        dragInstruction: "Drag this book to the correct shelf",
        dropInstruction: "Drop book here",
        shelfText: "Target Shelf",
        certTitle: "Outstanding Librarian Certificate",
        certAwardedTo: "The Administration certifies that the hero:",
        certGrade: "Grade",
        certBody: "has passed the challenge, showing exceptional skill and high intelligence in classifying knowledge.",
        certPoints: "Total Points",
        certTime: "Time Taken",
        certDate: "Issue Date:",
        certSign: "Librarian Signature",
        print: "Print Certificate",
        back: "Back to Library",
        schoolName: "Emirates Falcon Int'l. Private School",
        dept: "Digital Library Dept.",
        minutes: "min and",
        seconds: "sec",
        enterDetails: "Please enter your name and grade to prepare your certificate!",
        fireBtn: "FIRE",
        shootInstruction: "Use arrows to move and Spacebar to shoot!",
        tutorialBtn: "Got it, Start Challenge",
        tutCh1Title: "Help the Readers",
        tutCh1Desc: "Drag the student's request to the correct shelf. 20 points per answer!",
        tutCh2Title: "Space Shooter",
        tutCh2Desc: "Move the rocket and shoot the planet with the correct category. 20 points!",
        tutCh3Title: "Fill the Shelves",
        tutCh3Desc: "Drag the correct book onto the required shelf. 20 points per answer!"
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
    { ar: "أحمد يبحث عن كواكب ونجوم", en: "Ahmed wants planets and stars", answer: "500" },
    { ar: "مريم تريد قاموس إنجليزي", en: "Maryam wants an English dictionary", answer: "400" },
    { ar: "عمر يطلب قصص الأنبياء", en: "Omar asks for Prophets' stories", answer: "200" },
    { ar: "سارة تتعلم رسم الكرتون", en: "Sara wants to draw cartoons", answer: "700" },
    { ar: "خالد يبحث عن تاريخ الإمارات", en: "Khalid is looking for UAE history", answer: "900" },
    { ar: "فاطمة تحب أجهزة الكمبيوتر", en: "Fatima loves computers", answer: "000" },
    { ar: "يوسف يريد أن يقرأ عن الفيتامينات", en: "Yousef wants to read about vitamins", answer: "600" },
    { ar: "علي يبحث عن شعر للإذاعة", en: "Ali needs a radio poem", answer: "800" },
    { ar: "هدى تقرأ عن حقوق الطفل", en: "Huda reads about children's rights", answer: "300" },
    { ar: "ماجد يبحث ليزيد ثقته بنفسه", en: "Majid builds self-confidence", answer: "100" },
    { ar: "ليلى تبحث عن خريطة قارات العالم", en: "Laila searches for a world map", answer: "900" },
    { ar: "سعيد يريد قصة مغامرات شيقة", en: "Saeed wants an adventure story", answer: "800" },
    { ar: "راشد يسأل عن عالم النباتات", en: "Rashed asks about plants", answer: "500" },
    { ar: "منى تتعلم الإسعافات الأولية", en: "Mona learns first aid", answer: "600" },
    { ar: "حسن يسأل لتعلم الفرنسية", en: "Hassan wants to learn French", answer: "400" },
    { ar: "نورة تبحث موسوعة الاختراعات", en: "Noura looks for inventions", answer: "600" },
    { ar: "طارق يقرأ عن غزوات الرسول", en: "Tariq reads about Prophet's battles", answer: "200" },
    { ar: "عبير تحل المشكلات النفسية", en: "Abeer solves psychological problems", answer: "100" },
    { ar: "جمال يحتاج قوانين الشطرنج", en: "Jamal needs chess rules", answer: "700" },
    { ar: "سالم يشرح كيفية عمل الروبوتات", en: "Salem explains how robots work", answer: "000" }
];

const BANK_ORBS = [
    { ar: "كتاب: الكمبيوتر والإنترنت", en: "Book: Computers & Internet", answer: "000" },
    { ar: "كتاب: كيف تتحكم في غضبك", en: "Book: Control Anger", answer: "100" },
    { ar: "كتاب: أركان الإسلام", en: "Book: Pillars of Islam", answer: "200" },
    { ar: "كتاب: قوانين المرور", en: "Book: Traffic Laws", answer: "300" },
    { ar: "كتاب: قواعد اللغة العربية", en: "Book: Arabic Grammar", answer: "400" },
    { ar: "كتاب: الديناصورات والحيوانات", en: "Book: Dinosaurs & Animals", answer: "500" },
    { ar: "كتاب: سيارة ذكية", en: "Book: Smart Car", answer: "600" },
    { ar: "كتاب: قوانين كرة القدم", en: "Book: Football Rules", answer: "700" },
    { ar: "رواية: مغامرات أليس", en: "Novel: Alice's Adventures", answer: "800" },
    { ar: "أطلس: خرائط العالم", en: "Atlas: World Maps", answer: "900" },
    { ar: "كتاب: التفكير الإيجابي", en: "Book: Positive Thinking", answer: "100" },
    { ar: "كتاب: الفضاء والمجرات", en: "Book: Space & Galaxies", answer: "500" },
    { ar: "كتاب: تاريخ الصحراء", en: "Book: Desert History", answer: "900" },
    { ar: "كتاب: فن الخط العربي", en: "Book: Arabic Calligraphy", answer: "700" },
    { ar: "كتاب: أساسيات الذكاء الاصطناعي", en: "Book: AI Basics", answer: "000" },
    { ar: "كتاب: الإسعافات الأولية", en: "Book: First Aid", answer: "600" },
    { ar: "كتاب: السيرة النبوية", en: "Book: Prophet's Bio", answer: "200" },
    { ar: "كتاب: تعلم اللغة الصينية", en: "Book: Learn Chinese", answer: "400" },
    { ar: "كتاب: حقوق الإنسان", en: "Book: Human Rights", answer: "300" },
    { ar: "رواية: جزيرة الكنز", en: "Novel: Treasure Island", answer: "800" }
];

const BANK_SHELVES = [
    { shelfCode: "500", arShelf: "علوم وفضاء", enShelf: "Science", arCorrect: "أسرار الفضاء", enCorrect: "Space Secrets", arWrongs: ["تاريخ العرب", "تعلم الرسم", "قواعد الإملاء"], enWrongs: ["Arab History", "How to Draw", "Spelling"] },
    { shelfCode: "700", arShelf: "فنون ورياضة", enShelf: "Arts & Sports", arCorrect: "أبطال السباحة", enCorrect: "Swimming Heroes", arWrongs: ["جسم الإنسان", "الكمبيوتر", "القصة القصيرة"], enWrongs: ["Human Body", "Computers", "Short Stories"] },
    { shelfCode: "900", arShelf: "تاريخ وجغرافيا", enShelf: "History", arCorrect: "حضارة الفراعنة", enCorrect: "Pharaohs History", arWrongs: ["الإسبانية", "أخلاق المسلم", "عالم الطيور"], enWrongs: ["Spanish", "Muslim Morals", "Bird World"] },
    { shelfCode: "600", arShelf: "تكنولوجيا وطب", enShelf: "Tech & Med", arCorrect: "السيارات الذكية", enCorrect: "Smart Cars", arWrongs: ["الشعر", "خريطة أوروبا", "حقوق الإنسان"], enWrongs: ["Poetry", "Europe Map", "Human Rights"] },
    { shelfCode: "800", arShelf: "قصص وحكايات", enShelf: "Stories", arCorrect: "سندريلا", enCorrect: "Cinderella", arWrongs: ["البرمجة", "القرآن", "الجاذبية"], enWrongs: ["Coding", "Quran", "Gravity"] },
    { shelfCode: "200", arShelf: "دين وأخلاق", enShelf: "Religion", arCorrect: "أخلاق المسلم", enCorrect: "Muslim Morals", arWrongs: ["العواصم", "الأدوية", "الشطرنج"], enWrongs: ["Capitals", "Medicine", "Chess"] },
    { shelfCode: "000", arShelf: "حاسب ومعارف", enShelf: "Computers", arCorrect: "الإنترنت الآمن", enCorrect: "Safe Internet", arWrongs: ["تاريخ الأندلس", "السباحة", "قصص جحا"], enWrongs: ["History", "Swimming", "Juha Stories"] },
    { shelfCode: "100", arShelf: "تطوير الذات", enShelf: "Self Growth", arCorrect: "الثقة بالنفس", enCorrect: "Confidence", arWrongs: ["الصيام", "بايثون", "تاريخ القارات"], enWrongs: ["Fasting", "Python", "Continents"] }
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

    const [stage, setStage] = useState<'intro' | 'learn' | 'tut1' | 'challenge1' | 'tut2' | 'challenge2' | 'tut3' | 'challenge3' | 'certificate'>('intro');
    const [studentName, setStudentName] = useState('');
    const [studentGrade, setStudentGrade] = useState('');
    
    const [score, setScore] = useState(0);
    const [totalTime, setTotalTime] = useState(0); 
    const [questionTimer, setQuestionTimer] = useState(20);
    
    const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
    const [qIndex, setQIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [issueDate, setIssueDate] = useState('');

    // خيارات التحدي الأول (4 رفوف فقط لتناسب الموبايل)
    const [ch1Options, setCh1Options] = useState<any[]>([]);

    // === متغيرات السحب والإفلات المخصصة للهواتف ===
    const [dragItem, setDragItem] = useState<{ id: string, type: 'q' | 'opt', content?: string } | null>(null);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
    const dragItemRef = useRef<{ id: string, type: 'q' | 'opt', content?: string } | null>(null);
    const dropZonesRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const isDragging = useRef(false);

    // === متغيرات لعبة الصاروخ (التحدي 2) ===
    const [rocketPos, setRocketPos] = useState(1);
    const [ch2Options, setCh2Options] = useState<any[]>([]);
    const [isShooting, setIsShooting] = useState(false);

    // إخفاء شريط رأس الموقع أثناء التحديات
    useEffect(() => {
        if (stage.startsWith('challenge')) {
            document.body.classList.add('hide-site-header');
        } else {
            document.body.classList.remove('hide-site-header');
        }
        return () => {
            document.body.classList.remove('hide-site-header');
        };
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

    // إيقاف التمرير فقط أثناء سحب عنصر باللمس
    useEffect(() => {
        const preventDefault = (e: TouchEvent) => {
            if (isDragging.current) e.preventDefault();
        };
        document.addEventListener('touchmove', preventDefault, { passive: false });
        return () => document.removeEventListener('touchmove', preventDefault);
    }, []);

    const handleStart = () => {
        if (!studentName.trim() || !studentGrade.trim()) {
            alert(dict.enterDetails);
            return;
        }
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
                // إرجاع 4 خيارات للتحدي الثالث
                options: shuffleArray([correct, ...wrongs.slice(0, 3)]) 
            };
        });
        setCurrentQuestions(mixed);
        setQIndex(0); 
        setQuestionTimer(20); 
        setStage('challenge3');
    };

    const handleTimeout = () => {
        setFeedback('wrong');
        setDragItem(null);
        dragItemRef.current = null;
        isDragging.current = false;
        setTimeout(() => nextQuestion(), 1500);
    };

    const handleAnswer = (providedAnswer: string) => {
        if (feedback) return; 
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
        setDragItem(null);
        dragItemRef.current = null;
        isDragging.current = false;
        setTimeout(() => nextQuestion(), 1500);
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

    // =========================================================================
    // نظام السحب والإفلات فائق السرعة والمزامنة المباشرة
    // =========================================================================
    
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent, id: string, type: 'q' | 'opt', content?: string) => {
        if (feedback) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        isDragging.current = true;
        const itemObj = { id, type, content };
        dragItemRef.current = itemObj;
        setDragItem(itemObj);
        setDragPos({ x: clientX, y: clientY });
    };

    const handleDragMove = useCallback((e: TouchEvent | MouseEvent) => {
        if (!isDragging.current || !dragItemRef.current) return;
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
        setDragPos({ x: clientX, y: clientY });
    }, []);

    const handleDragEnd = useCallback((e: TouchEvent | MouseEvent) => {
        if (!isDragging.current || !dragItemRef.current) return;
        
        const clientX = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0].clientY : (e as MouseEvent).clientY;
        
        let droppedOn = null;
        dropZonesRef.current.forEach((el, key) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
                droppedOn = key;
            }
        });

        if (droppedOn) {
            if (stage === 'challenge3') {
                handleAnswer(dragItemRef.current.content || dragItemRef.current.id);
            } else {
                handleAnswer(droppedOn);
            }
        }
        
        setDragItem(null);
        dragItemRef.current = null;
        isDragging.current = false;
    }, [stage, handleAnswer]);

    useEffect(() => {
        window.addEventListener('mousemove', handleDragMove, { passive: false });
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('touchend', handleDragEnd);
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [handleDragMove, handleDragEnd]);

    // =========================================================================
    // منطق لعبة الصاروخ (التحدي 2)
    // =========================================================================
    const handleShoot = useCallback(() => {
        if (feedback || isShooting) return;
        setIsShooting(true);
        const shotCategory = ch2Options[rocketPos].code;
        
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1666/1666-preview.mp3');
        audio.volume = 0.1; audio.play().catch(()=>{});

        setTimeout(() => {
            handleAnswer(shotCategory);
        }, 300);
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

    return (
        <div className={`min-h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-2 md:p-4 relative select-none ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'} ${stage === 'certificate' ? 'overflow-y-auto' : 'overflow-hidden touch-none'}`}>
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                
                .dir-rtl { direction: rtl; }
                .dir-ltr { direction: ltr; }
                
                /* إخفاء شريط الموقع أثناء التحديات */
                body.hide-site-header header,
                body.hide-site-header nav,
                body.hide-site-header .site-header,
                body.hide-site-header [role="banner"],
                body.hide-site-header nav-bar {
                    display: none !important;
                }

                @media print {
                    html, body {
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                    }
                    body * { display: none !important; }
                    
                    #certificate-print-container, 
                    #certificate-print-container * {
                        display: block !important;
                        visibility: visible !important;
                    }
                    
                    #certificate-print-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        height: 100% !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }

                    #certificate-area {
                        width: 210mm !important;
                        height: 290mm !important;
                        margin: auto !important;
                        padding: 12mm !important;
                        box-sizing: border-box !important;
                        border: 12px solid #f59e0b !important;
                        background: #ffffff !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: space-between !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        page-break-after: avoid !important;
                        page-break-before: avoid !important;
                        break-inside: avoid !important;
                    }
                }

                @page { size: A4 portrait; margin: 0; }

                .magic-glow {
                    animation: pulse-glow 2s infinite alternate ease-in-out;
                }
                @keyframes pulse-glow {
                    0% { filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.4)); transform: scale(1) translateY(0px); }
                    100% { filter: drop-shadow(0 0 25px rgba(245, 158, 11, 0.8)); transform: scale(1.02) translateY(-3px); }
                }
                
                .float-anim { animation: floating 3s ease-in-out infinite; }
                @keyframes floating {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                    100% { transform: translateY(0px); }
                }

                .wood-shelf {
                    position: relative;
                    background: linear-gradient(to bottom, #d97706 0%, #b45309 100%);
                    border-bottom: 6px solid #78350f;
                    border-radius: 8px;
                    box-shadow: inset 0 -2px 5px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.3);
                }
                
                .realistic-book {
                    position: relative;
                    background: linear-gradient(135deg, #ffffff, #f1f5f9);
                    border-left: 8px solid #cbd5e1;
                    border-radius: 4px 10px 10px 4px;
                    box-shadow: -2px 4px 6px rgba(0,0,0,0.15);
                }

                .laser-beam {
                    position: absolute;
                    bottom: 40px;
                    width: 4px;
                    height: 25px;
                    background: #ef4444;
                    box-shadow: 0 0 8px #ef4444, 0 0 15px #ef4444;
                    border-radius: 10px;
                    animation: shoot-up 0.3s linear forwards;
                    z-index: 20;
                }
                @keyframes shoot-up {
                    0% { bottom: 40px; opacity: 1; }
                    100% { bottom: 100%; opacity: 0; }
                }

                .cert-font { font-family: 'Cairo', sans-serif !important; }
                
                .compact-layout {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    max-height: 94vh;
                    justify-content: space-between;
                }
            `}</style>

            {/* --- العنصر الممسوك (متحرك ومطابق للمؤشر بدون أي تأخير) --- */}
            {dragItem && (
                <div 
                    className="fixed pointer-events-none z-[9999] realistic-book p-3 font-black text-center flex items-center justify-center bg-white shadow-2xl text-slate-900 border-2 border-amber-400"
                    style={{
                        left: `${dragPos.x}px`,
                        top: `${dragPos.y}px`,
                        transform: 'translate(-50%, -50%)',
                        width: dragItem.type === 'q' ? '200px' : '140px',
                        minHeight: '55px',
                        fontSize: dragItem.type === 'q' ? '0.85rem' : '0.8rem'
                    }}
                >
                    {dragItem.content || (lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en)}
                </div>
            )}

            {/* 1. شاشة البداية */}
            {stage === 'intro' && (
                <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center animate-fade-in-up relative z-10">
                    <img src="/Game.png" alt="Game Logo" className="w-28 h-28 md:w-40 md:h-40 mx-auto mb-4 object-contain magic-glow" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <h1 className="text-xl md:text-3xl font-black text-amber-500 mb-2">{dict.title}</h1>
                    <p className="text-[11px] md:text-sm opacity-90 mb-5 font-bold text-slate-600 dark:text-slate-400">{dict.subtitle}</p>
                    
                    <div className={`space-y-3 mb-5 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div>
                            <label className="text-[10px] md:text-xs font-bold text-slate-500 mb-1 block px-2">{dict.studentName}</label>
                            <input type="text" placeholder={dict.namePlaceholder} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold text-sm" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] md:text-xs font-bold text-slate-500 mb-1 block px-2">{dict.grade}</label>
                            <input type="text" placeholder={dict.gradePlaceholder} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-amber-500 font-bold text-sm" value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={handleStart} className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-black text-base md:text-xl rounded-xl shadow-[0_5px_15px_rgba(245,158,11,0.4)] transition-all active:scale-95 float-anim">
                        {dict.start}
                    </button>
                </div>
            )}

            {/* 2. شاشة التعلم */}
            {stage === 'learn' && (
                <div className="max-w-3xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl animate-zoom-in relative z-10 text-center flex flex-col h-[85vh] md:h-auto justify-between md:justify-start">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full mx-auto flex items-center justify-center mb-3 shrink-0">
                        <svg className="w-8 h-8 md:w-12 md:h-12 text-amber-500 magic-glow" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-amber-500 mb-2">{dict.rulesTitle}</h2>
                        <p className="text-[11px] md:text-lg leading-relaxed mb-4 opacity-90 font-bold text-slate-700 dark:text-slate-300">
                            {dict.rulesText}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-4 flex-1 md:flex-none content-start px-1">
                        {DEWEY_CATEGORIES.map(cat => (
                            <div key={cat.code} className="p-2 rounded-lg text-[9px] md:text-sm font-black shadow-sm text-white flex items-center justify-center text-center" style={{ backgroundColor: cat.color }}>
                                {lang === 'ar' ? cat.ar : cat.en}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setStage('tut1')} className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-black rounded-xl shadow-md transition-transform active:scale-95 text-base md:text-xl mt-auto shrink-0">
                        {dict.readyBtn}
                    </button>
                </div>
            )}

            {/* شاشات التعليمات قبل التحديات */}
            {stage === 'tut1' && (
                <div className="max-w-md w-full bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center animate-zoom-in relative z-10">
                    <h2 className="text-xl md:text-3xl font-black text-blue-500 mb-3">{dict.tutCh1Title}</h2>
                    <p className="text-sm md:text-lg leading-relaxed font-bold text-slate-700 dark:text-slate-300 mb-6">{dict.tutCh1Desc}</p>
                    <button onClick={startChallenge1} className="w-full py-3 bg-blue-500 text-white font-black text-base md:text-xl rounded-xl shadow-md active:scale-95">{dict.tutorialBtn}</button>
                </div>
            )}
            {stage === 'tut2' && (
                <div className="max-w-md w-full bg-red-50 dark:bg-slate-900 border border-red-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center animate-zoom-in relative z-10">
                    <h2 className="text-xl md:text-3xl font-black text-red-500 mb-3">{dict.tutCh2Title}</h2>
                    <p className="text-sm md:text-lg leading-relaxed font-bold text-slate-700 dark:text-slate-300 mb-6">{dict.tutCh2Desc}</p>
                    <button onClick={startChallenge2} className="w-full py-3 bg-red-500 text-white font-black text-base md:text-xl rounded-xl shadow-md active:scale-95">{dict.tutorialBtn}</button>
                </div>
            )}
            {stage === 'tut3' && (
                <div className="max-w-md w-full bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center animate-zoom-in relative z-10">
                    <h2 className="text-xl md:text-3xl font-black text-amber-500 mb-3">{dict.tutCh3Title}</h2>
                    <p className="text-sm md:text-lg leading-relaxed font-bold text-slate-700 dark:text-slate-300 mb-6">{dict.tutCh3Desc}</p>
                    <button onClick={startChallenge3} className="w-full py-3 bg-amber-500 text-white font-black text-base md:text-xl rounded-xl shadow-md active:scale-95">{dict.tutorialBtn}</button>
                </div>
            )}

            {/* 3. شاشات التحديات المدمجة للموبايل (Compact View) */}
            {stage.startsWith('challenge') && currentQuestions.length > 0 && (
                <div className="max-w-5xl w-full h-[94vh] md:h-auto md:min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 md:p-8 shadow-xl animate-fade-in-up relative z-10 compact-layout">
                    
                    {/* شريط الإحصائيات العلوية */}
                    <div className="flex justify-between items-center mb-2 bg-slate-100 dark:bg-slate-800 p-2 md:p-4 rounded-xl shadow-inner shrink-0">
                        <div>
                            <span className="text-amber-500 font-black text-xs md:text-xl block">
                                {stage === 'challenge1' ? dict.ch1 : stage === 'challenge2' ? dict.ch2 : dict.ch3}
                            </span>
                            <span className="text-[9px] md:text-sm opacity-70 font-bold">{dict.question} {qIndex + 1}/5</span>
                        </div>
                        <div className="flex gap-2 text-center">
                            <div className="bg-white dark:bg-slate-700 px-2 py-1 md:px-5 md:py-3 rounded-lg md:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-600 min-w-[45px]">
                                <div className="text-[8px] md:text-xs opacity-70 font-black">{dict.time}</div>
                                <div className={`font-black text-sm md:text-2xl ${questionTimer <= 5 ? 'text-red-500 magic-glow' : 'text-slate-800 dark:text-white'}`}>{questionTimer}</div>
                            </div>
                            <div className="bg-white dark:bg-slate-700 px-2 py-1 md:px-5 md:py-3 rounded-lg md:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-600 min-w-[45px]">
                                <div className="text-[8px] md:text-xs opacity-70 font-black">{dict.points}</div>
                                <div className="font-black text-sm md:text-2xl text-green-500">{score}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
                        
                        {/* التغذية الراجعة */}
                        {feedback ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 z-40 backdrop-blur-sm rounded-2xl animate-zoom-in">
                                {feedback === 'correct' ? (
                                    <svg className="w-20 h-20 text-green-500 mb-3 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                ) : (
                                    <svg className="w-20 h-20 text-red-500 mb-3 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                )}
                                <h3 className={`text-xl md:text-5xl font-black ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                                    {feedback === 'correct' ? dict.correct : dict.wrong}
                                </h3>
                            </div>
                        ) : null}

                        {/* ================================================= */}
                        {/* التحدي الأول والثالث (السحب والإفلات المدمج) */}
                        {/* ================================================= */}
                        {stage !== 'challenge2' && (
                            <>
                                <div className="flex flex-col items-center justify-center shrink-0 min-h-[90px] md:min-h-[160px] relative z-20 mb-2 md:mb-6">
                                    {stage === 'challenge3' ? (
                                        <div 
                                            ref={(el) => { if(el) dropZonesRef.current.set(currentQuestions[qIndex].shelfCode, el); }}
                                            className="w-full md:w-2/3 h-20 md:h-36 relative wood-shelf flex items-end justify-center pb-2 md:pb-5 mt-5"
                                        >
                                            {/* إبراز سؤال التحدي 3 بوضوح شديد */}
                                            <div className="absolute -top-7 md:-top-10 bg-amber-500 dark:bg-amber-600 px-4 py-2 rounded-xl font-black text-white shadow-lg border-2 border-amber-300 dark:border-amber-400 text-sm md:text-xl w-[92%] text-center truncate">
                                                {dict.shelfText}: {currentQuestions[qIndex].displayShelf}
                                            </div>
                                            <p className="text-amber-100 font-bold text-[10px] md:text-base tracking-widest opacity-80">{dict.dropInstruction}</p>
                                        </div>
                                    ) : (
                                        <div className="text-center w-full">
                                            <p className="text-[10px] md:text-base font-black opacity-70 mb-2 md:mb-4 text-slate-500 bg-slate-100 dark:bg-slate-800 inline-block px-3 py-1 rounded-full">{dict.dragInstruction}</p>
                                            <div 
                                                style={{ touchAction: 'none' }}
                                                onMouseDown={(e) => handleDragStart(e, 'q', 'q')}
                                                onTouchStart={(e) => handleDragStart(e, 'q', 'q')}
                                                className={`realistic-book p-4 md:p-10 max-w-[280px] md:max-w-xl mx-auto cursor-grab active:cursor-grabbing flex items-center justify-center text-center float-anim`}
                                                style={{ borderLeftColor: '#f59e0b', color: '#0f172a', opacity: dragItem?.type === 'q' ? 0.2 : 1 }}
                                            >
                                                <h3 className="font-black text-sm md:text-3xl leading-snug drop-shadow-sm pointer-events-none">
                                                    {lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en}
                                                </h3>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 shrink-0 relative z-10 w-full overflow-hidden flex flex-col justify-end pb-1 md:pb-2">
                                    {stage === 'challenge3' ? (
                                        /* 4 خيارات للتحدي الثالث */
                                        <div className="grid grid-cols-2 gap-2 md:gap-4 w-full">
                                            {currentQuestions[qIndex].options.map((opt: string, idx: number) => (
                                                <div 
                                                    key={idx}
                                                    style={{ touchAction: 'none' }}
                                                    onMouseDown={(e) => handleDragStart(e, opt, 'opt', opt)}
                                                    onTouchStart={(e) => handleDragStart(e, opt, 'opt', opt)}
                                                    className={`realistic-book p-2 md:p-5 font-black text-[10px] md:text-base text-center flex items-center justify-center min-h-[50px] md:min-h-[80px] cursor-grab active:cursor-grabbing text-slate-800`}
                                                    style={{ borderLeftColor: '#cbd5e1', opacity: dragItem?.id === opt ? 0.2 : 1 }}
                                                >
                                                    <span className="pointer-events-none leading-tight px-1">{opt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* التحدي الأول: 4 رفوف مريحة وواضحة جداً في شاشة الموبايل */
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full">
                                            {ch1Options.map(cat => (
                                                <div 
                                                    key={cat.code} 
                                                    ref={(el) => { if(el) dropZonesRef.current.set(cat.code, el); }}
                                                    className={`wood-shelf h-20 md:h-32 flex flex-col justify-end items-center pb-2`}
                                                >
                                                    <div className="bg-white/95 text-slate-900 text-[10px] md:text-sm font-black px-2 py-1 md:px-3 md:py-2 rounded shadow mb-1 text-center w-[92%] truncate pointer-events-none" style={{ borderBottom: `3px solid ${cat.color}` }}>
                                                        {lang === 'ar' ? cat.ar : cat.en}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ================================================= */}
                        {/* التحدي الثاني (لعبة الصاروخ) */}
                        {/* ================================================= */}
                        {stage === 'challenge2' && (
                            <div className="flex-1 flex flex-col bg-slate-900 rounded-2xl overflow-hidden relative border-4 border-slate-700 shadow-inner p-2 md:p-4">
                                <div className="text-center mb-1 md:mb-4 z-20 shrink-0">
                                    <p className="text-[8px] md:text-sm font-black text-sky-300 mb-0.5">{dict.shootInstruction}</p>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 md:p-4 rounded-xl inline-block max-w-[260px] md:max-w-xl text-[11px] md:text-2xl font-black shadow-md leading-tight">
                                        {lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en}
                                    </div>
                                </div>

                                <div className="flex justify-between w-full px-1 md:px-12 relative z-20 shrink-0 mt-2">
                                    {ch2Options.map((opt, idx) => (
                                        <div key={idx} className="flex flex-col items-center w-1/4 px-0.5">
                                            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center font-black text-[8px] md:text-base text-white shadow-[0_0_10px_rgba(255,255,255,0.3)] float-anim text-center leading-tight p-0.5" style={{ backgroundColor: opt.color, animationDelay: `${idx * 0.2}s` }}>
                                                {lang === 'ar' ? opt.ar : opt.en}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-1 relative mt-2 md:mt-8">
                                    <div className="absolute inset-0 flex justify-between px-1 md:px-12 pointer-events-none opacity-10">
                                        {[0, 1, 2, 3].map(i => <div key={i} className="w-1/4 flex justify-center"><div className="w-px h-full bg-white border-dashed border-l"></div></div>)}
                                    </div>

                                    <div className="absolute bottom-0 w-full flex justify-between px-1 md:px-12 pb-1 md:pb-4 z-30">
                                        {[0, 1, 2, 3].map(pos => (
                                            <div key={pos} className="w-1/4 flex justify-center relative">
                                                {rocketPos === pos && (
                                                    <>
                                                        <svg className="w-8 h-8 md:w-16 md:h-16 text-sky-400 drop-shadow-[0_0_8px_#38bdf8]" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2.5l-4.5 9h9zM7.5 13L5 21l7-3 7 3-2.5-8H7.5z" />
                                                        </svg>
                                                        {isShooting && <div className="laser-beam left-1/2 -translate-x-1/2"></div>}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:hidden flex justify-between items-center mt-1 gap-1 z-30 shrink-0">
                                    <button onTouchStart={(e) => {e.preventDefault(); setRocketPos(p => (lang === 'ar' ? Math.min(3, p + 1) : Math.max(0, p - 1)))}} className="flex-1 bg-slate-800 text-white p-2 rounded-lg active:bg-slate-700 text-base font-black shadow-sm">
                                        {lang === 'ar' ? '►' : '◄'}
                                    </button>
                                    <button onTouchStart={(e) => {e.preventDefault(); handleShoot();}} className="flex-[2] bg-red-600 text-white p-2 rounded-lg active:bg-red-700 font-black text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                                        {dict.fireBtn}
                                    </button>
                                    <button onTouchStart={(e) => {e.preventDefault(); setRocketPos(p => (lang === 'ar' ? Math.max(0, p - 1) : Math.min(3, p + 1)))}} className="flex-1 bg-slate-800 text-white p-2 rounded-lg active:bg-slate-700 text-base font-black shadow-sm">
                                        {lang === 'ar' ? '◄' : '►'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 4. شاشة الشهادة (تفعيل التمرير الكامل على الهواتف مع طباعة A4 دقيقة) */}
            {stage === 'certificate' && (
                <div className="w-full flex flex-col items-center animate-fade-in-up relative z-10 pt-4 pb-16 print:pt-0 print:pb-0 overflow-y-auto max-h-[100dvh]">
                    
                    {/* حاوية مخصصة للطباعة A4 فقط */}
                    <div id="certificate-print-container" className="hidden print:flex">
                        <div 
                            id="certificate-area" 
                            className="cert-font bg-white text-slate-900 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between"
                        >
                            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }}></div>
                            
                            <div className="flex justify-between items-center border-b-[4px] border-amber-500/30 pb-6 mb-6 relative z-10">
                                <img src="/school-logo.png" alt="School Logo" className="w-24 h-24 object-contain drop-shadow-xl" onError={(e) => e.currentTarget.style.display = 'none'} />
                                <div className={`text-left ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                    <h2 className="text-xl md:text-2xl font-black text-red-700 uppercase tracking-widest">{dict.schoolName}</h2>
                                    <p className="text-xs md:text-sm text-amber-600 font-black mt-2 bg-amber-50 inline-block px-3 py-1.5 rounded-xl border border-amber-200">{dict.dept}</p>
                                    <p className="text-xs text-slate-500 font-bold mt-1">{dict.certDate} {issueDate}</p>
                                </div>
                            </div>

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

                            <div className="flex justify-between items-end relative z-10 px-4 md:px-8 mt-4">
                                <div className="text-center">
                                    <p className="text-base md:text-lg font-black text-slate-800 mb-4">{dict.certSign}</p>
                                    <div className="w-40 md:w-56 h-[2px] bg-slate-800"></div>
                                </div>
                                <img src="/saqr-avatar.png" alt="Saqr Avatar" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                        </div>
                    </div>

                    {/* عرض الشهادة على شاشة الجهاز (قابلة للتمرير بسهولة) */}
                    <div className="cert-font bg-white text-slate-900 border-[8px] md:border-[14px] border-amber-500 p-5 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between print:hidden w-[95%] max-w-2xl my-4">
                        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }}></div>
                        
                        <div className="flex justify-between items-center border-b-[2px] md:border-b-[4px] border-amber-500/30 pb-4 mb-4 relative z-10">
                            <img src="/school-logo.png" alt="School Logo" className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-xl" onError={(e) => e.currentTarget.style.display = 'none'} />
                            <div className={`text-left ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h2 className="text-xs md:text-2xl font-black text-red-700 uppercase tracking-widest">{dict.schoolName}</h2>
                                <p className="text-[9px] md:text-sm text-amber-600 font-black mt-1 bg-amber-50 inline-block px-2 py-1 rounded-lg border border-amber-200">{dict.dept}</p>
                                <p className="text-[9px] md:text-xs text-slate-500 font-bold mt-1">{dict.certDate} {issueDate}</p>
                            </div>
                        </div>

                        <div className="text-center relative z-10 my-auto py-2">
                            <h1 className="text-xl md:text-4xl font-black text-amber-600 mb-2 drop-shadow-sm">{dict.certTitle}</h1>
                            <div className="w-20 md:w-36 h-1 bg-red-600 mx-auto rounded-full mb-3"></div>
                            
                            <p className="text-xs md:text-xl leading-relaxed font-bold mb-2 text-slate-700">
                                {dict.certAwardedTo}
                            </p>
                            <h2 className="text-base md:text-3xl font-black text-slate-900 my-2 bg-slate-50 inline-block px-6 py-2 rounded-xl border border-slate-200 shadow-sm">
                                {studentName}
                            </h2>
                            <p className="text-xs md:text-xl leading-relaxed font-bold text-slate-700 mt-1">
                                {dict.certGrade} <strong className="text-red-700 text-sm md:text-2xl mx-1">{studentGrade}</strong>
                            </p>
                            
                            <p className="text-[10px] md:text-base leading-relaxed mt-3 opacity-90 max-w-xl mx-auto font-bold text-slate-600">
                                {dict.certBody}
                            </p>
                        </div>

                        <div className="flex justify-center gap-4 md:gap-12 text-center relative z-10 bg-slate-50 p-3 md:p-5 rounded-xl border border-slate-200 shadow-inner my-4">
                            <div>
                                <div className="text-[9px] md:text-xs text-slate-500 font-black uppercase mb-0.5">{dict.certPoints}</div>
                                <div className="text-base md:text-3xl font-black text-green-600">{score} <span className="text-xs text-slate-400">/ 300</span></div>
                            </div>
                            <div className="w-0.5 bg-slate-200 rounded-full"></div>
                            <div>
                                <div className="text-[9px] md:text-xs text-slate-500 font-black uppercase mb-0.5">{dict.certTime}</div>
                                <div className="text-base md:text-3xl font-black text-amber-600">{formatTime(totalTime)}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-end relative z-10 px-2 md:px-6 mt-2">
                            <div className="text-center">
                                <p className="text-xs md:text-base font-black text-slate-800 mb-2">{dict.certSign}</p>
                                <div className="w-24 md:w-48 h-0.5 bg-slate-800"></div>
                            </div>
                            <img src="/saqr-avatar.png" alt="Saqr Avatar" className="w-14 h-14 md:w-28 md:h-28 object-contain drop-shadow-xl" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                    </div>

                    {/* الأزرار تحت الشهادة */}
                    <div className="mt-4 flex gap-3 no-print relative z-10 w-[95%] max-w-md pb-6">
                        <button onClick={() => window.print()} className="flex-[2] py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-sm md:text-lg rounded-xl shadow-lg active:scale-95 text-center">
                            {dict.print}
                        </button>
                        <Link to="/" className="flex-1 py-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black text-sm md:text-lg rounded-xl shadow-md active:scale-95 text-center flex items-center justify-center">
                            {dict.back}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeweyGame;
