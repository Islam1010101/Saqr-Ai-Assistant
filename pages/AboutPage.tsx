import React, { useState, MouseEvent } from 'react';
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
        monThu: "الاثنين - الخميس (07:30 ص - 02:00 م)",
        fri: "الجمعة (07:30 ص - 10:30 ص)",
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
        monThu: "Mon - Thu (07:30 AM - 02:00 PM)",
        fri: "Friday (07:30 AM - 10:30 AM)",
        satSun: "Sat - Sun (Closed)",
        contactLink: "Contact the Librarian",
        motto: "Knowledge is Light.. and Reading is the Key to the Future"
    }
};

// --- مكون تفاعلي للبطاقات ثلاثية الأبعاد (3D Card) ---
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const [style, setStyle] = useState({});

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.5s ease-out'
        });
    };

    return (
        <div 
            className={`transition-all duration-300 ${className}`} 
            style={style} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-12 md:py-24 px-4 md:px-8">
            
            {/* 🌟 الخلفية الديناميكية المحدثة */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
               <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/20 dark:bg-red-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }}></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] bg-green-600/20 dark:bg-green-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }}></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-20 md:gap-32 animate-fade-in-up pb-20 relative z-10">
                
                {/* --- 1. قسم عن المدرسة --- */}
                <TiltCard>
                    <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-8 md:p-16 lg:p-20 rounded-[3rem] border border-white/40 dark:border-slate-700/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center gap-10 md:gap-20 relative overflow-hidden group">
                        
                        {/* تأثير الزجاج المتلألئ (Glass Shimmer) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                        
                        <div className="absolute top-0 start-0 w-2 h-full bg-gradient-to-b from-red-600 to-green-600 rounded-s-3xl"></div>
                        
                        <div className="flex-1 space-y-6 md:space-y-8 relative z-10 text-center md:text-start">
                            <span className="inline-block px-6 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold text-xs md:text-sm uppercase tracking-widest shadow-sm">
                                EFIPS
                            </span>
                            <h2 className={`text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight ${!isAr && 'tracking-tight'}`}>
                                {t('schoolHistory')}
                            </h2>
                            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {t('historyText')}
                            </p>
                            <div className="pt-6 flex justify-center md:justify-start">
                                <a 
                                    href="https://www.falcon-school.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden inline-flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-full font-bold shadow-xl hover:shadow-red-600/30 transition-all duration-300"
                                >
                                    <span className="absolute inset-0 w-0 bg-red-600 transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
                                    <span className="relative z-10 group-hover:text-white transition-colors">{t('visitWebsite')}</span>
                                    <svg className="w-6 h-6 relative z-10 rtl:rotate-180 group-hover:text-white transition-colors group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                            </div>
                        </div>
                        
                        <div className="w-56 h-56 md:w-80 md:h-80 shrink-0 relative flex justify-center items-center perspective-1000">
                            <div className="absolute inset-0 bg-red-600/10 dark:bg-white/10 rounded-full animate-pulse blur-3xl"></div>
                            <img 
                                src="/school-logo.png" 
                                alt="EFIPS" 
                                className="w-full h-full object-contain relative z-10 animate-float drop-shadow-2xl dark:invert transform group-hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                    </section>
                </TiltCard>

                {/* --- 2. قسم عن المكتبة والأجنحة --- */}
                <section className="relative z-10">
                    <div className="text-center mb-16 md:mb-24">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Library Overview</span>
                        <h3 className={`text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 ${!isAr && 'tracking-tight'}`}>
                            {t('librarySection')}
                        </h3>
                        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-4xl mx-auto leading-relaxed px-4">
                            {t('libraryIntro')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                        {[
                            { title: t('wing1'), desc: t('wing1Desc'), color: "from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800", icon: "🏛️" },
                            { title: t('wing2'), desc: t('wing2Desc'), color: "from-green-500 to-green-700", icon: "🚀" },
                            { title: t('wing3'), desc: t('wing3Desc'), color: "from-red-500 to-red-700", icon: "📖" },
                            { title: t('wing4'), desc: t('wing4Desc'), color: "from-blue-500 to-blue-700", icon: "🧸" }
                        ].map((w, i) => (
                            <TiltCard key={i}>
                                <div className="h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/40 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative text-start">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${w.color} opacity-10 rounded-bl-full`}></div>
                                    <div className="text-5xl md:text-6xl mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 origin-bottom-left">{w.icon}</div>
                                    <h4 className="text-2xl md:text-3xl font-black mb-4 text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{w.title}</h4>
                                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10">{w.desc}</p>
                                </div>
                            </TiltCard>
                        ))}

                        {/* الجناح الخامس - تصميم خاص للهوية الوطنية */}
                        <div className="md:col-span-2 lg:col-span-2 relative mt-4">
                            <TiltCard>
                                <div className="p-10 md:p-20 rounded-[3rem] bg-slate-950 text-white shadow-2xl relative overflow-hidden group border border-slate-800 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                                    
                                    {/* إضاءات ديناميكية تتفاعل مع الـ Hover */}
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/30 blur-[100px] rounded-full mix-blend-screen group-hover:translate-x-10 transition-transform duration-700"></div>
                                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/30 blur-[100px] rounded-full mix-blend-screen group-hover:-translate-x-10 transition-transform duration-700"></div>
                                    
                                    <div className="text-8xl md:text-[10rem] group-hover:scale-110 transition-transform duration-500 relative z-10 shrink-0 drop-shadow-2xl filter">🇦🇪</div>
                                    
                                    <div className="relative z-10 flex-1 text-center md:text-start">
                                        <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest mb-6">
                                            National Identity Wing
                                        </div>
                                        <h4 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 leading-tight">
                                            {t('wing5')}
                                        </h4>
                                        <p className="text-lg md:text-2xl text-slate-300 font-medium leading-relaxed max-w-3xl">
                                            {t('wing5Desc')}
                                        </p>
                                    </div>
                                </div>
                            </TiltCard>
                        </div>
                    </div>
                </section>

                {/* --- 3. خدمات المكتبة --- */}
                <section className="relative z-10">
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl p-10 md:p-20 rounded-[3rem] border border-white/50 dark:border-slate-700/50 shadow-2xl text-center overflow-hidden relative">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 blur-[100px] rounded-full"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full"></div>
                        
                        <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-12 relative z-10">
                            {t('libServices')}
                        </h3>
                        
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6 relative z-10">
                            {t('servicesList').split(' • ').map((service, index) => (
                                <div key={index} className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                                    <div className="relative px-8 py-4 md:px-10 md:py-5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl text-base md:text-xl font-bold border border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 transition-all cursor-default shadow-sm hover:-translate-y-1">
                                        {service}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 4. التواصل ومواعيد العمل --- */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
                    
                    {/* مواعيد العمل */}
                    <div className="lg:col-span-7">
                        <TiltCard className="h-full">
                            <div className="h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-white/40 dark:border-slate-700/50 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 start-0 w-2 h-full bg-gradient-to-b from-green-400 to-green-600"></div>
                                
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-2xl">⏰</div>
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{t('operatingHours')}</h3>
                                </div>

                                <div className="space-y-6 font-bold text-base md:text-xl text-slate-600 dark:text-slate-400">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <span>{t('monThu').split(' (')[0]}</span>
                                        <span className="text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-5 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">{t('monThu').split(' (')[1]?.replace(')', '')}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <span>{t('fri').split(' (')[0]}</span>
                                        <span className="text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-5 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">{t('fri').split(' (')[1]?.replace(')', '')}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 p-5 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                                        <span className="text-red-600 dark:text-red-400">{t('satSun').split(' (')[0]}</span>
                                        <span className="text-red-700 dark:text-red-300 bg-white dark:bg-slate-800 px-5 py-2 rounded-xl shadow-sm border border-red-200 dark:border-red-900/50">{t('satSun').split(' (')[1]?.replace(')', '')}</span>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </div>

                    {/* التواصل */}
                    <div className="lg:col-span-5 h-full">
                        <TiltCard className="h-full">
                            <a 
                                href="mailto:islam.ahmed@falcon-school.com"
                                className="block h-full bg-gradient-to-br from-red-600 to-red-800 p-10 md:p-16 rounded-[3rem] text-center group transition-all shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50"></div>
                                
                                <div className="relative z-10 h-full flex flex-col justify-center items-center">
                                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/30 shadow-inner">
                                        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-black mb-4 text-white group-hover:-translate-y-1 transition-transform">{t('contactLink')}</h3>
                                    <p className="text-white/90 font-bold text-base md:text-xl break-all bg-black/20 px-6 py-3 rounded-xl border border-white/10 group-hover:bg-black/30 transition-colors">islam.ahmed@falcon-school.com</p>
                                </div>
                            </a>
                        </TiltCard>
                    </div>

                </section>

                {/* --- الخاتمة --- */}
                <div className="mt-8 md:mt-16 text-center relative z-10">
                    <p className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-600 to-slate-400 dark:from-slate-500 dark:via-slate-300 dark:to-slate-500 leading-relaxed italic px-4 drop-shadow-sm">
                        "{t('motto')}"
                    </p>
                    <div className="flex justify-center gap-3 mt-12">
                        <div className="h-1.5 w-12 bg-red-600 rounded-full"></div>
                        <div className="h-1.5 w-3 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                        <div className="h-1.5 w-3 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                    </div>
                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .perspective-1000 { perspective: 1000px; }
            `}</style>
        </div>
    );
};

export default AboutPage;
