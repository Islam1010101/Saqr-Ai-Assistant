import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// Debounce Hook لضمان استجابة سريعة
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
    pageTitle: "البحث في الفهرس الوطني",
    searchPlaceholder: "ابحث عن عنوان، مؤلف، أو موضوع...",
    allSubjects: "جميع المواضيع",
    allAuthors: "جميع المؤلفين",
    allShelves: "جميع الرفوف",
    results: "نتائج البحث",
    shelf: "الرف",
    row: "الصف",
    noResults: "لم يتم العثور على نتائج تطابق بحثك.",
    loadMore: "استكشاف المزيد",
    details: "تفاصيل الكتاب",
    location: "موقع المصدر"
  },
  en: {
    pageTitle: "National Index Search",
    searchPlaceholder: "Search title, author, or topic...",
    allSubjects: "All Subjects",
    allAuthors: "All Authors",
    allShelves: "All Shelves",
    results: "Search Results",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found for your search.",
    loadMore: "Explore More",
    details: "Book Details",
    location: "Resource Location"
  }
};

// --- نافذة تفاصيل الكتاب (تنسيق فخم عالي التباين) ---
const BookModal: React.FC<{
  book: Book | null;
  onClose: () => void;
  onFilterByAuthor: (author: string) => void;
}> = ({ book, onClose, onFilterByAuthor }) => {
    const { locale, dir } = useLanguage();
    const t = (key: any) => translations[locale][key as keyof typeof translations.ar];
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    if (!book) return null;

    return (
        <div dir={dir} className="fixed inset-0 bg-black/90 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-6 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-2xl rounded-t-[3rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl border-white/20 dark:border-white/5 flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-10" onClick={(e) => e.stopPropagation()}>
                
                {/* هيدر المودال */}
                <div className="p-8 sm:p-12 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-900/50">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-3">{t('details')}</span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white leading-tight tracking-tighter">{book.title}</h2>
                            <p className="text-xl text-green-700 dark:text-green-400 font-bold mt-2">{book.author}</p>
                        </div>
                        <button onClick={onClose} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-red-600 hover:text-white transition-all">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* محتوى المودال */}
                <div className="p-8 sm:p-12 overflow-y-auto space-y-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</h4>
                            <p className="text-lg font-black dark:text-white">{book.subject}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Level</h4>
                            <p className="text-lg font-black dark:text-white">{book.level}</p>
                        </div>
                    </div>

                    <div className="bg-green-700 p-8 sm:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-125 duration-1000"></div>
                        <h3 className="text-xs font-black uppercase opacity-70 mb-3 tracking-[0.2em]">{t('location')}</h3>
                        <p className="text-3xl sm:text-5xl font-black tracking-tighter">
                            {t('shelf')} {book.shelf} <span className="mx-2 opacity-30">|</span> {t('row')} {book.row}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] flex items-center gap-2">
                             <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                             Saqr AI Summary
                        </h4>
                        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                            <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-lg sm:text-xl font-medium italic">
                                "{book.summary || 'Exploring this resource provides deep insights into its core subject matter.'}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* أزرار التحكم */}
                <div className="p-8 sm:p-10 bg-white/80 dark:bg-slate-950/80 border-t border-slate-100 dark:border-white/5 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-5 rounded-2xl font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all uppercase tracking-widest text-xs">
                        Close
                    </button>
                    <button onClick={() => onFilterByAuthor(book.author)} className="flex-[2] bg-gray-950 text-white dark:bg-white dark:text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">
                        Similar by Author
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب (UAE Modern Style) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
    return (
        <div 
            onClick={onClick}
            className="group relative glass-panel bg-white dark:bg-[#0f172a] border-white/60 dark:border-white/5 rounded-[2.5rem] hover:scale-[1.03] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden shadow-lg hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]"
        >
            <div className="p-8 flex-grow relative z-10">
                <div className="flex justify-between items-start mb-6">
                     <span className="bg-green-600/10 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-green-600/20">{book.subject}</span>
                     <div className="text-2xl opacity-40 group-hover:opacity-100 group-hover:rotate-12 transition-all">📖</div>
                </div>
                <h3 className="font-black text-xl sm:text-2xl text-slate-950 dark:text-white leading-[1.2] mb-3 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2 h-14">{book.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">{book.author}</p>
            </div>
            
            <div className="bg-slate-50/80 dark:bg-white/5 py-5 px-8 border-t border-slate-100 dark:border-white/5 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(5,150,105,0.5)]"></div>
                    <span className="font-black text-slate-900 dark:text-white text-[11px] uppercase tracking-tighter">
                        Shelf {book.shelf} - Row {book.row}
                    </span>
                </div>
                <svg className="h-5 w-5 text-red-600 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
        </div>
    );
});

const SearchPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
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

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-32 animate-fade-up relative z-10">
            
            {/* عنوان الصفحة الوطني */}
            <div className="text-center mb-16 pt-12">
                <h1 className="text-5xl sm:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-none mb-6">
                    {t('pageTitle')}
                </h1>
                <div className="flex items-center justify-center gap-3">
                    <div className="h-1.5 w-12 bg-red-600 rounded-full"></div>
                    <div className="h-1.5 w-24 bg-green-700 rounded-full"></div>
                    <div className="h-1.5 w-12 bg-red-600 rounded-full"></div>
                </div>
            </div>
            
            {/* بار البحث المركزي العملاق */}
            <div className="glass-panel p-8 md:p-16 rounded-[3.5rem] md:rounded-[5rem] shadow-2xl mb-24 sticky top-28 z-40 border-white/40 dark:border-white/5 backdrop-blur-3xl">
                <div className="relative mb-12 group">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="w-full p-8 md:p-12 ps-20 md:ps-28 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-green-600 rounded-[3rem] outline-none transition-all font-black text-xl md:text-4xl shadow-inner placeholder-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-8 md:start-12 flex items-center pointer-events-none text-green-700">
                        <svg className="w-10 h-10 md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { val: subjectFilter, set: setSubjectFilter, opt: filters.subjects, label: t('allSubjects') },
                        { val: authorFilter, set: setAuthorFilter, opt: filters.authors, label: t('allAuthors') },
                        { val: shelfFilter, set: setShelfFilter, opt: filters.shelves, label: t('allShelves') }
                    ].map((f, i) => (
                        <div key={i} className="relative group">
                            <select 
                                value={f.val} 
                                onChange={(e) => f.set(e.target.value)} 
                                className="w-full p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 font-black text-lg cursor-pointer focus:border-red-600 transition-all outline-none appearance-none shadow-sm"
                            >
                                <option value="all">{f.label}</option>
                                {f.opt.map(o => <option key={o} value={o}>{o.startsWith('all') ? o : (i === 2 ? `Shelf ${o}` : o)}</option>)}
                            </select>
                            <div className="absolute end-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* قسم النتائج */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 px-8 gap-6">
                <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tighter flex items-center gap-4">
                    {t('results')}
                    <span className="h-2 w-2 bg-red-600 rounded-full animate-ping"></span>
                </h2>
                <div className="bg-slate-950 text-white dark:bg-white dark:text-black px-10 py-3 rounded-2xl text-xl sm:text-3xl font-black shadow-xl rotate-[1deg]">
                    {filteredBooks.length}
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} t={t} />
                ))}
            </div>

            {filteredBooks.length > visibleCount && (
                <div className="mt-32 text-center">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 24)}
                        className="relative overflow-hidden bg-red-600 text-white px-20 py-7 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                    >
                        {t('loadMore')}
                    </button>
                </div>
            )}

            {filteredBooks.length === 0 && (
                <div className="glass-panel text-center py-48 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-white/5">
                    <div className="text-9xl mb-10 opacity-10 grayscale">🔎</div>
                    <p className="text-slate-400 dark:text-slate-500 text-3xl font-black">{t('noResults')}</p>
                </div>
            )}

            <BookModal 
                book={selectedBook} 
                onClose={() => setSelectedBook(null)} 
                onFilterByAuthor={(a) => { setAuthorFilter(a); setSelectedBook(null); window.scrollTo({top:0, behavior:'smooth'}); }} 
            />
        </div>
    );
};

export default SearchPage;
