import React, { useState, useEffect } from 'react';
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

const getChallengeReports = () => {
    return JSON.parse(localStorage.getItem('efips_challenge_reports') || '[]');
};

// 🌟 وظيفة جلب تقارير مسابقة رمضان
const getRamadanReports = () => {
    return JSON.parse(localStorage.getItem('saqrReports') || '[]');
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
        challengeResults: "سجل أبطال التحدي والإبداع الأدبي",
        studentName: "اسم الطالب",
        activityLabel: "النشاط",
        contentLabel: "المحتوى الإبداعي",
        dateLabel: "التاريخ",
        viewBtn: "استعراض الإبداع",
        librarian: "أمين المكتبة المعتمد",
        signature: "توقيع الإدارة المدرسية",
        errorPass: "الرمز السري غير صحيح",
        // ترجمات جديدة لرمضان
        ramadanWinnerTitle: "بطل كنوز رمضان",
        ramadanInteractions: "إجمالي التفاعل",
        gradeLabel: "الصف",
        emailLabel: "البريد الإلكتروني",
        answerLabel: "الإجابة المسجلة",
        codeLabel: "كود الكنز"
    },
    en: {
        pageTitle: "EFIPS Smart Intelligence Reports",
        secureTitle: "Admin Reports Center",
        passPlaceholder: "Pin Code",
        authBtn: "Enter System",
        printReport: "Print Official Report",
        searchedBooks: "Most Searched Titles",
        digitalReads: "Digital Library Engagement",
        aiQuestions: "Saqr AI Intel",
        challengeResults: "Challenge & Creative Champions",
        studentName: "Student Name",
        activityLabel: "Activity",
        contentLabel: "Creative Content",
        dateLabel: "Date",
        viewBtn: "View Creation",
        librarian: "Certified Librarian",
        signature: "Management Signature",
        errorPass: "Invalid Pin Code",
        // ترجمات جديدة لرمضان
        ramadanWinnerTitle: "Ramadan Treasures Champion",
        ramadanInteractions: "Total Interactions",
        gradeLabel: "Grade",
        emailLabel: "Email",
        answerLabel: "Logged Answer",
        codeLabel: "Treasure Code"
    }
};

const ReportsPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState(getDynamicStats());
    const [challenges, setChallenges] = useState(getChallengeReports());
    const [viewingContent, setViewingContent] = useState<any>(null);
    
    // 🌟 State تقارير رمضان
    const [ramadanReports, setRamadanReports] = useState<any[]>([]);

    useEffect(() => {
        if (isAuthenticated) {
            setStats(getDynamicStats());
            setChallenges(getChallengeReports());
            setRamadanReports(getRamadanReports());
        }
    }, [isAuthenticated]);

    const handleAuth = () => {
        if (password === '101110') { setIsAuthenticated(true); } 
        else { setPassword(''); alert(t('errorPass')); }
    };

    if (!isAuthenticated) {
        return (
            <div dir={dir} className="min-h-[75vh] flex items-center justify-center p-4 animate-fade-up font-bold antialiased">
                <div className="glass-panel w-full max-w-xl p-10 md:p-20 rounded-[3rem] text-center bg-white/80 dark:bg-slate-950/80 shadow-3xl border-0 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
                    <h2 className="text-3xl md:text-5xl font-black mb-10 text-slate-950 dark:text-white uppercase tracking-tighter">{t('secureTitle')}</h2>
                    <input 
                        type="password" value={password} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleAuth()} 
                        className="w-full p-6 md:p-10 rounded-[2rem] bg-slate-100 dark:bg-black/60 text-center text-4xl md:text-6xl font-black outline-none mb-10 transition-all border-0 focus:ring-4 ring-red-600/20 shadow-inner dark:text-white" placeholder="••••••" 
                    />
                    <button onClick={handleAuth} className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-6 md:py-10 rounded-[2rem] font-black text-lg md:text-3xl shadow-2xl hover:bg-red-600 hover:text-white transition-all">
                        {t('authBtn')}
                    </button>
                </div>
            </div>
        );
    }

    // جلب أحدث فائز بمسابقة رمضان
    const ramadanWinner = ramadanReports.length > 0 ? ramadanReports[ramadanReports.length - 1] : null;

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-40 print:p-0 font-bold antialiased">
            
            {/* Modal لاستعراض القصة أو النقاش */}
            {viewingContent && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-500" onClick={()=>setViewingContent(null)}>
                    <div className="glass-panel w-full max-w-2xl p-8 md:p-12 rounded-[3rem] bg-white dark:bg-slate-950 shadow-3xl border-0 overflow-y-auto max-h-[80vh] text-start" onClick={e=>e.stopPropagation()}>
                        <h3 className="text-2xl font-black text-red-600 mb-6">{viewingContent.name} - {viewingContent.activity}</h3>
                        <div className="prose dark:prose-invert font-medium leading-loose whitespace-pre-wrap">{viewingContent.content}</div>
                        <button onClick={()=>setViewingContent(null)} className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-black transition-all hover:bg-red-600">إغلاق</button>
                    </div>
                </div>
            )}

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
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}} />

            <div className="print-only mb-12 border-b-4 border-slate-950 pb-8 flex justify-between items-center text-start">
                <img src="/school-logo.png" className="h-20" alt="EFIPS" />
                <div className="text-end">
                    <h1 className="text-2xl font-black italic-none">Emirates Falcon Int'l Private School</h1>
                    <p className="text-xs font-bold opacity-70 italic-none">Official AI Intelligence Report • Jan 2026</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mb-16 md:mb-24 gap-8 no-print text-center lg:text-start px-2">
                <h1 className="text-3xl md:text-7xl font-black text-slate-950 dark:text-white leading-tight tracking-tighter">{t('pageTitle')}</h1>
                <button onClick={() => window.print()} className="bg-red-600 text-white px-10 py-6 md:px-14 md:py-7 rounded-[2rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 text-sm md:text-xl uppercase tracking-widest">
                    <span>🖨️</span> {t('printReport')}
                </button>
            </div>

            {/* 🌟 قسم تقرير مسابقة رمضان الجديد */}
            {ramadanWinner && (
                <div className="glass-panel p-8 md:p-14 rounded-[3.5rem] bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 dark:from-yellow-900/20 dark:to-black border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)] relative overflow-hidden mb-16 animate-fade-in-up">
                    <div className="absolute top-0 start-0 w-3 h-full bg-yellow-500"></div>
                    <div className="absolute -top-10 -right-10 text-[15rem] opacity-5">🌙</div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4 text-yellow-600 dark:text-yellow-500">
                            <span className="text-4xl md:text-5xl">🌙</span> {t('ramadanWinnerTitle')}
                        </h2>
                        <div className="bg-white/50 dark:bg-black/50 px-6 py-3 rounded-full border border-yellow-500/30 font-bold text-sm md:text-lg dark:text-white flex gap-2 items-center z-10">
                            <span>📊 {t('ramadanInteractions')}:</span> 
                            <span className="text-yellow-600 font-black">{ramadanReports.length}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40 dark:bg-black/40 p-6 md:p-10 rounded-[2rem] backdrop-blur-sm border border-white/20 dark:border-white/5 relative z-10 text-start">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t('studentName')}</p>
                                <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">{ramadanWinner.studentName}</p>
                            </div>
                            <div>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t('gradeLabel')}</p>
                                <p className="text-lg md:text-2xl font-bold text-slate-800 dark:text-slate-200">{ramadanWinner.studentGrade}</p>
                            </div>
                            <div>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t('emailLabel')}</p>
                                <p className="text-md md:text-xl font-mono text-blue-600 dark:text-blue-400">{ramadanWinner.studentEmail}</p>
                            </div>
                        </div>

                        <div className="space-y-4 border-t md:border-t-0 md:border-s border-slate-300 dark:border-slate-700 pt-6 md:pt-0 md:ps-6">
                            <div>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t('answerLabel')}</p>
                                <p className="text-lg md:text-2xl font-black text-green-600 dark:text-green-400">"{ramadanWinner.enteredAnswer}"</p>
                            </div>
                            <div>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t('codeLabel')}</p>
                                <p className="text-md md:text-xl font-mono bg-slate-200 dark:bg-slate-800 inline-block px-3 py-1 rounded-lg text-slate-900 dark:text-white mt-1">
                                    {ramadanWinner.enteredCode}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t('dateLabel')}</p>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{new Date(ramadanWinner.timestamp).toLocaleString(locale)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* سجل أبطال التحدي المطور */}
            <div className="glass-panel p-8 md:p-14 rounded-[3.5rem] bg-white/80 dark:bg-slate-950/80 shadow-3xl border-0 relative overflow-hidden mb-16">
                <div className="absolute top-0 start-0 w-3 h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"></div>
                <h2 className="text-2xl md:text-4xl font-black mb-10 flex items-center gap-6 dark:text-white text-start">
                    <span className="text-4xl md:text-6xl animate-pulse">🥇</span> {t('challengeResults')}
                </h2>
                <div className="overflow-x-auto no-scrollbar text-start">
                    <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-white/10 text-blue-600 text-xs md:text-lg font-black uppercase">
                                <th className="pb-6 px-4">{t('studentName')}</th>
                                <th className="pb-6 px-4">{t('activityLabel')}</th>
                                <th className="pb-6 px-4 text-center">{t('contentLabel')}</th>
                                <th className="pb-6 px-4">{t('dateLabel')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-800 dark:text-slate-200">
                            {challenges.length > 0 ? challenges.map((c: any, i: number) => (
                                <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-6 px-4 font-black text-sm md:text-xl">{c.name}</td>
                                    <td className="py-6 px-4 font-bold text-xs md:text-md opacity-80">
                                        <span className={`px-3 py-1 rounded-full ${c.activity?.includes('Author') ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'}`}>
                                            {c.activity?.includes('Author') ? 'المؤلف الصغير' : 'نقاش أدبي'}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 text-center">
                                        <button onClick={()=>setViewingContent(c)} className="text-[10px] md:text-xs bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all font-black uppercase">
                                            {t('viewBtn')}
                                        </button>
                                    </td>
                                    <td className="py-6 px-4 text-[10px] md:text-xs opacity-50 font-bold">{c.date}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="py-10 text-center opacity-30 italic text-xl">لا توجد إبداعات مسجلة حتى الآن.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* إحصائيات عامة */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                <div className="glass-panel p-8 md:p-12 rounded-[3rem] bg-white/80 dark:bg-slate-900/60 shadow-3xl border-0 relative overflow-hidden">
                    <div className="absolute top-0 start-0 w-2 h-full bg-red-600"></div>
                    <h2 className="text-xl md:text-3xl font-black mb-8 flex items-center gap-4 dark:text-white text-start">
                        <span className="text-3xl">🔍</span> {t('searchedBooks')}
                    </h2>
                    <div className="space-y-6">
                        {stats.searched.map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs md:text-lg font-black">
                                    <span className="opacity-70 truncate max-w-[200px]">{s.label}</span> 
                                    <span className="text-red-600">{s.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-8 md:p-12 rounded-[3rem] bg-white/80 dark:bg-slate-900/60 shadow-3xl border-0 relative overflow-hidden text-start">
                    <div className="absolute top-0 start-0 w-2 h-full bg-green-600"></div>
                    <h2 className="text-xl md:text-3xl font-black mb-8 flex items-center gap-4 dark:text-white">
                        <span className="text-3xl">📚</span> {t('digitalReads')}
                    </h2>
                    <div className="space-y-6">
                        {stats.digital.map((d, i) => (
                            <div key={i} className="flex items-center gap-4 text-start">
                                <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600" style={{width:`${d.value}%`}}></div>
                                </div>
                                <span className="text-[10px] md:text-sm font-black w-24 truncate dark:text-slate-300">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="print-only mt-32 grid grid-cols-2 gap-16 text-start">
                <div className="border-2 border-slate-950 p-8 rounded-[2rem] text-center">
                    <p className="text-[10px] font-black uppercase mb-12 opacity-60">أمين المكتبة المعتمد</p>
                    <p className="font-black text-2xl">Islam Soliman</p>
                </div>
                <div className="border-2 border-slate-950 p-8 rounded-[2rem] text-center">
                    <p className="text-[10px] font-black uppercase mb-12 opacity-60">توقيع الإدارة المدرسية</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
