import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const BookIcon = () => (
    <svg className="w-10 h-10 md:w-14 md:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const GlobeIcon = () => (
    <svg className="w-10 h-10 md:w-14 md:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const BrainIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const RocketIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const LightBulbIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6M12 3a7 7 0 00-7 7c0 2.5 1.5 4.5 3.5 5.5V17a2 2 0 002 2h2a2 2 0 002-2v-1.5c2-1 3.5-3 3.5-5.5a7 7 0 00-7-7z" />
    </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const READING_INSPIRATIONS = [
    { icon: <BookIcon />, textAr: "اقرأ لترتقي", textEn: "Read to Rise", color: "text-blue-500" },
    { icon: <StarIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "مغامرة في كل صفحة", textEn: "Adventure in every page", color: "text-amber-500" },
    { icon: <BrainIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "المعرفة قوة", textEn: "Knowledge is Power", color: "text-purple-500" },
    { icon: <RocketIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "سافر عبر الكلمات", textEn: "Travel through Words", color: "text-rose-500" },
    { icon: <LightBulbIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "نور العقل", textEn: "Light of the Mind", color: "text-emerald-500" },
    { icon: <HeartIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "أحب القراءة", textEn: "I Love Reading", color: "text-red-500" }
];

const translations = {
    ar: {
        title: "الكتب الرقمية",
        desc: "المكتبة في كفّ يدك.. تبني اليومَ فِكْرَ غدِك بأسلوب عصري فريد.",
        arabicLib: "المكتبة العربية",
        englishLib: "المكتبة الإنجليزية",
        arabicDesc: "روائع الأدب العربي، التراث، وتطوير الذات.",
        englishDesc: "أحدث الروايات العالمية، القصص، والألغاز.",
        bubble: "اضغط للإلهام!"
    },
    en: {
        title: "E-BOOKS",
        desc: "The library in your hand, building a mind so grand and modern.",
        arabicLib: "Arabic Library",
        englishLib: "English Library",
        arabicDesc: "Arabic literature, heritage, and self-development.",
        englishDesc: "Global novels, stories, and exciting puzzles.",
        bubble: "Touch for Magic!"
    }
};

interface BurstItem {
    id: number;
    tx: number;
    ty: number;
    rot: number;
    item: typeof READING_INSPIRATIONS[0];
}

const DigitalLibraryPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);

    const handleMascotInteraction = useCallback(() => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);
        
        const id = Date.now();
        const randomItem = READING_INSPIRATIONS[Math.floor(Math.random() * READING_INSPIRATIONS.length)];
        
        const newBurst: BurstItem = {
            id,
            item: randomItem,
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 150 : 350),
            ty: -100 - Math.random() * 150,
            rot: (Math.random() - 0.5) * 40
        };

        setBursts(prev => [...prev, newBurst]);
        setTimeout(() => {
            setBursts(current => current.filter(b => b.id !== id));
        }, 2500);

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05; audio.play().catch(() => {});
    }, []);

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-20 px-4 md:px-6">
            
            {/* الخلفية الديناميكية الموحدة (تصميم طفولي) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-sky-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-24 animate-fade-in-up pb-20">
                
                {/* 1. قسم الترحيب العلوي */}
                <div className="text-center space-y-4 md:space-y-6 max-w-5xl mx-auto relative z-20">
                    <h1 className="text-5xl md:text-[6rem] lg:text-[8rem] font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">
                        {t('title')}
                    </h1>
                    <p className="text-lg md:text-3xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-3xl mx-auto px-4">
                        {t('desc')}
                    </p>
                    <div className="flex justify-center gap-3 pt-4">
                        <div className="h-2 w-16 bg-emerald-400 rounded-full"></div>
                        <div className="h-2 w-24 bg-sky-400 rounded-full"></div>
                    </div>
                </div>

                {/* 2. مركز العمليات الرقمي */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
                    
                    {/* الكروت الصلبة المبهجة */}
                    <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8 order-2 lg:order-1 px-2 md:px-0">
                        
                        <Link 
                            to="/digital-library/arabic" 
                            className="group bg-white dark:bg-slate-800 p-6 md:p-10 lg:p-12 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 border-b-8 hover:border-emerald-400 dark:hover:border-emerald-500 hover:-translate-y-2 active:border-b-4 active:translate-y-2 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-start shadow-sm"
                        >
                            <div className="w-24 h-24 md:w-28 md:h-28 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0 border-4 border-emerald-200 dark:border-emerald-800">
                                <BookIcon />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight">{t('arabicLib')}</h3>
                                <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('arabicDesc')}</p>
                            </div>
                        </Link>

                        <Link 
                            to="/digital-library/english" 
                            className="group bg-white dark:bg-slate-800 p-6 md:p-10 lg:p-12 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 border-b-8 hover:border-sky-400 dark:hover:border-sky-500 hover:-translate-y-2 active:border-b-4 active:translate-y-2 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-start shadow-sm"
                        >
                            <div className="w-24 h-24 md:w-28 md:h-28 bg-sky-100 dark:bg-sky-900/30 text-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0 border-4 border-sky-200 dark:border-sky-800">
                                <GlobeIcon />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight">{t('englishLib')}</h3>
                                <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('englishDesc')}</p>
                            </div>
                        </Link>

                    </div>

                    {/* صقر مع الشعار الذكي خلفه */}
                    <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 relative z-[30]">
                        <div onClick={handleMascotInteraction} className={`relative cursor-pointer transition-transform duration-300 w-full flex justify-center items-center ${isMascotClicked ? 'scale-95' : 'hover:scale-105'}`}>
                            
                            {/* شعار المدرسة الباهت (يتحول للأبيض في الدارك مود) */}
                            <img 
                                src="/school-logo.png" 
                                alt="EFIPS Seal" 
                                className="absolute inset-0 m-auto w-[110%] h-[110%] object-contain rotate-6 opacity-10 dark:opacity-20 dark:brightness-0 dark:invert -z-10 pointer-events-none transition-all duration-1000" 
                            />

                            {/* كروت الإلهام الطائرة */}
                            {bursts.map((burst) => (
                                <div key={burst.id} 
                                    className="absolute z-[100] bg-white dark:bg-slate-800 px-6 py-3 md:px-8 md:py-4 rounded-[2rem] border-4 border-slate-200 dark:border-slate-700 shadow-md animate-burst-steady pointer-events-none flex items-center gap-3 md:gap-4"
                                    style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                    <span className={`${burst.item.color}`}>{burst.item.icon}</span>
                                    <span className="text-sm md:text-xl font-black text-slate-800 dark:text-slate-200 whitespace-nowrap">{isAr ? burst.item.textAr : burst.item.textEn}</span>
                                </div>
                            ))}

                            <img src="/saqr-digital.png" alt="Saqr Mascot" className="h-64 md:h-[450px] lg:h-[550px] object-contain drop-shadow-2xl relative z-10 animate-float" />
                            
                            {/* فقاعة المحادثة */}
                            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-white dark:bg-slate-800 p-4 md:p-6 lg:p-8 rounded-[2rem] md:rounded-[3rem] rounded-br-none border-4 border-rose-400 shadow-lg text-sm md:text-2xl font-black text-rose-500 animate-bounce z-20">
                                {t('bubble')}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
                
                @keyframes burst-steady {
                  0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
                  20% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; }
                  80% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
                  100% { transform: translate(var(--tx), calc(var(--ty) - 30px)) scale(0.8) rotate(var(--rot)); opacity: 0; }
                }
                .animate-burst-steady { animation: burst-steady 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                
                @keyframes fade-in-up {
                  0% { opacity: 0; transform: translateY(20px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default DigitalLibraryPage;        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const LightBulbIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6M12 3a7 7 0 00-7 7c0 2.5 1.5 4.5 3.5 5.5V17a2 2 0 002 2h2a2 2 0 002-2v-1.5c2-1 3.5-3 3.5-5.5a7 7 0 00-7-7z" />
    </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const READING_INSPIRATIONS = [
    { icon: <BookIcon />, textAr: "اقرأ لترتقي", textEn: "Read to Rise", color: "text-blue-500" },
    { icon: <StarIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "مغامرة في كل صفحة", textEn: "Adventure in every page", color: "text-amber-500" },
    { icon: <BrainIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "المعرفة قوة", textEn: "Knowledge is Power", color: "text-purple-500" },
    { icon: <RocketIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "سافر عبر الكلمات", textEn: "Travel through Words", color: "text-rose-500" },
    { icon: <LightBulbIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "نور العقل", textEn: "Light of the Mind", color: "text-emerald-500" },
    { icon: <HeartIcon className="w-8 h-8 md:w-10 md:h-10" />, textAr: "أحب القراءة", textEn: "I Love Reading", color: "text-red-500" }
];

const translations = {
    ar: {
        title: "الكتب الرقمية",
        desc: "المكتبة في كفّ يدك.. تبني اليومَ فِكْرَ غدِك بأسلوب عصري فريد.",
        arabicLib: "المكتبة العربية",
        englishLib: "المكتبة الإنجليزية",
        arabicDesc: "روائع الأدب العربي، التراث، وتطوير الذات.",
        englishDesc: "أحدث الروايات العالمية، القصص، والألغاز.",
        bubble: "اضغط للإلهام!"
    },
    en: {
        title: "E-BOOKS",
        desc: "The library in your hand, building a mind so grand and modern.",
        arabicLib: "Arabic Library",
        englishLib: "English Library",
        arabicDesc: "Arabic literature, heritage, and self-development.",
        englishDesc: "Global novels, stories, and exciting puzzles.",
        bubble: "Touch for Magic!"
    }
};

interface BurstItem {
    id: number;
    tx: number;
    ty: number;
    rot: number;
    item: typeof READING_INSPIRATIONS[0];
}

const DigitalLibraryPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);

    const handleMascotInteraction = useCallback(() => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);
        
        const id = Date.now();
        const randomItem = READING_INSPIRATIONS[Math.floor(Math.random() * READING_INSPIRATIONS.length)];
        
        const newBurst: BurstItem = {
            id,
            item: randomItem,
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 150 : 350),
            ty: -100 - Math.random() * 150,
            rot: (Math.random() - 0.5) * 40
        };

        setBursts(prev => [...prev, newBurst]);
        setTimeout(() => {
            setBursts(current => current.filter(b => b.id !== id));
        }, 2500);

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05; audio.play().catch(() => {});
    }, []);

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-20 px-4 md:px-6">
            
            {/* الخلفية الديناميكية الموحدة (تصميم طفولي) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-sky-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-24 animate-fade-in-up pb-20">
                
                {/* 1. قسم الترحيب العلوي */}
                <div className="text-center space-y-4 md:space-y-6 max-w-5xl mx-auto relative z-20">
                    <h1 className="text-5xl md:text-[6rem] lg:text-[8rem] font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">
                        {t('title')}
                    </h1>
                    <p className="text-lg md:text-3xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-3xl mx-auto px-4">
                        {t('desc')}
                    </p>
                    <div className="flex justify-center gap-3 pt-4">
                        <div className="h-2 w-16 bg-emerald-400 rounded-full"></div>
                        <div className="h-2 w-24 bg-sky-400 rounded-full"></div>
                    </div>
                </div>

                {/* 2. مركز العمليات الرقمي */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
                    
                    {/* الكروت الصلبة المبهجة */}
                    <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8 order-2 lg:order-1 px-2 md:px-0">
                        
                        <Link 
                            to="/digital-library/arabic" 
                            className="group bg-white dark:bg-slate-800 p-6 md:p-10 lg:p-12 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 border-b-8 hover:border-emerald-400 dark:hover:border-emerald-500 hover:-translate-y-2 active:border-b-4 active:translate-y-2 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-start shadow-sm"
                        >
                            <div className="w-24 h-24 md:w-28 md:h-28 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0 border-4 border-emerald-200 dark:border-emerald-800">
                                <BookIcon />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight">{t('arabicLib')}</h3>
                                <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('arabicDesc')}</p>
                            </div>
                        </Link>

                        <Link 
                            to="/digital-library/english" 
                            className="group bg-white dark:bg-slate-800 p-6 md:p-10 lg:p-12 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 border-b-8 hover:border-sky-400 dark:hover:border-sky-500 hover:-translate-y-2 active:border-b-4 active:translate-y-2 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-start shadow-sm"
                        >
                            <div className="w-24 h-24 md:w-28 md:h-28 bg-sky-100 dark:bg-sky-900/30 text-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0 border-4 border-sky-200 dark:border-sky-800">
                                <GlobeIcon />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight">{t('englishLib')}</h3>
                                <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('englishDesc')}</p>
                            </div>
                        </Link>

                    </div>

                    {/* صقر مع الشعار الذكي خلفه */}
                    <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 relative z-[30]">
                        <div onClick={handleMascotInteraction} className={`relative cursor-pointer transition-transform duration-300 w-full flex justify-center items-center ${isMascotClicked ? 'scale-95' : 'hover:scale-105'}`}>
                            
                            {/* شعار المدرسة الباهت (يتحول للأبيض في الدارك مود) */}
                            <img 
                                src="/school-logo.png" 
                                alt="EFIPS Seal" 
                                className="absolute inset-0 m-auto w-[110%] h-[110%] object-contain rotate-12 opacity-10 dark:opacity-20 dark:invert -z-10 pointer-events-none transition-all duration-1000" 
                            />

                            {/* كروت الإلهام الطائرة */}
                            {bursts.map((burst) => (
                                <div key={burst.id} 
                                    className="absolute z-[100] bg-white dark:bg-slate-800 px-6 py-3 md:px-8 md:py-4 rounded-[2rem] border-4 border-slate-200 dark:border-slate-700 shadow-md animate-burst-steady pointer-events-none flex items-center gap-3 md:gap-4"
                                    style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                    <span className={`${burst.item.color}`}>{burst.item.icon}</span>
                                    <span className="text-sm md:text-xl font-black text-slate-800 dark:text-slate-200 whitespace-nowrap">{isAr ? burst.item.textAr : burst.item.textEn}</span>
                                </div>
                            ))}

                            <img src="/saqr-digital.png" alt="Saqr Mascot" className="h-64 md:h-[450px] lg:h-[550px] object-contain drop-shadow-2xl relative z-10 animate-float" />
                            
                            {/* فقاعة المحادثة */}
                            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-white dark:bg-slate-800 p-4 md:p-6 lg:p-8 rounded-[2rem] md:rounded-[3rem] rounded-br-none border-4 border-rose-400 shadow-lg text-sm md:text-2xl font-black text-rose-500 animate-bounce z-20">
                                {t('bubble')}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
                
                @keyframes burst-steady {
                  0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
                  20% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; }
                  80% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
                  100% { transform: translate(var(--tx), calc(var(--ty) - 30px)) scale(0.8) rotate(var(--rot)); opacity: 0; }
                }
                .animate-burst-steady { animation: burst-steady 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                
                @keyframes fade-in-up {
                  0% { opacity: 0; transform: translateY(20px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default DigitalLibraryPage;
