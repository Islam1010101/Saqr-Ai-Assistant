import React, { useState } from 'react';
import { useLanguage } from '../App';

interface QuoteCard {
    id: number;
    text: string;
    top: string;
    left: string;
    isVaporizing: boolean;
}

const translations = {
    ar: {
        pageTitle: "بوابة المبدعين",
        subTitle: "المس المبدع لتستمد منه ومضات الإلهام",
        status: "هذا الركن الإبداعي تحت الإنشاء",
        comingSoon: "نجهز لكم منصة تليق بعباقرة صقر الإمارات 2026",
        quotes: [
            "الابتكار هو رؤية ما يراه الجميع، والتفكير بما لم يفكر به أحد",
            "بصمتك المبدعة هي هديتك الفريدة للعالم",
            "الخيال هو بداية الابتكار؛ تتخيل ما ترغب، وتصنع ما تتخيل",
            "كل طالب في مدرسة صقر الإمارات هو مشروع مبدع عظيم",
            "الإبداع لا ينتظر اللحظة المثالية، بل يخلقها من العدم",
            "اجعل من خيالك واقعاً تبهر به العالم في مدرسة صقر"
        ]
    },
    en: {
        pageTitle: "Creators' Portal",
        subTitle: "Touch the creator to spark inspiration cards",
        status: "This creative corner is under construction",
        comingSoon: "Preparing a platform worthy of EFIPS geniuses 2026",
        quotes: [
            "Creativity is intelligence having fun",
            "Innovation is seeing what everybody has seen and thinking what nobody has thought",
            "Your creative touch is your unique gift to the world",
            "Imagination is the start of innovation; you imagine what you desire, and create what you imagine",
            "Every EFIPS student is a great creative project in the making",
            "Creativity doesn't wait for the perfect moment, it creates it",
            "Turn your imagination into a reality at EFIPS"
        ]
    }
};

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [activeQuotes, setActiveQuotes] = useState<QuoteCard[]>([]);

    const spawnQuote = () => {
        const quotesList = translations[locale].quotes;
        const randomText = quotesList[Math.floor(Math.random() * quotesList.length)];
        
        // ضبط إحداثيات ذكية للموبايل تمنع خروج الكروت عن الشاشة
        const randomTop = Math.floor(Math.random() * 40 + 20) + "%";
        const randomLeft = Math.floor(Math.random() * 50 + 10) + "%";
        const newId = Date.now();

        const newQuote: QuoteCard = {
            id: newId,
            text: randomText,
            top: randomTop,
            left: randomLeft,
            isVaporizing: false
        };

        setActiveQuotes(prev => [...prev, newQuote]);

        setTimeout(() => {
            setActiveQuotes(prev => 
                prev.map(q => q.id === newId ? { ...q, isVaporizing: true } : q)
            );
            setTimeout(() => {
                setActiveQuotes(prev => prev.filter(q => q.id !== newId));
            }, 800);
        }, 2000);
        
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.1;
        audio.play().catch(() => {});
    };

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-6 md:py-16 animate-fade-up relative z-10 text-center antialiased font-black min-h-screen flex flex-col overflow-x-hidden">
            
            {/* جزيئات خلفية عائمة */}
            <div className="absolute inset-0 flex justify-center -z-10 opacity-30 blur-[60px] md:blur-[100px] pointer-events-none">
                <div className="w-40 md:w-96 h-40 md:h-96 bg-red-600 rounded-full translate-x-10 animate-pulse"></div>
                <div className="w-40 md:w-96 h-40 md:h-96 bg-green-600 rounded-full -translate-x-10 animate-pulse delay-1000"></div>
            </div>

            {/* Header Responsive */}
            <div className="mb-6 md:mb-10">
                <h1 className="text-3xl sm:text-5xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-3 leading-tight drop-shadow-md">
                    {t('pageTitle')}
                </h1>
                <p className="text-sm sm:text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-bold opacity-80 italic px-4">
                    {t('subTitle')}
                </p>
            </div>

            {/* منطقة الإبداع التفاعلية - مساحة مرنة */}
            <div className="relative w-full flex-1 min-h-[350px] md:min-h-[600px] flex items-center justify-center py-10">
                
                {/* كروت التبخر الذكية */}
                {activeQuotes.map((quote) => (
                    <div 
                        key={quote.id}
                        style={{ top: quote.top, left: quote.left }}
                        className={`absolute z-50 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-yellow-500/30 shadow-2xl w-[180px] sm:w-[250px] md:w-[380px] transition-all duration-[1000ms] ease-out
                        ${quote.isVaporizing 
                            ? 'opacity-0 -translate-y-32 scale-125 blur-2xl rotate-12' 
                            : 'opacity-100 translate-y-0 scale-100 blur-0 animate-in zoom-in fade-in duration-500'
                        }`}
                    >
                        <span className="text-xl md:text-3xl mb-2 block animate-bounce">✨</span>
                        <p className="text-slate-900 dark:text-white text-[10px] sm:text-xs md:text-lg font-black leading-relaxed">
                            {quote.text}
                        </p>
                    </div>
                ))}

                {/* الشخصية المبدعة - أنيميشن التحليق (Floating) */}
                <div 
                    className="relative w-56 h-56 sm:w-80 sm:h-80 md:w-[35rem] md:h-[35rem] cursor-pointer select-none group active:scale-90 transition-all duration-300 animate-float"
                    onClick={spawnQuote}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-green-600/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <img 
                        src="/creators-mascot.png" 
                        alt="EFIPS Creator" 
                        className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.05)] transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* توهج المصباح المتفاعل */}
                    <div className="absolute top-[12%] right-[22%] w-16 h-16 md:w-28 md:h-28 bg-yellow-400 blur-[40px] md:blur-[70px] opacity-40 animate-pulse group-hover:opacity-70 transition-opacity"></div>
                </div>
            </div>

            {/* حالة تحت الإنشاء - Responsive Glass Panel */}
            <div className="glass-panel max-w-4xl mx-auto p-6 md:p-14 rounded-[2rem] md:rounded-[4rem] border border-white/10 bg-white/20 dark:bg-slate-900/40 shadow-xl mt-6 relative overflow-hidden backdrop-blur-md mb-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 opacity-60"></div>
                <h2 className="text-lg sm:text-2xl md:text-5xl text-red-600 font-black mb-3 flex items-center justify-center gap-3">
                    <span className="animate-spin-slow text-xl md:text-4xl">⚙️</span> {t('status')}
                </h2>
                <p className="text-xs sm:text-base md:text-2xl text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                    {t('comingSoon')}
                </p>
            </div>

            {/* Footer Branding */}
            <div className="mt-auto opacity-40 hover:opacity-100 transition-opacity duration-700 pb-4">
                 <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-1 text-slate-400">EFIPS • 2026</p>
                 <p className="font-black text-slate-950 dark:text-white uppercase text-[9px] md:text-xs border-b-2 border-red-600 inline-block pb-1">Official Librarian: Islam Ahmed</p>
            </div>

            {/* CSS الأنيميشن الخاص بالتحليق */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
