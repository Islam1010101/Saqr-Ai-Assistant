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
        bubble: "اضغط للحصول على فكرة!",
        copyright: "© 2026 مدرسة صقر الإمارات الدولية الخاصة. جميع الحقوق محفوظة."
    },
    en: {
        welcome: "Future of Knowledge at Emirates Falcon",
        subWelcome: "Explore our digital resources and interact with our smart assistant.",
        manualSearch: "Manual Search",
        smartSearch: "Ask Saqr (AI)",
        digitalLibrary: "Digital Library",
        bubble: "Click for an idea!",
        copyright: "© 2026 Emirates Falcon International Private School. All Rights Reserved."
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
            // كروت المعرفة تخرج الآن من مركز الشخصية بشكل متوازن
            const newCards = [...KNOWLEDGE_CARDS].map((item, i) => ({
                id: rippleId + i,
                item,
                tx: (i % 2 === 0 ? 1 : -1) * (Math.random() * 100 + 100),
                ty: (i < 2 ? -1 : 1) * (Math.random() * 100 + 50)
            }));
            setCards(newCards);
            setTimeout(() => setCards([]), 2500);
        }
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 1000);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    return (
        <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
            
            {/* الحاوية الرئيسية (Glass Panel) */}
            <div 
                onMouseMove={handleMouseMove}
                className="relative z-10 glass-panel w-full max-w-7xl rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.1)] border-white/20 dark:border-white/5"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-16 lg:p-20 items-center">
                    
                    {/* النصوص والأزرار */}
                    <div className="flex flex-col text-start space-y-8 order-2 lg:order-1 relative z-20">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-600/5 border border-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                EFIIPS Digital
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white leading-[1.15] tracking-tight">
                                {t('welcome')}
                            </h1>
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/digital-library" className="bg-gray-950 text-white dark:bg-white dark:text-gray-950 font-black py-4 px-8 rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 transition-transform active:scale-95">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                <span>{t('digitalLibrary')}</span>
                            </Link>
                            <Link to="/search" className="glass-button-base glass-button-red py-4 px-6 font-black">{t('manualSearch')}</Link>
                            <Link to="/smart-search" className="glass-button-base glass-button-green py-4 px-6 font-black">{t('smartSearch')}</Link>
                        </div>
                    </div>

                    {/* قسم صقر التفاعلي */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2 py-8">
                        
                        {/* الشعار الخلفي - تم تصغيره ولفه لليمين */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                             <img 
                                src="/school-logo.png" 
                                alt="Background" 
                                className="h-64 md:h-80 w-auto object-contain opacity-[0.05] dark:opacity-[0.08] rotate-[25deg] logo-white-filter translate-x-10" 
                             />
                        </div>

                        {/* الحاوية التفاعلية للشخصية والكروت */}
                        <div 
                            onMouseDown={(e) => handleInteraction(e, true)}
                            onTouchStart={(e) => handleInteraction(e, true)}
                            className="relative group cursor-pointer touch-manipulation z-30"
                        >
                            {/* الكروت المتطايرة */}
                            {cards.map(card => (
                                <div
                                    key={card.id}
                                    className="absolute inset-0 m-auto w-fit h-fit z-[100] glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-red-500/20 shadow-xl animate-out fade-out slide-out-to-top-20 duration-1000"
                                    style={{ transform: `translate(${card.tx}px, ${card.ty}px)` } as any}
                                >
                                    <span className="text-xl">{card.item.icon}</span>
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase whitespace-nowrap">
                                        {isAr ? card.item.textAr : card.item.textEn}
                                    </span>
                                </div>
                            ))}

                            {/* تأثير التموج */}
                            {ripples.map(r => (
                                <span key={r.id} className="ripple-effect bg-red-500/10" style={{ left: r.x, top: r.y, width: '200px', height: '200px' }} />
                            ))}

                            <img 
                                src="/saqr-full.png" 
                                alt="Saqr" 
                                className="h-64 md:h-[420px] object-contain drop-shadow-[0_20px_50px_rgba(239,68,68,0.2)] group-hover:scale-105 transition-transform duration-500" 
                            />
                            
                            {/* فقاعة الكلام */}
                            <div className="absolute -top-4 -right-4 glass-panel p-4 rounded-2xl shadow-xl border-white/20 text-[11px] font-black text-red-700 dark:text-white max-w-[140px] animate-bounce">
                                {t('bubble')}
                                <div className="absolute -bottom-1.5 left-6 w-3 h-3 glass-panel rotate-45 bg-inherit border-r border-b border-white/10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* الفوتر المبسط - سطر واحد فقط */}
            <footer className="mt-12 opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] text-center">
                    {t('copyright')}
                </p>
            </footer>
        </div>
    );
};

export default HomePage;
