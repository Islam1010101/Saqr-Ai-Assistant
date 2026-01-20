import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "مستقبل المعرفة في صقر الإمارات",
        subWelcome: "بوابتك الذكية للوصول إلى كنوز المعرفة الرقمية والورقية بأسلوب عصري.",
        manualSearch: "البحث اليدوي",
        manualDesc: "ابحث عن الكتب المطبوعة في مكتبة المدرسة عبر رقم الرف أو العنوان.",
        smartSearch: "اسأل صقر (AI)",
        smartDesc: "مساعدك الذكي الذي يحلل استفساراتك ويقترح عليك أفضل المصادر الرقمية.",
        digitalLibrary: "المكتبة الإلكترونية",
        digitalDesc: "تصفح وحمل مئات الروايات والكتب الرقمية العالمية في أي وقت.",
        bubble: "المسني للإلهام!"
    },
    en: {
        welcome: "Future of Knowledge at E.F.I.P.S",
        subWelcome: "Your smart gateway to access digital and physical knowledge resources.",
        manualSearch: "Manual Search",
        manualDesc: "Find physical books in the School's Library by shelf number or title.",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Your smart assistant that analyzes queries and suggests best digital resources.",
        digitalLibrary: "Digital Library",
        digitalDesc: "Browse and download hundreds of global digital novels and books.",
        bubble: "Touch for inspiration!"
    }
};

const KNOWLEDGE_CARDS = [
    { icon: "📜", textAr: "بحث رقمي", textEn: "Digital Research" },
    { icon: "💡", textAr: "فكرة مبتكرة", textEn: "Innovative Idea" },
    { icon: "🤖", textAr: "ذكاء صقر", textEn: "Saqr AI" },
    { icon: "📚", textAr: "مصادر المعرفة", textEn: "Knowledge Sources" },
    { icon: "🇦🇪", textAr: "هوية وطنية", textEn: "UAE Identity" },
    { icon: "🚀", textAr: "طموح 2026", textEn: "2026 Ambition" },
    { icon: "✨", textAr: "إبداع بلا حدود", textEn: "Limitless Creativity" }
];

interface BurstItem {
    id: number;
    tx: number;
    ty: number;
    rot: number;
    item: typeof KNOWLEDGE_CARDS[0];
}

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

    const handleMascotInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);

        // توليد 3 كروت في آن واحد لزيادة التأثير البصري
        const newBursts: BurstItem[] = Array.from({ length: 3 }).map((_, i) => ({
            id: Date.now() + i,
            item: KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)],
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 150 : 350), // انتشار أوسع
            ty: -80 - Math.random() * 200,
            rot: (Math.random() - 0.5) * 40
        }));

        setBursts(prev => [...prev, ...newBursts]);
        
        // إزالة الكروت بعد 5 ثوانٍ كاملة
        newBursts.forEach(b => {
            setTimeout(() => {
                setBursts(current => current.filter(item => item.id !== b.id));
            }, 5000);
        });

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.1;
        audio.play().catch(() => {});
    }, []);

    const handleButtonMouseMove = (e: React.MouseEvent, text: string) => {
        if (window.innerWidth > 768) {
            setTooltip({ text, x: e.clientX, y: e.clientY - 40 });
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center p-2 md:p-6 overflow-hidden select-none animate-fade-up font-black">
            
            {/* الهنت العائم للديسكتوب والتابلت */}
            {tooltip && (
                <div className="fixed pointer-events-none z-[200] glass-panel px-6 py-3 rounded-2xl border-red-600/30 shadow-[0_0_30px_rgba(220,38,38,0.2)] animate-in fade-in zoom-in duration-300" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{tooltip.text}</p>
                </div>
            )}

            {/* الكارت الرئيسي الملكي */}
            <div className="relative z-10 glass-panel w-full max-w-7xl rounded-[3rem] md:rounded-[6rem] overflow-hidden shadow-2xl dark:shadow-red-900/10 border-none bg-white/80 dark:bg-slate-950/70 backdrop-blur-3xl transition-all duration-700">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 p-8 md:p-24 items-center">
                    
                    {/* الجانب الأول: النصوص والأزرار */}
                    <div className="flex flex-col text-center lg:text-start space-y-10 md:space-y-16 order-2 lg:order-1 relative z-20">
                        <div className="space-y-4 md:space-y-10">
                            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter drop-shadow-sm">
                                {t('welcome')}
                            </h1>
                            <p className="text-lg md:text-3xl text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed opacity-90 italic">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 md:gap-8">
                            <Link to="/search" onMouseMove={(e) => handleButtonMouseMove(e, t('manualDesc'))} onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-red-600 dark:hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] py-5 md:py-8 px-8 md:px-14 text-lg md:text-3xl font-black rounded-[2rem] md:rounded-[3rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95 text-center flex items-center justify-center gap-4">
                                🔍 {t('manualSearch')}
                            </Link>
                            
                            <Link to="/smart-search" onMouseMove={(e) => handleButtonMouseMove(e, t('smartDesc'))} onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-green-600 dark:hover:border-green-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] py-5 md:py-8 px-8 md:px-14 text-lg md:text-3xl font-black rounded-[2rem] md:rounded-[3rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95 text-center flex items-center justify-center gap-4">
                                🤖 {t('smartSearch')}
                            </Link>

                            <Link to="/digital-library" onMouseMove={(e) => handleButtonMouseMove(e, t('digitalDesc'))} onMouseLeave={() => setTooltip(null)}
                                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-6 md:py-8 px-10 md:px-20 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-500 text-center text-lg md:text-3xl">
                                {t('digitalLibrary')}
                            </Link>
                        </div>
                    </div>

                    {/* الجانب الثاني: الشخصية والانفجار */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2 px-6 md:px-0">
                        <div onMouseDown={handleMascotInteraction} onTouchStart={handleMascotInteraction}
                            className={`relative group cursor-pointer touch-manipulation flex items-center justify-center w-full max-w-[300px] md:max-w-[600px] transition-transform duration-500 ${isMascotClicked ? 'scale-110' : 'hover:scale-105'}`}>
                            
                            {/* الشعار الوطني بتوهج ملكي */}
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                                <img src="/school-logo.png" alt="Seal" className="h-[150%] w-[150%] object-contain opacity-[0.06] dark:opacity-[0.15] blur-[2px] logo-white-filter rotate-12 animate-pulse" />
                            </div>

                            {/* رندر كروت الانفجار المتعددة (5 ثوانٍ) */}
                            {bursts.map((burst) => (
                                <div key={burst.id}
                                    className="absolute z-[100] glass-panel px-6 md:px-12 py-4 md:py-6 rounded-[2rem] md:rounded-[3.5rem] flex items-center gap-4 md:gap-8 border-red-500/50 shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-burst-long pointer-events-none"
                                    style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                    <span className="text-4xl md:text-8xl">{burst.item.icon}</span>
                                    <span className="text-xs md:text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tighter whitespace-nowrap">
                                        {isAr ? burst.item.textAr : burst.item.textEn}
                                    </span>
                                </div>
                            ))}

                            <img src="/saqr-full.png" alt="Saqr" className="h-56 sm:h-80 md:h-[700px] object-contain drop-shadow-[0_50px_100px_rgba(220,38,38,0.3)] dark:drop-shadow-[0_0_80px_rgba(255,255,255,0.05)] relative z-10 animate-float" />
                            
                            <div className="absolute -top-10 md:-top-16 -right-10 md:-right-20 glass-panel p-5 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-3xl border-red-500/30 text-xs md:text-4xl font-black text-red-600 dark:text-white animate-bounce z-20 backdrop-blur-2xl">
                                {t('bubble')}
                                <div className="absolute -bottom-3 md:-bottom-5 left-10 md:left-20 w-6 md:w-12 h-6 md:h-12 glass-panel rotate-45 bg-inherit border-r-4 border-b-4 border-red-500/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes burst-long {
                    0% { transform: translate(0, 0) scale(0.3) rotate(0deg); opacity: 0; filter: blur(20px); }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; filter: blur(0px); }
                    85% { transform: translate(calc(var(--tx) * 1.1), calc(var(--ty) * 1.1)) scale(1); opacity: 1; filter: blur(0px); }
                    100% { transform: translate(calc(var(--tx) * 1.2), calc(var(--ty) - 100px)) scale(1.3) rotate(calc(var(--rot) * 2)); opacity: 0; filter: blur(40px); }
                }
                .animate-burst-long {
                    animation: burst-long 5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(3deg); }
                }
            `}</style>
        </div>
    );
};

export default HomePage;
