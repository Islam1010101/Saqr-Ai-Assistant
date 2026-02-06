import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../App';

// --- البيانات ---
interface StudentWork {
    id: string; title: string; author: string; cover: string; pdfUrl: string; audioUrl: string;
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

interface QuoteBurst { id: number; text: string; tx: number; ty: number; rot: number; }

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [selectedBook, setSelectedBook] = useState<StudentWork | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const [bursts, setBursts] = useState<QuoteBurst[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const quotes = locale === 'ar' 
        ? ["مبدع صقر الإمارات", "خيال بلا حدود", "فكر، ابتكر، انجح", "بصمتي الفنية"] 
        : ["EFIPS Creator", "Infinite Vision", "Think & Innovate", "My Artistic Touch"];

    const spawnMagic = useCallback(() => {
        const id = Date.now();
        const newBurst = {
            id,
            text: quotes[Math.floor(Math.random() * quotes.length)],
            tx: (Math.random() - 0.5) * 300,
            ty: -100 - Math.random() * 150,
            rot: (Math.random() - 0.5) * 60
        };
        setBursts(prev => [...prev, newBurst]);
        setTimeout(() => setBursts(curr => curr.filter(b => b.id !== id)), 2000);
    }, [locale]);

    const handleAudio = (url: string) => {
        if (playingAudio === url) { audioRef.current?.pause(); setPlayingAudio(null); }
        else {
            setPlayingAudio(url);
            if (audioRef.current) {
                audioRef.current.src = encodeURI(url);
                audioRef.current.play();
            }
        }
    };

    return (
        <div dir={dir} className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-['Cairo'] transition-all duration-700 overflow-x-hidden">
            
            {/* Header */}
            <header className="relative py-16 text-center z-10">
                <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 dark:text-white opacity-10 absolute top-0 left-1/2 -translate-x-1/2 select-none tracking-[2rem]">CREATORS</h1>
                <div className="relative">
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-red-600 to-green-600 animate-gradient-x py-4">
                        {locale === 'ar' ? 'بوابة المبدعين' : 'Creators Portal'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold tracking-[0.3em] uppercase">{locale === 'ar' ? 'مدرسة صقر الإمارات الخاصة' : 'EFIPS Private School'}</p>
                </div>
            </header>

            <main className="max-w-[1800px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                
                {/* قسم الكتب (The Little Author) */}
                <section className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-12">
                    {studentWorks.map((work) => (
                        <div key={work.id} className="book-container group">
                            <div className="relative perspective-2000 h-[450px]">
                                {/* Book 3D Object */}
                                <div className="book-3d group-hover:rotate-y-[-30deg] transition-transform duration-700 ease-out shadow-2xl rounded-r-lg overflow-hidden">
                                    <img src={work.cover} alt={work.title} className="w-full h-full object-cover shadow-2xl border-l-8 border-slate-900/20" />
                                    {/* Pages Effect */}
                                    <div className="absolute top-0 right-0 w-[20px] h-full bg-slate-100 origin-right transform rotate-y-90 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                                </div>
                                
                                {/* Overlay Controls */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                                    <button onClick={() => setSelectedBook(work)} className="bg-white text-black px-8 py-3 rounded-full font-black hover:scale-110 transition-transform shadow-2xl mb-4">
                                        {locale === 'ar' ? 'فتح الكتاب 📖' : 'Open Book 📖'}
                                    </button>
                                    <button onClick={() => handleAudio(work.audioUrl)} className="bg-red-600 text-white p-4 rounded-full hover:rotate-12 transition-all">
                                        {playingAudio === work.audioUrl ? '⏸️' : '🎧'}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <h3 className="text-2xl font-black dark:text-white truncate">{work.title}</h3>
                                <p className="text-green-600 font-bold italic">{work.author}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* قسم المخترع (The Little Inventor) */}
                <aside className="lg:col-span-5 relative min-h-[800px] flex flex-col items-center justify-center">
                    
                    {/* شعار المدرسة بالخلفية - يميل لليمين ويتفاعل مع المود */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full -z-10 opacity-10 dark:opacity-20 pointer-events-none transform rotate-[15deg]">
                        <img src="/logo.png" alt="School Logo" className="w-full h-full object-contain dark:invert transition-all duration-1000" />
                    </div>

                    {/* الشخصية (بدون إطار) */}
                    <div className="relative z-10 cursor-pointer group" onClick={spawnMagic}>
                        {/* الكروت الطائرة */}
                        {bursts.map(b => (
                            <div key={b.id} 
                                 className="absolute z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-xl border-2 border-green-500 shadow-xl pointer-events-none animate-tiny-burst"
                                 style={{ '--tx': `${b.tx}px`, '--ty': `${b.ty}px`, '--rot': `${b.rot}deg` } as any}>
                                <p className="text-[10px] md:text-xs font-black whitespace-nowrap dark:text-white">{b.text}</p>
                            </div>
                        ))}

                        <img src="/creators-mascot.png" alt="Mascot" className="h-[500px] md:h-[700px] object-contain animate-float drop-shadow-[0_35px_60px_rgba(220,38,38,0.3)] group-hover:scale-105 transition-transform duration-500" />
                        
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-black animate-bounce shadow-2xl">
                            {locale === 'ar' ? 'المسني للإلهام!' : 'Touch Me!'}
                        </div>
                    </div>

                    <div className="mt-12 text-center bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 w-full">
                        <h4 className="text-4xl font-black text-red-600 animate-pulse uppercase tracking-widest">{locale === 'ar' ? 'ترقبوا ابتكاراتنا' : 'Innovation Soon'}</h4>
                        <p className="text-slate-400 mt-2 italic font-bold">The Little Inventor Lab</p>
                    </div>
                </aside>
            </main>

            {/* Modal التقليب (Flipbook Experience) */}
            {selectedBook && (
                <div className="fixed inset-0 z-[1000] bg-slate-950/98 flex items-center justify-center p-4 animate-book-open">
                    <button onClick={() => setSelectedBook(null)} className="absolute top-10 right-10 text-white text-4xl z-50 hover:rotate-90 transition-transform">✕</button>
                    <div className="w-full max-w-5xl h-[85vh] bg-white rounded-r-2xl overflow-hidden relative shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent z-10 shadow-inner"></div>
                        <iframe src={`${selectedBook.pdfUrl}#toolbar=0`} className="w-full h-full border-none" />
                    </div>
                </div>
            )}

            <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} />

            <style>{`
                .perspective-2000 { perspective: 2000px; }
                .book-3d { transform-style: preserve-3d; height: 100%; position: relative; }
                
                @keyframes tiny-burst {
                    0% { transform: translate(0, 0) scale(0); opacity: 0; filter: blur(10px); }
                    30% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; filter: blur(0px); }
                    100% { transform: translate(calc(var(--tx)*1.5), calc(var(--ty)*1.5)) scale(0.5) rotate(calc(var(--rot)*2)); opacity: 0; filter: blur(5px); }
                }
                .animate-tiny-burst { animation: tiny-burst 2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }

                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-30px) rotate(2deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }

                @keyframes book-open {
                    from { opacity: 0; transform: scale(0.8) rotateY(-40deg); }
                    to { opacity: 1; transform: scale(1) rotateY(0); }
                }
                .animate-book-open { animation: book-open 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); }

                @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 8s linear infinite; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
