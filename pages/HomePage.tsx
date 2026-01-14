import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- إعدادات الترجمة الذكية ---
const translations = {
    ar: {
        welcome: "مستقبل المعرفة في مدرسة صقر الإمارات",
        subWelcome: "استكشف مصادرنا الرقمية وتفاعل مع مساعدنا الذكي للوصول إلى أهدافك التعليمية.",
        manualSearch: "البحث اليدوي",
        manualDesc: "الوصول السريع عبر الرف أو العنوان",
        smartSearch: "اسأل صقر (AI)",
        smartDesc: "دردشة ذكية للترشيحات الشخصية",
        digitalLibrary: "المكتبة الإلكترونية",
        digitalDesc: "كتب تفاعلية ومصادر عالمية",
        bubble: "اضغط للحصول على فكرة!",
        copyright: "مدرسة صقر الإمارات الدولية الخاصة"
    },
    en: {
        welcome: "Future of Knowledge at Emirates Falcon",
        subWelcome: "Explore our digital resources and interact with our smart assistant to reach your educational goals.",
        manualSearch: "Manual Search",
        manualDesc: "Quick access by shelf or title",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Smart chat for personal recommendations",
        digitalLibrary: "Digital Library",
        digitalDesc: "Interactive books & global resources",
        bubble: "Click for an idea!",
        copyright: "Emirates Falcon International Private School"
    }
};

const KNOWLEDGE_CARDS = [
    { icon: "📜", textAr: "بحث رقمي", textEn: "Digital Research" },
    { icon: "💡", textAr: "فكرة مبتكرة", textEn: "Innovative Idea" },
    { icon: "🤖", textAr: "ذكاء صقر", textEn: "Saqr AI" },
    { icon: "📚", textAr: "مصادر المعرفة", textEn: "Knowledge Sources" },
    { icon: "🌍", textAr: "رؤية مستقبلية", textEn: "Future Vision" },
    { icon: "🔍", textAr: "استكشاف حر", textEn: "Free Exploration" }
];

const BackgroundPattern = () => (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-600/5 blur-[120px] rounded-full"></div>
    </div>
);

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [cards, setCards] = useState<{ id: number, x: number, y: number, item: typeof KNOWLEDGE_CARDS[0], tx: string, ty: string }[]>([]);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, isMascot: boolean = false) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);

        if (isMascot) {
            const newCards = [...KNOWLEDGE_CARDS].sort(() => 0.5 - Math.random()).slice(0, 4).map((item, i) => ({
                id: rippleId + i,
                x: clientX,
                y: clientY,
                item,
                tx: `${(Math.random() - 0.5) * (window.innerWidth < 768 ? 250 : 500)}px`,
                ty: `${(Math.random() - 0.7) * (window.innerWidth < 768 ? 200 : 400)}px` 
            }));
            setCards(prev => [...prev, ...newCards]);
        }

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            if (isMascot) {
                setCards(prev => prev.filter(c => c.id < rippleId || c.id > rippleId + 4));
            }
        }, 2000);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    return (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
            <BackgroundPattern />

            {/* طبقة كروت المعرفة المتطايرة */}
            {cards.map(card => (
                <div
                    key={card.id}
                    className="fixed pointer-events-none z-[100] glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 border-red-500/30 shadow-2xl animate-in fade-in zoom-in duration-500"
                    style={{ 
                        left: card.x, 
                        top: card.y, 
                        transform: `translate(calc(-50% + ${card.tx}), calc(-50% + ${card.ty}))`
                    } as any}
                >
                    <span className="text-xl md:text-2xl">{card.item.icon}</span>
                    <span className="text-sm md:text-base font-black text-gray-900 dark:text-white whitespace-nowrap">
                        {isAr ? card.item.textAr : card.item.textEn}
                    </span>
                </div>
            ))}

            <div 
                onMouseMove={handleMouseMove}
                className="relative z-10 glass-panel w-full max-w-7xl rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-white/40 dark:border-white/10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 p-8 md:p-20 items-center">
                    
                    {/* محتوى النصوص والأزرار */}
                    <div className="flex flex-col text-start space-y-8 md:space-y-12 order-2 lg:order-1">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                EFIIPS Digital Excellence
                            </div>
                            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-gray-950 dark:text-white leading-[1.1] tracking-tight">
                                {t('welcome')}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6">
                            {/* زر المكتبة الإلكترونية الرئيسي */}
                            <div className="relative group flex-1 sm:flex-none">
                                <Link 
                                    to="/digital-library" 
                                    className="w-full bg-gray-950 text-white dark:bg-white dark:text-gray-950 font-black py-5 px-10 rounded-2xl flex items-center justify-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    <span className="text-lg">{t('digitalLibrary')}</span>
                                </Link>
                            </div>

                            <Link to="/search" className="glass-button-base glass-button-red flex-1 sm:flex-none py-5 px-8 text-lg font-black active:scale-95">
                                {t('manualSearch')}
                            </Link>

                            <Link to="/smart-search" className="glass-button-base glass-button-green flex-1 sm:flex-none py-5 px-8 text-lg font-black active:scale-95">
                                {t('smartSearch')}
                            </Link>
                        </div>
                    </div>

                    {/* قسم شخصية صقر التفاعلية */}
                    <div className="relative flex flex-col items-center justify-center order-1 lg:order-2 py-10 lg:py-0">
                        {/* شعار المدرسة في الخلفية */}
                        <div className="absolute opacity-[0.07] dark:opacity-[0.12] scale-150 pointer-events-none transition-transform duration-1000 group-hover:rotate-12">
                             <img src="/school-logo.png" alt="EFIIPS" className="h-64 w-64 md:h-96 md:w-96 object-contain rotate-[15deg] logo-white-filter" />
                        </div>

                        <div 
                            onMouseDown={(e) => handleInteraction(e, true)}
                            onTouchStart={(e) => handleInteraction(e, true)}
                            className="relative group cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 touch-manipulation"
                        >
                            {/* تأثير التموج عند الضغط */}
                            {ripples.map(r => (
                                <span key={r.id} className="ripple-effect bg-red-500/20" style={{ left: r.x, top: r.y, width: '250px', height: '250px' }} />
                            ))}

                            <img 
                                src="/saqr-full.png" 
                                alt="Saqr Mascot" 
                                className="h-64 md:h-[450px] xl:h-[550px] object-contain drop-shadow-[0_30px_60px_rgba(239,68,68,0.25)] relative z-10" 
                            />
                            
                            {/* فقاعة الكلام التفاعلية */}
                            <div className="absolute -top-6 -right-6 md:-top-10 md:-right-12 glass-panel p-5 md:p-6 rounded-[2rem] shadow-2xl border-white/30 text-xs md:text-sm font-black text-red-700 dark:text-white max-w-[140px] md:max-w-[180px] animate-bounce pointer-events-none z-20">
                                {t('bubble')}
                                <div className="absolute -bottom-2 left-8 w-5 h-5 glass-panel border-r-2 border-b-2 border-white/20 rotate-45 bg-inherit"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
