import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "بوابة المعرفة في مدرسة صقر الإمارات",
        subWelcome: "بوابتك الذكية للوصول إلى المعلومات.",
        welcomeUser: "أهلاً بك يا",
        logout: "تسجيل الخروج",
        adminBadge: "👑 مدير النظام",
        teacherBadge: "👨‍🏫 حساب معلم",
        studentBadge: "🎓 حساب طالب",
        adminSettings: "إدارة النظام",
        adminSettingsDesc: "التحكم الشامل في المنصة والبيانات",
        newsTitle: "جديدنا",
        newsContent: "بإمكانك الآن الاطلاع على المكتبة الإلكترونية المحدثة، وتم إضافة جدول استخدام المكتبة للمعلمين، كما تم إضافة لعبة وتحدي 'رتب المكتبة' الجديد لتصنيف الكتب، بالإضافة إلى استديو البودكاست المتاح للتسجيل ومشاركة إبداعاتكم الصوتية.",
        manualSearch: "البحث اليدوي",
        manualDesc: "البحث عن كتاب ما في مكتبة المدرسة والوصول إليه.",
        smartSearch: "اسأل صقر الذكي",
        smartDesc: "مساعدك الذكي للبحث والاستفسار.",
        digitalLibrary: "المكتبة الإلكترونية",
        digitalDesc: "عالم من الكتب والروايات الرقمية.",
        creators: "ركن المبدعين",
        creatorsDesc: "استكشف قصص وابتكارات زملائك المبدعين.",
        scheduleTitle: "جدول المكتبة",
        scheduleDesc: "حجز وتنسيق حصص زيارة المكتبة للمعلمين.",
        gameTitle: "رتب المكتبة",
        gameDesc: "العب، استمتع، وتعلم كيفية تصنيف الكتب.",
        bubble: "فخورين بالإمارات",
        homelandTitle: "لمحات من الموطن",
        challengeTitle: "تحدي المبدعين",
        challengeDesc: "ناقش، ابدأ قصتك الخاصة مع صقر، وأثبت موهبتك. هل أنت مستعد للتحدي؟",
        challengeCTA: "ابدأ رحلة الإبداع الآن",
        saqrStudioBanner: "استديو صقر",
        visitorsLabel: "زوار البوابة:",
        upcomingEvents: "أحداث قريبة",
        startsIn: "يبدأ:",
        endsIn: "ينتهي خلال:",
        dayUnit: "يوم",
        daysUnit: "أيام",
        alcLibraryTitle: "المكتبة العربية الرقمية",
        alcLibrarySub: "مبادرة رائدة يقدمها مركز أبو ظبي للغة العربية",
        recentBooksTitle: "وصل حديثاً في المكتبة",
        seeMore: "عرض المزيد",
        seeMoreDesc: "اكتشف القائمة الكاملة والملخصات الذكية للكتب الجديدة",
        newBadge: "جديد"
    },
    en: {
        welcome: "Knowledge Portal at Falcon Int'l School",
        subWelcome: "Your smart gateway to access knowledge.",
        welcomeUser: "Welcome,",
        logout: "Logout",
        adminBadge: "👑 Admin",
        teacherBadge: "👨‍🏫 Teacher",
        studentBadge: "🎓 Student",
        adminSettings: "System Admin",
        adminSettingsDesc: "Full platform and data control",
        newsTitle: "What's New",
        newsContent: "Explore the updated Digital Library. The Library Schedule for teachers has been added, along with the new 'Library Game' challenge for book classification, plus our Podcast Studio is now live!",
        manualSearch: "Manual Search",
        manualDesc: "Find and access a specific book in the school library.",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Your smart AI research assistant.",
        digitalLibrary: "Digital Library",
        digitalDesc: "A world of digital books and novels.",
        creators: "Creators Corner",
        creatorsDesc: "Explore the stories and innovations of your peers.",
        scheduleTitle: "Library Schedule",
        scheduleDesc: "Book and coordinate library visits for teachers.",
        gameTitle: "Library Game",
        gameDesc: "Play, enjoy, and learn book classification.",
        bubble: "Proud of the UAE",
        homelandTitle: "Hints From Homeland",
        challengeTitle: "Authors Challenge",
        challengeDesc: "Discuss, author your own tales with Saqr, and prove your talent. Are you ready?",
        challengeCTA: "Start your creative journey",
        saqrStudioBanner: "Saqr Studio",
        visitorsLabel: "Portal Visitors:",
        upcomingEvents: "Upcoming Events",
        startsIn: "Starts :",
        endsIn: "Ends in:",
        dayUnit: "Day",
        daysUnit: "Days",
        alcLibraryTitle: "Digital Arabic Library",
        alcLibrarySub: "A leading initiative by Abu Dhabi Arabic Language Centre",
        recentBooksTitle: "Newly Arrived Books",
        seeMore: "See More",
        seeMoreDesc: "Discover the full list and AI summaries for all new arrivals",
        newBadge: "NEW"
    }
};

const HOMELAND_FACTS = [
    { ar: "تأسست دولة الإمارات العربية المتحدة في الثاني من ديسمبر عام 1971م على يد الشيخ زايد بن سلطان آل نهيان، طيب الله ثراه.", en: "The UAE was founded on Dec 2, 1971, by Sheikh Zayed bin Sultan Al Nahyan." },
    { ar: "هل تعلم أن برج خليفة في دبي هو أطول بناء شيده الإنسان في العالم بارتفاع 828 متراً؟", en: "Did you know Burj Khalifa is the tallest man-made structure in the world at 828m?" },
    { ar: "مسبار الأمل الإماراتي هو أول مهمة عربية تصل إلى مدار كوكب المريخ لاستكشاف غلافه الجوي.", en: "The Hope Probe is the first Arab mission to reach Mars to explore its atmosphere." },
];

const ACADEMIC_EVENTS = [
    { 
        ar: "إجازة منتصف الفصل الدراسي الأول", 
        en: "Mid-term break", 
        startDate: new Date('2026-10-12T00:00:00'), 
        endDate: new Date('2026-10-16T23:59:59'),
        displayDate: "12 October 2026" 
    }
];

const FEATURED_BOOKS = [
    { id: 1, titleAr: "سلسلة عالمي الصغير", authorAr: "محمد بن راشد آل مكتوم", titleEn: "My Little World Series", authorEn: "Mohammed bin Rashid Al Maktoum", cover: "https://mediaoffice.ae/-/media/2021/jan/09-01/05/my-little-world-cover-02.png?sc_lang=ar&hash=AC07100E6A716B1F6AA95942629C21CD" },
    { id: 2, titleAr: "حكيم العرب", authorAr: "مريم صقر القاسمي", titleEn: "Wise Man of the Arabs", authorEn: "Maryam Saqr Al Qasimi", cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1614967678i/57318992.jpg" },
];

interface BurstItem { id: number; tx: number; ty: number; rot: number; color: string; }

const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const UaeFlagIcon = () => (
    <svg viewBox="0 0 640 480" className="w-10 h-10 rounded shadow-sm overflow-hidden" preserveAspectRatio="none">
        <path fill="#00732f" d="M0 0h640v160H0z"/>
        <path fill="#fff" d="M0 160h640v160H0z"/>
        <path fill="#000" d="M0 320h640v160H0z"/>
        <path fill="#ff0000" d="M0 0h220v480H0z"/>
    </svg>
);

const HomePage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale as 'ar' | 'en'][key];
    
    const [userData, setUserData] = useState<any>(null);
    const [userType, setUserType] = useState<'student' | 'teacher' | 'admin' | null>(null);

    // استخدام try/catch لمنع الانهيار تماماً إذا كان الـ localStorage تالفاً
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('current_user');
            const storedType = localStorage.getItem('user_type');

            if (storedUser && storedType) {
                setUserData(JSON.parse(storedUser));
                setUserType(storedType as 'student' | 'teacher' | 'admin');
            } else {
                window.location.href = '#/';
            }
        } catch (err) {
            console.error("Session parse error:", err);
            localStorage.clear();
            window.location.href = '#/';
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '#/';
    };

    const getDisplayName = () => {
        if (!userData) return '';
        return isAr ? (userData.name_ar || userData.name_en || 'زائر') : (userData.name_en || userData.name_ar || 'Guest');
    };

    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [activeEvent, setActiveEvent] = useState<typeof ACADEMIC_EVENTS[0] | null>(null);
    const [countdownType, setCountdownType] = useState<'start' | 'end'>('start');

    useEffect(() => {
        const checkTime = () => {
            const now = new Date().getTime();
            const upcoming = ACADEMIC_EVENTS.find(event => event.endDate.getTime() > now);
            
            if (upcoming) {
                setActiveEvent(upcoming);
                let target = upcoming.startDate.getTime();
                
                if (now > upcoming.startDate.getTime()) {
                    target = upcoming.endDate.getTime();
                    setCountdownType('end');
                } else {
                    setCountdownType('start');
                }

                const distance = target - now;
                setDaysLeft(Math.ceil(distance / (1000 * 60 * 60 * 24)));
            }
        };

        checkTime();
    }, []);

    const visitorCount = useMemo(() => 1250, []);
    const todayDate = useMemo(() => new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US'), [locale]);
    const dailyFact = useMemo(() => HOMELAND_FACTS[0], []);

    const handleMascotInteraction = useCallback(() => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);
        
        const id = Date.now();
        const colors = ['text-red-500', 'text-blue-500', 'text-yellow-400', 'text-green-500', 'text-purple-500'];
        const newBursts: BurstItem[] = Array.from({ length: 5 }).map((_, i) => ({
            id: id + i,
            color: colors[Math.floor(Math.random() * colors.length)],
            tx: (Math.random() - 0.5) * 200, 
            ty: -80 - Math.random() * 100,
            rot: (Math.random() - 0.5) * 180
        }));

        setBursts(prev => [...prev, ...newBursts]);
        setTimeout(() => setBursts([]), 2000);
    }, []);

    if (!userData) {
        return (
            <div className="min-h-[100dvh] flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
                <div className="animate-pulse text-xl font-bold text-slate-500 text-center">
                    جاري تحميل بوابة المعرفة...
                </div>
            </div>
        );
    }

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col items-center bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden p-4 md:p-8">
            
            <div className="absolute top-4 end-4 md:top-8 md:end-8 z-50">
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-slate-700 dark:text-slate-200 hover:text-rose-600 font-bold px-4 py-2 rounded-full shadow-sm transition-all text-sm"
                >
                    {t('logout')}
                </button>
            </div>

            <div className="w-full max-w-[1300px] flex flex-col gap-8 mt-12">
                
                <div className="text-center space-y-3 max-w-4xl mx-auto">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs shadow-sm border border-slate-200 dark:border-slate-700">
                        {userType === 'admin' ? t('adminBadge') : userType === 'teacher' ? t('teacherBadge') : t('studentBadge')}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white">
                        {t('welcomeUser')} <span className="text-blue-500">{getDisplayName()}</span>
                    </h1>
                    <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 font-bold">
                        {t('subWelcome')}
                    </p>
                </div>

                {/* استديو صقر (للطلاب والأدمن فقط) */}
                {(userType === 'student' || userType === 'admin') && (
                    <div className="flex justify-center">
                        <Link to="/saqr-studio" className="px-10 py-4 rounded-full bg-blue-500 text-white font-black text-lg shadow-lg hover:bg-blue-600 transition-all">
                            {t('saqrStudioBanner')}
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link to="/search" className="bg-sky-400 text-white p-6 rounded-3xl font-black text-center shadow-md">
                        <h3 className="text-xl mb-1">{t('manualSearch')}</h3>
                        <p className="text-xs opacity-90">{t('manualDesc')}</p>
                    </Link>

                    <Link to="/smart-search" className="bg-emerald-400 text-white p-6 rounded-3xl font-black text-center shadow-md">
                        <h3 className="text-xl mb-1">{t('smartSearch')}</h3>
                        <p className="text-xs opacity-90">{t('smartDesc')}</p>
                    </Link>

                    <Link to="/digital-library" className="bg-indigo-400 text-white p-6 rounded-3xl font-black text-center shadow-md">
                        <h3 className="text-xl mb-1">{t('digitalLibrary')}</h3>
                        <p className="text-xs opacity-90">{t('digitalDesc')}</p>
                    </Link>

                    <Link to="/creators" className="bg-purple-400 text-white p-6 rounded-3xl font-black text-center shadow-md">
                        <h3 className="text-xl mb-1">{t('creators')}</h3>
                        <p className="text-xs opacity-90">{t('creatorsDesc')}</p>
                    </Link>

                    {(userType === 'teacher' || userType === 'admin') && (
                        <Link to="/schedule" className="bg-teal-500 text-white p-6 rounded-3xl font-black text-center shadow-md">
                            <h3 className="text-xl mb-1">{t('scheduleTitle')}</h3>
                            <p className="text-xs opacity-90">{t('scheduleDesc')}</p>
                        </Link>
                    )}

                    {(userType === 'student' || userType === 'admin') && (
                        <Link to="/game" className="bg-amber-400 text-slate-900 p-6 rounded-3xl font-black text-center shadow-md">
                            <h3 className="text-xl mb-1">{t('gameTitle')}</h3>
                            <p className="text-xs opacity-90">{t('gameDesc')}</p>
                        </Link>
                    )}

                    {userType === 'admin' && (
                        <Link to="/admin-dashboard" className="bg-rose-500 text-white p-6 rounded-3xl font-black text-center shadow-md">
                            <h3 className="text-xl mb-1">{t('adminSettings')}</h3>
                            <p className="text-xs opacity-90">{t('adminSettingsDesc')}</p>
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
};

export default HomePage;
