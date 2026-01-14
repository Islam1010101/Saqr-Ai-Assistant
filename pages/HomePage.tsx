import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "مستقبل المعرفة في مدرسة صقر الإمارات",
        subWelcome: "استكشف مصادرنا الرقمية وتفاعل مع مساعدنا الذكي للوصول إلى أهدافك التعليمية.",
        manualSearch: "البحث اليدوي",
        smartSearch: "اسأل صقر (AI)",
        digitalLibrary: "المكتبة الإلكترونية",
        bubble: "اضغط للحصول على فكرة!"
    },
    en: {
        welcome: "Future of Knowledge at Emirates Falcon",
        subWelcome: "Explore our digital resources and interact with our smart assistant.",
        manualSearch: "Manual Search",
        smartSearch: "Ask Saqr (AI)",
        digitalLibrary: "Digital Library",
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
    
    const [cards, setCards] = useState<{ id: number, tx: number, ty: number, item: typeof KNOWLEDGE_CARDS[0] }[]>([]);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, isMascot: boolean = false) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);

        if (isMascot) {
            // توليد كروت جديدة تنفجر من المركز
            const newCards = [...KNOWLEDGE_CARDS].map((item, i) => ({
                id: rippleId + i,
                item,
                // زوايا انفجار موزعة بدقة
                tx: (i % 2 === 0 ? 1 : -1) * (Math.random() * 80 + 120),
                ty: (i < 2 ? -1 : 1) * (Math.random() * 80 + 120)
            }));
            
            setCards(newCards);
            // إخفاء الكروت بعد 2 ثانية لمحاكاة التلاشي
            setTimeout(() => setCards([]), 2000);
        }
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 1000);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    return (
        <div className="relative h-[calc(100vh-140px)] flex flex-col items-center justify-center p-2 md:p-6 overflow-hidden">
            
            {/* الحاوية الرئيسية (Glass Panel) بأبعاد مضبوطة */}
            <div 
                onMouseMove={handleMouseMove}
                className="relative z-10 glass-panel w-full max-w-7xl h-full rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.1)] border-white/30 dark:border-white/5"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full p-8 md:p-16 lg:p-24 items-center">
                    
                    {/* النصوص والأزرار - تباين فائق */}
                    <div className="flex flex-col text-start space-y-10 order-2 lg:order-1 relative z-20">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 text-[11px] font-black uppercase tracking-widest">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                EFIIPS Digital Hub
                            </div>
                            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter">
                                {t('welcome')}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-lg">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-5">
                            <Link to="/digital-library" className="bg-gray-950 text-white dark:bg-white dark:text-gray-950 font-black py-5 px-10 rounded-[2rem] flex items-center gap-3 shadow-2xl hover:scale-105 transition-all active:scale-95 text-lg">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                <span>{t('digitalLibrary')}</span>
                            </Link>
                            <Link to="/search" className="glass-button-base glass-button-red py-5 px-8 font-black text-lg rounded-[2rem]">{t('manualSearch')}</Link>
                            <Link to="/smart-search" className="glass-button-base glass-button-green py-5 px-8 font-black text-lg rounded-[2rem]">{t('smartSearch')}</Link>
                        </div>
                    </div>

                    {/* قسم صقر التفاعلي - تم إصلاح الشعار والحركة */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2 h-full">
                        
                        {/* الشعار الخلفي - مضبوط الحجم والدوران */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                             <img 
                                src="/school-logo.png" 
                                alt="Background" 
                                className="w-64 md:w-80 h-auto object-contain opacity-[0.06] dark:opacity-[0.1] rotate-[25deg] logo-white-filter translate-x-12" 
                             />
                        </div>

                        {/* منطقة الشخصية الحركية */}
                        <div 
                            onMouseDown={(e) => handleInteraction(e, true)}
                            onTouchStart={(e) => handleInteraction(e, true)}
                            className="relative group cursor-pointer touch-manipulation z-30 flex items-center justify-center"
                        >
                            {/* الكروت المنفجرة (تظهر فقط عند الأكشن) */}
                            {cards.map(card => (
                                <div
                                    key={card.id}
                                    className="absolute z-[100] glass-panel px-5 py-2.5 rounded-2xl flex items-center gap-3 border-red-500/20 shadow-2xl animate-in zoom-in fade-out fill-mode-forwards duration-1000"
                                    style={{ 
                                        transform: `translate(${card.tx}px, ${card.ty}px)`,
                                        transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    } as any}
                                >
                                    <span className="text-2xl">{card.item.icon}</span>
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter whitespace-nowrap">
                                        {isAr ? card.item.textAr : card.item.textEn}
                                    </span>
                                </div>
                            ))}

                            {/* تأثير التموج */}
                            {ripples.map(r => (
                                <span key={r.id} className="ripple-effect bg-red-500/10" style={{ left: r.x, top: r.y, width: '250px', height: '250px' }} />
                            ))}

                            <img 
                                src="/saqr-full.png" 
                                alt="Saqr" 
                                className="h-64 md:h-[480px] xl:h-[550px] object-contain drop-shadow-[0_30px_70px_rgba(239,68,68,0.25)] group-hover:scale-[1.03] transition-transform duration-700 relative z-10" 
                            />
                            
                            {/* فقاعة الكلام التفاعلية */}
                            <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 glass-panel p-5 rounded-[2rem] shadow-2xl border-white/40 text-xs md:text-sm font-black text-red-700 dark:text-white max-w-[150px] animate-bounce z-20">
                                {t('bubble')}
                                <div className="absolute -bottom-2 left-8 w-5 h-5 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-white/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
