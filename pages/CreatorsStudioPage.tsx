import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';

// --- الأيقونات البرمجية SVG ---
const IconPlay = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const IconStop = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="3"/></svg>;
const IconRead = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"/></svg>;
const IconArrowLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
const IconArrowRight = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

    // البيانات الأساسية
    const baseWorks = [
        { id: "1", title: isAr ? "أبي نبع العطاء" : "Father: Fountain of Giving", author: isAr ? "ياسين محمد مسعود" : "Yassin Mohamed", cover: "/cover/12.jpg", pdfUrl: "https://drive.google.com/file/d/1EcOPekgKRMhnq-HTiqU5hLrVxMIl2MEV/view?usp=drive_link", audioUrl: "/audio/أبي نبع العطاء.mp3" },
        { id: "2", title: isAr ? "الصدق منجاة" : "Honesty is Salvation", author: isAr ? "الصالح إسماعيل المصري" : "Al-Saleh Ismail", cover: "/cover/17.jpg", pdfUrl: "https://drive.google.com/file/d/1WbIIcUpBd2s4on8aMSiw20KCG5fpK-IA/view?usp=drive_link", audioUrl: "/audio/الصدق منجاة.mp3" },
        { id: "3", title: isAr ? "مسرحية اللغة العربية" : "Arabic Language Play", author: isAr ? "فاطمة فلاح الأحبابي" : "Fatima Al-Ahbabi", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/1DZk9Moh7CceSN5fpekCtxfRzNSzQiYMY/view?usp=drive_link", audioUrl: "/audio/اللغة العربية.mp3" },
        { id: "4", title: isAr ? "حلم سيتحقق" : "A Dream Will Come True", author: isAr ? "عدنان نزار" : "Adnan Nizar", cover: "/cover/16.jpg", pdfUrl: "https://drive.google.com/file/d/1nW4QxzZ3OmeOmH7r_F1I9W08OQbR1urJ/view?usp=drive_link", audioUrl: "/audio/حلم سيتحقق.mp3" },
        { id: "5", title: isAr ? "حين تهت وجدتني" : "When I Was Lost", author: isAr ? "ملك مجدي الدموكي" : "Malak Majdi", cover: "/cover/1.jpg", pdfUrl: "https://drive.google.com/file/d/1pMUrhpyM3dpFCqJqBTt3amN3p-oLO3Ij/view?usp=drive_link", audioUrl: "/audio/حين تهت وجدتني.mp3" },
        { id: "6", title: isAr ? "خطوات وحكايات" : "Steps and Tales", author: isAr ? "مريم عبدالرحمن" : "Maryam Abdulrahman", cover: "/cover/14.jpg", pdfUrl: "https://drive.google.com/file/d/1QGRNlRc2v-a1q-gUJUoi37zcxw0sz0Ls/view?usp=drive_link", audioUrl: "/audio/خطوات في ارض الذهب.mp3" },
        { id: "7", title: isAr ? "شجاعة في الصحراء" : "Courage in Desert", author: isAr ? "يمنى أيمن النجار" : "Yomna Ayman", cover: "/cover/13.jpg", pdfUrl: "https://drive.google.com/file/d/1b9H8XILdFZWsTCKmdgmJa9s5EoaNlp0r/view?usp=drive_link", audioUrl: "/audio/شجاعة.mp3" },
        { id: "8", title: isAr ? "ظل نخلة" : "Palm Shadow", author: isAr ? "محمد نور الراضي" : "Mohamed Nour", cover: "/cover/18.jpg", pdfUrl: "https://drive.google.com/file/d/1C3uWMm_sLYKbFJrgilzpxXt_TjlKm2bp/view?usp=drive_link", audioUrl: "/audio/قصة بوسعيد.mp3" },
        { id: "9", title: isAr ? "عندما يعود الخير" : "When Goodness Returns", author: isAr ? "سهيلة البلوشي" : "Suhaila Al-Balooshi", cover: "/cover/15.jpg", pdfUrl: "https://drive.google.com/file/d/1mxaLmat3IEg2SItPiLjLa7U-hqrACw2e/view?usp=drive_link", audioUrl: "/audio/عندما يعود الخير.mp3" },
        { id: "10", title: isAr ? "لمار تهمس" : "Lamar Whispers", author: isAr ? "ألين رافع فريحات" : "Aleen Rafe", cover: "/cover/11.jpg", pdfUrl: "https://drive.google.com/file/d/1C0S0PA-yg2RDmXCB6-MlMoRLp2mp-Utw/view?usp=drive_link", audioUrl: "/audio/لمار.mp3" }
    ];

    // ترتيب عشوائي عند التحميل
    const studentWorks = useMemo(() => {
        return [...baseWorks].sort(() => Math.random() - 0.5);
    }, [locale]);

    const handleAudioPlay = (id: string) => {
        const targetAudio = audioRefs.current.get(id);
        if (playingAudioId === id) {
            targetAudio?.pause();
            setPlayingAudioId(null);
        } else {
            audioRefs.current.forEach((audio) => { audio.pause(); audio.currentTime = 0; });
            targetAudio?.play().catch(() => {});
            setPlayingAudioId(id);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount, behavior: 'smooth' });
        }
    };

    // التمرير التلقائي
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const isEnd = dir === 'rtl' ? Math.abs(scrollLeft) + clientWidth >= scrollWidth - 100 : scrollLeft + clientWidth >= scrollWidth - 100;
                if (isEnd) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                else scrollRef.current.scrollBy({ left: dir === 'rtl' ? -clientWidth * 0.8 : clientWidth * 0.8, behavior: 'smooth' });
            }
        }, 6000);
        return () => clearInterval(interval);
    }, [dir]);

    return (
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-10 md:py-20 px-4 md:px-6">
            
            {/* 🌟 الخلفية الديناميكية النابضة 🌟 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-30">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/20 rounded-full blur-[120px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
               <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-12 md:gap-16 animate-fade-in-up pb-20">
                
                {/* --- 1. قسم الترحيب العلوي المُحسن --- */}
                <div className="text-center space-y-6 md:space-y-8 max-w-5xl mx-auto relative z-20 hover:scale-[1.01] transition-transform duration-700">
                    <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600 dark:from-red-400 dark:to-blue-400 leading-tight animate-text-reveal pb-2 drop-shadow-sm ${locale === 'en' ? 'tracking-tight' : ''}`}>
                        {isAr ? 'ركن المبدعين' : 'CREATORS CORNER'}
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto animate-text-reveal-delayed">
                        {isAr ? 'مساحة حيث تلتقي الأفكار المبتكرة لتشكل المستقبل. استكشف إبداعات زملائك في عالم التأليف.' : 'A space where innovative ideas meet to shape the future. Explore your peers\' authoring creations.'}
                    </p>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-red-600 to-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse"></div>
                </div>

                {/* --- 2. قسم المؤلف الصغير (المعرض الزجاجي التفاعلي) --- */}
                <div className="w-full relative z-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[4rem] border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 py-10 md:py-16 overflow-hidden">
                    
                    {/* لمعان زجاجي متحرك فوق الحاوية */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/40 to-transparent dark:from-white/0 dark:via-white/5 opacity-50 pointer-events-none"></div>

                    <div className="text-center mb-12 px-4 relative z-20 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                        <span className="inline-flex items-center gap-3 px-8 py-3 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 rounded-full text-sm md:text-lg font-bold uppercase tracking-widest shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-default">
                            <span className="animate-bounce">📚</span> {isAr ? 'مكتبة المؤلف الصغير' : 'The Little Author Library'}
                        </span>
                    </div>

                    <div className="relative px-2 md:px-16 group/container z-20">
                        {/* أزرار التمرير الجانبية (تظهر عند المرور) */}
                        <button onClick={() => scroll('left')} className="hidden md:flex absolute left-4 top-[45%] -translate-y-1/2 z-40 bg-white/90 dark:bg-slate-800/90 p-4 rounded-full shadow-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 opacity-0 group-hover/container:opacity-100 group-hover/container:-translate-x-2 hover:scale-110">
                            <IconArrowLeft />
                        </button>
                        <button onClick={() => scroll('right')} className="hidden md:flex absolute right-4 top-[45%] -translate-y-1/2 z-40 bg-white/90 dark:bg-slate-800/90 p-4 rounded-full shadow-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 opacity-0 group-hover/container:opacity-100 group-hover/container:translate-x-2 hover:scale-110">
                            <IconArrowRight />
                        </button>

                        {/* شريط التمرير للكروت */}
                        <div ref={scrollRef} className="flex overflow-x-auto gap-6 md:gap-8 pb-10 snap-x snap-mandatory no-scrollbar pt-4 px-6 md:px-4 scroll-smooth items-stretch">
                            {studentWorks.map((work) => (
                                <div key={work.id} className="w-[85vw] sm:w-[350px] md:w-[380px] flex-shrink-0 snap-center">
                                    
                                    {/* كارت الكتاب مع تأثيرات Hover */}
                                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.25)] dark:hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] h-full flex flex-col relative overflow-hidden group/card">
                                        
                                        {/* وهج خلفي خفيف داخل الكارت عند التمرير */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                        <div className="relative aspect-[3/4.2] rounded-[1.5rem] overflow-hidden mb-6 block shadow-sm group-hover/card:shadow-xl transition-shadow duration-500">
                                            <img src={work.cover} className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-700" alt={work.title} />
                                            
                                            {/* تأثير الغطاء عند المرور مع زر قراءة الـ PDF */}
                                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-center">
                                                <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-white/90 text-slate-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 hover:bg-white transition-all shadow-xl text-sm uppercase translate-y-4 group-hover/card:translate-y-0 duration-300">
                                                    {isAr ? 'قراءة الكتاب' : 'Read PDF'} <IconRead />
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <div className="text-start flex-1 flex flex-col relative z-10">
                                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover/card:text-red-600 dark:group-hover/card:text-red-400 transition-colors">{work.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base mb-6">{work.author}</p>
                                            
                                            {/* زر تشغيل الصوت */}
                                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                                <audio ref={el => { if(el) audioRefs.current.set(work.id, el); }} onEnded={() => setPlayingAudioId(null)} src={work.audioUrl} hidden />
                                                <button onClick={() => handleAudioPlay(work.id)} className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden relative ${playingAudioId === work.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-[1.02]' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                                    {playingAudioId === work.id && (
                                                        <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>
                                                    )}
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        {playingAudioId === work.id 
                                                            ? <><IconStop /> <span>{isAr ? 'إيقاف الاستماع' : 'Stop Audio'}</span></> 
                                                            : <><IconPlay /> <span>{isAr ? 'استمع للملخص' : 'Play Summary'}</span></>
                                                        }
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                /* تأثيرات كشف النص */
                @keyframes reveal-text {
                  0% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); transform: translateY(40px); opacity: 0; }
                  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translateY(0); opacity: 1; }
                }
                .animate-text-reveal { animation: reveal-text 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
                .animate-text-reveal-delayed { animation: reveal-text 1.2s cubic-bezier(0.77, 0, 0.175, 1) 0.3s forwards; clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); }

                /* الأشكال الخلفية العائمة والمتحركة (لتنبض بالحياة) */
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 8s infinite alternate ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                
                @keyframes fade-in-up {
                  0% { opacity: 0; transform: translateY(30px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
