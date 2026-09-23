import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

// --- مسار الصورة المباشر من مجلد public ---
const saqrAvatar = '/Saqr_Studio.png'; 

const translations = {
  ar: {
    pageTitle: "استديو صقر",
    comingSoon: "قريباً",
    podcast: "بودكاست",
    dubbing: "دوبلاج",
    studioDesc: "مساحتك الإبداعية للتعبير، الإلقاء، والتمثيل الصوتي.",
    onAir: "على الهواء"
  },
  en: {
    pageTitle: "Saqr Studio",
    comingSoon: "COMING SOON",
    podcast: "Podcast",
    dubbing: "Dubbing",
    studioDesc: "Your creative space to express, narrate, and voice act.",
    onAir: "ON AIR"
  }
};

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const PodcastIcon = () => (
    <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const DubbingIcon = () => (
    <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
);

// --- مكون الموجات الصوتية (Equalizer) ---
const AudioEqualizer = () => (
  <div className="flex items-end justify-center gap-2 opacity-80 mb-12 h-16 md:h-20">
    {[...Array(15)].map((_, i) => (
      <div 
        key={i} 
        className="w-2 md:w-3 bg-rose-500 dark:bg-rose-400 rounded-t-full animate-equalizer" 
        style={{ 
          animationDelay: `${Math.random() * 0.5}s`, 
          animationDuration: `${0.6 + Math.random() * 0.5}s`,
          height: `${20 + Math.random() * 80}%` 
        }}
      ></div>
    ))}
  </div>
);

const SaqrStudioPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col justify-center items-center py-10 px-4 md:px-6 relative antialiased font-medium overflow-hidden bg-[#f8fafc] dark:bg-slate-950">
            
            {/* 🌟 الخلفية الديناميكية (ألوان طفولية ومبهجة) 🌟 */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-400/30 blur-[150px] rounded-full animate-pulse-slow"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-sky-400/30 blur-[150px] rounded-full animate-pulse-slow [animation-delay:2s]"></div>
            </div>

            <div className="w-full max-w-5xl mx-auto flex flex-col animate-fade-in-up relative z-10 items-center">
                
                {/* علامة على الهواء (ON AIR) */}
                <div className="mb-6 px-6 py-2 rounded-full border-4 border-rose-500 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-500 font-black tracking-widest text-sm md:text-base flex items-center gap-3 animate-pulse shadow-md">
                    <div className="w-3 h-3 bg-rose-600 rounded-full shadow-[0_0_8px_#f43f5e]" /> 
                    {t('onAir')}
                </div>

                {/* العنوان العلوي */}
                <div className="text-center mb-10 md:mb-12">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-6 drop-shadow-sm">{t('pageTitle')}</h1>
                    <div className="flex justify-center gap-3">
                        <div className="w-16 h-2 bg-rose-500 rounded-full" />
                        <div className="w-16 h-2 bg-sky-500 rounded-full" />
                    </div>
                </div>

                {/* اللوحة الرئيسية (مساحة الاستديو بستايل ألعاب مبهج) */}
                <div className="relative w-full bg-white dark:bg-slate-800 rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 border-4 border-slate-200 dark:border-slate-700 shadow-xl flex flex-col items-center text-center">
                    
                    {/* الصورة الشخصية لصقر مع الشعار الخلفي */}
                    <div className="relative w-56 h-56 md:w-64 md:h-64 mb-12 z-30 group flex items-center justify-center">
                        
                        {/* الشعار الخلفي الباهت */}
                        <img 
                            src="/school-logo.png" 
                            alt="School Logo" 
                            className="absolute inset-0 m-auto w-[130%] h-[130%] object-contain opacity-10 dark:opacity-20 dark:invert z-0 pointer-events-none rotate-12 transition-all duration-1000" 
                        />
                        
                        {/* إضاءة خلفية دائرية */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-400 to-sky-400 opacity-40 blur-2xl group-hover:opacity-60 transition-all duration-700"></div>
                        
                        {/* إطارات الاستديو الدوارة (خارجية فقط) */}
                        <div className="absolute -inset-6 rounded-full border-[4px] border-dashed border-rose-300 dark:border-rose-800 animate-[spin_15s_linear_infinite]"></div>
                        
                        {/* الدائرة الحاضنة للصورة */}
                        <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-500 shadow-lg z-10">
                            <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative shadow-inner">
                                <img 
                                    src={saqrAvatar} 
                                    alt="Saqr Studio Avatar" 
                                    className="relative w-full h-full object-contain animate-float z-20" 
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* النصوص */}
                    <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 font-bold mb-10 max-w-2xl z-30 leading-relaxed">
                        {t('studioDesc')}
                    </p>

                    {/* موجات صوتية ديكورية (Equalizer) */}
                    <div className="w-full max-w-md z-30">
                        <AudioEqualizer />
                    </div>

                    {/* أزرار الاستديو بستايل ألعاب */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-3xl z-30">
                        
                        {/* زر البودكاست */}
                        <Link 
                            to="/podcast" 
                            className="w-full max-w-sm px-6 py-6 md:py-8 rounded-[2.5rem] bg-rose-500 text-white border-b-8 border-rose-700 hover:-translate-y-2 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center shadow-md group"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                <PodcastIcon />
                            </div>
                            <h3 className="text-xl md:text-3xl font-black uppercase tracking-widest">{t('podcast')}</h3>
                        </Link>

                        {/* زر الدوبلاج (غير مفعل / قريباً) */}
                        <div className="w-full max-w-sm px-6 py-6 md:py-8 rounded-[2.5rem] bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-b-8 border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center shadow-sm relative overflow-hidden cursor-not-allowed">
                            <div className="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center mb-4 shadow-inner opacity-50">
                                <DubbingIcon />
                            </div>
                            <h3 className="text-xl md:text-3xl font-black uppercase tracking-widest opacity-50">{t('dubbing')}</h3>
                            
                            {/* شريط "قريباً" */}
                            <div className="absolute top-6 -right-10 bg-amber-400 text-slate-900 font-black text-[10px] md:text-xs py-1 px-10 rotate-45 uppercase tracking-widest shadow-md">
                                {t('comingSoon')}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

                @keyframes pulse-slow {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 0.6; transform: scale(1.05); }
                }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }

                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }

                @keyframes equalizer {
                  0%, 100% { transform: scaleY(0.8); }
                  50% { transform: scaleY(1.2); }
                }
                .animate-equalizer { 
                    animation-name: equalizer;
                    animation-iteration-count: infinite;
                    animation-direction: alternate;
                    animation-timing-function: ease-in-out;
                    transform-origin: bottom; 
                }
            `}</style>
        </div>
    );
};

export default SaqrStudioPage;
