import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "رادار خريطة المكتبة",
        subTitle: "نظام تحديد المواقع الذكي لمقتنيات صقر الإمارات (58 دولاباً)",
        contentTitle: "المحتوى التكتيكي للقسم",
        selectPrompt: "برجاء اختيار رقم الدولاب للمعاينة",
        wing1: "الجناح الأول: البالغين والباحثين",
        wing2: "الجناح الثاني: قسم الشباب والعلوم",
        wing3: "الجناح الثالث: اللغة العربية",
        wing4: "الجناح الرابع: القسم الخاص",
        wing5: "الجناح الخامس: قسم الأطفال"
    },
    en: {
        pageTitle: "Library Radar Map",
        subTitle: "Smart Positioning System for EFIPS Resources (58 Cabinets)",
        contentTitle: "Tactical Section Content",
        selectPrompt: "Please select a cabinet number to inspect",
        wing1: "1st Wing: Adults & Researchers",
        wing2: "2nd Wing: Youth & Sciences",
        wing3: "3rd Wing: Arabic Language",
        wing4: "4th Wing: Special Section",
        wing5: "5th Wing: Children's Section"
    }
};

// --- قاعدة البيانات المحدثة حسب تقسيمتك الدقيقة ---
const CABINETS_DB = [
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

const LibraryMapPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [selected, setSelected] = useState<number | null>(null);

    const activeCabinet = useMemo(() => 
        CABINETS_DB.find(c => c.id === selected) || { ar: t('selectPrompt'), en: t('selectPrompt') }
    , [selected, t]);

    const getWingTheme = (wing: number) => {
        switch(wing) {
            case 1: return "border-red-600 shadow-red-600/20 text-red-600 bg-red-600/5";
            case 2: return "border-blue-500 shadow-blue-500/20 text-blue-500 bg-blue-500/5";
            case 3: return "border-green-600 shadow-green-600/20 text-green-600 bg-green-600/5";
            case 4: return "border-yellow-500 shadow-yellow-500/40 text-yellow-600 bg-yellow-500/10";
            case 5: return "border-purple-500 shadow-purple-500/20 text-purple-600 bg-purple-500/5";
            default: return "border-slate-200 bg-transparent";
        }
    };

    const renderGrid = (title: string, wingId: number, start: number, end: number) => (
        <div className="mb-16 md:mb-32 animate-fade-up">
            <div className="flex items-center gap-4 mb-8 md:mb-12 ps-2">
                <div className={`w-2 h-10 md:w-4 md:h-20 rounded-full ${getWingTheme(wingId).split(' ')[0].replace('border', 'bg')}`}></div>
                <h2 className="text-xl md:text-6xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{title}</h2>
            </div>
            <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-8 p-6 md:p-16 glass-panel rounded-[2.5rem] md:rounded-[5rem] border-2 ${getWingTheme(wingId).split(' ').slice(0,2).join(' ')} shadow-2xl`}>
                {CABINETS_DB.filter(c => c.id >= start && c.id <= end).map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setSelected(c.id)}
                        className={`relative h-16 w-16 md:h-28 md:w-28 rounded-2xl md:rounded-[3.5rem] text-xl md:text-5xl font-black transition-all duration-500 border-4 flex items-center justify-center
                            ${selected === c.id 
                                ? 'bg-slate-950 dark:bg-white text-white dark:text-black border-red-600 scale-125 z-20 shadow-[0_0_50px_rgba(220,38,38,0.5)]' 
                                : `bg-white dark:bg-slate-900/80 ${getWingTheme(c.wing)} hover:scale-110`
                            }
                        `}
                    >
                        {c.id}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-40 font-black antialiased overflow-x-hidden">
            
            {/* عنوان الصفحة */}
            <div className="text-center mb-16 md:mb-32">
                <h1 className="text-4xl md:text-[9rem] font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 leading-none drop-shadow-2xl">{t('pageTitle')}</h1>
                <p className="text-lg md:text-4xl text-red-600 dark:text-red-500 font-bold italic max-w-5xl mx-auto leading-relaxed">{t('subTitle')}</p>
                <div className="h-1.5 md:h-3 w-32 md:w-64 bg-red-600 mx-auto mt-12 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse"></div>
            </div>

            {/* شاشة المعلومات المثبتة (HUD) */}
            <div className="sticky top-24 z-[100] mb-20 md:mb-40 px-2 md:px-0">
                <div className={`glass-panel p-6 md:p-16 rounded-[2.5rem] md:rounded-[6.5rem] border-4 transition-all duration-700 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.3)]
                    ${selected ? 'border-red-600 bg-white/95 dark:bg-slate-950/90' : 'border-slate-200 dark:border-white/5 opacity-90'}
                `}>
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className={`h-24 w-24 md:h-56 md:w-56 rounded-[2.5rem] md:rounded-[5rem] flex items-center justify-center text-5xl md:text-[9rem] font-black text-white shadow-2xl transition-all
                            ${selected ? 'bg-red-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-800'}
                        `}>
                            {selected || "?"}
                        </div>
                        <div className="text-center md:text-start flex-1 space-y-3 md:space-y-6">
                            <h3 className="text-xs md:text-3xl font-black text-red-600 uppercase tracking-[0.3em]">{t('contentTitle')}</h3>
                            <p className="text-2xl md:text-7xl text-slate-950 dark:text-white leading-[1.1] tracking-tighter">
                                {selected ? (locale === 'ar' ? activeCabinet.ar : activeCabinet.en) : t('selectPrompt')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* الأجنحة الخمسة المنسقة */}
            {renderGrid(t('wing1'), 1, 1, 21)}
            {renderGrid(t('wing2'), 2, 22, 30)}
            {renderGrid(t('wing3'), 3, 31, 39)}
            {renderGrid(t('wing4'), 4, 40, 41)}
            {renderGrid(t('wing5'), 5, 42, 58)}

            {/* الفوتر */}
            <div className="mt-40 text-center opacity-30">
                <p className="font-black text-slate-950 dark:text-white text-sm md:text-5xl italic tracking-tighter uppercase">EFIPS Tactical Mapping System • 2026</p>
                <div className="h-2 w-48 md:w-[40rem] bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-10 rounded-full"></div>
            </div>
        </div>
    );
};

export default LibraryMapPage;
