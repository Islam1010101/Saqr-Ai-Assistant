import React, { useState, useEffect, useMemo } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// Debounce Hook لضمان سلاسة البحث
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const translations = {
  ar: {
    pageTitle: "البحث في الفهرس الورقي",
    searchPlaceholder: "ابحث عن عنوان، مؤلف، أو موضوع...",
    allSubjects: "كل المواضيع",
    allAuthors: "كل المؤلفين",
    allShelves: "كل الرفوف",
    results: "نتائج البحث",
    shelf: "الرف",
    row: "الصف",
    noResults: "لم يتم العثور على نتائج.",
    similarRecommendations: "كتب مشابهة",
    close: "إغلاق",
    author: "المؤلف",
    subject: "الموضوع",
    level: "المستوى",
    location: "موقع الكتاب",
    summary: "ملخص (AI صقر)",
    langEN: "الإنجليزية",
    langAR: "العربية",
    loadMore: "عرض المزيد من الكتب",
  },
  en: {
    pageTitle: "Manual Library Search",
    searchPlaceholder: "Search title, author, or topic...",
    allSubjects: "All Subjects",
    allAuthors: "All Authors",
    allShelves: "All Shelves",
    results: "Results",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found.",
    similarRecommendations: "Similar Books",
    close: "Close",
    author: "Author",
    subject: "Subject",
    level: "Level",
    language: "Language",
    location: "Book Location",
    summary: "Summary (Saqr AI)",
    langEN: "English",
    langAR: "Arabic",
    loadMore: "Load More Books",
  }
};

// --- نافذة تفاصيل الكتاب (تباين عالي + خطوط واضحة) ---
const BookModal: React.FC<{
  book: Book | null;
  onClose: () => void;
  onFilterByAuthor: (author: string) => void;
}> = ({ book, onClose, onFilterByAuthor }) => {
    const { locale, dir } = useLanguage();
    const t_search = (key: any) => translations[locale][key as keyof typeof translations.ar];
    
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    useEffect(() => {
        if (!book) return;
        const fetchAiInsights = async () => {
            setIsLoading(true); setSummary('');
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: [{ role: 'user', content: `Summarize "${book.title}" briefly.` }], locale }),
                });
                const data = await response.json();
                setSummary(data.reply || "");
            } catch (error) { setSummary(book.summary || ""); } finally { setIsLoading(false); }
        };
        fetchAiInsights();
    }, [book, locale]);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, callback: () => void) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            callback();
        }, 300);
    };

    if (!book) return null;

    return (
        <div dir={dir} className="fixed inset-0 bg-slate-950/80 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div 
                onMouseMove={handleMouseMove}
                className="glass-panel glass-card-interactive bg-white/95 dark:bg-slate-900/95 rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border-white/40" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 sm:p-12 relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex-1">
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white leading-tight tracking-tight">{book.title}</h2>
                            <p className="text-xl sm:text-2xl text-green-700 dark:text-green-400 font-black mt-2">{book.author}</p>
                        </div>
                        <button onClick={onClose} className="p-4 rounded-2xl bg-green-600/10 text-green-700 hover:bg-green-700 hover:text-white transition-all active:scale-90">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="glass-panel p-5 rounded-2xl border-green-600/20 bg-green-600/5">
                            <h4 className="font-black text-slate-500 dark:text-slate-400 text-[11px] uppercase mb-1 tracking-widest">{t_search('subject')}</h4>
                            <p className="text-base font-black text-slate-950 dark:text-white">{book.subject}</p>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl border-green-600/20 bg-green-600/5">
                            <h4 className="font-black text-slate-500 dark:text-slate-400 text-[11px] uppercase mb-1 tracking-widest">{t_search('level')}</h4>
                            <p className="text-base font-black text-slate-950 dark:text-white">{book.level}</p>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl border-green-600/20 bg-green-600/5">
                            <h4 className="font-black text-slate-500 dark:text-slate-400 text-[11px] uppercase mb-1 tracking-widest">Language</h4>
                            <p className="text-base font-black text-slate-950 dark:text-white">{book.language === 'EN' ? t_search('langEN') : t_search('langAR')}</p>
                        </div>
                    </div>

                    <div className="bg-green-700 p-8 rounded-[2rem] shadow-xl mb-8 text-white flex flex-col items-center sm:items-start">
                        <p className="text-sm font-black uppercase opacity-80 mb-1">{t_search('location')}</p>
                        <p className="text-3xl sm:text-4xl font-black tracking-tighter">{t_search('shelf')} {book.shelf} – {t_search('row')} {book.row}</p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-black text-green-700 dark:text-green-400 uppercase tracking-widest text-xs sm:text-sm">{t_search('summary')}</h4>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-lg sm:text-xl font-medium italic bg-slate-50 dark:bg-white/5 p-6 rounded-2xl">"{summary || book.summary || '...'}"</p>
                    </div>
                </div>

                <div className="p-8 flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 relative z-10">
                    <button 
                        onMouseDown={(e) => handleInteraction(e, onClose)}
                        className="relative overflow-hidden flex-1 glass-button-green py-5 rounded-2xl font-black text-xl"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect !border-green-600/40" style={{ left: r.x, top: r.y }} />)}
                        {t_search('close')}
                    </button>
                    <button 
                        onMouseDown={(e) => handleInteraction(e, () => onFilterByAuthor(book.author))}
                        className="relative overflow-hidden flex-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 py-5 rounded-2xl font-black text-xl active:scale-95 transition-all"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect border-white/20" style={{ left: r.x, top: r.y }} />)}
                        {t_search('similarRecommendations')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب (نص ضخم وواضح + متوافقة مع الموبايل) ---
const BookCard = React.memo(({ book, onClick, t_search }: { book: Book; onClick: () => void; t_search: any }) => {
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setRipples(prev => [...prev, { id: Date.now(), x: clientX - rect.left, y: clientY - rect.top }]);
    };

    return (
        <div 
            onMouseDown={handleInteraction}
            onClick={onClick}
            className="relative overflow-hidden glass-panel bg-white/90 dark:bg-slate-800/80 border-white/50 dark:border-white/10 rounded-[2rem] hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col group active:scale-[0.98] h-full"
        >
            <div className="absolute inset-0 pointer-events-none z-0">
                {ripples.map(r => <span key={r.id} className="ripple-effect !border-green-600/30" style={{ left: r.x, top: r.y }} />)}
            </div>
            
            <div className="p-7 flex-grow relative z-10">
                <div className="flex justify-between items-start mb-5">
                     <span className="bg-green-600/10 text-green-800 dark:text-green-400 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border border-green-600/20">{book.subject}</span>
                     <span className="text-3xl group-hover:rotate-12 transition-transform">📖</span>
                </div>
                <h3 className="font-black text-xl sm:text-2xl text-slate-950 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2 leading-tight mb-2 tracking-tight">{book.title}</h3>
                <p className="text-base text-slate-600 dark:text-slate-400 font-bold mb-4">{book.author}</p>
            </div>
            <div className="bg-green-600/5 dark:bg-white/5 py-4 px-7 border-t border-green-600/10 dark:border-white/5 relative z-10">
                <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse shadow-[0_0_12px_rgba(5,150,105,0.7)]"></span>
                    {`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}
                </p>
            </div>
        </div>
    );
});

const SearchPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [shelfFilter, setShelfFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(24);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const filters = useMemo(() => ({
        subjects: [...new Set(bookData.map(b => b.subject))].filter(Boolean).sort(),
        authors: [...new Set(bookData.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
        shelves: [...new Set(bookData.map(b => b.shelf.toString()))].sort((a, b) => parseInt(a) - parseInt(b))
    }), []);

    const filteredBooks = useMemo(() => {
        const term = debouncedSearchTerm.toLowerCase().trim();
        return bookData.filter(b => {
            const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term) || b.shelf.toString().includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            const matchesShelf = shelfFilter === 'all' || b.shelf.toString() === shelfFilter;
            return matchesTerm && matchesSub && matchesAuth && matchesShelf;
        });
    }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);

    useEffect(() => { setVisibleCount(24); }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-20 animate-in fade-in duration-1000">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter">{t_search('pageTitle')}</h1>
                <div className="h-2.5 w-32 bg-green-700 mx-auto rounded-full shadow-[0_0_25px_rgba(5,150,105,0.5)]"></div>
            </div>
            
            {/* بار البحث والفلاتر - مصمم للوضوح الفائق */}
            <div className="glass-panel bg-white/95 dark:bg-slate-900/90 p-6 md:p-12 rounded-[3.5rem] shadow-2xl mb-16 sticky top-24 z-30 border-green-600/30 backdrop-blur-3xl">
                <div className="relative mb-8 z-10">
                    <input
                        type="text"
                        placeholder={t_search('searchPlaceholder')}
                        className="w-full p-6 sm:p-8 ps-16 sm:ps-24 text-slate-950 bg-slate-100/50 dark:bg-slate-950/50 dark:text-white border-2 border-transparent focus:border-green-600 rounded-[2.5rem] outline-none transition-all font-black text-xl sm:text-3xl shadow-inner placeholder-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-8 sm:start-10 flex items-center pointer-events-none">
                        <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {/* Selects بتباين عالي للوضع الداكن والفاتح */}
                    <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white border-2 border-slate-200 dark:border-white/10 font-black text-lg cursor-pointer appearance-none">
                        <option value="all">{t_search('allSubjects')}</option>
                        {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white border-2 border-slate-200 dark:border-white/10 font-black text-lg cursor-pointer appearance-none">
                        <option value="all">{t_search('allAuthors')}</option>
                        {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <select value={shelfFilter} onChange={(e) => setShelfFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white border-2 border-slate-200 dark:border-white/10 font-black text-lg cursor-pointer appearance-none">
                        <option value="all">{t_search('allShelves')}</option>
                        {filters.shelves.map(s => <option key={s} value={s}>{t_search('shelf')} {s}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between mb-12 px-8">
                <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">{t_search('results')}</h2>
                <span className="bg-green-700 text-white px-10 py-3 rounded-full text-2xl sm:text-3xl font-black shadow-xl">{filteredBooks.length}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-2 sm:px-0">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} t_search={t_search} />
                ))}
            </div>

            {filteredBooks.length > visibleCount && (
                <div className="mt-24 text-center">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 24)}
                        className="relative overflow-hidden glass-button-green px-20 py-7 rounded-[2.5rem] font-black text-2xl sm:text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                         {ripples.map(r => <span key={r.id} className="ripple-effect !border-green-600/40" style={{ left: r.x, top: r.y }} />)}
                        {t_search('loadMore')}
                    </button>
                </div>
            )}

            {filteredBooks.length === 0 && (
                <div className="glass-panel bg-white/95 dark:bg-slate-900/90 text-center py-32 rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-white/10">
                    <div className="text-9xl mb-8 opacity-20">🔍</div>
                    <p className="text-slate-400 dark:text-slate-500 text-3xl font-black">{t_search('noResults')}</p>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} onFilterByAuthor={(a) => { setAuthorFilter(a); setSelectedBook(null); window.scrollTo({top:0, behavior:'smooth'}); }} />
        </div>
    );
};

export default SearchPage;
