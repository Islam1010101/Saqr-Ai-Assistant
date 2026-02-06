import React, { useState, useRef } from 'react';
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

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * (window.innerWidth < 768 ? 0.9 : 0.6);
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const spawnMagic = () => {
        const id = Date.now();
        setBursts(p => [...p, { id, tx: (Math.random() - 0.5) * 200, ty: -200, rot: Math.random() * 90 }]);
        setTimeout(() => setBursts(c => c.filter(b => b.id !== id)), 800);
    };

    return (
        <div dir={dir} className={`min-h-screen bg-[#fcfcfc] dark:bg-[#020617] ${locale === 'ar' ? 'font-["Almarai"]' : 'font-["Inter"]'} transition-colors duration-500 overflow-x-hidden`}>
            
            {/* Main Header */}
            <header className="pt-28 pb-16 text-center px-4">
                <h1 className="text-6xl md:text-[10rem] font-[900] text-slate-900 dark:text-white mb-2 tracking-tighter leading-none">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'CREATORS PORTAL'}
                </h1>
                <div className="w-32 h-2 bg-red-600 mx-auto mt-6 rounded-full animate-pulse"></div>
            </header>

            {/* Little Author Section */}
            <section className="mb-32">
                <div className="text-center mb-12">
                    <p className="text-red-600 font-black text-xl md:text-3xl tracking-[0.3em] uppercase opacity-90">
                        {locale === 'ar' ? 'قسم المؤلف الصغير' : 'The Little Author Section'}
                    </p>
                </div>

                <div className="relative max-w-[1700px] mx-auto px-4 md:px-16">
                    {/* Control Arrows */}
                    <button onClick={() => scroll('left')} className="absolute left-4 top-[40%] -translate-y-1/2 z-30 bg-white dark:bg-slate-800 shadow-2xl p-5 rounded-full hover:bg-red-600 hover:text-white transition-all hidden md:block border border-slate-100 dark:border-slate-700">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="absolute right-4 top-[40%] -translate-y-1/2 z-30 bg-white dark:bg-slate-800 shadow-2xl p-5 rounded-full hover:bg-red-600 hover:text-white transition-all hidden md:block border border-slate-100 dark:border-slate-700">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>

                    <div ref={scrollRef} className="flex overflow-x-auto gap-8 md:gap-12 pb-10 snap-x snap-mandatory no-scrollbar">
                        {studentWorks.map((work) => (
                            <div key={work.id} className="w-[85vw] md:w-[380px] flex-shrink-0 snap-center">
                                <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[3rem] p-5 border-2 border-transparent hover:border-red-600/20 shadow-2xl transition-all duration-500 hover:-translate-y-4">
                                    <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 block cursor-pointer">
                                        <img src={work.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={work.title} />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                {locale === 'ar' ? 'اقرأ الكتاب' : 'Read Book'} 📖
                                            </div>
                                        </div>
                                    </a>
                                    <div className="px-2 text-center">
                                        <h3 className="text-2xl font-[900] dark:text-white mb-2 line-clamp-1">{work.title}</h3>
                                        <p className="text-red-600 font-bold text-base mb-6 opacity-80">{work.author}</p>
                                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                                            <audio src={work.audioUrl} controls className="w-full h-10 custom-audio" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Little Inventor Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="max-w-6xl mx-auto flex flex-col items-center relative px-6 text-center">
                    
                    {/* Header: Same as Author Section */}
                    <div className="mb-12 z-20">
                        <p className="text-red-600 font-black text-xl md:text-3xl tracking-[0.3em] uppercase opacity-90">
                            {locale === 'ar' ? 'قسم المخترع الصغير' : 'The Little Inventor Section'}
                        </p>
                    </div>

                    <div className="relative flex items-center justify-center min-h-[500px] md:min-h-[800px] w-full">
                        
                        {/* الشعار الخلفي: ورا الشخصية بالظبط */}
                        <div className="absolute z-0 w-[300px] md:w-[650px] opacity-15 dark:opacity-30 pointer-events-none transition-all duration-1000 rotate-12">
                            <img 
                                src="/school-logo.png" 
                                className="w-full h-auto dark:invert dark:brightness-[10]" 
                                alt="Background Logo" 
                            />
                        </div>

                        {/* Mascot */}
                        <div className="relative z-10 cursor-pointer select-none group" onClick={spawnMagic}>
                            {bursts.map(b => (
                                <div key={b.id} className="absolute z-50 bg-red-600 text-white text-xs font-black px-5 py-2 rounded-2xl shadow-2xl animate-float-fast"
                                     style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                    BOOM! ⚡
                                </div>
                            ))}
                            <img 
                                src="/creators-mascot.png" 
                                className="h-[400px] md:h-[700px] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.2)] group-hover:scale-[1.05] transition-transform duration-700 ease-in-out" 
                            />
                        </div>
                    </div>

                    {/* Coming Soon Text: Under Mascot */}
                    <div className="z-20 -mt-10 md:-mt-20">
                        <h2 className="text-6xl md:text-9xl font-[1000] text-slate-900 dark:text-white italic tracking-tighter leading-none mb-6">
                            {locale === 'ar' ? 'قريباً' : 'SOON'}
                        </h2>
                        <div className="flex items-center justify-center gap-6">
                            <span className="w-16 h-1 bg-red-600"></span>
                            <span className="text-red-600 font-black text-xl tracking-widest animate-pulse">2026</span>
                            <span className="w-16 h-1 bg-red-600"></span>
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
                    100% { transform: translate(calc(var(--tx) * 1.8), -300px) scale(0.3); opacity: 0; }
                }
                .animate-float-fast { animation: float-fast 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                
                .custom-audio::-webkit-media-controls-panel { background-color: transparent; }
                .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
                
                @media (max-width: 768px) {
                    .custom-audio { filter: hue-rotate(180deg) invert(0.1); }
                }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
