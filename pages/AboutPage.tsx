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
        wing2Desc: "مناسب للطلاب من الصف 4 إلى 12. يضم دواليب خاصة لـ (ديزني، العلوم، الرياضيات، الرياضة، والموسيقى) بالإضافة لدواليب قراءة مخصصة.",
        wing3: "الجناح الثالث: قسم اللغة العربية",
        wing3Desc: "يتبع تصنيف ديوي، ويضم قسماً خاصاً لدار نشر 'كلمة'، ومساحات قراءة مقسمة لطلاب الحلقات الثلاث.",
        wing4: "الجناح الرابع: قسم الصغار",
        wing4Desc: "مخصص لطلاب مرحلة الـ KG والصفوف من الأول إلى الثالث، مع مجموعة مختارة من القصص والكتب التفاعلية.",
        wing5: "الجناح الخامس: الجناح الخاص",
        wing5Desc: "يضم دولاب رقم 40 (الملخصات المسموعة عبر QR Code) ودولاب رقم 41 (المحتوى الوطني وكتب الهوية الوطنية الإماراتية).",
        libServices: "خدماتنا المكتبية",
        servicesList: "جلسات قراءة • أوراق عمل • ورش عمل إبداعية • إعارة • مسابقات ثقافية • خدمات صقر الذكي AI.",
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
        historyText: "Founded in 2007, EFIPS has grown to serve over 1300 students across four advanced buildings. Driven by our motto 'Distinction is not a goal, but a way of life', we strive for excellence every day.",
        visitWebsite: "Visit Official School Website",
        librarySection: "About EFIPS Library",
        libraryIntro: "Located in the Boys' Building, our central library houses over 15,000 books across all fields of knowledge, organized into 5 specialized wings:",
        wing1: "1st Wing: Adult Section",
        wing1Desc: "Organized by Dewey Decimal Classification, featuring English resources for researchers, teachers, and specialists.",
        wing2: "2nd Wing: Youth Section",
        wing2Desc: "For Grades 4-12. Includes special cabinets for Disney, Science, Math, Sports, and Music, plus reading zones.",
        wing3: "3rd Wing: Arabic Section",
        wing3Desc: "Dewey-classified, including a special 'Kalima' publisher corner and reading areas for all cycles.",
        wing4: "4th Wing: Children's Section",
        wing4Desc: "Dedicated to KG and Grades 1-3, featuring age-appropriate stories and interactive books.",
        wing5: "5th Wing: Special Wing",
        wing5Desc: "Home to Shelf 40 (Audio Summaries via QR) and Shelf 41 (UAE National Identity & Heritage content).",
        libServices: "Our Library Services",
        servicesList: "Reading Sessions • Worksheets • Creative Workshops • Lending • Competitions • Saqr AI Services.",
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
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fade-up relative z-10 pb-32 text-start antialiased font-black overflow-hidden">
            
            {/* الخلفية الحيوية المحسنة للدارك مود */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 dark:bg-red-500/20 blur-[120px] animate-pulse rounded-full"></div>
                <div className="absolute bottom-40 right-10 w-[30rem] h-[30rem] bg-green-600/10 dark:bg-green-500/20 blur-[150px] animate-pulse rounded-full delay-1000"></div>
            </div>

            <div className="space-y-12 md:space-y-32">
                
                {/* القسم الأول: عن المدرسة (Glow Border) */}
                <section className="glass-panel p-6 md:p-20 rounded-[2.5rem] md:rounded-[5rem] border border-white/10 dark:border-white/5 shadow-2xl dark:shadow-red-900/20 flex flex-col md:flex-row items-center gap-8 md:gap-16 bg-white/70 dark:bg-slate-900/60 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 md:w-3 h-full bg-gradient-to-b from-red-600 to-transparent"></div>
                    
                    <div className="flex-1 space-y-6 md:space-y-10 order-2 md:order-1 relative z-10">
                        <h2 className="text-2xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-[1.1]">
                            {t('schoolHistory')}
                        </h2>
                        <div className="space-y-6">
                            <p className="text-base md:text-3xl text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                                {t('historyText')}
                            </p>
                            <a 
                                href="https://www.falcon-school.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 text-red-600 dark:text-red-500 hover:text-slate-950 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95"
                            >
                                <span className="text-sm md:text-2xl font-black uppercase underline underline-offset-8 decoration-2 md:decoration-4">
                                    {t('visitWebsite')}
                                </span>
                                <div className="w-10 h-10 md:w-16 md:h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                                    <svg className="w-5 h-5 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="w-3/4 md:w-1/3 flex justify-center order-1 md:order-2">
                        <img src="/school-logo.png" alt="EFIPS" className="h-40 md:h-96 object-contain logo-white-filter drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] animate-float" />
                    </div>
                </section>

                {/* القسم الثاني: عن المكتبة (Neon Cards) */}
                <section className="relative px-2 md:px-0">
                    <div className="text-center mb-16 md:mb-28">
                        <h2 className="text-4xl md:text-[10rem] font-black text-slate-950 dark:text-white tracking-tighter mb-4 uppercase opacity-5 absolute -top-10 md:-top-24 left-1/2 -translate-x-1/2 w-full select-none">DISCOVER</h2>
                        <h2 className="text-3xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter mb-6 relative z-10 drop-shadow-2xl">
                            {t('librarySection')}
                        </h2>
                        <p className="text-lg md:text-4xl text-green-700 dark:text-green-500 font-black relative z-10 max-w-5xl mx-auto leading-relaxed italic">{t('libraryIntro')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                        {[
                            { title: t('wing1'), desc: t('wing1Desc'), color: "border-red-600/30 dark:border-red-500/20", glow: "dark:shadow-[0_0_50px_-10px_rgba(220,38,38,0.3)]", icon: "🏛️" },
                            { title: t('wing2'), desc: t('wing2Desc'), color: "border-green-600/30 dark:border-green-500/20", glow: "dark:shadow-[0_0_50px_-10px_rgba(34,197,94,0.3)]", icon: "🚀" },
                            { title: t('wing3'), desc: t('wing3Desc'), color: "border-blue-600/30 dark:border-blue-500/20", glow: "dark:shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]", icon: "📖" },
                            { title: t('wing4'), desc: t('wing4Desc'), color: "border-orange-600/30 dark:border-orange-500/20", glow: "dark:shadow-[0_0_50px_-10px_rgba(245,158,11,0.3)]", icon: "🧸" }
                        ].map((w, i) => (
                            <div key={i} className={`p-8 md:p-14 rounded-[2rem] md:rounded-[4.5rem] bg-white/80 dark:bg-slate-900/40 border-2 ${w.color} transition-all duration-500 shadow-xl hover:-translate-y-3 group ${w.glow} backdrop-blur-md`}>
                                <div className="text-5xl md:text-7xl mb-8 transform group-hover:rotate-12 transition-transform">{w.icon}</div>
                                <h3 className="text-xl md:text-4xl font-black mb-4 text-slate-950 dark:text-white uppercase">
                                    {w.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 font-bold text-base md:text-2xl leading-relaxed">
                                    {w.desc}
                                </p>
                            </div>
                        ))}

                        {/* الجناح الخامس - Royal Neon Glow */}
                        <div className="md:col-span-2 p-10 md:p-24 rounded-[3rem] md:rounded-[6rem] bg-slate-950 text-white border-4 border-red-600 dark:shadow-[0_0_70px_rgba(220,38,38,0.4)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-transparent animate-pulse"></div>
                            <div className="relative z-10 space-y-8">
                                <h3 className="text-3xl md:text-7xl font-black text-red-500 uppercase flex items-center gap-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                                    <span className="text-5xl md:text-9xl animate-spin-slow">⭐</span> {t('wing5')}
                                </h3>
                                <p className="text-xl md:text-4xl font-bold leading-relaxed text-slate-100">{t('wing5Desc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* كبسولات الخدمات (Glow Capsules) */}
                    <div className="mt-16 md:mt-32 p-8 md:p-20 glass-panel rounded-[3rem] md:rounded-[6rem] text-center border-4 border-dashed border-green-600/30 dark:bg-green-950/10">
                        <h3 className="text-3xl md:text-6xl font-black text-green-700 dark:text-green-400 mb-10 md:mb-16 uppercase tracking-tighter">
                            {t('libServices')}
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                           {t('servicesList').split(' • ').map((service, index) => (
                               <span key={index} className="px-5 py-2.5 md:px-10 md:py-5 bg-white dark:bg-green-500/10 text-green-800 dark:text-green-300 rounded-full text-sm md:text-3xl font-black border border-green-600/20 dark:border-green-500/30 transition-all hover:bg-green-600 dark:hover:bg-green-500 hover:text-white shadow-lg dark:hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] cursor-pointer">
                                   {service}
                               </span>
                           ))}
                        </div>
                    </div>
                </section>

                {/* القسم الثالث: التواصل (Dark Neon) */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
                    <div className="lg:col-span-7 glass-panel p-8 md:p-16 rounded-[2.5rem] md:rounded-[5rem] bg-slate-950 text-white shadow-3xl relative overflow-hidden border border-white/5">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/30 blur-[80px]"></div>
                        <h2 className="text-2xl md:text-5xl font-black mb-10 text-red-600 uppercase tracking-widest">{t('operatingHours')}</h2>
                        <div className="space-y-6 font-bold text-lg md:text-4xl">
                            <p className="flex justify-between items-center group/item hover:text-red-500 transition-colors border-b border-white/5 pb-4">
                                <span className="opacity-50">{t('monThu').split(' (')[0]}</span>
                                <span className="font-black text-red-500 dark:drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">{t('monThu').split(' (')[1]?.replace(')', '')}</span>
                            </p>
                            <p className="flex justify-between items-center group/item hover:text-red-500 transition-colors border-b border-white/5 pb-4">
                                <span className="opacity-50">{t('fri').split(' (')[0]}</span>
                                <span className="font-black text-red-500 dark:drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">{t('fri').split(' (')[1]?.replace(')', '')}</span>
                            </p>
                            <p className="text-slate-600 text-lg md:text-3xl italic pt-2">{t('satSun')}</p>
                        </div>
                    </div>

                    <a 
                        href="mailto:islam.ahmed@falcon-school.com"
                        className="lg:col-span-5 glass-panel p-10 md:p-20 rounded-[2.5rem] md:rounded-[5rem] bg-white dark:bg-slate-900/60 flex flex-col justify-center items-center text-center group border-2 border-transparent hover:border-red-600/40 transition-all shadow-2xl dark:hover:shadow-[0_0_60px_rgba(220,38,38,0.3)] active:scale-95"
                    >
                        <div className="w-20 h-20 md:w-36 md:h-36 bg-red-600/10 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-8 text-red-600 dark:text-red-400 group-hover:rotate-[360deg] transition-transform duration-1000 shadow-inner">
                            <svg className="h-10 w-10 md:h-20 md:w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black mb-4 uppercase text-slate-950 dark:text-white">{t('contactLink')}</h2>
                        <p className="text-red-600 dark:text-red-400 font-black text-sm md:text-2xl tracking-tighter break-all group-hover:scale-110 transition-transform">islam.ahmed@falcon-school.com</p>
                    </a>
                </section>
            </div>

            {/* الخاتمة الملكية (Neon Motto) */}
            <div className="mt-48 text-center group">
                <div className="inline-block relative">
                    <p className="text-2xl md:text-8xl font-black text-slate-400 dark:text-slate-700 tracking-tighter italic transition-all duration-1000 group-hover:text-slate-950 dark:group-hover:text-white dark:group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        "{t('motto')}"
                    </p>
                </div>
                <div className="h-1.5 md:h-3 w-48 md:w-[40rem] bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-12 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.8)] animate-pulse"></div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(6deg); } 50% { transform: translateY(-30px) rotate(10deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-spin-slow { animation: spin 12s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AboutPage;
