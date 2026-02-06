import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [bursts, setBursts] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

    const studentWorks = [
        { id: "1", title: locale === 'ar' ? "أبي نبع العطاء" : "Father: Fountain of Giving", author: locale === 'ar' ? "ياسين محمد مسعود" : "Yassin Mohamed", cover: "/cover/12.jpg", pdfUrl: "https://drive.google.com/file/d/1EcOPekgKRMhnq-HTiqU5hLrVxMIl2MEV/view?usp=drive_link", audioUrl: "/audio/أبي نبع العطاء.mp3" },
        { id: "2", title: locale === 'ar' ? "الصدق منجاة" : "Honesty is Salvation", author: locale === 'ar' ? "الصالح إسماعيل المصري" : "Al-Saleh Ismail", cover: "/cover/17.jpg", pdfUrl: "https://drive.google.com/file/d/1WbIIcUpBd2s4on8aMSiw20KCG5fpK-IA/view?usp=drive_link", audioUrl: "/audio/الصدق منجاة.mp3" },
        { id: "3", title: locale === 'ar' ? "مسرحية اللغة العربية" : "Arabic Language Play", author: locale === 'ar' ? "فاطمة فلاح الأحبابي" : "Fatima Al-Ahbabi", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/1DZk9Moh7CceSN5fpekCtxfRzNSzQiYMY/view?usp=drive_link", audioUrl: "/audio/اللغة العربية.mp3" },
        { id: "4", title: locale === 'ar' ? "حلم سيتحقق" : "A Dream Will Come True", author: locale === 'ar' ? "عدنان نزار" : "Adnan Nizar", cover: "/cover/16.jpg", pdfUrl: "https://drive.google.com/file/d/1nW4QxzZ3OmeOmH7r_F1I9W08OQbR1urJ/view?usp=drive_link", audioUrl: "/audio/حلم سيتحقق.mp3" },
        { id: "5", title: locale === 'ar' ? "حين تهت وجدتني" : "When I Was Lost, I Found Myself", author: locale === 'ar' ? "ملك مجدي الدموكي" : "Malak Majdi", cover: "/cover/1.jpg", pdfUrl: "https://drive.google.com/file/d/1pMUrhpyM3dpFCqJqBTt3amN3p-oLO3Ij/view?usp=drive_link", audioUrl: "/audio/حين تهت وجدتني.mp3" },
        { id: "6", title: locale === 'ar' ? "خطوات وحكايات" : "Steps and Tales", author: locale === 'ar' ? "مريم عبدالرحمن" : "Maryam Abdulrahman", cover: "/cover/14.jpg", pdfUrl: "https://drive.google.com/file/d/1QGRNlRc2v-a1q-gUJUoi37zcxw0sz0Ls/view?usp=drive_link", audioUrl: "/audio/خطوات في ارض الذهب.mp3" },
        { id: "7", title: locale === 'ar' ? "شجاعة في الصحراء" : "Courage in the Desert", author: locale === 'ar' ? "يمنى أيمن النجار" : "Yomna Ayman", cover: "/cover/13.jpg", pdfUrl: "https://drive.google.com/file/d/1b9H8XILdFZWsTCKmdgmJa9s5EoaNlp0r/view?usp=drive_link", audioUrl: "/audio/شجاعة.mp3" },
        { id: "8", title: locale === 'ar' ? "ظل نخلة" : "Palm Shadow", author: locale === 'ar' ? "محمد نور الراضي" : "Mohamed Nour", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/1C3uWMm_sLYKbFJrgilzpxXt_TjlKm2bp/view?usp=drive_link", audioUrl: "/audio/قصة بوسعيد.mp3" },
        { id: "9", title: locale === 'ar' ? "عندما يعود الخير" : "When Goodness Returns", author: locale === 'ar' ? "سهيلة البلوشي" : "Suhaila Al-Balooshi", cover: "/cover/15.jpg", pdfUrl: "https://drive.google.com/file/d/1mxaLmat3IEg2SItPiLjLa7U-hqrACw2e/view?usp=drive_link", audioUrl: "/audio/عندما يعود الخير.mp3" },
        { id: "10", title: locale === 'ar' ? "لمار تهمس" : "Lamar Whispers", author: locale === 'ar' ? "ألين رافع فريحات" : "Aleen Rafe", cover: "/cover/11.jpg", pdfUrl: "https://drive.google.com/file/d/1C0S0PA-yg2RDmXCB6-MlMoRLp2mp-Utw/view?usp=drive_link", audioUrl: "/audio/لمار.mp3" }
    ];

    // وظيفة للتحكم في الصوت بحيث يعمل ملف واحد فقط في كل مرة
    const handleAudioPlay = (id: string) => {
        Object.keys(audioRefs.current).forEach(key => {
            if (key !== id && audioRefs.current[key]) {
                audioRefs.current[key]?.pause();
            }
        });
    };

    useEffect(() => {
        const isMobileOrTablet = window.innerWidth < 1024;
        if (!isMobileOrTablet) return;
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const isEnd = dir === 'rtl' 
                    ? Math.abs(scrollLeft) + clientWidth >= scrollWidth - 20 
                    : scrollLeft + clientWidth >= scrollWidth - 20;
                if (isEnd) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    const step = clientWidth * 0.8; 
                    scrollRef.current.scrollBy({ left: dir === 'rtl' ? -step : step, behavior: 'smooth' });
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [dir]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.7;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const spawnMagic = () => {
        const id = Date.now();
        setBursts(p => [...p, { id, tx: (Math.random() - 0.5) * 300, ty: -250, rot: Math.random() * 120 }]);
        setTimeout(() => setBursts(c => c.filter(b => b.id !== id)), 800);
    };

    return (
        <div dir={dir} className={`min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500 ${locale === 'ar' ? 'font-["Almarai"]' : 'font-["Inter"]'} overflow-x-hidden relative`}>
            
            {/* الخلفية المتحركة تتغير مع المود */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-red-500/10 dark:bg-red-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] bg-green-500/10 dark:bg-green-500/5 blur-[120px] rounded-full"></div>
            </div>

            <header className="relative pt-24 pb-16 text-center px-4 z-10">
                <h1 className="text-6xl md:text-[9rem] font-[1000] mb-2 tracking-tighter leading-none text-black dark:text-white drop-shadow-2xl">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'CREATORS PORTAL'}
                </h1>
                <div className="flex items-center justify-center gap-3">
                    <span className="h-[3px] w-12 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></span>
                    <span className="w-4 h-4 bg-green-600 rounded-full animate-pulse"></span>
                    <span className="h-[3px] w-12 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></span>
                </div>
            </header>

            <section className="relative mb-32 z-10">
                <div className="text-center mb-12">
                    <span className="inline-block px-6 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl shadow-xl">
                        <p className="text-red-600 dark:text-red-500 font-black text-sm md:text-xl tracking-widest uppercase">
                            {locale === 'ar' ? 'قسم المؤلف الصغير' : 'The Little Author Section'}
                        </p>
                    </span>
                </div>

                <div className="relative max-w-[1750px] mx-auto px-4 md:px-12">
                    <button onClick={() => scroll('left')} className="absolute left-2 top-[45%] -translate-y-1/2 z-30 bg-white/80 dark:bg-white/10 backdrop-blur-2xl border border-black/5 dark:border-white/20 shadow-2xl p-6 rounded-3xl hover:bg-red-600 hover:text-white transition-all hidden lg:block group">
                        <svg className="group-hover:-translate-x-1 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="absolute right-2 top-[45%] -translate-y-1/2 z-30 bg-white/80 dark:bg-white/10 backdrop-blur-2xl border border-black/5 dark:border-white/20 shadow-2xl p-6 rounded-3xl hover:bg-red-600 hover:text-white transition-all hidden lg:block group">
                        <svg className="group-hover:translate-x-1 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6"/></svg>
                    </button>

                    <div ref={scrollRef} className="flex overflow-x-auto gap-10 pb-16 snap-x snap-mandatory no-scrollbar pt-6 px-4">
                        {studentWorks.map((work) => (
                            <div key={work.id} className="w-[85vw] md:w-[420px] flex-shrink-0 snap-center">
                                <div className="group relative bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[4rem] p-6 border border-white/40 dark:border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-4">
                                    
                                    <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-[3/4] rounded-[3rem] overflow-hidden mb-8 block ring-4 ring-black/5 dark:ring-white/5 shadow-2xl">
                                        <img src={work.cover} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={work.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-red-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[4px]">
                                            <div className="bg-white text-black font-black px-8 py-4 rounded-2xl shadow-2xl">
                                                {locale === 'ar' ? 'تصفح الكتاب' : 'Read Book'} 📖
                                            </div>
                                        </div>
                                    </a>

                                    <div className="px-4 text-center">
                                        <h3 className="text-2xl font-[1000] text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-600 transition-colors duration-300">{work.title}</h3>
                                        <p className="text-green-600 dark:text-green-400 font-black text-xs mb-8 uppercase tracking-[0.25em]">{work.author}</p>
                                        
                                        {/* مشغل صوت زجاجي مخصص */}
                                        <div className="bg-black/5 dark:bg-black/40 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-white/20 shadow-inner group-hover:border-red-500/30 transition-colors">
                                            <audio 
                                                ref={el => audioRefs.current[work.id] = el}
                                                onPlay={() => handleAudioPlay(work.id)}
                                                src={work.audioUrl} 
                                                controls 
                                                className="w-full h-10 custom-audio" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 relative overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-2xl border-y border-black/5 dark:border-white/10">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-6 relative z-10">
                    <div className="mb-12">
                        <span className="bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400 px-8 py-3 rounded-full border border-green-600/20 text-lg font-black tracking-widest uppercase shadow-xl">
                             {locale === 'ar' ? 'قسم المخترع الصغير' : 'The Little Inventor Section'}
                        </span>
                    </div>

                    <div className="relative group cursor-pointer" onClick={spawnMagic}>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-green-500/20 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="relative z-10">
                            {bursts.map(b => (
                                <div key={b.id} className="absolute z-50 bg-black dark:bg-white text-white dark:text-black text-xs font-black px-5 py-2 rounded-2xl shadow-2xl animate-float-fast"
                                     style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                    CREATIVE ⚡
                                </div>
                            ))}
                            <img src="/creators-mascot.png" className="h-[450px] md:h-[700px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:rotate-2 transition-transform duration-500" />
                        </div>
                    </div>

                    <div className="mt-20">
                        <h2 className="text-7xl md:text-[12rem] font-[1000] text-black dark:text-white italic tracking-tighter leading-none opacity-10 absolute -bottom-10 left-1/2 -translate-x-1/2 select-none">
                            2026
                        </h2>
                        <div className="relative z-10">
                            <h3 className="text-5xl md:text-8xl font-[1000] text-slate-900 dark:text-white mb-6">
                                {locale === 'ar' ? 'قريباً' : 'COMING SOON'}
                            </h3>
                            <div className="w-32 h-2 bg-gradient-to-r from-red-600 to-green-600 mx-auto rounded-full shadow-lg"></div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Inter:wght@400;700;900&display=swap');
                
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                .custom-audio::-webkit-media-controls-panel {
                    background-color: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                }

                .dark .custom-audio::-webkit-media-controls-play-button,
                .dark .custom-audio::-webkit-media-controls-current-time-display,
                .dark .custom-audio::-webkit-media-controls-time-remaining-display {
                    filter: invert(1);
                }
                
                @keyframes float-fast {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    20% { opacity: 1; transform: translate(var(--tx), -150px) scale(1.3) rotate(var(--rot)); }
                    100% { transform: translate(calc(var(--tx) * 1.5), -400px) scale(0.5); opacity: 0; }
                }
                .animate-float-fast { animation: float-fast 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards; }

                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
