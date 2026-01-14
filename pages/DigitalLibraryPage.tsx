import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';

const READING_INSPIRATIONS = [
    { icon: "📖", textAr: "اقرأ لترتقي", textEn: "Read to Rise" },
    { icon: "✨", textAr: "مغامرة في كل صفحة", textEn: "Adventure in every page" },
    { icon: "🧠", textAr: "المعرفة قوة", textEn: "Knowledge is Power" },
    { icon: "🚀", textAr: "سافر عبر الكلمات", textEn: "Travel through Words" },
    { icon: "💡", textAr: "نور العقل", textEn: "Light of the Mind" },
    { icon: "💖", textAr: "أحب القراءة", textEn: "I Love Reading" }
];

const translations = {
    ar: {
        title: "بوابة المعرفة الرقمية",
        desc: "رحلة استثنائية بين كنوز الأدب العربي والعالمي بلمسة وطنية مبتكرة.",
        arabicLib: "المكتبة العربية",
        englishLib: "المكتبة الإنجليزية",
        arabicDesc: "تضم روائع الأدب العربي، التراث، وتطوير الذات.",
        englishDesc: "تضم الروايات العالمية و الألغاز.",
        bubble: "اضغط للإلهام!"
    },
    en: {
        title: "Digital Knowledge Portal",
        desc: "An exceptional journey through Arabic and Global literature with a UAE touch.",
        arabicLib: "Arabic Library",
        englishLib: "English Library",
        arabicDesc: "Arabic literature, heritage, and self-dev.",
        englishDesc: "global novels and puzzles.",
        bubble: "Click for Magic!"
    }
};

const DigitalLibraryPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [burstCard, setBurstCard] = useState<{ id: number, tx: string, ty: string, item: typeof READING_INSPIRATIONS[0] } | null>(null);
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleSingleBurst = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);

        const randomItem = READING_INSPIRATIONS[Math.floor(Math.random() * READING_INSPIRATIONS.length)];
        setBurstCard({
            id: rippleId,
            item: randomItem,
            tx: `${(Math.random() - 0.5) * 40}px`,
            ty: `-160px`
        });

        setTimeout(() => setBurstCard(null), 1500);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 800);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    const handleTooltip = (e: React.MouseEvent, text: string) => {
        setTooltip({ text, x: e.clientX, y: e.clientY - 40 });
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-up relative pb-24 flex items-center justify-center min-h-[75vh]">
            
            {/* الهنت العائم */}
            {tooltip && (
                <div 
                    className="fixed pointer-events-none z-[200] glass-panel px-4 py-2 rounded-xl border-white/40 shadow-2xl animate-in fade-in zoom-in duration-300"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
                >
                    <p className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap">{tooltip.text}</p>
                </div>
            )}

            {/* الحاوية الموحدة (الكتلة الواحدة) */}
            <div 
                onMouseMove={handleMouseMove}
                className="relative z-10 glass-panel w-full max-w-6xl rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.15)] border-2 border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-10 md:p-20 items-center">
                    
                    {/* الجانب النصي والأزرار */}
                    <div className="flex flex-col text-start space-y-10 order-2 lg:order-1 relative z-20">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter">
                                {t('title')}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold max-w-md leading-relaxed">
                                {t('desc')}
                            </p>
                        </div>

                        {/* الأزرار الموحدة داخل الكارت */}
                        <div className="flex flex-wrap gap-5">
                            {/* زر المكتبة العربية - توهج أخضر */}
                            <button 
                                onClick={() => navigate('/digital-library/arabic')}
                                onMouseMove={(e) => handleTooltip(e, t('arabicDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-green-600 hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] py-5 px-10 text-lg font-black rounded-[2rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95"
                            >
                                {t('arabicLib')}
                            </button>

                            {/* زر المكتبة الإنجليزية - توهج أسود/داكن (بديل الأزرق) */}
                            <button 
                                onClick={() => navigate('/digital-library/english')}
                                onMouseMove={(e) => handleTooltip(e, t('englishDesc'))}
                                onMouseLeave={() => setTooltip(null)}
                                className="glass-panel border-2 border-slate-200 dark:border-white/10 hover:border-slate-950 dark:hover:border-white hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] py-5 px-10 text-lg font-black rounded-[2rem] text-slate-900 dark:text-white transition-all duration-500 active:scale-95"
                            >
                                {t('englishLib')}
                            </button>
                        </div>
                    </div>

                    {/* قسم "صقر الرقمي" */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2">
                        <div 
                            onMouseDown={handleSingleBurst}
                            onTouchStart={handleSingleBurst}
                            className="relative group cursor-pointer touch-manipulation flex items-center justify-center w-full max-w-[450px]"
                        >
                            {/* الشعار المائل خلف الشخصية */}
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-6">
                                <img 
                                    src="/school-logo.png" 
                                    alt="Seal" 
                                    className="h-[110%] w-[110%] object-contain opacity-[0.06] dark:opacity-[0.12] blur-[1px] logo-white-filter logo-tilt-right" 
                                />
                            </div>

                            {/* كارت المعلومة المتطاير */}
                            {burstCard && (
                                <div
                                    key={burstCard.id}
                                    className="absolute z-[100] glass-panel px-6 py-3 rounded-2xl flex items-center gap-3 border-red-500/30 shadow-2xl animate-burst"
                                    style={{ '--tx': burstCard.tx, '--ty': burstCard.ty } as any}
                                >
                                    <span className="text-2xl">{burstCard.item.icon}</span>
                                    <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-tighter whitespace-nowrap">
                                        {isAr ? burstCard.item.textAr : burstCard.item.textEn}
                                    </span>
                                </div>
                            )}

                            {/* تأثير التموج */}
                            {ripples.map(r => (
                                <span key={r.id} className="ripple-effect bg-red-600/10" style={{ left: r.x, top: r.y, width: '200px', height: '200px' }} />
                            ))}

                            <img src="/saqr-digital.png" alt="Saqr" className="h-64 md:h-[480px] object-contain drop-shadow-[0_30px_60px_rgba(239,68,68,0.25)] relative z-10 transition-transform duration-700 group-hover:scale-[1.02]" />
                            
                            <div className="absolute -top-4 -right-4 md:top-0 md:right-0 glass-panel p-5 rounded-[2.5rem] shadow-2xl border-white/40 text-[10px] md:text-xs font-black text-red-700 dark:text-white animate-bounce z-20">
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

export default DigitalLibraryPage;
