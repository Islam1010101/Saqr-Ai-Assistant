import React, { useState } from 'react';
import { useLanguage } from '../App';

const DigitalLibraryPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const resources = [
        { id: 1, titleAr: "الكتب الإلكترونية", titleEn: "E-Books", icon: "📚", color: "bg-blue-500" },
        { id: 2, titleAr: "قواعد بيانات الأبحاث", titleEn: "Research Databases", icon: "🔬", color: "bg-purple-500" },
        { id: 3, titleAr: "المصادر السمعية", titleEn: "Audiobooks", icon: "🎧", color: "bg-orange-500" },
        { id: 4, titleAr: "المجلات العلمية", titleEn: "Digital Magazines", icon: "📰", color: "bg-emerald-500" },
    ];

    const handleInteraction = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 800);
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-10 animate-in fade-in duration-1000">
            <header className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white mb-6 tracking-tighter">
                    {locale === 'ar' ? 'بوابة المعرفة الرقمية' : 'Digital Knowledge Portal'}
                </h1>
                <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {resources.map((item) => (
                    <div 
                        key={item.id}
                        onMouseDown={handleInteraction}
                        className="glass-panel relative overflow-hidden p-8 rounded-[2.5rem] border-white/20 hover:scale-105 transition-all cursor-pointer group"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                        <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">
                            {locale === 'ar' ? item.titleAr : item.titleEn}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase tracking-widest">
                            {locale === 'ar' ? 'دخول سريع' : 'Quick Access'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DigitalLibraryPage;
