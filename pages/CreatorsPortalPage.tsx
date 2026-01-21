import React, { useState, useCallback } from 'react';
import { useLanguage } from '../App';

interface QuoteBurst {
    id: number;
    text: string;
    tx: number;
    ty: number;
    rot: number;
    color: string;
}

const translations = {
    ar: {
        pageTitle: "بوابة المبدعين",
        subTitle: "اضغط على المبدع لتستمد منه ومضات الإلهام",
        status: "الركن الإبداعي تحت التطوير",
        comingSoon: "نجهز لكم منصة تليق بمبدعي مدرسة صقر الإمارات 2026",
        bubble: "المسني للابتكار!",
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
        bubble: "Touch for Magic!",
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
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [bursts, setBursts] = useState<QuoteBurst[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);

    const spawnQuote = useCallback(() => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);

        const quotesList = translations[locale].quotes;
        const randomText = quotesList[Math.floor(Math.random() * quotesList.length)];
        const id = Date.now();

        // إحداثيات مطابقة تماماً للصفحة الرئيسية والمكتبة الرقمية
        const newBurst: QuoteBurst = {
            id,
            text: randomText,
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 140 : 350),
            ty: -120 - Math.random() * 150,
            rot: (Math.random() - 0.5) * 50,
            color: Math.random() > 0.5 ? 'border-red-600' : 'border-green-600'
        };

        setBursts(prev => [...prev, newBurst]);

        // الاختفاء التام بعد 5 ثوانٍ بالضبط
        setTimeout(() => {
            setBursts(current => current.filter(b => b.id !== id));
        }, 5000);
        
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05; audio.play().catch(() => {});
    }, [locale]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center gap-12 md:gap-24 animate-fade-up font-black antialiased relative">
            
            {/* 1. قسم الترحيب (نفس ترتيب الرئيسية) */}
            <div className="text-center space-y-6 md:space-y-10 max-w-5xl relative z-20">
                <h1 className="text-5xl md:text-[9.5rem] font-black text-slate-950 dark:text-white tracking-tighter leading-none drop-shadow-2xl">
                    {t('pageTitle')}
                </h1>
                <p className="text-lg md:text-4xl text-slate-600 dark:text-slate-400 font-bold opacity-80 leading-relaxed italic max-w-3xl mx-auto">
                    {t('subTitle')}
                </p>
                <div className="h-2 w-40 md:w-80 bg-red-600 mx-auto rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse"></div>
            </div>

            {/* 2. مركز التفاعل الإبداعي */}
            <div className="relative flex items-center justify-center w-full min-h-[400px] md:min-h-[700px]">
                
                <div onClick={spawnQuote} className={`relative cursor-pointer transition-transform duration-500 ${isMascotClicked ? 'scale-110' : 'hover:scale-105'}`}>
                    
                    {/* شعار المدرسة المائل (12 درجة) والذكي */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none transition-all duration-1000">
                        <img 
                            src="/school-logo.png" 
                            alt="Seal" 
                            className="w-[140%] h-[140%] object-contain rotate-12 blur-[1px] opacity-10 dark:opacity-20 logo-smart-filter" 
                        />
                    </div>

                    {/* كروت الانفجار الإبداعي - تظهر فوق كل شيء (z-[100]) ولمدة 5 ثوانٍ */}
                    {bursts.map((burst) => (
                        <div key={burst.id} 
                            className={`absolute z-[100] bg-white dark:bg-slate-900 px-6 py-4 md:px-12 md:py-8 rounded-[2rem] md:rounded-[4rem] border-4 ${burst.color} shadow-[0_30px_80px_rgba(0,0,0,0.3)] animate-burst-long pointer-events-none flex flex-col items-center gap-4 w-[240px] md:w-[600px]`}
                            style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                            <span className="text-3xl md:text-7xl animate-bounce">💡</span>
                            <p className="text-xs md:text-4xl font-black text-slate-950 dark:text-white text-center leading-tight">
                                {burst.text}
                            </p>
                        </div>
                    ))}

                    <img src="/creators-mascot.png" alt="EFIPS Creator" className="h-72 md:h-[750px] object-contain drop-shadow-[0_40px_100px_rgba(234,179,8,0.2)] relative z-10 animate-float" />
                    
                    <div className="absolute -top-6 -right-6 md:-top-16 md:-right-16 glass-panel p-4 md:p-10 rounded-[2.5rem] md:rounded-[4.5rem] shadow-3xl border-yellow-500/30 text-xs md:text-3xl font-black text-yellow-600 dark:text-white animate-bounce z-20 backdrop-blur-3xl">
                        {t('bubble')}
                        <div className="absolute -bottom-2 md:-bottom-5 left-8 md:left-16 w-5 h-5 md:w-10 md:h-10 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-yellow-500/20"></div>
                    </div>
                </div>
            </div>

            {/* 3. بانر حالة التطوير */}
            <div className="glass-panel w-full max-w-5xl p-8 md:p-20 rounded-[3.5rem] md:rounded-[7rem] border-2 border-white/10 bg-white/40 dark:bg-slate-950/60 shadow-3xl backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600"></div>
                <h2 className="text-2xl md:text-7xl text-red-600 dark:text-red-500 font-black mb-6 flex items-center justify-center gap-6">
                    <span className="animate-spin-slow text-3xl md:text-7xl">⚙️</span> {t('status')}
                </h2>
                <p className="text-base md:text-4xl text-slate-800 dark:text-slate-200 font-black leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
                    {t('comingSoon')}
                </p>
            </div>

            {/* الفوتر */}
            <div className="mt-12 md:mt-20 opacity-30 text-center pb-10">
                <p className="font-black text-slate-950 dark:text-white text-sm md:text-5xl italic tracking-tighter uppercase">EFIPS Creative Gateway • 2026</p>
                <div className="h-1.5 w-32 md:w-64 bg-green-600 mx-auto mt-6 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
            </div>

            <style>{`
                @keyframes burst-long {
                    0% { transform: translate(0, 0) scale(0.4) rotate(0deg); opacity: 0; filter: blur(10px); }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; filter: blur(0px); }
                    85% { transform: translate(calc(var(--tx) * 1.05), calc(var(--ty) * 1.05)) scale(1); opacity: 1; filter: blur(0px); }
                    100% { transform: translate(calc(var(--tx) * 1.1), calc(var(--ty) - 50px)) scale(1.3) rotate(calc(var(--rot) * 1.8)); opacity: 0; filter: blur(40px); }
                }
                .animate-burst-long { animation: burst-long 5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
                .animate-spin-slow { animation: spin 12s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .glass-panel { backdrop-filter: blur(50px); background: rgba(255, 255, 255, 0.05); }
                .dark .logo-smart-filter { filter: brightness(0) invert(1); }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
