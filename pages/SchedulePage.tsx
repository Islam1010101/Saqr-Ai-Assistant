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


            <style>{`
                /* Feedback-page visual language; scoped to header only. */
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
                .schedule-efips-hero,.schedule-efips-hero *{font-family:'Cairo',sans-serif}
                .schedule-efips-hero{position:relative;isolation:isolate;overflow:hidden;min-height:445px;width:100%;
                    border:1px solid rgba(108,212,180,.58);border-radius:clamp(26px,4vw,40px);
                    background:linear-gradient(115deg,#0b574b 0%,#11786d 52%,#176985 100%);
                    box-shadow:0 23px 65px rgba(12,91,76,.23);padding:clamp(23px,3.6vw,48px);color:#fff;}
                .schedule-efips-hero:before{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
                    background:radial-gradient(circle at 83% 24%,rgba(255,215,155,.22),transparent 48%),
                    radial-gradient(circle at 5% 92%,rgba(112,236,220,.18),transparent 47%),
                    repeating-linear-gradient(130deg,transparent 0 52px,rgba(255,255,255,.035) 53px 54px,transparent 55px 108px);}
                .schedule-efips-hero:after{content:"";position:absolute;inset:0 0 auto;height:5px;pointer-events:none;
                    background:linear-gradient(90deg,#0fa989,#79d9d2,#f2c87a);}
                .schedule-efips-hero-layout{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);align-items:center;gap:clamp(14px,3vw,42px);}
                .schedule-efips-hero-copy{min-width:0;position:relative;z-index:3;animation:schedule-header-enter .72s ease-out both;}
                .schedule-efips-kicker{display:inline-flex;gap:8px;align-items:center;padding:9px 15px;border:1px solid rgba(255,222,172,.47);border-radius:999px;background:rgba(255,255,255,.12);color:#ffe7bd;font-size:clamp(10px,1.15vw,13px);font-weight:900;}
                .schedule-efips-heading{font-size:clamp(34px,5vw,65px);line-height:1.35;font-weight:900;letter-spacing:-.035em;color:#fff!important;-webkit-text-fill-color:#fff!important;text-shadow:0 9px 28px rgba(2,42,40,.43);margin-top:clamp(14px,2vw,24px);}
                .schedule-efips-description{max-width:570px;margin-top:17px;font-size:clamp(13px,1.4vw,17px);line-height:2;font-weight:700;color:#e4fcf3;}
                .schedule-header-rule{display:flex;gap:7px;margin-top:18px;align-items:center;}
                .schedule-header-rule span{height:5px;border-radius:20px;box-shadow:0 2px 9px rgba(255,255,255,.12);}
                .schedule-header-rule span:nth-child(1){width:57px;background:#d4f8e8;}
                .schedule-header-rule span:nth-child(2){width:32px;background:#f1c878;}
                .schedule-header-rule span:nth-child(3){width:17px;background:#83dbee;}
                .schedule-efips-art-area{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;min-width:0;}
                .schedule-efips-portrait{width:100%;max-width:450px;height:clamp(300px,31vw,420px);min-height:0;position:relative;isolation:isolate;display:grid;place-items:center;}
                .schedule-efips-hero .schedule-saqr-image{width:100%;height:100%;position:relative;z-index:3;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 22px 26px rgba(0,28,29,.58));animation:schedule-header-saqr-float 5.5s ease-in-out infinite;}
                .schedule-efips-hero .schedule-saqr-halo{width:min(94%,360px);background:radial-gradient(circle,rgba(255,252,225,.25) 0%,rgba(89,228,209,.24) 56%,transparent 77%);filter:blur(11px);animation:schedule-header-halo 5.4s ease-in-out infinite;}
                .schedule-efips-hero .schedule-saqr-ring{width:min(95%,388px);border:1px dashed rgba(226,255,238,.51);animation:schedule-saqr-spin 36s linear infinite;}
                .schedule-efips-hero .schedule-saqr-ring-second{width:min(75%,305px);border:1px solid rgba(255,219,147,.42);border-top-color:rgba(255,220,157,.87);border-bottom-color:rgba(141,236,233,.83);animation-direction:reverse;animation-duration:28s;}
                .schedule-saqr-symbol{position:absolute;z-index:4;display:grid;place-items:center;width:clamp(44px,5vw,60px);aspect-ratio:1;border-radius:18px;background:rgba(249,255,249,.94);border:1px solid rgba(255,255,255,.8);box-shadow:0 10px 26px rgba(0,45,46,.25);color:#0b8973;animation:schedule-header-symbol 5s ease-in-out infinite;}
                .schedule-saqr-symbol svg{width:55%;height:55%;}
                .schedule-saqr-symbol--calendar{top:9%;inset-inline-start:4%;}
                .schedule-saqr-symbol--clock{top:21%;inset-inline-end:2%;color:#cc8b34;animation-delay:-1.5s;}
                .schedule-saqr-symbol--book{bottom:14%;inset-inline-start:5%;color:#1d94ae;animation-delay:-3.1s;}
                .schedule-saqr-platform{position:absolute;z-index:1;bottom:4%;width:70%;height:22px;border-radius:50%;background:#002c3070;filter:blur(17px);}
                .schedule-efips-actions{position:relative;z-index:5;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:100%;max-width:490px;margin-top:12px;}
                .schedule-efips-action{min-height:49px;border:1px solid #ffffff71;box-shadow:0 7px 20px #063e3e55;font-size:12px;transition:transform .24s,box-shadow .24s;}
                .schedule-efips-action:hover{transform:translateY(-3px);box-shadow:0 12px 26px #063e3e70;}
                .schedule-efips-action-primary{color:#075b49;background:#fff;}
                .schedule-efips-action-primary:hover{background:#e9fff4;}
                .schedule-efips-action-secondary{color:#fff;background:#083f42bb;}
                .schedule-efips-action-secondary:hover{background:#063d38;}
                .schedule-efips-hero .schedule-saqr-decoration{z-index:0;display:none;}
                @media(max-width:1100px){.schedule-efips-hero-layout{grid-template-columns:minmax(0,1fr) minmax(240px,.85fr);gap:12px;}
                    .schedule-efips-heading{font-size:clamp(32px,4.5vw,53px);}
                    .schedule-efips-portrait{height:300px;}
                    .schedule-efips-actions{grid-template-columns:1fr;max-width:285px;}
                }
                @media(max-width:730px){.schedule-efips-hero{padding:26px 19px 21px;min-height:0;}
                    .schedule-efips-hero-layout{grid-template-columns:1fr;gap:10px;}
                    .schedule-efips-hero-copy{text-align:center;}
                    .schedule-efips-kicker{font-size:11px;}
                    .schedule-efips-heading{font-size:clamp(32px,8vw,46px);margin-top:13px;}
                    .schedule-header-rule{justify-content:center;}
                    .schedule-efips-description{margin:16px auto 0;font-size:13px;line-height:1.85;}
                    .schedule-efips-portrait{height:clamp(250px,65vw,335px);max-width:340px;}
                    .schedule-efips-actions{grid-template-columns:repeat(2,minmax(0,1fr));max-width:100%;margin-top:2px;}
                    .schedule-efips-action{font-size:11px;padding:10px;line-height:1.5;}
                }
                @media(max-width:380px){.schedule-efips-hero{padding-inline:13px;}.schedule-efips-portrait{height:230px;}
                    .schedule-efips-actions{grid-template-columns:1fr;}}
                @media(hover:none){.schedule-efips-action:hover{transform:none;}}
                @media(prefers-reduced-motion:reduce){.schedule-efips-hero *{animation:none!important;transition:none!important;}}
                @keyframes schedule-header-enter{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
                @keyframes schedule-header-saqr-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-13px)}}
                @keyframes schedule-header-halo{0%,100%{opacity:.6;transform:scale(.94)}50%{opacity:1;transform:scale(1.05)}}
                @keyframes schedule-header-symbol{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-9px) rotate(5deg)}}
                .schedule-saqr-layout{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:10px;min-width:0}
                .schedule-saqr-portrait{position:relative;isolation:isolate;width:min(100%,265px);height:230px;display:grid;place-items:center;pointer-events:none}
                .schedule-saqr-image{position:relative;z-index:3;width:100%;height:100%;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 15px 22px rgba(3,68,64,.32));animation:schedule-saqr-float 5.2s ease-in-out infinite}
                .schedule-saqr-halo{position:absolute;z-index:0;width:82%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(52,211,153,.3),rgba(20,184,166,.09) 60%,transparent 73%);filter:blur(8px);animation:schedule-saqr-pulse 6s ease-in-out infinite}
                .schedule-saqr-ring{position:absolute;z-index:1;width:77%;aspect-ratio:1;border:1px dashed rgba(13,148,136,.45);border-radius:50%;animation:schedule-saqr-spin 30s linear infinite}
                .schedule-saqr-ring-second{width:60%;border-color:rgba(217,159,67,.55);animation-direction:reverse;animation-duration:23s}
                .schedule-saqr-glow,.schedule-saqr-spark{position:absolute;pointer-events:none}
                .schedule-saqr-decoration{overflow:hidden}
                .schedule-saqr-glow{inset-inline-end:8%;top:2%;width:280px;height:230px;background:radial-gradient(circle,rgba(16,185,129,.09),transparent 73%)}
                .schedule-saqr-spark{z-index:4;width:10px;height:10px;transform:rotate(45deg);background:#e6b86c;border-radius:2px;animation:schedule-saqr-twinkle 3.4s ease-in-out infinite}
                .schedule-saqr-spark-a{top:15%;inset-inline-start:6%}.schedule-saqr-spark-b{bottom:25%;inset-inline-end:8%;background:#14b8a6;animation-delay:-1.5s}
                @media(min-width:1280px){.schedule-saqr-layout{flex-direction:row;gap:20px}.schedule-saqr-portrait{width:240px;height:235px;flex-shrink:0}}
                @media(max-width:640px){.schedule-saqr-portrait{width:210px;height:175px}.schedule-saqr-layout{width:100%}.schedule-saqr-layout>div:last-child{width:100%}}
                @media(prefers-reduced-motion:reduce){.schedule-saqr-image,.schedule-saqr-halo,.schedule-saqr-ring,.schedule-saqr-spark{animation:none!important}}
                @keyframes schedule-saqr-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
                @keyframes schedule-saqr-pulse{0%,100%{opacity:.65;transform:scale(.96)}50%{opacity:1;transform:scale(1.06)}}
                @keyframes schedule-saqr-spin{to{transform:rotate(360deg)}}
                @keyframes schedule-saqr-twinkle{0%,100%{opacity:.3}50%{opacity:1}}
            `}</style>
            <main className="max-w-[1500px] mx-auto print:hidden relative z-10">
                {/* Page heading and actions */}
                <section className="schedule-efips-hero mb-5 sm:mb-7">
                    <div className="schedule-efips-hero-layout">
                        <div className="schedule-saqr-decoration pointer-events-none absolute inset-0" aria-hidden="true">
                            <span className="schedule-saqr-glow"/><span className="schedule-saqr-ring"/><span className="schedule-saqr-ring schedule-saqr-ring-second"/>
                        </div>
                        <div className="schedule-efips-hero-copy min-w-0 text-center xl:text-start">
                            <div className="schedule-efips-kicker inline-flex max-w-full items-center justify-center gap-2 mb-3">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                                <span className="truncate">{userType === 'admin' ? (isAr ? 'نمط المسؤول النشط' : 'Administrator mode') : getDisplayName()}</span>
                            </div>
                            <h1 className="schedule-efips-heading font-black tracking-tight leading-tight py-1">
                                {t('pageTitle')}
                            </h1>
                            <p className="schedule-efips-description text-sm sm:text-base font-semibold leading-relaxed mt-2 max-w-3xl mx-auto xl:mx-0">{t('subtitle')}</p>
                            <div className="schedule-header-rule" aria-hidden="true"><span/><span/><span/></div>
                        </div>
                        <div className="schedule-saqr-layout schedule-efips-art-area">
                            <div className="schedule-saqr-portrait schedule-efips-portrait" role="img" aria-label={isAr ? 'شخصية صقر الخاصة بجدول المكتبة' : 'Saqr library schedule character'}>
                                <span className="schedule-saqr-halo" aria-hidden="true"/>
                                <span className="schedule-saqr-spark schedule-saqr-spark-a" aria-hidden="true"/>
                                <span className="schedule-saqr-spark schedule-saqr-spark-b" aria-hidden="true"/>
                                <span className="schedule-saqr-platform" aria-hidden="true"/>
                                <span className="schedule-saqr-ring schedule-saqr-ring-second" aria-hidden="true"/>
                                <span className="schedule-saqr-ring" aria-hidden="true"/>
                                <span className="schedule-saqr-symbol schedule-saqr-symbol--calendar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 2v5M16 2v5M3 10h18M8 15h8"/></svg></span>
                                <span className="schedule-saqr-symbol schedule-saqr-symbol--clock" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></svg></span>
                                <span className="schedule-saqr-symbol schedule-saqr-symbol--book" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5C8 3 5 3 2 5v14c4-2 7-1 10 1 3-2 6-3 10-1V5c-3-2-6-2-10 0zm0 0v15"/></svg></span>
                                <img src="/Saqr%20Schedule.png" alt="" className="schedule-saqr-image" loading="eager" decoding="async" />
                            </div>
                            <div className="schedule-efips-actions grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            <button
                                type="button"
                                onClick={handleDownloadMySchedule}
                                className="schedule-efips-action schedule-efips-action-primary min-h-12 w-full inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-black text-sm active:translate-y-1 transition-all shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                            >
                                <span aria-hidden="true">↓</span><span>{t('myScheduleBtn')}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="schedule-efips-action schedule-efips-action-secondary min-h-12 w-full inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-black text-sm active:translate-y-1 transition-all shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
                            >
                                <span aria-hidden="true">▤</span><span>{t('printBtn')}</span>
                            </button>
                        </div>
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
                        {/* Preserve the existing day-selector cards for phones, tablets and narrow/touch screens. */}
                        <section className="schedule-compact-view rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3 sm:p-5 shadow-[0_16px_40px_rgba(15,23,42,0.07)] dark:shadow-black/20">
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

                        {/* Standard weekly timetable for desktop browser windows, not touch-only tablet screens. */}
                        <section className="schedule-desktop-view rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 lg:p-5 shadow-[0_18px_45px_rgba(15,118,110,0.09)] dark:shadow-black/25">
                            <div className="flex items-center justify-between gap-4 mb-4 px-1">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{isAr ? 'الجدول الأسبوعي' : 'Weekly schedule'}</h2>
                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{isAr ? 'اختر خانة لعرض خيارات الحجز والتعديل' : 'Select a period to book or edit it'}</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-end gap-2 text-[11px] font-extrabold">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-emerald-800 dark:text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />{isAr ? 'محجوزة' : 'Booked'}</span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-amber-800 dark:text-amber-200"><span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />{isAr ? 'حصصي' : 'My periods'}</span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 px-3 py-2 text-teal-800 dark:text-teal-200"><span className="h-2 w-2 rounded-full bg-teal-500" aria-hidden="true" />{isAr ? 'متاحة' : 'Available'}</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                                <table className="w-full min-w-[850px] table-fixed border-separate border-spacing-[5px]" aria-label={isAr ? 'جدول حجز حصص المكتبة الأسبوعي' : 'Weekly library booking timetable'}>
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
                                            <tr key={period} className="group/period transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/15">
                                                <th scope="row" className="p-2 align-top bg-slate-50/80 dark:bg-slate-950/40">
                                                    <div className="min-h-[104px] rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center gap-1 px-2 py-3 transition-all duration-200 group-hover/period:border-emerald-300 dark:group-hover/period:border-emerald-800 group-hover/period:shadow-sm">
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
                                                        <td key={day} className="p-1 align-top">
                                                            {isUnavailable ? (
                                                                <div className="min-h-[104px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 flex flex-col items-center justify-center text-center px-2 py-3 text-slate-400">
                                                                    <span className="text-sm font-black">—</span><span className="text-[10px] leading-relaxed font-bold mt-1">{isAr ? 'غير متاح\nأربع حصص فقط' : 'Unavailable\nFour periods only'}</span>
                                                                </div>
                                                            ) : slot?.teacher ? (
                                                                <div className={`min-h-[104px] rounded-xl border p-2.5 flex flex-col items-stretch transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${isMine ? 'border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/20 hover:border-amber-500 hover:shadow-amber-300/15' : 'border-emerald-200 dark:border-emerald-900/80 bg-emerald-50/80 dark:bg-emerald-950/20 hover:border-emerald-500 hover:shadow-emerald-300/15'}`}>
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
                                                                <button type="button" onClick={() => handleOpenModal(day, period)} className="group/free w-full min-h-[104px] rounded-xl border-2 border-dashed border-teal-200 dark:border-teal-900/80 bg-teal-50/40 dark:bg-teal-950/10 hover:bg-teal-100/80 dark:hover:bg-teal-950/35 hover:border-teal-500 dark:hover:border-teal-500 text-teal-700 dark:text-teal-300 p-2.5 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-400/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                                                                    <span className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-lg font-black transition-transform duration-200 group-hover/free:scale-110" aria-hidden="true">+</span>
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
                /* Desktop timetable starts at laptop-sized windows when a mouse/trackpad is present.
                   The original day-card interface stays unchanged on phones, tablets and touch-only screens. */
                .schedule-compact-view { display: block; }
                .schedule-desktop-view { display: none; }
                @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
                    .schedule-compact-view { display: none; }
                    .schedule-desktop-view { display: block; }
                }
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
