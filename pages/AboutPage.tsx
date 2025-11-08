import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        title: "حول مكتبة مدرسة صقر الإمارات الدولية",
        aboutSchoolTitle: "عن مدرسة صقر الإمارات الدولية",
        p1: "افتتحت مدرسة صقر الامارات الدولية أبوابها في مدينة العين عام 2007، وهي مدرسة مختلطة تعتمد المنهاج الأمريكي في تدريس كافة المراحل الأكاديمية، حيث تستقبل الطلاب من عمر 4 الى 18 عام، وتضم في الوقت الحالي أكثر من 1,000 طالب معظمهم مواطنين إماراتيين، كما تضم أيضاً طلاب من سوريا والأردن ومصر.",
        p2: "تتألف الهيئة التدريسية في مدرسة صقر الامارات الدولية من 71 معلم بدوام كامل و 3 معلمين مساعدين، حيث تبلغ نسبة المعلمين الى الطلبة في المدرسة 1: 12، مما يضمن حصول كل طالب على الرعاية والاهتمام اللازمين، كما تشتمل المدرسة على مرافق حديثة تدعم جميع الأنشطة المنهجية واللامنهجية، مما جعلها تحصل على تقييم “جيد” من قبل دائرة التعليم والمعرفة في ابوظبي وفقاً لآخر تقرير أصدرته الدائرة.",
        servicesTitle: "خدمات المكتبة",
        service1: "إعارة الكتب والمراجع",
        service2: "مساحات هادئة للدراسة والمطالعة",
        service3: "ورش عمل وفعاليات قرائية",
        service4: "مساعدة بحثية من أمناء المكتبة",
        service5: "الوصول إلى قواعد البيانات والمصادر الرقمية",
        hoursTitle: "ساعات العمل",
        hours: "من الاثنين إلى الجمعة، من 8:30 صباحًا حتى 2:00 ظهرًا (الجمعة حتى 11:30 صباحًا)",
        contactTitle: "تواصل معنا",
        contactEmail: "البريد الإلكتروني: islam.ahmed@falcon_school.com",
    },
    en: {
        title: "About the Emirates Falcon International School Library",
        aboutSchoolTitle: "About Emirates Falcon International School",
        p1: "Emirates Falcon International School opened its doors in Al Ain in 2007. It is a co-educational school that follows the American curriculum for all academic stages, welcoming students from 4 to 18 years old. It currently has over 1,000 students, most of whom are Emirati citizens, along with students from Syria, Jordan, and Egypt.",
        p2: "The teaching staff at Emirates Falcon International School consists of 71 full-time teachers and 3 teaching assistants, with a teacher-to-student ratio of 1:12, ensuring each student receives the necessary care and attention. The school also includes modern facilities that support all curricular and co-curricular activities, which led to it receiving a 'Good' rating from the Abu Dhabi Department of Education and Knowledge (ADEK) in its latest report.",
        servicesTitle: "Library Services",
        service1: "Book and Reference Lending",
        service2: "Quiet Spaces for Study and Reading",
        service3: "Workshops and Reading Events",
        service4: "Research Assistance from Librarians",
        service5: "Access to Databases and Digital Resources",
        hoursTitle: "Operating Hours",
        hours: "Monday to Friday, 8:30 AM - 2:00 PM (Fridays until 11:30 AM)",
        contactTitle: "Contact Us",
        contactEmail: "Email: islam.ahmed@falcon_school.com",
    }
}

const AboutPage: React.FC = () => {
    const { locale } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-2xl shadow-md max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-start">
                <img src="https://media.licdn.com/dms/image/v2/D4D0BAQH2J4sVBWyU9Q/company-logo_200_200/B4DZferhU8GgAI-/0/1751787640644/emirates_falcon_international_private_school_efips_logo?e=2147483647&v=beta&t=z8d76C6g0mI5SLMwFQS7TJ65jX8mN02QtIrFdJbxk8I" alt="School Logo" className="h-20 w-20 object-contain flex-shrink-0" />
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{t('title')}</h1>
                </div>
            </div>

            <div className="prose max-w-none text-gray-700 dark:text-gray-300 dark:prose-headings:text-gray-100 dark:prose-strong:text-gray-100 space-y-4">
                <h2 className="font-bold text-xl pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">{t('aboutSchoolTitle')}</h2>
                <p>{t('p1')}</p>
                <p>{t('p2')}</p>

                <h2 className="font-bold text-xl pt-4 border-t border-gray-200 dark:border-gray-700 mt-8">{t('servicesTitle')}</h2>
                <ul className="list-disc ps-6">
                    <li>{t('service1')}</li>
                    <li>{t('service2')}</li>
                    <li>{t('service3')}</li>
                    <li>{t('service4')}</li>
                    <li>{t('service5')}</li>
                </ul>

                <h2 className="font-bold text-xl pt-4 border-t border-gray-200 dark:border-gray-700 mt-8">{t('hoursTitle')}</h2>
                <p>{t('hours')}</p>

                <h2 className="font-bold text-xl pt-4 border-t border-gray-200 dark:border-gray-700 mt-8">{t('contactTitle')}</h2>
                <p>{t('contactEmail')}</p>
            </div>
        </div>
    );
};

export default AboutPage;
