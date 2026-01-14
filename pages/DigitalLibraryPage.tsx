import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- قائمة العبارات التحفيزية للقراءة (تأثير الانفجار) ---
const READING_INSPIRATIONS = [
    { icon: "📖", textAr: "اقرأ لترتقي", textEn: "Read to Rise" },
    { icon: "✨", textAr: "مغامرة في كل صفحة", textEn: "Adventure in every page" },
    { icon: "🧠", textAr: "المعرفة قوة", textEn: "Knowledge is Power" },
    { icon: "🚀", textAr: "سافر عبر الكلمات", textEn: "Travel through Words" },
    { icon: "💡", textAr: "نور العقل", textEn: "Light of the Mind" },
    { icon: "💖", textAr: "أحب القراءة", textEn: "I Love Reading" }
];

const DigitalLibraryPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);
    const [bursts, setBursts] = useState<{ id: number, tx: string, ty: string, item: typeof READING_INSPIRATIONS[0] }[]>([]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    const handleBurstInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);

        // إطلاق تأثير الانفجار
        const newBursts = READING_INSPIRATIONS.sort(() => 0.5 - Math.random()).slice(0, 4).map((item, i) => ({
            id: rippleId + i,
            item,
            tx: `${(i % 2 === 0 ? 1 : -1) * (Math.random() * 150 + 100)}px`, 
            ty: `${(i < 2 ? -1 : 1) * (Math.random() * 150 + 100)}px`
        }));
        
        setBursts(newBursts);
        setTimeout(() => setBursts([]), 2000);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 1000);
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative">
            
            {/* الهيرو (بوابة صقر الرقمية) */}
            <div 
                onMouseMove={handleMouseMove} 
                className="glass-panel glass-card-interactive relative overflow-hidden rounded-[3.5rem] md:rounded-[5rem] p-10 md:p-24 mb-16 md:mb-24 border-white/40 dark:border-white/5 flex flex-col lg:grid lg:grid-cols-2 items-center gap-12 shadow-2xl"
            >
                {/* خلفية الهالة الوطنية */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[100px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/20 blur-[100px] rounded-full"></div>
                </div>

                <div className="text-center lg:text-start space-y-8 relative z-10 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-600/10 border border-green-600/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                        EFIIPS Digital Gateway
                    </div>
                    <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter">
                        {isAr ? 'بوابة المعرفة الرقمية' : 'Digital Knowledge Portal'}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-xl">
                        {isAr ? 'رحلة استثنائية بانتظارك بين كنوز الأدب العربي والعالمي بلمسة وطنية مبتكرة.' : 'An exceptional journey awaits you through Arabic and Global literature with an innovative UAE touch.'}
                    </p>
                </div>

                {/* قسم صقر الرقمي التفاعلي */}
                <div className="relative flex items-center justify-center order-1 lg:order-2 scale-110">
                    <div className="absolute opacity-10 dark:opacity-20 scale-150 pointer-events-none transition-all duration-1000">
                        <img src="/school-logo.png" alt="EFIPS" className="h-64 w-64 md:h-96 md:w-96 object-contain logo-tilt-right logo-white-filter" />
                    </div>
                    
                    <div 
                        className="relative group cursor-pointer z-10 touch-manipulation hover:scale-105 active:scale-90 transition-transform duration-500" 
                        onMouseDown={handleBurstInteraction}
                    >
                        {/* كروت الانفجار المتلاشية */}
                        {bursts.map(burst => (
                            <div key={burst.id} 
                                className="absolute inset-0 m-auto w-fit h-fit z-[100] glass-panel px-5 py-2.5 rounded-2xl flex items-center gap-3 border-red-500/30 shadow-2xl animate-burst"
                                style={{ '--tx': burst.tx, '--ty': burst.ty } as any}>
                                <span className="text-2xl">{burst.item.icon}</span>
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter whitespace-nowrap">
                                    {isAr ? burst.item.textAr : burst.item.textEn}
                                </span>
                            </div>
                        ))}

                        {/* تأثير التموج */}
                        {ripples.map(r => <span key={r.id} className="ripple-effect bg-red-600/10" style={{ left: r.x, top: r.y, width: '250px', height: '250px' }} />)}

                        <img src="/saqr-digital.png" alt="Saqr" className="h-64 sm:h-80 md:h-[480px] object-contain drop-shadow-[0_40px_80px_rgba(239,68,68,0.3)] relative z-10" />
                        
                        <div className="absolute -top-4 -right-4 glass-panel p-5 rounded-2xl shadow-2xl border-white/40 text-xs font-black text-red-700 dark:text-white animate-bounce z-20">
                            {isAr ? 'اضغط للإلهام!' : 'Click for Magic!'}
                        </div>
                    </div>
                </div>
            </div>

            {/* شبكة المكتبات - تباين فائق وفخامة */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                
                {/* المكتبة العربية (الأصالة الخضراء) */}
                <section className="space-y-8">
                    <div className="flex items-center gap-5 px-6">
                        <span className="w-4 h-12 bg-green-700 rounded-full shadow-[0_0_25px_rgba(0,115,47,0.5)] logo-tilt-right"></span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
                            {isAr ? 'المكتبة العربية' : 'Arabic Library'}
                        </h2>
                    </div>
                    
                    <Link 
                        to="/digital-library/arabic" 
                        onMouseMove={handleMouseMove} 
                        className="glass-panel glass-card-interactive group relative overflow-hidden p-10 md:p-14 rounded-[3.5rem] border-green-600/30 flex items-center gap-8 shadow-xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98]"
                    >
                        <div className="text-6xl md:text-8xl shrink-0 z-10 grayscale group-hover:grayscale-0 transition-all duration-700">🏛️</div>
                        <div className="flex-1 min-w-0 z-10 space-y-4">
                            <h3 className="text-2xl md:text-4xl font-black text-slate-950 dark:text-white group-hover:text-green-700 transition-colors leading-tight">
                                {isAr ? 'تصفح الكنوز العربية' : 'Explore Arabic Treasures'}
                            </h3>
                            <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                                {isAr ? 'روائع الأدب، التراث، وتطوير الذات (41 عنوان)' : 'Literature, Heritage, and Self-Dev (41 Titles)'}
                            </p>
                            <div className="inline-flex items-center gap-3 text-green-700 font-black text-xs uppercase tracking-widest mt-4">
                                Enter Library <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    </Link>
                </section>

                {/* المكتبة الإنجليزية (العالمية الزرقاء) */}
                <section className="space-y-8">
                    <div className="flex items-center gap-5 px-6">
                        <span className="w-4 h-12 bg-blue-600 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.5)] logo-tilt-right"></span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
                            {isAr ? 'المكتبة الإنجليزية' : 'English Library'}
                        </h2>
                    </div>
                    
                    <Link 
                        to="/digital-library/english" 
                        onMouseMove={handleMouseMove} 
                        className="glass-panel glass-card-interactive group relative overflow-hidden p-10 md:p-14 rounded-[3.5rem] border-blue-600/30 flex items-center gap-8 shadow-xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98]"
                    >
                        <div className="text-6xl md:text-8xl shrink-0 z-10 grayscale group-hover:grayscale-0 transition-all duration-700">📚</div>
                        <div className="flex-1 min-w-0 z-10 space-y-4">
                            <h3 className="text-2xl md:text-4xl font-black text-slate-950 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                                {isAr ? 'تصفح الروائع العالمية' : 'Explore Global Masterpieces'}
                            </h3>
                            <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                                {isAr ? 'روايات عالمية، ألغاز، وهاري بوتر (26 عنوان)' : 'Global Novels, Puzzles, and Harry Potter (26 Titles)'}
                            </p>
                            <div className="inline-flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest mt-4">
                                Enter Library <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default DigitalLibraryPage;
