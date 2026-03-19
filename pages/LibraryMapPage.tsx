import React, { useState, useMemo } from 'react';
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
            { color: "#ef4444", glow: "rgba(239, 68, 68, 0.25)", nameAr: "جناح الباحثين", nameEn: "Researchers Wing" },
            { color: "#3b82f6", glow: "rgba(59, 130, 246, 0.25)", nameAr: "جناح الشباب", nameEn: "Youth Wing" },
            { color: "#10b981", glow: "rgba(16, 185, 129, 0.25)", nameAr: "جناح العربية", nameEn: "Arabic Wing" },
            { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.25)", nameAr: "الجناح الخاص", nameEn: "Special Wing" },
            { color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.25)", nameAr: "جناح الصغار", nameEn: "Kids Wing" }
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
                className="mb-12 md:mb-24 relative group px-2"
            >
                {/* عنوان الجناح التفاعلي */}
                <div className="flex items-center gap-4 mb-6 md:mb-10">
                    <div className="h-1.5 md:h-2 w-12 md:w-20 rounded-full transition-all duration-700 group-hover:w-32 shadow-sm" style={{ background: theme.color }}></div>
                    <h2 className={`text-2xl md:text-5xl font-black text-slate-900 dark:text-white opacity-80 group-hover:opacity-100 transition-all duration-500 ${!isAr ? 'uppercase tracking-tight' : ''}`}>
                        {wingTitle}
                    </h2>
                </div>

                {/* شبكة الرفوف */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-5 p-6 md:p-10 bg-white/60 dark:bg-slate-800/60 rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-xl transition-all duration-500 hover:shadow-lg">
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
                                    relative aspect-square rounded-xl md:rounded-2xl text-sm md:text-2xl font-black transition-all duration-300
                                    flex items-center justify-center overflow-hidden border
                                    ${isActive || isMatch 
                                        ? 'scale-110 z-30 text-white shadow-xl' 
                                        : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500 hover:-translate-y-1 hover:shadow-md'}
                                `}
                                style={isActive || isMatch ? { background: theme.color, borderColor: theme.color, boxShadow: `0 10px 25px ${theme.glow}` } : {}}
                            >
                                <span className="relative z-10">{s.id}</span>
                                {(isActive || isMatch) && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/30 animate-pulse"></div>
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
            className="w-full min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 pb-40"
        >
            {/* 1. الخلفية الثابتة والهوية الوطنية */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/30 rounded-full blur-[120px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-green-600/30 rounded-full blur-[100px]"></div>
            </div>

            {/* 2. نظام الإضاءة المحيطية التفاعلي (الماوس) */}
            <div 
                className="fixed inset-0 pointer-events-none transition-all duration-300 z-0 opacity-40 dark:opacity-60 mix-blend-screen dark:mix-blend-lighten"
                style={{ 
                    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${getWingTheme(currentWingTheme).glow} 0%, transparent 40%)` 
                }}
            ></div>

            <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 pt-10 md:pt-20">
                
                {/* الهيرو */}
                <header className="mb-16 md:mb-24 flex flex-col lg:flex-row items-center justify-between gap-10 animate-fade-in-up">
                    <div className="space-y-4 md:space-y-6 text-center lg:text-start flex-1">
                        <h1 className={`text-5xl md:text-7xl lg:text-[8rem] font-black leading-[1.1] text-slate-950 dark:text-white ${!isAr ? 'tracking-tight uppercase' : ''}`}>
                            {isAr ? 'خريطة ' : 'Library'}<br className="hidden md:block" />
                            <span style={{ color: getWingTheme(currentWingTheme).color }} className="transition-colors duration-700">{isAr ? 'المكتبة' : 'Map'}</span>
                        </h1>
                        <p className="text-base md:text-2xl text-slate-600 dark:text-slate-400 font-bold max-w-2xl leading-relaxed mx-auto lg:mx-0">
                            {t('subTitle')}
                        </p>
                    </div>
                    
                    <div className="flex-1 w-full max-w-sm lg:max-w-xl">
                         <img src="/library-hero.png" alt="Library Map Illustration" className="w-full h-auto object-contain animate-float drop-shadow-xl" />
                    </div>
                </header>

                {/* شريط البحث (الرادار) */}
                <div className="sticky top-4 md:top-6 z-[90] mb-12 md:mb-20 px-2 animate-fade-in-up">
                    <div className="max-w-3xl mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-3 md:p-4 rounded-full border border-slate-200 dark:border-slate-700 shadow-lg flex items-center gap-4 transition-all focus-within:border-red-500 dark:focus-within:border-red-500">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl shadow-inner text-white shrink-0 transition-colors duration-500" style={{ background: getWingTheme(currentWingTheme).color }}>
                            🔍
                        </div>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className="bg-transparent border-none outline-none flex-1 text-base md:text-2xl font-bold placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white pe-4"
                        />
                    </div>
                </div>

                {/* الخريطة (الأجنحة) */}
                <div className="relative animate-fade-in-up" onClick={() => setActiveShelfId(null)}>
                    {renderWing(1, 1, 21)}
                    {renderWing(2, 22, 30)}
                    {renderWing(3, 31, 39)}
                    {renderWing(4, 40, 41)}
                    {renderWing(5, 42, 58)}
                </div>

                {/* الـ HUD الذكي (بطاقة المعلومات التي تتبع الماوس) */}
                {activeShelfId && activeData && (
                    <div 
                        className="fixed pointer-events-none z-[1000] animate-zoom-in"
                        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -120%)' }}
                    >
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-6 py-5 md:px-10 md:py-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl text-center min-w-[200px] md:min-w-[350px]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-lg font-bold text-base md:text-xl transition-colors duration-300" style={{ background: getWingTheme(activeData.wing).color }}>
                                {activeData.id}
                            </div>
                            <p className={`text-xs md:text-sm font-bold mb-2 mt-3 ${!isAr ? 'uppercase tracking-widest' : ''}`} style={{ color: getWingTheme(activeData.wing).color }}>
                                {isAr ? getWingTheme(activeData.wing).nameAr : getWingTheme(activeData.wing).nameEn}
                            </p>
                            <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                {isAr ? activeData.ar : activeData.en}
                            </h3>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }

                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
                
                @keyframes zoom-in { 0% { opacity: 0; transform: translate(-50%, -100%) scale(0.8); } 100% { opacity: 1; transform: translate(-50%, -120%) scale(1); } }
                .animate-zoom-in { animation: zoom-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

                /* تخصيص السكرول بار */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark ::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>
        </div>
    );
};

export default LibraryMapPage;
