import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { supabase } from '../src/utils/supabase';

const translations = {
    ar: {
        pageTitle: "جدول المكتبة",
        subtitle: "نظام حجز وتنسيق حصص زيارة المكتبة المدرسية",
        secureTitle: "بوابة دخول المعلمين",
        passPlaceholder: "رقم الموظف (مثال: HR123)",
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
        printBtn: "طباعة الجدول المعتمد (A4 عرضي)",
        modalTitle: "تحديث جدول الحصة",
        close: "إلغاء",
        success: "تم حفظ الحصة بنجاح!",
        deleteSuccess: "تم حذف الحصة بنجاح!",
        unauthorizedDelete: "عذراً، لا تملك صلاحية حذف الحصص. مخصصة للمسؤول (hr785) فقط.",
        alreadyBooked: "عذراً، هذه الحصة محجوزة مسبقاً من قبل معلم آخر، ولا يمكن تعديلها إلا من قبل المسؤول (hr785).",
        bookSlotText: "+ حجز الحصة",
        loading: "جاري تحميل جدول الحصص...",
        schoolNameAr: "مدرسة صقر الإمارات الدولية الخاصة",
        schoolNameEn: "Emirates Falcon International Private School",
        printHeader: "الجدول الزمني المعتمد لزيارات المكتبة المدرسية",
        librarianSign: "اعتماد أمين المكتبة",
        managementSign: "توقيع الإدارة المدرسية"
    },
    en: {
        pageTitle: "Library Schedule",
        subtitle: "Library visit booking and coordination system for teachers",
        secureTitle: "Teachers Portal Login",
        passPlaceholder: "Employee ID (e.g., hr123)",
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
        printBtn: "Print Schedule (A4 Landscape)",
        modalTitle: "Update Schedule Slot",
        close: "Cancel",
        success: "Schedule updated successfully!",
        deleteSuccess: "Period deleted successfully!",
        unauthorizedDelete: "Sorry, you do not have permission to delete. Only hr785 can delete.",
        alreadyBooked: "Sorry, this period is already booked by another teacher and can only be modified by the admin (hr785).",
        bookSlotText: "+ Book Period",
        loading: "Loading schedule...",
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

    if (!isAuthenticated) {
        return (
            <div dir={dir} className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="w-full max-w-lg bg-white dark:bg-slate-800 p-10 md:p-14 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 shadow-2xl text-center relative z-10 flex flex-col items-center animate-zoom-in">
                    <img src="/saqr-sch.png" alt="Saqr Schedule" className="w-24 h-24 object-contain mb-4 animate-float" onError={(e)=>e.currentTarget.style.display='none'} />
                    <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white uppercase">{t('secureTitle')}</h2>
                    <p className="text-xs text-slate-500 font-bold mb-8">أدخل رقم الموظف الخاص بك (مثال: hr123)</p>
                    <input 
                        type="text" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)} 
                        onKeyDown={(e)=>e.key==='Enter'&&handleAuth()} 
                        className="w-full p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 text-center text-2xl mb-8 outline-none focus:border-emerald-500 font-black text-slate-900 dark:text-white shadow-inner uppercase" 
                        placeholder="hr123" 
                    />
                    <button onClick={handleAuth} className="w-full bg-emerald-500 text-white py-5 rounded-[2rem] font-black text-xl uppercase tracking-widest border-b-8 border-emerald-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md">
                        {t('authBtn')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div dir={dir} className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8 font-sans relative">
            
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

            <div className="max-w-[1400px] mx-auto print:hidden">
                
                <div className="text-center mb-10 flex flex-col items-center">
                    <img src="/saqr-sch.png" alt="Saqr Schedule" className="w-20 h-20 object-contain mb-3 animate-float" onError={(e)=>e.currentTarget.style.display='none'} />
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t('pageTitle')}</h1>
                    <p className="text-sm font-bold text-slate-500 mt-2">{t('subtitle')}</p>
                    <div className="flex justify-center gap-3 mt-4">
                        <div className="w-16 h-2 bg-emerald-500 rounded-full" />
                        <div className="w-8 h-2 bg-amber-400 rounded-full" />
                    </div>
                </div>

                <div className="flex justify-end mb-6">
                    <button onClick={() => window.print()} className="bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-black text-sm border-b-4 border-slate-950 dark:border-slate-300 active:border-b-0 active:translate-y-1 transition-all shadow-md uppercase tracking-wider">
                        {t('printBtn')}
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-xl font-black">{t('loading')}</div>
                ) : (
                    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-800 shadow-xl p-4 md:p-6">
                        <table className="w-full border-collapse min-w-[900px]">
                            <thead>
                                <tr className="border-b-4 border-slate-200 dark:border-slate-800">
                                    <th className="p-4 text-center font-black text-slate-400 uppercase text-sm">الحصة / اليوم</th>
                                    {days.map((day, idx) => (
                                        <th key={idx} className="p-4 text-center font-black text-lg md:text-xl text-emerald-600 dark:text-emerald-400">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map((period) => (
                                    <tr key={period} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-center font-black bg-slate-100 dark:bg-slate-800/80 rounded-2xl m-2 text-slate-700 dark:text-slate-300">
                                            {t('periodLabel')} {period}
                                        </td>
                                        {days.map((day, dIdx) => {
                                            const key = `${day}_${period}`;
                                            const slot = scheduleData[key];
                                            return (
                                                <td key={dIdx} className="p-3 text-center">
                                                    <div 
                                                        onClick={() => handleOpenModal(day, period)}
                                                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 min-h-[90px] flex flex-col justify-center items-center shadow-sm ${
                                                            slot?.teacher 
                                                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 hover:scale-[1.02]' 
                                                                : 'bg-slate-50 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400'
                                                        }`}
                                                    >
                                                        {slot?.teacher ? (
                                                            <>
                                                                <span className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[150px]">{slot.teacher}</span>
                                                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">{slot.subject}</span>
                                                                <span className="text-[10px] font-bold bg-emerald-200/50 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full mt-1 text-slate-700 dark:text-slate-300">{slot.grade}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-400">{t('bookSlotText')}</span>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl animate-zoom-in">
                            <h3 className="text-2xl font-black mb-6 text-slate-900 dark:text-white text-center">
                                {selectedSlot.day} - {t('periodLabel')} {selectedSlot.period}
                            </h3>
                            <form onSubmit={handleSaveSlot} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{t('teacherName')}</label>
                                    <input type="text" required value={formTeacher} onChange={(e)=>setFormTeacher(e.target.value)} className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{t('subject')}</label>
                                    <input type="text" required value={formSubject} onChange={(e)=>setFormSubject(e.target.value)} className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block px-2">{t('grade')}</label>
                                    <input type="text" required value={formGrade} onChange={(e)=>setFormGrade(e.target.value)} className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <div className="flex gap-4">
                                        <button type="submit" className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-600 transition-transform active:scale-95">{t('saveBtn')}</button>
                                        <button type="button" onClick={()=>setSelectedSlot(null)} className="px-6 py-4 bg-slate-200 dark:bg-slate-800 font-black rounded-2xl hover:bg-slate-300 transition-transform active:scale-95">{t('close')}</button>
                                    </div>
                                    
                                    {currentEmployeeId === 'hr785' && (
                                        <button 
                                            type="button" 
                                            onClick={handleDeleteSlot} 
                                            className="w-full py-3 bg-rose-500 text-white font-black rounded-2xl shadow-md hover:bg-rose-600 transition-transform active:scale-95"
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

exportTest: default SchedulePage;
