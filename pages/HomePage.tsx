import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "أهلاً بكم في مكتبة مدرسة صقر الإمارات الدولية الخاصة",
        subWelcome: "ابحث في فهرسنا أو تحدث مع مساعدنا الذكي للعثور على ما تحتاجه بكل سهولة.",
        manualSearch: "البحث اليدوي",
        smartSearch: "اسأل صقر (AI)",
        bubble: "أهلاً بك! أنا صقر، كيف أساعدك اليوم؟",
    },
    en: {
        welcome: "Welcome to the Emirates Falcon International Private School Library",
        subWelcome: "Explore our catalog or interact with our smart assistant to find your next great read.",
        manualSearch: "Manual Search",
        smartSearch: "Ask Saqr (AI)",
        bubble: "Hi there! I'm Saqr, how can I help you today?",
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
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    // تعريف المسارات الجديدة
    const SCHOOL_LOGO = "/school-logo.png"; 
    const SAQR_MASCOT = "/saqr-full.png"; // الشخصية الكاملة التي رفعتها
    
    return (
        <div className="relative flex flex-col items-center justify-center text-center min-h-[80vh] rounded-[3rem] overflow-hidden bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl p-6 md:p-12 animate-in fade-in zoom-in duration-700">
            <BackgroundPattern />
            
            <div className="relative z-10 flex flex-col items-center max-w-5xl w-full">
                
                {/* قسم الشعار الرسمي - الحفاظ على الإمالة */}
                <div className="relative mb-12 group">
                    <div className="absolute -inset-4 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500"></div>
                    <img 
                        src={SCHOOL_LOGO} 
                        alt="School Logo" 
                        className="relative h-40 w-40 md:h-56 md:w-56 object-contain drop-shadow-2xl rotate-6 transition-transform"
                    />
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
                    
                    {/* الجانب الأيسر: شخصية صقر والفقاعة الترحيبية */}
                    <div className="relative flex-shrink-0 animate-in slide-in-from-start duration-1000 order-2 lg:order-1">
                        <img 
                            src={SAQR_MASCOT} 
                            alt="Saqr Mascot" 
                            className="h-64 md:h-96 object-contain drop-shadow-2xl" 
                        />
                        {/* فقاعة ترحيبية فوق صقر */}
                        <div className="absolute -top-6 -right-6 md:-right-12 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-2xl border-2 border-green-700/20 text-sm font-black text-green-800 dark:text-green-400 max-w-[180px] animate-bounce">
                            {t('bubble')}
                            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-green-700/20 rotate-45"></div>
                        </div>
                    </div>

                    {/* الجانب الأيمن: العناوين والأزرار */}
                    <div className="flex-grow text-center lg:text-start order-1 lg:order-2">
                        <h1 className="text-3xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                            {t('welcome')}
                        </h1>
                        
                        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-medium mb-10 max-w-2xl leading-relaxed">
                            {t('subWelcome')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link
                                to="/search"
                                className="group relative bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-black py-5 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 overflow-hidden border border-gray-100 dark:border-gray-700"
                            >
                                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    {t('manualSearch')}
                                </span>
                            </Link>

                            <Link
                                to="/smart-search"
                                className="group relative bg-green-700 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-green-700/20 hover:bg-green-800 transition-all active:scale-95 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    {t('smartSearch')}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* لمسة جمالية سفلية */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-between opacity-20 pointer-events-none">
                <div className="h-px w-1/4 bg-gradient-to-r from-transparent to-green-700"></div>
                <div className="h-px w-1/4 bg-gradient-to-l from-transparent to-red-600"></div>
            </div>
        </div>
    );
};

export default HomePage;
