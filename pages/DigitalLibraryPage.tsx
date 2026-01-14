import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- قائمة العبارات التحفيزية للقراءة ---
const READING_INSPIRATIONS = [
    { icon: "📖", textAr: "اقرأ لترتقي", textEn: "Read to Rise" },
    { icon: "✨", textAr: "مغامرة جديدة في كل صفحة", textEn: "Adventure on every page" },
    { icon: "🧠", textAr: "المعرفة قوة", textEn: "Knowledge is Power" },
    { icon: "🚀", textAr: "سافر عبر الكلمات", textEn: "Travel through Words" },
    { icon: "💡", textAr: "نور العقل", textEn: "Light of the Mind" },
    { icon: "💖", textAr: "أحب القراءة", textEn: "I Love Reading" }
];

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

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, isMascot: boolean = false, sectionName?: string) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
        if (sectionName) logSectionView(sectionName);

        if (isMascot) {
            const newInspirations = READING_INSPIRATIONS.sort(() => 0.5 - Math.random()).slice(0, 3).map((item, i) => ({
                id: rippleId + i, x: clientX, y: clientY, item,
                tx: `${(Math.random() - 0.5) * (window.innerWidth < 640 ? 250 : 400)}px`, 
                ty: `${(Math.random() - 1) * (window.innerHeight < 640 ? 200 : 300)}px`
            }));
            setInspirations(prev => [...prev, ...newInspirations]);
        }

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            if (isMascot) setInspirations(prev => prev.filter(c => c.id < rippleId || c.id > rippleId + 4));
        }, 2500);
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in relative pb-20">
            
            {/* فقاعات الإلهام - خط أوضح */}
            {inspirations.map(insp => (
                <div key={insp.id} className="fixed pointer-events-none z-[100] bg-white dark:bg-slate-900 border-2 border-red-500/40 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-glass-float"
                    style={{ left: insp.x, top: insp.y, '--tx': insp.tx, '--ty': insp.ty } as any}>
                    <span className="text-xl sm:text-2xl">{insp.item.icon}</span>
                    <span className="text-xs sm:text-sm font-black text-slate-950 dark:text-white uppercase tracking-tighter whitespace-nowrap">
                        {isAr ? insp.item.textAr : insp.item.textEn}
                    </span>
                </div>
            ))}

            {/* الهيرو (البوابة) - تباين فائق */}
            <div 
                onMouseMove={handleMouseMove} 
                className="glass-panel glass-card-interactive bg-white/95 dark:bg-slate-900/95 relative overflow-hidden rounded-[3rem] sm:rounded-[4rem] p-10 sm:p-16 md:p-20 mb-12 sm:mb-20 border-white/50 dark:border-white/10 flex flex-col md:flex-row items-center gap-10 sm:gap-16 shadow-2xl"
            >
                {ripples.map(r => <span key={r.id} className="ripple-effect !border-red-500/40 opacity-50" style={{ left: r.x, top: r.y }} />)}
                
                <div className="flex-1 text-center md:text-start relative z-10 space-y-6 sm:space-y-8">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-[1.1]">
                        {isAr ? 'بوابة E.F.I.P.S الرقمية' : 'E.F.I.P.S Digital Portal'}
                    </h1>
                    <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-bold max-w-2xl leading-relaxed">
                        {isAr ? 'استكشف عالمًا من المعرفة عبر بوابة مدرسة صقر الإمارات للمصادر الرقمية المطورة.' : 'Explore a world of knowledge through the upgraded Emirates Falcon Digital Portal.'}
                    </p>
                </div>

                <div className="relative flex items-center justify-center scale-100 sm:scale-110">
                    <div className="absolute opacity-10 dark:opacity-20 scale-150 pointer-events-none transition-all duration-1000">
                        <img src="/school-logo.png" alt="EFIPS" className="h-64 w-64 md:h-96 md:w-96 object-contain rotate-12 logo-white-filter" />
                    </div>
                    <div 
                        className="relative group cursor-pointer z-10 touch-manipulation active:scale-90 transition-transform duration-300" 
                        onMouseDown={(e) => handleInteraction(e, true)} 
                        onTouchStart={(e) => handleInteraction(e, true)}
                    >
                        <img src="/saqr-digital.png" alt="Saqr" className="h-64 sm:h-80 md:h-[450px] object-contain drop-shadow-[0_25px_60px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-all" />
                    </div>
                </div>
            </div>

            {/* شبكة المكتبات - بطاقات ضخمة وواضحة */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14">
                
                {/* المكتبة العربية */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 px-4">
                        <span className="w-3 h-10 sm:h-12 bg-green-700 rounded-full shadow-[0_0_15px_rgba(21,128,61,0.4)]"></span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
                            {isAr ? 'المكتبة العربية' : 'Arabic Library'}
                        </h2>
                    </div>
                    
                    <Link 
                        to="/digital-library/arabic" 
                        onMouseMove={handleMouseMove} 
                        onMouseDown={(e) => handleInteraction(e, false, isAr ? 'المكتبة العربية' : 'Arabic Library')}
                        className="glass-panel glass-card-interactive bg-white/95 dark:bg-slate-900/90 group relative overflow-hidden p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border-green-600/30 flex items-center gap-6 sm:gap-10 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect !border-green-600/30" style={{ left: r.x, top: r.y }} />)}
                        <div className="text-5xl sm:text-7xl shrink-0 z-10 animate-pulse">🏛️</div>
                        <div className="flex-1 min-w-0 z-10 space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white group-hover:text-green-700 transition-colors">
                                {isAr ? 'تصفح الكتب العربية' : 'Explore Arabic Books'}
                            </h3>
                            <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 font-bold leading-tight">
                                {isAr ? 'روايات، كتب إسلامية، وتنمية بشرية (41 عنوان)' : 'Lit, Islamic, and Self-Dev (41 Titles)'}
                            </p>
                        </div>
                        <div className="bg-green-600 text-white p-3 rounded-2xl shadow-lg group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </Link>
                </section>

                {/* المكتبة الإنجليزية */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 px-4">
                        <span className="w-3 h-10 sm:h-12 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
                            {isAr ? 'المكتبة الإنجليزية' : 'English Library'}
                        </h2>
                    </div>
                    
                    <Link 
                        to="/digital-library/english" 
                        onMouseMove={handleMouseMove} 
                        onMouseDown={(e) => handleInteraction(e, false, isAr ? 'المكتبة الإنجليزية' : 'English Library')}
                        className="glass-panel glass-card-interactive bg-white/95 dark:bg-slate-900/90 group relative overflow-hidden p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border-blue-500/30 flex items-center gap-6 sm:gap-10 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect !border-blue-500/30" style={{ left: r.x, top: r.y }} />)}
                        <div className="text-5xl sm:text-7xl shrink-0 z-10 animate-pulse">📚</div>
                        <div className="flex-1 min-w-0 z-10 space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white group-hover:text-blue-600 transition-colors">
                                {isAr ? 'تصفح الكتب الإنجليزية' : 'Explore English Books'}
                            </h3>
                            <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 font-bold leading-tight">
                                {isAr ? 'روايات عالمية، ألغاز، وهاري بوتر (26 عنوان)' : 'Novels, Puzzles, and Harry Potter (26 Titles)'}
                            </p>
                        </div>
                        <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </Link>
                </section>

            </div>
        </div>
    );
};

export default DigitalLibraryPage;
