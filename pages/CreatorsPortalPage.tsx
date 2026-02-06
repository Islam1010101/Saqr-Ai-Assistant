import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../App';

// --- البيانات (تم تحديث المسارات بناءً على طلبك) ---
interface StudentWork {
    id: string;
    title: string;
    author: string;
    cover: string;
    pdfUrl: string;
    audioUrl: string;
}

const studentWorks: StudentWork[] = [
    { id: "1", title: "أبي نبع العطاء", author: "ياسين محمد مسعود", cover: "/cover/12.jpg", pdfUrl: "/book/أبي نبع العطاء.pdf", audioUrl: "/أبي نبع العطاء.mp3" },
    { id: "2", title: "الصدق منجاه", author: "الصالح إسماعيل المصري", cover: "/cover/17.jpg", pdfUrl: "/book/الصدق منجاه.pdf", audioUrl: "/الصدق منجاة.mp3" },
    { id: "3", title: "مسرحية اللغة العربية", author: "فاطمة فلاح الأحبابي", cover: "/cover/18.jpg", pdfUrl: "/book/اللغة العربية في غربة الأبناء .pdf", audioUrl: "/اللغة العربية.mp3" },
    { id: "4", title: "حلم سيتحقق", author: "عدنان نزار", cover: "/cover/16.jpg", pdfUrl: "/book/حلم سيتحقق.pdf", audioUrl: "/حلم سيتحقق.mp3" },
    { id: "5", title: "حين تهت وجدتني", author: "ملك مجدي الدموكي", cover: "/cover/1.jpg", pdfUrl: "/book/حين تهت وجدتني.pdf", audioUrl: "/حين تهت وجدتني.mp3" },
    { id: "6", title: "خطوات وحكايات", author: "مريم عبدالرحمن الساعدي", cover: "/cover/14.jpg", pdfUrl: "/book/خطوات وحكايات في أرض الذهب.pdf", audioUrl: "/خطوات في ارض الذهب.mp3" },
    { id: "7", title: "شجاعة في قلب الصحراء", author: "يمنى أيمن النجار", cover: "/cover/13.jpg", pdfUrl: "/book/شجاعة في قلب الصحراء.pdf", audioUrl: "/خطوات في ارض الذهب.mp3" },
    { id: "8", title: "ظل نخلة", author: "محمد نور الراضي", cover: "/cover/18.jpg", pdfUrl: "/book/ظل نخلة.pdf", audioUrl: "/قصة بوسعيد.mp3" },
    { id: "9", title: "عندما يعود الخير", author: "سهيلة صالح البلوشي", cover: "/cover/15.jpg", pdfUrl: "/book/عندما يعود الخير.pdf", audioUrl: "/عندما يعود الخير.mp3" },
    { id: "10", title: "لمار .. والسماء تهمس", author: "ألين رافع فريحات", cover: "/cover/11.jpg", pdfUrl: "/book/لمار .. والسماء التي تهمس.pdf", audioUrl: "/لمار.mp3" }
];

const translations = {
    ar: { title: "بوابة المبدعين", sub: "إبداعات طلاب مدرسة صقر الإمارات", author: "المؤلف الصغير", inventor: "المخترع الصغير", read: "اقرأ الكتاب", listen: "استمع للمخلص", soon: "قريباً جداً", mascot: "المسني للإلهام!" },
    en: { title: "Creators Portal", sub: "EFIPS Student Talents", author: "Little Author", inventor: "Little Inventor", read: "Flip Book", listen: "Audio Summary", soon: "Coming Soon", mascot: "Touch Me!" }
};

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [selectedBook, setSelectedBook] = useState<StudentWork | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // إصلاح مشكلة تشغيل الصوت (Handling special characters in URLs)
    const handleAudio = (url: string) => {
        if (playingAudio === url) {
            audioRef.current?.pause();
            setPlayingAudio(null);
        } else {
            setPlayingAudio(url);
            if (audioRef.current) {
                audioRef.current.src = encodeURI(url);
                audioRef.current.play().catch(e => console.error("Audio Play Error:", e));
            }
        }
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['Cairo'] transition-colors duration-500 overflow-x-hidden">
            
            {/* Header القسم العلوي */}
            <header className="relative pt-20 pb-10 text-center px-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-green-500/10 to-transparent -z-10"></div>
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                    {t('title')}
                </h1>
                <p className="text-lg md:text-2xl text-green-600 font-bold opacity-80">{t('sub')}</p>
                <div className="w-24 h-1.5 bg-red-600 mx-auto mt-6 rounded-full animate-bounce"></div>
            </header>

            <main className="max-w-[1800px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
                
                {/* القسم الأول: جاليري المؤلف الصغير (8 أعمدة) */}
                <section className="lg:col-span-8 space-y-10">
                    <div className="flex items-center gap-4 border-b-4 border-green-600 pb-4">
                        <span className="text-4xl">📚</span>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100">{t('author')}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {studentWorks.map((work) => (
                            <div key={work.id} className="book-card group relative h-[450px] perspective-1000">
                                <div className="relative w-full h-full transition-all duration-500 preserve-3d group-hover:rotate-y-12 shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    
                                    {/* غلاف الكتاب */}
                                    <div className="h-2/3 overflow-hidden relative">
                                        <img src={work.cover} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        
                                        {/* زر القراءة السريع */}
                                        <button 
                                            onClick={() => setSelectedBook(work)}
                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-2 rounded-full font-black text-sm shadow-xl hover:bg-green-600 hover:text-white transition-colors"
                                        >
                                            {t('read')} 📖
                                        </button>
                                    </div>

                                    {/* بيانات الكتاب */}
                                    <div className="p-5 space-y-2">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white truncate leading-tight">
                                            {work.title}
                                        </h3>
                                        <p className="text-green-600 font-bold text-sm italic">{work.author}</p>
                                        
                                        {/* زر الصوت المطور */}
                                        <button 
                                            onClick={() => handleAudio(work.audioUrl)}
                                            className={`w-full mt-4 flex items-center justify-center gap-3 py-3 rounded-xl font-bold transition-all ${playingAudio === work.audioUrl ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-green-100'}`}
                                        >
                                            {playingAudio === work.audioUrl ? '⏸️ يشتغل الآن...' : `🎧 ${t('listen')}`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* القسم الثاني: المخترع الصغير (4 أعمدة) */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24 space-y-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-4 border-red-600 shadow-3xl text-center relative overflow-hidden group">
                            <h2 className="text-4xl font-black text-red-600 mb-8">{t('inventor')}</h2>
                            
                            <div className="relative inline-block">
                                <div className="absolute -inset-4 bg-red-600/20 blur-2xl rounded-full animate-pulse"></div>
                                <img src="/creators-mascot.png" alt="Mascot" className="h-64 md:h-96 object-contain relative z-10 animate-float" />
                                
                                <div className="absolute -top-5 -right-5 bg-yellow-400 text-slate-900 p-4 rounded-2xl font-black text-sm rotate-12 shadow-xl animate-bounce">
                                    {t('mascot')}
                                </div>
                            </div>

                            <div className="mt-10 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-red-600/30">
                                <p className="text-3xl font-black text-slate-400 italic uppercase tracking-widest animate-pulse">
                                    {t('soon')}
                                </p>
                                <div className="flex justify-center gap-4 mt-4 text-4xl">
                                    <span>🚀</span><span>🤖</span><span>🧪</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* نظام الـ Flipbook Modal */}
            {selectedBook && (
                <div className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fade-in">
                    <button onClick={() => setSelectedBook(null)} className="absolute top-6 right-6 text-white text-5xl hover:scale-110 transition-transform">✕</button>
                    
                    <div className="w-full max-w-6xl h-full flex flex-col items-center gap-6">
                        <div className="bg-white rounded-xl overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.3)] w-full h-full relative">
                            {/* Flipbook Simulation Frame */}
                            <iframe 
                                src={`${selectedBook.pdfUrl}#toolbar=0&navpanes=0`} 
                                className="w-full h-full border-none"
                                title="EFIPS Flipbook"
                            ></iframe>
                        </div>
                        <h2 className="text-white text-3xl font-black">{selectedBook.title}</h2>
                    </div>
                </div>
            )}

            {/* عنصر الصوت الخفي للتحكم */}
            <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .rotate-y-12 { transform: rotateY(-15deg) scale(1.02); }
                
                .animate-float { animation: float 5s ease-in-out infinite; }
                @keyframes float { 
                    0%, 100% { transform: translateY(0px) rotate(0deg); } 
                    50% { transform: translateY(-20px) rotate(2deg); } 
                }

                .book-card:hover { z-index: 50; }
                
                /* تحسين شكل الـ Scrollbar */
                ::-webkit-scrollbar { width: 10px; }
                ::-webkit-scrollbar-track { background: #f1f1f1; }
                ::-webkit-scrollbar-thumb { background: #16a34a; border-radius: 5px; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
