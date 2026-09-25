import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { supabase } from '../src/utils/supabase';

const translations = {
    ar: {
        pageTitle: "جدول حجز حصص بالمكتبة",
        subtitle: "نظام حجز وتنسيق حصص زيارة المكتبة المدرسية بطريقة ذكية ومبتكرة",
        secureTitle: "بوابة دخول المعلمين",
        passPlaceholder: "رقم الموظف في المدرسة",
        authBtn: "دخول بوابة المعلمين",
        errorPass: "رقم الموظف غير صحيح! يجب أن يبدأ بـ hr ويتبعه 3 أو 4 أرقام.",
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
        unauthorizedDelete: "عذراً، لا تملك صلاحية حذف الحصص. مخصصة للمسؤول فقط.",
        alreadyBooked: "عذراً، هذه الحصة محجوزة مسبقاً من قبل معلم آخر، ولا يمكن تعديلها إلا من قبل المسؤول .",
        bookSlotText: "+ اضغط لحجز الحصة",
        addToGoogleCal: "إضافة إلى Google Calendar",
        downloadIcs: "تحميل الحصة (.ics)",
        enterTeacherName: "أدخل اسمك تماماً كما تم تسجيله في الجدول:",
        noClassesFound: "لم يتم العثور على حصص مسجلة بهذا الاسم.",
        loading: "جاري تحميل جدول الحصص السحري...",
        schoolNameAr: "مدرسة صقر الإمارات الدولية الخاصة",
        schoolNameEn: "Emirates Falcon International Private School",
        printHeader: "الجدول الزمني المعتمد لزيارات المكتبة المدرسية",
        librarianSign: "اعتماد أمين المكتبة",
        managementSign: "توقيع الإدارة المدرسية"
    },
    en: {
        pageTitle: "Library Schedule",
        subtitle: "Smart and vibrant library visit booking and coordination system",
        secureTitle: "Teachers Portal Login",
        passPlaceholder: "Employee ID",
        authBtn: "Enter Portal",
        errorPass: "Invalid Employee ID! Must start with 'hr' followed by 3 or 4 digits.",
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
        unauthorizedDelete: "Sorry, you do not have permission to delete. Only Admin can delete.",
        alreadyBooked: "Sorry, this period is already booked by another teacher and can only be modified by the admin.",
        bookSlotText: "+ Click to Book",
        addToGoogleCal: "Add to Google Calendar",
        downloadIcs: "Download Period (.ics)",
        enterTeacherName: "Enter your name exactly as registered in the schedule:",
        noClassesFound: "No classes found registered under this name.",
        loading: "Loading magical schedule...",
        schoolNameAr: "مدرسة صقر الإمارات الدولية الخاصة",
        schoolNameEn: "Emirates Falcon International Private School",
        printHeader: "Certified Library Visit Timetable",
        librarianSign: "Librarian Approval",
        managementSign: "Management Signature"
    }
};

const SchedulePage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [password, setPassword] = useState('');
    const [currentEmployeeId, setCurrentEmployeeId] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [scheduleData, setScheduleData] = useState<{ [key: string]: { teacher: string; subject: string; grade: string } }>({});
    
    const [selectedSlot, setSelectedSlot] = useState<{ day: string; period: number } | null>(null);
    const [formTeacher, setFormTeacher] = useState('');
    const [formSubject, setFormSubject] = useState('');
    const [formGrade, setFormGrade] = useState('');

    const days = translations[locale].days;
    const periods = translations[locale].periods;

    const fetchSchedule = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('library_schedule').select('*');
            if (error) throw error;

            const map: any = {};
            data?.forEach((item: any) => {
                map[item.id] = { teacher: item.teacher, subject: item.subject, grade: item.grade };
            });
            setScheduleData(map);
        } catch (error: any) {
            console.error("Error fetching schedule:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchSchedule();
        }
    }, [isAuthenticated]);

    const handleAuth = () => {
        const cleanId = password.trim().toLowerCase();
        const hrEmployeeRegex = /^hr\d{3,4}$/i;
        
        if (hrEmployeeRegex.test(cleanId)) {
            setCurrentEmployeeId(cleanId);
            setIsAuthenticated(true);
        } else {
            setPassword('');
            alert(t('errorPass'));
        }
    };

    const handleOpenModal = (day: string, period: number) => {
        const key = `${day}_${period}`;
        const current = scheduleData[key];

        if (current?.teacher && currentEmployeeId !== 'hr785') {
            alert(t('alreadyBooked'));
            return;
        }

        setFormTeacher(current?.teacher || '');
        setFormSubject(current?.subject || '');
        setFormGrade(current?.grade || '');
        setSelectedSlot({ day, period });
    };

    const handleSaveSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) return;

        const key = `${selectedSlot.day}_${selectedSlot.period}`;
        const current = scheduleData[key];

        if (current?.teacher && currentEmployeeId !== 'hr785') {
            alert(t('alreadyBooked'));
            setSelectedSlot(null);
            return;
        }

        const slotData = { id: key, teacher: formTeacher, subject: formSubject, grade: formGrade };

        try {
            const { error } = await supabase.from('library_schedule').upsert(slotData);
            if (error) throw error;

            setScheduleData(prev => ({ ...prev, [key]: { teacher: formTeacher, subject: formSubject, grade: formGrade } }));
            setSelectedSlot(null);
            alert(t('success'));
        } catch (error: any) {
            console.error("Error saving slot:", error);
            alert("خطأ أثناء الحفظ: " + (error.message || error));
        }
    };

    const handleDeleteSlot = async () => {
        if (!selectedSlot) return;

        if (currentEmployeeId !== 'hr785') {
            alert(t('unauthorizedDelete'));
            return;
        }

        const key = `${selectedSlot.day}_${selectedSlot.period}`;
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
        // خريطة أيام الأسبوع للغتين مع تعيين قيم عددية تطابق كائن Date في جافاسكريبت
        const dayMap: Record<string, number> = { 
            "الأحد": 0, "الإثنين": 1, "الثلاثاء": 2, "الأربعاء": 3, "الخميس": 4, "الجمعة": 5, "السبت": 6,
            "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 
        };
        
        // جلب الرقم الخاص باليوم المختار من الجدول
        const targetDay = dayMap[dayName] ?? 1; // الافتراضي هو الإثنين إذا لم يتم التعرف على اليوم

        const now = new Date();
        const currentDay = now.getDay();
        
        // حساب الفارق بين اليوم الحالي واليوم المختار
        let distance = targetDay - currentDay;
        
        // إذا كان اليوم المختار قد مرّ في هذا الأسبوع، ننتقل للأسبوع القادم
        if (distance < 0) {
            distance += 7;
        }

        // إنشاء تاريخ جديد بناءً على الفارق
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
        const teacherNameInput = prompt(t('enterTeacherName'));
        if (!teacherNameInput || !teacherNameInput.trim()) return;

        const searchName = teacherNameInput.trim().toLowerCase();
        let icsEvents = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Saqr Smart Library//Teacher Schedule//AR'
        ];

        let foundCount = 0;
        Object.entries(scheduleData).forEach(([key, slot]) => {
            if (slot.teacher && slot.teacher.trim().toLowerCase() === searchName) {
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
        link.setAttribute('download', `my_library_schedule_${teacherNameInput}.ics`);
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

    if (!isAuthenticated) {
        return (
            <div dir={dir} className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                
                <div className="w-full max-w-lg bg-white dark:bg-slate-900 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border-4 border-emerald-400/40 shadow-2xl text-center relative z-10 flex flex-col items-center animate-zoom-in">
                    <img src="/saqr-sch.png" alt="Saqr Schedule" className="w-32 h-32 md:w-40 md:h-40 object-contain mb-5 animate-bounce drop-shadow-[0_15px_25px_rgba(16,185,129,0.3)] filter hover:scale-110 transition-transform duration-300" onError={(e)=>e.currentTarget.style.display='none'} />
                    <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent uppercase">{t('secureTitle')}</h2>
                    <p className="text-xs text-slate-500 font-bold mb-8">أدخل رقم الموظف الخاص بك (مثال: hr000)</p>
                    <input 
                        type="text" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)} 
                        onKeyDown={(e)=>e.key==='Enter'&&handleAuth()} 
                        className="w-full p-5 rounded-3xl bg-slate-100 dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 text-center text-2xl mb-8 outline-none focus:border-emerald-500 font-black text-slate-900 dark:text-white shadow-inner uppercase transition-all" 
                        placeholder="hr000" 
                    />
                    <button onClick={handleAuth} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-5 rounded-[2rem] font-black text-xl uppercase tracking-widest border-b-8 border-emerald-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-xl hover:shadow-emerald-500/30">
                        {t('authBtn')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div dir={dir} className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8 font-sans relative overflow-hidden">
            
            <div className="absolute top-10 left-10 w-72 h-72 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />

            <div id="printable-schedule" className="hidden print:flex flex-col bg-white text-slate-900 p-8 w-[297mm] min-h-[210mm] mx-auto box-border">
                <div className="flex justify-between items-center border-b-4 border-slate-900 pb-4 mb-6">
                    <div className="flex items-center gap-4">
                        <img src="https://www.efipslibrary.online/school-logo.png" alt="EFIPS Logo" className="w-16 h-16 object-contain" crossOrigin="anonymous" />
                        <div>
                            <h2 className="text-lg font-black text-slate-900">{t('schoolNameAr')}</h2>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{t('schoolNameEn')}</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-black uppercase text-slate-900 border-2 border-slate-900 py-2 px-6 rounded-xl">{t('printHeader')}</h1>
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-500">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex-1">
                    <table className="w-full border-collapse border-2 border-slate-800 text-xs">
                        <thead>
                            <tr className="bg-slate-200 border-b-2 border-slate-800">
                                <th className="p-2 border-r border-slate-800 text-center font-black">الحصة / اليوم</th>
                                {days.map((day, idx) => (
                                    <th key={idx} className="p-2 border-r border-slate-800 text-center font-black text-sm">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {periods.map((period) => (
                                <tr key={period} className="border-b border-slate-800">
                                    <td className="p-2 border-r border-slate-800 text-center font-black bg-slate-100">
                                        {t('periodLabel')} {period}
                                    </td>
                                    {days.map((day, dIdx) => {
                                        const key = `${day}_${period}`;
                                        const slot = scheduleData[key];
                                        return (
                                            <td key={dIdx} className="p-2 border-r border-slate-800 text-center align-middle h-12">
                                                {slot?.teacher ? (
                                                    <div>
                                                        <div className="font-black text-slate-900">{slot.teacher}</div>
                                                        <div className="text-emerald-700 font-bold">{slot.subject}</div>
                                                        <div className="text-slate-600 font-bold">{slot.grade}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-end mt-8 pt-4 border-t-2 border-slate-400">
                    <div className="text-center">
                        <p className="font-black text-xs mb-6">{t('librarianSign')}</p>
                        <div className="w-40 border-b border-slate-600"></div>
                    </div>
                    <div className="text-center">
                        <p className="font-black text-xs mb-6">{t('managementSign')}</p>
                        <div className="w-40 border-b border-slate-600"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto print:hidden relative z-10">
                
                <div className="text-center mb-10 flex flex-col items-center">
                    {/* تكبير الشخصية وإبرازها بشكل واضح وجذاب مع تأثيرات واضحة */}
                    <div className="relative group mb-4">
                        <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-2xl group-hover:bg-emerald-400/50 transition-all duration-500 animate-pulse" />
                        <img 
                            src="/saqr-sch.png" 
                            alt="Saqr Schedule" 
                            className="w-32 h-32 md:w-44 md:h-44 object-contain relative z-10 animate-bounce drop-shadow-[0_20px_30px_rgba(16,185,129,0.35)] filter hover:scale-110 hover:rotate-3 transition-transform duration-300" 
                            onError={(e)=>e.currentTarget.style.display='none'} 
                        />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent tracking-tight uppercase drop-shadow-sm">
                        {t('pageTitle')}
                    </h1>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">{t('subtitle')}</p>
                    <div className="flex justify-center gap-3 mt-4">
                        <div className="w-16 h-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-pulse" />
                        <div className="w-8 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse" />
                        <div className="w-4 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-4 mb-6">
                    <button 
                        onClick={handleDownloadMySchedule} 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-black text-sm border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all shadow-lg hover:shadow-emerald-500/25 uppercase tracking-wider flex items-center gap-2"
                    >
                        {t('myScheduleBtn')}
                    </button>
                    <button 
                        onClick={() => window.print()} 
                        className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-black text-sm border-b-4 border-slate-950 dark:border-slate-300 active:border-b-0 active:translate-y-1 transition-all shadow-lg uppercase tracking-wider"
                    >
                        {t('printBtn')}
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-xl font-black animate-pulse text-emerald-600">{t('loading')}</div>
                ) : (
                    <div className="overflow-x-auto bg-white dark:bg-slate-900 backdrop-blur-xl rounded-[2.5rem] border-4 border-emerald-200/60 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-4 md:p-6 transition-all">
                        <table className="w-full border-collapse min-w-[900px]">
                            <thead>
                                <tr className="border-b-4 border-slate-100 dark:border-slate-800">
                                    <th className="p-4 text-center font-black text-slate-400 uppercase text-sm">الحصة / اليوم</th>
                                    {days.map((day, idx) => {
                                        const dayColors = [
                                            "from-emerald-500 to-teal-600 text-white shadow-emerald-500/20",
                                            "from-indigo-500 to-blue-600 text-white shadow-indigo-500/20",
                                            "from-purple-500 to-pink-600 text-white shadow-purple-500/20",
                                            "from-amber-500 to-orange-600 text-white shadow-amber-500/20",
                                            "from-cyan-500 to-blue-500 text-white shadow-cyan-500/20"
                                        ];
                                        return (
                                            <th key={idx} className="p-3 text-center font-black text-base md:text-lg">
                                                <div className={`py-3 px-4 rounded-2xl bg-gradient-to-r ${dayColors[idx % dayColors.length]} shadow-md transform hover:scale-105 transition-transform duration-300`}>
                                                    {day}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map((period) => (
                                    <tr key={period} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-teal-50/20 transition-colors">
                                        <td className="p-4 text-center font-black bg-slate-100 dark:bg-slate-800/80 rounded-2xl m-2 text-slate-700 dark:text-slate-300 shadow-inner">
                                            {t('periodLabel')} {period}
                                        </td>
                                        {days.map((day, dIdx) => {
                                            const key = `${day}_${period}`;
                                            const slot = scheduleData[key];
                                            return (
                                                <td key={dIdx} className="p-3 text-center">
                                                    <div 
                                                        onClick={() => handleOpenModal(day, period)}
                                                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 min-h-[105px] flex flex-col justify-center items-center shadow-md relative group overflow-hidden ${
                                                            slot?.teacher 
                                                                ? 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/40 border-emerald-400 hover:border-emerald-500 hover:scale-105 shadow-emerald-500/10' 
                                                                : 'bg-white dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/30'
                                                        }`}
                                                    >
                                                        {slot?.teacher ? (
                                                            <>
                                                                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                                                <span className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[150px] drop-shadow-sm">{slot.teacher}</span>
                                                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">{slot.subject}</span>
                                                                <span className="text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-0.5 rounded-full mt-1.5 shadow-sm">
                                                                    {slot.grade}
                                                                </span>
                                                                
                                                                <div className="flex gap-1 mt-2 opacity-90 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                                    <button 
                                                                        title={t('addToGoogleCal')}
                                                                        onClick={() => handleAddToGoogleCalendar(day, period, slot)}
                                                                        className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-[9px] hover:shadow-lg font-bold flex items-center gap-1 transform hover:scale-110 transition-transform"
                                                                    >
                                                                        📅 Google
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs font-extrabold text-slate-400 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                                                                {t('bookSlotText')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedSlot && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-4 border-emerald-400/50 w-full max-w-md shadow-[0_0_60px_rgba(16,185,129,0.3)] animate-zoom-in relative">
                            <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent text-center">
                                {selectedSlot.day} - {t('periodLabel')} {selectedSlot.period}
                            </h3>
                            <form onSubmit={handleSaveSlot} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{t('teacherName')}</label>
                                    <input type="text" required value={formTeacher} onChange={(e)=>setFormTeacher(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 outline-none font-bold shadow-inner transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{t('subject')}</label>
                                    <input type="text" required value={formSubject} onChange={(e)=>setFormSubject(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 outline-none font-bold shadow-inner transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{t('grade')}</label>
                                    <input type="text" required value={formGrade} onChange={(e)=>setFormGrade(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 outline-none font-bold shadow-inner transition-all" />
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <div className="flex gap-4">
                                        <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-2xl shadow-lg hover:shadow-emerald-500/30 transition-all transform active:scale-95">{t('saveBtn')}</button>
                                        <button type="button" onClick={()=>setSelectedSlot(null)} className="px-6 py-4 bg-slate-200 dark:bg-slate-800 font-black rounded-2xl hover:bg-slate-300 transition-all transform active:scale-95">{t('close')}</button>
                                    </div>
                                    
                                    {currentEmployeeId === 'hr785' && (
                                        <button 
                                            type="button" 
                                            onClick={handleDeleteSlot} 
                                            className="w-full py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white font-black rounded-2xl shadow-md hover:shadow-rose-500/30 transition-all transform active:scale-95"
                                        >
                                            {t('deleteBtn')}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>

            <style>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }
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
                }
            `}</style>
        </div>
    );
};

export default SchedulePage;
