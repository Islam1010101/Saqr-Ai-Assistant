import React, { useState } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "مركز التطوير والابتكار",
        subTitle: "شاركنا أفكارك لتطوير مكتبة مدرسة صقر الإمارات الرقمية لعام 2026",
        nameLabel: "الاسم الكامل",
        affiliationLabel: "هل أنت عضو في المدرسة؟",
        categoryLabel: "الفئة",
        gradeLabel: "الصف الدراسي",
        sectionLabel: "السيكشن / الشعبة",
        jobLabel: "المسمى الوظيفي",
        fromOutsideLabel: "كيف تعرفت على بوابة صقر؟",
        ratingService: "تقييم خدمات المكتبة",
        ratingStaff: "تقييم أداء أمين المكتبة (إسلام أحمد)",
        ratingSaqr: "تقييم ذكاء المساعد صقر AI",
        devSuggestions: "مقترحات لتطوير خدمات المكتبة",
        bookSuggestions: "عناوين تود إضافتها للمكتبة الرقمية",
        msgLabel: "ملاحظات إضافية",
        submitBtn: "إرسال البيانات",
        successMsg: "شكراً لمساهمتك! رأيك سيصل لأمين المكتبة فوراً.",
        internal: "نعم، من داخل المدرسة",
        external: "لا، زائر من الخارج",
        student: "طالب",
        teacher: "معلم",
        admin: "إداري",
        parent: "ولي أمر",
        employee: "موظف",
        optExcellent: "الممتازة",
        optVeryGood: "جيدة جداً",
        optAverage: "متوسطة",
        optNeedsDev: "تحتاج تطوير",
        optOutstanding: "متميز جداً",
        optHelpful: "متعاون للغاية",
        optGood: "جيد",
        optFair: "مقبول",
        optSmart: "ذكي جداً",
        optUseful: "مفيد"
    },
    en: {
        pageTitle: "Innovation & Development Center",
        subTitle: "Share your ideas to develop E.F.I.P.S Library for 2026",
        nameLabel: "Full Name",
        affiliationLabel: "Are you a school member?",
        categoryLabel: "Category",
        gradeLabel: "Grade Level",
        sectionLabel: "Section",
        jobLabel: "Job Title",
        fromOutsideLabel: "How did you hear about Saqr Portal?",
        ratingService: "Library Services Rating",
        ratingStaff: "Librarian Performance Rating (Islam Ahmed)",
        ratingSaqr: "Saqr AI Intelligence Rating",
        devSuggestions: "Suggestions for Library Development",
        bookSuggestions: "Titles to add to Digital Library",
        msgLabel: "Additional Notes",
        submitBtn: "Submit Data",
        successMsg: "Thank you! Your feedback will reach the Librarian instantly.",
        internal: "Yes, School Member",
        external: "No, Outside Visitor",
        student: "Student",
        teacher: "Teacher",
        admin: "Administrator",
        parent: "Parent",
        employee: "Employee",
        optExcellent: "Excellent",
        optVeryGood: "Very Good",
        optAverage: "Average",
        optNeedsDev: "Needs Development",
        optOutstanding: "Outstanding",
        optHelpful: "Very Helpful",
        optGood: "Good",
        optFair: "Fair",
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
        audio.volume = 0.5;
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
            alert(locale === 'ar' ? "خطأ في الإرسال" : "Submission Error");
        }
    };

    return (
        <div dir={dir} className="max-w-5xl mx-auto px-4 py-12 md:py-20 animate-fade-up relative z-10 pb-32 text-start antialiased font-black">
            
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-4 drop-shadow-lg">
                    {t('pageTitle')}
                </h1>
                <div className="h-1.5 w-32 bg-red-600 mx-auto mb-8 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto tracking-tight uppercase">
                    {t('subTitle')}
                </p>
            </div>

            {submitted ? (
                <div className="glass-panel p-16 rounded-[4rem] text-center bg-green-600/5 border-2 border-green-600/20 shadow-2xl animate-in zoom-in duration-500">
                    <div className="text-7xl mb-6">🚀</div>
                    <h2 className="text-3xl font-black text-green-700 dark:text-green-400 mb-8">{t('successMsg')}</h2>
                    <button onClick={() => setSubmitted(false)} className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-xl">
                        {locale === 'ar' ? "إرسال تقييم جديد" : "Send Another Feedback"}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-14 rounded-[4rem] bg-white/80 dark:bg-slate-900/80 shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/10 blur-[120px] rounded-full"></div>

                    {/* الأساس: الاسم والتبعية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('nameLabel')}</label>
                            <input name="Full_Name" required type="text" className="w-full p-5 rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-red-600 ms-5">{t('affiliationLabel')}</label>
                            <select 
                                name="Is_School_Member" 
                                onChange={(e) => {
                                    setIsInternal(e.target.value === "Internal");
                                    setUserCategory(e.target.value === "Internal" ? "Student" : "External_Student");
                                }}
                                className="w-full p-5 rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-black transition-all shadow-inner text-slate-900 dark:text-white cursor-pointer"
                            >
                                <option value="Internal">{t('internal')}</option>
                                <option value="External">{t('external')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-10 mb-10 relative z-10 animate-fade-up">
                        {/* مسار عضو المدرسة */}
                        {isInternal ? (
                            <div className="space-y-8 animate-in slide-in-from-top duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('categoryLabel')}</label>
                                        <select name="Internal_Category" onChange={(e) => setUserCategory(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-black/40 font-black outline-none focus:border-red-600 border-2 border-transparent transition-all">
                                            <option value="Student">{t('student')}</option>
                                            <option value="Teacher">{t('teacher')}</option>
                                            <option value="Admin">{t('admin')}</option>
                                            <option value="Parent">{t('parent')}</option>
                                        </select>
                                    </div>
                                    
                                    {userCategory === "Student" && (
                                        <div className="space-y-3 animate-fade-down">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('gradeLabel')}</label>
                                            <select name="Student_Grade" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-black/40 font-black outline-none border-2 border-transparent focus:border-red-600 transition-all">
                                                {Array.from({length: 12}, (_, i) => i + 1).map(g => (
                                                    <option key={g} value={g}>{locale === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('sectionLabel')}</label>
                                        <input name="Section" required type="text" placeholder="A, B, C..." className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-black/40 font-bold outline-none border-2 border-transparent focus:border-red-600 transition-all" />
                                    </div>
                                </div>

                                {/* تقييمات داخلية حصرياً */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                                        <label className="text-[10px] font-black uppercase tracking-widest mb-4 block text-red-600">{t('ratingService')}</label>
                                        <select name="Internal_Service_Rating" className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border-none font-black text-sm outline-none dark:text-white">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                            <option value="2">⭐⭐ {t('optNeedsDev')}</option>
                                        </select>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                                        <label className="text-[10px] font-black uppercase tracking-widest mb-4 block text-red-600">{t('ratingStaff')}</label>
                                        <select name="Internal_Librarian_Rating" className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border-none font-black text-sm outline-none dark:text-white">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optOutstanding')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optHelpful')}</option>
                                            <option value="3">⭐⭐⭐ {t('optGood')}</option>
                                            <option value="2">⭐⭐ {t('optFair')}</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('devSuggestions')}</label>
                                        <textarea name="Library_Dev_Ideas" rows={2} className="w-full p-6 rounded-[2.5rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner resize-none text-slate-900 dark:text-white"></textarea>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* مسار الزائر الخارجي */
                            <div className="space-y-8 animate-in slide-in-from-top duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('categoryLabel')}</label>
                                        <select name="External_Category" onChange={(e) => setUserCategory(e.target.value)} className="w-full p-5 rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-black transition-all shadow-inner">
                                            <option value="External_Student">{t('student')}</option>
                                            <option value="External_Employee">{t('employee')}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">
                                            {userCategory === "External_Student" ? t('gradeLabel') : t('jobLabel')}
                                        </label>
                                        <input name="External_Specific_Role" required type="text" className="w-full p-5 rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-red-600 ms-5">{t('fromOutsideLabel')}</label>
                                    <input name="Discovery_Source" required type="text" className="w-full p-5 rounded-3xl bg-red-50 dark:bg-red-950/20 border-2 border-red-200 focus:border-red-600 outline-none font-bold transition-all shadow-inner" />
                                </div>
                            </div>
                        )}

                        {/* حقول مشتركة للجميع */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                                <label className="text-[10px] font-black uppercase tracking-widest mb-4 block text-red-600">{t('ratingSaqr')}</label>
                                <select name="Saqr_AI_Performance" className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border-none font-black text-sm outline-none dark:text-white">
                                    <option value="5">⭐⭐⭐⭐⭐ {t('optSmart')}</option>
                                    <option value="4">⭐⭐⭐⭐ {t('optUseful')}</option>
                                    <option value="3">⭐⭐⭐ {locale === 'ar' ? 'متوسط' : 'Average'}</option>
                                    <option value="2">⭐⭐ {t('optNeedsDev')}</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('bookSuggestions')}</label>
                                <textarea name="Requested_Digital_Books" rows={2} className="w-full p-6 rounded-[2.2rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner resize-none text-slate-900 dark:text-white"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-12 relative z-10">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('msgLabel')}</label>
                        <textarea name="General_Notes" rows={3} className="w-full p-6 rounded-[2.5rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner resize-none text-slate-900 dark:text-white"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-red-600 text-white py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-sm md:text-base shadow-[0_30px_60px_rgba(220,38,38,0.4)] hover:bg-red-700 hover:scale-[1.01] active:scale-95 transition-all relative z-10 overflow-hidden">
                        {t('submitBtn')}
                    </button>
                </form>
            )}

            <div className="mt-24 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-2 text-slate-400">EFIPS Library Tech Center • 2026</p>
                <p className="font-black text-slate-950 dark:text-white text-xs tracking-tight uppercase">OFFICIAL LIBRARIAN: ISLAM AHMED</p>
            </div>
        </div>
    );
};

export default FeedbackPage;
