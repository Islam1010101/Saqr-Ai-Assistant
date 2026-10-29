import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';
import './creatorsPortalVisual.css';

// --- الأيقونات البرمجية SVG ---
const IconPlay = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const IconStop = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="3"/></svg>;
const IconRead = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"/></svg>;
const UserIcon = () => (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const HeadphonesIcon = () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
);

// --- مكون التلاشي المخصص (Reveal Component) ---
const RevealOnScroll = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    const [isVisible, setIsVisible] = useState(true);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            {
                threshold: 0.15,
                rootMargin: "-20px 0px -20px 0px"
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={elementRef}
            className={`transition-all duration-700 ease-out transform w-full ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// --- بطاقة الكتاب بالتصميم الثنائي الأبعاد (2D Flat Design) المتطابق مع الموقع ---
const CreatorCard = React.memo(({ work, isPlaying, onPlayToggle, isAr }: { work: any, isPlaying: boolean, onPlayToggle: (id: string) => void, isAr: boolean }) => {
    const colors = [
        'from-sky-100 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-slate-900 dark:to-indigo-950',
        'from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-950 dark:via-slate-900 dark:to-teal-950',
        'from-rose-100 via-pink-50 to-orange-100 dark:from-rose-950 dark:via-slate-900 dark:to-rose-950',
        'from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950 dark:via-slate-900 dark:to-orange-950',
        'from-violet-100 via-purple-50 to-sky-100 dark:from-violet-950 dark:via-slate-900 dark:to-purple-950'
    ];
    const colorClass = colors[work.title.length % colors.length];

    return (
        <div className="creator-work-shell relative group flex w-full h-full min-h-[405px] md:min-h-[425px] items-stretch justify-center p-1">
            
            {isPlaying && (
                <div className="creator-playing-halo absolute inset-0 bg-emerald-300/20 dark:bg-emerald-600/10 blur-2xl rounded-[2rem] scale-105 pointer-events-none -z-10"></div>
            )}

            <div className="creator-work-card w-full h-full relative rounded-[1.85rem] border border-emerald-100 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-950 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-emerald-300 dark:group-hover:border-emerald-700 group-hover:shadow-2xl overflow-hidden flex flex-col">
                
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-400 to-amber-400 pointer-events-none z-30"></div>
                
                <div className={`relative h-[210px] w-full shrink-0 overflow-hidden bg-gradient-to-br ${colorClass} z-20`}>
                    <img src={work.cover} alt={work.title} className="w-full h-full object-contain p-4 drop-shadow-xl transform group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
                    <div className="absolute inset-x-3 bottom-3 z-30 flex items-center justify-center">
                        <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/80 bg-white/95 px-5 py-2 text-xs font-black text-emerald-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                            {isAr ? 'قراءة الكتاب' : 'Read Book'} <IconRead />
                        </a>
                    </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1 relative z-20 bg-white dark:bg-slate-950">
                    
                    <div className="flex-1 flex flex-col justify-center text-center mt-1">
                        <h3 className="min-h-[54px] font-black text-base sm:text-lg text-slate-900 dark:text-white leading-7 line-clamp-2 mb-2">
                            {work.title}
                        </h3>
                        <div className="flex max-w-full items-center gap-2 text-slate-600 dark:text-slate-300 justify-center bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-xl w-fit mx-auto mb-4">
                            <UserIcon />
                            <p className="text-xs sm:text-sm font-bold break-words" dir="auto">{work.author}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => onPlayToggle(work.id)} type="button" aria-pressed={isPlaying}
                        className={`creator-audio-button w-full min-h-11 py-2.5 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden mt-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${isPlaying ? 'bg-rose-600 text-white shadow-lg border border-rose-500' : 'bg-emerald-700 text-white hover:bg-emerald-800 border border-emerald-700 hover:shadow-lg'}`}
                    >
                        {isPlaying && <div className="creator-audio-glow absolute inset-0 bg-white/10 pointer-events-none"></div>}
                        <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest">
                            {isPlaying ? <><IconStop /> {isAr ? 'إيقاف' : 'Stop'}</> : <><HeadphonesIcon /> {isAr ? 'استمع للملخص' : 'Play Summary'}</>}
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
});

const CreatorsPortalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const [currentLocale, setCurrentLocale] = useState(locale || 'en');
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentLocale(locale);
    }, [locale]);

    const isAr = currentLocale === 'ar';
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const studentWorks = [
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


    const handleCreativePointerMove = (event: React.PointerEvent<HTMLElement>) => {
        if (event.pointerType !== 'mouse') return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)));
        const y = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)));
        event.currentTarget.style.setProperty('--creative-pointer-x', (x * 12).toFixed(1) + 'px');
        event.currentTarget.style.setProperty('--creative-pointer-y', (y * 10).toFixed(1) + 'px');
    };
    const resetCreativePointer = (event: React.PointerEvent<HTMLElement>) => {
        event.currentTarget.style.setProperty('--creative-pointer-x', '0px');
        event.currentTarget.style.setProperty('--creative-pointer-y', '0px');
    };

    return (
        <div dir={dir} className="creators-portal creator-gateway-v2 w-full min-h-[100dvh] flex flex-col items-center bg-[#F8FAF9] dark:bg-black font-sans relative overflow-x-hidden text-slate-900 dark:text-white transition-colors duration-500 pb-16">
            
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-60 dark:opacity-30">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-amber-400/15 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="creator-gateway-shell w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 antialiased">
                
                <nav className="mb-5 mt-6 flex flex-wrap items-center justify-between gap-3" aria-label={isAr ? 'التنقل' : 'Navigation'}>
                    <button type="button" onClick={() => navigate(-1)} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-white/90 dark:bg-slate-950 px-4 py-2.5 text-sm font-black text-emerald-800 dark:text-emerald-200 shadow-sm hover:-translate-y-0.5 hover:border-emerald-400 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                        <svg viewBox="0 0 24 24" className={'w-4 h-4 ' + (isAr ? 'rotate-180' : '')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>
                        {isAr ? 'العودة' : 'Back'}
                    </button>
                    <span className="inline-flex items-center gap-2 text-xs font-black text-slate-500 dark:text-slate-400"><img src="/school-logo.png" alt="EFIPS" className="h-8 w-8 object-contain"/>{isAr ? 'مكتبة صقر الإمارات' : 'EFIPS Library'}</span>
                </nav>
                <header className="creator-hero creator-gateway-hero relative text-white" onPointerMove={handleCreativePointerMove} onPointerLeave={resetCreativePointer}>
                    <div className="creator-gateway-tricolour" aria-hidden="true"><span className="bg-[#E23D40]"/><span className="bg-[#079457]"/><span className="bg-white"/><span className="bg-[#111C1A]"/></div>
                    <div className="creator-gateway-copy">
                        <span className="creator-gateway-eyebrow">
                            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v18M3 12h18M5 5l14 14M19 5 5 19"/></svg>
                            {isAr ? 'من أقلام طلابنا إلى مكتبتنا' : 'WRITTEN BY OUR STUDENTS'}
                        </span>
                        <h1 className="creator-gateway-title">{isAr ? 'بوابة المبدعين' : 'CREATORS PORTAL'}</h1>
                        <p className="creator-gateway-description">{isAr ? 'مساحة تلتقي فيها القصص والأفكار. اقرأ أعمال طلاب مدرسة صقر الإمارات واستمع إلى ملخصاتهم الصوتية.' : 'A home for stories and ideas. Explore creative writing by EFIPS students, read their works and listen to audio summaries.'}</p>
                        <div className="creator-gateway-stats">
                            <span className="creator-gateway-stat-icon" aria-hidden="true"><IconRead/></span>
                            <strong className="creator-gateway-stat-number">{studentWorks.length}</strong>
                            <span className="creator-gateway-stat-label">{isAr ? 'أعمال إبداعية' : 'Student creations'}</span>
                        </div>
                    </div>
                    <div className={'creator-gateway-art '+(isVisible?'opacity-100':'opacity-90')}>
                        <span className="creator-gateway-art-glow" aria-hidden="true"/>
                        <span className="creator-gateway-art-ring" aria-hidden="true"/>
                        <span className="creator-gateway-art-ring creator-gateway-art-ring-second" aria-hidden="true"/>
                        <span className="creator-gateway-symbol creator-gateway-symbol-book" aria-hidden="true"><IconRead/></span>
                        <span className="creator-gateway-symbol creator-gateway-symbol-pen" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m4 17 11-11a2 2 0 0 1 3 0l1 1a2 2 0 0 1 0 3L8 21l-5 1 1-5Zm8-8 4 4"/></svg></span>
                        <span className="creator-gateway-symbol creator-gateway-symbol-stars" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z"/></svg></span>
                        <span className="creator-gateway-spark creator-gateway-spark-first" aria-hidden="true"/>
                        <span className="creator-gateway-spark creator-gateway-spark-second" aria-hidden="true"/>
                        <img src="/Saqr%20Creative.png" alt={isAr ? 'صقر يشجع طلاب المدرسة على الإبداع' : 'Saqr celebrating student creativity'} className="creator-gateway-character" />
                    </div>
                </header>
                <section className="creator-collection-heading mb-6 flex flex-wrap items-end justify-between gap-3">
                    <div><p className="creator-collection-kicker text-xs font-black text-emerald-700 dark:text-emerald-400">{isAr ? 'مكتبة الإبداع' : 'CREATIVE COLLECTION'}</p><h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{isAr ? 'اكتشف إبداعات طلابنا' : 'Explore student creations'}</h2><p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{isAr ? 'اقرأ العمل أو استمع إلى ملخصه باستخدام الأزرار أسفل كل كتاب.' : 'Read a work or listen to its summary using the buttons on each book.'}</p></div>
                    <span className="creator-collection-count rounded-full border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-xs font-black text-emerald-800 dark:text-emerald-200">{studentWorks.length} {isAr ? 'أعمال' : 'works'}</span>
                </section>

                <div className="creator-works-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
                    {studentWorks.map((work, index) => (
                        <RevealOnScroll key={work.id} delay={(index % 4) * 100}>
                            <div className="w-full max-w-[420px] h-full mx-auto">
                                <CreatorCard 
                                    work={work} 
                                    isAr={isAr}
                                    isPlaying={playingAudioId === work.id} 
                                    onPlayToggle={handleAudioPlay} 
                                />
                            </div>
                            
                            <audio 
                                ref={el => { if(el) audioRefs.current.set(work.id, el); }} 
                                onEnded={() => setPlayingAudioId(null)} 
                                src={work.audioUrl} 
                                hidden 
                            />
                        </RevealOnScroll>
                    ))}
                </div>

                <RevealOnScroll delay={300}>
                    <section className="creator-outro relative mt-12 sm:mt-16 overflow-hidden rounded-[2rem] border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-[#FFF7E7] via-white to-emerald-50 dark:from-[#211B12] dark:via-slate-950 dark:to-emerald-950/20 p-6 sm:p-9 shadow-lg">
                        <div className="pointer-events-none absolute -end-14 -bottom-14 h-40 w-40 rounded-full border-[25px] border-amber-300/20" aria-hidden="true"/>
                        <div className="relative flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
                            <div className="shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
                                <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 8h27v30H8zM14 16h15M14 22h15M14 28h10M36 14l6 6-15 15-8 2 2-8 15-15Z"/><path d="m33 17 6 6"/></svg>
                            </div>
                            <div><p className="mb-1 text-xs font-black text-amber-700 dark:text-amber-300">{isAr ? 'المبدع القادم' : 'YOUR NEXT CHAPTER'}</p><h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-relaxed text-slate-900 dark:text-white">{isAr ? 'قريباً.. ستكون أنت أحد هؤلاء المبدعين!' : 'Soon.. You will be one of these creators!'}</h2></div>
                        </div>
                    </section>
                </RevealOnScroll>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                .creators-portal, .creators-portal * { font-family: 'Cairo', Tahoma, Arial, sans-serif; }
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb { background: #475569; }
                
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                .creators-portal .creator-work-card { transform: translateZ(0); }
                .creators-portal .creator-hero-art { animation: creator-art-float 6s ease-in-out infinite; }
                .creators-portal .creator-audio-glow, .creators-portal .creator-playing-halo { animation: creator-audio-pulse 2s ease-in-out infinite; }
                @keyframes creator-art-float { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
                @keyframes creator-audio-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }
                @media (prefers-reduced-motion: reduce) {
                    .creators-portal *, .creators-portal *::before, .creators-portal *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
                }
            `}</style>
        </div>
    );
};

export default CreatorsPortalPage;
