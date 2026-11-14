import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { supabase } from '../src/utils/supabase';
import SaqrOrbitNavigation from '../src/components/SaqrOrbitNavigation';
import '../src/components/EFIPSGlassVisualTheme.css';
import { getTeacherLibrarySlots, type TeacherLibrarySlot } from '../src/utils/teacherLibrarySchedule';
import HomeReadingHub from '../src/components/HomeReadingHub';
import { getSaqrNewsTicker } from '../src/data/saqrWhatsNew';

const translations = {
    ar: {
        welcome: "بوابة المعرفة في مدرسة صقر الإمارات",
        subWelcome: "بوابتك الذكية للوصول إلى المعلومات والإبداع.",
        welcomeUser: "أهلاً بك",
        logout: "تسجيل الخروج",
        adminBadge: "مدير النظام",
        teacherBadge: "حساب معلم",
        studentBadge: "حساب طالب",
        adminSettings: "إدارة النظام",
        adminSettingsDesc: "التحكم الشامل في المنصة والبيانات",
        newsTitle: "جديدنا",
        newsContent: getSaqrNewsTicker('ar'),
        manualSearch: "دليل كتب المكتبة",
        manualDesc: "استكشف وتعرف واستعر الكتب المتوفرة في مكتبة المدرسة",
        smartSearch: "اسأل صقر الذكي",
        smartDesc: "مساعدك الذكي للبحث والاستفسار.",
        digitalLibrary: "المكتبة الإلكترونية",
        digitalDesc: "عالم من الكتب والروايات الرقمية.",
        creators: "بوابة المبدعين",
        creatorsDesc: "استكشف قصص وابتكارات زملائك المبدعين.",
        scheduleTitle: "جدول المكتبة",
        scheduleDesc: "حجز وتنسيق حصص زيارة المكتبة للمعلمين.",
        saqrChallengesTitle: "تحديات صقر",
        saqrChallengesDesc: "بين السطور، رتب المكتبة واستديو صقر.",
        readingQuestTitle: "بين السطور مع صقر",
        readingQuestDesc: "اختر عدد الكتب واختبر فهمك.",
        gameTitle: "رتب المكتبة",
        gameDesc: "العب، استمتع، وتعلم كيفية تصنيف الكتب.",
        nationalIdentityTitle: "صقر وهوية وطن",
        nationalIdentityDesc: "مغامرات تراثية وثقافية عبر الإمارات السبع وكلماتنا وذاكرة الوطن.",
        saqrStudioBanner: "استديو صقر",
        saqrStudioDesc: "سجل إبداعاتك الصوتية وشارك في البودكاست.",
        bubble: "فخورين بالإمارات",
        homelandTitle: "معلومات عن وطني",
        visitorsLabel: "زوار البوابة:",
        upcomingEvents: "إجازة عيد الإتحاد 55",
        startsIn: "تبدأ إجازة عيد الإتحاد خلال:",
        dayUnit: "يوم",
        daysUnit: "أيام",
        newBadge: "جديد",
        adminSettingsTitle: "إدارة النظام",
        borrowTitle: "مكتبتي المستعارة",
        myLibraryHub: "مكتبتي الشخصية",
        myLibraryHubDesc: "قائمة القراءة وجواز القارئ والكتب المقترحة.",
        borrowReturn: "تاريخ الإرجاع:",
        notificationsTitle: "تنبيهاتك",
        notificationsSubtitle: "تذكيرات الكتب المستعارة ومواعيد إرجاعها",
        teacherScheduleTitle: "جدول استخدام المكتبة الخاص بك",
        teacherScheduleSubtitle: "حصصك المحجوزة لهذا الأسبوع",
        periodLabel: "الحصة",
        gradeLabel: "الصف",
        subjectLabel: "المادة",
        addToCalendar: "تذكير التقويم",
        festiveBtn: "احتفالي",
        festiveDesc: "العد التنازلي ليوم 3 نوفمبر",
        flagDayModalTitle: "احتفالي يوم العلم الإماراتي",
        flagDayModalSub: "العد التنازلي لانطلاق فعاليات ومسابقة تحدي راية المجد والصعود إلى قمة برج خليفة.",
        flagDayModalCountdown: "متبقي على انطلاق الاحتفال:",
        flagDayModalBtn: "حفظ والعودة للمنصة",
        dayLabel: "يوم",
        hourLabel: "ساعة",
        minLabel: "دقيقة",
        secLabel: "ثانية",
        flagDayAlert: "استعدوا لرفع العلم وجمع النقاط وحصد الأوسمة الوطنية!"
    },
    en: {
        welcome: "Knowledge Portal at Falcon Int'l School",
        subWelcome: "Your smart gateway to access knowledge and creativity.",
        welcomeUser: "Welcome,",
        logout: "Logout",
        adminBadge: "Admin",
        teacherBadge: "Teacher",
        studentBadge: "Student",
        adminSettings: "System Admin",
        adminSettingsDesc: "Full platform and data control",
        newsTitle: "What's New",
        newsContent: getSaqrNewsTicker('en'),
        manualSearch: "Library Book Catalog",
        manualDesc: "Explore,Find and Borrow the school library’s",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Your smart AI research assistant.",
        digitalLibrary: "Digital Library",
        digitalDesc: "A world of digital books and novels.",
        creators: "Creators Portal",
        creatorsDesc: "Explore the stories and innovations of your peers.",
        scheduleTitle: "Library Schedule",
        scheduleDesc: "Book and coordinate library visits for teachers.",
        saqrChallengesTitle: "Saqr Challenges",
        saqrChallengesDesc: "Reading quests, library sorting and Saqr Studio.",
        readingQuestTitle: "Between the Lines with Saqr",
        readingQuestDesc: "Choose books and test your understanding.",
        gameTitle: "Library Game",
        gameDesc: "Play, enjoy, and learn book classification.",
        nationalIdentityTitle: "Saqr & National Identity",
        nationalIdentityDesc: "Explore the seven emirates, heritage words and our nation's memory.",
        saqrStudioBanner: "Saqr Studio",
        saqrStudioDesc: "Record your voice and share in the podcast.",
        bubble: "Proud of the UAE",
        homelandTitle: "Information About My Country",
        visitorsLabel: "Portal Visitors:",
        upcomingEvents: "55th UAE National Day Break",
        startsIn: "UAE National Day break starts in:",
        dayUnit: "Day",
        daysUnit: "Days",
        newBadge: "NEW",
        adminSettingsTitle: "System Admin",
        borrowTitle: "My Borrowed Books",
        myLibraryHub: "My Personal Library",
        myLibraryHubDesc: "Reading list, reading passport and book suggestions.",
        borrowReturn: "Return Date:",
        notificationsTitle: "Your Notifications",
        notificationsSubtitle: "Book borrowing and return reminders",
        teacherScheduleTitle: "Your Library Schedule",
        teacherScheduleSubtitle: "Your booked library periods this week",
        periodLabel: "Period",
        gradeLabel: "Grade",
        subjectLabel: "Subject",
        addToCalendar: "Add to Calendar",
        festiveBtn: "Festive",
        festiveDesc: "Countdown to November 3",
        flagDayModalTitle: "UAE Flag Day Celebration",
        flagDayModalSub: "Countdown to the launch of Flag Day events and the Burj Khalifa peak climbing challenge.",
        flagDayModalCountdown: "Time remaining until celebration starts:",
        flagDayModalBtn: "Save and Return",
        dayLabel: "Day",
        hourLabel: "Hours",
        minLabel: "Mins",
        secLabel: "Secs",
        flagDayAlert: "Get ready to raise the flag and earn national badges!"
    }
};

const HOMELAND_FACTS = [
    { ar: "تأسست دولة الإمارات العربية المتحدة في الثاني من ديسمبر عام 1971م على يد الشيخ زايد بن سلطان آل نهيان، طيب الله ثراه.", en: "The UAE was founded on Dec 2, 1971, by Sheikh Zayed bin Sultan Al Nahyan." },
    { ar: "هل تعلم أن برج خليفة في دبي هو أطول بناء شيده الإنسان في العالم بارفاع 828 متراً؟", en: "Did you know Burj Khalifa is the tallest man-made structure in the world at 828m?" },
    { ar: "مسبار الأمل الإماراتي هو أول مهمة عربية تصل إلى مدار كوكب المريخ لاستكشاف غلافه الجوي.", en: "The Hope Probe is the first Arab mission to reach Mars to explore its atmosphere." },
    { ar: "تعتبر 'نخلة جميرا' أكبر جزيرة اصطناعية في العالم، ويمكن رؤيتها بوضوح من الفضاء الخارجي.", en: "Palm Jumeirah is the world's largest man-made island, visible from space." },
    { ar: "في الوثبة بأبوظبي أكثر من 1700 كثيب رملي أحفوري، تحوّل بعضها إلى أشكال صخرية مذهلة.", en: "Al Wathba in Abu Dhabi has over 1,700 fossil dunes with extraordinary natural shapes." },
    { ar: "اكتُشفت على جزيرة مروح بأبوظبي لؤلؤة طبيعية عمرها نحو 8000 سنة، من أقدم اللآلئ المعروفة في العالم.", en: "A natural pearl found on Abu Dhabi's Marawah Island is about 8,000 years old, among the oldest known pearls." },
    { ar: "منذ نحو 3000 سنة استخدم سكان الإمارات الأفلاج لنقل المياه بالجاذبية عبر قنوات تحت الأرض، دون مضخات كهربائية.", en: "Around 3,000 years ago, people in the UAE used underground aflaj channels to carry water by gravity." },
    { ar: "تحتضن واحة العين نحو 147 ألف نخلة، فتصنع ظلالًا خضراء واسعة في قلب البيئة الصحراوية.", en: "Al Ain Oasis has about 147,000 date palms, creating broad green shade in the desert." },
    { ar: "عند سفوح جبل حفيت في العين نحو 500 مدفن حجري يعود إلى قرابة 5000 سنة، ويشبه بعضها خلايا النحل.", en: "Near Jebel Hafit in Al Ain lie around 500 stone tombs about 5,000 years old, some shaped like beehives." },
    { ar: "تل مرعب في ليوا كثيب رملي يزيد ارتفاعه على 300 متر، ويبلغ ميل منحدره الشديد نحو 50 درجة!", en: "Liwa's Moreeb Dune rises over 300 metres, with an astonishing slope of about 50 degrees!" },
    { ar: "في جزيرة صير بني ياس بأبوظبي تعيش الزرافات والفهود والمها العربي في محمية للحياة البرية.", en: "On Abu Dhabi's Sir Bani Yas Island, giraffes, cheetahs and Arabian oryx roam a wildlife sanctuary." },
    { ar: "وسط دبي توجد محمية رأس الخور، حيث يمكن مشاهدة الفلامنجو الوردي بالقرب من المباني والطرق الحديثة.", en: "In bustling Dubai, Ras Al Khor sanctuary is home to pink flamingos near the modern city." },
    { ar: "الخط العربي على واجهة متحف المستقبل بدبي ليس للزينة فقط؛ إنه جزء من نوافذ المبنى الزجاجية!", en: "The Arabic calligraphy on Dubai's Museum of the Future also forms the building's glass windows!" },
    { ar: "قبل إنشاء أول جسر على خور دبي عام 1963، كان الناس يعبرون الخور بالقوارب الخشبية ومنها العَبْرات.", en: "Before Dubai Creek's first bridge in 1963, people crossed the water on boats including wooden abras." },
    { ar: "تأسست مدرسة الأحمدية في ديرة بدبي عام 1912، وتحول مبناها التاريخي لاحقًا إلى متحف.", en: "Al Ahmadiya School opened in Deira in 1912; its historic building later became a museum." },
    { ar: "قبل انتشار أجهزة التكييف استخدم أهل دبي أبراج الرياح «البراجيل» لتوجيه النسيم وتبريد منازلهم.", en: "Before air conditioning, Dubai homes used traditional wind towers, or barajeel, to catch cooling breezes." },
    { ar: "في «الغرفة الماطرة» بالشارقة تسقط الأمطار من السقف، وتوقف حساسات الحركة الماء فوقك حتى تمشي دون بلل!", en: "In Sharjah's Rain Room, motion sensors stop rain overhead so visitors can walk without getting soaked!" },
    { ar: "في خور كلباء بالشارقة تقع أقدم غابة قرم في الإمارات، وتصل بعض أشجارها إلى ثمانية أمتار.", en: "Sharjah's Khor Kalba has the UAE's oldest mangrove forest, with trees up to eight metres tall." },
    { ar: "في صحراء مليحة بالشارقة صخور مليئة بأحافير بحرية؛ فقد كانت أجزاء من المنطقة تحت الماء منذ ملايين السنين!", en: "Fossil Rock in Sharjah's Mleiha desert contains ancient sea fossils from a time when the area was underwater!" },
    { ar: "تُظهر آثار منطقة الفاية بالشارقة فصولًا من تاريخ وجود الإنسان في المنطقة تمتد لأكثر من 210 آلاف سنة.", en: "Sharjah's Faya landscape preserves evidence of human history spanning more than 210,000 years." },
    { ar: "على جبل جيس برأس الخيمة مسار انزلاق بالحبال طوله 2.83 كيلومتر، يعبر فوق الوديان الجبلية.", en: "Jebel Jais in Ras Al Khaimah has a 2.83-kilometre zipline stretching across mountain valleys." },
    { ar: "رغم جفاف جبال الفجيرة، يضم وادي الوريعة ينابيع وشلالات مياه عذبة تدعم حياة كائنات نادرة.", en: "Despite Fujairah's dry mountains, Wadi Wurayah has freshwater springs and waterfalls supporting rare wildlife." },
    { ar: "مسجد البدية في الفجيرة أقدم مسجد باقٍ في الإمارات، ويتميز بأربع قباب يحملها عمود مركزي واحد.", en: "Fujairah's Al Bidya Mosque is the UAE's oldest surviving mosque, with four domes supported by one central pillar." },
    { ar: "في جزيرة السينية بأم القيوين عثر علماء الآثار على دير قديم يعود إلى الفترة بين القرن السادس والثامن الميلادي.", en: "Archaeologists on Umm Al Quwain's Siniya Island found an ancient monastery dating from the 6th to 8th centuries CE." },
    { ar: "تضم عجمان منطقة جبلية اسمها «مصفوت» تقع ضمن جبال الحجر، وجوها أبرد من المناطق الساحلية.", en: "Ajman includes a mountain enclave called Masfout in the Hajar Mountains, with cooler weather than the coast." },
    { ar: "محمية الزوراء في عجمان بيئة لأشجار القرم والطيور المهاجرة، وسُجّل فيها أكثر من 200 نوع من الطيور.", en: "Ajman's Al Zorah reserve shelters mangroves and migratory birds, with over 200 bird species recorded." },
    { ar: "أصبحت الإمارات عام 2017 أول دولة في العالم تُعيّن وزير دولة للذكاء الاصطناعي.", en: "In 2017, the UAE became the first country to appoint a Minister of State for Artificial Intelligence." },
    { ar: "في عام 2023 أصبح سلطان النيادي أول رائد فضاء عربي يسير في الفضاء، واستمرت جولته سبع ساعات ودقيقة!", en: "In 2023, Sultan Al Neyadi became the first Arab to make a spacewalk, lasting seven hours and one minute!" },
    { ar: "في موقع هيلي الأثري بالعين بقايا أحد أقدم أنظمة الأفلاج للري، يعود إلى العصر الحديدي.", en: "Al Ain's Hili archaeological site contains remains of an early falaj irrigation system from the Iron Age." },
    { ar: "في منطقة مصفوت التابعة لعجمان بوابة حجرية تاريخية شُيدت عام 1961 لاستقبال القادمين إلى المنطقة.", en: "Ajman's Masfout has a historic stone gateway built in 1961 to welcome visitors." },
    { ar: "متحف اللوفر أبوظبي هو أول متحف عالمي في العالم العربي يعكس روح الانفتاح الثقافي.", en: "Louvre Abu Dhabi is the first universal museum in the Arab world reflecting cultural openness." }
];

interface BurstItem { id: number; tx: number; ty: number; rot: number; color: string; }
interface SparkleItem { id: number; x: number; y: number; }
interface FlagFlyItem { id: number; x: number; y: number; rot: number; }

const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const UaeFlagIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg viewBox="0 0 640 480" className={`${className} rounded shadow-sm overflow-hidden`} preserveAspectRatio="none">
        <path fill="#00732f" d="M0 0h640v160H0z"/>
        <path fill="#fff" d="M0 160h640v160H0z"/>
        <path fill="#000" d="M0 320h640v160H0z"/>
        <path fill="#ff0000" d="M0 0h220v480H0z"/>
    </svg>
);

const SearchIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SmartIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const BookIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const CreatorIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const StudioIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const ScheduleIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GameIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AdminIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const RevealSection: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = sectionRef.current;
        if (!element || typeof IntersectionObserver === 'undefined') return;
        // Reveal just once, ahead of the viewport. Repeated hide/show while
        // scrolling caused re-paints and apparent delayed content on Safari.
        let entered = false;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                entered = true;
                setIsVisible(true);
                observer.disconnect();
            } else if (!entered) {
                setIsVisible(false);
            }
        }, { threshold: 0, rootMargin: '160px 0px 160px 0px' });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={sectionRef}
            className={`transition-[opacity,transform] duration-300 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: `${Math.min(delay, 80)}ms` }}
        >
            {children}
        </div>
    );
};

// Keep the seconds-level timer inside the few visible borrowing cards.
// The previous timer lived in HomePage and reconciled the entire dashboard
// every second, including off-screen tiles, even with zero active borrowings.
const BorrowingReturnStatus: React.FC<{ returnDate: string; isAr: boolean; returnLabel: string }> = ({ returnDate, isAr, returnLabel }) => {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const tick = () => { if (!document.hidden) setNow(Date.now()); };
        const interval = window.setInterval(tick, 1000);
        document.addEventListener('visibilitychange', tick);
        return () => {
            window.clearInterval(interval);
            document.removeEventListener('visibilitychange', tick);
        };
    }, []);

    const due = returnDate ? new Date(`${returnDate}T23:59:59`).getTime() : NaN;
    const valid = Number.isFinite(due);
    const remaining = due - now;
    const overdue = valid && remaining <= 0;
    const days = valid ? Math.floor(Math.max(remaining, 0) / 86400000) : 0;
    const hours = valid ? Math.floor((Math.max(remaining, 0) % 86400000) / 3600000) : 0;
    const minutes = valid ? Math.floor((Math.max(remaining, 0) % 3600000) / 60000) : 0;
    const seconds = valid ? Math.floor((Math.max(remaining, 0) % 60000) / 1000) : 0;
    const daysToReturn = valid ? Math.ceil(remaining / 86400000) : null;
    const dueSoon = daysToReturn !== null && daysToReturn > 0 && daysToReturn <= 3;

    const countdown = !returnDate
        ? (isAr ? 'لم يحدد تاريخ الإرجاع' : 'Return date not set')
        : !valid
            ? (isAr ? 'تاريخ الإرجاع غير صالح' : 'Invalid return date')
            : overdue
                ? (isAr ? 'انتهت مدة الاستعارة، يرجى إرجاع الكتاب' : 'Overdue: please return this book')
                : isAr
                    ? `متبقي ${days} يوم و${hours} ساعة و${minutes} دقيقة و${seconds} ثانية`
                    : `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;

    return <>
        <div className="rounded-xl bg-amber-50 dark:bg-slate-900/70 border border-amber-100 dark:border-slate-700 px-3.5 py-3">
            <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mb-1">{returnLabel}</p>
            <p className="font-black text-rose-600 dark:text-rose-400 text-sm sm:text-base">
                {returnDate && valid
                    ? new Date(`${returnDate}T12:00:00`).toLocaleDateString(isAr ? 'ar-AE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : (isAr ? 'لم يحدد تاريخ الإرجاع' : 'Return date not set')}
            </p>
            <p className={`mt-1.5 text-sm sm:text-base font-extrabold leading-relaxed flex items-center gap-1.5 ${overdue ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" /></svg>
                {countdown}
            </p>
        </div>
        {(dueSoon || overdue) && (
            <p role="status" className={`text-xs sm:text-sm rounded-xl border px-3 py-2 font-black ${overdue ? 'border-rose-300 bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200' : 'border-amber-300 bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200'}`}>
                {overdue ? (isAr ? 'تنبيه: تجاوز الكتاب موعد الإرجاع.' : 'Reminder: this book is overdue.') : (isAr ? `تذكير تلقائي: موعد إرجاع الكتاب خلال ${daysToReturn} يوم.` : `Automatic reminder: return due in ${daysToReturn} day(s).`)}
            </p>
        )}
    </>;
};

const HomePage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale as 'ar' | 'en'][key];
    
    const [userData, setUserData] = useState(() => {
        try {
            const stored = localStorage.getItem('current_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [userType, setUserType] = useState(() => {
        return localStorage.getItem('user_type') || null;
    });

    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [showBubble, setShowBubble] = useState(false);
    const [newsPaused, setNewsPaused] = useState(false);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [sparkles, setSparkles] = useState<SparkleItem[]>([]);
    const [flyingFlags, setFlyingFlags] = useState<FlagFlyItem[]>([]);
    
    const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
    const [teacherSchedule, setTeacherSchedule] = useState<TeacherLibrarySlot[]>([]);
    useEffect(() => {
        if (!userData || !userType) {
            window.location.href = '#/';
        }
    }, [userData, userType]);

    useEffect(() => {
        let mounted = true;

        // Normalize IDs and statuses because legacy borrowing records may contain
        // numeric/string IDs or differently-cased status values.
        const normalizeValue = (value: unknown) =>
            String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase();

        const isActiveBorrowing = (row: any) => {
            const status = normalizeValue(row?.status).replace(/[\s-]+/g, '_');
            return [
                'active', 'approved', 'confirmed', 'borrowed', 'issued',
                'checked_out', 'checkedout', 'on_loan',
                'قيد_الاستعارة', 'مستعار', 'مستعارة', 'معار', 'نشط', 'نشطة'
            ].includes(status);
        };

        const fetchBorrowings = async () => {
            const role = normalizeValue(userType);
            if (!userData || !role || role === 'admin') {
                if (mounted) setBorrowedBooks([]);
                return;
            }

            const ids = role === 'student'
                ? [userData.student_id, userData.id, userData.user_id]
                : [userData.teacher_id, userData.id, userData.user_id, userData.employee_id, userData.staff_id];
            const names = [userData.name_ar, userData.name_en, userData.email, userData.username];
            // Keep original casing for the database lookup (IDs such as HR001 can be case-sensitive),
            // and use normalized copies only when comparing returned values locally.
            const toLookupValues = (values: unknown[]) => [...new Set(values
                .map((value) => String(value ?? '').normalize('NFKC').trim())
                .filter(Boolean))];
            const idLookupValues = toLookupValues(ids);
            const nameLookupValues = toLookupValues(names);
            const identities = new Set([...idLookupValues, ...nameLookupValues].map(normalizeValue));
            const found = new Map<string, any>();

            // Prefer exact ID matching first; try legacy name-based user_id values only if needed.
            const lookupByUserId = async (values: string[]) => {
                for (const identity of values) {
                    try {
                        const { data, error } = await supabase
                            .from('borrowings')
                            .select('*')
                            .eq('user_id', identity);

                        if (error) {
                            console.error('Error fetching borrowings by user_id:', error);
                            continue;
                        }

                        (data || []).forEach((row: any, index: number) => {
                            if (!isActiveBorrowing(row)) return;
                            const key = String(row.id ?? `${row.user_id}-${row.book_name}-${row.return_date}-${index}`);
                            found.set(key, row);
                        });
                    } catch (error) {
                        console.error('Unexpected error fetching borrowings:', error);
                    }
                }
            };

            await lookupByUserId(idLookupValues);
            if (found.size === 0) await lookupByUserId(nameLookupValues);

            // Some older records store the borrower in a named owner field instead of user_id.
            // Run this compatibility fallback only when the indexed owner lookups returned nothing.
            if (found.size === 0) {
                try {
                    const { data, error } = await supabase.from('borrowings').select('*');
                    if (error) {
                        console.error('Error in borrowing compatibility lookup:', error);
                    } else {
                        const ownerFields = /^(user_id|teacher_id|student_id|borrower_id|member_id|employee_id|staff_id|user_name|teacher_name|student_name|borrower_name|borrower|email|username|name)$/i;
                        (data || []).forEach((row: any, index: number) => {
                            if (!isActiveBorrowing(row)) return;
                            const belongsToUser = Object.entries(row).some(([field, value]) =>
                                ownerFields.test(field) && identities.has(normalizeValue(value))
                            );
                            if (!belongsToUser) return;
                            const key = String(row.id ?? `${row.user_id}-${row.book_name}-${row.return_date}-${index}`);
                            found.set(key, row);
                        });
                    }
                } catch (error) {
                    console.error('Unexpected compatibility lookup error:', error);
                }
            }

            if (mounted) setBorrowedBooks(Array.from(found.values()));
        };

        void fetchBorrowings();
        // Keep the 60-second safety refresh and also react immediately to loan approvals/returns.
        const refresh = window.setInterval(() => { void fetchBorrowings(); }, 60000);
        const channel = supabase.channel('homepage-borrowings-notifications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'borrowings' }, () => {
                void fetchBorrowings();
            })
            .subscribe();
        return () => {
            mounted = false;
            window.clearInterval(refresh);
            void supabase.removeChannel(channel);
        };
    }, [userData, userType]);

    // Keep the teacher's own saved bookings in sync with the actual timetable.
    // A missing or cleared schedule produces no homepage section at all.
    useEffect(() => {
        let mounted = true;
        let latestRequest = 0;
        const teacherId = String(userData?.teacher_id ?? '').trim();

        if (userType !== 'teacher' || !teacherId) {
            setTeacherSchedule([]);
            return () => { mounted = false; };
        }

        const fetchTeacherSchedule = async () => {
            const request = ++latestRequest;
            try {
                // The booking page writes library_schedule.user_id = teacher_id.
                // Query only this teacher; names alone may belong to different staff.
                const { data, error } = await supabase.from('library_schedule')
                    .select('id, teacher, subject, grade, user_id')
                    .eq('user_id', teacherId);
                if (error) throw error;
                if (mounted && request === latestRequest) {
                    setTeacherSchedule(getTeacherLibrarySlots((data ?? []) as TeacherLibrarySlot[], teacherId));
                }
            } catch (error) {
                console.error('Unable to refresh teacher library bookings:', error);
                if (mounted && request === latestRequest) setTeacherSchedule([]);
            }
        };

        void fetchTeacherSchedule();
        const onFocus = () => { void fetchTeacherSchedule(); };
        const onVisibility = () => {
            if (document.visibilityState === 'visible') void fetchTeacherSchedule();
        };
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);
        // Realtime accelerates updates after booking/cancellation. The refresh and
        // focus listener remain a fallback if the table is not in the publication.
        const channel = supabase.channel('homepage-teacher-schedule')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'library_schedule' },
                () => { void fetchTeacherSchedule(); })
            .subscribe();
        const refresh = window.setInterval(() => { void fetchTeacherSchedule(); }, 60000);

        return () => {
            mounted = false;
            latestRequest++;
            window.clearInterval(refresh);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
            void supabase.removeChannel(channel);
        };
    }, [userData?.teacher_id, userType]);

    const getScheduleDayLabel = (day: string) => {
        const dayLabels: Record<string, { ar: string; en: string }> = {
            'الأحد': { ar: 'الأحد', en: 'Sunday' }, Sunday: { ar: 'الأحد', en: 'Sunday' },
            'الإثنين': { ar: 'الإثنين', en: 'Monday' }, Monday: { ar: 'الإثنين', en: 'Monday' },
            'الثلاثاء': { ar: 'الثلاثاء', en: 'Tuesday' }, Tuesday: { ar: 'الثلاثاء', en: 'Tuesday' },
            'الأربعاء': { ar: 'الأربعاء', en: 'Wednesday' }, Wednesday: { ar: 'الأربعاء', en: 'Wednesday' },
            'الخميس': { ar: 'الخميس', en: 'Thursday' }, Thursday: { ar: 'الخميس', en: 'Thursday' },
            'الجمعة': { ar: 'الجمعة', en: 'Friday' }, Friday: { ar: 'الجمعة', en: 'Friday' },
            'السبت': { ar: 'السبت', en: 'Saturday' }, Saturday: { ar: 'السبت', en: 'Saturday' },
        };
        return dayLabels[day]?.[isAr ? 'ar' : 'en'] || day;
    };

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const targetDate = new Date('2026-12-02T00:00:00').getTime();
            const distance = targetDate - now;
            if (distance > 0) setDaysLeft(Math.ceil(distance / (1000 * 60 * 60 * 24)));
            else setDaysLeft(0);
        };
        updateCountdown();
        const interval = setInterval(updateCountdown, 60000);
        return () => clearInterval(interval);
    }, []);

    const visitorCount = useMemo(() => {
        const baseCount = 640;
        const startDay = Date.UTC(2026, 9, 24) / 86400000;
        const uaeDay = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 86400000);
        return baseCount + (Math.max(0, uaeDay - startDay) * 10);
    }, []);

    const todayDate = useMemo(() => {
        return new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }, [locale]);

    const dailyFact = useMemo(() => {
        const dayIndex = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24)) % HOMELAND_FACTS.length;
        return HOMELAND_FACTS[dayIndex];
    }, [locale]);

    const handleLogout = async () => {
        // Local reading notes may persist, but verified email account caches must not
        // survive sign-out on a shared school device.
        const readingPassports: Array<[string, string]> = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && !key.includes(':cloud:') && (
                key.startsWith('efips-reading-passport-v1:') ||
                key.startsWith('efips-digital-ratings-v1:')
            )) {
                const value = localStorage.getItem(key);
                if (value !== null) readingPassports.push([key, value]);
            }
        }
        try { await supabase.auth.signOut(); } catch (error) { console.warn('Reader signout warning', error); }
        localStorage.clear();
        for (const [key, value] of readingPassports) localStorage.setItem(key, value);
        window.location.href = '#/';
    };

    const getDisplayName = () => {
        if (!userData) return isAr ? 'زائر' : 'Guest';
        return isAr ? (userData.name_ar || userData.name_en || 'زائر') : (userData.name_en || userData.name_ar || 'Guest');
    };

    const createGoogleCalendarLink = (bookName: string, returnDate: string) => {
        const date = new Date(returnDate);
        const start = date.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 8) + 'T060000Z'; 
        const end = date.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 8) + 'T070000Z';   
        
        const url = new URL('https://calendar.google.com/calendar/render');
        url.searchParams.append('action', 'TEMPLATE');
        url.searchParams.append('text', isAr ? `تذكير إرجاع كتاب: ${bookName}` : `Book Return Reminder: ${bookName}`);
        url.searchParams.append('dates', `${start}/${end}`);
        url.searchParams.append('details', isAr ? `مرحباً، حان موعد إرجاع كتاب "${bookName}" إلى مكتبة مدرسة صقر الإمارات الدولية. شكراً لالتزامك!` : `Hello, it's time to return the book "${bookName}" to the EFIPS library. Thank you!`);
        
        return url.toString();
    };

    const handleNameClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const newSparkles: SparkleItem[] = Array.from({ length: 15 }).map(() => ({
            id: Math.random(),
            x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 350,
            y: rect.top + (Math.random() - 0.5) * 200
        }));
        setSparkles(prev => [...prev, ...newSparkles]);
        setTimeout(() => {
            setSparkles(prev => prev.filter(s => !newSparkles.some(ns => ns.id === s.id)));
        }, 1500);
    };

    const handleNationalDayCelebration = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const newFlags: FlagFlyItem[] = Array.from({ length: 12 }).map(() => ({
            id: Math.random(),
            x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 260,
            y: rect.top + (Math.random() - 0.5) * 140,
            rot: (Math.random() - 0.5) * 45
        }));
        setFlyingFlags(prev => [...prev, ...newFlags]);
        setTimeout(() => {
            setFlyingFlags(prev => prev.filter(f => !newFlags.some(nf => nf.id === f.id)));
        }, 1800);
    };

    const handleMascotInteraction = useCallback(() => {
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 3000);

        const id = Date.now();
        const colors = ['text-red-500', 'text-blue-500', 'text-yellow-400', 'text-green-500', 'text-emerald-500'];
        const newBursts: BurstItem[] = Array.from({ length: 6 }).map((_, i) => ({
            id: id + i,
            color: colors[Math.floor(Math.random() * colors.length)],
            tx: (Math.random() - 0.5) * 220, 
            ty: -90 - Math.random() * 120,
            rot: (Math.random() - 0.5) * 180
        }));

        setBursts(prev => [...prev, ...newBursts]);
        setTimeout(() => {
            setBursts(current => current.filter(item => !newBursts.some(nb => nb.id === item.id)));
        }, 2500);

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05; audio.play().catch(() => {});
    }, []);

    return (
        <div dir={dir} className="efips-home-glass w-full min-h-[100dvh] flex flex-col items-center bg-white dark:bg-slate-950 font-sans relative overflow-x-hidden p-4 md:p-8 transition-colors duration-500">
            
            {sparkles.map(s => (
                <div key={s.id} className="fixed z-[9999] pointer-events-none animate-fade-out" style={{ left: s.x, top: s.y }}>
                    <StarIcon className="w-6 h-6 text-amber-400 drop-shadow-md animate-spin" />
                </div>
            ))}

            {flyingFlags.map(f => (
                <div key={f.id} className="fixed z-[9999] pointer-events-none animate-flag-float" style={{ left: f.x, top: f.y, transform: `rotate(${f.rot}deg)` }}>
                    <div className="p-1 bg-white/90 rounded-lg shadow-xl border border-amber-300">
                        <UaeFlagIcon className="w-8 h-6" />
                    </div>
                </div>
            ))}

            <div className="absolute top-4 end-4 md:top-8 md:end-8 z-50">
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 font-bold px-5 py-2.5 rounded-full shadow-lg transition-all text-xs md:text-sm active:scale-95"
                >
                    {t('logout')}
                </button>
            </div>

            <div className="efips-home-dashboard w-full max-w-[1300px] flex flex-col gap-8 mt-10 md:mt-6">
                
                <RevealSection delay={100}>
                    <div className="text-center space-y-3 max-w-4xl mx-auto">
                        <div className="inline-block px-5 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-700 dark:text-slate-200 font-bold text-xs md:text-sm shadow-md border-2 border-slate-200 dark:border-slate-700">
                            {userData?.teacher_id === 'HR001' 
                                ? (isAr ? 'حساب مدير المدرسة' : 'School Principal') 
                                : userData?.teacher_id === 'HR061' 
                                ? (isAr ? 'نائب مدير المدرسة' : 'VIS School Principal') 
                                : (userType === 'admin' ? t('adminBadge') : userType === 'teacher' ? t('teacherBadge') : t('studentBadge'))}
                        </div>
                        
                        <div className="flex flex-col items-center gap-2 pt-1">
                            <span className="text-base md:text-xl font-normal text-slate-500 dark:text-slate-400 tracking-wide">
                                {t('welcomeUser')}
                            </span>
                            
                            <div 
                                onClick={handleNameClick}
                                className="group relative px-8 py-3.5 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-2 border-white/90 dark:border-slate-800 shadow-2xl transition-all active:scale-95 cursor-pointer hover:scale-[1.02] duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent transition-transform pointer-events-none"></div>
                                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">{getDisplayName()}</span>
                                </h1>
                            </div>
                        </div>
                        
                        <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-normal max-w-xl mx-auto pt-2">
                            {t('subWelcome')}
                        </p>
                    </div>
                </RevealSection>

                <RevealSection delay={200}>
                    <div data-news-paused={newsPaused} className="efips-news-ribbon w-full max-w-5xl mx-auto relative z-30 flex items-center bg-white dark:bg-slate-800 border-4 border-amber-300 dark:border-amber-700 rounded-full shadow-lg overflow-hidden h-14 md:h-16">
                        <button type="button" onClick={() => setNewsPaused(paused => !paused)}
                            aria-label={newsPaused ? (isAr ? 'استئناف حركة جديدنا' : 'Resume What's New') : (isAr ? 'إيقاف حركة جديدنا لقراءة الأخبار' : 'Pause What's New to read')}
                            aria-pressed={newsPaused}
                            title={newsPaused ? (isAr ? 'استئناف الشريط' : 'Resume ticker') : (isAr ? 'إيقاف الشريط مؤقتًا' : 'Pause ticker')}
                            className="bg-amber-400 text-slate-900 font-black px-3 sm:px-5 md:px-8 h-full flex items-center gap-2 relative z-20 shrink-0 text-xs md:text-sm uppercase focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-600 focus-visible:-outline-offset-4">
                            <span className="w-2.5 h-2.5 bg-white rounded-full shrink-0" aria-hidden="true"></span>
                            {t('newsTitle')}
                            <svg className="w-3.5 h-3.5 shrink-0 opacity-80" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                                {newsPaused ? <path d="M4 2.5v11l9-5.5-9-5.5Z"/> : <path d="M3 2h3v12H3zm7 0h3v12h-3z"/>}
                            </svg>
                        </button>
                        <div className="flex-1 min-w-0 overflow-hidden h-full flex items-center bg-amber-50 dark:bg-slate-800">
                            <div aria-live="off" className={`whitespace-nowrap inline-block ${isAr ? 'animate-marquee-rtl' : 'animate-marquee-ltr'} text-slate-800 dark:text-slate-100 font-bold text-xs md:text-base px-4`}
                                style={{ animationDuration: isAr ? '205s' : '235s' }}>
                                {t('newsContent')}
                            </div>
                        </div>
                    </div>
                </RevealSection>

                <RevealSection delay={210}>
                    <SaqrOrbitNavigation isAr={isAr} userType={userType} teacherId={userData?.teacher_id} onMascotClick={handleMascotInteraction} showMascotBubble={showBubble} bursts={bursts} />
                </RevealSection>

                <RevealSection delay={250}>
                    <div className="w-full max-w-5xl mx-auto">
                        <HomeReadingHub variant="challenge" />
                    </div>
                </RevealSection>

                {/* This section exists only for teachers with saved library periods. */}
                {userType === 'teacher' && teacherSchedule.length > 0 && (
                    <RevealSection delay={150}>
                        <section
                            aria-labelledby="homepage-teacher-schedule-title"
                            className="w-full max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-emerald-200 dark:border-emerald-900/80 bg-gradient-to-br from-white via-emerald-50/80 to-teal-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 shadow-[0_18px_55px_rgba(15,118,110,0.13)] p-4 sm:p-6 md:p-8"
                        >
                            <div aria-hidden="true" className="pointer-events-none absolute -top-20 -end-12 h-44 w-44 rounded-full bg-teal-300/20 dark:bg-emerald-400/10 blur-3xl" />
                            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="shrink-0 h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg" aria-hidden="true"><ScheduleIcon /></span>
                                    <div className="min-w-0">
                                        <h2 id="homepage-teacher-schedule-title" className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{t('teacherScheduleTitle')}</h2>
                                        <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">{t('teacherScheduleSubtitle')}</p>
                                    </div>
                                </div>
                                <Link
                                    to="/schedule"
                                    className="self-start sm:self-auto min-h-11 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white/90 dark:bg-slate-800/90 px-4 py-2.5 text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-200 transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                                >
                                    <ScheduleIcon />
                                    {isAr ? 'عرض جدول المكتبة' : 'View library schedule'}
                                </Link>
                            </div>
                            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {teacherSchedule.map((slot) => {
                                    const slotId = String(slot.id ?? '');
                                    const separator = slotId.lastIndexOf('_');
                                    const day = separator >= 0 ? slotId.slice(0, separator) : slotId;
                                    const period = separator >= 0 ? slotId.slice(separator + 1) : '';
                                    return (
                                        <article key={slot.id} className="homepage-alert-card group relative bg-white/90 dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-800/70 rounded-2xl sm:rounded-3xl p-4 shadow-sm hover:shadow-xl touch-manipulation active:scale-[0.99]">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-300 mb-1">{isAr ? 'يوم الحصة' : 'Class day'}</p>
                                                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white break-words">{getScheduleDayLabel(day)}</h3>
                                                </div>
                                                <span className="shrink-0 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-3 py-2 text-xs font-black">
                                                    {t('periodLabel')} {period}
                                                </span>
                                            </div>
                                            <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-3">
                                                <p className="text-sm font-black text-slate-800 dark:text-white break-words">
                                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{t('subjectLabel')}: </span>{slot.subject || '—'}
                                                </p>
                                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 break-words">{t('gradeLabel')}: {slot.grade || '—'}</p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    </RevealSection>
                )}

                {borrowedBooks.length > 0 && (
                    <RevealSection delay={150}>
                        <section
                            aria-labelledby="homepage-notifications-title"
                            className="homepage-alerts w-full max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-emerald-200 dark:border-emerald-900/80 bg-gradient-to-br from-white via-emerald-50/80 to-teal-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 shadow-[0_18px_55px_rgba(15,118,110,0.13)] p-4 sm:p-6 md:p-8"
                        >
                            <div className="pointer-events-none absolute -top-20 -end-16 h-48 w-48 rounded-full bg-emerald-300/20 dark:bg-emerald-400/10 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-24 -start-12 h-48 w-48 rounded-full bg-amber-300/20 dark:bg-teal-400/10 blur-3xl" />

                            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 md:mb-7">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="shrink-0 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/15 text-2xl" aria-hidden="true">
                                        <BookIcon />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 id="homepage-notifications-title" className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {t('notificationsTitle')}
                                        </h2>
                                        <p className="mt-1 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {t('notificationsSubtitle')}
                                        </p>
                                    </div>
                                </div>
                                <div className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 bg-white/80 dark:bg-slate-800/80 px-3.5 py-2 text-xs font-black text-emerald-800 dark:text-emerald-300 shadow-sm">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {borrowedBooks.length} {isAr ? 'تنبيه' : 'items'}
                                </div>
                            </div>

                            {borrowedBooks.length > 0 && (
                                <div className="relative mb-6 last:mb-0">
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <span className="h-8 w-1.5 rounded-full bg-amber-500" />
                                        <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white">{t('borrowTitle')}</h3>
                                        <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 text-xs sm:text-sm font-black text-amber-800 dark:text-amber-300">{borrowedBooks.length}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                        {borrowedBooks.map((book) => {
                                            const bookTitle = book.book_name || book.book_title || book.title || book.name;
                                            const returnDate = book.return_date || book.due_date || book.expected_return_date;
                                            const validReturnDate = Boolean(returnDate && Number.isFinite(new Date(`${returnDate}T12:00:00`).getTime()));

                                            return (
                                            <article key={book.id ?? `${bookTitle}-${returnDate}`} className="homepage-alert-card group relative bg-white/90 dark:bg-slate-800/90 p-4 sm:p-5 border border-amber-200 dark:border-amber-800/70 rounded-2xl sm:rounded-3xl flex flex-col gap-3 shadow-sm hover:shadow-xl touch-manipulation active:scale-[0.99]">
                                                <div className="flex items-start gap-3">
                                                    <div className="shrink-0 h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl" aria-hidden="true"><BookIcon /></div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 mb-1">{isAr ? 'عنوان الكتاب' : 'Book title'}</p>
                                                        <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg leading-snug break-words">{bookTitle || (isAr ? 'كتاب بدون عنوان' : 'Untitled book')}</h4>
                                                    </div>
                                                </div>
                                                <BorrowingReturnStatus returnDate={returnDate} isAr={isAr} returnLabel={t('borrowReturn')} />
                                                {validReturnDate && (
                                                    <a
                                                        href={createGoogleCalendarLink(bookTitle || (isAr ? 'كتاب مستعار' : 'Borrowed book'), returnDate)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-auto w-full min-h-11 py-2.5 px-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 touch-manipulation"
                                                    >
                                                        <ScheduleIcon />
                                                        {t('addToCalendar')}
                                                    </a>
                                                )}
                                            </article>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}


                        </section>
                    </RevealSection>
                )}





                <RevealSection delay={460}>
                    <HomeReadingHub variant="books" />
                </RevealSection>

                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-stretch mt-6">
                    
                    <>
                        
                        <RevealSection delay={500}>
                            <div className="efips-home-info-card bg-gradient-to-br from-amber-100 via-amber-50 to-emerald-50 dark:from-slate-900 dark:to-slate-950 p-4 lg:p-5 rounded-[2rem] border-4 border-amber-400 dark:border-amber-600 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                                
                                <div className="absolute top-0 left-0 right-0 h-2.5 flex">
                                    <div className="bg-red-600 w-1/4"></div>
                                    <div className="bg-emerald-600 w-1/4"></div>
                                    <div className="bg-white w-1/4"></div>
                                    <div className="bg-black w-1/4"></div>
                                </div>

                                <div className="flex flex-col items-center gap-2 mb-3 mt-2">
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-3xl shadow-md border-2 border-amber-300 dark:border-amber-600">
                                        <UaeFlagIcon />
                                    </div>
                                    <h3 className="text-base lg:text-xl font-black text-amber-800 dark:text-amber-400 tracking-wider">
                                        {t('homelandTitle')}
                                    </h3>
                                </div>

                                <p className="text-sm lg:text-base text-slate-900 dark:text-white font-black leading-relaxed max-w-2xl">
                                    {isAr ? dailyFact.ar : dailyFact.en}
                                </p>

                                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
                            </div>
                        </RevealSection>

                        <>
                            
                            <RevealSection delay={600}>
                                <div className="efips-home-info-card bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-4 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between items-center text-center h-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                                        <span className="text-slate-600 dark:text-slate-400 font-bold text-xs md:text-sm">{t('visitorsLabel')}</span>
                                    </div>
                                    <span className="text-slate-900 dark:text-white font-black text-2xl md:text-3xl">
                                        {visitorCount.toLocaleString()}
                                    </span>
                                    <span className="text-slate-400 text-[11px] font-bold mt-2">{todayDate}</span>
                                </div>
                            </RevealSection>

                            <RevealSection delay={700}>
                                <div 
                                    onClick={handleNationalDayCelebration}
                                    className="efips-home-info-card group relative bg-gradient-to-br from-white via-emerald-50/40 to-rose-50/40 dark:from-slate-900 dark:via-emerald-950/20 dark:to-rose-950/20 p-6 rounded-[2rem] border-4 border-emerald-500/80 dark:border-emerald-600 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center h-full overflow-hidden cursor-pointer active:scale-95"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-2 flex">
                                        <div className="bg-[#ff0000] w-1/4"></div>
                                        <div className="bg-[#00732f] w-1/4"></div>
                                        <div className="bg-white w-1/4"></div>
                                        <div className="bg-black w-1/4"></div>
                                    </div>

                                    <div className="absolute -right-3 -bottom-3 opacity-15 dark:opacity-20 pointer-events-none transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
                                        <UaeFlagIcon className="w-28 h-20" />
                                    </div>
                                    <div className="absolute -left-3 -top-3 opacity-10 dark:opacity-15 pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                                        <UaeFlagIcon className="w-24 h-16" />
                                    </div>

                                    <div className="flex items-center justify-center gap-2 mb-1 mt-1 relative z-10">
                                        <div className="animate-flag-wave origin-bottom-left">
                                            <UaeFlagIcon className="w-6 h-4 rounded-sm shadow" />
                                        </div>
                                        <span className="bg-gradient-to-r from-red-600 via-emerald-600 to-slate-900 dark:from-red-400 dark:via-emerald-400 dark:to-white bg-clip-text text-transparent font-black text-xs md:text-sm tracking-wide">
                                            {t('upcomingEvents')}
                                        </span>
                                        <div className="animate-flag-wave-delayed origin-bottom-right">
                                            <UaeFlagIcon className="w-6 h-4 rounded-sm shadow" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center my-1 relative z-10">
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                                            {t('startsIn')}
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff0000] via-[#00732f] to-slate-900 dark:to-white drop-shadow-sm">
                                                {daysLeft !== null ? daysLeft : 0}
                                            </span>
                                            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase">
                                                {daysLeft === 1 ? t('dayUnit') : t('daysUnit')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2 relative z-10 bg-white/90 dark:bg-slate-800/90 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">
                                            {isAr ? '2 ديسمبر 2026' : '2 December 2026'}
                                        </span>
                                        <span className="text-[10px] font-black px-1.5 py-0.2 bg-gradient-to-r from-red-600 to-emerald-600 text-white rounded-full">
                                            55
                                        </span>
                                    </div>
                                </div>
                            </RevealSection>

                        </>
                    </>
                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .efips-nav-grid { align-items: stretch; grid-auto-rows: minmax(156px, auto); }
                .efips-nav-grid > a.efips-nav-tile--soft { color: #ffffff; }
                .efips-nav-grid > a.efips-nav-tile--soft :is(h3,strong,p,small,span,svg) { color: inherit; }
                .efips-nav-grid > a.efips-nav-tile--soft :is(h3,strong) { font-weight: 900; }
                .efips-nav-grid > a.efips-nav-tile--soft :is(p,small) { font-weight: 700; opacity: .88; }
                .efips-nav-grid > a.efips-nav-tile--soft:hover { filter: saturate(1.13) brightness(1.015); }
                @media (min-width: 640px) and (max-width: 1050px) {
                    .efips-nav-grid > a.efips-nav-tile { padding: 1rem 1.1rem; }
                    .efips-nav-grid > a.efips-nav-tile :is(h3,strong) { font-size: 1.04rem; }
                }
                .efips-nav-grid > a.efips-nav-tile {
                    min-width: 0; min-height: 156px; height: 100%; display: flex; align-items: center;
                    gap: 1.1rem; border-radius: 1.75rem; padding: 1.3rem 1.35rem;
                    border-bottom-width: 6px; position: relative; isolation: isolate;
                }
                .efips-nav-grid > a.efips-nav-tile > div,
                .efips-nav-grid > a.efips-nav-tile > span { min-width: 0; }
                .efips-nav-grid > a.efips-nav-tile h3,
                .efips-nav-grid > a.efips-nav-tile strong { font-size: clamp(1rem,1.6vw,1.35rem); line-height: 1.55; letter-spacing: 0; }
                .efips-nav-grid > a.efips-nav-tile p,
                .efips-nav-grid > a.efips-nav-tile small { font-size: clamp(.72rem,1vw,.86rem); line-height: 1.65; }
                .efips-nav-grid > a.efips-nav-tile svg { max-width: 35px; max-height: 35px; flex-shrink: 0; }
                .efips-nav-grid > a.efips-nav-tile::after {
                    content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
                    background: linear-gradient(115deg, #fff1 0%, transparent 60%);
                }
                @media (max-width: 640px) {
                    .efips-nav-grid > a.efips-nav-tile { min-height: 138px; padding: 1.1rem; border-radius: 1.45rem; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .efips-nav-grid > a.efips-nav-tile { transform: none !important; transition-duration: .01ms !important; }
                }

                
                @keyframes burst-steady {
                    0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
                    20% { transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(var(--rot)); opacity: 1; }
                    80% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
                    100% { transform: translate(var(--tx), calc(var(--ty) - 20px)) scale(0.8) rotate(var(--rot)); opacity: 0; }
                }
                .animate-burst-steady { animation: burst-steady 2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
                .animate-float { animation: float 5s ease-in-out infinite; }

                @keyframes flag-wave {
                    0%, 100% { transform: rotate(-6deg) scale(1); }
                    50% { transform: rotate(8deg) scale(1.08) skewY(2deg); }
                }
                .animate-flag-wave { animation: flag-wave 2.2s ease-in-out infinite; }
                .animate-flag-wave-delayed { animation: flag-wave 2.2s ease-in-out 1.1s infinite; }

                @keyframes flag-float {
                    0% { opacity: 1; transform: scale(0.6) translateY(0) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1.15) translateY(-35px) rotate(12deg); }
                    100% { opacity: 0; transform: scale(0.8) translateY(-75px) rotate(-10deg); }
                }
                .animate-flag-float { animation: flag-float 1.8s ease-out forwards; }

                @keyframes marquee-ltr { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
                @keyframes marquee-rtl { 0% { transform: translateX(0); } 100% { transform: translateX(100%); } }
                .animate-marquee-ltr { animation: marquee-ltr 65s linear infinite; }
                .animate-marquee-rtl { animation: marquee-rtl 65s linear infinite; }
                /* Long-form bilingual news stays lightweight: one transform animation only. */
                .efips-news-ribbon[data-news-paused="true"] .animate-marquee-ltr,
                .efips-news-ribbon[data-news-paused="true"] .animate-marquee-rtl,
                .efips-news-ribbon:hover .animate-marquee-ltr,
                .efips-news-ribbon:hover .animate-marquee-rtl,
                .efips-news-ribbon:focus-within .animate-marquee-ltr,
                .efips-news-ribbon:focus-within .animate-marquee-rtl {
                    animation-play-state: paused;
                }
                @media (prefers-reduced-motion: reduce) {
                    .efips-news-ribbon .animate-marquee-ltr,
                    .efips-news-ribbon .animate-marquee-rtl { animation: none !important; }
                    .efips-news-ribbon > div:last-child { overflow-x: auto; }
                }

                @keyframes fade-out {
                    0% { opacity: 1; transform: scale(1) translateY(0); }
                    100% { opacity: 0; transform: scale(0.3) translateY(-40px); }
                }
                .animate-fade-out { animation: fade-out 1.5s ease-out forwards; }

                /* Motion is scoped only to the notification cards, leaving the rest of the page unchanged. */
                .homepage-alert-card {
                    position: relative;
                    overflow: hidden;
                    transform: translateZ(0);
                    transition: transform 260ms cubic-bezier(0.2, 0.75, 0.25, 1), box-shadow 260ms ease, border-color 260ms ease;
                    -webkit-tap-highlight-color: transparent;
                }
                .homepage-alert-card::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.42) 48%, transparent 70%);
                    transform: translateX(-125%);
                    transition: transform 650ms cubic-bezier(0.2, 0.7, 0.2, 1);
                }
                @media (hover: hover) and (pointer: fine) {
                    .homepage-alert-card:hover {
                        transform: translateY(-4px) scale(1.008);
                        border-color: rgba(16, 185, 129, 0.55);
                    }
                    .homepage-alert-card:hover::after { transform: translateX(125%); }
                }
                .homepage-alert-card:active { transform: scale(0.985); }
                @media (prefers-reduced-motion: reduce) {
                    .homepage-alert-card, .homepage-alert-card::after { transition: none !important; }
                    .homepage-alert-card:hover, .homepage-alert-card:active { transform: none; }
                }
            `}</style>
        </div>
    );
};

export default HomePage;
