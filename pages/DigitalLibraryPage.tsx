import React, { useState } from 'react';
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

    const arabicResources = [
        { 
            title: "Digital Library E.F.I.P.S - المكتبة العربية", 
            desc: "المكتبة الرسمية لمدرسة صقر الإمارات - القسم العربي", 
            icon: "🏛️", 
            link: "https://sites.google.com/falcon-school.com/digital-library-efips/المكتبة-العربية?authuser=0" 
        },
        { title: "منصة ألف للتعليم", desc: "تعلم تفاعلي باللغة العربية", icon: "💎", link: "#" },
    ];

    const englishResources = [
        { 
            title: "Digital Library E.F.I.P.S - English Library", 
            desc: "Official school digital resources - English Section", 
            icon: "🏛️", 
            link: "https://sites.google.com/falcon-school.com/digital-library-efips/english-library" 
        },
        { title: "Epic Library", desc: "Unlimited digital books for students", icon: "🚀", link: "#" },
    ];

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, isMascot: boolean = false) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const xRel = clientX - rect.left;
        const yRel = clientY - rect.top;

        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: xRel, y: yRel }]);

        if (isMascot) {
            const newInspirations = READING_INSPIRATIONS.sort(() => 0.5 - Math.random()).slice(0, 3).map((item, i) => ({
                id: rippleId + i,
                x: clientX,
                y: clientY,
                item,
                tx: `${(Math.random() - 0.5) * (window.innerWidth < 640 ? 250 : 400)}px`, 
                ty: `${(Math.random() - 1) * (window.innerHeight < 640 ? 200 : 300)}px`
            }));
            setInspirations(prev => [...prev, ...newInspirations]);
        }

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            if (isMascot) {
                setInspirations(prev => prev.filter(c => c.id < rippleId || c.id > rippleId + 4));
            }
        }, 2500);
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in relative">
            
            {/* --- طبقة العناصر التحفيزية (متجاوبة الحجم) --- */}
            {inspirations.map(insp => (
                <div
                    key={insp.id}
                    className="fixed pointer-events-none z-[100] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 border-2 border-red-500/30 shadow-xl animate-glass-float"
                    style={{ left: insp.x, top: insp.y, '--tx': insp.tx, '--ty': insp.ty } as any}
                >
                    <span className="text-lg sm:text-xl">{insp.item.icon}</span>
                    <span className="text-[10px] sm:text-xs font-black text-gray-950 dark:text-white whitespace-nowrap">
                        {isAr ? insp.item.textAr : insp.item.textEn}
                    </span>
                </div>
            ))}

            {/* قسم الهيرو: متجاوب (طولي للموبايل، عرضي للتابلت) */}
            <div className="glass-panel relative overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 md:p-16 mb-10 sm:mb-16 border-white/20 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30 opacity-50" style={{ left: r.x, top: r.y }} />)}
                
                <div className="flex-1 text-center md:text-start relative z-10 space-y-4 sm:space-y-6">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-950 dark:text-white tracking-tighter leading-tight">
                        {isAr ? 'بوابة E.F.I.P.S الرقمية' : 'E.F.I.P.S Digital Portal'}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-bold max-w-xl mx-auto md:mx-0">
                        {isAr ? 'استكشف عالمًا من المعرفة عبر بوابة مدرسة صقر الإمارات للمصادر الرقمية.' : 'Explore a world of knowledge through the Emirates Falcon Digital Portal.'}
                    </p>
                </div>

                <div className="relative flex items-center justify-center scale-90 sm:scale-100">
                    {/* الشعار في الخلفية */}
                    <div className="absolute opacity-10 scale-125 sm:scale-150 pointer-events-none transition-all">
                        <img src="/school-logo.png" alt="Back Logo" className="h-48 w-48 sm:h-64 sm:w-64 md:h-80 md:w-80 object-contain rotate-[15deg]" />
                    </div>

                    <div 
                        className="relative group cursor-pointer z-10 touch-manipulation" 
                        onMouseDown={(e) => handleInteraction(e, true)}
                        onTouchStart={(e) => handleInteraction(e, true)}
                    >
                        <img 
                            src="/saqr-digital.png" 
                            alt="Saqr Digital" 
                            className="h-56 sm:h-64 md:h-80 object-contain drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)] transform transition-all group-hover:scale-105 active:scale-95 duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* شبكة المكتبات (1 عمود للموبايل، 2 للتابلت فما فوق) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                
                {/* المكتبة العربية */}
                <section className="space-y-6 sm:space-y-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white flex items-center gap-3">
                        <span className="w-2 h-8 sm:h-10 bg-green-700 rounded-full shadow-lg"></span>
                        {isAr ? 'المكتبة العربية' : 'Arabic Library'}
                    </h2>
                    <div className="grid gap-4 sm:gap-5">
                        {arabicResources.map((item, i) => (
                            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={`glass-panel group relative overflow-hidden p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-white/10 hover:border-red-500/30 transition-all flex items-center gap-4 sm:gap-6 ${i === 0 ? 'border-red-500/40 bg-red-500/5' : ''}`} onMouseDown={handleInteraction} onTouchStart={handleInteraction}>
                                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/20" style={{ left: r.x, top: r.y }} />)}
                                <div className="text-3xl sm:text-4xl shrink-0">{item.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-xl font-black text-gray-900 dark:text-white group-hover:text-red-600 truncate">{item.title}</h3>
                                    <p className="text-[10px] sm:text-sm text-gray-500 font-medium line-clamp-1">{item.desc}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </a>
                        ))}
                    </div>
                </section>

                {/* المكتبة الإنجليزية */}
                <section className="space-y-6 sm:space-y-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white flex items-center gap-3">
                        <span className="w-2 h-8 sm:h-10 bg-blue-600 rounded-full shadow-lg"></span>
                        {isAr ? 'المكتبة الإنجليزية' : 'English Library'}
                    </h2>
                    <div className="grid gap-4 sm:gap-5">
                        {englishResources.map((item, i) => (
                            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={`glass-panel group relative overflow-hidden p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-white/10 hover:border-red-500/30 transition-all flex items-center gap-4 sm:gap-6 ${i === 0 ? 'border-red-500/40 bg-red-500/5' : ''}`} onMouseDown={handleInteraction} onTouchStart={handleInteraction}>
                                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/20" style={{ left: r.x, top: r.y }} />)}
                                <div className="text-3xl sm:text-4xl shrink-0">{item.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-xl font-black text-gray-900 dark:text-white group-hover:text-red-600 truncate">{item.title}</h3>
                                    <p className="text-[10px] sm:text-sm text-gray-500 font-medium line-clamp-1">{item.desc}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DigitalLibraryPage;
