import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "عن مكتبة صقر الإمارات",
        schoolSite: "زيارة موقع مدرسة صقر الإمارات",
        contactLibrarian: "تواصل مع أمين المكتبة",
        librarianDesc: "نحن هنا لمساعدتك في رحلتك المعرفية، سواء كنت تبحث عن مصدر رقمي أو تحتاج لدعم في بحثك الأكاديمي.",
        servicesTitle: "خدمات المكتبة",
        service1: "البحث الذكي والمصادر الرقمية",
        service1Desc: "وصول غير محدود لأكثر من 60 مصدراً رقمياً عالمياً عبر بوابتنا الذكية.",
        service2: "الدعم البحثي وورش العمل",
        service2Desc: "جلسات تدريبية متخصصة في مهارات البحث العلمي واستخدام الذكاء الاصطناعي.",
        service3: "استعارة المصادر المطبوعة",
        service3Desc: "نظام استعارة مرن يغطي آلاف العناوين في الأدب، العلوم، والتاريخ.",
        service4: "الأنشطة الثقافية والمعارض",
        service4Desc: "تنظيم فعاليات دورية مثل 'جسر الحضارة' لتعزيز الإبداع والابتكار الطلابي.",
        motto: "المعرفة.. آفاق لا حدود لها"
    },
    en: {
        pageTitle: "About Saqr Library",
        schoolSite: "Visit EFIPS Official Website",
        contactLibrarian: "Contact the Librarian",
        librarianDesc: "We are here to guide your knowledge journey, helping you find resources and providing academic research support.",
        servicesTitle: "Library Services",
        service1: "Smart Search & Digital Resources",
        service1Desc: "Unlimited access to 60+ global digital resources through our smart portal.",
        service2: "Research Support & Workshops",
        service2Desc: "Specialized training sessions in scientific research and AI literacy.",
        service3: "Physical Book Lending",
        service3Desc: "A flexible lending system covering thousands of titles in literature, science, and history.",
        service4: "Cultural Activities & Exhibitions",
        service4Desc: "Organizing periodic events like 'Bridge of Civilization' to boost student creativity.",
        motto: "Knowledge.. Limitless Horizons"
    }
};

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const isAr = locale === 'ar';

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-6 py-12 animate-fade-up relative z-10 pb-32">
            
            {/* رأس الصفحة */}
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter mb-4">
                    {t('pageTitle')}
                </h1>
                <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_rgba(220,38,38,0.4)]"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* كارت هوية المدرسة (Hyperlink) */}
                <a 
                    href="https://www.falcon-school.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="glass-panel group relative overflow-hidden p-12 md:p-16 rounded-[3.5rem] border-2 border-white/40 dark:border-white/5 flex flex-col items-center justify-center text-center transition-all duration-500 hover:border-red-600 hover:shadow-[0_0_40px_rgba(220,38,38,0.2)] active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src="/school-logo.png" alt="EFIPS Logo" className="h-40 md:h-56 mb-8 object-contain transition-transform duration-700 group-hover:scale-110 logo-white-filter" />
                    <h2 className="text-3xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter">E.F.I.P.S</h2>
                    <p className="text-red-600 font-black text-sm uppercase tracking-[0.3em]">{t('schoolSite')}</p>
                </a>

                {/* كارت تواصل مع أمين المكتبة */}
                <div className="glass-panel p-12 md:p-16 rounded-[3.5rem] border-2 border-white/40 dark:border-white/5 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 end-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white mb-6 tracking-tighter">
                        {t('contactLibrarian')}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-10">
                        {t('librarianDesc')}
                    </p>
                    <div className="flex items-center gap-4 text-red-600 font-black text-sm tracking-widest uppercase border-t border-slate-100 dark:border-white/10 pt-8">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                        {isAr ? 'متواجدون لخدمتكم' : 'At Your Service'}
                    </div>
                </div>

                {/* كارت خدمات المكتبة (4 خدمات) */}
                <div className="lg:col-span-2 glass-panel p-12 md:p-16 rounded-[3.5rem] md:rounded-[4.5rem] border-2 border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white mb-16 tracking-tighter text-center">
                        {t('servicesTitle')}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {[
                            { title: t('service1'), desc: t('service1Desc'), icon: "🌐", color: "hover:border-blue-500" },
                            { title: t('service2'), desc: t('service2Desc'), icon: "🎓", color: "hover:border-green-600" },
                            { title: t('service3'), desc: t('service3Desc'), icon: "📚", color: "hover:border-red-600" },
                            { title: t('service4'), desc: t('service4Desc'), icon: "🏛️", color: "hover:border-amber-500" }
                        ].map((service, idx) => (
                            <div key={idx} className={`p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border-2 border-transparent ${service.color} transition-all duration-500 group shadow-sm hover:shadow-xl`}>
                                <div className="text-4xl mb-6">{service.icon}</div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white mb-3 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* الفوتر النخبوي */}
            <div className="mt-24 text-center opacity-40 group">
                <p className="text-xl md:text-3xl font-black text-slate-400 tracking-[0.5em] uppercase mb-4 transition-all group-hover:tracking-[0.6em] group-hover:text-red-600">
                    {t('motto')}
                </p>
                <div className="h-0.5 w-48 bg-slate-200 dark:bg-white/10 mx-auto rounded-full"></div>
            </div>
        </div>
    );
};

export default AboutPage;
