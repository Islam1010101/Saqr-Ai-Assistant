import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "مستقبل المعرفة في صقر الإمارات",
        subWelcome: "بوابتك الذكية للوصول إلى كنوز المعرفة الرقمية والورقية بأسلوب عصري.",
        manualSearch: "البحث اليدوي",
        manualDesc: "ابحث عن الكتب المطبوعة في الفهرس الورقي عبر رقم الرف أو العنوان.",
        smartSearch: "اسأل صقر (AI)",
        smartDesc: "مساعدك الذكي الذي يحلل استفساراتك ويقترح عليك أفضل المصادر الرقمية.",
        digitalLibrary: "المكتبة الإلكترونية",
        digitalDesc: "تصفح وحمل مئات الروايات والكتب الرقمية العالمية في أي وقت.",
        bubble: "اضغط للإلهام!"
    },
    en: {
        welcome: "Future of Knowledge at E.F.I.P.S",
        subWelcome: "Your smart gateway to access digital and physical knowledge resources.",
        manualSearch: "Manual Search",
        manualDesc: "Find physical books in the paper index by shelf number or title.",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Your smart assistant that analyzes queries and suggests best digital resources.",
        digitalLibrary: "Digital Library",
        digitalDesc: "Browse and download hundreds of global digital novels and books.",
        bubble: "Click for an idea!"
    }
};

const KNOWLEDGE_CARDS = [
    { icon: "📜", textAr: "بحث رقمي", textEn: "Digital Research" },
    { icon: "💡", textAr: "فكرة مبتكرة", textEn: "Innovative Idea" },
    { icon: "🤖", textAr: "ذكاء صقر", textEn: "Saqr AI" },
    { icon: "📚", textAr: "مصادر المعرفة", textEn: "Knowledge Sources" }
];

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [burstCard, setBurstCard] = useState<{ id: number, tx: string, ty: string, item: typeof KNOWLEDGE_CARDS[0] } | null>(null);
    const [isMascotClicked, setIsMascotClicked] = useState(false);
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

    const handleMascotInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 500);

        const randomItem = KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)];
        setBurstCard({
            id: Date.now(),
            item: randomItem,
            tx: `${(Math.random() - 0.5) * 60}px`,
            ty: `-160px`
        });
        setTimeout(() => setBurstCard(null), 1500);
    }, []);

    const handleButtonMouseMove = (e: React.MouseEvent, text: string) => {
        // تعطيل الهنت على الجوال لتجنب التداخل البصري
        if (window.innerWidth > 768) {
            setTooltip({ text, x: e.clientX, y: e.clientY - 40 });
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-160px)] flex items-center justify-center p-4 md:p-6 overflow-hidden select-none animate-fade-up">
            
            {/* الهنت العائم (يظهر فقط على الماوس) */}
            {tooltip && (
                <div 
                    className="fixed pointer-events-none z-[200] glass-panel px-4 py-2 rounded-xl border-white/40 shadow-2xl animate-in fade-in zoom-in duration-300"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
                >
                    <p className="text-[10px] font-black text-slate-900 dark:text-white whitespace-nowrap uppercase tracking-widest">{tooltip.text}</p>
                </div>
            )}

            {/* الكارت الرئيسي الاستجابة - Zero Border */}
            <div className="relative z-10 glass-panel w-full max-w-6xl rounded-[2.5rem] md:rounded-[4.5rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.12)] border-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl transition-all duration-500">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 p-8 md:p-20 items-center relative z-10">
                    
                    {/* النصوص والأزرار */}
                    <div className="flex flex-col text-center lg:text-start space-y-8 md:space-y-10 order-2 lg:order-1 relative z-20">
                        <div className="space-y-4 md:space-y-6">
                            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-950 dark:text-white leading-[1.2] lg:leading-[1.1] tracking-tighter">
                                {t('welcome')}
                            </h1>
                            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 font-bold max-w-md mx-auto lg:mx-0 leading-relaxed opacity-80">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 md:gap-5">
                            <Link 
                                to="/search" 
                                onMouseMove={(e) => handleButtonMouseMove(e, t('manualDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] py-4 md:py-5 px-6 md:px-8 text-base md:text-lg font-black rounded-[1.5rem] md:rounded-[2rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95 text-center"
                            >
                                {t('manualSearch')}
                            </Link>
                            
                            <Link 
                                to="/smart-search" 
                                onMouseMove={(e) => handleButtonMouseMove(e, t('smartDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-green-600 hover:shadow-[0_0_25px_rgba(0,115,47,0.4)] py-4 md:py-5 px-6 md:px-8 text-base md:text-lg font-black rounded-[1.5rem] md:rounded-[2rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95 text-center"
                            >
                                {t('smartSearch')}
                            </Link>

                            <Link 
                                to="/digital-library" 
                                onMouseMove={(e) => handleButtonMouseMove(e, t('digitalDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-4 md:py-5 px-8 md:px-12 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 text-center"
                            >
                                <span className="text-base md:text-lg">{t('digitalLibrary')}</span>
                            </Link>
                        </div>
                    </div>

                    {/* منطقة الشخصية والشعار */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2 px-4">
                        <div 
                            onMouseDown={handleMascotInteraction}
                            onTouchStart={handleMascotInteraction}
                            className={`relative group cursor-pointer touch-manipulation flex items-center justify-center w-full max-w-[300px] md:max-w-[500px] transition-transform duration-300 ${isMascotClicked ? 'scale-110 rotate-2' : 'hover:scale-105'}`}
                        >
                            {/* الشعار الوطني مائل لليمين */}
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                                <img 
                                    src="/school-logo.png" 
                                    alt="Seal" 
                                    className="h-[130%] w-[130%] object-contain opacity-[0.06] dark:opacity-[0.1] blur-[1px] logo-white-filter rotate-12" 
                                />
                            </div>

                            {/* كروت الإنفجار المعرفي */}
                            {burstCard && (
                                <div
                                    key={burstCard.id}
                                    className="absolute z-[100] glass-panel px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 border-red-500/40 shadow-2xl animate-burst"
                                    style={{ '--tx': burstCard.tx, '--ty': burstCard.ty } as any}
                                >
                                    <span className="text-2xl md:text-3xl">{burstCard.item.icon}</span>
                                    <span className="text-[9px] md:text-xs font-black text-slate-950 dark:text-white uppercase tracking-widest whitespace-nowrap">
                                        {isAr ? burstCard.item.textAr : burstCard.item.textEn}
                                    </span>
                                </div>
                            )}

                            <img 
                                src="/saqr-full.png" 
                                alt="Saqr" 
                                className="h-48 sm:h-64 md:h-[520px] object-contain drop-shadow-[0_40px_70px_rgba(220,38,38,0.2)] relative z-10 transition-all" 
                            />
                            
                            {/* فقاعة الضغط */}
                            <div className="absolute -top-4 md:-top-6 -right-4 md:-right-6 glass-panel p-3 md:p-5 rounded-2xl md:rounded-[2.5rem] shadow-2xl border-white/40 text-[9px] md:text-sm font-black text-red-700 dark:text-white animate-bounce z-20">
                                {t('bubble')}
                                <div className="absolute -bottom-1.5 left-6 md:left-8 w-3 md:w-4 h-3 md:h-4 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-white/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
