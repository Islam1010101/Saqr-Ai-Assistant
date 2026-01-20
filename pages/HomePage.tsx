import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "مستقبل المعرفة في صقر الإمارات",
        subWelcome: "بوابتك الذكية للوصول إلى كنوز المعرفة الرقمية والورقية بأسلوب عصري.",
        manualSearch: "البحث اليدوي",
        manualDesc: "تصفح الفهرس الورقي عبر رقم الرف.",
        smartSearch: "اسأل صقر (AI)",
        smartDesc: "مساعدك الذكي للبحث والاستفسار.",
        digitalLibrary: "المكتبة الإلكترونية",
        digitalDesc: "عالم من الكتب والروايات الرقمية.",
        bubble: "اضغط للإلهام!",
        visitorsLabel: "إجمالي التفاعل",
        homelandTitle: "لمحات من الموطن"
    },
    en: {
        welcome: "Future of Knowledge at E.F.I.P.S",
        subWelcome: "Your smart gateway to access digital and physical knowledge resources.",
        manualSearch: "Manual Search",
        manualDesc: "Browse physical index by shelf number.",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Your smart AI research assistant.",
        digitalLibrary: "Digital Library",
        digitalDesc: "World of digital books and novels.",
        bubble: "Touch for inspiration!",
        visitorsLabel: "Total Engagement",
        homelandTitle: "Hints From Homeland"
    }
};

const HOMELAND_FACTS = [
    { ar: "تأسست دولة الإمارات العربية المتحدة في الثاني من ديسمبر عام 1971م على يد الشيخ زايد بن سلطان آل نهيان، طيب الله ثراه.", en: "The UAE was founded on Dec 2, 1971, by Sheikh Zayed bin Sultan Al Nahyan." },
    { ar: "هل تعلم أن برج خليفة في دبي هو أطول بناء شيده الإنسان في العالم بارتفاع 828 متراً؟", en: "Did you know Burj Khalifa is the tallest man-made structure in the world at 828m?" },
    { ar: "مسبار الأمل الإماراتي هو أول مهمة عربية تصل إلى مدار كوكب المريخ لاستكشاف غلافه الجوي.", en: "The Hope Probe is the first Arab mission to reach Mars to explore its atmosphere." },
    { ar: "تعتبر 'نخلة جميرا' أكبر جزيرة اصطناعية في العالم، ويمكن رؤيتها من الفضاء الخارجي.", en: "Palm Jumeirah is the world's largest man-made island, visible from space." }
];

const KNOWLEDGE_CARDS = [
    { icon: "📜", textAr: "بحث رقمي", textEn: "Digital Research", color: "border-red-600" },
    { icon: "💡", textAr: "فكرة مبتكرة", textEn: "Innovative Idea", color: "border-yellow-500" },
    { icon: "🤖", textAr: "ذكاء صقر", textEn: "Saqr AI", color: "border-green-600" },
    { icon: "📚", textAr: "مصادر المعرفة", textEn: "Knowledge Sources", color: "border-blue-600" },
    { icon: "🇦🇪", textAr: "هوية وطنية", textEn: "UAE Identity", color: "border-red-500" }
];

interface BurstItem { id: number; tx: number; ty: number; rot: number; item: typeof KNOWLEDGE_CARDS[0]; }

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);
    const [visitorCount, setVisitorCount] = useState(0);

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
            start += newCount / 80;
            if (start >= newCount) { setVisitorCount(newCount); clearInterval(timer); } 
            else { setVisitorCount(Math.floor(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, []);

    const handleMascotInteraction = useCallback(() => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);
        const id = Date.now();
        const newBursts: BurstItem[] = Array.from({ length: 2 }).map((_, i) => ({
            id: id + i,
            item: KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)],
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 80 : 200), 
            ty: -100 - Math.random() * 100,
            rot: (Math.random() - 0.5) * 40
        }));
        setBursts(prev => [...prev, ...newBursts]);
        newBursts.forEach(b => { setTimeout(() => { setBursts(current => current.filter(item => item.id !== b.id)); }, 5000); });
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05; audio.play().catch(() => {});
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col items-center gap-10 md:gap-20 animate-fade-up font-black antialiased relative">
            
            {/* 1. قسم الترحيب الرئيسي */}
            <div className="text-center space-y-4 md:space-y-8 max-w-4xl relative z-20">
                <h1 className="text-4xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter leading-tight drop-shadow-2xl">
                    {t('welcome')}
                </h1>
                <p className="text-base md:text-3xl text-slate-600 dark:text-slate-400 font-bold opacity-80 leading-relaxed italic">
                    {t('subWelcome')}
                </p>
                <div className="h-1.5 w-32 bg-red-600 mx-auto rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
            </div>

            {/* 2. مركز العمليات */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
                
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 order-2 lg:order-1">
                    <Link to="/search" className="group glass-panel p-6 md:p-10 rounded-[2.5rem] border-2 border-red-600/20 hover:border-red-600 transition-all duration-500 shadow-xl">
                        <div className="text-4xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
                        <h3 className="text-xl md:text-3xl text-slate-950 dark:text-white mb-2">{t('manualSearch')}</h3>
                        <p className="text-xs md:text-lg text-slate-500 dark:text-slate-400 font-bold">{t('manualDesc')}</p>
                    </Link>

                    <Link to="/smart-search" className="group glass-panel p-6 md:p-10 rounded-[2.5rem] border-2 border-green-600/20 hover:border-green-600 transition-all duration-500 shadow-xl">
                        <div className="text-4xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
                        <h3 className="text-xl md:text-3xl text-slate-950 dark:text-white mb-2">{t('smartSearch')}</h3>
                        <p className="text-xs md:text-lg text-slate-500 dark:text-slate-400 font-bold">{t('smartDesc')}</p>
                    </Link>

                    <Link to="/digital-library" className="md:col-span-2 group glass-panel p-6 md:p-10 rounded-[2.5rem] border-2 border-blue-600/20 hover:border-blue-600 transition-all duration-500 shadow-xl flex items-center gap-6">
                        <div className="text-4xl md:text-7xl group-hover:rotate-12 transition-transform">📚</div>
                        <div className="text-start">
                            <h3 className="text-xl md:text-4xl text-slate-950 dark:text-white mb-1">{t('digitalLibrary')}</h3>
                            <p className="text-xs md:text-xl text-slate-500 dark:text-slate-400 font-bold">{t('digitalDesc')}</p>
                        </div>
                    </Link>
                </div>

                {/* صقر مع الشعار المائل في الخلفية */}
                <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 relative">
                    <div onClick={handleMascotInteraction} className={`relative cursor-pointer transition-transform duration-500 ${isMascotClicked ? 'scale-110' : 'hover:scale-105'}`}>
                        
                        {/* شعار المدرسة المائل في الخلفية */}
                        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none opacity-10 dark:opacity-20 transition-all duration-1000">
                            <img 
                                src="/school-logo.png" 
                                alt="Background Logo" 
                                className="w-[120%] h-[120%] object-contain rotate-[15deg] logo-white-filter" 
                            />
                        </div>

                        {/* كروت الانفجار المحسنة (أكثر وضوحاً) */}
                        {bursts.map((burst) => (
                            <div key={burst.id} 
                                className={`absolute z-[100] bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border-4 ${burst.item.color} shadow-2xl animate-burst-long pointer-events-none flex items-center gap-3`}
                                style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                <span className="text-2xl md:text-4xl">{burst.item.icon}</span>
                                <span className="text-[10px] md:text-xl font-black text-slate-950 dark:text-white uppercase whitespace-nowrap">{isAr ? burst.item.textAr : burst.item.textEn}</span>
                            </div>
                        ))}

                        <img src="/saqr-full.png" alt="Saqr" className="h-64 md:h-[600px] object-contain drop-shadow-[0_30px_60px_rgba(220,38,38,0.25)] relative z-10 animate-float" />
                        
                        <div className="absolute -top-4 -right-4 md:-top-10 md:-right-10 glass-panel p-3 md:p-6 rounded-3xl border-red-500/30 shadow-3xl text-[10px] md:text-xl font-black text-red-600 dark:text-white animate-bounce z-20">
                            {t('bubble')}
                            <div className="absolute -bottom-2 left-8 w-4 h-4 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-red-500/20"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. قسم: تعرف على وطني (ألوان الهوية الوطنية الرسمية) */}
            <div className="w-full max-w-6xl animate-fade-up">
                <div className="glass-panel p-8 md:p-14 rounded-[3rem] md:rounded-[5.5rem] border-l-8 border-green-600 border-r-8 border-red-600 bg-white dark:bg-slate-950 shadow-[0_0_60px_rgba(0,0,0,0.1)] dark:shadow-green-900/10 relative overflow-hidden group">
                    {/* خلفية بتوهج وطني خفيف */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600/5 via-white/5 to-red-600/5 -z-10"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-24 h-24 md:w-36 md:h-36 bg-slate-100 dark:bg-white/10 rounded-[2.5rem] flex items-center justify-center text-5xl md:text-8xl shadow-xl animate-pulse border-4 border-yellow-500/30">🇦🇪</div>
                        <div className="text-center md:text-start flex-1">
                            <h3 className="text-lg md:text-4xl font-black text-red-600 dark:text-red-500 uppercase tracking-widest mb-3 flex items-center justify-center md:justify-start gap-3">
                                {t('homelandTitle')}
                            </h3>
                            <p className="text-xl md:text-5xl text-slate-950 dark:text-white leading-tight font-black tracking-tight italic border-b-4 border-green-600 pb-4">
                                {isAr ? dailyFact.ar : dailyFact.en}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. عداد الزوار */}
            <div className="w-full max-w-2xl animate-fade-up pb-10">
                <div className="glass-panel px-10 py-6 md:py-10 rounded-full border-2 border-green-600/30 flex flex-col md:flex-row items-center justify-center gap-4 group">
                    <div className="flex items-center gap-4">
                        <span className="relative flex h-4 w-4 md:h-6 md:w-6">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 md:h-6 md:w-6 bg-green-600 shadow-[0_0_10px_rgba(34,197,94,1)]"></span>
                        </span>
                        <p className="text-xs md:text-2xl font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('visitorsLabel')}</p>
                    </div>
                    <div className="text-4xl md:text-[5rem] font-black text-green-700 dark:text-green-500 tabular-nums">
                        {visitorCount.toLocaleString()}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes burst-long {
                    0% { transform: translate(0, 0) scale(0.4) rotate(0deg); opacity: 0; filter: blur(10px); }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; filter: blur(0px); }
                    85% { transform: translate(calc(var(--tx) * 1.05), calc(var(--ty) * 1.05)) scale(1); opacity: 1; filter: blur(0px); }
                    100% { transform: translate(calc(var(--tx) * 1.1), calc(var(--ty) - 50px)) scale(1.3) rotate(calc(var(--rot) * 1.5)); opacity: 0; filter: blur(40px); }
                }
                .animate-burst-long { animation: burst-long 5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                .glass-panel { backdrop-filter: blur(40px); background: rgba(255, 255, 255, 0.05); }
                .logo-white-filter { dark:filter: brightness(0) invert(1) opacity(0.2); }
            `}</style>
        </div>
    );
};

export default HomePage;
