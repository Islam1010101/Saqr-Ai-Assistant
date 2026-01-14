import React, { useState } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        title: "حول مكتبة مدرسة صقر الإمارات",
        aboutSchoolTitle: "عن مدرسة صقر الإمارات الدولية",
        p1: "افتتحت مدرسة صقر الامارات الدولية أبوابها في مدينة العين عام 2007، وهي مدرسة مختلطة تعتمد المنهاج الأمريكي في تدريس كافة المراحل الأكاديمية، حيث تستقبل الطلاب من عمر 4 الى 18 عام، وتضم في الوقت الحالي أكثر من 1,000 طالب معظمهم مواطنين إماراتيين.",
        p2: "تتألف الهيئة التدريسية من 71 معلم بدوام كامل، مما يضمن حصول كل طالب على الرعاية والاهتمام اللازمين، وتشتمل المدرسة على مرافق حديثة حصلت على تقييم “جيد” من قبل دائرة التعليم والمعرفة.",
        servicesTitle: "خدمات المكتبة الذكية",
        service1: "إعارة الكتب والمراجع الورقية",
        service2: "مساحات هادئة للمطالعة والبحث",
        service3: "ورش عمل وفعاليات قرائية رقمية",
        service4: "مساعدة بحثية عبر المساعد صقر",
        service5: "الوصول إلى قواعد البيانات والمصادر الرقمية",
        hoursTitle: "ساعات العمل",
        hours: "من الاثنين إلى الجمعة، من 8:30 صباحًا حتى 2:00 ظهرًا",
        contactTitle: "تواصل مع أمين المكتبة",
        contactEmail: "islam.ahmed@falcon-school.com",
    },
    en: {
        title: "About Saqr Library",
        aboutSchoolTitle: "About Emirates Falcon School",
        p1: "Emirates Falcon International School opened in Al Ain in 2007. It follows the American curriculum for all academic stages, welcoming students from 4 to 18 years old. It currently has over 1,000 students.",
        p2: "The teaching staff consists of 71 full-time teachers, ensuring every student receives care. The school facilities have been rated 'Good' by ADEK in Abu Dhabi.",
        servicesTitle: "Library Services",
        service1: "Book and Reference Lending",
        service2: "Quiet Spaces for Study",
        service3: "Digital Reading Workshops",
        service4: "Research Assistance via Saqr AI",
        service5: "Access to Digital Resources",
        hoursTitle: "Operating Hours",
        hours: "Monday to Friday, 8:30 AM - 2:00 PM",
        contactTitle: "Contact Librarian",
        contactEmail: "islam.ahmed@falcon-school.com",
    }
}

const BackgroundPattern = () => (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.1), transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(0, 115, 47, 0.1), transparent 40%)
        `,
    }}></div>
);

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    // دالة تتبع الماوس لتأثير توهج الحواف الزجاجية
    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    };

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x, y }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 800);
    };

    const SCHOOL_LOGO = "/school-logo.png"; 

    return (
        <div dir={dir} className="relative max-w-6xl mx-auto pb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <BackgroundPattern />

            {/* 1. بطاقة العنوان الكبرى - تفاعلية */}
            <div 
                onMouseMove={handleMouseMove}
                onMouseDown={handleInteraction}
                onTouchStart={handleInteraction}
                className="relative z-10 glass-panel glass-card-interactive p-10 md:p-16 rounded-[3.5rem] shadow-2xl mb-12 flex flex-col items-center text-center overflow-hidden border-white/30 dark:border-white/10 cursor-pointer"
            >
                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                
                <div className="relative mb-8">
                    {/* الشعار مع فلتر التبييض للوضع المظلم */}
                    <img 
                        src={SCHOOL_LOGO} 
                        alt="Logo" 
                        className="h-32 md:h-40 w-auto object-contain drop-shadow-2xl logo-smart-hover logo-white-filter transition-transform hover:scale-110" 
                    />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white mb-6 tracking-tight relative z-10 leading-tight">
                    {t('title')}
                </h1>
                <div className="h-2 w-24 bg-green-700 rounded-full shadow-[0_0_15px_rgba(0,115,47,0.4)] relative z-10"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* قسم عن المدرسة - تفاعلي */}
                    <section 
                        onMouseMove={handleMouseMove}
                        className="glass-panel glass-card-interactive p-8 md:p-10 rounded-[3rem] border-white/20 overflow-hidden relative"
                    >
                        <h2 className="text-3xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-4">
                            <span className="w-2.5 h-10 bg-green-700 rounded-full"></span>
                            {t('aboutSchoolTitle')}
                        </h2>
                        <div className="space-y-6 text-xl leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                            <p>{t('p1')}</p>
                            <p>{t('p2')}</p>
                        </div>
                    </section>

                    {/* قسم الخدمات */}
                    <section 
                        onMouseMove={handleMouseMove}
                        className="glass-panel glass-card-interactive p-8 md:p-10 rounded-[3rem]"
                    >
                        <h2 className="text-3xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-4">
                            <span className="w-2.5 h-10 bg-green-700 rounded-full"></span>
                            {t('servicesTitle')}
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <li 
                                    key={i} 
                                    onMouseDown={handleInteraction}
                                    onTouchStart={handleInteraction}
                                    className="relative overflow-hidden flex items-center gap-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
                                >
                                    {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                                    <span className="flex-shrink-0 w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center font-bold shadow-lg relative z-10">✓</span>
                                    <span className="text-gray-900 dark:text-gray-100 font-black text-base relative z-10">{(t as any)(`service${i}`)}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="space-y-8">
                    {/* ساعات العمل */}
                    <section className="bg-green-700 text-white p-10 rounded-[3rem] shadow-2xl shadow-green-700/30 transition-all hover:scale-[1.03]">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {t('hoursTitle')}
                        </h2>
                        <p className="text-green-50 font-black text-lg leading-relaxed">{t('hours')}</p>
                    </section>

                    {/* تواصل مع أمين المكتبة */}
                    <section className="bg-gray-950 text-white p-10 rounded-[3rem] shadow-2xl transition-all hover:scale-[1.03]">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('contactTitle')}
                        </h2>
                        <a href={`mailto:${t('contactEmail')}`} className="block bg-white/10 p-5 rounded-2xl hover:bg-white/20 transition-all font-black text-sm sm:text-base break-all text-center border border-white/10">
                            {t('contactEmail')}
                        </a>
                    </section>
                    
                    {/* كرت Powered By - تفاعلي */}
                    <a 
                        href="https://www.falcon-school.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleInteraction}
                        onTouchStart={handleInteraction}
                        className="glass-panel glass-card-interactive p-8 rounded-[3rem] text-center border-white/30 overflow-hidden relative block hover:shadow-2xl hover:shadow-red-500/20 transition-all group active:scale-95"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect border-red-600/40" style={{ left: r.x, top: r.y }} />)}
                        
                        <p className="text-gray-500 dark:text-gray-400 font-black text-xs uppercase mb-4 tracking-[0.2em] group-hover:text-red-600 transition-colors relative z-10">Powered by</p>
                        <div className="flex items-center justify-center gap-3 relative z-10">
                             <img 
                                src={SCHOOL_LOGO} 
                                alt="E.F.I.P.S" 
                                className="h-10 w-10 object-contain logo-smart-hover logo-white-filter group-hover:scale-110 transition-transform" 
                             />
                             <span className="font-black text-2xl text-gray-950 dark:text-white tracking-tighter group-hover:text-red-600 transition-colors">E.F.I.P.S</span>
                        </div>
                        
                        <div className="mt-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
