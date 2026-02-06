import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [bursts, setBursts] = useState<any[]>([]);

    const studentWorks = [
        { id: "1", title: "أبي نبع العطاء", author: "ياسين محمد مسعود", cover: "/cover/12.jpg", pdfUrl: "/book/أبي نبع العطاء.pdf", audioUrl: "/audio/أبي نبع العطاء.mp3" },
        { id: "2", title: "الصدق منجاه", author: "الصالح إسماعيل المصري", cover: "/cover/17.jpg", pdfUrl: "/book/الصدق منجاه.pdf", audioUrl: "/audio/الصدق منجاة.mp3" },
        { id: "3", title: "مسرحية اللغة العربية", author: "فاطمة فلاح الأحبابي", cover: "/cover/18.jpg", pdfUrl: "/book/اللغة العربية في غربة الأبناء .pdf", audioUrl: "/audio/اللغة العربية.mp3" },
        { id: "4", title: "حلم سيتحقق", author: "عدنان نزار", cover: "/cover/16.jpg", pdfUrl: "/book/حلم سيتحقق.pdf", audioUrl: "/audio/حلم سيتحقق.mp3" },
        { id: "5", title: "حين تهت وجدتني", author: "ملك مجدي الدموكي", cover: "/cover/1.jpg", pdfUrl: "/book/حين تهت وجدتني.pdf", audioUrl: "/audio/حين تهت وجدتني.mp3" },
        { id: "6", title: "خطوات وحكايات", author: "مريم عبدالرحمن الساعدي", cover: "/cover/14.jpg", pdfUrl: "/book/خطوات وحكايات في أرض الذهب.pdf", audioUrl: "/audio/خطوات في ارض الذهب.mp3" },
        { id: "7", title: "شجاعة في قلب الصحراء", author: "يمنى أيمن النجار", cover: "/cover/13.jpg", pdfUrl: "/book/شجاعة في قلب الصحراء.pdf", audioUrl: "/audio/شجاعة.mp3" },
        { id: "8", title: "ظل نخلة", author: "محمد نور الراضي", cover: "/cover/18.jpg", pdfUrl: "/book/ظل نخلة.pdf", audioUrl: "/audio/قصة بوسعيد.mp3" },
        { id: "9", title: "عندما يعود الخير", author: "سهيلة صالح البلوشي", cover: "/cover/15.jpg", pdfUrl: "/book/عندما يعود الخير.pdf", audioUrl: "/audio/عندما يعود الخير.mp3" },
        { id: "10", title: "لمار .. والسماء تهمس", author: "ألين رافع فريحات", cover: "/cover/11.jpg", pdfUrl: "/book/لمار .. والسماء التي تهمس.pdf", audioUrl: "/audio/لمار.mp3" }
    ];

    const spawnMagic = () => {
        const id = Date.now();
        setBursts(p => [...p, { id, tx: (Math.random() - 0.5) * 250, ty: -180, rot: Math.random() * 50 }]);
        setTimeout(() => setBursts(c => c.filter(b => b.id !== id)), 1000);
    };

    return (
        <div dir={dir} className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-['Cairo'] transition-all duration-500 overflow-x-hidden">
            
            {/* Header */}
            <header className="pt-20 pb-10 text-center relative">
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'Creators Portal'}
                </h1>
                <p className="text-red-600 font-black text-xl tracking-[0.3em] uppercase underline decoration-4 underline-offset-8">The Little Author</p>
            </header>

            {/* Infinite Gallery Slider */}
            <section className="py-10 relative group">
                <div className="flex overflow-hidden relative">
                    {/* مضاعفة المصفوفة مرتين لعمل حركة لا نهائية */}
                    <div className="flex gap-8 animate-scroll-left group-hover:pause-scroll py-10 px-4">
                        {[...studentWorks, ...studentWorks].map((work, index) => (
                            <div key={`${work.id}-${index}`} className="w-[300px] flex-shrink-0 flex flex-col items-center">
                                {/* Book Cover Card */}
                                <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 transform transition-transform hover:scale-105 duration-300">
                                    <img src={work.cover} className="w-full h-full object-cover" alt={work.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-center">
                                        <h3 className="text-white font-black text-lg line-clamp-1">{work.title}</h3>
                                        <p className="text-green-400 text-xs font-bold">{work.author}</p>
                                    </div>
                                </div>

                                {/* Modern Audio Unit */}
                                <div className="mt-4 w-full bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
                                    <audio src={work.audioUrl} controls className="w-full h-8 custom-audio" />
                                </div>

                                {/* Action Button */}
                                <a href={work.pdfUrl} target="_blank" rel="noreferrer" 
                                   className="mt-3 w-full bg-red-600 hover:bg-slate-900 text-white text-center py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-red-500/20 active:scale-95">
                                   قراءة الكتاب 📖
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="my-20 flex items-center justify-center opacity-20">
                <div className="h-[2px] w-1/4 bg-slate-400"></div>
                <div className="px-10 text-4xl font-black tracking-widest text-slate-500 italic">INNOVATION</div>
                <div className="h-[2px] w-1/4 bg-slate-400"></div>
            </div>

            {/* Little Inventor Section */}
            <section className="pb-40 relative px-4">
                <div className="max-w-4xl mx-auto relative flex flex-col items-center">
                    
                    {/* الشعار المطور: خلف الشخصية، أصغر، ويتغير لونه */}
                    <div className="absolute z-0 w-64 md:w-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-80 transition-all duration-700">
                        <img src="/school-logo.png" className="w-full h-auto dark:invert dark:brightness-200 animate-pulse-slow" alt="School Logo" />
                        <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full dark:block hidden"></div>
                    </div>

                    {/* Mascot */}
                    <div className="relative z-10 cursor-pointer select-none group" onClick={spawnMagic}>
                        {bursts.map(b => (
                            <div key={b.id} className="absolute z-50 bg-green-500 text-white text-xs font-black px-4 py-2 rounded-lg shadow-2xl animate-burst-fast"
                                 style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                AMAZING! 💡
                            </div>
                        ))}
                        <img src="/creators-mascot.png" className="h-[450px] md:h-[600px] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Label */}
                    <div className="z-20 -mt-10 bg-white dark:bg-slate-900 px-16 py-10 rounded-[3.5rem] border-[6px] border-red-600 shadow-2xl text-center">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-2 italic">المخترع الصغير</h2>
                        <div className="h-1.5 w-24 bg-red-600 mx-auto mb-4 rounded-full animate-width"></div>
                        <p className="text-slate-400 font-black tracking-[0.4em] uppercase text-sm">Under Construction</p>
                    </div>
                </div>
            </section>

            <style>{`
                /* Infinite Scroll Animation */
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-left { 
                    animation: scroll-left 40s linear infinite; 
                    display: flex;
                    width: max-content;
                }
                .pause-scroll { animation-play-state: paused; }

                /* Modern Audio Styling */
                .custom-audio::-webkit-media-controls-enclosure {
                    background-color: transparent;
                }
                
                @keyframes burst-fast {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    50% { opacity: 1; transform: translate(var(--tx), -120px) scale(1.2) rotate(var(--rot)); }
                    100% { transform: translate(calc(var(--tx) * 1.3), -200px) scale(0.2); opacity: 0; }
                }
                .animate-burst-fast { animation: burst-fast 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
                    50% { transform: scale(1.1) rotate(5deg); opacity: 0.5; }
                }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
                
                .dark .animate-pulse-slow { opacity: 0.8; }
                .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
