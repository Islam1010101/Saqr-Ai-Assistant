import React, { useState } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

const ArabicLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const navigate = useNavigate();
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const categories = [
        { id: 1, title: "أدب عربي للشباب", icon: "👦", color: "from-orange-500/20 to-orange-600/20", border: "border-orange-500/30" },
        { id: 2, title: "أدب عربي", icon: "🖋️", color: "from-red-500/20 to-red-600/20", border: "border-red-500/30" },
        { id: 3, title: "أدب مترجم", icon: "🌐", color: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/30" },
        { id: 4, title: "كتب إسلامية", icon: "🕌", color: "from-emerald-500/20 to-emerald-600/20", border: "border-emerald-500/30" },
        { id: 5, title: "كتب تنمية بشرية", icon: "🚀", color: "from-purple-500/20 to-purple-600/20", border: "border-purple-500/30" },
    ];

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    const handleInteraction = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setRipples(prev => [...prev, { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        setTimeout(() => setRipples(prev => prev.slice(1)), 800);
    };

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-10 animate-in fade-in zoom-in-95 duration-700">
            {/* زر العودة */}
            <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-red-600 font-black transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform group-hover:-translate-x-1 ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                {isAr ? 'العودة للمكتبة الرقمية' : 'Back'}
            </button>

            <header className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter">أقسام المكتبة العربية</h1>
                <p className="text-lg text-gray-500 font-bold uppercase tracking-widest">E.F.I.P.S Arabic Collection</p>
                <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full mt-6 shadow-lg shadow-red-600/20"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {categories.map((cat) => (
                    <div key={cat.id} onMouseMove={handleMouseMove} onMouseDown={handleInteraction}
                        className={`glass-panel glass-card-interactive relative overflow-hidden p-8 rounded-[2.5rem] border-2 ${cat.border} bg-gradient-to-br ${cat.color} hover:scale-[1.03] transition-all cursor-pointer group active:scale-95 h-60 flex flex-col justify-between`}>
                        {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/20" style={{ left: r.x, top: r.y }} />)}
                        <div className="text-5xl transform group-hover:rotate-12 transition-transform duration-500">{cat.icon}</div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{cat.title}</h2>
                            <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>تصفح الكتب</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-20 flex justify-center opacity-20 grayscale">
                <img src="/school-logo.png" alt="EFIPS" className="h-20 w-auto logo-white-filter" />
            </div>
        </div>
    );
};

export default ArabicLibraryInternalPage;
