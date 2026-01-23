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

// --- قاعدة البيانات ---
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
        subTitle: "اكتشف عوالم المعرفة.. المس أي رقم للتفاصيل",
        searchPlaceholder: "ابحث عن قسم (تاريخ، علوم)..."
    },
    en: {
        pageTitle: "Library Map",
        subTitle: "Discover worlds of knowledge.. Touch any number",
        searchPlaceholder: "Search for a section (History, Science)..."
    }
};

const LibraryMapPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: string) => (translations as any)[locale][key] || key;
    const [activeShelf, setActiveShelf] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [effects, setEffects] = useState<VisualEffect[]>([]);

    const handleVisualInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const icons = ["✨", "📖", "💡", "🧠", "📚", "🔍", "🌟"];
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const newEffect: VisualEffect = {
            id: Date.now() + Math.random(),
            x, y,
            icon: icons[Math.floor(Math.random() * icons.length)],
            scale: 0.6 + Math.random() * 1.0
        };

        setEffects(prev => [...prev, newEffect].slice(-10));
        setTimeout(() => setEffects(prev => prev.filter(ef => ef.id !== newEffect.id)), 800);
    }, []);

    const getWingTheme = (wing: number) => {
        switch(wing) {
            case 1: return { bg: "bg-red-600", border: "border-red-600", color: "text-red-600", grad: "from-red-600/20" };
            case 2: return { bg: "bg-blue-500", border: "border-blue-500", color: "text-blue-500", grad: "from-blue-500/20" };
            case 3: return { bg: "bg-green-600", border: "border-green-600", color: "text-green-600", grad: "from-green-600/20" };
            case 4: return { bg: "bg-yellow-500", border: "border-yellow-500", color: "text-yellow-500", grad: "from-yellow-500/20" };
            case 5: return { bg: "bg-purple-500", border: "border-purple-500", color: "text-purple-500", grad: "from-purple-500/20" };
            default: return { bg: "bg-slate-500", border: "border-slate-500", color: "text-slate-500", grad: "from-slate-500/20" };
        }
    };

    const renderGrid = (wingId: number, start: number, end: number) => {
        const theme = getWingTheme(wingId);
        const wingTitle = (translations as any)[locale][`wing${wingId}`] || `Wing ${wingId}`;
        
        return (
            <div className="mb-16 md:mb-32 animate-fade-up px-2 md:px-0">
                <div className={`inline-flex items-center gap-4 md:gap-6 mb-6 md:mb-12 p-3 md:p-8 rounded-2xl md:rounded-[3rem] glass-panel border-none bg-gradient-to-r ${theme.grad} to-transparent`}>
                    <div className={`w-2 md:w-5 h-8 md:h-20 rounded-full ${theme.bg} shadow-lg animate-bounce`}></div>
                    <h2 className="text-xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">{wingTitle}</h2>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-10 p-3 md:p-20 glass-panel rounded-[2rem] md:rounded-[6rem] border border-white/30 bg-white/10 dark:bg-white/5 backdrop-blur-3xl shadow-2xl">
                    {ShelfS_DB.filter(c => c.id >= start && c.id <= end).map((c) => {
                        const isMatch = searchQuery && (c.ar.includes(searchQuery) || c.en.toLowerCase().includes(searchQuery.toLowerCase()));
                        return (
                            <div key={c.id} className="relative group/shelf flex items-center justify-center">
                                <button
                                    onClick={() => setActiveShelf(activeShelf === c.id ? null : c.id)}
                                    className={`relative w-full aspect-[1/1.3] rounded-lg md:rounded-[3rem] text-lg md:text-[5.5rem] font-black transition-all duration-500 flex items-center justify-center z-10 overflow-hidden shadow-sm
                                        ${activeShelf === c.id || isMatch
                                            ? `bg-slate-950 dark:bg-white text-white dark:text-black scale-110 md:scale-125 z-50 ring-2 md:ring-[15px] ring-red-600/30 shadow-2xl` 
                                            : `bg-white/80 dark:bg-slate-900/80 border md:border-2 ${theme.border} ${theme.color} hover:scale-110 ${searchQuery ? 'opacity-20' : ''}`
                                        }
                                    `}
                                >
                                    {c.id}
                                </button>

                                {activeShelf === c.id && (
                                    <div className={`fixed inset-x-4 bottom-24 md:absolute md:bottom-[130%] md:inset-x-auto z-[200] animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300 w-auto md:w-max max-w-[90vw] md:max-w-[500px] pointer-events-none`}>
                                        <div className={`px-5 py-4 md:px-12 md:py-8 rounded-2xl md:rounded-[4rem] border-2 md:border-8 ${theme.border} bg-white dark:bg-[#020617] shadow-2xl text-center relative`}>
                                            <p className="text-[8px] md:text-xl font-black text-red-600 uppercase mb-1 tracking-widest opacity-60">Shelf No. {c.id}</p>
                                            <p className="text-sm md:text-4xl font-black text-slate-950 dark:text-white leading-tight">
                                                {locale === 'ar' ? c.ar : c.en}
                                            </p>
                                            {/* السهم يختفي في الموبايل لعدم تداخل الطبقات */}
                                            <div className="hidden md:block absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rotate-45 border-r-8 border-b-8 bg-inherit border-inherit"></div>
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
        <div dir={dir} className="max-w-[1700px] mx-auto px-4 py-6 md:py-24 animate-fade-up relative z-10 pb-96 font-black antialiased overflow-x-hidden" onClick={() => setActiveShelf(null)}>
            
            {/* الخلفية المبهجة */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[5%] left-[5%] w-32 md:w-64 h-32 md:h-64 bg-red-600/5 blur-[80px] md:blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[5%] w-48 md:w-96 h-48 md:h-96 bg-blue-600/5 blur-[100px] md:blur-[150px] rounded-full animate-pulse delay-700"></div>
            </div>

            {/* 1. الواجهة (Hero) - متجاوبة */}
            <div className="relative mb-16 md:mb-48" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col-reverse lg:flex-row items-center gap-10 md:gap-40">
                    <div className="flex-1 text-center lg:text-start space-y-6 md:space-y-20">
                        <h1 className="text-5xl sm:text-7xl md:text-[13rem] font-black text-slate-950 dark:text-white leading-[0.8] tracking-tighter uppercase drop-shadow-xl">
                            Library<br/>
                            <span className="text-red-600">Map</span>
                        </h1>
                        <p className="text-sm sm:text-lg md:text-7xl text-slate-800 dark:text-slate-200 font-bold max-w-5xl leading-tight opacity-90">
                            {t('subTitle')}
                        </p>
                    </div>

                    <div 
                        className="flex-1 relative w-full max-w-[280px] sm:max-w-sm lg:max-w-[800px] cursor-crosshair group"
                        onMouseMove={handleVisualInteraction}
                        onTouchMove={handleVisualInteraction}
                    >
                        <img src="/library-hero.png" alt="Saqr" className="w-full h-auto object-contain transition-all duration-1000 group-hover:scale-105 group-hover:rotate-2 drop-shadow-2xl" />
                        
                        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
                            {effects.map(eff => (
                                <span key={eff.id} className="absolute text-3xl md:text-8xl animate-intel-float opacity-0" style={{ left: eff.x, top: eff.y, transform: `scale(${eff.scale})` }}>
                                    {eff.icon}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. شريط البحث الملكي - متجاوب */}
            <div className="sticky top-4 md:top-10 z-[150] mb-16 md:mb-48 max-w-4xl mx-auto px-2" onClick={(e) => e.stopPropagation()}>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-green-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative glass-panel bg-white/95 dark:bg-slate-950/95 rounded-full p-4 md:p-10 flex items-center gap-4 md:gap-8 border border-white/30 shadow-2xl">
                        <span className="text-2xl md:text-7xl">🔍</span>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className="flex-1 bg-transparent border-none outline-none text-lg sm:text-xl md:text-6xl font-black text-slate-950 dark:text-white placeholder:opacity-30"
                        />
                    </div>
                </div>
            </div>

            {/* 3. شبكات الأجنحة */}
            <div onClick={(e) => e.stopPropagation()}>
                {renderGrid(1, 1, 21)}
                {renderGrid(2, 22, 30)}
                {renderGrid(3, 31, 39)}
                {renderGrid(4, 40, 41)}
                {renderGrid(5, 42, 58)}
            </div>

            <style>{`
                @keyframes intel-float {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(-120px) scale(1.5); opacity: 0; }
                }
                .animate-intel-float { animation: intel-float 1s ease-out forwards; }
                
                .glass-panel { 
                    backdrop-filter: blur(40px) saturate(150%); 
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                }
                
                * { font-style: normal !important; }

                /* تحسينات اللمس للجوال */
                @media (max-width: 768px) {
                    .glass-panel { backdrop-filter: blur(20px); }
                }
            `}</style>
        </div>
    );
};

export default LibraryMapPage;
