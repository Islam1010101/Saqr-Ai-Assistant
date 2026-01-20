import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "خريطة المكتبة",
        subTitle: "نظام تحديد المواقع الذكي لمقتنيات صقر الإمارات",
        contentTitle: "المحتوى التكتيكي للقسم",
        selectPrompt: "برجاء اختيار رقم الدولاب للمعاينة",
        wing1: "جناح البالغين والباحثين",
        wing2: "جناح الشباب والعلوم",
        wing3: "جناح اللغة العربية",
        wing4: "الجناح الخاص (صقر الذكي)",
        wing5: "جناح الأطفال والصغار"
    },
    en: {
        pageTitle: "Library's Map",
        subTitle: "Smart Positioning System for EFIPS Resources",
        contentTitle: "Tactical Section Content",
        selectPrompt: "Please select a cabinet number to inspect",
        wing1: "Adults & Researchers Wing",
        wing2: "Youth & Sciences Wing",
        wing3: "Arabic Language Wing",
        wing4: "Special Wing (Smart Saqr)",
        wing5: "Children's Wing"
    }
};

const CABINETS_DB = [
    // الجناح 1 (1-21)
    ...Array.from({ length: 2 }).map((_, i) => ({ id: i + 1, wing: 1, icon: "🏛️", ar: "معارف عامة وبرمجة", en: "General Knowledge & Programming" })),
    ...Array.from({ length: 2 }).map((_, i) => ({ id: i + 3, wing: 1, icon: "🏛️", ar: "فلسفة وعلم نفس", en: "Philosophy & Psychology" })),
    ...Array.from({ length: 3 }).map((_, i) => ({ id: i + 5, wing: 1, icon: "🏛️", ar: "علوم اجتماعية وسياسة", en: "Social Sciences & Politics" })),
    { id: 8, wing: 1, icon: "🏛️", ar: "معاجم وقواميس لغات", en: "Dictionaries & Languages" },
    ...Array.from({ length: 2 }).map((_, i) => ({ id: i + 9, wing: 1, icon: "🏛️", ar: "علوم بحتة (رياضيات وكيمياء)", en: "Pure Sciences (Math & Chem)" })),
    ...Array.from({ length: 5 }).map((_, i) => ({ id: i + 11, wing: 1, icon: "🏛️", ar: "علوم تطبيقية وهندسة", en: "Applied Sciences & Engineering" })),
    { id: 16, wing: 1, icon: "🎨", ar: "فنون وموسيقى", en: "Arts & Music" },
    ...Array.from({ length: 3 }).map((_, i) => ({ id: i + 17, wing: 1, icon: "📚", ar: "أدب وروايات (Grades 10-12)", en: "Literature & Novels (G10-12)" })),
    ...Array.from({ length: 4 }).map((_, i) => ({ id: i + 20, wing: 1, icon: "📖", ar: "روايات وقصص عالمية للبالغين", en: "Adult Global Novels" })),
    ...Array.from({ length: 2 }).map((_, i) => ({ id: i + 24, wing: 1, icon: "🌍", ar: "جغرافيا وتاريخ وتراجم", en: "Geography, History & Biographies" })),
    
    // الجناح 2 (22-30) - قسم الشباب
    { id: 22, wing: 2, icon: "🏰", ar: "كتب وإنتاجات ديزني", en: "Disney World Productions" },
    { id: 23, wing: 2, icon: "🐬", ar: "عالم الحيوان والبحار", en: "Animal & Marine World" },
    { id: 24, wing: 2, icon: "🔬", ar: "علوم الفيزياء والأرض والأحياء والرياضيات", en: "Physics, Bio, Earth & Math" },
    { id: 25, wing: 2, icon: "🏀", ar: "العلوم الاجتماعية والرياضة", en: "Social Sciences & Sports" },
    { id: 26, wing: 2, icon: "🧩", ar: "لغات، ألغاز، حيل يدوية، ومجلات", en: "Languages, Puzzles & Magazines" },
    { id: 27, wing: 2, icon: "📖", ar: "قصص وروايات تعليمية (الحلقة الثانية)", en: "Cycle 2 Stories & Edu" },
    { id: 28, wing: 2, icon: "📖", ar: "قصص وروايات تعليمية (الحلقة الثانية)", en: "Cycle 2 Stories & Edu" },
    { id: 29, wing: 2, icon: "📚", ar: "جلسات القراءة ودوائر المعارف (الحلقة الثانية)", en: "Cycle 2 Reading & Encyclopedias" },
    { id: 30, wing: 2, icon: "🎓", ar: "كتب الحلقة الثانية (Grades 7-9)", en: "Cycle 2 Special (G7-9)" },

    // الجناح 3 (31-39) - اللغة العربية
    { id: 31, wing: 3, icon: "🕌", ar: "كتب الدين الإسلامي", en: "Islamic Religion Books" },
    { id: 32, wing: 3, icon: "📜", ar: "التراجم والتاريخ والنقد الأدبي", en: "History & Literary Criticism" },
    { id: 33, wing: 3, icon: "✍️", ar: "الأدب العربي والشعر والفنون العربية", en: "Arabic Lit, Poetry & Arts" },
    { id: 34, wing: 3, icon: "🦅", ar: "كتب الحلقة الثالثة (قصص ومجلة عجاج)", en: "Cycle 3 (Stories & Ajaj)" },
    { id: 35, wing: 3, icon: "🦅", ar: "كتب الحلقة الثالثة (قصص ومجلة عجاج)", en: "Cycle 3 (Stories & Ajaj)" },
    { id: 36, wing: 3, icon: "📘", ar: "كتب الحلقة الثانية (قصص وتعلم ذاتي)", en: "Cycle 2 (Stories & Self-Learning)" },
    { id: 37, wing: 3, icon: "📗", ar: "كتب الحلقة الأولى (قصص وإسلاميات)", en: "Cycle 1 (Stories & Islamic)" },
    { id: 38, wing: 3, icon: "💎", ar: "إصدارات دار كلمة / علوم منوعة", en: "Kalima Publisher / Science" },
    { id: 39, wing: 3, icon: "🏛️", ar: "الموسوعة العربية / علم نفس / بلاغة", en: "Arabic Encyclopedia & Grammar" },

    // الجناح 4 (40-41) - القسم الخاص
    { id: 40, wing: 4, icon: "🎧", ar: "كتب الكيو ار (QR) - ملخصات صوتية إنجليزية", en: "Audio QR - English Summaries", special: true },
    { id: 41, wing: 4, icon: "🇦🇪", ar: "الهوية الوطنية الإماراتية والتراث والنهضة", en: "UAE Identity, Heritage & Rulers", special: true },

    // الجناح 5 (42-58) - قسم الأطفال
    ...Array.from({ length: 5 }).map((_, i) => ({ id: i + 42, wing: 5, icon: "🧸", ar: "كتب خاصة بالصف الثالث", en: "Grade 3 Collection" })),
    ...Array.from({ length: 3 }).map((_, i) => ({ id: i + 47, wing: 5, icon: "🌈", ar: "كتب خاصة بالصف الثاني", en: "Grade 2 Collection" })),
    ...Array.from({ length: 9 }).map((_, i) => ({ id: i + 50, wing: 5, icon: "🍭", ar: "كتب الصف الأول والكي جي", en: "Grade 1 & KG" })),
];

const LibraryMapPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [selected, setSelected] = useState<number | null>(null);

    const activeCabinet = useMemo(() => 
        CABINETS_DB.find(c => c.id === selected) || { ar: t('selectPrompt'), en: t('selectPrompt'), icon: "🎯" }
    , [selected, t]);

    const getWingTheme = (wing: number) => {
        switch(wing) {
            case 1: return { color: "text-red-600", border: "border-red-600/30", bg: "bg-red-600/5", glow: "shadow-red-600/20", btn: "hover:border-red-600 hover:text-red-600" };
            case 2: return { color: "text-blue-500", border: "border-blue-500/30", bg: "bg-blue-500/5", glow: "shadow-blue-500/20", btn: "hover:border-blue-500 hover:text-blue-500" };
            case 3: return { color: "text-green-600", border: "border-green-600/30", bg: "bg-green-600/5", glow: "shadow-green-600/20", btn: "hover:border-green-600 hover:text-green-600" };
            case 4: return { color: "text-yellow-500", border: "border-yellow-500/40", bg: "bg-yellow-500/10", glow: "shadow-yellow-500/40", btn: "hover:border-yellow-500 hover:text-yellow-500" };
            case 5: return { color: "text-purple-500", border: "border-purple-500/30", bg: "bg-purple-500/5", glow: "shadow-purple-500/20", btn: "hover:border-purple-500 hover:text-purple-500" };
            default: return { color: "text-slate-400", border: "border-slate-200", bg: "bg-transparent", glow: "", btn: "" };
        }
    };

    const renderWingSection = (wingId: number, title: string, start: number, end: number) => {
        const theme = getWingTheme(wingId);
        return (
            <section className="mb-20 md:mb-32 animate-fade-up">
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                    <div className={`w-3 h-12 md:w-6 md:h-24 rounded-full ${theme.color.replace('text', 'bg')} shadow-[0_0_20px_rgba(0,0,0,0.1)]`}></div>
                    <h2 className="text-2xl md:text-6xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{title}</h2>
                </div>
                
                <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-8 p-6 md:p-16 glass-panel rounded-[3rem] md:rounded-[6rem] border-2 ${theme.border} ${theme.bg} backdrop-blur-xl shadow-2xl`}>
                    {CABINETS_DB.filter(c => c.id >= start && c.id <= end).map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setSelected(c.id)}
                            className={`relative h-16 w-16 md:h-28 md:w-28 rounded-2xl md:rounded-[3rem] text-xl md:text-5xl font-black transition-all duration-500 border-4 flex flex-col items-center justify-center group
                                ${selected === c.id 
                                    ? 'bg-slate-950 dark:bg-white text-white dark:text-black border-red-600 scale-125 z-20 shadow-[0_0_50px_rgba(220,38,38,0.5)]' 
                                    : `bg-white dark:bg-slate-900/80 ${theme.border} ${theme.color} ${theme.btn} hover:scale-110`
                                }
                            `}
                        >
                            <span className="text-[10px] md:text-sm absolute top-2 opacity-40 uppercase tracking-widest">{c.icon}</span>
                            {c.id}
                            {c.special && <span className="absolute -top-2 -right-2 text-sm md:text-2xl animate-pulse">⭐</span>}
                        </button>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-40 font-black antialiased overflow-x-hidden">
            
            {/* Header Area */}
            <div className="text-center mb-16 md:mb-32">
                <h1 className="text-4xl md:text-[10rem] font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 leading-none drop-shadow-2xl opacity-10 absolute -top-10 left-0 w-full select-none">RADAR</h1>
                <h1 className="text-4xl md:text-9xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 relative z-10">{t('pageTitle')}</h1>
                <p className="text-lg md:text-4xl text-red-600 dark:text-red-500 font-bold italic max-w-5xl mx-auto leading-relaxed">{t('subTitle')}</p>
                <div className="h-2 w-32 md:w-64 bg-red-600 mx-auto mt-12 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse"></div>
            </div>

            {/* Sticky HUD (Heads-Up Display) */}
            <div className="sticky top-24 z-[100] mb-20 md:mb-40 px-2 md:px-0">
                <div className={`glass-panel p-6 md:p-16 rounded-[2.5rem] md:rounded-[6rem] border-4 transition-all duration-700 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.2)]
                    ${selected ? 'border-red-600 bg-white/95 dark:bg-slate-950/90' : 'border-slate-200 dark:border-white/5 opacity-90'}
                `}>
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className={`h-24 w-24 md:h-56 md:w-56 rounded-[2.5rem] md:rounded-[4.5rem] flex flex-col items-center justify-center text-5xl md:text-[8rem] font-black text-white shadow-2xl transition-all relative overflow-hidden
                            ${selected ? 'bg-red-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-800'}
                        `}>
                            <span className="absolute top-2 md:top-6 text-sm md:text-3xl opacity-30">{activeCabinet.icon}</span>
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

            {/* الأجنحة الخمسة الملونة */}
            {renderWingSection(1, t('wing1'), 1, 21)}
            {renderWingSection(2, t('wing2'), 22, 30)}
            {renderWingSection(3, t('wing3'), 31, 39)}
            {renderWingSection(4, t('wing4'), 40, 41)}
            {renderWingSection(5, t('wing5'), 42, 58)}

            {/* Footer */}
            <div className="mt-40 text-center opacity-30">
                <p className="font-black text-slate-950 dark:text-white text-sm md:text-5xl italic tracking-tighter uppercase">EFIPS Tactical Mapping System • 2026</p>
                <div className="h-2 w-48 md:w-[40rem] bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-10 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.6)]"></div>
            </div>
        </div>
    );
};

export default LibraryMapPage;
