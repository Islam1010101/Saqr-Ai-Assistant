import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const READING_INSPIRATIONS = [
    { icon: "📖", textAr: "اقرأ لترتقي", textEn: "Read to Rise" },
    { icon: "✨", textAr: "مغامرة في كل صفحة", textEn: "Adventure in every page" },
    { icon: "🧠", textAr: "المعرفة قوة", textEn: "Knowledge is Power" },
    { icon: "🚀", textAr: "سافر عبر الكلمات", textEn: "Travel through Words" },
    { icon: "💡", textAr: "نور العقل", textEn: "Light of the Mind" },
    { icon: "💖", textAr: "أحب القراءة", textEn: "I Love Reading" }
];

const translations = {
    ar: {
        title: "الكتب الرقمية",
        desc: "المكتبة في كفّ يدك.. تبني اليومَ فِكْرَ غدِك بأسلوب عصري فريد.",
        arabicLib: "المكتبة العربية",
        englishLib: "المكتبة الإنجليزية",
        arabicDesc: "روائع الأدب العربي، التراث، وتطوير الذات.",
        englishDesc: "أحدث الروايات العالمية، القصص، والألغاز.",
        bubble: "اضغط للإلهام!"
    },
    en: {
        title: "E-BOOKS",
        desc: "The library in your hand, building a mind so grand and modern.",
        arabicLib: "Arabic Library",
        englishLib: "English Library",
        arabicDesc: "Arabic literature, heritage, and self-development.",
        englishDesc: "Global novels, stories, and exciting puzzles.",
        bubble: "Touch for Magic!"
    }
};

interface BurstItem {
    id: number;
    tx: number;
    ty: number;
    rot: number;
    item: typeof READING_INSPIRATIONS[0];
}

const DigitalLibraryPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);

    const handleMascotInteraction = useCallback(() => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);
        
        const id = Date.now();
        const randomItem = READING_INSPIRATIONS[Math.floor(Math.random() * READING_INSPIRATIONS.length)];
        
        const newBurst: BurstItem = {
            id,
            item: randomItem,
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 120 : 300),
            ty: -100 - Math.random() * 120,
            rot: (Math.random() - 0.5) * 40
        };

        setBursts(prev => [...prev, newBurst]);
        setTimeout(() => {
            setBursts(current => current.filter(b => b.id !== id));
        }, 3000); // تقليل وقت البقاء لتجنب تراكم العناصر

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05; audio.play().catch(() => {});
    }, []);

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-20 px-4 md:px-6">
            
            {/* الخلفية الديناميكية الموحدة */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/20 rounded-full blur-[120px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-12 md:gap-24 animate-fade-in-up pb-20">
                
                {/* 1. قسم الترحيب العلوي */}
                <div className="text-center space-y-6 md:space-y-8 max-w-5xl mx-auto relative z-20">
                    <h1 className="text-5xl md:text-[7rem] lg:text-[8rem] font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                        {t('title')}
                    </h1>
                    <p className="text-lg md:text-3xl text-slate-600 dark:text-slate-400 font-bold opacity-80 leading-relaxed italic max-w-3xl mx-auto px-4">
                        {t('desc')}
                    </p>
                    <div className="h-1.5 md:h-2 w-24 md:w-40 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                </div>

                {/* 2. مركز العمليات الرقمي */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-center">
                    
                    {/* الكروت الزجاجية */}
                    <div className="lg:col-span-7 flex flex-col gap-6 md:gap-10 order-2 lg:order-1">
                        
                        <Link to="/digital-library/arabic" className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 md:p-12 lg:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-700 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-start">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-green-50 dark:bg-green-500/10 rounded-[2rem] flex items-center justify-center text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-500 shrink-0">📖</div>
                            <div className="flex-1">
                                <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-3 md:mb-4">{t('arabicLib')}</h3>
                                <p className="text-base md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t('arabicDesc')}</p>
                            </div>
                        </Link>

                        <Link to="/digital-library/english" className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 md:p-12 lg:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-start">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-50 dark:bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-500 shrink-0">🌍</div>
                            <div className="flex-1">
                                <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-3 md:mb-4">{t('englishLib')}</h3>
                                <p className="text-base md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t('englishDesc')}</p>
                            </div>
                        </Link>

                    </div>

                    {/* صقر مع الشعار الذكي خلفه */}
                    <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 relative z-[30]">
                        <div onClick={handleMascotInteraction} className={`relative cursor-pointer transition-transform duration-500 ${isMascotClicked ? 'scale-105' : 'hover:scale-105'}`}>
                            
                            {/* شعار المدرسة الذكي (خلف صقر) */}
                            <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none transition-all duration-1000">
                                <img 
                                    src="https://www.efipslibrary.online/school-logo.png" 
                                    alt="Seal" 
                                    className="w-[120%] h-[120%] object-contain rotate-12 opacity-10 dark:invert" 
                                />
                            </div>

                            {/* كروت الإلهام الطائرة */}
                            {bursts.map((burst) => (
                                <div key={burst.id} 
                                    className="absolute z-[100] bg-white dark:bg-slate-800 px-6 py-3 md:px-8 md:py-4 rounded-[2rem] border border-slate-200 dark:border-slate-600 shadow-xl animate-burst-steady pointer-events-none flex items-center gap-3 md:gap-4"
                                    style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                    <span className="text-2xl md:text-4xl">{burst.item.icon}</span>
                                    <span className="text-sm md:text-lg font-black text-slate-800 dark:text-slate-200 whitespace-nowrap">{isAr ? burst.item.textAr : burst.item.textEn}</span>
                                </div>
                            ))}

                            <img src="/saqr-digital.png" alt="Saqr Mascot" className="h-64 md:h-[500px] lg:h-[600px] object-contain drop-shadow-2xl relative z-10 animate-float" />
                            
                            {/* فقاعة المحادثة */}
                            <div className="absolute -top-4 -right-4 md:-top-10 md:-right-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 md:p-6 lg:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-2xl text-sm md:text-2xl font-black text-red-600 dark:text-red-400 animate-bounce z-20">
                                {t('bubble')}
                                <div className="absolute -bottom-2 md:-bottom-4 left-6 md:left-10 w-5 h-5 md:w-8 md:h-8 rotate-45 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                
                @keyframes burst-steady {
                  0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
                  10% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; }
                  85% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
                  100% { transform: translate(var(--tx), calc(var(--ty) - 30px)) scale(0.8) rotate(var(--rot)); opacity: 0; }
                }
                .animate-burst-steady { animation: burst-steady 2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                
                @keyframes fade-in-up {
                  0% { opacity: 0; transform: translateY(20px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default DigitalLibraryPage;
