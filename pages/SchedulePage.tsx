import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
// 🚀 استيراد الاتصال من الملف المركزي بدلاً من كتابته هنا
import { supabase } from '../src/utils/supabase';

const translations = {
    ar: {
        pageTitle: "جدول حجز حصص المكتبة",
        subtitle: "نظام حجز وتنسيق حصص زيارة المكتبة المدرسية بطريقة منظمة ومبتكرة",
        days: ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
        periods: [1, 2, 3, 4, 5, 6, 7, 8],
        periodLabel: "الحصة",
        teacherName: "اسم المعلم",
        subject: "المادة",
        grade: "الصف / الفصل",
        saveBtn: "حجز / تعديل الحصة",
        deleteBtn: "حذف الحصة",
        printBtn: "طباعة الجدول المعتمد ",
        myScheduleBtn: " تحميل جدولي الشخصي ",
        modalTitle: "تحديث جدول الحصة",
        close: "إلغاء",
        success: "تم حفظ الحصة بنجاح!",
        deleteSuccess: "تم حذف الحصة بنجاح!",
        unauthorizedDelete: "عذراً، لا تملك صلاحية حذف حصص المعلمين الآخرين. مخصصة للمسؤول فقط.",
        alreadyBooked: "عذراً، هذه الحصة محجوزة مسبقاً من قبل معلم آخر، ولا يمكن تعديلها إلا من قبل المسؤول.",
        bookSlotText: "+ اضغط لحجز الحصة",
        addToGoogleCal: "إضافة إلى Google Calendar",
        downloadIcs: "تحميل الحصة (.ics)",
        noClassesFound: "لم يتم العثور على حصص مسجلة باسمك.",
        loading: "جاري تحميل جدول الحصص...",
        schoolNameAr: "مدرسة صقر الإمارات الدولية الخاصة",
        schoolNameEn: "Emirates Falcon International Private School",
        printHeader: "الجدول الزمني المعتمد لزيارات المكتبة المدرسية",
        librarianSign: "اعتماد أمين المكتبة",
        managementSign: "توقيع الإدارة المدرسية",
        accessDenied: "عذراً، هذه الصفحة مخصصة للمعلمين وإدارة المدرسة فقط."
    },
    en: {
        pageTitle: "Library Schedule",
        subtitle: "Organized and vibrant library visit booking and coordination system",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        periods: [1, 2, 3, 4, 5, 6, 7, 8],
        periodLabel: "Period",
        teacherName: "Teacher Name",
        subject: "Subject",
        grade: "Grade / Class",
        saveBtn: "Save / Update Period",
        deleteBtn: "Delete Period",
        printBtn: "Print Schedule",
        myScheduleBtn: " Download My Schedule",
        modalTitle: "Update Schedule Slot",
        close: "Cancel",
        success: "Schedule updated successfully!",
        deleteSuccess: "Period deleted successfully!",
        unauthorizedDelete: "Sorry, you cannot delete other teachers' periods. Admin only.",
        alreadyBooked: "Sorry, this period is already booked by another teacher.",
        bookSlotText: "+ Click to Book",
        addToGoogleCal: "Add to Google Calendar",
        downloadIcs: "Download Period (.ics)",
        noClassesFound: "No classes found registered under your name.",
        loading: "Loading schedule...",
        schoolNameAr: "مدرسة صقر الإمارات الدولية الخاصة",
        schoolNameEn: "Emirates Falcon International Private School",
        printHeader: "Certified Library Visit Timetable",
        librarianSign: "Librarian Approval",
        managementSign: "Management Signature",
        accessDenied: "Sorry, this page is for teachers and school administration only."
    }
};

const SchedulePage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale as 'ar' | 'en'][key];

    // ==========================================
    // نظام الجلسات والمصادقة
    // ==========================================
    const [userData, setUserData] = useState<any>(null);
    const [userType, setUserType] = useState<'student' | 'teacher' | 'admin' | null>(null);

    // تأثير حركة المؤشر على العنوان
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x: x * 20, y: y * 20 });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('current_user');
        const storedType = localStorage.getItem('user_type');

        if (storedUser && storedType) {
            if (storedType === 'student') {
                window.location.href = '/home';
            } else {
                setUserData(JSON.parse(storedUser));
                setUserType(storedType as 'teacher' | 'admin');
            }
        } else {
            window.location.href = '/login';
        }
    }, []);

    const getDisplayName = () => {
        if (!userData) return '';
        return isAr ? (userData.name_ar || userData.name_en) : (userData.name_en || userData.name_ar);
    };

    // ==========================================
    // إدارة بيانات الجدول
    // ==========================================
    const [isLoading, setIsLoading] = useState(false);
    const [scheduleData, setScheduleData] = useState<{ [key: string]: { teacher: string; subject: string; grade: string; user_id: string } }>({});
    
    const [selectedSlot, setSelectedSlot] = useState<{ day: string; period: number } | null>(null);
    const [formTeacher, setFormTeacher] = useState('');
    const [formSubject, setFormSubject] = useState('');
    const [formGrade, setFormGrade] = useState('');

    const days = translations[locale as 'ar' | 'en'].days;
    const allPeriods = translations[locale as 'ar' | 'en'].periods;

    const [mobileDay, setMobileDay] = useState<string>('الإثنين');
    useEffect(() => {
        if (!days.includes(mobileDay)) setMobileDay(days[0]);
    }, [locale]);
    const activeMobileDay = days.includes(mobileDay) ? mobileDay : days[0];

    const fetchSchedule = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('library_schedule').select('*');
            if (error) throw error;

            const map: any = {};
            data?.forEach((item: any) => {
                map[item.id] = { teacher: item.teacher, subject: item.subject, grade: item.grade, user_id: item.user_id };
            });
            setScheduleData(map);
        } catch (error: any) {
            console.error("Error fetching schedule:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userType === 'teacher' || userType === 'admin') {
            fetchSchedule();
        }
    }, [userType]);

    const handleOpenModal = (day: string, period: number) => {
        const key = `${day}_${period}`;
        const current = scheduleData[key];

        if (current?.user_id && current.user_id !== userData.teacher_id && userType !== 'admin') {
            alert(t('alreadyBooked'));
            return;
        }

        setFormTeacher(current?.teacher || getDisplayName());
        setFormSubject(current?.subject || '');
        setFormGrade(current?.grade || '');
        setSelectedSlot({ day, period });
    };

    const handleSaveSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) return;

        const key = `${selectedSlot.day}_${selectedSlot.period}`;
        const slotData = { 
            id: key, 
            teacher: formTeacher, 
            subject: formSubject, 
            grade: formGrade,
            user_id: userData.teacher_id 
        };

        try {
            const { error } = await supabase.from('library_schedule').upsert(slotData);
            if (error) throw error;

            setScheduleData(prev => ({ ...prev, [key]: slotData }));
            setSelectedSlot(null);
            alert(t('success'));
        } catch (error: any) {
            console.error("Error saving slot:", error);
            alert("خطأ أثناء الحفظ: " + (error.message || error));
        }
    };

    const handleDeleteSlot = async () => {
        if (!selectedSlot) return;

        const key = `${selectedSlot.day}_${selectedSlot.period}`;
        const current = scheduleData[key];

        if (userType !== 'admin' && current?.user_id !== userData.teacher_id) {
            alert(t('unauthorizedDelete'));
            return;
        }

        try {
            const { error } = await supabase.from('library_schedule').delete().eq('id', key);
            if (error) throw error;

            setScheduleData(prev => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
            setSelectedSlot(null);
            alert(t('deleteSuccess'));
        } catch (error: any) {
            console.error("Error deleting slot:", error);
            alert("خطأ أثناء الحذف: " + (error.message || error));
        }
    };

    const getNextDayOfWeek = (dayName: string) => {
        const dayMap: Record<string, number> = { 
            "الأحد": 0, "الإثنين": 1, "الثلاثاء": 2, "الأربعاء": 3, "الخميس": 4, "الجمعة": 5, "السبت": 6,
            "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 
        };
        const targetDay = dayMap[dayName] ?? 1; 
        const now = new Date();
        const currentDay = now.getDay();
        let distance = targetDay - currentDay;
        if (distance < 0) distance += 7;
        const resultDate = new Date(now);
        resultDate.setDate(now.getDate() + distance);
        return resultDate;
    };

    const getPeriodTimes = (periodNumber: number) => {
        const baseHour = 7 + periodNumber;
        const startHour = baseHour < 10 ? `0${baseHour}` : `${baseHour}`;
        const endHour = (baseHour + 1) < 10 ? `0${baseHour + 1}` : `${baseHour + 1}`;
        return { start: `${startHour}0000`, end: `${endHour}0000` };
    };

    const handleDownloadMySchedule = () => {
        const searchId = userData.teacher_id; 
        let icsEvents = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Saqr Smart Library//Teacher Schedule//AR'
        ];

        let foundCount = 0;
        Object.entries(scheduleData).forEach(([key, slot]) => {
            if (slot.user_id === searchId || (slot.teacher && slot.teacher === getDisplayName())) {
                const [day, periodStr] = key.split('_');
                const period = parseInt(periodStr);
                
                const date = getNextDayOfWeek(day);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const dayStr = String(date.getDate()).padStart(2, '0');
                const dateFormatted = `${year}${month}${dayStr}`;

                const times = getPeriodTimes(period);
                const startTime = `${dateFormatted}T${times.start}Z`;
                const endTime = `${dateFormatted}T${times.end}Z`;

                icsEvents.push(
                    'BEGIN:VEVENT',
                    `SUMMARY:حصة مكتبة: ${slot.subject} (${slot.grade})`,
                    `DESCRIPTION:المعلم: ${slot.teacher} - المادة: ${slot.subject} - الصف: ${slot.grade}`,
                    `LOCATION:مكتبة مدرسة صقر الإمارات الدولية الخاصة`,
                    `DTSTART:${startTime}`,
                    `DTEND:${endTime}`,
                    'END:VEVENT'
                );
                foundCount++;
            }
        });

        if (foundCount === 0) {
            alert(t('noClassesFound'));
            return;
        }

        icsEvents.push('END:VCALENDAR');
        const icsContent = icsEvents.join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `my_library_schedule.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddToGoogleCalendar = (day: string, period: number, slot: { teacher: string; subject: string; grade: string }) => {
        const date = getNextDayOfWeek(day);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayStr = String(date.getDate()).padStart(2, '0');
        const dateFormatted = `${year}${month}${dayStr}`;

        const times = getPeriodTimes(period);
        const startTime = `${dateFormatted}T${times.start}Z`;
        const endTime = `${dateFormatted}T${times.end}Z`;

        const title = encodeURIComponent(`حصة مكتبة: ${slot.subject} (${slot.grade})`);
        const details = encodeURIComponent(`المعلم: ${slot.teacher}\nالصف: ${slot.grade}\nالمادة: ${slot.subject}\nزيارة مكتبة مدرسة صقر الإمارات الدولية الخاصة`);
        const location = encodeURIComponent('مكتبة المدرسة - مدرسة صقر الإمارات الدولية الخاصة');

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
        window.open(url, '_blank');
    };

    const bookedSlots = Object.values(scheduleData).filter((slot) => Boolean(slot?.teacher)).length;
    const myBookedSlots = Object.values(scheduleData).filter((slot) =>
        Boolean(slot?.teacher) && (slot.user_id === userData?.teacher_id || slot.teacher === getDisplayName())
    ).length;
    const fridayName = days.find((day) => day === 'الجمعة' || day === 'Friday');
    const totalAvailablePeriods = days.length * allPeriods.length - (fridayName ? allPeriods.filter((period) => period > 4).length : 0);
    const freeSlots = Math.max(0, totalAvailablePeriods - bookedSlots);

    if (!userData || (userType !== 'teacher' && userType !== 'admin')) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center text-white p-8 sm:p-10 bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl max-w-lg">
                    <div className="text-4xl mb-4" aria-hidden="true">🔒</div>
                    <h2 className="text-xl sm:text-2xl font-bold leading-relaxed mb-2">{t('accessDenied')}</h2>
                    <button onClick={() => window.location.href = '/login'} className="mt-6 min-h-11 px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300">
                        العودة لتسجيل الدخول
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-4 sm:pt-7 pb-12 px-3 sm:px-5 lg:px-8 font-sans relative overflow-x-hidden text-slate-900 dark:text-slate-100">
            {/* Retain the page's ambient background, with pointer events disabled. */}
            <div className="absolute top-10 left-0 sm:left-10 w-56 sm:w-72 h-56 sm:h-72 bg-teal-400/10 dark:bg-teal-400/5 rounded-full blur-3xl pointer-events-none print:hidden" aria-hidden="true" />
            <div className="absolute bottom-10 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none print:hidden" aria-hidden="true" />

            {/* Printable schedule remains separate so print output is not affected by screen layout. */}
            <div id="printable-schedule" className="hidden print:flex flex-col bg-white text-black w-full h-[210mm] max-h-[210mm] mx-auto box-border overflow-hidden">
                <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-2 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <img src="/school-logo.png" alt="EFIPS Logo" className="w-12 h-12 object-contain shrink-0" crossOrigin="anonymous" />
                        <div className="min-w-0">
                            <h2 className="text-sm font-black text-black m-0 p-0 leading-tight">{isAr ? t('schoolNameAr') : t('schoolNameEn')}</h2>
                        </div>
                    </div>
                    <div className="text-center min-w-0">
                        <h1 className="text-base font-black uppercase text-black border-2 border-black py-1 px-4 rounded-lg m-0">{t('printHeader')}</h1>
                    </div>
                    <div className="text-left shrink-0">
                        <p className="text-[10px] font-bold text-black m-0">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <table className="w-full border-collapse border-2 border-black text-[10px] table-fixed h-full">
                        <thead>
                            <tr className="bg-gray-200 border-b-2 border-black">
                                <th className="p-1 border-r border-black text-center font-black w-16">{t('periodLabel')}</th>
                                {days.map((day, idx) => <th key={idx} className="p-1 border-r border-black text-center font-black">{day}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {allPeriods.map((period) => (
                                <tr key={period} className="border-b border-black h-[11%]">
                                    <td className="p-1 border-r border-black text-center font-black bg-gray-100 whitespace-nowrap">{t('periodLabel')} {period}</td>
                                    {days.map((day, dIdx) => {
                                        const key = `${day}_${period}`;
                                        const slot = scheduleData[key];
                                        const isFriday = day === 'الجمعة' || day === 'Friday';
                                        if (isFriday && period > 4) return <td key={dIdx} className="p-1 border-r border-black text-center align-middle bg-gray-50">-</td>;
                                        return (
                                            <td key={dIdx} className="p-1 border-r border-black text-center align-middle overflow-hidden">
                                                {slot?.teacher ? (
                                                    <div className="flex flex-col items-center justify-center leading-tight">
                                                        <div className="font-black text-black truncate max-w-full">{slot.teacher}</div>
                                                        <div className="font-bold text-gray-800 truncate max-w-full">{slot.subject}</div>
                                                        <div className="font-bold text-gray-600 truncate max-w-full">{slot.grade}</div>
                                                    </div>
                                                ) : <span className="text-gray-300">-</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-end mt-2 pt-2 border-t-2 border-gray-400 shrink-0">
                    <div className="text-center w-1/3"><p className="font-black text-[10px] mb-4 m-0">{t('librarianSign')}</p><div className="w-3/4 mx-auto border-b border-black" /></div>
                    <div className="text-center w-1/3"><p className="font-black text-[10px] mb-4 m-0">{t('managementSign')}</p><div className="w-3/4 mx-auto border-b border-black" /></div>
                </div>
            </div>

            <main className="max-w-[1500px] mx-auto print:hidden relative z-10">
                {/* Page heading and actions */}
                <section className="mb-5 sm:mb-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 sm:p-6 lg:p-7 shadow-[0_12px_35px_rgba(15,23,42,0.06)] dark:shadow-black/20">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                        <div className="min-w-0 text-center xl:text-start">
                            <div className="inline-flex max-w-full items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs border border-emerald-200 dark:border-emerald-900 mb-3">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                                <span className="truncate">{userType === 'admin' ? (isAr ? 'نمط المسؤول النشط' : 'Administrator mode') : getDisplayName()}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent tracking-tight leading-tight py-1">
                                {t('pageTitle')}
                            </h1>
                            <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-500 dark:text-slate-400 mt-2 max-w-3xl mx-auto xl:mx-0">{t('subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto xl:min-w-[390px]">
                            <button
                                type="button"
                                onClick={handleDownloadMySchedule}
                                className="min-h-12 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 sm:px-5 py-3 rounded-2xl font-black text-sm border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all shadow-lg hover:shadow-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                            >
                                <span aria-hidden="true">↓</span><span>{t('myScheduleBtn')}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="min-h-12 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 px-4 sm:px-5 py-3 rounded-2xl font-black text-sm border-b-4 border-slate-950 dark:border-slate-300 active:border-b-0 active:translate-y-1 transition-all shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
                            >
                                <span aria-hidden="true">▤</span><span>{t('printBtn')}</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* At-a-glance totals */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-7" aria-label={isAr ? 'ملخص الجدول' : 'Schedule summary'}>
                    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/80 bg-white/90 dark:bg-slate-900/85 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl" aria-hidden="true">✓</div>
                        <div className="min-w-0"><p className="text-xs font-bold text-slate-500 dark:text-slate-400">{isAr ? 'الحصص المحجوزة' : 'Booked periods'}</p><p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{bookedSlots}</p></div>
                    </div>
                    <div className="rounded-2xl border border-sky-200 dark:border-sky-900/80 bg-white/90 dark:bg-slate-900/85 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-11 h-11 shrink-0 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xl" aria-hidden="true">＋</div>
                        <div className="min-w-0"><p className="text-xs font-bold text-slate-500 dark:text-slate-400">{isAr ? 'الحصص المتاحة' : 'Available periods'}</p><p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{freeSlots}</p></div>
                    </div>
                    <div className="rounded-2xl border border-violet-200 dark:border-violet-900/80 bg-white/90 dark:bg-slate-900/85 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-11 h-11 shrink-0 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 flex items-center justify-center text-xl" aria-hidden="true">▦</div>
                        <div className="min-w-0"><p className="text-xs font-bold text-slate-500 dark:text-slate-400">{isAr ? 'حصصي المسجلة' : 'My periods'}</p><p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{myBookedSlots}</p></div>
                    </div>
                </section>

                {isLoading ? (
                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-center py-16 sm:py-20 px-4 text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 animate-pulse" role="status">{t('loading')}</div>
                ) : (
                    <>
                        {/* Mobile and tablet layout: day selector + readable, tappable period cards. */}
                        <section className="xl:hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3 sm:p-5 shadow-[0_16px_40px_rgba(15,23,42,0.07)] dark:shadow-black/20">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
                                <div>
                                    <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mb-1">{isAr ? 'عرض الهاتف والتابلت' : 'Mobile and tablet view'}</p>
                                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{isAr ? 'اختر اليوم لعرض الحصص' : 'Choose a day to view periods'}</h2>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{isAr ? 'اضغط على أي حصة للحجز أو التعديل' : 'Tap any period to book or edit'}</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-5" role="group" aria-label={isAr ? 'اختيار يوم الجدول' : 'Choose schedule day'}>
                                {days.map((day, idx) => {
                                    const isActive = activeMobileDay === day;
                                    const dayAccents = [
                                        'border-emerald-500 bg-emerald-600 text-white shadow-emerald-600/20',
                                        'border-blue-500 bg-blue-600 text-white shadow-blue-600/20',
                                        'border-violet-500 bg-violet-600 text-white shadow-violet-600/20',
                                        'border-amber-500 bg-amber-500 text-white shadow-amber-600/20',
                                        'border-cyan-500 bg-cyan-600 text-white shadow-cyan-600/20'
                                    ];
                                    return (
                                        <button key={day} type="button" onClick={() => setMobileDay(day)} aria-pressed={isActive}
                                            className={`min-h-11 px-3 py-2 rounded-xl border text-sm font-extrabold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${isActive ? `${dayAccents[idx % dayAccents.length]} shadow-md -translate-y-0.5` : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800'}`}>
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                                <h3 className="text-lg sm:text-xl font-black">{activeMobileDay}</h3>
                                <span className="shrink-0 text-xs font-bold rounded-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {isAr ? `${activeMobileDay === 'الجمعة' ? 4 : 8} حصص` : `${activeMobileDay === 'Friday' ? 4 : 8} periods`}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {allPeriods.map((period) => {
                                    const key = `${activeMobileDay}_${period}`;
                                    const slot = scheduleData[key];
                                    const isFriday = activeMobileDay === 'الجمعة' || activeMobileDay === 'Friday';
                                    const isUnavailable = isFriday && period > 4;
                                    const isMine = Boolean(slot?.teacher) && slot.user_id === userData.teacher_id;
                                    return (
                                        <article key={key} className={`schedule-period-card rounded-2xl border p-3 sm:p-4 transition-all duration-200 ${isUnavailable ? 'border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 opacity-70' : slot?.teacher ? 'border-emerald-200 dark:border-emerald-900/80 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-800'}`}>
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="w-[76px] sm:w-[92px] min-h-[76px] shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center px-2 py-3 text-center">
                                                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">{t('periodLabel')}</span>
                                                    <span className="text-2xl sm:text-3xl leading-tight font-black text-slate-800 dark:text-white tabular-nums">{period}</span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    {isUnavailable ? (
                                                        <div className="min-h-[76px] flex flex-col items-start justify-center gap-1">
                                                            <span className="inline-flex rounded-full px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-extrabold">{isAr ? 'غير متاح' : 'Unavailable'}</span>
                                                            <p className="text-xs leading-relaxed font-semibold text-slate-500 dark:text-slate-400">{isAr ? 'يوم الجمعة معتمد لأربع حصص فقط' : 'Friday has four approved periods only'}</p>
                                                        </div>
                                                    ) : slot?.teacher ? (
                                                        <>
                                                            <button type="button" onClick={() => handleOpenModal(activeMobileDay, period)} className="w-full min-w-0 text-start rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500" aria-label={`${isAr ? 'تعديل حصة' : 'Edit period'} ${period}, ${slot.teacher}`}>
                                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                                    <span className="inline-block w-2 h-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                                                                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white break-words">{slot.teacher}</span>
                                                                    <span className={`text-[10px] font-extrabold rounded-full px-2 py-1 ${isMine ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{isMine ? (isAr ? 'حجزي' : 'My booking') : (isAr ? 'محجوزة' : 'Booked')}</span>
                                                                </div>
                                                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 break-words">{slot.subject || (isAr ? 'المادة غير محددة' : 'Subject not specified')}</p>
                                                                <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 break-words">{t('grade')}: {slot.grade || '—'}</p>
                                                            </button>
                                                            <button type="button" onClick={() => handleAddToGoogleCalendar(activeMobileDay, period, slot)} className="mt-3 min-h-10 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-3 py-2 text-xs font-extrabold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                                                                <span aria-hidden="true">▦</span><span>{t('addToGoogleCal')}</span>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button type="button" onClick={() => handleOpenModal(activeMobileDay, period)} className="w-full min-h-[76px] text-start flex items-center justify-between gap-3 rounded-xl p-2 sm:p-3 border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-700 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                                                            <span className="min-w-0 text-sm font-extrabold text-slate-500 dark:text-slate-400">{t('bookSlotText')}</span>
                                                            <span className="w-9 h-9 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl font-black" aria-hidden="true">+</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Full weekly matrix on large screens. */}
                        <section className="hidden xl:block rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 lg:p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] dark:shadow-black/20">
                            <div className="flex items-center justify-between gap-4 mb-4 px-1">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{isAr ? 'الجدول الأسبوعي' : 'Weekly schedule'}</h2>
                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{isAr ? 'اختر خانة لعرض خيارات الحجز والتعديل' : 'Select a period to book or edit it'}</p>
                                </div>
                                <span className="text-xs font-bold rounded-full px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">{isAr ? 'عرض كامل للأسبوع' : 'Full-week view'}</span>
                            </div>
                            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                                <table className="w-full min-w-[1120px] table-fixed border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
                                            <th scope="col" className="w-28 p-3 text-center font-black text-slate-500 dark:text-slate-400 text-sm">{isAr ? 'الحصة' : 'Period'}</th>
                                            {days.map((day, idx) => {
                                                const dayColors = [
                                                    'from-emerald-500 to-teal-600',
                                                    'from-indigo-500 to-blue-600',
                                                    'from-purple-500 to-pink-600',
                                                    'from-amber-500 to-orange-600',
                                                    'from-cyan-500 to-blue-500'
                                                ];
                                                return <th key={day} scope="col" className="p-2 text-center font-black text-base"><div className={`py-3 px-2 rounded-xl bg-gradient-to-r ${dayColors[idx % dayColors.length]} text-white shadow-sm`}>{day}</div></th>;
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allPeriods.map((period) => (
                                            <tr key={period} className="border-b border-slate-100 dark:border-slate-800/80 last:border-b-0">
                                                <th scope="row" className="p-2 align-top bg-slate-50/80 dark:bg-slate-950/40">
                                                    <div className="min-h-[116px] rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center gap-1 px-2 py-3">
                                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{t('periodLabel')}</span>
                                                        <span className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">{period}</span>
                                                    </div>
                                                </th>
                                                {days.map((day) => {
                                                    const key = `${day}_${period}`;
                                                    const slot = scheduleData[key];
                                                    const isFriday = day === 'الجمعة' || day === 'Friday';
                                                    const isUnavailable = isFriday && period > 4;
                                                    const isMine = Boolean(slot?.teacher) && slot.user_id === userData.teacher_id;
                                                    return (
                                                        <td key={day} className="p-2 align-top border-s border-slate-100 dark:border-slate-800/70">
                                                            {isUnavailable ? (
                                                                <div className="min-h-[116px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 flex flex-col items-center justify-center text-center px-2 py-3 text-slate-400">
                                                                    <span className="text-sm font-black">—</span><span className="text-[10px] leading-relaxed font-bold mt-1">{isAr ? 'غير متاح\nأربع حصص فقط' : 'Unavailable\nFour periods only'}</span>
                                                                </div>
                                                            ) : slot?.teacher ? (
                                                                <div className="min-h-[116px] rounded-xl border border-emerald-200 dark:border-emerald-900/80 bg-emerald-50/70 dark:bg-emerald-950/20 hover:border-emerald-400 dark:hover:border-emerald-700 transition-colors p-3 flex flex-col items-stretch">
                                                                    <button type="button" onClick={() => handleOpenModal(day, period)} className="text-start min-w-0 flex-1 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500" aria-label={`${isAr ? 'تعديل حصة' : 'Edit period'} ${period}, ${slot.teacher}`}>
                                                                        <div className="flex items-start gap-1.5 mb-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" aria-hidden="true" /><span className="font-black text-slate-900 dark:text-white text-xs leading-relaxed break-words">{slot.teacher}</span></div>
                                                                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 leading-relaxed break-words">{slot.subject}</p>
                                                                        <p className="mt-1 inline-block max-w-full text-[10px] font-extrabold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800 rounded-md px-2 py-1 break-words">{slot.grade}</p>
                                                                    </button>
                                                                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1">
                                                                        <span className={`text-[9px] font-extrabold ${isMine ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>{isMine ? (isAr ? 'حجزي' : 'Mine') : (isAr ? 'محجوزة' : 'Booked')}</span>
                                                                        <button type="button" title={t('addToGoogleCal')} aria-label={`${t('addToGoogleCal')}: ${day} ${period}`} onClick={() => handleAddToGoogleCalendar(day, period, slot)} className="min-h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-[10px] font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">▦ Google</button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button type="button" onClick={() => handleOpenModal(day, period)} className="w-full min-h-[116px] rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-400 dark:hover:border-emerald-700 text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 p-3 flex flex-col items-center justify-center gap-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                                                                    <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-black" aria-hidden="true">+</span>
                                                                    <span className="text-xs font-extrabold text-center leading-relaxed">{t('bookSlotText')}</span>
                                                                </button>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}

                {/* Booking editor; constrained to viewport height so the action buttons remain reachable on phones. */}
                {selectedSlot && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-sm animate-fade-in" role="presentation">
                        <div role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title" className="w-full max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)] overflow-y-auto bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-emerald-200 dark:border-emerald-900 shadow-[0_20px_80px_rgba(0,0,0,0.35)] relative">
                            <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
                                <div className="min-w-0">
                                    <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mb-1">{isAr ? 'إدارة الحصة' : 'Period management'}</p>
                                    <h3 id="schedule-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug break-words">{selectedSlot.day} - {t('periodLabel')} {selectedSlot.period}</h3>
                                </div>
                                <button type="button" onClick={() => setSelectedSlot(null)} aria-label={t('close')} className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 font-black text-xl transition-colors">×</button>
                            </div>
                            <form onSubmit={handleSaveSlot} className="space-y-4">
                                <div>
                                    <label className="text-sm font-extrabold text-slate-600 dark:text-slate-300 mb-1.5 block px-1" htmlFor="schedule-teacher">{t('teacherName')}</label>
                                    <input id="schedule-teacher" type="text" required value={formTeacher} onChange={(e) => setFormTeacher(e.target.value)} className="w-full min-h-12 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold transition-all" disabled={userType !== 'admin'} />
                                    {userType !== 'admin' && <p className="text-xs text-slate-400 mt-1.5 px-1">{isAr ? 'الاسم مسجل تلقائياً ولا يمكن تغييره' : 'The name is filled in automatically and cannot be changed.'}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-extrabold text-slate-600 dark:text-slate-300 mb-1.5 block px-1" htmlFor="schedule-subject">{t('subject')}</label>
                                    <input id="schedule-subject" type="text" required value={formSubject} onChange={(e) => setFormSubject(e.target.value)} className="w-full min-h-12 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold transition-all" />
                                </div>
                                <div>
                                    <label className="text-sm font-extrabold text-slate-600 dark:text-slate-300 mb-1.5 block px-1" htmlFor="schedule-grade">{t('grade')}</label>
                                    <input id="schedule-grade" type="text" required value={formGrade} onChange={(e) => setFormGrade(e.target.value)} className="w-full min-h-12 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold transition-all" />
                                </div>
                                <div className="pt-2 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <button type="submit" className="min-h-12 w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-xl shadow-md transition-all active:scale-[.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">{t('saveBtn')}</button>
                                        <button type="button" onClick={() => setSelectedSlot(null)} className="min-h-12 w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">{t('close')}</button>
                                    </div>
                                    {(userType === 'admin' || scheduleData[`${selectedSlot.day}_${selectedSlot.period}`]?.user_id === userData.teacher_id) && scheduleData[`${selectedSlot.day}_${selectedSlot.period}`]?.teacher && (
                                        <button type="button" onClick={handleDeleteSlot} className="w-full min-h-11 px-4 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black rounded-xl shadow-md transition-all active:scale-[.99]">{t('deleteBtn')}</button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                @media print {
                    @page { size: A4 landscape; margin: 5mm; }
                    body { background: white !important; color: black !important; margin: 0 !important; padding: 0 !important; height: 100vh !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:flex { display: flex !important; }
                }
                @keyframes fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                .schedule-period-card { animation: fade-in 0.2s ease-out both; }
                @media (prefers-reduced-motion: reduce) {
                    .animate-fade-in, .schedule-period-card { animation: none !important; }
                    *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
                }
            `}</style>
        </div>
    );
};

export default SchedulePage;
