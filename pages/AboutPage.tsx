import React, { useState, useCallback } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        title: "منصة التميز المعرفي",
        aboutSchoolTitle: "عن مدرسة صقر الإمارات الدولية",
        p1: "تأسست مدرسة صقر الإمارات الدولية في مدينة العين عام 2007، وهي صرح تعليمي رائد يعتمد المنهاج الأمريكي، ملتزم ببناء أجيال مبدعة تحمل الهوية الوطنية وقيم المستقبل.",
        p2: "بقيادة هيئة تدريسية نخبوية، حصلت المدرسة على تقييم “جيد” من دائرة التعليم والمعرفة (ADEK)، وتستمر في تطوير مرافقها الرقمية لتواكب تطلعات الدولة.",
        servicesTitle: "خدمات المكتبة الذكية",
        services: [
            "إعارة الكتب والمراجع الورقية الفاخرة",
            "مساحات بحث ذكية وهادئة",
            "ورش عمل القراءة الرقمية (AI)",
            "دعم بحثي عبر المساعد الذكي صقر",
            "الوصول للمصادر المعرفية العالمية"
        ],
        digitalUpdateTitle: "التحول الرقمي المتكامل (2026)",
        digitalUpdateDesc: "تم إطلاق النسخة المطورة التي تضم 41 عنواناً عربياً و26 عنواناً إنجليزياً، مع ملخصات ذكية ونظام تحليل بيانات متطور.",
        hoursTitle: "ساعات العمل الرسمية",
        hours: "الاثنين - الجمعة: 8:30 صباحاً - 2:00 ظهراً",
        contactTitle: "أمين المكتبة الرقمية",
        contactEmail: "islam.soliman@falcon-school.com",
    },
    en: {
        title: "Knowledge Excellence Hub",
        aboutSchoolTitle: "About Emirates Falcon School",
        p1: "Established in Al Ain in 2007, Emirates Falcon International School is a leading educational institution following the American curriculum, dedicated to building creative generations.",
        p2: "Led by an elite faculty and rated 'Good' by ADEK, the school continues to evolve its digital facilities to meet national aspirations.",
        servicesTitle: "Smart Library Services",
        services: [
            "Physical & Digital Book Lending",
            "Smart & Quiet Research Spaces",
            "AI Digital Reading Workshops",
            "Saqr AI Research Assistance",
            "Global Knowledge Database Access"
        ],
        digitalUpdateTitle: "Integrated Digital Shift (2026)",
        digitalUpdateDesc: "The 2026 upgrade includes 41 Arabic and 26 English titles, powered by AI summaries and advanced analytics.",
        hoursTitle: "Official Hours",
        hours: "Monday - Friday: 8:30 AM - 2:00 PM",
        contactTitle: "Digital Librarian",
        contactEmail: "islam.soliman@falcon-school.com",
    }
}

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
        <div dir={dir} className="max-w-7xl mx-auto pb-24 px-4 animate-fade-up">
            
            {/* 1. الهيدر الوطني الفخم (Large Hero Card) */}
            <div 
                onMouseMove={handleMouseMove}
                onMouseDown={handleInteraction}
                className="relative z-10 glass-panel glass-card-interactive p-12 md:p-24 rounded-[4rem] shadow-2xl mb-16 flex flex-col items-center text-center overflow-hidden border-white/40 dark:border-white/5"
            >
                {ripples.map(r => <span key={r.id} className="ripple-effect bg-red-600/10" style={{ left: r.x, top: r.y }} />)}
                
                <div className="relative mb-12">
                   <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-10 animate-pulse"></div>
                   <img src={SCHOOL_LOGO} alt="Logo" className="h-40 md:h-56 object-contain relative z-10 logo-tilt-right logo-white-filter" />
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black text-slate-950 dark:text-white mb-6 tracking-tighter leading-none">
                    {t('title')}
                </h1>
                <div className="flex items-center gap-3">
                    <div className="h-1.5 w-12 bg-red-600 rounded-full"></div>
                    <div className="h-1.5 w-24 bg-green-700 rounded-full"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* 2. قسم التحديث الرقمي 2026 (Premium Focus) */}
                    <section 
                        onMouseMove={handleMouseMove}
                        className="glass-panel glass-card-interactive p-10 md:p-14 rounded-[3.5rem] border-red-600/30 bg-gradient-to-br from-red-600/5 to-transparent relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="text-7xl md:text-8xl animate-bounce logo-tilt-right">🚀</div>
                            <div className="flex-1 text-center md:text-start">
                                <h2 className="text-3xl md:text-4xl font-black mb-4 text-red-600 tracking-tight">
                                    {t('digitalUpdateTitle')}
                                </h2>
                                <p className="text-xl md:text-2xl leading-relaxed text-slate-800 dark:text-slate-200 font-bold italic opacity-90">
                                    "{t('digitalUpdateDesc')}"
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. التعريف بالمدرسة (National Heritage) */}
                    <section onMouseMove={handleMouseMove} className="glass-panel glass-card-interactive p-10 md:p-14 rounded-[3.5rem]">
                        <h2 className="text-3xl md:text-4xl font-black mb-10 text-slate-950 dark:text-white flex items-center gap-5">
                            <span className="w-4 h-12 bg-green-700 rounded-full shadow-xl logo-tilt-right"></span>
                            {t('aboutSchoolTitle')}
                        </h2>
                        <div className="space-y-8 text-xl md:text-2xl leading-relaxed text-slate-700 dark:text-slate-300 font-medium tracking-tight">
                            <p className="border-s-4 border-slate-100 dark:border-white/5 ps-6">{t('p1')}</p>
                            <p className="border-s-4 border-slate-100 dark:border-white/5 ps-6">{t('p2')}</p>
                        </div>
                    </section>

                    {/* 4. قائمة الخدمات (Smart Interaction) */}
                    <section onMouseMove={handleMouseMove} className="glass-panel glass-card-interactive p-10 md:p-14 rounded-[3.5rem]">
                        <h2 className="text-3xl md:text-4xl font-black mb-12 text-slate-950 dark:text-white flex items-center gap-5">
                            <span className="w-4 h-12 bg-red-600 rounded-full shadow-xl logo-tilt-right"></span>
                            {t('servicesTitle')}
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(t('services') as string[]).map((service, i) => (
                                <li key={i} onMouseDown={handleInteraction} className="relative overflow-hidden flex items-center gap-5 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/40 hover:border-green-600/30 transition-all cursor-pointer group active:scale-95 shadow-sm">
                                    {ripples.map(r => <span key={r.id} className="ripple-effect bg-green-600/10" style={{ left: r.x, top: r.y }} />)}
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-700 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">✓</div>
                                    <span className="text-slate-950 dark:text-slate-100 font-black text-lg tracking-tight">{service}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Sidebar - تباين فائق للفخامة */}
                <div className="space-y-10">
                    
                    {/* ساعات العمل (The Green Card) */}
                    <section className="bg-green-700 text-white p-12 rounded-[4rem] shadow-2xl hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-20%] h-48 w-48 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000 blur-2xl"></div>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-4 relative z-10">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {t('hoursTitle')}
                        </h2>
                        <p className="text-green-50 font-black text-xl md:text-2xl leading-relaxed relative z-10 tracking-tighter">{t('hours')}</p>
                    </section>

                    {/* تواصل مع المسؤول (The Black Card) */}
                    <section className="bg-slate-950 text-white p-12 rounded-[4rem] shadow-2xl hover:translate-y-[-8px] transition-all duration-500 border border-white/10 relative group">
                        <div className="absolute bottom-[-10%] left-[-10%] h-32 w-32 bg-red-600/10 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-4 relative z-10">
                            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('contactTitle')}
                        </h2>
                        <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] mb-4">{t('librarian')}</p>
                        <a href={`mailto:${t('contactEmail')}`} className="block w-full bg-white/5 p-6 rounded-[2rem] hover:bg-red-600 transition-all font-black text-sm md:text-base break-all text-center border border-white/10 relative z-10 shadow-inner">
                            {t('contactEmail')}
                        </a>
                    </section>
                    
                    {/* كرت التوثيق (National Auth Card) */}
                    <div 
                        onMouseMove={handleMouseMove}
                        className="glass-panel glass-card-interactive p-10 rounded-[4rem] text-center border-white/40 dark:border-white/5 group active:scale-95"
                    >
                        <p className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase mb-6 tracking-[0.4em]">Integrated Library System</p>
                        <div className="flex items-center justify-center gap-4">
                             <img src={SCHOOL_LOGO} alt="Falcon Logo" className="h-12 w-12 object-contain logo-white-filter logo-tilt-right group-hover:rotate-[20deg]" />
                             <span className="font-black text-2xl text-slate-950 dark:text-white tracking-tighter group-hover:text-red-600 transition-colors">E.F.I.P.S</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
