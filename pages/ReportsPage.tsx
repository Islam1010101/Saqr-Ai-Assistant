import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../App';

// --- دالة استخلاص وتلخيص البيانات من ذاكرة النظام ---
const getDynamicStats = () => {
    const logs = JSON.parse(localStorage.getItem('efips_activity_logs') || '[]');
    
    // تجميع البيانات وتكرارها
    const counts: any = { searched: {}, digital: {}, ai: {} };
    logs.forEach((log: any) => {
        if (counts[log.type]) {
            counts[log.type][log.label] = (counts[log.type][log.label] || 0) + 1;
        }
    });

    const formatToStats = (data: any, defaultColor: string) => {
        const total = Object.values(data).reduce((a: any, b: any) => a + b, 0) as number;
        return Object.entries(data)
            .map(([label, val]: any) => ({
                label,
                value: total > 0 ? Math.round((val / total) * 100) : 0,
                color: defaultColor,
                count: val
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4); // إظهار أفضل 4 نتائج دائماً
    };

    return {
        searched: formatToStats(counts.searched, "bg-red-600"),
        digital: formatToStats(counts.digital, "bg-green-700"),
        ai: formatToStats(counts.ai, "bg-slate-900")
    };
};

const translations = {
    ar: {
        pageTitle: "تقارير نظام صقر الإمارات",
        secureTitle: "مركز تقارير البوابة",
        passPlaceholder: "الرمز السري",
        authBtn: "تحليل النتائج",
        printReport: "طباعة تقرير A4 المعتمد",
        searchedBooks: "أكثر الكتب بحثاً في الفهرس",
        digitalReads: "تفاعل الطلاب مع المكتبة الرقمية",
        aiQuestions: "تحليل ذكاء صقر (أكثر الأسئلة)",
        statsDate: "تاريخ التقرير الذاتي",
        librarian: "أمين المكتبة المعتمد",
        signature: "توقيع الإدارة"
    },
    en: {
        pageTitle: "EFIPS Automated Reports",
        secureTitle: "Portal Reports Center",
        passPlaceholder: "Pin Code",
        authBtn: "Extract Results",
        printReport: "Print Official A4 Report",
        searchedBooks: "Most Searched (Manual Index)",
        digitalReads: "Digital Library Engagement",
        aiQuestions: "Saqr AI Query Analysis",
        statsDate: "Auto-Report Date",
        librarian: "Certified Librarian",
        signature: "Management Signature"
    }
};

const ReportsPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState(getDynamicStats());

    useEffect(() => {
        if (isAuthenticated) {
            setStats(getDynamicStats());
        }
    }, [isAuthenticated]);

    const handleAuth = () => {
        if (password === '101110') { setIsAuthenticated(true); } 
        else { setPassword(''); alert(t('errorPass')); }
    };

    const currentDate = useMemo(() => new Date().toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    }), [locale]);

    if (!isAuthenticated) {
        return (
            <div dir={dir} className="min-h-[70vh] flex items-center justify-center p-6 animate-fade-up">
                <div className="glass-panel w-full max-w-md p-10 rounded-[3rem] text-center bg-white/90 dark:bg-slate-900/90 shadow-2xl">
                    <h2 className="text-2xl font-black mb-6 uppercase">{t('secureTitle')}</h2>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleAuth()} className="w-full p-5 rounded-2xl bg-slate-100 dark:bg-black/40 text-center text-2xl font-black mb-6 outline-none border-2 border-transparent focus:border-red-600" placeholder="••••••" />
                    <button onClick={handleAuth} className="w-full bg-slate-950 text-white dark:bg-white dark:text-black py-4 rounded-xl font-black uppercase tracking-widest">{t('authBtn')}</button>
                </div>
            </div>
        );
    }

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 animate-fade-up relative z-10 pb-32 print:p-0">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: A4; margin: 1.5cm; }
                    body { background: white !important; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .glass-panel { border: 1px solid #ddd !important; box-shadow: none !important; }
                }
                .print-only { display: none; }
            `}} />

            {/* ترويسة الطباعة */}
            <div className="print-only mb-10 border-b-2 border-black pb-6 flex justify-between items-center">
                <img src="/school-logo.png" className="h-16" alt="EFIPS" />
                <div className="text-end font-black">
                    <h1 className="text-xl">Emirates Falcon Int'l. Private School</h1>
                    <p className="text-xs opacity-60">Automated Library Analytics Report - 2026</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 no-print">
                <h1 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter">{t('pageTitle')}</h1>
                <button onClick={() => window.print()} className="bg-red-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                    {t('printReport')}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* قسم التحليل المستخلص */}
                <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 shadow-xl">
                    <h2 className="text-xl md:text-2xl font-black mb-8 flex items-center gap-3">
                        <span className="w-2 h-8 bg-red-600 rounded-full"></span> {t('searchedBooks')}
                    </h2>
                    <div className="space-y-6">
                        {stats.searched.length > 0 ? stats.searched.map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>{s.label}</span> <span>{s.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${s.color}`} style={{ width: `${s.value}%` }}></div>
                                </div>
                            </div>
                        )) : <p className="opacity-40 font-bold italic">No data extracted yet...</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel p-8 rounded-[3rem] bg-white dark:bg-slate-900 shadow-lg">
                        <h2 className="text-lg font-black mb-6 flex items-center gap-3"><span className="w-2 h-6 bg-green-700 rounded-full"></span> {t('digitalReads')}</h2>
                        <div className="space-y-4">
                            {stats.digital.map((d, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-700" style={{width:`${d.value}%`}}></div></div>
                                    <span className="text-[10px] font-black w-24 truncate text-end">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-[3rem] bg-white dark:bg-slate-900 shadow-lg">
                        <h2 className="text-lg font-black mb-6 flex items-center gap-3"><span className="w-2 h-6 bg-slate-950 dark:bg-white rounded-full"></span> {t('aiQuestions')}</h2>
                        <div className="space-y-3">
                            {stats.ai.map((a, i) => (
                                <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl flex justify-between items-center text-[11px] font-bold">
                                    <span>"{a.label}"</span> <span className="bg-red-600 text-white px-2 py-0.5 rounded-md">{a.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ختم أمين المكتبة للطباعة */}
            <div className="print-only mt-20 grid grid-cols-2 gap-10">
                <div className="border-2 border-dashed border-slate-300 p-6 rounded-2xl text-center">
                    <p className="text-[9px] font-black uppercase mb-10 opacity-50">{t('librarian')}</p>
                    <p className="font-black text-lg">Islam Soliman</p>
                </div>
                <div className="border-2 border-dashed border-slate-300 p-6 rounded-2xl text-center">
                    <p className="text-[9px] font-black uppercase mb-10 opacity-50">{t('signature')}</p>
                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
