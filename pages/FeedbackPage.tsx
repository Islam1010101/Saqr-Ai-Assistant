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

    // كلاس موحد لكافة المدخلات لضمان التماثل
    const inputClass = "w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 focus:border-red-600 dark:focus:border-green-600 outline-none font-bold transition-all shadow-sm text-slate-900 dark:text-white leading-relaxed mb-1";

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-24 text-start antialiased font-black">
            
            {/* Header Section - تماثل تام وأبعاد مدروسة */}
            <div className="text-center mb-12 md:mb-20 relative">
                <div className="absolute inset-0 flex justify-center -z-10 opacity-20 blur-[100px] pointer-events-none">
                    <div className="w-48 md:w-80 h-48 md:h-80 bg-green-600 rounded-full translate-x-10"></div>
                    <div className="w-48 md:w-80 h-48 md:h-80 bg-red-600 rounded-full -translate-x-10"></div>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6 leading-[1.2]">
                    {t('pageTitle')}
                </h1>
                
                <div className="flex justify-center items-center gap-3 mb-8">
                    <div className="h-1.5 w-12 md:w-20 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
                    <div className="h-1.5 w-12 md:w-20 bg-green-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
                </div>

                <p className="text-xl md:text-3xl text-slate-700 dark:text-slate-300 font-black max-w-4xl mx-auto px-2 leading-[1.6]">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-700 via-slate-900 dark:via-white to-green-700">
                        {t('subTitle')}
                    </span>
                </p>
            </div>

            {submitted ? (
                <div className="glass-panel p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] text-center bg-green-600/5 border-2 border-green-600/20 shadow-2xl animate-in zoom-in duration-700">
                    <div className="text-6xl md:text-8xl mb-8 animate-bounce">🇦🇪</div>
                    <h2 className="text-2xl md:text-4xl font-black text-green-700 dark:text-green-400 mb-8 leading-relaxed">{t('successMsg')}</h2>
                    <button onClick={() => setSubmitted(false)} className="px-12 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                        {locale === 'ar' ? "إرسال المزيد" : "Submit More"}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 md:p-16 rounded-[3rem] md:rounded-[5rem] bg-white/80 dark:bg-slate-950/85 shadow-[0_80px_160px_rgba(0,0,0,0.2)] border border-white/20 relative overflow-hidden group">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full group-hover:bg-red-600/10 transition-all duration-1000"></div>
                    
                    <div className="mb-10 relative z-10 space-y-3">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-red-600 ms-5">{t('affiliationLabel')}</label>
                        <select 
                            name="Membership" 
                            onChange={(e) => {
                                setIsInternal(e.target.value === "Internal");
                                setUserCategory(e.target.value === "Internal" ? "Student" : "External_Student");
                            }}
                            className={inputClass + " cursor-pointer bg-slate-50"}
                        >
                            <option value="Internal">{t('internal')}</option>
                            <option value="External">{t('external')}</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 ms-5">{t('nameLabel')}</label>
                            <input name="Full_Name" required type="text" className={inputClass} />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 ms-5">{t('categoryLabel')}</label>
                            <select 
                                name="User_Category" 
                                onChange={(e) => setUserCategory(e.target.value)}
                                className={inputClass + " cursor-pointer"}
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

                    <div className="space-y-8 md:space-y-12 mb-10 relative z-10 animate-fade-up">
                        {/* الحقول الديناميكية - توحيد الارتفاعات */}
                        {userCategory.includes("Student") && (
                            <div className="space-y-3">
                                <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-green-600 ms-5">{t('gradeLabel')}</label>
                                <select name="Grade" className={inputClass + " text-xl"}>
                                    {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                </select>
                            </div>
                        )}

                        {userCategory === "Teacher" && (
                            <div className="space-y-3">
                                <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-green-600 ms-5">{t('specializationLabel')}</label>
                                <input name="Specialization" required type="text" className={inputClass} />
                            </div>
                        )}

                        {userCategory === "Admin" && (
                            <div className="space-y-3">
                                <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-green-600 ms-5">{t('deptLabel')}</label>
                                <input name="Department" required type="text" className={inputClass} />
                            </div>
                        )}

                        {userCategory === "Parent" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-green-600 ms-5">{t('jobLabel')}</label>
                                    <input name="Parent_Job" required type="text" className={inputClass} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-green-600 ms-5">{t('sonsGradeLabel')}</label>
                                    <select name="Son_Grade" className={inputClass}>
                                        {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {!isInternal && (
                            <div className="space-y-3 animate-fade-down">
                                <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-red-600 ms-5">{t('fromOutsideLabel')}</label>
                                <input name="Discovery_Path" required type="text" className={inputClass + " bg-red-50/30 dark:bg-red-900/5"} />
                            </div>
                        )}

                        {/* التقييمات - عرض منظم بظلال احترافية */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isInternal && (
                                <>
                                    <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                                        <label className="text-[9px] md:text-[11px] font-black uppercase mb-4 block text-red-600 tracking-widest">{t('ratingService')}</label>
                                        <select name="Service_Rating" className="w-full bg-transparent font-black text-lg outline-none dark:text-white leading-relaxed">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                                        <label className="text-[9px] md:text-[11px] font-black uppercase mb-4 block text-red-600 tracking-widest">{t('ratingStaff')}</label>
                                        <select name="Staff_Rating" className="w-full bg-transparent font-black text-lg outline-none dark:text-white leading-relaxed">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                                <label className="text-[9px] md:text-[11px] font-black uppercase mb-4 block text-green-600 tracking-widest">{t('ratingSaqr')}</label>
                                <select name="Saqr_Rating" className="w-full bg-transparent font-black text-lg outline-none dark:text-white leading-relaxed">
                                    <option value="5">⭐⭐⭐⭐⭐ {t('optSmart')}</option>
                                    <option value="4">⭐⭐⭐⭐ {t('optUseful')}</option>
                                    <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                </select>
                            </div>
                        </div>

                        {/* مقترحات التطوير - مساحات كبيرة ومريحة */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 ms-5">{t('devSuggestions')}</label>
                                <textarea name="Dev_Ideas" rows={3} className={inputClass + " resize-none p-6 md:p-8"}></textarea>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 ms-5">{t('bookSuggestions')}</label>
                                <textarea name="Book_Requests" rows={3} className={inputClass + " resize-none p-6 md:p-8"}></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-12 relative z-10">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 ms-5">{t('msgLabel')}</label>
                        <textarea name="Message" rows={4} className={inputClass + " resize-none p-6 md:p-8"}></textarea>
                    </div>

                    <button type="submit" className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-6 md:py-10 rounded-[2rem] md:rounded-[3rem] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-sm md:text-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-red-600 hover:text-white transition-all active:scale-[0.98] leading-none">
                        {t('submitBtn')}
                    </button>
                </form>
            )}

            <div className="mt-16 md:mt-24 text-center">
                <div className="flex justify-center gap-3 mb-6 opacity-30">
                    <div className="w-12 h-1.5 bg-red-600 rounded-full"></div>
                    <div className="w-12 h-1.5 bg-green-600 rounded-full"></div>
                </div>
                <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.6em] mb-3 text-slate-400 opacity-60">EFIPS Digital Legacy • 2026</p>
                <p className="font-black text-slate-900 dark:text-white uppercase text-xs md:text-base tracking-widest border-b-2 border-red-600 inline-block pb-1">Official Librarian: Islam Ahmed</p>
            </div>
        </div>
    );
};

export default FeedbackPage;
