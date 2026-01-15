import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        schoolHistory: "عن مدرسة صقر الإمارات الدولية الخاصة",
        historyText: "تأسست مدرسة صقر الإمارات في عام 2007، حيث بدأنا كمدرسة صغيرة تضم عدداً قليلاً من الطلاب والمعلمين. واليوم، نفخر بنمو المدرسة لتضم أكثر من 1000 طالب وطالبة عبر أربعة مبانٍ متطورة، متمسكين بشعارنا: 'التميز ليس غاية، بل أسلوب حياة'.",
        
        librarySection: "عن مكتبة صقر الإمارات الدولية الخاصة",
        libraryIntro: "تقع قاعة المكتبة المركزية في مبنى الأولاد، وتحتوي على أكثر من 7000 كتاب في كافة فروع المعرفة، مقسمة إلى 5 أجنحة تخصصية:",
        
        wing1: "الجناح الأول: قسم البالغين",
        wing1Desc: "مقسم حسب تصنيف ديوي العشري، ويحتوي على مراجع إنجليزية متخصصة للباحثين والمعلمين والاختصاصيين.",
        wing2: "الجناح الثاني: قسم الشباب",
        wing2Desc: "مناسب للطلاب من الصف 4 إلى 12. يضم دواليب خاصة لـ (ديزني، العلوم والرياضيات، الحيوانات، الرياضة، الموسيقى، والألغاز) بالإضافة لدواليب قراءة مخصصة لكل حلقة دراسية.",
        wing3: "الجناح الثالث: قسم اللغة العربية",
        wing3Desc: "يتبع تصنيف ديوي، ويضم قسماً خاصاً لدار نشر 'كلمة'، ومساحات قراءة مقسمة لطلاب الحلقات الأولى والثانية والثالثة.",
        wing4: "الجناح الرابع: قسم الصغار",
        wing4Desc: "مخصص لطلاب مرحلة الـ KG والصفوف من الأول إلى الثالث، مع مجموعة مختارة من القصص والكتب التفاعلية.",
        wing5: "الجناح الخامس: الجناح الخاص",
        wing5Desc: "يضم رف رقم 40 (الملخصات المسموعة عبر QR Code) ودولاب رقم 41 (المحتوى الوطني وكتب الهوية الوطنية الإماراتية).",

        libServices: "خدماتنا المكتبية",
        servicesList: "جلسات قراءة جماعية وفردية • أوراق عمل • ورش عمل إبداعية • إعارة داخلية وخارجية • مسابقات ثقافية • خدمات صقر الذكي AI.",
        
        contactSection: "التواصل والعمل الرسمي",
        operatingHours: "مواعيد العمل",
        monThu: "الاثنين - الخميس (07:30 ص - 03:00 م)",
        fri: "الجمعة (07:30 ص - 11:30 ص)",
        satSun: "السبت - الأحد (مغلق)",
        contactLink: "تواصل مع أمين المكتبة",
        
        motto: "العلم نور.. والقراءة هي المفتاح لفتح آفاق المستقبل"
    },
    en: {
        schoolHistory: "About Emirates Falcon Int'l. Private School",
        historyText: "Founded in 2007, EFIPS has grown to serve over 1000 students across four advanced buildings. Driven by our motto 'Distinction is not a goal, but a way of life', we continue to strive for excellence every day.",
        
        librarySection: "About EFIPS Library",
        libraryIntro: "Located in the Boys' Building, our central library houses over 7,000 books across all fields of knowledge, organized into 5 specialized wings:",
        
        wing1: "1st Wing: Adult Section",
        wing1Desc: "Organized by Dewey Decimal Classification, featuring English resources for researchers, teachers, and specialists.",
        wing2: "2nd Wing: Youth Section",
        wing2Desc: "For Grades 4-12. Includes special cabinets for Disney, Science, Animals, Sports, Music, and Puzzles, plus grade-specific reading zones.",
        wing3: "3rd Wing: Arabic Section",
        wing3Desc: "Dewey-classified, including a special 'Kalima' publisher corner and reading areas for Cycles 1, 2, and 3.",
        wing4: "4th Wing: Children's Section",
        wing4Desc: "Dedicated to KG and Grades 1-3, featuring age-appropriate stories and interactive books.",
        wing5: "5th Wing: Special Wing",
        wing5Desc: "Home to Shelf 40 (Audio Summaries via QR) and Cabinet 41 (UAE National Identity & Heritage content).",

        libServices: "Our Library Services",
        servicesList: "Group & Individual Reading • Worksheets • Creative Workshops • Internal/External Lending • Competitions • Saqr AI Services.",

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
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 pb-32 text-start antialiased font-black">
            
            <div className="space-y-12 md:space-y-20">
                
                {/* القسم الأول: عن المدرسة */}
                <section className="glass-panel p-8 md:p-16 rounded-[3rem] md:rounded-[4.5rem] border-none shadow-[0_40px_100px_rgba(0,0,0,0.12)] flex flex-col md:flex-row items-center gap-10 bg-white/80 dark:bg-slate-900/80">
                    <div className="flex-1 space-y-6 order-2 md:order-1">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter uppercase border-s-8 border-red-600 ps-6">
                            {t('schoolHistory')}
                        </h2>
                        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                            {t('historyText')}
                        </p>
                    </div>
                    <div className="w-full md:w-1/4 flex justify-center order-1 md:order-2">
                        <img src="/school-logo.png" alt="EFIPS" className="h-40 md:h-64 object-contain logo-white-filter rotate-6 drop-shadow-2xl" />
                    </div>
                </section>

                {/* القسم الثاني: عن المكتبة */}
                <section className="glass-panel p-8 md:p-20 rounded-[4rem] border-none shadow-[0_50px_120px_rgba(0,0,0,0.1)] bg-white/90 dark:bg-slate-950/90">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter mb-6 uppercase">
                            {t('librarySection')}
                        </h2>
                        <p className="text-xl md:text-3xl text-red-600 font-black opacity-80">{t('libraryIntro')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* الأجنحة */}
                        {[
                            { title: t('wing1'), desc: t('wing1Desc'), color: "border-slate-200" },
                            { title: t('wing2'), desc: t('wing2Desc'), color: "border-slate-200" },
                            { title: t('wing3'), desc: t('wing3Desc'), color: "border-slate-200" },
                            { title: t('wing4'), desc: t('wing4Desc'), color: "border-slate-200" }
                        ].map((w, i) => (
                            <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-300 transition-all shadow-sm">
                                <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-950 dark:text-white uppercase">{w.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{w.desc}</p>
                            </div>
                        ))}

                        {/* الجناح الخامس المتميز */}
                        <div className="md:col-span-2 p-10 rounded-[3.5rem] bg-slate-950 text-white shadow-[0_0_50px_rgba(220,38,38,0.25)] border border-red-600/30 relative overflow-hidden animate-pulse-slow">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/20 blur-[100px]"></div>
                            <h3 className="text-2xl md:text-4xl font-black mb-6 text-red-500 uppercase flex items-center gap-4">
                                <span className="text-4xl">⭐</span> {t('wing5')}
                            </h3>
                            <p className="text-xl md:text-2xl font-bold leading-relaxed">{t('wing5Desc')}</p>
                        </div>
                    </div>

                    <div className="mt-12 p-8 bg-green-600/10 rounded-[2.5rem] text-center border-2 border-dashed border-green-600/30">
                        <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mb-2 uppercase">{t('libServices')}</h3>
                        <p className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-300">{t('servicesList')}</p>
                    </div>
                </section>

                {/* القسم الثالث: التواصل والعمل */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-[3rem] bg-slate-950 text-white shadow-2xl">
                        <h2 className="text-2xl font-black mb-8 text-red-600 uppercase tracking-widest">{t('operatingHours')}</h2>
                        <div className="space-y-4 font-bold text-lg">
                            <p className="flex justify-between border-b border-white/10 pb-2"><span>{t('monThu')}</span></p>
                            <p className="flex justify-between border-b border-white/10 pb-2"><span>{t('fri')}</span></p>
                            <p className="opacity-40">{t('satSun')}</p>
                        </div>
                    </div>

                    <a 
                        href="mailto:islam.soliman@falcon-school.com"
                        className="lg:col-span-5 glass-panel p-8 md:p-12 rounded-[3rem] bg-white/80 dark:bg-slate-900/80 flex flex-col justify-center items-center text-center group hover:shadow-[0_30px_80px_rgba(220,38,38,0.2)] transition-all active:scale-95"
                    >
                        <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-6 text-red-600 group-hover:scale-110 transition-transform">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <h2 className="text-2xl font-black mb-4 uppercase">{t('contactLink')}</h2>
                        <p className="text-red-600 font-black text-sm tracking-widest break-all group-hover:underline">islam.soliman@falcon-school.com</p>
                    </a>
                </section>
            </div>

            {/* كلمة الختام */}
            <div className="mt-32 text-center opacity-40 hover:opacity-100 transition-opacity duration-1000">
                <p className="text-2xl md:text-5xl font-black text-slate-400 dark:text-slate-600 tracking-tighter italic">
                    "{t('motto')}"
                </p>
                <div className="h-1 w-32 bg-red-600 mx-auto mt-8 rounded-full shadow-lg"></div>
            </div>
        </div>
    );
};

export default AboutPage;
