import React, { useState } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "مركز المقترحات والابتكار",
        subTitle: "رأيك يطور مكتبتنا الرقمية وخدمات صقر AI",
        nameLabel: "الاسم الكامل",
        roleLabel: "المرحلة الدراسية أو الوظيفة",
        affiliationLabel: "هل أنت من داخل المدرسة؟",
        fromOutsideLabel: "كيف تعرفت على بوابة صقر؟",
        categoryLabel: "نوع المقترح",
        msgLabel: "تفاصيل المقترح أو الشكوى",
        submitBtn: "إرسال المقترح",
        successMsg: "تم استلام مقترحك بنجاح يا بطل! سيراجعه أمين المكتبة قريباً.",
        yes: "نعم، أنا من داخل المدرسة",
        no: "لا، أنا زائر من الخارج",
        cat1: "طلب كتاب جديد (ورقي/رقمي)",
        cat2: "أداء المساعد صقر AI",
        cat3: "المكتبة الرقمية والروابط",
        cat4: "أفكار لأنشطة مكتبية",
        cat5: "الملخصات المسموعة (دولاب 40)",
        cat6: "أخرى"
    },
    en: {
        pageTitle: "Suggestions & Innovation Center",
        subTitle: "Your feedback improves our library and Saqr AI",
        nameLabel: "Full Name",
        roleLabel: "Grade Level or Job Title",
        affiliationLabel: "Are you from inside the school?",
        fromOutsideLabel: "How did you hear about Saqr Portal?",
        categoryLabel: "Category",
        msgLabel: "Suggestion or Feedback Details",
        submitBtn: "Send Suggestion",
        successMsg: "Received! The Librarian will review your suggestion soon.",
        yes: "Yes, I am from EFIPS",
        no: "No, I am an outside visitor",
        cat1: "Request New Book (Physical/PDF)",
        cat2: "Saqr AI Performance",
        cat3: "Digital Library & Links",
        cat4: "Library Activities Ideas",
        cat5: "Audio Summaries (Shelf 40)",
        cat6: "Other"
    }
};

const FeedbackPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [submitted, setSubmitted] = useState(false);
    const [isFromOutside, setIsFromOutside] = useState(false);

    const FORMSPREE_URL = "https://formspree.io/f/xlggjwql";

    // --- دالة تشغيل صوت النجاح ---
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
                playSuccessSound(); // تشغيل الصوت عند النجاح
                setSubmitted(true);
                form.reset();
            }
        } catch (error) {
            alert("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
        }
    };

    return (
        <div dir={dir} className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-fade-up relative z-10 pb-32 text-start antialiased font-black">
            
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-4">
                    {t('pageTitle')}
                </h1>
                <div className="h-1.5 w-24 bg-red-600 mx-auto mb-6 rounded-full opacity-60"></div>
                <p className="text-lg md:text-xl text-red-600 font-bold opacity-80">{t('subTitle')}</p>
            </div>

            {submitted ? (
                <div className="glass-panel p-10 rounded-[3rem] text-center bg-green-600/10 border-2 border-green-600/30 animate-in zoom-in duration-500">
                    <span className="text-6xl mb-6 block animate-bounce">🎉</span>
                    <h2 className="text-2xl font-black text-green-700 dark:text-green-400">{t('successMsg')}</h2>
                    <button onClick={() => setSubmitted(false)} className="mt-8 text-slate-500 underline font-bold uppercase tracking-widest text-[10px]">إرسال مقترح آخر</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-12 rounded-[3.5rem] bg-white/80 dark:bg-slate-900/80 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-none relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 blur-[80px] rounded-full group-hover:bg-red-600/20 transition-all duration-700"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ms-4">{t('nameLabel')}</label>
                            <input name="name" required type="text" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner text-slate-950 dark:text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ms-4">{t('roleLabel')}</label>
                            <input name="role_or_grade" required type="text" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner text-slate-950 dark:text-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ms-4">{t('affiliationLabel')}</label>
                            <select 
                                name="is_internal" 
                                onChange={(e) => setIsFromOutside(e.target.value === "No")}
                                className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-black transition-all appearance-none cursor-pointer shadow-inner text-slate-950 dark:text-white"
                            >
                                <option value="Yes">{t('yes')}</option>
                                <option value="No">{t('no')}</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ms-4">{t('categoryLabel')}</label>
                            <select name="category" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-black transition-all appearance-none cursor-pointer shadow-inner text-slate-950 dark:text-white">
                                <option>{t('cat1')}</option>
                                <option>{t('cat2')}</option>
                                <option>{t('cat3')}</option>
                                <option>{t('cat4')}</option>
                                <option>{t('cat5')}</option>
                                <option>{t('cat6')}</option>
                            </select>
                        </div>
                    </div>

                    {isFromOutside && (
                        <div className="space-y-2 mb-8 relative z-10 animate-fade-down">
                            <label className="text-[10px] font-black uppercase tracking-widest text-red-600 ms-4">{t('fromOutsideLabel')}</label>
                            <input name="how_did_you_hear" required type="text" className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 focus:border-red-600 outline-none font-bold transition-all shadow-inner text-slate-950 dark:text-white" />
                        </div>
                    )}

                    <div className="space-y-2 mb-10 relative z-10">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ms-4">{t('msgLabel')}</label>
                        <textarea name="message" required rows={4} className="w-full p-5 rounded-[2rem] bg-slate-100 dark:bg-black/40 border-2 border-transparent focus:border-red-600 outline-none font-bold transition-all shadow-inner resize-none text-slate-950 dark:text-white"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:scale-[1.01] hover:bg-red-700 active:scale-95 transition-all relative z-10 overflow-hidden">
                        {t('submitBtn')}
                    </button>
                </form>
            )}

            <div className="mt-20 text-center opacity-30 hover:opacity-100 transition-opacity duration-700">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2">EFIPS Library • Knowledge Management • 2026</p>
                <p className="font-black text-slate-950 dark:text-white">Librarian: Islam Soliman</p>
            </div>
        </div>
    );
};

export default FeedbackPage;
