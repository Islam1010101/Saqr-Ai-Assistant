import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "مستقبل المعرفة في مدرسة صقر الإمارات",
        subWelcome: "استكشف مصادرنا الرقمية وتفاعل مع مساعدنا الذكي للوصول إلى أهدافك التعليمية الواعدة.",
        manualSearch: "البحث اليدوي",
        smartSearch: "اسأل صقر (AI)",
        digitalLibrary: "المكتبة الإلكترونية",
        bubble: "اضغط للحصول على فكرة!"
    },
    en: {
        welcome: "Future of Knowledge at Emirates Falcon",
        subWelcome: "Explore our digital resources and interact with our smart assistant to reach your goals.",
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
    
    const [cards, setCards] = useState<{ id: number, tx: string, ty: string, item: typeof KNOWLEDGE_CARDS[0] }[]>([]);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleBurstInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);

        // إطلاق تأثير انفجار كروت المعرفة
        const newCards = [...KNOWLEDGE_CARDS].map((item, i) => ({
            id: rippleId + i,
            item,
            // تحديد مسار الانفجار للخارج وتوزيعه في اتجاهات مختلفة
            tx: `${(i % 2 === 0 ? 1 : -1) * (Math.random() * 120 + 160)}px`,
            ty: `${(i < 2 ? -1 : 1) * (Math.random() * 100 + 140)}px`
        }));
        
        setCards(newCards);
        
        // تنظيف الكروت بعد انتهاء أنيميشن التلاشي (موجود في index.css)
        setTimeout(() => setCards([]), 2000);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 1000);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    return (
        <div className="relative h-[calc(100vh-160px)] flex items-center justify-center p-2 md:p-6 overflow-hidden select-none animate-fade-up">
            
            {/* الحاوية الزجاجية الكبرى (National Glass Portal) */}
            <div 
                onMouseMove={handleMouseMove}
                className="relative z-10 glass-panel w-full max-w-7xl h-full rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.15)] border-white/40 dark:border-white/5"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full p-8 md:p-16 lg:p-24 items-center">
                    
                    {/* النصوص والأزرار - تباين فائق للفخامة */}
                    <div className="flex flex-col text-start space-y-10 order-2 lg:order-1 relative z-20">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-600/10 border border-green-600/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.25em]">
                                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                                Emirates Falcon Digital Portal
                            </div>
                            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter">
                                {t('welcome')}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-lg">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-5">
                            {/* زر المكتبة الرقمية (الأسود/الأبيض الملكي) */}
                            <Link to="/digital-library" className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black py-5 px-10 rounded-[2rem] flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span>{t('digitalLibrary')}</span>
                            </Link>
                            
                            <Link to="/search" className="glass-button-red text-lg font-black">{t('manualSearch')}</Link>
                            <Link to="/smart-search" className="glass-button-green text-lg font-black">{t('smartSearch')}</Link>
                        </div>
                    </div>

                    {/* قسم "صقر" التفاعلي - تطاير وانفجار كوني */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2 h-full">
                        
                        {/* الشعار المائي - مائل لليمين ومصغر */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
                             <img 
                                src="/school-logo.png" 
                                alt="Watermark" 
                                className="w-64 md:w-80 h-auto object-contain opacity-[0.05] dark:opacity-[0.1] logo-tilt-right logo-white-filter translate-x-12" 
                             />
                        </div>

                        {/* منطقة التفاعل مع الشخصية */}
                        <div 
                            onMouseDown={handleBurstInteraction}
                            onTouchStart={handleBurstInteraction}
                            className="relative group cursor-pointer touch-manipulation z-30 flex items-center justify-center"
                        >
                            {/* الكروت المنفجرة المتلاشية */}
                            {cards.map(card => (
                                <div
                                    key={card.id}
                                    className="absolute z-[100] glass-panel px-6 py-3 rounded-[1.5rem] flex items-center gap-3 border-red-500/30 shadow-2xl animate-burst"
                                    style={{ '--tx': card.tx, '--ty': card.ty } as any}
                                >
                                    <span className="text-2xl">{card.item.icon}</span>
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter whitespace-nowrap">
                                        {isAr ? card.item.textAr : card.item.textEn}
                                    </span>
                                </div>
                            ))}

                            {/* تأثير التموج عند اللمس */}
                            {ripples.map(r => (
                                <span key={r.id} className="ripple-effect bg-red-600/10" style={{ left: r.x, top: r.y, width: '250px', height: '250px' }} />
                            ))}

                            {/* شخصية صقر الضخمة */}
                            <img 
                                src="/saqr-full.png" 
                                alt="Saqr Mascot" 
                                className="h-64 md:h-[500px] xl:h-[580px] object-contain drop-shadow-[0_40px_80px_rgba(220,38,38,0.25)] group-hover:scale-[1.03] transition-transform duration-700 relative z-10" 
                            />
                            
                            {/* فقاعة الكلام التفاعلية */}
                            <div className="absolute -top-6 -right-6 md:-top-12 md:-right-10 glass-panel p-5 md:p-7 rounded-[2.5rem] shadow-2xl border-white/40 text-xs md:text-sm font-black text-red-700 dark:text-white max-w-[160px] animate-bounce z-20">
                                {t('bubble')}
                                <div className="absolute -bottom-2 left-10 w-5 h-5 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-white/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
