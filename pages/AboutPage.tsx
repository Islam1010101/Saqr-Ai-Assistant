import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        title: "حول مكتبة مدرسة صقر الإمارات",
        aboutSchoolTitle: "عن مدرسة صقر الإمارات الدولية",
        p1: "افتتحت مدرسة صقر الامارات الدولية أبوابها في مدينة العين عام 2007، وهي مدرسة مختلطة تعتمد المنهاج الأمريكي في تدريس كافة المراحل الأكاديمية، حيث تستقبل الطلاب من عمر 4 الى 18 عام، وتضم في الوقت الحالي أكثر من 1,000 طالب معظمهم مواطنين إماراتيين، كما تضم أيضاً طلاب من سوريا والأردن ومصر.",
        p2: "تتألف الهيئة التدريسية في مدرسة صقر الامارات الدولية من 71 معلم بدوام كامل و 3 معلمين مساعدين، مما يضمن حصول كل طالب على الرعاية والاهتمام اللازمين، كما تشتمل المدرسة على مرافق حديثة تدعم جميع الأنشطة المنهجية واللامنهجية، مما جعلها تحصل على تقييم “جيد” من قبل دائرة التعليم والمعرفة في ابوظبي.",
        servicesTitle: "خدمات المكتبة المدرسية",
        service1: "إعارة الكتب والمراجع الورقية",
        service2: "مساحات هادئة للمطالعة والبحث",
        service3: "ورش عمل وفعاليات قرائية رقمية",
        service4: "مساعدة بحثية عبر المساعد الذكي صقر",
        service5: "الوصول إلى قواعد البيانات والمصادر الرقمية",
        hoursTitle: "ساعات العمل",
        hours: "من الاثنين إلى الجمعة، من 8:30 صباحًا حتى 2:00 ظهرًا (الجمعة حتى 11:30 صباحًا)",
        contactTitle: "تواصل مع أمين المكتبة",
        contactEmail: "islam.ahmed@falcon-school.com",
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
    }
}

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const SCHOOL_LOGO = "/school-logo.png"; // شعارك المفرغ
    
    return (
        <div dir={dir} className="max-w-5xl mx-auto pb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* بطاقة العنوان الرئيسية - إضافة إمالة الشعار الكبير */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/20 dark:border-gray-700/50 mb-10 flex flex-col items-center text-center">
                <img src={SCHOOL_LOGO} alt="Logo" className="h-32 w-32 object-contain mb-6 drop-shadow-xl rotate-6 transition-transform" />
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                    {t('title')}
                </h1>
                <div className="h-1.5 w-20 bg-green-700 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 dark:border-gray-700/30">
                        <h2 className="text-2xl font-black mb-6 text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-green-700 rounded-full"></span>
                            {t('aboutSchoolTitle')}
                        </h2>
                        <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
                            <p>{t('p1')}</p>
                            <p>{t('p2')}</p>
                        </div>
                    </section>

                    <section className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 dark:border-gray-700/30">
                        <h2 className="text-2xl font-black mb-6 text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-green-700 rounded-full"></span>
                            {t('servicesTitle')}
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <li key={i} className="flex items-center gap-3 bg-white/40 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <span className="flex-shrink-0 w-8 h-8 bg-green-700/10 text-green-700 rounded-full flex items-center justify-center font-bold">✓</span>
                                    <span className="text-gray-700 dark:text-gray-200 font-bold text-sm">{(t as any)(`service${i}`)}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-green-700 text-white p-8 rounded-[2.5rem] shadow-xl shadow-green-700/20">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {t('hoursTitle')}
                        </h2>
                        <p className="text-green-50 font-bold leading-relaxed">
                            {t('hours')}
                        </p>
                    </section>

                    <section className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('contactTitle')}
                        </h2>
                        <a href={`mailto:${t('contactEmail')}`} className="block bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all font-bold text-sm break-all text-center border border-white/10">
                            {t('contactEmail')}
                        </a>
                    </section>
                    
                    {/* التعديل: إمالة شعار E.F.I.P.S الصغير */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 dark:bg-gray-800 dark:border-gray-700 text-center">
                        <p className="text-gray-400 font-bold text-xs uppercase mb-3">Powered by</p>
                        <div className="flex items-center justify-center gap-2">
                             <img src={SCHOOL_LOGO} alt="E.F.I.P.S" className="h-8 w-8 object-contain rotate-6 transition-transform" />
                             <span className="font-black text-gray-800 dark:text-white">E.F.I.P.S</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
