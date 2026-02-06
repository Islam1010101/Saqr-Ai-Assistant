import React, { useState, useRef } from 'react';
import { useLanguage } from '../App';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'; // تأكد من تثبيت lucide-react أو استبدلها بأسهم نصية

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [bursts, setBursts] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const studentWorks = [
        { id: "1", title: "أبي نبع العطاء", author: "ياسين محمد مسعود", cover: "/cover/12.jpg", pdfUrl: "https://drive.google.com/file/d/رابط_ملفك/view", audioUrl: "/audio/أبي نبع العطاء.mp3" },
        { id: "2", title: "الصدق منجاه", author: "الصالح إسماعيل المصري", cover: "/cover/17.jpg", pdfUrl: "https://drive.google.com/file/d/رابط_ملفك/view", audioUrl: "/audio/الصدق منجاة.mp3" },
        { id: "3", title: "مسرحية اللغة العربية", author: "فاطمة فلاح الأحبابي", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/رابط_ملفك/view", audioUrl: "/audio/اللغة العربية.mp3" },
        { id: "4", title: "حلم سيتحقق", author: "عدنان نزار", cover: "/cover/16.jpg", pdfUrl: "https://drive.google.com/file/d/رابط_ملفك/view", audioUrl: "/audio/حلم سيتحقق.mp3" },
        { id: "5", title: "حين تهت وجدتني", author: "ملك مجدي الدموكي", cover: "/cover/1.jpg", pdfUrl: "https://drive.google.com/file/d/رابط_ملفك/view", audioUrl: "/audio/حين تهت وجدتني.mp3" },
        // ... باقي الكتب
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
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
                <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'Creators Portal'}
                </h1>
                <p className="text-red-600 font-black text-xl md:text-2xl tracking-[0.2em] uppercase">The Little Author</p>
            </header>

            {/* Gallery Slider with Controls */}
            <section className="relative max-w-[1600px] mx-auto px-4 md:px-12 group">
                {/* Control Buttons */}
                <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 dark:bg-slate-800 shadow-xl p-4 rounded-full hover:bg-red-600 hover:text-white transition-all hidden md:block">
                    <ChevronLeft size={32} />
                </button>
                <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 dark:bg-slate-800 shadow-xl p-4 rounded-full hover:bg-red-600 hover:text-white transition-all hidden md:block">
                    <ChevronRight size={32} />
                </button>

                {/* The Scrollable Row */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 md:gap-10 pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {studentWorks.map((work) => (
                        <div key={work.id} className="w-[280px] md:w-[350px] flex-shrink-0 snap-center">
                            {/* Card Wrapper */}
                            <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300">
                                
                                {/* Cover Image */}
                                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-5">
                                    <img src={work.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={work.title} />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white">
                                            <BookOpen size={40} />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="px-2 text-center">
                                    <h3 className="text-xl font-black dark:text-white mb-1 line-clamp-1">{work.title}</h3>
                                    <p className="text-red-500 font-bold text-sm mb-4">{work.author}</p>
                                    
                                    {/* Audio Player - Custom Styled */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl mb-4">
                                        <audio src={work.audioUrl} controls className="w-full h-8" />
                                    </div>

                                    {/* Direct Link Button */}
                                    <a 
                                        href={work.pdfUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block w-full bg-slate-900 dark:bg-red-600 text-white py-4 rounded-2xl font-black transition-all hover:bg-red-700 hover:scale-[1.02] active:scale-95 shadow-lg"
                                    >
                                        تصفح الكتاب 📖
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-40"></div>

            {/* Little Inventor Section */}
            <section className="pb-32 relative">
                <div className="max-w-4xl mx-auto flex flex-col items-center relative">
                    
                    {/* الشعار المطور: أصغر ومتفاعل مع الدارك مود */}
                    <div className="absolute z-0 w-48 md:w-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700">
                        <img 
                            src="/school-logo.png" 
                            className="w-full h-auto opacity-40 dark:opacity-100 dark:invert dark:brightness-[10] dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
                            alt="Logo" 
                        />
                    </div>

                    {/* Character */}
                    <div className="relative z-10 cursor-pointer select-none" onClick={spawnMagic}>
                        {bursts.map(b => (
                            <div key={b.id} className="absolute z-50 bg-green-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-2xl animate-float-fast"
                                 style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                INNOVATIVE! ⚡
                            </div>
                        ))}
                        <img 
                            src="/creators-mascot.png" 
                            className="h-[400px] md:h-[600px] object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-500" 
                        />
                    </div>

                    {/* Label */}
                    <div className="z-20 -mt-8 bg-white dark:bg-slate-900 px-12 py-8 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-700 shadow-inner text-center">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic">المخترع الصغير</h2>
                        <p className="text-red-600 font-bold animate-pulse mt-2 tracking-widest uppercase text-xs">Innovation Lab Coming Soon</p>
                    </div>
                </div>
            </section>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
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
