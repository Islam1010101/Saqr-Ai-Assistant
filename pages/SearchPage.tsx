import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// --- نافذة تفاصيل الكتاب (تنسيق الصفحة الرئيسية) ---
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
        <div dir={dir} className="fixed inset-0 bg-slate-950/90 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-3xl rounded-t-[3rem] sm:rounded-[4rem] overflow-hidden shadow-2xl border-white/30 dark:border-white/10 flex flex-col max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 sm:p-14 overflow-y-auto">
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex-1">
                            <span className="inline-block bg-red-600/10 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Book Details</span>
                            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter">{book.title}</h2>
                            <p className="text-xl sm:text-2xl text-green-700 dark:text-green-400 font-black mt-3">{book.author}</p>
                        </div>
                        <button onClick={onClose} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-red-600 hover:text-white transition-all active:scale-90">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                        {[
                            { label: t_search('subject'), val: book.subject },
                            { label: t_search('level'), val: book.level },
                            { label: 'Language', val: book.language === 'EN' ? t_search('langEN') : t_search('langAR') }
                        ].map((info, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10">
                                <h4 className="font-black text-slate-400 text-[9px] uppercase mb-2 tracking-widest">{info.label}</h4>
                                <p className="text-base sm:text-lg font-black text-slate-950 dark:text-white leading-tight">{info.val}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-green-700 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl mb-10 text-white relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-1000"></div>
                        <p className="text-xs font-black uppercase opacity-70 mb-2 tracking-widest">{t_search('location')}</p>
                        <p className="text-3xl sm:text-5xl font-black tracking-tighter">{t_search('shelf')} {book.shelf} – {t_search('row')} {book.row}</p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-black text-red-600 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                             <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                             {t_search('summary')}
                        </h4>
                        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                            <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-lg sm:text-2xl font-medium italic">
                                "{summary || book.summary || (isLoading ? '...' : 'No summary available.')}"
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-10 flex flex-col sm:flex-row gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-slate-200 dark:border-white/10">
                    <button 
                        onMouseDown={(e) => handleInteraction(e, onClose)}
                        className="flex-1 glass-button-base border-2 border-slate-200 dark:border-white/10 py-5 text-lg font-black rounded-2xl"
                    >
                        {t_search('close')}
                    </button>
                    <button 
                        onMouseDown={(e) => handleInteraction(e, () => onFilterByAuthor(book.author))}
                        className="flex-1 bg-gray-950 text-white dark:bg-white dark:text-slate-950 py-5 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-xl"
                    >
                        {t_search('similarRecommendations')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب المطورة (تأثير نبض الموقع) ---
const BookCard = React.memo(({ book, onClick, t_search }: { book: Book; onClick: () => void; t_search: any }) => {
    return (
        <div 
            onClick={onClick}
            className="group relative glass-panel bg-white dark:bg-slate-800/50 border-white/50 dark:border-white/10 rounded-[2.5rem] hover:scale-[1.03] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden active:scale-95"
        >
            <div className="p-8 flex-grow relative z-10">
                <div className="flex justify-between items-start mb-6">
                     <span className="bg-green-600/10 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-green-600/20">{book.subject}</span>
                     <div className="text-3xl opacity-50 group-hover:opacity-100 group-hover:rotate-12 transition-all">📖</div>
                </div>
                <h3 className="font-black text-xl sm:text-2xl text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2 h-14">{book.title}</h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold">{book.author}</p>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 py-5 px-8 border-t border-slate-100 dark:border-white/5 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                    </div>
                    <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">
                        {`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}
                    </p>
                </div>
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
            const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            const matchesShelf = shelfFilter === 'all' || b.shelf.toString() === shelfFilter;
            return matchesTerm && matchesSub && matchesAuth && matchesShelf;
        });
    }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);

    useEffect(() => { setVisibleCount(24); }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-32 animate-in fade-in duration-1000 relative">
            {/* الخلفية التفاعلية */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-green-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="text-center mb-16 relative z-10 pt-10">
                <h1 className="text-5xl sm:text-7xl font-black text-slate-950 dark:text-white mb-6 tracking-tighter leading-none">
                    {t_search('pageTitle')}
                </h1>
                <div className="h-2.5 w-32 bg-green-700 mx-auto rounded-full shadow-[0_10px_30px_rgba(5,150,105,0.4)]"></div>
            </div>
            
            {/* بار البحث الذكي */}
            <div 
                onMouseMove={handleMouseMove}
                className="glass-panel glass-card-interactive p-8 md:p-14 rounded-[3.5rem] shadow-2xl mb-20 sticky top-24 z-40 border-white/40 dark:border-white/10 backdrop-blur-3xl"
            >
                <div className="relative mb-10 z-10">
                    <input
                        type="text"
                        placeholder={t_search('searchPlaceholder')}
                        className="w-full p-6 md:p-10 ps-16 md:ps-24 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-green-600 rounded-[2.5rem] outline-none transition-all font-black text-xl md:text-4xl shadow-inner placeholder-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-6 md:start-10 flex items-center pointer-events-none text-green-700">
                        <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 font-black text-lg cursor-pointer focus:border-green-600 transition-all outline-none">
                        <option value="all">{t_search('allSubjects')}</option>
                        {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 font-black text-lg cursor-pointer focus:border-green-600 transition-all outline-none">
                        <option value="all">{t_search('allAuthors')}</option>
                        {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <select value={shelfFilter} onChange={(e) => setShelfFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 font-black text-lg cursor-pointer focus:border-green-600 transition-all outline-none">
                        <option value="all">{t_search('allShelves')}</option>
                        {filters.shelves.map(s => <option key={s} value={s}>{t_search('shelf')} {s}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between mb-12 px-6 sm:px-10 relative z-10">
                <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">{t_search('results')}</h2>
                <div className="bg-green-700 text-white px-8 py-2 rounded-2xl text-xl sm:text-3xl font-black shadow-xl ring-4 ring-green-600/20">{filteredBooks.length}</div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 relative z-10 px-2 sm:px-0">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} t_search={t_search} />
                ))}
            </div>

            {filteredBooks.length > visibleCount && (
                <div className="mt-24 text-center relative z-10">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 24)}
                        className="relative overflow-hidden bg-gray-950 text-white dark:bg-white dark:text-gray-950 px-16 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        {t_search('loadMore')}
                    </button>
                </div>
            )}

            {filteredBooks.length === 0 && (
                <div className="glass-panel text-center py-40 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-white/5 relative z-10">
                    <div className="text-9xl mb-10 opacity-10 animate-pulse">🔎</div>
                    <p className="text-slate-400 dark:text-slate-500 text-3xl font-black">{t_search('noResults')}</p>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} onFilterByAuthor={(a) => { setAuthorFilter(a); setSelectedBook(null); window.scrollTo({top:0, behavior:'smooth'}); }} />
        </div>
    );
};

export default SearchPage;
