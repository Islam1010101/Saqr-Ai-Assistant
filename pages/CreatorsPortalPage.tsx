import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';

// تعيين الـ Worker من رابط مباشر ومستقر جداً
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
                    const viewport = page.getViewport({ scale: 1.5 });
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
                setDim({ w: isMob ? window.innerWidth * 0.85 : 450, h: isMob ? 500 : 600 });
            } catch (e) { console.error("PDF Error", e); }
            setLoading(false);
        };
        renderPDF();
    }, [pdfUrl]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-green-500 font-bold animate-pulse">
            <div className="w-16 h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin mb-4"></div>
            فتح صفحات الإبداع...
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            {/* المشغل الصوتي - السامري */}
            {audioUrl && (
                <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
                    <p className="text-white text-xs mb-2 text-center font-bold opacity-70 italic">استمع لملخص القصة 🎙️</p>
                    <audio src={audioUrl} controls className="w-full h-10" />
                </div>
            )}
            
            <div className="relative shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden">
                {/* @ts-ignore */}
                <HTMLFlipBook width={dim.w} height={dim.h} size="stretch" showCover={true} className="bg-slate-200">
                    {pages.map((p, i) => (
                        <div key={i} className="bg-white shadow-inner"><img src={p} className="w-full h-full object-contain" /></div>
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
        setBursts(p => [...p, { id, tx: (Math.random()-0.5)*150, ty: -120, rot: Math.random()*30 }]);
        setTimeout(() => setBursts(c => c.filter(b => b.id !== id)), 800);
    };

    return (
        <div dir={dir} className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-['Cairo'] transition-all">
            
            <header className="py-20 text-center relative overflow-hidden">
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'Creators Portal'}
                </h1>
                <div className="w-32 h-2.5 bg-red-600 mx-auto rounded-full shadow-lg shadow-red-500/40"></div>
            </header>

            <main className="max-w-[1700px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-32">
                
                {/* المؤلف الصغير */}
                <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 order-2 lg:order-1">
                    {studentWorks.map((work) => (
                        <div key={work.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
                            <div className="h-72 overflow-hidden relative">
                                <img src={work.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-black text-lg border-2 border-white px-6 py-2 rounded-full">عرض العمل</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-black dark:text-white mb-2 leading-tight h-16 line-clamp-2">{work.title}</h3>
                                <p className="text-red-500 font-bold mb-6 text-sm italic underline decoration-2 underline-offset-4">{work.author}</p>
                                <button onClick={() => setSelectedBook(work)} className="w-full bg-slate-900 dark:bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                                    تصفح الكتاب 📖
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* المخترع الصغير - اللوجو خلف الشخصية */}
                <aside className="lg:col-span-4 relative flex flex-col items-center justify-start pt-10 order-1 lg:order-2">
                    <div className="relative w-full flex justify-center items-center">
                        
                        {/* اللوجو الخلفي: مائل لليمين + متفاعل مع الدارك مود */}
                        <div className="absolute z-0 w-[140%] opacity-15 dark:opacity-30 transform rotate-[25deg] translate-x-10 pointer-events-none scale-125">
                            <img src="/school-logo.png" className="w-full h-auto dark:invert grayscale brightness-150" alt="Background Logo" />
                        </div>

                        {/* الشخصية */}
                        <div className="relative z-10 cursor-pointer group" onClick={spawnMagic}>
                            {bursts.map(b => (
                                <div key={b.id} className="absolute z-50 bg-green-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-2xl animate-float-up"
                                     style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                    EXCELLENT! ⚡
                                </div>
                            ))}
                            <img src="/creators-mascot.png" className="h-[400px] md:h-[650px] object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>
                    
                    <div className="mt-10 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 text-center shadow-inner">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase italic underline decoration-red-600">المخترع الصغير</h2>
                        <p className="text-slate-400 font-bold animate-pulse">Coming Soon to Innovation Lab</p>
                    </div>
                </aside>
            </main>

            {/* مودال الكتاب */}
            {selectedBook && (
                <div className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-4">
                    <button onClick={() => setSelectedBook(null)} className="absolute top-8 right-8 text-white bg-red-600 w-14 h-14 rounded-full text-3xl font-black shadow-2xl hover:rotate-90 transition-all">✕</button>
                    <div className="w-full max-w-6xl h-[90vh] flex flex-col items-center justify-center overflow-y-auto">
                         <FlipBookPlayer pdfUrl={selectedBook.pdfUrl} audioUrl={selectedBook.audioUrl} />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes float-up {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    20% { opacity: 1; transform: translate(var(--tx), -60px) scale(1.2) rotate(var(--rot)); }
                    100% { transform: translate(calc(var(--tx) * 1.5), -150px) scale(0.5); opacity: 0; }
                }
                .animate-float-up { animation: float-up 0.8s ease-out forwards; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
