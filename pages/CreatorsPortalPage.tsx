import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';

// تعيين الـ Worker لضمان تشغيل الـ PDF بسلاسة
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const FlipBookPlayer = ({ pdfUrl, audioUrl }: { pdfUrl: string, audioUrl?: string }) => {
    const [pages, setPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [dim, setDim] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const renderPDF = async () => {
            setLoading(true);
            try {
                const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
                const images = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.8 });
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    if (ctx) {
                        await page.render({ canvasContext: ctx, viewport }).promise;
                        images.push(canvas.toDataURL('image/png'));
                    }
                }
                setPages(images);
                const isMob = window.innerWidth < 768;
                setDim({ w: isMob ? window.innerWidth * 0.9 : 450, h: isMob ? 550 : 650 });
            } catch (e) { console.error("PDF Render Error", e); }
            setLoading(false);
        };
        renderPDF();
    }, [pdfUrl]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-green-500 font-black animate-bounce">
            <div className="w-16 h-16 border-8 border-t-green-500 border-slate-200 rounded-full animate-spin mb-6"></div>
            تحميل الإبداع...
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-8 w-full animate-fade-in">
            {audioUrl && (
                <div className="w-full max-w-lg bg-gradient-to-r from-slate-800 to-slate-900 p-5 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
                    <span className="text-green-400 text-sm font-black mb-3 tracking-widest uppercase">Audio Summary 🎙️</span>
                    <audio src={audioUrl} controls className="w-full" />
                </div>
            )}
            <div className="relative shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden">
                {/* @ts-ignore */}
                <HTMLFlipBook width={dim.w} height={dim.h} size="stretch" showCover={true} className="bg-slate-300">
                    {pages.map((p, i) => (
                        <div key={i} className="bg-white"><img src={p} className="w-full h-full object-contain" /></div>
                    ))}
                </HTMLFlipBook>
            </div>
        </div>
    );
};

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [selectedBook, setSelectedBook] = useState<any>(null);
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
        setBursts(p => [...p, { id, tx: (Math.random()-0.5)*200, ty: -150, rot: Math.random()*40 }]);
        setTimeout(() => setBursts(c => c.filter(b => b.id !== id)), 1000);
    };

    return (
        <div dir={dir} className="min-h-screen bg-[#fcfcfc] dark:bg-[#030712] font-['Cairo'] transition-all duration-500">
            
            {/* Header القسم العلوي */}
            <header className="pt-24 pb-16 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-red-600/10 to-transparent blur-3xl pointer-events-none"></div>
                <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'Creators Portal'}
                </h1>
                <p className="text-red-600 dark:text-red-500 font-black text-xl md:text-2xl tracking-[0.2em] uppercase">The Little Author Section</p>
                <div className="w-40 h-3 bg-red-600 mx-auto mt-6 rounded-full"></div>
            </header>

            {/* Gallery Section جاليري الكتب */}
            <main className="max-w-[1800px] mx-auto px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                    {studentWorks.map((work) => (
                        <div key={work.id} 
                             onClick={() => setSelectedBook(work)}
                             className="group relative cursor-pointer transform-gpu hover:scale-105 hover:-rotate-1 transition-all duration-500">
                            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative">
                                <img src={work.cover} className="w-full h-full object-cover" alt={work.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute bottom-0 p-6 w-full text-center">
                                    <h3 className="text-white font-black text-xl mb-1 line-clamp-1">{work.title}</h3>
                                    <p className="text-green-400 font-bold text-sm uppercase">{work.author}</p>
                                </div>
                                <div className="absolute inset-0 border-[12px] border-white/0 group-hover:border-white/20 transition-all rounded-[2rem]"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Divider فاصل فني */}
                <div className="my-32 flex items-center justify-center gap-4 opacity-30">
                    <div className="h-px w-full bg-slate-400"></div>
                    <div className="text-4xl italic font-black text-slate-400">INNOVATION</div>
                    <div className="h-px w-full bg-slate-400"></div>
                </div>

                {/* Little Inventor Section المخترع الصغير في الأسفل */}
                <section className="pb-32 relative">
                    <div className="relative flex flex-col items-center justify-center w-full">
                         {/* اللوجو الخلفي بتأثير فخم */}
                         <div className="absolute z-0 w-full max-w-4xl opacity-10 dark:opacity-20 transform rotate-12 translate-x-20 pointer-events-none transition-transform duration-1000">
                            <img src="/school-logo.png" className="w-full h-auto dark:invert grayscale brightness-125" alt="Logo BG" />
                        </div>

                        {/* الشخصية */}
                        <div className="relative z-10 cursor-pointer group select-none" onClick={spawnMagic}>
                            {bursts.map(b => (
                                <div key={b.id} className="absolute z-50 bg-red-600 text-white text-sm font-black px-5 py-2 rounded-2xl shadow-2xl animate-burst-modern"
                                     style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                    BRAVO! 🚀
                                </div>
                            ))}
                            <img src="/creators-mascot.png" className="h-[500px] md:h-[750px] object-contain drop-shadow-[0_45px_70px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-700 ease-out" />
                        </div>

                        <div className="mt-[-40px] z-20 bg-white dark:bg-slate-900 border-8 border-red-600 p-12 rounded-[4rem] shadow-2xl text-center transform -rotate-2">
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tighter">المخترع الصغير</h2>
                            <p className="text-red-600 dark:text-red-400 font-black text-2xl animate-pulse uppercase tracking-[0.3em]">Ready to Launch Soon</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal المودال المنبثق للكتاب */}
            {selectedBook && (
                <div className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 animate-fade-in">
                    <button onClick={() => setSelectedBook(null)} className="absolute top-10 right-10 bg-white text-black w-16 h-16 rounded-full text-4xl font-black shadow-2xl hover:bg-red-600 hover:text-white transition-all transform hover:rotate-90">✕</button>
                    <div className="w-full max-w-7xl h-full flex flex-col items-center justify-center pt-20">
                         <FlipBookPlayer pdfUrl={selectedBook.pdfUrl} audioUrl={selectedBook.audioUrl} />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes burst-modern {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    30% { opacity: 1; transform: translate(var(--tx), -100px) scale(1.3) rotate(var(--rot)); }
                    100% { transform: translate(calc(var(--tx) * 1.6), -200px) scale(0.4); opacity: 0; }
                }
                .animate-burst-modern { animation: burst-modern 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
