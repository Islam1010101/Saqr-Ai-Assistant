import React from 'react';
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
        monThu: "الاثنين - الخميس (07:30 ص - 03:00 م)",
        fri: "الجمعة (07:30 ص - 11:30 ص)",
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
        monThu: "Mon - Thu (07:30 AM - 03:00 PM)",
        fri: "Friday (07:30 AM - 11:30 AM)",
        satSun: "Sat - Sun (Closed)",
        contactLink: "Contact the Librarian",
        motto: "Knowledge is Light.. and Reading is the Key to the Future"
    }
};

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-20 px-4 md:px-6">
            
            {/* 🌟 الخلفية الديناميكية بألوان الهوية الوطنية (أحمر وأخضر) 🌟 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/30 rounded-full blur-[120px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-green-600/30 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-24 animate-fade-in-up pb-20">
                
                {/* --- 1. قسم عن المدرسة --- */}
                <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-16 lg:p-20 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden group">
                    {/* خط جانبي باللون الأحمر الإماراتي */}
                    <div className="absolute top-0 start-0 w-1.5 md:w-2 h-full bg-red-600"></div>
                    
                    <div className="flex-1 space-y-6 md:space-y-8 relative z-10 text-center md:text-start">
                        <span className="inline-block px-5 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 font-bold text-xs md:text-sm uppercase tracking-widest mb-2 border border-red-100 dark:border-red-500/20">EFIPS</span>
                        <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight ${!isAr && 'tracking-tight'}`}>
                            {t('schoolHistory')}
                        </h2>
                        <p className="text-base md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {t('historyText')}
                        </p>
                        <div className="pt-4 flex justify-center md:justify-start">
                            <a 
                                href="https://www.falcon-school.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors shadow-lg hover:shadow-red-600/30"
                            >
                                <span>{t('visitWebsite')}</span>
                                <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="w-48 h-48 md:w-72 md:h-72 shrink-0 relative flex justify-center items-center">
                        <div className="absolute inset-0 bg-red-600/5 dark:bg-white/5 rounded-full animate-pulse blur-2xl"></div>
                        <img src="/school-logo.png" alt="EFIPS" className="w-full h-full object-contain relative z-10 animate-float drop-shadow-xl dark:invert" />
                    </div>
                </section>

                {/* --- 2. قسم عن المكتبة والأجنحة --- */}
                <section className="relative">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-sm md:text-lg font-bold text-red-600 dark:text-red-500 tracking-widest uppercase mb-4">Discover</h2>
                        <h3 className={`text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 ${!isAr && 'tracking-tight'}`}>
                            {t('librarySection')}
                        </h3>
                        <p className="text-base md:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-4xl mx-auto leading-relaxed px-4">
                            {t('libraryIntro')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {[
                            { title: t('wing1'), desc: t('wing1Desc'), color: "text-slate-800 dark:text-slate-200", icon: "🏛️" },
                            { title: t('wing2'), desc: t('wing2Desc'), color: "text-green-600 dark:text-green-400", icon: "🚀" },
                            { title: t('wing3'), desc: t('wing3Desc'), color: "text-red-600 dark:text-red-400", icon: "📖" },
                            { title: t('wing4'), desc: t('wing4Desc'), color: "text-blue-600 dark:text-blue-400", icon: "🧸" }
                        ].map((w, i) => (
                            <div key={i} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group text-start">
                                <div className="text-5xl md:text-6xl mb-6 transform group-hover:scale-110 transition-transform origin-left">{w.icon}</div>
                                <h4 className={`text-xl md:text-3xl font-black mb-3 ${w.color}`}>{w.title}</h4>
                                <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{w.desc}</p>
                            </div>
                        ))}

                        {/* الجناح الخامس - تصميم خاص للهوية الوطنية */}
                        <div className="md:col-span-2 p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black text-white shadow-2xl relative overflow-hidden group text-center md:text-start flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-slate-700">
                            {/* إضاءات ألوان علم الإمارات (أحمر، أخضر، أبيض) */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[80px] rounded-full"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/20 blur-[80px] rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-[50px] rounded-full"></div>
                            
                            <div className="text-7xl md:text-[8rem] group-hover:scale-110 transition-transform relative z-10 shrink-0">🇦🇪</div>
                            <div className="relative z-10 flex-1">
                                <h4 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                                    {t('wing5')}
                                </h4>
                                <p className="text-base md:text-xl text-slate-300 font-medium leading-relaxed">
                                    {t('wing5Desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 3. خدمات المكتبة --- */}
                <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                    <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-10">
                        {t('libServices')}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3 md:gap-5">
                        {t('servicesList').split(' • ').map((service, index) => (
                            <span key={index} className="px-6 py-3 md:px-8 md:py-4 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-full text-sm md:text-lg font-bold border border-slate-200 dark:border-slate-700 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white hover:border-red-600 transition-all cursor-default shadow-sm hover:shadow-md">
                                {service}
                            </span>
                        ))}
                    </div>
                </section>

                {/* --- 4. التواصل ومواعيد العمل --- */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    
                    {/* مواعيد العمل */}
                    <div className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 start-0 w-2 h-full bg-green-500"></div>
                        <h3 className="text-2xl md:text-4xl font-black mb-8 text-slate-900 dark:text-white">{t('operatingHours')}</h3>
                        <div className="space-y-6 font-bold text-sm md:text-xl text-slate-600 dark:text-slate-400">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                                <span>{t('monThu').split(' (')[0]}</span>
                                <span className="text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-4 py-1 rounded-lg">{t('monThu').split(' (')[1]?.replace(')', '')}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                                <span>{t('fri').split(' (')[0]}</span>
                                <span className="text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-4 py-1 rounded-lg">{t('fri').split(' (')[1]?.replace(')', '')}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-red-500">{t('satSun').split(' (')[0]}</span>
                                <span className="text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-1 rounded-lg">{t('satSun').split(' (')[1]?.replace(')', '')}</span>
                            </div>
                        </div>
                    </div>

                    {/* التواصل */}
                    <a 
                        href="mailto:islam.ahmed@falcon-school.com"
                        className="lg:col-span-5 bg-red-600 dark:bg-red-700 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] flex flex-col justify-center items-center text-center group transition-all shadow-xl hover:shadow-red-600/40 hover:-translate-y-2 text-white"
                    >
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <h3 className="text-xl md:text-3xl font-black mb-3">{t('contactLink')}</h3>
                        <p className="text-white/80 font-bold text-sm md:text-lg break-all">islam.ahmed@falcon-school.com</p>
                    </a>

                </section>

                {/* --- الخاتمة --- */}
                <div className="mt-12 md:mt-24 text-center">
                    <p className="text-xl md:text-4xl lg:text-5xl font-black text-slate-400 dark:text-slate-600 leading-relaxed italic px-4">
                        "{t('motto')}"
                    </p>
                    <div className="h-1 md:h-1.5 w-32 md:w-64 bg-slate-300 dark:bg-slate-700 mx-auto mt-8 md:mt-12 rounded-full"></div>
                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AboutPage;
