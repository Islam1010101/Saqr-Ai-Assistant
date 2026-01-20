import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';

// --- قاعدة البيانات الشاملة (58 دولاباً) ---
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
        pageTitle: "خريطة مكتبة صقر",
        subTitle: "المس رقم الدولاب لمعاينة المحتوى التكتيكي فوراً",
        wing1: "جناح الباحثين (Adults)",
        wing2: "جناح الشباب (Youth)",
        wing3: "جناح اللغة العربية",
        wing4: "الجناح الخاص الملكي",
        wing5: "جناح الصغار (Children)"
    },
    en: {
        pageTitle: "Saqr Library Map",
        subTitle: "Touch a cabinet number to view contents instantly",
        wing1: "Adults Wing",
        wing2: "Youth Wing",
        wing3: "Arabic Wing",
        wing4: "Royal Special Wing",
        wing5: "Children's Wing"
    }
};

const LibraryMapPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [selected, setSelected] = useState<number | null>(null);

    const getWingTheme = (wing: number) => {
        switch(wing) {
            case 1: return { color: "text-red-600", border: "border-red-600", handle: "bg-red-600", glow: "shadow-[0_0_30px_rgba(220,38,38,0.3)]" };
            case 2: return { color: "text-blue-500", border: "border-blue-500", handle: "bg-blue-500", glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]" };
            case 3: return { color: "text-green-600", border: "border-green-600", handle: "bg-green-600", glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]" };
            case 4: return { color: "text-yellow-500", border: "border-yellow-500", handle: "bg-yellow-500", glow: "shadow-[0_0_40px_rgba(234,179,8,0.4)]" };
            case 5: return { color: "text-purple-500", border: "border-purple-500", handle: "bg-purple-500", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]" };
            default: return { color: "text-slate-400", border: "border-slate-300", handle: "bg-slate-300", glow: "" };
        }
    };

    const renderGrid = (title: string, wingId: number, start: number, end: number) => {
        const theme = getWingTheme(wingId);
        return (
            <div className="mb-24 md:mb-48 animate-fade-up relative">
                <div className="flex items-center gap-4 mb-12 ps-4">
                    <div className={`w-3 h-12 md:w-6 md:h-24 rounded-full ${theme.handle} shadow-lg`}></div>
                    <h2 className="text-3xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">{title}</h2>
                </div>
                
                <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-5 md:gap-14 p-8 md:p-24 glass-panel rounded-[3.5rem] md:rounded-[6rem] border-2 border-white/20 shadow-2xl bg-white/20 dark:bg-black/20 backdrop-blur-md`}>
                    {ShelfS_DB.filter(c => c.id >= start && c.id <= end).map((c) => (
                        <div key={c.id} className="relative flex items-center justify-center">
                            {/* الدولاب الواقعي (Cabinet Design) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelected(selected === c.id ? null : c.id); }}
                                className={`relative w-full aspect-[2/3] rounded-xl md:rounded-[2.5rem] text-xl md:text-6xl font-black transition-all duration-500 border-x-4 flex items-center justify-center z-10 overflow-hidden shadow-xl
                                    ${selected === c.id 
                                        ? 'bg-slate-950 dark:bg-white text-white dark:text-black border-red-600 scale-125 z-50 ring-8 ring-red-600/30' 
                                        : `bg-white dark:bg-slate-900/90 ${theme.border} ${theme.color} hover:scale-110`
                                    }
                                `}
                            >
                                {/* مقبض الدولاب الجانبي */}
                                <div className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-2 md:left-3' : 'right-2 md:right-3'} w-1 h-10 md:w-2 md:h-20 rounded-full opacity-40 ${theme.handle}`}></div>
                                {c.id}
                            </button>

                            {/* البطاقة العائمة (Solid Opaque HUD) */}
                            {selected === c.id && (
                                <div className="absolute bottom-full mb-10 z-[200] animate-in slide-in-from-bottom-8 fade-in zoom-in duration-300 pointer-events-none w-[280px] md:w-[650px]">
                                    <div className={`p-8 md:p-16 rounded-[2.5rem] md:rounded-[4.5rem] border-4 ${theme.border} bg-white dark:bg-slate-950 shadow-[0_60px_150px_rgba(0,0,0,0.7)] text-center relative overflow-hidden`}>
                                        {/* خلفية معتمة تمنع رؤية ما خلفها */}
                                        <div className="absolute inset-0 opacity-5 -z-10 bg-slate-500"></div>
                                        
                                        <div className={`inline-block px-8 py-2 md:px-12 md:py-4 rounded-full ${theme.handle} text-white text-xs md:text-3xl font-black mb-8 uppercase tracking-widest shadow-xl`}>
                                            Shelf #{c.id}
                                        </div>
                                        <p className="text-2xl md:text-7xl font-black text-slate-950 dark:text-white leading-tight tracking-tight drop-shadow-sm">
                                            {locale === 'ar' ? c.ar : c.en}
                                        </p>
                                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rotate-45 border-r-4 border-b-4 ${theme.border} bg-inherit`}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div dir={dir} className="max-w-8xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-96 font-black antialiased overflow-x-hidden" onClick={() => setSelected(null)}>
            
            {/* --- الهيرو سيكشن الملكي (Hero Section) --- */}
            <div className="relative mb-24 md:mb-56 animate-fade-up" onClick={(e) => e.stopPropagation()}>
                <div className="glass-panel p-6 md:p-20 rounded-[3rem] md:rounded-[6rem] shadow-3xl border-none bg-white/70 dark:bg-slate-950/70 backdrop-blur-3xl flex flex-col-reverse lg:flex-row items-center gap-12 md:gap-24 overflow-hidden group">
                    {/* خلفية ضوئية دافئة */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-red-600/5 opacity-50 -z-10"></div>
                    
                    <div className="flex-1 text-center lg:text-start space-y-8 md:space-y-16 relative z-10">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black text-slate-950 dark:text-white leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">
                                FALCON<br/>
                                <span className="text-red-600">RADAR</span>
                            </h1>
                        </div>
                        <p className="text-xl md:text-6xl text-slate-700 dark:text-slate-300 font-bold italic max-w-4xl mx-auto lg:mx-0 leading-tight opacity-90">
                            {t('subTitle')}
                        </p>
                        <div className="h-3 w-48 md:w-[30rem] bg-red-600 mx-auto lg:mx-0 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-pulse"></div>
                    </div>

                    <div className="flex-1 relative w-full max-w-md lg:max-w-none">
                        <div className="relative z-10 rounded-[2.5rem] md:rounded-[5rem] overflow-hidden shadow-3xl border-4 border-white/50 dark:border-white/10 transform hover:scale-[1.02] transition-transform duration-700">
                            {/* الصورة المرفوعة من قبلك */}
                            <img src="/library-hero.png" alt="Library Scene" className="w-full h-auto object-cover" />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-full h-full bg-orange-500/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* شبكات الأجنحة المصممة كدواليب */}
            <div onClick={(e) => e.stopPropagation()}>
                {renderGrid(t('wing1'), 1, 1, 21)}
                {renderGrid(t('wing2'), 2, 22, 30)}
                {renderGrid(t('wing3'), 3, 31, 39)}
                {renderGrid(t('wing4'), 4, 40, 41)}
                {renderGrid(t('wing5'), 5, 42, 58)}
            </div>

            <div className="mt-40 text-center opacity-30">
                <p className="font-black text-slate-950 dark:text-white text-sm md:text-7xl italic tracking-tighter uppercase">EFIPS Tactical Mapping • 2026</p>
            </div>
        </div>
    );
};

export default LibraryMapPage;
