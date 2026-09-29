import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useTheme } from '../App';
import { supabase } from '../src/utils/supabase';

const translations = {
    ar: {
        title: "مركز القيادة الموحد",
        subtitle: "نظام إدارة المكتبة الذكية (EFIPS)",
        welcome: "مرحباً بك أستاذ",
        backToHome: "العودة للرئيسية",
        statsTitle: "إحصائيات النظام الحية",
        totalStudents: "إجمالي الطلاب",
        totalTeachers: "إجمالي المعلمين",
        studentLogins: "طالب مسجل / نشط",
        teacherLogins: "معلم مسجل / نشط",
        topBooksTitle: "أكثر الكتب طلباً وقراءة",
        arabicBooks: "المكتبة العربية",
        englishBooks: "المكتبة الإنجليزية",
        studentManagement: "إدارة الطلاب",
        teacherManagement: "إدارة المعلمين",
        addStudentBtn: "+ إضافة طالب جديد",
        addTeacherBtn: "+ إضافة معلم جديد",
        editIdBtn: "تعديل الـ ID",
        saveBtn: "حفظ التغييرات",
        cancelBtn: "إلغاء",
        colId: "الرقم التعريفي (ID)",
        colName: "الاسم",
        colGrade: "الصف",
        colPoints: "النقاط",
        colActions: "الإجراءات",
        modalAddStudent: "إضافة طالب جديد لقاعدة البيانات",
        modalAddTeacher: "إضافة معلم جديد لقاعدة البيانات",
        modalEditStudent: "تعديل بيانات الطالب",
        modalEditTeacher: "تعديل بيانات المعلم",
        accessDenied: "عذراً، هذه الصفحة مخصصة لمدير النظام فقط.",
        loading: "جاري تحميل لوحة التحكم..."
    },
    en: {
        title: "Command Center",
        subtitle: "Smart Library Management System",
        welcome: "Welcome Mr.",
        backToHome: "Back to Home",
        statsTitle: "Live System Statistics",
        totalStudents: "Total Students",
        totalTeachers: "Total Teachers",
        studentLogins: "Active Students",
        teacherLogins: "Active Teachers",
        topBooksTitle: "Most Popular Digital Books",
        arabicBooks: "Arabic Library",
        englishBooks: "English Library",
        studentManagement: "Student Management",
        teacherManagement: "Teacher Management",
        addStudentBtn: "+ Add New Student",
        addTeacherBtn: "+ Add New Teacher",
        editIdBtn: "Edit ID",
        saveBtn: "Save Changes",
        cancelBtn: "Cancel",
        colId: "ID Number",
        colName: "Name",
        colGrade: "Grade",
        colPoints: "Points",
        colActions: "Actions",
        modalAddStudent: "Add New Student",
        modalAddTeacher: "Add New Teacher",
        modalEditStudent: "Edit Student Info",
        modalEditTeacher: "Edit Teacher Info",
        accessDenied: "Access Denied. Admin privileges required.",
        loading: "Loading dashboard..."
    }
};

const AdminDashboard: React.FC = () => {
    const { locale, dir } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale as 'ar' | 'en'][key];

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [adminName, setAdminName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        studentLogins: 0,
        teacherLogins: 0
    });

    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [teachersList, setTeachersList] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'books'>('students');

    // مودال الإضافة والتعديل
    const [modalMode, setModalMode] = useState<'addStudent' | 'addTeacher' | 'editStudent' | 'editTeacher' | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [formData, setFormData] = useState({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: 'الصف الخامس', points: 0 });

    useEffect(() => {
        const storedType = localStorage.getItem('user_type');
        const storedUser = localStorage.getItem('current_user');

        if (storedType === 'admin' && storedUser) {
            setIsAdmin(true);
            const user = JSON.parse(storedUser);
            const name = isAr ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
            setAdminName(name.split(' ').slice(0, 2).join(' '));
            fetchAllData();
        } else {
            setIsAdmin(false);
            setIsLoading(false);
        }
    }, [isAr]);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const { data: students, count: sCount } = await supabase.from('students').select('*').order('points', { ascending: false });
            const { data: teachers, count: tCount } = await supabase.from('teachers').select('*');

            if (students) setStudentsList(students);
            if (teachers) setTeachersList(teachers);

            setStats({
                students: sCount || students?.length || 0,
                teachers: tCount || teachers?.length || 0,
                studentLogins: students?.length || 0,
                teacherLogins: teachers?.length || 0
            });
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // حفظ أو إضافة طالب/معلم
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalMode === 'addStudent') {
                const { error } = await supabase.from('students').insert([{
                    student_id: formData.student_id.trim(),
                    name_ar: formData.name_ar,
                    name_en: formData.name_en || formData.name_ar,
                    grade: formData.grade,
                    points: Number(formData.points) || 0
                }]);
                if (error) alert(error.message);
            } else if (modalMode === 'addTeacher') {
                const { error } = await supabase.from('teachers').insert([{
                    teacher_id: formData.teacher_id.trim().toUpperCase(),
                    name_ar: formData.name_ar,
                    name_en: formData.name_en || formData.name_ar
                }]);
                if (error) alert(error.message);
            } else if (modalMode === 'editStudent') {
                const { error } = await supabase.from('students').update({
                    student_id: formData.student_id.trim(),
                    name_ar: formData.name_ar,
                    name_en: formData.name_en,
                    grade: formData.grade
                }).eq('id', selectedItem.id);
                if (error) alert(error.message);
            } else if (modalMode === 'editTeacher') {
                const { error } = await supabase.from('teachers').update({
                    teacher_id: formData.teacher_id.trim().toUpperCase(),
                    name_ar: formData.name_ar,
                    name_en: formData.name_en
                }).eq('id', selectedItem.id);
                if (error) alert(error.message);
            }

            setModalMode(null);
            setSelectedItem(null);
            fetchAllData();
        } catch (err) {
            console.error('Operation error:', err);
        }
    };

    if (isAdmin === false) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4" dir={dir}>
                <div className="text-center text-slate-800 dark:text-white p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-500/50 shadow-2xl max-w-sm w-full">
                    <h2 className="text-lg md:text-xl font-black mb-4 text-rose-500">{t('accessDenied')}</h2>
                    <Link to="/home" className="inline-block w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded-xl font-bold transition-all text-sm">
                        {t('backToHome')}
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-blue-600 dark:text-emerald-400 font-black animate-pulse text-lg md:text-xl">
                {t('loading')}
            </div>
        );
    }

    return (
        <div dir={dir} className="min-h-[100dvh] bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 font-sans p-4 md:p-8 pb-24 transition-colors duration-300">
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
            `}</style>

            {/* الهيدر العلوي */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl mt-4 md:mt-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                        {t('title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mt-1">
                        {t('welcome')} <span className="text-slate-900 dark:text-white font-black">{adminName}</span> | {t('subtitle')}
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {/* زر تبديل الثيم */}
                    <button onClick={toggleTheme} className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm shadow-inner transition-all">
                        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                    </button>
                    <Link to="/home" className="px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 border border-slate-700 rounded-2xl font-bold text-sm transition-all shadow-md text-center">
                        {t('backToHome')}
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* لوحة الإحصائيات الحية */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl">
                    <h2 className="text-lg md:text-xl font-black mb-6 text-rose-500 flex items-center gap-2">
                        <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
                        {t('statsTitle')}
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/80 border border-blue-500/30 p-5 rounded-3xl text-center shadow-sm">
                            <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400">{stats.students}</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase">{t('totalStudents')}</div>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800/80 border border-emerald-500/30 p-5 rounded-3xl text-center shadow-sm">
                            <div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400">{stats.teachers}</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase">{t('totalTeachers')}</div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/80 border border-purple-500/30 p-5 rounded-3xl text-center shadow-sm">
                            <div className="text-3xl md:text-4xl font-black text-purple-600 dark:text-purple-400">{stats.studentLogins}</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase">{t('studentLogins')}</div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/80 border border-amber-500/30 p-5 rounded-3xl text-center shadow-sm">
                            <div className="text-3xl md:text-4xl font-black text-amber-600 dark:text-amber-400">{stats.teacherLogins}</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase">{t('teacherLogins')}</div>
                        </div>
                    </div>
                </div>

                {/* لوحة الكتب الأكثر طلباً في المكتبة العربية والإنجليزية */}
                <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl">
                        <h3 className="text-base md:text-lg font-black mb-4 text-blue-500 flex items-center gap-2">
                            📖 {t('topBooksTitle')} ({t('arabicBooks')})
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs md:text-sm font-bold">
                                <span>1. سلسلة عالمي الصغير (محمد بن راشد)</span>
                                <span className="bg-blue-500 text-white px-2.5 py-1 rounded-full text-xs">142 فتح</span>
                            </li>
                            <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs md:text-sm font-bold">
                                <span>2. حكيم العرب (مريم القاسمي)</span>
                                <span className="bg-blue-500 text-white px-2.5 py-1 rounded-full text-xs">98 فتح</span>
                            </li>
                            <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs md:text-sm font-bold">
                                <span>3. أسرار الفضاء مع هزاع</span>
                                <span className="bg-blue-500 text-white px-2.5 py-1 rounded-full text-xs">85 فتح</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl">
                        <h3 className="text-base md:text-lg font-black mb-4 text-emerald-500 flex items-center gap-2">
                            📚 {t('topBooksTitle')} ({t('englishBooks')})
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs md:text-sm font-bold">
                                <span>1. My Little World Series</span>
                                <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs">120 opens</span>
                            </li>
                            <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs md:text-sm font-bold">
                                <span>2. Wise Man of the Arabs</span>
                                <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs">112 opens</span>
                            </li>
                            <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs md:text-sm font-bold">
                                <span>3. Space Secrets with Hazza</span>
                                <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs">76 opens</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* أزرار التبديل بين جدول الطلاب والمعلمين */}
                <div className="lg:col-span-4 flex items-center justify-between bg-white dark:bg-slate-900/80 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-6 py-2.5 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                        >
                            {t('studentManagement')} ({studentsList.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('teachers')}
                            className={`px-6 py-2.5 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'teachers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                        >
                            {t('teacherManagement')} ({teachersList.length})
                        </button>
                    </div>

                    <div>
                        {activeTab === 'students' ? (
                            <button onClick={() => { setFormData({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: 'الصف الخامس', points: 0 }); setModalMode('addStudent'); }} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all">
                                {t('addStudentBtn')}
                            </button>
                        ) : (
                            <button onClick={() => { setFormData({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: '', points: 0 }); setModalMode('addTeacher'); }} className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all">
                                {t('addTeacherBtn')}
                            </button>
                        )}
                    </div>
                </div>

                {/* جداول الإدارة (الطلاب أو المعلمين) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        {activeTab === 'students' ? (
                            <table className="w-full text-left rtl:text-right border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs md:text-sm border-b border-slate-200 dark:border-slate-700">
                                        <th className="p-3.5 font-black">{t('colId')}</th>
                                        <th className="p-3.5 font-black">{t('colName')}</th>
                                        <th className="p-3.5 font-black">{t('colGrade')}</th>
                                        <th className="p-3.5 font-black text-center">{t('colPoints')}</th>
                                        <th className="p-3.5 font-black text-center">{t('colActions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsList.map((st) => (
                                        <tr key={st.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-3.5 font-mono font-bold text-xs md:text-sm text-blue-600 dark:text-blue-400">{st.student_id}</td>
                                            <td className="p-3.5 font-bold text-xs md:text-sm">{st.name_ar} / {st.name_en}</td>
                                            <td className="p-3.5 text-xs md:text-sm text-slate-500 dark:text-slate-400">{st.grade}</td>
                                            <td className="p-3.5 text-center font-black text-emerald-600 dark:text-emerald-400">{st.points || 0}</td>
                                            <td className="p-3.5 text-center">
                                                <button onClick={() => { setSelectedItem(st); setFormData({ student_id: st.student_id, teacher_id: '', name_ar: st.name_ar, name_en: st.name_en, grade: st.grade, points: st.points }); setModalMode('editStudent'); }} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all">
                                                    {t('editIdBtn')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left rtl:text-right border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs md:text-sm border-b border-slate-200 dark:border-slate-700">
                                        <th className="p-3.5 font-black">{t('colId')}</th>
                                        <th className="p-3.5 font-black">{t('colName')}</th>
                                        <th className="p-3.5 font-black text-center">{t('colActions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teachersList.map((tch) => (
                                        <tr key={tch.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-3.5 font-mono font-bold text-xs md:text-sm text-indigo-600 dark:text-indigo-400">{tch.teacher_id}</td>
                                            <td className="p-3.5 font-bold text-xs md:text-sm">{tch.name_ar} / {tch.name_en}</td>
                                            <td className="p-3.5 text-center">
                                                <button onClick={() => { setSelectedItem(tch); setFormData({ student_id: '', teacher_id: tch.teacher_id, name_ar: tch.name_ar, name_en: tch.name_en, grade: '', points: 0 }); setModalMode('editTeacher'); }} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all">
                                                    {t('editIdBtn')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>

            {/* نافذة المودال للإضافة والتعديل */}
            {modalMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full">
                        <h3 className="text-lg md:text-xl font-black mb-6 text-slate-900 dark:text-white">
                            {modalMode === 'addStudent' && t('modalAddStudent')}
                            {modalMode === 'addTeacher' && t('modalAddTeacher')}
                            {modalMode === 'editStudent' && t('modalEditStudent')}
                            {modalMode === 'editTeacher' && t('modalEditTeacher')}
                        </h3>

                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            {(modalMode === 'addStudent' || modalMode === 'editStudent') && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('colId')}</label>
                                        <input type="text" value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالعربي</label>
                                        <input type="text" value={formData.name_ar} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالإنجليزي</label>
                                        <input type="text" value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الصف الدراسي</label>
                                        <input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" />
                                    </div>
                                    {modalMode === 'addStudent' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">النقاط الابتدائية</label>
                                            <input type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" />
                                        </div>
                                    )}
                                </>
                            )}

                            {(modalMode === 'addTeacher' || modalMode === 'editTeacher') && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الرقم الوظيفي (مثال: PASS123)</label>
                                        <input type="text" value={formData.teacher_id} onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono uppercase" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالعربي</label>
                                        <input type="text" value={formData.name_ar} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالإنجليزي</label>
                                        <input type="text" value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm">
                                    {t('cancelBtn')}
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-md">
                                    {t('saveBtn')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
