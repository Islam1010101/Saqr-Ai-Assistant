import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// أفكار ذكية وأيقونات رسمية
const KNOWLEDGE_CARDS = [
    { icon: "📜", text: "بحث رقمي" },
    { icon: "💡", text: "ابتكار" },
    { icon: "🤖", text: "ذكاء صقر" },
    { icon: "📚", text: "معرفة" },
    { icon: "🌍", text: "مستقبل" },
    { icon: "🔍", text: "استكشاف" }
];

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const [cards, setCards] = useState<{ id: number, x: number, y: number, item: typeof KNOWLEDGE_CARDS[0], tx: string, ty: string }[]>([]);

    const triggerInspiration = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        // توليد 4 كروت فقط لتجنب الزحمة
        const newCards = KNOWLEDGE_CARDS.sort(() => 0.5 - Math.random()).slice(0, 4).map((item, i) => ({
            id: Date.now() + i,
            x: clientX,
            y: clientY,
            item,
            tx: `${(Math.random() - 0.5) * 350}px`,
            ty: `${(Math.random() - 0.8) * 300}px` // تنطلق للأعلى أكثر
        }));

        setCards(prev => [...prev, ...newCards]);
        setTimeout(() => {
            setCards(prev => prev.filter(c => !newCards.find(n => n.id === c.id)));
        }, 2000); // حركة أبطأ وأهدأ
    };

    return (
        <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* كروت الأفكار المتطايرة */}
            {cards.map(card => (
                <div
                    key={card.id}
                    className="fixed pointer-events-none z-[100] glass-panel px-4 py-2 rounded-full flex items-center gap-2 border-white/40 shadow-xl animate-glass-float"
                    style={{
                        left: card.x,
                        top: card.y,
                        '--tx': card.tx,
                        '--ty': card.ty,
                    } as any}
                >
                    <span className="text-xl">{card.item.icon}</span>
                    <span className="text-sm font-black text-gray-800 dark:text-white whitespace-nowrap">
                        {isAr ? card.item.text : 'Insight'}
                    </span>
                </div>
            ))}

            <div className="relative z-10 glass-panel w-full max-w-6xl rounded-[3.5rem] overflow-hidden shadow-2xl p-8 md:p-16 border-white/30 dark:border-gray-700/30">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col text-start space-y-10 order-2 lg:order-1">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                                {isAr ? 'أهلاً بكم في مكتبة مدرسة صقر الإمارات' : 'Welcome to Saqr Library'}
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/search" className="glass-button-red font-black py-4 px-8 rounded-2xl shadow-lg">البحث اليدوي</Link>
                            <Link to="/smart-search" className="glass-button-green font-black py-4 px-8 rounded-2xl shadow-lg text-white">اسأل صقر (AI)</Link>
                        </div>
                    </div>

                    <div className="relative flex flex-col items-center justify-center order-1 lg:order-2">
                        {/* صقر المساعد - الضغط عليه يطلق الإلهام */}
                        <div 
                            onMouseDown={triggerInspiration}
                            onTouchStart={triggerInspiration}
                            className="relative group cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 touch-manipulation"
                        >
                            <img src="/saqr-full.png" alt="Saqr" className="h-72 md:h-[450px] object-contain drop-shadow-[0_20px_50px_rgba(0,115,47,0.3)]" />
                            <div className="absolute -top-4 -right-8 glass-panel p-5 rounded-3xl shadow-2xl text-xs font-black animate-bounce">
                                {isAr ? 'اضغط لاستلهام فكرة!' : 'Click for an idea!'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
