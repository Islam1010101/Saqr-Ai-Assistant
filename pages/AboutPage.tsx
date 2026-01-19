import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        schoolHistory: "عن مدرسة صقر الإمارات الدولية الخاصة",
        historyText: "تأسست مدرسة صقر الإمارات في عام 2007، حيث بدأنا كمدرسة صغيرة تضم عدداً قليلاً من الطلاب والمعلمين. واليوم، نفخر بنمو المدرسة لتضم أكثر من 1300 طالب وطالبة عبر أربعة مبانٍ متطورة، متمسكين بشعارنا: 'التميز ليس غاية، بل أسلوب حياة'.",
        visitWebsite: "زيارة الموقع الرسمي للمدرسة",
        
        librarySection: "عن مكتبة صقر الإمارات الدولية الخاصة",
        libraryIntro: "تقع قاعة المكتبة المركزية في مبنى الأولاد، وتحتوي على أكثر من 15000 كتاب في كافة فروع المعرفة، مقسمة إلى 5 أجنحة تخصصية:",
        
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
        historyText: "Founded in 2007, EFIPS has grown to serve over 1300 students across four advanced buildings. Driven by our motto 'Distinction is not a goal, but a way of life', we continue to strive for excellence every day.",
        visitWebsite: "Visit Official School Website",
        
        librarySection: "About EFIPS Library",
        libraryIntro: "Located in the Boys' Building, our central library houses over 15,000 books across all fields of knowledge, organized into 5 specialized wings:",
        
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
            
            <div className="space-y-12 md:space-y-24">
                
                {/* القسم الأول: عن المدرسة (تم إضافة الرابط هنا) */}
                <section className="glass-panel p-8 md:p-16 rounded-[3rem] md:rounded-[4.5rem] border-none shadow-[0_40px_100px_rgba(0,0,0,0.12)] flex flex-col md:flex-row items-center gap-10 bg-white/80 dark:bg-slate-900/80 group hover:shadow-[0_40px_120px_rgba(220,38,38,0.1)] transition-all duration-500">
                    <div className="flex-1 space-y-6 order-2 md:order-1">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter uppercase border-s-8 border-red-600 ps-6 drop-shadow-sm">
                            {t('schoolHistory')}
                        </h2>
                        <div className="space-y-4">
                            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                                {t('historyText')}
                            </p>
                            
                            {/* الهايبر لينك الجديد لموقع المدرسة */}
                            <a 
                                href="https://www.falcon-school.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-red-600 hover:text-slate-950 dark:hover:text-white transition-colors duration-300 group/link"
                            >
                                <span className="text-sm md:text-xl font-black uppercase tracking-widest underline underline-offset-8 decoration-2 transition-all">
                                    {t('visitWebsite')}
                                </span>
                                <svg className="w-5 h-5 md:w-7 md:h-7 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="w-full md:w-1/4 flex justify-center order-1 md:order-2">
                        <img src="/school-logo.png" alt="EFIPS" className="h-40 md:h-64 object-contain logo-white-filter rotate-6 drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </section>

                {/* القسم الثاني: عن المكتبة */}
                <section className="glass-panel p-8 md:p-20 rounded-[4rem] border-none shadow-[0_50px_120px_rgba(0,0,0,0.1)] bg-white/90 dark:bg-slate-950/90 overflow-hidden relative">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-600/5 blur-[150px] animate-pulse-slow pointer-events-none"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-green-600/5 blur-[150px] animate-pulse-slow pointer-events-none [animation-delay:2s]"></div>

                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter mb-6 uppercase drop-shadow-md">
                            {t('librarySection')}
                        </h2>
                        <p className="text-xl md:text-3xl text-red-600 font-black opacity-90">{t('libraryIntro')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {[
                            { title: t('wing1'), desc: t('wing1Desc'), glow: "hover:shadow-[0_0_40px_rgba(220,38,38,0.2)] hover:border-red-600/30", icon: "🏛️" },
                            { title: t('wing2'), desc: t('wing2Desc'), glow: "hover:shadow-[0_0_40px_rgba(0,115,47,0.2)] hover:border-green-600/30", icon: "🚀" },
                            { title: t('wing3'), desc: t('wing3Desc'), glow: "hover:shadow-[0_0_40px_rgba(37,99,235,0.2)] hover:border-blue-600/30", icon: "📖" },
                            { title: t('wing4'), desc: t('wing4Desc'), glow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:border-orange-600/30", icon: "🧸" }
                        ].map((w, i) => (
                            <div key={i} className={`p-8 rounded-[2.5rem] bg-slate-50/80 dark:bg-white/5 border-2 border-transparent ${w.glow} transition-all duration-500 shadow-sm hover:-translate-y-1 group`}>
                                <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-950 dark:text-white uppercase flex items-center gap-3">
                                    <span className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity group-hover:animate-bounce">{w.icon}</span> {w.title}
                                </h3>
                                <p className="text-slate-50 dark:text-slate-400 font-bold leading-relaxed">{w.desc}</p>
                            </div>
                        ))}

                        <div className="md:col-span-2 p-10 rounded-[3.5rem] bg-slate-950 text-white shadow-[0_0_60px_rgba(220,38,38,0.3)] border-2 border-red-600/50 relative overflow-hidden animate-pulse-slow hover:shadow-[0_0_100px_rgba(220,38,38,0.6)] transition-all duration-700">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/30 blur-[120px] animate-pulse"></div>
                            <h3 className="text-2xl md:text-4xl font-black mb-6 text-red-500 uppercase flex items-center gap-4 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                                <span className="text-4xl animate-spin-slow">⭐</span> {t('wing5')}
                            </h3>
                            <p className="text-xl md:text-2xl font-bold leading-relaxed drop-shadow-sm">{t('wing5Desc')}</p>
                        </div>
                    </div>

                    <div className="mt-12 p-8 bg-green-600/10 rounded-[2.5rem] text-center border-2 border-dashed border-green-600/30 relative z-10 hover:bg-green-600/20 transition-colors">
                        <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mb-2 uppercase drop-shadow-sm">{t('libServices')}</h3>
                        <p className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-300">{t('servicesList')}</p>
                    </div>
                </section>

                {/* القسم الثالث: التواصل */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-[3rem] bg-slate-950 text-white shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all">
                        <h2 className="text-2xl font-black mb-8 text-red-600 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">{t('operatingHours')}</h2>
                        <div className="space-y-4 font-bold text-lg">
                            <p className="flex justify-between border-b border-white/10 pb-2 hover:ps-2 transition-all"><span>{t('monThu')}</span></p>
                            <p className="flex justify-between border-b border-white/10 pb-2 hover:ps-2 transition-all"><span>{t('fri')}</span></p>
                            <p className="opacity-40">{t('satSun')}</p>
                        </div>
                    </div>

                    <a 
                        href="mailto:islam.ahmed@falcon-school.com"
                        className="lg:col-span-5 glass-panel p-8 md:p-12 rounded-[3rem] bg-white/80 dark:bg-slate-900/80 flex flex-col justify-center items-center text-center group hover:shadow-[0_0_60px_rgba(220,38,38,0.3)] transition-all duration-500 active:scale-95 border-2 border-transparent hover:border-red-600/20"
                    >
                        <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-6 text-red-600 group-hover:scale-110 transition-transform group-hover:bg-red-600/20 shadow-inner">
                            <svg className="h-10 w-10 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <h2 className="text-2xl font-black mb-4 uppercase drop-shadow-sm">{t('contactLink')}</h2>
                        <p className="text-red-600 font-black text-sm tracking-widest break-all group-hover:underline group-hover:tracking-[0.1em] transition-all">islam.ahmed@falcon-school.com</p>
                    </a>
                </section>
            </div>

            <div className="mt-40 text-center opacity-30 hover:opacity-100 transition-all duration-1000 group">
                <p className="text-2xl md:text-6xl font-black text-slate-400 dark:text-slate-600 tracking-tighter italic group-hover:text-slate-950 dark:group-hover:text-white transition-colors drop-shadow-lg">
                    "{t('motto')}"
                </p>
                <div className="h-1.5 w-40 bg-red-600 mx-auto mt-8 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:w-64 transition-all duration-700"></div>
            </div>
        </div>
    );
};

export default AboutPage;
