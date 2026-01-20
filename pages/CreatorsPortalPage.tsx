import React, { useState, useCallback } from 'react';
import { useLanguage } from '../App';

interface QuoteCard {
    id: number;
    text: string;
    top: string;
    left: string;
    isVaporizing: boolean;
    color: string;
}

const translations = {
    ar: {
        pageTitle: "بوابة المبدعين",
        subTitle: "اضغط على المبدع لتستمد منه ومضات الإلهام",
        status: "الركن الإبداعي تحت التطوير",
        comingSoon: "نجهز لكم منصة تليق بمبدعي مدرسة صقر الإمارات 2026",
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
        status: "Creative Hub Under Development",
        comingSoon: "Preparing a platform worthy of EFIPS Students' talents 2026",
        quotes: [
            "Creativity is intelligence having fun",
            "Innovation is seeing what everybody has seen and thinking what nobody has thought",
            "Your creative touch is your unique gift to the world",
            "Imagination is the start of innovation",
            "Every EFIPS student is a great creative project",
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
        
        // إحداثيات ذكية تمنع خروج الكروت عن الشاشة في الجوال
        const randomTop = Math.floor(Math.random() * 40 + 15) + "%";
        const randomLeft = Math.floor(Math.random() * 40 + 5) + "%";
        const newId = Date.now();

        const newQuote: QuoteCard = {
            id: newId,
            text: randomText,
            top: randomTop,
            left: randomLeft,
            isVaporizing: false,
            color: Math.random() > 0.5 ? 'bg-yellow-500' : 'bg-red-600'
        };

        setActiveQuotes(prev => [...prev, newQuote]);

        // تبخير الكارت بعد 4 ثوانٍ ليختفي تماماً عند الثانية الخامسة
        setTimeout(() => {
            setActiveQuotes(prev => 
                prev.map(q => q.id === newId ? { ...q, isVaporizing: true } : q)
            );
            setTimeout(() => {
                setActiveQuotes(prev => prev.filter(q => q.id !== newId));
            }, 1000);
        }, 4000);
        
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05;
        audio.play().catch(() => {});
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 text-center antialiased font-black min-h-screen flex flex-col overflow-hidden">
            
            {/* توهج خلفي ملكي للدارك مود */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-red-600/5 dark:bg-red-500/10 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-green-600/5 dark:bg-green-500/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
            </div>

            {/* العنوان الإمبراطوري */}
            <div className="mb-10 md:mb-20">
                <h1 className="text-4xl md:text-9xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 drop-shadow-2xl">
                    {t('pageTitle')}
                </h1>
                <p className="text-lg md:text-4xl text-slate-600 dark:text-slate-400 font-bold opacity-90 italic px-6 leading-tight">
                    {t('subTitle')}
                </p>
            </div>

            {/* منطقة الإبداع (المركزية) */}
            <div className="relative w-full flex-1 min-h-[400px] md:min-h-[700px] flex items-center justify-center py-10 md:py-20">
                
                {/* كروت الإلهام (Neon Card Style) */}
                {activeQuotes.map((quote) => (
                    <div 
                        key={quote.id}
                        style={{ top: quote.top, left: quote.left }}
                        className={`absolute z-50 p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 shadow-3xl w-[220px] sm:w-[320px] md:w-[550px] transition-all duration-[1000ms] ease-out
                        ${quote.isVaporizing 
                            ? 'opacity-0 -translate-y-40 scale-150 blur-[50px] rotate-12' 
                            : 'opacity-100 translate-y-0 scale-100 blur-0 animate-in zoom-in fade-in duration-500 shadow-[0_0_50px_rgba(234,179,8,0.2)]'
                        }`}
                    >
                        {/* حافة النيون الجانبية */}
                        <div className={`absolute top-0 start-0 w-2 h-full ${quote.color} shadow-[2px_0_20px_rgba(234,179,8,0.5)]`}></div>
                        
                        <span className="text-3xl md:text-7xl mb-4 block animate-bounce">✨</span>
                        <p className="text-slate-900 dark:text-white text-sm md:text-4xl font-black leading-tight tracking-tight">
                            {quote.text}
                        </p>
                    </div>
                ))}

                {/* الشخصية المبدعة بتوهج نيون دارك */}
                <div 
                    className="relative w-64 h-64 sm:w-96 sm:h-96 md:w-[45rem] md:h-[45rem] cursor-pointer select-none group active:scale-95 transition-all duration-500 animate-float"
                    onClick={spawnQuote}
                >
                    {/* هالة نيون خلف الشخصية */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-yellow-400/10 to-green-600/20 rounded-full blur-[100px] opacity-40 dark:opacity-60 animate-pulse"></div>
                    
                    <img 
                        src="/creators-mascot.png" 
                        alt="EFIPS Creator" 
                        className="w-full h-full object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_0_80px_rgba(255,255,255,0.1)] transition-transform duration-700 group-hover:scale-110 group-active:rotate-3"
                    />
                    
                    {/* توهج المصباح الذكي */}
                    <div className="absolute top-[12%] right-[22%] w-24 h-24 md:w-48 md:h-48 bg-yellow-400 blur-[60px] md:blur-[120px] opacity-50 animate-pulse group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>

            {/* بانر تحت الإنشاء (Neon Glass) */}
            <div className="glass-panel max-w-5xl mx-auto p-8 md:p-20 rounded-[3rem] md:rounded-[6rem] border-2 border-white/10 bg-white/30 dark:bg-slate-950/60 shadow-3xl mt-12 relative overflow-hidden backdrop-blur-xl mb-20 group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
                
                <h2 className="text-2xl md:text-7xl text-red-600 dark:text-red-500 font-black mb-6 flex items-center justify-center gap-6">
                    <span className="animate-spin-slow text-3xl md:text-7xl">⚙️</span> {t('status')}
                </h2>
                <p className="text-base md:text-4xl text-slate-800 dark:text-slate-200 font-black leading-tight px-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {t('comingSoon')}
                </p>
            </div>

            {/* الفوتر الملكي */}
            <div className="mt-auto opacity-30 hover:opacity-100 transition-all duration-700 pb-10">
                 <p className="text-[10px] md:text-xl font-black uppercase tracking-[0.6em] mb-4 text-slate-400">EFIPS • CREATORS • 2026</p>
                 <div className="h-1.5 w-32 md:w-64 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-30px) rotate(2deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-spin-slow { animation: spin 12s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
