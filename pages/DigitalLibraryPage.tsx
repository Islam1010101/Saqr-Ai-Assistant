import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';

const READING_INSPIRATIONS = [
    { icon: "📖", textAr: "اقرأ لترتقي", textEn: "Read to Rise" },
    { icon: "✨", textAr: "مغامرة في كل صفحة", textEn: "Adventure in every page" },
    { icon: "🧠", textAr: "المعرفة قوة", textEn: "Knowledge is Power" },
    { icon: "🚀", textAr: "سافر عبر الكلمات", textEn: "Travel through Words" },
    { icon: "💡", textAr: "نور العقل", textEn: "Light of the Mind" },
    { icon: "💖", textAr: "أحب القراءة", textEn: "I Love Reading" }
];

const translations = {
    ar: {
        title: "المكتبة الرقمية",
        desc: "المكتبة في كفّ يدك.. تبني اليومَ فِكْرَ غدِك بأسلوب عصري فريد.",
        arabicLib: "المكتبة العربية",
        englishLib: "المكتبة الإنجليزية",
        arabicDesc: "روائع الأدب العربي، التراث، وتطوير الذات.",
        englishDesc: "أحدث الروايات العالمية، القصص، والألغاز.",
        bubble: "المسني للإلهام!"
    },
    en: {
        title: "Digital Library",
        desc: "The library held in your hand, building a mind so grand and modern.",
        arabicLib: "Arabic Library",
        englishLib: "English Library",
        arabicDesc: "Arabic literature, heritage, and self-dev.",
        englishDesc: "Global novels, stories, and puzzles.",
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
    const navigate = useNavigate();
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
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 120 : 300),
            ty: -100 - Math.random() * 120,
            rot: (Math.random() - 0.5) * 40
        };

        setBursts(prev => [...prev, newBurst]);
        setTimeout(() => {
            setBursts(current => current.filter(b => b.id !== id));
        }, 5000);

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05; audio.play().catch(() => {});
    }, []);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center gap-12 md:gap-24 animate-fade-up font-black antialiased relative">
            
            {/* 1. قسم الترحيب العلوي */}
            <div className="text-center space-y-6 md:space-y-10 max-w-5xl relative z-20">
                <h1 className="text-5xl md:text-[9rem] font-black text-slate-950 dark:text-white tracking-tighter leading-none drop-shadow-2xl">
                    {t('title')}
                </h1>
                <p className="text-lg md:text-4xl text-slate-600 dark:text-slate-400 font-bold opacity-80 leading-relaxed italic max-w-3xl mx-auto">
                    {t('desc')}
                </p>
                <div className="h-2 w-40 md:w-80 bg-red-600 mx-auto rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse"></div>
            </div>

            {/* 2. مركز العمليات الرقمي */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-center">
                
                {/* الكروت الزجاجية */}
                <div className="lg:col-span-7 flex flex-col gap-6 md:gap-10 order-2 lg:order-1">
                    <Link to="/digital-library/arabic" className="group glass-panel p-8 md:p-14 rounded-[3rem] md:rounded-[4.5rem] border-2 border-green-600/20 hover:border-green-600 transition-all duration-700 shadow-2xl hover:shadow-green-600/20 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="text-6xl md:text-[7rem] group-hover:scale-110 transition-transform duration-500">📖</div>
                        <div className="text-center md:text-start flex-1">
                            <h3 className="text-2xl md:text-6xl text-slate-950 dark:text-white tracking-tight">{t('arabicLib')}</h3>
                            <p className="text-sm md:text-2xl text-slate-500 dark:text-slate-400 font-bold opacity-80">{t('arabicDesc')}</p>
                        </div>
                    </Link>

                    <Link to="/digital-library/english" className="group glass-panel p-8 md:p-14 rounded-[3rem] md:rounded-[4.5rem] border-2 border-red-600/20 hover:border-red-600 transition-all duration-700 shadow-2xl hover:shadow-red-600/20 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="text-6xl md:text-[7rem] group-hover:scale-110 transition-transform duration-500">🌍</div>
                        <div className="text-center md:text-start flex-1">
                            <h3 className="text-2xl md:text-6xl text-slate-950 dark:text-white tracking-tight">{t('englishLib')}</h3>
                            <p className="text-sm md:text-2xl text-slate-500 dark:text-slate-400 font-bold opacity-80">{t('englishDesc')}</p>
                        </div>
                    </Link>
                </div>

                {/* صقر مع الشعار الذكي خلفه */}
                <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 relative z-[30]">
                    <div onClick={handleMascotInteraction} className={`relative cursor-pointer transition-transform duration-500 ${isMascotClicked ? 'scale-110' : 'hover:scale-105'}`}>
                        
                        {/* شعار المدرسة الذكي */}
                        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none transition-all duration-1000">
                            <img 
                                src="/school-logo.png" 
                                alt="Seal" 
                                className="w-[130%] h-[130%] object-contain rotate-12 blur-[1px] opacity-10 dark:opacity-20 logo-smart-filter" 
                            />
                        </div>

                        {/* كروت الانفجار الذكية - تظهر فوق كل شيء */}
                        {bursts.map((burst) => (
                            <div key={burst.id} 
                                className="absolute z-[100] bg-white dark:bg-slate-900 px-6 py-3 md:px-10 md:py-5 rounded-[2rem] border-4 border-red-600/30 shadow-[0_30px_60px_rgba(0,0,0,0.3)] animate-burst-long pointer-events-none flex items-center gap-4"
                                style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                <span className="text-2xl md:text-6xl">{burst.item.icon}</span>
                                <span className="text-xs md:text-3xl font-black text-slate-950 dark:text-white uppercase whitespace-nowrap">{isAr ? burst.item.textAr : burst.item.textEn}</span>
                            </div>
                        ))}

                        <img src="/saqr-digital.png" alt="Saqr Digital" className="h-64 md:h-[650px] object-contain drop-shadow-[0_40px_80px_rgba(220,38,38,0.2)] animate-float" />
                        
                        <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12 glass-panel p-4 md:p-10 rounded-[2.5rem] md:rounded-[4.5rem] shadow-3xl border-red-500/30 text-xs md:text-3xl font-black text-red-600 dark:text-white animate-bounce z-20 backdrop-blur-3xl">
                            {t('bubble')}
                            <div className="absolute -bottom-2 md:-bottom-5 left-8 md:left-16 w-5 h-5 md:w-10 md:h-10 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-red-500/20"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes burst-long {
                    0% { transform: translate(0, 0) scale(0.4) rotate(0deg); opacity: 0; filter: blur(10px); }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; filter: blur(0px); }
                    85% { transform: translate(calc(var(--tx) * 1.05), calc(var(--ty) * 1.05)) scale(1); opacity: 1; filter: blur(0px); }
                    100% { transform: translate(calc(var(--tx) * 1.1), calc(var(--ty) - 50px)) scale(1.3) rotate(calc(var(--rot) * 1.5)); opacity: 0; filter: blur(40px); }
                }
                .animate-burst-long { animation: burst-long 5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                .glass-panel { backdrop-filter: blur(50px); background: rgba(255, 255, 255, 0.05); }
                
                /* تفعيل الفلتر الأبيض فقط في الدارك مود */
                .dark .logo-smart-filter { filter: brightness(0) invert(1); }
            `}</style>
        </div>
    );
};

export default DigitalLibraryPage;
