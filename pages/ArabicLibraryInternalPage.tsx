import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { matchesCatalogQuery } from '../src/utils/catalogTextSearch';
import LibraryLetterAtmosphere from '../src/components/LibraryLetterAtmosphere';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/utils/supabase';
import { useReadingPassport, digitalBookKey } from '../src/utils/readingPassport';
import DigitalBookRating from '../src/components/DigitalBookRating';
import DigitalLibraryDialog from '../src/components/DigitalLibraryDialog';
import DigitalBookReader from '../src/components/DigitalBookReader';
/** Keep the much larger page manifest out of the initial library bundle. */
const VerifiedArabicPhotoBookReader = React.lazy(() => import('../src/components/VerifiedArabicPhotoBookReader'));
const VERIFIED_ARABIC_PHOTO_BOOK_IDS = new Set([
  'AR_41','AR_44','AR_45','AR_50','AR_52','AR_53','AR_54','AR_55','AR_56','AR_57','AR_58','AR_60',
  'NI_1','NI_2','NI_3','NI_4','NI_5','NI_6',
]);
import { digitalReaderSource } from '../src/utils/digitalReaderSource';
import { useDigitalReadingProgress } from '../src/utils/useDigitalReadingProgress';
import { pdfProgressPercent, type PdfReadingState } from '../src/utils/pdfReadingState';

// Shared with Saqr catalog search; preserve book IDs and source links.
import { ARABIC_LIBRARY_DATABASE, type DigitalLibraryBook } from '../api/digitalBookData';
export { ARABIC_LIBRARY_DATABASE } from '../api/digitalBookData';

const translations = {
    en: {
        readLater: "Read later",
        readLaterRemove: "Saved ✓",
        pageTitle: "Arabic Library",
        publisherLabel: "Publisher",
        byAuthor: "By Author",
        bySubject: "By Subject",
        searchPlaceholder: "Search title, author or topic...",
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
        pageTitle: "المكتبة العربية",
        publisherLabel: "الناشر",
        byAuthor: "حسب المؤلف",
        bySubject: "حسب الموضوع",
        searchPlaceholder: "ابحث بالعنوان أو المؤلف أو الموضوع...",
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
    <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
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
            <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <HeadphonesIcon/> {t('listen')}
            </h4>
            <div className="p-4 md:p-5 rounded-[2rem] bg-rose-50 dark:bg-slate-800 border-4 border-rose-200 dark:border-rose-900/50 shadow-sm flex items-center gap-4 efips-digital-audio-controls">
                <audio ref={audioRef} src={audioSrc} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} />
                <button onClick={togglePlay} className="w-12 h-12 shrink-0 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform">
                    {isPlaying ? <PauseIcon/> : <PlayIcon/>}
                </button>
                <div className="flex-1">
                    <div className="h-3 w-full bg-rose-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-rose-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <button onClick={handleSpeed} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 text-[10px] font-black hover:bg-rose-100 transition-colors uppercase min-w-[45px] shadow-sm border-2 border-rose-200 dark:border-rose-900">{speed}x</button>
            </div>
        </div>
    );
};

// --- 3. Component: BookModal ---
const BookModal: React.FC<{ book: DigitalLibraryBook | null; onClose: () => void; t: any; progress?: PdfReadingState; showAgeClassification?: boolean }> = ({ book, onClose, t, progress, showAgeClassification = true }) => {
    const { locale } = useLanguage();
    const [readerOpen, setReaderOpen] = useState(false);
    useEffect(() => { setReaderOpen(false); }, [book?.id]);
    const ageLabels = locale === 'ar'
        ? { children: 'أطفال', teens: 'يافعون', adults: 'كبار' }
        : { children: 'Children', teens: 'Teens', adults: 'Adults' };
    const ageGroup = book?.reviewedAgeGroup || book?.readingAudience ? ageLabels[(book.reviewedAgeGroup || book.readingAudience)!] : '';

    if (!book) return null;
    if (readerOpen) {
        const onBack = () => setReaderOpen(false);
        if (VERIFIED_ARABIC_PHOTO_BOOK_IDS.has(String(book.id))) {
            return <React.Suspense fallback={<div role="status" className="p-8 text-center font-bold text-emerald-700 dark:text-emerald-200">{locale === 'ar' ? 'جار تجهيز صفحات الكتاب...' : 'Preparing book pages...'}</div>}>
                <VerifiedArabicPhotoBookReader book={book} locale={locale} onBack={onBack} onClose={onClose} />
            </React.Suspense>;
        }
        return <DigitalBookReader title={book.title} source={book.driveLink} bookKey={digitalBookKey('ar', book)}
            locale={locale} onBack={onBack} onClose={onClose} />;
    }

    return (
        <DigitalLibraryDialog title={book.title} onClose={onClose}>
                <button onClick={onClose} data-book-close aria-label={t('close')} className="efips-digital-dialog-close bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-lg">
                    <CloseSvg/>
                </button>

                <div className="efips-digital-dialog-content text-start flex flex-col">
                    <h2 className="text-xl sm:text-2xl md:text-4xl text-slate-900 dark:text-white font-black leading-snug break-words mb-3 md:mb-4">{book.title}</h2>
                    {book.series && <p dir="auto" className="mb-3 text-emerald-700 dark:text-emerald-300 font-black text-sm">{locale==='ar'?'السلسلة: ':'Series: '}{book.series}{book.seriesOrder ? ' · ' + (locale==='ar'?'الجزء ':'Volume ') + book.seriesOrder : ''}</p>}
                    
                    <details className="efips-digital-author text-sky-700 dark:text-sky-300">
                        <summary className="bg-sky-50 dark:bg-slate-700 font-bold">
                            <span dir="auto">{book.author}</span>
                            <span className="block text-xs mt-1">{t('bioLabel')}</span>
                        </summary>
                        <p dir="auto">{book.bio}</p>
                    </details>
                    
                    {!book.summary && book.publisher && <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-5">{t('publisherLabel')}: {book.publisher}</p>}
                    {book.summary && <div className="bg-slate-50 dark:bg-slate-900 p-4 sm:p-5 md:p-8 rounded-[2rem] border-4 border-slate-200 dark:border-slate-700 shadow-inner text-start flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                           <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{t('summaryLabel')}</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-base md:text-lg font-bold leading-relaxed">
                           {book.summary}
                        </p>
                    </div>}

                    {book.audioId && <SaqrAudioPlayer audioSrc={book.audioId} t={t}/>}
                </div>

                <div className="efips-digital-dialog-sidebar bg-slate-100 dark:bg-slate-900/50">
                    <div className="w-full text-center space-y-3 md:space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-[2rem] border-4 border-slate-200 dark:border-slate-600 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('subjectLabel')}</p>
                            <p className="text-base md:text-xl font-black text-slate-900 dark:text-white break-words">{book.subject}</p>
                        </div>
                        
                        {showAgeClassification && <div className="bg-rose-50 dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-[2rem] border-4 border-rose-200 dark:border-slate-600 shadow-sm">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">{t('ageClassification')}</p>
                            <p className="text-lg md:text-2xl font-black text-rose-600 break-words">{ageGroup || (locale === 'ar' ? 'لم يُحدد بعد' : 'Not yet classified')}</p>
                        </div>}

                        <DigitalBookRating bookId={digitalBookKey('ar', book)} compact={false} />

                        <div className="pt-2 md:pt-6">
                            {digitalReaderSource(book.driveLink) ? (<button type="button" onClick={() => setReaderOpen(true)} className="w-full block bg-emerald-500 text-white font-black py-4 rounded-[2rem] hover:-translate-y-1 active:translate-y-2 border-b-8 border-emerald-700 active:border-b-0 transition-all text-center uppercase tracking-widest text-base shadow-md">
                                {progress && progress.page>1 ? (locale==='ar'?'أكمل القراءة':'Continue reading') : t('read')}
                            </button>) : (<a href={book.driveLink} target="_blank" rel="noreferrer" className="w-full block bg-emerald-500 text-white font-black py-4 rounded-[2rem] hover:-translate-y-1 active:translate-y-2 border-b-8 border-emerald-700 active:border-b-0 transition-all text-center uppercase tracking-widest text-base shadow-md">
                                {t('read')}
                            </a>)}
                        </div>
                    </div>
                </div>
        </DigitalLibraryDialog>
    );
};

// --- مكون التلاشي المخصص (Reveal Component) ---
const RevealOnScroll = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    const [isVisible, setIsVisible] = useState(true);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element || typeof IntersectionObserver === 'undefined') return;
        // Reveal just once, ahead of the viewport. Repeated hide/show while
        // scrolling caused re-paints and apparent delayed content on Safari.
        let entered = false;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                entered = true;
                setIsVisible(true);
                observer.disconnect();
            } else if (!entered) {
                setIsVisible(false);
            }
        }, { threshold: 0, rootMargin: '160px 0px 160px 0px' });
        observer.observe(element);
        return () => observer.disconnect();
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

// --- 4. Component: BookCard (2D Flat Design) ---
const BookCard = React.memo(({ book, onClick, t, progress }: { book: DigitalLibraryBook; onClick: () => void; t: any; progress?: PdfReadingState }) => {
  const { data: passport, toggleSaved } = useReadingPassport();
  const readingKey = digitalBookKey('ar', book);
  const isSaved = passport.saved.includes(readingKey);
  const isAi = !book.subject || book.subject === "Unknown";
  const hasAudio = !!book.audioId;
  const percent = progress ? pdfProgressPercent(progress) : null;

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
    <div onClick={onClick} className="efips-digital-book-card relative group cursor-pointer w-full max-w-sm mx-auto min-h-[290px] h-auto md:min-h-[300px] flex items-stretch justify-center p-1.5 sm:p-2">
      {/* هالة مضيئة خلف الكتاب في حالة وجود صوت */}
      {hasAudio && (
        <div className="absolute inset-0 bg-rose-400/20 blur-2xl rounded-[2rem] scale-95 group-hover:scale-105 opacity-60 animate-pulse transition-all duration-500 pointer-events-none -z-10"></div>
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
              <div className="shrink-0 bg-rose-500 backdrop-blur-md p-2 rounded-full text-white shadow-md animate-bounce flex items-center justify-center">
                <HeadphonesIcon/>
              </div>
            )}
          </div>
          <div className="efips-digital-card-heading flex flex-row items-start gap-2 mt-auto min-w-0" dir={book.title && /[\u0600-\u06FF]/.test(book.title) ? 'rtl' : 'ltr'}>
            <h3 className="flex-1 min-w-0 font-black text-lg md:text-xl text-white leading-snug drop-shadow-md break-words text-start" dir="auto"><button type="button" onClick={event => { event.stopPropagation(); onClick(); }} className="efips-digital-card-title text-start">{book.title}</button></h3>
            <button type="button" aria-pressed={isSaved} aria-label={isSaved ? t('readLaterRemove') : t('readLater')}
              title={isSaved ? t('readLaterRemove') : t('readLater')}
              onClick={(event) => { event.stopPropagation(); toggleSaved(readingKey); }}
              className={`efips-digital-card-action shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-white/70 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${isSaved ? 'bg-white/25 shadow-md' : 'bg-transparent'}`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinejoin="round" strokeLinecap="round" d="M6 4h12v17l-6-4-6 4V4z" /></svg>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-white/95 text-xs font-bold min-w-0" dir="auto">
            <span className="inline-flex items-center gap-1 min-w-0 max-w-full">
              <UserIcon/><span className="truncate">{book.author}</span>
            </span>
            {book.publisher && <span className="min-w-0 max-w-full truncate border-s border-white/40 ps-2 text-white/85">{book.publisher}</span>}
          </div>
          {book.series && <p className="text-white/95 text-xs font-black" dir="auto">{book.series}{book.seriesOrder ? ' · #' + book.seriesOrder : ''}</p>}
          {book.readingAudience && <p className="text-white/95 text-xs font-bold">{({children:'أطفال',teens:'يافعون',adults:'كبار'} as const)[book.readingAudience]}</p>}
          {progress && <div className="text-white font-black text-xs">{'أكمل من صفحة ' + progress.page}{percent!==null ? ' · '+percent+'%' : ''}
            <div className="h-1.5 w-full mt-1 bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-white" style={{width:(percent??0)+'%'}} /></div>
          </div>}
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

// --- 5. Main Component: ArabicLibraryInternalPage ---
type ArabicLibraryPageProps = {
    books?: DigitalLibraryBook[];
    pageTitle?: { ar: string; en: string };
    atmosphere?: 'arabic' | 'heritage';
};

const ArabicLibraryInternalPage: React.FC<ArabicLibraryPageProps> = ({ books = ARABIC_LIBRARY_DATABASE, pageTitle, atmosphere = 'arabic' }) => {
    // تعيين الإنجليزية كلغة افتراضية عند فتح الصفحة مباشرة
    const { locale, dir } = useLanguage();
    const [currentLocale, setCurrentLocale] = useState(locale || 'en');
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentLocale(locale);
    }, [locale]);

    const t = (key: keyof typeof translations.en) => translations[currentLocale as 'ar' | 'en']?.[key] as string;
    const isAr = currentLocale === 'ar';
    const hasAudio = useMemo(() => books.some(book => !!book.audioId), [books]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [seriesFilter, setSeriesFilter] = useState('all');
    const [audienceFilter, setAudienceFilter] = useState('all');
    const [sortBy, setSortBy] = useState('alphabetical'); 
    const [audioOnly, setAudioOnly] = useState(false);
    const [selectedBook, setSelectedBook] = useState<DigitalLibraryBook | null>(null);
    const readingProgress = useDigitalReadingProgress(books, 'ar');
    const booksInProgress = useMemo(()=>books.filter(b=>readingProgress.has(digitalBookKey('ar',b)))
      .sort((a,b)=>(readingProgress.get(digitalBookKey('ar',b))?.lastReadAt || 0)-(readingProgress.get(digitalBookKey('ar',a))?.lastReadAt || 0)).slice(0,8),[books,readingProgress]);
    const [visibleCount, setVisibleCount] = useState(12); // تغيير ليكون العدد متوافق مع الموبايل

    const filters = useMemo(() => ({
        subjects: [...new Set(books.map(b => b.subject))].filter(s => s !== "Unknown").sort(),
        authors: [...new Set(books.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
        series: [...new Set(books.map(b=>b.series).filter((x):x is string=>!!x))].sort(),
    }), [books]);

    useEffect(() => {
        setVisibleCount(12);
    }, [searchTerm, subjectFilter, authorFilter, seriesFilter, audienceFilter, audioOnly]);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.trim();
        let result = books.filter(b => {
            const matchesSearch = matchesCatalogQuery(term, b.title, b.author, b.subject, b.summary, b.series || '', ...(b.keywords || []));
            const matchesSubject = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuthor = authorFilter === 'all' || b.author === authorFilter;
            const matchesSeries = seriesFilter === 'all' || b.series === seriesFilter;
            const matchesAudience = audienceFilter === 'all' || (b.reviewedAgeGroup || b.readingAudience) === audienceFilter;
            const matchesAudio = audioOnly ? !!b.audioId : true;
            return matchesSearch && matchesSubject && matchesAuthor && matchesSeries && matchesAudience && matchesAudio;
        });

        if (sortBy === 'author') result = [...result].sort((a, b) => a.author.localeCompare(b.author, currentLocale));
        else if (sortBy === 'subject') result = [...result].sort((a, b) => a.subject.localeCompare(b.subject, currentLocale));
        else if (sortBy === 'audio') result = [...result].sort((a, b) => (b.audioId ? 1 : 0) - (a.audioId ? 1 : 0));
        else result = [...result].sort((a,b)=>a.series && a.series===b.series
 ? (a.seriesOrder??9999)-(b.seriesOrder??9999) || a.title.localeCompare(b.title,currentLocale)
 : a.title.localeCompare(b.title,currentLocale));
        return result;
    }, [books, searchTerm, subjectFilter, authorFilter, seriesFilter, audienceFilter, audioOnly, sortBy, currentLocale]);

    return (
        <div dir={dir} className="efips-letter-library efips-letter-ar w-full min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300">
            
            <LibraryLetterAtmosphere alphabet={atmosphere} />
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-amber-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 relative z-10 antialiased overflow-x-hidden">
                
                <div className="efips-library-title-wrap text-center mt-12 mb-12 relative animate-fade-in-up">
                    <div className="efips-library-topbar"><button onClick={() => navigate(-1)} className="efips-library-back start-0 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-slate-200 hover:-translate-x-1 active:translate-y-1 border-b-4 border-slate-300 dark:border-slate-700 active:border-b-0 transition-all flex items-center gap-2 shadow-sm">
                        <span className="text-xl leading-none rtl:rotate-180">←</span> {t('back')}
                    </button></div>
                    {/* العناوين الإنجليزية تكون بوزن أسود عريض جداً والخطوط موحدة Cairo */}
                    <h1 className="efips-library-page-title text-4xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tight uppercase">{pageTitle ? pageTitle[isAr ? 'ar' : 'en'] : t('pageTitle')}</h1>
                    <div className="efips-library-title-stripes flex justify-center gap-3 mt-6">
                        <div className="w-16 h-2 bg-emerald-500 rounded-full" />
                        <div className="w-8 h-2 bg-amber-400 rounded-full" />
                    </div>
                </div>

                {/* قسم البحث (لا يختفي، بل يبقى في مكانه) */}
                <div className="mb-6 md:mb-10">
                    <div className="efips-digital-search-panel bg-white dark:bg-slate-800 p-5 md:p-8 rounded-[3rem] border-4 border-emerald-300 dark:border-emerald-600 shadow-xl max-w-5xl mx-auto animate-fade-in-up">
                        <div className="flex flex-col gap-5">
                            <div className="relative group">
                                <input 
                                  type="text" 
                                  placeholder={t('searchPlaceholder')}
                                      aria-label={t('searchPlaceholder')} 
                                  className="w-full p-4 md:p-5 ps-14 md:ps-16 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-4 border-slate-200 dark:border-slate-700 focus:border-emerald-400 rounded-[2rem] outline-none transition-colors text-base md:text-lg font-black shadow-inner" 
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                <div className="absolute start-5 md:start-6 top-1/2 -translate-y-1/2 text-emerald-500">
                                    <SearchSvg/>
                                </div>
                            </div>
                            
                            <div className="efips-digital-filters grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                <select aria-label={t('allAuthors')} value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-emerald-400 transition-colors outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200">
                                    <option value="all">{t('allAuthors')}</option>
                                    {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                {filters.series.length > 0 && <select aria-label={isAr ? 'السلاسل' : 'Series'} value={seriesFilter} onChange={e=>setSeriesFilter(e.target.value)}
                                  className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs md:text-sm text-center">
                                  <option value="all">{isAr ? 'كل السلاسل' : 'All series'}</option>
                                  {filters.series.map(x=><option key={x} value={x}>{x}</option>)}
                                </select>}
                                <select aria-label={isAr ? 'الفئة القرائية' : 'Reading group'} value={audienceFilter} onChange={e=>setAudienceFilter(e.target.value)}
                                  className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs md:text-sm text-center">
                                  <option value="all">{isAr ? 'كل الفئات' : 'All reading groups'}</option>
                                  <option value="children">{isAr ? 'أطفال' : 'Children'}</option><option value="teens">{isAr ? 'يافعون' : 'Teens'}</option><option value="adults">{isAr ? 'كبار' : 'Adults'}</option>
                                </select>
                                <select aria-label={t('allSubjects')} value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-emerald-400 transition-colors outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200">
                                    <option value="all">{t('allSubjects')}</option>
                                    {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select aria-label={t('sortBy')} value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-emerald-400 transition-colors outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200">
                                    <option value="alphabetical">{t('alphabetical')}</option>
                                    {hasAudio ? <option value="audio">{t('audioSort')}</option> : <><option value="author">{t('byAuthor')}</option><option value="subject">{t('bySubject')}</option></>}
                                </select>
                                {hasAudio && <button onClick={() => setAudioOnly(!audioOnly)} className={`w-full p-3 md:p-4 rounded-2xl font-black text-xs md:text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 ${audioOnly ? 'bg-rose-500 text-white border-rose-700 animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 border-2'}`}>
                                    <HeadphonesIcon/> {t('audioOnly')}
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>

                {(searchTerm || subjectFilter !== 'all' || authorFilter !== 'all' || seriesFilter !== 'all' || audienceFilter !== 'all' || audioOnly) && <div className="efips-digital-results-bar text-slate-700 dark:text-slate-200 text-sm font-bold">
                    <button type="button"
                        onClick={() => { setSearchTerm(''); setSubjectFilter('all'); setAuthorFilter('all'); setSeriesFilter('all'); setAudienceFilter('all'); setAudioOnly(false); }}
                        className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                        {currentLocale === 'ar' ? 'مسح الفلاتر' : 'Clear filters'}
                    </button>
                </div>}

                {/* عرض البطاقات مع تلاشي لكل بطاقة بشكل منفصل وحصري عند التمرير */}
                {booksInProgress.length>0 && <section className="mb-8 rounded-3xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 p-4 sm:p-6" aria-label={isAr?'أكمل قراءتك':'Continue reading'}>
                  <h2 className="text-lg font-black text-emerald-900 dark:text-emerald-200 mb-3">{isAr?'أكمل قراءتك':'Continue reading'}</h2>
                  <div className="flex gap-2 overflow-x-auto pb-2">{booksInProgress.map(book=>{
                    const state=readingProgress.get(digitalBookKey('ar',book))!;
                    return <button type="button" key={book.id} onClick={()=>setSelectedBook(book)} className="shrink-0 max-w-64 p-3 text-start rounded-2xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white font-bold text-sm">
                      <span className="block truncate" dir="auto">{book.title}</span><span className="text-xs">{isAr?'صفحة ':'Page '}{state.page}</span>
                    </button>;
                  })}</div>
                </section>}
                <div className="efips-library-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-4 md:gap-x-6 px-2 md:px-4">
                    {filteredBooks.slice(0, visibleCount).map((book, index) => (
                        <RevealOnScroll key={book.id} delay={(index % 4) * 100}>
                           <BookCard 
                               book={book} 
                               t={t}
                               progress={readingProgress.get(digitalBookKey('ar',book))}
                               onClick={async () => {
                                   setSelectedBook(book); 
                                   try {
                                       await supabase.from('book_views').insert([{ book_title: book.title, language: 'ar' }]);
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
                            className="bg-emerald-500 text-white px-10 py-4 rounded-full font-black text-lg md:text-xl border-b-8 border-emerald-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md uppercase tracking-widest w-full max-w-sm"
                        >
                            {currentLocale === 'ar' ? 'عرض المزيد' : 'Explore more'}
                        </button>
                    </div>
                )}

                <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} progress={selectedBook ? readingProgress.get(digitalBookKey('ar',selectedBook)) : undefined} showAgeClassification={!pageTitle} />

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                .efips-letter-library, .efips-letter-library * { font-family: 'Cairo', sans-serif !important; }
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

export default ArabicLibraryInternalPage;

