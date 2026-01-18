import React, { useState } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "بوابة الابتكار والتميز",
        subTitle: "القراءة ذكاء، والتطوير شراكة.. بصمتك اليوم ترسم مستقبل خدماتنا",
        nameLabel: "الاسم الكامل",
        affiliationLabel: "الصفة المدرسية",
        categoryLabel: "الفئة",
        gradeLabel: "المرحلة الدراسية",
        sonsGradeLabel: "المرحلة الدراسية للابن",
        specializationLabel: "التخصص الدراسي",
        deptLabel: "القسم / الإدارة",
        jobLabel: "الوظيفة / المسمى الوظيفي",
        fromOutsideLabel: "كيف تعرفت عن مكتبتنا الرقمية؟",
        ratingService: "تقييم خدمات المكتبة",
        ratingStaff: "تقييم أداء أمين المكتبة (إسلام سليمان)",
        ratingSaqr: "تقييم ذكاء صقر AI",
        devSuggestions: "مقترحات تطوير الخدمات",
        bookSuggestions: "كتب تود إضافتها رقمياً",
        msgLabel: "رسالة إضافية لأمين المكتبة",
        submitBtn: "إرسال المقترح",
        successMsg: "تم الاستلام بنجاح! شكراً لمساهمتك في رسم المستقبل.",
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
        subTitle: "Reading is Intelligence, Development is Partnership.. Your footprint today shapes the future of our Library Services.",
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
        ratingStaff: "Librarian Performance (Islam Soliman)",
        ratingSaqr: "Saqr AI Intelligence",
        devSuggestions: "Development Suggestions",
        bookSuggestions: "Titles to add Digitally",
        msgLabel: "Message to the Librarian",
        submitBtn: "Submit Feedback",
        successMsg: "Received successfully! Thank you for shaping the future.",
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
            alert(locale === 'ar' ? "حدث خطأ في الاتصال" : "Connection Error");
        }
    };

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-24 text-start antialiased font-black">
            
            {/* Responsive Header Section */}
            <div className="text-center mb-10 md:mb-16 relative">
                <div className="absolute inset-0 flex justify-center -z-10 opacity-30 blur-[80px]">
                    <div className="w-40 md:w-60 h-40 md:h-60 bg-green-600 rounded-full translate-x-10 md:translate-x-32"></div>
                    <div className="w-40 md:w-60 h-40 md:h-60 bg-red-600 rounded-full -translate-x-10 md:-translate-x-32"></div>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-4 drop-shadow-xl leading-tight">
                    {t('pageTitle')}
                </h1>
                
                <div className="flex justify-center items-center gap-2 md:gap-3 mb-6">
                    <div className="h-1 w-10 md:w-16 bg-red-600 rounded-full"></div>
                    <div className="h-1 w-10 md:w-16 bg-green-600 rounded-full"></div>
                </div>

                <p className="text-lg md:text-2xl lg:text-3xl text-slate-700 dark:text-slate-300 font-black max-w-4xl mx-auto leading-snug px-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-slate-900 dark:via-white to-green-600">
                        {t('subTitle')}
                    </span>
                </p>
            </div>

            {submitted ? (
                <div className="glass-panel p-8 md:p-16 rounded-[2rem] md:rounded-[4rem] text-center bg-green-600/5 border-2 border-green-600/20 shadow-2xl animate-in zoom-in duration-500">
                    <div className="text-5xl md:text-7xl mb-6 animate-bounce">🇦🇪</div>
                    <h2 className="text-2xl md:text-3xl font-black text-green-700 dark:text-green-400 mb-8">{t('successMsg')}</h2>
                    <button onClick={() => setSubmitted(false)} className="px-8 py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-xl">
                        {locale === 'ar' ? "إرسال فكرة جديدة" : "Send More Ideas"}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-5 md:p-14 rounded-[2rem] md:rounded-[4rem] bg-white/80 dark:bg-slate-950/80 shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-600/5 blur-[120px] rounded-full"></div>
                    
                    {/* Membership Section */}
                    <div className="mb-8 relative z-10 space-y-2">
                        <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-red-600 ms-2">{t('affiliationLabel')}</label>
                        <select 
                            name="Membership" 
                            onChange={(e) => {
                                setIsInternal(e.target.value === "Internal");
                                setUserCategory(e.target.value === "Internal" ? "Student" : "External_Student");
                            }}
                            className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-green-600 outline-none font-black text-sm md:text-base transition-all shadow-inner text-slate-900 dark:text-white cursor-pointer"
                        >
                            <option value="Internal">{t('internal')}</option>
                            <option value="External">{t('external')}</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ms-2">{t('nameLabel')}</label>
                            <input name="Full_Name" required type="text" className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-sm text-slate-950 dark:text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ms-2">{t('categoryLabel')}</label>
                            <select 
                                name="User_Category" 
                                onChange={(e) => setUserCategory(e.target.value)}
                                className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-black transition-all shadow-sm text-slate-950 dark:text-white cursor-pointer"
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

                    <div className="space-y-6 md:space-y-10 mb-8 relative z-10 animate-fade-up">
                        {/* Dynamic Fields */}
                        {userCategory.includes("Student") && (
                            <div className="space-y-2 animate-fade-down">
                                <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-green-600 ms-2">{t('gradeLabel')}</label>
                                <select name="Grade" className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-100 dark:bg-white/5 font-black text-lg md:text-xl outline-none dark:text-white">
                                    {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                </select>
                            </div>
                        )}

                        {userCategory === "Teacher" && (
                            <div className="space-y-2 animate-fade-down">
                                <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-green-600 ms-2">{t('specializationLabel')}</label>
                                <input name="Specialization" required type="text" className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-100 dark:bg-white/5 font-bold outline-none dark:text-white" />
                            </div>
                        )}

                        {userCategory === "Admin" && (
                            <div className="space-y-2 animate-fade-down">
                                <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-green-600 ms-2">{t('deptLabel')}</label>
                                <input name="Department" required type="text" className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-100 dark:bg-white/5 font-bold outline-none dark:text-white" />
                            </div>
                        )}

                        {userCategory === "Parent" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 animate-fade-down">
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-green-600 ms-2">{t('jobLabel')}</label>
                                    <input name="Parent_Job" required type="text" className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-100 dark:bg-white/5 font-bold outline-none dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-green-600 ms-2">{t('sonsGradeLabel')}</label>
                                    <select name="Son_Grade" className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-100 dark:bg-white/5 font-black outline-none dark:text-white">
                                        {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {!isInternal && (
                            <div className="space-y-2 animate-fade-down">
                                <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-red-600 ms-2">{t('fromOutsideLabel')}</label>
                                <input name="Discovery_Path" required type="text" className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 outline-none font-bold dark:text-white shadow-inner" />
                            </div>
                        )}

                        {/* Ratings - Grid adjustment for Tablet/Mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {isInternal && (
                                <>
                                    <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-white/5 shadow-lg border border-slate-100 dark:border-white/5">
                                        <label className="text-[9px] md:text-[10px] font-black uppercase mb-3 block text-red-600 tracking-widest">{t('ratingService')}</label>
                                        <select name="Service_Rating" className="w-full bg-transparent font-black text-base md:text-lg outline-none dark:text-white">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                    <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-white/5 shadow-lg border border-slate-100 dark:border-white/5">
                                        <label className="text-[9px] md:text-[10px] font-black uppercase mb-3 block text-red-600 tracking-widest">{t('ratingStaff')}</label>
                                        <select name="Staff_Rating" className="w-full bg-transparent font-black text-base md:text-lg outline-none dark:text-white">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-white/5 shadow-lg border border-slate-100 dark:border-white/5">
                                <label className="text-[9px] md:text-[10px] font-black uppercase mb-3 block text-green-600 tracking-widest">{t('ratingSaqr')}</label>
                                <select name="Saqr_Rating" className="w-full bg-transparent font-black text-base md:text-lg outline-none dark:text-white">
                                    <option value="5">⭐⭐⭐⭐⭐ {t('optSmart')}</option>
                                    <option value="4">⭐⭐⭐⭐ {t('optUseful')}</option>
                                    <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Suggestions - Stack on Mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ms-2">{t('devSuggestions')}</label>
                                <textarea name="Dev_Ideas" rows={2} className="w-full p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-green-600 outline-none font-bold transition-all shadow-inner resize-none dark:text-white"></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ms-2">{t('bookSuggestions')}</label>
                                <textarea name="Book_Requests" rows={2} className="w-full p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-green-600 outline-none font-bold transition-all shadow-inner resize-none dark:text-white"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-8 md:mb-12 relative z-10">
                        <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ms-2">{t('msgLabel')}</label>
                        <textarea name="Personal_Message" rows={3} className="w-full p-4 md:p-6 rounded-2xl md:rounded-[3rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner resize-none dark:text-white"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-base shadow-[0_20px_60px_rgba(220,38,38,0.2)] hover:bg-red-600 hover:text-white hover:scale-[1.01] active:scale-95 transition-all relative z-10">
                        {t('submitBtn')}
                    </button>
                </form>
            )}

            <div className="mt-12 md:mt-24 text-center">
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] mb-2 text-slate-400 opacity-50">EFIPS Library Digital Sovereignty • 2026</p>
                <p className="font-black text-slate-900 dark:text-white uppercase text-[10px] md:text-xs tracking-widest">Official Librarian: Islam Soliman</p>
            </div>
        </div>
    );
};

export default FeedbackPage;
