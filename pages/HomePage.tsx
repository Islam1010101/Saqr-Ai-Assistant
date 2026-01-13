import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "أهلاً بكم في مكتبة مدرسة صقر الإمارات",
        subWelcome: "ابحث في فهرسنا أو تحدث مع مساعدنا الذكي للعثور على ما تحتاجه بكل سهولة.",
        manualSearch: "البحث اليدوي",
        smartSearch: "اسأل صقر (AI)",
        bubble: "أهلاً بك! كيف أساعدك اليوم؟",
    },
    en: {
        welcome: "Welcome to Saqr Al Emarat School Library",
        subWelcome: "Explore our catalog or interact with our smart assistant to find your next great read.",
        manualSearch: "Manual Search",
        smartSearch: "Ask Saqr (AI)",
        bubble: "Hi! How can I help you today?",
    }
}

const BackgroundPattern = () => (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(0, 115, 47, 0.15), transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(239, 68, 68, 0.1), transparent 40%)
        `,
    }}></div>
);

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const SCHOOL_LOGO = "/school-logo.png"; 
    const SAQR_MASCOT = "/saqr-full.png"; 
    
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center p-4">
            {/* الحاوية الزجاجية الكبرى بنظام الشبكة (Grid) */}
            <div className="relative glass-panel w-full max-w-6xl rounded-[3.5rem] overflow-hidden shadow-2xl p-8 md:p-16 animate-in fade-in zoom-in duration-700">
                <BackgroundPattern />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* الجانب الأول: المحتوى النصي (الرسالة والأزرار) */}
                    <div className={`flex flex-col ${isAr ? 'text-start' : 'text-start'} space-y-10 order-2 lg:order-1`}>
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                                {t('welcome')}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
                                {t('subWelcome')}
                            </p>
                        </div>

                        {/* مجموعة الأزرار الزجاجية الملونة */}
                        <div className="flex flex-wrap gap-5">
                            <Link 
                                to="/search" 
                                className="glass-button-red font-black py-4 px-10 rounded-2xl active:scale-95 flex items-center gap-3 shadow-lg text-lg transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                {t('manualSearch')}
                            </Link>

                            <Link 
                                to="/smart-search" 
                                className="glass-button-green font-black py-4 px-10 rounded-2xl active:scale-95 flex items-center gap-3 shadow-lg text-lg transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                {t('smartSearch')}
                            </Link>
                        </div>
                    </div>

                    {/* الجانب الثاني: الهوية البصرية (الشعار التفاعلي والمساعد) */}
                    <div className="relative flex flex-col items-center justify-center order-1 lg:order-2">
                        
                        {/* شعار المدرسة الكبير في الخلفية بشكل جمالي - مائل 15 درجة */}
                        <div className="absolute opacity-15 dark:opacity-10 scale-150 pointer-events-none transition-all duration-700">
                             <img 
                                src={SCHOOL_LOGO} 
                                alt="Back Logo" 
                                className="h-64 w-64 md:h-80 md:w-80 object-contain rotate-12" 
                             />
                        </div>

                        {/* صقر المساعد كبطل للصورة */}
                        <div className="relative group transition-all duration-500 hover:scale-105">
                            <img 
                                src={SAQR_MASCOT} 
                                alt="Saqr Mascot" 
                                className="h-72 md:h-[450px] object-contain drop-shadow-[0_20px_50px_rgba(0,115,47,0.3)]" 
                            />
                            
                            {/* فقاعة الترحيب الزجاجية المنظمة */}
                            <div className="absolute -top-4 -right-8 glass-panel p-5 rounded-3xl shadow-2xl border-white/20 text-sm font-black text-green-800 dark:text-white max-w-[160px] animate-bounce">
                                {t('bubble')}
                                <div className="absolute -bottom-2 left-6 w-4 h-4 glass-panel border-r-2 border-b-2 border-white/10 rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* خطوط الهوية السفلية بألوان المدرسة الرسمية */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-between opacity-30 pointer-events-none">
                <div className="h-px w-1/4 bg-gradient-to-r from-transparent to-green-700"></div>
                <div className="h-px w-1/4 bg-gradient-to-l from-transparent to-red-600"></div>
            </div>
        </div>
    );
};

export default HomePage;
