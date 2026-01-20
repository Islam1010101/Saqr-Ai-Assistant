import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "مستقبل المعرفة في صقر الإمارات",
        subWelcome: "بوابتك الذكية للوصول إلى كنوز المعرفة الرقمية والورقية بأسلوب عصري.",
        manualSearch: "البحث اليدوي",
        manualDesc: "ابحث عن الكتب المطبوعة في مكتبة المدرسة عبر رقم الرف أو العنوان.",
        smartSearch: "اسأل صقر (AI)",
        smartDesc: "مساعدك الذكي الذي يحلل استفساراتك ويقترح عليك أفضل المصادر الرقمية.",
        digitalLibrary: "المكتبة الإلكترونية",
        digitalDesc: "تصفح وحمل مئات الروايات والكتب الرقمية العالمية في أي وقت.",
        bubble: "المسني للإلهام!",
        visitorsLabel: "إجمالي التفاعل مع البوابة",
        homelandTitle: "تعرف على وطني 🇦🇪"
    },
    en: {
        welcome: "Future of Knowledge at E.F.I.P.S",
        subWelcome: "Your smart gateway to access digital and physical knowledge resources.",
        manualSearch: "Manual Search",
        manualDesc: "Find physical books in the School's Library by shelf number or title.",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Your smart assistant that analyzes queries and suggests best digital resources.",
        digitalLibrary: "Digital Library",
        digitalDesc: "Browse and download hundreds of global digital novels and books.",
        bubble: "Touch for inspiration!",
        visitorsLabel: "Total Portal Engagement",
        homelandTitle: "Know My Homeland 🇦🇪"
    }
};

// --- قاعدة بيانات حقائق عن دولة الإمارات (تتغير يومياً) ---
const HOMELAND_FACTS = [
    { ar: "تأسست دولة الإمارات العربية المتحدة في الثاني من ديسمبر عام 1971م على يد الشيخ زايد بن سلطان آل نهيان، طيب الله ثراه.", en: "The UAE was founded on Dec 2, 1971, by Sheikh Zayed bin Sultan Al Nahyan." },
    { ar: "هل تعلم أن برج خليفة في دبي هو أطول بناء شيده الإنسان في العالم بارتفاع 828 متراً؟", en: "Did you know Burj Khalifa is the tallest man-made structure in the world at 828m?" },
    { ar: "تعتبر 'نخلة جميرا' أكبر جزيرة اصطناعية في العالم، ويمكن رؤيتها من الفضاء الخارجي.", en: "Palm Jumeirah is the world's largest man-made island, visible from space." },
    { ar: "مسبار الأمل الإماراتي هو أول مهمة عربية تصل إلى مدار كوكب المريخ لاستكشاف غلافه الجوي.", en: "The Hope Probe is the first Arab mission to reach Mars to explore its atmosphere." },
    { ar: "تضم دولة الإمارات سبع إمارات متحدة هي: أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة.", en: "The UAE consists of seven emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah." },
    { ar: "تشتهر الإمارات بشجرة 'الغاف' التي تعد رمزاً للصمود والصبر في بيئة الصحراء، وهي الشجرة الوطنية للدولة.", en: "The Ghaf tree is the UAE national tree, symbolizing resilience in the desert." }
];

const KNOWLEDGE_CARDS = [
    { icon: "📜", textAr: "بحث رقمي", textEn: "Digital Research" },
    { icon: "💡", textAr: "فكرة مبتكرة", textEn: "Innovative Idea" },
    { icon: "🤖", textAr: "ذكاء صقر", textEn: "Saqr AI" },
    { icon: "📚", textAr: "مصادر المعرفة", textEn: "Knowledge Sources" },
    { icon: "🇦🇪", textAr: "هوية وطنية", textEn: "UAE Identity" },
    { icon: "🚀", textAr: "طموح 2026", textEn: "2026 Ambition" }
];

interface BurstItem {
    id: number; tx: number; ty: number; rot: number; item: typeof KNOWLEDGE_CARDS[0];
}

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);
    const [visitorCount, setVisitorCount] = useState(0);

    // اختيار معلومة الوطن بناءً على اليوم
    const dailyFact = useMemo(() => {
        const day = new Date().getDate();
        return HOMELAND_FACTS[day % HOMELAND_FACTS.length];
    }, []);

    useEffect(() => {
        const storedCount = parseInt(localStorage.getItem('efips_total_visitors') || '1240');
        const newCount = storedCount + 1;
        localStorage.setItem('efips_total_visitors', newCount.toString());
        let start = 0;
        const timer = setInterval(() => {
            start += newCount / 100;
            if (start >= newCount) { setVisitorCount(newCount); clearInterval(timer); } 
            else { setVisitorCount(Math.floor(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, []);

    const handleMascotInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);
        const id = Date.now();
        const newBursts: BurstItem[] = Array.from({ length: 2 }).map((_, i) => ({
            id: Date.now() + i,
            item: KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)],
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 120 : 350), 
            ty: -80 - Math.random() * 150,
            rot: (Math.random() - 0.5) * 40
        }));
        setBursts(prev => [...prev, ...newBursts]);
        newBursts.forEach(b => { setTimeout(() => { setBursts(current => current.filter(item => item.id !== b.id)); }, 5000); });
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05; audio.play().catch(() => {});
    }, []);

    return (
        <div className="relative min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-3 md:p-10 overflow-hidden select-none animate-fade-up font-black antialiased">
            
            {/* الحاوية الملكية العلوية */}
            <div className="relative z-10 glass-panel w-full max-w-7xl rounded-[3.5rem] md:rounded-[6rem] overflow-hidden shadow-3xl border-none bg-white/80 dark:bg-slate-950/75 backdrop-blur-3xl transition-all duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 p-6 md:p-24 items-center">
                    
                    <div className="flex flex-col text-center lg:text-start space-y-10 md:space-y-20 order-2 lg:order-1 relative z-20">
                        <div className="space-y-4 md:space-y-10">
                            <h1 className="text-4xl md:text-8xl lg:text-9xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter drop-shadow-2xl">{t('welcome')}</h1>
                            <p className="text-base md:text-4xl text-slate-600 dark:text-slate-400 font-bold max-w-3xl mx-auto lg:mx-0 leading-relaxed opacity-90 italic">{t('subWelcome')}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 md:gap-8">
                            <Link to="/search" className="glass-panel border-4 border-slate-200 dark:border-white/10 hover:border-red-600 dark:hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] py-5 md:py-10 px-8 md:px-16 text-lg md:text-4xl font-black rounded-3xl md:rounded-[4rem] text-slate-900 dark:text-white transition-all active:scale-95 text-center flex items-center justify-center gap-4">🔍 {t('manualSearch')}</Link>
                            <Link to="/smart-search" className="glass-panel border-4 border-slate-200 dark:border-white/10 hover:border-green-600 dark:hover:border-green-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] py-5 md:py-10 px-8 md:px-16 text-lg md:text-4xl font-black rounded-3xl md:rounded-[4rem] text-slate-900 dark:text-white transition-all active:scale-95 text-center flex items-center justify-center gap-4">🤖 {t('smartSearch')}</Link>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center order-1 lg:order-2 px-6 md:px-0">
                        <div onMouseDown={handleMascotInteraction} onTouchStart={handleMascotInteraction}
                            className={`relative group cursor-pointer touch-manipulation flex items-center justify-center w-full max-w-[300px] md:max-w-[650px] transition-transform duration-500 ${isMascotClicked ? 'scale-110' : 'hover:scale-105'}`}>
                            
                            {bursts.map((burst) => (
                                <div key={burst.id} className="absolute z-[100] glass-panel px-4 md:px-12 py-3 md:py-6 rounded-2xl md:rounded-[4rem] flex items-center gap-3 md:gap-6 border-red-500/40 shadow-3xl animate-burst-long pointer-events-none"
                                    style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                    <span className="text-2xl md:text-7xl">{burst.item.icon}</span>
                                    <span className="text-xs md:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter whitespace-nowrap">{isAr ? burst.item.textAr : burst.item.textEn}</span>
                                </div>
                            ))}

                            <img src="/saqr-full.png" alt="Saqr" className="h-56 sm:h-80 md:h-[750px] object-contain drop-shadow-[0_40px_80px_rgba(220,38,38,0.25)] dark:drop-shadow-[0_0_100px_rgba(255,255,255,0.05)] relative z-10 animate-float" />
                            
                            <div className="absolute -top-6 md:-top-16 -right-6 md:-right-20 glass-panel p-4 md:p-10 rounded-3xl md:rounded-[5rem] shadow-3xl border-red-500/30 text-xs md:text-4xl font-black text-red-600 dark:text-white animate-bounce z-20 backdrop-blur-2xl">
                                {t('bubble')}
                                <div className="absolute -bottom-2 md:-bottom-5 left-8 md:left-16 w-4 md:w-10 h-4 md:h-10 glass-panel rotate-45 bg-inherit border-r-4 border-b-4 border-red-500/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- قسم: تعرف على وطني (The Homeland Banner) --- */}
            <div className="mt-16 md:mt-32 w-full max-w-6xl mx-auto animate-fade-up delay-300 px-4 md:px-0">
                <div className="glass-panel p-8 md:p-20 rounded-[3rem] md:rounded-[6rem] bg-gradient-to-br from-yellow-500/20 via-white/5 to-red-600/10 border-4 border-yellow-500/40 dark:bg-slate-900/60 shadow-[0_0_80px_rgba(234,179,8,0.2)] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-white to-red-600 opacity-60"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 md:gap-20">
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 md:w-48 md:h-48 bg-yellow-400 rounded-3xl md:rounded-[3rem] flex items-center justify-center text-5xl md:text-9xl shadow-[0_0_50px_rgba(234,179,8,0.5)] animate-pulse">
                                🇦🇪
                            </div>
                            <div className="absolute -inset-4 bg-yellow-500/20 blur-3xl rounded-full animate-pulse -z-10"></div>
                        </div>

                        <div className="text-center lg:text-start flex-1 space-y-4 md:space-y-8">
                            <h3 className="text-xl md:text-5xl font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-[0.3em] drop-shadow-sm">
                                {t('homelandTitle')}
                            </h3>
                            <p className="text-2xl md:text-6xl text-slate-950 dark:text-white leading-[1.2] font-black tracking-tight">
                                {isAr ? dailyFact.ar : dailyFact.en}
                            </p>
                        </div>
                    </div>

                    {/* شعار نيون خلفي خفي */}
                    <div className="absolute -bottom-10 -right-10 text-[15rem] opacity-5 select-none pointer-events-none group-hover:rotate-12 transition-transform duration-1000">🇦🇪</div>
                </div>
            </div>

            {/* --- عداد الزوار النيون الملكي (تحت البانر الوطني) --- */}
            <div className="mt-12 md:mt-24 mb-20 relative z-10 animate-fade-up delay-700">
                <div className="glass-panel px-10 md:px-24 py-6 md:py-12 rounded-full border-4 border-green-600/30 dark:bg-slate-900/60 shadow-[0_0_60px_rgba(34,197,94,0.1)] flex flex-col md:flex-row items-center gap-4 md:gap-12 group hover:border-green-600 transition-all duration-700">
                    <div className="flex items-center gap-6">
                        <span className="relative flex h-5 w-5 md:h-8 md:w-8">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 md:h-8 md:w-8 bg-green-600 shadow-[0_0_15px_rgba(34,197,94,1)]"></span>
                        </span>
                        <p className="text-sm md:text-3xl font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('visitorsLabel')}</p>
                    </div>
                    <div className="text-5xl md:text-[7rem] font-black text-green-700 dark:text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.4)] tabular-nums group-hover:scale-110 transition-transform duration-500">
                        {visitorCount.toLocaleString()}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes burst-long {
                    0% { transform: translate(0, 0) scale(0.4) rotate(0deg); opacity: 0; filter: blur(10px); }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; filter: blur(0px); }
                    85% { transform: translate(calc(var(--tx) * 1.05), calc(var(--ty) * 1.05)) scale(1); opacity: 1; filter: blur(0px); }
                    100% { transform: translate(calc(var(--tx) * 1.1), calc(var(--ty) - 50px)) scale(1.3) rotate(calc(var(--rot) * 1.5)); opacity: 0; filter: blur(40px); }
                }
                .animate-burst-long { animation: burst-long 5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-25px); } }
            `}</style>
        </div>
    );
};

export default HomePage;
