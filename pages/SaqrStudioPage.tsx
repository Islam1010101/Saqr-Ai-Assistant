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

// --- مكون الانعكاس الزجاجي ---
const ReflectionLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-transparent opacity-50" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.2)_50%,transparent_55%)] animate-[shine_8s_infinite] opacity-30" />
  </div>
);

// --- مكون الموجات الصوتية (Equalizer) بشكل استديو حقيقي ---
const AudioEqualizer = () => (
  <div className="flex items-end justify-center gap-1.5 md:gap-2 opacity-60 dark:opacity-80 mb-10 h-16 md:h-20">
    {[...Array(15)].map((_, i) => (
      <div 
        key={i} 
        className="w-1.5 md:w-2 bg-gradient-to-t from-red-600 to-[#00732f] dark:from-red-500 dark:to-green-400 rounded-t-full animate-equalizer drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]" 
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
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col justify-center items-center py-10 px-4 md:px-6 relative antialiased font-medium overflow-hidden bg-slate-50 dark:bg-slate-950">
            
            {/* الخلفية الديناميكية للهوية الوطنية (أحمر وأخضر) */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-30">
               <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/30 blur-[150px] rounded-full animate-pulse-slow"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00732f]/20 blur-[150px] rounded-full animate-pulse-slow [animation-delay:2s]"></div>
               {/* شبكة خفيفة تعطي إيحاء عزل الصوت */}
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwVjIwek0wIDIwaDIwdjIwSDBWMjB6bTIwIDBoMjB2MjBIMjBWMHoiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50 dark:opacity-20"></div>
            </div>

            <div className="w-full max-w-5xl mx-auto flex flex-col animate-fade-in-up relative z-10 items-center">
                
                {/* علامة على الهواء (ON AIR) */}
                <div className="mb-6 px-5 py-1.5 rounded-lg border-2 border-red-600 bg-red-600/10 text-red-600 dark:text-red-500 font-black tracking-widest text-sm md:text-base flex items-center gap-3 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                    <div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_8px_#dc2626]" /> 
                    {t('onAir')}
                </div>

                {/* العنوان العلوي */}
                <div className="text-center mb-10 md:mb-12">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-6 drop-shadow-sm">{t('pageTitle')}</h1>
                    <div className="flex justify-center gap-2">
                        <div className="w-16 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.6)]" />
                        <div className="w-16 h-1.5 bg-[#00732f] rounded-full shadow-[0_0_10px_rgba(0,115,47,0.6)]" />
                    </div>
                </div>

                {/* اللوحة الزجاجية الرئيسية (مساحة الاستديو) */}
                <div className="relative w-full glass-panel rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-white/10 backdrop-blur-3xl flex flex-col items-center text-center transition-all duration-500 hover:shadow-red-500/10 dark:hover:shadow-green-500/10">
                    <ReflectionLayer />
                    
                    {/* الصورة الشخصية لصقر - ثابتة مع إطارات متحركة */}
                    <div className="relative w-56 h-56 md:w-64 md:h-64 mb-12 z-30 group flex items-center justify-center">
                        
                        {/* إضاءة خلفية */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500 to-[#00732f] opacity-30 blur-2xl group-hover:opacity-60 transition-all duration-700"></div>
                        
                        {/* إطارات الاستديو الدوارة (خارجية فقط) */}
                        <div className="absolute -inset-6 rounded-full border-[3px] border-dashed border-slate-300 dark:border-slate-700 animate-[spin_15s_linear_infinite]"></div>
                        <div className="absolute -inset-2 rounded-full border-[3px] border-dotted border-red-500/50 animate-[spin_10s_linear_infinite_reverse]"></div>
                        
                        {/* الدائرة الحاضنة للصورة (ثابتة) */}
                        <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-tr from-red-600 via-slate-300 to-[#00732f] shadow-2xl z-10">
                            <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative shadow-inner">
                                {/* توهج داخلي */}
                                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-slate-200 dark:from-slate-800 to-transparent opacity-50"></div>
                                
                                {/* صورة صقر (تطفو ببطء ولكن لا تدور) */}
                                <img 
                                    src={saqrAvatar} 
                                    alt="Saqr Studio Avatar" 
                                    className="relative w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] animate-float z-20" 
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

                    {/* كروت البودكاست والدوبلاج (أزرار تحكم استديو) */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-3xl z-30">
                        
                        {/* كارت البودكاست (تم تحويله إلى رابط) */}
                        <Link to="/podcast" className="group relative w-full flex-1 px-6 py-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-red-500/50 dark:hover:border-red-500/50 hover:-translate-y-2 transition-all overflow-hidden flex flex-col items-center justify-center">
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    <span className="text-3xl drop-shadow-md">🎙️</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 uppercase tracking-widest transition-colors">{t('podcast')}</h3>
                            </div>
                        </Link>

                        {/* كارت الدوبلاج (مع علامة قريباً) */}
                        <div className="group relative w-full flex-1 px-6 py-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-[#00732f]/50 dark:hover:border-green-500/50 hover:-translate-y-2 transition-all overflow-hidden cursor-default flex flex-col items-center justify-center">
                            
                            {/* علامة قريباً */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-[#00732f] text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md animate-pulse">
                                {t('comingSoon')}
                            </div>

                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00732f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#00732f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    <span className="text-3xl drop-shadow-md">🎧</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white group-hover:text-[#00732f] dark:group-hover:text-green-400 uppercase tracking-widest transition-colors">{t('dubbing')}</h3>
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

                @keyframes pulse-slow {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 0.6; transform: scale(1.05); }
                }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }

                /* تأثير الطفو لصورة صقر */
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }

                /* تأثير الموجات الصوتية الحقيقية (Equalizer) */
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
