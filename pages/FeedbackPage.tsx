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
        ratingStaff: "تقييم أداء أمين المكتبة (إسلام أحمد)",
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
        ratingStaff: "Librarian Performance (Islam Ahmed)",
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
            alert(locale === 'ar' ? "حدث خطأ" : "Error");
        }
    };

    // كلاس الحقول: تم إزالة uppercase و tracking وتطبيقها شرطياً
    const inputClass = `w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 focus:border-red-600 dark:focus:border-green-600 outline-none font-bold transition-all shadow-sm text-slate-900 dark:text-white leading-relaxed mb-1`;

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 pb-20 text-start antialiased font-black">
            
            <div className="text-center mb-10 md:mb-14 relative">
                <div className="absolute inset-0 flex justify-center -z-10 opacity-20 blur-[60px] md:blur-[100px]">
                    <div className="w-40 md:w-64 h-40 md:h-64 bg-green-600 rounded-full translate-x-10 md:translate-x-20"></div>
                    <div className="w-40 md:w-64 h-40 md:h-64 bg-red-600 rounded-full -translate-x-10 md:-translate-x-20"></div>
                </div>
                
                <h1 className={`text-3xl sm:text-4xl md:text-7xl font-black text-slate-950 dark:text-white mb-3 md:mb-6 leading-tight ${locale === 'en' ? 'uppercase tracking-tighter' : ''}`}>
                    {t('pageTitle')}
                </h1>
                
                <div className="flex justify-center items-center gap-2 md:gap-4 mb-5 md:mb-8">
                    <div className="h-1 md:h-2 w-8 md:w-16 bg-red-600 rounded-full"></div>
                    <div className="h-1 md:h-2 w-8 md:w-16 bg-green-600 rounded-full"></div>
                </div>

                <p className="text-lg sm:text-xl md:text-3xl text-slate-700 dark:text-slate-300 font-black max-w-4xl mx-auto px-2 leading-relaxed">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-slate-900 dark:via-white to-green-600">
                        {t('subTitle')}
                    </span>
                </p>
            </div>

            {submitted ? (
                <div className="glass-panel p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] text-center bg-green-600/5 border-2 border-green-600/20 shadow-2xl animate-in zoom-in duration-500">
                    <div className="text-5xl md:text-7xl mb-6">🇦🇪</div>
                    <h2 className="text-xl md:text-3xl font-black text-green-700 dark:text-green-400 mb-6 leading-relaxed">{t('successMsg')}</h2>
                    <button onClick={() => setSubmitted(false)} className="px-8 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg">
                        {locale === 'ar' ? "إرسال المزيد" : "Send More"}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-5 sm:p-8 md:p-14 rounded-[2.5rem] md:rounded-[4.5rem] bg-white/80 dark:bg-slate-950/80 shadow-2xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-600/5 blur-[120px] rounded-full"></div>
                    
                    <div className="mb-6 md:mb-10 relative z-10 space-y-2">
                        <label className={`text-[10px] md:text-xs font-black text-red-600 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('affiliationLabel')}</label>
                        <select 
                            name="Membership" 
                            onChange={(e) => {
                                setIsInternal(e.target.value === "Internal");
                                setUserCategory(e.target.value === "Internal" ? "Student" : "External_Student");
                            }}
                            className={`${inputClass} cursor-pointer`}
                        >
                            <option value="Internal">{t('internal')}</option>
                            <option value="External">{t('external')}</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10 relative z-10">
                        <div className="space-y-2">
                            <label className={`text-[10px] md:text-xs font-black text-slate-400 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('nameLabel')}</label>
                            <input name="Full_Name" required type="text" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] md:text-xs font-black text-slate-400 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('categoryLabel')}</label>
                            <select 
                                name="User_Category" 
                                onChange={(e) => setUserCategory(e.target.value)}
                                className={`${inputClass} cursor-pointer`}
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

                    <div className="space-y-6 md:space-y-10 mb-8 md:mb-12 relative z-10 animate-fade-up">
                        {userCategory.includes("Student") && (
                            <div className="space-y-2">
                                <label className={`text-[10px] md:text-xs font-black text-green-600 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('gradeLabel')}</label>
                                <select name="Grade" className={`${inputClass} text-xl md:text-2xl`}>
                                    {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                </select>
                            </div>
                        )}

                        {/* بقية الحقول الديناميكية - معلم، إداري، ولي أمر */}
                        {userCategory === "Teacher" && (
                            <div className="space-y-2">
                                <label className={`text-[10px] md:text-xs font-black text-green-600 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('specializationLabel')}</label>
                                <input name="Specialization" required type="text" className={inputClass} />
                            </div>
                        )}

                        {userCategory === "Admin" && (
                            <div className="space-y-2">
                                <label className={`text-[10px] md:text-xs font-black text-green-600 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('deptLabel')}</label>
                                <input name="Department" required type="text" className={inputClass} />
                            </div>
                        )}

                        {userCategory === "Parent" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                <div className="space-y-2">
                                    <label className={`text-[10px] md:text-xs font-black text-green-600 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('jobLabel')}</label>
                                    <input name="Parent_Job" required type="text" className={inputClass} />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[10px] md:text-xs font-black text-green-600 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('sonsGradeLabel')}</label>
                                    <select name="Son_Grade" className={inputClass}>
                                        {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {isInternal && (
                                <>
                                    <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-white/5 shadow-lg border border-slate-100 dark:border-white/5">
                                        <label className={`text-[9px] md:text-[10px] font-black mb-3 block text-red-600 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('ratingService')}</label>
                                        <select name="Service_Rating" className="w-full bg-transparent font-black text-base md:text-lg outline-none dark:text-white leading-relaxed">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                    <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-white/5 shadow-lg border border-slate-100 dark:border-white/5">
                                        <label className={`text-[9px] md:text-[10px] font-black mb-3 block text-red-600 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('ratingStaff')}</label>
                                        <select name="Staff_Rating" className="w-full bg-transparent font-black text-base md:text-lg outline-none dark:text-white leading-relaxed">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-white/5 shadow-lg border border-slate-100 dark:border-white/5">
                                <label className={`text-[9px] md:text-[10px] font-black mb-3 block text-green-600 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('ratingSaqr')}</label>
                                <select name="Saqr_Rating" className="w-full bg-transparent font-black text-base md:text-lg outline-none dark:text-white leading-relaxed">
                                    <option value="5">⭐⭐⭐⭐⭐ {t('optSmart')}</option>
                                    <option value="4">⭐⭐⭐⭐ {t('optUseful')}</option>
                                    <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="space-y-2">
                                <label className={`text-[10px] md:text-xs font-black text-slate-400 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('devSuggestions')}</label>
                                <textarea name="Dev_Ideas" rows={2} className={`${inputClass} resize-none`}></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[10px] md:text-xs font-black text-slate-400 ms-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('bookSuggestions')}</label>
                                <textarea name="Book_Requests" rows={2} className={`${inputClass} resize-none`}></textarea>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={`w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black text-xs md:text-base shadow-2xl hover:bg-red-600 hover:text-white transition-all ${locale === 'en' ? 'uppercase tracking-[0.4em] md:tracking-[0.6em]' : ''}`}>
                        {t('submitBtn')}
                    </button>
                </form>
            )}

            <div className="mt-12 md:mt-20 text-center opacity-60">
                <p className={`text-[8px] md:text-[10px] font-black text-slate-400 mb-2 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>EFIPS Library • 2026</p>
                <p className="font-black text-slate-900 dark:text-white text-[10px] md:text-xs">Official Librarian: Islam Ahmed</p>
            </div>
        </div>
    );
};

export default FeedbackPage;
