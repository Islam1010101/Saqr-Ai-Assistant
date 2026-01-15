import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "تقارير المكتبة",
        secureTitle: "الإحصاءات والتقارير",
        passPlaceholder: "أدخل الرمز السري للدخول",
        authBtn: "تحقق من الهوية",
        errorPass: "الرمز غير صحيح، يرجى المحاولة مرة أخرى",
        printReport: "طباعة تقرير",
        searchedBooks: "أكثر الكتب بحثاً (الفهرس اليدوي)",
        digitalReads: "أكثر الكتب قراءة (المكتبة الرقمية)",
        aiQuestions: "أكثر الأسئلة تكراراً (صقر AI)",
        statsDate: "تاريخ التقرير"
    },
    en: {
        pageTitle: "Library Reports",
        secureTitle: "Statistics & reports",
        passPlaceholder: "Enter pin code to access",
        authBtn: "Verify Identity",
        errorPass: "Incorrect code, please try again",
        printReport: "Print Report",
        searchedBooks: "Most Searched Books (Manual Index)",
        digitalReads: "Most Read E-Books (Digital Library)",
        aiQuestions: "Most Frequent Questions (Saqr AI)",
        statsDate: "Report Date"
    }
};

const STATS_DATA = {
    searched: [
        { label: "روايات أجاثا كريستي", value: 85, color: "bg-red-600" },
        { label: "تاريخ الإمارات", value: 72, color: "bg-red-600" },
        { label: "الخوارزميات", value: 64, color: "bg-red-600" },
        { label: "ديوان المتنبي", value: 58, color: "bg-red-600" }
    ],
    digital: [
        { label: "Harry Potter Series", value: 92, color: "bg-green-700" },
        { label: "الأب الغني والأب الفقير", value: 78, color: "bg-green-700" },
        { label: "1984 - George Orwell", value: 65, color: "bg-green-700" },
        { label: "مختصر ابن كثير", value: 55, color: "bg-green-700" }
    ],
    ai: [
        { label: "كيف أكتب بحثاً علمياً؟", value: 88, color: "bg-slate-900" },
        { label: "أهم اختراعات المسلمين", value: 76, color: "bg-slate-900" },
        { label: "تطبيقات الذكاء الاصطناعي", value: 70, color: "bg-slate-900" },
        { label: "تاريخ تأسيس المدرسة", value: 45, color: "bg-slate-900" }
    ]
};

const ReportsPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(false);

    // حساب تاريخ اليوم ديناميكياً
    const currentDate = useMemo(() => {
        return new Date().toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [locale]);

    const handleAuth = () => {
        if (password === '101110') {
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setPassword('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div dir={dir} className="min-h-[70vh] flex items-center justify-center p-6 animate-fade-up">
                <div className="glass-panel w-full max-w-md p-10 md:p-12 rounded-[3.5rem] border-none shadow-[0_40px_100px_rgba(0,0,0,0.2)] text-center relative overflow-hidden bg-white/90 dark:bg-slate-900/90">
                    <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-600">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter uppercase">{t('secureTitle')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-10">{t('passPlaceholder')}</p>
                    
                    <div className="space-y-4">
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                            className={`w-full p-5 rounded-2xl bg-slate-100 dark:bg-black/40 border-2 text-center text-2xl font-black tracking-[0.5em] outline-none transition-all ${error ? 'border-red-600 animate-shake' : 'border-transparent focus:border-slate-950 dark:focus:border-white'}`}
                            autoFocus
                        />
                        {error && <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{t('errorPass')}</p>}
                        <button 
                            onClick={handleAuth}
                            className="w-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl mt-4"
                        >
                            {t('authBtn')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-up relative z-10 pb-32 text-start">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                <div>
                    <h1 className="text-4xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter mb-4">{t('pageTitle')}</h1>
                    <p className="text-red-600 font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">{t('statsDate')}: {currentDate}</p>
                </div>
                <button onClick={() => window.print()} className="w-full md:w-auto bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    {t('printReport')}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <div className="glass-panel p-8 md:p-14 rounded-[3.5rem] md:rounded-[4rem] border-none shadow-[0_30px_70px_rgba(0,0,0,0.1)] overflow-hidden bg-white/80 dark:bg-slate-900/80">
                    <h2 className="text-xl md:text-3xl font-black text-slate-950 dark:text-white mb-10 tracking-tight flex items-center gap-4">
                        <span className="w-2 md:w-3 h-8 md:h-10 bg-red-600 rounded-full"></span>
                        {t('searchedBooks')}
                    </h2>
                    <div className="space-y-8">
                        {STATS_DATA.searched.map((item, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex justify-between font-black text-[10px] md:text-sm text-slate-500 uppercase tracking-widest">
                                    <span>{item.label}</span>
                                    <span className="text-slate-950 dark:text-white">{item.value}%</span>
                                </div>
                                <div className="h-3 md:h-4 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} shadow-lg transition-all duration-1000 ease-out`} style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="glass-panel p-8 md:p-14 rounded-[3.5rem] border-none shadow-[0_30px_70px_rgba(0,0,0,0.1)] bg-white/80 dark:bg-slate-900/80">
                        <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white mb-10 flex items-center gap-4">
                            <span className="w-2 h-8 bg-green-700 rounded-full"></span>
                            {t('digitalReads')}
                        </h2>
                        <div className="space-y-6">
                            {STATS_DATA.digital.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="flex-1 h-2.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-black text-slate-500 w-28 md:w-32 truncate text-end">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-8 md:p-14 rounded-[3.5rem] border-none shadow-[0_30px_70px_rgba(0,0,0,0.1)] bg-white/80 dark:bg-slate-900/80">
                        <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white mb-10 flex items-center gap-4">
                            <span className="w-2 h-8 bg-slate-950 dark:bg-white rounded-full"></span>
                            {t('aiQuestions')}
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {STATS_DATA.ai.map((item, idx) => (
                                <div key={idx} className="bg-slate-100/50 dark:bg-white/5 p-5 rounded-2xl flex justify-between items-center border border-transparent hover:border-slate-200 transition-all">
                                    <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">"{item.label}"</span>
                                    <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap">{item.value} Ask</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
