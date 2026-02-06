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

    // Auto-scroll Effect
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
        <div dir={dir} className={`min-h-screen bg-[#f8fafc] text-slate-900 ${locale === 'ar' ? 'font-["Almarai"]' : 'font-["Inter"]'} overflow-x-hidden relative`}>
            
            {/* Soft Background Elements for Glass Effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-red-500/5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] bg-green-500/5 blur-[100px] rounded-full"></div>
            </div>

            <header className="relative pt-24 pb-16 text-center px-4 z-10">
                <h1 className="text-6xl md:text-[9rem] font-[1000] mb-2 tracking-tighter leading-none text-black drop-shadow-sm">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'CREATORS PORTAL'}
                </h1>
                <div className="flex items-center justify-center gap-3">
                    <span className="h-[2px] w-12 bg-red-600 rounded-full"></span>
                    <span className="h-[2px] w-4 bg-green-600 rounded-full animate-bounce"></span>
                    <span className="h-[2px] w-12 bg-red-600 rounded-full"></span>
                </div>
            </header>

            <section className="relative mb-32 z-10">
                <div className="text-center mb-12">
                    <p className="inline-block px-4 py-1 text-red-600 font-black text-sm md:text-lg tracking-[0.2em] uppercase bg-red-50 rounded-full mb-2">
                        {locale === 'ar' ? 'قسم المؤلف الصغير' : 'The Little Author Section'}
                    </p>
                </div>

                <div className="relative max-w-[1750px] mx-auto px-4 md:px-12">
                    {/* Glass Navigation Buttons */}
                    <button onClick={() => scroll('left')} className="absolute left-2 top-[40%] -translate-y-1/2 z-30 bg-white/70 backdrop-blur-md border border-white shadow-xl p-5 rounded-full hover:bg-red-600 hover:text-white transition-all hidden lg:block group">
                        <svg className="group-hover:-translate-x-1 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="absolute right-2 top-[40%] -translate-y-1/2 z-30 bg-white/70 backdrop-blur-md border border-white shadow-xl p-5 rounded-full hover:bg-red-600 hover:text-white transition-all hidden lg:block group">
                        <svg className="group-hover:translate-x-1 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6"/></svg>
                    </button>

                    <div ref={scrollRef} className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory no-scrollbar pt-6 px-4">
                        {studentWorks.map((work) => (
                            <div key={work.id} className="w-[82vw] md:w-[380px] flex-shrink-0 snap-center">
                                {/* The Glass Card */}
                                <div className="group relative bg-white/40 backdrop-blur-xl rounded-[3.5rem] p-5 border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(220,38,38,0.1)] hover:-translate-y-3">
                                    
                                    <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-[3/4] rounded-[2.8rem] overflow-hidden mb-6 block shadow-inner">
                                        <img src={work.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={work.title} />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white text-black font-black px-6 py-3 rounded-2xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                {locale === 'ar' ? 'اقرأ الآن' : 'Read Now'} 📖
                                            </div>
                                        </div>
                                    </a>

                                    <div className="px-2 text-center">
                                        <h3 className="text-2xl font-[900] text-slate-800 mb-1 line-clamp-1 group-hover:text-red-600 transition-colors">{work.title}</h3>
                                        <p className="text-green-600 font-bold text-sm mb-6 uppercase tracking-wider">{work.author}</p>
                                        
                                        {/* Glass Audio Player */}
                                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-3xl border border-white/80 shadow-inner">
                                            <audio src={work.audioUrl} controls className="w-full h-10 custom-audio" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden bg-white/30 backdrop-blur-md border-y border-white">
                <div className="max-w-6xl mx-auto flex flex-col items-center relative px-6 text-center">
                    <div className="mb-12">
                        <p className="text-green-600 font-black text-xl md:text-3xl tracking-widest uppercase mb-4">
                            {locale === 'ar' ? 'قسم المخترع الصغير' : 'The Little Inventor Section'}
                        </p>
                    </div>

                    <div className="relative group cursor-pointer select-none" onClick={spawnMagic}>
                        {/* Interactive Burst Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-green-500/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10">
                            {bursts.map(b => (
                                <div key={b.id} className="absolute z-50 bg-black text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-xl animate-float-fast"
                                     style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                    {locale === 'ar' ? 'عبقري!' : 'GENIUS!'} ⚡
                                </div>
                            ))}
                            <img src="/creators-mascot.png" className="h-[400px] md:h-[650px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] group-hover:scale-[1.02] transition-transform duration-500" />
                        </div>
                    </div>

                    <div className="mt-16 relative">
                        <h2 className="text-6xl md:text-9xl font-[1000] text-black italic tracking-tighter leading-none mb-4">
                            {locale === 'ar' ? 'قريباً' : 'SOON'}
                        </h2>
                        <div className="flex items-center justify-center gap-6">
                            <span className="w-12 h-1 bg-red-600 rounded-full"></span>
                            <span className="text-slate-900 font-black text-2xl tracking-[0.4em]">2026</span>
                            <span className="w-12 h-1 bg-green-600 rounded-full"></span>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Inter:wght@400;700;900&display=swap');
                
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes float-fast {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    20% { opacity: 1; transform: translate(var(--tx), -120px) scale(1.4) rotate(var(--rot)); }
                    100% { transform: translate(calc(var(--tx) * 1.8), -350px) scale(0.3); opacity: 0; }
                }
                .animate-float-fast { animation: float-fast 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                
                .custom-audio::-webkit-media-controls-panel {
                    background-color: rgba(255, 255, 255, 0.4);
                }

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
