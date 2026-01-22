import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// --- 1. الـ Hooks المساعدة ---
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

// --- 2. بيانات الترجمة (عشان الكود ميقفش) ---
const translations = {
  ar: {
    pageTitle: "مكتبة مدرسة صقر الإمارات",
    searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
    allSubjects: "المواضيع",
    allAuthors: "المؤلفين",
    allShelves: "الرفوف",
    sortBy: "فرز حسب",
    alphabetical: "أبجدياً",
    authorName: "المؤلف",
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
    pageTitle: "Falcon School Library Index",
    searchPlaceholder: "Search title or author...",
    allSubjects: "Subjects",
    allAuthors: "Authors",
    allShelves: "Shelves",
    sortBy: "Sort By",
    alphabetical: "Alphabetical",
    authorName: "Author",
    none: "Default",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found.",
    aiSubject: "Saqr AI Classified",
    close: "Close",
    subjectLabel: "Field",
    officialAi: "Official Saqr AI Summary"
  }
};

// --- 3. مكونات التصميم الصغيره ---
const ReflectionLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-30" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.1)_50%,transparent_55%)] animate-[shine_10s_infinite] opacity-50" />
  </div>
);

// --- 4. Component: BookModal ---
const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    if (!book) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-fade-up" onClick={onClose}>
            <div className="relative w-full max-w-4xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-2 bg-red-600 text-white rounded-full hover:rotate-90 transition-transform">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex-1 p-10 md:p-14 text-start">
                    <h2 className="text-3xl md:text-5xl text-slate-950 dark:text-white font-black mb-2 tracking-tighter">{book.title}</h2>
                    <p className="text-xl text-red-600 font-bold mb-8">By {book.author}</p>
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/20">
                        <p className="text-[11px] text-green-600 font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {t('officialAi')}
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 text-lg md:text-xl font-medium italic leading-relaxed">
                           "{book.summary || "This book is a valuable resource curated by Saqr AI."}"
                        </p>
                    </div>
                </div>
                <div className="w-full md:w-[300px] bg-slate-950 p-10 flex flex-col justify-center items-center text-white border-s border-white/10">
                    <div className="space-y-8 w-full text-center">
                        <div className="bg-red-600/20 p-6 rounded-[2rem] border border-red-600/30">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">{t('subjectLabel')}</p>
                            <p className="text-xl font-black">{book.subject}</p>
                        </div>
                        <div className="flex justify-center gap-10">
                            <div><p className="text-[10px] opacity-50 mb-1">SHELF</p><p className="text-5xl font-black">{book.shelf}</p></div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div><p className="text-[10px] opacity-50 mb-1">ROW</p><p className="text-5xl font-black">{book.row}</p></div>
                        </div>
                        <button onClick={onClose} className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 5. Component: BookCard ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isAi = !book.subject || book.subject === "Unknown";

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div 
      ref={cardRef} onMouseMove={handleMouseMove} onClick={onClick} 
      className="group relative glass-panel glass-card-interactive rounded-[2.5rem] p-1 cursor-pointer transition-all duration-500 hover:-translate-y-3 animate-fade-up border-none h-full"
    >
      <div className="relative overflow-hidden rounded-[2.4rem] bg-white/5 dark:bg-slate-900/20 h-full flex flex-col">
        <ReflectionLayer />
        <div className={`absolute top-0 start-0 w-2 h-full z-30 ${isAi ? 'bg-red-600' : 'bg-[#00732f]'}`} />
        <div className="p-8 relative z-10 flex-grow text-start">
           <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 ${isAi ? 'bg-red-600 text-white' : 'bg-[#00732f] text-white'}`}>
              {isAi ? t('aiSubject') : book.subject}
           </span>
          <h3 className="font-black text-2xl text-slate-950 dark:text-white leading-[1.1] mb-4 group-hover:text-red-600 transition-colors line-clamp-2">
              {book.title}
          </h3>
          <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-all">
              <span className="text-xl">👤</span>
              <p className="text-xs font-bold uppercase">{book.author}</p>
          </div>
        </div>
        <div className="bg-black/5 dark:bg-white/5 py-5 px-8 border-t border-white/10 mt-auto flex items-center justify-between relative z-10 backdrop-blur-md">
            <div className="flex gap-6 items-center">
                <div className="text-center"><p className="text-[9px] text-red-600 font-black mb-1">S</p><p className="text-lg font-black dark:text-white leading-none">{book.shelf}</p></div>
                <div className="w-px h-8 bg-slate-400/20" />
                <div className="text-center"><p className="text-[9px] text-[#00732f] font-black mb-1">R</p><p className="text-lg font-black dark:text-white leading-none">{book.row}</p></div>
            </div>
            <div className="w-10 h-10 rounded-full border border-red-600/20 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">➔</div>
        </div>
      </div>
    </div>
  );
});

// --- 6. Main Component: SearchPage ---
const SearchPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: string) => (translations as any)[locale][key] || key;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [shelfFilter, setShelfFilter] = useState('all');
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

        if (sortBy === 'alphabetical') {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale));
        } else if (sortBy === 'author') {
            result = [...result].sort((a, b) => a.author.localeCompare(b.author, locale));
        }
        return result;
    }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter, sortBy, locale]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-6 pb-40 relative z-10 antialiased font-black">
            <div className="sticky top-6 z-[100] mb-20 animate-fade-up">
                <div className="glass-panel p-4 md:p-6 rounded-[3.5rem] bg-white/80 dark:bg-slate-900/80 border-none shadow-2xl">
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <input 
                              type="text" 
                              placeholder={t('searchPlaceholder')} 
                              className="w-full p-6 ps-16 bg-white dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-[2.5rem] outline-none transition-all text-lg" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <svg className="absolute start-6 top-1/2 -translate-y-1/2 h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/10 font-black text-[11px] cursor-pointer appearance-none text-center backdrop-blur-md">
                                <option value="alphabetical">{t('alphabetical')}</option>
                                <option value="author">{t('authorName')}</option>
                            </select>
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/10 font-black text-[11px] cursor-pointer appearance-none text-center backdrop-blur-md">
                                <option value="all">{t('allSubjects')}</option>
                                {filters.subjects.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/10 font-black text-[11px] cursor-pointer appearance-none text-center backdrop-blur-md">
                                <option value="all">{t('allAuthors')}</option>
                                {filters.authors.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <select value={shelfFilter} onChange={(e) => setShelfFilter(e.target.value)} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/10 font-black text-[11px] cursor-pointer appearance-none text-center backdrop-blur-md">
                                <option value="all">{t('allShelves')}</option>
                                {filters.shelves.map(o => <option key={o} value={o}>{`S: ${o}`}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            {filteredBooks.length > visibleCount && (
                <div className="mt-32 text-center">
                    <button onClick={() => setVisibleCount(prev => prev + 16)} className="glass-button-red mx-auto">
                        EXPLORE MORE
                    </button>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />
        </div>
    );
};

export default SearchPage;
