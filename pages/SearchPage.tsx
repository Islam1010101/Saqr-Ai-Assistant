import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// Debounce لضمان سلاسة البحث
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
    pageTitle: "الفهرس الوطني الذكي",
    searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
    allSubjects: "المواضيع",
    allAuthors: "المؤلفين",
    allShelves: "الرفوف",
    shelf: "الرف",
    row: "الصف",
    noResults: "لا توجد نتائج.",
    aiSubject: "تصنيف صقر AI",
    details: "معلومات المصدر",
    close: "إغلاق"
  },
  en: {
    pageTitle: "National Smart Index",
    searchPlaceholder: "Search title or author...",
    allSubjects: "Subjects",
    allAuthors: "Authors",
    allShelves: "Shelves",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found.",
    aiSubject: "Saqr AI Classified",
    details: "Resource Info",
    close: "Close"
  }
};

// --- نافذة تفاصيل الكتاب (Modal) ---
const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    if (!book) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-xl p-8 md:p-12 rounded-[3rem] border-white/40 shadow-2xl relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-8 end-8 p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <span className="inline-block bg-green-600/10 text-green-700 px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">{book.subject === 'Unknown' ? t('aiSubject') : book.subject}</span>
                <h2 className="text-3xl font-black text-slate-950 dark:text-white mb-2 leading-tight">{book.title}</h2>
                <p className="text-xl text-slate-500 font-bold mb-8">{book.author}</p>
                <div className="bg-slate-950 text-white p-8 rounded-[2rem] flex justify-around text-center shadow-xl">
                    <div><p className="text-[10px] opacity-50 uppercase mb-1">{t('shelf')}</p><p className="text-3xl font-black">{book.shelf}</p></div>
                    <div className="w-px h-12 bg-white/10"></div>
                    <div><p className="text-[10px] opacity-50 uppercase mb-1">{t('row')}</p><p className="text-3xl font-black">{book.row}</p></div>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب (بدون أيقونات + تأثير الضغط) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
    const displaySubject = useMemo(() => (!book.subject || book.subject === "Unknown" ? t('aiSubject') : book.subject), [book.subject, t]);
    return (
        <div 
            onClick={onClick}
            className="group relative glass-panel bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/5 rounded-[2rem] transition-all duration-150 cursor-pointer flex flex-col h-full overflow-hidden shadow-lg active:scale-95 active:shadow-inner hover:border-red-600/40"
        >
            <div className="p-6 flex-grow">
                 <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 ${book.subject === 'Unknown' ? 'bg-red-600/10 text-red-600' : 'bg-green-600/10 text-green-700'}`}>
                    {displaySubject}
                 </span>
                <h3 className="font-black text-lg text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">
                    {book.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">{book.author}</p>
            </div>
            <div className="bg-white/40 dark:bg-black/20 py-4 px-6 border-t border-white/10 mt-auto">
                <p className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-tighter">
                    S:{book.shelf} — R:{book.row}
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
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [visibleCount, setVisibleCount] = useState(24);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filters = useMemo(() => ({
        subjects: [...new Set(bookData.map(b => b.subject))].filter(s => s !== "Unknown").sort(),
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

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-24 relative z-10">
            
            {/* شريط البحث النخبوي المصغر */}
            <div className="sticky top-24 z-50 mb-10 animate-fade-up">
                <div className="glass-panel p-4 md:p-5 rounded-[2.5rem] shadow-2xl border-white/40 dark:border-white/5 backdrop-blur-3xl">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* حقل البحث */}
                        <div className="flex-[2] relative">
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="w-full p-4 ps-12 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl outline-none transition-all font-black text-base shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        
                        {/* الفلاتر الذكية */}
                        <div className="flex-[3] grid grid-cols-3 gap-2">
                            {[
                                { val: subjectFilter, set: setSubjectFilter, options: filters.subjects, label: t('allSubjects') },
                                { val: authorFilter, set: setAuthorFilter, options: filters.authors, label: t('allAuthors') },
                                { val: shelfFilter, set: setShelfFilter, options: filters.shelves, label: t('allShelves') }
                            ].map((f, i) => (
                                <select 
                                    key={i} value={f.val} onChange={(e) => f.set(e.target.value)}
                                    className="p-3 rounded-xl bg-white/80 dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-green-600 transition-all shadow-sm"
                                >
                                    <option value="all">{f.label}</option>
                                    {f.options.map(o => <option key={o} value={o}>{i === 2 ? `${t('shelf')} ${o}` : o}</option>)}
                                </select>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* شبكة الكتب */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 animate-fade-up">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard 
                        key={book.id} book={book} t={t}
                        onClick={() => setSelectedBook(book)} 
                    />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            {/* عرض المزيد */}
            {filteredBooks.length > visibleCount && (
                <div className="mt-12 text-center">
                    <button onClick={() => setVisibleCount(prev => prev + 24)} className="bg-slate-950 text-white dark:bg-white dark:text-black px-10 py-3 rounded-xl font-black text-sm shadow-xl active:scale-90 transition-all uppercase tracking-widest">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
