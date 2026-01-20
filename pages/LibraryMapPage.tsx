import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "خريطة المكتبة الذكية",
        subTitle: "رادار المعرفة: حدد موقع كتابك بدقة في قاعة الأولاد",
        cabinet: "دولاب",
        contentTitle: "محتويات القسم",
        selectPrompt: "اختر رقم الدولاب من الخريطة بالأسفل",
        wing1: "جناح المعارف العامة",
        wing2: "جناح اللغة الإنجليزية",
        wing3: "جناح اللغة العربية",
        wing4: "الجناح الخاص والهوية"
    },
    en: {
        pageTitle: "Smart Library Map",
        subTitle: "Knowledge Radar: Locate your book in the Boys' Building",
        cabinet: "Cabinet",
        contentTitle: "Section Contents",
        selectPrompt: "Select a cabinet number from the map below",
        wing1: "General Knowledge Wing",
        wing2: "English Literature Wing",
        wing3: "Arabic Language Wing",
        wing4: "Special & Identity Wing"
    }
};

// --- تعريف بيانات الدواليب وتوزيعها على الأجنحة ---
const CABINET_MAP = [
    { id: 1, wing: 1, ar: "المعارف العامة وعلوم البرمجة", en: "General Knowledge & Programming" },
    { id: 2, wing: 1, ar: "الفلسفة وعلم النفس", en: "Philosophy & Psychology" },
    { id: 3, wing: 1, ar: "العلوم الاجتماعية والسياسة", en: "Social Sciences & Politics" },
    { id: 6, wing: 1, ar: "العلوم الطبيعية والرياضيات", en: "Natural Sciences & Math" },
    { id: 12, wing: 4, ar: "الفنون والرياضة والموسيقى", en: "Arts, Sports & Music", special: true },
    { id: 13, wing: 2, ar: "الروايات والقصص الإنجليزية (جزء 1)", en: "English Novels & Stories (Part 1)" },
    { id: 19, wing: 2, ar: "الروايات والقصص الإنجليزية (جزء 2)", en: "English Novels & Stories (Part 2)" },
    { id: 22, wing: 4, ar: "عالم ديزني - قصص مصورة", en: "Disney World - Comics", special: true },
    { id: 31, wing: 3, ar: "العلوم الإسلامية والدينية", en: "Islamic & Religious Sciences" },
    { id: 38, wing: 3, ar: "إصدارات دار كلمة للنشر", en: "Kalima Publisher Collection" },
    { id: 40, wing: 4, ar: "الملخصات المسموعة (QR Code)", en: "Audio Summaries (QR Code)", special: true },
    { id: 41, wing: 4, ar: "الهوية الوطنية الإماراتية والتراث", en: "UAE National Identity & Heritage" },
];

const LibraryMapPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [selected, setSelected] = useState<number | null>(null);

    const activeCabinet = useMemo(() => 
        CABINET_MAP.find(c => c.id === selected) || { ar: "معلومات القسم متوفرة في الفهرس", en: "Section details available in Index" }
    , [selected]);

    const getWingColor = (wing: number, isSpecial?: boolean) => {
        if (isSpecial) return "border-yellow-500 shadow-yellow-500/20 text-yellow-600";
        if (wing === 1 || wing === 2) return "border-red-600 shadow-red-600/20 text-red-600";
        return "border-green-600 shadow-green-600/20 text-green-600";
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 pb-40 font-black antialiased">
            
            {/* هيدر الخريطة */}
            <div className="text-center mb-12 md:mb-20">
                <h1 className="text-4xl md:text-9xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 drop-shadow-2xl">
                    {t('pageTitle')}
                </h1>
                <p className="text-lg md:text-3xl text-slate-600 dark:text-slate-400 font-bold opacity-80 italic">
                    {t('subTitle')}
                </p>
            </div>

            {/* شاشة العرض الرقمية (Data Display) */}
            <div className="mb-16 md:mb-24 sticky top-24 z-50">
                <div className={`glass-panel p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border-4 transition-all duration-500 bg-white/90 dark:bg-slate-950/90 shadow-3xl flex flex-col md:flex-row items-center gap-8
                    ${selected ? 'border-red-600 scale-[1.02]' : 'border-slate-200 dark:border-white/5 opacity-50'}
                `}>
                    <div className={`h-24 w-24 md:h-40 md:w-40 rounded-3xl flex items-center justify-center text-4xl md:text-7xl font-black text-white shadow-2xl transition-all
                        ${selected ? 'bg-red-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-800'}
                    `}>
                        {selected || "?"}
                    </div>
                    <div className="text-center md:text-start flex-1">
                        <h3 className="text-sm md:text-2xl font-black text-red-600 uppercase tracking-widest mb-2">{t('contentTitle')}</h3>
                        <p className="text-2xl md:text-5xl text-slate-950 dark:text-white leading-tight">
                            {selected ? (locale === 'ar' ? activeCabinet.ar : activeCabinet.en) : t('selectPrompt')}
                        </p>
                    </div>
                </div>
            </div>

            {/* شبكة الخريطة التكتيكية (The Grid) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-6 p-4 md:p-10 glass-panel rounded-[3rem] md:rounded-[5rem] bg-slate-100/50 dark:bg-black/20 border-2 border-white/10 shadow-inner">
                {Array.from({ length: 41 }, (_, i) => i + 1).map((num) => {
                    const info = CABINET_MAP.find(c => c.id === num);
                    const wingColor = getWingColor(info?.wing || 0, info?.special);
                    
                    return (
                        <button
                            key={num}
                            onClick={() => setSelected(num)}
                            className={`relative h-16 w-16 md:h-28 md:w-28 rounded-2xl md:rounded-[2.5rem] text-xl md:text-4xl font-black transition-all duration-300 border-4 flex items-center justify-center group
                                ${selected === num 
                                    ? 'bg-red-600 border-white text-white scale-110 shadow-[0_0_40px_rgba(220,38,38,0.6)] z-20' 
                                    : `bg-white dark:bg-slate-900 ${wingColor} hover:scale-105 hover:z-10`
                                }
                            `}
                        >
                            {num}
                            {/* علامة التوهج الصغيرة للأقسام الخاصة */}
                            {info?.special && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-6 md:w-6">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 md:h-6 md:w-6 bg-yellow-500 text-[8px] md:text-[10px] items-center justify-center">⭐</span>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* مفتاح الخريطة (Map Legend) للموبايل والتابلت */}
            <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 opacity-60">
                <div className="flex items-center gap-3"><div className="w-4 h-4 md:w-6 md:h-6 bg-red-600 rounded-full"></div><span className="text-[10px] md:text-lg font-black uppercase">{t('wing1')}</span></div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full"></div><span className="text-[10px] md:text-lg font-black uppercase">{t('wing2')}</span></div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 md:w-6 md:h-6 bg-green-600 rounded-full"></div><span className="text-[10px] md:text-lg font-black uppercase">{t('wing3')}</span></div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 md:w-6 md:h-6 bg-yellow-500 rounded-full"></div><span className="text-[10px] md:text-lg font-black uppercase">{t('wing4')}</span></div>
            </div>

            <style>{`
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.25); }
                @media (max-width: 768px) {
                    .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }
            `}</style>
        </div>
    );
};

export default LibraryMapPage;
