import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useTheme } from '../App';
import { supabase } from '../src/utils/supabase';
import { printA4Html } from '../src/utils/printA4Html';
import AdminReadingChallenge from '../src/components/AdminReadingChallenge';
import AdminLibraryAttendance from '../src/components/AdminLibraryAttendance';
import AdminInsightsPanels from '../src/components/AdminInsightsPanels';
import { bookData } from '../api/bookData';
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

const translations = {
    ar: {
        title: 'مركز القيادة الموحد', subtitle: 'نظام إدارة المكتبة الذكية (EFIPS)', welcome: 'مرحباً بك أستاذ', backToHome: 'العودة للرئيسية',
        statsTitle: 'إحصائيات النظام الحية', totalStudents: 'إجمالي الطلاب', totalTeachers: 'إجمالي المعلمين', studentLogins: 'طلاب قاموا بالدخول', teacherLogins: 'معلمون قاموا بالدخول',
        topBooksTitle: 'أكثر الكتب طلباً وقراءة في المكتبة', arabicBooks: 'المكتبة العربية الرقمية', englishBooks: 'المكتبة الإنجليزية الرقمية',
        digitalReadAnalyticsTitle: 'أكثر الكتب قراءة في المكتبات الرقمية', digitalReadCount: 'مرات الفتح / القراءة', noDigitalReads: 'لا توجد قراءات رقمية مسجلة لهذا القسم حتى الآن.',
        digitalReadsSetupRequired: 'تعذرت قراءة إحصائيات الكتب من جدول book_views. تحقق من صلاحيات قراءة الجدول في Supabase.', studentManagement: 'إدارة الطلاب', teacherManagement: 'إدارة المعلمين',
        borrowManagement: 'الإعارات النشطة', pendingRequests: 'طلبات معلقة', aiReports: 'تقارير التحضير الذكي', addStudentBtn: 'إضافة طالب جديد', addTeacherBtn: 'إضافة معلم جديد',
        addBorrowBtn: 'تسجيل إعارة مباشرة', editIdBtn: 'تعديل', saveBtn: 'حفظ التغييرات', cancelBtn: 'إلغاء', approveBtn: 'تأكيد الإعارة وإرسال الإيميل', rejectBtn: 'رفض',
        printPdfBtn: 'طباعة أو تنزيل التقرير (PDF)', colId: 'الرقم التعريفي', colName: 'الاسم', colGrade: 'الصف', colPoints: 'النقاط', colActions: 'الإجراءات',
        colBook: 'الكتاب المستعار', colEmail: 'البريد الإلكتروني', colDate: 'تاريخ الإرجاع', colReqDate: 'تاريخ الطلب', colTopic: 'موضوع الدرس', colType: 'نوع التحضير', colReportDate: 'تاريخ التحضير',
        modalAddStudent: 'إضافة طالب جديد', modalAddTeacher: 'إضافة معلم جديد', modalEditStudent: 'تعديل بيانات الطالب', modalEditTeacher: 'تعديل بيانات المعلم', modalAddBorrow: 'تسجيل إعارة جديدة',
        accessDenied: 'عذراً، هذه الصفحة مخصصة لمدير النظام فقط.', loading: 'جاري تحليل البيانات الحية...', searchPlaceholder: 'ابحث بالاسم أو الرقم أو الإيميل أو الموضوع...', noResults: 'لا توجد نتائج مطابقة.'
    },
    en: {
        title: 'Command Center', subtitle: 'Smart Library Management System', welcome: 'Welcome', backToHome: 'Back to Home',
        statsTitle: 'Live Statistics', totalStudents: 'Total Students', totalTeachers: 'Total Teachers', studentLogins: 'Students Logged In', teacherLogins: 'Teachers Logged In',
        topBooksTitle: 'Most Popular & Read Library Books', arabicBooks: 'Arabic Digital Library', englishBooks: 'English Digital Library',
        digitalReadAnalyticsTitle: 'Most-Read Digital Library Books', digitalReadCount: 'Opens / Reads', noDigitalReads: 'No digital book reads have been recorded for this section yet.',
        digitalReadsSetupRequired: 'Could not read book analytics from book_views. Check the table read permissions in Supabase.', studentManagement: 'Student Management', teacherManagement: 'Teacher Management',
        borrowManagement: 'Active Borrowings', pendingRequests: 'Pending Requests', aiReports: 'Smart Planning Reports', addStudentBtn: 'Add New Student', addTeacherBtn: 'Add New Teacher',
        addBorrowBtn: 'Direct Borrowing', editIdBtn: 'Edit', saveBtn: 'Save Changes', cancelBtn: 'Cancel', approveBtn: 'Approve & Send Email', rejectBtn: 'Reject',
        printPdfBtn: 'Print / Download PDF Report', colId: 'ID Number', colName: 'Name', colGrade: 'Grade', colPoints: 'Points', colActions: 'Actions',
        colBook: 'Borrowed Book', colEmail: 'Email', colDate: 'Return Date', colReqDate: 'Request Date', colTopic: 'Lesson Topic', colType: 'Plan Type', colReportDate: 'Prep Date',
        modalAddStudent: 'Add New Student', modalAddTeacher: 'Add New Teacher', modalEditStudent: 'Edit Student Info', modalEditTeacher: 'Edit Teacher Info', modalAddBorrow: 'Register New Borrowing',
        accessDenied: 'Access Denied. Admin privileges required.', loading: 'Loading live dashboard data...', searchPlaceholder: 'Search by name, ID, email or topic...', noResults: 'No matching results found.'
    }
};

type IconName = 'search' | 'refresh' | 'printer' | 'moon' | 'sun' | 'grid' | 'graduation-cap' | 'users' | 'trend-up' | 'activity' | 'chart' | 'trophy' | 'book-open' | 'library' | 'clock' | 'clipboard-list' | 'check' | 'x' | 'mail' | 'calendar' | 'user' | 'file-text' | 'return';

const OutlineIcon: React.FC<{ name: IconName; className?: string }> = ({ name, className = 'h-5 w-5' }) => {
    const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const, focusable: false as const };
    switch (name) {
        case 'search': return <svg {...common}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
        case 'refresh': return <svg {...common}><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9A7 7 0 0 1 17.4 6L20 12M4 12l2.6 6A7 7 0 0 0 18.4 15" /></svg>;
        case 'printer': return <svg {...common}><path d="M6 9V3h12v6" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6zM18 12h.01" /></svg>;
        case 'moon': return <svg {...common}><path d="M20.9 13A8.8 8.8 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" /></svg>;
        case 'sun': return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></svg>;
        case 'grid': return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
        case 'graduation-cap': return <svg {...common}><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11.2v4.3c3.7 2.5 8.3 2.5 12 0v-4.3M22 9v6" /></svg>;
        case 'users': return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
        case 'trend-up': return <svg {...common}><path d="m3 17 6-6 4 4 8-8M15 7h6v6" /></svg>;
        case 'activity': return <svg {...common}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>;
        case 'chart': return <svg {...common}><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" rx=".5" /><rect x="13" y="8" width="3" height="10" rx=".5" /><rect x="19" y="5" width="2" height="13" rx=".5" /></svg>;
        case 'trophy': return <svg {...common}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" /></svg>;
        case 'book-open': return <svg {...common}><path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H11v18H4.5A2.5 2.5 0 0 0 2 22V4.5Z" /><path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H13v18h6.5A2.5 2.5 0 0 1 22 22V4.5Z" /></svg>;
        case 'library': return <svg {...common}><path d="M3 21V5l5-2v18M8 21V7l5-2v16M13 21V9l5-2v14M18 21V4l3-1v18M2 21h20" /></svg>;
        case 'clock': return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
        case 'clipboard-list': return <svg {...common}><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4.5h6a1.5 1.5 0 0 0-1.5-2h-3A1.5 1.5 0 0 0 9 4.5ZM9 10h6M9 14h6M9 18h3" /></svg>;
        case 'check': return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
        case 'x': return <svg {...common}><path d="m18 6-12 12M6 6l12 12" /></svg>;
        case 'mail': return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
        case 'calendar': return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
        case 'user': return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>;
        case 'file-text': return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></svg>;
        case 'return': return <svg {...common}><path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-2" /></svg>;
        default: return null;
    }
};

const getDefaultReturnDate = (days = 15) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

const calculateDurationDays = (borrowDate: string, returnDate: string): number => {
    const start = new Date(`${borrowDate}T00:00:00`);
    const end = new Date(`${returnDate}T00:00:00`);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 15;
};

const normalizeBorrowingRecord = (record: any) => {
    const rawStatus = record.status ?? record.request_status ?? record.borrow_status ?? record.state;
    const possibleBooks = record.selected_books ?? record.book_names ?? record.books;
    const booksText = Array.isArray(possibleBooks)
        ? possibleBooks.map((book: any) => typeof book === 'string' ? book : (book?.title ?? book?.book_name ?? book?.book_title ?? '')).filter(Boolean).join('، ')
        : possibleBooks;
    return {
        ...record,
        id: record.id ?? record.request_id ?? record.borrowing_id ?? `${record.user_id ?? record.teacher_id ?? record.student_id ?? 'request'}-${record.book_name ?? record.book_title ?? record.title ?? ''}-${record.created_at ?? record.requested_at ?? ''}`,
        user_id: record.user_id ?? record.teacher_id ?? record.student_id ?? record.borrower_id ?? record.teacher_code ?? record.student_code ?? '',
        user_type: record.user_type ?? (record.teacher_id || record.teacher_code ? 'teacher' : record.student_id || record.student_code ? 'student' : ''),
        user_email: record.user_email ?? record.email ?? record.email_address ?? record.borrower_email ?? '',
        user_name: record.user_name ?? record.borrower_name ?? record.teacher_name ?? record.student_name ?? record.name ?? '',
        book_name: record.book_name ?? record.book_title ?? record.title ?? record.selected_book ?? booksText ?? '',
        status: String(rawStatus ?? 'pending').trim() || 'pending',
        created_at: record.created_at ?? record.requested_at ?? record.createdAt ?? null,
        borrow_date: record.borrow_date ?? record.requested_at ?? record.created_at ?? null,
    };
};

const normalizeBorrowingStatus = (value: unknown) => String(value ?? 'pending').trim().toLowerCase().replace(/[\s-]+/g, '_');
const ACTIVE_BORROWING_STATUSES = new Set(['active', 'approved', 'confirmed', 'borrowed', 'checked_out', 'checkedout', 'معار', 'مستعار']);
const CLOSED_BORROWING_STATUSES = new Set(['returned', 'rejected', 'declined', 'cancelled', 'canceled', 'completed', 'deleted', 'مرفوض', 'مرتجع', 'تم_الإرجاع', 'تم_الارجاع']);
const isActiveBorrowing = (record: any) => ACTIVE_BORROWING_STATUSES.has(normalizeBorrowingStatus(record.status));
const isPendingBorrowing = (record: any) => {
    const status = normalizeBorrowingStatus(record.status);
    return !ACTIVE_BORROWING_STATUSES.has(status) && !CLOSED_BORROWING_STATUSES.has(status);
};

const buildBilingualBorrowEmail = (userName: string, bookName: string, borrowDate: string, returnDate: string, durationDays: number) => {
    const subject = `تأكيد استعارة كتاب: ${bookName} | Book Borrowing Confirmation: ${bookName}`;
    const safe = (value: string) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] as string));
    const name = safe(userName || 'عزيزنا القارئ');
    const book = safe(bookName);
    const borrow = safe(borrowDate);
    const ret = safe(returnDate);
    const html = `
    <div style="font-family:'Cairo','Segoe UI',Tahoma,sans-serif;max-width:650px;margin:0 auto;border:2px solid #e2e8f0;border-radius:20px;overflow:hidden;background:#fff;color:#1e293b">
      <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:24px;text-align:center">
        <img src="https://www.efipslibrary.online/school-logo.png" alt="EFIPS Logo" style="width:75px;height:auto;margin-bottom:10px" />
        <h2 style="margin:0;font-size:20px">مكتبة مدرسة صقر الإمارات الدولية الخاصة</h2>
        <p style="margin:4px 0 0;font-size:13px;color:#fbbf24">Emirates Falcon International Private School Library</p>
      </div>
      <div dir="rtl" style="padding:24px;text-align:right;border-bottom:2px dashed #cbd5e1;line-height:1.8">
        <h3 style="color:#059669;margin-top:0">تم تأكيد عملية الاستعارة بنجاح</h3>
        <p>مرحباً <strong>${name}</strong>،</p><p>نفيدكم بأنه تمت الموافقة على طلب استعارة الكتاب الموضح أدناه من مكتبة المدرسة:</p>
        <ul style="background:#f8fafc;padding:16px 32px;border-radius:12px;border:1px solid #e2e8f0"><li><strong>عنوان الكتاب:</strong> ${book}</li><li><strong>تاريخ الاستعارة:</strong> ${borrow}</li><li><strong>مدة الاستعارة:</strong> ${durationDays} يوماً</li><li><strong>تاريخ الإرجاع الإلزامي:</strong> <span style="color:#e11d48;font-weight:bold">${ret}</span></li></ul>
        <div style="background:#fff1f2;border-right:4px solid #e11d48;padding:12px 16px;border-radius:8px;margin-top:16px;color:#9f1239;font-size:14px"><strong>تنبيه هام:</strong> يرجى الالتزام بإرجاع الكتاب في المدة المحددة أعلاه (${ret}) وفق لوائح المكتبة المدرسية.</div>
      </div>
      <div dir="ltr" style="padding:24px;text-align:left;line-height:1.8">
        <h3 style="color:#059669;margin-top:0">Book Borrowing Successfully Confirmed</h3>
        <p>Dear <strong>${name}</strong>,</p><p>Your request to borrow the following book from the school library has been approved:</p>
        <ul style="background:#f8fafc;padding:16px 32px;border-radius:12px;border:1px solid #e2e8f0"><li><strong>Book Title:</strong> ${book}</li><li><strong>Borrow Date:</strong> ${borrow}</li><li><strong>Borrowing Duration:</strong> ${durationDays} days</li><li><strong>Mandatory Return Date:</strong> <span style="color:#e11d48;font-weight:bold">${ret}</span></li></ul>
        <div style="background:#fff1f2;border-left:4px solid #e11d48;padding:12px 16px;border-radius:8px;margin-top:16px;color:#9f1239;font-size:14px"><strong>Important Notice:</strong> Please return the book by ${ret}, according to school library regulations.</div>
      </div>
      <div style="background:#f1f5f9;padding:14px;text-align:center;font-size:12px;color:#64748b">مع تحيات المساعد الذكي صقر - مكتبة مدرسة صقر الإمارات الدولية الخاصة (EFIPS)</div>
    </div>`;
    return { subject, html };
};

const SearchSvg = () => <OutlineIcon name="search" className="h-5 w-5 text-amber-500" />;

const AdminDashboard: React.FC = () => {
    const { locale, dir } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale as 'ar' | 'en'][key];

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [adminName, setAdminName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [processingRowId, setProcessingRowId] = useState<string | number | null>(null);
    const [stats, setStats] = useState({ students: 0, teachers: 0, studentLogins: 0, teacherLogins: 0 });
    const [loginActivity, setLoginActivity] = useState<any[]>([]);
    const [scheduleSlots, setScheduleSlots] = useState<any[]>([]);
    const [allBorrowingRecords, setAllBorrowingRecords] = useState<any[]>([]);
    const [digitalBookReadStats, setDigitalBookReadStats] = useState<any[]>([]);
    const [digitalBookReadStatsAvailable, setDigitalBookReadStatsAvailable] = useState<boolean | null>(null);
    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [staffEmailDirectory, setStaffEmailDirectory] = useState<Record<string,string>>({});
    const [staffRoleDirectory, setStaffRoleDirectory] = useState<Record<string,string>>({});
    const [accountDisabled, setAccountDisabled] = useState<Record<string,boolean>>({});
    const [accessBusy, setAccessBusy] = useState('');
    const [teachersList, setTeachersList] = useState<any[]>([]);
    const [borrowingsList, setBorrowingsList] = useState<any[]>([]);
    const [pendingRequestsList, setPendingRequestsList] = useState<any[]>([]);
    const [lessonReportsList, setLessonReportsList] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'borrowings' | 'pending' | 'reports'>('pending');
    const [showReadingReport, setShowReadingReport] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [borrowingsError, setBorrowingsError] = useState('');
    const [borrowingsNotice, setBorrowingsNotice] = useState('');
    const [isRefreshingBorrowings, setIsRefreshingBorrowings] = useState(false);
    const fallbackCheckedAt = useRef(0);
    const [modalMode, setModalMode] = useState<'addStudent' | 'addTeacher' | 'editStudent' | 'editTeacher' | 'addBorrow' | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const emptyForm = () => ({ student_id: '', teacher_id: '', name_ar: '', name_en: '', grade: 'الصف الخامس', points: 0, user_id: '', user_type: 'student', user_email: '', book_name: '', return_date: getDefaultReturnDate(15) });
    const [formData, setFormData] = useState(emptyForm);

    const enrichBorrowingRecords = useCallback((records: any[], students: any[], teachers: any[]) => {
        const studentMap = new Map(students.map(s => [String(s.student_id ?? '').trim().toLowerCase(), s]));
        const teacherMap = new Map(teachers.map(tc => [String(tc.teacher_id ?? '').trim().toLowerCase(), tc]));
        return records.map(normalizeBorrowingRecord).map(rec => {
            const uid = String(rec.user_id || '').trim().toLowerCase();
            const st = studentMap.get(uid);
            const tc = teacherMap.get(uid);
            const resolvedName = rec.user_name || (st ? (st.name_ar || st.name_en) : tc ? (tc.name_ar || tc.name_en) : '');
            const resolvedGrade = rec.user_grade || (st ? st.grade : (tc ? (isAr ? 'معلم' : 'Teacher') : ''));
            const resolvedEmail = rec.user_type === 'student' && /^[0-9]{6,7}$/.test(String(rec.user_id ?? ''))
                ? `${String(rec.user_id).trim()}@falcon-school.com`
                : staffEmailDirectory[uid] || rec.user_email || '';
            return { ...rec, user_name: resolvedName, user_grade: resolvedGrade, user_email: resolvedEmail };
        });
    }, [isAr, staffEmailDirectory]);

    const fetchDigitalBookReadStats = useCallback(async () => {
        try {
            const allViews: any[] = [];
            const pageSize = 1000;
            let start = 0;
            let hasMore = true;
            while (hasMore) {
                const { data, error } = await supabase.from('book_views').select('book_title, language, viewed_at').order('viewed_at', { ascending: false }).range(start, start + pageSize - 1);
                if (error) throw error;
                const page = data || [];
                allViews.push(...page);
                hasMore = page.length === pageSize;
                start += page.length;
            }
            const counts = new Map<string, { library_type: 'arabic' | 'english'; book_title: string; read_count: number; last_read_at: string | null }>();
            allViews.forEach((view) => {
                const bookTitle = String(view.book_title || '').trim();
                if (!bookTitle) return;
                const rawLanguage = String(view.language || '').trim().toLowerCase();
                const normalizedLanguage = rawLanguage.replace(/[أإآ]/g, 'ا');
                let libraryType: 'arabic' | 'english' | null = null;
                if (rawLanguage === 'ar' || rawLanguage.includes('arab') || normalizedLanguage.includes('عرب')) libraryType = 'arabic';
                else if (rawLanguage === 'en' || rawLanguage.includes('english') || normalizedLanguage.includes('انجليز')) libraryType = 'english';
                if (!libraryType) return;
                const key = `${libraryType}:${bookTitle.toLocaleLowerCase()}`;
                const viewedAt = view.viewed_at ? String(view.viewed_at) : null;
                const current = counts.get(key);
                if (!current) counts.set(key, { library_type: libraryType, book_title: bookTitle, read_count: 1, last_read_at: viewedAt });
                else {
                    current.read_count += 1;
                    if (viewedAt && (!current.last_read_at || Date.parse(viewedAt) > Date.parse(current.last_read_at))) current.last_read_at = viewedAt;
                }
            });
            setDigitalBookReadStats(Array.from(counts.values()).sort((a, b) => b.read_count - a.read_count || Date.parse(b.last_read_at || '') - Date.parse(a.last_read_at || '')));
            setDigitalBookReadStatsAvailable(true);
        } catch (error) {
            console.warn('Could not read digital book views from book_views:', error);
            setDigitalBookReadStats([]);
            setDigitalBookReadStatsAvailable(false);
        }
    }, []);

    const refreshBorrowingsOnly = useCallback(async (studentsOverride?: any[], teachersOverride?: any[], silent = false, forceFallback = false) => {
        if (!silent) setIsRefreshingBorrowings(true);
        try {
            const { data: directRows, error: directError } = await supabase.from('borrowings').select('*').order('id', { ascending: false });
            const normalizedDirect = (directRows || []).map(normalizeBorrowingRecord);
            const directHasPending = normalizedDirect.some(isPendingBorrowing);
            const now = Date.now();
            const fallbackDue = forceFallback || now - fallbackCheckedAt.current >= 15000;
            const shouldTryFallback = forceFallback || Boolean(directError) || !directHasPending;
            let fallbackRows: any[] = [];
            let fallbackError: any = null;

            // If the table returns no pending requests (or reading it fails), also query the existing Edge Function.
            // The result is merged with table rows instead of replacing them, so pending requests are not hidden by active rows.
            if (shouldTryFallback && fallbackDue) {
                fallbackCheckedAt.current = now;
                const { data: fnData, error: fnError } = await supabase.functions.invoke('send-borrow-email', { body: { action: 'list' } });
                fallbackError = fnError;
                if (!fnError && fnData?.ok) {
                    fallbackRows = [
                        ...(Array.isArray(fnData.pending) ? fnData.pending : []).map((row: any) => normalizeBorrowingRecord({ ...row, status: row.status ?? row.request_status ?? 'pending' })),
                        ...(Array.isArray(fnData.active) ? fnData.active : []).map((row: any) => normalizeBorrowingRecord({ ...row, status: row.status ?? 'active' }))
                    ];
                }
            }

            const merged = new Map<string, any>();
            const identity = (row: any) => {
                const normalized = normalizeBorrowingRecord(row);
                if (normalized.id !== undefined && normalized.id !== null && String(normalized.id).trim() !== '') return `id:${String(normalized.id)}`;
                return `fallback:${String(normalized.user_id || '').trim().toLowerCase()}|${String(normalized.book_name || '').trim().toLowerCase()}|${String(normalized.created_at || '').trim()}`;
            };
            // Keep direct table values authoritative, while using Edge Function rows to fill gaps.
            normalizedDirect.forEach((row) => merged.set(identity(row), row));
            fallbackRows.forEach((row) => {
                const key = identity(row);
                if (!merged.has(key)) merged.set(key, row);
            });
            const rows = Array.from(merged.values());
            setAllBorrowingRecords(rows);

            if (directError && rows.length === 0 && fallbackError) throw new Error(`${directError.message} | ${fallbackError.message}`);
            if (directError && rows.length === 0) throw directError;
            if (!directError && normalizedDirect.length === 0 && fallbackError) {
                // Preserve a readable error only if both available sources yielded no data.
                console.warn('Borrowing list fallback could not be loaded:', fallbackError);
            }

            const sList = studentsOverride || studentsList;
            const tList = teachersOverride || teachersList;
            const enriched = enrichBorrowingRecords(rows, sList, tList);
            setPendingRequestsList(enriched.filter(isPendingBorrowing));
            setBorrowingsList(enriched.filter(isActiveBorrowing));
            setBorrowingsError('');
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setBorrowingsError(isAr ? `تعذر تحميل طلبات الاستعارة: ${message}` : `Could not load borrowing requests: ${message}`);
        } finally {
            if (!silent) setIsRefreshingBorrowings(false);
        }
    }, [studentsList, teachersList, enrichBorrowingRecords, isAr]);

    const fetchRealDashboardData = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const [studentCountResult, teacherCountResult, loginResult, reportResult] = await Promise.all([
                supabase.from('students').select('*', { count: 'exact', head: true }),
                supabase.from('teachers').select('*', { count: 'exact', head: true }),
                supabase.from('login_logs').select('user_id, user_type, login_time'),
                supabase.from('lesson_reports').select('*').order('created_at', { ascending: false })
            ]);
            if (loginResult.error) console.warn('Could not read login logs:', loginResult.error);
            const safeLoginLogs = loginResult.data || [];
            setLoginActivity(safeLoginLogs);

            let allStudents: any[] = [];
            let start = 0;
            const pageSize = 1000;
            while (true) {
                const { data, error } = await supabase.from('students').select('*').order('points', { ascending: false }).range(start, start + pageSize - 1);
                if (error) throw error;
                const page = data || [];
                allStudents = allStudents.concat(page);
                if (page.length < pageSize) break;
                start += pageSize;
            }
            let allTeachers: any[] = [];
            start = 0;
            while (true) {
                const { data, error } = await supabase.from('teachers').select('*').range(start, start + pageSize - 1);
                if (error) throw error;
                const page = data || [];
                allTeachers = allTeachers.concat(page);
                if (page.length < pageSize) break;
                start += pageSize;
            }
            setStudentsList(allStudents);
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                const { data: directory } = await supabase.functions.invoke('admin-verified-library', {
                    body: { action: 'directory' },
                    headers: { Authorization: 'Bearer ' + session.access_token }
                });
                if (directory?.ok && Array.isArray(directory.staff)) {
                    const mapping = Object.fromEntries(directory.staff.map((item: any) => [String(item.teacher_id).toLowerCase(), String(item.email)]));
                    setStaffEmailDirectory(mapping);
                    setStaffRoleDirectory(Object.fromEntries(directory.staff.map((item: any) => [String(item.email).toLowerCase(), String(item.role)])));
                    setAccountDisabled(Object.fromEntries((directory.controls || []).map((item: any) => [String(item.email).toLowerCase(), Boolean(item.disabled_at)])));
                    allTeachers = allTeachers.map(t => ({ ...t, email: mapping[String(t.teacher_id).toLowerCase()] || '' }));
                }
            }
            setTeachersList(allTeachers);
            setLessonReportsList(reportResult.data || []);
            const { data: scheduleRows, error: scheduleError } = await supabase.from('library_schedule').select('id,teacher,subject,grade,user_id');
            if (!scheduleError) setScheduleSlots(scheduleRows || []);
            const studentLogins = new Set(safeLoginLogs.filter((l: any) => String(l.user_type || '').toLowerCase() === 'student').map((l: any) => l.user_id)).size;
            const teacherLogins = new Set(safeLoginLogs.filter((l: any) => ['teacher', 'admin'].includes(String(l.user_type || '').toLowerCase())).map((l: any) => l.user_id)).size;
            setStats({ students: studentCountResult.count ?? allStudents.length, teachers: teacherCountResult.count ?? allTeachers.length, studentLogins, teacherLogins });
            await fetchDigitalBookReadStats();
            await refreshBorrowingsOnly(allStudents, allTeachers, true, true);
        } catch (err) {
            console.error('Error fetching admin dashboard data:', err);
            const message = err instanceof Error ? err.message : String(err);
            setBorrowingsError(isAr ? `تعذر تحميل بعض بيانات لوحة التحكم: ${message}` : `Unable to load some dashboard data: ${message}`);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, [fetchDigitalBookReadStats, refreshBorrowingsOnly, isAr]);

    useEffect(() => {
        try {
            const storedType = localStorage.getItem('user_type');
            const storedUser = localStorage.getItem('current_user');
            if (storedType === 'admin' && storedUser) {
                const user = JSON.parse(storedUser);
                setIsAdmin(true);
                const name = isAr ? (user.name_ar || user.name_en || '') : (user.name_en || user.name_ar || '');
                setAdminName(name.split(' ').slice(0, 2).join(' '));
                void fetchRealDashboardData();
            } else {
                setIsAdmin(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Could not initialize admin dashboard:', error);
            setIsAdmin(false);
            setIsLoading(false);
        }
    // Initialize once per language direction; the callback is intentionally omitted here
    // because it depends on directory arrays updated by the fetch itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAr]);

    useEffect(() => {
        if (isAdmin !== true) return;
        const channel = supabase.channel('borrowings-realtime-admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'borrowings' }, () => { void refreshBorrowingsOnly(undefined, undefined, true); })
            .subscribe();
        const intervalId = window.setInterval(() => { void refreshBorrowingsOnly(undefined, undefined, true); }, 5000);
        return () => { supabase.removeChannel(channel); window.clearInterval(intervalId); };
    }, [isAdmin, refreshBorrowingsOnly]);

    useEffect(() => {
        if (isAdmin !== true) return;
        const channel = supabase.channel('book-views-realtime-admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'book_views' }, () => { void fetchDigitalBookReadStats(); })
            .subscribe();
        const intervalId = window.setInterval(() => { void fetchDigitalBookReadStats(); }, 15000);
        return () => { supabase.removeChannel(channel); window.clearInterval(intervalId); };
    }, [isAdmin, fetchDigitalBookReadStats]);

    useEffect(() => {
        if (isAdmin !== true) return;
        const channel = supabase.channel('login-activity-realtime-admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'login_logs' }, async () => {
                const { data, error } = await supabase.from('login_logs').select('user_id, user_type, login_time');
                if (error) { console.error('Unable to refresh login activity:', error); return; }
                const logs = data || [];
                setLoginActivity(logs);
                setStats((previous) => ({
                    ...previous,
                    studentLogins: new Set(logs.filter((entry: any) => String(entry.user_type || '').toLowerCase() === 'student').map((entry: any) => entry.user_id)).size,
                    teacherLogins: new Set(logs.filter((entry: any) => ['teacher', 'admin'].includes(String(entry.user_type || '').toLowerCase())).map((entry: any) => entry.user_id)).size
                }));
            }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [isAdmin]);

    // Never approve a borrowing or select the recipient from client-side user data.
    // A verified admin Google session is required by the server.
    // Soft account removal keeps lending history, points and Saqr context intact.
    const handleAccountAccess = async (item: any, change: 'disable' | 'enable' | 'role', role?: 'teacher' | 'admin') => {
        const email = String(activeTab === 'students'
            ? (item.student_id ? item.student_id + '@falcon-school.com' : '')
            : (item.email || '')).trim().toLowerCase();
        if (!email) { setBorrowingsError(isAr ? 'لا يوجد بريد مدرسي معتمد لهذا المستخدم.' : 'No approved school email for this user.'); return; }
        const label = String(isAr ? (item.name_ar || item.name_en) : (item.name_en || item.name_ar));
        const message = change === 'disable'
            ? (isAr ? `إيقاف دخول ${label}؟ سيتم الاحتفاظ بسجلاته واستعاراته.` : `Disable access for ${label}? Their borrowing history will remain.`)
            : change === 'role' ? (isAr ? `تغيير صلاحية ${label} إلى ${role === 'admin' ? 'مدير النظام' : 'معلم'}؟` : `Change ${label}'s access to ${role}?`)
            : (isAr ? `إعادة تفعيل دخول ${label}؟` : `Restore access for ${label}?`);
        if (!window.confirm(message)) return;
        setAccessBusy(email); setBorrowingsError(''); setBorrowingsNotice('');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) throw new Error(isAr ? 'يرجى إعادة تسجيل الدخول بحساب الأدمن.' : 'Admin Google sign-in required.');
            const { data, error } = await supabase.functions.invoke('admin-verified-library', {
                body: { action: 'access', email, change, role },
                headers: { Authorization: 'Bearer ' + session.access_token }
            });
            if (error || !data?.ok) throw new Error(data?.error || (isAr ? 'تعذر تعديل الصلاحية.' : 'Could not update access.'));
            if (change === 'role') setStaffRoleDirectory(prev => ({ ...prev, [email]: String(role) }));
            else setAccountDisabled(prev => ({ ...prev, [email]: change === 'disable' }));
            setBorrowingsNotice(isAr ? 'تم تحديث صلاحيات الدخول دون حذف بيانات المستخدم.' : 'Account access updated without deleting user history.');
        } catch (error) {
            setBorrowingsError(error instanceof Error ? error.message : String(error));
        } finally { setAccessBusy(''); }
    };

    const handleInstantApprove = async (item: any) => {
        setProcessingRowId(item.id);
        setBorrowingsError('');
        setBorrowingsNotice('');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) throw new Error(isAr ? 'يرجى تسجيل دخول الأدمن باستخدام Google مرة أخرى.' : 'Please sign in with the admin Google account again.');
            const { data, error } = await supabase.functions.invoke('admin-verified-library', {
                body: { action: 'approve', borrowing_id: item.id },
                headers: { Authorization: 'Bearer ' + session.access_token }
            });
            if (error || !data?.ok) throw new Error(data?.error || (isAr ? 'تعذر اعتماد الاستعارة.' : 'Borrowing approval failed.'));
            setPendingRequestsList(prev => prev.filter(p => String(p.id) !== String(item.id)));
            setBorrowingsNotice(data.emailSent
                ? (isAr ? `تم اعتماد الاستعارة وإرسال التأكيد إلى ${data.email}.` : `Borrowing approved and confirmation sent to ${data.email}.`)
                : (isAr ? 'تم اعتماد الاستعارة، لكن لم يتم تأكيد إرسال البريد؛ راجع حالة الإرسال.' : 'Borrowing approved, but email delivery was not confirmed.'));
            await refreshBorrowingsOnly(undefined, undefined, true, true);
        } catch (err) {
            setBorrowingsError(err instanceof Error ? err.message : String(err));
        } finally {
            setProcessingRowId(null);
        }
    };

    const handleRejectRequest = async (id: string | number) => {
        setProcessingRowId(id); setBorrowingsError(''); setBorrowingsNotice('');
        try {
            const { error } = await supabase.from('borrowings').update({ status: 'rejected' }).eq('id', id);
            if (error) throw error;
            setPendingRequestsList(prev => prev.filter(p => String(p.id) !== String(id)));
            setBorrowingsNotice(isAr ? 'تم رفض طلب الاستعارة.' : 'Borrowing request rejected.');
            await refreshBorrowingsOnly(undefined, undefined, true, true);
        } catch (err) { setBorrowingsError(err instanceof Error ? err.message : String(err)); }
        finally { setProcessingRowId(null); }
    };

    const handleReturnBook = async (id: string | number) => {
        setProcessingRowId(id); setBorrowingsError('');
        try {
            const { error } = await supabase.from('borrowings').update({ status: 'returned' }).eq('id', id);
            if (error) throw error;
            setBorrowingsList(prev => prev.filter(b => String(b.id) !== String(id)));
            setBorrowingsNotice(isAr ? 'تم تسجيل إرجاع الكتاب بنجاح.' : 'Book return recorded.');
            await refreshBorrowingsOnly(undefined, undefined, true, true);
        } catch (err) { setBorrowingsError(err instanceof Error ? err.message : String(err)); }
        finally { setProcessingRowId(null); }
    };

    const topBooksStats = useMemo(() => {
        const counts: Record<string, number> = {};
        [...borrowingsList, ...pendingRequestsList].forEach((b) => { if (b.book_name) { const name = String(b.book_name).trim(); counts[name] = (counts[name] || 0) + 1; } });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, [borrowingsList, pendingRequestsList]);

    const loginActivityStats = useMemo(() => {
        const totals = { students: 0, teachers: 0 };
        loginActivity.forEach((entry) => { const type = String(entry.user_type || '').trim().toLowerCase(); if (type === 'student') totals.students += 1; if (type === 'teacher') totals.teachers += 1; });
        return totals;
    }, [loginActivity]);

    const topUsersStats = useMemo(() => {
        const counts = new Map<string, { user_id: string; user_type: 'student' | 'teacher'; count: number }>();
        loginActivity.forEach((entry) => {
            const type = String(entry.user_type || '').trim().toLowerCase();
            if (type !== 'student' && type !== 'teacher') return;
            const userId = String(entry.user_id ?? '').trim(); if (!userId) return;
            const key = `${type}:${userId.toLowerCase()}`; const existing = counts.get(key);
            if (existing) existing.count += 1; else counts.set(key, { user_id: userId, user_type: type, count: 1 });
        });
        const studentMap = new Map<string, any>(studentsList.map(item => [String(item.student_id ?? '').trim().toLowerCase(), item]));
        const teacherMap = new Map<string, any>(teachersList.map(item => [String(item.teacher_id ?? '').trim().toLowerCase(), item]));
        return Array.from(counts.values()).sort((a, b) => b.count - a.count || a.user_id.localeCompare(b.user_id)).slice(0, 10).map(item => {
            const directoryItem = item.user_type === 'student' ? studentMap.get(item.user_id.toLowerCase()) : teacherMap.get(item.user_id.toLowerCase());
            return { ...item, name: directoryItem ? (isAr ? (directoryItem.name_ar || directoryItem.name_en || item.user_id) : (directoryItem.name_en || directoryItem.name_ar || item.user_id)) : (isAr ? 'غير موجود في سجل المستخدمين' : 'Not found in directory'), categoryLabel: item.user_type === 'student' ? (isAr ? 'طالب' : 'Student') : (isAr ? 'معلم' : 'Teacher') };
        });
    }, [loginActivity, studentsList, teachersList, isAr]);

    const topArabicDigitalReads = useMemo(() => digitalBookReadStats.filter(row => ['arabic', 'ar'].includes(String(row.library_type || '').trim().toLowerCase())).sort((a, b) => Number(b.read_count || 0) - Number(a.read_count || 0)).slice(0, 10), [digitalBookReadStats]);
    const topEnglishDigitalReads = useMemo(() => digitalBookReadStats.filter(row => ['english', 'en'].includes(String(row.library_type || '').trim().toLowerCase())).sort((a, b) => Number(b.read_count || 0) - Number(a.read_count || 0)).slice(0, 10), [digitalBookReadStats]);

    // Read-only impact overview from existing dashboard aggregates; never reads student reading passports.
    const libraryImpact = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);
        const overdue = borrowingsList.filter(b => b.return_date && String(b.return_date).slice(0, 10) < today).length;
        const digitalOpens = digitalBookReadStats.reduce((total, row) => total + Number(row.read_count || 0), 0);
        return { active: borrowingsList.length, pending: pendingRequestsList.length, overdue,
            lessonPlans: lessonReportsList.length, digitalOpens: Number.isFinite(digitalOpens) ? digitalOpens : 0,
            uniqueTitles: new Set([...borrowingsList,...pendingRequestsList].map(b => String(b.book_name || '').trim().toLowerCase()).filter(Boolean)).size };
    }, [borrowingsList, pendingRequestsList, lessonReportsList, digitalBookReadStats]);

    const safePrintText = (value: any) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character] as string));
    const handlePrintDashboardReport = () => {
        const htmlReport = `
        <html dir="${dir}" lang="${locale}"><head><title>${t('title')} - EFIPS</title><style>
        @page{size:A4 portrait;margin:13mm 11mm 15mm}
         *{box-sizing:border-box}body{font-family:'Cairo',Tahoma,'Segoe UI',sans-serif;margin:0;padding:0;color:#172033;line-height:1.55;font-size:10px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
         .header{text-align:center;border-bottom:3px solid #0d8875;padding-bottom:12px;margin-bottom:12px;break-inside:avoid}
         .header img{max-width:70px;max-height:70px;object-fit:contain;margin-bottom:5px}
         h1{margin:0;font-size:18px;font-weight:900;color:#0c695e}
         p{margin:3px 0;font-size:10px;color:#475569}
         .stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:13px}
         .stat-card{border:1px solid #cde4df;border-radius:9px;padding:9px;text-align:center;background:#f4faf8;break-inside:avoid}
         .stat-num{font-size:20px;font-weight:900;color:#087a69}
         .stat-label{font-size:9px;font-weight:bold;color:#475569;margin-top:4px}
         h2{font-size:13px;border-bottom:2px solid #b6ddd3;padding-bottom:5px;margin:14px 0 6px;color:#0a6b5e;break-after:avoid}
         table{width:100%;table-layout:fixed;border-collapse:collapse;margin-top:7px;font-size:9px}
         thead{display:table-header-group}tr{break-inside:avoid;page-break-inside:avoid}
         th,td{border:1px solid #cbd5e1;padding:6px 5px;vertical-align:top;text-align:${dir === 'rtl' ? 'right' : 'left'};overflow-wrap:anywhere}
         th{background:#e6f5f0;font-weight:900;color:#0b6257}
         tbody tr:nth-child(even){background:#f8fafc}
         .school-name{font-size:13px;font-weight:900;color:#0c695e}
         .report-footer{margin-top:19px;border-top:1px solid #cbd5e1;padding-top:8px;text-align:center;color:#64748b;font-size:9px}
         @media print{.no-print{display:none!important}}
        </style></head><body><div class="header"><img src="https://www.efipslibrary.online/school-logo.png" alt="EFIPS Logo"/><div class="school-name">مدرسة صقر الإمارات الدولية الخاصة</div><p>Emirates Falcon International Private School</p><h1>${t('title')}</h1><p>${t('subtitle')} | ${new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</p></div>
        <div class="stats-grid"><div class="stat-card"><div class="stat-num">${stats.students}</div><div class="stat-label">${t('totalStudents')}</div></div><div class="stat-card"><div class="stat-num">${stats.teachers}</div><div class="stat-label">${t('totalTeachers')}</div></div><div class="stat-card"><div class="stat-num">${stats.studentLogins}</div><div class="stat-label">${t('studentLogins')}</div></div><div class="stat-card"><div class="stat-num">${stats.teacherLogins}</div><div class="stat-label">${t('teacherLogins')}</div></div></div>
        <h2>${isAr ? 'مؤشرات أثر المكتبة' : 'Library Impact Indicators'}</h2><table><tr><th>${isAr ? 'إعارات نشطة' : 'Active loans'}</th><th>${isAr ? 'طلبات معلقة' : 'Pending requests'}</th><th>${isAr ? 'إعارات متأخرة' : 'Overdue loans'}</th><th>${isAr ? 'فتح الكتب الرقمية' : 'Digital opens'}</th><th>${isAr ? 'سجلات التحضير' : 'Lesson records'}</th></tr><tr><td>${libraryImpact.active}</td><td>${libraryImpact.pending}</td><td>${libraryImpact.overdue}</td><td>${digitalBookReadStatsAvailable === false ? '-' : libraryImpact.digitalOpens}</td><td>${libraryImpact.lessonPlans}</td></tr></table>
        <h2>${t('topBooksTitle')}</h2><table><tr><th>#</th><th>${t('colBook')}</th><th>${isAr ? 'عدد مرات الاستعارة' : 'Borrow Count'}</th></tr>${topBooksStats.length ? topBooksStats.map(([book, count], idx) => `<tr><td>${idx + 1}</td><td><strong>${safePrintText(book)}</strong></td><td>${count}</td></tr>`).join('') : `<tr><td colspan="3" style="text-align:center">${t('noResults')}</td></tr>`}</table>
        <h2>${t('arabicBooks')} - ${t('digitalReadAnalyticsTitle')}</h2><table><tr><th>#</th><th>${t('colBook')}</th><th>${t('digitalReadCount')}</th></tr>${topArabicDigitalReads.length ? topArabicDigitalReads.map((book, idx) => `<tr><td>${idx + 1}</td><td><strong>${safePrintText(book.book_title)}</strong></td><td>${Number(book.read_count || 0)}</td></tr>`).join('') : `<tr><td colspan="3" style="text-align:center">${digitalBookReadStatsAvailable === false ? t('digitalReadsSetupRequired') : t('noDigitalReads')}</td></tr>`}</table>
        <h2>${t('englishBooks')} - ${t('digitalReadAnalyticsTitle')}</h2><table><tr><th>#</th><th>${t('colBook')}</th><th>${t('digitalReadCount')}</th></tr>${topEnglishDigitalReads.length ? topEnglishDigitalReads.map((book, idx) => `<tr><td>${idx + 1}</td><td><strong>${safePrintText(book.book_title)}</strong></td><td>${Number(book.read_count || 0)}</td></tr>`).join('') : `<tr><td colspan="3" style="text-align:center">${digitalBookReadStatsAvailable === false ? t('digitalReadsSetupRequired') : t('noDigitalReads')}</td></tr>`}</table>
        <h2>${isAr ? 'أكثر 10 مستخدمين نشاطاً' : 'Top 10 Most Active Users'}</h2><table><tr><th>#</th><th>${isAr ? 'الكود' : 'User Code'}</th><th>${isAr ? 'الاسم' : 'Name'}</th><th>${isAr ? 'الفئة' : 'Type'}</th><th>${isAr ? 'مرات الدخول' : 'Logins'}</th></tr>${topUsersStats.length ? topUsersStats.map((user, idx) => `<tr><td>${idx + 1}</td><td>${safePrintText(user.user_id)}</td><td>${safePrintText(user.name)}</td><td>${safePrintText(user.categoryLabel)}</td><td>${user.count}</td></tr>`).join('') : `<tr><td colspan="5" style="text-align:center">${t('noResults')}</td></tr>`}</table>
        <h2>${t('borrowManagement')} (${borrowingsList.length})</h2><table><tr><th>${t('colId')}</th><th>${t('colName')}</th><th>${t('colBook')}</th><th>${t('colEmail')}</th><th>${t('colDate')}</th></tr>${borrowingsList.length ? borrowingsList.map(b => `<tr><td>${safePrintText(b.user_id)}</td><td>${safePrintText(b.user_name || '-')}</td><td>${safePrintText(b.book_name)}</td><td>${safePrintText(b.user_email || '-')}</td><td>${safePrintText(b.return_date || '-')}</td></tr>`).join('') : `<tr><td colspan="5" style="text-align:center">${t('noResults')}</td></tr>`}</table>
        <div class="report-footer">مدرسة صقر الإمارات الدولية الخاصة — Emirates Falcon International Private School — EFIPS Library</div></body></html>`;
        void printA4Html(htmlReport).catch((error) => {
            console.error('Dashboard A4 print failed:', error);
            setBorrowingsError(isAr ? 'تعذر تشغيل الطباعة. يرجى التحقق من إعدادات المتصفح.' : 'Unable to launch printing. Check browser print settings.');
        });
    };

    const filteredList = useMemo(() => {
        const term = searchQuery.toLowerCase().trim();
        const includesTerm = (value: any) => String(value ?? '').toLowerCase().includes(term);
        if (activeTab === 'students') return !term ? studentsList : studentsList.filter(st => includesTerm(st.name_ar) || includesTerm(st.name_en) || includesTerm(st.student_id) || includesTerm(String(st.student_id || '') + '@falcon-school.com'));
        if (activeTab === 'teachers') return !term ? teachersList : teachersList.filter(tc => includesTerm(tc.name_ar) || includesTerm(tc.name_en) || includesTerm(tc.teacher_id) || includesTerm(tc.email));
        if (activeTab === 'borrowings') return !term ? borrowingsList : borrowingsList.filter(b => includesTerm(b.user_id) || includesTerm(b.book_name) || includesTerm(b.user_email) || includesTerm(b.user_name));
        if (activeTab === 'pending') return !term ? pendingRequestsList : pendingRequestsList.filter(p => includesTerm(p.user_id) || includesTerm(p.book_name) || includesTerm(p.user_email) || includesTerm(p.user_name));
        return !term ? lessonReportsList : lessonReportsList.filter(r => includesTerm(r.teacher_name) || includesTerm(r.lesson_topic) || includesTerm(r.teacher_id));
    }, [studentsList, teachersList, borrowingsList, pendingRequestsList, lessonReportsList, searchQuery, activeTab]);

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true); setBorrowingsError(''); setBorrowingsNotice('');
        try {
            if (modalMode === 'addStudent') {
                const { error } = await supabase.from('students').insert([{ student_id: formData.student_id.trim(), name_ar: formData.name_ar, name_en: formData.name_en || formData.name_ar, grade: formData.grade, points: Number(formData.points) || 0 }]);
                if (error) throw error;
            } else if (modalMode === 'addTeacher') {
                const { error } = await supabase.from('teachers').insert([{ teacher_id: formData.teacher_id.trim().toUpperCase(), name_ar: formData.name_ar, name_en: formData.name_en || formData.name_ar }]);
                if (error) throw error;
            } else if (modalMode === 'editStudent') {
                const { error } = await supabase.from('students').update({ student_id: formData.student_id.trim(), name_ar: formData.name_ar, name_en: formData.name_en || formData.name_ar, grade: formData.grade }).eq('id', selectedItem.id);
                if (error) throw error;
            } else if (modalMode === 'editTeacher') {
                const { error } = await supabase.from('teachers').update({ teacher_id: formData.teacher_id.trim().toUpperCase(), name_ar: formData.name_ar, name_en: formData.name_en || formData.name_ar }).eq('id', selectedItem.id);
                if (error) throw error;
            } else if (modalMode === 'addBorrow') {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) throw new Error(isAr ? 'يرجى تسجيل الدخول بحساب Google الإداري.' : 'Admin Google sign-in required.');
                const { data, error } = await supabase.functions.invoke('admin-verified-library', {
                    body: { action: 'direct', user_id: formData.user_id.trim(), user_type: formData.user_type,
                        book_name: formData.book_name.trim(), return_date: formData.return_date },
                    headers: { Authorization: 'Bearer ' + session.access_token }
                });
                if (error || !data?.ok) throw new Error(data?.error || 'Could not register direct borrowing.');
                setBorrowingsNotice(data.emailSent
                    ? (isAr ? `تم تسجيل الإعارة وإرسال البريد إلى ${data.email}.` : `Borrowing registered and email sent to ${data.email}.`)
                    : (isAr ? 'تم تسجيل الإعارة، لكن البريد الإلكتروني لم يتأكد إرساله.' : 'Borrowing registered but email delivery is not confirmed.'));
            }
            setModalMode(null); setSelectedItem(null);
            await fetchRealDashboardData(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setBorrowingsError(message); window.alert(message);
        } finally { setIsSubmitting(false); }
    };

    if (isAdmin === false) return <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4" dir={dir}><div className="text-center text-slate-800 dark:text-white p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-500/50 shadow-2xl max-w-sm w-full"><h2 className="text-lg md:text-xl font-black mb-4 text-rose-500">{t('accessDenied')}</h2><Link to="/home" className="inline-block w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded-xl font-bold transition-all text-sm">{t('backToHome')}</Link></div></div>;
    if (isLoading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-blue-600 dark:text-emerald-400 font-black animate-pulse text-lg md:text-xl">{t('loading')}</div>;

    const previewBorrowDate = new Date().toISOString().split('T')[0];
    const previewReturnDate = formData.return_date || getDefaultReturnDate(15);
    const previewDurationDays = calculateDurationDays(previewBorrowDate, previewReturnDate);
    const statCards = [
        { key: 'students', label: t('totalStudents'), value: stats.students, icon: 'graduation-cap' as IconName, cardClass: 'bg-blue-50/80 dark:bg-blue-950/25 border-blue-100 dark:border-blue-900/60', valueClass: 'text-blue-700 dark:text-blue-300', iconClass: 'text-blue-600 dark:text-blue-300', trackClass: 'bg-blue-100 dark:bg-blue-900/50', barClass: 'bg-blue-500' },
        { key: 'teachers', label: t('totalTeachers'), value: stats.teachers, icon: 'users' as IconName, cardClass: 'bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900/60', valueClass: 'text-emerald-700 dark:text-emerald-300', iconClass: 'text-emerald-600 dark:text-emerald-300', trackClass: 'bg-emerald-100 dark:bg-emerald-900/50', barClass: 'bg-emerald-500' },
        { key: 'studentLogins', label: t('studentLogins'), value: stats.studentLogins, icon: 'trend-up' as IconName, cardClass: 'bg-violet-50/80 dark:bg-violet-950/25 border-violet-100 dark:border-violet-900/60', valueClass: 'text-violet-700 dark:text-violet-300', iconClass: 'text-violet-600 dark:text-violet-300', trackClass: 'bg-violet-100 dark:bg-violet-900/50', barClass: 'bg-violet-500' },
        { key: 'teacherLogins', label: t('teacherLogins'), value: stats.teacherLogins, icon: 'activity' as IconName, cardClass: 'bg-amber-50/80 dark:bg-amber-950/25 border-amber-100 dark:border-amber-900/60', valueClass: 'text-amber-700 dark:text-amber-300', iconClass: 'text-amber-600 dark:text-amber-300', trackClass: 'bg-amber-100 dark:bg-amber-900/50', barClass: 'bg-amber-500' }
    ];

    // Derive catalog totals from the exact book lists displayed on the public library pages.
    const physicalCatalogCount = bookData.length;
    const arabicDigitalCount = ARABIC_LIBRARY_DATABASE.length;
    const englishDigitalCount = ENGLISH_LIBRARY_DATABASE.length;
    const digitalCatalogCount = arabicDigitalCount + englishDigitalCount;
    const allCatalogCount = physicalCatalogCount + digitalCatalogCount;
    const physicalShare = allCatalogCount ? (physicalCatalogCount / allCatalogCount) * 100 : 0;
    const arabicDigitalShare = digitalCatalogCount ? (arabicDigitalCount / digitalCatalogCount) * 100 : 0;
    const ringLength = 2 * Math.PI * 38;
    const formatCatalogCount = (count: number) => count.toLocaleString(isAr ? 'ar-EG' : 'en-US');

    return (
        <div dir={dir} className="efips-admin min-h-[100dvh] bg-white dark:bg-black text-slate-800 dark:text-slate-100 font-sans p-3 sm:p-5 lg:p-8 pb-24 transition-colors duration-300 relative isolate">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                .efips-admin,.efips-admin * {font-family:'Cairo',sans-serif!important}
                .efips-admin {scroll-behavior:smooth}
                .efips-admin .efips-panel {animation:efips-panel-enter .65s ease-out both;transition:box-shadow .3s ease,border-color .3s ease}
                .efips-admin .efips-panel:hover {border-color:rgba(16,185,129,.30)}
                .efips-admin .efips-metric:before {content:'';position:absolute;inset:0 auto auto 0;width:100%;height:4px;background:linear-gradient(90deg,#0d9488,#38bdf8,#f59e0b);opacity:.7}
                .efips-admin .efips-column {transform-origin:bottom;animation:efips-column-rise .75s ease-out both}
                .efips-admin a,.efips-admin button {touch-action:manipulation}
                @keyframes efips-panel-enter {from {opacity:0;transform:translateY(13px)}to {opacity:1;transform:translateY(0)}}
                @keyframes efips-column-rise {from {transform:scaleY(.15)}to {transform:scaleY(1)}}
                @media (prefers-reduced-motion:reduce) {.efips-admin .efips-panel,.efips-admin .efips-column {animation:none!important}.efips-admin * {scroll-behavior:auto!important}}
            `}</style>
            <header className="efips-panel relative overflow-hidden max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-5 bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-sky-950/30 border border-emerald-100 dark:border-emerald-900/50 p-5 sm:p-7 lg:p-9 rounded-[2rem] shadow-xl mt-2 sm:mt-4">
                <div><h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-500 bg-clip-text text-transparent">{t('title')}</h1><p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mt-1">{t('welcome')} <span className="text-slate-900 dark:text-white font-black">{adminName}</span> | {t('subtitle')}</p></div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto justify-start lg:justify-end">
                    <button type="button" onClick={() => void fetchRealDashboardData()} className="px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center gap-2"><OutlineIcon name="refresh" />{isAr ? 'تحديث البيانات' : 'Refresh Data'}</button>
                    <button type="button" onClick={handlePrintDashboardReport} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center gap-2"><OutlineIcon name="printer" />{t('printPdfBtn')}</button>
                    <button type="button" onClick={toggleTheme} className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm shadow-inner transition-all flex items-center gap-2"><OutlineIcon name={theme === 'light' ? 'moon' : 'sun'} />{theme === 'light' ? 'Dark' : 'Light'}</button>
                    <Link to="/home" className="px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 border border-slate-700 rounded-2xl font-bold text-sm transition-all shadow-md text-center">{t('backToHome')}</Link>
                </div>
            </header>

            <nav aria-label={isAr ? 'أقسام لوحة الإدارة' : 'Dashboard sections'} className="max-w-7xl mx-auto mb-5 flex gap-2 overflow-x-auto scrollbar-thin py-2 px-1">
                {[
                    { id:'admin-overview', label:isAr?'نظرة عامة':'Overview',icon:'grid' as IconName },
                    { id:'library-collection-heading', label:isAr?'مقتنيات المكتبة':'Library collection',icon:'library' as IconName },
                    { id:'admin-attendance', label:isAr?'الإشغال والحضور':'Attendance',icon:'calendar' as IconName },
                    { id:'admin-analytics', label:isAr?'الرسوم والتحليلات':'Analytics',icon:'chart' as IconName },
                    { id:'admin-access-report', label:isAr?'الدخول':'Logins',icon:'activity' as IconName },
                    { id:'admin-schedule-report', label:isAr?'الجدول':'Timetable',icon:'calendar' as IconName },
                    { id:'admin-borrow-report', label:isAr?'الاستعارة':'Borrowings',icon:'book-open' as IconName },
                    { id:'admin-reading-report', label:isAr?'تحدي القراءة':'Reading',icon:'trophy' as IconName },
                    { id:'admin-books-report', label:isAr?'الكتب':'Books',icon:'library' as IconName },
                    { id:'admin-users-report', label:isAr?'المستخدمون':'Users',icon:'users' as IconName },
                    { id:'admin-management', label:isAr?'الإدارة والسجلات':'Management',icon:'clipboard-list' as IconName }
                ].map(item=><a key={item.id} href={'#'+item.id} className="shrink-0 inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors"><OutlineIcon name={item.icon} className="h-4 w-4"/>{item.label}</a>)}
            </nav>

            <main className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <section id="admin-overview" className="efips-panel lg:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/70 p-5 md:p-7 rounded-3xl shadow-sm scroll-mt-24">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5"><h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3"><span className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center"><OutlineIcon name="grid" className="h-5 w-5" /></span>{t('statsTitle')}</h2><span className="text-xs font-bold text-slate-500 dark:text-slate-400">{isAr ? 'ملخص حسابات المستخدمين المسجلة' : 'Registered user account overview'}</span></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {statCards.map(card => <div key={card.key} className={`efips-metric relative overflow-hidden border p-5 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${card.cardClass}`}>
                            <div className="flex items-start justify-between gap-3"><div><div className={`text-3xl font-black tabular-nums ${card.valueClass}`}>{Number(card.value).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</div><div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-2">{card.label}</div></div><span className={`w-11 h-11 rounded-xl bg-white/80 dark:bg-slate-800 flex items-center justify-center shadow-sm ${card.iconClass}`}><OutlineIcon name={card.icon} className="h-6 w-6" /></span></div>
                            <div className={`h-1.5 rounded-full mt-4 overflow-hidden ${card.trackClass}`}><div className={`h-full w-full rounded-full ${card.barClass}`} /></div>
                        </div>)}
                    </div>
                </section>


                {/* Book inventory counters, taken from the same sources as the catalog pages. */}
                <section className="efips-panel lg:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/70 p-5 md:p-7 rounded-3xl shadow-sm" aria-labelledby="library-collection-heading">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3">
                            <span className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center"><OutlineIcon name="library" className="h-6 w-6" /></span>
                            <div><h2 id="library-collection-heading" className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100">{isAr ? 'مؤشرات مقتنيات المكتبة' : 'Library Collection Overview'}</h2>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{isAr ? 'عدد الكتب المسجلة في الدليل الورقي والمكتبتين الإلكترونيتين' : 'Catalog entries in the physical and digital libraries'}</p>
                            </div>
                        </div>
                        <div className="self-start sm:self-auto rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                            {isAr ? 'الإجمالي' : 'Combined'} <strong className="ms-1 text-base tabular-nums text-slate-900 dark:text-white">{formatCatalogCount(allCatalogCount)}</strong>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-[1.5rem] border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/70 dark:bg-emerald-950/20 p-5 md:p-6 transition-shadow duration-300 hover:shadow-lg">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-black"><OutlineIcon name="book-open" className="w-4 h-4" /><span>{isAr ? 'دليل كتب المكتبة' : 'Physical Book Catalog'}</span></div>
                                    <div className="mt-3 text-4xl md:text-5xl font-black tabular-nums text-emerald-800 dark:text-emerald-200">{formatCatalogCount(physicalCatalogCount)}</div>
                                    <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">{isAr ? 'كتاب مسجل في دليل المكتبة' : 'Registered physical catalog entries'}</p>
                                </div>
                                <div className="relative w-24 h-24 shrink-0" aria-hidden="true">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        <circle cx="50" cy="50" r="38" strokeWidth="9" stroke="currentColor" fill="none" className="text-emerald-200 dark:text-emerald-950" />
                                        <circle cx="50" cy="50" r="38" strokeWidth="9" stroke="currentColor" fill="none" strokeLinecap="round" className="text-emerald-500" strokeDasharray={(ringLength * physicalShare / 100) + ' ' + ringLength} />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-800 dark:text-emerald-200">
                                        <strong className="text-lg tabular-nums">{Math.round(physicalShare)}%</strong>
                                        <span className="text-[9px] font-bold">{isAr ? 'من الإجمالي' : 'of total'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 h-2 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden" aria-hidden="true"><div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: physicalShare + '%' }} /></div>
                        </div>
                        <div className="rounded-[1.5rem] border border-sky-200 dark:border-sky-900/70 bg-sky-50/70 dark:bg-sky-950/20 p-5 md:p-6 transition-shadow duration-300 hover:shadow-lg">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 text-xs font-black"><OutlineIcon name="book-open" className="w-4 h-4" /><span>{isAr ? 'الكتب الإلكترونية' : 'Digital Books'}</span></div>
                                    <div className="mt-3 text-4xl md:text-5xl font-black tabular-nums text-sky-800 dark:text-sky-200">{formatCatalogCount(digitalCatalogCount)}</div>
                                    <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">{isAr ? 'كتاب في المكتبتين الرقميتين' : 'Entries across both digital libraries'}</p>
                                </div>
                                <div className="relative w-24 h-24 shrink-0" aria-hidden="true">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        <circle cx="50" cy="50" r="38" strokeWidth="9" stroke="currentColor" fill="none" className="text-slate-300 dark:text-slate-700" />
                                        <circle cx="50" cy="50" r="38" strokeWidth="9" stroke="currentColor" fill="none" strokeLinecap="round" className="text-sky-500" strokeDasharray={(ringLength * arabicDigitalShare / 100) + ' ' + ringLength} />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-sky-800 dark:text-sky-200">
                                        <strong className="text-lg tabular-nums">{Math.round(arabicDigitalShare)}%</strong>
                                        <span className="text-[9px] font-bold">{isAr ? 'عربي' : 'Arabic'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex justify-between gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                                <span>{isAr ? 'العربية' : 'Arabic'} <strong className="tabular-nums text-sky-700 dark:text-sky-300">{formatCatalogCount(arabicDigitalCount)}</strong></span>
                                <span>{isAr ? 'الإنجليزية' : 'English'} <strong className="tabular-nums text-slate-700 dark:text-slate-100">{formatCatalogCount(englishDigitalCount)}</strong></span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden flex" aria-hidden="true"><div className="bg-sky-500 h-full transition-all duration-500" style={{ width: arabicDigitalShare + '%' }} /><div className="bg-slate-400 dark:bg-slate-500 flex-1" /></div>
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-4 rounded-3xl border border-emerald-200 dark:border-emerald-900/70 bg-gradient-to-r from-emerald-50 via-white to-sky-50 dark:from-emerald-950/30 dark:via-black dark:to-sky-950/20 shadow-sm p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex justify-center items-center text-white shadow-lg"><OutlineIcon name="trophy" className="w-7 h-7" /></span>
                            <div><h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">{isAr ? 'تحدي القراءة الشهري — تقارير المعلمين والطلاب' : 'Monthly Reading Challenge — Students & Teachers'}</h2>
                            <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">{isAr ? 'عدد الكتب المنجزة وعناوينها والأهداف، حسب الشهر والحساب المرتبط بهوية مدرسية معتمدة.' : 'Completed titles and targets by month for school-verified reading identities.'}</p></div>
                        </div>
                        <button type="button" aria-expanded={showReadingReport} onClick={() => setShowReadingReport(value => !value)}
                            className="shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300">
                            {showReadingReport ? (isAr ? 'إغلاق تقرير التحدي' : 'Close Challenge Report') : (isAr ? 'فتح تقرير تحدي القراءة' : 'Open Reading Challenge Report')}
                        </button>
                    </div>
                </section>
                {showReadingReport && <div id="admin-existing-reading" className="lg:col-span-4"><AdminReadingChallenge isAr={isAr} /></div>}

                <section className="efips-panel lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/70 p-5 md:p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg md:text-xl font-black">{isAr ? 'مؤشرات أثر المكتبة' : 'Library Impact Indicators'}</h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{isAr ? 'مؤشرات تشغيلية من السجلات الحالية، وليست قياسًا مباشرًا لمستوى القراءة أو التحصيل.' : 'Operational indicators from existing records, not direct measures of reading attainment.'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                        {[
                            { label: isAr ? 'إعارات نشطة' : 'Active loans', value: libraryImpact.active },
                            { label: isAr ? 'طلبات معلقة' : 'Pending requests', value: libraryImpact.pending },
                            { label: isAr ? 'إعارات متأخرة' : 'Overdue loans', value: libraryImpact.overdue },
                            { label: isAr ? 'عناوين مطلوبة' : 'Requested titles', value: libraryImpact.uniqueTitles },
                            { label: isAr ? 'فتح الكتب الرقمية' : 'Digital book opens', value: digitalBookReadStatsAvailable === false ? '—' : libraryImpact.digitalOpens },
                            { label: isAr ? 'سجلات التحضير' : 'Lesson plan records', value: libraryImpact.lessonPlans }
                        ].map((metric) => <div key={metric.label} className="rounded-2xl border border-emerald-100 dark:border-slate-700 bg-emerald-50/50 dark:bg-slate-800/50 p-4 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">{metric.value}</div>
                            <div className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">{metric.label}</div>
                        </div>)}
                    </div>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{isAr ? 'البيانات تعكس السجلات المتاحة حاليًا؛ وعدد فتح الكتب الرقمية لا يعني بالضرورة إكمال قراءتها.' : 'Figures reflect currently available records; a digital book open does not necessarily mean the book was read.'}</p>
                </section>

                <AdminInsightsPanels
                    isAr={isAr} locale={locale} students={studentsList} teachers={teachersList}
                    logs={loginActivity} schedule={scheduleSlots} lessons={lessonReportsList}
                    activeLoans={borrowingsList} pendingLoans={pendingRequestsList} allLoans={allBorrowingRecords}
                    digitalReads={digitalBookReadStats} digitalAvailable={digitalBookReadStatsAvailable}
                    physicalTotal={physicalCatalogCount} arabicTotal={arabicDigitalCount} englishTotal={englishDigitalCount}
                    topBooks={topBooksStats}
                    onOpenTab={tab => { setActiveTab(tab);setSearchQuery('');document.getElementById('admin-management')?.scrollIntoView({behavior:'smooth'}); }}
                    onShowReading={() => { setShowReadingReport(true);document.getElementById('admin-existing-reading')?.scrollIntoView({behavior:'smooth'}); }}
                />
                <AdminLibraryAttendance locale={locale} adminId={adminName || 'efips-admin'} />

                <section id="admin-analytics" className="lg:col-span-4 grid grid-cols-1 xl:grid-cols-5 gap-5 items-start scroll-mt-24">
                    <div className="xl:col-span-2 min-w-0 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/70 p-5 md:p-6 rounded-3xl shadow-sm">
                        <div className="flex items-center gap-3 mb-2"><span className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 flex items-center justify-center"><OutlineIcon name="chart" /></span><div><h3 className="font-black text-slate-800 dark:text-slate-100">{isAr ? 'مؤشر نشاط الدخول' : 'Login Activity'}</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{isAr ? 'إجمالي مرات الدخول المسجلة حسب الفئة' : 'Recorded login events by user type'}</p></div></div>
                        <div className="mt-5 mb-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 p-4"><div className="text-xs font-bold text-slate-500 dark:text-slate-400">{isAr ? 'إجمالي مرات الدخول (طلاب ومعلمون)' : 'Total logins (students and teachers)'}</div><div className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{(loginActivityStats.students + loginActivityStats.teachers).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</div></div>
                        {[{ key: 'students', label: isAr ? 'الطلاب' : 'Students', count: loginActivityStats.students, color: 'bg-sky-500', text: 'text-sky-700 dark:text-sky-300', icon: 'graduation-cap' as IconName }, { key: 'teachers', label: isAr ? 'المعلمون' : 'Teachers', count: loginActivityStats.teachers, color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', icon: 'users' as IconName }].map(item => {
                            const maxEvents = Math.max(loginActivityStats.students, loginActivityStats.teachers, 1); const width = item.count === 0 ? 0 : Math.max(4, (item.count / maxEvents) * 100);
                            return <div key={item.key} className="mb-5 last:mb-0"><div className="flex items-center justify-between gap-3 mb-2 text-sm"><span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><OutlineIcon name={item.icon} className="h-4 w-4" />{item.label}</span><strong className={`tabular-nums ${item.text}`}>{item.count.toLocaleString(isAr ? 'ar-EG' : 'en-US')}</strong></div><div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden" role="img" aria-label={`${item.label}: ${item.count}`}><div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${width}%` }} /></div></div>;
                        })}
                        {loginActivityStats.students + loginActivityStats.teachers === 0 && <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{isAr ? 'لا توجد سجلات دخول متاحة حتى الآن.' : 'No login records are available yet.'}</p>}
                        <p className="mt-5 text-[11px] leading-5 text-slate-400 dark:text-slate-500">{isAr ? 'يعتمد الرسم على عدد السجلات في جدول login_logs، وليس عدد الحسابات الفريدة.' : 'Chart counts rows in login_logs, not unique accounts.'}</p>
                    </div>
                    <div className="xl:col-span-3 min-w-0 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/70 p-5 md:p-6 rounded-3xl shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4"><div className="flex items-center gap-3"><span className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 flex items-center justify-center"><OutlineIcon name="trophy" /></span><div><h3 className="font-black text-slate-800 dark:text-slate-100">{isAr ? 'أكثر 10 مستخدمين نشاطاً' : 'Top 10 Most Active Users'}</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{isAr ? 'الترتيب حسب عدد مرات الدخول المسجلة، مع كود كل مستخدم' : 'Ranked by recorded logins, including each user code'}</p></div></div><span className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-black">{topUsersStats.length}/10</span></div>
                        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800"><table className="w-full min-w-[560px] text-sm border-collapse"><thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-500 dark:text-slate-300"><tr><th className="px-3 py-3 text-center font-black w-14">#</th><th className="px-3 py-3 text-start font-black">{isAr ? 'الكود' : 'User Code'}</th><th className="px-3 py-3 text-start font-black">{isAr ? 'اسم المستخدم' : 'User Name'}</th><th className="px-3 py-3 text-start font-black">{isAr ? 'الفئة' : 'Type'}</th><th className="px-3 py-3 text-start font-black min-w-32">{isAr ? 'مرات الدخول' : 'Logins'}</th></tr></thead><tbody>
                            {topUsersStats.length ? topUsersStats.map((user, index) => { const maxCount = Math.max(topUsersStats[0]?.count || 1, 1); const barWidth = Math.max(5, (user.count / maxCount) * 100); return <tr key={`${user.user_type}-${user.user_id}`} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"><td className="px-3 py-3 text-center"><span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${index < 3 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300'}`}>{index + 1}</span></td><td className="px-3 py-3 font-mono font-black text-sky-700 dark:text-sky-300 whitespace-nowrap">{user.user_id}</td><td className="px-3 py-3 font-bold text-slate-800 dark:text-slate-100">{user.name}</td><td className="px-3 py-3"><span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${user.user_type === 'student' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'}`}>{user.categoryLabel}</span></td><td className="px-3 py-3"><div className="flex items-center gap-2"><span className="font-black tabular-nums text-slate-700 dark:text-slate-200 min-w-6">{user.count.toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span><div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className={`h-full rounded-full ${user.user_type === 'student' ? 'bg-sky-500' : 'bg-emerald-500'}`} style={{ width: `${barWidth}%` }} /></div></div></td></tr>; }) : <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400 font-bold">{isAr ? 'لا توجد سجلات دخول للطلاب أو المعلمين لعرض الترتيب.' : 'No student or teacher login records are available for ranking.'}</td></tr>}
                        </tbody></table></div><p className="mt-3 text-[11px] leading-5 text-slate-400 dark:text-slate-500">{isAr ? 'يتم عرض الحسابات الموجودة في سجلات الدخول فقط. إذا كان الاسم غير موجود في قائمة الطلاب أو المعلمين سيظهر الكود مع تنبيه بذلك.' : 'Only accounts present in login_logs are ranked. Missing directory accounts remain visible by code.'}</p>
                    </div>
                </section>

                <section className="lg:col-span-4 bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-[2.5rem] shadow-xl"><h3 className="text-lg md:text-xl font-black mb-4 text-amber-500 flex items-center gap-2"><OutlineIcon name="book-open" />{t('topBooksTitle')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">{topBooksStats.length ? topBooksStats.map(([bookName, count], index) => <div key={bookName} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 border-2 border-amber-200 dark:border-amber-700/50 p-4 rounded-2xl flex flex-col justify-between shadow-sm"><div className="font-black text-slate-900 dark:text-white text-sm md:text-base line-clamp-2 min-h-10">{bookName}</div><div className="mt-4 h-2 rounded-full bg-amber-100 dark:bg-slate-700 overflow-hidden"><div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.max(5, (count / Math.max(topBooksStats[0]?.[1] || 1, 1)) * 100)}%` }} /></div><div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold text-slate-500 dark:text-slate-400"><span>{isAr ? `المرتبة ${index + 1}` : `Rank ${index + 1}`}</span><span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg font-black whitespace-nowrap">{count} {isAr ? 'استعارة' : 'borrowings'}</span></div></div>) : <div className="col-span-full text-center py-6 text-slate-400 font-bold text-sm">{isAr ? 'لا توجد سجلات استعارة كافية حالياً لعرض الكتب الأكثر طلباً.' : 'No borrowing records found yet.'}</div>}</div>
                </section>

                <section className="lg:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/70 p-5 md:p-6 rounded-3xl shadow-sm"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5"><div className="flex items-center gap-3"><span className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center"><OutlineIcon name="chart" /></span><div><h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{t('digitalReadAnalyticsTitle')}</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{isAr ? 'الترتيب حسب سجلات فتح الكتب في كل مكتبة رقمية' : 'Ranked by recorded book opens in each digital library'}</p></div></div><span className="text-[11px] text-slate-400 dark:text-slate-500">{isAr ? 'تتحدث الإحصائيات تلقائياً' : 'Statistics refresh automatically'}</span></div>
                    {digitalBookReadStatsAvailable === false ? <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/25 p-4 text-sm font-bold leading-7 text-amber-800 dark:text-amber-200">{t('digitalReadsSetupRequired')}</div> : <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">{[{ key: 'arabic', title: t('arabicBooks'), data: topArabicDigitalReads, accent: 'bg-emerald-500', badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' }, { key: 'english', title: t('englishBooks'), data: topEnglishDigitalReads, accent: 'bg-sky-500', badge: 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' }].map(section => { const maxReads = Math.max(...section.data.map((book: any) => Number(book.read_count || 0)), 1); return <div key={section.key} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 md:p-5 min-w-0"><h4 className="font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4"><OutlineIcon name="book-open" className="h-4 w-4" />{section.title}</h4>{section.data.length ? <div className="space-y-4">{section.data.map((book: any, index: number) => { const count = Number(book.read_count || 0); const width = Math.max(4, (count / maxReads) * 100); return <div key={`${section.key}-${book.book_title}-${index}`}><div className="flex items-start justify-between gap-3 mb-2"><div className="flex items-start gap-3 min-w-0"><span className={`inline-flex shrink-0 items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${index < 3 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-300'}`}>{index + 1}</span><span className="text-sm font-bold text-slate-700 dark:text-slate-200 break-words">{book.book_title}</span></div><span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-black tabular-nums ${section.badge}`}>{count.toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span></div><div className="h-2.5 rounded-full bg-slate-200/80 dark:bg-slate-700 overflow-hidden" role="img" aria-label={`${book.book_title}: ${count}`}><div className={`h-full rounded-full ${section.accent} transition-all duration-500`} style={{ width: `${width}%` }} /></div></div>; })}</div> : <div className="py-8 text-center text-sm font-bold text-slate-400 dark:text-slate-500">{t('noDigitalReads')}</div>}</div>; })}</div>}
                </section>

                <section id="admin-management" className="efips-panel lg:col-span-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm min-w-0 scroll-mt-24">
                    <div className="flex gap-2 w-full xl:w-auto min-w-0 overflow-x-auto whitespace-nowrap pb-2 xl:pb-0 scrollbar-thin">
                        <button type="button" onClick={() => { setActiveTab('pending'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all relative flex items-center gap-2 ${activeTab === 'pending' ? 'bg-rose-500 text-white shadow-md' : 'bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400'}`}><OutlineIcon name="clock" />{t('pendingRequests')} ({pendingRequestsList.length}){pendingRequestsList.length > 0 && <span className="absolute -top-2 -end-2 min-w-6 h-6 px-1 bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md">{pendingRequestsList.length}</span>}</button>
                        <button type="button" onClick={() => { setActiveTab('borrowings'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all flex items-center gap-2 ${activeTab === 'borrowings' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><OutlineIcon name="book-open" />{t('borrowManagement')} ({borrowingsList.length})</button>
                        <button type="button" onClick={() => { setActiveTab('students'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all flex items-center gap-2 ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><OutlineIcon name="graduation-cap" />{t('studentManagement')} ({studentsList.length})</button>
                        <button type="button" onClick={() => { setActiveTab('teachers'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all flex items-center gap-2 ${activeTab === 'teachers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><OutlineIcon name="users" />{t('teacherManagement')} ({teachersList.length})</button>
                        <button type="button" onClick={() => { setActiveTab('reports'); setSearchQuery(''); }} className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all flex items-center gap-2 ${activeTab === 'reports' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><OutlineIcon name="clipboard-list" />{t('aiReports')} ({lessonReportsList.length})</button>
                    </div>
                    <div className="w-full xl:w-auto flex flex-wrap items-center gap-2 justify-end xl:shrink-0">
                        {(activeTab === 'pending' || activeTab === 'borrowings') && <button type="button" disabled={isRefreshingBorrowings} onClick={() => void refreshBorrowingsOnly(undefined, undefined, false, true)} className="px-5 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all flex items-center gap-2"><OutlineIcon name="refresh" className="h-4 w-4" />{isRefreshingBorrowings ? (isAr ? 'جاري التحديث...' : 'Refreshing...') : (isAr ? 'تحديث الطلبات' : 'Refresh Requests')}</button>}
                        {activeTab === 'students' && <button type="button" onClick={() => { setFormData(emptyForm()); setModalMode('addStudent'); }} className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all text-center">{t('addStudentBtn')}</button>}
                        {activeTab === 'teachers' && <button type="button" onClick={() => { setFormData({ ...emptyForm(), grade: '' }); setModalMode('addTeacher'); }} className="w-full md:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all text-center">{t('addTeacherBtn')}</button>}
                        {activeTab === 'borrowings' && <button type="button" onClick={() => { setFormData({ ...emptyForm(), grade: '' }); setModalMode('addBorrow'); }} className="w-full md:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all text-center">{t('addBorrowBtn')}</button>}
                    </div>
                </section>

                {(borrowingsError || borrowingsNotice) && <section className="lg:col-span-4 space-y-2">{borrowingsError && <div role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-bold flex justify-between items-center gap-3"><span>{borrowingsError}</span><button type="button" onClick={() => setBorrowingsError('')} className="underline text-xs shrink-0">{isAr ? 'إغلاق' : 'Close'}</button></div>}{borrowingsNotice && <div role="status" className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-bold flex justify-between items-center gap-3"><span>{borrowingsNotice}</span><button type="button" onClick={() => setBorrowingsNotice('')} className="underline text-xs shrink-0">{isAr ? 'إخفاء' : 'Dismiss'}</button></div>}</section>}

                <section className="lg:col-span-4 bg-white dark:bg-slate-900/90 backdrop-blur-md p-4 md:p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 shadow-md"><div className="relative group"><input type="text" placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-4 ps-14 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 focus:border-amber-400 rounded-2xl outline-none font-bold text-sm md:text-base shadow-inner transition-colors" /><div className="absolute start-4 top-1/2 -translate-y-1/2"><SearchSvg /></div></div></section>

                <section className="efips-panel lg:col-span-4 bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-4 sm:p-6 rounded-[2rem] shadow-xl overflow-hidden min-w-0"><div className="overflow-x-auto max-h-[600px] scrollbar-thin"><table className="w-full text-left rtl:text-right border-collapse min-w-[600px]"><thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10"><tr className="text-slate-600 dark:text-slate-300 text-xs md:text-sm border-b border-slate-200 dark:border-slate-700"><th className="p-3.5 font-black">{(activeTab === 'students' || activeTab === 'teachers') ? t('colEmail') : t('colId')}</th>{activeTab !== 'borrowings' && activeTab !== 'pending' && <th className="p-3.5 font-black">{t('colName')}</th>}{(activeTab === 'students' || activeTab === 'teachers') && <th className="p-3.5 font-black">{isAr ? 'المعرف الداخلي' : 'Internal ID'}</th>}{activeTab === 'students' && <th className="p-3.5 font-black">{t('colGrade')}</th>}{activeTab === 'students' && <th className="p-3.5 font-black text-center">{t('colPoints')}</th>}{(activeTab === 'borrowings' || activeTab === 'pending') && <th className="p-3.5 font-black">{t('colBook')}</th>}{(activeTab === 'borrowings' || activeTab === 'pending') && <th className="p-3.5 font-black">{t('colEmail')}</th>}{activeTab === 'borrowings' && <th className="p-3.5 font-black">{t('colDate')}</th>}{activeTab === 'pending' && <th className="p-3.5 font-black">{t('colReqDate')}</th>}{activeTab === 'reports' && <th className="p-3.5 font-black">{t('colTopic')}</th>}{activeTab === 'reports' && <th className="p-3.5 font-black text-center">{t('colType')}</th>}{activeTab === 'reports' && <th className="p-3.5 font-black">{t('colReportDate')}</th>}{activeTab !== 'reports' && <th className="p-3.5 font-black text-center">{t('colActions')}</th>}</tr></thead>
                    <tbody>{filteredList.length ? filteredList.map((item: any) => <tr key={`${activeTab}-${item.id}`} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-xs md:text-sm text-blue-600 dark:text-blue-400">{activeTab === 'students' ? (item.student_id ? String(item.student_id) + '@falcon-school.com' : '') : activeTab === 'teachers' ? (item.email || (isAr ? 'بدون بريد معتمد' : 'No approved email')) : (item.user_id || item.teacher_id)}{(activeTab === 'pending' || activeTab === 'borrowings') && <div className="mt-1 font-sans text-xs text-slate-600 dark:text-slate-300">{item.user_name || (item.user_type === 'student' ? (isAr ? 'طالب' : 'Student') : item.user_type === 'teacher' ? (isAr ? 'معلم' : 'Teacher') : (isAr ? 'مستخدم' : 'User'))}{item.user_grade ? ` · ${item.user_grade}` : ''}</div>}</td>
                        {activeTab !== 'borrowings' && activeTab !== 'pending' && <td className="p-3.5 font-bold text-xs md:text-sm">{activeTab === 'reports' ? item.teacher_name : (isAr ? (item.name_ar || item.name_en) : (item.name_en || item.name_ar))}</td>}
                        {(activeTab === 'students' || activeTab === 'teachers') && <td dir="ltr" className="p-3.5 font-mono text-xs md:text-sm text-slate-500 dark:text-slate-400">{activeTab === 'students' ? item.student_id : item.teacher_id}</td>}{activeTab === 'students' && <td className="p-3.5 text-xs md:text-sm text-slate-500 dark:text-slate-400">{item.grade}</td>}{activeTab === 'students' && <td className="p-3.5 text-center font-black text-emerald-600 dark:text-emerald-400">{item.points || 0}</td>}
                        {(activeTab === 'borrowings' || activeTab === 'pending') && <td className="p-3.5 font-bold text-xs md:text-sm text-rose-500">{item.book_name || '-'}</td>}
                        {(activeTab === 'borrowings' || activeTab === 'pending') && <td className="p-3.5 font-mono text-xs md:text-sm text-slate-600 dark:text-slate-300">{item.user_email || <span className="text-slate-400 italic">--</span>}</td>}
                        {activeTab === 'borrowings' && <td className="p-3.5 text-xs md:text-sm font-bold text-amber-600 dark:text-amber-400">{item.return_date || '-'}</td>}
                        {activeTab === 'pending' && <td className="p-3.5 text-xs md:text-sm text-slate-500">{item.borrow_date ? String(item.borrow_date).slice(0, 10) : (item.created_at ? new Date(item.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '-')}</td>}
                        {activeTab === 'reports' && <td className="p-3.5 font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100">{item.lesson_topic}</td>}{activeTab === 'reports' && <td className="p-3.5 text-center font-black text-xs md:text-sm text-indigo-600 dark:text-indigo-400">{item.plan_type}</td>}{activeTab === 'reports' && <td className="p-3.5 text-xs md:text-sm text-slate-500">{item.created_at ? new Date(item.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '-'}</td>}
                        {activeTab !== 'reports' && <td className="p-3.5"><div className="flex flex-wrap items-center justify-center gap-2">{activeTab === 'borrowings' ? <button type="button" disabled={processingRowId === item.id} onClick={() => void handleReturnBook(item.id)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1"><OutlineIcon name="return" className="h-3.5 w-3.5" />{isAr ? 'إرجاع الكتاب' : 'Return Book'}</button> : activeTab === 'pending' ? <><button type="button" disabled={processingRowId === item.id} onClick={() => void handleInstantApprove(item)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1"><OutlineIcon name="check" className="h-3.5 w-3.5" />{processingRowId === item.id ? (isAr ? 'جاري التأكيد...' : 'Approving...') : t('approveBtn')}</button><button type="button" disabled={processingRowId === item.id} onClick={() => void handleRejectRequest(item.id)} className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1"><OutlineIcon name="x" className="h-3.5 w-3.5" />{t('rejectBtn')}</button></> : <>
                          <button type="button" onClick={() => { setSelectedItem(item); setFormData({ ...emptyForm(), student_id: item.student_id || '', teacher_id: item.teacher_id || '', name_ar: item.name_ar || '', name_en: item.name_en || '', grade: item.grade || '', points: item.points || 0 }); setModalMode(activeTab === 'students' ? 'editStudent' : 'editTeacher'); }} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all">{t('editIdBtn')}</button>
                          {(() => {
                              const email = activeTab === 'students'
                                  ? (item.student_id ? String(item.student_id) + '@falcon-school.com' : '')
                                  : String(item.email || '');
                              const disabled = Boolean(accountDisabled[email.toLowerCase()]);
                              const busy = accessBusy === email.toLowerCase();
                              return <div className="flex flex-wrap gap-1.5 justify-center items-center">
                                  {activeTab === 'teachers' && email && <select aria-label={isAr ? 'صلاحية الحساب' : 'Account role'} disabled={busy || email.toLowerCase() === 'islam.ahmed@falcon-school.com'}
                                      value={staffRoleDirectory[email.toLowerCase()] || 'teacher'}
                                      onChange={event => void handleAccountAccess(item, 'role', event.target.value as 'teacher' | 'admin')}
                                      className="rounded-lg text-xs font-bold border border-slate-300 bg-white dark:bg-slate-800 dark:text-white p-1.5">
                                      <option value="teacher">{isAr ? 'معلم' : 'Teacher'}</option>
                                      <option value="admin">{isAr ? 'مدير النظام' : 'Admin'}</option>
                                  </select>}
                                  {email && <button type="button" disabled={busy || email.toLowerCase() === 'islam.ahmed@falcon-school.com'} onClick={() => void handleAccountAccess(item, disabled ? 'enable' : 'disable')}
                                      className={`rounded-lg text-xs font-bold text-white px-2.5 py-1.5 disabled:opacity-50 ${disabled ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                                      {disabled ? (isAr ? 'استعادة الحساب' : 'Restore') : (isAr ? 'تعطيل / حذف الدخول' : 'Disable account')}
                                  </button>}
                              </div>;
                          })()}
                        </>}</div></td>}
                    </tr>) : <tr><td colSpan={7} className="p-8 text-center text-slate-400 font-bold text-sm">{t('noResults')}{(activeTab === 'pending' && borrowingsError) ? <div className="mt-2 text-xs font-normal">{isAr ? 'راجع رسالة الخطأ أعلاه أو تحقق من صلاحيات قراءة جدول borrowings والدالة send-borrow-email.' : 'Check the error above and verify read access to borrowings and send-borrow-email.'}</div> : null}</td></tr>}</tbody>
                </table></div></section>
            </main>

            {modalMode && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"><div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-thin">
                <h3 className="text-lg md:text-xl font-black mb-6 text-slate-900 dark:text-white">{modalMode === 'addStudent' ? t('modalAddStudent') : modalMode === 'addTeacher' ? t('modalAddTeacher') : modalMode === 'editStudent' ? t('modalEditStudent') : modalMode === 'editTeacher' ? t('modalEditTeacher') : t('modalAddBorrow')}</h3>
                <form onSubmit={handleSubmitForm} className="space-y-4">
                    {(modalMode === 'addStudent' || modalMode === 'editStudent') && <><div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('colId')}</label><input type="text" value={formData.student_id} onChange={e => setFormData({ ...formData, student_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono" required /></div><div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالعربي</label><input type="text" value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" required /></div><div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالإنجليزية</label><input type="text" value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" /></div><div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('colGrade')}</label><input type="text" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" /></div></>}
                    {(modalMode === 'addTeacher' || modalMode === 'editTeacher') && <><div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('colId')} (مثال: PASS123)</label><input type="text" value={formData.teacher_id} onChange={e => setFormData({ ...formData, teacher_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono uppercase" required /></div><div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالعربي</label><input type="text" value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" required /></div><div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الاسم بالإنجليزية</label><input type="text" value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" /></div></>}
                    {modalMode === 'addBorrow' && <><div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">نوع المستعير</label><select value={formData.user_type} onChange={e => { const type = e.target.value; setFormData({ ...formData, user_type: type, user_email: type === 'student' && formData.user_id ? `${formData.user_id.trim()}@falcon-school.com` : '' }); }} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold"><option value="student">طالب</option><option value="teacher">معلم</option></select></div>
                        <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الرقم التعريفي (ID)</label><input type="text" value={formData.user_id} onChange={e => { const id = e.target.value; setFormData({ ...formData, user_id: id, user_email: formData.user_type === 'student' ? (id ? `${id.trim()}@falcon-school.com` : '') : formData.user_email }); }} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" required /></div>
                        <div className="text-xs font-bold leading-6 text-emerald-700 dark:text-emerald-300">{isAr ? 'سيُستخدم بريد Google المدرسي المسجّل للمستعير تلقائيًا دون إدخال عنوان يدوي.' : 'The borrower’s approved school Google email will be used automatically.'}</div>
                        <div><label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">عنوان الكتاب</label><input type="text" value={formData.book_name} onChange={e => setFormData({ ...formData, book_name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" required /></div>
                        <div><label className="block text-sm font-black text-amber-600 dark:text-amber-400 mb-1">تاريخ الإرجاع الإلزامي (مدة الاستعارة: {previewDurationDays} يوماً)</label><input type="date" value={formData.return_date} min={previewBorrowDate} onChange={e => setFormData({ ...formData, return_date: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-4 border-amber-300 dark:border-amber-600 focus:border-amber-500 rounded-2xl font-black outline-none transition-colors" required /></div>
                    </>}
                    <div className="flex gap-3 pt-4"><button type="button" onClick={() => setModalMode(null)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm">{t('cancelBtn')}</button><button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-2xl font-black text-sm shadow-md">{isSubmitting ? (isAr ? 'جاري التنفيذ...' : 'Processing...') : t('saveBtn')}</button></div>
                </form>
            </div></div>}
        </div>
    );
};

export default AdminDashboard;
