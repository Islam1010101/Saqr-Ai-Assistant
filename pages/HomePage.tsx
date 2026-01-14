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
        welcome: "Future of Knowledge at Saqr School",
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
    
    // حالة الهنت العائم مع الإحداثيات
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

    // تحديث موقع الهنت العائم
    const handleButtonMouseMove = (e: React.MouseEvent, text: string) => {
        setTooltip({
            text,
            x: e.clientX,
            y: e.clientY - 40 // يظهر فوق المؤشر بـ 40 بكسل
        });
    };

    return (
        <div className="relative h-[calc(100vh-140px)] flex items-center justify-center p-4 overflow-hidden select-none animate-fade-up">
            
            {/* الهنت العائم - يظهر فوق الماوس ويتلاشى */}
            {tooltip && (
                <div 
                    className="fixed pointer-events-none z-[200] glass-panel px-4 py-2 rounded-xl border-white/40 shadow-2xl animate-in fade-in zoom-in duration-300"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
                >
                    <p className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap">
                        {tooltip.text}
                    </p>
                </div>
            )}

            <div className="relative z-10 glass-panel w-full max-w-6xl h-fit md:min-h-[65vh] rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.2)] border-2 border-white/40 dark:border-white/5">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full p-10 md:p-20 items-center relative z-10">
                    
                    <div className="flex flex-col text-start space-y-10 order-2 lg:order-1 relative z-20">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter">
                                {t('welcome')}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold max-w-md leading-relaxed opacity-80">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-5">
                            {/* 1. البحث اليدوي */}
                            <Link 
                                to="/search" 
                                onMouseMove={(e) => handleButtonMouseMove(e, t('manualDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] py-5 px-8 text-lg font-black rounded-[2rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95"
                            >
                                {t('manualSearch')}
                            </Link>
                            
                            {/* 2. اسأل صقر AI */}
                            <Link 
                                to="/smart-search" 
                                onMouseMove={(e) => handleButtonMouseMove(e, t('smartDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-green-600 hover:shadow-[0_0_25px_rgba(0,115,47,0.4)] py-5 px-8 text-lg font-black rounded-[2rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95"
                            >
                                {t('smartSearch')}
                            </Link>

                            {/* 3. المكتبة الرقمية - تم حذف الأيقونة بطلبك */}
                            <Link 
                                to="/digital-library" 
                                onMouseMove={(e) => handleButtonMouseMove(e, t('digitalDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-5 px-12 rounded-[2rem] shadow-2xl hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
                            >
                                <span className="text-lg">{t('digitalLibrary')}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center order-1 lg:order-2">
                        <div 
                            onMouseDown={handleMascotInteraction}
                            onTouchStart={handleMascotInteraction}
                            className={`relative group cursor-pointer touch-manipulation flex items-center justify-center w-full max-w-[500px] transition-transform duration-300 ${isMascotClicked ? 'scale-110 rotate-2' : 'hover:scale-105'}`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                                <img 
                                    src="/school-logo.png" 
                                    alt="Seal" 
                                    className="h-[120%] w-[120%] object-contain opacity-[0.07] dark:opacity-[0.12] blur-[2px] logo-white-filter" 
                                />
                            </div>

                            {burstCard && (
                                <div
                                    key={burstCard.id}
                                    className="absolute z-[100] glass-panel px-6 py-3 rounded-2xl flex items-center gap-3 border-red-500/40 shadow-2xl animate-burst"
                                    style={{ '--tx': burstCard.tx, '--ty': burstCard.ty } as any}
                                >
                                    <span className="text-3xl">{burstCard.item.icon}</span>
                                    <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-widest whitespace-nowrap">
                                        {isAr ? burstCard.item.textAr : burstCard.item.textEn}
                                    </span>
                                </div>
                            )}

                            {/* الشخصية تحافظ على التباين والألوان عند الضغط (تم إزالة brightness-125) */}
                            <img 
                                src="/saqr-full.png" 
                                alt="Saqr" 
                                className="h-64 md:h-[520px] object-contain drop-shadow-[0_40px_70px_rgba(220,38,38,0.3)] relative z-10 transition-all" 
                            />
                            
                            <div className="absolute -top-6 -right-6 md:top-4 md:right-4 glass-panel p-5 rounded-[2.5rem] shadow-2xl border-white/40 text-xs md:text-sm font-black text-red-700 dark:text-white animate-bounce z-20">
                                {t('bubble')}
                                <div className="absolute -bottom-1.5 left-8 w-4 h-4 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-white/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
