import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../App';

// --- 1. الأيقونات البرمجية (عشان نتفادى مشاكل الـ Build) ---
const IconPlay = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const IconStop = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>;
const IconRead = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"/></svg>;

const ReflectionLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-40" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] animate-[shine_10s_infinite] opacity-30" />
  </div>
);

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const [bursts, setBursts] = useState<any[]>([]);
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

    const studentWorks = [
        { id: "1", title: isAr ? "أبي نبع العطاء" : "Father: Fountain of Giving", author: isAr ? "ياسين محمد مسعود" : "Yassin Mohamed", cover: "/cover/12.jpg", pdfUrl: "https://drive.google.com/file/d/1EcOPekgKRMhnq-HTiqU5hLrVxMIl2MEV/view?usp=drive_link", audioUrl: "/audio/أبي نبع العطاء.mp3" },
        { id: "2", title: isAr ? "الصدق منجاة" : "Honesty is Salvation", author: isAr ? "الصالح إسماعيل المصري" : "Al-Saleh Ismail", cover: "/cover/17.jpg", pdfUrl: "https://drive.google.com/file/d/1WbIIcUpBd2s4on8aMSiw20KCG5fpK-IA/view?usp=drive_link", audioUrl: "/audio/الصدق منجاة.mp3" },
        { id: "3", title: isAr ? "مسرحية اللغة العربية" : "Arabic Language Play", author: isAr ? "فاطمة فلاح الأحبابي" : "Fatima Al-Ahbabi", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/1DZk9Moh7CceSN5fpekCtxfRzNSzQiYMY/view?usp=drive_link", audioUrl: "/audio/اللغة العربية.mp3" },
        { id: "4", title: isAr ? "حلم سيتحقق" : "A Dream Will Come True", author: isAr ? "عدنان نزار" : "Adnan Nizar", cover: "/cover/16.jpg", pdfUrl: "https://drive.google.com/file/d/1nW4QxzZ3OmeOmH7r_F1I9W08OQbR1urJ/view?usp=drive_link", audioUrl: "/audio/حلم سيتحقق.mp3" },
        { id: "5", title: isAr ? "حين تهت وجدتني" : "When I Was Lost, I Found Myself", author: isAr ? "ملك مجدي الدموكي" : "Malak Majdi", cover: "/cover/1.jpg", pdfUrl: "https://drive.google.com/file/d/1pMUrhpyM3dpFCqJqBTt3amN3p-oLO3Ij/view?usp=drive_link", audioUrl: "/audio/حين تهت وجدتني.mp3" },
        { id: "6", title: isAr ? "خطوات وحكايات" : "Steps and Tales", author: isAr ? "مريم عبدالرحمن" : "Maryam Abdulrahman", cover: "/cover/14.jpg", pdfUrl: "https://drive.google.com/file/d/1QGRNlRc2v-a1q-gUJUoi37zcxw0sz0Ls/view?usp=drive_link", audioUrl: "/audio/خطوات في ارض الذهب.mp3" },
        { id: "7", title: isAr ? "شجاعة في الصحراء" : "Courage in the Desert", author: isAr ? "يمنى أيمن النجار" : "Yomna Ayman", cover: "/cover/13.jpg", pdfUrl: "https://drive.google.com/file/d/1b9H8XILdFZWsTCKmdgmJa9s5EoaNlp0r/view?usp=drive_link", audioUrl: "/audio/شجاعة.mp3" },
        { id: "8", title: isAr ? "ظل نخلة" : "Palm Shadow", author: isAr ? "محمد نور الراضي" : "Mohamed Nour", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/1C3uWMm_sLYKbFJrgilzpxXt_TjlKm2bp/view?usp=drive_link", audioUrl: "/audio/قصة بوسعيد.mp3" },
        { id: "9", title: isAr ? "عندما يعود الخير" : "When Goodness Returns", author: isAr ? "سهيلة البلوشي" : "Suhaila Al-Balooshi", cover: "/cover/15.jpg", pdfUrl: "https://drive.google.com/file/d/1mxaLmat3IEg2SItPiLjLa7U-hqrACw2e/view?usp=drive_link", audioUrl: "/audio/عندما يعود الخير.mp3" },
        { id: "10", title: isAr ? "لمار تهمس" : "Lamar Whispers", author: isAr ? "ألين رافع فريحات" : "Aleen Rafe", cover: "/cover/11.jpg", pdfUrl: "https://drive.google.com/file/d/1C0S0PA-yg2RDmXCB6-MlMoRLp2mp-Utw/view?usp=drive_link", audioUrl: "/audio/لمار.mp3" }
    ];

    const handleAudioPlay = (id: string) => {
        if (playingAudioId === id) {
            audioRefs.current[id]?.pause();
            setPlayingAudioId(null);
        } else {
            Object.keys(audioRefs.current).forEach(key => audioRefs.current[key]?.pause());
            audioRefs.current[id]?.play();
            setPlayingAudioId(id);
        }
    };

    const spawnMagic = () => {
        const id = Date.now();
        setBursts(p => [...p, { id, tx: (Math.random() - 0.5) * 400, ty: -350, rot: Math.random() * 180 }]);
        setTimeout(() => setBursts(c => c.filter(b => b.id !== id)), 1000);
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 font-black antialiased overflow-x-hidden relative selection:bg-red-600/30 pb-32">
            
            {/* الخلفية الحيوية الموحدة للموقع */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 dark:bg-red-500/10 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-600/10 dark:bg-green-500/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
            </div>

            {/* الهيدر الملكي */}
            <header className="relative pt-24 md:pt-32 pb-16 text-center px-4 z-10">
                <h1 className="text-6xl md:text-[10rem] font-black mb-4 tracking-tighter leading-none text-slate-950 dark:text-white drop-shadow-2xl animate-fade-up">
                    {isAr ? 'بوابة المبدعين' : 'CREATORS PORTAL'}
                </h1>
                <div className="flex items-center justify-center gap-4 animate-in zoom-in duration-1000">
                    <div className="h-[2px] w-12 md:w-24 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                    <div className="w-4 h-4 bg-green-600 rounded-full animate-ping"></div>
                    <div className="h-[2px] w-12 md:w-24 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                </div>
            </header>

            {/* القسم الأول: المؤلف الصغير (عرض الكتالوج) */}
            <section className="relative mb-40 z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-10 py-4 bg-white/60 dark:bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[2rem] shadow-2xl animate-fade-up">
                        <h2 className="text-2xl md:text-5xl font-black text-red-600 uppercase tracking-widest flex items-center gap-4">
                           📚 {isAr ? 'قسم المؤلف الصغير' : 'The Little Author'}
                        </h2>
                    </span>
                </div>

                <div className="relative max-w-[1850px] mx-auto px-4 md:px-20">
                    <div ref={scrollRef} className="flex overflow-x-auto gap-10 md:gap-14 pb-16 snap-x snap-mandatory no-scrollbar pt-6 px-4">
                        {studentWorks.map((work) => (
                            <div key={work.id} className="w-[85vw] md:w-[450px] flex-shrink-0 snap-center group">
                                <div className="relative bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[4rem] p-8 border border-white/40 dark:border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.4)] transition-all duration-700 hover:-translate-y-6">
                                    <ReflectionLayer />
                                    
                                    <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-[3/4.2] rounded-[3rem] overflow-hidden mb-10 block ring-8 ring-black/5 dark:ring-white/5 shadow-3xl transform group-hover:scale-[1.03] transition-all duration-700">
                                        <img src={work.cover} className="w-full h-full object-cover" alt={work.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-end pb-12">
                                            <div className="bg-red-600 text-white font-black px-12 py-6 rounded-[2rem] shadow-2xl scale-75 group-hover:scale-100 transition-all duration-700 flex items-center gap-4 text-xl">
                                                {isAr ? 'تصفح العمل' : 'View PDF'} <IconRead />
                                            </div>
                                        </div>
                                    </a>

                                    <div className="text-center px-4">
                                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-red-600 transition-colors duration-500">{work.title}</h3>
                                        <p className="text-green-600 dark:text-green-400 font-bold text-lg md:text-xl mb-10 tracking-widest uppercase">{work.author}</p>
                                        
                                        {/* مشغل الصوت الزجاجي المطور */}
                                        <div className="bg-slate-950/90 dark:bg-black/80 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/10 shadow-inner transition-all duration-500 group-hover:border-red-600/40">
                                            <audio ref={el => audioRefs.current[work.id] = el} onPlay={() => setPlayingAudioId(work.id)} onEnded={() => setPlayingAudioId(null)} src={work.audioUrl} hidden />
                                            <button 
                                                onClick={() => handleAudioPlay(work.id)}
                                                className={`w-full py-5 rounded-[1.8rem] font-black text-xl flex items-center justify-center gap-5 transition-all duration-300 ${playingAudioId === work.id ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.5)]' : 'bg-white/5 text-white hover:bg-white/15'}`}
                                            >
                                                {playingAudioId === work.id ? <><IconStop /> {isAr ? 'إيقاف' : 'Stop'}</> : <><IconPlay /> {isAr ? 'استمع للملخص' : 'Listen Summary'}</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* القسم الثاني: المخترع الصغير (تفاعل صقر) */}
            <section className="py-40 relative overflow-hidden bg-white/30 dark:bg-white/5 backdrop-blur-3xl border-y border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center px-6 relative z-10">
                    <div className="mb-24">
                        <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-14 py-6 rounded-full border-2 border-yellow-500/30 text-3xl font-black tracking-[0.3em] uppercase shadow-2xl backdrop-blur-xl">
                             💡 {isAr ? 'قسم المخترع الصغير' : 'The Little Inventor'}
                        </span>
                    </div>

                    <div className="relative group cursor-pointer" onClick={spawnMagic}>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-yellow-500/20 to-green-600/20 blur-[180px] rounded-full group-hover:scale-150 transition-all duration-1000 animate-pulse"></div>
                        
                        <div className="relative z-10">
                            {bursts.map(b => (
                                <div key={b.id} className="absolute z-50 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-base md:text-2xl font-black px-10 py-5 rounded-[2rem] shadow-3xl animate-magic-float whitespace-nowrap border-2 border-yellow-500"
                                     style={{'--tx': `${b.tx}px`, '--rot': `${b.rot}deg`} as any}>
                                    {isAr ? 'ابتكار مذهل ⚡' : 'AMAZING IDEA ⚡'}
                                </div>
                            ))}
                            <img src="/creators-mascot.png" className="h-[450px] md:h-[800px] object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,0.3)] animate-float" alt="Mascot" />
                        </div>
                    </div>

                    <div className="mt-28 relative">
                         <h2 className="text-[12rem] md:text-[25rem] font-black text-slate-900 dark:text-white italic tracking-tighter leading-none opacity-[0.04] absolute -bottom-20 left-1/2 -translate-x-1/2 select-none uppercase">Saqr</h2>
                        <div className="relative z-10 space-y-10 animate-fade-up">
                            <h3 className="text-6xl md:text-[11rem] font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-none">
                                {isAr ? 'قريباً' : 'COMING SOON'}
                            </h3>
                            <div className="w-64 h-4 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 mx-auto rounded-full shadow-2xl"></div>
                            <p className="text-2xl md:text-5xl text-slate-600 dark:text-slate-400 font-bold opacity-80 leading-relaxed italic max-w-4xl">
                                {isAr ? 'منصة عرض الابتكارات والمشاريع الهندسية لطلابنا المبدعين' : 'Showcasing engineering innovations and projects for our creative students'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes shine { 
                    0% { transform: translate(-100%, -100%) rotate(45deg); } 
                    100% { transform: translate(100%, 100%) rotate(45deg); } 
                }
                @keyframes magic-float {
                    0% { transform: translate(0,0) scale(0); opacity: 0; }
                    20% { opacity: 1; transform: translate(var(--tx), -200px) scale(1.2) rotate(var(--rot)); }
                    100% { transform: translate(calc(var(--tx) * 1.5), -550px) scale(0.5); opacity: 0; }
                }
                .animate-magic-float { animation: magic-float 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-40px); } }
                .logo-smart-filter { transition: filter 0.5s ease; }
                .dark .logo-smart-filter { filter: brightness(0) invert(1); }
                * { font-style: normal !important; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
