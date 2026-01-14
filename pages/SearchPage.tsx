import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// Debounce Hook ثابت ومحسن
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
            localStorage.setItem('saqr_activity_logs', JSON.stringify(logs.slice(-100))); // حفظ آخر 100 سجل فقط للأداء
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
    aiGenerated: "AI Classified"
  }
};

// --- بطاقة الكتاب (Card) مع خاصية Memo للأداء ---
const BookCard = React.memo(({ book, onClick, t_search }: { book: Book; onClick: () => void; t_search: any }) => {
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleCardInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            onClick();
        }, 250);
    };

    return (
        <div 
            onMouseDown={handleCardInteraction}
            className="relative overflow-hidden glass-panel rounded-[1.5rem] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group active:scale-95 border-white/20 h-full"
        >
            {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
            <div className="p-5 flex-grow relative z-10">
                <h3 className="font-black text-lg text-gray-950 dark:text-white group-hover:text-red-600 transition-colors line-clamp-2 leading-tight mb-2">{book.title}</h3>
                <p className="text-sm text-green-700/80 dark:text-green-400/80 font-black mb-4">{book.author}</p>
                <span className="bg-red-600/10 text-red-600 dark:bg-red-600/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{book.subject}</span>
            </div>
            <div className="bg-white/40 dark:bg-black/40 py-3 px-5 border-t border-white/10 relative z-10">
                <p className="font-black text-gray-900 dark:text-white text-xs tracking-tighter flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
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
    const [visibleCount, setVisibleCount] = useState(24); // للتحميل التدريجي
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    // حساب الخيارات المتاحة مرة واحدة فقط لتحسين الأداء
    const filters = useMemo(() => ({
        subjects: [...new Set(bookData.map(b => b.subject))].filter(Boolean).sort(),
        authors: [...new Set(bookData.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
        shelves: [...new Set(bookData.map(b => b.shelf.toString()))].sort((a, b) => parseInt(a) - parseInt(b))
    }), []);

    // المنطق الأساسي للفلترة - دورة واحدة سريعة جداً
    const filteredBooks = useMemo(() => {
        const term = debouncedSearchTerm.toLowerCase().trim();
        
        return bookData.filter(b => {
            const matchesTerm = !term || 
                b.title.toLowerCase().includes(term) || 
                b.author.toLowerCase().includes(term) || 
                b.shelf.toString().includes(term);
            
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            const matchesShelf = shelfFilter === 'all' || b.shelf.toString() === shelfFilter;

            return matchesTerm && matchesSub && matchesAuth && matchesShelf;
        });
    }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);

    // تسجيل البحث في الخلفية
    useEffect(() => {
        if (debouncedSearchTerm) logActivity('search', debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    // إعادة تصفير العداد عند تغير الفلاتر
    useEffect(() => { setVisibleCount(24); }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);

    return (
        <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="text-center mb-10 animate-in fade-in duration-700">
                <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter">{t_search('pageTitle')}</h1>
                <div className="h-1.5 w-20 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]"></div>
            </div>
            
            <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] shadow-xl mb-10 sticky top-24 z-30 border-white/30 backdrop-blur-xl transition-all">
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder={t_search('searchPlaceholder')}
                        className="w-full p-5 ps-16 text-gray-950 bg-white/50 dark:bg-gray-900/50 dark:text-white border-2 border-transparent focus:border-red-600 rounded-[1.5rem] outline-none transition-all font-black text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-6 flex items-center pointer-events-none">
                        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-4 rounded-xl bg-white/30 dark:bg-gray-800/60 border border-white/10 dark:text-white font-black cursor-pointer">
                        <option value="all">{t_search('allSubjects')}</option>
                        {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-4 rounded-xl bg-white/30 dark:bg-gray-800/60 border border-white/10 dark:text-white font-black cursor-pointer">
                        <option value="all">{t_search('allAuthors')}</option>
                        {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>

                    <select value={shelfFilter} onChange={(e) => setShelfFilter(e.target.value)} className="w-full p-4 rounded-xl bg-white/30 dark:bg-gray-800/60 border border-white/10 dark:text-white font-black cursor-pointer">
                        <option value="all">{t_search('allShelves')}</option>
                        {filters.shelves.map(s => <option key={s} value={s}>{t_search('shelf')} {s}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="text-3xl font-black text-gray-950 dark:text-gray-100 tracking-tighter">{t_search('results')}</h2>
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
        </div>
    );
};

export default SearchPage;
