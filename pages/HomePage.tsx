import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
    ar: {
        welcome: "أهلاً بكم في مكتبة مدرسة صقر الإمارات الدولية الخاصة",
        subWelcome: "ابحث في فهرسنا أو تحدث مع مساعدنا الذكي للعثور على ما تحتاجه.",
        manualSearch: "بحث يدوي",
        smartSearch: "اسأل صقر",
    },
    en: {
        welcome: "Welcome to the Emirates Falcon International Private School Library",
        subWelcome: "Search our catalog or talk to our smart assistant to find what you need.",
        manualSearch: "Manual Search",
        smartSearch: "Ask Saqr",
    }
}

// A subtle geometric pattern for the background
const BackgroundPattern = () => (
    <div className="absolute inset-0 z-0 opacity-10 dark:opacity-[0.07]" style={{
        backgroundImage: `
            radial-gradient(circle at top right, rgba(0, 115, 47, 0.1), transparent 50%),
            radial-gradient(circle at bottom left, rgba(255, 0, 0, 0.05), transparent 50%)
        `,
    }}></div>
);


const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    return (
        <div className="relative flex flex-col items-center justify-center text-center h-full min-h-[70vh] rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg p-8">
            <BackgroundPattern />
            <div className="relative z-10 flex flex-col items-center">
                <img src="https://media.licdn.com/dms/image/v2/D4D0BAQH2J4sVBWyU9Q/company-logo_200_200/B4DZferhU8GgAI-/0/1751787640644/emirates_falcon_international_private_school_efips_logo?e=2147483647&v=beta&t=z8d76C6g0mI5SLMwFQS7TJ65jX8mN02QtIrFdJbxk8I" alt="School Logo" className="h-48 w-48 md:h-64 md:w-64 object-contain mb-8"/>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3 leading-snug">{t('welcome')}</h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">{t('subWelcome')}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/search"
                        className="bg-uae-red text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-red-700 transition-transform transform hover:scale-105"
                    >
                        {t('manualSearch')}
                    </Link>
                     <Link
                        to="/smart-search"
                        className="bg-uae-green text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-green-800 transition-transform transform hover:scale-105"
                    >
                        {t('smartSearch')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;