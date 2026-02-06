import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [bursts, setBursts] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

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
        <div dir={dir} className={`min-h-screen bg-[#020617] text-white ${locale === 'ar' ? 'font-["Almarai"]' : 'font-["Inter"]'} overflow-x-hidden relative`}>
            
            {/* Background Animated Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <header className="relative pt-32 pb-20 text-center px-4 z-10">
                <h1 className="text-6xl md:text-[11rem] font-[1000] mb-4 tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'CREATORS PORTAL'}
                </h1>
                <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-red-600"></div>
                    <div className="w-3 h-3 bg-red-600 rotate-45 animate-bounce"></div>
                    <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-red-600"></div>
                </div>
            </header>

            <section className="relative mb-40 z-10">
                <div className="text-center mb-16 px-6">
                    <span className="inline-block py-2 px-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-green-400 font-bold tracking-widest text-sm uppercase mb-4">
                        Explore Talent
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white/90">
                        {locale === 'ar' ? 'قسم المؤلف الصغير' : 'The Little Author Section'}
                    </h2>
                </div>

                <div className="relative max-w-[1800px] mx-auto px-4 md:px-20">
                    {/* Navigation Buttons - Styled as Glass */}
                    <button onClick={() => scroll('left')} className="absolute left-6 top-[40%] -translate-y-1/2 z-30 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-red-600 hover:border-red-500 transition-all hidden lg:block group">
                        <svg className="group-hover:-translate-x-1 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="absolute right-6 top-[40%] -translate-y-1/2 z-30 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-red-600 hover:border-red-500 transition-all hidden lg:block group">
                        <svg className="group-hover:translate-x-1 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                    </button>

                    <div ref={scrollRef} className="flex overflow-x-auto gap-10 pb-16 snap-x snap-mandatory no-scrollbar pt-10 px-4">
                        {studentWorks.map((work) => (
                            <div key={work.id} className="w-[85vw] md:w-[400px] flex-shrink-0 snap-center">
                                <div className="group relative bg-white/5 backdrop-blur-2xl rounded-[3rem] p-6 border border-white/10 transition-all duration-700 hover:border-red-600/50 hover:bg-white/10 hover:-translate-y-4 hover:shadow-[0_30px_60px_-15px_rgba(220,38,38,0.3)]">
                                    
                                    {/* Neon Corner Accent */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 block ring-1 ring-white/20">
                                        <img src={work.cover} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1" alt={work.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                                            <div className="bg-red-600 text-white font-black px-8 py-3 rounded-xl shadow-xl flex items-center gap-3">
                                                {locale === 'ar' ? 'تصفح الآن' : 'Read Now'} 
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                            </div>
                                        </div>
                                    </a>

                                    <div className="text-center space-y-3">
                                        <h3 className="text-2xl font-black text-white group-hover:text-red-500 transition-colors line-clamp-1">{work.title}</h3>
                                        <p className="text-green-500 font-bold text-sm tracking-widest uppercase opacity-80">{work.author}</p>
                                        
                                        <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm">
                                            <audio src={work.audioUrl} controls className="w-full h-8 glass-audio" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 relative">
                <div className="max-w-6xl mx-auto flex flex-col items-center px-6 text-center z-20 relative">
                    <div className="mb-16">
                        <span className="bg-red-600/20 text-red-500 px-6 py-2 rounded-full border border-red-600/30 text-sm font-black tracking-widest uppercase">
                            Next Generation
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black mt-4 text-white">
                            {locale === 'ar' ? 'قسم المخترع الصغير' : 'The Little Inventor Section'}
                        </h2>
                    </div>

                    <div className="relative group cursor-none" onClick={spawnMagic}>
                        {/* Interactive Sparkles */}
                        <div className="absolute inset-0 bg-green-500/20 blur-[150px] rounded-full group-hover:bg-red-500/20 transition-colors duration-1000"></div>
                        
                        <div className="relative z-10 transition-transform duration-700 group-hover:scale-105">
                            {bursts.map(b => (
                                <div key={b.id} className="absolute z-50 bg-green-500 text-black text-xs font-black px-5 py-2 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-float-fast"
                                     style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                    CREATIVE ⚡
                                </div>
                            ))}
                            <img src="/creators-mascot.png" className="h-[450px] md:h-[700px] object-contain filter drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_80px_rgba(220,38,38,0.2)]" />
                        </div>
                    </div>

                    <div className="mt-20">
                        <h2 className="text-7xl md:text-[12rem] font-black text-white/5 italic tracking-tighter leading-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none">
                            2026
                        </h2>
                        <div className="relative z-10">
                            <h3 className="text-5xl md:text-8xl font-[1000] text-white mb-6">
                                {locale === 'ar' ? 'قريباً' : 'COMING SOON'}
                            </h3>
                            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_#dc2626]"></div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Inter:wght@400;700;900&display=swap');
                
                body { background-color: #020617; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                .glass-audio::-webkit-media-controls-panel {
                    background-color: rgba(255, 255, 255, 0.05);
                }
                .glass-audio::-webkit-media-controls-current-time-display,
                .glass-audio::-webkit-media-controls-time-remaining-display {
                    color: #fff;
                }

                @keyframes float-fast {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    20% { opacity: 1; transform: translate(var(--tx), -150px) scale(1.2) rotate(var(--rot)); }
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
