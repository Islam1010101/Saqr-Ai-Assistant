import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../App';

// --- قاعدة البيانات ---
const ShelfS_DB = [
    // الجناح 1 (1-21)
    ...Array.from({ length: 21 }).map((_, i) => ({ id: i + 1, wing: 1, ar: "معارف عامة وأدب كبار", en: "General Knowledge & Adult Lit" })),
    // الجناح 2 (22-30)
    ...Array.from({ length: 9 }).map((_, i) => ({ id: i + 22, wing: 2, ar: "ديزني وعلوم الشباب", en: "Disney & Youth Sciences" })),
    // الجناح 3 (31-39)
    ...Array.from({ length: 9 }).map((_, i) => ({ id: i + 31, wing: 3, ar: "اللغة العربية والدين", en: "Arabic & Religion" })),
    // الجناح 4 (40-41)
    { id: 40, wing: 4, ar: "كتب الاستماع والهوية الوطنية", en: "Audio Books & UAE Identity" },
    { id: 41, wing: 4, ar: "الهوية الوطنية الإماراتية", en: "UAE National Identity" },
    // الجناح 5 (42-58)
    ...Array.from({ length: 17 }).map((_, i) => ({ id: i + 42, wing: 5, ar: "عالم الأطفال والصغار", en: "Kids & Junior World" }))
];

const LibraryMapPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const [activeShelfId, setActiveShelfId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [currentWingTheme, setCurrentWingTheme] = useState(1);

    // تتبع الماوس بمرونة
    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const getWingTheme = (wing: number) => {
        const themes = [
            { color: "#ef4444", glow: "rgba(239, 68, 68, 0.2)", nameAr: "جناح الباحثين", nameEn: "Researchers Wing" },
            { color: "#3b82f6", glow: "rgba(59, 130, 246, 0.2)", nameAr: "جناح الشباب", nameEn: "Youth Wing" },
            { color: "#10b981", glow: "rgba(16, 185, 129, 0.2)", nameAr: "جناح العربية", nameEn: "Arabic Wing" },
            { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.2)", nameAr: "الجناح الخاص", nameEn: "Special Wing" },
            { color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.2)", nameAr: "جناح الصغار", nameEn: "Kids Wing" }
        ];
        return themes[wing - 1] || themes[0];
    };

    const renderWing = (wingId: number) => {
        const theme = getWingTheme(wingId);
        const shelves = ShelfS_DB.filter(s => s.wing === wingId);

        return (
            <div 
                onMouseEnter={() => setCurrentWingTheme(wingId)}
                className="mb-16 md:mb-32 relative group"
            >
                {/* عنوان الجناح التفاعلي */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-1 w-20 md:w-40 rounded-full" style={{ background: theme.color }}></div>
                    <h2 className="text-3xl md:text-8xl font-black opacity-40 group-hover:opacity-100 transition-all duration-700 tracking-tighter uppercase">
                        {isAr ? theme.nameAr : theme.nameEn}
                    </h2>
                </div>

                {/* شبكة الرفوف */}
                <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-12 gap-2 md:gap-4 p-4 md:p-10 glass-panel rounded-[2rem] md:rounded-[4rem] border-white/5 bg-white/5 shadow-inner">
                    {shelves.map(s => {
                        const isMatch = searchQuery && (s.ar.includes(searchQuery) || s.en.toLowerCase().includes(searchQuery.toLowerCase()));
                        const isActive = activeShelfId === s.id;

                        return (
                            <button
                                key={s.id}
                                onMouseEnter={() => setActiveShelfId(s.id)}
                                onMouseLeave={() => setActiveShelfId(null)}
                                className={`
                                    relative aspect-square rounded-lg md:rounded-2xl text-xs md:text-3xl font-black transition-all duration-300
                                    flex items-center justify-center border-2
                                    ${isActive || isMatch 
                                        ? 'scale-125 z-30 shadow-2xl border-white bg-white text-black' 
                                        : 'bg-black/20 border-white/10 text-white/30 hover:border-white/40'}
                                `}
                                style={isActive || isMatch ? { boxShadow: `0 0 40px ${theme.color}` } : {}}
                            >
                                {s.id}
                                {(isActive || isMatch) && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const activeData = useMemo(() => ShelfS_DB.find(s => s.id === activeShelfId), [activeShelfId]);

    return (
        <div 
            dir={dir} 
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-[#020617] text-white font-black relative overflow-x-hidden antialiased transition-colors duration-1000 pb-40"
        >
            {/* 1. نظام الإضاءة المحيطية (Dynamic Background) */}
            <div 
                className="fixed inset-0 pointer-events-none transition-all duration-1000 z-0 opacity-40"
                style={{ 
                    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${getWingTheme(currentWingTheme).glow} 0%, transparent 50%)` 
                }}
            ></div>

            <div className="relative z-10 max-w-[1800px] mx-auto px-4 pt-10 md:pt-20">
                
                {/* 2. الهيرو مع تأثير البارالاكس */}
                <header className="mb-20 md:mb-40 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="space-y-6 text-center lg:text-start">
                        <h1 className="text-6xl md:text-[15rem] leading-[0.8] tracking-tighter uppercase glass-text">
                            Explore<br/>
                            <span className="text-red-600">The Map</span>
                        </h1>
                        <p className="text-lg md:text-5xl opacity-50 font-bold max-w-3xl leading-tight">
                            {isAr ? 'حرك المؤشر لاستكشاف عوالم المعرفة المخبأة في الرفوف' : 'Hover to discover knowledge worlds hidden in the shelves'}
                        </p>
                    </div>
                    <img src="/unnamed.png" alt="Logo" className="h-40 md:h-80 object-contain animate-float opacity-20 hover:opacity-100 transition-opacity" />
                </header>

                {/* 3. الرادار (شريط البحث المتطور) */}
                <div className="sticky top-10 z-[100] mb-20 md:mb-40">
                    <div className="max-w-4xl mx-auto glass-panel p-2 md:p-4 rounded-full border-white/20 bg-white/5 backdrop-blur-3xl shadow-2xl flex items-center gap-4">
                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-red-600 flex items-center justify-center text-2xl md:text-5xl shadow-lg">🔍</div>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={isAr ? "اكتب قسماً للبحث عنه..." : "Type a section to scan..."}
                            className="bg-transparent border-none outline-none flex-1 text-xl md:text-5xl font-black placeholder:opacity-20"
                        />
                    </div>
                </div>

                {/* 4. الخريطة (الأجنحة) */}
                <div className="relative">
                    {renderWing(1)}
                    {renderWing(2)}
                    {renderWing(3)}
                    {renderWing(4)}
                    {renderWing(5)}
                </div>

                {/* 5. الـ HUD الذكي (بطاقة المعلومات التي تتبع الماوس) */}
                {activeShelfId && activeData && (
                    <div 
                        className="fixed pointer-events-none z-[1000] animate-in fade-in zoom-in duration-300"
                        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -120%)' }}
                    >
                        <div className="glass-panel px-6 py-4 md:px-12 md:py-8 rounded-[2rem] md:rounded-[3rem] border-white/40 bg-black/60 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.5)] text-center">
                            <p className="text-[10px] md:text-xl text-red-500 uppercase tracking-widest mb-1">Shelf Unit {activeData.id}</p>
                            <h3 className="text-xl md:text-6xl whitespace-nowrap">
                                {isAr ? activeData.ar : activeData.en}
                            </h3>
                            <div className="mt-4 flex justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-75"></span>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .glass-panel {
                    backdrop-filter: blur(40px) saturate(150%);
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .glass-text {
                    background: linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.1) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }

                * { font-style: normal !important; cursor: none; }
                
                /* إخفاء السكرول بار */
                ::-webkit-scrollbar { display: none; }
                
                /* تخصيص المؤشر ليكون دائرة تفاعلية */
                body::after {
                    content: '';
                    position: fixed;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    mix-blend-mode: difference;
                    left: var(--x, 0);
                    top: var(--y, 0);
                    transform: translate(-50%, -50%);
                    transition: width 0.3s, height 0.3s;
                }
            `}</style>
        </div>
    );
};

export default LibraryMapPage;
