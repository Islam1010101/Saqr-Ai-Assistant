import React, { useState, useRef } from 'react';
import { useLanguage } from '../App';

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [bursts, setBursts] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const studentWorks = [
        { id: "1", title: "أبي نبع العطاء", author: "ياسين محمد مسعود", cover: "/cover/12.jpg", pdfUrl: "https://drive.google.com/file/d/1Xy_sample1/view", audioUrl: "/audio/أبي نبع العطاء.mp3" },
        { id: "2", title: "الصدق منجاه", author: "الصالح إسماعيل المصري", cover: "/cover/17.jpg", pdfUrl: "https://drive.google.com/file/d/1Xy_sample2/view", audioUrl: "/audio/الصدق منجاة.mp3" },
        { id: "3", title: "مسرحية اللغة العربية", author: "فاطمة فلاح الأحبابي", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/1Xy_sample3/view", audioUrl: "/audio/اللغة العربية.mp3" },
        { id: "4", title: "حلم سيتحقق", author: "عدنان نزار", cover: "/cover/16.jpg", pdfUrl: "https://drive.google.com/file/d/1Xy_sample4/view", audioUrl: "/audio/حلم سيتحقق.mp3" },
        { id: "5", title: "حين تهت وجدتني", author: "ملك مجدي الدموكي", cover: "/cover/1.jpg", pdfUrl: "https://drive.google.com/file/d/1Xy_sample5/view", audioUrl: "/audio/حين تهت وجدتني.mp3" },
        { id: "6", title: "خطوات وحكايات", author: "مريم عبدالرحمن الساعدي", cover: "/cover/14.jpg", pdfUrl: "/book/خطوات وحكايات في أرض الذهب.pdf", audioUrl: "/audio/خطوات في ارض الذهب.mp3" },
        { id: "7", title: "شجاعة في قلب الصحراء", author: "يمنى أيمن النجار", cover: "/cover/13.jpg", pdfUrl: "/book/شجاعة في قلب الصحراء.pdf", audioUrl: "/audio/شجاعة.mp3" },
        { id: "8", title: "ظل نخلة", author: "محمد نور الراضي", cover: "/cover/18.jpg", pdfUrl: "/book/ظل نخلة.pdf", audioUrl: "/audio/قصة بوسعيد.mp3" },
        { id: "9", title: "عندما يعود الخير", author: "سهيلة صالح البلوشي", cover: "/cover/15.jpg", pdfUrl: "/book/عندما يعود الخير.pdf", audioUrl: "/audio/عندما يعود الخير.mp3" },
        { id: "10", title: "لمار .. والسماء تهمس", author: "ألين رافع فريحات", cover: "/cover/11.jpg", pdfUrl: "/book/لمار .. والسماء التي تهمس.pdf", audioUrl: "/audio/لمار.mp3" }
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8; 
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const spawnMagic = () => {
        const id = Date.now();
        setBursts(p => [...p, { id, tx: (Math.random() - 0.5) * 200, ty: -150, rot: Math.random() * 45 }]);
        setTimeout(() => setBursts(c => c.filter(b => b.id !== id)), 800);
    };

    return (
        <div dir={dir} className="min-h-screen bg-[#fcfcfc] dark:bg-[#020617] font-['Cairo'] transition-colors duration-500 overflow-x-hidden">
            
            <header className="pt-24 pb-12 text-center">
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'Creators Portal'}
                </h1>
                <p className="text-red-600 font-black text-xl md:text-2xl tracking-[0.2em] uppercase">The Little Author</p>
            </header>

            {/* Gallery Slider */}
            <section className="relative max-w-[1600px] mx-auto px-4 md:px-12">
                {/* Custom SVG Arrows */}
                <button onClick={() => scroll('left')} className="absolute left-2 top-[35%] -translate-y-1/2 z-30 bg-white/90 dark:bg-slate-800 shadow-2xl p-4 rounded-full hover:bg-red-600 hover:text-white transition-all hidden md:block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button onClick={() => scroll('right')} className="absolute right-2 top-[35%] -translate-y-1/2 z-30 bg-white/90 dark:bg-slate-800 shadow-2xl p-4 rounded-full hover:bg-red-600 hover:text-white transition-all hidden md:block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>

                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 md:gap-10 pb-16 snap-x snap-mandatory no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {studentWorks.map((work) => (
                        <div key={work.id} className="w-[85vw] md:w-[350px] flex-shrink-0 snap-center">
                            <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300">
                                
                                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-5 bg-slate-200">
                                    <img src={work.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={work.title} />
                                </div>

                                <div className="px-2 text-center">
                                    <h3 className="text-xl font-black dark:text-white mb-1 line-clamp-1">{work.title}</h3>
                                    <p className="text-red-500 font-bold text-sm mb-4">{work.author}</p>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl mb-4 border border-slate-100 dark:border-slate-700">
                                        <audio src={work.audioUrl} controls className="w-full h-8" />
                                    </div>

                                    <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer"
                                       className="block w-full bg-slate-900 dark:bg-red-600 text-white py-4 rounded-2xl font-black transition-all hover:bg-red-700 hover:scale-[1.02] shadow-lg">
                                        تصفح الكتاب 📖
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Little Inventor Section */}
            <section className="py-32 relative">
                <div className="max-w-4xl mx-auto flex flex-col items-center relative px-4">
                    
                    {/* الشعار المطور: أصغر ومتوافق مع المودات */}
                    <div className="absolute z-0 w-40 md:w-56 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 dark:opacity-100">
                        <img 
                            src="/school-logo.png" 
                            className="w-full h-auto dark:invert dark:brightness-[5] transition-all duration-1000" 
                            alt="Logo" 
                        />
                        <div className="absolute inset-0 bg-red-500/10 blur-[80px] rounded-full dark:block hidden"></div>
                    </div>

                    <div className="relative z-10 cursor-pointer select-none" onClick={spawnMagic}>
                        {bursts.map(b => (
                            <div key={b.id} className="absolute z-50 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-2xl animate-float-fast"
                                 style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                BRAVO! 🚀
                            </div>
                        ))}
                        <img 
                            src="/creators-mascot.png" 
                            className="h-[350px] md:h-[550px] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                        />
                    </div>

                    <div className="z-20 -mt-6 bg-white dark:bg-slate-900 px-10 py-6 rounded-[2.5rem] border-4 border-red-600 shadow-2xl text-center">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white italic">المخترع الصغير</h2>
                        <p className="text-red-600 font-bold mt-2 tracking-[0.2em] text-xs uppercase">Coming Soon</p>
                    </div>
                </div>
            </section>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes float-fast {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    20% { opacity: 1; transform: translate(var(--tx), -80px) scale(1.1) rotate(var(--rot)); }
                    100% { transform: translate(calc(var(--tx) * 1.4), -180px) scale(0.5); opacity: 0; }
                }
                .animate-float-fast { animation: float-fast 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
