import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "بوابة المبدعين",
        subTitle: "مساحة خاصة تحتفي بمواهب وابتكارات طلاب مدرسة صقر الإمارات",
        status: "هذا القسم تحت الإنشاء حالياً",
        comingSoon: "قريباً.. سنكشف عن عصر جديد من الإبداع الطلابي لعام 2026",
    },
    en: {
        pageTitle: "Creators' Portal",
        subTitle: "A special space celebrating the talents and innovations of EFIPS students.",
        status: "This section is currently under construction",
        comingSoon: "Soon.. We will unveil a new era of student creativity for 2026.",
    }
};

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    // رابط الصورة الجديدة التي ستضعها في مجلد public
    const CREATORS_MASCOT = "/creators-mascot.png"; 

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-12 md:py-24 animate-fade-up relative z-10 text-center antialiased font-black">
            
            {/* تأثيرات خلفية وطنية (أحمر وأخضر) */}
            <div className="absolute inset-0 flex justify-center -z-10 opacity-20 blur-[120px] pointer-events-none">
                <div className="w-64 h-64 bg-red-600 rounded-full translate-x-20"></div>
                <div className="w-64 h-64 bg-green-600 rounded-full -translate-x-20"></div>
            </div>

            {/* عرض صورة المبدع الجديدة بتأثيرات احترافية */}
            <div className="relative inline-block mb-12 group">
                {/* توهج المصباح */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
                
                <div className="relative w-48 h-48 md:w-72 md:h-72 bg-white/10 dark:bg-slate-900/40 rounded-[3rem] p-4 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden transition-transform duration-700 group-hover:scale-105">
                    <img 
                        src={CREATORS_MASCOT} 
                        alt="Creators Mascot" 
                        className="w-full h-full object-contain drop-shadow-2xl animate-fade-in"
                    />
                </div>
                
                {/* ترس زينة صغير يتحرك خلف الصورة */}
                <span className="absolute -bottom-4 -left-4 text-4xl md:text-6xl opacity-20 animate-spin-slow">⚙️</span>
            </div>

            <h1 className="text-5xl md:text-9xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 leading-tight">
                {t('pageTitle')}
            </h1>

            <div className="flex justify-center items-center gap-3 mb-10">
                <div className="h-1.5 w-16 bg-red-600 rounded-full"></div>
                <div className="h-1.5 w-16 bg-green-600 rounded-full"></div>
            </div>

            <div className="glass-panel max-w-3xl mx-auto p-8 md:p-14 rounded-[3.5rem] bg-white/40 dark:bg-slate-900/60 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
                <h2 className="text-2xl md:text-5xl text-red-600 font-black mb-6 flex items-center justify-center gap-4">
                    <span className="animate-pulse">⚠️</span> {t('status')}
                </h2>
                <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-300 font-bold mb-10 leading-relaxed">
                    {t('comingSoon')}
                </p>
                
                {/* أنيميشن التحميل بألوان العلم */}
                <div className="flex justify-center gap-4">
                    <div className="w-4 h-4 bg-red-600 rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-4 h-4 bg-slate-900 dark:bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
            </div>

            <p className="mt-12 text-slate-500 dark:text-slate-400 font-black text-sm md:text-xl px-4 italic opacity-70">
                "{t('subTitle')}"
            </p>

            <div className="mt-20 opacity-30">
                 <p className="text-[10px] font-black uppercase tracking-[0.8em] mb-2">EFIPS Library • Talent Management Unit</p>
                 <p className="font-black text-slate-950 dark:text-white uppercase text-xs">Official Librarian: Islam Soliman</p>
            </div>
        </div>
    );
};

export default CreatorsPortalPage;
