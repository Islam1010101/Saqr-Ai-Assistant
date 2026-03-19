import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
  ar: {
    welcome: "بوابة المعرفة مدرسة صقر الإمارات",
    subWelcome: "بوابتك الذكية للوصول إلى المعلومات.",
    manualSearch: "البحث اليدوي",
    manualDesc: "البحث عن كتاب ما في مكتبة المدرسة والوصول إليه.",
    smartSearch: "اسأل صقر (AI)",
    smartDesc: "مساعدك الذكي للبحث والاستفسار.",
    digitalLibrary: "المكتبة الإلكترونية",
    digitalDesc: "عالم من الكتب والروايات الرقمية.",
    creators: "ركن المبدعين",
    creatorsDesc: "استكشف قصص وابتكارات زملائك المبدعين في ركن المؤلف والمخترع الصغير.",
    bubble: "أهلاً بك في صقر!",
    homelandTitle: "لمحات من الموطن",
    challengeTitle: "تحدي المبدعين",
    challengeDesc: "ناقش، ابدأ قصتك الخاصة مع صقر، وأثبت موهبتك كل ماعليك فعله تحدى صقر. هل أنت مستعد ؟!",
    challengeCTA: "ابدأ رحلة الإبداع مع صقر الآن",
    term3Banner: "مفاجآت قريبة في الفصل الدراسي الثالث 2026",
    term3Tag: "ترقبوا 🚀",
    visitorsLabel: "زوار البوابة:"
  },
  en: {
    welcome: "Knowledge Portal at Falcon Int'l School",
    subWelcome: "Your smart gateway to access knowledge.",
    manualSearch: "Manual Search",
    manualDesc: "Find and access a specific book in the school library.",
    smartSearch: "Ask Saqr (AI)",
    smartDesc: "Your smart AI research assistant.",
    digitalLibrary: "Digital Library",
    digitalDesc: "A world of digital books and novels.",
    creators: "Creators Corner",
    creatorsDesc: "Explore the stories and innovations of your creative peers.",
    bubble: "Welcome to Saqr!",
    homelandTitle: "Hints From Homeland",
    challengeTitle: "Authors Challenge",
    challengeDesc: "Discuss, author your own tales with Saqr, All you have to do is challenge Saqr. Are You Ready?!",
    challengeCTA: "Start your creative journey now",
    term3Banner: "Surprises coming soon in Term 3 2026",
    term3Tag: "STAY TUNED 🚀",
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
  { icon: "📚", textAr: "كتب الكترونية", textEn: "E-Books", color: "border-slate-800" },
  { icon: "🇦🇪", textAr: "الهوية الوطنية", textEn: "N.Identity", color: "border-red-500" }
];

interface BurstItem { id: number; tx: number; ty: number; rot: number; item: typeof KNOWLEDGE_CARDS[0]; }

const HomePage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  const t = (key: keyof typeof translations.ar) => translations[locale][key];
  
  const [bursts, setBursts] = useState<BurstItem[]>([]);
  const [isMascotClicked, setIsMascotClicked] = useState(false);

  const visitorCount = useMemo(() => {
    const baseCount = 1000;
    const startDate = new Date('2026-02-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return baseCount + (diffDays * 157);
  }, []);

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
    <div dir={dir} className="w-full min-h-[100dvh] flex flex-col items-center bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-20 px-4">
      
      {/* 🌟 الخلفية الديناميكية (مثل صفحة البحث الذكي) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[1400px] flex flex-col gap-12 md:gap-20 animate-fade-in-up">
        
        {/* --- 1. قسم الترحيب --- */}
        <div className="text-center space-y-6 md:space-y-8 max-w-5xl mx-auto relative z-20">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('welcome')}
          </h1>
          <p className="text-base md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
            {t('subWelcome')}
          </p>
          <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full"></div>
        </div>

        {/* --- 🌟 لافتة مفاجآت الفصل الثالث --- */}
        <div className="w-full relative z-30 flex flex-col items-center justify-center">
          <div className="group relative overflow-hidden px-8 py-5 md:px-12 md:py-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-4 hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs md:text-sm font-bold px-5 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
              {t('term3Tag')}
            </span>
            <span className="relative z-10 text-sm md:text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {t('term3Banner')} ✨
            </span>
          </div>
        </div>

        {/* --- 2. مركز العمليات والكروت --- */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 order-2 lg:order-1">
            <Link to="/search" className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-red-500/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-start">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-5 group-hover:scale-110 transition-transform">🔍</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('manualSearch')}</h3>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t('manualDesc')}</p>
            </Link>

            <Link to="/smart-search" className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-green-500/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-start">
              <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-5 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('smartSearch')}</h3>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t('smartDesc')}</p>
            </Link>

            <Link to="/digital-library" className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-start">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-5 group-hover:rotate-12 transition-transform">📚</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('digitalLibrary')}</h3>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t('digitalDesc')}</p>
            </Link>

            <Link to="/creators" className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-start">
              <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-5 group-hover:scale-110 transition-transform">🎨</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('creators')}</h3>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t('creatorsDesc')}</p>
            </Link>
          </div>

          {/* التفاعل مع صقر وبطاقة المؤلف الصغير */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 relative gap-8">
            <div onClick={handleMascotInteraction} className={`relative cursor-pointer transition-transform duration-700 ${isMascotClicked ? 'scale-105' : 'hover:scale-105'}`}>
              
              <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none opacity-5 dark:opacity-10 transition-all duration-1000">
                <img src="/school-logo.png" alt="Seal" className="w-[120%] h-[120%] object-contain rotate-12 dark:invert" />
              </div>

              {bursts.map((burst) => (
                <div key={burst.id} 
                  className={`absolute z-[100] bg-white dark:bg-slate-800 px-4 py-2 md:px-5 md:py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-lg animate-burst-steady pointer-events-none flex items-center gap-2`}
                  style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                  <span className="text-lg md:text-2xl">{burst.item.icon}</span>
                  <span className="text-[10px] md:text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{isAr ? burst.item.textAr : burst.item.textEn}</span>
                </div>
              ))}

              <img src="/saqr-full.png" alt="Saqr Mascot" className="h-64 md:h-[500px] object-contain relative z-10 animate-float drop-shadow-2xl" />
              
              <div className="absolute -top-4 -right-2 md:-top-6 md:-right-6 bg-white dark:bg-slate-800 px-6 py-4 rounded-3xl rounded-br-none border border-slate-200 dark:border-slate-700 shadow-xl text-xs md:text-base font-bold text-red-600 dark:text-red-400 animate-bounce z-20">
                {t('bubble')}
              </div>
            </div>

            {/* بطاقة دعوة تحدي المبدعين الصغار */}
            <div className="w-full max-w-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-center relative z-30 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 space-y-4">
                <span className="bg-red-50 dark:bg-red-500/10 text-red-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest">
                  {isAr ? "أطلق العنان لموهبتك" : "Show Your Talent"}
                </span>
                <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {t('challengeTitle')}
                </h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {t('challengeDesc')}
                </p>
                <Link to="/smart-search" className="inline-block mt-2 text-sm md:text-base text-red-600 dark:text-red-400 font-bold uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                  {t('challengeCTA')} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. قسم لمحات من الموطن --- */}
        <div className="w-full px-2">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-green-500 to-red-500"></div>
            
            <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-50 dark:bg-slate-700 rounded-[2rem] flex items-center justify-center text-4xl md:text-6xl shadow-inner border border-slate-100 dark:border-slate-600 shrink-0">
              🇦🇪
            </div>
            
            <div className="text-center md:text-start flex-1 space-y-3 md:space-y-4">
              <h3 className="text-sm md:text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                {t('homelandTitle')}
              </h3>
              <p className="text-lg md:text-3xl text-slate-900 dark:text-white leading-[1.6] font-bold">
                {isAr ? dailyFact.ar : dailyFact.en}
              </p>
            </div>
          </div>
        </div>

        {/* --- 4. عداد الزوار والتاريخ --- */}
        <div className="w-full flex justify-center pb-10">
          <div className="bg-white dark:bg-slate-800 px-8 py-5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
              <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                {t('visitorsLabel')}
              </span>
              <span className="text-slate-900 dark:text-white font-bold text-lg">
                {visitorCount.toLocaleString()}
              </span>
            </div>
            
            <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="text-lg">📅</span>
              <span className="font-bold text-sm tracking-wide">
                {todayDate}
              </span>
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
        .animate-burst-steady { animation: burst-steady 2.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .animate-float { animation: float 8s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default HomePage;
