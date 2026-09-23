import React, { useState } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        schoolHistory: "عن مدرسة صقر الإمارات الدولية الخاصة",
        historyText: "تأسست مدرسة صقر الإمارات في عام 2007، حيث بدأنا كمدرسة صغيرة تضم عدداً قليلاً من الطلاب والمعلمين. واليوم، نفخر بنمو المدرسة لتضم أكثر من 1300 طالب وطالبة عبر أربعة مبانٍ متطورة، متمسكين بشعارنا: 'التميز ليس غاية، بل أسلوب حياة'.",
        visitWebsite: "الموقع الرسمي للمدرسة",
        librarySection: "عن مكتبة صقر الإمارات",
        libraryIntro: "تقع قاعة المكتبة المركزية في مبنى الأولاد، وتحتوي على أكثر من 15000 كتاب في كافة فروع المعرفة، مقسمة إلى 5 أجنحة تخصصية:",
        wing1: "الجناح الأول: قسم البالغين",
        wing1Desc: "مقسم حسب تصنيف ديوي العشري، ويحتوي على مراجع إنجليزية متخصصة للباحثين والمعلمين والاختصاصيين.",
        wing2: "الجناح الثاني: قسم الشباب",
        wing2Desc: "مناسب للطلاب من الصف 4 إلى 12. يضم دواليب خاصة لـ (ديزني، العلوم، الرياضيات، الرياضة، والموسيقى).",
        wing3: "الجناح الثالث: قسم اللغة العربية",
        wing3Desc: "يتبع تصنيف ديوي، ويضم قسماً خاصاً لدار نشر 'كلمة'، ومساحات قراءة مقسمة لطلاب الحلقات الثلاث.",
        wing4: "الجناح الرابع: قسم الصغار",
        wing4Desc: "مخصص لطلاب الـ KG والصفوف (1-3)، مع مجموعة مختارة من القصص والكتب التفاعلية.",
        wing5: "الجناح الخامس: الجناح الخاص (الهوية الوطنية)",
        wing5Desc: "يضم دولاب (40) للملخصات المسموعة عبر QR، ودولاب (41) المخصص للمحتوى الوطني وكتب الهوية الوطنية الإماراتية.",
        libServices: "خدماتنا المكتبية",
        servicesList: "جلسات قراءة • أوراق عمل • ورش عمل إبداعية • إعارة • مسابقات ثقافية • خدمات صقر الذكي AI",
        contactSection: "التواصل والعمل الرسمي",
        operatingHours: "مواعيد العمل",
        monThu: "الاثنين - الخميس (07:30 ص - 02:00 م)",
        fri: "الجمعة (07:30 ص - 10:30 ص)",
        satSun: "السبت - الأحد (مغلق)",
        contactLink: "تواصل مع أمين المكتبة",
        motto: "العلم نور.. والقراءة هي المفتاح لفتح آفاق المستقبل"
    },
    en: {
        schoolHistory: "About Emirates Falcon Int'l. School",
        historyText: "Founded in 2007, EFIPS has grown to serve over 1300 students across four advanced buildings. Driven by our motto 'Distinction is not a goal, but a way of life', we strive for excellence every day.",
        visitWebsite: "Official School Website",
        librarySection: "About EFIPS Library",
        libraryIntro: "Located in the Boys' Building, our central library houses over 15,000 books across all fields of knowledge, organized into 5 specialized wings:",
        wing1: "1st Wing: Adult Section",
        wing1Desc: "Organized by Dewey Decimal Classification, featuring English resources for researchers, teachers, and specialists.",
        wing2: "2nd Wing: Youth Section",
        wing2Desc: "For Grades 4-12. Includes special cabinets for Disney, Science, Math, Sports, and Music.",
        wing3: "3rd Wing: Arabic Section",
        wing3Desc: "Dewey-classified, including a special 'Kalima' publisher corner and reading areas for all cycles.",
        wing4: "4th Wing: Children's Section",
        wing4Desc: "Dedicated to KG and Grades 1-3, featuring age-appropriate stories and interactive books.",
        wing5: "5th Wing: UAE National Identity",
        wing5Desc: "Home to Shelf 40 (Audio Summaries via QR) and Shelf 41 (UAE National Identity & Heritage content).",
        libServices: "Our Library Services",
        servicesList: "Reading Sessions • Worksheets • Creative Workshops • Lending • Competitions • Saqr AI Services",
        contactSection: "Contact & Working Hours",
        operatingHours: "Operating Hours",
        monThu: "Mon - Thu (07:30 AM - 02:00 PM)",
        fri: "Friday (07:30 AM - 10:30 AM)",
        satSun: "Sat - Sun (Closed)",
        contactLink: "Contact the Librarian",
        motto: "Knowledge is Light.. and Reading is the Key to the Future"
    }
};

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const BuildingIcon = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const Wing1Icon = () => (
  <svg className="w-10 h-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l9 4.9V17L12 22l-9-4.9V6.9z" />
    <path d="M12 22V12" />
    <path d="M12 12l9-4.9" />
    <path d="M12 12L3 7.1" />
  </svg>
);

const Wing2Icon = () => (
  <svg className="w-10 h-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 2H5a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L13.5 2z" />
    <path d="M13 2v7h7" />
    <circle cx="12" cy="13" r="3" />
    <path d="M12 16v3" />
  </svg>
);

const Wing3Icon = () => (
  <svg className="w-10 h-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const Wing4Icon = () => (
  <svg className="w-10 h-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-16 px-4">
            
            {/* 🌟 تصميم طفولي للخلفية */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-sky-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-24 animate-fade-in-up pb-20 relative z-10">
                
                {/* --- 1. قسم عن المدرسة --- */}
                <section className="bg-white dark:bg-slate-800 p-8 md:p-16 lg:p-20 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-10 md:gap-20 relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700 transition-colors duration-500">
                    
                    <div className="absolute top-0 start-0 w-4 h-full bg-amber-400 rounded-s-[2.5rem]"></div>
                    
                    <div className="flex-1 space-y-6 md:space-y-8 relative z-10 text-center md:text-start ps-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-black text-xs md:text-sm uppercase tracking-widest border-2 border-amber-200 dark:border-amber-800">
                            <BuildingIcon />
                            EFIPS
                        </div>
                        <h2 className={`text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight ${!isAr && 'tracking-tight'}`}>
                            {t('schoolHistory')}
                        </h2>
                        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                            {t('historyText')}
                        </p>
                        <div className="pt-6 flex justify-center md:justify-start">
                            <a 
                                href="https://www.falcon-school.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 bg-amber-400 text-slate-900 px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-lg md:text-xl border-b-8 border-amber-600 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md group"
                            >
                                <span>{t('visitWebsite')}</span>
                                <svg className="w-6 h-6 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </a>
                        </div>
                    </div>
                    
                    <div className="w-56 h-56 md:w-80 md:h-80 shrink-0 relative flex justify-center items-center">
                        <img 
                            src="/school-logo.png" 
                            alt="EFIPS Logo" 
                            className="w-full h-full object-contain relative z-10 animate-float drop-shadow-xl dark:invert group-hover:scale-105 transition-transform duration-500" 
                        />
                    </div>
                </section>

                {/* --- 2. قسم عن المكتبة والأجنحة --- */}
                <section className="relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="inline-block px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-black text-xs uppercase tracking-widest mb-6 border-2 border-sky-200 dark:border-sky-800">
                            Library Overview
                        </span>
                        <h3 className={`text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 ${!isAr && 'tracking-tight'}`}>
                            {t('librarySection')}
                        </h3>
                        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-bold max-w-4xl mx-auto leading-relaxed px-4">
                            {t('libraryIntro')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                        {[
                            { title: t('wing1'), desc: t('wing1Desc'), color: "bg-slate-700", border: "border-slate-900", icon: <Wing1Icon /> },
                            { title: t('wing2'), desc: t('wing2Desc'), color: "bg-emerald-500", border: "border-emerald-700", icon: <Wing2Icon /> },
                            { title: t('wing3'), desc: t('wing3Desc'), color: "bg-rose-500", border: "border-rose-700", icon: <Wing3Icon /> },
                            { title: t('wing4'), desc: t('wing4Desc'), color: "bg-blue-500", border: "border-blue-700", icon: <Wing4Icon /> }
                        ].map((w, i) => (
                            <div key={i} className={`${w.color} ${w.border} text-white p-8 md:p-12 rounded-[3rem] border-b-8 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center md:items-start text-center md:text-start shadow-md`}>
                                <div className="text-white/90 drop-shadow-sm">{w.icon}</div>
                                <h4 className="text-2xl md:text-3xl font-black mb-4">{w.title}</h4>
                                <p className="text-base md:text-lg font-bold opacity-90 leading-relaxed">{w.desc}</p>
                            </div>
                        ))}

                        {/* الجناح الخامس - تصميم خاص للهوية الوطنية */}
                        <div className="md:col-span-2 relative mt-2">
                            <div className="p-10 md:p-16 rounded-[3rem] bg-slate-900 text-white border-b-8 border-slate-950 flex flex-col md:flex-row items-center gap-10 shadow-md hover:-translate-y-2 transition-transform overflow-hidden relative">
                                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-red-600/40 rounded-full blur-[80px]"></div>
                                <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-green-600/40 rounded-full blur-[80px]"></div>
                                
                                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shrink-0 border-4 border-slate-700">
                                   <svg viewBox="0 0 640 480" className="w-16 h-16 md:w-24 md:h-24 rounded shadow-sm overflow-hidden" preserveAspectRatio="none">
                                     <path fill="#00732f" d="M0 0h640v160H0z"/>
                                     <path fill="#fff" d="M0 160h640v160H0z"/>
                                     <path fill="#000" d="M0 320h640v160H0z"/>
                                     <path fill="#ff0000" d="M0 0h220v480H0z"/>
                                   </svg>
                                </div>
                                
                                <div className="relative z-10 flex-1 text-center md:text-start">
                                    <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-white/90 text-xs font-black uppercase tracking-widest mb-4 border border-white/20">
                                        National Identity Wing
                                    </div>
                                    <h4 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                                        {t('wing5')}
                                    </h4>
                                    <p className="text-lg md:text-xl text-slate-300 font-bold leading-relaxed max-w-3xl">
                                        {t('wing5Desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 3. خدمات المكتبة --- */}
                <section className="relative z-10">
                    <div className="bg-white dark:bg-slate-800 p-10 md:p-16 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 shadow-sm text-center relative">
                        <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-10">
                            {t('libServices')}
                        </h3>
                        
                        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
                            {t('servicesList').split(' • ').map((service, index) => (
                                <div key={index} className="px-6 py-3 md:px-8 md:py-4 bg-sky-100 dark:bg-slate-900 text-sky-700 dark:text-sky-400 rounded-full text-sm md:text-lg font-black border-2 border-sky-200 dark:border-slate-700 hover:bg-sky-500 hover:text-white hover:border-sky-600 cursor-default transition-colors">
                                    {service}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 4. التواصل ومواعيد العمل --- */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
                    
                    {/* مواعيد العمل */}
                    <div className="lg:col-span-7">
                        <div className="h-full bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center border-2 border-emerald-200 dark:border-emerald-800">
                                   <ClockIcon />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{t('operatingHours')}</h3>
                            </div>

                            <div className="space-y-4 font-black text-sm md:text-lg text-slate-600 dark:text-slate-400">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 p-4 md:p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-2 border-slate-100 dark:border-slate-700">
                                    <span>{t('monThu').split(' (')[0]}</span>
                                    <span className="text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-600">{t('monThu').split(' (')[1]?.replace(')', '')}</span>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 p-4 md:p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-2 border-slate-100 dark:border-slate-700">
                                    <span>{t('fri').split(' (')[0]}</span>
                                    <span className="text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-600">{t('fri').split(' (')[1]?.replace(')', '')}</span>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 p-4 md:p-5 bg-rose-50 dark:bg-rose-900/10 rounded-[2rem] border-2 border-rose-200 dark:border-rose-900/30">
                                    <span className="text-rose-600 dark:text-rose-400">{t('satSun').split(' (')[0]}</span>
                                    <span className="text-rose-700 dark:text-rose-300 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border-2 border-rose-200 dark:border-rose-900/50">{t('satSun').split(' (')[1]?.replace(')', '')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* التواصل */}
                    <div className="lg:col-span-5 h-full">
                        <a 
                            href="mailto:islam.ahmed@falcon-school.com"
                            className="block h-full bg-rose-500 border-b-8 border-rose-700 p-8 md:p-12 rounded-[3rem] text-center group hover:-translate-y-2 active:border-b-0 active:translate-y-2 transition-all shadow-sm"
                        >
                            <div className="h-full flex flex-col justify-center items-center">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-white/30">
                                    <MailIcon />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black mb-4 text-white">{t('contactLink')}</h3>
                                <p className="text-white font-bold text-sm md:text-lg break-all bg-black/10 px-5 py-3 rounded-[1.5rem] border-2 border-white/20">islam.ahmed@falcon-school.com</p>
                            </div>
                        </a>
                    </div>
                </section>

                {/* --- الخاتمة --- */}
                <div className="mt-12 md:mt-20 text-center relative z-10">
                    <p className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-400 dark:text-slate-500 leading-relaxed italic px-4">
                        "{t('motto')}"
                    </p>
                    <div className="flex justify-center gap-3 mt-10">
                        <div className="h-2 w-12 bg-amber-400 rounded-full"></div>
                        <div className="h-2 w-3 bg-sky-400 rounded-full"></div>
                        <div className="h-2 w-3 bg-rose-400 rounded-full"></div>
                    </div>
                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
                
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default AboutPage;
