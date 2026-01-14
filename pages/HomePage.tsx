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
    const [hoveredDesc, setHoveredDesc] = useState<string>("");
    const [isMascotClicked, setIsMascotClicked] = useState(false);

    // معالج التفاعل مع الشخصية
    const handleMascotInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        // تأثير النبض للشخصية
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 500);

        // إطلاق كارت المعلومة العشوائي
        const randomItem = KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)];
        setBurstCard({
            id: Date.now(),
            item: randomItem,
            tx: `${(Math.random() - 0.5) * 60}px`,
            ty: `-160px`
        });
        setTimeout(() => setBurstCard(null), 1500);
    }, []);

    return (
        <div className="relative h-[calc(100vh-140px)] flex items-center justify-center p-4 overflow-hidden select-none animate-fade-up">
            
            <div className="relative z-10 glass-panel w-full max-w-6xl h-fit md:min-h-[65vh] rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.2)] border-2 border-white/40 dark:border-white/5">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full p-10 md:p-20 items-center relative z-10">
                    
                    {/* قسم المحتوى والأزرار - الترتيب: يدوي -> صقر AI -> مكتبة */}
                    <div className="flex flex-col text-start space-y-10 order-2 lg:order-1 relative z-20">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter">
                                {t('welcome')}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold max-w-md leading-relaxed opacity-80">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-wrap gap-4">
                                {/* 1. البحث اليدوي - توهج أحمر */}
                                <Link 
                                    to="/search" 
                                    onMouseEnter={() => setHoveredDesc(t('manualDesc'))}
                                    onMouseLeave={() => setHoveredDesc("")}
                                    className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] py-5 px-8 text-lg font-black rounded-[2rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95"
                                >
                                    {t('manualSearch')}
                                </Link>
                                
                                {/* 2. اسأل صقر AI - توهج أخضر */}
                                <Link 
                                    to="/smart-search" 
                                    onMouseEnter={() => setHoveredDesc(t('smartDesc'))}
                                    onMouseLeave={() => setHoveredDesc("")}
                                    className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-green-600 hover:shadow-[0_0_25px_rgba(0,115,47,0.4)] py-5 px-8 text-lg font-black rounded-[2rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95"
                                >
                                    {t('smartSearch')}
                                </Link>

                                {/* 3. المكتبة الرقمية - الزر الرئيسي بتوهج أسود/داكن */}
                                <Link 
                                    to="/digital-library" 
                                    onMouseEnter={() => setHoveredDesc(t('digitalDesc'))}
                                    onMouseLeave={() => setHoveredDesc("")}
                                    className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-5 px-10 rounded-[2rem] flex items-center gap-4 shadow-2xl hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span className="text-lg">{t('digitalLibrary')}</span>
                                </Link>
                            </div>

                            {/* مساحة عرض تعريف الزر (Tooltip Area) */}
                            <div className={`min-h-[60px] p-4 rounded-2xl bg-slate-50/50 dark:bg-black/20 border border-dashed border-slate-200 dark:border-white/10 transition-all duration-500 ${hoveredDesc ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic">
                                    {hoveredDesc}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* قسم "صقر" مع التفاعل الحركي والشعار الخلفي */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2">
                        <div 
                            onMouseDown={handleMascotInteraction}
                            onTouchStart={handleMascotInteraction}
                            className={`relative group cursor-pointer touch-manipulation flex items-center justify-center w-full max-w-[500px] transition-transform duration-300 ${isMascotClicked ? 'scale-110 rotate-3' : 'hover:scale-105'}`}
                        >
                            {/* الشعار الوطني (الهالة الخلفية) */}
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none transition-transform duration-1000 group-hover:rotate-12">
                                <img 
                                    src="/school-logo.png" 
                                    alt="Seal" 
                                    className="h-[120%] w-[120%] object-contain opacity-[0.07] dark:opacity-[0.12] blur-[2px] logo-white-filter" 
                                />
                            </div>

                            {/* كارت المعلومة المتطاير */}
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

                            {/* شخصية صقر الضخمة */}
                            <img 
                                src="/saqr-full.png" 
                                alt="Saqr" 
                                className={`h-64 md:h-[520px] object-contain drop-shadow-[0_40px_70px_rgba(220,38,38,0.3)] relative z-10 transition-all ${isMascotClicked ? 'brightness-125' : ''}`} 
                            />
                            
                            {/* فقاعة الكلام التفاعلية */}
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
