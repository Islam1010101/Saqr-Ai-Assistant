import React, { useState } from 'react';
import { useLanguage } from '../App';

const DigitalLibraryPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    // مصفوفة المصادر الرقمية
    const arabicResources = [
        { title: "منصة ألف للتعليم", desc: "تعلم تفاعلي باللغة العربية", icon: "💎", link: "#" },
        { title: "مكتبة نور", desc: "آلاف الكتب العربية المجانية", icon: "📚", link: "#" },
        { title: "مجلة ماجد الرقمية", desc: "محتوى ترفيهي وتعليمي للأطفال", icon: "🎨", link: "#" },
    ];

    const englishResources = [
        { title: "Oxford Owl", desc: "Free eBook library for kids", icon: "🦉", link: "#" },
        { title: "Epic Library", desc: "Unlimited digital books for students", icon: "🚀", link: "#" },
        { title: "National Geographic Kids", desc: "Explore the world around you", icon: "🌍", link: "#" },
    ];

    const handleInteraction = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 800);
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-1000">
            
            {/* قسم الهيرو: صورة صقر الجديدة والعنوان */}
            <div className="glass-panel relative overflow-hidden rounded-[3.5rem] p-10 md:p-16 mb-16 border-white/20 flex flex-col md:flex-row items-center gap-10">
                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                
                <div className="flex-1 text-center md:text-start relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white mb-6 tracking-tighter leading-tight">
                        {isAr ? 'بوابة صقر للمصادر الرقمية' : 'Saqr Digital Resource Portal'}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 font-bold max-w-xl">
                        {isAr ? 'استكشف عالمًا من المعرفة عبر أفضل المنصات التعليمية العربية والعالمية.' : 'Explore a world of knowledge through the best Arabic and International platforms.'}
                    </p>
                </div>

                <div className="relative group cursor-pointer" onMouseDown={handleInteraction}>
                    {/* مكان صورة شخصية صقر الجديدة */}
                    <img 
                        src="/saqr-digital.png" 
                        alt="Saqr Digital" 
                        className="h-64 md:h-80 object-contain drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)] transform transition-transform group-hover:scale-110"
                    />
                </div>
            </div>

            {/* شبكة المكتبات */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* 1. المكتبة العربية */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-black text-gray-950 dark:text-white flex items-center gap-4">
                        <span className="w-2.5 h-10 bg-green-700 rounded-full shadow-[0_0_15px_rgba(0,115,47,0.4)]"></span>
                        {isAr ? 'المكتبة العربية' : 'Arabic Library'}
                    </h2>
                    <div className="grid gap-5">
                        {arabicResources.map((item, i) => (
                            <a 
                                key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                                className="glass-panel group relative overflow-hidden p-6 rounded-3xl border-white/10 hover:border-red-500/30 transition-all flex items-center gap-6"
                                onMouseDown={handleInteraction}
                            >
                                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/20" style={{ left: r.x, top: r.y }} />)}
                                <div className="text-4xl">{item.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </a>
                        ))}
                    </div>
                </section>

                {/* 2. المكتبة الإنجليزية */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-black text-gray-950 dark:text-white flex items-center gap-4">
                        <span className="w-2.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></span>
                        {isAr ? 'المكتبة الإنجليزية' : 'English Library'}
                    </h2>
                    <div className="grid gap-5">
                        {englishResources.map((item, i) => (
                            <a 
                                key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                                className="glass-panel group relative overflow-hidden p-6 rounded-3xl border-white/10 hover:border-red-500/30 transition-all flex items-center gap-6"
                                onMouseDown={handleInteraction}
                            >
                                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/20" style={{ left: r.x, top: r.y }} />)}
                                <div className="text-4xl">{item.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </a>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default DigitalLibraryPage;
