import React from 'react';
import { useLanguage } from '../App';

// --- مسار الصورة المباشر من مجلد public ---
const saqrAvatar = '/Saqr_Studio.png'; 

const translations = {
  ar: {
    pageTitle: "استوديو صقر",
    comingSoon: "قريباً",
    podcast: "بودكاست",
    dubbing: "دوبلاج",
    studioDesc: "مساحتك للتعبير، الإلقاء، والتمثيل الصوتي.",
  },
  en: {
    pageTitle: "Saqr Studio",
    comingSoon: "COMING SOON",
    podcast: "Podcast",
    dubbing: "Dubbing",
    studioDesc: "Your space to express, narrate, and voice act.",
  }
};

// --- مكون الانعكاس الزجاجي ---
const ReflectionLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-40" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] animate-[shine_10s_infinite] opacity-30" />
  </div>
);

const SaqrStudioPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col justify-center items-center py-10 px-4 md:px-6 relative antialiased font-medium overflow-hidden">
            
            {/* الخلفية الديناميكية للهوية الوطنية (أحمر وأخضر) */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-30">
               <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/15 dark:bg-red-500/20 blur-[150px] rounded-full animate-pulse"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00732f]/15 dark:bg-green-500/20 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
            </div>

            <div className="w-full max-w-4xl mx-auto flex flex-col animate-fade-in-up relative z-10 items-center">
                
                {/* العنوان العلوي */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-4">{t('pageTitle')}</h1>
                    <div className="flex justify-center gap-1.5">
                        <div className="w-8 h-1.5 bg-red-600 rounded-full shadow-lg" />
                        <div className="w-8 h-1.5 bg-[#00732f] rounded-full shadow-lg" />
                    </div>
                </div>

                {/* اللوحة الزجاجية الرئيسية */}
                <div className="relative w-full glass-panel rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl bg-white/70 dark:bg-slate-900/70 border border-white/40 dark:border-white/10 backdrop-blur-3xl flex flex-col items-center text-center">
                    <ReflectionLayer />
                    
                    {/* الصورة الشخصية لصقر */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 z-30 group">
                        {/* إطار مضيء حول الصورة */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600 to-[#00732f] opacity-70 group-hover:opacity-100 blur-md transition-opacity duration-500 animate-spin-slow"></div>
                        
                        <div className="relative w-full h-full rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-950">
                            <img 
                                src={saqrAvatar} 
                                alt="Saqr Studio Avatar" 
                                className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700" 
                            />
                        </div>
                    </div>

                    {/* النصوص */}
                    <h2 className="text-5xl md:text-7xl font-black text-slate-950 dark:text-white mb-4 tracking-tight animate-pulse z-30 uppercase">
                        {t('comingSoon')}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-semibold mb-12 max-w-lg z-30">
                        {t('studioDesc')}
                    </p>

                    {/* الفواصل وكلمات البودكاست والدوبلاج */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 w-full z-30">
                        {/* كارت البودكاست */}
                        <div className="w-full sm:w-auto px-8 py-5 rounded-3xl bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md hover:-translate-y-1 transition-transform">
                            <div className="text-3xl mb-2">🎙️</div>
                            <h3 className="text-xl md:text-2xl font-bold text-red-600 uppercase tracking-widest">{t('podcast')}</h3>
                        </div>

                        {/* كارت الدوبلاج */}
                        <div className="w-full sm:w-auto px-8 py-5 rounded-3xl bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md hover:-translate-y-1 transition-transform">
                            <div className="text-3xl mb-2">🎧</div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#00732f] uppercase tracking-widest">{t('dubbing')}</h3>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                @keyframes shine {
                  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }

                @keyframes spin-slow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `}</style>
        </div>
    );
};

export default SaqrStudioPage;
