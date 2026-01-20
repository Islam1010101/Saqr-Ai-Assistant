import React, { useState, useCallback, useEffect } from 'react';
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
        bubble: "اضغط للإلهام!",
        visitorsLabel: "إجمالي التفاعل مع البوابة"
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
        bubble: "Touch for inspiration!",
        visitorsLabel: "Total Portal Engagement"
    }
};

const KNOWLEDGE_CARDS = [
    { icon: "📜", textAr: "بحث رقمي", textEn: "Digital Research" },
    { icon: "💡", textAr: "فكرة مبتكرة", textEn: "Innovative Idea" },
    { icon: "🤖", textAr: "ذكاء صقر", textEn: "Saqr AI" },
    { icon: "📚", textAr: "مصادر المعرفة", textEn: "Knowledge Sources" },
    { icon: "🇦🇪", textAr: "هوية وطنية", textEn: "UAE Identity" },
    { icon: "🚀", textAr: "طموح 2026", textEn: "2026 Ambition" }
];

interface BurstItem {
    id: number; tx: number; ty: number; rot: number; item: typeof KNOWLEDGE_CARDS[0];
}

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);
    
    // --- منطق عداد الزوار النيون ---
    const [visitorCount, setVisitorCount] = useState(0);
    useEffect(() => {
        const storedCount = parseInt(localStorage.getItem('efips_total_visitors') || '1240');
        const newCount = storedCount + 1;
        localStorage.setItem('efips_total_visitors', newCount.toString());
        
        // تأثير عداد تصاعدي (Animated Counter)
        let start = 0;
        const end = newCount;
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setVisitorCount(end);
                clearInterval(timer);
            } else {
                setVisitorCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, []);

    const handleMascotInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);
        const id = Date.now();
        const newBursts: BurstItem[] = Array.from({ length: 2 }).map((_, i) => ({
            id: Date.now() + i,
            item: KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)],
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 100 : 300), 
            ty: -60 - Math.random() * 140,
            rot: (Math.random() - 0.5) * 30
        }));
        setBursts(prev => [...prev, ...newBursts]);
        newBursts.forEach(b => {
            setTimeout(() => { setBursts(current => current.filter(item => item.id !== b.id)); }, 5000);
        });
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.08; audio.play().catch(() => {});
    }, []);

    const handleButtonMouseMove = (e: React.MouseEvent, text: string) => {
        if (window.innerWidth > 768) setTooltip({ text, x: e.clientX, y: e.clientY - 40 });
    };

    return (
        <div className="relative min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-2 md:p-6 overflow-hidden select-none animate-fade-up font-black antialiased">
            
            {/* الهنت العائم للديسكتوب */}
            {tooltip && (
                <div className="fixed pointer-events-none z-[200] glass-panel px-5 py-2 rounded-2xl border-red-600/30 shadow-2xl animate-in fade-in zoom-in duration-300" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}>
                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{tooltip.text}</p>
                </div>
            )}

            {/* الحاوية الرئيسية الملكية */}
            <div className="relative z-10 glass-panel w-full max-w-7xl rounded-[3rem] md:rounded-[6rem] overflow-hidden shadow-2xl dark:shadow-red-900/10 border-none bg-white/80 dark:bg-slate-950/70 backdrop-blur-3xl transition-all duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 p-6 md:p-24 items-center">
                    
                    <div className="flex flex-col text-center lg:text-start space-y-8 md:space-y-16 order-2 lg:order-1 relative z-20">
                        <div className="space-y-3 md:space-y-8">
                            <h1 className="text-3xl md:text-7xl lg:text-8xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter drop-shadow-md">{t('welcome')}</h1>
                            <p className="text-sm md:text-3xl text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed opacity-90 italic">{t('subWelcome')}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 md:gap-6">
                            <Link to="/search" onMouseMove={(e) => handleButtonMouseMove(e, t('manualDesc'))} onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-red-600 dark:hover:border-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] py-4 md:py-8 px-6 md:px-12 text-base md:text-3xl font-black rounded-2xl md:rounded-[3rem] text-slate-900 dark:text-white transition-all active:scale-95 text-center flex items-center justify-center gap-3">🔍 {t('manualSearch')}</Link>
                            <Link to="/smart-search" onMouseMove={(e) => handleButtonMouseMove(e, t('smartDesc'))} onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-green-600 dark:hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] py-4 md:py-8 px-6 md:px-12 text-base md:text-3xl font-black rounded-2xl md:rounded-[3rem] text-slate-900 dark:text-white transition-all active:scale-95 text-center flex items-center justify-center gap-3">🤖 {t('smartSearch')}</Link>
                            <Link to="/digital-library" onMouseMove={(e) => handleButtonMouseMove(e, t('digitalDesc'))} onMouseLeave={() => setTooltip(null)}
                                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-5 md:py-8 px-8 md:px-16 rounded-2xl md:rounded-[3rem] shadow-xl hover:scale-105 active:scale-95 transition-all text-center text-base md:text-3xl">{t('digitalLibrary')}</Link>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center order-1 lg:order-2 px-4 md:px-0">
                        <div onMouseDown={handleMascotInteraction} onTouchStart={handleMascotInteraction}
                            className={`relative group cursor-pointer touch-manipulation flex items-center justify-center w-full max-w-[260px] md:max-w-[580px] transition-transform duration-500 ${isMascotClicked ? 'scale-110' : 'hover:scale-105'}`}>
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                                <img src="/school-logo.png" alt="Seal" className="h-[140%] w-[140%] object-contain opacity-[0.06] dark:opacity-[0.12] blur-[1px] logo-white-filter rotate-12" />
                            </div>

                            {bursts.map((burst) => (
                                <div key={burst.id} className="absolute z-[100] glass-panel px-3 md:px-10 py-2 md:py-5 rounded-xl md:rounded-[3rem] flex items-center gap-2 md:gap-5 border-red-500/40 shadow-2xl dark:shadow-red-500/30 animate-burst-long pointer-events-none"
                                    style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                    <span className="text-xl md:text-6xl">{burst.item.icon}</span>
                                    <span className="text-[10px] md:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter whitespace-nowrap">{isAr ? burst.item.textAr : burst.item.textEn}</span>
                                </div>
                            ))}

                            <img src="/saqr-full.png" alt="Saqr" className="h-48 sm:h-72 md:h-[650px] object-contain drop-shadow-[0_30px_60px_rgba(220,38,38,0.25)] dark:drop-shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-10 animate-float" />
                            <div className="absolute -top-4 md:-top-12 -right-4 md:-right-16 glass-panel p-3 md:p-8 rounded-2xl md:rounded-[4rem] shadow-3xl border-red-500/30 text-[10px] md:text-2xl font-black text-red-600 dark:text-white animate-bounce z-20 backdrop-blur-2xl">
                                {t('bubble')}
                                <div className="absolute -bottom-1.5 md:-bottom-4 left-6 md:left-12 w-3 md:w-8 h-3 md:h-8 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-red-500/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- عداد الزوار النيون الملكي --- */}
            <div className="mt-12 md:mt-24 relative z-10 animate-fade-up delay-700">
                <div className="glass-panel px-8 md:px-16 py-4 md:py-8 rounded-full border-2 border-green-600/30 dark:bg-slate-900/60 shadow-[0_0_40px_rgba(34,197,94,0.1)] flex flex-col md:flex-row items-center gap-2 md:gap-8 group hover:border-green-600 transition-all duration-500">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3 md:h-5 md:w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 md:h-5 md:w-5 bg-green-600"></span>
                        </span>
                        <p className="text-[10px] md:text-xl font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('visitorsLabel')}</p>
                    </div>
                    <div className="text-3xl md:text-6xl font-black text-green-700 dark:text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] tabular-nums group-hover:scale-110 transition-transform">
                        {visitorCount.toLocaleString()}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes burst-long {
                    0% { transform: translate(0, 0) scale(0.4) rotate(0deg); opacity: 0; filter: blur(10px); }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; filter: blur(0px); }
                    85% { transform: translate(calc(var(--tx) * 1.05), calc(var(--ty) * 1.05)) scale(1); opacity: 1; filter: blur(0px); }
                    100% { transform: translate(calc(var(--tx) * 1.1), calc(var(--ty) - 50px)) scale(1.2) rotate(calc(var(--rot) * 1.5)); opacity: 0; filter: blur(30px); }
                }
                .animate-burst-long { animation: burst-long 5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
            `}</style>
        </div>
    );
};

export default HomePage;
