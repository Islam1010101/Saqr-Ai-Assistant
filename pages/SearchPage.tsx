import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

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
    pageTitle: "مكتبة مدرسة صقر الإمارات",
    searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
    allSubjects: "المواضيع",
    allAuthors: "المؤلفين",
    allShelves: "الرفوف",
    sortBy: "فرز حسب",
    alphabetical: "أبجدياً (العنوان)",
    authorName: "اسم المؤلف",
    none: "تلقائي",
    shelf: "الرف",
    row: "الصف",
    noResults: "لا توجد نتائج.",
    aiSubject: "تصنيف صقر الذكي",
    close: "إغلاق",
    subjectLabel: "المجال المعرفي",
    officialAi: "ملخص صقر AI الرسمي"
  },
  en: {
    pageTitle: "Index for Falcon School Library",
    searchPlaceholder: "Search title or author...",
    allSubjects: "Subjects",
    allAuthors: "Authors",
    allShelves: "Shelves",
    sortBy: "Sort By",
    alphabetical: "Alphabetical",
    authorName: "Author Name",
    none: "Default",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found.",
    aiSubject: "Saqr AI Classified",
    close: "Close",
    subjectLabel: "Knowledge Field",
    officialAi: "Official Saqr AI Summary"
  }
};

const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale } = useLanguage();
    const [aiSummary, setAiSummary] = useState<string>('');
    const [aiGenre, setAiGenre] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!book) { setAiSummary(''); setAiGenre(''); return; }
        
        const fetchAiData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ 
                            role: 'system', 
                            content: `You are Saqr AI Librarian. Research the book titled "${book.title}" written by "${book.author}". Provide a 2-sentence inspiring summary and a 1-word category. Respond in ${locale === 'ar' ? 'Arabic' : 'English'}. Return ONLY a JSON object: {"summary": "...", "genre": "..."}` 
                        }],
                        locale
                    }),
                });
                
                const data = await res.json();
                let replyText = data.reply || "";
                replyText = replyText.replace(/```json|```/gi, '').trim();
                
                try {
                    const parsed = JSON.parse(replyText);
                    setAiSummary(parsed.summary || "");
                    setAiGenre(parsed.genre || "");
                } catch (parseErr) {
                    setAiSummary(replyText);
                }
            } catch (e) { 
                setAiSummary(book.summary || 'Summary unavailable at the moment.'); 
            } finally { 
                setIsLoading(false); 
            }
        };
        fetchAiData();
    }, [book, locale]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-4xl rounded-[2.5rem] md:rounded-[3.5rem] border-none shadow-2xl overflow-y-auto max-h-[90vh] md:overflow-hidden relative animate-in zoom-in-95 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 end-4 md:top-6 md:end-6 z-50 p-2.5 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-lg">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 p-8 md:p-14 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200 dark:border-white/10 text-start font-black">
                    <div className="mb-6">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter">{book.title}</h2>
                        <p className="text-lg text-slate-500 font-bold uppercase tracking-tight">{book.author}</p>
                    </div>
                    <div className="bg-slate-100/50 dark:bg-white/5 p-6 md:p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-[10px] text-red-600 font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-lg"></span>
                            {t('officialAi')}
                        </p>
                        {isLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-full"></div>
                                <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-5/6"></div>
                            </div>
                        ) : (
                            <p className="text-slate-800 dark:text-slate-200 text-lg md:text-xl font-medium leading-relaxed">
                                "{aiSummary || book.summary || 'Fetching best summary...'}"
                            </p>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-[320px] bg-slate-950 dark:bg-black p-8 md:p-10 flex flex-col justify-center items-center text-center text-white relative font-black">
                    <div className="space-y-8 md:space-y-10 relative z-10 w-full">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">{t('subjectLabel')}</p>
                            <p className="text-xl md:text-2xl font-black text-white uppercase">{isLoading ? '...' : (aiGenre || (book.subject !== "Unknown" ? book.subject : t('aiSubject')))}</p>
                        </div>
                        <div className="flex justify-center gap-6 md:gap-8">
                            <div><p className="text-[10px] opacity-50 uppercase mb-1">{t('shelf')}</p><p className="text-4xl md:text-5xl font-black">{book.shelf}</p></div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div><p className="text-[10px] opacity-50 uppercase mb-1">{t('row')}</p><p className="text-4xl md:text-5xl font-black">{book.row}</p></div>
                        </div>
                        <button onClick={onClose} className="w-full bg-white text-slate-950 font-black py-4 rounded-xl active:scale-95 text-xs uppercase tracking-widest shadow-2xl transition-all">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
    const isAi = !book.subject || book.subject === "Unknown";
    return (
        <div 
            onClick={onClick} 
            className="group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-none rounded-[2rem] transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden shadow-md active:scale-95 hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)]"
        >
            <div className="p-8 flex-grow text-start font-black">
                 <span className={`inline-block px-3 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest mb-4 ${isAi ? 'bg-red-600 text-white shadow-md' : 'bg-green-600 text-white shadow-md'}`}>
                    {isAi ? t('aiSubject') : book.subject}
                 </span>
                <h3 className="font-black text-xl text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">
                    {book.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">By {book.author}</p>
            </div>
            <div className="bg-white/40 dark:bg-black/20 py-4 px-8 border-t border-white/5 mt-auto text-center font-black">
                <p className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest opacity-40">
                    S: {book.shelf} — R: {book.row}
                </p>
            </div>
        </div>
    );
});

const SearchPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [shelfFilter, setShelfFilter] = useState('all');
    
    // ضبط الترتيب الأبجدي كخيار افتراضي
    const [sortBy, setSortBy] = useState('alphabetical'); 
    
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [visibleCount, setVisibleCount] = useState(16);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filters = useMemo(() => ({
        subjects: [...new Set(bookData.map(b => b.subject))].filter(s => s !== "Unknown").sort(),
        authors: [...new Set(bookData.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
        shelves: [...new Set(bookData.map(b => b.shelf.toString()))].sort((a, b) => parseInt(a) - parseInt(b))
    }), []);

    const filteredBooks = useMemo(() => {
        const term = debouncedSearchTerm.toLowerCase().trim();
        let result = bookData.filter(b => {
            const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            const matchesShelf = shelfFilter === 'all' || b.shelf.toString() === shelfFilter;
            return matchesTerm && matchesSub && matchesAuth && matchesShelf;
        });

        // منطق الفرز المقتصر على الأبجدية واسم المؤلف
        if (sortBy === 'alphabetical') {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale));
        } else if (sortBy === 'author') {
            result = [...result].sort((a, b) => a.author.localeCompare(b.author, locale));
        }

        return result;
    }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter, sortBy, locale]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-24 relative z-10 font-black">
            <div className="sticky top-24 z-50 mb-10 animate-fade-up">
                <div className="glass-panel p-3 md:p-4 rounded-[2rem] shadow-xl border-none backdrop-blur-3xl max-w-5xl mx-auto">
                    <div className="flex flex-col gap-3">
                        <div className="relative">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-4 ps-12 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-xl md:rounded-2xl outline-none transition-all font-black text-base shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-red-600 appearance-none text-center shadow-sm">
                                <option value="none">{t('sortBy')}</option>
                                <option value="alphabetical">{t('alphabetical')}</option>
                                <option value="author">{t('authorName')}</option>
                            </select>
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-red-600 appearance-none text-center shadow-sm">
                                <option value="all">{t('allSubjects')}</option>
                                {filters.subjects.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-red-600 appearance-none text-center shadow-sm">
                                <option value="all">{t('allAuthors')}</option>
                                {filters.authors.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <select value={shelfFilter} onChange={(e) => setShelfFilter(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-red-600 appearance-none text-center shadow-sm col-span-2 md:col-span-1">
                                <option value="all">{t('allShelves')}</option>
                                {filters.shelves.map(o => <option key={o} value={o}>{`S: ${o}`}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-fade-up">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            {filteredBooks.length > visibleCount && (
                <div className="mt-16 text-center">
                    <button onClick={() => setVisibleCount(prev => prev + 16)} className="bg-slate-950 text-white dark:bg-white dark:text-black px-10 md:px-16 py-4 rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-2xl hover:scale-105 active:scale-90 transition-all uppercase tracking-widest">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
