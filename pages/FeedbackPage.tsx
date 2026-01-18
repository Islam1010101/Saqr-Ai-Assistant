import React, { useState } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "مركز التطوير والابتكار",
        subTitle: "شاركنا أفكارك لتطوير مكتبة صقر الإمارات الرقمية لعام 2026",
        nameLabel: "الاسم الكامل",
        roleLabel: "المرحلة الدراسية أو الوظيفة",
        affiliationLabel: "صفتك في المدرسة",
        fromOutsideLabel: "كيف تعرفت على بوابة صقر؟",
        ratingService: "تقييم خدمات المكتبة",
        ratingStaff: "تقييم أداء أمين المكتبة (إسلام أحمد)",
        ratingSaqr: "تقييم ذكاء المساعد صقر AI",
        devSuggestions: "مقترحات لتطوير المكتبة",
        bookSuggestions: "عناوين تود إضافتها للمكتبة الرقمية",
        msgLabel: "ملاحظات إضافية",
        submitBtn: "إرسال البيانات",
        successMsg: "شكراً لمساهمتك في التطوير! رأيك سيصنع الفرق.",
        internal: "عضو في المدرسة",
        external: "زائر من الخارج",
    },
    en: {
        pageTitle: "Innovation & Development Center",
        subTitle: "Share your ideas to develop Saqr Library for 2026",
        nameLabel: "Full Name",
        roleLabel: "Grade Level or Job Title",
        affiliationLabel: "Your Affiliation",
        fromOutsideLabel: "How did you hear about Saqr Portal?",
        ratingService: "Library Services Rating",
        ratingStaff: "Librarian Performance Rating (Islam Ahmed)",
        ratingSaqr: "Saqr AI Intelligence Rating",
        devSuggestions: "Suggestions for Development",
        bookSuggestions: "Titles to add to Digital Library",
        msgLabel: "Additional Notes",
        submitBtn: "Submit Data",
        successMsg: "Thank you for contributing! Your feedback makes a difference.",
        internal: "School Member",
        external: "Outside Visitor",
    }
};

const FeedbackPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [submitted, setSubmitted] = useState(false);
    const [userType, setUserType] = useState<'internal' | 'external'>('internal');

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
            alert(locale === 'ar' ? "خطأ في الاتصال" : "Connection Error");
        }
    };

    return (
        <div dir={dir} className="max-w-5xl mx-auto px-4 py-12 md:py-20 animate-fade-up relative z-10 pb-32 text-start antialiased font-black">
            
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-6">
                    {t('pageTitle')}
                </h1>
                <div className="h-1.5 w-32 bg-red-600 mx-auto mb-8 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto uppercase tracking-tight">
                    {t('subTitle')}
                </p>
            </div>

            {submitted ? (
                <div className="glass-panel p-16 rounded-[4rem] text-center bg-green-600/5 border-2 border-green-600/20 shadow-2xl animate-in zoom-in duration-500">
                    <div className="text-7xl mb-6">🚀</div>
                    <h2 className="text-3xl font-black text-green-700 dark:text-green-400 mb-8">{t('successMsg')}</h2>
                    <button onClick={() => setSubmitted(false)} className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-xl">
                        {locale === 'ar' ? "إرسال المزيد من الأفكار" : "Send More Ideas"}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-14 rounded-[4rem] bg-white/80 dark:bg-slate-950/80 shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-none relative overflow-hidden group">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/10 blur-[120px] rounded-full"></div>

                    {/* Affiliation Toggle */}
                    <div className="mb-12 relative z-10 flex p-1.5 bg-slate-200/50 dark:bg-white/5 rounded-[2.2rem] border border-white/10">
                        <button type="button" onClick={() => setUserType('internal')} className={`flex-1 py-4 rounded-[1.8rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${userType === 'internal' ? 'bg-red-600 text-white shadow-xl' : 'text-slate-500'}`}>{t('internal')}</button>
                        <button type="button" onClick={() => setUserType('external')} className={`flex-1 py-4 rounded-[1.8rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${userType === 'external' ? 'bg-red-600 text-white shadow-xl' : 'text-slate-500'}`}>{t('external')}</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('nameLabel')}</label>
                            <input name="Full_Name" required type="text" className="w-full p-5 rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('roleLabel')}</label>
                            <input name="Position_Grade" required type="text" className="w-full p-5 rounded-3xl bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner text-slate-900 dark:text-white" />
                        </div>
                    </div>

                    {userType === 'internal' ? (
                        <div className="space-y-10 mb-10 relative z-10 animate-fade-up">
                            {/* Ratings Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: 'Library_Service', label: t('ratingService') },
                                    { name: 'Librarian_Performance', label: t('ratingStaff') },
                                    { name: 'Saqr_AI_Rating', label: t('ratingSaqr') }
                                ].map((field) => (
                                    <div key={field.name} className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
                                        <label className="text-[10px] font-black uppercase tracking-widest mb-4 block text-red-600">{field.label}</label>
                                        <select name={field.name} className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border-none font-black text-sm outline-none dark:text-white">
                                            <option value="5">⭐⭐⭐⭐⭐</option>
                                            <option value="4">⭐⭐⭐⭐</option>
                                            <option value="3">⭐⭐⭐</option>
                                            <option value="2">⭐⭐</option>
                                        </select>
                                    </div>
                                ))}
                            </div>

                            {/* Suggestion Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('devSuggestions')}</label>
                                    <textarea name="Development_Suggestions" rows={3} className="w-full p-5 rounded-[2.2rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner resize-none text-slate-900 dark:text-white"></textarea>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('bookSuggestions')}</label>
                                    <textarea name="Proposed_Titles" rows={3} className="w-full p-5 rounded-[2.2rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner resize-none text-slate-900 dark:text-white"></textarea>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 mb-10 relative z-10 animate-fade-down">
                            <label className="text-[11px] font-black uppercase tracking-widest text-red-600 ms-5">{t('fromOutsideLabel')}</label>
                            <input name="Source_Discovery" required type="text" className="w-full p-5 rounded-3xl bg-red-50 dark:bg-red-950/20 border-2 border-red-200 focus:border-red-600 outline-none font-bold transition-all shadow-inner text-slate-900 dark:text-white" />
                        </div>
                    )}

                    <div className="space-y-3 mb-12 relative z-10">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ms-5">{t('msgLabel')}</label>
                        <textarea name="General_Feedback" rows={3} className="w-full p-6 rounded-[2.5rem] bg-white dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner resize-none text-slate-900 dark:text-white"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-red-600 text-white py-7 rounded-[2.2rem] font-black uppercase tracking-[0.4em] text-sm md:text-base shadow-[0_30px_60px_rgba(220,38,38,0.4)] hover:bg-red-700 hover:scale-[1.01] active:scale-95 transition-all relative z-10 overflow-hidden">
                        {t('submitBtn')}
                    </button>
                </form>
            )}

            <div className="mt-24 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-2 text-slate-400">EFIPS Library Tech Unit • 2026</p>
                <p className="font-black text-slate-950 dark:text-white text-xs">OFFICIAL LIBRARIAN: ISLAM SOLIMAN</p>
            </div>
        </div>
    );
};

export default FeedbackPage;
