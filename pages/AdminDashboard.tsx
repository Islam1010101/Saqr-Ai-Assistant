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
        topBooksTitle: "أكثر الكتب طلباً وقراءة في المكتبة",
        arabicBooks: "المكتبة العربية الرقمية",
        englishBooks: "المكتبة الإنجليزية الرقمية",
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
        approveBtn: "تأكيد الإعارة وإرسال الإيميل",
        rejectBtn: "رفض",
        printPdfBtn: "🖨️ طباعة أو تنزيل التقرير (PDF)",
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
        modalApproveBorrow: "تأكيد طلب الإعارة وإرسال الإشعار",
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
        topBooksTitle: "Most Popular & Read Library Books",
        arabicBooks: "Arabic Digital Library",
        englishBooks: "English Digital Library",
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
        approveBtn: "Approve & Send Email",
        rejectBtn: "Reject",
        printPdfBtn: "🖨️ Print / Download PDF Report",
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
        modalApproveBorrow: "Approve Borrow Request & Notify",
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

const getDefaultReturnDate = (days = 15) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

const calculateDurationDays = (borrowDate: string, returnDate: string): number => {
    const start = new Date(borrowDate);
    const end = new Date(returnDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 15;
};

const buildBilingualBorrowEmail = (
    userName: string,
    bookName: string,
    borrowDate: string,
    returnDate: string,
    durationDays: number
) => {
    const subject = `تأكيد استعارة كتاب: ${bookName} | Book Borrowing Confirmation: ${bookName}`;
    const html = `
    <div style="font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; max-width: 650px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); color: #ffffff; padding: 24px; text-align: center;">
            <img src="https://www.efipslibrary.online/school-logo.png" alt="EFIPS Logo" style="width: 75px; height: auto; margin-bottom: 10px;" />
            <h2 style="margin: 0; font-size: 20px;">مكتبة مدرسة صقر الإمارات الدولية الخاصة</h2>
            <p style="margin: 4px 0 0; font-size: 13px; color: #fbbf24;">Emirates Falcon International Private School Library</p>
        </div>
        <div dir="rtl" style="padding: 24px; text-align: right; border-bottom: 2px dashed #cbd5e1; color: #1e293b; line-height: 1.8;">
            <h3 style="color: #059669; margin-top: 0;">✅ تم تأكيد عملية الاستعارة بنجاح</h3>
            <p>مرحباً <strong>${userName || 'عزيزنا القارئ'}</strong>،</p>
            <p>نفيدكم بأنه قد تمت الموافقة بنجاح على طلب استعارة الكتاب الموضح أدناه من مكتبة المدرسة:</p>
            <ul style="background: #f8fafc; padding: 16px 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <li><strong>عنوان الكتاب:</strong> ${bookName}</li>
                <li><strong>تاريخ الاستعارة:</strong> ${borrowDate}</li>
                <li><strong>مدة الاستعارة:</strong> ${durationDays} يوماً</li>
                <li><strong>تاريخ الإرجاع الإلزامي:</strong> <span style="color: #e11d48; font-weight: bold;">${returnDate}</span></li>
            </ul>
            <div style="background: #fff1f2; border-right: 4px solid #e11d48; padding: 12px 16px; border-radius: 8px; margin-top: 16px; color: #9f1239; font-size: 14px;">
                <strong>⚠️ تنبيه هام:</strong> يرجى الالتزام بإرجاع الكتاب في المدة المحددة أعلاه (${returnDate})، وذلك تجنباً لاعتبار الكتاب تالفاً أو مفقوداً وتحميلكم مسؤولية ذلك وفق لوائح المكتبة المدرسية.
            </div>
        </div>
        <div dir="ltr" style="padding: 24px; text-align: left; color: #1e293b; line-height: 1.8;">
            <h3 style="color: #059669; margin-top: 0;">✅ Book Borrowing Successfully Confirmed</h3>
            <p>Dear <strong>${userName || 'Reader'}</strong>,</p>
            <p>We are pleased to inform you that your request to borrow the following book from the school library has been approved:</p>
            <ul style="background: #f8fafc; padding: 16px 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <li><strong>Book Title:</strong> ${bookName}</li>
                <li><strong>Borrow Date:</strong> ${borrowDate}</li>
                <li><strong>Borrowing Duration:</strong> ${durationDays} days</li>
                <li><strong>Mandatory Return Date:</strong> <span style="color: #e11d48; font-weight: bold;">${returnDate}</span></li>
            </ul>
            <div style="background: #fff1f2; border-left: 4px solid #e11d48; padding: 12px 16px; border-radius: 8px; margin-top: 16px; color: #9f1239; font-size: 14px;">
                <strong>⚠️ Important Notice:</strong> Please ensure that the book is returned within the specified period (by ${returnDate}) to avoid the book being considered damaged or lost under school library regulations.
            </div>
        </div>
        <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
            مع تحيات المساعد الذكي صقر - مكتبة مدرسة صقر الإمارات الدولية الخاصة (EFIPS)
        </div>
    </div>`;
    return { subject, html };
};

const AdminDashboard: React.FC = () => {
    const { locale, dir } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale as 'ar' | 'en'][key];

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [adminName, setAdminName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [processingRowId, setProcessingRowId] = useState<number | null>(null);

    const [stats, setStats] = useState({ students: 0, teachers: 0, studentLogins: 0, teacherLogins: 0 });
    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [teachersList, setTeachersList] = useState<any[]>([]);
    const [borrowingsList, setBorrowingsList] = useState<any[]>([]);
    const [pendingRequestsList, setPendingRequestsList] = useState<any[]>([]);
    const [lessonReportsList, setLessonReportsList] = useState<any[]>([]);
    
    const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'borrowings' | 'pending' | 'reports'>('pending');

    const [searchQuery, setSearchQuery] = useState('');
    const [borrowingsError, setBorrowingsError] = useState('');
    const [borrowingsNotice, setBorrowingsNotice] = useState('');
    const [isRefreshingBorrowings, setIsRefreshingBorrowings] = useState(false);

    const [modalMode, setModalMode] = useState<'addStudent' | 'addTeacher' | 'editStudent' | 'editTeacher' | 'addBorrow' | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [formData, setFormData] = useState({ 
        student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: 'الصف الخامس', points: 0,
        user_id: '', user_type: 'student', user_email: '', book_name: '', return_date: getDefaultReturnDate(15)
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

    const enrichBorrowingRecords = (records: any[], students: any[], teachers: any[]) => {
        const studentMap = new Map(students.map(s => [String(s.student_id).trim().toLowerCase(), s]));
        const teacherMap = new Map(teachers.map(tc => [String(tc.teacher_id).trim().toLowerCase(), tc]));

        return records.map(rec => {
            const uid = String(rec.user_id || '').trim().toLowerCase();
            const st = studentMap.get(uid);
            const tc = teacherMap.get(uid);
            const resolvedName = rec.user_name || (st ? (st.name_ar || st.name_en) : tc ? (tc.name_ar || tc.name_en) : '');
            const resolvedGrade = rec.user_grade || (st ? st.grade : (tc ? (isAr ? 'معلم' : 'Teacher') : ''));
            const resolvedEmail = rec.user_email || (rec.user_type === 'student' && rec.user_id ? `${String(rec.user_id).trim()}@falcon-school.com` : '');

            return {
                ...rec,
                user_name: resolvedName,
                user_grade: resolvedGrade,
                user_email: resolvedEmail
            };
        });
    };

    const refreshBorrowingsOnly = async (studentsOverride?: any[], teachersOverride?: any[], silent = false) => {
        if (!silent) setIsRefreshingBorrowings(true);
        try {
            let rows: any[] = [];
            const { data: directRows, error } = await supabase
                .from('borrowings')
                .select('*')
                .order('id', { ascending: false });

            if (!error && directRows && directRows.length > 0) {
                rows = directRows;
            } else {
                // محاولة احتياطية عبر الدالة السحابية في حال كان RLS مفعلاً
                const { data: fnData } = await supabase.functions.invoke('send-borrow-email', {
                    body: { action: 'list' }
                });
                if (fnData?.ok) {
                    rows = [...(fnData.pending || []), ...(fnData.active || [])];
                } else if (error) {
                    throw error;
                }
            }

            const sList = studentsOverride || studentsList;
            const tList = teachersOverride || teachersList;
            const enriched = enrichBorrowingRecords(rows, sList, tList);

            setPendingRequestsList(
                enriched.filter(b => {
                    const st = String(b.status ?? 'pending').toLowerCase().trim();
                    return st === 'pending' || st === 'معلق' || st === '' || st === 'waiting';
                })
            );
            setBorrowingsList(
                enriched.filter(b => String(b.status || '').toLowerCase().trim() === 'active')
            );
            setBorrowingsError('');
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setBorrowingsError(message);
        } finally {
            if (!silent) setIsRefreshingBorrowings(false);
        }
    };

    const fetchRealDashboardData = async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
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

            const { data: reports } = await supabase.from('lesson_reports').select('*').order('created_at', { ascending: false });

            setStudentsList(allStudents);
            setTeachersList(allTeachers);
            setLessonReportsList(reports || []);
            setStats({
                students: sCount || allStudents.length || 0,
                teachers: tCount || allTeachers.length || 0,
                studentLogins: uniqueStudentLogins,
                teacherLogins: uniqueTeacherLogins
            });

            await refreshBorrowingsOnly(allStudents, allTeachers);
        } catch (err) {
            console.error('Error fetching admin dashboard data:', err);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    // اشتراك لحظي (Realtime) + تحديث دوري كل 3 ثوانٍ لظهور الطلبات المعلقة فوراً
    useEffect(() => {
        if (isAdmin !== true) return;

        const channel = supabase
            .channel('borrowings-realtime-admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'borrowings' }, () => {
                void refreshBorrowingsOnly(undefined, undefined, true);
            })
            .subscribe();

        const intervalId = window.setInterval(() => {
            void refreshBorrowingsOnly(undefined, undefined, true);
        }, 3000);

        return () => {
            supabase.removeChannel(channel);
            window.clearInterval(intervalId);
        };
    }, [isAdmin, studentsList, teachersList]);

    const sendBilingualConfirmationEmail = async (params: {
        email: string;
        userName: string;
        bookName: string;
        borrowDate: string;
        returnDate: string;
    }) => {
        const durationDays = calculateDurationDays(params.borrowDate, params.returnDate);
        const { subject, html } = buildBilingualBorrowEmail(
            params.userName,
            params.bookName,
            params.borrowDate,
            params.returnDate,
            durationDays
        );

        const { data, error } = await supabase.functions.invoke('send-borrow-email', {
            body: {
                email: params.email,
                to: params.email,
                user_name: params.userName,
                book: params.bookName,
                book_name: params.bookName,
                borrow_date: params.borrowDate,
                date: params.returnDate,
                return_date: params.returnDate,
                duration_days: durationDays,
                subject,
                html
            }
        });

        if (error) throw error;
        return { data, durationDays };
    };

    // الموافقة الفورية بضغطة زر واحدة وإرسال الإيميل تلقائياً
    const handleInstantApprove = async (item: any) => {
        setProcessingRowId(item.id);
        setBorrowingsError('');
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const targetReturnDate = getDefaultReturnDate(15);
            const cleanEmail = (
                item.user_email ||
                (item.user_type === 'student' && item.user_id ? `${String(item.user_id).trim()}@falcon-school.com` : '')
            ).trim();

            const { error: updateErr } = await supabase
                .from('borrowings')
                .update({
                    status: 'active',
                    user_email: cleanEmail,
                    borrow_date: todayStr,
                    return_date: targetReturnDate
                })
                .eq('id', item.id);

            if (updateErr) throw updateErr;

            // نقل الطلب فوراً على الشاشة من المعلقة إلى النشطة
            setPendingRequestsList(prev => prev.filter(p => p.id !== item.id));
            setBorrowingsList(prev => [{ ...item, status: 'active', user_email: cleanEmail, borrow_date: todayStr, return_date: targetReturnDate }, ...prev]);

            if (cleanEmail) {
                try {
                    const { durationDays } = await sendBilingualConfirmationEmail({
                        email: cleanEmail,
                        userName: item.user_name || item.user_id,
                        bookName: item.book_name,
                        borrowDate: todayStr,
                        returnDate: targetReturnDate
                    });
                    setBorrowingsNotice(
                        isAr
                            ? `✅ تمت الموافقة على «${item.book_name}» وإرسال الإيميل باللغتين إلى ${cleanEmail} (المدة: ${durationDays} يوماً - الإرجاع: ${targetReturnDate}).`
                            : `✅ Approved “${item.book_name}” and sent bilingual email to ${cleanEmail}.`
                    );
                } catch (emailErr) {
                    console.error('Email send warning:', emailErr);
                    setBorrowingsNotice(
                        isAr
                            ? `✅ تمت الموافقة وتفعيل الإعارة حتى ${targetReturnDate}، لكن تعذّر إرسال البريد الآلي.`
                            : `✅ Request approved until ${targetReturnDate}, but email sending failed.`
                    );
                }
            } else {
                setBorrowingsNotice(
                    isAr
                        ? `✅ تمت الموافقة على استعارة «${item.book_name}» حتى ${targetReturnDate}.`
                        : `✅ Approved “${item.book_name}” until ${targetReturnDate}.`
                );
            }

            await refreshBorrowingsOnly(undefined, undefined, true);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setBorrowingsError(message);
        } finally {
            setProcessingRowId(null);
        }
    };

    // الرفض الفوري بضغطة زر واحدة
    const handleRejectRequest = async (id: number) => {
        setProcessingRowId(id);
        setBorrowingsError('');
        try {
            const { error } = await supabase.from('borrowings').update({ status: 'rejected' }).eq('id', id);
            if (error) throw error;
            setPendingRequestsList(prev => prev.filter(p => p.id !== id));
            setBorrowingsNotice(isAr ? '🚫 تم رفض طلب الاستعارة.' : '🚫 Borrowing request rejected.');
            await refreshBorrowingsOnly(undefined, undefined, true);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setBorrowingsError(message);
        } finally {
            setProcessingRowId(null);
        }
    };

    const handleReturnBook = async (id: number) => {
        setProcessingRowId(id);
        try {
            const { error } = await supabase.from('borrowings').update({ status: 'returned' }).eq('id', id);
            if (error) throw error;
            setBorrowingsList(prev => prev.filter(b => b.id !== id));
            setBorrowingsNotice(isAr ? '✅ تم تسجيل إرجاع الكتاب بنجاح.' : '✅ Book return recorded.');
            await refreshBorrowingsOnly(undefined, undefined, true);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setBorrowingsError(message);
        } finally {
            setProcessingRowId(null);
        }
    };

    // حساب أكثر الكتب طلباً وقراءة من جدول الإعارات
    const topBooksStats = useMemo(() => {
        const counts: Record<string, number> = {};
        [...borrowingsList, ...pendingRequestsList].forEach(b => {
            if (b.book_name) {
                const name = b.book_name.trim();
                counts[name] = (counts[name] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [borrowingsList, pendingRequestsList]);

    // دالة طباعة أو تنزيل التقرير كملف PDF
    const handlePrintDashboardReport = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const htmlReport = `
                <html dir="${dir}" lang="${locale}">
                <head>
                    <title>${t('title')} - EFIPS</title>
                    <style>
                        @page { size: A4 portrait; margin: 15mm; }
                        body { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; padding: 20px; color: #1e293b; line-height: 1.6; }
                        .header { text-align: center; border-bottom: 3px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
                        .header img { max-width: 90px; height: auto; margin-bottom: 8px; }
                        h1 { margin: 0; font-size: 22px; color: #0f172a; }
                        p { margin: 5px 0; font-size: 13px; color: #64748b; }
                        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
                        .stat-card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; text-align: center; background: #f8fafc; }
                        .stat-num { font-size: 24px; font-weight: 900; color: #2563eb; }
                        .stat-label { font-size: 11px; font-weight: bold; color: #475569; margin-top: 5px; text-transform: uppercase; }
                        h2 { font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 25px; color: #0f172a; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
                        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: ${dir === 'rtl' ? 'right' : 'left'}; }
                        th { background-color: #f1f5f9; font-weight: bold; }
                        @media print { .no-print { display: none !important; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <img src="https://www.efipslibrary.online/school-logo.png" alt="EFIPS Logo" />
                        <h1>${t('title')}</h1>
                        <p>${t('subtitle')} | ${new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</p>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card"><div class="stat-num">${stats.students}</div><div class="stat-label">${t('totalStudents')}</div></div>
                        <div class="stat-card"><div class="stat-num">${stats.teachers}</div><div class="stat-label">${t('totalTeachers')}</div></div>
                        <div class="stat-card"><div class="stat-num">${stats.studentLogins}</div><div class="stat-label">${t('studentLogins')}</div></div>
                        <div class="stat-card"><div class="stat-num">${stats.teacherLogins}</div><div class="stat-label">${t('teacherLogins')}</div></div>
                    </div>

                    <h2>📚 ${t('topBooksTitle')}</h2>
                    <table>
                        <tr><th>#</th><th>${t('colBook')}</th><th>${isAr ? 'عدد مرات الاستعارة' : 'Borrow Count'}</th></tr>
                        ${topBooksStats.length > 0 ? topBooksStats.map(([book, count], idx) => `<tr><td>${idx + 1}</td><td><strong>${book}</strong></td><td>${count}</td></tr>`).join('') : `<tr><td colspan="3" style="text-align:center;">${t('noResults')}</td></tr>`}
                    </table>

                    <h2>📌 ${t('borrowManagement')} (${borrowingsList.length})</h2>
                    <table>
                        <tr><th>${t('colId')}</th><th>${t('colName')}</th><th>${t('colBook')}</th><th>${t('colEmail')}</th><th>${t('colDate')}</th></tr>
                        ${borrowingsList.length > 0 ? borrowingsList.map(b => `<tr><td>${b.user_id}</td><td>${b.user_name \vert{}\vert{} '-'}</td><td>${b.book_name}</td><td>${b.user_email \vert{}\vert{} '-'}</td><td>${b.return_date}</td></tr>`).join('') : `<tr><td colspan="5" style="text-align:center;">${t('noResults')}</td></tr>`}
                    </table>

                    <div style="margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8;">
                        مدرسة صقر الإمارات الدولية الخاصة (EFIPS) - تقرير نظام المكتبة الذكية الآلي
                    </div>
                </body>
                </html>
            `;
            printWindow.document.write(htmlReport);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 600);
        }
    };

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
            return borrowingsList.filter(b => (b.user_id && b.user_id.toLowerCase().includes(term)) || (b.book_name && b.book_name.toLowerCase().includes(term)) || (b.user_email && b.user_email.toLowerCase().includes(term)) || (b.user_name && b.user_name.toLowerCase().includes(term)));
        } else if (activeTab === 'pending') {
            if (!term) return pendingRequestsList;
            return pendingRequestsList.filter(p => (p.user_id && p.user_id.toLowerCase().includes(term)) || (p.book_name && p.book_name.toLowerCase().includes(term)) || (p.user_email && p.user_email.toLowerCase().includes(term)) || (p.user_name && p.user_name.toLowerCase().includes(term)));
        } else {
            if (!term) return lessonReportsList;
            return lessonReportsList.filter(r => (r.teacher_name && r.teacher_name.toLowerCase().includes(term)) || (r.lesson_topic && r.lesson_topic.toLowerCase().includes(term)) || (r.teacher_id && r.teacher_id.toLowerCase().includes(term)));
        }
    }, [studentsList, teachersList, borrowingsList, pendingRequestsList, lessonReportsList, searchQuery, activeTab]);

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setBorrowingsError('');
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
                const todayStr = new Date().toISOString().split('T')[0];
                const targetReturnDate = formData.return_date || getDefaultReturnDate(15);
                const cleanEmail = formData.user_email.trim();

                const { error: insertErr } = await supabase.from('borrowings').insert([{
                    user_id: formData.user_id.trim(),
                    user_type: formData.user_type,
                    user_email: cleanEmail,
                    book_name: formData.book_name.trim(),
                    borrow_date: todayStr,
                    return_date: targetReturnDate,
                    status: 'active'
                }]);

                if (insertErr) throw insertErr;

                try {
                    const { durationDays } = await sendBilingualConfirmationEmail({
                        email: cleanEmail,
                        userName: formData.user_id.trim(),
                        bookName: formData.book_name.trim(),
                        borrowDate: todayStr,
                        returnDate: targetReturnDate
                    });
                    setBorrowingsNotice(isAr ? `✅ تم تسجيل الإعارة وإرسال إيميل التأكيد باللغتين إلى ${cleanEmail} (${durationDays} يوماً).` : `✅ Borrowing registered and bilingual email sent to ${cleanEmail}.`);
                } catch (emailErr) {
                    console.error('Email send warning:', emailErr);
                    setBorrowingsNotice(isAr ? '✅ تم تسجيل الإعارة في النظام، ولكن تعذّر إرسال البريد الآلي.' : '✅ Borrowing saved, but email failed.');
                }
            }

            setModalMode(null);
            setSelectedItem(null);
            await fetchRealDashboardData(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setBorrowingsError(message);
            window.alert(message);
        } finally {
            setIsSubmitting(false);
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

    const previewBorrowDate = new Date().toISOString().split('T')[0];
    const previewReturnDate = formData.return_date || getDefaultReturnDate(15);
    const previewDurationDays = calculateDurationDays(previewBorrowDate, previewReturnDate);

    return (
        <div dir={dir} className="min-h-[100dvh] bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 font-sans p-4 md:p-8 pb-24 transition-colors duration-300">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap'); * { font-family: 'Cairo', sans-serif !important; }`}</style>

            {/* الهيدر العلوي */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl mt-4 md:mt-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">{t('title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mt-1">{t('welcome')} <span className="text-slate-900 dark:text-white font-black">{adminName}</span> | {t('subtitle')}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    <button onClick={handlePrintDashboardReport} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all flex items-center gap-2">
                        {t('printPdfBtn')}
                    </button>
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

                {/* قسم أكثر الكتب قراءة وطلباً */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-lg md:text-xl font-black mb-4 text-amber-500 flex items-center gap-2">
                        📖 {t('topBooksTitle')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {topBooksStats.length > 0 ? (
                            topBooksStats.map(([bookName, count], index) => (
                                <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 border-2 border-amber-200 dark:border-amber-700/50 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                                    <div className="font-black text-slate-900 dark:text-white text-sm md:text-base line-clamp-2">{bookName}</div>
                                    <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                                        <span>المرتبة #{index + 1}</span>
                                        <span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg font-black">{count} استعارة</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-6 text-slate-400 font-bold text-sm">
                                {isAr ? 'لا توجد سجلات استعارة كافية حالياً لعرض الكتب الأكثر طلباً.' : 'No borrowing records found yet.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* أزرار التبديل والتحكم */}
                <div className="lg:col-span-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/90 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
                    <div className="flex gap-2 w-full md:w-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-thin">
                        <button onClick={() => { setActiveTab('pending'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all relative ${activeTab === 'pending' ? 'bg-rose-500 text-white shadow-md' : 'bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400'}`}>
                            {t('pendingRequests')} ({pendingRequestsList.length})
                            {pendingRequestsList.length > 0 && <span className="absolute -top-2 -end-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md animate-bounce">{pendingRequestsList.length}</span>}
                        </button>
                        <button onClick={() => { setActiveTab('borrowings'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'borrowings' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{t('borrowManagement')} ({borrowingsList.length})</button>
                        <button onClick={() => { setActiveTab('students'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{t('studentManagement')} ({studentsList.length})</button>
                        <button onClick={() => { setActiveTab('teachers'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'teachers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{t('teacherManagement')} ({teachersList.length})</button>
                        <button onClick={() => { setActiveTab('reports'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all ${activeTab === 'reports' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{t('aiReports')} ({lessonReportsList.length})</button>
                    </div>

                    <div className="w-full md:w-auto flex items-center gap-2 justify-end shrink-0">
                        {(activeTab === 'pending' || activeTab === 'borrowings') && (
                            <button
                                type="button"
                                disabled={isRefreshingBorrowings}
                                onClick={() => void refreshBorrowingsOnly()}
                                className="px-5 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all"
                            >
                                {isRefreshingBorrowings ? (isAr ? 'جاري التحديث...' : 'Refreshing...') : (isAr ? '🔄 تحديث الطلبات' : '🔄 Refresh Requests')}
                            </button>
                        )}
                        {activeTab === 'students' && <button onClick={() => { setFormData({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: 'الصف الخامس', points: 0, user_id: '', user_type: 'student', user_email: '', book_name: '', return_date: getDefaultReturnDate(15) }); setModalMode('addStudent'); }} className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all text-center">{t('addStudentBtn')}</button>}
                        {activeTab === 'teachers' && <button onClick={() => { setFormData({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: '', points: 0, user_id: '', user_type: 'student', user_email: '', book_name: '', return_date: getDefaultReturnDate(15) }); setModalMode('addTeacher'); }} className="w-full md:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all text-center">{t('addTeacherBtn')}</button>}
                        {activeTab === 'borrowings' && <button onClick={() => { setFormData({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: '', points: 0, user_id: '', user_type: 'student', user_email: '', book_name: '', return_date: getDefaultReturnDate(15) }); setModalMode('addBorrow'); }} className="w-full md:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all text-center">{t('addBorrowBtn')}</button>}
                    </div>
                </div>

                {/* رسائل التنبيه والنجاح */}
                {(borrowingsError || borrowingsNotice) && (
                    <div className="lg:col-span-4 space-y-2">
                        {borrowingsError && (
                            <div role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-bold flex justify-between items-center">
                                <span>{borrowingsError}</span>
                                <button type="button" onClick={() => setBorrowingsError('')} className="underline text-xs">{isAr ? 'إغلاق' : 'Close'}</button>
                            </div>
                        )}
                        {borrowingsNotice && (
                            <div role="status" className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-bold flex justify-between items-center">
                                <span>{borrowingsNotice}</span>
                                <button type="button" onClick={() => setBorrowingsNotice('')} className="underline text-xs">{isAr ? 'إخفاء' : 'Dismiss'}</button>
                            </div>
                        )}
                    </div>
                )}

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
                                                {(activeTab === 'pending' || activeTab === 'borrowings') && (
                                                    <div className="mt-1 font-sans text-xs text-slate-600 dark:text-slate-300">
                                                        {item.user_name || (item.user_type === 'student' ? (isAr ? 'طالب' : 'Student') : (isAr ? 'معلم' : 'Teacher'))}
                                                        {item.user_grade ? ` · ${item.user_grade}` : ''}
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {activeTab !== 'borrowings' && activeTab !== 'pending' && <td className="p-3.5 font-bold text-xs md:text-sm">{activeTab === 'reports' ? item.teacher_name : item.name_ar}</td>}
                                            
                                            {activeTab === 'students' && <td className="p-3.5 text-xs md:text-sm text-slate-500 dark:text-slate-400">{item.grade}</td>}
                                            {activeTab === 'students' && <td className="p-3.5 text-center font-black text-emerald-600 dark:text-emerald-400">{item.points || 0}</td>}
                                            
                                            {(activeTab === 'borrowings' || activeTab === 'pending') && (
                                                <td className="p-3.5 font-bold text-xs md:text-sm text-rose-500">
                                                    {item.book_name}
                                                </td>
                                            )}
                                            
                                            {(activeTab === 'borrowings' || activeTab === 'pending') && (
                                                <td className="p-3.5 font-mono text-xs md:text-sm text-slate-600 dark:text-slate-300">
                                                    {item.user_email || <span className="text-slate-400 italic">--</span>}
                                                </td>
                                            )}

                                            {activeTab === 'borrowings' && <td className="p-3.5 text-xs md:text-sm font-bold text-amber-600 dark:text-amber-400">{item.return_date}</td>}
                                            {activeTab === 'pending' && <td className="p-3.5 text-xs md:text-sm text-slate-500">{item.borrow_date || (item.created_at ? new Date(item.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '-')}</td>}
                                            
                                            {activeTab === 'reports' && <td className="p-3.5 font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100">{item.lesson_topic}</td>}
                                            {activeTab === 'reports' && <td className="p-3.5 text-center font-black text-xs md:text-sm text-indigo-600 dark:text-indigo-400">{item.plan_type}</td>}
                                            {activeTab === 'reports' && <td className="p-3.5 text-xs md:text-sm text-slate-500">{new Date(item.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</td>}

                                            {activeTab !== 'reports' && (
                                              <td className="p-3.5 flex items-center justify-center gap-2">
                                                  {activeTab === 'borrowings' ? (
                                                      <button disabled={processingRowId === item.id} onClick={() => handleReturnBook(item.id)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm transition-all">إرجاع الكتاب</button>
                                                  ) : activeTab === 'pending' ? (
                                                      <>
                                                          <button 
                                                              disabled={processingRowId === item.id}
                                                              onClick={() => handleInstantApprove(item)} 
                                                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                                                          >
                                                              {processingRowId === item.id ? (isAr ? 'جاري التأكيد...' : 'Approving...') : t('approveBtn')}
                                                          </button>
                                                          <button 
                                                              disabled={processingRowId === item.id}
                                                              onClick={() => handleRejectRequest(item.id)} 
                                                              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                                                          >
                                                              {t('rejectBtn')}
                                                          </button>
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

            {/* المودال لإضافة وتعديل الطلاب والمعلمين والإعارات المباشرة */}
            {modalMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-thin">
                        <h3 className="text-lg md:text-xl font-black mb-6 text-slate-900 dark:text-white">
                            {modalMode === 'addStudent' && t('modalAddStudent')}
                            {modalMode === 'addTeacher' && t('modalAddTeacher')}
                            {modalMode === 'editStudent' && t('modalEditStudent')}
                            {modalMode === 'editTeacher' && t('modalEditTeacher')}
                            {modalMode === 'addBorrow' && t('modalAddBorrow')}
                        </h3>

                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            {(modalMode === 'addStudent' || modalMode === 'editStudent') && (
                                <>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('colId')}</label><input type="text" value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono" required /></div>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالعربي</label><input type="text" value={formData.name_ar} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" required /></div>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الصف</label><input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" /></div>
                                </>
                            )}

                            {(modalMode === 'addTeacher' || modalMode === 'editTeacher') && (
                                <>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('colId')} (مثال: PASS123)</label><input type="text" value={formData.teacher_id} onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono uppercase" required /></div>
                                    <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالعربي</label><input type="text" value={formData.name_ar} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" required /></div>
                                </>
                            )}

                            {modalMode === 'addBorrow' && (
                                <>
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
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الرقم التعريفي (ID)</label>
                                        <input 
                                            type="text" 
                                            value={formData.user_id} 
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                setFormData({ 
                                                    ...formData, 
                                                    user_id: id, 
                                                    user_email: formData.user_type === 'student' ? (id ? `${id.trim()}@falcon-school.com` : '') : formData.user_email 
                                                });
                                            }} 
                                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">البريد الإلكتروني للمستعير (لإرسال الإشعار باللغتين)</label>
                                        <input 
                                            type="email" 
                                            value={formData.user_email} 
                                            onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                                            readOnly={formData.user_type === 'student'}
                                            className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm ${formData.user_type === 'student' ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'}`} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">عنوان الكتاب</label>
                                        <input type="text" value={formData.book_name} onChange={(e) => setFormData({ ...formData, book_name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-amber-600 dark:text-amber-400 mb-1">
                                            تاريخ الإرجاع الإلزامي (مدة الاستعارة: {previewDurationDays} يوماً)
                                        </label>
                                        <input 
                                            type="date" 
                                            value={formData.return_date} 
                                            min={previewBorrowDate}
                                            onChange={(e) => setFormData({ ...formData, return_date: e.target.value })} 
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-4 border-amber-300 dark:border-amber-600 focus:border-amber-500 rounded-2xl font-black outline-none transition-colors" 
                                            required 
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm">{t('cancelBtn')}</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-2xl font-black text-sm shadow-md">
                                    {isSubmitting ? (isAr ? 'جاري التنفيذ...' : 'Processing...') : t('saveBtn')}
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
