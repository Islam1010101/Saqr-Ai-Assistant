import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// إعداد اتصال Supabase
// ==========================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

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
        totalBookings: "حصص المكتبة المحجوزة",
        totalPoints: "نقاط الطلاب المكتسبة",
        leaderboardTitle: "🏆 لوحة شرف الطلاب (الأعلى نقاطاً)",
        colId: "رقم الطالب",
        colName: "اسم الطالب",
        colGrade: "الصف",
        colPoints: "النقاط",
        actionsTitle: "إجراءات سريعة",
        manageSchedule: "إدارة جدول الحجوزات",
        syncData: "مزامنة البيانات (CSV)",
        addPodcast: "رفع حلقة بودكاست",
        accessDenied: "عذراً، هذه الصفحة مخصصة لمدير النظام فقط.",
        loading: "جاري تحميل بيانات النظام المركزية..."
    },
    en: {
        title: "Unified Command Center",
        subtitle: "Smart Library Management System (EFIPS)",
        welcome: "Welcome Mr.",
        backToHome: "Back to Home",
        statsTitle: "Live System Statistics",
        totalStudents: "Total Students",
        totalTeachers: "Total Teachers",
        totalBookings: "Library Bookings",
        totalPoints: "Total Student Points",
        leaderboardTitle: "🏆 Student Leaderboard (Top Scorers)",
        colId: "Student ID",
        colName: "Name",
        colGrade: "Grade",
        colPoints: "Points",
        actionsTitle: "Quick Actions",
        manageSchedule: "Manage Master Schedule",
        syncData: "Sync Database (CSV)",
        addPodcast: "Upload Podcast Episode",
        accessDenied: "Access Denied. Admin privileges required.",
        loading: "Loading central system data..."
    }
};

// ==========================================
// الأيقونات
// ==========================================
const UsersIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const BookingsIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const PointsIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

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
                <div className="text-center text-white p-10 bg-slate-800 rounded-3xl border border-rose-500/50 shadow-2xl max-w-md">
                    <div className="text-6xl mb-4 animate-bounce">🛡️</div>
                    <h2 className="text-2xl font-black mb-4 text-rose-400">{t('accessDenied')}</h2>
                    <Link to="/home" className="inline-block px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all shadow-md">
                        {t('backToHome')}
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-black animate-pulse text-xl">
                {t('loading')}
            </div>
        );
    }

    return (
        <div dir={dir} className="min-h-[100dvh] bg-[#0f172a] bg-[url('/bg-pattern.svg')] text-slate-100 font-sans p-4 md:p-8">
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 4s ease-in-out infinite; }
            `}</style>

            {/* الهيدر العلوي */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-4 text-center md:text-start">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-rose-500/30 animate-float">
                        👑
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                            {t('title')}
                        </h1>
                        <p className="text-slate-400 font-bold text-sm md:text-base mt-1">
                            {t('welcome')} <span className="text-white">{adminName}</span> | {t('subtitle')}
                        </p>
                    </div>
                </div>
                
                <Link to="/home" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-bold flex items-center gap-2 transition-all hover:-translate-y-1 shadow-md">
                    <span>{t('backToHome')}</span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* العمود الأيمن: الإحصائيات والأزرار السريعة */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    
                    {/* بطاقات الإحصائيات (Stats) */}
                    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-xl">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-rose-400">
                            📊 {t('statsTitle')}
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-500/30 p-4 rounded-2xl text-center shadow-inner hover:scale-105 transition-transform">
                                <div className="text-blue-400 flex justify-center mb-2"><UsersIcon /></div>
                                <div className="text-2xl font-black text-white">{stats.students.toLocaleString()}</div>
                                <div className="text-[10px] md:text-xs font-bold text-blue-200 mt-1">{t('totalStudents')}</div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 p-4 rounded-2xl text-center shadow-inner hover:scale-105 transition-transform">
                                <div className="text-emerald-400 flex justify-center mb-2"><UsersIcon /></div>
                                <div className="text-2xl font-black text-white">{stats.teachers.toLocaleString()}</div>
                                <div className="text-[10px] md:text-xs font-bold text-emerald-200 mt-1">{t('totalTeachers')}</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 border border-purple-500/30 p-4 rounded-2xl text-center shadow-inner hover:scale-105 transition-transform">
                                <div className="text-purple-400 flex justify-center mb-2"><BookingsIcon /></div>
                                <div className="text-2xl font-black text-white">{stats.bookings.toLocaleString()}</div>
                                <div className="text-[10px] md:text-xs font-bold text-purple-200 mt-1">{t('totalBookings')}</div>
                            </div>

                            <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-amber-500/30 p-4 rounded-2xl text-center shadow-inner hover:scale-105 transition-transform">
                                <div className="text-amber-400 flex justify-center mb-2"><PointsIcon /></div>
                                <div className="text-2xl font-black text-white">{stats.totalPoints.toLocaleString()}</div>
                                <div className="text-[10px] md:text-xs font-bold text-amber-200 mt-1">{t('totalPoints')}</div>
                            </div>
                        </div>
                    </div>

                    {/* الإجراءات السريعة (Quick Actions) */}
                    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-xl">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-cyan-400">
                            ⚡ {t('actionsTitle')}
                        </h2>
                        
                        <div className="flex flex-col gap-3">
                            <Link to="/schedule" className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 p-4 rounded-2xl font-bold flex items-center justify-between group transition-all">
                                <span>{t('manageSchedule')}</span>
                                <span className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">➔</span>
                            </Link>
                            <button onClick={() => alert('هذه الميزة سيتم تفعيلها لرفع تحديثات الطلاب والمعلمين بملف إكسل جديد')} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 p-4 rounded-2xl font-bold flex items-center justify-between group transition-all text-start">
                                <span>{t('syncData')}</span>
                                <span className="opacity-50 text-sm">CSV 📄</span>
                            </button>
                            <button onClick={() => alert('قريباً: واجهة رفع ملفات البودكاست الصوتية وتحديث الراديو')} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 p-4 rounded-2xl font-bold flex items-center justify-between group transition-all text-start">
                                <span>{t('addPodcast')}</span>
                                <span className="opacity-50 text-sm">🎙️</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* العمود الأيسر: لوحة الشرف (Leaderboard) */}
                <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-xl flex flex-col">
                    <h2 className="text-xl md:text-2xl font-black mb-6 text-amber-400">
                        {t('leaderboardTitle')}
                    </h2>
                    
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left rtl:text-right border-collapse min-w-[500px]">
                            <thead>
                                <tr className="border-b-2 border-slate-700 text-slate-400 text-sm md:text-base">
                                    <th className="p-3 font-bold">#</th>
                                    <th className="p-3 font-bold">{t('colId')}</th>
                                    <th className="p-3 font-bold">{t('colName')}</th>
                                    <th className="p-3 font-bold">{t('colGrade')}</th>
                                    <th className="p-3 font-bold text-center">{t('colPoints')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topStudents.length > 0 ? topStudents.map((student, idx) => (
                                    <tr key={student.student_id} className={`border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors ${idx === 0 ? 'bg-amber-500/10' : idx === 1 ? 'bg-slate-300/10' : idx === 2 ? 'bg-orange-500/10' : ''}`}>
                                        <td className="p-3">
                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : <span className="font-bold text-slate-500 px-1">{idx + 1}</span>}
                                        </td>
                                        <td className="p-3 font-mono text-xs md:text-sm text-slate-400">{student.student_id}</td>
                                        <td className="p-3 font-bold text-white text-sm md:text-base">
                                            {isAr ? student.name_ar : (student.name_en || student.name_ar)}
                                        </td>
                                        <td className="p-3 text-sm text-slate-300">
                                            <span className="bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">{student.grade}</span>
                                        </td>
                                        <td className="p-3 text-center font-black">
                                            <span className={`px-3 py-1 rounded-full text-xs md:text-sm shadow-inner ${idx === 0 ? 'bg-amber-500 text-amber-950' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                                {student.points || 0}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
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
