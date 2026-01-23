import React, { useState, useCallback, useMemo } from 'react';
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
        bubble: "أهلاً بك في صقر!",
        homelandTitle: "لمحات من الموطن"
    },
    en: {
        welcome: "Future of Knowledge at Falcon Int'l School",
        subWelcome: "Your smart gateway to access digital and physical knowledge resources.",
        manualSearch: "Manual Search",
        manualDesc: "Browse physical index by shelf number.",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Your smart AI research assistant.",
        digitalLibrary: "Digital Library",
        digitalDesc: "World of digital books and novels.",
        bubble: "Welcome to Saqr!",
        homelandTitle: "Hints From Homeland"
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

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [isMascotClicked, setIsMascotClicked] = useState(false);

    const dailyFact = useMemo(() => {
        const day = new Date().getDate();
        return HOMELAND_FACTS[day % HOMELAND_FACTS.length];
    }, []);

    const handleMascotInteraction = useCallback(() => {
        setIsMascotClicked(true);
        setTimeout(() => setIsMascotClicked(false), 300);
        // تم إلغاء نظام الانفجار التفاعلي بطلبك لتركيز التصميم
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center gap-12 md:gap-24 animate-fade-up font-black antialiased relative overflow-x-hidden">
            
            {/* 1. قسم الترحيب - تم ضبط التباعد وإلغاء الميلان */}
            <div className="text-center space-y-6 md:space-y-10 max-w-5xl relative z-20">
                <h1 className="text-4xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter leading-[1.1] drop-shadow-2xl">
                    {t('welcome')}
                </h1>
                <p className="text-base md:text-3xl text-slate-600 dark:text-slate-400 font-bold opacity-80 leading-relaxed max-w-3xl mx-auto">
                    {t('subWelcome')}
                </p>
                <div className="h-2 w-40 bg-red-600 mx-auto rounded-full shadow-[0_0_25px_rgba(220,38,38,0.6)]"></div>
            </div>

            {/* 2. الأزرار الرئيسية */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
                
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 order-2 lg:order-1">
                    <Link to="/search" className="group glass-panel p-8 md:p-12 rounded-[3rem] border-2 border-red-600/20 hover:border-red-600 transition-all duration-500 shadow-2xl">
                        <div className="text-5xl md:text-7xl mb-6 group-hover:scale-110 transition-transform">🔍</div>
                        <h3 className="text-2xl md:text-4xl text-slate-950 dark:text-white mb-3">{t('manualSearch')}</h3>
                        <p className="text-sm md:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('manualDesc')}</p>
                    </Link>

                    <Link to="/smart-search" className="group glass-panel p-8 md:p-12 rounded-[3rem] border-2 border-green-600/20 hover:border-green-600 transition-all duration-500 shadow-2xl">
                        <div className="text-5xl md:text-7xl mb-6 group-hover:scale-110 transition-transform">🤖</div>
                        <h3 className="text-2xl md:text-4xl text-slate-950 dark:text-white mb-3">{t('smartSearch')}</h3>
                        <p className="text-sm md:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('smartDesc')}</p>
                    </Link>

                    <Link to="/digital-library" className="md:col-span-2 group glass-panel p-8 md:p-14 rounded-[3.5rem] border-2 border-blue-600/20 hover:border-blue-600 transition-all duration-500 shadow-2xl flex flex-col md:flex-row items-center gap-8 text-center md:text-start">
                        <div className="text-6xl md:text-8xl group-hover:rotate-6 transition-transform">📚</div>
                        <div className="space-y-2">
                            <h3 className="text-2xl md:text-5xl text-slate-950 dark:text-white font-black">{t('digitalLibrary')}</h3>
                            <p className="text-sm md:text-2xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('digitalDesc')}</p>
                        </div>
                    </Link>
                </div>

                {/* صقر مع الشعار المائل */}
                <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 relative">
                    <div onClick={handleMascotInteraction} className={`relative cursor-pointer transition-transform duration-700 ${isMascotClicked ? 'scale-110' : 'hover:scale-105'}`}>
                        
                        {/* الشعار المائل في الخلفية */}
                        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none opacity-10 dark:opacity-20 transition-all duration-1000">
                            <img src="/school-logo.png" alt="Seal" className="w-[130%] h-[130%] object-contain rotate-[15deg] logo-white-filter blur-[2px]" />
                        </div>

                        <img src="/saqr-full.png" alt="Saqr" className="h-72 md:h-[650px] object-contain drop-shadow-[0_40px_80px_rgba(220,38,38,0.3)] relative z-10 animate-float" />
                        
                        <div className="absolute -top-4 -right-4 md:-top-10 md:-right-10 glass-panel p-4 md:p-8 rounded-[2rem] border-red-500/30 shadow-3xl text-xs md:text-2xl font-black text-red-600 dark:text-white animate-bounce z-20">
                            {t('bubble')}
                            <div className="absolute -bottom-2 left-8 w-5 h-5 glass-panel rotate-45 bg-inherit border-r-2 border-b-2 border-red-500/20"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. قسم لمحات من الموطن - تم تحسين تباعد الأسطر */}
            <div className="w-full max-w-6xl animate-fade-up mb-16">
                <div className="glass-panel p-10 md:p-20 rounded-[4rem] md:rounded-[6rem] border-l-[12px] border-green-600 border-r-[12px] border-red-600 bg-white dark:bg-slate-950 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600/5 via-transparent to-red-600/5 -z-10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="w-28 h-28 md:w-44 md:h-44 bg-slate-100 dark:bg-white/10 rounded-[3rem] flex items-center justify-center text-6xl md:text-9xl shadow-2xl animate-pulse border-4 border-yellow-500/30 shrink-0">🇦🇪</div>
                        <div className="text-center md:text-start flex-1 space-y-6">
                            <h3 className="text-xl md:text-5xl font-black text-red-600 dark:text-red-500 uppercase tracking-widest flex items-center justify-center md:justify-start gap-4">
                                {t('homelandTitle')}
                            </h3>
                            <p className="text-2xl md:text-6xl text-slate-950 dark:text-white leading-[1.3] font-black tracking-tight border-b-8 border-green-600/30 pb-8">
                                {isAr ? dailyFact.ar : dailyFact.en}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* فرض الخط المستقيم في كل مكان لإلغاء أي ميلان افتراضي */
                * { font-style: normal !important; }

                .animate-float { animation: float 8s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
                
                .glass-panel { 
                    backdrop-filter: blur(60px); 
                    background: rgba(255, 255, 255, 0.03); 
                }
                
                .logo-white-filter { transition: filter 0.5s ease; }
                .dark .logo-white-filter { filter: brightness(0) invert(1); }

                /* زيادة تباعد الأسطر للنصوص الطويلة لسهولة القراءة */
                p { line-height: 1.8 !important; }
            `}</style>
        </div>
    );
};

export default HomePage;
