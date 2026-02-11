import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "بوابة المعرفة مدرسة صقر الإمارات",
        subWelcome: "بوابتك الذكية للوصول إلى المعلومات.",
        manualSearch: "البحث اليدوي",
        manualDesc: "البحث عن كتاب ما في مكتبة المدرسة والوصول اليه .",
        smartSearch: "اسأل صقر (AI)",
        smartDesc: "مساعدك الذكي للبحث والاستفسار.",
        digitalLibrary: "المكتبة الإلكترونية",
        digitalDesc: "عالم من الكتب والروايات الرقمية.",
        creators: "ركن المبدعين",
        creatorsDesc: "استكشف قصص وابتكارات زملائك المبدعين في ركن المؤلف والمخترع الصغير.",
        bubble: "أهلاً بك في صقر!",
        homelandTitle: "لمحات من الموطن",
        challengeTitle: "تحدي المبدعين الصغار",
        challengeDesc: "ناقش، ابدأ قصتك الخاصة مع صقر، وأثبت موهبتك لتفوز بجوائز متميزة من مدرسة صقر الإمارات!",
        challengeCTA: "ابدأ رحلة الإبداع مع صقر الآن",
        comingSoonRamadan: "🌙 قريباً في رمضان: مسابقة كنز المعرفة.. ابحث عن الكنوز واربح جوائز فورية!",
        visitorsLabel: "زوار البوابة:"
    },
    en: {
        welcome: "Knowledge's Portal in Falcon Int'l School",
        subWelcome: "Your smart portal to access to the Knowledges.",
        manualSearch: "Manual Search",
        manualDesc: "Finding and accessing a specific book in the school library.",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Your smart AI research assistant.",
        digitalLibrary: "Digital Library",
        digitalDesc: "World of digital books and novels.",
        creators: "Creators Corner",
        creatorsDesc: "Explore the stories and innovations of your creative peers in the author and inventor corner.",
        bubble: "Welcome to Saqr!",
        homelandTitle: "Hints From Homeland",
        challengeTitle: "Little Authors Challenge",
        challengeDesc: "Discuss , author your own tales with Saqr, and showcase your talent to win distinguished prizes from EFIPS!",
        challengeCTA: "Start your creative journey now",
        comingSoonRamadan: "🌙 Coming Soon this Ramadan: Knowledge Treasure Quest.. Find the treasures & win instant prizes!",
        visitorsLabel: "Portal Visitors:"
    }
};

const HOMELAND_FACTS = [
    { ar: "تأسست دولة الإمارات العربية المتحدة في الثاني من ديسمبر عام 1971م على يد الشيخ زايد بن سلطان آل نهيان، طيب الله ثراه.", en: "The UAE was founded on Dec 2, 1971, by Sheikh Zayed bin Sultan Al Nahyan." },
    { ar: "هل تعلم أن برج خليفة في دبي هو أطول بناء شيده الإنسان في العالم بارتفاع 828 متراً؟", en: "Did you know Burj Khalifa is the tallest man-made structure in the world at 828m?" },
    { ar: "مسبار الأمل الإماراتي هو أول مهمة عربية تصل إلى مدار كوكب المريخ لاستكشاف غلافه الجوي.", en: "The Hope Probe is the first Arab mission to reach Mars to explore its atmosphere." },
    { ar: "تعتبر 'نخلة جميرا' أكبر جزيرة اصطناعية في العالم، ويمكن رؤيتها من الفضاء الخارجي.", en: "Palm Jumeirah is the world's largest man-made island, visible from space." },
    { ar: "متحف اللوفر أبوظبي هو أول متحف عالمي في العالم العربي.", en: "Louvre Abu Dhabi is the first universal museum in the Arab world." },
    { ar: "تعتبر الإمارات واحدة من أكثر الدول أماناً في العالم.", en: "The UAE is considered one of the safest countries in the world." },
    { ar: "شجرة الغاف هي الشجرة الوطنية ورمز للصمود في الصحراء.", en: "The Ghaf tree is the national tree and a symbol of resilience in the desert." },
    { ar: "تضم الدولة متحف المستقبل الذي يعد أيقونة معمارية فريدة.", en: "The country hosts the Museum of the Future, a unique architectural icon." },
    { ar: "جامع الشيخ زايد الكبير يضم واحدة من أكبر الثريات والسجادات في العالم.", en: "Sheikh Zayed Grand Mosque houses one of the world's largest chandeliers and carpets." },
];

const KNOWLEDGE_CARDS = [
    { icon: "📜", textAr: "بحث رقمي", textEn: "Research", color: "border-red-600" },
    { icon: "💡", textAr: "بحث في مكتبة المدرسة", textEn: "Search In Library", color: "border-yellow-500" },
    { icon: "🤖", textAr: "ذكاء صقر", textEn: "Saqr AI", color: "border-green-600" },
    { icon: "📚", textAr: "كتب الكترونية", textEn: "E-Books", color: "border-black-600" },
    { icon: "🇦🇪", textAr: "الهوية الوطنية", textEn: "N.Identity", color: "border-red-500" }
];

interface BurstItem { id: number; tx: number; ty: number; rot: number; item: typeof KNOWLEDGE_CARDS[0]; }

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [bursts, setBursts] = useState<BurstItem[]>([]);
    const [isMascotClicked, setIsMascotClicked] = useState(false);

    // حساب عدد الزوار بناءً على التاريخ
    const visitorCount = useMemo(() => {
        const baseCount = 1000;
        const startDate = new Date('2026-02-01');
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return baseCount + (diffDays * 157);
    }, []);

    // تاريخ اليوم المحدث تلقائياً
    const todayDate = useMemo(() => {
        return new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [locale]);

    const dailyFact = useMemo(() => {
        const day = new Date().getDate();
        return HOMELAND_FACTS[day % HOMELAND_FACTS.length];
    }, []);

    const handleMascotInteraction = useCallback(() => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);
        
        const id = Date.now();
        const newBursts: BurstItem[] = Array.from({ length: 3 }).map((_, i) => ({
            id: id + i,
            item: KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)],
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 120 : 280), 
            ty: -100 - Math.random() * 120,
            rot: (Math.random() - 0.5) * 30
        }));

        setBursts(prev => [...prev, ...newBursts]);
        
        newBursts.forEach(b => { 
            setTimeout(() => { 
                setBursts(current => current.filter(item => item.id !== b.id)); 
            }, 2500); 
        });

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.03; audio.play().catch(() => {});
    }, []);

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 md:py-16 flex flex-col items-center gap-12 md:gap-20 animate-fade-up font-black antialiased relative overflow-x-hidden">
            
            {/* 1. قسم الترحيب */}
            <div className="text-center space-y-6 md:space-y-10 max-w-5xl relative z-20">
                <h1 className="text-3xl sm:text-4xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter leading-[1.2] drop-shadow-2xl">
                    {t('welcome')}
                </h1>
                <p className="text-sm md:text-3xl text-slate-600 dark:text-slate-400 font-bold opacity-80 leading-relaxed max-w-3xl mx-auto">
                    {t('subWelcome')}
                </p>
                <div className="h-2 w-40 bg-red-600 mx-auto rounded-full shadow-[0_0_25px_rgba(220,38,38,0.6)]"></div>
            </div>

            {/* إعلان مسابقة رمضان */}
            <div className="w-full max-w-4xl relative z-30 animate-in zoom-in duration-700">
                <div className="glass-panel py-6 px-10 rounded-[2.5rem] border-2 border-yellow-500/40 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 shadow-[0_0_40px_rgba(234,179,8,0.15)] flex items-center justify-center text-center overflow-hidden group">
                    <div className="absolute -inset-1 bg-yellow-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-lg md:text-3xl font-black text-yellow-600 dark:text-yellow-500 animate-pulse tracking-tight">
                        {t('comingSoonRamadan')}
                    </p>
                </div>
            </div>

            {/* 2. مركز العمليات */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
                
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 order-2 lg:order-1">
                    <Link to="/search" className="group glass-panel p-6 md:p-10 rounded-[2.5rem] border-2 border-red-600/20 hover:border-red-600 transition-all duration-500 shadow-2xl">
                        <div className="text-4xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
                        <h3 className="text-xl md:text-3xl text-slate-950 dark:text-white mb-2">{t('manualSearch')}</h3>
                        <p className="text-[11px] md:text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('manualDesc')}</p>
                    </Link>

                    <Link to="/smart-search" className="group glass-panel p-6 md:p-10 rounded-[2.5rem] border-2 border-green-600/20 hover:border-green-600 transition-all duration-500 shadow-2xl">
                        <div className="text-4xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
                        <h3 className="text-xl md:text-3xl text-slate-950 dark:text-white mb-2">{t('smartSearch')}</h3>
                        <p className="text-[11px] md:text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('smartDesc')}</p>
                    </Link>

                    <Link to="/digital-library" className="group glass-panel p-6 md:p-10 rounded-[2.5rem] border-2 border-blue-600/20 hover:border-blue-600 transition-all duration-500 shadow-2xl">
                        <div className="text-4xl md:text-6xl mb-4 group-hover:rotate-6 transition-transform">📚</div>
                        <h3 className="text-xl md:text-3xl text-slate-950 dark:text-white mb-2">{t('digitalLibrary')}</h3>
                        <p className="text-[11px] md:text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('digitalDesc')}</p>
                    </Link>

                    <Link to="/creators" className="group glass-panel p-6 md:p-10 rounded-[2.5rem] border-2 border-purple-600/20 hover:border-purple-600 transition-all duration-500 shadow-2xl">
                        <div className="text-4xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">🎨</div>
                        <h3 className="text-xl md:text-3xl text-slate-950 dark:text-white mb-2">{t('creators')}</h3>
                        <p className="text-[11px] md:text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('creatorsDesc')}</p>
                    </Link>
                </div>

                <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 relative gap-8">
                    <div onClick={handleMascotInteraction} className={`relative cursor-pointer transition-transform duration-700 ${isMascotClicked ? 'scale-110' : 'hover:scale-105'}`}>
                        
                        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none opacity-10 dark:opacity-20 transition-all duration-1000">
                            <img src="/school-logo.png" alt="Seal" className="w-[130%] h-[130%] object-contain rotate-[15deg] logo-white-filter" />
                        </div>

                        {bursts.map((burst) => (
                            <div key={burst.id} 
                                className={`absolute z-[100] bg-white dark:bg-slate-900 px-4 py-2 md:px-6 md:py-3 rounded-2xl border-[3px] ${burst.item.color} shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-burst-steady pointer-events-none flex items-center gap-3`}
                                style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                                <span className="text-base md:text-3xl">{burst.item.icon}</span>
                                <span className="text-[10px] md:text-lg font-black text-slate-950 dark:text-white uppercase whitespace-nowrap">{isAr ? burst.item.textAr : burst.item.textEn}</span>
                            </div>
                        ))}

                        <img src="/saqr-full.png" alt="Saqr" className="h-72 md:h-[650px] object-contain drop-shadow-[0_40px_80px_rgba(220,38,38,0.3)] relative z-10 animate-float" />
                        
                        <div className="absolute -top-4 -right-4 md:-top-10 md:-right-10 glass-panel p-4 md:p-8 rounded-[2rem] border-red-500/30 shadow-3xl text-xs md:text-2xl font-black text-red-600 dark:text-white animate-bounce z-20">
                            {t('bubble')}
                            <div className="absolute -bottom-2 left-8 w-5 h-5 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-red-500/20"></div>
                        </div>
                    </div>

                    <div className="w-full max-w-md glass-panel p-6 md:p-10 rounded-[2.5rem] border-2 border-red-600/40 shadow-[0_0_50px_rgba(220,38,38,0.15)] text-center space-y-6 relative z-30 animate-fade-up overflow-hidden group/card">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                        
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-red-600 text-white text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(220,38,38,0.4)] z-10">
                            {isAr ? "أطلق العنان لموهبتك" : "Show Your Talent"}
                        </div>
                        
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xl md:text-4xl font-black text-slate-950 dark:text-white leading-tight tracking-tighter">
                                {t('challengeTitle')}
                            </h3>

                            <p className="text-[11px] md:text-xl text-slate-700 dark:text-slate-300 font-bold leading-relaxed px-2">
                                {t('challengeDesc')}
                            </p>

                            <div className="h-1.5 w-24 bg-red-600/30 mx-auto rounded-full group-hover/card:w-32 transition-all duration-500"></div>

                            <p className="text-[9px] md:text-lg text-red-600 dark:text-red-500 font-black uppercase tracking-tight animate-pulse">
                                {t('challengeCTA')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. قسم لمحات من الموطن */}
            <div className="w-full max-w-6xl animate-fade-up mb-16 px-2">
                <div className="glass-panel p-8 md:p-20 rounded-[3rem] md:rounded-[6rem] border-l-[8px] md:border-l-[12px] border-green-600 border-r-[8px] md:border-r-[12px] border-red-600 bg-white dark:bg-slate-950 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600/5 via-transparent to-red-600/5 -z-10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="w-20 h-20 md:w-44 md:h-44 bg-slate-100 dark:bg-white/10 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-4xl md:text-9xl shadow-2xl animate-pulse border-4 border-yellow-500/30 shrink-0">🇦🇪</div>
                        <div className="text-center md:text-start flex-1 space-y-4 md:space-y-6">
                            <h3 className="text-lg md:text-5xl font-black text-red-600 dark:text-red-500 uppercase tracking-widest flex items-center justify-center md:justify-start gap-4">
                                {t('homelandTitle')}
                            </h3>
                            <p className="text-lg md:text-6xl text-slate-950 dark:text-white leading-[1.3] font-black tracking-tight border-b-4 md:border-b-8 border-green-600/30 pb-4 md:pb-8">
                                {isAr ? dailyFact.ar : dailyFact.en}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 4. عداد الزوار والتاريخ (الفوتر) --- */}
            <footer className="w-full flex justify-center pb-8 animate-fade-up">
                <div className="glass-panel px-8 py-5 rounded-[2.5rem] border border-white/20 shadow-xl flex flex-col md:flex-row items-center gap-4 md:gap-8 group hover:scale-105 transition-all duration-500">
                    {/* جزء العداد */}
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        <span className="text-slate-500 dark:text-slate-400 font-bold text-sm md:text-lg whitespace-nowrap">
                            {t('visitorsLabel')}
                        </span>
                        <span className="text-red-600 dark:text-white font-black text-xl md:text-3xl tracking-tighter">
                            {visitorCount.toLocaleString()}
                        </span>
                    </div>
                    
                    {/* الفاصل العمودي */}
                    <div className="hidden md:block h-8 w-px bg-white/10"></div>
                    
                    {/* جزء التاريخ */}
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <span className="text-xl md:text-2xl">📅</span>
                        <span className="font-black text-sm md:text-xl tracking-tight uppercase">
                            {todayDate}
                        </span>
                    </div>
                </div>
            </footer>

            <style>{`
                * { font-style: normal !important; }
                @keyframes burst-steady {
                    0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; }
                    85% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
                    100% { transform: translate(var(--tx), calc(var(--ty) - 30px)) scale(0.8) rotate(var(--rot)); opacity: 0; }
                }
                .animate-burst-steady { animation: burst-steady 2.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                .animate-float { animation: float 8s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-40px); } }
                .glass-panel { backdrop-filter: blur(60px); background: rgba(255, 255, 255, 0.03); }
                .logo-white-filter { transition: filter 0.5s ease; }
                .dark .logo-white-filter { filter: brightness(0) invert(1); }
                p { line-height: 1.8 !important; }
                @media (max-width: 768px) {
                    h1 { font-size: 2.25rem !important; }
                    h2 { font-size: 1.5rem !important; }
                    h3 { font-size: 1.25rem !important; }
                }
            `}</style>
        </div>
    );
};

export default HomePage;
