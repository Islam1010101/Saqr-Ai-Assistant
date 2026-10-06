import React, { useState, useEffect, useMemo } from 'react';
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
        studentLogins: "طلاب قاموا بالدخول",
        teacherLogins: "معلمون قاموا بالدخول",
        topBooksTitle: "أكثر الكتب طلباً وقراءة",
        arabicBooks: "المكتبة العربية",
        englishBooks: "المكتبة الإنجليزية",
        studentManagement: "إدارة الطلاب",
        teacherManagement: "إدارة المعلمين",
        borrowManagement: "الإعارات النشطة",
        pendingRequests: "طلبات معلقة",
        aiReports: "تقارير التحضير الذكي",
        addStudentBtn: "+ إضافة طالب جديد",
        addTeacherBtn: "+ إضافة معلم جديد",
        addBorrowBtn: "+ تسجيل إعارة مباشرة",
        editIdBtn: "تعديل",
        saveBtn: "حفظ التغييرات",
        cancelBtn: "إلغاء",
        approveBtn: "تأكيد الإعارة",
        rejectBtn: "رفض",
        colId: "الرقم التعريفي",
        colName: "الاسم",
        colGrade: "الصف",
        colPoints: "النقاط",
        colActions: "الإجراءات",
        colBook: "الكتاب المستعار",
        colEmail: "البريد الإلكتروني",
        colDate: "تاريخ الإرجاع",
        colReqDate: "تاريخ الطلب",
        colTopic: "موضوع الدرس",
        colType: "نوع التحضير",
        colReportDate: "تاريخ التحضير",
        modalAddStudent: "إضافة طالب جديد",
        modalAddTeacher: "إضافة معلم جديد",
        modalEditStudent: "تعديل بيانات الطالب",
        modalEditTeacher: "تعديل بيانات المعلم",
        modalAddBorrow: "تسجيل إعارة جديدة",
        modalApproveBorrow: "تأكيد طلب الإعارة",
        accessDenied: "عذراً، هذه الصفحة مخصصة لمدير النظام فقط.",
        loading: "جاري تحليل البيانات الحية...",
        searchPlaceholder: "ابحث بالاسم أو الرقم أو الإيميل أو الموضوع...",
        noResults: "لا توجد نتائج مطابقة."
    },
    en: {
        title: "Command Center",
        subtitle: "Smart Library Management System",
        welcome: "Welcome Mr.",
        backToHome: "Back to Home",
        statsTitle: "Live Statistics",
        totalStudents: "Total Students",
        totalTeachers: "Total Teachers",
        studentLogins: "Students Logged In",
        teacherLogins: "Teachers Logged In",
        topBooksTitle: "Most Popular Digital Books",
        arabicBooks: "Arabic Library",
        englishBooks: "English Library",
        studentManagement: "Student Management",
        teacherManagement: "Teacher Management",
        borrowManagement: "Active Borrowings",
        pendingRequests: "Pending Requests",
        aiReports: "Smart Planning Reports",
        addStudentBtn: "+ Add New Student",
        addTeacherBtn: "+ Add New Teacher",
        addBorrowBtn: "+ Direct Borrowing",
        editIdBtn: "Edit",
        saveBtn: "Save Changes",
        cancelBtn: "Cancel",
        approveBtn: "Approve",
        rejectBtn: "Reject",
        colId: "ID Number",
        colName: "Name",
        colGrade: "Grade",
        colPoints: "Points",
        colActions: "Actions",
        colBook: "Borrowed Book",
        colEmail: "Email",
        colDate: "Return Date",
        colReqDate: "Request Date",
        colTopic: "Lesson Topic",
        colType: "Plan Type",
        colReportDate: "Prep Date",
        modalAddStudent: "Add New Student",
        modalAddTeacher: "Add New Teacher",
        modalEditStudent: "Edit Student Info",
        modalEditTeacher: "Edit Teacher Info",
        modalAddBorrow: "Register New Borrowing",
        modalApproveBorrow: "Approve Borrow Request",
        accessDenied: "Access Denied. Admin privileges required.",
        loading: "Loading live dashboard data...",
        searchPlaceholder: "Search by name, ID, email or topic...",
        noResults: "No matching results found."
    }
};

const SearchSvg = () => (
    <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const AdminDashboard: React.FC = () => {
    const { locale, dir } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale as 'ar' | 'en'][key];

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [adminName, setAdminName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState({ students: 0, teachers: 0, studentLogins: 0, teacherLogins: 0 });
    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [teachersList, setTeachersList] = useState<any[]>([]);
    const [borrowingsList, setBorrowingsList] = useState<any[]>([]);
    const [pendingRequestsList, setPendingRequestsList] = useState<any[]>([]);
    const [lessonReportsList, setLessonReportsList] = useState<any[]>([]);
    
    // التبويبات المتاحة
    const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'borrowings' | 'pending' | 'reports'>('pending');

    const [searchQuery, setSearchQuery] = useState('');

    // متغيرات المودال
    const [modalMode, setModalMode] = useState<'addStudent' | 'addTeacher' | 'editStudent' | 'editTeacher' | 'addBorrow' | 'approveBorrow' | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [formData, setFormData] = useState({ 
        student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: 'الصف الخامس', points: 0,
        user_id: '', user_type: 'student', user_email: '', book_name: '', return_date: ''
    });

    useEffect(() => {
        const storedType = localStorage.getItem('user_type');
        const storedUser = localStorage.getItem('current_user');

        if (storedType === 'admin' && storedUser) {
            setIsAdmin(true);
            const user = JSON.parse(storedUser);
            const name = isAr ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
            setAdminName(name.split(' ').slice(0, 2).join(' '));
            fetchRealDashboardData();
        } else {
            setIsAdmin(false);
            setIsLoading(false);
        }
    }, [isAr]);

    const fetchRealDashboardData = async () => {
        setIsLoading(true);
        try {
            const { count: sCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
            const { count: tCount } = await supabase.from('teachers').select('*', { count: 'exact', head: true });

            const { data: loginLogs } = await supabase.from('login_logs').select('user_id, user_type');
            const uniqueStudentLogins = new Set(loginLogs?.filter(l => l.user_type === 'student').map(l => l.user_id)).size;
            const uniqueTeacherLogins = new Set(loginLogs?.filter(l => l.user_type === 'teacher' || l.user_type === 'admin').map(l => l.user_id)).size;

            let allStudents: any[] = [];
            let step = 1000, start = 0; let fetchMore = true;
            while (fetchMore) {
                const { data, error } = await supabase.from('students').select('*').order('points', { ascending: false }).range(start, start + step - 1);
                if (error || !data || data.length === 0) fetchMore = false;
                else { allStudents = [...allStudents, ...data]; if (data.length < step) fetchMore = false; else start += step; }
            }

            let allTeachers: any[] = [];
            let tStep = 1000, tStart = 0; let fetchMoreT = true;
            while (fetchMoreT) {
                const { data, error } = await supabase.from('teachers').select('*').range(tStart, tStart + tStep - 1);
                if (error || !data || data.length === 0) fetchMoreT = false;
                else { allTeachers = [...allTeachers, ...data]; if (data.length < tStep) fetchMoreT = false; else tStart += tStep; }
            }

            // جلب الإعارات النشطة
            const { data: activeBorrowings } = await supabase.from('borrowings').select('*').eq('status', 'active').order('created_at', { ascending: false });
            
            // جلب الطلبات المعلقة
            const { data: pendingRequests } = await supabase.from('borrowings').select('*').eq('status', 'pending').order('created_at', { ascending: false });

            // جلب تقارير تحضير الدروس
            const { data: reports } = await supabase.from('lesson_reports').select('*').order('created_at', { ascending: false });

            setStudentsList(allStudents);
            setTeachersList(allTeachers);
            setBorrowingsList(activeBorrowings || []);
            setPendingRequestsList(pendingRequests || []);
            setLessonReportsList(reports || []);

            setStats({
                students: sCount || allStudents.length || 0,
                teachers: tCount || allTeachers.length || 0,
                studentLogins: uniqueStudentLogins,
                teacherLogins: uniqueTeacherLogins
            });
        } catch (err) {
            console.error('Error fetching admin stats:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // فلترة الجداول
    const filteredList = useMemo(() => {
        const term = searchQuery.toLowerCase().trim();
        if (activeTab === 'students') {
            if (!term) return studentsList;
            return studentsList.filter(st => (st.name_ar && st.name_ar.toLowerCase().includes(term)) || (st.student_id && st.student_id.toLowerCase().includes(term)));
        } else if (activeTab === 'teachers') {
            if (!term) return teachersList;
            return teachersList.filter(tch => (tch.name_ar && tch.name_ar.toLowerCase().includes(term)) || (tch.teacher_id && tch.teacher_id.toLowerCase().includes(term)));
        } else if (activeTab === 'borrowings') {
            if (!term) return borrowingsList;
            return borrowingsList.filter(b => (b.user_id && b.user_id.toLowerCase().includes(term)) || (b.book_name && b.book_name.toLowerCase().includes(term)) || (b.user_email && b.user_email.toLowerCase().includes(term)));
        } else if (activeTab === 'pending') {
            if (!term) return pendingRequestsList;
            return pendingRequestsList.filter(p => (p.user_id && p.user_id.toLowerCase().includes(term)) || (p.book_name && p.book_name.toLowerCase().includes(term)) || (p.user_email && p.user_email.toLowerCase().includes(term)));
        } else {
            if (!term) return lessonReportsList;
            return lessonReportsList.filter(r => (r.teacher_name && r.teacher_name.toLowerCase().includes(term)) || (r.lesson_topic && r.lesson_topic.toLowerCase().includes(term)) || (r.teacher_id && r.teacher_id.toLowerCase().includes(term)));
        }
    }, [studentsList, teachersList, borrowingsList, pendingRequestsList, lessonReportsList, searchQuery, activeTab]);

    const handleReturnBook = async (id: number) => {
        try {
            await supabase.from('borrowings').update({ status: 'returned' }).eq('id', id);
            fetchRealDashboardData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRejectRequest = async (id: number) => {
        if(window.confirm(isAr ? 'هل أنت متأكد من رفض طلب الاستعارة؟' : 'Are you sure you want to reject this request?')) {
            try {
                await supabase.from('borrowings').update({ status: 'rejected' }).eq('id', id);
                fetchRealDashboardData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalMode === 'addStudent') {
                await supabase.from('students').insert([{ student_id: formData.student_id.trim(), name_ar: formData.name_ar, name_en: formData.name_en || formData.name_ar, grade: formData.grade, points: Number(formData.points) || 0 }]);
            } else if (modalMode === 'addTeacher') {
                await supabase.from('teachers').insert([{ teacher_id: formData.teacher_id.trim().toUpperCase(), name_ar: formData.name_ar, name_en: formData.name_en || formData.name_ar }]);
            } else if (modalMode === 'editStudent') {
                await supabase.from('students').update({ student_id: formData.student_id.trim(), name_ar: formData.name_ar, name_en: formData.name_en, grade: formData.grade }).eq('id', selectedItem.id);
            } else if (modalMode === 'editTeacher') {
                await supabase.from('teachers').update({ teacher_id: formData.teacher_id.trim().toUpperCase(), name_ar: formData.name_ar, name_en: formData.name_en }).eq('id', selectedItem.id);
            } else if (modalMode === 'addBorrow') {
                await supabase.from('borrowings').insert([{ 
                    user_id: formData.user_id.trim(), 
                    user_type: formData.user_type, 
                    user_email: formData.user_email.trim(), 
                    book_name: formData.book_name, 
                    borrow_date: new Date().toISOString().split('T')[0],
                    return_date: formData.return_date,
                    status: 'active'
                }]);
                
                if (formData.user_email) {
                    await supabase.functions.invoke('send-borrow-email', { body: { email: formData.user_email.trim(), book: formData.book_name, date: formData.return_date } });
                }
            } else if (modalMode === 'approveBorrow') {
                // تأكيد الطلب المعلق
                await supabase.from('borrowings').update({ 
                    status: 'active',
                    user_email: formData.user_email.trim(),
                    return_date: formData.return_date
                }).eq('id', selectedItem.id);

                if (formData.user_email) {
                    await supabase.functions.invoke('send-borrow-email', { body: { email: formData.user_email.trim(), book: formData.book_name, date: formData.return_date } });
                }
            }

            setModalMode(null);
            setSelectedItem(null);
            fetchRealDashboardData();
        } catch (err) {
            console.error('Operation error:', err);
        }
    };

    if (isAdmin === false) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4" dir={dir}>
                <div className="text-center text-slate-800 dark:text-white p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-500/50 shadow-2xl max-w-sm w-full">
                    <h2 className="text-lg md:text-xl font-black mb-4 text-rose-500">{t('accessDenied')}</h2>
                    <Link to="/home" className="inline-block w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded-xl font-bold transition-all text-sm">{t('backToHome')}</Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-blue-600 dark:text-emerald-400 font-black animate-pulse text-lg md:text-xl">{t('loading')}</div>;
    }

    return (
        <div dir={dir} className="min-h-[100dvh] bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 font-sans p-4 md:p-8 pb-24 transition-colors duration-300">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap'); * { font-family: 'Cairo', sans-serif !important; }`}</style>

            {/* الهيدر العلوي */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl mt-4 md:mt-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">{t('title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mt-1">{t('welcome')} <span className="text-slate-900 dark:text-white font-black">{adminName}</span> | {t('subtitle')}</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button onClick={toggleTheme} className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm shadow-inner transition-all">{theme === 'light' ? '🌙 Dark' : '☀️ Light'}</button>
                    <Link to="/home" className="px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 border border-slate-700 rounded-2xl font-bold text-sm transition-all shadow-md text-center">{t('backToHome')}</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* إحصائيات الدخول */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl">
                    <h2 className="text-lg md:text-xl font-black mb-6 text-rose-500 flex items-center gap-2"><span className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>{t('statsTitle')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/80 border border-blue-500/30 p-5 rounded-3xl text-center shadow-sm"><div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400">{stats.students}</div><div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase">{t('totalStudents')}</div></div>
                        <div className="bg-slate-50 dark:bg-slate-800/80 border border-emerald-500/30 p-5 rounded-3xl text-center shadow-sm"><div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400">{stats.teachers}</div><div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase">{t('totalTeachers')}</div></div>
                        <div className="bg-slate-50 dark:bg-slate-800/80 border border-purple-500/30 p-5 rounded-3xl text-center shadow-sm"><div className="text-3xl md:text-4xl font-black text-purple-600 dark:text-purple-400">{stats.studentLogins}</div><div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase">{t('studentLogins')}</div></div>
                        <div className="bg-slate-50 dark:bg-slate-800/80 border border-amber-500/30 p-5 rounded-3xl text-center shadow-sm"><div className="text-3xl md:text-4xl font-black text-amber-600 dark:text-amber-400">{stats.teacherLogins}</div><div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase">{t('teacherLogins')}</div></div>
                    </div>
                </div>

                {/* أزرار التبديل والتحكم */}
                <div className="lg:col-span-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/90 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
                    <div className="flex gap-2 w-full md:w-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-thin">
                        <button onClick={() => { setActiveTab('pending'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all relative ${activeTab === 'pending' ? 'bg-rose-500 text-white shadow-md' : 'bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400'}`}>
                            {t('pendingRequests')}
                            {pendingRequestsList.length > 0 && <span className="absolute -top-2 -end-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md animate-bounce">{pendingRequestsList.length}</span>}
                        </button>
                        <button onClick={() => { setActiveTab('borrowings'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'borrowings' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{t('borrowManagement')} ({borrowingsList.length})</button>
                        <button onClick={() => { setActiveTab('students'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{t('studentManagement')} ({studentsList.length})</button>
                        <button onClick={() => { setActiveTab('teachers'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'teachers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{t('teacherManagement')} ({teachersList.length})</button>
                        <button onClick={() => { setActiveTab('reports'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'reports' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{t('aiReports')} ({lessonReportsList.length})</button>
                    </div>

                    <div className="w-full md:w-auto flex justify-end shrink-0">
                        {activeTab === 'students' && <button onClick={() => { setFormData({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: 'الصف الخامس', points: 0, user_id: '', user_type: 'student', user_email: '', book_name: '', return_date: '' }); setModalMode('addStudent'); }} className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all text-center">{t('addStudentBtn')}</button>}
                        {activeTab === 'teachers' && <button onClick={() => { setFormData({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: '', points: 0, user_id: '', user_type: 'student', user_email: '', book_name: '', return_date: '' }); setModalMode('addTeacher'); }} className="w-full md:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all text-center">{t('addTeacherBtn')}</button>}
                        {activeTab === 'borrowings' && <button onClick={() => { setFormData({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: '', points: 0, user_id: '', user_type: 'student', user_email: '', book_name: '', return_date: '' }); setModalMode('addBorrow'); }} className="w-full md:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all text-center">{t('addBorrowBtn')}</button>}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 backdrop-blur-md p-4 md:p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 shadow-md">
                    <div className="relative group">
                        <input type="text" placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-4 ps-14 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 focus:border-amber-400 rounded-2xl outline-none font-bold text-sm md:text-base shadow-inner transition-colors" />
                        <div className="absolute start-4 top-1/2 -translate-y-1/2"><SearchSvg /></div>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
                        <table className="w-full text-left rtl:text-right border-collapse min-w-[600px]">
                            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
                                <tr className="text-slate-600 dark:text-slate-300 text-xs md:text-sm border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-3.5 font-black">{t('colId')}</th>
                                    {activeTab !== 'borrowings' && activeTab !== 'pending' && <th className="p-3.5 font-black">{t('colName')}</th>}
                                    
                                    {activeTab === 'students' && <th className="p-3.5 font-black">{t('colGrade')}</th>}
                                    {activeTab === 'students' && <th className="p-3.5 font-black text-center">{t('colPoints')}</th>}
                                    
                                    {(activeTab === 'borrowings' || activeTab === 'pending') && <th className="p-3.5 font-black">{t('colBook')}</th>}
                                    {(activeTab === 'borrowings' || activeTab === 'pending') && <th className="p-3.5 font-black">{t('colEmail')}</th>}
                                    {activeTab === 'borrowings' && <th className="p-3.5 font-black">{t('colDate')}</th>}
                                    {activeTab === 'pending' && <th className="p-3.5 font-black">{t('colReqDate')}</th>}

                                    {activeTab === 'reports' && <th className="p-3.5 font-black">{t('colTopic')}</th>}
                                    {activeTab === 'reports' && <th className="p-3.5 font-black text-center">{t('colType')}</th>}
                                    {activeTab === 'reports' && <th className="p-3.5 font-black">{t('colReportDate')}</th>}

                                    {activeTab !== 'reports' && <th className="p-3.5 font-black text-center">{t('colActions')}</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.length > 0 ? (
                                    filteredList.map((item: any) => (
                                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-3.5 font-mono font-bold text-xs md:text-sm text-blue-600 dark:text-blue-400">
                                                {activeTab === 'students' ? item.student_id : activeTab === 'teachers' ? item.teacher_id : (item.user_id || item.teacher_id)}
                                            </td>
                                            
                                            {activeTab !== 'borrowings' && activeTab !== 'pending' && <td className="p-3.5 font-bold text-xs md:text-sm">{activeTab === 'reports' ? item.teacher_name : item.name_ar}</td>}
                                            
                                            {activeTab === 'students' && <td className="p-3.5 text-xs md:text-sm text-slate-500 dark:text-slate-400">{item.grade}</td>}
                                            {activeTab === 'students' && <td className="p-3.5 text-center font-black text-emerald-600 dark:text-emerald-400">{item.points || 0}</td>}
                                            
                                            {(activeTab === 'borrowings' || activeTab === 'pending') && <td className="p-3.5 font-bold text-xs md:text-sm text-rose-500">{item.book_name}</td>}
                                            
                                            {/* خانة الإيميل للطلبات والإعارات */}
                                            {(activeTab === 'borrowings' || activeTab === 'pending') && (
                                                <td className="p-3.5 font-mono text-xs md:text-sm text-slate-600 dark:text-slate-300">
                                                    {item.user_email || <span className="text-slate-400 italic">--</span>}
                                                </td>
                                            )}

                                            {activeTab === 'borrowings' && <td className="p-3.5 text-xs md:text-sm text-slate-500">{item.return_date}</td>}
                                            {activeTab === 'pending' && <td className="p-3.5 text-xs md:text-sm text-slate-500">{item.borrow_date}</td>}
                                            
                                            {activeTab === 'reports' && <td className="p-3.5 font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100">{item.lesson_topic}</td>}
                                            {activeTab === 'reports' && <td className="p-3.5 text-center font-black text-xs md:text-sm text-indigo-600 dark:text-indigo-400">{item.plan_type}</td>}
                                            {activeTab === 'reports' && <td className="p-3.5 text-xs md:text-sm text-slate-500">{new Date(item.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</td>}

                                            {activeTab !== 'reports' && (
                                              <td className="p-3.5 flex items-center justify-center gap-2">
                                                  {activeTab === 'borrowings' ? (
                                                      <button onClick={() => handleReturnBook(item.id)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all">إرجاع الكتاب</button>
                                                  ) : activeTab === 'pending' ? (
                                                      <>
                                                          <button onClick={() => { 
                                                              setSelectedItem(item); 
                                                              // تعبئة الإيميل من الطلب القادم مباشرة (سواء طالب أو معلم)
                                                              const autoEmail = item.user_email || (item.user_type === 'student' ? `${item.user_id.trim()}@falcon-school.com` : '');
                                                              setFormData({ ...formData, user_id: item.user_id, user_type: item.user_type, user_email: autoEmail, book_name: item.book_name, return_date: '' }); 
                                                              setModalMode('approveBorrow'); 
                                                          }} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all">{t('approveBtn')}</button>
                                                          <button onClick={() => handleRejectRequest(item.id)} className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all">{t('rejectBtn')}</button>
                                                      </>
                                                  ) : (
                                                      <button onClick={() => { setSelectedItem(item); setFormData({ ...formData, [activeTab === 'students' ? 'student_id' : 'teacher_id']: activeTab === 'students' ? item.student_id : item.teacher_id, name_ar: item.name_ar, name_en: item.name_en, grade: item.grade || '', points: item.points || 0 }); setModalMode(activeTab === 'students' ? 'editStudent' : 'editTeacher'); }} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all">{t('editIdBtn')}</button>
                                                  )}
                                              </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={7} className="p-8 text-center text-slate-400 font-bold text-sm">{t('noResults')}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* المودال */}
            {modalMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-thin">
                        <h3 className="text-lg md:text-xl font-black mb-6 text-slate-900 dark:text-white">
                            {modalMode === 'addStudent' && t('modalAddStudent')}
                            {modalMode === 'addTeacher' && t('modalAddTeacher')}
                            {modalMode === 'editStudent' && t('modalEditStudent')}
                            {modalMode === 'editTeacher' && t('modalEditTeacher')}
                            {modalMode === 'addBorrow' && t('modalAddBorrow')}
                            {modalMode === 'approveBorrow' && t('modalApproveBorrow')}
                        </h3>

                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            {/* حقول الطالب */}
                            {(modalMode === 'addStudent' || modalMode === 'editStudent') && (
                                <>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('colId')}</label><input type="text" value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono" required /></div>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالعربي</label><input type="text" value={formData.name_ar} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" required /></div>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الصف</label><input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" /></div>
                                </>
                            )}

                            {/* حقول المعلم */}
                            {(modalMode === 'addTeacher' || modalMode === 'editTeacher') && (
                                <>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('colId')} (مثال: PASS123)</label><input type="text" value={formData.teacher_id} onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono uppercase" required /></div>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالعربي</label><input type="text" value={formData.name_ar} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" required /></div>
                                </>
                            )}

                            {/* حقول نظام الاستعارة (المباشرة أو تأكيد الطلب المعلق) */}
                            {(modalMode === 'addBorrow' || modalMode === 'approveBorrow') && (
                                <>
                                    {modalMode === 'addBorrow' && (
                                        <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">نوع المستعير</label>
                                            <select 
                                                value={formData.user_type} 
                                                onChange={(e) => {
                                                    const type = e.target.value;
                                                    setFormData({ 
                                                        ...formData, 
                                                        user_type: type, 
                                                        user_email: type === 'student' && formData.user_id ? `${formData.user_id.trim()}@falcon-school.com` : '' 
                                                    });
                                                }} 
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold"
                                            >
                                                <option value="student">طالب</option>
                                                <option value="teacher">معلم</option>
                                            </select>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الرقم التعريفي (ID)</label>
                                        <input 
                                            type="text" 
                                            value={formData.user_id} 
                                            readOnly={modalMode === 'approveBorrow'}
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                setFormData({ 
                                                    ...formData, 
                                                    user_id: id, 
                                                    user_email: formData.user_type === 'student' ? (id ? `${id.trim()}@falcon-school.com` : '') : formData.user_email 
                                                });
                                            }} 
                                            className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono ${modalMode === 'approveBorrow' ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'}`} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">البريد الإلكتروني (لإرسال التأكيد)</label>
                                        <input 
                                            type="email" 
                                            value={formData.user_email} 
                                            onChange={(e) => {
                                                if (formData.user_type === 'teacher') {
                                                    setFormData({ ...formData, user_email: e.target.value });
                                                }
                                            }}
                                            readOnly={formData.user_type === 'student'}
                                            className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm ${formData.user_type === 'student' ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'}`} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">اسم الكتاب</label>
                                        <input type="text" value={formData.book_name} readOnly={modalMode === 'approveBorrow'} onChange={(e) => setFormData({ ...formData, book_name: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold ${modalMode === 'approveBorrow' ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'}`} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-amber-600 dark:text-amber-400 mb-1">تاريخ الإرجاع الإلزامي</label>
                                        <input type="date" value={formData.return_date} onChange={(e) => setFormData({ ...formData, return_date: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-4 border-amber-300 dark:border-amber-600 focus:border-amber-500 rounded-2xl font-black outline-none transition-colors" required />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm">{t('cancelBtn')}</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-md">{modalMode === 'approveBorrow' ? t('approveBtn') : t('saveBtn')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
