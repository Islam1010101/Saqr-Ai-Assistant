import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
  ar: {
    welcome: "بوابة المعرفة مدرسة صقر الإمارات",
    subWelcome: "بوابتك الذكية للوصول إلى المعلومات.",
    newsTitle: "جديدنا",
    newsContent: "بإمكانك الآن الاطلاع على المكتبة الإلكترونية التي تم تحديثها لتضم عدداً أكبر وتنوعاً أوسع من الكتب والإصدارات باللغتين العربية والإنجليزية، مع إضافة تصنيف الفئة العمرية للكتب. كما يمكنك من خلال 'اسأل صقر' خوض تحدي التأليف وإصدار شهادة باسمك! والآن، استديو البودكاست متاح للتسجيل ومشاركة إبداعاتكم الصوتية.",
    manualSearch: "البحث اليدوي",
    manualDesc: "البحث عن كتاب ما في مكتبة المدرسة والوصول إليه.",
    smartSearch: "اسأل صقر الذكي",
    smartDesc: "مساعدك الذكي للبحث والاستفسار.",
    digitalLibrary: "المكتبة الإلكترونية",
    digitalDesc: "عالم من الكتب والروايات الرقمية.",
    creators: "ركن المبدعين",
    creatorsDesc: "استكشف قصص وابتكارات زملائك المبدعين.",
    scheduleTitle: "جدول المكتبة",
    scheduleDesc: "حجز وتنسيق حصص زيارة المكتبة للمعلمين.",
    gameTitle: "رتب المكتبة",
    gameDesc: "العب، استمتع، وتعلم كيفية تصنيف الكتب.",
    bubble: "فخورين بالإمارات",
    homelandTitle: "لمحات من الموطن",
    challengeTitle: "تحدي المبدعين",
    challengeDesc: "ناقش، ابدأ قصتك الخاصة مع صقر، وأثبت موهبتك. هل أنت مستعد للتحدي؟",
    challengeCTA: "ابدأ رحلة الإبداع الآن",
    saqrStudioBanner: "استديو صقر",
    saqrStudioTag: "",
    visitorsLabel: "زوار البوابة:",
    upcomingEvents: "أحداث قريبة",
    startsIn: "يبدأ:",
    endsIn: "ينتهي خلال:",
    dayUnit: "يوم",
    daysUnit: "أيام",
    alcLibraryTitle: "المكتبة العربية الرقمية",
    alcLibrarySub: "مبادرة رائدة يقدمها مركز أبو ظبي للغة العربية",
    recentBooksTitle: "وصل حديثاً في المكتبة",
    by: "تأليف:",
    publisher: "الناشر:",
    seeMore: "عرض المزيد",
    seeMoreDesc: "اكتشف القائمة الكاملة والملخصات الذكية للكتب الجديدة",
    newBadge: "جديد"
  },
  en: {
    welcome: "Knowledge Portal at Falcon Int'l School",
    subWelcome: "Your smart gateway to access knowledge.",
    newsTitle: "What's New",
    newsContent: "Explore the newly updated Digital Library, featuring a wider variety of books categorized by age group. Through 'Ask Saqr', take on the 'Author Challenge' and earn your certificate! The Podcast Studio is now live for your recordings.",
    manualSearch: "Manual Search",
    manualDesc: "Find and access a specific book in the school library.",
    smartSearch: "Ask Saqr (AI)",
    smartDesc: "Your smart AI research assistant.",
    digitalLibrary: "Digital Library",
    digitalDesc: "A world of digital books and novels.",
    creators: "Creators Corner",
    creatorsDesc: "Explore the stories and innovations of your peers.",
    scheduleTitle: "Library Schedule",
    scheduleDesc: "Book and coordinate library visits for teachers.",
    gameTitle: "Library Game",
    gameDesc: "Play, enjoy, and learn book classification.",
    bubble: "Proud of the UAE",
    homelandTitle: "Hints From Homeland",
    challengeTitle: "Authors Challenge",
    challengeDesc: "Discuss, author your own tales with Saqr, and prove your talent. Are you ready?",
    challengeCTA: "Start your creative journey",
    saqrStudioBanner: "Saqr Studio",
    saqrStudioTag: "",
    visitorsLabel: "Portal Visitors:",
    upcomingEvents: "Upcoming Events",
    startsIn: "Starts :",
    endsIn: "Ends in:",
    dayUnit: "Day",
    daysUnit: "Days",
    alcLibraryTitle: "Digital Arabic Library",
    alcLibrarySub: "A leading initiative by Abu Dhabi Arabic Language Centre",
    recentBooksTitle: "Newly Arrived Books",
    by: "By:",
    publisher: "Publisher:",
    seeMore: "See More",
    seeMoreDesc: "Discover the full list and AI summaries for all new arrivals",
    newBadge: "NEW"
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

const ACADEMIC_EVENTS = [
  { 
    ar: "إجازة منتصف الفصل الدراسي الأول", 
    en: "Mid-term break", 
    startDate: new Date('2026-10-12T00:00:00'), 
    endDate: new Date('2026-10-16T23:59:59'),
    displayDate: "12 October 2026" 
  }
];

const FEATURED_BOOKS = [
  { id: 1, titleAr: "سلسلة عالمي الصغير", authorAr: "محمد بن راشد آل مكتوم", publisherAr: "دون ناشر", titleEn: "My Little World Series", authorEn: "Mohammed bin Rashid Al Maktoum", publisherEn: "No Publisher", cover: "https://mediaoffice.ae/-/media/2021/jan/09-01/05/my-little-world-cover-02.png?sc_lang=ar&hash=AC07100E6A716B1F6AA95942629C21CD" },
  { id: 2, titleAr: "حكيم العرب", authorAr: "مريم صقر القاسمي", publisherAr: "الهدهد للنشر", titleEn: "Wise Man of the Arabs", authorEn: "Maryam Saqr Al Qasimi", publisherEn: "Al Hudhud Publishing", cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1614967678i/57318992.jpg" },
  { id: 3, titleAr: "أسرار الفضاء مع هزاع وأصدقائه", authorAr: "هدى المشالي", publisherAr: "نبض القلم للنشر والتوزيع", titleEn: "Space Secrets with Hazza & Friends", authorEn: "Huda Al Mashali", publisherEn: "Nabdh Al Qalam", cover: "https://shop.dubailibrary.com/cdn/shop/products/612e7326064215f4bc787e432d2f6c95_600x600_crop_center.jpg?v=1664177351" },
  { id: 4, titleAr: "يتامى في الغيب", authorAr: "سلامة بنت هزاع آل نهيان", publisherAr: "المؤلف", titleEn: "Orphans in the Unseen", authorEn: "Salama Bint Hazza Al Nahyan", publisherEn: "Author", cover: "https://cdn1-m.alittihad.ae/assets/images/Articles/750x425/2019/4/2019430232338983E2.jpg?v=7&format=jpg" },
  { id: 5, titleAr: "التنمية المستدامة - رهان الحاضر", authorAr: "سيلفي برونيل", publisherAr: "كلمة", titleEn: "Sustainable Development", authorEn: "Sylvie Brunel", publisherEn: "Kalima", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRKg00ZPa1fDxxggjnMxBjurgEERKSOCty0tKbFM_h1A&s=10" },
  { id: 6, titleAr: "أحمد بن ماجد: أسد البحار", authorAr: "عائشة الغيص", publisherAr: "الظبي للنشر", titleEn: "Ahmad bin Majid: Lion of the Seas", authorEn: "Aisha Al Ghais", publisherEn: "Al Dhabi Publishing", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbaDeTlyQX6f_qLje_EJ-AmXZghV-MTCaunCctD1hN0KTfze1Q9FK5Vnny&s=10" },
  { id: 7, titleAr: "الشيخ نهيان بن مبارك رجل التسامح", authorAr: "صبحة الخييلي", publisherAr: "مداد للنشر والتوزيع", titleEn: "Sheikh Nahyan bin Mubarak", authorEn: "Sobha Al Khaili", publisherEn: "Medad Publishing", cover: "https://catalogue.mbrl.ae/BookCovers/Symphony/08082023/349321/mbc.jpg" },
  { id: 8, titleAr: "محمد بن زايد والتعليم", authorAr: "مركز الإمارات للدراسات والبحوث الاستراتيجية", publisherAr: "مركز الإمارات للدراسات والبحوث الاستراتيجية", titleEn: "Mohamed bin Zayed and Education", authorEn: "ECSSR", publisherEn: "ECSSR", cover: "https://www.ecssr.ae/en/api/common/Thumbnail/eyJgmnameSI6IjRjMWZlMDdhLTVhY2EtNDI4ZS05Zjc5LTk0YjBlMTUwYTZjNS5qcGciLCJmb2xkZXJQYXRoIjoiSW1hZ2VzL1Byb2R1Y3RzIiwiYXNzZXRJZCI6bnVsbCwibGFuZ0lkIjpudWxsfQ%3D%3D" },
  { id: 9, titleAr: "الصدام داخل الحضارات", authorAr: "دييتر سنغاس", publisherAr: "كلمة", titleEn: "The Clash Within Civilizations", authorEn: "Dieter Senghaas", publisherEn: "Kalima", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpORGHnf4xmE7teLTq1IRDORrLMFfDgbarV1Ni9HI-LA&s=10" },
  { id: 10, titleAr: "زن وفن صيانة الدراجة النارية", authorAr: "روبرت م بيرسيغ", publisherAr: "كلمة", titleEn: "Zen and the Art of Motorcycle Maintenance", authorEn: "Robert M. Pirsig", publisherEn: "Kalima", cover: "https://pbs.twimg.com/media/DVnl6p-UQAAPzpf.jpg" },
];

interface BurstItem { id: number; tx: number; ty: number; rot: number; color: string; }

// ==========================================
// مكونات الأيقونات (SVG)
// ==========================================
const SearchIcon = () => (
  <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const RobotIcon = () => (
  <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" strokeWidth={4} />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth={4} />
  </svg>
);
const BookIcon = () => (
  <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const PaletteIcon = () => (
  <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.66 0 3-1.34 3-3 0-.35-.07-.69-.21-1-.28-.62-1.07-1.46-1.57-2.09-.34-.43-.72-1.09-.72-1.91 0-1.66 1.34-3 3-3h.64c2.81 0 5.1-2.07 5.73-4.83A9.98 9.98 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
  </svg>
);
const GameIcon = () => (
  <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="4" />
    <path d="M6 12h4m-2-2v4M15 11h.01M18 13h.01" />
  </svg>
);
const ScheduleIcon = () => (
  <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="14" x2="10" y2="14" />
    <line x1="14" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="10" y2="18" />
    <line x1="14" y1="18" x2="16" y2="18" />
  </svg>
);

const StarIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const UaeFlagIcon = () => (
  <svg viewBox="0 0 640 480" className="w-10 h-10 rounded shadow-sm overflow-hidden" preserveAspectRatio="none">
    <path fill="#00732f" d="M0 0h640v160H0z"/>
    <path fill="#fff" d="M0 160h640v160H0z"/>
    <path fill="#000" d="M0 320h640v160H0z"/>
    <path fill="#ff0000" d="M0 0h220v480H0z"/>
  </svg>
);

const HomePage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  const t = (key: keyof typeof translations.ar) => translations[locale][key];
  
  const [bursts, setBursts] = useState<BurstItem[]>([]);
  const [isMascotClicked, setIsMascotClicked] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [activeEvent, setActiveEvent] = useState<typeof ACADEMIC_EVENTS[0] | null>(null);
  const [countdownType, setCountdownType] = useState<'start' | 'end'>('start');

  useEffect(() => {
    const checkTime = () => {
      const now = new Date().getTime();
      const upcoming = ACADEMIC_EVENTS.find(event => event.endDate.getTime() > now);
      
      if (upcoming) {
        setActiveEvent(upcoming);
        let target = upcoming.startDate.getTime();
        
        if (now > upcoming.startDate.getTime()) {
          target = upcoming.endDate.getTime();
          setCountdownType('end');
        } else {
          setCountdownType('start');
        }

        const distance = target - now;
        setDaysLeft(Math.ceil(distance / (1000 * 60 * 60 * 24)));
      }
    };

    checkTime();
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, []);

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
    const colors = ['text-red-500', 'text-blue-500', 'text-yellow-400', 'text-green-500', 'text-purple-500'];
    const newBursts: BurstItem[] = Array.from({ length: 5 }).map((_, i) => ({
      id: id + i,
      color: colors[Math.floor(Math.random() * colors.length)],
      tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 150 : 300), 
      ty: -100 - Math.random() * 150,
      rot: (Math.random() - 0.5) * 180
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
    <div dir={dir} className="w-full min-h-[100dvh] flex flex-col items-center bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-16 px-4">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-400/20 rounded-full blur-[100px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-sky-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-amber-400/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-[1300px] flex flex-col gap-10 md:gap-16 animate-fade-in-up">
        
        <div className="text-center space-y-4 max-w-4xl mx-auto relative z-20 transition-transform duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
            {t('welcome')}
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">
            {t('subWelcome')}
          </p>
          <div className="h-2 w-20 bg-amber-400 mx-auto rounded-full mt-4 animate-pulse"></div>
        </div>

        <div className="w-full max-w-5xl mx-auto relative z-30 flex items-center bg-white dark:bg-slate-800 border-4 border-amber-300 dark:border-amber-700 rounded-full shadow-lg overflow-hidden h-14 md:h-16 hover:scale-[1.01] transition-all duration-300">
          <div className="bg-amber-400 text-slate-900 font-black px-6 md:px-8 h-full flex items-center justify-center gap-2 relative z-20 shrink-0 uppercase tracking-widest">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            {t('newsTitle')}
          </div>
          <div className="flex-1 overflow-hidden h-full flex items-center relative group bg-amber-50 dark:bg-slate-800 z-20">
            <div className={`whitespace-nowrap ${isAr ? 'animate-marquee-rtl' : 'animate-marquee-ltr'} text-slate-800 dark:text-slate-100 font-bold text-sm md:text-lg px-4 group-hover:[animation-play-state:paused] cursor-pointer`}>
              {t('newsContent')}
            </div>
          </div>
        </div>

        <div className="w-full relative z-30 flex flex-col items-center justify-center">
          <Link to="/saqr-studio" className="group relative px-10 py-4 md:px-16 md:py-5 w-fit rounded-full bg-blue-500 text-white border-b-8 border-blue-700 shadow-lg flex items-center justify-center hover:-translate-y-1 hover:border-b-8 active:border-b-0 active:translate-y-2 transition-all duration-200">
            <span className="relative z-10 text-lg md:text-2xl font-black uppercase tracking-wide">
              {t('saqrStudioBanner')}
            </span>
          </Link>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-10 items-center justify-center">
          
          <div className="lg:order-2 flex flex-col items-center justify-center relative z-20 max-w-sm w-full">
            <div onClick={handleMascotInteraction} className={`relative cursor-pointer transition-transform duration-300 w-full flex justify-center items-center ${isMascotClicked ? 'scale-95' : 'hover:scale-105'}`}>
              
              <img src="/school-logo.png" alt="" className="absolute inset-0 m-auto w-[80%] h-[80%] object-contain opacity-10 dark:opacity-20 dark:invert z-0 pointer-events-none" />

              {bursts.map((burst) => (
                <div key={burst.id} 
                  className={`absolute z-[100] animate-burst-steady pointer-events-none ${burst.color}`}
                  style={{ '--tx': `${burst.tx}px`, '--ty': `${burst.ty}px`, '--rot': `${burst.rot}deg` } as any}>
                  <StarIcon className="w-10 h-10 drop-shadow-md" />
                </div>
              ))}
              
              <img src="/saqr-full.png" alt="Saqr Mascot" className="h-64 md:h-[400px] object-contain relative z-10 animate-float drop-shadow-2xl" />
              
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 px-6 py-4 rounded-[2rem] rounded-br-none border-4 border-rose-400 shadow-xl text-sm md:text-lg font-black text-rose-500 animate-float-delayed z-20">
                {t('bubble')}
              </div>
            </div>
          </div>

          <div className="lg:order-1 lg:order-3 flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            
            <Link to="/search" className="bg-sky-400 text-white p-6 rounded-[2rem] border-b-8 border-sky-600 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center text-center shadow-md">
              <SearchIcon />
              <h3 className="text-xl md:text-2xl font-black mb-2">{t('manualSearch')}</h3>
              <p className="text-sm font-bold opacity-90">{t('manualDesc')}</p>
            </Link>

            <Link to="/smart-search" className="bg-emerald-400 text-white p-6 rounded-[2rem] border-b-8 border-emerald-600 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center text-center shadow-md">
              <RobotIcon />
              <h3 className="text-xl md:text-2xl font-black mb-2">{t('smartSearch')}</h3>
              <p className="text-sm font-bold opacity-90">{t('smartDesc')}</p>
            </Link>

            <Link to="/digital-library" className="bg-indigo-400 text-white p-6 rounded-[2rem] border-b-8 border-indigo-600 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center text-center shadow-md">
              <BookIcon />
              <h3 className="text-xl md:text-2xl font-black mb-2">{t('digitalLibrary')}</h3>
              <p className="text-sm font-bold opacity-90">{t('digitalDesc')}</p>
            </Link>

            <Link to="/creators" className="bg-purple-400 text-white p-6 rounded-[2rem] border-b-8 border-purple-600 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center text-center shadow-md">
              <PaletteIcon />
              <h3 className="text-xl md:text-2xl font-black mb-2">{t('creators')}</h3>
              <p className="text-sm font-bold opacity-90">{t('creatorsDesc')}</p>
            </Link>

            {/* جدول المكتبة مع شارة جديد */}
            <Link to="/schedule" className="relative bg-teal-500 text-white p-6 rounded-[2rem] border-b-8 border-teal-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center text-center shadow-md">
              <div className="absolute top-4 start-4 bg-rose-500 text-white text-[10px] md:text-xs px-3 py-0.5 rounded-full font-black uppercase tracking-wider shadow-md animate-pulse">
                {t('newBadge')}
              </div>
              <ScheduleIcon />
              <h3 className="text-xl md:text-2xl font-black mb-2">{t('scheduleTitle')}</h3>
              <p className="text-sm font-bold opacity-90">{t('scheduleDesc')}</p>
            </Link>

            {/* رتب المكتبة مع شارة جديد */}
            <Link to="/game" className="relative bg-amber-400 text-slate-900 p-6 rounded-[2rem] border-b-8 border-amber-600 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center text-center shadow-md sm:col-span-2 lg:col-span-2 xl:col-span-1">
              <div className="absolute top-4 start-4 bg-rose-500 text-white text-[10px] md:text-xs px-3 py-0.5 rounded-full font-black uppercase tracking-wider shadow-md animate-pulse">
                {t('newBadge')}
              </div>
              <GameIcon />
              <h3 className="text-xl md:text-2xl font-black mb-2">{t('gameTitle')}</h3>
              <p className="text-sm font-bold opacity-90">{t('gameDesc')}</p>
            </Link>

          </div>
        </div>

        <div className="w-full mt-6">
          <a 
            href="https://www.amazon.com/stores/page/64B19CDC-2694-46EA-8C7D-AA43238F9A37" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group w-full max-w-4xl mx-auto bg-rose-500 border-b-6 border-rose-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 rounded-3xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-5 transition-all shadow-sm block text-white"
          >
            <div className="bg-white rounded-xl p-2 shrink-0 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img src="https://alc.ae/media/htonj1al/alc-logo-header.png" alt="ALC Logo" className="w-16 md:w-20 h-16 md:h-20 object-contain" />
            </div>
            <div className="flex-1 text-center md:text-start space-y-1">
              <div className="inline-block px-3 py-0.5 rounded-full bg-rose-700/50 text-white text-[10px] font-black uppercase tracking-widest mb-1">
                  Initiative | مبادرة
              </div>
              <h3 className="text-lg md:text-2xl font-black leading-tight">
                {t('alcLibraryTitle')}
              </h3>
              <p className="text-sm md:text-lg font-bold opacity-90">
                {t('alcLibrarySub')}
              </p>
            </div>
            <div className="shrink-0 bg-white text-rose-600 w-10 h-10 rounded-full flex items-center justify-center text-xl font-black shadow-md group-hover:translate-x-2 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>
        </div>

        <div className="w-full px-2 mt-2 space-y-6">
          <div className="flex items-center justify-between border-b-4 border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
              {t('recentBooksTitle')}
            </h3>
            <Link to="/new-arrivals" className="text-sm md:text-base bg-blue-500 text-white font-black px-6 py-2 rounded-full border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all">
              {t('seeMore')}
            </Link>
          </div>
          
          <div className="w-full overflow-x-auto flex gap-6 pb-6 pt-2 scrollbar-thin scroll-smooth snap-x">
            {FEATURED_BOOKS.map((book) => (
              <div 
                key={book.id} 
                className="min-w-[200px] md:min-w-[240px] max-w-[240px] snap-start bg-white dark:bg-slate-800 rounded-[2rem] border-4 border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="h-44 md:h-52 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-b-4 border-slate-200 dark:border-slate-700">
                  <img 
                    src={book.cover} 
                    alt={isAr ? book.titleAr : book.titleEn} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase shadow-sm">NEW</div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-center">
                  <h4 className="text-sm md:text-base font-black text-slate-800 dark:text-white line-clamp-2 leading-snug">
                    {isAr ? book.titleAr : book.titleEn}
                  </h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-600 dark:text-slate-400 font-bold truncate">
                      {isAr ? book.authorAr : book.authorEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Link 
              to="/new-arrivals"
              className="min-w-[200px] md:min-w-[220px] max-w-[220px] snap-start bg-amber-400 text-slate-900 rounded-[2rem] border-b-8 border-amber-600 p-5 shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 flex flex-col justify-center items-center text-center gap-3 cursor-pointer"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black">{t('seeMore')}</h4>
                <p className="text-xs font-bold opacity-80">{t('seeMoreDesc')}</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 pb-10 px-2">
          
          <div className="bg-amber-100 dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] border-4 border-amber-300 dark:border-amber-700 shadow-sm flex flex-col items-center md:items-start text-center md:text-start h-full relative overflow-hidden">
            <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-6 shrink-0 z-10 border-2 border-amber-200 dark:border-amber-600">
              <UaeFlagIcon />
            </div>
            <div className="space-y-4 z-10 flex-1">
              <h3 className="text-lg md:text-xl font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                {t('homelandTitle')}
              </h3>
              <p className="text-xl md:text-3xl text-slate-800 dark:text-white leading-relaxed font-black">
                {isAr ? dailyFact.ar : dailyFact.en}
              </p>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-200/50 dark:bg-amber-900/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          <div className="flex flex-col gap-6 h-full">
            
            <div className="bg-white dark:bg-slate-800 px-6 py-5 rounded-[2rem] border-4 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-slate-600 dark:text-slate-300 font-bold text-sm md:text-base">{t('visitorsLabel')}</span>
                <span className="text-slate-900 dark:text-white font-black text-xl">{visitorCount.toLocaleString()}</span>
              </div>
              <div className="hidden sm:block h-8 w-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="font-black text-sm md:text-base">{todayDate}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-700 shadow-sm flex-1 flex flex-col items-center justify-center">
              {daysLeft !== null && activeEvent ? (
                <div className="w-full flex flex-col items-center gap-4 animate-fade-in-up">
                  <div className="bg-rose-100 dark:bg-rose-900/30 px-6 py-2 rounded-full border-2 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 font-black text-sm md:text-base text-center">
                    {countdownType === 'start' ? t('startsIn') : t('endsIn')} {isAr ? activeEvent.ar : activeEvent.en}
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="bg-white dark:bg-slate-800 w-24 h-24 md:w-32 md:h-32 rounded-full border-8 border-rose-400 flex items-center justify-center shadow-lg">
                      <span className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white">
                        {daysLeft}
                      </span>
                    </div>
                    <span className="mt-3 text-sm md:text-base font-black text-slate-500 uppercase tracking-widest">
                      {daysLeft === 1 ? t('dayUnit') : t('daysUnit')}
                    </span>
                  </div>
                </div>
              ) : (
                <h4 className="text-slate-400 dark:text-slate-500 text-sm uppercase tracking-[0.2em] font-black mb-4">
                  {t('upcomingEvents')}
                </h4>
              )}

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {ACADEMIC_EVENTS.map((event, idx) => (
                  <div key={idx} className={`bg-slate-50 dark:bg-slate-900/50 border-2 ${activeEvent?.ar === event.ar ? 'border-rose-400 scale-105' : 'border-slate-200 dark:border-slate-700'} px-4 py-2 rounded-xl flex flex-col items-center gap-1 text-center`}>
                    <span className="text-slate-800 dark:text-white font-black text-xs md:text-sm">
                      {isAr ? event.ar : event.en}
                    </span>
                    <span className="text-slate-500 font-bold text-[10px] md:text-xs">
                      {event.displayDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
        
        @keyframes burst-steady {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          20% { transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(var(--rot)); opacity: 1; }
          80% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
          100% { transform: translate(var(--tx), calc(var(--ty) - 20px)) scale(0.8) rotate(var(--rot)); opacity: 0; }
        }
        .animate-burst-steady { animation: burst-steady 2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delayed { animation: float 5s ease-in-out infinite; animation-delay: 1.5s; }
        
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        
        @keyframes marquee-ltr { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        @keyframes marquee-rtl { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-marquee-ltr { animation: marquee-ltr 50s linear infinite; }
        .animate-marquee-rtl { animation: marquee-marquee-rtl 50s linear infinite; }
        
        .scrollbar-thin::-webkit-scrollbar { height: 8px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #475569; }
      `}</style>
    </div>
  );
};

export default HomePage;
