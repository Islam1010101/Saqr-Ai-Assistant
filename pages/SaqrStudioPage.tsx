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
    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-transparent opacity-50" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.2)_50%,transparent_55%)] animate-[shine_8s_infinite] opacity-40" />
  </div>
);

// --- مكون الموجات الصوتية المتحركة (خلفية زخرفية) ---
const AudioWaves = () => (
  <div className="flex items-center justify-center gap-1.5 opacity-20 dark:opacity-40 mb-8 h-12">
    {[...Array(9)].map((_, i) => (
      <div 
        key={i} 
        className="w-1.5 bg-slate-800 dark:bg-white rounded-full animate-wave" 
        style={{ animationDelay: `${i * 0.15}s`, height: i % 2 === 0 ? '100%' : '50%' }}
      ></div>
    ))}
  </div>
);

const SaqrStudioPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col justify-center items-center py-10 px-4 md:px-6 relative antialiased font-medium overflow-hidden">
            
            {/* الخلفية الديناميكية للهوية الوطنية (أحمر وأخضر) */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
               <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/30 blur-[150px] rounded-full animate-pulse-slow"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00732f]/30 blur-[150px] rounded-full animate-pulse-slow [animation-delay:2s]"></div>
            </div>

            <div className="w-full max-w-5xl mx-auto flex flex-col animate-fade-in-up relative z-10 items-center">
                
                {/* العنوان العلوي */}
                <div className="text-center mb-10 md:mb-14">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-6 drop-shadow-sm">{t('pageTitle')}</h1>
                    <div className="flex justify-center gap-2">
                        <div className="w-12 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                        <div className="w-12 h-1.5 bg-[#00732f] rounded-full shadow-[0_0_10px_rgba(0,115,47,0.5)]" />
                    </div>
                </div>

                {/* اللوحة الزجاجية الرئيسية */}
                <div className="relative w-full glass-panel rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-white/10 backdrop-blur-3xl flex flex-col items-center text-center transition-all duration-500 hover:shadow-red-500/10 dark:hover:shadow-green-500/10">
                    <ReflectionLayer />
                    
                    {/* الصورة الشخصية لصقر */}
                    <div className="relative w-56 h-56 md:w-72 md:h-72 mb-10 z-30 group">
                        {/* إطار مضيء خلفي يتفاعل مع الماوس */}
                        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-red-500 via-amber-400 to-[#00732f] opacity-40 blur-2xl group-hover:opacity-80 group-hover:blur-3xl transition-all duration-700 animate-spin-slow"></div>
                        
                        {/* الدائرة المحيطة بالصورة */}
                        <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-tr from-red-600 via-slate-200 to-[#00732f] shadow-2xl animate-spin-slow">
                            <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative shadow-inner [animation:spin_8s_linear_infinite_reverse]">
                                {/* الموجات الصوتية كخلفية للصورة */}
                                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-slate-200 dark:from-slate-800 to-transparent opacity-50"></div>
                                
                                <img 
                                    src={saqrAvatar} 
                                    alt="Saqr Studio Avatar" 
                                    className="relative w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] hover:scale-110 hover:-translate-y-2 transition-all duration-500 z-10" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* موجات صوتية ديكورية */}
                    <AudioWaves />

                    {/* النصوص */}
                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight z-30 uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-slate-800 to-[#00732f] dark:from-red-400 dark:via-white dark:to-green-400 drop-shadow-sm">
                        {t('comingSoon')}
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-bold mb-14 max-w-2xl z-30 leading-relaxed">
                        {t('studioDesc')}
                    </p>

                    {/* كروت البودكاست والدوبلاج */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 w-full z-30">
                        
                        {/* كارت البودكاست */}
                        <div className="group relative w-full sm:w-auto min-w-[200px] px-8 py-6 rounded-3xl bg-white/70 dark:bg-slate-800/50 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-md hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20 transition-all overflow-hidden cursor-default">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 drop-shadow-md">🎙️</div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 uppercase tracking-widest transition-colors">{t('podcast')}</h3>
                            </div>
                        </div>

                        {/* كارت الدوبلاج */}
                        <div className="group relative w-full sm:w-auto min-w-[200px] px-8 py-6 rounded-3xl bg-white/70 dark:bg-slate-800/50 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-md hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20 transition-all overflow-hidden cursor-default">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00732f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="text-5xl mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 drop-shadow-md">🎧</div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-[#00732f] dark:group-hover:text-green-400 uppercase tracking-widest transition-colors">{t('dubbing')}</h3>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                @keyframes shine {
                  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }

                @keyframes spin-slow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 10s linear infinite; }
                
                @keyframes pulse-slow {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 0.6; transform: scale(1.05); }
                }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }

                @keyframes wave {
                  0%, 100% { transform: scaleY(0.5); }
                  50% { transform: scaleY(1.5); }
                }
                .animate-wave { animation: wave 1s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default SaqrStudioPage;
