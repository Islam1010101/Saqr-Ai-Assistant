import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- قائمة العبارات التحفيزية للقراءة ---
const READING_INSPIRATIONS = [
    { icon: "📖", textAr: "اقرأ لترتقي", textEn: "Read to Rise" },
    { icon: "✨", textAr: "مغامرة في كل صفحة", textEn: "Adventure in every page" },
    { icon: "🧠", textAr: "المعرفة قوة", textEn: "Knowledge is Power" },
    { icon: "🚀", textAr: "سافر عبر الكلمات", textEn: "Travel through Words" },
    { icon: "💡", textAr: "نور العقل", textEn: "Light of the Mind" },
    { icon: "💖", textAr: "أحب القراءة", textEn: "I Love Reading" }
];

const BackgroundPattern = () => (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-600/5 blur-[120px] rounded-full"></div>
    </div>
);

const DigitalLibraryPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);
    const [inspirations, setInspirations] = useState<{ id: number, x: number, y: number, item: typeof READING_INSPIRATIONS[0], tx: string, ty: string }[]>([]);

    // تسجيل النشاط للتقارير
    const logSectionView = (sectionName: string) => {
        try {
            const logs = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
            logs.push({ timestamp: Date.now(), type: 'view', value: sectionName });
            localStorage.setItem('saqr_activity_logs', JSON.stringify(logs.slice(-100)));
        } catch (e) { console.error(e); }
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, isMascot: boolean = false, sectionName?: string) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
        if (sectionName) logSectionView(sectionName);

        if (isMascot) {
            const newInspirations = [...READING_INSPIRATIONS].sort(() => 0.5 - Math.random()).slice(0, 3).map((item, i) => ({
                id: rippleId + i, 
                x: clientX, 
                y: clientY, 
                item,
                tx: `${(Math.random() - 0.5) * (window.innerWidth < 640 ? 250 : 500)}px`, 
                ty: `${(Math.random() - 0.7) * (window.innerHeight < 640 ? 200 : 400)}px`
            }));
            setInspirations(prev => [...prev, ...newInspirations]);
        }

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            if (isMascot) setInspirations(prev => prev.filter(c => c.id < rippleId || c.id > rippleId + 4));
        }, 2500);
    };

    return (
        <div dir={dir} className="relative max-w-7xl mx-auto px-4 py-8 md:py-16 overflow-hidden">
            <BackgroundPattern />
            
            {/* كروت الإلهام المتطايرة */}
            {inspirations.map(insp => (
                <div key={insp.id} 
                    className="fixed pointer-events-none z-[100] glass-panel px-6 py-3 rounded-2xl flex items-center gap-3 border-red-500/30 shadow-2xl animate-in zoom-in fade-in duration-500"
                    style={{ 
                        left: insp.x, 
                        top: insp.y, 
                        transform: `translate(calc(-50% + ${insp.tx}), calc(-50% + ${insp.ty}))`
                    } as any}>
                    <span className="text-2xl">{insp.item.icon}</span>
                    <span className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tighter">
                        {isAr ? insp.item.textAr : insp.item.textEn}
                    </span>
                </div>
            ))}

            {/* الهيرو (بوابة صقر الرقمية) */}
            <div 
                onMouseMove={handleMouseMove} 
                className="relative z-10 glass-panel glass-card-interactive rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 mb-20 border-white/40 dark:border-white/10 flex flex-col lg:grid lg:grid-cols-2 items-center gap-12 shadow-2xl"
            >
                {ripples.map(r => <span key={r.id} className="ripple-effect bg-red-600/10" style={{ left: r.x, top: r.y }} />)}
                
                <div className="text-center lg:text-start space-y-8 relative z-10 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        Digital Portal 2026
                    </div>
                    <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tight">
                        {isAr ? 'بوابة E.F.I.P.S الرقمية' : 'E.F.I.P.S Digital Portal'}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
                        {isAr ? 'استكشف عالماً من المعرفة عبر بوابة مدرسة صقر الإمارات للمصادر الرقمية المطورة.' : 'Explore a world of knowledge through the upgraded Emirates Falcon Digital Portal.'}
                    </p>
                </div>

                <div className="relative flex items-center justify-center order-1 lg:order-2">
                    <div className="absolute opacity-[0.08] dark:opacity-[0.15] scale-150 pointer-events-none transition-all duration-1000">
                        <img src="/school-logo.png" alt="EFIIPS" className="h-64 w-64 md:h-96 md:w-96 object-contain rotate-12 logo-white-filter" />
                    </div>
                    <div 
                        className="relative group cursor-pointer z-10 touch-manipulation hover:scale-105 active:scale-90 transition-transform duration-500" 
                        onMouseDown={(e) => handleInteraction(e, true)} 
                        onTouchStart={(e) => handleInteraction(e, true)}
                    >
                        <img src="/saqr-digital.png" alt="Saqr Digital" className="h-64 sm:h-80 md:h-[480px] object-contain drop-shadow-[0_30px_60px_rgba(239,68,68,0.3)]" />
                        <div className="absolute -top-4 -right-4 glass-panel p-4 rounded-2xl shadow-2xl border-white/20 text-xs font-black text-red-700 dark:text-white max-w-[150px] animate-bounce pointer-events-none">
                            {isAr ? 'اضغط للإلهام!' : 'Click for Inspiration!'}
                            <div className="absolute -bottom-2 left-6 w-4 h-4 glass-panel border-r-2 border-b-2 border-white/10 rotate-45 bg-inherit"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* شبكة المكتبات */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                
                {/* المكتبة العربية (الأصالة الخضراء) */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 px-4">
                        <span className="w-3 h-10 bg-green-700 rounded-full shadow-[0_0_20px_rgba(0,115,47,0.4)]"></span>
                        <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">
                            {isAr ? 'المكتبة العربية' : 'Arabic Library'}
                        </h2>
                    </div>
                    
                    <Link 
                        to="/digital-library/arabic" 
                        onMouseMove={handleMouseMove} 
                        onMouseDown={(e) => handleInteraction(e, false, 'Arabic Library')}
                        className="glass-panel glass-card-interactive group relative overflow-hidden p-8 md:p-12 rounded-[3rem] border-green-600/30 flex items-center gap-8 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect bg-green-600/10" style={{ left: r.x, top: r.y }} />)}
                        <div className="text-6xl md:text-8xl shrink-0 z-10 opacity-80 group-hover:opacity-100 transition-opacity">🏛️</div>
                        <div className="flex-1 min-w-0 z-10 space-y-3">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white group-hover:text-green-700 transition-colors leading-tight">
                                {isAr ? 'تصفح الكتب العربية' : 'Explore Arabic Books'}
                            </h3>
                            <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 font-bold leading-tight">
                                {isAr ? 'روايات، كتب إسلامية، وتنمية بشرية (41 عنوان)' : 'Lit, Islamic, and Self-Dev (41 Titles)'}
                            </p>
                            <div className="inline-flex items-center gap-2 text-green-700 font-black text-xs uppercase tracking-widest mt-4">
                                Enter Library <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    </Link>
                </section>

                {/* المكتبة الإنجليزية (العالمية الزرقاء) */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 px-4">
                        <span className="w-3 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"></span>
                        <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">
                            {isAr ? 'المكتبة الإنجليزية' : 'English Library'}
                        </h2>
                    </div>
                    
                    <Link 
                        to="/digital-library/english" 
                        onMouseMove={handleMouseMove} 
                        onMouseDown={(e) => handleInteraction(e, false, 'English Library')}
                        className="glass-panel glass-card-interactive group relative overflow-hidden p-8 md:p-12 rounded-[3rem] border-blue-500/30 flex items-center gap-8 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect bg-blue-600/10" style={{ left: r.x, top: r.y }} />)}
                        <div className="text-6xl md:text-8xl shrink-0 z-10 opacity-80 group-hover:opacity-100 transition-opacity">📚</div>
                        <div className="flex-1 min-w-0 z-10 space-y-3">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                                {isAr ? 'تصفح الكتب الإنجليزية' : 'Explore English Books'}
                            </h3>
                            <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 font-bold leading-tight">
                                {isAr ? 'روايات عالمية، ألغاز، وهاري بوتر (26 عنوان)' : 'Novels, Puzzles, and Harry Potter (26 Titles)'}
                            </p>
                            <div className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mt-4">
                                Enter Library <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    </Link>
                </section>
            </div>
            
            {/* Branding Footer */}
            <footer className="mt-32 flex flex-col items-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-700">
                <img src="/school-logo.png" alt="EFIIPS" className="h-20 grayscale logo-white-filter" />
                <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Emirates Falcon International Private School</p>
            </footer>
        </div>
    );
};

export default DigitalLibraryPage;
