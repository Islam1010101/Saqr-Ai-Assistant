import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../App';

// --- قاعدة البيانات (كما هي تماماً) ---
const ShelfS_DB = [
    // الجناح 1 (1-21)
    { id: 1, wing: 1, ar: "معارف عامة", en: "General Knowledge" },
    { id: 2, wing: 1, ar: "معارف عامة / فلسفة وعلم نفس", en: "Gen. Knowledge / Philosophy & Psych" },
    { id: 3, wing: 1, ar: "فلسفة وعلم نفس / علوم اجتماعية", en: "Philosophy & Psych / Social Sciences" },
    { id: 4, wing: 1, ar: "علوم اجتماعية", en: "Social Sciences" },
    { id: 5, wing: 1, ar: "علوم اجتماعية", en: "Social Sciences" },
    { id: 6, wing: 1, ar: "معاجم وقواميس لغات / علوم بحتة", en: "Dictionaries / Pure Sciences" },
    { id: 7, wing: 1, ar: "علوم بحتة / علوم تطبيقية", en: "Pure Sciences / Applied Sciences" },
    { id: 8, wing: 1, ar: "علوم تطبيقية", en: "Applied Sciences" },
    { id: 9, wing: 1, ar: "علوم تطبيقية", en: "Applied Sciences" },
    { id: 10, wing: 1, ar: "علوم تطبيقية", en: "Applied Sciences" },
    { id: 11, wing: 1, ar: "علوم تطبيقية", en: "Applied Sciences" },
    { id: 12, wing: 1, ar: "فنون", en: "Arts" },
    { id: 13, wing: 1, ar: "أدب وروايات (Grades 10,11,12)", en: "Literature & Novels (Grades 10-12)" },
    { id: 14, wing: 1, ar: "أدب وروايات (Grades 10,11,12)", en: "Literature & Novels (Grades 10-12)" },
    { id: 15, wing: 1, ar: "أدب وروايات (Grades 10,11,12)", en: "Literature & Novels (Grades 10-12)" },
    { id: 16, wing: 1, ar: "أدب وروايات للبالغين", en: "Adult Literature & Novels" },
    { id: 17, wing: 1, ar: "أدب وروايات للبالغين", en: "Adult Literature & Novels" },
    { id: 18, wing: 1, ar: "أدب وروايات للبالغين", en: "Adult Literature & Novels" },
    { id: 19, wing: 1, ar: "أدب وروايات للبالغين", en: "Adult Literature & Novels" },
    { id: 20, wing: 1, ar: "جغرافيا وتاريخ وتراجم", en: "Geography, History & Biographies" },
    { id: 21, wing: 1, ar: "جغرافيا وتاريخ وتراجم", en: "Geography, History & Biographies" },
    // الجناح 2 (22-30)
    { id: 22, wing: 2, ar: "كتب وإنتاجات ديزني", en: "Disney World Productions" },
    { id: 23, wing: 2, ar: "عالم الحيوان والبحار", en: "Animal & Marine World" },
    { id: 24, wing: 2, ar: "علوم الفيزياء والكيمياء والأرض والأحياء والرياضيات", en: "Physics, Chem, Earth, Bio & Math" },
    { id: 25, wing: 2, ar: "العلوم الاجتماعية والرياضة", en: "Social Sciences & Sports" },
    { id: 26, wing: 2, ar: "لغات مختلفة، ألغاز، موسيقى، ومجلات", en: "Languages, Puzzles, Music & Magazines" },
    { id: 27, wing: 2, ar: "قصص وروايات وكتب تعليمية (الحلقة الثانية)", en: "Cycle 2 Stories & Edu Books" },
    { id: 28, wing: 2, ar: "قصص وروايات وكتب تعليمية (الحلقة الثانية)", en: "Cycle 2 Stories & Edu Books" },
    { id: 29, wing: 2, ar: "كتب جلسات القراءة ودوائر المعارف (الحلقة الثانية)", en: "Cycle 2 Reading & Encyclopedias" },
    { id: 30, wing: 2, ar: "كتب خاصة للحلقة الثانية (Grades 7-9)", en: "Cycle 2 Special (Grades 7-9)" },
    // الجناح 3 (31-39)
    { id: 31, wing: 3, ar: "كتب الدين الإسلامي", en: "Islamic Religion Books" },
    { id: 32, wing: 3, ar: "كتب التراجم والتاريخ والنقد الأدبي", en: "Biographies, History & Lit Criticism" },
    { id: 33, wing: 3, ar: "الأدب العربي والشعر والروايات والفنون العربية", en: "Arabic Lit, Poetry, Novels & Arts" },
    { id: 34, wing: 3, ar: "كتب عربية (قصص، علمية، إسلامية، مجلة عجاج) - حلقة 3", en: "Arabic Cycle 3 (Stories, Science, Ajaj)" },
    { id: 35, wing: 3, ar: "كتب عربية (قصص، علمية، إسلامية، مجلة عجاج) - حلقة 3", en: "Arabic Cycle 3 (Stories, Science, Ajaj)" },
    { id: 36, wing: 3, ar: "كتب عربية (قصص، كتب تعلم ذاتي) - حلقة 2", en: "Arabic Cycle 2 (Stories, Self-Learning)" },
    { id: 37, wing: 3, ar: "كتب عربية (قصص، كتب إسلامية) - حلقة 1", en: "Arabic Cycle 1 (Stories, Islamic)" },
    { id: 38, wing: 3, ar: "إصدارات دار كلمة / كتب علمية منوعة", en: "Kalima Publisher / Misc Science" },
    { id: 39, wing: 3, ar: "الموسوعة العربية، تربية وتعليم، بلاغة وقواعد", en: "Arabic Encyclopedia, Edu & Grammar" },
    // الجناح 4 (40-41)
    { id: 40, wing: 4, ar: "كتب الاستماع (QR Code) - ملخصات إنجليزية", en: "Audio Books (QR Code) - English Summaries" },
    { id: 41, wing: 4, ar: "الهوية الوطنية الإماراتية والتراث والنهضة", en: "UAE National Identity, Heritage & Rulers" },
    // الجناح 5 (42-58)
    ...Array.from({ length: 17 }).map((_, i) => ({
        id: i + 42,
        wing: 5,
        ar: i + 42 <= 46 ? "كتب خاصة بالصف الثالث" : i + 42 <= 49 ? "كتب خاصة بالصف الثاني" : "كتب الصف الأول والكي جي",
        en: i + 42 <= 46 ? "Grade 3 Collection" : i + 42 <= 49 ? "Grade 2 Collection" : "Grade 1 & KG Collection"
    }))
];

const translations = {
    ar: {
        pageTitle: "خريطة المكتبة",
        subTitle: "اكتشف عوالم المعرفة.. تتبع المؤشر للتفاصيل",
        searchPlaceholder: "ابحث عن قسم (تاريخ، علوم)...",
        wing1: "جناح الباحثين والبالغين",
        wing2: "جناح الشباب والعلوم",
        wing3: "جناح اللغة العربية",
        wing4: "الجناح الخاص",
        wing5: "جناح الصغار والأطفال"
    },
    en: {
        pageTitle: "Library Map",
        subTitle: "Discover worlds of knowledge.. Follow cursor for details",
        searchPlaceholder: "Search for a section...",
        wing1: "Adults & Researchers",
        wing2: "Youth & Sciences",
        wing3: "Arabic Language",
        wing4: "Special Wing",
        wing5: "Children's Wing"
    }
};

const LibraryMapPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: string) => (translations as any)[locale][key] || key;
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

    const renderWing = (wingId: number, start: number, end: number) => {
        const theme = getWingTheme(wingId);
        const shelves = ShelfS_DB.filter(c => c.id >= start && c.id <= end);
        const wingTitle = (translations as any)[locale][`wing${wingId}`];

        return (
            <div 
                onMouseEnter={() => setCurrentWingTheme(wingId)}
                className="mb-16 md:mb-32 relative group px-2"
            >
                {/* عنوان الجناح التفاعلي */}
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                    <div className="h-2 w-16 md:w-32 rounded-full transition-all duration-700 group-hover:w-48" style={{ background: theme.color }}></div>
                    <h2 className="text-3xl md:text-8xl font-black text-slate-950 dark:text-white opacity-60 group-hover:opacity-100 transition-all duration-700 tracking-tighter uppercase">
                        {wingTitle}
                    </h2>
                </div>

                {/* شبكة الرفوف */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-6 p-4 md:p-10 glass-panel rounded-[2rem] md:rounded-[3rem] border-white/10 bg-white/5 shadow-inner backdrop-blur-3xl">
                    {shelves.map(s => {
                        const isMatch = searchQuery && (s.ar.includes(searchQuery) || s.en.toLowerCase().includes(searchQuery.toLowerCase()));
                        const isActive = activeShelfId === s.id;

                        return (
                            <button
                                key={s.id}
                                onMouseEnter={() => setActiveShelfId(s.id)}
                                onMouseLeave={() => setActiveShelfId(null)}
                                onClick={() => setActiveShelfId(isActive ? null : s.id)}
                                className={`
                                    relative aspect-[1/1.2] rounded-xl md:rounded-3xl text-sm md:text-4xl font-black transition-all duration-300
                                    flex items-center justify-center border-2 overflow-hidden
                                    ${isActive || isMatch 
                                        ? 'scale-110 z-30 shadow-2xl border-white bg-white text-black' 
                                        : 'bg-white/5 dark:bg-black/20 border-white/10 text-slate-500 dark:text-white/30 hover:border-white/40 hover:text-white hover:bg-white/10'}
                                `}
                                style={isActive || isMatch ? { boxShadow: `0 0 40px ${theme.color}` } : {}}
                            >
                                <span className="relative z-10">{s.id}</span>
                                {(isActive || isMatch) && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/40 animate-pulse"></div>
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
            className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-black relative overflow-x-hidden antialiased transition-colors duration-1000 pb-40"
        >
            {/* 1. نظام الإضاءة المحيطية (Dynamic Background) */}
            <div 
                className="fixed inset-0 pointer-events-none transition-all duration-1000 z-0 opacity-30 dark:opacity-40"
                style={{ 
                    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${getWingTheme(currentWingTheme).glow} 0%, transparent 60%)` 
                }}
            ></div>

            <div className="relative z-10 max-w-[1800px] mx-auto px-4 pt-10 md:pt-20">
                
                {/* 2. الهيرو مع تأثير البارالاكس */}
                <header className="mb-20 md:mb-40 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="space-y-6 text-center lg:text-start flex-1">
                        <h1 className="text-6xl md:text-[13rem] leading-[0.8] tracking-tighter uppercase text-slate-950 dark:text-white drop-shadow-sm">
                            Library<br/>
                            <span style={{ color: getWingTheme(currentWingTheme).color }} className="transition-colors duration-700">Map</span>
                        </h1>
                        <p className="text-lg md:text-5xl opacity-60 font-bold max-w-3xl leading-tight">
                            {t('subTitle')}
                        </p>
                    </div>
                    
                    <div className="flex-1 relative w-full max-w-md lg:max-w-[700px]">
                         <img src="/library-hero.png" alt="Logo" className="w-full h-auto object-contain animate-float hover:scale-105 transition-transform duration-700" />
                    </div>
                </header>

                {/* 3. الرادار (شريط البحث المتطور) */}
                <div className="sticky top-6 md:top-10 z-[100] mb-20 md:mb-40 px-2">
                    <div className="max-w-4xl mx-auto glass-panel p-3 md:p-6 rounded-full border border-white/20 bg-white/80 dark:bg-black/40 backdrop-blur-3xl shadow-2xl flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-4xl shadow-lg text-white" style={{ background: getWingTheme(currentWingTheme).color }}>
                            🔍
                        </div>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className="bg-transparent border-none outline-none flex-1 text-xl md:text-4xl font-black placeholder:opacity-30 text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* 4. الخريطة (الأجنحة) */}
                <div className="relative" onClick={() => setActiveShelfId(null)}>
                    {renderWing(1, 1, 21)}
                    {renderWing(2, 22, 30)}
                    {renderWing(3, 31, 39)}
                    {renderWing(4, 40, 41)}
                    {renderWing(5, 42, 58)}
                </div>

                {/* 5. الـ HUD الذكي (بطاقة المعلومات التي تتبع الماوس) */}
                {activeShelfId && activeData && (
                    <div 
                        className="fixed pointer-events-none z-[1000] animate-in fade-in zoom-in duration-200"
                        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -130%)' }}
                    >
                        <div className="glass-panel px-6 py-4 md:px-12 md:py-8 rounded-[2rem] md:rounded-[3rem] border border-white/40 bg-white/90 dark:bg-black/80 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.4)] text-center min-w-[250px] md:min-w-[400px]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-white shadow-xl font-bold text-lg" style={{ background: getWingTheme(activeData.wing).color }}>
                                {activeData.id}
                            </div>
                            <p className="text-[10px] md:text-lg uppercase tracking-widest mb-1 mt-2 opacity-60 font-bold" style={{ color: getWingTheme(activeData.wing).color }}>
                                {isAr ? getWingTheme(activeData.wing).nameAr : getWingTheme(activeData.wing).nameEn}
                            </p>
                            <h3 className="text-xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                                {isAr ? activeData.ar : activeData.en}
                            </h3>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .glass-panel {
                    backdrop-filter: blur(40px) saturate(150%);
                    /* background handles by tailwind classes */
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }

                /* تخصيص السكرول بار */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
                
                * { font-style: normal !important; -webkit-font-smoothing: antialiased; }
            `}</style>
        </div>
    );
};

export default LibraryMapPage;
