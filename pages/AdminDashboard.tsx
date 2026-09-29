import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
// 🚀 استيراد الاتصال من الملف المركزي بدلاً من كتابته هنا
import { supabase } from '../utils/supabase';

// ==========================================
// القاموس والترجمات
// ==========================================
const translations = {
    ar: {
        title: "مركز القيادة الموحد",
        subtitle: "نظام إدارة المكتبة الذكية (EFIPS)",
        welcome: "مرحباً بك أستاذ",
        backToHome: "العودة للرئيسية",
        statsTitle: "إحصائيات النظام الحية",
        totalStudents: "إجمالي الطلاب",
        totalTeachers: "إجمالي المعلمين",
        totalBookings: "الحجوزات",
        totalPoints: "مجموع النقاط",
        leaderboardTitle: "لوحة شرف الطلاب",
        colId: "الرقم",
        colName: "الاسم",
        colGrade: "الصف",
        colPoints: "النقاط",
        actionsTitle: "إجراءات سريعة",
        manageSchedule: "إدارة الجدول",
        syncData: "مزامنة (CSV)",
        addPodcast: "رفع بودكاست",
        accessDenied: "عذراً، هذه الصفحة مخصصة لمدير النظام فقط.",
        loading: "جاري تحميل البيانات..."
    },
    en: {
        title: "Command Center",
        subtitle: "Smart Library Management",
        welcome: "Welcome Mr.",
        backToHome: "Back to Home",
        statsTitle: "Live Statistics",
        totalStudents: "Students",
        totalTeachers: "Teachers",
        totalBookings: "Bookings",
        totalPoints: "Total Points",
        leaderboardTitle: "Student Leaderboard",
        colId: "ID",
        colName: "Name",
        colGrade: "Grade",
        colPoints: "Points",
        actionsTitle: "Quick Actions",
        manageSchedule: "Manage Schedule",
        syncData: "Sync (CSV)",
        addPodcast: "Upload Podcast",
        accessDenied: "Access Denied. Admin privileges required.",
        loading: "Loading data..."
    }
};

const AdminDashboard: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale as 'ar' | 'en'][key];

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [adminName, setAdminName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // الإحصائيات
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        bookings: 0,
        totalPoints: 0
    });
    
    // قائمة الأوائل
    const [topStudents, setTopStudents] = useState<any[]>([]);

    useEffect(() => {
        const storedType = localStorage.getItem('user_type');
        const storedUser = localStorage.getItem('current_user');

        if (storedType === 'admin' && storedUser) {
            setIsAdmin(true);
            const user = JSON.parse(storedUser);
            const name = isAr ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
            // أخذ الاسم الأول والثاني فقط ليكون الترحيب ودياً
            setAdminName(name.split(' ').slice(0, 2).join(' '));
            fetchDashboardData();
        } else {
            setIsAdmin(false);
        }
    }, [isAr]);

    const fetchDashboardData = async () => {
        try {
            // جلب أعداد الطلاب
            const { count: sCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
            // جلب أعداد المعلمين
            const { count: tCount } = await supabase.from('teachers').select('*', { count: 'exact', head: true });
            // جلب أعداد الحجوزات
            const { count: bCount } = await supabase.from('library_schedule').select('*', { count: 'exact', head: true });
            
            // جلب مجموع النقاط لكل الطلاب
            const { data: pointsData } = await supabase.from('students').select('points');
            const totalP = pointsData?.reduce((acc, curr) => acc + (curr.points || 0), 0) || 0;

            // جلب أفضل 10 طلاب (لوحة الشرف)
            const { data: topData } = await supabase
                .from('students')
                .select('student_id, name_ar, name_en, grade, points')
                .order('points', { ascending: false })
                .limit(10);

            setStats({
                students: sCount || 0,
                teachers: tCount || 0,
                bookings: bCount || 0,
                totalPoints: totalP
            });
            
            if (topData) setTopStudents(topData);

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAdmin === false) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4" dir={dir}>
                <div className="text-center text-white p-8 md:p-10 bg-slate-800 rounded-3xl border border-rose-500/50 shadow-2xl max-w-sm w-full">
                    <h2 className="text-lg md:text-xl font-black mb-4 text-rose-400">{t('accessDenied')}</h2>
                    <Link to="/home" className="inline-block w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all shadow-md text-sm md:text-base">
                        {t('backToHome')}
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-black animate-pulse text-lg md:text-xl">
                {t('loading')}
            </div>
        );
    }

    return (
        <div dir={dir} className="min-h-[100dvh] bg-[#0f172a] bg-[url('/bg-pattern.svg')] text-slate-100 font-sans p-3 md:p-8 pb-20">
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
            `}</style>

            {/* الهيدر العلوي */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl shadow-xl mt-16 md:mt-24">
                <div className="text-center md:text-start">
                    <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                        {t('title')}
                    </h1>
                    <p className="text-slate-400 font-bold text-[10px] md:text-sm mt-1">
                        {t('welcome')} <span className="text-white">{adminName}</span> | {t('subtitle')}
                    </p>
                </div>
                
                <Link to="/home" className="px-5 py-2.5 md:py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-bold text-xs md:text-sm transition-all shadow-md w-full md:w-auto text-center">
                    {t('backToHome')}
                </Link>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                
                {/* العمود الأيمن: الإحصائيات والأزرار السريعة */}
                <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
                    
                    {/* بطاقات الإحصائيات (Stats) */}
                    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-5 rounded-3xl shadow-xl">
                        <h2 className="text-base md:text-lg font-black mb-4 text-rose-400">
                            {t('statsTitle')}
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-800 border border-blue-500/30 p-3 rounded-2xl text-center shadow-inner">
                                <div className="text-lg md:text-2xl font-black text-blue-400">{stats.students.toLocaleString()}</div>
                                <div className="text-[9px] md:text-[11px] font-bold text-slate-400 mt-1 uppercase">{t('totalStudents')}</div>
                            </div>
                            
                            <div className="bg-slate-800 border border-emerald-500/30 p-3 rounded-2xl text-center shadow-inner">
                                <div className="text-lg md:text-2xl font-black text-emerald-400">{stats.teachers.toLocaleString()}</div>
                                <div className="text-[9px] md:text-[11px] font-bold text-slate-400 mt-1 uppercase">{t('totalTeachers')}</div>
                            </div>

                            <div className="bg-slate-800 border border-purple-500/30 p-3 rounded-2xl text-center shadow-inner">
                                <div className="text-lg md:text-2xl font-black text-purple-400">{stats.bookings.toLocaleString()}</div>
                                <div className="text-[9px] md:text-[11px] font-bold text-slate-400 mt-1 uppercase">{t('totalBookings')}</div>
                            </div>

                            <div className="bg-slate-800 border border-amber-500/30 p-3 rounded-2xl text-center shadow-inner">
                                <div className="text-lg md:text-2xl font-black text-amber-400">{stats.totalPoints.toLocaleString()}</div>
                                <div className="text-[9px] md:text-[11px] font-bold text-slate-400 mt-1 uppercase">{t('totalPoints')}</div>
                            </div>
                        </div>
                    </div>

                    {/* الإجراءات السريعة (Quick Actions) */}
                    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-5 rounded-3xl shadow-xl">
                        <h2 className="text-base md:text-lg font-black mb-4 text-cyan-400">
                            {t('actionsTitle')}
                        </h2>
                        
                        <div className="flex flex-col gap-2.5">
                            <Link to="/schedule" className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 p-3 rounded-xl font-bold flex items-center justify-center text-xs md:text-sm text-center transition-all">
                                {t('manageSchedule')}
                            </Link>
                            <button onClick={() => alert('هذه الميزة سيتم تفعيلها لرفع تحديثات الطلاب والمعلمين بملف إكسل جديد')} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 p-3 rounded-xl font-bold text-xs md:text-sm text-center transition-all">
                                {t('syncData')}
                            </button>
                            <button onClick={() => alert('قريباً: واجهة رفع ملفات البودكاست الصوتية وتحديث الراديو')} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 p-3 rounded-xl font-bold text-xs md:text-sm text-center transition-all">
                                {t('addPodcast')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* العمود الأيسر: لوحة الشرف (Leaderboard) */}
                <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 md:p-6 rounded-3xl shadow-xl flex flex-col overflow-hidden">
                    <h2 className="text-base md:text-xl font-black mb-4 text-amber-400 text-center md:text-start">
                        {t('leaderboardTitle')}
                    </h2>
                    
                    <div className="flex-1 overflow-x-auto rounded-xl border border-slate-800">
                        <table className="w-full text-left rtl:text-right border-collapse min-w-[350px]">
                            <thead>
                                <tr className="bg-slate-800 text-slate-300 text-[10px] md:text-sm border-b-2 border-slate-700">
                                    <th className="p-2 md:p-3 font-bold text-center">#</th>
                                    <th className="p-2 md:p-3 font-bold">{t('colId')}</th>
                                    <th className="p-2 md:p-3 font-bold">{t('colName')}</th>
                                    <th className="p-2 md:p-3 font-bold">{t('colGrade')}</th>
                                    <th className="p-2 md:p-3 font-bold text-center">{t('colPoints')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topStudents.length > 0 ? topStudents.map((student, idx) => (
                                    <tr key={student.student_id} className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${idx === 0 ? 'bg-amber-500/5' : idx === 1 ? 'bg-slate-300/5' : idx === 2 ? 'bg-orange-500/5' : ''}`}>
                                        <td className="p-2 md:p-3 text-center text-[10px] md:text-sm font-bold text-slate-400">
                                            {idx + 1}
                                        </td>
                                        <td className="p-2 md:p-3 font-mono text-[9px] md:text-xs text-slate-500">{student.student_id}</td>
                                        <td className="p-2 md:p-3 font-bold text-white text-[10px] md:text-sm whitespace-nowrap">
                                            {isAr ? student.name_ar : (student.name_en || student.name_ar)}
                                        </td>
                                        <td className="p-2 md:p-3 text-[10px] md:text-xs text-slate-400">
                                            {student.grade}
                                        </td>
                                        <td className="p-2 md:p-3 text-center font-black">
                                            <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs shadow-inner ${idx === 0 ? 'bg-amber-500 text-amber-950' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                                {student.points || 0}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-6 md:p-8 text-center text-slate-500 font-bold text-[10px] md:text-sm">
                                            لا توجد بيانات نقاط للطلاب حتى الآن.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
