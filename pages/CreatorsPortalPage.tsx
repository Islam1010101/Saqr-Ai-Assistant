import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';

// إعداد قراءة الـ PDF أونلاين
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// --- المكون الفرعي لنظام التقليب (Flipbook) ---
const FlipBookPlayer = ({ pdfUrl }: { pdfUrl: string }) => {
    const [pages, setPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPDF = async () => {
            setLoading(true);
            try {
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const imgs = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    if (context) {
                        await page.render({ canvasContext: context, viewport }).promise;
                        imgs.push(canvas.toDataURL());
                    }
                }
                setPages(imgs);
            } catch (err) { console.error("Error loading PDF:", err); }
            setLoading(false);
        };
        loadPDF();
    }, [pdfUrl]);

    if (loading) return <div className="flex justify-center items-center h-full text-white animate-pulse text-2xl">جاري تحضير صفحات الكتاب... 📖</div>;

    return (
        <div className="flex justify-center items-center w-full h-full">
            {/* @ts-ignore */}
            <HTMLFlipBook width={500} height={700} size="stretch" className="shadow-2xl">
                {pages.map((img, index) => (
                    <div key={index} className="bg-white shadow-inner border-l border-slate-200">
                        <img src={img} alt={`Page ${index}`} className="w-full h-full object-contain" />
                    </div>
                ))}
            </HTMLFlipBook>
        </div>
    );
};

// --- المكون الرئيسي للصفحة ---
const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [bursts, setBursts] = useState<any[]>([]);
    
    // بيانات الكتب (نفس اللي عندك)
    const studentWorks = [
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

    const spawnMagic = () => {
        const id = Date.now();
        const newBurst = {
            id,
            tx: (Math.random() - 0.5) * 200,
            ty: -60 - Math.random() * 120,
            rot: (Math.random() - 0.5) * 40
        };
        setBursts(prev => [...prev, newBurst]);
        setTimeout(() => setBursts(curr => curr.filter(b => b.id !== id)), 1200);
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-all duration-700 overflow-x-hidden font-['Cairo']">
            
            {/* Header */}
            <header className="py-16 text-center">
                <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                    {locale === 'ar' ? 'بوابة المبدعين' : 'Creators Portal'}
                </h1>
                <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full"></div>
            </header>

            <main className="max-w-[1800px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
                
                {/* المؤلف الصغير */}
                <section className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {studentWorks.map((work) => (
                        <div key={work.id} className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform">
                            <img src={work.cover} className="w-full h-64 object-cover" />
                            <div className="p-5">
                                <h3 className="text-xl font-bold dark:text-white mb-4">{work.title}</h3>
                                <button 
                                    onClick={() => setSelectedBook(work)}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-black hover:bg-green-700 transition-colors"
                                >
                                    {locale === 'ar' ? 'اقرأ الكتاب 📖' : 'Read Book 📖'}
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* المخترع الصغير - بدون إطار + شعار مائل */}
                <aside className="lg:col-span-4 relative flex flex-col items-center justify-center min-h-[600px]">
                    
                    {/* شعار المدرسة في الخلفية يميل لليمين ويتفاعل مع الدارك مود */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] opacity-10 dark:opacity-25 pointer-events-none transform rotate-[20deg] transition-all duration-1000">
                        <img src="/saqr-digital.png" className="w-full object-contain dark:invert" alt="Logo" />
                    </div>

                    {/* الشخصية والكروت */}
                    <div className="relative z-10 cursor-pointer" onClick={spawnMagic}>
                        {bursts.map(b => (
                            <div key={b.id} 
                                 className="absolute z-50 bg-white/90 dark:bg-slate-800 backdrop-blur-md px-3 py-1 rounded-lg border-2 border-red-500 text-[10px] font-black animate-burst shadow-2xl"
                                 style={{ '--tx': `${b.tx}px`, '--ty': `${b.ty}px`, '--rot': `${b.rot}deg` } as any}>
                                {locale === 'ar' ? 'مبدع ⚡' : 'Genius ⚡'}
                            </div>
                        ))}
                        <img src="/creators-mascot.png" className="h-[450px] md:h-[650px] object-contain animate-float drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
                    </div>

                    <div className="mt-8 text-center bg-white/40 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                        <h2 className="text-3xl font-black text-red-600 mb-2">{locale === 'ar' ? 'المخترع الصغير' : 'Little Inventor'}</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest animate-pulse">Coming Soon</p>
                    </div>
                </aside>
            </main>

            {/* مودال التقليب (Flipbook Modal) */}
            {selectedBook && (
                <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
                    <button onClick={() => setSelectedBook(null)} className="absolute top-6 right-6 text-white text-5xl hover:scale-125 transition-transform z-[2100]">✕</button>
                    <div className="w-full max-w-5xl h-[85vh]">
                        <FlipBookPlayer pdfUrl={selectedBook.pdfUrl} />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                .animate-float { animation: float 5s ease-in-out infinite; }
                
                @keyframes burst {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    20% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); }
                    100% { opacity: 0; transform: translate(calc(var(--tx)*1.3), calc(var(--ty)*1.3)) scale(0.4); filter: blur(3px); }
                }
                .animate-burst { animation: burst 1.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
