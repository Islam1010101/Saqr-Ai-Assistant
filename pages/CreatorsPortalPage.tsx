import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- الأيقونات البرمجية SVG ---
const IconPlay = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const IconStop = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="3"/></svg>;
const IconRead = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"/></svg>;
const UserIcon = () => (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const HeadphonesIcon = () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
);

// --- مكون التلاشي المخصص (Reveal Component) ---
const RevealOnScroll = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    const [isVisible, setIsVisible] = useState(true);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            {
                threshold: 0.15,
                rootMargin: "-20px 0px -20px 0px"
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={elementRef}
            className={`transition-all duration-700 ease-out transform w-full ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// --- بطاقة الكتاب بالتصميم الثنائي الأبعاد (2D Flat Design) المتطابق مع الموقع ---
const CreatorCard = React.memo(({ work, isPlaying, onPlayToggle, isAr }: { work: any, isPlaying: boolean, onPlayToggle: (id: string) => void, isAr: boolean }) => {
    const colors = [
        'from-blue-500 to-sky-500 border-blue-200',
        'from-emerald-500 to-teal-400 border-emerald-200',
        'from-rose-500 to-pink-500 border-rose-200',
        'from-amber-500 to-orange-400 border-amber-200',
        'from-purple-500 to-indigo-500 border-purple-200'
    ];
    // تحديد لون عشوائي بناء على الحرف الأول للثبات
    const colorClass = colors[work.title.length % colors.length];

    return (
        <div className="relative group w-full h-[320px] md:h-[350px] flex items-stretch justify-center p-2">
            
            {/* هالة مضيئة خلف الكتاب في حالة التشغيل */}
            {isPlaying && (
                <div className="absolute inset-0 bg-white/30 blur-3xl rounded-[2rem] scale-105 opacity-80 animate-pulse transition-all duration-500 pointer-events-none -z-10"></div>
            )}

            <div className={`w-full h-full relative rounded-[2rem] border-4 shadow-lg bg-gradient-to-br ${colorClass} transition-all duration-500 transform group-hover:-translate-y-3 group-hover:shadow-2xl overflow-hidden flex flex-col`}>
                
                {/* تأثير انعكاس الزجاج الخفيف */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/10 pointer-events-none z-10"></div>
                
                {/* صورة غلاف القصة العلوية مع زر قراءة الكتاب */}
                <div className="relative h-1/2 w-full overflow-hidden rounded-t-[1.5rem] z-20">
                    <img src={work.cover} alt={work.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-white/90 text-slate-900 font-black px-6 py-2.5 rounded-full flex items-center gap-2 hover:scale-105 hover:bg-white transition-all shadow-xl text-xs uppercase translate-y-4 group-hover:translate-y-0 duration-300">
                            {isAr ? 'قراءة الكتاب' : 'Read Book'} <IconRead />
                        </a>
                    </div>
                </div>

                <div className="p-4 md:p-5 flex flex-col flex-1 relative z-20 bg-black/20 backdrop-blur-md">
                    
                    <div className="flex-1 flex flex-col justify-center text-center mt-1">
                        <h3 className="font-black text-lg md:text-xl text-white leading-tight drop-shadow-md line-clamp-2 mb-2">
                            {work.title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 justify-center bg-black/20 p-2 rounded-xl w-fit mx-auto backdrop-blur-sm mb-4">
                            <UserIcon />
                            <p className="text-xs md:text-sm font-bold truncate uppercase tracking-wide">{work.author}</p>
                        </div>
                    </div>

                    {/* زر الاستماع */}
                    <button 
                        onClick={() => onPlayToggle(work.id)} 
                        className={`w-full py-2.5 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden mt-auto ${isPlaying ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] border border-rose-300' : 'bg-white/20 text-white hover:bg-white hover:text-slate-900 border border-white/40'}`}
                    >
                        {isPlaying && <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>}
                        <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest">
                            {isPlaying ? <><IconStop /> {isAr ? 'إيقاف' : 'Stop'}</> : <><HeadphonesIcon /> {isAr ? 'استمع للملخص' : 'Play Summary'}</>}
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
});


const CreatorsPortalPage: React.FC = () => {
    // تعيين الإنجليزية كلغة افتراضية عند فتح الصفحة مباشرة
    const { locale, dir } = useLanguage();
    const [currentLocale, setCurrentLocale] = useState(locale || 'en');
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentLocale(locale);
    }, [locale]);

    const isAr = currentLocale === 'ar';
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

    // حالة للتحكم في ظهور وتلاشي الحاوية الرئيسية للهيدر
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    // متابعة التمرير لتلاشي الصفحة الرئيسية
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // البيانات الأساسية
const baseWorks = [
        { id: "1", title: isAr ? "أبي نبع العطاء" : "Father: Fountain of Giving", author: isAr ? "ياسين محمد مسعود" : "Yassin Mohamed", cover: "/cover/12.jpg", pdfUrl: "https://drive.google.com/file/d/1EcOPekgKRMhnq-HTiqU5hLrVxMIl2MEV/view?usp=drive_link", audioUrl: "/audio/أبي نبع العطاء.mp3" },
        { id: "2", title: isAr ? "الصدق منجاة" : "Honesty is Salvation", author: isAr ? "الصالح إسماعيل المصري" : "Al-Saleh Ismail", cover: "/cover/17.jpg", pdfUrl: "https://drive.google.com/file/d/1WbIIcUpBd2s4on8aMSiw20KCG5fpK-IA/view?usp=drive_link", audioUrl: "/audio/الصدق منجاة.mp3" },
        { id: "3", title: isAr ? "مسرحية اللغة العربية" : "Arabic Language Play", author: isAr ? "فاطمة فلاح الأحبابي" : "Fatima Al-Ahbabi", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/1DZk9Moh7CceSN5fpekCtxfRzNSzQiYMY/view?usp=drive_link", audioUrl: "/audio/اللغة العربية.mp3" },
        { id: "4", title: isAr ? "حلم سيتحقق" : "A Dream Will Come True", author: isAr ? "عدنان نزار" : "Adnan Nizar", cover: "/cover/16.jpg", pdfUrl: "https://drive.google.com/file/d/1nW4QxzZ3OmeOmH7r_F1I9W08OQbR1urJ/view?usp=drive_link", audioUrl: "/audio/حلم سيتحقق.mp3" },
        { id: "5", title: isAr ? "حين تهت وجدتني" : "When I Was Lost", author: isAr ? "ملك مجدي الدموكي" : "Malak Majdi", cover: "/cover/1.jpg", pdfUrl: "https://drive.google.com/file/d/1pMUrhpyM3dpFCqJqBTt3amN3p-oLO3Ij/view?usp=drive_link", audioUrl: "/audio/حين تهت وجدتني.mp3" },
        { id: "6", title: isAr ? "خطوات وحكايات" : "Steps and Tales", author: isAr ? "مريم عبدالرحمن" : "Maryam Abdulrahman", cover: "/cover/14.jpg", pdfUrl: "https://drive.google.com/file/d/1QGRNlRc2v-a1q-gUJUoi37zcxw0sz0Ls/view?usp=drive_link", audioUrl: "/audio/خطوات في ارض الذهب.mp3" },
        { id: "7", title: isAr ? "شجاعة في الصحراء" : "Courage in Desert", author: isAr ? "يمنى أيمن النجار" : "Yomna Ayman", cover: "/cover/13.jpg", pdfUrl: "https://drive.google.com/file/d/1b9H8XILdFZWsTCKmdgmJa9s5EoaNlp0r/view?usp=drive_link", audioUrl: "/audio/شجاعة.mp3" },
        { id: "8", title: isAr ? "ظل نخلة" : "Palm Shadow", author: isAr ? "محمد نور الراضي" : "Mohamed Nour", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/1C3uWMm_sLYKbFJrgilzpxXt_TjlKm2bp/view?usp=drive_link", audioUrl: "/audio/قصة بوسعيد.mp3" },
        { id: "9", title: isAr ? "عندما يعود الخير" : "When Goodness Returns", author: isAr ? "سهيلة البلوشي" : "Suhaila Al-Balooshi", cover: "/cover/15.jpg", pdfUrl: "https://drive.google.com/file/d/1mxaLmat3IEg2SItPiLjLa7U-hqrACw2e/view?usp=drive_link", audioUrl: "/audio/عندما يعود الخير.mp3" },
        { id: "10", title: isAr ? "لمار تهمس" : "Lamar Whispers", author: isAr ? "ألين رافع فريحات" : "Aleen Rafe", cover: "/cover/11.jpg", pdfUrl: "https://drive.google.com/file/d/1C0S0PA-yg2RDmXCB6-MlMoRLp2mp-Utw/view?usp=drive_link", audioUrl: "/audio/لمار.mp3" }
    ];
    
    // ترتيب عشوائي عند التحميل
    const studentWorks = useMemo(() => {
        return [...baseWorks].sort(() => Math.random() - 0.5);
    }, [baseWorks]);

    const handleAudioPlay = (id: string) => {
        const targetAudio = audioRefs.current.get(id);
        if (playingAudioId === id) {
            targetAudio?.pause();
            setPlayingAudioId(null);
        } else {
            audioRefs.current.forEach((audio) => { audio.pause(); audio.currentTime = 0; });
            targetAudio?.play().catch(() => {});
            setPlayingAudioId(id);
        }
    };

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col items-center bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-500 pb-20">
            
            {/* 🌟 الخلفية الديناميكية النابضة 🌟 */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-pink-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className={`w-full max-w-[1400px] mx-auto px-4 md:px-6 relative z-10 antialiased overflow-x-hidden transition-all duration-700 ease-in-out transform origin-top`}>
                
                {/* --- 1. قسم الترحيب العلوي --- */}
                <div className={`text-center mt-12 mb-16 relative transition-all duration-700 ease-in-out transform origin-top ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95 pointer-events-none'}`}>
                    <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-slate-200 hover:-translate-x-1 active:translate-y-1 border-b-4 border-slate-300 dark:border-slate-700 active:border-b-0 transition-all flex items-center gap-2 shadow-sm">
                        <span className="text-xl leading-none rtl:rotate-180">←</span> {isAr ? 'العودة' : 'Back'}
                    </button>
                    
                    <h1 className={`text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 uppercase tracking-tight`}>
                        {isAr ? 'ركن المبدعين' : 'CREATORS CORNER'}
                    </h1>
                    <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto pt-4">
                        {isAr ? 'مساحة حيث تلتقي الأفكار المبتكرة لتشكل المستقبل. استكشف إبداعات زملائك في عالم التأليف.' : 'A space where innovative ideas meet to shape the future. Explore your peers\' authoring creations.'}
                    </p>
                    <div className="flex justify-center gap-3 mt-6">
                        <div className="w-16 h-2 bg-purple-500 rounded-full" />
                        <div className="w-8 h-2 bg-pink-400 rounded-full" />
                    </div>
                </div>

                {/* --- 2. عرض البطاقات (Grid متوافق مع الموبايل وعمود واحد على الشاشات الصغيرة) --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-4 md:gap-x-6 px-2 md:px-4">
                    {studentWorks.map((work, index) => (
                        <RevealOnScroll key={work.id} delay={(index % 4) * 100}>
                            <div className="w-full max-w-sm mx-auto">
                                <CreatorCard 
                                    work={work} 
                                    isAr={isAr}
                                    isPlaying={playingAudioId === work.id} 
                                    onPlayToggle={handleAudioPlay} 
                                />
                            </div>
                            
                            {/* إخفاء المشغل الحقيقي في الخلفية واستدعائه برمجياً */}
                            <audio 
                                ref={el => { if(el) audioRefs.current.set(work.id, el); }} 
                                onEnded={() => setPlayingAudioId(null)} 
                                src={work.audioUrl} 
                                hidden 
                            />
                        </RevealOnScroll>
                    ))}
                </div>

                {/* --- 3. لافتة "قريباً ستكون أنت أحد المبدعين" (في الأسفل مع تأثير تلاشي) --- */}
                <RevealOnScroll delay={300}>
                    <div className="mt-20 w-full text-center flex justify-center px-4">
                        <div className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 dark:from-amber-600 dark:via-yellow-500 dark:to-amber-600 p-[4px] rounded-[3rem] shadow-2xl hover:scale-105 transition-transform duration-500 max-w-3xl w-full">
                            <div className="bg-white dark:bg-slate-900 rounded-[2.8rem] py-8 px-6 md:py-10 md:px-12 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-yellow-400/10 dark:bg-yellow-400/5 animate-pulse pointer-events-none"></div>
                                <span className="text-4xl md:text-5xl mb-4 animate-bounce">🌟</span>
                                <h2 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white text-center leading-tight tracking-wide">
                                    {isAr ? 'قريباً.. ستكون أنت أحد هؤلاء المبدعين!' : 'Soon.. You will be one of these creators!'}
                                </h2>
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb { background: #475569; }
                
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
