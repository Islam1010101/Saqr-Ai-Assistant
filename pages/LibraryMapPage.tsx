import React, { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../App';

// --- واجهة المؤثرات المتطورة ---
interface VisualEffect {
    id: number;
    x: number;
    y: number;
    icon: string;
    scale: number;
}

// --- قاعدة البيانات (كما هي بدون تغيير) ---
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
        subTitle: "ابحث عن أي قسم أو اضغط على الرقم",
        searchPlaceholder: "ابحث عن قسم (مثلاً: تاريخ، ديزني)...",
        wing1: "جناح الباحثين والبالغين",
        wing2: "جناح الشباب والعلوم",
        wing3: "جناح اللغة العربية",
        wing4: "الجناح الخاص",
        wing5: "جناح الصغار والأطفال"
    },
    en: {
        pageTitle: "Library Map",
        subTitle: "Search for a section or touch a number",
        searchPlaceholder: "Search for a section (e.g., History, Disney)...",
        wing1: "Adults & Researchers",
        wing2: "Youth & Sciences",
        wing3: "Arabic Language",
        wing4: "Special Wing",
        wing5: "Children's Wing"
    }
};

const LibraryMapPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [activeShelf, setActiveShelf] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [effects, setEffects] = useState<VisualEffect[]>([]);

    // مؤثرات بصرية تتبع الماوس/اللمس أمام الصورة
    const handleVisualInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const icons = ["✨", "📖", "💡", "🧠", "📚", "🔍"];
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        const newEffect: VisualEffect = {
            id: Date.now() + Math.random(),
            x, y,
            icon: icons[Math.floor(Math.random() * icons.length)],
            scale: 0.5 + Math.random() * 1.5
        };

        setEffects(prev => [...prev, newEffect].slice(-15));
        setTimeout(() => setEffects(prev => prev.filter(ef => ef.id !== newEffect.id)), 800);
    }, []);

    const getWingTheme = (wing: number) => {
        switch(wing) {
            case 1: return { color: "text-red-600", border: "border-red-600", handle: "bg-red-600", glow: "shadow-red-600/40" };
            case 2: return { color: "text-blue-500", border: "border-blue-500", handle: "bg-blue-500", glow: "shadow-blue-500/40" };
            case 3: return { color: "text-green-600", border: "border-green-600", handle: "bg-green-600", glow: "shadow-green-600/40" };
            case 4: return { color: "text-yellow-500", border: "border-yellow-500", handle: "bg-yellow-500", glow: "shadow-yellow-500/60" };
            case 5: return { color: "text-purple-500", border: "border-purple-500", handle: "bg-purple-500", glow: "shadow-purple-500/40" };
            default: return { color: "text-slate-400", border: "border-slate-300", handle: "bg-slate-300", glow: "" };
        }
    };

    const renderGrid = (title: string, wingId: number, start: number, end: number) => {
        const theme = getWingTheme(wingId);
        return (
            <div className="mb-24 animate-fade-up relative">
                <div className="flex items-center gap-4 mb-10 ps-4">
                    <div className={`w-2.5 h-12 md:w-4 md:h-16 rounded-full ${theme.handle} ${theme.glow} shadow-lg animate-pulse`}></div>
                    <h2 className="text-2xl md:text-6xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{title}</h2>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-8 p-4 md:p-16 glass-panel rounded-[2rem] md:rounded-[5rem] border border-white/20 shadow-2xl bg-white/20 dark:bg-black/5 backdrop-blur-3xl">
                    {ShelfS_DB.filter(c => c.id >= start && c.id <= end).map((c) => {
                        const isMatch = searchQuery && (c.ar.includes(searchQuery) || c.en.toLowerCase().includes(searchQuery.toLowerCase()));
                        return (
                            <div key={c.id} className="relative group/shelf flex items-center justify-center">
                                {/* الرف التفاعلي */}
                                <button
                                    onMouseEnter={() => window.innerWidth > 768 && setActiveShelf(c.id)}
                                    onMouseLeave={() => window.innerWidth > 768 && setActiveShelf(null)}
                                    onClick={() => setActiveShelf(activeShelf === c.id ? null : c.id)}
                                    className={`relative w-full aspect-[2/3] rounded-xl md:rounded-[2.5rem] text-xl md:text-[4.5rem] font-black transition-all duration-500 border-x-4 flex items-center justify-center z-10 overflow-hidden
                                        ${activeShelf === c.id || isMatch
                                            ? `bg-slate-950 dark:bg-white text-white dark:text-black ${theme.border} scale-110 z-50 ring-4 md:ring-[12px] ring-white/10 shadow-2xl` 
                                            : `bg-white dark:bg-slate-900/90 ${theme.border} ${theme.color} hover:scale-105 shadow-md ${searchQuery ? 'opacity-20' : ''}`
                                        }
                                    `}
                                >
                                    <div className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-1' : 'right-1'} w-0.5 md:w-2 h-6 md:h-16 rounded-full opacity-30 ${theme.handle}`}></div>
                                    {c.id}
                                </button>

                                {/* الـ Hint الذكي (مربع على قد الكتابة) */}
                                {activeShelf === c.id && (
                                    <div className="absolute bottom-[110%] z-[100] animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200 pointer-events-none w-max max-w-[200px] md:max-w-[400px]">
                                        <div className={`px-4 py-2 md:px-8 md:py-4 rounded-2xl md:rounded-[2.5rem] border-2 md:border-4 ${theme.border} bg-white dark:bg-[#020617] shadow-2xl text-center relative`}>
                                            <p className="text-[10px] md:text-lg font-black text-red-600 uppercase mb-1 opacity-60">S#{c.id}</p>
                                            <p className="text-xs md:text-3xl font-black text-slate-950 dark:text-white leading-tight">
                                                {locale === 'ar' ? c.ar : c.en}
                                            </p>
                                            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-r-2 border-b-2 md:border-r-4 md:border-b-4 ${theme.border} bg-inherit`}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div dir={dir} className="max-w-[1600px] mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 pb-96 font-black antialiased overflow-x-hidden" onClick={() => setActiveShelf(null)}>
            
            {/* 1. قسم الواجهة الملكي (الصورة المفرغة والمؤثرات الأمامية) */}
            <div className="relative mb-20 md:mb-40" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col-reverse lg:flex-row items-center gap-12 md:gap-32">
                    
                    <div className="flex-1 text-center lg:text-start space-y-8 md:space-y-16">
                        <h1 className="text-6xl md:text-[11rem] font-black text-slate-950 dark:text-white leading-[0.8] tracking-tighter uppercase drop-shadow-2xl">
                            FALCON<br/>
                            <span className="text-red-600">RADAR</span>
                        </h1>
                        <p className="text-lg md:text-6xl text-slate-700 dark:text-slate-300 font-bold italic max-w-4xl leading-tight opacity-80">
                            {t('subTitle')}
                        </p>
                    </div>

                    {/* الصورة والمؤثرات بدون إطار */}
                    <div 
                        className="flex-1 relative w-full max-w-sm lg:max-w-[700px] cursor-crosshair group"
                        onMouseMove={handleVisualInteraction}
                        onTouchMove={handleVisualInteraction}
                    >
                        <img 
                            src="/library-hero.png" 
                            alt="Saqr Explorer" 
                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105 pointer-events-none drop-shadow-3xl"
                        />
                        
                        {/* طبقة المؤثرات الأمامية */}
                        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
                            {effects.map(eff => (
                                <span 
                                    key={eff.id} 
                                    className="absolute text-4xl md:text-7xl animate-intel-float opacity-0"
                                    style={{ left: eff.x, top: eff.y, transform: `scale(${eff.scale})` }}
                                >
                                    {eff.icon}
                                </span>
                            ))}
                        </div>
                        
                        {/* توهج خلفي ناعم */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red-600/5 blur-[150px] rounded-full -z-10 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* 2. شريط البحث الفخم */}
            <div className="sticky top-20 z-[100] mb-20 md:mb-40 max-w-4xl mx-auto px-4" onClick={(e) => e.stopPropagation()}>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-green-600 rounded-full blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative glass-panel bg-white/90 dark:bg-slate-950/90 rounded-full p-4 md:p-8 flex items-center gap-6 border border-white/20 shadow-2xl">
                        <span className="text-3xl md:text-6xl animate-bounce">🔍</span>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className="flex-1 bg-transparent border-none outline-none text-xl md:text-5xl font-black text-slate-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-800"
                        />
                    </div>
                </div>
            </div>

            {/* 3. شبكات الأجنحة المصممة بذكاء */}
            <div onClick={(e) => e.stopPropagation()}>
                {renderGrid(t('wing1'), 1, 1, 21)}
                {renderGrid(t('wing2'), 2, 22, 30)}
                {renderGrid(t('wing3'), 3, 31, 39)}
                {renderGrid(t('wing4'), 4, 40, 41)}
                {renderGrid(t('wing5'), 5, 42, 58)}
            </div>

            <div className="mt-40 text-center opacity-20">
                <p className="font-black text-slate-950 dark:text-white text-sm md:text-7xl italic tracking-tighter uppercase">EFIPS Library Hub • 2026</p>
            </div>

            <style>{`
                @keyframes intel-float {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
                }
                .animate-intel-float { animation: intel-float 0.8s ease-out forwards; }
                .glass-panel { backdrop-filter: blur(40px); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default LibraryMapPage;
