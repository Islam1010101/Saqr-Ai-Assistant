import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "خريطة رادار المعرفة",
        subTitle: "حدد موقع كتابك بدقة عبر أجنحة مكتبة صقر الإمارات (58 دولاباً)",
        contentTitle: "محتويات القسم",
        selectPrompt: "اختر رقم الدولاب من الأجنحة بالأسفل",
        wing1: "الجناح الأول: البالغين والباحثين",
        wing2: "الجناح الثاني: قسم الشباب",
        wing3: "الجناح الثالث: اللغة العربية",
        wing4: "الجناح الرابع: القسم الخاص",
        wing5: "الجناح الخامس: قسم الأطفال"
    },
    en: {
        pageTitle: "Knowledge Radar Map",
        subTitle: "Locate your book across EFIPS Library Wings (58 Cabinets)",
        contentTitle: "Section Content",
        selectPrompt: "Select a cabinet number from the wings below",
        wing1: "1st Wing: Adults & Researchers",
        wing2: "2nd Wing: Youth Section",
        wing3: "3rd Wing: Arabic Language",
        wing4: "4th Wing: Special Section",
        wing5: "5th Wing: Children's Section"
    }
};

// --- قاعدة بيانات الدواليب المفصلة (58 دولاباً) ---
const CABINETS_DB = [
    // الجناح 1 (1-21)
    { id: 1, wing: 1, ar: "معارف عامة", en: "General Knowledge" },
    { id: 2, wing: 1, ar: "معارف عامة / فلسفة وعلم نفس", en: "Gen. Knowledge / Philosophy & Psych" },
    { id: 3, wing: 1, ar: "فلسفة وعلم نفس / علوم اجتماعية", en: "Philosophy & Psych / Social Sciences" },
    { id: 4, wing: 1, ar: "علوم اجتماعية", en: "Social Sciences" },
    { id: 5, wing: 1, ar: "علوم اجتماعية", en: "Social Sciences" },
    { id: 6, wing: 1, ar: "معاجم وقواميس لغات / علوم بحته", en: "Dictionaries / Pure Sciences" },
    { id: 7, wing: 1, ar: "علوم بحته / علوم تطبيقية", en: "Pure Sciences / Applied Sciences" },
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
    { id: 26, wing: 2, ar: "لغات مختلفة، ألغاز وحيل يدوية، موسيقى، ومجلات", en: "Languages, Puzzles, Music & Magazines" },
    { id: 27, wing: 2, ar: "قصص وروايات وكتب تعليمية (الحلقة الثانية)", en: "Cycle 2 Stories & Edu Books" },
    { id: 28, wing: 2, ar: "قصص وروايات وكتب تعليمية (الحلقة الثانية)", en: "Cycle 2 Stories & Edu Books" },
    { id: 29, wing: 2, ar: "كتب جلسات القراءة ودوائر المعارف (الحلقة الثانية)", en: "Cycle 2 Reading Sessions & Encyclopedias" },
    { id: 30, wing: 2, ar: "كتب الحلقة الثانية (Grades 7-9)", en: "Cycle 2 Special (Grades 7-9)" },
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
    { id: 40, wing: 4, ar: "كتب الاستماع (QR Code) - ملخصات إنجليزية", en: "Audio Books (QR Code) - English Summaries", special: true },
    { id: 41, wing: 4, ar: "الهوية الوطنية الإماراتية والتراث والنهضة", en: "UAE National Identity, Heritage & Rulers", special: true },
    // الجناح 5 (42-58)
    { id: 42, wing: 5, ar: "كتب خاصة بالصف الثالث", en: "Grade 3 Special Collection" },
    { id: 43, wing: 5, ar: "كتب خاصة بالصف الثالث", en: "Grade 3 Special Collection" },
    { id: 44, wing: 5, ar: "كتب خاصة بالصف الثالث", en: "Grade 3 Special Collection" },
    { id: 45, wing: 5, ar: "كتب خاصة بالصف الثالث", en: "Grade 3 Special Collection" },
    { id: 46, wing: 5, ar: "كتب خاصة بالصف الثالث", en: "Grade 3 Special Collection" },
    { id: 47, wing: 5, ar: "كتب خاصة بالصف الثاني", en: "Grade 2 Special Collection" },
    { id: 48, wing: 5, ar: "كتب خاصة بالصف الثاني", en: "Grade 2 Special Collection" },
    { id: 49, wing: 5, ar: "كتب خاصة بالصف الثاني", en: "Grade 2 Special Collection" },
    { id: 50, wing: 5, ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG Collection" },
    { id: 51, wing: 5, ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG Collection" },
    { id: 52, wing: 5, ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG Collection" },
    { id: 53, wing: 5, ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG Collection" },
    { id: 54, wing: 5, ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG Collection" },
    { id: 55, wing: 5, ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG Collection" },
    { id: 56, wing: 5, ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG Collection" },
    { id: 57, wing: 5, ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG Collection" },
    { id: 58, wing: 5, ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG Collection" },
];

const LibraryMapPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [selected, setSelected] = useState<number | null>(null);

    const activeCabinet = useMemo(() => 
        CABINETS_DB.find(c => c.id === selected) || { ar: "اختر دولاباً لمعاينة التفاصيل", en: "Select a cabinet to view details" }
    , [selected]);

    const getWingColor = (wing: number) => {
        switch(wing) {
            case 1: return "border-red-600 shadow-red-600/20 text-red-600";
            case 2: return "border-blue-500 shadow-blue-500/20 text-blue-500";
            case 3: return "border-green-600 shadow-green-600/20 text-green-600";
            case 4: return "border-yellow-500 shadow-yellow-500/30 text-yellow-600";
            case 5: return "border-purple-500 shadow-purple-500/20 text-purple-600";
            default: return "border-slate-200";
        }
    };

    const renderWingGrid = (wingId: number, title: string, start: number, end: number) => (
        <section className="space-y-6 md:space-y-10 mb-16 md:mb-24 animate-fade-up">
            <h2 className="text-xl md:text-5xl font-black flex items-center gap-4 text-slate-900 dark:text-white uppercase tracking-tighter">
                <span className={`w-3 h-10 md:w-5 md:h-16 rounded-full ${getWingColor(wingId).split(' ')[0].replace('border', 'bg')}`}></span>
                {title}
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-2.5 md:gap-5 p-4 md:p-10 glass-panel rounded-[2.5rem] md:rounded-[4.5rem] bg-white/40 dark:bg-black/20 border-white/10 shadow-inner">
                {CABINETS_DB.filter(c => c.id >= start && c.id <= end).map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setSelected(c.id)}
                        className={`relative h-14 w-14 md:h-24 md:w-24 rounded-xl md:rounded-[2rem] text-lg md:text-3xl font-black transition-all duration-300 border-2 md:border-4 flex items-center justify-center
                            ${selected === c.id 
                                ? 'bg-slate-950 dark:bg-white text-white dark:text-black border-red-600 scale-110 z-10 shadow-[0_0_30px_rgba(220,38,38,0.5)]' 
                                : `bg-white dark:bg-slate-900 ${getWingColor(c.wing)} hover:scale-105`
                            }
                        `}
                    >
                        {c.id}
                        {c.special && <span className="absolute -top-1 -right-1 text-xs md:text-xl animate-pulse">⭐</span>}
                    </button>
                ))}
            </div>
        </section>
    );

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-40 font-black antialiased">
            
            {/* عنوان الصفحة الإمبراطوري */}
            <div className="text-center mb-12 md:mb-28">
                <h1 className="text-4xl md:text-[8rem] font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 leading-none drop-shadow-2xl">
                    {t('pageTitle')}
                </h1>
                <p className="text-lg md:text-4xl text-red-600 dark:text-red-500 font-bold italic max-w-4xl mx-auto leading-relaxed">
                    {t('subTitle')}
                </p>
                <div className="h-1.5 md:h-3 w-32 md:w-64 bg-red-600 mx-auto mt-10 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
            </div>

            {/* شاشة المعلومات العائمة الثابتة (Dynamic HUD) */}
            <div className="sticky top-20 z-[60] mb-16 md:mb-32">
                <div className={`glass-panel p-6 md:p-14 rounded-[2.5rem] md:rounded-[5rem] border-4 transition-all duration-700 backdrop-blur-3xl
                    ${selected ? 'border-red-600 bg-white/95 dark:bg-slate-950/90 shadow-[0_0_80px_rgba(220,38,38,0.2)]' : 'border-slate-200 dark:border-white/5 opacity-80'}
                `}>
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                        <div className={`h-24 w-24 md:h-48 md:w-48 rounded-[2rem] md:rounded-[3.5rem] flex items-center justify-center text-5xl md:text-[6rem] font-black text-white shadow-2xl transition-all
                            ${selected ? 'bg-red-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-800'}
                        `}>
                            {selected || "?"}
                        </div>
                        <div className="text-center md:text-start flex-1 space-y-2 md:space-y-4">
                            <h3 className="text-xs md:text-3xl font-black text-red-600 uppercase tracking-widest">{t('contentTitle')}</h3>
                            <p className="text-xl md:text-6xl text-slate-950 dark:text-white leading-tight tracking-tighter">
                                {selected ? (locale === 'ar' ? activeCabinet.ar : activeCabinet.en) : t('selectPrompt')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* عرض الأجنحة بالتسلسل */}
            {renderWingGrid(1, t('wing1'), 1, 21)}
            {renderWingGrid(2, t('wing2'), 22, 30)}
            {renderWingGrid(3, t('wing3'), 31, 39)}
            
            {/* الجناح الرابع (القسم الخاص - إسلام أحمد) بتصميم ذهبي نباض */}
            <section className="mb-24 animate-fade-up">
                <h2 className="text-2xl md:text-6xl font-black mb-10 flex items-center gap-6 text-yellow-600 dark:text-yellow-400">
                    <span className="w-4 h-12 md:w-8 md:h-24 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)]"></span>
                    {t('wing4')}
                </h2>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 p-10 md:p-24 glass-panel rounded-[3.5rem] md:rounded-[6rem] border-4 border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_100px_rgba(234,179,8,0.1)]">
                    {[40, 41].map(id => (
                        <button key={id} onClick={() => setSelected(id)} 
                            className={`h-28 w-28 md:h-64 md:w-64 rounded-[2.5rem] md:rounded-[5rem] text-4xl md:text-9xl font-black transition-all duration-500 border-4 md:border-8 flex items-center justify-center
                            ${selected === id ? 'bg-yellow-500 text-white border-white scale-110 shadow-[0_0_60px_rgba(234,179,8,0.6)]' : 'bg-white dark:bg-slate-900 border-yellow-500 text-yellow-500 hover:scale-110'}`}>
                            {id}
                        </button>
                    ))}
                </div>
            </section>

            {renderWingGrid(5, t('wing5'), 42, 58)}

            {/* الفوتر */}
            <div className="mt-32 md:mt-56 text-center opacity-30">
                <p className="font-black text-slate-950 dark:text-white text-sm md:text-5xl italic tracking-tighter uppercase">EFIPS Tactical Hub • 2026</p>
                <div className="h-2 w-32 md:w-96 bg-red-600 mx-auto mt-8 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.8)]"></div>
            </div>
        </div>
    );
};

export default LibraryMapPage;
