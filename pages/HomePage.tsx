import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "مستقبل المعرفة في صقر الإمارات",
        subWelcome: "استكشف مصادرنا الرقمية وتفاعل مع مساعدنا الذكي للوصول إلى أهدافك.",
        manualSearch: "البحث اليدوي",
        smartSearch: "اسأل صقر (AI)",
        digitalLibrary: "المكتبة الإلكترونية",
        bubble: "اضغط للإلهام!"
    },
    en: {
        welcome: "Future of Knowledge at Saqr School",
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
    
    // حالة لكارت واحد فقط عند الضغط
    const [burstCard, setBurstCard] = useState<{ id: number, tx: string, ty: string, item: typeof KNOWLEDGE_CARDS[0] } | null>(null);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleSingleBurst = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);

        // اختيار كارت عشوائي واحد فقط
        const randomItem = KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)];
        
        setBurstCard({
            id: rippleId,
            item: randomItem,
            tx: `${(Math.random() - 0.5) * 40}px`, // حركة خفيفة يميناً ويساراً
            ty: `-150px` // يتطاير للأعلى
        });

        // التلاشي بعد 1.5 ثانية
        setTimeout(() => setBurstCard(null), 1500);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 800);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    return (
        <div className="relative h-[calc(100vh-180px)] flex items-center justify-center p-4 overflow-hidden select-none animate-fade-up">
            
            {/* الحاوية الزجاجية (تصغير الحجم لزيادة التناسق) */}
            <div 
                onMouseMove={handleMouseMove}
                className="relative z-10 glass-panel w-full max-w-6xl h-fit md:h-[80%] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-white/40 dark:border-white/5"
            >
                {/* الشعار المائي - تم نقله لليمين وللأعلى بميلان أنيق */}
                <div className="absolute -top-10 -right-10 opacity-[0.05] dark:opacity-[0.1] pointer-events-none select-none">
                     <img 
                        src="/school-logo.png" 
                        alt="EFIPS Seal" 
                        className="h-64 md:h-96 object-contain logo-tilt-right logo-white-filter" 
                     />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full p-10 md:p-16 items-center relative z-10">
                    
                    {/* النصوص والأزرار - تصميم أرشق */}
                    <div className="flex flex-col text-start space-y-8 order-2 lg:order-1">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 text-[9px] font-black uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                                EFIPS Library 2026
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter">
                                {t('welcome')}
                            </h1>
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-bold max-w-md">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/digital-library" className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black py-4 px-8 rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className="text-base">{t('digitalLibrary')}</span>
                            </Link>
                            
                            <Link to="/smart-search" className="glass-button-green py-4 px-8 text-base font-black shadow-md">{t('smartSearch')}</Link>
                        </div>
                    </div>

                    {/* قسم "صقر" التفاعلي - تطاير كارت واحد وتلاشي */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2">
                        <div 
                            onMouseDown={handleSingleBurst}
                            onTouchStart={handleSingleBurst}
                            className="relative group cursor-pointer touch-manipulation flex items-center justify-center"
                        >
                            {/* الكارت الواحد المنفجر */}
                            {burstCard && (
                                <div
                                    key={burstCard.id}
                                    className="absolute z-[100] glass-panel px-5 py-2.5 rounded-2xl flex items-center gap-3 border-red-500/30 shadow-2xl animate-burst"
                                    style={{ '--tx': burstCard.tx, '--ty': burstCard.ty } as any}
                                >
                                    <span className="text-2xl">{burstCard.item.icon}</span>
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter whitespace-nowrap">
                                        {isAr ? burstCard.item.textAr : burstCard.item.textEn}
                                    </span>
                                </div>
                            )}

                            {/* تأثير التموج */}
                            {ripples.map(r => (
                                <span key={r.id} className="ripple-effect bg-red-600/10" style={{ left: r.x, top: r.y, width: '200px', height: '200px' }} />
                            ))}

                            <img 
                                src="/saqr-full.png" 
                                alt="Saqr" 
                                className="h-64 md:h-[450px] object-contain drop-shadow-[0_30px_60px_rgba(220,38,38,0.2)] group-hover:scale-[1.02] transition-transform duration-700 relative z-10" 
                            />
                            
                            {/* فقاعة الكلام التفاعلية */}
                            <div className="absolute -top-4 -right-4 md:-top-8 md:-right-6 glass-panel p-4 md:p-5 rounded-[2rem] shadow-2xl border-white/40 text-[10px] md:text-xs font-black text-red-700 dark:text-white animate-bounce z-20">
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
