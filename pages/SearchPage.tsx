import React, { useState, useEffect, useCallback } from 'react';
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

const logActivity = (type: 'search' | 'view', value: string) => {
    try {
        const logs: any[] = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
        logs.push({ timestamp: Date.now(), type, value });
        localStorage.setItem('saqr_activity_logs', JSON.stringify(logs));
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

const translations = {
  ar: {
    pageTitle: "البحث في المكتبة",
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
    language: "اللغة",
    location: "موقع الكتاب",
    summary: "ملخص (AI صقر)",
    langEN: "الإنجليزية",
    langAR: "العربية",
    classifying: "جاري التصنيف...",
    aiGenerated: "تصنيف ذكي"
  },
  en: {
    pageTitle: "Library Search",
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
    classifying: "Classifying...",
    aiGenerated: "AI Classified"
  }
};

// --- نافذة تفاصيل الكتاب (Modal) بتموجات حمراء ---
const BookModal: React.FC<{
  book: Book | null;
  onClose: () => void;
  onFilterByAuthor: (author: string) => void;
}> = ({ book, onClose, onFilterByAuthor }) => {
    const { locale, dir } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    const [summary, setSummary] = useState('');
    const [aiSubject, setAiSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, callback: () => void) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x, y }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            callback();
        }, 350);
    };

    useEffect(() => {
        if (!book) return;
        const fetchAiInsights = async () => {
            setIsLoading(true); setSummary(''); setAiSubject('');
            try {
                const prompt = `Analyze: "${book.title}" by "${book.author}". 1. Category 2. 2-line summary. Format: SUBJECT: [cat] | SUMMARY: [sum]`;
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], locale }),
                });
                const data = await response.json();
                const reply = data.reply || "";
                if (reply.includes('|')) {
                    const [sub, sum] = reply.split('|');
                    setAiSubject(sub.replace(/SUBJECT:/i, '').trim());
                    setSummary(sum.replace(/SUMMARY:/i, '').trim());
                } else { setSummary(reply); }
            } catch (error) { setSummary(book.summary || t_search('noResults')); } finally { setIsLoading(false); }
        };
        fetchAiInsights();
    }, [book, locale]); 

    if (!book) return null;
    const needsAiSubject = book.subject === 'Uncategorized' || book.subject === 'غير مصنف' || !book.subject;

    return (
        <div dir={dir} className="fixed inset-0 bg-black/70 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl transform animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 border-white/20" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 sm:p-10">
                    <div className="flex justify-between items-start gap-4 mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-950 dark:text-white leading-tight">{book.title}</h2>
                            <p className="text-base sm:text-lg text-green-700 dark:text-green-400 font-black mt-1">{book.author}</p>
                        </div>
                        <button onClick={onClose} className="p-2 sm:p-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-all active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 mb-6">
                        <div className="glass-panel p-3 sm:p-5 rounded-2xl border-white/10 bg-white/30">
                            <h4 className="font-black text-gray-500 text-[10px] uppercase mb-1 tracking-widest">{t_search('subject')}</h4>
                            <div className="flex flex-col gap-1">
                                <p className={`text-sm sm:text-base font-black ${isLoading && needsAiSubject ? 'animate-pulse text-gray-400' : 'text-gray-950 dark:text-gray-100'}`}>
                                    {needsAiSubject ? (aiSubject || t_search('classifying')) : book.subject}
                                </p>
                                {aiSubject && needsAiSubject && <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded-md self-start animate-bounce uppercase">{t_search('aiGenerated')}</span>}
                            </div>
                        </div>
                        <div className="glass-panel p-3 sm:p-5 rounded-2xl border-white/10 bg-white/30 text-gray-950 dark:text-gray-100 font-black text-sm sm:text-base">{book.level}</div>
                        <div className="glass-panel p-3 sm:p-5 rounded-2xl border-white/10 bg-white/30 text-gray-950 dark:text-gray-100 font-black text-sm sm:text-base">{book.language === 'EN' ? t_search('langEN') : t_search('langAR')}</div>
                    </div>

                    <div className="bg-green-700 p-5 sm:p-8 rounded-[1.5rem] border border-green-600 shadow-xl mb-6">
                        <h4 className="text-xs sm:text-sm font-black text-green-50 mb-1 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            {t_search('location')}
                        </h4>
                        <p className="text-white font-black text-xl sm:text-3xl tracking-tighter">{`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs">{t_search('summary')}</h4>
                        {isLoading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="bg-black/10 dark:bg-white/10 h-3 rounded-full w-full"></div>
                                <div className="bg-black/10 dark:bg-white/10 h-3 rounded-full w-4/5"></div>
                            </div>
                        ) : (
                           <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base sm:text-lg font-medium">{summary}</p>
                        )}
                    </div>
                </div>

                <div className="p-5 sm:p-8 flex flex-col sm:flex-row justify-end gap-3 bg-black/5 dark:bg-white/5 border-t border-white/10 backdrop-blur-md">
                    <button 
                        onMouseDown={(e) => handleInteraction(e, onClose)}
                        onTouchStart={(e) => handleInteraction(e, onClose)}
                        className="relative overflow-hidden w-full sm:w-auto glass-button-red px-6 py-3 rounded-xl font-black text-sm"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                        <span className="relative z-10">{t_search('close')}</span>
                    </button>
                    <button 
                        onMouseDown={(e) => handleInteraction(e, () => book && onFilterByAuthor(book.author))}
                        onTouchStart={(e) => handleInteraction(e, () => book && onFilterByAuthor(book.author))}
                        className="relative overflow-hidden w-full sm:w-auto glass-button-green px-6 py-3 rounded-xl font-black text-sm shadow-lg"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                        <span className="relative z-10">{t_search('similarRecommendations')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب (Card) بتموجات حمراء ---
const BookCard: React.FC<{ book: Book; onClick: () => void }> = ({ book, onClick }) => {
    const { locale } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleCardInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x, y }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            onClick();
        }, 300);
    };

    return (
        <div 
            onMouseDown={handleCardInteraction}
            onTouchStart={handleCardInteraction}
            className="relative overflow-hidden glass-panel rounded-[1.5rem] sm:rounded-[2rem] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group active:scale-95 border-white/20"
        >
            {/* التموج الأحمر الحصري */}
            {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
            
            <div className="p-5 sm:p-7 flex-grow relative z-10">
                <h3 className="font-black text-lg sm:text-xl text-gray-950 dark:text-white group-hover:text-red-600 transition-colors line-clamp-2 leading-tight mb-2 tracking-tighter">{book.title}</h3>
                <p className="text-sm sm:text-base text-green-700/80 dark:text-green-400/80 font-black mb-4">{book.author}</p>
                <span className="bg-red-600/10 text-red-600 dark:bg-red-600/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-600/20">{book.subject}</span>
            </div>
            <div className="bg-white/40 dark:bg-black/40 py-3 px-5 sm:px-7 border-t border-white/10 relative z-10">
                <p className="font-black text-gray-900 dark:text-white text-xs sm:text-sm tracking-tighter flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                    {`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}
                </p>
            </div>
        </div>
    );
};

const SearchPage: React.FC = () => {
    const { locale } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [shelfFilter, setShelfFilter] = useState('all');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>(bookData);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const subjects = [...new Set(bookData.map((b: Book) => b.subject))].filter(Boolean).sort();
    const authors = [...new Set(bookData.map((b: Book) => b.author))].filter(a => a !== 'Unknown Author').sort();
    const shelves = [...new Set(bookData.map((b: Book) => b.shelf.toString()))].sort((a, b) => parseInt(a) - parseInt(b));

    const handleSearch = useCallback(() => {
        let books = [...bookData];
        if (debouncedSearchTerm) {
            logActivity('search', debouncedSearchTerm.trim());
            const term = debouncedSearchTerm.toLowerCase();
            books = books.filter(b => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term) || b.shelf.toString().includes(term));
        }
        if (subjectFilter !== 'all') books = books.filter(b => b.subject === subjectFilter);
        if (authorFilter !== 'all') books = books.filter(b => b.author === authorFilter);
        if (shelfFilter !== 'all') books = books.filter(b => b.shelf.toString() === shelfFilter);
        setFilteredBooks(books);
    }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);
    
    useEffect(() => { handleSearch(); }, [handleSearch]);

    return (
        <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="text-center mb-8 sm:mb-12 animate-in fade-in duration-700">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter">{t_search('pageTitle')}</h1>
                <div className="h-1.5 w-16 sm:w-24 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]"></div>
            </div>
            
            <div className="glass-panel p-4 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3.5rem] shadow-xl mb-10 sticky top-20 sm:top-24 z-30 border-white/30 backdrop-blur-xl transition-all">
                <div className="relative mb-6 sm:mb-8">
                    <input
                        type="text"
                        placeholder={t_search('searchPlaceholder')}
                        className="w-full p-4 sm:p-6 ps-12 sm:ps-16 text-gray-950 bg-white/50 dark:bg-gray-900/50 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl sm:rounded-[2rem] outline-none transition-all font-black text-base sm:text-xl placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-4 sm:start-6 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 sm:w-7 sm:h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
                    {[ 
                        { val: subjectFilter, set: setSubjectFilter, opts: subjects, all: t_search('allSubjects'), label: '' },
                        { val: authorFilter, set: setAuthorFilter, opts: authors, all: t_search('allAuthors'), label: '' },
                        { val: shelfFilter, set: setShelfFilter, opts: shelves, all: t_search('allShelves'), label: t_search('shelf') }
                    ].map((filter, idx) => (
                        <div key={idx} className="relative group">
                            <select 
                                value={filter.val} 
                                onChange={(e) => filter.set(e.target.value)} 
                                className="w-full p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/30 dark:bg-gray-900/60 border border-white/10 dark:text-white appearance-none font-black text-xs sm:text-base cursor-pointer transition-all"
                            >
                                <option value="all" className="bg-white dark:bg-gray-900">{filter.all}</option>
                                {filter.opts.map((opt: string) => (
                                    <option key={opt} value={opt} className="bg-white dark:bg-gray-900">{filter.label ? `${filter.label} ${opt}` : opt}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 end-4 flex items-center pointer-events-none text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-2 sm:px-6">
                <h2 className="text-2xl sm:text-4xl font-black text-gray-950 dark:text-gray-100 tracking-tighter">{t_search('results')}</h2>
                <span className="bg-red-600 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full text-base sm:text-xl font-black shadow-lg animate-pulse">
                    {filteredBooks.length}
                </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {filteredBooks.map((book: Book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            {filteredBooks.length === 0 && (
                <div className="glass-panel text-center py-20 sm:py-32 rounded-[2rem] sm:rounded-[4rem] border-2 border-dashed border-white/30">
                    <div className="text-6xl sm:text-8xl mb-4 sm:mb-8 opacity-50">🔍</div>
                    <p className="text-gray-400 text-xl sm:text-3xl font-black">{t_search('noResults')}</p>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} onFilterByAuthor={(a) => { setAuthorFilter(a); setSelectedBook(null); window.scrollTo({top:0, behavior:'smooth'}); }} />
        </div>
    );
};

export default SearchPage;
