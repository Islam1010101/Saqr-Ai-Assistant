import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        schoolHistory: "عن مدرسة صقر الإمارات",
        historyText: "تأسست مدرسة صقر الإمارات في عام 2007، حيث بدأنا كمدرسة صغيرة تضم عدداً قليلاً من الطلاب والمعلمين. ورغم صغر حجمنا آنذاك، إلا أننا كنا دائماً نفكر في المستقبل ونطمح للأفضل. نمت المدرسة لتضم أكثر من 1000 طالب وطالبة، وانتقلنا إلى أربعة مبانٍ تخدم جميع كوادرنا. مدرسة نفخر بها اليوم وفي المستقبل، وندعوكم لتكونوا جزءاً من هذا المجتمع الذي يسعى للتميز دائماً.",
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
        serviceAudio: "ملخصات مسموعة (حصرياً)",
        serviceAudioDesc: "بكل بساطة.. توجه إلى دولاب 40، اختر كتابك، وامسح رمز الكيو آر (QR Code) لتستمع لملخص الكتاب فوراً على جهازك.",
        motto: "التميز ليس غاية.. بل أسلوب حياة"
    },
    en: {
        schoolHistory: "About EFIPS",
        historyText: "Founded in 2007, EFIPS grew from a small school to a major institution serving over 1000 students across four buildings. We are proud of our history and our motto: 'Distinction is not a goal, but a way of life'. We invite you to be part of our thriving community as we build an even better future together.",
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
        service1Desc: "Smart search portals providing immediate access to global digital resources.",
        service2: "Research & Academic Support",
        service2Desc: "Guiding students in scientific research and project documentation skills.",
        service3: "Lending & Resource Management",
        service3Desc: "Organizing physical book lending and updating our knowledge collections.",
        serviceAudio: "Audio Summaries (Exclusive)",
        serviceAudioDesc: "Simply head to Shelf 40, pick a book, and scan the QR code to listen to the summary instantly on your device.",
        motto: "Distinction is not a goal, but a way of life"
    }
};

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 pb-32 text-start antialiased">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                
                {/* كارت تاريخ المدرسة */}
                <div className="lg:col-span-12 glass-panel p-8 md:p-16 rounded-[3rem] md:rounded-[4.5rem] border-none shadow-[0_40px_100px_rgba(0,0,0,0.12)] flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden bg-white/80 dark:bg-slate-900/80">
                    <div className="flex-1 space-y-6 order-2 md:order-1">
                        <h2 className="text-3xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter">
                            {t('schoolHistory')}
                        </h2>
                        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                            {t('historyText')}
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center md:justify-end order-1 md:order-2">
                        <img src="/school-logo.png" alt="EFIPS" className="h-48 md:h-80 object-contain logo-white-filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] rotate-6 transition-transform duration-700 hover:scale-105" />
                    </div>
                </div>

                {/* كارت مواعيد العمل */}
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

                {/* كارت تواصل مع أمين المكتبة (Hyperlink) */}
                <a 
                    href="mailto:islam.ahmed@falcon-school.com"
                    className="lg:col-span-5 glass-panel p-8 md:p-12 rounded-[3rem] border-none shadow-[0_30px_80px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center text-center transition-all duration-500 hover:shadow-[0_40px_100px_rgba(220,38,38,0.2)] active:scale-95 group bg-white/80 dark:bg-slate-900/80 cursor-pointer"
                >
                    <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-8 text-red-600 shadow-inner group-hover:scale-110 transition-transform">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter uppercase">{t('contactLink')}</h2>
                    <p className="text-red-600 font-black text-sm tracking-widest transition-all group-hover:tracking-[0.2em] break-all px-2 border-b-2 border-transparent group-hover:border-red-600">islam.ahmed@falcon-school.com</p>
                </a>

                {/* خدمات المكتبة المدرسية */}
                <div className="lg:col-span-12 glass-panel p-10 md:p-20 rounded-[4rem] border-none shadow-[0_50px_120px_rgba(0,0,0,0.1)] mt-4 bg-white/90 dark:bg-slate-950/90">
                    <h2 className="text-3xl md:text-7xl font-black text-slate-950 dark:text-white mb-16 tracking-tighter text-center uppercase">
                        {t('servicesTitle')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* الخدمة الحصرية المتوهجة (Audio Summaries) */}
                        <div className="md:col-span-2 p-10 md:p-14 rounded-[3.5rem] bg-slate-950 text-white transition-all duration-500 shadow-[0_0_50px_rgba(220,38,38,0.25)] hover:shadow-[0_0_80px_rgba(220,38,38,0.45)] relative overflow-hidden group border border-red-600/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[80px] rounded-full animate-pulse"></div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-bounce">🎧</div>
                                <div className="flex-1 text-center md:text-start">
                                    <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                                        {t('serviceAudio')}
                                    </h3>
                                    <p className="text-slate-400 font-bold text-lg md:text-2xl leading-relaxed">
                                        {t('serviceAudioDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* بقية الخدمات */}
                        {[
                            { title: t('service1'), desc: t('service1Desc'), glow: "hover:shadow-[0_0_40px_rgba(220,38,38,0.1)]", icon: "🤖" },
                            { title: t('service2'), desc: t('service2Desc'), glow: "hover:shadow-[0_0_40px_rgba(0,115,47,0.1)]", icon: "🧬" },
                            { title: t('service3'), desc: t('service3Desc'), glow: "hover:shadow-[0_0_40px_rgba(37,99,235,0.1)]", icon: "📚" }
                        ].map((s, i) => (
                            <div key={i} className={`p-10 md:p-12 rounded-[3rem] bg-slate-50 dark:bg-white/5 transition-all duration-500 shadow-sm ${s.glow} hover:translate-y-[-5px] border-none flex gap-6 items-start`}>
                                <span className="text-3xl opacity-50">{s.icon}</span>
                                <div>
                                    <h3 className="text-2xl md:text-4xl font-black text-slate-950 dark:text-white mb-6 tracking-tight">
                                        {s.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg md:text-xl leading-relaxed">
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* الخاتمة */}
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
