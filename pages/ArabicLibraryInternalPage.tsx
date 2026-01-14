import React, { useState } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

const ArabicLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const navigate = useNavigate();
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const categories = [
        { id: 'youth', titleAr: "أدب عربي للشباب", titleEn: "Arabic Youth Lit", icon: "👦", color: "bg-orange-500" },
        { id: 'literature', titleAr: "أدب عربي", titleEn: "Arabic Literature", icon: "🖋️", color: "bg-red-600" },
        { id: 'translated', titleAr: "أدب مترجم", titleEn: "Translated Lit", icon: "🌐", color: "bg-blue-600" },
        { id: 'islamic', titleAr: "كتب إسلامية", titleEn: "Islamic Books", icon: "🕌", color: "bg-emerald-600" },
        { id: 'development', titleAr: "كتب تنمية بشرية", titleEn: "Self-Development", icon: "🚀", color: "bg-purple-600" },
    ];

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    const handleInteraction = (e: React.MouseEvent, catId: string) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            // هنا يمكنك توجيه المستخدم لنتائج البحث المفلترة بهذا القسم
            // navigate(`/search?subject=${catId}`); 
        }, 400);
    };

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-10 animate-in fade-in zoom-in-95 duration-700">
            {/* زر العودة */}
            <button 
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-red-600 font-black transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                {isAr ? 'العودة للمكتبة الرقمية' : 'Back to Digital Library'}
            </button>

            <header className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter">
                    {isAr ? 'أقسام المكتبة العربية' : 'Arabic Library Sections'}
                </h1>
                <p className="text-lg text-gray-500 font-bold uppercase tracking-[0.2em]">E.F.I.P.S Digital Collection</p>
                <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full mt-6 shadow-lg shadow-red-600/20"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {categories.map((cat) => (
                    <div 
                        key={cat.id}
                        onMouseMove={handleMouseMove}
                        onMouseDown={(e) => handleInteraction(e, cat.id)}
                        className="glass-panel glass-card-interactive relative overflow-hidden p-8 rounded-[3rem] border-white/20 hover:scale-[1.02] transition-all cursor-pointer group active:scale-95 h-64 flex flex-col justify-between"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                        
                        <div className={`w-16 h-16 ${cat.color} text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl transform group-hover:rotate-12 transition-transform duration-500`}>
                            {cat.icon}
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-2">
                                {isAr ? cat.titleAr : cat.titleEn}
                            </h2>
                            <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>{isAr ? 'تصفح الآن' : 'Explore Now'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* شعار المدرسة المبيّض في الأسفل للجمالية */}
            <div className="mt-20 flex justify-center opacity-20 dark:opacity-10 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="/school-logo.png" alt="EFIIPS" className="h-24 w-auto logo-white-filter" />
            </div>
        </div>
    );
};

export default ArabicLibraryInternalPage;
