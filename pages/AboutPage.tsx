import React from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "عن مكتبة صقر الإمارات",
        schoolHistory: "عن مدرسة صقر الإمارات",
        schoolDesc: "تأسست مدرسة صقر الإمارات الدولية الخاصة لتكون منارة تعليمية متميزة في مدينة العين، حيث تلتزم بتقديم تعليم عالي الجودة يجمع بين الأصالة العربية والمعايير الدولية، بهدف إعداد جيل مبدع وقادر على المساهمة في رؤية الإمارات المستقبلية.",
        operatingHours: "مواعيد العمل الرسمية",
        monThu: "الاثنين - الخميس",
        fri: "الجمعة",
        satSun: "السبت - الأحد",
        closed: "مغلق",
        timeMonThu: "07:30 صباحاً - 03:00 مساءً",
        timeFri: "07:30 صباحاً - 11:30 صباحاً",
        contactLibrarian: "تواصل مع أمين المكتبة",
        librarianDesc: "مكتبتنا ليست مجرد رفوف للكتب، بل هي فضاء تفاعلي لدعم أبحاثكم وتطوير شغفكم المعرفي.",
        servicesTitle: "خدماتنا المدرسية",
        service1: "البحث الذكي (AI)",
        service2: "الدعم البحثي",
        service3: "الاستعارة الميسرة",
        service4: "معارض 'جسر الحضارة'",
        visitSite: "زيارة الموقع الرسمي",
        motto: "مستقبل المعرفة يبدأ هنا"
    },
    en: {
        pageTitle: "About Saqr Library",
        schoolHistory: "About EFIPS",
        schoolDesc: "Emirates Falcon International Private School was established as a distinguished educational lighthouse in Al Ain, committed to providing high-quality education that blends Arab authenticity with international standards, preparing a creative generation for the UAE future vision.",
        operatingHours: "Official Operating Hours",
        monThu: "Monday - Thursday",
        fri: "Friday",
        satSun: "Saturday - Sunday",
        closed: "Closed",
        timeMonThu: "07:30 AM - 03:00 PM",
        timeFri: "07:30 AM - 11:30 AM",
        contactLibrarian: "Contact the Librarian",
        librarianDesc: "Our library is more than just bookshelves; it is an interactive space to support your research and fuel your knowledge passion.",
        servicesTitle: "School Services",
        service1: "Smart Search (AI)",
        service2: "Research Support",
        service3: "Easy Lending",
        service4: "Heritage Exhibitions",
        visitSite: "Visit Official Website",
        motto: "The Future of Knowledge Starts Here"
    }
};

const AboutPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const isAr = locale === 'ar';

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-6 py-12 animate-fade-up relative z-10 pb-32">
            
            {/* رأس الصفحة */}
            <div className="text-center mb-20">
                <h1 className="text-5xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter mb-4">
                    {t('pageTitle')}
                </h1>
                <div className="h-2 w-32 bg-red-600 mx-auto rounded-full shadow-lg"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* كارت تاريخ المدرسة (عرض واسع) */}
                <div className="lg:col-span-8 glass-panel p-10 md:p-14 rounded-[3.5rem] border-2 border-white/40 dark:border-white/5 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 end-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <img src="/school-logo.png" alt="" className="w-80 h-80 object-contain" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white mb-6 tracking-tighter">
                        {t('schoolHistory')}
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                        {t('schoolDesc')}
                    </p>
                </div>

                {/* كارت رابط الموقع (عرض أصغر) */}
                <a 
                    href="https://www.falcon-school.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="lg:col-span-4 glass-panel group p-10 rounded-[3.5rem] border-2 border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center transition-all duration-500 hover:border-red-600 hover:shadow-2xl active:scale-95"
                >
                    <img src="/school-logo.png" alt="EFIPS Logo" className="h-32 mb-6 object-contain group-hover:scale-110 transition-transform duration-700" />
                    <p className="text-red-600 font-black text-xs uppercase tracking-[0.3em]">{t('visitSite')}</p>
                </a>

                {/* كارت مواعيد العمل */}
                <div className="lg:col-span-4 glass-panel p-10 rounded-[3.5rem] border-2 border-white/40 dark:border-white/5 bg-slate-950 text-white relative overflow-hidden">
                    <h2 className="text-2xl font-black mb-8 tracking-tighter text-red-600 uppercase tracking-[0.2em]">
                        {t('operatingHours')}
                    </h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <span className="font-bold opacity-60">{t('monThu')}</span>
                            <span className="font-black text-sm">{t('timeMonThu')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <span className="font-bold opacity-60">{t('fri')}</span>
                            <span className="font-black text-sm">{t('timeFri')}</span>
                        </div>
                        <div className="flex justify-between items-center opacity-40 italic">
                            <span>{t('satSun')}</span>
                            <span className="font-black text-sm">{t('closed')}</span>
                        </div>
                    </div>
                </div>

                {/* كارت التواصل */}
                <div className="lg:col-span-8 glass-panel p-10 rounded-[3.5rem] border-2 border-white/40 dark:border-white/5 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white mb-6 tracking-tighter">
                        {t('contactLibrarian')}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold mb-8">
                        {t('librarianDesc')}
                    </p>
                    <div className="inline-flex items-center gap-3 text-red-600 font-black text-[10px] uppercase tracking-[0.4em]">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-lg"></span>
                        Knowledge Support Active
                    </div>
                </div>

                {/* كارت الخدمات (4 أعمدة) */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                    {[
                        { title: t('service1'), icon: "🤖" },
                        { title: t('service2'), icon: "📋" },
                        { title: t('service3'), icon: "📚" },
                        { title: t('service4'), icon: "🎨" }
                    ].map((s, i) => (
                        <div key={i} className="glass-panel p-8 rounded-[2.5rem] border-2 border-transparent hover:border-green-600 transition-all text-center group shadow-sm">
                            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">{s.icon}</div>
                            <h3 className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* الخاتمة */}
            <div className="mt-32 text-center">
                <p className="text-sm md:text-xl font-black text-slate-300 dark:text-slate-600 tracking-[0.6em] uppercase">
                    {t('motto')}
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
