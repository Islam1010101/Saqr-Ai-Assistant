import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// Debounce Hook لضمان سلاسة البحث وعدم تجميد الواجهة
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const logActivity = (type: 'search' | 'view', value: string) => {
    if (!value) return;
    setTimeout(() => {
        try {
            const logs: any[] = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
            logs.push({ timestamp: Date.now(), type, value });
            localStorage.setItem('saqr_activity_logs', JSON.stringify(logs.slice(-100))); 
        } catch (e) { console.error(e); }
    }, 0);
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
    location: "موقع الكتاب",
    summary: "ملخص (AI صقر)",
    langEN: "الإنجليزية",
    langAR: "العربية",
    loadMore: "عرض المزيد من الكتب",
    classifying: "جاري التصنيف ذكياً...",
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
    loadMore: "Load More Books",
    classifying: "AI Classifying...",
    aiGenerated: "AI Classified"
  }
};

// --- نافذة تفاصيل الكتاب (Modal) ---
const BookModal: React.FC<{
  book: Book | null;
  onClose: () => void;
  onFilterByAuthor: (author: string) => void;
}> = ({ book, onClose, onFilterByAuthor }) => {
    const { locale, dir } = useLanguage();
    const t_search = (key: any) => translations[locale][key as keyof typeof translations.ar];
    
    const [summary, setSummary] = useState('');
    const [aiSubject, setAiSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    // دالة تتبع الماوس لتأثير الحواف الزجاجية
    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    };

    useEffect(() => {
        if (!book) return;
        const fetchAiInsights = async () => {
            setIsLoading(true); setSummary(''); setAiSubject('');
            try {
                const prompt = `Analyze the book: "${book.title}" by "${book.author}". 1. Category 2. 2-line summary. Format: SUBJECT: [cat] | SUMMARY: [sum]`;
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
        logActivity('view', book.id);
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
    const needsAiSubject = !book.subject || book.subject === 'Uncategorized' || book.subject === 'غير مصنف';

    return (
        <div dir={dir} className="fixed inset-0 bg-black/70 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div 
                onMouseMove={handleMouseMove}
                className="glass-panel glass-card-interactive rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl transform animate-in slide-in-from-bottom sm:zoom-in-95 border-white/20" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 sm:p-10 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white leading-tight">{book.title}</h2>
                            <p className="text-lg text-red-600 font-black mt-1">{book.author}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        <div className="glass-panel p-4 rounded-2xl border-white/10 bg-white/30">
                            <h4 className="font-black text-gray-500 text-[10px] uppercase mb-1 tracking-widest">{t_search('subject')}</h4>
                            <p className={`text-sm font-black ${isLoading && needsAiSubject ? 'animate-pulse text-gray-400' : 'text-gray-950 dark:text-white'}`}>
                                {needsAiSubject ? (aiSubject || t_search('classifying')) : book.subject}
                            </p>
                        </div>
                        <div className="glass-panel p-4 rounded-2xl border-white/10 bg-white/30 font-black text-sm flex flex-col justify-center">
                            <span className="text-[10px] text-gray-500 uppercase">{t_search('level')}</span>
                            {book.level}
                        </div>
                        <div className="glass-panel p-4 rounded-2xl border-white/10 bg-white/30 font-black text-sm flex flex-col justify-center">
                            <span className="text-[10px] text-gray-500 uppercase">Language</span>
                            {book.language === 'EN' ? t_search('langEN') : t_search('langAR')}
                        </div>
                    </div>

                    <div className="bg-red-600 p-6 rounded-2xl shadow-xl mb-6 text-white">
                        <p className="text-xs font-black uppercase opacity-80 mb-1">{t_search('location')}</p>
                        <p className="text-2xl font-black">{t_search('shelf')} {book.shelf} – {t_search('row')} {book.row}</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs">{t_search('summary')}</h4>
                        {isLoading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="bg-black/10 dark:bg-white/10 h-3 rounded-full w-full"></div>
                                <div className="bg-black/10 dark:bg-white/10 h-3 rounded-full w-4/5"></div>
                            </div>
                        ) : (
                           <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base sm:text-lg font-medium italic">"{summary}"</p>
                        )}
                    </div>
                </div>

                <div className="p-6 flex flex-col sm:flex-row gap-3 bg-black/5 dark:bg-white/5 border-t border-white/10 relative z-10">
                    <button 
                        onMouseDown={(e) => handleInteraction(e, onClose)}
                        className="relative overflow-hidden flex-1 glass-button-red py-4 rounded-xl font-black"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                        {t_search('close')}
                    </button>
                    <button 
                        onMouseDown={(e) => handleInteraction(e, () => onFilterByAuthor(book.author))}
                        className="relative overflow-hidden flex-1 bg-gray-900 text-white py-4 rounded-xl font-black"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect border-white/20" style={{ left: r.x, top: r.y }} />)}
                        {t_search('similarRecommendations')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب (Card) مع توهج الحواف ---
const BookCard = React.memo(({ book, onClick, t_search }: { book: Book; onClick: () => void; t_search: any }) => {
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (e.currentTarget as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    };

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 800);
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            onMouseDown={handleInteraction}
            onClick={onClick}
            className="relative overflow-hidden glass-panel glass-card-interactive rounded-[1.5rem] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group active:scale-95 border-white/20 h-full"
        >
            <div className="absolute inset-0 pointer-events-none z-0">
                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
            </div>
            
            <div className="p-5 flex-grow relative z-10">
                <h3 className="font-black text-lg text-gray-950 dark:text-white group-hover:text-red-600 transition-colors line-clamp-2 leading-tight mb-2 tracking-tighter">{book.title}</h3>
                <p className="text-sm text-green-700 dark:text-green-400 font-black mb-4">{book.author}</p>
                <span className="bg-red-600/10 text-red-600 dark:bg-red-600/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{book.subject}</span>
            </div>
            <div className="bg-white/40 dark:bg-black/40 py-3 px-5 border-t border-white/10 relative z-10">
                <p className="font-black text-gray-900 dark:text-white text-xs tracking-tighter flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                    {`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}
                </p>
            </div>
        </div>
    );
});

const SearchPage: React.FC = () => {
    const { locale } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [shelfFilter, setShelfFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(24);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const handleMouseMoveMain = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

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

    useEffect(() => {
        if (debouncedSearchTerm) logActivity('search', debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => { setVisibleCount(24); }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);

    return (
        <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="text-center mb-10 animate-in fade-in duration-700">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter">{t_search('pageTitle')}</h1>
                <div className="h-1.5 w-20 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]"></div>
            </div>
            
            <div 
                onMouseMove={handleMouseMoveMain}
                className="glass-panel glass-card-interactive p-6 md:p-8 rounded-[2.5rem] shadow-xl mb-10 sticky top-24 z-30 border-white/30 backdrop-blur-xl transition-all"
            >
                <div className="relative mb-6 z-10">
                    <input
                        type="text"
                        placeholder={t_search('searchPlaceholder')}
                        className="w-full p-4 sm:p-5 ps-12 sm:ps-16 text-gray-950 bg-white/50 dark:bg-gray-900/50 dark:text-white border-2 border-transparent focus:border-red-600 rounded-[1.5rem] outline-none transition-all font-black text-base sm:text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-4 sm:start-6 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 sm:w-7 sm:h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                    <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-4 rounded-xl bg-white/30 dark:bg-gray-800/60 border border-white/10 dark:text-white font-black cursor-pointer appearance-none">
                        <option value="all">{t_search('allSubjects')}</option>
                        {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-4 rounded-xl bg-white/30 dark:bg-gray-800/60 border border-white/10 dark:text-white font-black cursor-pointer appearance-none">
                        <option value="all">{t_search('allAuthors')}</option>
                        {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <select value={shelfFilter} onChange={(e) => setShelfFilter(e.target.value)} className="w-full p-4 rounded-xl bg-white/30 dark:bg-gray-800/60 border border-white/10 dark:text-white font-black cursor-pointer appearance-none">
                        <option value="all">{t_search('allShelves')}</option>
                        {filters.shelves.map(s => <option key={s} value={s}>{t_search('shelf')} {s}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-gray-100 tracking-tighter">{t_search('results')}</h2>
                <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-lg font-black shadow-lg">{filteredBooks.length}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} t_search={t_search} />
                ))}
            </div>

            {filteredBooks.length > visibleCount && (
                <div className="mt-12 text-center">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 24)}
                        className="glass-button-red px-10 py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
                    >
                        {t_search('loadMore')}
                    </button>
                </div>
            )}

            {filteredBooks.length === 0 && (
                <div className="glass-panel text-center py-24 rounded-[3rem] border-2 border-dashed border-white/20">
                    <div className="text-7xl mb-6 opacity-30">🔍</div>
                    <p className="text-gray-400 text-2xl font-black">{t_search('noResults')}</p>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} onFilterByAuthor={(a) => { setAuthorFilter(a); setSelectedBook(null); window.scrollTo({top:0, behavior:'smooth'}); }} />
        </div>
    );
};

export default SearchPage;
