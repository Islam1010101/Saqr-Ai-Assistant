import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom'; // تم التأكد من تفعيل الرابط
import { useLanguage } from '../App';

// --- الأيقونات البرمجية SVG ---
const IconPlay = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const IconStop = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>;
const IconRead = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"/></svg>;
const IconArrowLeft = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
const IconArrowRight = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const IconBrush = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>;

const MAGIC_CARDS = [
    { icon: "💡", ar: "فكرة ذكية", en: "Smart Idea", color: "border-yellow-500" },
    { icon: "🎨", ar: "إبداع", en: "Creativity", color: "border-red-600" },
    { icon: "🚀", ar: "ابتكار", en: "Innovation", color: "border-green-600" },
    { icon: "🧠", ar: "ذكاء", en: "Intelligence", color: "border-blue-600" },
    { icon: "✨", ar: "موهبة", en: "Talent", color: "border-purple-600" }
];

const ReflectionLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-40" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] animate-[shine_10s_infinite] opacity-30" />
  </div>
);

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
        { id: "5", title: isAr ? "حين تهت وجدتني" : "When I Was Lost, I Found Myself", author: isAr ? "ملك مجدي الدموكي" : "Malak Majdi", cover: "/cover/1.jpg", pdfUrl: "https://drive.google.com/file/d/1pMUrhpyM3dpFCqJqBTt3amN3p-oLO3Ij/view?usp=drive_link", audioUrl: "/audio/حين تهت وجدتني.mp3" },
        { id: "6", title: isAr ? "خطوات وحكايات" : "Steps and Tales", author: isAr ? "مريم عبدالرحمن" : "Maryam Abdulrahman", cover: "/cover/14.jpg", pdfUrl: "https://drive.google.com/file/d/1QGRNlRc2v-a1q-gUJUoi37zcxw0sz0Ls/view?usp=drive_link", audioUrl: "/audio/خطوات في ارض الذهب.mp3" },
        { id: "7", title: isAr ? "شجاعة في قلب الصحراء" : "Courage in the Desert", author: isAr ? "يمنى أيمن النجار" : "Yomna Ayman", cover: "/cover/13.jpg", pdfUrl: "https://drive.google.com/file/d/1b9H8XILdFZWsTCKmdgmJa9s5EoaNlp0r/view?usp=drive_link", audioUrl: "/audio/شجاعة.mp3" },
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

    // التمرير التلقائي (اللووب)
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const isEnd = dir === 'rtl' ? Math.abs(scrollLeft) + clientWidth >= scrollWidth - 100 : scrollLeft + clientWidth >= scrollWidth - 100;
                if (isEnd) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                else scrollRef.current.scrollBy({ left: dir === 'rtl' ? -clientWidth * 0.8 : clientWidth * 0.8, behavior: 'smooth' });
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [dir]);

    const spawnMagic = useCallback(() => {
        const id = Date.now();
        const newBursts = Array.from({ length: 3 }).map((_, i) => ({
            id: id + i,
            item: MAGIC_CARDS[Math.floor(Math.random() * MAGIC_CARDS.length)],
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 150 : 450),
            ty: -150 - Math.random() * 200,
            rot: (Math.random() - 0.5) * 40
        }));
        setBursts(prev => [...prev, ...newBursts]);
        newBursts.forEach(b => { setTimeout(() => { setBursts(current => current.filter(item => item.id !== b.id)); }, 2500); });
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.05; audio.play().catch(() => {});
    }, []);

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black antialiased overflow-x-hidden relative pb-20 selection:bg-red-600/30">
            {/* الخلفية */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 dark:bg-red-500/10 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-600/10 dark:bg-green-500/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
            </div>

            {/* الهيدر */}
            <header className="relative pt-12 md:pt-32 pb-8 text-center px-4 z-10">
                <h1 className="text-3xl sm:text-5xl lg:text-[10rem] font-black mb-4 tracking-tighter leading-tight text-slate-950 dark:text-white drop-shadow-2xl animate-fade-up">
                    {isAr ? 'بوابة المبدعين' : 'CREATORS PORTAL'}
                </h1>
                
                {/* زر كن مبدعاً (تم التأكد من الرابط لصفحة المرسم) */}
                <div className="mt-8 mb-4 animate-in zoom-in duration-700">
                    <Link to="/creators-studio" className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-red-600 to-red-800 text-white px-10 py-5 rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
                         <div className="absolute -inset-1 bg-red-600 rounded-[2.6rem] blur opacity-30 group-hover:opacity-60 animate-pulse transition-opacity"></div>
                         <IconBrush />
                         <span className="text-xl md:text-3xl font-black uppercase tracking-tighter">
                            {isAr ? 'كن مبدعاً' : 'Be Creative'}
                         </span>
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
                    <div className="h-[2px] w-8 md:w-24 bg-red-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-ping"></div>
                    <div className="h-[2px] w-8 md:w-24 bg-red-600 rounded-full"></div>
                </div>
            </header>

            {/* الحاوية العريضة الموحدة (الكتلة الواحدة) */}
            <div className="w-full max-w-[1920px] mx-auto relative z-10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] md:rounded-[5rem] border border-white/20 shadow-2xl py-10 md:py-16">
                
                {/* ركن المؤلف الصغير */}
                <section className="relative pb-10">
                    <div className="text-center mb-10 px-4">
                        <span className="inline-block px-8 py-3 bg-red-600 text-white rounded-2xl shadow-xl">
                            <h2 className="text-sm md:text-4xl font-black uppercase tracking-widest leading-none">
                               📚 {isAr ? 'قسم المؤلف الصغير' : 'The Little Author'}
                            </h2>
                        </span>
                    </div>

                    <div className="relative px-2 md:px-20 group/container">
                        <button onClick={() => scroll('left')} className="absolute left-2 md:left-6 top-[40%] -translate-y-1/2 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-3 md:p-6 rounded-2xl shadow-3xl hover:bg-red-600 hover:text-white transition-all border border-white/20 active:scale-90">
                            <IconArrowLeft />
                        </button>
                        <button onClick={() => scroll('right')} className="absolute right-2 md:right-6 top-[40%] -translate-y-1/2 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-3 md:p-6 rounded-2xl shadow-3xl hover:bg-red-600 hover:text-white transition-all border border-white/20 active:scale-90">
                            <IconArrowRight />
                        </button>

                        <div ref={scrollRef} className="flex overflow-x-auto gap-4 md:gap-14 pb-10 snap-x snap-mandatory no-scrollbar pt-6 px-10 md:px-4 scroll-smooth">
                            {studentWorks.map((work) => (
                                <div key={work.id} className="w-[80vw] md:w-[480px] flex-shrink-0 snap-center group">
                                    <div className="relative bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] p-6 md:p-10 border border-white/40 dark:border-white/10 shadow-2xl transition-all duration-700 hover:-translate-y-6">
                                        <ReflectionLayer />
                                        <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-[3/4.2] rounded-[2rem] overflow-hidden mb-8 block ring-4 md:ring-8 ring-black/5 dark:ring-white/5 shadow-2xl transform group-hover:scale-[1.02] transition-all duration-700">
                                            <img src={work.cover} className="w-full h-full object-cover" alt={work.title} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-end pb-8 text-center px-4">
                                                <div className="bg-red-600 text-white font-black px-8 py-4 rounded-xl shadow-2xl scale-75 group-hover:scale-100 transition-all duration-700 flex items-center gap-3 text-lg leading-none font-black uppercase">
                                                    {isAr ? 'اقرأ العمل' : 'View PDF'} <IconRead />
                                                </div>
                                            </div>
                                        </a>
                                        <div className="text-center px-2 space-y-2">
                                            <h3 className="text-base md:text-4xl font-black text-slate-950 dark:text-white line-clamp-1 group-hover:text-red-600 transition-colors leading-relaxed">{work.title}</h3>
                                            <p className="text-green-600 dark:text-green-400 font-bold text-xs md:text-xl uppercase opacity-80">{work.author}</p>
                                            <div className="bg-slate-950/90 dark:bg-black/80 backdrop-blur-3xl p-4 md:p-6 rounded-2xl border border-white/10 shadow-inner transition-all duration-500 group-hover:border-red-600/40">
                                                <audio ref={el => { if(el) audioRefs.current.set(work.id, el); }} onEnded={() => setPlayingAudioId(null)} src={work.audioUrl} hidden />
                                                <button onClick={() => handleAudioPlay(work.id)} className={`w-full py-3 md:py-5 rounded-xl font-black text-xs md:text-xl flex items-center justify-center gap-3 transition-all duration-300 ${playingAudioId === work.id ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.5)]' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                                                    {playingAudioId === work.id ? <><IconStop /> <span className="leading-none">{isAr ? 'إيقاف' : 'Stop'}</span></> : <><IconPlay /> <span className="leading-none">{isAr ? 'استمع للملخص' : 'Listen Summary'}</span></>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ركن المخترع الصغير - ملتصق وبخطوط منضبطة */}
                <section className="relative py-10 overflow-hidden bg-transparent">
                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center px-6 relative z-10">
                        <div className="mb-10">
                            <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-8 py-3 rounded-full border-2 border-yellow-500/30 text-xs sm:text-2xl md:text-4xl font-black tracking-widest uppercase shadow-2xl backdrop-blur-xl leading-none">
                                 💡 {isAr ? 'قسم المخترع الصغير' : 'The Little Inventor'}
                            </span>
                        </div>
                        <div className="relative group cursor-pointer" onClick={spawnMagic}>
                            <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none transition-all duration-1000">
                                <img src="/school-logo.png" alt="Seal" className="w-[120%] h-[120%] object-contain rotate-12 opacity-10 dark:opacity-20 logo-smart-filter" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-yellow-500/20 to-green-600/20 blur-[150px] rounded-full group-hover:scale-150 transition-all duration-1000 animate-pulse"></div>
                            <div className="relative z-10">
                                {bursts.map(b => (
                                    <div key={b.id} className={`absolute z-[100] bg-white dark:bg-slate-900 px-4 py-2 md:px-8 md:py-5 rounded-2xl border-4 ${b.item.color} shadow-3xl animate-burst-steady pointer-events-none flex items-center gap-3`}
                                         style={{'--tx': `${b.tx}px`, '--ty': `${b.ty}px`, '--rot': `${b.rot}deg`} as any}>
                                        <span className="text-xl md:text-4xl">{b.item.icon}</span>
                                        <span className="text-[10px] md:text-2xl font-black text-slate-950 dark:text-white uppercase whitespace-nowrap">{isAr ? b.item.ar : b.item.en}</span>
                                    </div>
                                ))}
                                <img src="/creators-mascot.png" className="h-[280px] md:h-[750px] object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,0.3)] animate-float" alt="Mascot" />
                            </div>
                        </div>
                        <div className="mt-10 relative max-w-full">
                             <h2 className="text-[6rem] md:text-[25rem] font-black text-slate-900 dark:text-white italic tracking-tighter leading-none opacity-[0.04] absolute -bottom-10 left-1/2 -translate-x-1/2 select-none uppercase">Saqr</h2>
                            <div className="relative z-10 space-y-4 animate-fade-up px-2">
                                <h3 className="text-3xl md:text-[11rem] font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-tight">
                                    {isAr ? 'قريباً' : 'COMING SOON'}
                                </h3>
                                <div className="w-20 md:w-64 h-1 md:h-4 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 mx-auto rounded-full"></div>
                                <p className="text-[0.7rem] sm:text-base md:text-5xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto italic whitespace-normal">
                                    {isAr ? 'منصة عرض الابتكارات والمشاريع الهندسية لطلابنا المبدعين' : 'Showcasing engineering innovations and projects for our creative students'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes burst-steady {
                    0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
                    10% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; }
                    85% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
                    100% { transform: translate(var(--tx), calc(var(--ty) - 30px)) scale(0.8) rotate(var(--rot)); opacity: 0; }
                }
                .animate-burst-steady { animation: burst-steady 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
                .logo-smart-filter { transition: filter 0.5s ease; }
                .dark .logo-smart-filter { filter: brightness(0) invert(1); }
                * { font-style: normal !important; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
                [dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3, [dir="rtl"] p, [dir="rtl"] span { letter-spacing: 0 !important; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
