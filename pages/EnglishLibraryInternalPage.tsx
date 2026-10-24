import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/utils/supabase';
import { useReadingPassport, digitalBookKey } from '../src/utils/readingPassport';
import DigitalBookRating from '../src/components/DigitalBookRating';

// --- 1. تعريف واجهة البيانات وقاعدة البيانات ---
interface Book {
    id: number | string;
    title: string;
    author: string;
    subject: string;
    driveLink: string;
    bio: string;
    summary: string;
    publisher?: string;
    audioId?: string;
}

import { ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData';
export { ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData';

const translations = {
    en: {
        readLater: "Read later",
        readLaterRemove: "Saved ✓",
        pageTitle: "English Library",
        searchPlaceholder: "Search title or author...",
        allSubjects: "Subjects",
        allAuthors: "Authors",
        sortBy: "Sort By",
        alphabetical: "Alphabetical",
        authorName: "Author",
        none: "Default",
        noResults: "No results found.",
        close: "Close",
        subjectLabel: "Topic",
        audioOnly: "Audio Only",
        audioSort: "Audio First",
        read: "Read Content",
        listen: "Saqr Audio Summary",
        back: "Back",
        ageClassification: "Age Group",
        bioLabel: "Author Bio:",
        summaryLabel: "Book Summary",
        aiSubject: "AI Category"
    },
    ar: {
        readLater: "القراءة لاحقًا",
        readLaterRemove: "محفوظ ✓",
        pageTitle: "المكتبة الإنجليزية",
        searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
        allSubjects: "المواضيع",
        allAuthors: "المؤلفين",
        sortBy: "فرز حسب",
        alphabetical: "أبجدياً",
        authorName: "المؤلف",
        none: "تلقائي",
        noResults: "لا توجد نتائج.",
        close: "إغلاق",
        subjectLabel: "الموضوع",
        audioOnly: "صوتيات فقط",
        audioSort: "الصوتيات أولاً",
        read: "قراءة المحتوى",
        listen: "تلخيص صقر الصوتي",
        back: "العودة",
        ageClassification: "التصنيف العمري",
        bioLabel: "نبذة عن المؤلف:",
        summaryLabel: "نبذة عن الكتاب",
        aiSubject: "تصنيف ذكي"
    }
};

// ==========================================
// أيقونات SVG جذابة
// ==========================================
const UserIcon = () => (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const SearchSvg = () => (
    <svg className="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const CloseSvg = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const RobotSvg = () => (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" strokeWidth={4} />
        <line x1="16" y1="16" x2="16" y2="16" strokeWidth={4} />
    </svg>
);

const HeadphonesIcon = () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
);

const PlayIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
);
const PauseIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
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

// --- مشغل الصوت ---
const SaqrAudioPlayer: React.FC<{ audioSrc: string; t: any }> = ({ audioSrc, t }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleSpeed = () => {
        const speeds = [1, 1.5, 2, 0.5];
        const nextSpeed = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
        setSpeed(nextSpeed);
        if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
    };

    return (
        <div className="mt-8 animate-fade-in-up w-full max-w-lg mx-auto">
            <h4 className="text-xs font-black text-sky-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <HeadphonesIcon/> {t('listen')}
            </h4>
            <div className="p-4 md:p-5 rounded-[2rem] bg-sky-50 dark:bg-slate-800 border-4 border-sky-200 dark:border-sky-900/50 shadow-sm flex items-center gap-4">
                <audio ref={audioRef} src={audioSrc} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} />
                <button onClick={togglePlay} className="w-12 h-12 shrink-0 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform">
                    {isPlaying ? <PauseIcon/> : <PlayIcon/>}
                </button>
                <div className="flex-1">
                    <div className="h-3 w-full bg-sky-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-sky-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <button onClick={handleSpeed} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 text-[10px] font-black hover:bg-sky-100 transition-colors uppercase min-w-[45px] shadow-sm border-2 border-sky-200 dark:border-sky-900">{speed}x</button>
            </div>
        </div>
    );
};

// --- 3. Component: BookModal ---
const BookModal: React.FC<{ book: any | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const [ageGroup, setAgeGroup] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!book) return;
        setLoading(true);
        const fetchAgeGroup = async () => {
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{
                            role: 'system',
                            content: `Analyze the book titled "${book.title}". Return JSON ONLY: {"ageGroup": "Children or Teens or Adults"}`
                        }]
                    })
                });
                const data = await response.json();
                const cleanJson = data.reply.replace(/`{3}json/gi, '').replace(/`{3}/g, '').trim();
                setAgeGroup(JSON.parse(cleanJson).ageGroup);
            } catch (err) {
                let fallbackAge = "Adults";
                if (book.subject.toLowerCase().includes("children")) fallbackAge = "Children";
                else if (book.subject.toLowerCase().includes("fantasy") || book.subject.toLowerCase().includes("adventure")) fallbackAge = "Teens & Adults";
                setAgeGroup(fallbackAge);
            } finally { setLoading(false); }
        };
        fetchAgeGroup();
    }, [book]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="relative w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl sm:rounded-[3rem] border-2 sm:border-4 border-sky-400 dark:border-slate-700 shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row max-h-[96dvh] md:max-h-[90vh] animate-in zoom-in-95 duration-300 cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="sticky top-2 self-end me-2 md:absolute md:top-4 md:end-4 z-50 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-transform shadow-lg active:scale-90 active:translate-y-1">
                    <CloseSvg/>
                </button>

                <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 md:overflow-y-auto scrollbar-thin text-start flex flex-col mt-0 md:mt-0">
                    <h2 className="text-xl sm:text-2xl md:text-4xl text-slate-900 dark:text-white font-black leading-snug break-words mb-3 md:mb-4">{book.title}</h2>
                    
                    <div className="relative group/author inline-flex max-w-full flex-wrap items-center gap-2 mb-4 md:mb-8 bg-sky-50 dark:bg-slate-700 w-fit px-4 py-2 rounded-full border-2 border-sky-200 dark:border-slate-600 cursor-help">
                        <UserIcon/>
                        <p className="text-sm sm:text-base text-sky-600 dark:text-sky-400 font-bold break-words">{book.author}</p>
                        <div className="absolute top-full mt-2 start-0 w-[min(16rem,calc(100vw-4rem))] p-4 bg-slate-900 text-white text-xs rounded-2xl opacity-0 invisible group-hover/author:opacity-100 group-hover/author:visible transition-all shadow-xl z-50 font-medium leading-relaxed">
                            <strong className="block mb-2 text-sky-400 font-black uppercase">{t('bioLabel')}</strong>
                            {book.bio}
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 sm:p-5 md:p-8 rounded-[2rem] border-4 border-slate-200 dark:border-slate-700 shadow-inner text-start flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                           <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{t('summaryLabel')}</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-base md:text-lg font-bold leading-relaxed">
                           {book.summary}
                        </p>
                    </div>

                    {book.audioId && <SaqrAudioPlayer audioSrc={book.audioId} t={t}/>}
                </div>

                <div className="w-full md:w-[280px] bg-slate-100 dark:bg-slate-900/50 p-4 sm:p-5 md:p-8 flex flex-col justify-center items-center border-t-4 md:border-t-0 md:border-s-4 border-slate-200 dark:border-slate-700 shrink-0">
                    <div className="w-full text-center space-y-3 md:space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-[2rem] border-4 border-slate-200 dark:border-slate-600 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('subjectLabel')}</p>
                            <p className="text-base md:text-xl font-black text-slate-900 dark:text-white break-words">{book.subject}</p>
                        </div>
                        
                        <div className="bg-sky-50 dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-[2rem] border-4 border-sky-200 dark:border-slate-600 shadow-sm">
                            <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">{t('ageClassification')}</p>
                            <p className="text-lg md:text-2xl font-black text-sky-600 break-words">{loading ? '...' : (ageGroup || 'General')}</p>
                        </div>

                        <DigitalBookRating bookId={digitalBookKey('en', book)} compact={false} />

                        <div className="pt-2 md:pt-6">
                            <a href={book.driveLink} target="_blank" rel="noreferrer" className="w-full block bg-sky-500 text-white font-black py-4 rounded-[2rem] hover:-translate-y-1 active:translate-y-2 border-b-8 border-sky-700 active:border-b-0 transition-all text-center uppercase tracking-widest text-base shadow-md">
                                {t('read')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. Component: BookCard (2D Flat Design) ---
const BookCard = React.memo(({ book, onClick, t }: { book: any; onClick: () => void; t: any }) => {
  const { data: passport, toggleSaved } = useReadingPassport();
  const readingKey = digitalBookKey('en', book);
  const isSaved = passport.saved.includes(readingKey);
  const isAi = !book.subject || book.subject === "Unknown";
  const hasAudio = !!book.audioId;

  // ألوان متدرجة مسطحة وأنيقة (بدون 3D)
  const colors = [
    'from-blue-500 to-sky-500 border-blue-200',
    'from-emerald-500 to-teal-400 border-emerald-200',
    'from-rose-500 to-pink-500 border-rose-200',
    'from-amber-500 to-orange-400 border-amber-200',
    'from-purple-500 to-indigo-500 border-purple-200'
  ];
  const colorClass = colors[book.title.length % colors.length];

  return (
    <div onClick={onClick} className="relative group cursor-pointer w-full max-w-sm mx-auto min-h-[290px] h-auto md:min-h-[300px] flex items-stretch justify-center p-1.5 sm:p-2">
      {/* هالة مضيئة خلف الكتاب في حالة وجود صوت */}
      {hasAudio && (
        <div className="absolute inset-0 bg-sky-400/20 blur-2xl rounded-[2rem] scale-95 group-hover:scale-105 opacity-60 animate-pulse transition-all duration-500 pointer-events-none -z-10"></div>
      )}

      {/* تصميم البطاقة الثنائية الأبعاد */}
      <div className={`w-full h-full relative rounded-[2rem] border-4 shadow-lg bg-gradient-to-br ${colorClass} transition-all duration-500 transform group-hover:-translate-y-3 group-hover:shadow-2xl overflow-hidden flex flex-col`}>
        
        {/* تأثير انعكاس الزجاج الخفيف */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 skew-y-12 pointer-events-none"></div>

        <div className="p-3.5 sm:p-4 md:p-5 flex flex-col min-h-[290px] md:min-h-[300px] h-full relative z-10 gap-2.5">
          <div className="flex items-start justify-between gap-2 flex-row-reverse">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/25 border border-white/20 px-2.5 py-1 text-white backdrop-blur-sm shadow-sm text-[10px] font-black max-w-[75%]">
              {isAi && <RobotSvg/>}
              <span className="truncate">{isAi ? t('aiSubject') : book.subject}</span>
            </span>
            {hasAudio && (
              <div className="shrink-0 bg-sky-500 backdrop-blur-md p-2 rounded-full text-white shadow-md animate-bounce flex items-center justify-center">
                <HeadphonesIcon/>
              </div>
            )}
          </div>
          <div className="flex flex-row items-start gap-2 mt-auto min-w-0" dir={book.title && /[\u0600-\u06FF]/.test(book.title) ? 'rtl' : 'ltr'}>
            <h3 className="flex-1 min-w-0 font-black text-lg md:text-xl text-white leading-snug drop-shadow-md break-words line-clamp-3 text-start" dir="auto">{book.title}</h3>
            <button type="button" aria-pressed={isSaved} aria-label={isSaved ? t('readLaterRemove') : t('readLater')}
              title={isSaved ? t('readLaterRemove') : t('readLater')}
              onClick={(event) => { event.stopPropagation(); toggleSaved(readingKey); }}
              className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-white/70 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${isSaved ? 'bg-white/25 shadow-md' : 'bg-transparent'}`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinejoin="round" strokeLinecap="round" d="M6 4h12v17l-6-4-6 4V4z" /></svg>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-white/95 text-xs font-bold min-w-0" dir="auto">
            <span className="inline-flex items-center gap-1 min-w-0 max-w-full">
              <UserIcon/><span className="truncate">{book.author}</span>
            </span>
            {book.publisher && <span className="min-w-0 max-w-full truncate border-s border-white/40 ps-2 text-white/85">{book.publisher}</span>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
            <span className="text-white/95 text-xs font-black max-w-[55%] truncate" dir="auto">{isAi ? t('aiSubject') : book.subject}</span>
            <div className="shrink-0 relative z-30" onClick={(event)=>event.stopPropagation()}>
              <DigitalBookRating bookId={readingKey} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

// --- 5. Main Component: EnglishLibraryInternalPage ---
const EnglishLibraryInternalPage: React.FC = () => {
    // تعيين الإنجليزية كلغة افتراضية عند فتح الصفحة مباشرة
    const { locale, dir } = useLanguage();
    const [currentLocale, setCurrentLocale] = useState(locale || 'en');
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentLocale(locale);
    }, [locale]);

    const t = (key: keyof typeof translations.en) => translations[currentLocale as 'ar' | 'en']?.[key] as string;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [sortBy, setSortBy] = useState('alphabetical'); 
    const [audioOnly, setAudioOnly] = useState(false);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [visibleCount, setVisibleCount] = useState(12); // تغيير ليكون العدد متوافق مع الموبايل

    const filters = useMemo(() => ({
        subjects: [...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.subject))].filter(s => s !== "Unknown").sort(),
        authors: [...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
    }), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        let result = ENGLISH_LIBRARY_DATABASE.filter(b => {
            const matchesSearch = b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSubject = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuthor = authorFilter === 'all' || b.author === authorFilter;
            const matchesAudio = audioOnly ? !!b.audioId : true;
            return matchesSearch && matchesSubject && matchesAuthor && matchesAudio;
        });

        if (sortBy === 'author') result = [...result].sort((a, b) => a.author.localeCompare(b.author, currentLocale));
        else if (sortBy === 'subject') result = [...result].sort((a, b) => a.subject.localeCompare(b.subject, currentLocale));
        else if (sortBy === 'audio') result = [...result].sort((a, b) => (b.audioId ? 1 : 0) - (a.audioId ? 1 : 0));
        else result = [...result].sort((a, b) => a.title.localeCompare(b.title, currentLocale));
        return result;
    }, [searchTerm, subjectFilter, authorFilter, audioOnly, sortBy, currentLocale]);

    return (
        <div dir={dir} className="w-full min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300">
            
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-amber-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 relative z-10 antialiased overflow-x-hidden">
                
                <RevealOnScroll>
                    <div className="text-center mt-12 mb-12 relative">
                        <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-slate-200 hover:-translate-x-1 active:translate-y-1 border-b-4 border-slate-300 dark:border-slate-700 active:border-b-0 transition-all flex items-center gap-2 shadow-sm">
                            <span className="text-xl leading-none rtl:rotate-180">←</span> {t('back')}
                        </button>
                        {/* العناوين الإنجليزية تكون بوزن أسود عريض جداً والخطوط موحدة Cairo */}
                        <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tight uppercase">{t('pageTitle')}</h1>
                        <div className="flex justify-center gap-3 mt-6">
                            <div className="w-16 h-2 bg-sky-500 rounded-full" />
                            <div className="w-8 h-2 bg-amber-400 rounded-full" />
                        </div>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={100}>
                    <div className="mb-16">
                        <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-[3rem] border-4 border-sky-300 dark:border-sky-600 shadow-xl max-w-5xl mx-auto">
                            <div className="flex flex-col gap-5">
                                <div className="relative group">
                                    <input 
                                      type="text" 
                                      placeholder={t('searchPlaceholder')} 
                                      className="w-full p-4 md:p-5 ps-14 md:ps-16 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-4 border-slate-200 dark:border-slate-700 focus:border-sky-400 rounded-[2rem] outline-none transition-colors text-base md:text-lg font-black shadow-inner" 
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)} 
                                    />
                                    <div className="absolute start-5 md:start-6 top-1/2 -translate-y-1/2 text-sky-500">
                                        <SearchSvg/>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                    <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-sky-400 transition-colors outline-none focus:border-sky-500 text-slate-700 dark:text-slate-200">
                                        <option value="all">{t('allAuthors')}</option>
                                        {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                    <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-sky-400 transition-colors outline-none focus:border-sky-500 text-slate-700 dark:text-slate-200">
                                        <option value="all">{t('allSubjects')}</option>
                                        {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-sky-400 transition-colors outline-none focus:border-sky-500 text-slate-700 dark:text-slate-200">
                                        <option value="alphabetical">{t('alphabetical')}</option>
                                        <option value="audio">{t('audioSort')}</option>
                                    </select>
                                    <button onClick={() => setAudioOnly(!audioOnly)} className={`w-full p-3 md:p-4 rounded-2xl font-black text-xs md:text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 ${audioOnly ? 'bg-sky-500 text-white border-sky-700 animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 border-2'}`}>
                                        <HeadphonesIcon/> {t('audioOnly')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>

                {/* عرض البطاقات مع تلاشي لكل بطاقة بشكل منفصل وحصري عند التمرير */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-4 md:gap-x-6 px-2 md:px-4">
                    {filteredBooks.slice(0, visibleCount).map((book, index) => (
                        <RevealOnScroll key={book.id} delay={(index % 4) * 100}>
                           <BookCard 
                               book={book} 
                               t={t} 
                               onClick={async () => {
                                   setSelectedBook(book); 
                                   try {
                                       await supabase.from('book_views').insert([{ book_title: book.title, language: 'en' }]);
                                   } catch (e) {
                                       console.error("Error logging book view:", e);
                                   }
                               }} 
                           />
                        </RevealOnScroll>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="py-20 text-center text-slate-400 dark:text-slate-600 flex flex-col items-center">
                        <svg className="w-24 h-24 mb-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-3xl font-black">{t('noResults')}</p>
                    </div>
                )}

                {filteredBooks.length > visibleCount && (
                    <div className="mt-16 text-center w-full flex justify-center">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 12)} 
                            className="bg-sky-500 text-white px-10 py-4 rounded-full font-black text-lg md:text-xl border-b-8 border-sky-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md uppercase tracking-widest w-full max-w-sm"
                        >
                            EXPLORE MORE
                        </button>
                    </div>
                )}

                <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
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
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default EnglishLibraryInternalPage;
