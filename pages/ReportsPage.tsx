import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../App';

// --- وظيفة جلب الإحصائيات العامة ---
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

// --- وظيفة جلب سجل أبطال التحدي ---
const getChallengeReports = () => {
    return JSON.parse(localStorage.getItem('efips_challenge_reports') || '[]');
};

const translations = {
    ar: {
        pageTitle: "تقارير نظام صقر الإمارات الذكي",
        secureTitle: "مركز التقارير الإداري",
        passPlaceholder: "الرمز السري",
        authBtn: "دخول النظام",
        printReport: "طباعة التقرير المعتمد",
        searchedBooks: "أكثر الكتب بحثاً في الفهرس",
        digitalReads: "تفاعل المكتبة الرقمية",
        aiQuestions: "تحليل ذكاء صقر AI",
        challengeResults: "سجل أبطال تحدي القراءة والمناقشة",
        studentName: "اسم الطالب",
        scoreLabel: "النقاط",
        bookLabel: "الكتاب المناقش",
        dateLabel: "التاريخ",
        librarian: "أمين المكتبة المعتمد",
        signature: "توقيع الإدارة المدرسية",
        errorPass: "الرمز السري غير صحيح"
    },
    en: {
        pageTitle: "EFIPS Smart Intelligence Reports",
        secureTitle: "Admin Reports Center",
        passPlaceholder: "Pin Code",
        authBtn: "Enter System",
        printReport: "Print Official Report",
        searchedBooks: "Most Searched Titles",
        digitalReads: "Digital Library Engagement",
        aiQuestions: "Saqr AI Analysis",
        challengeResults: "Reading Challenge Champions",
        studentName: "Student Name",
        scoreLabel: "Score",
        bookLabel: "Discussed Book",
        dateLabel: "Date",
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
    const [challenges, setChallenges] = useState(getChallengeReports());

    useEffect(() => {
        if (isAuthenticated) {
            setStats(getDynamicStats());
            setChallenges(getChallengeReports());
        }
    }, [isAuthenticated]);

    const handleAuth = () => {
        if (password === '101110') { setIsAuthenticated(true); } 
        else { setPassword(''); alert(t('errorPass')); }
    };

    if (!isAuthenticated) {
        return (
            <div dir={dir} className="min-h-[75vh] flex items-center justify-center p-4 animate-fade-up font-bold antialiased">
                <div className="glass-panel w-full max-w-xl p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] text-center bg-white/80 dark:bg-slate-950/80 shadow-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
                    <h2 className="text-3xl md:text-5xl font-black mb-10 text-slate-950 dark:text-white uppercase">{t('secureTitle')}</h2>
                    <div className="relative mb-10">
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e)=>setPassword(e.target.value)} 
                            onKeyDown={(e)=>e.key==='Enter'&&handleAuth()} 
                            className="w-full p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-slate-100 dark:bg-black/60 text-center text-4xl md:text-6xl font-black outline-none border-4 border-transparent focus:border-red-600 transition-all shadow-inner dark:text-white" 
                            placeholder="••••••" 
                        />
                    </div>
                    <button onClick={handleAuth} className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-6 md:py-10 rounded-[2rem] md:rounded-[3rem] font-black text-lg md:text-3xl shadow-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95">
                        {t('authBtn')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-40 print:p-0 font-bold antialiased">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: A4; margin: 1cm; }
                    body { background: white !important; color: black !important; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .glass-panel { border: 1px solid #000 !important; box-shadow: none !important; background: white !important; }
                }
                .print-only { display: none; }
                * { font-style: normal !important; }
            `}} />

            <div className="print-only mb-12 border-b-4 border-slate-950 pb-8 flex justify-between items-center text-start">
                <img src="/school-logo.png" className="h-24" alt="EFIPS" />
                <div className="text-end">
                    <h1 className="text-3xl font-black italic-none">مدرسة صقر الإمارات الدولية الخاصة</h1>
                    <p className="text-sm font-bold opacity-70 italic-none">تقرير الذكاء الاصطناعي للمكتبة المعتمد • يناير 2026</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mb-16 md:mb-24 gap-8 no-print text-center lg:text-start">
                <h1 className="text-3xl md:text-6xl font-black text-slate-950 dark:text-white leading-tight drop-shadow-2xl">{t('pageTitle')}</h1>
                <button onClick={() => window.print()} className="bg-red-600 text-white px-10 py-6 md:px-16 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black shadow-xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center gap-4 text-sm md:text-2xl uppercase tracking-widest">
                    <span>🖨️</span> {t('printReport')}
                </button>
            </div>

            {/* --- القسم الجديد: سجل أبطال التحدي (المطلوب) --- */}
            <div className="glass-panel p-8 md:p-14 rounded-[3.5rem] md:rounded-[5rem] bg-white/80 dark:bg-slate-950/80 shadow-3xl border border-white/10 relative overflow-hidden mb-16">
                <div className="absolute top-0 start-0 w-3 h-full bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]"></div>
                <h2 className="text-2xl md:text-4xl font-black mb-10 flex items-center gap-6 dark:text-white">
                    <span className="text-4xl md:text-6xl">🏆</span> {t('challengeResults')}
                </h2>
                <div className="overflow-x-auto no-scrollbar text-start">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-200 dark:border-white/10 text-red-600 text-xs md:text-xl font-black uppercase">
                                <th className="pb-6 px-4">{t('studentName')}</th>
                                <th className="pb-6 px-4">{t('bookLabel')}</th>
                                <th className="pb-6 px-4">{t('scoreLabel')}</th>
                                <th className="pb-6 px-4">{t('dateLabel')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-800 dark:text-slate-200">
                            {challenges.length > 0 ? challenges.map((c: any, i: number) => (
                                <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-6 px-4 font-black text-sm md:text-2xl">{c.name}</td>
                                    <td className="py-6 px-4 font-bold text-xs md:text-lg opacity-80">{c.book || "مناقشة عامة"}</td>
                                    <td className="py-6 px-4 text-center">
                                        <span className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-4 py-1 rounded-full font-black text-sm md:text-xl">
                                            {c.score}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 text-xs md:text-sm opacity-50 font-bold">{c.date}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center opacity-30 italic text-xl">لا توجد سجلات حالياً.. بانتظار المبدعين.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* باقي الإحصائيات (بحث يدوي + ديجيتال) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                <div className="glass-panel p-8 md:p-14 rounded-[3.5rem] bg-white/80 dark:bg-slate-900/60 shadow-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 start-0 w-3 h-full bg-red-600"></div>
                    <h2 className="text-2xl md:text-4xl font-black mb-10 flex items-center gap-6 dark:text-white">
                        <span className="text-4xl">🔍</span> {t('searchedBooks')}
                    </h2>
                    <div className="space-y-8">
                        {stats.searched.map((s, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between text-xs md:text-xl font-black">
                                    <span className="opacity-70">{s.label}</span> 
                                    <span className="text-red-600">{s.value}%</span>
                                </div>
                                <div className="h-3 md:h-5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-8 md:p-14 rounded-[3.5rem] bg-white/80 dark:bg-slate-900/60 shadow-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 start-0 w-3 h-full bg-green-600"></div>
                    <h2 className="text-2xl md:text-4xl font-black mb-10 flex items-center gap-6 dark:text-white text-start">
                        <span className="text-4xl">📚</span> {t('digitalReads')}
                    </h2>
                    <div className="space-y-6">
                        {stats.digital.map((d, i) => (
                            <div key={i} className="flex items-center gap-6">
                                <div className="flex-1 h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600" style={{width:`${d.value}%`}}></div>
                                </div>
                                <span className="text-[10px] md:text-lg font-black w-32 truncate text-end dark:text-slate-300">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="print-only mt-32 grid grid-cols-2 gap-20">
                <div className="border-4 border-slate-950 p-10 rounded-[2.5rem] text-center">
                    <p className="text-xs font-black uppercase mb-16 opacity-60 italic-none text-start">{t('librarian')}</p>
                    <p className="font-black text-3xl italic-none">Islam Soliman</p>
                </div>
                <div className="border-4 border-slate-950 p-10 rounded-[2.5rem] text-center">
                    <p className="text-xs font-black uppercase mb-16 opacity-60 italic-none text-start">{t('signature')}</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
