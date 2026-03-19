import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- الأيقونات البرمجية SVG ---
const IconPlay = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const IconStop = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="3"/></svg>;
const IconRead = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"/></svg>;
const IconArrowLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
const IconArrowRight = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const IconBrush = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;

const MAGIC_CARDS = [
    { icon: "💡", ar: "فكرة ذكية", en: "Smart Idea", color: "border-yellow-500" },
    { icon: "🎨", ar: "إبداع", en: "Creativity", color: "border-red-600" },
    { icon: "🚀", ar: "ابتكار", en: "Innovation", color: "border-green-600" },
    { icon: "🧠", ar: "ذكاء", en: "Intelligence", color: "border-blue-600" },
    { icon: "✨", ar: "موهبة", en: "Talent", color: "border-purple-600" }
];

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const [bursts, setBursts] = useState<any[]>([]);
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

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
    }, [locale]);

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

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount, behavior: 'smooth' });
        }
    };

    // التمرير التلقائي
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const isEnd = dir === 'rtl' ? Math.abs(scrollLeft) + clientWidth >= scrollWidth - 100 : scrollLeft + clientWidth >= scrollWidth - 100;
                if (isEnd) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                else scrollRef.current.scrollBy({ left: dir === 'rtl' ? -clientWidth * 0.8 : clientWidth * 0.8, behavior: 'smooth' });
            }
        }, 6000);
        return () => clearInterval(interval);
    }, [dir]);

    const spawnMagic = useCallback(() => {
        const id = Date.now();
        const newBursts = Array.from({ length: 3 }).map((_, i) => ({
            id: id + i,
            item: MAGIC_CARDS[Math.floor(Math.random() * MAGIC_CARDS.length)],
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 150 : 350),
            ty: -100 - Math.random() * 150,
            rot: (Math.random() - 0.5) * 40
        }));
        setBursts(prev => [...prev, ...newBursts]);
        newBursts.forEach(b => { setTimeout(() => { setBursts(current => current.filter(item => item.id !== b.id)); }, 2500); });
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

            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-12 md:gap-16 animate-fade-in-up pb-20">
                
                {/* 1. قسم الترحيب العلوي */}
                <div className="text-center space-y-6 md:space-y-8 max-w-5xl mx-auto relative z-20">
                    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight ${locale === 'en' ? 'tracking-tight' : ''}`}>
                        {isAr ? 'ركن المبدعين' : 'CREATORS CORNER'}
                    </h1>
                    <p className="text-base md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                        {isAr ? 'مساحة حيث تلتقي الأفكار المبتكرة لتشكل المستقبل.' : 'A space where innovative ideas meet to shape the future.'}
                    </p>
                    
                    <div className="flex justify-center mt-6">
                        <Link to="/creators-studio" className="group relative inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-red-600/30 hover:-translate-y-1 transition-all duration-300">
                             <IconBrush />
                             <span className="text-sm md:text-lg font-bold uppercase tracking-wider">
                                {isAr ? 'كن مبدعاً' : 'Be Creative'}
                             </span>
                        </Link>
                    </div>
                </div>

                {/* 2. قسم المؤلف الصغير (المعرض الزجاجي) */}
                <div className="w-full relative z-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-700 shadow-sm py-10 md:py-16">
                    
                    <div className="text-center mb-8 px-4">
                        <span className="inline-block px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest">
                            📚 {isAr ? 'قسم المؤلف الصغير' : 'The Little Author'}
                        </span>
                    </div>

                    <div className="relative px-2 md:px-16 group/container">
                        <button onClick={() => scroll('left')} className="hidden md:flex absolute left-4 top-[45%] -translate-y-1/2 z-40 bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-colors border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                            <IconArrowLeft />
                        </button>
                        <button onClick={() => scroll('right')} className="hidden md:flex absolute right-4 top-[45%] -translate-y-1/2 z-40 bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-colors border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                            <IconArrowRight />
                        </button>

                        {/* شريط التمرير */}
                        <div ref={scrollRef} className="flex overflow-x-auto gap-6 md:gap-8 pb-10 snap-x snap-mandatory no-scrollbar pt-4 px-6 md:px-4 scroll-smooth items-stretch">
                            {studentWorks.map((work) => (
                                <div key={work.id} className="w-[85vw] sm:w-[350px] md:w-[380px] flex-shrink-0 snap-center group">
                                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                                        
                                        <div className="relative aspect-[3/4.2] rounded-[1.5rem] overflow-hidden mb-6 block shadow-md group-hover:shadow-lg transition-shadow">
                                            <img src={work.cover} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt={work.title} />
                                            
                                            {/* تأثير الغطاء عند المرور مع زر قراءة الـ PDF */}
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                                <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition-transform text-sm uppercase">
                                                    {isAr ? 'قراءة الكتاب' : 'Read PDF'} <IconRead />
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <div className="text-start flex-1 flex flex-col">
                                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white line-clamp-2 mb-1">{work.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base mb-6">{work.author}</p>
                                            
                                            {/* زر تشغيل الصوت */}
                                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                                <audio ref={el => { if(el) audioRefs.current.set(work.id, el); }} onEnded={() => setPlayingAudioId(null)} src={work.audioUrl} hidden />
                                                <button onClick={() => handleAudioPlay(work.id)} className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${playingAudioId === work.id ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                                    {playingAudioId === work.id 
                                                        ? <><IconStop /> <span>{isAr ? 'إيقاف' : 'Stop'}</span></> 
                                                        : <><IconPlay /> <span>{isAr ? 'استمع للملخص' : 'Play Summary'}</span></>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. ركن المخترع الصغير (المجسم وقريباً) */}
                <section className="relative w-full flex flex-col items-center justify-center text-center px-4 mt-8">
                    
                    <span className="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20 px-6 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest mb-12">
                        💡 {isAr ? 'قسم المخترع الصغير' : 'The Little Inventor'}
                    </span>

                    <div className="relative group cursor-pointer" onClick={spawnMagic}>
                        
                        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none transition-all duration-1000">
                            <img src="/school-logo.png" alt="Seal" className="w-[120%] h-[120%] object-contain rotate-12 opacity-5 dark:invert" />
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-yellow-500/10 to-green-600/10 blur-[100px] rounded-full group-hover:scale-110 transition-all duration-1000"></div>
                        
                        <div className="relative z-10">
                            {bursts.map(b => (
                                <div key={b.id} className={`absolute z-[100] bg-white dark:bg-slate-800 px-4 py-2 md:px-6 md:py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl animate-burst-steady pointer-events-none flex items-center gap-2 md:gap-3`}
                                     style={{'--tx': `${b.tx}px`, '--ty': `${b.ty}px`, '--rot': `${b.rot}deg`} as any}>
                                    <span className="text-xl md:text-3xl">{b.item.icon}</span>
                                    <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase whitespace-nowrap">{isAr ? b.item.ar : b.item.en}</span>
                                </div>
                            ))}
                            <img src="/creators-mascot.png" className="h-[250px] md:h-[450px] lg:h-[550px] object-contain drop-shadow-2xl animate-float" alt="Mascot" />
                        </div>
                    </div>

                    <div className="mt-8 md:mt-12 relative w-full flex flex-col items-center">
                        <div className="relative z-10 space-y-4 px-4">
                            <h3 className={`text-4xl md:text-6xl lg:text-[7rem] font-black text-slate-900 dark:text-white uppercase leading-none ${locale === 'en' ? 'tracking-tight' : ''}`}>
                                {isAr ? 'قريباً' : 'COMING SOON'}
                            </h3>
                            <div className="w-16 md:w-32 h-1.5 md:h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 mx-auto rounded-full"></div>
                            <p className="text-sm md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mt-4">
                                {isAr ? 'منصة عرض الابتكارات والمشاريع الهندسية لطلابنا المبدعين.' : 'Showcasing engineering innovations and projects for our creative students.'}
                            </p>
                        </div>
                    </div>

                </section>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes burst-steady {
                    0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; }
                    85% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
                    100% { transform: translate(var(--tx), calc(var(--ty) - 30px)) scale(0.8) rotate(var(--rot)); opacity: 0; }
                }
                .animate-burst-steady { animation: burst-steady 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                
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

export default CreatorsPortalPage;
