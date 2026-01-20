import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';

// --- قاعدة البيانات الشاملة (58 دولاباً) ---
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

const translations = {
    ar: {
        pageTitle: "خريطة صقر الرادارية",
        subTitle: "المس رقم الدولاب لمعاينة المحتوى التكتيكي فوراً",
        wing1: "قسم البالغين والباحثين",
        wing2: "قسم الشباب والعلوم",
        wing3: "قسم اللغة العربية",
        wing4: "القسم الخاص (إسلام أحمد)",
        wing5: "قسم الصغار والأطفال"
    },
    en: {
        pageTitle: "Saqr Radar Map",
        subTitle: "Touch a cabinet number to view contents instantly",
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
    const [selected, setSelected] = useState<number | null>(null);

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
        <div className="mb-20 md:mb-32 animate-fade-up relative">
            <div className="flex items-center gap-4 mb-10 ps-2">
                <div className={`w-2 h-10 md:w-5 md:h-20 rounded-full ${getWingTheme(wingId).split(' ')[0].replace('border', 'bg')}`}></div>
                <h2 className="text-2xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">{title}</h2>
            </div>
            
            <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 md:gap-10 p-6 md:p-20 glass-panel rounded-[3rem] md:rounded-[6rem] border-2 ${getWingTheme(wingId).split(' ').slice(0,2).join(' ')} shadow-2xl bg-white/30 dark:bg-black/10`}>
                {CABINETS_DB.filter(c => c.id >= start && c.id <= end).map((c) => (
                    <div key={c.id} className="relative flex items-center justify-center">
                        <button
                            onClick={() => setSelected(selected === c.id ? null : c.id)}
                            className={`relative h-16 w-16 md:h-32 md:w-32 rounded-2xl md:rounded-[3.5rem] text-xl md:text-6xl font-black transition-all duration-500 border-4 flex items-center justify-center z-10
                                ${selected === c.id 
                                    ? 'bg-slate-950 dark:bg-white text-white dark:text-black border-red-600 scale-110 shadow-[0_0_40px_rgba(220,38,38,0.6)]' 
                                    : `bg-white dark:bg-slate-900/80 ${getWingTheme(c.wing)} hover:scale-110`
                                }
                            `}
                        >
                            {c.id}
                        </button>

                        {/* الكرت العائم (Floating Label) - يظهر فقط عند الضغط */}
                        {selected === c.id && (
                            <div className="absolute bottom-full mb-6 z-[100] animate-in slide-in-from-bottom-4 fade-in zoom-in duration-300 pointer-events-none">
                                <div className={`glass-panel p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 ${getWingTheme(c.wing).split(' ')[0]} bg-white/95 dark:bg-slate-950 shadow-[0_30px_100px_rgba(0,0,0,0.4)] min-w-[200px] md:min-w-[450px] text-center backdrop-blur-3xl`}>
                                    <h4 className="text-[10px] md:text-xl font-black text-red-600 uppercase tracking-widest mb-2">Cabinet #{c.id}</h4>
                                    <p className="text-sm md:text-4xl font-black text-slate-950 dark:text-white leading-tight tracking-tight">
                                        {locale === 'ar' ? c.ar : c.en}
                                    </p>
                                    {/* مثلث الكرت العائم */}
                                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 border-r-4 border-b-4 ${getWingTheme(c.wing).split(' ')[0]} bg-inherit`}></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-60 font-black antialiased overflow-x-hidden" onClick={() => setSelected(null)}>
            
            {/* عنوان الصفحة الصافي */}
            <div className="text-center mb-20 md:mb-40" onClick={(e) => e.stopPropagation()}>
                <h1 className="text-5xl md:text-[10rem] font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 leading-none drop-shadow-2xl">{t('pageTitle')}</h1>
                <p className="text-lg md:text-5xl text-red-600 dark:text-red-500 font-bold italic max-w-6xl mx-auto leading-relaxed opacity-90">{t('subTitle')}</p>
                <div className="h-2 w-32 md:w-80 bg-red-600 mx-auto mt-12 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.5)] animate-pulse"></div>
            </div>

            {/* شبكات الأجنحة */}
            <div onClick={(e) => e.stopPropagation()}>
                {renderGrid(t('wing1'), 1, 1, 21)}
                {renderGrid(t('wing2'), 2, 22, 30)}
                {renderGrid(t('wing3'), 3, 31, 39)}
                {renderGrid(t('wing4'), 4, 40, 41)}
                {renderGrid(t('wing5'), 5, 42, 58)}
            </div>

            {/* الفوتر الملكي */}
            <div className="mt-40 text-center opacity-30">
                <p className="font-black text-slate-950 dark:text-white text-sm md:text-6xl italic tracking-tighter uppercase">EFIPS Tactical Radar • 2026</p>
            </div>

            <style>{`
                .glass-panel { backdrop-filter: blur(40px); background: rgba(255, 255, 255, 0.05); }
                button:active { transform: scale(0.9); }
            `}</style>
        </div>
    );
};

export default LibraryMapPage;
