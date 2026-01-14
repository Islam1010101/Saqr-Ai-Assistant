import React, { useState, useCallback } from 'react';
import { useLanguage } from '../App';

// --- 1. إعدادات الترجمة والبيانات ---
const translations = {
    ar: {
        title: "حول مكتبة مدرسة صقر الإمارات",
        aboutSchoolTitle: "عن مدرسة صقر الإمارات الدولية",
        p1: "افتتحت مدرسة صقر الإمارات الدولية أبوابها في مدينة العين عام 2007، وهي مدرسة مختلطة تعتمد المنهاج الأمريكي في تدريس كافة المراحل الأكاديمية، حيث تستقبل الطلاب من عمر 4 إلى 18 عاماً.",
        p2: "تتألف الهيئة التدريسية من 71 معلماً بدوام كامل، مما يضمن حصول كل طالب على الرعاية اللازمة، وقد حصلت مرافق المدرسة على تقييم “جيد” من قبل دائرة التعليم والمعرفة (ADEK).",
        servicesTitle: "خدمات المكتبة الذكية",
        services: [
            "إعارة الكتب والمراجع الورقية",
            "مساحات هادئة للمطالعة والبحث",
            "ورش عمل وفعاليات قرائية رقمية",
            "مساعدة بحثية عبر صقر (Saqr AI)",
            "الوصول إلى المصادر الرقمية العالمية"
        ],
        digitalUpdateTitle: "المكتبة الرقمية المطورة (2026)",
        digitalUpdateDesc: "تم تحديث المكتبة لتشمل 35 عنواناً عربياً مختاراً و14 من روائع الأدب الإنجليزي، مع تلخيصات ذكية مدعومة بالذكاء الاصطناعي.",
        hoursTitle: "ساعات العمل",
        hours: "الاثنين - الجمعة: 8:30 صباحاً - 2:00 ظهراً",
        contactTitle: "تواصل مع أمين المكتبة",
        contactEmail: "islam.soliman@falcon-school.com", // تم التحديث بناءً على ملفك الشخصي
    },
    en: {
        title: "About Saqr Library",
        aboutSchoolTitle: "About Emirates Falcon School",
        p1: "Emirates Falcon International School opened in Al Ain in 2007, following the American curriculum for all academic stages, welcoming students from 4 to 18 years old.",
        p2: "The teaching staff consists of 71 full-time teachers, ensuring individual care. School facilities are rated 'Good' by ADEK.",
        servicesTitle: "Library Services",
        services: [
            "Book and Reference Lending",
            "Quiet Spaces for Study",
            "Digital Reading Workshops",
            "Research Assistance via Saqr AI",
            "Access to Global Digital Resources"
        ],
        digitalUpdateTitle: "Upgraded Digital Library (2026)",
        digitalUpdateDesc: "Newly expanded to include 35 curated Arabic titles and 14 English masterpieces, featuring AI summaries.",
        hoursTitle: "Operating Hours",
        hours: "Monday - Friday: 8:30 AM - 2:00 PM",
        contactTitle: "Contact Librarian",
        contactEmail: "islam.soliman@falcon-school.com",
    }
}

const BackgroundPattern = () => (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 blur-[100px] rounded-full"></div>
    </div>
);

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 800);
    };

    const SCHOOL_LOGO = "/school-logo.png"; 

    return (
        <div dir={dir} className="relative max-w-7xl mx-auto pb-20 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <BackgroundPattern />

            {/* 1. Header Hero Card */}
            <div 
                onMouseMove={handleMouseMove}
                onMouseDown={handleInteraction}
                className="relative z-10 glass-panel glass-card-interactive p-10 md:p-16 rounded-[3.5rem] shadow-2xl mb-12 flex flex-col items-center text-center overflow-hidden border-white/40 dark:border-white/10"
            >
                {ripples.map(r => <span key={r.id} className="ripple-effect bg-red-500/10" style={{ left: r.x, top: r.y }} />)}
                <img src={SCHOOL_LOGO} alt="School Logo" className="h-32 md:h-44 object-contain mb-8 drop-shadow-2xl logo-smart-hover logo-white-filter" />
                <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white mb-6 tracking-tighter">
                    {t('title')}
                </h1>
                <div className="h-2 w-24 bg-green-700 rounded-full shadow-[0_0_20px_rgba(0,115,47,0.5)]"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* 2. Special Update Section (Falcon 2026) */}
                    <section 
                        onMouseMove={handleMouseMove}
                        className="glass-panel glass-card-interactive p-8 md:p-12 rounded-[3rem] border-red-500/40 bg-gradient-to-br from-red-600/5 to-transparent relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="text-5xl md:text-6xl animate-bounce">🚀</div>
                            <div className="flex-1">
                                <h2 className="text-2xl md:text-3xl font-black mb-4 text-red-600">
                                    {t('digitalUpdateTitle')}
                                </h2>
                                <p className="text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200 font-bold italic opacity-90">
                                    "{t('digitalUpdateDesc')}"
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. About School Section */}
                    <section onMouseMove={handleMouseMove} className="glass-panel glass-card-interactive p-8 md:p-12 rounded-[3rem]">
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-4">
                            <span className="w-2.5 h-10 bg-green-700 rounded-full shadow-lg"></span>
                            {t('aboutSchoolTitle')}
                        </h2>
                        <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-300 font-medium">
                            <p>{t('p1')}</p>
                            <p>{t('p2')}</p>
                        </div>
                    </section>

                    {/* 4. Services Grid */}
                    <section onMouseMove={handleMouseMove} className="glass-panel glass-card-interactive p-8 md:p-12 rounded-[3rem]">
                        <h2 className="text-2xl md:text-3xl font-black mb-10 text-gray-900 dark:text-white flex items-center gap-4">
                            <span className="w-2.5 h-10 bg-red-600 rounded-full shadow-lg"></span>
                            {t('servicesTitle')}
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(t('services') as string[]).map((service, i) => (
                                <li key={i} onMouseDown={handleInteraction} className="relative overflow-hidden flex items-center gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:border-red-500/30 transition-all cursor-pointer group active:scale-95 shadow-sm">
                                    {ripples.map(r => <span key={r.id} className="ripple-effect bg-red-600/10" style={{ left: r.x, top: r.y }} />)}
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-700 text-white rounded-lg flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">✓</div>
                                    <span className="text-gray-900 dark:text-gray-100 font-black text-sm md:text-base">{service}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Working Hours Card */}
                    <section className="bg-green-700 text-white p-10 rounded-[3rem] shadow-xl hover:translate-y-[-5px] transition-all duration-500 relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-20%] h-40 w-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3 relative z-10">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {t('hoursTitle')}
                        </h2>
                        <p className="text-green-50 font-bold text-lg leading-relaxed relative z-10">{t('hours')}</p>
                    </section>

                    {/* Contact Card */}
                    <section className="bg-gray-950 text-white p-10 rounded-[3rem] shadow-xl hover:translate-y-[-5px] transition-all duration-500 border border-white/10">
                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                            <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('contactTitle')}
                        </h2>
                        <a href={`mailto:${t('contactEmail')}`} className="block w-full bg-white/5 p-5 rounded-2xl hover:bg-red-600 transition-all font-black text-xs md:text-sm break-all text-center border border-white/10">
                            {t('contactEmail')}
                        </a>
                    </section>
                    
                    {/* Secondary Logo/Brand Card */}
                    <div 
                        onMouseMove={handleMouseMove}
                        className="glass-panel glass-card-interactive p-8 rounded-[3rem] text-center border-white/30 group active:scale-95"
                    >
                        <p className="text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase mb-4 tracking-[0.3em]">Excellence in Education</p>
                        <div className="flex items-center justify-center gap-3">
                             <img src={SCHOOL_LOGO} alt="Falcon Logo" className="h-10 w-10 object-contain logo-white-filter group-hover:rotate-12 transition-transform" />
                             <span className="font-black text-xl text-gray-950 dark:text-white tracking-tighter group-hover:text-red-600 transition-colors">E.F.I.P.S</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
