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
    { icon: "🚀", textAr: "طموح 2026", textEn: "2026 Ambition" }
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

        const id = Date.now();
        const randomItem = KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)];
        
        // حساب إحداثيات انتشار عشوائية (انفجار باتجاهات مختلفة)
        const newBurst: BurstItem = {
            id,
            item: randomItem,
            tx: (Math.random() - 0.5) * 200, // انتشار أفقي
            ty: -100 - Math.random() * 150, // طيران للأعلى
            rot: (Math.random() - 0.5) * 45 // دوران عشوائي
        };

        setBursts(prev => [...prev, newBurst]);
        
        // إزالة الكارت بعد انتهاء تأثير التبخر
        setTimeout(() => {
            setBursts(current => current.filter(b => b.id !== id));
        }, 1800);

        // صوت ومضة خفيف لتعزيز التفاعل
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
        <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center p-2 md:p-6 overflow-hidden select-none animate-fade-up">
            
            {/* الهنت العائم للديسكتوب */}
            {tooltip && (
                <div 
                    className="fixed pointer-events-none z-[200] glass-panel px-5 py-2 rounded-2xl border-white/40 shadow-2xl animate-in fade-in zoom-in duration-300"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
                >
                    <p className="text-[10px] font-black text-slate-900 dark:text-white whitespace-nowrap uppercase tracking-widest">{tooltip.text}</p>
                </div>
            )}

            {/* الكارت الرئيسي الملكي - بدون حواف خارجية (Zero Border) */}
            <div className="relative z-10 glass-panel w-full max-w-7xl rounded-[3rem] md:rounded-[6rem] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.15)] dark:shadow-red-900/20 border border-white/10 dark:border-white/5 bg-white/80 dark:bg-slate-950/60 backdrop-blur-3xl transition-all duration-700">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 p-6 md:p-24 items-center">
                    
                    {/* الجانب الأول: النصوص والأزرار (تفاعلية الجوال) */}
                    <div className="flex flex-col text-center lg:text-start space-y-8 md:space-y-12 order-2 lg:order-1 relative z-20">
                        <div className="space-y-4 md:space-y-8">
                            <h1 className="text-3xl md:text-6xl lg:text-8xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter drop-shadow-sm">
                                {t('welcome')}
                            </h1>
                            <p className="text-base md:text-2xl text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed opacity-90 italic">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
                            <Link 
                                to="/search" 
                                onMouseMove={(e) => handleButtonMouseMove(e, t('manualDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-red-600 dark:hover:border-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] py-5 md:py-8 px-6 md:px-12 text-base md:text-2xl font-black rounded-[2rem] md:rounded-[3rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95 text-center flex items-center justify-center gap-3"
                            >
                                🔍 {t('manualSearch')}
                            </Link>
                            
                            <Link 
                                to="/smart-search" 
                                onMouseMove={(e) => handleButtonMouseMove(e, t('smartDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-green-600 dark:hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] py-5 md:py-8 px-6 md:px-12 text-base md:text-2xl font-black rounded-[2rem] md:rounded-[3rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95 text-center flex items-center justify-center gap-3"
                            >
                                🤖 {t('smartSearch')}
                            </Link>

                            <Link 
                                to="/digital-library" 
                                onMouseMove={(e) => handleButtonMouseMove(e, t('digitalDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-5 md:py-8 px-10 md:px-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-500 text-center text-base md:text-2xl"
                            >
                                {t('digitalLibrary')}
                            </Link>
                        </div>
                    </div>

                    {/* الجانب الثاني: الشخصية مع تأثير الانفجار المعرفي المتعدد */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2 px-6 md:px-0">
                        <div 
                            onMouseDown={handleMascotInteraction}
                            onTouchStart={handleMascotInteraction}
                            className={`relative group cursor-pointer touch-manipulation flex items-center justify-center w-full max-w-[280px] md:max-w-[550px] transition-transform duration-500 ${isMascotClicked ? 'scale-110 rotate-2' : 'hover:scale-105'}`}
                        >
                            {/* الشعار الوطني في الخلفية بتوهج نيون */}
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                                <img 
                                    src="/school-logo.png" 
                                    alt="Seal" 
                                    className="h-[140%] w-[140%] object-contain opacity-[0.08] dark:opacity-[0.15] blur-[1px] logo-white-filter rotate-12 animate-pulse" 
                                />
                            </div>

                            {/* رندر كروت الانفجار المتعددة */}
                            {bursts.map((burst) => (
                                <div
                                    key={burst.id}
                                    className="absolute z-[100] glass-panel px-5 md:px-10 py-3 md:py-5 rounded-2xl md:rounded-[3rem] flex items-center gap-3 md:gap-6 border-red-500/40 dark:shadow-[0_0_40px_rgba(220,38,38,0.4)] shadow-2xl animate-burst pointer-events-none"
                                    style={{ 
                                        '--tx': `${burst.tx}px`, 
                                        '--ty': `${burst.ty}px`,
                                        '--rot': `${burst.rot}deg` 
                                    } as any}
                                >
                                    <span className="text-3xl md:text-7xl">{burst.item.icon}</span>
                                    <span className="text-[10px] md:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter whitespace-nowrap">
                                        {isAr ? burst.item.textAr : burst.item.textEn}
                                    </span>
                                </div>
                            ))}

                            <img 
                                src="/saqr-full.png" 
                                alt="Saqr" 
                                className="h-52 sm:h-72 md:h-[650px] object-contain drop-shadow-[0_40px_80px_rgba(220,38,38,0.3)] dark:drop-shadow-[0_0_70px_rgba(255,255,255,0.05)] relative z-10 animate-float" 
                            />
                            
                            {/* فقاعة الإرشاد النيون */}
                            <div className="absolute -top-6 md:-top-10 -right-6 md:-right-12 glass-panel p-4 md:p-8 rounded-[2rem] md:rounded-[4rem] shadow-3xl border-red-500/30 text-[10px] md:text-2xl font-black text-red-600 dark:text-white animate-bounce z-20 backdrop-blur-2xl">
                                {t('bubble')}
                                <div className="absolute -bottom-2 md:-bottom-3 left-8 md:left-14 w-4 md:w-10 h-4 md:h-10 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-red-500/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* محرك أنميشن الانفجار المعرفي */}
            <style>{`
                @keyframes burst {
                    0% { transform: translate(0, 0) scale(0.4) rotate(0deg); opacity: 0; filter: blur(10px); }
                    15% { opacity: 1; filter: blur(0px); }
                    100% { transform: translate(var(--tx), var(--ty)) scale(1.3) rotate(var(--rot)); opacity: 0; filter: blur(30px); }
                }
                .animate-burst {
                    animation: burst 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
            `}</style>
        </div>
    );
};

export default HomePage;
