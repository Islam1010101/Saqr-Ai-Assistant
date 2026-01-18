import React, { useState } from 'react';
import { useLanguage } from '../App';

interface QuoteCard {
    id: number;
    text: string;
    top: string;
    left: string;
    isVaporizing: boolean; // حالة التبخر
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
            " اجعل من خيالك واقعاً تبهر به العالم في مدرسة صقر الإمارات"
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
        
        // توليد إحداثيات عشوائية حول الشخصية
        const randomTop = Math.floor(Math.random() * 50 + 15) + "%";
        const randomLeft = Math.floor(Math.random() * 60 + 10) + "%";
        const newId = Date.now();

        const newQuote: QuoteCard = {
            id: newId,
            text: randomText,
            top: randomTop,
            left: randomLeft,
            isVaporizing: false
        };

        setActiveQuotes(prev => [...prev, newQuote]);

        // يبدأ "التبخر" بعد ثانيتين بناءً على طلبك
        setTimeout(() => {
            setActiveQuotes(prev => 
                prev.map(q => q.id === newId ? { ...q, isVaporizing: true } : q)
            );
            
            // الحذف النهائي من الصفحة بعد اكتمال تأثير التبخر (800ms إضافية)
            setTimeout(() => {
                setActiveQuotes(prev => prev.filter(q => q.id !== newId));
            }, 800);
        }, 2000);
        
        // صوت "ومضة" إبداعية خفيف
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.1;
        audio.play().catch(() => {});
    };

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 text-center antialiased font-black min-h-[85vh]">
            
            {/* خلفية تفاعلية وطنية */}
            <div className="absolute inset-0 flex justify-center -z-10 opacity-20 blur-[100px] pointer-events-none">
                <div className="w-64 md:w-96 h-64 md:h-96 bg-red-600 rounded-full translate-x-20 animate-pulse"></div>
                <div className="w-64 md:w-96 h-64 md:h-96 bg-green-600 rounded-full -translate-x-20 animate-pulse delay-1000"></div>
            </div>

            <h1 className="text-4xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-4 leading-tight drop-shadow-sm">
                {t('pageTitle')}
            </h1>

            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-12 font-bold opacity-80 italic">
                {t('subTitle')}
            </p>

            {/* مساحة التفاعل الرئيسية */}
            <div className="relative w-full max-w-4xl mx-auto min-h-[450px] md:min-h-[650px] flex items-center justify-center">
                
                {/* نظام كروت التبخر */}
                {activeQuotes.map((quote) => (
                    <div 
                        key={quote.id}
                        style={{ top: quote.top, left: quote.left }}
                        className={`absolute z-50 p-6 md:p-8 rounded-[2.5rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-yellow-500/20 shadow-2xl max-w-[260px] md:max-w-[380px] transition-all duration-[800ms] ease-in-out
                        ${quote.isVaporizing 
                            ? 'opacity-0 -translate-y-20 scale-110 blur-xl' // تأثير التبخر للأعلى مع التمويه
                            : 'opacity-100 translate-y-0 scale-100 blur-0 animate-in zoom-in fade-in duration-500'
                        }`}
                    >
                        <span className="text-3xl mb-3 block animate-pulse">💡</span>
                        <p className="text-slate-900 dark:text-white text-sm md:text-lg font-black leading-relaxed">
                            {quote.text}
                        </p>
                    </div>
                ))}

                {/* الشخصية المبدعة (كبيرة جداً وتفاعلية) */}
                <div 
                    className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[38rem] md:h-[38rem] cursor-pointer select-none group active:scale-90 transition-all duration-300"
                    onClick={spawnQuote}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-green-600/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                    <img 
                        src="/creators-mascot.png" 
                        alt="EFIPS Creator" 
                        className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* هالة المصباح الذكي */}
                    <div className="absolute top-[15%] right-[25%] w-28 h-28 bg-yellow-400 blur-[70px] opacity-40 animate-pulse group-hover:opacity-60 transition-opacity"></div>
                </div>
            </div>

            {/* قسم تحت الإنشاء المودرن */}
            <div className="glass-panel max-w-4xl mx-auto p-8 md:p-14 rounded-[3.5rem] border border-white/10 bg-white/20 dark:bg-slate-900/40 shadow-2xl mt-12 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 opacity-50"></div>
                <h2 className="text-2xl md:text-5xl text-red-600 font-black mb-4 flex items-center justify-center gap-4 uppercase tracking-tighter">
                    <span className="animate-spin-slow">⚙️</span> {t('status')}
                </h2>
                <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-300 font-bold leading-relaxed opacity-90">
                    {t('comingSoon')}
                </p>
            </div>

            <div className="mt-20 opacity-30 hover:opacity-60 transition-opacity duration-500">
                 <p className="text-[10px] font-black uppercase tracking-[0.8em] mb-2">EFIPS Library 2026</p>
                 <p className="font-black text-slate-950 dark:text-white uppercase text-xs border-b-2 border-red-600 inline-block pb-1">Official Librarian: Islam Ahmed</p>
            </div>
        </div>
    );
};

export default CreatorsPortalPage;
