import React, { useState } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "بوابة المبدعين",
        subTitle: "اضغط على المبدع لتستمد منه إلهامك اليومي",
        status: "هذا الركن الإبداعي تحت الإنشاء",
        comingSoon: "نجهز لكم منصة تليق بعباقرة صقر الإمارات 2026",
        quotes: [
            "الإبداع هو الذكاء وهو يستمتع بوقتة",
            "الابتكار هو رؤية ما يراه الجميع، والتفكير بما لم يفكر به أحد",
            "بصمتك المبدعة هي هديتك الفريدة للعالم",
            "الخيال هو بداية الابتكار؛ تتخيل ما ترغب، وتصنع ما تتخيل",
            "كل طالب في مدرسة صقر هو مشروع مبدع عظيم"
        ]
    },
    en: {
        pageTitle: "Creators' Portal",
        subTitle: "Click the creator to get your daily dose of inspiration",
        status: "This creative corner is under construction",
        comingSoon: "Preparing a platform worthy of EFIPS geniuses 2026",
        quotes: [
            "Creativity is intelligence having fun",
            "Innovation is seeing what everybody has seen and thinking what nobody has thought",
            "Your creative touch is your unique gift to the world",
            "Imagination is the start of innovation; you imagine what you desire, and create what you imagine",
            "Every EFIPS student is a great creative project in the making"
        ]
    }
};

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [currentQuote, setCurrentQuote] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    const handleInspiration = () => {
        const quotes = translations[locale].quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote(randomQuote);
        setIsAnimating(true);
        
        // تشغيل صوت خفيف للإبداع إذا رغبت
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => {});

        setTimeout(() => setIsAnimating(false), 3000);
    };

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 text-center antialiased font-black overflow-hidden">
            
            {/* مؤثرات خلفية سحرية */}
            <div className="absolute inset-0 flex justify-center -z-10 opacity-30 blur-[120px] pointer-events-none">
                <div className="w-64 md:w-96 h-64 md:h-96 bg-red-600 rounded-full translate-x-20 animate-pulse"></div>
                <div className="w-64 md:w-96 h-64 md:h-96 bg-green-600 rounded-full -translate-x-20 animate-pulse delay-1000"></div>
            </div>

            <h1 className="text-4xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-4 leading-tight">
                {t('pageTitle')}
            </h1>

            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-12 font-bold italic">
                {t('subTitle')}
            </p>

            {/* الشخصية المبدعة - حجم كبير وتفاعلي */}
            <div className="relative inline-block mb-16 select-none cursor-pointer" onClick={handleInspiration}>
                
                {/* فقاعة الإلهام الزجاجية */}
                {currentQuote && (
                    <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 md:w-96 p-6 rounded-[2rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl border-2 border-yellow-500/50 z-50 transition-all duration-500 animate-in zoom-in slide-in-from-bottom-10 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                        <p className="text-slate-900 dark:text-white text-sm md:text-lg font-black leading-relaxed">
                            "{currentQuote}"
                        </p>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-slate-900 rotate-45 border-r-2 border-b-2 border-yellow-500/50"></div>
                    </div>
                )}

                {/* الشخصية - حجم ضخم للموبايل والديسكتوب */}
                <div className={`relative w-64 h-64 sm:w-80 sm:h-80 md:w-[28rem] md:h-[28rem] transition-all duration-500 transform ${isAnimating ? 'scale-110 rotate-3' : 'hover:scale-105'}`}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-green-600/20 rounded-[4rem] blur-3xl opacity-50 animate-pulse"></div>
                    <img 
                        src="/creators-mascot.png" 
                        alt="EFIPS Creator" 
                        className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] filter dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                    />
                    
                    {/* شرارات إبداعية تظهر عند الضغط */}
                    {isAnimating && (
                        <div className="absolute inset-0 pointer-events-none">
                            <span className="absolute top-0 left-0 text-4xl animate-ping">✨</span>
                            <span className="absolute bottom-10 right-0 text-4xl animate-ping delay-300">💡</span>
                            <span className="absolute top-20 right-10 text-4xl animate-ping delay-700">🎨</span>
                        </div>
                    )}
                </div>
            </div>

            {/* حالة تحت الإنشاء الأنيقة */}
            <div className="glass-panel max-w-4xl mx-auto p-8 md:p-12 rounded-[3rem] border border-white/20 bg-white/40 dark:bg-slate-900/60 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600"></div>
                <h2 className="text-2xl md:text-5xl text-red-600 font-black mb-6 flex items-center justify-center gap-4">
                    <span className="animate-spin-slow">⚙️</span> {t('status')}
                </h2>
                <p className="text-lg md:text-2xl text-slate-800 dark:text-slate-200 font-bold leading-relaxed mb-8">
                    {t('comingSoon')}
                </p>
                
                {/* عداد انتظار رمزي لعام 2026 */}
                <div className="flex justify-center gap-6 md:gap-12 text-slate-400 dark:text-slate-500 font-black text-xs md:text-sm uppercase tracking-[0.3em]">
                    <div className="flex flex-col gap-2"><span className="text-slate-900 dark:text-white text-xl md:text-3xl tracking-normal">2026</span>FUTURE</div>
                    <div className="flex flex-col gap-2"><span className="text-slate-900 dark:text-white text-xl md:text-3xl tracking-normal">EFIPS</span>GENIUS</div>
                    <div className="flex flex-col gap-2"><span className="text-slate-900 dark:text-white text-xl md:text-3xl tracking-normal">CORE</span>CREATIVITY</div>
                </div>
            </div>

            <div className="mt-20 opacity-40">
                 <p className="text-[10px] font-black uppercase tracking-[0.8em] mb-3 text-slate-400">EFIPS Library • Talent Management Unit • AI Powered</p>
                 <p className="font-black text-slate-900 dark:text-white uppercase text-xs border-b-2 border-green-600 inline-block pb-1">Official Librarian: Islam Ahmed</p>
            </div>
        </div>
    );
};

export default CreatorsPortalPage;
