import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "أهلاً بكم في مكتبة مدرسة صقر الإمارات",
        subWelcome: "تحدث مع مساعدنا الذكي للعثور على ما تحتاجه بكل سهولة.",
        manualSearch: "البحث اليدوي",
        manualDesc: "ابحث عن الكتب برقم الرف أو العنوان",
        smartSearch: "اسأل صقر (AI)",
        smartDesc: "تحدث مع صقر للحصول على ترشيحات ذكية",
        digitalLibrary: "المكتبة الإلكترونية",
        digitalDesc: "الوصول إلى المصادر الرقمية والكتب التفاعلية",
        bubble: "اضغط لاستلهام فكرة!",
        copyright: "مدرسة صقر الإمارات الدولية الخاصة"
    },
    en: {
        welcome: "Welcome to Saqr Al Emarat School Library",
        subWelcome: "Interact with our smart assistant to find your next great read.",
        manualSearch: "Manual Search",
        manualDesc: "Find books by shelf number or title",
        smartSearch: "Ask Saqr (AI)",
        smartDesc: "Chat with Saqr for AI recommendations",
        digitalLibrary: "Digital Library",
        digitalDesc: "Access digital resources and interactive books",
        bubble: "Click for an idea!",
        copyright: "Emirates Falcon International Private School"
    }
}

const KNOWLEDGE_CARDS = [
    { icon: "📜", textAr: "بحث رقمي", textEn: "Digital Research" },
    { icon: "💡", textAr: "فكرة مبتكرة", textEn: "Innovative Idea" },
    { icon: "🤖", textAr: "ذكاء صقر", textEn: "Saqr AI" },
    { icon: "📚", textAr: "مصادر المعرفة", textEn: "Knowledge Sources" },
    { icon: "🌍", textAr: "رؤية مستقبلية", textEn: "Future Vision" },
    { icon: "🔍", textAr: "استكشاف حر", textEn: "Free Exploration" }
];

const BackgroundPattern = () => (
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.08), transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(0, 115, 47, 0.05), transparent 40%)
        `,
    }}></div>
);

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [cards, setCards] = useState<{ id: number, x: number, y: number, item: typeof KNOWLEDGE_CARDS[0], tx: string, ty: string }[]>([]);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, isMascot: boolean = false) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x, y }]);

        if (isMascot) {
            const newCards = KNOWLEDGE_CARDS.sort(() => 0.5 - Math.random()).slice(0, 4).map((item, i) => ({
                id: rippleId + i,
                x: clientX,
                y: clientY,
                item,
                tx: `${(Math.random() - 0.5) * 450}px`,
                ty: `${(Math.random() - 0.9) * 400}px` 
            }));
            setCards(prev => [...prev, ...newCards]);
        }

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            if (isMascot) {
                setCards(prev => prev.filter(c => c.id < rippleId || c.id > rippleId + 4));
            }
        }, 2000);
    };

    return (
        <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-4 overflow-hidden">
            <BackgroundPattern />

            {/* طبقة كروت المعرفة المتطايرة */}
            {cards.map(card => (
                <div
                    key={card.id}
                    className="fixed pointer-events-none z-[100] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl px-6 py-3 rounded-2xl flex items-center gap-3 border-2 border-red-500/40 shadow-[0_15px_40px_rgba(239,68,68,0.2)] animate-glass-float"
                    style={{ left: card.x, top: card.y, '--tx': card.tx, '--ty': card.ty } as any}
                >
                    <span className="text-2xl">{card.item.icon}</span>
                    <span className="text-lg font-black text-gray-950 dark:text-white uppercase tracking-tighter">
                        {isAr ? card.item.textAr : card.item.textEn}
                    </span>
                </div>
            ))}

            <div className="relative z-10 glass-panel w-full max-w-6xl rounded-[3.5rem] overflow-hidden shadow-2xl p-8 md:p-16 border-white/30 dark:border-white/10">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    <div className="flex flex-col text-start space-y-10 order-2 lg:order-1">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white leading-tight tracking-tighter">
                                {t('welcome')}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            {/* الزر الجديد: المكتبة الإلكترونية (أسود/أبيض) */}
                            <div className="relative group w-full sm:w-auto">
                                <Link 
                                    to="/digital-library" 
                                    onMouseDown={(e) => handleInteraction(e)}
                                    className="relative overflow-hidden bg-gray-950 text-white dark:bg-white dark:text-gray-950 font-black py-4 px-8 rounded-2xl active:scale-95 flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 group-hover:scale-105"
                                >
                                    {ripples.map(r => (
                                        <span key={r.id} className="ripple-effect border-red-500/40" style={{ left: r.x, top: r.y }} />
                                    ))}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span className="relative z-10">{t('digitalLibrary')}</span>
                                </Link>
                                <div className="absolute -bottom-16 start-0 scale-0 group-hover:scale-100 transition-all duration-300 origin-top z-50 pointer-events-none">
                                    <div className="glass-panel px-4 py-2 rounded-xl border-gray-950/20 dark:border-white/20 shadow-2xl whitespace-nowrap">
                                        <p className="text-xs font-black text-gray-950 dark:text-gray-400 uppercase tracking-wider">{t('digitalDesc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* البحث اليدوي */}
                            <div className="relative group">
                                <Link 
                                    to="/search" 
                                    onMouseDown={(e) => handleInteraction(e)}
                                    className="relative overflow-hidden glass-button-red font-black py-4 px-8 rounded-2xl active:scale-95 flex items-center gap-3 shadow-lg text-lg transition-all"
                                >
                                    {ripples.map(r => (
                                        <span key={r.id} className="ripple-effect border-red-500/40" style={{ left: r.x, top: r.y }} />
                                    ))}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    <span className="relative z-10">{t('manualSearch')}</span>
                                </Link>
                            </div>

                            {/* البحث الذكي */}
                            <div className="relative group">
                                <Link 
                                    to="/smart-search" 
                                    onMouseDown={(e) => handleInteraction(e)}
                                    className="relative overflow-hidden glass-button-green font-black py-4 px-8 rounded-2xl active:scale-95 flex items-center gap-3 shadow-lg text-lg transition-all"
                                >
                                    {ripples.map(r => (
                                        <span key={r.id} className="ripple-effect border-red-500/40" style={{ left: r.x, top: r.y }} />
                                    ))}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    <span className="relative z-10">{t('smartSearch')}</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* قسم شخصية صقر التفاعلية */}
                    <div className="relative flex flex-col items-center justify-center order-1 lg:order-2">
                        <div className="absolute opacity-15 dark:opacity-10 scale-150 pointer-events-none transition-all duration-700">
                             <img src="/school-logo.png" alt="Back Logo" className="h-64 w-64 md:h-80 md:w-80 object-contain rotate-[15deg]" />
                        </div>

                        <div 
                            onMouseDown={(e) => handleInteraction(e, true)}
                            onTouchStart={(e) => handleInteraction(e, true)}
                            className="relative group cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 touch-manipulation"
                        >
                            {ripples.map(r => (
                                <span key={r.id} className="ripple-effect border-red-500/40" style={{ left: r.x, top: r.y, width: '300px', height: '300px' }} />
                            ))}

                            <img src="/saqr-full.png" alt="Saqr Mascot" className="h-72 md:h-[450px] object-contain drop-shadow-[0_20px_60px_rgba(239,68,68,0.2)]" />
                            <div className="absolute -top-4 -right-8 glass-panel p-5 rounded-3xl shadow-2xl border-white/20 text-sm font-black text-red-800 dark:text-white max-w-[160px] animate-bounce pointer-events-none">
                                {t('bubble')}
                                <div className="absolute -bottom-2 left-6 w-4 h-4 glass-panel border-r-2 border-b-2 border-white/10 rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
