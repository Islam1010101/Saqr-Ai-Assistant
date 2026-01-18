import React, { useState } from 'react';
import { useLanguage } from '../App';

interface QuoteCard {
    id: number;
    text: string;
    top: string;
    left: string;
}

const translations = {
    ar: {
        pageTitle: "بوابة المبدعين",
        subTitle: "المس المبدع لتكتشف كروت الإلهام الخاصة بك",
        status: "هذا الركن الإبداعي تحت الإنشاء",
        comingSoon: "نجهز لكم منصة تليق بعباقرة صقر الإمارات 2026",
        quotes: [
            "الإبداع هو الذكاء وهو يستمتع بوقتة",
            "الابتكار هو رؤية ما يراه الجميع، والتفكير بما لم يفكر به أحد",
            "بصمتك المبدعة هي هديتك الفريدة للعالم",
            "الخيال هو بداية الابتكار؛ تتخيل ما ترغب، وتصنع ما تتخيل",
            "كل طالب في مدرسة صقر هو مشروع مبدع عظيم",
            "الإبداع لا ينتظر اللحظة المثالية، بل يخلقها من العدم",
            "اجعل من خيالك واقعاً تبهر به العالم في مدرسة صقر"
        ]
    },
    en: {
        pageTitle: "Creators' Portal",
        subTitle: "Touch the creator to discover your inspiration cards",
        status: "This creative corner is under construction",
        comingSoon: "Preparing a platform worthy of EFIPS geniuses 2026",
        quotes: [
            "Creativity is intelligence having fun",
            "Innovation is seeing what everybody has seen and thinking what nobody has thought",
            "Your creative touch is your unique gift to the world",
            "Imagination is the start of innovation; you imagine what you desire, and create what you imagine",
            "Every EFIPS student is a great creative project in the making",
            "Creativity doesn't wait for the perfect moment, it creates it",
            "Turn your imagination into a reality at Saqr School"
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
        
        // توليد إحداثيات عشوائية للكارت حول الشخصية
        const randomTop = Math.floor(Math.random() * 60 + 10) + "%";
        const randomLeft = Math.floor(Math.random() * 60 + 10) + "%";
        const newId = Date.now();

        const newQuote: QuoteCard = {
            id: newId,
            text: randomText,
            top: randomTop,
            left: randomLeft
        };

        setActiveQuotes(prev => [...prev, newQuote]);

        // إعطاء فرصة كافية للقراءة (7 ثوانٍ) قبل التلاشي
        setTimeout(() => {
            setActiveQuotes(prev => prev.filter(q => q.id !== newId));
        }, 7000);
        
        // تأثير صوتي بسيط
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.15;
        audio.play().catch(() => {});
    };

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 text-center antialiased font-black min-h-[80vh]">
            
            {/* خلفية تفاعلية وطنية */}
            <div className="absolute inset-0 flex justify-center -z-10 opacity-20 blur-[100px] pointer-events-none">
                <div className="w-64 md:w-96 h-64 md:h-96 bg-red-600 rounded-full translate-x-20"></div>
                <div className="w-64 md:w-96 h-64 md:h-96 bg-green-600 rounded-full -translate-x-20"></div>
            </div>

            <h1 className="text-4xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-4 leading-tight">
                {t('pageTitle')}
            </h1>

            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-12 font-bold opacity-80">
                {t('subTitle')}
            </p>

            {/* مساحة التفاعل الرئيسية */}
            <div className="relative w-full max-w-4xl mx-auto min-h-[400px] md:min-h-[600px] flex items-center justify-center">
                
                {/* كروت المقولات الطائرة */}
                {activeQuotes.map((quote) => (
                    <div 
                        key={quote.id}
                        style={{ top: quote.top, left: quote.left }}
                        className="absolute z-50 p-5 md:p-8 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-yellow-500/30 shadow-2xl max-w-[250px] md:max-w-[350px] animate-in zoom-in fade-in slide-in-from-bottom-10 duration-1000"
                    >
                        <span className="text-2xl mb-2 block">✨</span>
                        <p className="text-slate-900 dark:text-white text-xs md:text-base font-black leading-relaxed">
                            {quote.text}
                        </p>
                    </div>
                ))}

                {/* الشخصية المبدعة (كبيرة جداً) */}
                <div 
                    className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[35rem] md:h-[35rem] cursor-pointer select-none group active:scale-95 transition-all duration-300"
                    onClick={spawnQuote}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-green-600/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                    <img 
                        src="/creators-mascot.png" 
                        alt="EFIPS Creator" 
                        className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* هالة الضوء حول المصباح */}
                    <div className="absolute top-[15%] right-[25%] w-24 h-24 bg-yellow-400 blur-[60px] opacity-30 animate-pulse"></div>
                </div>
            </div>

            {/* حالة تحت الإنشاء المختصرة */}
            <div className="glass-panel max-w-4xl mx-auto p-8 md:p-12 rounded-[3rem] border border-white/10 bg-white/30 dark:bg-slate-900/50 shadow-xl mt-12 relative overflow-hidden">
                <h2 className="text-2xl md:text-5xl text-red-600 font-black mb-4 flex items-center justify-center gap-4 uppercase tracking-tighter">
                    <span className="animate-spin-slow">⚙️</span> {t('status')}
                </h2>
                <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-300 font-bold leading-relaxed opacity-90">
                    {t('comingSoon')}
                </p>
                
                {/* أنيميشن بسيط بألوان العلم */}
                <div className="flex justify-center gap-3 mt-8">
                    <div className="w-10 h-1 bg-red-600 rounded-full"></div>
                    <div className="w-10 h-1 bg-green-600 rounded-full"></div>
                    <div className="w-10 h-1 bg-slate-400 rounded-full"></div>
                </div>
            </div>

            <div className="mt-20 opacity-30">
                 <p className="text-[10px] font-black uppercase tracking-[0.8em] mb-2">EFIPS Library • Talent Portal • 2026</p>
                 <p className="font-black text-slate-950 dark:text-white uppercase text-xs border-b-2 border-red-600 inline-block pb-1">Official Librarian: Islam Soliman</p>
            </div>
        </div>
    );
};

export default CreatorsPortalPage;
