import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

// ==========================================
// 1. القاموس والترجمة (عربي / إنجليزي)
// ==========================================

const T = {
    ar: {
        title: "تحدي أبطال المكتبة",
        subtitle: "مرحباً بك! ساعدنا في ترتيب مكتبة المدرسة لتصبح أمين مكتبة.",
        studentName: "اسم البطل / البطلة:",
        namePlaceholder: "اكتب اسمك الثلاثي هنا...",
        grade: "الصف الدراسي:",
        gradePlaceholder: "مثال: الخامس أ",
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
        enterDetails: "يرجى كتابة الاسم والصف لتجهيز شهادتك الرسمية!",
        fireBtn: "إطلاق الليزر",
        shootInstruction: "حرك الصاروخ بالأسهم واضغط زر الإطلاق أو المسافة لتصيب الكوكب المناسب!",
        tutorialBtn: "فهمت القواعد، ابدأ التحدي",
        tutCh1Title: "التحدي 1: مساعدة القراء",
        tutCh1Desc: "اقرأ ما يبحث عنه الطالب، ثم اسحب البطاقة وضعها في الرف المناسب. الإجابة الصحيحة = 20 نقطة!",
        tutCh2Title: "التحدي 2: تصويب الفضاء",
        tutCh2Desc: "اقرأ عنوان الكتاب، وحرّك صاروخك تحت كوكب التصنيف الصحيح ثم أطلق الليزر. الإجابة الصحيحة = 20 نقطة!",
        tutCh3Title: "التحدي 3: ترتيب الأرفف",
        tutCh3Desc: "انظر للرف المطلوب في الأعلى، ثم اسحب الكتاب الصحيح من الخيارات بالأسفل وضعه عليه. الإجابة الصحيحة = 20 نقطة!"
    },
    en: {
        title: "Library's Heroes",
        subtitle: "Welcome! Help us organize the library to become a Librarian.",
        studentName: "Hero's Name:",
        namePlaceholder: "Enter your full name...",
        grade: "Grade / Section:",
        gradePlaceholder: "e.g., Grade 5A",
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
        enterDetails: "Please enter your name and grade to prepare your official certificate!",
        fireBtn: "FIRE LASER",
        shootInstruction: "Move the rocket with arrows and press Fire or Space to hit the target planet!",
        tutorialBtn: "Got it, Start Challenge",
        tutCh1Title: "Challenge 1: Help Readers",
        tutCh1Desc: "Read what the student needs, then drag the question card to the matching shelf. Each correct answer = 20 pts!",
        tutCh2Title: "Challenge 2: Space Shooter",
        tutCh2Desc: "Read the book title, position your rocket beneath the correct category planet and shoot! Each hit = 20 pts!",
        tutCh3Title: "Challenge 3: Fill Shelves",
        tutCh3Desc: "Check the designated shelf category above, then drag the matching book from below onto it. Each correct book = 20 pts!"
    }
};

// ==========================================
// 2. تصنيفات ديوي العشرة الرسمية
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

// بنك التحدي الأول: مساعدة القراء (25 سيناريو)
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
    { ar: "سالم يريد كتاباً لشرح أمن المعلومات وحماية الحسابات من الاختراق", en: "Salem wants to learn cybersecurity and password defense", answer: "000" },
    { ar: "منصور يريد كتاباً عن تاريخ بناء قصر الحصن في أبوظبي", en: "Mansoor needs a book about the history of Qasr Al Hosn in Abu Dhabi", answer: "900" },
    { ar: "هند تبحث عن رواية خيالية عن رحلة إلى باطن الأرض", en: "Hind is reading a science fiction story about a journey to Earth's core", answer: "800" },
    { ar: "خديجة تسأل عن كتاب يعلمها قواعد التجارة والعملات المالية", en: "Khadija wants to understand business economics and currencies", answer: "300" },
    { ar: "عبدالله يريد معرفة سر الجاذبية الأرضية وقوانين نيوتن", en: "Abdullah wants to understand gravity and Newton's laws of physics", answer: "500" },
    { ar: "مها تسأل عن معجم لسان العرب في مفردات لغتنا الجميلة", en: "Maha wants an Arabic classical lexicon to understand rare words", answer: "400" }
];

// بنك التحدي الثاني: لعبة الصاروخ الفضائي (25 كتاباً)
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
    { ar: "كتاب: تاريخ القلاع والحصون القديمة في الجزيرة", en: "Book: Ancient Arabian Castles & Fortresses", answer: "900" },
    { ar: "كتاب: أسرار البرمجة بلغة بايثون للأشبال", en: "Book: Python Programming for Young Coders", answer: "000" },
    { ar: "كتاب: الإسعافات الأولية وطب الطوارئ", en: "Book: First Aid Guide & Emergency Medicine", answer: "600" },
    { ar: "كتاب: معجزات الشفاء في الطب النبوي", en: "Book: Prophetic Medicine & Islamic Healing", answer: "200" },
    { ar: "كتاب: تعلم الإسبانية بدون معلم", en: "Book: Self-Taught Spanish Language", answer: "400" },
    { ar: "كتاب: حقوق الإنسان في الدساتير الدولية", en: "Book: Human Rights in International Charters", answer: "300" },
    { ar: "رواية: جزيرة الكنز للكاتب روبرت لويس", en: "Novel: Treasure Island by R.L. Stevenson", answer: "800" },
    { ar: "كتاب: الفنون التشكيلية وتصميم الجرافيك", en: "Book: Fine Arts & Digital Graphic Design", answer: "700" },
    { ar: "كتاب: المحيطات العميقة وأسرار الشعاب المرجانية", en: "Book: Ocean Depths & Coral Reef Wonders", answer: "500" },
    { ar: "كتاب: تاريخ الحضارات القديمة في بلاد ما بين النهرين", en: "Book: Ancient Civilizations of Mesopotamia", answer: "900" },
    { ar: "كتاب: كيف تكتشف مواهبك وتنمي ذكاءك", en: "Book: Discovering Talent and Emotional Intelligence", answer: "100" },
    { ar: "كتاب: موسوعة الطاقات المتجددة والخلايا الشمسية", en: "Book: Renewable Energies & Solar Innovations", answer: "600" },
    { ar: "كتاب: جغرافية الوطن العربي والمناخ", en: "Book: Arab Geography & Desert Climate", answer: "900" },
    { ar: "رواية: رحلة روبنسون كروزو الشهيرة", en: "Novel: The Adventures of Robinson Crusoe", answer: "800" },
    { ar: "كتاب: فنون الخط الديواني والكوفي", en: "Book: Classical Calligraphy Styles", answer: "700" },
    { ar: "كتاب: معجم المترادفات والأضداد في المعاجم", en: "Book: Dictionary of Synonyms and Antonyms", answer: "400" }
];

// بنك التحدي الثالث: ترتيب الأرفف (20 رفاً وسيناريو غنياً بـ 4 خيارات)
const BANK_SHELVES = [
    { shelfCode: "500", arShelf: "500: علوم وفضاء", enShelf: "500: Science & Space", arCorrect: "أسرار الفضاء وقوانين الجاذبية", enCorrect: "Space Secrets & Gravity Laws", arWrongs: ["تاريخ الدولة العباسية", "تعلم الرسم الزيتي", "قواعد الإملاء في العربية"], enWrongs: ["Abbasid History", "Oil Painting", "Spelling Rules"] },
    { shelfCode: "700", arShelf: "700: فنون ورياضة", enShelf: "700: Arts & Sports", arCorrect: "قوانين بطولات السباحة والجمباز", enCorrect: "Swimming & Gymnastics Rules", arWrongs: ["تشريح خلايا الكبد", "برمجة المواقع بلغة HTML", "تحليل القصة القصيرة"], enWrongs: ["Liver Anatomy", "HTML Web Design", "Short Story Analysis"] },
    { shelfCode: "900", arShelf: "900: تاريخ وجغرافيا", enShelf: "900: History & Geography", arCorrect: "تاريخ قلاع وحصون دولة الإمارات", enCorrect: "History of UAE Forts & Castles", arWrongs: ["محادثات بالإسبانية", "أخلاق المؤمن الصادق", "حياة الطيور المائية"], enWrongs: ["Spanish Dialogues", "Believer's Morals", "Water Birds Biology"] },
    { shelfCode: "600", arShelf: "600: تكنولوجيا وطب", enShelf: "600: Tech & Medicine", arCorrect: "صناعة الروبوت والسيارات الذكية", enCorrect: "Robotics & Smart Autonomous Cars", arWrongs: ["ديوان شعر المتنبي", "أطلس قارة أوروبا", "حقوق المواطنة الصالحة"], enWrongs: ["Mutanabbi Poems", "Europe Map Atlas", "Civic Rights"] },
    { shelfCode: "800", arShelf: "800: قصص وحكايات", enShelf: "800: Literature & Stories", arCorrect: "حكايات كليلة ودمنة الشهيرة", enCorrect: "Kalila wa Dimna Fables", arWrongs: ["لغات البرمجة السحابية", "تفسير سورة الكهف", "قوانين الديناميكا الحرارية"], enWrongs: ["Cloud Coding", "Quran Exegesis", "Thermodynamics"] },
    { shelfCode: "200", arShelf: "200: دين وأخلاق", enShelf: "200: Religion & Ethics", arCorrect: "سير الصحابة والأخلاق النبوية", enCorrect: "Companions' Biographies & Morals", arWrongs: ["عواصم وبلدان العالم", "تصنيع الأدوية الفعالة", "أسرار خطط الشطرنج"], enWrongs: ["World Capitals", "Pharmaceuticals", "Chess Openings"] },
    { shelfCode: "000", arShelf: "000: حاسب ومعارف عامة", enShelf: "000: Computers & General", arCorrect: "موسوعة الذكاء الاصطناعي والحوسبة", enCorrect: "Artificial Intelligence Encyclopedia", arWrongs: ["تاريخ معارك الأندلس", "تمارين بناء العضلات", "نوادر جحا والطرائف"], enWrongs: ["Andalusian Battles", "Weightlifting", "Juha Anecdotes"] },
    { shelfCode: "100", arShelf: "100: تطوير الذات وفلسفة", enShelf: "100: Self Growth & Mind", arCorrect: "قوة الإرادة وطرق التفكير الإيجابي", enCorrect: "Willpower & Positive Thinking", arWrongs: ["أحكام الزكاة والصدقات", "خوارزميات بايثون", "تضاريس صحراء الربع الخالي"], enWrongs: ["Zakat Rulings", "Python Algorithms", "Empty Quarter Desert"] },
    { shelfCode: "300", arShelf: "300: مجتمع وقانون", enShelf: "300: Society & Law", arCorrect: "حقوق الطفل ودستور الدولة", enCorrect: "Children's Rights & State Laws", arWrongs: ["حركة النجوم والمذنبات", "فن النحت على الخشب", "معجم الجذور اللغوية"], enWrongs: ["Comets Orbit", "Wood Carving", "Language Roots Lexicon"] },
    { shelfCode: "400", arShelf: "400: لغات وقواميس", enShelf: "400: Languages & Lexicons", arCorrect: "المعجم الوسيط في مفردات اللغة", enCorrect: "Intermediate Arabic Lexicon", arWrongs: ["رياضة التايكوندو", "أسرار الثدييات البحرية", "تاريخ الثورات الصناعية"], enWrongs: ["Taekwondo Guide", "Marine Mammals", "Industrial Revolution"] },
    { shelfCode: "500", arShelf: "500: علوم وفضاء", enShelf: "500: Science & Space", arCorrect: "دليل الديناصورات والجيولوجيا", enCorrect: "Dinosaurs & Geology Guide", arWrongs: ["مبادئ الاستثمار المالي", "تعلم الإيطالية في شهر", "مسرحية هاملت"], enWrongs: ["Stock Market", "Learn Italian", "Hamlet Play"] },
    { shelfCode: "800", arShelf: "800: قصص وحكايات", enShelf: "800: Literature & Stories", arCorrect: "رواية تاجر البندقية لشكسبير", enCorrect: "The Merchant of Venice Play", arWrongs: ["هندسة الشبكات والراوتر", "الجدول الدوري والكيمياء", "تاريخ الإمبراطورية العثمانية"], enWrongs: ["Network Routing", "Periodic Table", "Ottoman Empire"] },
    { shelfCode: "600", arShelf: "600: تكنولوجيا وطب", enShelf: "600: Tech & Medicine", arCorrect: "دليل الإسعافات والتغذية الصحية", enCorrect: "Emergency Aid & Clinical Nutrition", arWrongs: ["قصائد أحمد شوقي", "خريطة القطب الجنوبي", "قوانين التجارة البحرية"], enWrongs: ["Shawqi Poetry", "Antarctic Atlas", "Maritime Law"] },
    { shelfCode: "900", arShelf: "900: تاريخ وجغرافيا", enShelf: "900: History & Geography", arCorrect: "أطلس خرائط العالم وتضاريسه", enCorrect: "World Comprehensive Physical Atlas", arWrongs: ["برمجة تطبيقات الأندرويد", "ألعاب القوى للأولمبياد", "رواية حول العالم في 80 يوماً"], enWrongs: ["Android Kotlin Dev", "Olympic Athletics", "Around the World Novel"] },
    { shelfCode: "700", arShelf: "700: فنون ورياضة", enShelf: "700: Arts & Sports", arCorrect: "تكتيكات كرة القدم وتاريخ المونديال", enCorrect: "World Cup History & Soccer Tactics", arWrongs: ["وظائف الرئة والتنفس", "علم دراسة النيازك", "تفسير سورة يوسف"], enWrongs: ["Lungs Function", "Meteorites Study", "Surah Yusuf Exegesis"] },
    { shelfCode: "200", arShelf: "200: دين وأخلاق", enShelf: "200: Religion & Ethics", arCorrect: "تفسير القرآن الكريم والآداب الإسلامية", enCorrect: "Quran Commentary & Islamic Manners", arWrongs: ["صيانة محركات السيارات", "تاريخ الثورة الفرنسية", "تصميم الدوائر الإلكترونية"], enWrongs: ["Car Engines Repair", "French Revolution", "Circuit Board Design"] },
    { shelfCode: "100", arShelf: "100: تطوير الذات وفلسفة", enShelf: "100: Self Growth & Mind", arCorrect: "كيف تتغلب على القلق وتصنع النجاح", enCorrect: "Conquering Fear & Creating Success", arWrongs: ["سلاسل جبال الهيمالايا", "حركات الكاراتيه الأساسية", "شعر الحماسة الجاهلي"], enWrongs: ["Himalayas Range", "Karate Kata", "Pre-Islamic Poetry"] },
    { shelfCode: "400", arShelf: "400: لغات وقواميس", enShelf: "400: Languages & Lexicons", arCorrect: "القاموس المعتمد للترجمة الإنجليزية", enCorrect: "Oxford English-Arabic Dictionary", arWrongs: ["تاريخ الحضارة البابلية", "أمراض القلب والوقاية منها", "مغامرات سندباد البحري"], enWrongs: ["Babylon History", "Heart Diseases", "Sinbad's Voyage"] },
    { shelfCode: "300", arShelf: "300: مجتمع وقانون", enShelf: "300: Society & Law", arCorrect: "مفاهيم الاقتصاد وإدارة الأموال للأجيال", enCorrect: "Kids Economics & Smart Money", arWrongs: ["فيزياء الموجات الكهرومغناطيسية", "العزف على آلة العود", "قواعد المبتدأ والخبر"], enWrongs: ["Electromagnetism", "Oud Music Lessons", "Arabic Syntax"] },
    { shelfCode: "000", arShelf: "000: حاسب ومعارف عامة", enShelf: "000: Computers & General", arCorrect: "دليل حماية البيانات والأمن السيبراني", enCorrect: "Cybersecurity & Data Privacy Guide", arWrongs: ["تاريخ الفتوحات الإسلامية", "رياضة اليوجا والاسترخاء", "طرائف أشعب والظرفاء"], enWrongs: ["Islamic Conquests", "Yoga & Relaxation", "Ash'ab Tales"] }
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

    // خيارات التحدي الأول (4 رفوف فقط تناسب الشاشات)
    const [ch1Options, setCh1Options] = useState<any[]>([]);

    // === متغيرات السحب والإفلات السريع بدون أي لاج ===
    const [isDraggingState, setIsDraggingState] = useState(false);
    const [dragItemInfo, setDragItemInfo] = useState<{ id: string, type: 'q' | 'opt', content?: string } | null>(null);
    const [hoveredDropZone, setHoveredDropZone] = useState<string | null>(null);

    const isDraggingRef = useRef(false);
    const dragDataRef = useRef<{ id: string, type: 'q' | 'opt', content?: string } | null>(null);
    const floatingElementRef = useRef<HTMLDivElement | null>(null);
    const dropZonesRef = useRef<Map<string, HTMLDivElement>>(new Map());

    // === متغيرات لعبة الصاروخ (التحدي 2) ===
    const [rocketPos, setRocketPos] = useState(1);
    const [ch2Options, setCh2Options] = useState<any[]>([]);
    const [isShooting, setIsShooting] = useState(false);

    // إخفاء شريط رأس الموقع أثناء التحديات لتكبير مساحة اللعب
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
            if (isDraggingRef.current) e.preventDefault();
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
                options: shuffleArray([correct, ...wrongs.slice(0, 3)]) // 4 خيارات متكاملة
            };
        });
        setCurrentQuestions(mixed);
        setQIndex(0); 
        setQuestionTimer(20); 
        setStage('challenge3');
    };

    const handleTimeout = () => {
        setFeedback('wrong');
        cleanupDrag();
        setTimeout(() => nextQuestion(), 1400);
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
        cleanupDrag();
        setTimeout(() => nextQuestion(), 1400);
    };

    const cleanupDrag = () => {
        isDraggingRef.current = false;
        dragDataRef.current = null;
        setIsDraggingState(false);
        setDragItemInfo(null);
        setHoveredDropZone(null);
        if (floatingElementRef.current) {
            floatingElementRef.current.style.display = 'none';
        }
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
    // نظام السحب والإفلات التفاعلي فائق الدقة بدون تأخير
    // =========================================================================
    
    const updateFloatingPos = (clientX: number, clientY: number) => {
        if (floatingElementRef.current) {
            floatingElementRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%) scale(1.05)`;
        }
    };

    const checkDropZones = (clientX: number, clientY: number) => {
        let foundZone: string | null = null;
        dropZonesRef.current.forEach((el, key) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
                foundZone = key;
            }
        });
        setHoveredDropZone(foundZone);
        return foundZone;
    };

    const handleDragStart = (e: React.TouchEvent | React.MouseEvent, id: string, type: 'q' | 'opt', content?: string) => {
        if (feedback) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        isDraggingRef.current = true;
        const itemObj = { id, type, content };
        dragDataRef.current = itemObj;
        
        setDragItemInfo(itemObj);
        setIsDraggingState(true);

        if (floatingElementRef.current) {
            floatingElementRef.current.style.display = 'flex';
            updateFloatingPos(clientX, clientY);
        }
    };

    const handleDragMove = useCallback((e: TouchEvent | MouseEvent) => {
        if (!isDraggingRef.current || !dragDataRef.current) return;
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
        
        updateFloatingPos(clientX, clientY);
        checkDropZones(clientX, clientY);
    }, []);

    const handleDragEnd = useCallback((e: TouchEvent | MouseEvent) => {
        if (!isDraggingRef.current || !dragDataRef.current) return;
        
        const clientX = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0].clientY : (e as MouseEvent).clientY;
        
        const droppedOn = checkDropZones(clientX, clientY);

        if (droppedOn) {
            if (stage === 'challenge3') {
                handleAnswer(dragDataRef.current.content || dragDataRef.current.id);
            } else {
                handleAnswer(droppedOn);
            }
        }
        
        cleanupDrag();
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

    return (
        <div className={`min-h-[100dvh] bg-slate-900 text-slate-100 font-sans flex flex-col items-center justify-center p-2 md:p-4 relative select-none ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'} ${stage.startsWith('challenge') ? 'overflow-hidden touch-none' : 'overflow-y-auto'}`}>
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                
                .dir-rtl { direction: rtl; }
                .dir-ltr { direction: ltr; }
                
                body.hide-site-header header,
                body.hide-site-header nav,
                body.hide-site-header .site-header,
                body.hide-site-header [role="banner"],
                body.hide-site-header nav-bar {
                    display: none !important;
                }

                @media print {
                    @page { 
                        size: A4 portrait; 
                        margin: 0; 
                    }
                    html, body {
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        overflow: hidden !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body * { 
                        visibility: hidden !important; 
                    }
                    #certificate-print-container, 
                    #certificate-print-container * {
                        visibility: visible !important;
                    }
                    #certificate-print-container {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 8mm !important;
                        box-sizing: border-box !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: center !important;
                        align-items: center !important;
                        background: #ffffff !important;
                    }
                    #certificate-area-print {
                        width: 194mm !important;
                        height: 275mm !important;
                        box-sizing: border-box !important;
                        border: 12px double #b45309 !important;
                        border-radius: 20px !important;
                        padding: 12mm !important;
                        background: #ffffff !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: space-between !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        page-break-after: avoid !important;
                    }
                }

                .magic-glow {
                    animation: pulse-glow 2s infinite alternate ease-in-out;
                }
                @keyframes pulse-glow {
                    0% { filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)); transform: scale(1) translateY(0px); }
                    100% { filter: drop-shadow(0 0 25px rgba(245, 158, 11, 0.9)); transform: scale(1.02) translateY(-2px); }
                }
                
                .float-anim { animation: floating 3s ease-in-out infinite; }
                @keyframes floating {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }

                .wood-shelf {
                    position: relative;
                    background: linear-gradient(180deg, #b45309 0%, #78350f 100%);
                    border-bottom: 6px solid #451a03;
                    border-radius: 10px;
                    box-shadow: inset 0 -2px 6px rgba(0,0,0,0.5), 0 6px 12px rgba(0,0,0,0.4);
                    transition: all 0.15s ease-out;
                }
                
                .realistic-book {
                    position: relative;
                    background: linear-gradient(135deg, #1e293b, #0f172a);
                    border-left: 8px solid #f59e0b;
                    border-radius: 4px 10px 10px 4px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }

                .laser-beam {
                    position: absolute;
                    bottom: 45px;
                    width: 4px;
                    height: 35px;
                    background: #22d3ee;
                    box-shadow: 0 0 12px #06b6d4, 0 0 25px #0891b2;
                    border-radius: 10px;
                    animation: shoot-up 0.28s linear forwards;
                    z-index: 20;
                }
                @keyframes shoot-up {
                    0% { bottom: 45px; opacity: 1; }
                    100% { bottom: 100%; opacity: 0; }
                }

                .cert-font { font-family: 'Cairo', sans-serif !important; }
                
                .compact-layout {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    max-height: 95vh;
                    justify-content: space-between;
                }
            `}</style>

            {/* --- العنصر الممسوك (متحرك ومطابق للمؤشر فوراً 100% بدون لاج) --- */}
            <div 
                ref={floatingElementRef}
                className="fixed pointer-events-none z-[9999] realistic-book p-3 font-black text-center items-center justify-center bg-slate-900 text-amber-300 shadow-2xl border-2 border-amber-400 hidden will-change-transform"
                style={{
                    left: 0,
                    top: 0,
                    width: dragItemInfo?.type === 'q' ? '210px' : '150px',
                    minHeight: '50px',
                    fontSize: dragItemInfo?.type === 'q' ? '0.85rem' : '0.8rem'
                }}
            >
                {dragItemInfo?.content || (currentQuestions[qIndex] ? (lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en) : '')}
            </div>

            {/* 1. شاشة البداية */}
            {stage === 'intro' && (
                <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl text-center animate-fade-in-up relative z-10">
                    <img src="/Game.png" alt="Game Logo" className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-3 object-contain magic-glow" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <h1 className="text-2xl md:text-3xl font-black text-amber-400 mb-1">{dict.title}</h1>
                    <p className="text-xs md:text-sm text-slate-300 mb-5 font-bold">{dict.subtitle}</p>
                    
                    <div className={`space-y-3 mb-5 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div>
                            <label className="text-[10px] md:text-xs font-bold text-amber-400 mb-1 block px-1">{dict.studentName}</label>
                            <input type="text" placeholder={dict.namePlaceholder} className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-400 font-bold text-sm shadow-inner" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] md:text-xs font-bold text-amber-400 mb-1 block px-1">{dict.grade}</label>
                            <input type="text" placeholder={dict.gradePlaceholder} className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-400 font-bold text-sm shadow-inner" value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={handleStart} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-base md:text-xl rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95 float-anim tracking-wide">
                        {dict.start}
                    </button>
                </div>
            )}

            {/* 2. شاشة التعلم */}
            {stage === 'learn' && (
                <div className="max-w-3xl w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-4 md:p-8 shadow-2xl animate-zoom-in relative z-10 text-center flex flex-col max-h-[90dvh] my-auto">
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
                                <div key={cat.code} className="p-2.5 rounded-xl text-[10px] md:text-xs font-black shadow-md text-white flex items-center justify-center text-center border border-white/10" style={{ backgroundColor: cat.color }}>
                                    {lang === 'ar' ? cat.ar : cat.en}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-2 pb-1 shrink-0 w-full bg-slate-800 border-t border-slate-700">
                        <button onClick={() => setStage('tut1')} className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 text-base md:text-xl border-b-4 border-emerald-800 active:border-b-0">
                            {dict.readyBtn}
                        </button>
                    </div>
                </div>
            )}

            {/* شاشات التعليمات التمهيدية قبل التحديات */}
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

            {/* 3. شاشات التحديات المدمجة للهواتف والشاشات الكبيرة */}
            {stage.startsWith('challenge') && currentQuestions.length > 0 && (
                <div className="max-w-5xl w-full h-[94vh] md:h-auto md:min-h-0 bg-slate-900 border-2 border-slate-700 rounded-3xl p-3 md:p-6 shadow-2xl animate-fade-in-up relative z-10 compact-layout">
                    
                    {/* شريط الإحصائيات والألعاب (Game HUD) */}
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

                    <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
                        
                        {/* شاشة التغذية الراجعة الفورية */}
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

                        {/* ================================================= */}
                        {/* التحدي الأول والثالث (سحب وإفلات تفاعلي 100%) */}
                        {/* ================================================= */}
                        {stage !== 'challenge2' && (
                            <>
                                <div className="flex flex-col items-center justify-center shrink-0 min-h-[85px] md:min-h-[140px] relative z-20 mb-2">
                                    {stage === 'challenge3' ? (
                                        <div 
                                            ref={(el) => { if(el) dropZonesRef.current.set(currentQuestions[qIndex].shelfCode, el); }}
                                            className={`w-full md:w-2/3 h-16 md:h-20 relative wood-shelf flex items-center justify-center shadow-2xl my-2 cursor-pointer transition-all duration-150 ${hoveredDropZone === currentQuestions[qIndex].shelfCode ? 'ring-4 ring-amber-400 brightness-125 scale-105' : ''}`}
                                        >
                                            {/* إبراز مسمى الرف المطلوب كشريط نيون واضح وجذاب */}
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
                                                style={{ touchAction: 'none' }}
                                                onMouseDown={(e) => handleDragStart(e, 'q', 'q')}
                                                onTouchStart={(e) => handleDragStart(e, 'q', 'q')}
                                                className={`realistic-book p-3.5 md:p-6 max-w-[280px] md:max-w-xl mx-auto cursor-grab active:cursor-grabbing flex items-center justify-center text-center float-anim border border-slate-700`}
                                                style={{ opacity: isDraggingState && dragDataRef.current?.type === 'q' ? 0.25 : 1 }}
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
                                        /* 4 خيارات للتحدي الثالث في شبكة 2x2 */
                                        <div className="grid grid-cols-2 gap-2 md:gap-4 w-full">
                                            {currentQuestions[qIndex].options.map((opt: string, idx: number) => (
                                                <div 
                                                    key={idx}
                                                    style={{ touchAction: 'none' }}
                                                    onMouseDown={(e) => handleDragStart(e, opt, 'opt', opt)}
                                                    onTouchStart={(e) => handleDragStart(e, opt, 'opt', opt)}
                                                    className={`realistic-book p-2.5 md:p-4 font-black text-[10px] md:text-sm text-center flex items-center justify-center min-h-[50px] md:min-h-[75px] cursor-grab active:cursor-grabbing text-slate-200 border border-slate-700/80 hover:border-amber-400/80`}
                                                    style={{ opacity: isDraggingState && dragDataRef.current?.id === opt ? 0.25 : 1 }}
                                                >
                                                    <span className="pointer-events-none leading-snug px-1">{opt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* التحدي الأول: 4 رفوف أركيد ممتازة للموبايل والكمبيوتر */
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full">
                                            {ch1Options.map(cat => (
                                                <div 
                                                    key={cat.code} 
                                                    ref={(el) => { if(el) dropZonesRef.current.set(cat.code, el); }}
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

                        {/* ================================================= */}
                        {/* التحدي الثاني: لعبة الصاروخ الفضائي */}
                        {/* ================================================= */}
                        {stage === 'challenge2' && (
                            <div className="flex-1 flex flex-col bg-slate-950 rounded-2xl overflow-hidden relative border-2 border-slate-800 shadow-inner p-2 md:p-4">
                                <div className="text-center mb-1 md:mb-3 z-20 shrink-0">
                                    <p className="text-[9px] md:text-xs font-black text-cyan-400 mb-0.5">{dict.shootInstruction}</p>
                                    <div className="bg-slate-900/90 border border-slate-700 text-amber-300 p-2 md:p-3 rounded-xl inline-block max-w-[280px] md:max-w-xl text-[11px] md:text-lg font-black shadow-lg leading-tight">
                                        {lang === 'ar' ? currentQuestions[qIndex].ar : currentQuestions[qIndex].en}
                                    </div>
                                </div>

                                <div className="flex justify-between w-full px-1 md:px-10 relative z-20 shrink-0 mt-2">
                                    {ch2Options.map((opt, idx) => (
                                        <div key={idx} className="flex flex-col items-center w-1/4 px-0.5">
                                            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center font-black text-[8px] md:text-xs text-white shadow-[0_0_12px_rgba(255,255,255,0.2)] float-anim text-center leading-tight p-0.5 border border-white/20" style={{ backgroundColor: opt.color, animationDelay: `${idx * 0.2}s` }}>
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

                                {/* أزرار التحكم اللمسية للموبايل */}
                                <div className="md:hidden flex justify-between items-center mt-1 gap-1.5 z-30 shrink-0">
                                    <button onTouchStart={(e) => {e.preventDefault(); setRocketPos(p => (lang === 'ar' ? Math.min(3, p + 1) : Math.max(0, p - 1)))}} className="flex-1 bg-slate-800 text-cyan-400 p-2.5 rounded-xl active:bg-slate-700 text-lg font-black shadow border border-slate-700">
                                        {lang === 'ar' ? '►' : '◄'}
                                    </button>
                                    <button onTouchStart={(e) => {e.preventDefault(); handleShoot();}} className="flex-[2] bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 p-2.5 rounded-xl active:scale-95 font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                        {dict.fireBtn}
                                    </button>
                                    <button onTouchStart={(e) => {e.preventDefault(); setRocketPos(p => (lang === 'ar' ? Math.max(0, p - 1) : Math.min(3, p + 1)))}} className="flex-1 bg-slate-800 text-cyan-400 p-2.5 rounded-xl active:bg-slate-700 text-lg font-black shadow border border-slate-700">
                                        {lang === 'ar' ? '◄' : '►'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 4. شاشة الشهادة (طباعة A4 كاملة وعرض واضح مريح للشاشات والموبايل) */}
            {stage === 'certificate' && (
                <div className="w-full flex flex-col items-center animate-fade-in-up relative z-10 pt-2 pb-16 print:pt-0 print:pb-0 overflow-y-auto max-h-[100dvh]">
                    
                    {/* حاوية مخصصة لطباعة A4 صفحة واحدة بدون قطع */}
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

                    {/* عرض الشهادة المريح على شاشة الجهاز */}
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

                        <div className="flex justify-center gap-6 md:gap-12 text-center bg-amber-50/70 p-2.5 md:p-4 rounded-xl border border-amber-200 my-3">
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

                    {/* الأزرار تحت الشهادة */}
                    <div className="mt-3 flex gap-3 no-print relative z-10 w-[95%] max-w-xl pb-6">
                        <button onClick={() => window.print()} className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm md:text-base rounded-xl shadow-lg active:scale-95 text-center">
                            {dict.print}
                        </button>
                        <Link to="/" className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm md:text-base rounded-xl shadow-md active:scale-95 text-center flex items-center justify-center border border-slate-700">
                            {dict.back}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeweyGame;
