import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "بوابة المعرفة في مدرسة صقر الإمارات",
        subWelcome: "بوابتك الذكية للوصول إلى المعلومات والإبداع.",
        welcomeUser: "أهلاً بك يا",
        logout: "تسجيل الخروج",
        adminBadge: "مدير النظام",
        teacherBadge: "حساب معلم",
        studentBadge: "حساب طالب",
        adminSettings: "إدارة النظام",
        adminSettingsDesc: "التحكم الشامل في المنصة والبيانات",
        newsTitle: "جديدنا",
        newsContent: "قريباً مسابقة بودكاست للطلاب! | تم إضافة كتب جديدة في القسم العربي، الرجاء زيارة المكتبة للاطلاع عليها | استديو البودكاست متاح الآن للتسجيل ومشاركة إبداعاتكم الصوتية.",
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
        saqrStudioBanner: "استديو صقر",
        saqrStudioDesc: "سجل إبداعاتك الصوتية وشارك في البودكاست.",
        bubble: "فخورين بالإمارات",
        homelandTitle: "لمحات من الموطن",
        visitorsLabel: "زوار البوابة:",
        upcomingEvents: "إجازة منتصف الفصل الأول",
        startsIn: "تبدأ إجازة منتصف الفصل خلال:",
        dayUnit: "يوم",
        daysUnit: "أيام",
        newBadge: "جديد",
        adminSettingsTitle: "إدارة النظام"
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
        newsContent: "Coming soon: Student podcast competition! |  New books have been added to the Arabic section, please visit the library |  Podcast Studio is now live!",
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
        saqrStudioBanner: "Saqr Studio",
        saqrStudioDesc: "Record your voice and share in the podcast.",
        bubble: "Proud of the UAE",
        homelandTitle: "Hints From Homeland",
        visitorsLabel: "Portal Visitors:",
        upcomingEvents: "Mid-term Break",
        startsIn: "Mid-term break starts in:",
        dayUnit: "Day",
        daysUnit: "Days",
        newBadge: "NEW",
        adminSettingsTitle: "System Admin"
    }
};

const HOMELAND_FACTS = [
    { ar: "تأسست دولة الإمارات العربية المتحدة في الثاني من ديسمبر عام 1971م على يد الشيخ زايد بن سلطان آل نهيان، طيب الله ثراه.", en: "The UAE was founded on Dec 2, 1971, by Sheikh Zayed bin Sultan Al Nahyan." },
    { ar: "هل تعلم أن برج خليفة في دبي هو أطول بناء شيده الإنسان في العالم بارتفاع 828 متراً؟", en: "Did you know Burj Khalifa is the tallest man-made structure in the world at 828m?" },
    { ar: "مسبار الأمل الإماراتي هو أول مهمة عربية تصل إلى مدار كوكب المريخ لاستكشاف غلافه الجوي.", en: "The Hope Probe is the first Arab mission to reach Mars to explore its atmosphere." },
    { ar: "تعتبر 'نخلة جميرا' أكبر جزيرة اصطناعية في العالم، ويمكن رؤيتها بوضوح من الفضاء الخارجي.", en: "Palm Jumeirah is the world's largest man-made island, visible from space." },
    { ar: "متحف اللوفر أبوظبي هو أول متحف عالمي في العالم العربي يعكس روح الانفتاح الثقافي.", en: "Louvre Abu Dhabi is the first universal museum in the Arab world reflecting cultural openness." }
];

interface BurstItem { id: number; tx: number; ty: number; rot: number; color: string; }
interface SparkleItem { id: number; x: number; y: number; }

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

// أيقونات شفافة (أحادية) بمقاسات متناسقة 100%
const SearchIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SmartIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const BookIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const CreatorIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const StudioIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const ScheduleIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GameIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AdminIcon = () => <svg className="w-6 h-6 stroke-[2.2] opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

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
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [sparkles, setSparkles] = useState<SparkleItem[]>([]);

    useEffect(() => {
        if (!userData || !userType) {
            window.location.href = '#/';
        }
    }, [userData, userType]);

    // العد التنازلي لإجازة منتصف الفصل في 12 أكتوبر 2026
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const targetDate = new Date('2026-10-12T00:00:00').getTime();
            const distance = targetDate - now;
            if (distance > 0) {
                setDaysLeft(Math.ceil(distance / (1000 * 60 * 60 * 24)));
            } else {
                setDaysLeft(0);
            }
        };
        updateCountdown();
    }, []);

    const visitorCount = useMemo(() => {
        const baseCount = 3015;
        const startDate = new Date('2026-02-01').getTime();
        const today = new Date().getTime();
        const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        return baseCount + (Math.max(0, diffDays) * 20);
    }, []);

    const todayDate = useMemo(() => {
        return new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [locale]);

    const dailyFact = useMemo(() => {
        const dayIndex = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24)) % HOMELAND_FACTS.length;
        return HOMELAND_FACTS[dayIndex];
    }, [locale]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '#/';
    };

    const getDisplayName = () => {
        if (!userData) return isAr ? 'زائر' : 'Guest';
        return isAr ? (userData.name_ar || userData.name_en || 'زائر') : (userData.name_en || userData.name_ar || 'Guest');
    };

    // تأثير النجوم المتطايرة عند الضغط على اسم المستخدم
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
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col items-center bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden p-4 md:p-8 transition-colors duration-500">
            
            {/* النجوم المتطايرة عند الضغط على اسم المستخدم */}
            {sparkles.map(s => (
                <div key={s.id} className="fixed z-[99999] pointer-events-none animate-fade-out" style={{ left: s.x, top: s.y }}>
                    <StarIcon className="w-6 h-6 text-amber-400 drop-shadow-md animate-spin" />
                </div>
            ))}

            {/* زر تسجيل الخروج الزجاجي */}
            <div className="absolute top-4 end-4 md:top-8 md:end-8 z-50">
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 font-bold px-5 py-2.5 rounded-full shadow-lg transition-all text-xs md:text-sm active:scale-95"
                >
                    {t('logout')}
                </button>
            </div>

            <div className="w-full max-w-[1300px] flex flex-col gap-10 mt-10 md:mt-6">
                
                {/* رأس الصفحة: "أهلاً بك يا" في سطر، واسم المستخدم في سطر مستقل مع لمحة الشيمير */}
                <div className="text-center space-y-3 max-w-4xl mx-auto">
                    <div className="inline-block px-5 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-700 dark:text-slate-200 font-bold text-xs md:text-sm shadow-md border-2 border-slate-200 dark:border-slate-700">
                        {userType === 'admin' ? t('adminBadge') : userType === 'teacher' ? t('teacherBadge') : t('studentBadge')}
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 pt-1">
                        <span className="text-base md:text-xl font-normal text-slate-500 dark:text-slate-400 tracking-wide">
                            {t('welcomeUser')}
                        </span>
                        
                        <div 
                            onClick={handleNameClick}
                            className="group relative px-8 py-3.5 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-2 border-white/90 dark:border-slate-800 shadow-2xl transition-all active:scale-95 cursor-pointer hover:scale-[1.02] duration-300 overflow-hidden"
                        >
                            {/* تأثير اللمعة (Shimmer) على الماوس */}
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

                {/* شريط جديدنا المتحرك */}
                <div className="w-full max-w-5xl mx-auto relative z-30 flex items-center bg-white dark:bg-slate-800 border-4 border-amber-300 dark:border-amber-700 rounded-full shadow-lg overflow-hidden h-14 md:h-16">
                    <div className="bg-amber-400 text-slate-900 font-black px-5 md:px-8 h-full flex items-center gap-2 relative z-20 shrink-0 text-xs md:text-sm uppercase">
                        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                        {t('newsTitle')}
                    </div>
                    <div className="flex-1 overflow-hidden h-full flex items-center bg-amber-50 dark:bg-slate-800">
                        <div className={`whitespace-nowrap inline-block ${isAr ? 'animate-marquee-rtl' : 'animate-marquee-ltr'} text-slate-800 dark:text-slate-100 font-bold text-xs md:text-base px-4`}>
                            {t('newsContent')}
                        </div>
                    </div>
                </div>

                {/* أولاً: روابط التوجيه السريع والأقسام */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <Link to="/search" className="group relative bg-sky-400 text-white p-6 rounded-[2.5rem] border-b-8 border-sky-600 shadow-xl hover:-translate-y-2 hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-300 flex items-center gap-5 overflow-hidden">
                        <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                            <SearchIcon />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black mb-1 tracking-tight">{t('manualSearch')}</h3>
                            <p className="text-xs md:text-sm opacity-90 font-normal leading-snug">{t('manualDesc')}</p>
                        </div>
                    </Link>

                    <Link to="/smart-search" className="group relative bg-emerald-400 text-white p-6 rounded-[2.5rem] border-b-8 border-emerald-600 shadow-xl hover:-translate-y-2 hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-300 flex items-center gap-5 overflow-hidden">
                        <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                            <SmartIcon />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black mb-1 tracking-tight">{t('smartSearch')}</h3>
                            <p className="text-xs md:text-sm opacity-90 font-normal leading-snug">{t('smartDesc')}</p>
                        </div>
                    </Link>

                    <Link to="/digital-library" className="group relative bg-indigo-400 text-white p-6 rounded-[2.5rem] border-b-8 border-indigo-600 shadow-xl hover:-translate-y-2 hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-300 flex items-center gap-5 overflow-hidden">
                        <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                            <BookIcon />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black mb-1 tracking-tight">{t('digitalLibrary')}</h3>
                            <p className="text-xs md:text-sm opacity-90 font-normal leading-snug">{t('digitalDesc')}</p>
                        </div>
                    </Link>

                    <Link to="/creators" className="group relative bg-purple-400 text-white p-6 rounded-[2.5rem] border-b-8 border-purple-600 shadow-xl hover:-translate-y-2 hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-300 flex items-center gap-5 overflow-hidden">
                        <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                            <CreatorIcon />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black mb-1 tracking-tight">{t('creators')}</h3>
                            <p className="text-xs md:text-sm opacity-90 font-normal leading-snug">{t('creatorsDesc')}</p>
                        </div>
                    </Link>

                    {/* استديو صقر (للطلاب والأدمن فقط) مع علامة جديد في الجهة المقابلة */}
                    {(userType === 'student' || userType === 'admin') && (
                        <Link to="/saqr-studio" className="group relative bg-blue-500 text-white p-6 rounded-[2.5rem] border-b-8 border-blue-700 shadow-xl hover:-translate-y-2 hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-300 flex items-center gap-5 overflow-hidden">
                            <div className="absolute top-4 end-4 bg-rose-500 text-white text-[10px] md:text-xs px-3 py-0.5 rounded-full font-black uppercase tracking-wider shadow-md animate-pulse">
                                {t('newBadge')}
                            </div>
                            <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                <StudioIcon />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black mb-1 tracking-tight">{t('saqrStudioBanner')}</h3>
                                <p className="text-xs md:text-sm opacity-90 font-normal leading-snug">{t('saqrStudioDesc')}</p>
                            </div>
                        </Link>
                    )}

                    {/* جدول المكتبة (للمعلم والأدمن فقط) */}
                    {(userType === 'teacher' || userType === 'admin') && (
                        <Link to="/schedule" className="group relative bg-teal-500 text-white p-6 rounded-[2.5rem] border-b-8 border-teal-700 shadow-xl hover:-translate-y-2 hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-300 flex items-center gap-5 overflow-hidden">
                            <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                <ScheduleIcon />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black mb-1 tracking-tight">{t('scheduleTitle')}</h3>
                                <p className="text-xs md:text-sm opacity-90 font-normal leading-snug">{t('scheduleDesc')}</p>
                            </div>
                        </Link>
                    )}

                    {/* رتب المكتبة (للطلاب والأدمن فقط) مع علامة جديد في الجهة المقابلة */}
                    {(userType === 'student' || userType === 'admin') && (
                        <Link to="/game" className="group relative bg-amber-400 text-slate-900 p-6 rounded-[2.5rem] border-b-8 border-amber-600 shadow-xl hover:-translate-y-2 hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-300 flex items-center gap-5 overflow-hidden">
                            <div className="absolute top-4 end-4 bg-rose-500 text-white text-[10px] md:text-xs px-3 py-0.5 rounded-full font-black uppercase tracking-wider shadow-md animate-pulse">
                                {t('newBadge')}
                            </div>
                            <div className="p-3.5 bg-slate-900/10 backdrop-blur-md rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 text-slate-900">
                                <GameIcon />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black mb-1 tracking-tight">{t('gameTitle')}</h3>
                                <p className="text-xs md:text-sm opacity-90 font-normal leading-snug">{t('gameDesc')}</p>
                            </div>
                        </Link>
                    )}

                    {/* إدارة النظام (للأدمن فقط) */}
                    {userType === 'admin' && (
                        <Link to="/admin-dashboard" className="group relative bg-rose-500 text-white p-6 rounded-[2.5rem] border-b-8 border-rose-700 shadow-xl hover:-translate-y-2 hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-300 flex items-center gap-5 sm:col-span-2 lg:col-span-3 overflow-hidden">
                            <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                <AdminIcon />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black mb-1 tracking-tight">{t('adminSettingsTitle')}</h3>
                                <p className="text-xs md:text-sm opacity-90 font-normal leading-snug">{t('adminSettingsDesc')}</p>
                            </div>
                        </Link>
                    )}
                </div>

                {/* ثانياً: قسم شخصية صقر التفاعلية ومعلومات الموطن (في الأسفل) */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
                    
                    {/* شخصية صقر والتاثيرات */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                        <div onClick={handleMascotInteraction} className="relative cursor-pointer group flex flex-col items-center">
                            {/* شعار المدرسة في الخلفية (يتغير للأبيض في الدارك مود) */}
                            <img src="/school-logo.png" alt="" className="absolute inset-0 m-auto w-72 h-72 object-contain opacity-10 dark:opacity-25 dark:brightness-0 dark:invert z-0 pointer-events-none transition-all duration-300" />

                            {bursts.map((burst) => (
                                <div key={burst.id} 
                                    className={`absolute z-[100] animate-burst-steady pointer-events-none ${burst.color}`}
                                    style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                    <StarIcon className="w-8 h-8 drop-shadow-md" />
                                </div>
                            ))}

                            {/* فقاعة الترحيب عند الضغط */}
                            {showBubble && (
                                <div className="absolute -top-14 bg-white dark:bg-slate-800 px-6 py-2.5 rounded-2xl border-4 border-rose-500 shadow-2xl text-rose-600 dark:text-rose-400 font-black text-sm md:text-base animate-bounce z-30">
                                    {isAr ? 'فخورين بالإمارات 🇦🇪' : 'Proud of the UAE 🇦🇪'}
                                </div>
                            )}

                            <img src="/saqr-full.png" alt="Saqr Mascot" className="h-60 md:h-80 object-contain relative z-10 animate-float drop-shadow-2xl group-hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>

                    {/* معلومات الموطن والعد التنازلي والزوار */}
                    <div className="lg:col-span-7 grid grid-cols-1 gap-6">
                        
                        {/* بلوك معلومات عن الإمارات (يتغير يومياً) */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border-4 border-amber-300 dark:border-amber-700 shadow-lg relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-amber-200 dark:border-amber-600">
                                    <UaeFlagIcon />
                                </div>
                                <h3 className="text-base md:text-lg font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                                    {t('homelandTitle')}
                                </h3>
                            </div>
                            <p className="text-lg md:text-2xl text-slate-800 dark:text-white font-black leading-relaxed">
                                {isAr ? dailyFact.ar : dailyFact.en}
                            </p>
                        </div>

                        {/* قسم التاريخ، الزوار، والعد التنازلي للإجازة */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* عداد الزوار */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-4 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between items-center text-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                                    <span className="text-slate-600 dark:text-slate-400 font-bold text-xs md:text-sm">{t('visitorsLabel')}</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-black text-3xl md:text-4xl">
                                    {visitorCount.toLocaleString()}
                                </span>
                                <span className="text-slate-400 text-[11px] font-bold mt-2">{todayDate}</span>
                            </div>

                            {/* العد التنازلي لإجازة منتصف الفصل */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-4 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between items-center text-center">
                                <span className="text-rose-600 dark:text-rose-400 font-black text-xs md:text-sm mb-1">
                                    {t('upcomingEvents')}
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white">
                                        {daysLeft !== null ? daysLeft : 0}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500 uppercase">
                                        {daysLeft === 1 ? t('dayUnit') : t('daysUnit')}
                                    </span>
                                </div>
                                <span className="text-[11px] font-bold text-slate-500 mt-2">12 October 2026</span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <style>{`
                @keyframes burst-steady {
                    0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
                    20% { transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(var(--rot)); opacity: 1; }
                    80% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
                    100% { transform: translate(var(--tx), calc(var(--ty) - 20px)) scale(0.8) rotate(var(--rot)); opacity: 0; }
                }
                .animate-burst-steady { animation: burst-steady 2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
                .animate-float { animation: float 5s ease-in-out infinite; }

                @keyframes marquee-ltr { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                @keyframes marquee-rtl { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                .animate-marquee-ltr { animation: marquee-ltr 40s linear infinite; }
                .animate-marquee-rtl { animation: marquee-rtl 40s linear infinite; }

                @keyframes fade-out {
                    0% { opacity: 1; transform: scale(1) translateY(0); }
                    100% { opacity: 0; transform: scale(0.3) translateY(-40px); }
                }
                .animate-fade-out { animation: fade-out 1.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default HomePage;
