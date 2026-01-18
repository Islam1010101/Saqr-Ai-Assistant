import React, { useState } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "بوابة الابتكار والتميز",
        subTitle: "نحو مكتبة ذكية تليق بمدرسة صقر الإمارات 2026",
        nameLabel: "الاسم الكامل",
        affiliationLabel: "الصفة المدرسية",
        categoryLabel: "الفئة",
        gradeLabel: "المرحلة الدراسية",
        sonsGradeLabel: "المرحلة الدراسية للابن",
        specializationLabel: "التخصص الدراسي",
        deptLabel: "القسم / الإدارة",
        jobLabel: "الوظيفة / المسمى الوظيفي",
        fromOutsideLabel: "كيف عرفت عن مكتبتنا الرقمية؟",
        ratingService: "تقييم خدمات المكتبة",
        ratingStaff: "تقييم أداء أمين المكتبة (إسلام أحمد)",
        ratingSaqr: "تقييم ذكاء صقر AI",
        devSuggestions: "مقترحات تطوير الخدمات",
        bookSuggestions: "كتب تود إضافتها رقمياً",
        msgLabel: "رسالة إضافية لأمين المكتبة",
        submitBtn: "إرسال المقترح",
        successMsg: "تم الاستلام بنجاح! شكراً لمساهمتك الوطنية.",
        internal: "من أسرة المدرسة",
        external: "زائر خارجي",
        student: "طالب",
        teacher: "معلم",
        admin: "إداري",
        parent: "ولي أمر",
        employee: "موظف",
        optExcellent: "ممتاز",
        optVeryGood: "جيد جداً",
        optAverage: "متوسط",
        optNeedsDev: "يحتاج تطوير",
        optSmart: "ذكي جداً",
        optUseful: "مفيد"
    },
    en: {
        pageTitle: "Innovation & Excellence Portal",
        subTitle: "Towards a smart library for EFIPS 2026",
        nameLabel: "Full Name",
        affiliationLabel: "School Affiliation",
        categoryLabel: "Category",
        gradeLabel: "Grade Level",
        sonsGradeLabel: "Son's Grade Level",
        specializationLabel: "Specialization",
        deptLabel: "Department",
        jobLabel: "Job Title",
        fromOutsideLabel: "How did you hear about us?",
        ratingService: "Library Services Rating",
        ratingStaff: "Librarian Performance (Islam Ahmed)",
        ratingSaqr: "Saqr AI Intelligence",
        devSuggestions: "Development Suggestions",
        bookSuggestions: "Titles to add Digitally",
        msgLabel: "Message to the Librarian",
        submitBtn: "Submit Feedback",
        successMsg: "Received successfully! Thank you for your contribution.",
        internal: "School Member",
        external: "Outside Visitor",
        student: "Student",
        teacher: "Teacher",
        admin: "Staff",
        parent: "Parent",
        employee: "Employee",
        optExcellent: "Excellent",
        optVeryGood: "Very Good",
        optAverage: "Average",
        optNeedsDev: "Needs Work",
        optSmart: "Very Smart",
        optUseful: "Useful"
    }
};

const FeedbackPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [submitted, setSubmitted] = useState(false);
    const [isInternal, setIsInternal] = useState(true);
    const [userCategory, setUserCategory] = useState('Student');

    const FORMSPREE_URL = "https://formspree.io/f/xlggjwql";

    const playSuccessSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.4;
        audio.play();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        
        try {
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                playSuccessSound();
                setSubmitted(true);
                form.reset();
            }
        } catch (error) {
            alert("Connection Error");
        }
    };

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-12 md:py-20 animate-fade-up relative z-10 pb-32 text-start antialiased font-black">
            
            {/* UAE Themed Header */}
            <div className="text-center mb-16 relative">
                <div className="absolute inset-0 flex justify-center -z-10 opacity-20 blur-[100px]">
                    <div className="w-40 h-40 bg-green-600 rounded-full translate-x-20"></div>
                    <div className="w-40 h-40 bg-red-600 rounded-full -translate-x-20"></div>
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 drop-shadow-2xl">
                    {t('pageTitle')}
                </h1>
                <div className="flex justify-center items-center gap-2 mb-8">
                    <div className="h-1.5 w-12 bg-red-600 rounded-full"></div>
                    <div className="h-1.5 w-12 bg-green-600 rounded-full"></div>
                    <div className="h-1.5 w-12 bg-slate-400 rounded-full"></div>
                </div>
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-bold max-w-3xl mx-auto uppercase tracking-tighter italic">
                    {t('subTitle')}
                </p>
            </div>

            {submitted ? (
                <div className="glass-panel p-16 rounded-[4rem] text-center bg-green-600/5 border-2 border-green-600/20 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-bounce">
                        <span className="text-5xl text-white">🇦🇪</span>
                    </div>
                    <h2 className="text-3xl font-black text-green-700 dark:text-green-400 mb-8">{t('successMsg')}</h2>
                    <button onClick={() => setSubmitted(false)} className="px-12 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                        {locale === 'ar' ? "إرسال رأي آخر" : "Submit Again"}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-14 rounded-[4.5rem] bg-white/70 dark:bg-slate-950/70 shadow-[0_60px_120px_rgba(0,0,0,0.2)] border border-white/20 relative overflow-hidden group">
                    
                    {/* Floating Glows */}
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-red-600/10 blur-[120px] rounded-full"></div>

                    {/* Affiliation Dropdown */}
                    <div className="mb-12 relative z-10 space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-red-600 ms-6">{t('affiliationLabel')}</label>
                        <select 
                            name="Membership" 
                            onChange={(e) => {
                                setIsInternal(e.target.value === "Internal");
                                setUserCategory(e.target.value === "Internal" ? "Student" : "External_Student");
                            }}
                            className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-green-600 outline-none font-black text-sm md:text-base transition-all shadow-inner text-slate-900 dark:text-white cursor-pointer"
                        >
                            <option value="Internal">{t('internal')}</option>
                            <option value="External">{t('external')}</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ms-6">{t('nameLabel')}</label>
                            <input name="User_Name" required type="text" className="w-full p-6 rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-sm text-slate-950 dark:text-white" />
                        </div>

                        {/* الفئة المخصصة بناءً على التبعية */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ms-6">{t('categoryLabel')}</label>
                            <select 
                                name="User_Category" 
                                onChange={(e) => setUserCategory(e.target.value)}
                                className="w-full p-6 rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-black transition-all shadow-sm text-slate-950 dark:text-white cursor-pointer"
                            >
                                {isInternal ? (
                                    <>
                                        <option value="Student">{t('student')}</option>
                                        <option value="Teacher">{t('teacher')}</option>
                                        <option value="Admin">{t('admin')}</option>
                                        <option value="Parent">{t('parent')}</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="External_Student">{t('student')}</option>
                                        <option value="External_Employee">{t('employee')}</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* حقول ديناميكية ذكية لعام 2026 */}
                    <div className="space-y-10 mb-10 relative z-10 animate-fade-up">
                        
                        {/* 1. مسار الطالب (مرحلة فقط) */}
                        {userCategory.includes("Student") && (
                            <div className="space-y-3 animate-fade-down">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-green-600 ms-6">{t('gradeLabel')}</label>
                                <select name="Specific_Grade" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 font-black text-xl border-none outline-none dark:text-white">
                                    {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                </select>
                            </div>
                        )}

                        {/* 2. مسار المعلم (تخصص) */}
                        {userCategory === "Teacher" && (
                            <div className="space-y-3 animate-fade-down">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-green-600 ms-6">{t('specializationLabel')}</label>
                                <input name="Teacher_Field" required type="text" placeholder="Arabic, Math, Science..." className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 font-bold border-none outline-none dark:text-white" />
                            </div>
                        )}

                        {/* 3. مسار الإداري (قسم) */}
                        {userCategory === "Admin" && (
                            <div className="space-y-3 animate-fade-down">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-green-600 ms-6">{t('deptLabel')}</label>
                                <input name="Admin_Dept" required type="text" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 font-bold border-none outline-none dark:text-white" />
                            </div>
                        )}

                        {/* 4. مسار ولي الأمر (وظيفة + صف ابنه) */}
                        {userCategory === "Parent" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-down">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-green-600 ms-6">{t('jobLabel')}</label>
                                    <input name="Parent_Job" required type="text" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 font-bold border-none outline-none dark:text-white" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-green-600 ms-6">{t('sonsGradeLabel')}</label>
                                    <select name="Son_Grade" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 font-black border-none outline-none dark:text-white">
                                        {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* 5. مسار الخارجي الموظف */}
                        {userCategory === "External_Employee" && (
                            <div className="space-y-3 animate-fade-down">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600 ms-6">{t('jobLabel')}</label>
                                <input name="External_Job" required type="text" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 font-bold border-none outline-none dark:text-white" />
                            </div>
                        )}

                        {!isInternal && (
                            <div className="space-y-3 animate-fade-down">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600 ms-6">{t('fromOutsideLabel')}</label>
                                <input name="Discovery_Path" required type="text" className="w-full p-6 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 outline-none font-bold dark:text-white shadow-inner" />
                            </div>
                        )}

                        {/* التقييمات الجمالية */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isInternal && (
                                <>
                                    <div className="p-6 rounded-[2.5rem] bg-white dark:bg-white/5 shadow-xl border border-slate-100 dark:border-white/5">
                                        <label className="text-[10px] font-black uppercase mb-4 block text-red-600 tracking-widest">{t('ratingService')}</label>
                                        <select name="Service_Rating" className="w-full bg-transparent font-black text-lg outline-none dark:text-white">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                    <div className="p-6 rounded-[2.5rem] bg-white dark:bg-white/5 shadow-xl border border-slate-100 dark:border-white/5">
                                        <label className="text-[10px] font-black uppercase mb-4 block text-red-600 tracking-widest">{t('ratingStaff')}</label>
                                        <select name="Staff_Rating" className="w-full bg-transparent font-black text-lg outline-none dark:text-white">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="p-6 rounded-[2.5rem] bg-white dark:bg-white/5 shadow-xl border border-slate-100 dark:border-white/5">
                                <label className="text-[10px] font-black uppercase mb-4 block text-green-600 tracking-widest">{t('ratingSaqr')}</label>
                                <select name="Saqr_AI_Rating" className="w-full bg-transparent font-black text-lg outline-none dark:text-white">
                                    <option value="5">⭐⭐⭐⭐⭐ {t('optSmart')}</option>
                                    <option value="4">⭐⭐⭐⭐ {t('optUseful')}</option>
                                    <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                </select>
                            </div>
                        </div>

                        {/* حقول التطوير المشتركة */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ms-6">{t('devSuggestions')}</label>
                                <textarea name="Dev_Ideas" rows={2} className="w-full p-6 rounded-[2.5rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-green-600 outline-none font-bold transition-all shadow-inner resize-none dark:text-white"></textarea>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ms-6">{t('bookSuggestions')}</label>
                                <textarea name="Requested_Books" rows={2} className="w-full p-6 rounded-[2.5rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-green-600 outline-none font-bold transition-all shadow-inner resize-none dark:text-white"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-12 relative z-10">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ms-6">{t('msgLabel')}</label>
                        <textarea name="Personal_Message" rows={3} className="w-full p-6 rounded-[3rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner resize-none dark:text-white"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-sm md:text-base shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:bg-red-600 hover:text-white hover:scale-[1.01] active:scale-95 transition-all relative z-10 overflow-hidden">
                        {t('submitBtn')}
                    </button>
                </form>
            )}

            {/* Footer Branding with Flag Colors */}
            <div className="mt-24 text-center">
                <div className="flex justify-center gap-3 mb-6 opacity-30">
                    <div className="w-10 h-1.5 bg-red-600"></div>
                    <div className="w-10 h-1.5 bg-green-600"></div>
                    <div className="w-10 h-1.5 bg-slate-400"></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.7em] mb-2 text-slate-400">EFIPS Library Digital Sovereignty • 2026</p>
                <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest underline decoration-red-600 underline-offset-8">Official Librarian: Islam Ahmed</p>
            </div>
        </div>
    );
};

export default FeedbackPage;
