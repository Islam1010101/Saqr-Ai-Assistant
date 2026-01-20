import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../App';

const getDynamicStats = () => {
    const logs = JSON.parse(localStorage.getItem('efips_activity_logs') || '[]');
    const counts: any = { searched: {}, digital: {}, ai: {} };
    logs.forEach((log: any) => {
        if (counts[log.type]) {
            counts[log.type][log.label] = (counts[log.type][log.label] || 0) + 1;
        }
    });

    const formatToStats = (data: any, defaultColor: string, glowColor: string) => {
        const total = Object.values(data).reduce((a: any, b: any) => a + b, 0) as number;
        return Object.entries(data)
            .map(([label, val]: any) => ({
                label,
                value: total > 0 ? Math.round((val / total) * 100) : 0,
                color: defaultColor,
                glow: glowColor,
                count: val
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); 
    };

    return {
        searched: formatToStats(counts.searched, "bg-red-600", "shadow-[0_0_15px_rgba(220,38,38,0.5)]"),
        digital: formatToStats(counts.digital, "bg-green-600", "shadow-[0_0_15px_rgba(34,197,94,0.5)]"),
        ai: formatToStats(counts.ai, "bg-slate-900 dark:bg-white", "shadow-[0_0_15px_rgba(255,255,255,0.3)]")
    };
};

const translations = {
    ar: {
        pageTitle: "تقارير نظام صقر الإمارات",
        secureTitle: "مركز التقارير الآمن",
        passPlaceholder: "الرمز السري",
        authBtn: "دخول النظام",
        printReport: "طباعة التقرير المعتمد",
        searchedBooks: "أكثر الكتب بحثاً في الفهرس",
        digitalReads: "تفاعل المكتبة الرقمية",
        aiQuestions: "تحليل ذكاء صقر AI",
        librarian: "أمين المكتبة المعتمد",
        signature: "توقيع الإدارة المدرسية",
        errorPass: "الرمز السري غير صحيح"
    },
    en: {
        pageTitle: "EFIPS Automated Reports",
        secureTitle: "Secure Reports Center",
        passPlaceholder: "Pin Code",
        authBtn: "Enter System",
        printReport: "Print Official Report",
        searchedBooks: "Most Searched Titles",
        digitalReads: "Digital Library Engagement",
        aiQuestions: "Saqr AI Intel Analysis",
        librarian: "Certified Librarian",
        signature: "Management Signature",
        errorPass: "Invalid Pin Code"
    }
};

const ReportsPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState(getDynamicStats());

    useEffect(() => {
        if (isAuthenticated) setStats(getDynamicStats());
    }, [isAuthenticated]);

    const handleAuth = () => {
        if (password === '101110') { setIsAuthenticated(true); } 
        else { setPassword(''); alert(t('errorPass')); }
    };

    if (!isAuthenticated) {
        return (
            <div dir={dir} className="min-h-[75vh] flex items-center justify-center p-4 animate-fade-up font-black antialiased">
                <div className="glass-panel w-full max-w-xl p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] text-center bg-white/80 dark:bg-slate-950/80 shadow-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
                    <h2 className="text-3xl md:text-5xl font-black mb-10 text-slate-950 dark:text-white tracking-tighter uppercase">{t('secureTitle')}</h2>
                    <div className="relative mb-10">
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e)=>setPassword(e.target.value)} 
                            onKeyDown={(e)=>e.key==='Enter'&&handleAuth()} 
                            className="w-full p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-slate-100 dark:bg-black/60 text-center text-4xl md:text-6xl font-black outline-none border-4 border-transparent focus:border-red-600 dark:focus:border-red-500 transition-all shadow-inner dark:text-white" 
                            placeholder="••••••" 
                        />
                    </div>
                    <button onClick={handleAuth} className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-6 md:py-10 rounded-[2rem] md:rounded-[3rem] font-black uppercase tracking-[0.3em] text-lg md:text-3xl shadow-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95">
                        {t('authBtn')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-40 print:p-0 font-black antialiased">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: A4; margin: 1cm; }
                    body { background: white !important; color: black !important; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .glass-panel { border: 1px solid #000 !important; box-shadow: none !important; background: white !important; border-radius: 15px !important; }
                    .progress-bg { background: #eee !important; -webkit-print-color-adjust: exact; }
                }
                .print-only { display: none; }
            `}} />

            {/* ترويسة الطباعة الرسمية */}
            <div className="print-only mb-12 border-b-4 border-slate-950 pb-8 flex justify-between items-center">
                <img src="/school-logo.png" className="h-24" alt="EFIPS" />
                <div className="text-end">
                    <h1 className="text-3xl font-black">Emirates Falcon Int'l. Private School</h1>
                    <p className="text-sm font-bold opacity-70 italic">Automated Library Intelligence Report • Jan 2026</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mb-16 md:mb-24 gap-8 no-print">
                <h1 className="text-4xl md:text-9xl font-black text-slate-950 dark:text-white tracking-tighter drop-shadow-2xl">{t('pageTitle')}</h1>
                <button onClick={() => window.print()} className="group bg-red-600 text-white px-10 py-6 md:px-16 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:scale-110 active:scale-90 transition-all flex items-center gap-4 text-sm md:text-2xl">
                    <span>🖨️</span> {t('printReport')}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-10 md:gap-16">
                
                {/* كارت البحث الأبجدي - توهج أحمر */}
                <div className="glass-panel p-8 md:p-20 rounded-[3.5rem] md:rounded-[6rem] bg-white/80 dark:bg-slate-900/60 shadow-3xl dark:shadow-red-900/10 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 start-0 w-3 h-full bg-red-600 shadow-[2px_0_20px_rgba(220,38,38,0.4)]"></div>
                    <h2 className="text-2xl md:text-5xl font-black mb-12 flex items-center gap-6 text-slate-950 dark:text-white">
                        <span className="text-4xl md:text-7xl">🔍</span> {t('searchedBooks')}
                    </h2>
                    <div className="space-y-10">
                        {stats.searched.length > 0 ? stats.searched.map((s, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between text-xs md:text-2xl font-black uppercase tracking-tighter">
                                    <span className="opacity-70">{s.label}</span> 
                                    <span className="text-red-600">{s.value}%</span>
                                </div>
                                <div className="h-4 md:h-8 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden progress-bg">
                                    <div className={`h-full ${s.color} ${s.glow} transition-all duration-1000 delay-300`} style={{ width: `${s.value}%` }}></div>
                                </div>
                            </div>
                        )) : <p className="text-2xl opacity-30 italic">No data logs found for 2026...</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                    {/* كارت المكتبة الرقمية - توهج أخضر */}
                    <div className="glass-panel p-8 md:p-16 rounded-[3.5rem] md:rounded-[5rem] bg-white/80 dark:bg-slate-900/60 shadow-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 start-0 w-3 h-full bg-green-600 shadow-[2px_0_20px_rgba(34,197,94,0.4)]"></div>
                        <h2 className="text-2xl md:text-4xl font-black mb-10 flex items-center gap-4 dark:text-white">
                            <span className="text-4xl">📚</span> {t('digitalReads')}
                        </h2>
                        <div className="space-y-8">
                            {stats.digital.map((d, i) => (
                                <div key={i} className="flex items-center gap-6">
                                    <div className="flex-1 h-3 md:h-5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden progress-bg">
                                        <div className="h-full bg-green-600 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{width:`${d.value}%`}}></div>
                                    </div>
                                    <span className="text-[10px] md:text-lg font-black w-32 truncate text-end dark:text-slate-300">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* كارت ذكاء صقر - توهج نيون أبيض */}
                    <div className="glass-panel p-8 md:p-16 rounded-[3.5rem] md:rounded-[5rem] bg-slate-950 text-white shadow-3xl border-2 border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <h2 className="text-2xl md:text-4xl font-black mb-10 flex items-center gap-4">
                            <span className="text-4xl animate-pulse">🤖</span> {t('aiQuestions')}
                        </h2>
                        <div className="space-y-4 relative z-10">
                            {stats.ai.map((a, i) => (
                                <div key={i} className="p-4 md:p-6 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                                    <span className="text-sm md:text-xl font-bold opacity-80 group-hover:opacity-100 transition-opacity italic">"{a.label}"</span>
                                    <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs md:text-lg font-black shadow-[0_0_15px_rgba(220,38,38,0.4)]">{a.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* توقيعات الطباعة الرسمية */}
            <div className="print-only mt-32 grid grid-cols-2 gap-20">
                <div className="border-4 border-slate-950 p-10 rounded-[2.5rem] text-center">
                    <p className="text-xs font-black uppercase mb-16 opacity-60">{t('librarian')}</p>
                    <p className="font-black text-3xl">Islam Soliman</p>
                    <div className="h-1 w-32 bg-red-600 mx-auto mt-4"></div>
                </div>
                <div className="border-4 border-slate-950 p-10 rounded-[2.5rem] text-center">
                    <p className="text-xs font-black uppercase mb-16 opacity-60">{t('signature')}</p>
                    <div className="h-10"></div>
                    <div className="h-1 w-32 bg-green-600 mx-auto mt-4"></div>
                </div>
            </div>

            {/* فوتر النسخة الرقمية */}
            <div className="mt-32 md:mt-56 text-center opacity-30 no-print">
                <p className="font-black text-slate-950 dark:text-white text-sm md:text-4xl italic tracking-tighter">EFIPS Intelligence Dashboard • 2026</p>
                <div className="h-2 w-32 md:w-64 bg-red-600 mx-auto mt-6 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
            </div>
        </div>
    );
};

export default ReportsPage;
