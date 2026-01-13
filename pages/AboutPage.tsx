import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        title: "حول مكتبة مدرسة صقر الإمارات",
        aboutSchoolTitle: "عن مدرسة صقر الإمارات الدولية",
        p1: "افتتحت مدرسة صقر الامارات الدولية أبوابها في مدينة العين عام 2007، وهي مدرسة مختلطة تعتمد المنهاج الأمريكي في تدريس كافة المراحل الأكاديمية، حيث تستقبل الطلاب من عمر 4 الى 18 عام، وتضم في الوقت الحالي أكثر من 1,000 طالب معظمهم مواطنين إماراتيين، كما تضم أيضاً طلاب من سوريا والأردن ومصر.",
        p2: "تتألف الهيئة التدريسية في مدرسة صقر الامارات الدولية من 71 معلم بدوام كامل و 3 معلمين مساعدين، مما يضمن حصول كل طالب على الرعاية والاهتمام اللازمين، كما تشتمل المدرسة على مرافق حديثة تدعم جميع الأنشطة المنهجية واللامنهجية، مما جعلها تحصل على تقييم “جيد” من قبل دائرة التعليم والمعرفة في ابوظبي.",
        servicesTitle: "خدمات المكتبة الذكية",
        service1: "إعارة الكتب والمراجع الورقية",
        service2: "مساحات هادئة للمطالعة والبحث",
        service3: "ورش عمل وفعاليات قرائية رقمية",
        service4: "مساعدة بحثية عبر المساعد الذكي صقر",
        service5: "الوصول إلى قواعد البيانات والمصادر الرقمية",
        hoursTitle: "ساعات العمل",
        hours: "من الاثنين إلى الجمعة، من 8:30 صباحًا حتى 2:00 ظهرًا (الجمعة حتى 11:30 صباحًا)",
        contactTitle: "تواصل مع أمين المكتبة",
        contactEmail: "islam.ahmed@falcon-school.com",
        schoolWebsite: "زيارة الموقع الرسمي للمدرسة",
    },
    en: {
        title: "About Saqr Library",
        aboutSchoolTitle: "About Emirates Falcon International School",
        p1: "Emirates Falcon International School opened its doors in Al Ain in 2007. It is a co-educational school that follows the American curriculum for all academic stages, welcoming students from 4 to 18 years old. It currently has over 1,000 students, primarily Emirati citizens.",
        p2: "The teaching staff consists of 71 full-time teachers and 3 teaching assistants, with a teacher-to-student ratio of 1:12. The school includes modern facilities and has been rated 'Good' by ADEK in Abu Dhabi.",
        servicesTitle: "Library Services",
        service1: "Book and Reference Lending",
        service2: "Quiet Spaces for Study",
        service3: "Digital Reading Workshops",
        service4: "Research Assistance via Saqr AI",
        service5: "Access to Digital Resources",
        hoursTitle: "Operating Hours",
        hours: "Monday to Friday, 8:30 AM - 2:00 PM (Fridays until 11:30 AM)",
        contactTitle: "Contact Librarian",
        contactEmail: "islam.ahmed@falcon-school.com",
        schoolWebsite: "Visit Official School Website",
    }
}

const BackgroundPattern = () => (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(0, 115, 47, 0.15), transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(239, 68, 68, 0.1), transparent 40%)
        `,
    }}></div>
);

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const SCHOOL_LOGO = "/school-logo.png"; 
    
    return (
        <div dir={dir} className="relative max-w-6xl mx-auto pb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BackgroundPattern />

            {/* 1. بطاقة العنوان الكبرى - بتأثير الشعار المائل */}
            <div className="relative z-10 glass-panel p-10 md:p-16 rounded-[3.5rem] shadow-2xl mb-12 flex flex-col items-center text-center overflow-hidden border-white/30 dark:border-white/10">
                <div className="relative mb-8">
                    <img 
                        src={SCHOOL_LOGO} 
                        alt="Logo" 
                        className="h-32 md:h-40 w-auto object-contain drop-shadow-2xl logo-smart-hover cursor-pointer" 
                    />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white mb-6 tracking-tight">
                    {t('title')}
                </h1>
                <div className="h-2 w-24 bg-green-700 rounded-full shadow-[0_0_15px_rgba(0,115,47,0.4)]"></div>
            </div>

            {/* 2. شبكة المحتوى المنسقة */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* الجانب الرئيسي: معلومات المدرسة والخدمات */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* قسم عن المدرسة مع زر الموقع المونوكروم */}
                    <section className="glass-panel p-8 md:p-10 rounded-[3rem] border-white/20">
                        <h2 className="text-3xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-4">
                            <span className="w-2.5 h-10 bg-green-700 rounded-full"></span>
                            {t('aboutSchoolTitle')}
                        </h2>
                        <div className="space-y-6 text-xl leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                            <p>{t('p1')}</p>
                            <p>{t('p2')}</p>
                        </div>

                        {/* زر الموقع الرسمي - مونوكروم ذكي */}
                        <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/10 flex justify-center lg:justify-start">
                            <a 
                                href="https://www.falcon-school.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="glass-button-black inline-flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:gap-6 group active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 4.03 3 9s-1.343 9-3 9m0-18c-1.657 0-3 4.03-3 9s1.343 9-3 9" />
                                </svg>
                                <span>{t('schoolWebsite')}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-[-45deg] rtl:rotate-[135deg] opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    </section>

                    {/* قسم الخدمات بكروت زجاجية صغيرة */}
                    <section className="glass-panel p-8 md:p-10 rounded-[3rem]">
                        <h2 className="text-3xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-4">
                            <span className="w-2.5 h-10 bg-green-700 rounded-full"></span>
                            {t('servicesTitle')}
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <li key={i} className="flex items-center gap-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all">
                                    <span className="flex-shrink-0 w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-green-700/20">✓</span>
                                    <span className="text-gray-900 dark:text-gray-100 font-black text-base">{(t as any)(`service${i}`)}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* الجانب الجانبي: البطاقات الملونة */}
                <div className="space-y-8">
                    <section className="bg-green-700 text-white p-10 rounded-[3rem] shadow-2xl shadow-green-700/30 transition-all hover:scale-[1.03]">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {t('hoursTitle')}
                        </h2>
                        <p className="text-green-50 font-black text-lg leading-relaxed">
                            {t('hours')}
                        </p>
                    </section>

                    <section className="bg-gray-950 text-white p-10 rounded-[3rem] shadow-2xl transition-all hover:scale-[1.03]">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('contactTitle')}
                        </h2>
                        <a href={`mailto:${t('contactEmail')}`} className="block bg-white/10 p-5 rounded-2xl hover:bg-white/20 transition-all font-black text-base break-all text-center border border-white/10 tracking-tight">
                            {t('contactEmail')}
                        </a>
                    </section>
                    
                    {/* Powered By Section */}
                    <div className="glass-panel p-8 rounded-[3rem] text-center border-white/30">
                        <p className="text-gray-500 dark:text-gray-400 font-black text-xs uppercase mb-4 tracking-[0.2em]">Powered by</p>
                        <div className="flex items-center justify-center gap-3">
                             <img 
                                src={SCHOOL_LOGO} 
                                alt="E.F.I.P.S" 
                                className="h-10 w-10 object-contain logo-smart-hover" 
                             />
                             <span className="font-black text-2xl text-gray-950 dark:text-white tracking-tighter">E.F.I.P.S</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
