import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
        desc: "المكتبة في كفّ يدك.. تبني اليومَ فِكْرَ غدِك.",
        arabicLib: "المكتبة العربية",
        englishLib: "المكتبة الإنجليزية",
        arabicDesc: "تضم روائع الأدب العربي، التراث، وتطوير الذات.",
        englishDesc: "تضم الروايات العالمية والألغاز.",
        bubble: "اضغط للإلهام!"
    },
    en: {
        title: "The Digital Library",
        desc: "The library held in your hand, building a mind so grand.",
        arabicLib: "Arabic Library",
        englishLib: "English Library",
        arabicDesc: "Arabic literature, heritage, and self-dev.",
        englishDesc: "Global novels and puzzles.",
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
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

    const handleMascotInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const id = Date.now();
        const randomItem = READING_INSPIRATIONS[Math.floor(Math.random() * READING_INSPIRATIONS.length)];
        
        const newBurst: BurstItem = {
            id,
            item: randomItem,
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 140 : 300),
            ty: -80 - Math.random() * 150,
            rot: (Math.random() - 0.5) * 40
        };

        setBursts(prev => [...prev, newBurst]);
        
        // إزالة الكارت بعد 5 ثوانٍ كاملة بناءً على طلبك
        setTimeout(() => {
            setBursts(current => current.filter(b => b.id !== id));
        }, 5000);

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05;
        audio.play().catch(() => {});
    }, []);

    const handleButtonMouseMove = (e: React.MouseEvent, text: string) => {
        if (window.innerWidth > 768) {
            setTooltip({ text, x: e.clientX, y: e.clientY - 40 });
        }
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 flex items-center justify-center min-h-[80vh] font-black antialiased">
            
            {/* الهنت العائم للديسكتوب */}
            {tooltip && (
                <div className="fixed pointer-events-none z-[200] glass-panel px-6 py-3 rounded-2xl border-white/40 shadow-2xl animate-in fade-in zoom-in duration-300" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}>
                    <p className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap uppercase tracking-widest">{tooltip.text}</p>
                </div>
            )}

            {/* الحاوية الملكية الكبرى */}
            <div className="relative z-10 glass-panel w-full max-w-7xl rounded-[3.5rem] md:rounded-[6rem] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.15)] dark:shadow-red-900/10 border-none bg-white/80 dark:bg-slate-950/70 backdrop-blur-3xl transition-all duration-700">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 p-8 md:p-24 items-center">
                    
                    {/* الجانب النصي والأزرار (تصميم ضخم) */}
                    <div className="flex flex-col text-center lg:text-start space-y-10 md:space-y-16 order-2 lg:order-1 relative z-20">
                        <div className="space-y-4 md:space-y-10">
                            <h1 className="text-4xl md:text-8xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter drop-shadow-sm">
                                {t('title')}
                            </h1>
                            <p className="text-lg md:text-3xl text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed opacity-90 italic">
                                {t('desc')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 md:gap-8">
                            <button 
                                onClick={() => navigate('/digital-library/arabic')}
                                onMouseMove={(e) => handleButtonMouseMove(e, t('arabicDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-green-600 dark:hover:border-green-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] py-5 md:py-8 px-8 md:px-14 text-lg md:text-3xl font-black rounded-[2rem] md:rounded-[3rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95 text-center flex items-center justify-center gap-4"
                            >
                                📖 {t('arabicLib')}
                            </button>

                            <button 
                                onClick={() => navigate('/digital-library/english')}
                                onMouseMove={(e) => handleButtonMouseMove(e, t('englishDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-red-600 dark:hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] py-5 md:py-8 px-8 md:px-14 text-lg md:text-3xl font-black rounded-[2rem] md:rounded-[3rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95 text-center flex items-center justify-center gap-4"
                            >
                                🌍 {t('englishLib')}
                            </button>
                        </div>
                    </div>

                    {/* الجانب الثاني: شخصية صقر مع نظام الإنفجار (5 ثوانٍ) */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2 px-6 md:px-0">
                        <div 
                            onMouseDown={handleMascotInteraction}
                            onTouchStart={handleMascotInteraction}
                            className="relative group cursor-pointer touch-manipulation flex items-center justify-center w-full max-w-[320px] md:max-w-[650px] transition-transform duration-500 hover:scale-105"
                        >
                            {/* الشعار المتوهج في الخلفية */}
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                                <img src="/school-logo.png" alt="Seal" className="h-[150%] w-[150%] object-contain opacity-[0.06] dark:opacity-[0.15] blur-[2px] logo-white-filter rotate-12 animate-pulse" />
                            </div>

                            {/* رندر كروت الانفجار المتعددة (5 ثوانٍ) */}
                            {bursts.map((burst) => (
                                <div key={burst.id}
                                    className="absolute z-[100] glass-panel px-6 md:px-12 py-4 md:py-6 rounded-[2rem] md:rounded-[4rem] flex items-center gap-4 md:gap-8 border-red-500/40 shadow-2xl dark:shadow-red-500/30 animate-burst-long pointer-events-none"
                                    style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                    <span className="text-4xl md:text-8xl">{burst.item.icon}</span>
                                    <span className="text-xs md:text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tighter whitespace-nowrap">
                                        {isAr ? burst.item.textAr : burst.item.textEn}
                                    </span>
                                </div>
                            ))}

                            <img src="/saqr-digital.png" alt="Saqr" className="h-64 sm:h-80 md:h-[750px] object-contain drop-shadow-[0_50px_100px_rgba(239,68,68,0.2)] dark:drop-shadow-[0_0_80px_rgba(255,255,255,0.05)] relative z-10 transition-all duration-700 group-hover:scale-[1.02]" />
                            
                            <div className="absolute -top-10 md:-top-16 -right-10 md:-right-16 glass-panel p-5 md:p-10 rounded-[2.5rem] md:rounded-[4.5rem] shadow-3xl border-red-500/30 text-xs md:text-3xl font-black text-red-600 dark:text-white animate-bounce z-20 backdrop-blur-2xl">
                                {t('bubble')}
                                <div className="absolute -bottom-3 md:-bottom-5 left-10 md:left-20 w-6 md:w-12 h-6 md:h-12 glass-panel rotate-45 bg-inherit border-r-4 border-b-4 border-red-500/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* أنميشن الـ 5 ثوانٍ والتبخر */}
            <style>{`
                @keyframes burst-long {
                    0% { transform: translate(0, 0) scale(0.3) rotate(0deg); opacity: 0; filter: blur(20px); }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; filter: blur(0px); }
                    85% { transform: translate(calc(var(--tx) * 1.05), calc(var(--ty) * 1.05)) scale(1); opacity: 1; filter: blur(0px); }
                    100% { transform: translate(calc(var(--tx) * 1.15), calc(var(--ty) - 80px)) scale(1.3) rotate(calc(var(--rot) * 1.8)); opacity: 0; filter: blur(40px); }
                }
                .animate-burst-long { animation: burst-long 5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default DigitalLibraryPage;
