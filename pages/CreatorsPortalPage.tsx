import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';

// استخدام CDN موثوق للـ Worker لضمان عمله أونلاين
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const FlipBookPlayer = ({ pdfUrl }: { pdfUrl: string }) => {
    const [pages, setPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const loadPDF = async () => {
            setLoading(true);
            try {
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const imgs = [];
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2 }); // جودة أعلى
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    
                    if (context) {
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        await page.render({ canvasContext: context, viewport }).promise;
                        imgs.push(canvas.toDataURL('image/webp', 0.8));
                    }
                }
                setPages(imgs);
                // تحديد أبعاد متناسبة للموبايل
                const isMobile = window.innerWidth < 768;
                setDimensions({
                    width: isMobile ? window.innerWidth * 0.9 : 450,
                    height: isMobile ? window.innerHeight * 0.7 : 600
                });
            } catch (err) {
                console.error("PDF Load Error:", err);
            }
            setLoading(false);
        };
        loadPDF();
    }, [pdfUrl]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="animate-pulse text-xl font-bold">جاري فتح صفحات الإبداع...</p>
        </div>
    );

    return (
        <div className="flex justify-center items-center w-full h-full overflow-hidden">
            {/* @ts-ignore */}
            <HTMLFlipBook 
                width={dimensions.width} 
                height={dimensions.height}
                size="stretch"
                minWidth={300}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1200}
                showCover={true}
                mobileScrollSupport={true}
                className="shadow-2xl shadow-black/50"
            >
                {pages.map((img, index) => (
                    <div key={index} className="bg-white shadow-inner border-l border-slate-100 overflow-hidden">
                        <img src={img} alt={`Page ${index}`} className="w-full h-full object-fill pointer-events-none" />
                    </div>
                ))}
            </HTMLFlipBook>
        </div>
    );
};

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [bursts, setBursts] = useState<any[]>([]);

    const studentWorks = [
        { id: "1", title: "أبي نبع العطاء", author: "ياسين محمد مسعود", cover: "/cover/12.jpg", pdfUrl: "/book/أبي نبع العطاء.pdf" },
        { id: "2", title: "الصدق منجاه", author: "الصالح إسماعيل المصري", cover: "/cover/17.jpg", pdfUrl: "/book/الصدق منجاه.pdf" },
        { id: "3", title: "مسرحية اللغة العربية", author: "فاطمة فلاح الأحبابي", cover: "/cover/18.jpg", pdfUrl: "/book/اللغة العربية في غربة الأبناء .pdf" },
        { id: "4", title: "حلم سيتحقق", author: "عدنان نزار", cover: "/cover/16.jpg", pdfUrl: "/book/حلم سيتحقق.pdf" },
        { id: "5", title: "حين تهت وجدتني", author: "ملك مجدي الدموكي", cover: "/cover/1.jpg", pdfUrl: "/book/حين تهت وجدتني.pdf" },
        { id: "6", title: "خطوات وحكايات", author: "مريم عبدالرحمن الساعدي", cover: "/cover/14.jpg", pdfUrl: "/book/خطوات وحكايات في أرض الذهب.pdf" },
        { id: "7", title: "شجاعة في قلب الصحراء", author: "يمنى أيمن النجار", cover: "/cover/13.jpg", pdfUrl: "/book/شجاعة في قلب الصحراء.pdf" },
        { id: "8", title: "ظل نخلة", author: "محمد نور الراضي", cover: "/cover/18.jpg", pdfUrl: "/book/ظل نخلة.pdf" },
        { id: "9", title: "عندما يعود الخير", author: "سهيلة صالح البلوشي", cover: "/cover/15.jpg", pdfUrl: "/book/عندما يعود الخير.pdf" },
        { id: "10", title: "لمار .. والسماء تهمس", author: "ألين رافع فريحات", cover: "/cover/11.jpg", pdfUrl: "/book/لمار .. والسماء التي تهمس.pdf" }
    ];

    const spawnMagic = () => {
        const id = Date.now();
        const newBurst = { id, tx: (Math.random() - 0.5) * 180, ty: -100 - Math.random() * 50, rot: (Math.random() - 0.5) * 30 };
        setBursts(prev => [...prev, newBurst]);
        setTimeout(() => setBursts(curr => curr.filter(b => b.id !== id)), 1000);
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-100 dark:bg-[#0a0f1d] font-['Cairo'] transition-colors duration-500">
            
            <header className="py-12 px-4 text-center">
                <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'Creators Portal'}
                </h1>
                <div className="w-24 h-2 bg-gradient-to-r from-red-600 to-orange-500 mx-auto rounded-full shadow-lg shadow-red-500/20"></div>
            </header>

            <main className="max-w-[1700px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24">
                
                {/* المؤلف الصغير: تصميم شبكي أنيق */}
                <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 order-2 lg:order-1">
                    {studentWorks.map((work) => (
                        <div key={work.id} className="group bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="relative h-60 overflow-hidden">
                                <img src={work.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm font-bold">{work.author}</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-black dark:text-white mb-4 h-14 overflow-hidden line-clamp-2">{work.title}</h3>
                                <button 
                                    onClick={() => setSelectedBook(work)}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                                >
                                    {locale === 'ar' ? 'تصفح الإبداع ✨' : 'Explore ✨'}
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* المخترع الصغير: تركيز بصري أقوى */}
                <aside className="lg:col-span-4 sticky top-10 h-fit flex flex-col items-center order-1 lg:order-2">
                    <div className="relative w-full flex justify-center py-10">
                        {/* الشعار المائل في الخلفية */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20 transform rotate-12 scale-110 pointer-events-none">
                            <img src="/saqr-digital.png" className="w-full max-w-sm object-contain" />
                        </div>
                        
                        {/* الشخصية */}
                        <div className="relative z-10 cursor-pointer select-none" onClick={spawnMagic}>
                            {bursts.map(b => (
                                <div key={b.id} 
                                     className="absolute z-50 bg-yellow-400 text-black text-[12px] font-black px-3 py-1.5 rounded-full shadow-xl animate-burst border-2 border-white"
                                     style={{ '--tx': `${b.tx}px`, '--ty': `${b.ty}px`, '--rot': `${b.rot}deg` } as any}>
                                    CREATIVE!
                                </div>
                            ))}
                            <img src="/creators-mascot.png" className="h-[350px] md:h-[550px] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.4)] transition-transform hover:scale-105" />
                        </div>
                    </div>

                    <div className="w-full bg-white dark:bg-slate-900/80 p-8 rounded-[40px] border border-white/10 shadow-2xl text-center">
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-2">
                            {locale === 'ar' ? 'المخترع الصغير' : 'Little Inventor'}
                        </h2>
                        <span className="inline-block px-4 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-black tracking-widest animate-pulse">
                            UNDER CONSTRUCTION
                        </span>
                    </div>
                </aside>
            </main>

            {/* مودال التقليب: ملء الشاشة مع تحسينات الموبايل */}
            {selectedBook && (
                <div className="fixed inset-0 z-[5000] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center">
                    <div className="absolute top-0 w-full p-6 flex justify-between items-center z-[5100]">
                        <h2 className="text-white text-xl font-bold truncate max-w-[70%]">{selectedBook.title}</h2>
                        <button onClick={() => setSelectedBook(null)} className="bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all">✕</button>
                    </div>
                    
                    <div className="w-full h-full max-w-6xl max-h-[85vh] p-4 flex items-center justify-center">
                        <FlipBookPlayer pdfUrl={selectedBook.pdfUrl} />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes burst {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    50% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); }
                    100% { opacity: 0; transform: translate(calc(var(--tx)*1.4), calc(var(--ty)*1.4)) scale(0.2); }
                }
                .animate-burst { animation: burst 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
