import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../src/utils/firebase'; 

const translations = {
    ar: {
        pageTitle: "تقارير صقر الإمارات الذكية",
        secureTitle: "مركز التقارير السري",
        passPlaceholder: "الرمز السري",
        authBtn: "دخول النظام",
        printReport: "طباعة التقرير المعتمد",
        searchedBooks: "أكثر الكتب بحثاً في الفهرس",
        digitalReads: "تفاعل المكتبة الرقمية",
        aiQuestions: "تحليل ذكاء صقر AI",
        errorPass: "الرمز السري غير صحيح!",
        loading: "جاري تحميل البيانات السحابية...",
        schoolNameAr: "مدرسة صقر الإمارات الدولية الخاصة",
        schoolNameEn: "Emirates Falcon International Private School",
        reportHeader: "التقرير الإحصائي المعتمد لأنظمة المكتبة الذكية",
        librarian: "أمين المكتبة: إسلام سليمان",
        signature: "اعتماد الإدارة المدرسية",
        datePrint: "تاريخ الإصدار:"
    },
    en: {
        pageTitle: "EFIPS Smart Intelligence Reports",
        secureTitle: "Secret Reports Center",
        passPlaceholder: "Pin Code",
        authBtn: "Enter System",
        printReport: "Print Official Report",
        searchedBooks: "Most Searched Titles",
        digitalReads: "Digital Engagement",
        aiQuestions: "Saqr AI Intel",
        errorPass: "Invalid Pin Code!",
        loading: "Loading Cloud Data...",
        schoolNameAr: "مدرسة صقر الإمارات الدولية الخاصة",
        schoolNameEn: "Emirates Falcon International Private School",
        reportHeader: "Certified Statistical Report for Smart Library Systems",
        librarian: "Librarian: Islam Soliman",
        signature: "Management Signature",
        datePrint: "Issue Date:"
    }
};

// ==========================================
// أيقونات SVG جذابة
// ==========================================
const LockIcon = () => (
  <svg className="w-16 h-16 md:w-20 md:h-20 text-rose-500 mb-6 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const BrainIcon = () => (
  <svg className="w-8 h-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ReportsPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar'; 
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    
    const [stats, setStats] = useState({ 
        searched: [
            { label: isAr ? 'أرض زيكولا' : 'Zikola Land', value: 85, color: 'bg-rose-500' },
            { label: isAr ? 'هاري بوتر' : 'Harry Potter', value: 75, color: 'bg-rose-500' },
            { label: isAr ? 'كليلة ودمنة' : 'Kalila & Dimna', value: 60, color: 'bg-rose-500' },
            { label: isAr ? 'أماريتا' : 'Amarita', value: 40, color: 'bg-rose-500' },
            { label: isAr ? 'عالمي الصغير' : 'My Little World', value: 30, color: 'bg-rose-500' }
        ], 
        digital: [
            { label: isAr ? 'المكتبة العربية' : 'Arabic Library', value: 90, color: 'bg-emerald-500' },
            { label: isAr ? 'المكتبة الإنجليزية' : 'English Library', value: 65, color: 'bg-emerald-500' },
            { label: isAr ? 'قصص الأنبياء' : 'Prophets Stories', value: 50, color: 'bg-emerald-500' },
            { label: isAr ? 'موسوعة العلوم' : 'Science Encyclopedia', value: 35, color: 'bg-emerald-500' }
        ], 
        ai: [
            { label: isAr ? 'تأليف قصة خيالية' : 'Writing a Fantasy Story', value: 80, color: 'bg-sky-500' },
            { label: isAr ? 'تلخيص كتاب' : 'Book Summary', value: 70, color: 'bg-sky-500' },
            { label: isAr ? 'أسئلة علمية' : 'Scientific Questions', value: 55, color: 'bg-sky-500' },
            { label: isAr ? 'شرح قاعدة لغوية' : 'Grammar Explanation', value: 45, color: 'bg-sky-500' }
        ] 
    });

    const fetchCloudData = async () => {
        setIsLoadingData(true);
        try {
            const logsSnapshot = await getDocs(collection(db, 'activity_logs'));
            if (!logsSnapshot.empty) {
                const logs = logsSnapshot.docs.map(doc => doc.data());
                
                const counts: any = { searched: {}, digital: {}, ai: {} };
                logs.forEach((log: any) => {
                    if (log.type && counts[log.type]) {
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
                        .slice(0, 5); 
                };

                const realSearched = formatToStats(counts.searched, "bg-rose-500");
                const realDigital = formatToStats(counts.digital, "bg-emerald-500");
                const realAi = formatToStats(counts.ai, "bg-sky-500");

                if (realSearched.length > 0 || realDigital.length > 0 || realAi.length > 0) {
                    setStats({
                        searched: realSearched.length > 0 ? realSearched : stats.searched,
                        digital: realDigital.length > 0 ? realDigital : stats.digital,
                        ai: realAi.length > 0 ? realAi : stats.ai
                    });
                }
            }
        } catch (error) { 
            console.log("Using cached stats:", error); 
        } finally { 
            setIsLoadingData(false); 
        }
    };

    useEffect(() => { 
        if (isAuthenticated) fetchCloudData(); 
    }, [isAuthenticated]);

    const handleAuth = () => {
        if (password === '101110') setIsAuthenticated(true);
        else { setPassword(''); alert(t('errorPass')); }
    };

    const handlePrint = () => {
        window.print();
    };

    // --- شاشة تسجيل الدخول السري ---
    if (!isAuthenticated) {
        return (
            <div dir={dir} className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-400/20 blur-[100px] rounded-full animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>

                <div className="w-full max-w-lg bg-white dark:bg-slate-800 p-10 md:p-14 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 shadow-2xl text-center relative z-10 flex flex-col items-center animate-zoom-in">
                    <LockIcon />
                    <h2 className="text-3xl md:text-4xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight">{t('secureTitle')}</h2>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)} 
                        onKeyDown={(e)=>e.key==='Enter'&&handleAuth()} 
                        className="w-full p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 text-center text-4xl mb-8 outline-none focus:border-rose-400 dark:focus:border-rose-500 font-black text-slate-900 dark:text-white shadow-inner transition-colors" 
                        placeholder="••••••" 
                    />
                    <button onClick={handleAuth} className="w-full bg-rose-500 text-white py-5 rounded-[2rem] font-black text-xl md:text-2xl uppercase tracking-widest border-b-8 border-rose-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md">
                        {t('authBtn')}
                    </button>
                </div>
            </div>
        );
    }

    // --- شاشة التحميل ---
    if (isLoadingData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-slate-950 relative overflow-hidden">
                <div className="w-16 h-16 border-8 border-slate-200 dark:border-slate-700 border-t-rose-500 rounded-full animate-spin mb-6 z-10"></div>
                <div className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-widest z-10">{t('loading')}</div>
            </div>
        );
    }

    // --- واجهة لوحة التحكم والتقارير (مع قالب الطباعة A4 المخصص) ---
    return (
        <div dir={dir} className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8 font-sans relative overflow-x-hidden transition-colors duration-300">
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-sky-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            {/* قالب الطباعة الخاص بحجم A4 (يظهر فقط عند الطباعة) */}
            <div id="printable-report" className="hidden print:flex flex-col bg-white text-slate-900 p-8 w-[210mm] min-h-[297mm] mx-auto box-border">
                {/* رأس الصفحة الرسمية للطباعة */}
                <div className="flex justify-between items-center border-b-4 border-slate-900 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                        <img src="https://www.efipslibrary.online/school-logo.png" alt="EFIPS Logo" className="w-20 h-20 object-contain" crossOrigin="anonymous" />
                        <div>
                            <h2 className="text-xl font-black text-slate-900">{t('schoolNameAr')}</h2>
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t('schoolNameEn')}</p>
                        </div>
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-500">{t('datePrint')} {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black uppercase text-slate-900 border-2 border-slate-900 py-3 px-6 inline-block rounded-xl">{t('reportHeader')}</h1>
                </div>

                {/* محتوى التقارير للطباعة */}
                <div className="grid grid-cols-1 gap-6 flex-1">
                    <div className="border-2 border-slate-300 p-6 rounded-2xl">
                        <h3 className="text-lg font-black mb-4 border-b pb-2">{t('searchedBooks')}</h3>
                        <ul className="space-y-3">
                            {stats.searched.map((s: any, i: number) => (
                                <li key={i} className="flex justify-between font-bold text-sm">
                                    <span>{i + 1}. {s.label}</span>
                                    <span>{s.value}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-2 border-slate-300 p-6 rounded-2xl">
                        <h3 className="text-lg font-black mb-4 border-b pb-2">{t('digitalReads')}</h3>
                        <ul className="space-y-3">
                            {stats.digital.map((s: any, i: number) => (
                                <li key={i} className="flex justify-between font-bold text-sm">
                                    <span>{i + 1}. {s.label}</span>
                                    <span>{s.value}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-2 border-slate-300 p-6 rounded-2xl">
                        <h3 className="text-lg font-black mb-4 border-b pb-2">{t('aiQuestions')}</h3>
                        <ul className="space-y-3">
                            {stats.ai.map((s: any, i: number) => (
                                <li key={i} className="flex justify-between font-bold text-sm">
                                    <span>{i + 1}. {s.label}</span>
                                    <span>{s.value}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* التوقيعات الرسمية أسفل التقرير المطبوع */}
                <div className="flex justify-between items-end mt-16 pt-8 border-t-2 border-slate-300">
                    <div className="text-center">
                        <p className="font-black text-sm mb-8">{t('librarian')}</p>
                        <div className="w-48 border-b border-slate-400"></div>
                    </div>
                    <div className="text-center">
                        <p className="font-black text-sm mb-8">{t('signature')}</p>
                        <div className="w-48 border-b border-slate-400"></div>
                    </div>
                </div>
            </div>

            {/* الواجهة المعروضة على الموقع */}
            <div className="max-w-[1400px] mx-auto animate-fade-in-up print:hidden">
                
                <div className="text-center mb-16 relative">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t('pageTitle')}</h1>
                    <div className="flex justify-center gap-3 mt-6">
                        <div className="w-16 h-2 bg-rose-500 rounded-full" />
                        <div className="w-8 h-2 bg-emerald-400 rounded-full" />
                        <div className="w-4 h-2 bg-sky-400 rounded-full" />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* 1. أكثر الكتب بحثاً */}
                    <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 border-b-8 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30 border-4 border-rose-200 dark:border-rose-800 flex items-center justify-center mb-6">
                            <SearchIcon />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight">{t('searchedBooks')}</h2>
                        <div className="space-y-6">
                            {stats.searched.map((s:any, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-200 font-bold text-sm md:text-base">
                                        <span className="truncate pe-4">{s.label}</span> 
                                        <span className="text-rose-600 dark:text-rose-400">{s.value}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full ${s.color} rounded-full`} style={{width: `${s.value}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. تفاعل المكتبة الرقمية */}
                    <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 border-b-8 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 border-4 border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-6">
                            <BookIcon />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight">{t('digitalReads')}</h2>
                        <div className="space-y-6">
                            {stats.digital.map((s:any, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-200 font-bold text-sm md:text-base">
                                        <span className="truncate pe-4">{s.label}</span> 
                                        <span className="text-emerald-600 dark:text-emerald-400">{s.value}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full ${s.color} rounded-full`} style={{width: `${s.value}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. تحليل ذكاء صقر AI */}
                    <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 border-b-8 shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-900/30 border-4 border-sky-200 dark:border-sky-800 flex items-center justify-center mb-6">
                            <BrainIcon />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight">{t('aiQuestions')}</h2>
                        <div className="space-y-6">
                            {stats.ai.map((s:any, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-200 font-bold text-sm md:text-base">
                                        <span className="truncate pe-4">{s.label}</span> 
                                        <span className="text-sky-600 dark:text-sky-400">{s.value}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full ${s.color} rounded-full`} style={{width: `${s.value}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <button onClick={handlePrint} className="bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-[2rem] font-black text-lg md:text-xl border-b-8 border-slate-950 dark:border-slate-300 active:border-b-0 active:translate-y-2 transition-all shadow-md uppercase tracking-widest hover:-translate-y-1">
                        {t('printReport')}
                    </button>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:flex {
                        display: flex !important;
                    }
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                }

                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 8s infinite alternate ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }

                @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
                .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default ReportsPage;
