import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
// @ts-ignore
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import * as THREE from 'three';

const translations = {
    ar: {
        welcome: "أهلاً بكم في مكتبة مدرسة صقر الإمارات",
        subWelcome: "ابحث في فهرسنا أو تحدث مع مساعدنا الذكي للعثور على ما تحتاجه بكل سهولة.",
        manualSearch: "البحث اليدوي",
        smartSearch: "اسأل صقر (AI)",
        schoolWebsite: "موقع المدرسة",
        bubble: "أهلاً بك! أنا صقر، كيف أساعدك اليوم؟",
    },
    en: {
        welcome: "Welcome to Saqr Al Emarat School Library",
        subWelcome: "Explore our catalog or interact with our smart assistant to find your next great read.",
        manualSearch: "Manual Search",
        smartSearch: "Ask Saqr (AI)",
        schoolWebsite: "School Website",
        bubble: "Hi! How can I help you today?",
    }
}

const HomePage: React.FC = () => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const vantaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            setVantaEffect(
                CLOUDS({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    backgroundColor: 0xffffff,
                    skyColor: 0xdbedff,
                    cloudColor: 0xadc1d1,
                    sunColor: 0x00732f, // لون أخضر المدرسة
                    speed: 1.2
                })
            );
        }
        return () => { if (vantaEffect) vantaEffect.destroy(); };
    }, [vantaEffect]);

    const SCHOOL_LOGO = "/school-logo.png"; 
    const SAQR_MASCOT = "/saqr-full.png"; 

    return (
        <div className="relative min-h-[85vh] flex items-center justify-center p-4 overflow-hidden">
            {/* سحب Vanta المتحركة في الخلفية */}
            <div ref={vantaRef} className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none"></div>

            <div className="relative z-10 glass-panel w-full max-w-6xl rounded-[3.5rem] overflow-hidden shadow-2xl p-8 md:p-16 animate-in fade-in zoom-in duration-700 border-white/30 dark:border-gray-700/30">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* الجانب النصي والأزرار */}
                    <div className="flex flex-col text-start space-y-10 order-2 lg:order-1">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                                {t('welcome')}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
                                {t('subWelcome')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/search" className="glass-button-red font-black py-4 px-10 rounded-2xl active:scale-95 flex items-center gap-3 shadow-lg text-lg">
                                {t('manualSearch')}
                            </Link>
                            <Link to="/smart-search" className="glass-button-green font-black py-4 px-10 rounded-2xl active:scale-95 flex items-center gap-3 shadow-lg text-lg">
                                {t('smartSearch')}
                            </Link>
                            <a href="https://www.falcon-school.com" target="_blank" rel="noopener noreferrer" className="glass-button-black font-black py-4 px-10 rounded-2xl active:scale-95 flex items-center gap-3 shadow-lg text-lg transition-all">
                                {t('schoolWebsite')}
                            </a>
                        </div>
                    </div>

                    {/* الجانب البصري (المساعد والشعار المائل) */}
                    <div className="relative flex flex-col items-center justify-center order-1 lg:order-2">
                        <div className="absolute opacity-15 dark:opacity-10 scale-150 pointer-events-none">
                             <img src={SCHOOL_LOGO} alt="Back Logo" className="h-64 w-64 md:h-80 md:w-80 object-contain rotate-12" />
                        </div>
                        <div className="relative group transition-all duration-500 hover:scale-105">
                            <img src={SAQR_MASCOT} alt="Saqr Mascot" className="h-72 md:h-[450px] object-contain drop-shadow-[0_20px_50px_rgba(0,115,47,0.3)]" />
                            <div className="absolute -top-4 -right-8 glass-panel p-5 rounded-3xl shadow-2xl border-white/20 text-sm font-black text-green-800 dark:text-white max-w-[160px] animate-bounce">
                                {t('bubble')}
                                <div className="absolute -bottom-2 left-6 w-4 h-4 glass-panel border-r-2 border-b-2 border-white/10 rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
