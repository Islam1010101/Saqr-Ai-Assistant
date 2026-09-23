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

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const UAEFlagIcon = () => (
    <svg viewBox="0 0 640 480" className="w-20 h-20 md:w-32 md:h-32 rounded-xl shadow-lg overflow-hidden mb-8 mx-auto" preserveAspectRatio="none">
        <path fill="#00732f" d="M0 0h640v160H0z"/>
        <path fill="#fff" d="M0 160h640v160H0z"/>
        <path fill="#000" d="M0 320h640v160H0z"/>
        <path fill="#ff0000" d="M0 0h220v480H0z"/>
    </svg>
);

const StarIcon = () => (
    <svg className="w-5 h-5 inline-block text-amber-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const DropdownArrow = () => (
    <div className="absolute end-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </div>
);

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

    // ستايل الحقول (Input & Select) ليناسب شكل "الألعاب" الممتع
    const inputClass = "w-full p-4 md:p-5 rounded-2xl bg-white dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 outline-none font-black text-slate-900 dark:text-white text-sm md:text-lg focus:border-amber-400 dark:focus:border-amber-500 transition-colors shadow-inner appearance-none cursor-text";
    const selectClass = "w-full p-4 md:p-5 rounded-2xl bg-white dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 outline-none font-black text-slate-900 dark:text-white text-sm md:text-lg hover:border-amber-400 transition-colors shadow-sm appearance-none cursor-pointer";

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-20 px-4 md:px-6">
            
            {/* 🌟 تصميم طفولي للخلفية 🌟 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-amber-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-[1200px] mx-auto flex flex-col animate-fade-in-up pb-20 z-10">
                
                {/* الهيدر العلوي */}
                <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
                    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight mb-6 ${!isAr ? 'tracking-tight' : ''}`}>
                        {t('pageTitle')}
                    </h1>
                    
                    {/* فواصل مبهجة */}
                    <div className="flex justify-center items-center gap-3 mb-8">
                        <div className="h-2 w-16 md:w-20 bg-emerald-500 rounded-full"></div>
                        <div className="h-2 w-16 md:w-20 bg-amber-400 rounded-full"></div>
                    </div>

                    <p className="text-base md:text-2xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-3xl mx-auto">
                        {t('subTitle')}
                    </p>
                </div>

                {/* حالة نجاح الإرسال */}
                {submitted ? (
                    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 p-10 md:p-20 rounded-[3rem] border-4 border-emerald-400 dark:border-emerald-600 text-center shadow-lg animate-zoom-in relative overflow-hidden">
                        <UAEFlagIcon />
                        <h2 className="text-3xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-10 leading-tight">{t('successMsg')}</h2>
                        <button onClick={() => setSubmitted(false)} className="px-10 py-4 md:px-14 md:py-5 bg-sky-500 text-white rounded-full font-black uppercase tracking-widest text-lg md:text-xl border-b-8 border-sky-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md">
                            {isAr ? "إرسال مقترح آخر" : "Send Another"}
                        </button>
                    </div>
                ) : (
                    /* نموذج الإدخال (Form) بستايل "الألعاب" */
                    <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-slate-900 p-6 md:p-12 lg:p-16 rounded-[3rem] md:rounded-[4rem] border-4 border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
                        
                        {/* معلومات المستخدم الأساسية */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16">
                            <div className="space-y-3 relative">
                                <label className={`text-xs md:text-sm font-black text-emerald-600 dark:text-emerald-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('affiliationLabel')}</label>
                                <div className="relative group">
                                    <select 
                                        name="Membership" 
                                        onChange={(e) => {
                                            setIsInternal(e.target.value === "Internal");
                                            setUserCategory(e.target.value === "Internal" ? "Student" : "External_Student");
                                        }}
                                        className={selectClass}
                                    >
                                        <option value="Internal">{t('internal')}</option>
                                        <option value="External">{t('external')}</option>
                                    </select>
                                    <DropdownArrow />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className={`text-xs md:text-sm font-black text-slate-500 dark:text-slate-400 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('nameLabel')}</label>
                                <input name="Full_Name" required type="text" className={inputClass} placeholder={isAr ? "اكتب اسمك الكامل..." : "Type your full name..."} />
                            </div>
                        </div>

                        {/* الفئة والتفاصيل الديناميكية */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 md:p-10 rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-700 mb-10 md:mb-16">
                            <div className="mb-8 space-y-3">
                                <label className={`text-xs md:text-sm font-black text-amber-600 dark:text-amber-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('categoryLabel')}</label>
                                <div className="relative group">
                                    <select 
                                        name="User_Category" 
                                        onChange={(e) => setUserCategory(e.target.value)}
                                        className={selectClass}
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
                                    <DropdownArrow />
                                </div>
                            </div>

                            {/* الحقول المعتمدة على الفئة */}
                            <div className="animate-fade-in">
                                {userCategory.includes("Student") && (
                                    <div className="space-y-3">
                                        <label className={`text-xs md:text-sm font-black text-sky-600 dark:text-sky-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('gradeLabel')}</label>
                                        <div className="relative group">
                                            <select name="Grade" className={selectClass}>
                                                {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{isAr ? `الصف ${g}` : `Grade ${g}`}</option>)}
                                            </select>
                                            <DropdownArrow />
                                        </div>
                                    </div>
                                )}
                                {userCategory === "Teacher" && (
                                    <div className="space-y-3"><label className={`text-xs md:text-sm font-black text-sky-600 dark:text-sky-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('specializationLabel')}</label><input name="Specialization" required type="text" className={inputClass} /></div>
                                )}
                                {userCategory === "Admin" && (
                                    <div className="space-y-3"><label className={`text-xs md:text-sm font-black text-sky-600 dark:text-sky-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('deptLabel')}</label><input name="Department" required type="text" className={inputClass} /></div>
                                )}
                                {userCategory === "Parent" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3"><label className={`text-xs md:text-sm font-black text-sky-600 dark:text-sky-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('jobLabel')}</label><input name="Parent_Job" required type="text" className={inputClass} /></div>
                                        <div className="space-y-3">
                                            <label className={`text-xs md:text-sm font-black text-sky-600 dark:text-sky-500 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('sonsGradeLabel')}</label>
                                            <div className="relative group">
                                                <select name="Son_Grade" className={selectClass}>{Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>{isAr ? `الصف ${g}` : `Grade ${g}`}</option>)}</select>
                                                <DropdownArrow />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* كروت التقييم بتصميم صلب (Solid Cards) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-16">
                            {isInternal && (
                                <>
                                    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                                        <label className={`text-xs md:text-sm font-black text-rose-500 mb-4 block ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('ratingService')}</label>
                                        <div className="relative">
                                            <select name="Service_Rating" className="w-full bg-slate-50 dark:bg-slate-900 font-black text-lg md:text-xl p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 outline-none text-slate-900 dark:text-white cursor-pointer appearance-none">
                                                <option value="5">{t('optExcellent')}</option>
                                                <option value="4">{t('optVeryGood')}</option>
                                                <option value="3">{t('optAverage')}</option>
                                            </select>
                                            <DropdownArrow />
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                                        <label className={`text-xs md:text-sm font-black text-rose-500 mb-4 block ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('ratingStaff')}</label>
                                        <div className="relative">
                                            <select name="Staff_Rating" className="w-full bg-slate-50 dark:bg-slate-900 font-black text-lg md:text-xl p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 outline-none text-slate-900 dark:text-white cursor-pointer appearance-none">
                                                <option value="5">{t('optExcellent')}</option>
                                                <option value="4">{t('optVeryGood')}</option>
                                                <option value="3">{t('optAverage')}</option>
                                            </select>
                                            <DropdownArrow />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className={`bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center ${!isInternal ? 'md:col-span-3' : ''}`}>
                                <label className={`text-xs md:text-sm font-black text-emerald-500 mb-4 block ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('ratingSaqr')}</label>
                                <div className="relative">
                                    <select name="Saqr_Rating" className="w-full bg-slate-50 dark:bg-slate-900 font-black text-lg md:text-xl p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 outline-none text-slate-900 dark:text-white cursor-pointer appearance-none">
                                        <option value="5">{t('optSmart')}</option>
                                        <option value="4">{t('optUseful')}</option>
                                        <option value="3">{t('optAverage')}</option>
                                    </select>
                                    <DropdownArrow />
                                </div>
                            </div>
                        </div>

                        {/* مساحات المقترحات النصوص */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12 md:mb-16">
                            <div className="space-y-3">
                                <label className={`text-xs md:text-sm font-black text-slate-500 dark:text-slate-400 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('devSuggestions')}</label>
                                <textarea name="Dev_Ideas" rows={4} className={`${inputClass} resize-none`} placeholder={isAr ? "اكتب أفكارك هنا..." : "Type your ideas here..."}></textarea>
                            </div>
                            <div className="space-y-3">
                                <label className={`text-xs md:text-sm font-black text-slate-500 dark:text-slate-400 ms-2 ${!isAr ? 'uppercase tracking-wider' : ''}`}>{t('bookSuggestions')}</label>
                                <textarea name="Book_Requests" rows={4} className={`${inputClass} resize-none`} placeholder={isAr ? "أدخل أسماء الكتب..." : "Enter book titles..."}></textarea>
                            </div>
                        </div>

                        {/* زر الإرسال */}
                        <div className="text-center pt-4">
                            <button type="submit" className={`w-full md:w-auto px-12 py-5 rounded-full bg-rose-500 text-white font-black text-lg md:text-2xl border-b-8 border-rose-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md ${!isAr ? 'uppercase tracking-widest' : ''}`}>
                                {t('submitBtn')}
                            </button>
                        </div>
                    </form>
                )}

                {/* الفوتر */}
                <div className="mt-16 md:mt-24 text-center opacity-70">
                    <p className={`text-xs md:text-sm font-black text-slate-500 dark:text-slate-400 mb-4 ${!isAr ? 'uppercase tracking-widest' : ''}`}>EFIPS Innovation Lab • 2026</p>
                    <div className="h-1 w-16 bg-slate-300 dark:bg-slate-700 mx-auto rounded-full mb-4"></div>
                    <p className="font-black text-slate-800 dark:text-slate-300 text-sm md:text-base">Librarian: Islam Ahmed</p>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
                
                @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
                .animate-zoom-in { animation: zoom-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
                
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
            `}</style>
        </div>
    );
};

export default FeedbackPage;
