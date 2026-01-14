import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "عن مكتبة صقر الإمارات",
        schoolHistory: "عن مدرسة صقر الإمارات",
        historyText: "تأسست مدرسة صقر الإمارات في عام 2007، حيث بدأنا كمدرسة صغيرة تضم عدداً قليلاً من الطلاب والمعلمين. ورغم صغر حجمنا آنذاك، إلا أننا كنا دائماً نفكر في المستقبل ونطمح للأفضل. من خلال تفانينا في شعارنا 'التميز ليس غاية، بل أسلوب حياة'، نمت المدرسة لتضم أكثر من 1000 طالب وطالبة، وانتقلنا من مبنى واحد إلى أربعة مبانٍ تخدم جميع طلابنا وكوادرنا. مدرسة نفخر بها اليوم وفي المستقبل. وبنفس هذا التفاني، يسعدنا أن نكون جزءاً من المرحلة التالية لنمو المدرسة، وندعوكم لتكونوا جزءاً من هذا المجتمع الذي يسعى لجعل مدرستنا أفضل دائماً.",
        operatingHours: "مواعيد العمل الرسمية",
        monThu: "الاثنين - الخميس",
        fri: "الجمعة",
        satSun: "السبت - الأحد",
        closed: "مغلق",
        timeMonThu: "07:30 صباحاً - 03:00 مساءً",
        timeFri: "07:30 صباحاً - 11:30 صباحاً",
        contactLink: "تواصل مع أمين المكتبة",
        servicesTitle: "خدمات المكتبة المدرسية",
        service1: "البحث الرقمي والذكاء الاصطناعي",
        service1Desc: "توفير بوابات بحث ذكية تتيح الوصول الفوري للمصادر الرقمية العالمية.",
        service2: "الدعم البحثي والأكاديمي",
        service2Desc: "إرشاد الطلاب في مهارات البحث العلمي والتوثيق الأكاديمي للمشاريع.",
        service3: "إدارة الاستعارة والمصادر",
        service3Desc: "تنظيم عمليات استعارة الكتب المطبوعة وتحديث المجموعات المعرفية.",
        service4: "الفعاليات والمعارض الثقافية",
        service4Desc: "تنظيم الأنشطة المدرسية والمعارض التي تعزز الابتكار والثقافة العامة.",
        motto: "التميز ليس غاية.. بل أسلوب حياة"
    },
    en: {
        pageTitle: "About Saqr Library",
        schoolHistory: "About EFIPS",
        historyText: "EFIPS was founded in 2007, we were a small school with a handful of students and teachers. Although we were small, we as a school are always thinking big and into the future. Through dedication to our motto “Distinction is not a goal, but a way of life” we have grown the school to more than 1000 students. From one building, to four buildings serving all our students and staff. A school we are proud of, now and into the future. With this same dedication we are excited to be part of the next stage of EFIPS growth. We invite you to be a part of this community that strives to make our school even better.",
        operatingHours: "Official Operating Hours",
        monThu: "Monday - Thursday",
        fri: "Friday",
        satSun: "Saturday - Sunday",
        closed: "Closed",
        timeMonThu: "07:30 AM - 03:00 PM",
        timeFri: "07:30 AM - 11:30 AM",
        contactLink: "Contact the Librarian",
        servicesTitle: "School Library Services",
        service1: "Digital Research & AI Search",
        service1Desc: "Providing smart search portals for immediate access to global digital resources.",
        service2: "Research & Academic Support",
        service2Desc: "Guiding students in scientific research skills and project documentation.",
        service3: "Lending & Resource Management",
        service3Desc: "Organizing physical book lending and updating knowledge collections.",
        service4: "Cultural Events & Exhibitions",
        service4Desc: "Organizing school activities and exhibitions that promote innovation.",
        motto: "Distinction is not a goal, but a way of life"
    }
};

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const isAr = locale === 'ar';

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-6 py-12 animate-fade-up relative z-10 pb-32 text-start">
            
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter mb-4">
                    {t('pageTitle')}
                </h1>
                <div className="h-2 w-24 bg-red-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* كارت تاريخ المدرسة (الشعار يمين) */}
                <div className="lg:col-span-12 glass-panel p-10 md:p-16 rounded-[3.5rem] border-2 border-white/40 dark:border-white/5 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
                    <div className="flex-1 space-y-6 order-2 md:order-1">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">
                            {t('schoolHistory')}
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                            {t('historyText')}
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center md:justify-end order-1 md:order-2">
                        <img src="/school-logo.png" alt="EFIPS" className="h-48 md:h-72 object-contain logo-white-filter drop-shadow-2xl" />
                    </div>
                </div>

                {/* كارت مواعيد العمل */}
                <div className="lg:col-span-7 glass-panel p-10 rounded-[3rem] border-2 border-white/40 dark:border-white/5 bg-slate-950 text-white relative">
                    <h2 className="text-xl font-black mb-10 tracking-[0.2em] text-red-600 uppercase">
                        {t('operatingHours')}
                    </h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <span className="font-bold opacity-60 text-sm md:text-base">{t('monThu')}</span>
                            <span className="font-black text-xs md:text-lg">{t('timeMonThu')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <span className="font-bold opacity-60 text-sm md:text-base">{t('fri')}</span>
                            <span className="font-black text-xs md:text-lg">{t('timeFri')}</span>
                        </div>
                        <div className="flex justify-between items-center opacity-40">
                            <span className="font-bold text-sm md:text-base">{t('satSun')}</span>
                            <span className="font-black text-xs md:text-lg uppercase">{t('closed')}</span>
                        </div>
                    </div>
                </div>

                {/* كارت تواصل مع أمين المكتبة (Hyperlink) */}
                <a 
                    href="mailto:islam.ahmed@falcon-school.com"
                    className="lg:col-span-5 glass-panel p-10 rounded-[3rem] border-2 border-slate-200 dark:border-white/10 flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-red-600 hover:shadow-2xl active:scale-95 group"
                >
                    <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center mb-6 text-red-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white mb-3 tracking-tighter uppercase">{t('contactLink')}</h2>
                    <p className="text-red-600 font-black text-xs tracking-widest transition-all group-hover:tracking-[0.2em]">islam.ahmed@falcon-school.com</p>
                </a>

                {/* خدمات المكتبة المدرسية (أوضح وبدون أيقونات) */}
                <div className="lg:col-span-12 glass-panel p-12 md:p-16 rounded-[4rem] border-2 border-white/40 dark:border-white/5 shadow-2xl mt-4">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white mb-16 tracking-tighter text-center">
                        {t('servicesTitle')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                            { title: t('service1'), desc: t('service1Desc'), border: "hover:border-red-600" },
                            { title: t('service2'), desc: t('service2Desc'), border: "hover:border-green-600" },
                            { title: t('service3'), desc: t('service3Desc'), border: "hover:border-blue-600" },
                            { title: t('service4'), desc: t('service4Desc'), border: "hover:border-amber-600" }
                        ].map((s, i) => (
                            <div key={i} className={`p-10 rounded-[2.5rem] bg-white/50 dark:bg-black/20 border-2 border-transparent ${s.border} transition-all duration-500 shadow-sm hover:shadow-2xl`}>
                                <h3 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white mb-4 tracking-tight">
                                    {s.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 font-bold text-lg leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* الخاتمة (شعار المدرسة) */}
            <div className="mt-32 text-center opacity-40">
                <p className="text-xl md:text-3xl font-black text-slate-400 tracking-[0.6em] uppercase mb-8">
                    {t('motto')}
                </p>
                <div className="h-px w-64 bg-slate-200 dark:bg-white/10 mx-auto"></div>
            </div>
        </div>
    );
};

export default AboutPage;
