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
        ratingStaff: "تقييم أداء أمين المكتبة",
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
        ratingStaff: "Librarian Performance",
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
        audio.play().catch(() => {});
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

    const inputClass = `w-full p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-slate-900/40 border-2 border-slate-100 dark:border-white/5 focus:border-red-600 dark:focus:border-green-600 outline-none font-black transition-all shadow-sm text-slate-950 dark:text-white leading-relaxed mb-1 focus:shadow-[0_0_30px_rgba(220,38,38,0.2)]`;

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fade-up relative z-10 pb-32 text-start antialiased font-black">
            
            {/* الهيدر الملكي المتدرج */}
            <div className="text-center mb-16 md:mb-24 relative">
                <h1 className={`text-4xl sm:text-5xl md:text-9xl font-black text-slate-950 dark:text-white mb-6 leading-tight ${locale === 'en' ? 'uppercase tracking-tighter' : ''} drop-shadow-2xl`}>
                    {t('pageTitle')}
                </h1>
                
                <div className="flex justify-center items-center gap-3 md:gap-6 mb-8 md:mb-12">
                    <div className="h-1.5 md:h-3 w-16 md:w-32 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                    <div className="h-1.5 md:h-3 w-16 md:w-32 bg-green-600 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                </div>

                <p className="text-xl sm:text-2xl md:text-5xl text-slate-700 dark:text-slate-300 font-black max-w-5xl mx-auto leading-tight italic px-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-slate-900 dark:via-white to-green-600">
                        {t('subTitle')}
                    </span>
                </p>
            </div>

            {submitted ? (
                <div className="glass-panel p-10 md:p-24 rounded-[3.5rem] md:rounded-[6rem] text-center bg-green-600/5 border-4 border-green-600/20 shadow-[0_0_100px_rgba(34,197,94,0.2)] animate-in zoom-in duration-500">
                    <div className="text-7xl md:text-[10rem] mb-10 animate-bounce">🇦🇪</div>
                    <h2 className="text-2xl md:text-6xl font-black text-green-700 dark:text-green-400 mb-10 leading-tight">{t('successMsg')}</h2>
                    <button onClick={() => setSubmitted(false)} className="px-12 py-6 md:px-20 md:py-8 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] font-black uppercase tracking-widest text-sm md:text-2xl shadow-2xl hover:scale-110 transition-transform">
                        {locale === 'ar' ? "إرسال مقترح آخر" : "Send Another"}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 md:p-24 rounded-[3rem] md:rounded-[6rem] bg-white/80 dark:bg-slate-950/70 shadow-3xl border border-white/10 relative overflow-hidden group">
                    {/* وهج خلفي داخلي */}
                    <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-red-600/5 blur-[150px] rounded-full pointer-events-none"></div>
                    <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-green-600/5 blur-[150px] rounded-full pointer-events-none"></div>

                    {/* القسم الأساسي: المعلومات الشخصية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-12 md:mb-20 relative z-10">
                        <div className="space-y-4">
                            <label className={`text-xs md:text-xl font-black text-red-600 ms-4 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('affiliationLabel')}</label>
                            <select 
                                name="Membership" 
                                onChange={(e) => {
                                    setIsInternal(e.target.value === "Internal");
                                    setUserCategory(e.target.value === "Internal" ? "Student" : "External_Student");
                                }}
                                className={`${inputClass} cursor-pointer text-base md:text-2xl`}
                            >
                                <option value="Internal">{t('internal')}</option>
                                <option value="External">{t('external')}</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className={`text-xs md:text-xl font-black text-slate-400 ms-4 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('nameLabel')}</label>
                            <input name="Full_Name" required type="text" className={`${inputClass} text-base md:text-2xl`} />
                        </div>
                    </div>

                    <div className="mb-12 md:mb-20 relative z-10 space-y-4">
                        <label className={`text-xs md:text-xl font-black text-slate-400 ms-4 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('categoryLabel')}</label>
                        <select 
                            name="User_Category" 
                            onChange={(e) => setUserCategory(e.target.value)}
                            className={`${inputClass} cursor-pointer text-base md:text-2xl`}
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

                    {/* الحقول الديناميكية بتأثيرات انسيابية */}
                    <div className="mb-16 md:mb-24 relative z-10 animate-fade-up">
                        {userCategory.includes("Student") && (
                            <div className="space-y-4">
                                <label className={`text-xs md:text-xl font-black text-green-600 ms-4 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('gradeLabel')}</label>
                                <select name="Grade" className={`${inputClass} text-xl md:text-4xl`}>
                                    {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                </select>
                            </div>
                        )}
                        {/* تكرار نفس التنسيق للمعلم والإداري وولي الأمر */}
                        {userCategory === "Teacher" && (
                            <div className="space-y-4"><label className="text-xs md:text-xl font-black text-green-600 ms-4">{t('specializationLabel')}</label><input name="Specialization" required type="text" className={`${inputClass} text-xl md:text-3xl`} /></div>
                        )}
                        {userCategory === "Admin" && (
                            <div className="space-y-4"><label className="text-xs md:text-xl font-black text-green-600 ms-4">{t('deptLabel')}</label><input name="Department" required type="text" className={`${inputClass} text-xl md:text-3xl`} /></div>
                        )}
                        {userCategory === "Parent" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                                <div className="space-y-4"><label className="text-xs md:text-xl font-black text-green-600 ms-4">{t('jobLabel')}</label><input name="Parent_Job" required type="text" className={`${inputClass} text-xl md:text-2xl`} /></div>
                                <div className="space-y-4"><label className="text-xs md:text-xl font-black text-green-600 ms-4">{t('sonsGradeLabel')}</label>
                                    <select name="Son_Grade" className={`${inputClass} text-xl md:text-2xl`}>{Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}</select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* كروت التقييم النيون (Premium Cards) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-16 md:mb-24 relative z-10">
                        {isInternal && (
                            <>
                                <div className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] bg-white dark:bg-white/5 shadow-xl border-2 border-red-600/20 hover:border-red-600/50 transition-all group/card">
                                    <label className={`text-[10px] md:text-sm font-black mb-4 block text-red-600 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('ratingService')}</label>
                                    <select name="Service_Rating" className="w-full bg-transparent font-black text-xl md:text-3xl outline-none dark:text-white cursor-pointer">
                                        <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                        <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                        <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                    </select>
                                </div>
                                <div className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] bg-white dark:bg-white/5 shadow-xl border-2 border-red-600/20 hover:border-red-600/50 transition-all group/card">
                                    <label className={`text-[10px] md:text-sm font-black mb-4 block text-red-600 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('ratingStaff')}</label>
                                    <select name="Staff_Rating" className="w-full bg-transparent font-black text-xl md:text-3xl outline-none dark:text-white cursor-pointer">
                                        <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                        <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                        <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <div className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] bg-white dark:bg-white/5 shadow-xl border-2 border-green-600/20 hover:border-green-600/50 transition-all group/card lg:col-span-1 sm:col-span-2 lg:col-span-1">
                            <label className={`text-[10px] md:text-sm font-black mb-4 block text-green-600 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('ratingSaqr')}</label>
                            <select name="Saqr_Rating" className="w-full bg-transparent font-black text-xl md:text-3xl outline-none dark:text-white cursor-pointer">
                                <option value="5">⭐⭐⭐⭐⭐ {t('optSmart')}</option>
                                <option value="4">⭐⭐⭐⭐ {t('optUseful')}</option>
                                <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                            </select>
                        </div>
                    </div>

                    {/* مساحات كتابة النصوص */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-24 relative z-10">
                        <div className="space-y-4">
                            <label className={`text-xs md:text-xl font-black text-slate-400 ms-4 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('devSuggestions')}</label>
                            <textarea name="Dev_Ideas" rows={3} className={`${inputClass} resize-none text-base md:text-xl`}></textarea>
                        </div>
                        <div className="space-y-4">
                            <label className={`text-xs md:text-xl font-black text-slate-400 ms-4 ${locale === 'en' ? 'uppercase tracking-widest' : ''}`}>{t('bookSuggestions')}</label>
                            <textarea name="Book_Requests" rows={3} className={`${inputClass} resize-none text-base md:text-xl`}></textarea>
                        </div>
                    </div>

                    {/* زر الإرسال الإمبراطوري */}
                    <button type="submit" className={`w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-6 md:py-12 rounded-[2rem] md:rounded-[3.5rem] font-black text-base md:text-4xl shadow-3xl hover:bg-red-600 hover:text-white dark:hover:bg-green-600 transition-all transform active:scale-95 ${locale === 'en' ? 'uppercase tracking-[0.2em] md:tracking-[0.4em]' : ''}`}>
                        {t('submitBtn')}
                    </button>
                </form>
};

export default FeedbackPage;
