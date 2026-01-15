import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
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

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 pb-32 text-start">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                
                {/* كارت تاريخ المدرسة (الشعار يمين) - تم حذف الحدود واستخدام الظلال السحابية */}
                <div className="lg:col-span-12 glass-panel p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] border-none shadow-[0_40px_100px_rgba(0,0,0,0.12)] flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden bg-white/80 dark:bg-slate-900/80">
                    <div className="flex-1 space-y-6 order-2 md:order-1">
                        <h2 className="text-3xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter">
                            {t('schoolHistory')}
                        </h2>
                        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-bold leading-[1.6] md:leading-relaxed">
                            {t('historyText')}
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center md:justify-end order-1 md:order-2">
                        <img src="/school-logo.png" alt="EFIPS" className="h-48 md:h-80 object-contain logo-white-filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] rotate-6 transition-transform duration-700 hover:scale-105" />
                    </div>
                </div>

                {/* كارت مواعيد العمل - تصميم أسود ملكي ناعم */}
                <div className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-[3rem] border-none shadow-[0_30px_80px_rgba(0,0,0,0.15)] bg-slate-950 text-white relative overflow-hidden">
                    <h2 className="text-xl md:text-2xl font-black mb-10 tracking-[0.2em] text-red-600 uppercase">
                        {t('operatingHours')}
                    </h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-white/5 pb-5">
                            <span className="font-bold opacity-60 text-sm md:text-lg">{t('monThu')}</span>
                            <span className="font-black text-sm md:text-xl tracking-tight">{t('timeMonThu')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-5">
                            <span className="font-bold opacity-60 text-sm md:text-lg">{t('fri')}</span>
                            <span className="font-black text-sm md:text-xl tracking-tight">{t('timeFri')}</span>
                        </div>
                        <div className="flex justify-between items-center opacity-30">
                            <span className="font-bold text-sm md:text-lg">{t('satSun')}</span>
                            <span className="font-black text-sm md:text-xl uppercase">{t('closed')}</span>
                        </div>
                    </div>
                </div>

                {/* كارت تواصل مع أمين المكتبة - تفاعلي ناعم */}
                <a 
                    href="mailto:islam.ahmed@falcon-school.com"
                    className="lg:col-span-5 glass-panel p-8 md:p-12 rounded-[3rem] border-none shadow-[0_30px_80px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center text-center transition-all duration-500 hover:shadow-[0_40px_100px_rgba(220,38,38,0.15)] active:scale-95 group bg-white/80 dark:bg-slate-900/80"
                >
                    <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-8 text-red-600 shadow-inner group-hover:scale-110 transition-transform">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter uppercase">{t('contactLink')}</h2>
                    <p className="text-red-600 font-black text-sm tracking-widest transition-all group-hover:tracking-[0.2em] break-all px-2">islam.ahmed@falcon-school.com</p>
                </a>

                {/* خدمات المكتبة المدرسية - وضوح تام وبدون حواف رمادية */}
                <div className="lg:col-span-12 glass-panel p-10 md:p-20 rounded-[4rem] border-none shadow-[0_50px_120px_rgba(0,0,0,0.1)] mt-4 bg-white/90 dark:bg-slate-950/90">
                    <h2 className="text-3xl md:text-7xl font-black text-slate-950 dark:text-white mb-16 tracking-tighter text-center">
                        {t('servicesTitle')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {[
                            { title: t('service1'), desc: t('service1Desc'), glow: "hover:shadow-[0_0_40px_rgba(220,38,38,0.1)]" },
                            { title: t('service2'), desc: t('service2Desc'), glow: "hover:shadow-[0_0_40px_rgba(0,115,47,0.1)]" },
                            { title: t('service3'), desc: t('service3Desc'), glow: "hover:shadow-[0_0_40px_rgba(37,99,235,0.1)]" },
                            { title: t('service4'), desc: t('service4Desc'), glow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]" }
                        ].map((s, i) => (
                            <div key={i} className={`p-10 md:p-12 rounded-[3rem] bg-slate-50 dark:bg-white/5 transition-all duration-500 shadow-sm ${s.glow} hover:translate-y-[-5px]`}>
                                <h3 className="text-2xl md:text-4xl font-black text-slate-950 dark:text-white mb-6 tracking-tight">
                                    {s.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg md:text-xl leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* الخاتمة النخبوية */}
            <div className="mt-32 text-center opacity-30 group hover:opacity-100 transition-opacity duration-700">
                <p className="text-xl md:text-4xl font-black text-slate-400 dark:text-slate-600 tracking-[0.5em] uppercase mb-8">
                    {t('motto')}
                </p>
                <div className="h-px w-64 bg-slate-200 dark:bg-white/10 mx-auto"></div>
            </div>
        </div>
    );
};

export default AboutPage;
