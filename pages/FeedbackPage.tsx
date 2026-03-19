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
        pageTitle: "Innovation & Excellence",
        subTitle: "Reading is Intelligence, Development is Partnership.. Your footprint today shapes the future of our Library.",
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
    const isAr = locale === 'ar';
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
            alert(isAr ? "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً." : "An error occurred, please try again.");
        }
    };

    // كلاس موحد لحقول الإدخال لتتناسب مع الهوية الجديدة
    const inputClass = "w-full p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 focus:border-red-600 dark:focus:border-red-500 outline-none font-bold transition-all text-slate-900 dark:text-white text-sm md:text-lg focus:shadow-[0_0_15px_rgba(220,38,38,0.15)] appearance-none";

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-20 px-4 md:px-6">
            
            {/* 🌟 الخلفية الديناميكية بألوان الهوية الوطنية (أحمر وأخضر) 🌟 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/30 rounded-full blur-[120px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-green-600/30 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-[1200px] mx-auto flex flex-col animate-fade-in-up pb-20 z-10">
                
                {/* الهيدر العلوي */}
                <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
                    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight mb-6 ${!isAr ? 'tracking-tight' : ''}`}>
                        {t('pageTitle')}
                    </h1>
                    
                    {/* فواصل بألوان علم الإمارات */}
                    <div className="flex justify-center items-center gap-3 mb-8">
                        <div className="h-1.5 md:h-2 w-16 md:w-24 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                        <div className="h-1.5 md:h-2 w-16 md:w-24 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    </div>

                    <p className="text-base md:text-2xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                        {t('subTitle')}
                    </p>
                </div>

                {/* حالة نجاح الإرسال */}
                {submitted ? (
                    <div className="w-full max-w-3xl mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-10 md:p-20 rounded-[2.5rem] md:rounded-[4rem] border border-green-500/30 text-center shadow-2xl animate-zoom-in relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-500/5"></div>
                        <div className="relative z-10">
                            <div className="text-7xl md:text-9xl mb-8 animate-bounce">🇦🇪</div>
                            <h2 className="text-2xl md:text-5xl font-black text-green-700 dark:text-green-400 mb-10 leading-tight">{t('successMsg')}</h2>
                            <button onClick={() => setSubmitted(false)} className="px-10 py-4 md:px-14 md:py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold uppercase tracking-widest text-sm md:text-lg shadow-xl hover:-translate-y-1 transition-transform">
                                {isAr ? "إرسال مقترح آخر" : "Send Another"}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* نموذج الإدخال (Form) */
                    <form onSubmit={handleSubmit} className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
                        
                        {/* معلومات المستخدم الأساسية */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16">
                            <div className="space-y-3 relative">
                                <label className={`text-xs md:text-sm font-bold text-red-600 dark:text-red-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('affiliationLabel')}</label>
                                <div className="relative group">
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
                                    <div className="absolute end-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className={`text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('nameLabel')}</label>
                                <input name="Full_Name" required type="text" className={inputClass} placeholder={isAr ? "اكتب اسمك الكامل..." : "Type your full name..."} />
                            </div>
                        </div>

                        {/* الفئة والتفاصيل الديناميكية */}
                        <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 md:p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-10 md:mb-16">
                            <div className="mb-8 space-y-3">
                                <label className={`text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('categoryLabel')}</label>
                                <div className="relative group">
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
                                    <div className="absolute end-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                                </div>
                            </div>

                            {/* الحقول المعتمدة على الفئة */}
                            <div className="animate-fade-in">
                                {userCategory.includes("Student") && (
                                    <div className="space-y-3">
                                        <label className={`text-xs md:text-sm font-bold text-green-600 dark:text-green-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('gradeLabel')}</label>
                                        <div className="relative group">
                                            <select name="Grade" className={`${inputClass} cursor-pointer`}>
                                                {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{isAr ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                            </select>
                                            <div className="absolute end-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                                        </div>
                                    </div>
                                )}
                                {userCategory === "Teacher" && (
                                    <div className="space-y-3"><label className={`text-xs md:text-sm font-bold text-green-600 dark:text-green-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('specializationLabel')}</label><input name="Specialization" required type="text" className={inputClass} /></div>
                                )}
                                {userCategory === "Admin" && (
                                    <div className="space-y-3"><label className={`text-xs md:text-sm font-bold text-green-600 dark:text-green-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('deptLabel')}</label><input name="Department" required type="text" className={inputClass} /></div>
                                )}
                                {userCategory === "Parent" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3"><label className={`text-xs md:text-sm font-bold text-green-600 dark:text-green-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('jobLabel')}</label><input name="Parent_Job" required type="text" className={inputClass} /></div>
                                        <div className="space-y-3">
                                            <label className={`text-xs md:text-sm font-bold text-green-600 dark:text-green-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('sonsGradeLabel')}</label>
                                            <div className="relative group">
                                                <select name="Son_Grade" className={`${inputClass} cursor-pointer`}>{Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{isAr ? `الصف ${g}` : `Grade ${g}`}</option>)}</select>
                                                <div className="absolute end-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* كروت التقييم الزجاجية */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-16">
                            {isInternal && (
                                <>
                                    <div className="bg-white/50 dark:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-red-500/50 transition-colors">
                                        <label className={`text-xs md:text-sm font-bold text-red-600 dark:text-red-500 mb-4 block ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('ratingService')}</label>
                                        <select name="Service_Rating" className="w-full bg-transparent font-black text-xl md:text-2xl outline-none text-slate-900 dark:text-white cursor-pointer">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-red-500/50 transition-colors">
                                        <label className={`text-xs md:text-sm font-bold text-red-600 dark:text-red-500 mb-4 block ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('ratingStaff')}</label>
                                        <select name="Staff_Rating" className="w-full bg-transparent font-black text-xl md:text-2xl outline-none text-slate-900 dark:text-white cursor-pointer">
                                            <option value="5">⭐⭐⭐⭐⭐ {t('optExcellent')}</option>
                                            <option value="4">⭐⭐⭐⭐ {t('optVeryGood')}</option>
                                            <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className={`bg-white/50 dark:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-green-500/50 transition-colors ${!isInternal ? 'md:col-span-3' : ''}`}>
                                <label className={`text-xs md:text-sm font-bold text-green-600 dark:text-green-500 mb-4 block ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('ratingSaqr')}</label>
                                <select name="Saqr_Rating" className="w-full bg-transparent font-black text-xl md:text-2xl outline-none text-slate-900 dark:text-white cursor-pointer">
                                    <option value="5">⭐⭐⭐⭐⭐ {t('optSmart')}</option>
                                    <option value="4">⭐⭐⭐⭐ {t('optUseful')}</option>
                                    <option value="3">⭐⭐⭐ {t('optAverage')}</option>
                                </select>
                            </div>
                        </div>

                        {/* مساحات المقترحات النصوص */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12 md:mb-16">
                            <div className="space-y-3">
                                <label className={`text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('devSuggestions')}</label>
                                <textarea name="Dev_Ideas" rows={4} className={`${inputClass} resize-none`} placeholder={isAr ? "اكتب أفكارك هنا..." : "Type your ideas here..."}></textarea>
                            </div>
                            <div className="space-y-3">
                                <label className={`text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('bookSuggestions')}</label>
                                <textarea name="Book_Requests" rows={4} className={`${inputClass} resize-none`} placeholder={isAr ? "أدخل أسماء الكتب..." : "Enter book titles..."}></textarea>
                            </div>
                        </div>

                        {/* زر الإرسال */}
                        <div className="text-center pt-4">
                            <button type="submit" className={`w-full md:w-auto px-12 py-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg md:text-2xl shadow-xl hover:shadow-red-600/30 transition-all transform hover:-translate-y-1 active:scale-95 ${!isAr ? 'uppercase tracking-widest' : ''}`}>
                                {t('submitBtn')}
                            </button>
                        </div>
                    </form>
                )}

                {/* الفوتر */}
                <div className="mt-16 md:mt-24 text-center opacity-60">
                    <p className={`text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 ${!isAr ? 'uppercase tracking-widest' : ''}`}>EFIPS Innovation Lab • 2026</p>
                    <div className="h-1 w-16 bg-slate-300 dark:bg-slate-700 mx-auto rounded-full mb-4"></div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm md:text-base">Librarian: Islam Ahmed</p>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
                @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
                .animate-zoom-in { animation: zoom-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default FeedbackPage;
