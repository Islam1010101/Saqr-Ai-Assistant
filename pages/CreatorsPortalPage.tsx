import React, { useState, useCallback } from 'react';
import { useLanguage } from '../App';

// --- إعدادات البيانات بناءً على هيكلة ملفاتك في GitHub ---
interface StudentWork {
    id: string;
    title: string;
    author: string;
    cover: string; // مجلد /cover/
    pdfUrl: string; // مجلد /book/
    audioUrl: string; // مجلد /audio/
}

const studentWorks: StudentWork[] = [
    {
        id: "1",
        title: "أبي نبع العطاء",
        author: "ياسين محمد مسعود",
        cover: "/cover/12.jpg", 
        pdfUrl: "/book/أبي نبع العطاء.pdf",
        audioUrl: "/أبي نبع العطاء.mp3"
    },
    {
        id: "2",
        title: "الصدق منجاه",
        author: "الصالح إسماعيل المصري",
        cover: "/cover/17.jpg", 
        pdfUrl: "/book/الصدق منجاه.pdf",
        audioUrl: "/الصدق منجاة.mp3"
    },
     {
        id: "3",
        title: "مسرحية اللغة العربية في غربة الأبناء",
        author: "فاطمة فلاح الأحبابي",
        cover: "/cover/18.jpg", 
        pdfUrl: "/book/اللغة العربية في غربة الأبناء .pdf",
        audioUrl: "/اللغة العربية.mp3"
    },
    {
        id: "4",
        title: "حلم سيتحقق",
        author: "عدنان نزار",
        cover: "/cover/16.jpg", 
        pdfUrl: "/book/حلم سيتحقق.pdf",
        audioUrl: "/حلم سيتحقق.mp3"
    },
    {
        id: "5",
        title: "حين تهت وجدتني",
        author: "ملك مجدي الدموكي",
        cover: "/cover/1.jpg", 
        pdfUrl: "/book/حين تهت وجدتني.pdf",
        audioUrl: "/حين تهت وجدتني.mp3"
    },
    {
        id: "6",
        title: "خطوات وحكايات في أرض الذهب",
        author: "مريم عبدالرحمن الساعدي",
        cover: "/cover/14.jpg", 
        pdfUrl: "/book/خطوات وحكايات في أرض الذهب.pdf",
        audioUrl: "/خطوات في ارض الذهب.mp3"
    },
    {
        id: "7",
        title: "شجاعة في قلب الصحراء",
        author: "يمنى أيمن النجار",
        cover: "/cover/13.jpg", 
        pdfUrl: "/book/شجاعة في قلب الصحراء.pdf",
        audioUrl: "/خطوات في ارض الذهب.mp3"
    },
     {
        id: "8",
        title: "ظل نخلة",
        author: "محمد نور الراضي",
        cover: "/cover/18.jpg", 
        pdfUrl: "/book/ظل نخلة.pdf",
        audioUrl: "/قصة بوسعيد.mp3"
    },
     {
        id: "9",
        title: "عندما يعود الخير",
        author: "سهيلة صالح البلوشي",
        cover: "/cover/15.jpg", 
        pdfUrl: "/book/عندما يعود الخير.pdf",
        audioUrl: "/عندما يعود الخير.mp3"
    },
    {
        id: "10",
        title: "لمار .. والسماء التي تهمس",
        author: "ألين رافع فريحات",
        cover: "/cover/11.jpg", 
        pdfUrl: "/book/لمار .. والسماء التي تهمس.pdf",
        audioUrl: "/لمار.mp3"
    }
];

interface QuoteBurst {
    id: number;
    text: string;
    tx: number;
    ty: number;
    rot: number;
}

const translations = {
    ar: {
        pageTitle: "بوابة المبدعين",
        subTitle: "خيال بلا حدود.. ابتكار يلامس السماء",
        authorSection: "المؤلف الصغير",
        inventorSection: "المخترع الصغير",
        readBook: "تصفح الكتاب",
        audioSummary: "الملخص الصوتي",
        comingSoon: "قريباً.. ابتكاراتنا!",
        mascotBubble: "اضغط هنا للإلهام!",
        quotes: ["ابتكر لتبهر العالم", "الخيال هو مفتاح النجاح", "صقر الإمارات يحلق عالياً", "كل طالب هو مبدع"]
    },
    en: {
        pageTitle: "Creators' Portal",
        subTitle: "Boundless Imagination.. Innovation that touches the sky",
        authorSection: "The Little Author",
        inventorSection: "The Little Inventor",
        readBook: "Flip Book",
        audioSummary: "Audio Summary",
        comingSoon: "Coming Soon!",
        mascotBubble: "Touch for Magic!",
        quotes: ["Innovate to inspire", "Imagination is key", "EFIPS flies high", "Every student is a creator"]
    }
};

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [bursts, setBursts] = useState<QuoteBurst[]>([]);
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

    // دالة تفاعل الشخصية (المخترع)
    const spawnMagic = useCallback(() => {
        const quotes = translations[locale].quotes;
        const id = Date.now();
        const newBurst = {
            id,
            text: quotes[Math.floor(Math.random() * quotes.length)],
            tx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 150 : 400),
            ty: -150 - Math.random() * 100,
            rot: (Math.random() - 0.5) * 40
        };
        setBursts(prev => [...prev, newBurst]);
        setTimeout(() => setBursts(curr => curr.filter(b => b.id !== id)), 4000);
        
        // تأثير صوتي خفيف عند الضغط
        const sfx = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        sfx.volume = 0.05; sfx.play().catch(() => {});
    }, [locale]);

    return (
        <div dir={dir} className="max-w-full mx-auto px-4 py-8 md:py-16 flex flex-col items-center gap-16 animate-fade-up font-black antialiased overflow-x-hidden">
            
            {/* 1. الهيدر الاحترافي */}
            <div className="text-center space-y-4 max-w-5xl z-20">
                <h1 className="text-6xl md:text-[9rem] font-black text-slate-950 dark:text-white tracking-tighter leading-none drop-shadow-2xl">
                    {t('pageTitle')}
                </h1>
                <p className="text-xl md:text-4xl text-green-700 dark:text-green-400 font-bold opacity-90 italic">
                    {t('subTitle')}
                </p>
                <div className="h-2 w-48 md:w-96 bg-gradient-to-r from-red-600 to-green-600 mx-auto rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-pulse"></div>
            </div>

            {/* 2. الحاوية الرئيسية (تقسيم 50/50) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-[1700px] items-start">
                
                {/* --- جناح المؤلف الصغير --- */}
                <section className="flex flex-col items-center bg-white/5 dark:bg-slate-900/40 p-6 md:p-10 rounded-[3rem] border-2 border-white/10 backdrop-blur-sm shadow-2xl">
                    <h2 className="text-4xl md:text-6xl text-green-600 mb-12 italic underline decoration-red-600 underline-offset-12">
                        {t('authorSection')}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                        {studentWorks.map((work) => (
                            <div key={work.id} className="group relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 shadow-xl hover:-translate-y-3 transition-all duration-500 border-2 border-transparent hover:border-green-500">
                                {/* غلاف الكتاب */}
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative shadow-inner">
                                    <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={() => setSelectedPdf(work.pdfUrl)}
                                            className="bg-white text-green-700 px-6 py-2 rounded-full font-black shadow-2xl transform scale-90 group-hover:scale-100 transition-transform"
                                        >
                                            {t('readBook')} 📖
                                        </button>
                                    </div>
                                </div>
                                {/* تفاصيل الكتاب */}
                                <div className="text-right space-y-1">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">{work.title}</h3>
                                    <p className="text-green-600 font-bold text-sm italic">{work.author}</p>
                                </div>
                                {/* المشغل الصوتي */}
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-tighter">{t('audioSummary')}</p>
                                    <audio controls className="h-8 w-full custom-audio">
                                        <source src={work.audioUrl} type="audio/mpeg" />
                                    </audio>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- جناح المخترع الصغير --- */}
                <section className="flex flex-col items-center space-y-12 bg-white/5 dark:bg-slate-900/40 p-6 md:p-10 rounded-[3rem] border-2 border-white/10 backdrop-blur-sm relative overflow-hidden h-full">
                    <h2 className="text-4xl md:text-6xl text-red-600 italic underline decoration-green-600 underline-offset-12">
                        {t('inventorSection')}
                    </h2>

                    <div className="relative group cursor-pointer mt-10" onClick={spawnMagic}>
                        {/* ومضات الإلهام */}
                        {bursts.map(b => (
                            <div key={b.id} 
                                 className="absolute z-[100] bg-white dark:bg-slate-900 px-6 py-4 rounded-[2rem] border-4 border-red-600 shadow-2xl animate-burst-fast w-[200px] md:w-[350px] pointer-events-none"
                                 style={{ '--tx': `${b.tx}px`, '--ty': `${b.ty}px`, '--rot': `${b.rot}deg` } as any}>
                                <p className="text-sm md:text-2xl text-center text-slate-900 dark:text-white">{b.text}</p>
                            </div>
                        ))}

                        {/* الشخصية من مجلد public مباشرة */}
                        <div className="relative">
                            <div className="absolute -inset-10 bg-red-600/20 blur-[100px] rounded-full animate-pulse"></div>
                            <img src="/creators-mascot.png" alt="Inventor Mascot" className="h-[350px] md:h-[650px] object-contain relative z-10 animate-float drop-shadow-[0_20px_50px_rgba(220,38,38,0.3)]" />
                            
                            {/* فقاعة الكلام */}
                            <div className="absolute -top-10 -right-10 bg-white dark:bg-slate-800 p-4 md:p-8 rounded-[2rem] shadow-2xl border-b-8 border-red-600 animate-bounce z-20">
                                <span className="text-sm md:text-2xl font-black text-red-600">{t('mascotBubble')}</span>
                            </div>
                        </div>
                    </div>

                    {/* شارة قريباً */}
                    <div className="w-full bg-gradient-to-r from-red-600/20 to-transparent p-10 rounded-[2.5rem] border-l-8 border-red-600">
                        <h4 className="text-3xl md:text-6xl text-red-600 animate-pulse">{t('comingSoon')}</h4>
                        <div className="flex gap-4 mt-4 opacity-50">
                            <span className="text-4xl">🤖</span><span className="text-4xl">🚀</span><span className="text-4xl">🧪</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* الفليب بوك مودال (التجربة الكاملة) */}
            {selectedPdf && (
                <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
                    <button onClick={() => setSelectedPdf(null)} className="absolute top-10 right-10 text-white text-5xl hover:rotate-90 transition-transform">✕</button>
                    <div className="w-full max-w-5xl aspect-video bg-white rounded-2xl overflow-hidden shadow-2xl">
                        <iframe src={selectedPdf} className="w-full h-full border-none" title="Book Viewer"></iframe>
                    </div>
                    <div className="absolute bottom-10 text-white/50 animate-pulse">💡 استخدم المتصفح لتقليب الصفحات حالياً</div>
                </div>
            )}

            <style>{`
                @keyframes burst-fast {
                    0% { transform: translate(0, 0) scale(0); opacity: 0; }
                    20% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(var(--rot)); opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translate(calc(var(--tx) * 1.2), calc(var(--ty) - 50px)) scale(0.8); opacity: 0; }
                }
                .animate-burst-fast { animation: burst-fast 4s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards; }
                .animate-float { animation: float 5s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
                
                .custom-audio::-webkit-media-controls-panel { background-color: #f1f5f9; }
                .dark .custom-audio::-webkit-media-controls-panel { background-color: #1e293b; }
            `}</style>

        </div>
    );
};

export default CreatorsPortalPage;
