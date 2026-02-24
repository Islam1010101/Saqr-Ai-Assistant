import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../src/utils/firebase'; 

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
    const isAr = locale === 'ar'; // ✅ تم التصحيح هنا
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    
    const [stats, setStats] = useState({ searched: [], digital: [], ai: [] });
    const [challenges, setChallenges] = useState<any[]>([]);
    const [ramadanReports, setRamadanReports] = useState<any[]>([]);
    const [viewingContent, setViewingContent] = useState<any>(null);

    const fetchCloudData = async () => {
        setIsLoadingData(true);
        try {
            const logsSnapshot = await getDocs(collection(db, 'activity_logs'));
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

            setStats({
                searched: formatToStats(counts.searched, "bg-red-600") as any,
                digital: formatToStats(counts.digital, "bg-green-600") as any,
                ai: formatToStats(counts.ai, "bg-slate-900 dark:bg-white") as any
            });

            const challengesQuery = query(collection(db, 'challenge_reports'), orderBy('timestamp', 'desc'));
            const challengesSnapshot = await getDocs(challengesQuery);
            setChallenges(challengesSnapshot.docs.map(doc => doc.data()));

            const ramadanQuery = query(collection(db, 'saqrReports'), orderBy('timestamp', 'asc'));
            const ramadanSnapshot = await getDocs(ramadanQuery);
            setRamadanReports(ramadanSnapshot.docs.map(doc => doc.data()));

        } catch (error) { console.log(error); } finally { setIsLoadingData(false); }
    };

    useEffect(() => { if (isAuthenticated) fetchCloudData(); }, [isAuthenticated]);

    const handleAuth = () => {
        if (password === '101110') setIsAuthenticated(true);
        else { setPassword(''); alert(t('errorPass')); }
    };

    if (!isAuthenticated) {
        return (
            <div dir={dir} className="min-h-[75vh] flex items-center justify-center p-4">
                <div className="glass-panel w-full max-w-xl p-10 rounded-[3rem] text-center bg-white/80 dark:bg-slate-950/80 shadow-3xl">
                    <h2 className="text-3xl font-black mb-10 text-slate-950 dark:text-white">{t('secureTitle')}</h2>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleAuth()} className="w-full p-6 rounded-[2rem] bg-slate-100 dark:bg-black/60 text-center text-4xl mb-10 outline-none" placeholder="••••••" />
                    <button onClick={handleAuth} className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-6 rounded-[2rem] font-black">{t('authBtn')}</button>
                </div>
            </div>
        );
    }

    if (isLoadingData) {
        return <div className="min-h-[75vh] flex items-center justify-center text-2xl font-black dark:text-white">☁️ {isAr ? "جاري التحميل..." : "Loading Data..."}</div>;
    }

    const ramadanWinner = ramadanReports[ramadanReports.length - 1];

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl md:text-5xl font-black mb-10 dark:text-white">{t('pageTitle')}</h1>
            
            {ramadanWinner && (
                <div className="glass-panel p-8 rounded-[2rem] bg-yellow-500/10 mb-10 border border-yellow-500/30">
                    <h2 className="text-2xl font-black text-yellow-600 mb-6">🌙 {t('ramadanWinnerTitle')}</h2>
                    <p className="text-xl font-bold dark:text-white">{ramadanWinner.studentName} - {ramadanWinner.studentGrade}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="glass-panel p-8 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl">
                    <h2 className="text-xl font-black mb-6 dark:text-white">{t('searchedBooks')}</h2>
                    {stats.searched.map((s:any, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between dark:text-white text-sm"><span>{s.label}</span> <span>{s.value}%</span></div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"><div className={`h-full ${s.color}`} style={{width: `${s.value}%`}}></div></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
