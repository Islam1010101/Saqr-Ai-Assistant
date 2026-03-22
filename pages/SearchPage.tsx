import React, { useState, useEffect, useMemo, useRef } from 'react';
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

const translations = {
  ar: {
    pageTitle: "مكتبة مدرسة صقر الإمارات",
    searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
    allSubjects: "جميع المواضيع",
    allAuthors: "جميع المؤلفين",
    allShelves: "جميع الرفوف",
    sortBy: "فرز حسب",
    alphabetical: "أبجدياً",
    authorName: "المؤلف",
    none: "تلقائي",
    shelf: "الرف",
    row: "الصف",
    noResults: "لا توجد نتائج.",
    aiSubject: "تصنيف صقر الذكي",
    close: "إغلاق",
    subjectLabel: "الموضوع",
    officialAi: "تحليل صقر الذكي",
    exploreMore: "استكشف المزيد"
  },
  en: {
    pageTitle: "Falcon School Library Index",
    searchPlaceholder: "Search title or author...",
    allSubjects: "All Subjects",
    allAuthors: "All Authors",
    allShelves: "All Shelves",
    sortBy: "Sort By",
    alphabetical: "Alphabetical",
    authorName: "Author",
    none: "Default",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found.",
    aiSubject: "Saqr AI Classified",
    close: "Close",
    subjectLabel: "Topic",
    officialAi: "Saqr AI Analysis",
    exploreMore: "EXPLORE MORE"
  }
};

// --- 2. Component: BookModal (تم التعديل للتوسيط المطلق وتغيير الألوان) ---
const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale, dir } = useLanguage();
    const [aiContent, setAiContent] = useState({ summary: '', genre: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!book) return;
        
        const fetchAiDeepDive = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{
                            role: 'system',
                            content: `Analyze the book titled "${book.title}" ${book.author ? `by "${book.author}"` : ''}. Provide: 1. A clear 2-sentence summary. 2. A specific Topic (Genre). Language: ${locale === 'ar' ? 'Arabic' : 'English'}. Return JSON ONLY: {"summary": "...", "genre": "..."}`
                        }]
                    })
                });
                const data = await response.json();
                const parsed = JSON.parse(data.reply.replace(/```json|```/g, '').trim());
                setAiContent(parsed);
            } catch (err) {
                setAiContent({ 
                    summary: book.summary || (locale === 'ar' ? "كتاب متميز يفتح آفاق المعرفة للقارئ." : "An exceptional book that expands the reader's horizons."),
                    genre: book.subject !== "Unknown" ? book.subject : (locale === 'ar' ? "عام" : "General")
                });
            } finally { setLoading(false); }
        };

        fetchAiDeepDive();
    }, [book, locale]);

    if (!book) return null;

    return (
        // تم استخدام flex مع items-center و justify-center لضمان التوسيط في منتصف الشاشة تماماً
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8 backdrop-blur-md bg-slate-900/60 animate-fade-in" onClick={onClose}>
            <div 
                dir={dir}
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20 dark:border-white/5 animate-zoom-in" 
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* زر الإغلاق */}
                <button onClick={onClose} className={`absolute top-6 ${locale === 'ar' ? 'left-6' : 'right-6'} z-50 p-2 md:p-3 bg-slate-100 hover:bg-red-100 dark:bg-slate-800 dark:hover:bg-red-900/40 text-slate-500 hover:text-red-600 transition-all rounded-full shadow-md`}>
                    <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* المحتوى النصي والملخص */}
                <div className="p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col items-center text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-red-100 dark:border-red-500/20 shadow-sm">Saqr AI Insight</span>
                    <h2 className="text-3xl md:text-5xl text-slate-900 dark:text-white font-black leading-tight mb-3 tracking-tighter">{book.title}</h2>
                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-bold mb-10 opacity-70">By {book.author}</p>
                    
                    {/* بيانات الرف والصف (في الوسط) */}
                    <div className="w-full max-w-lg bg-slate-50/50 dark:bg-white/5 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] mb-10 flex flex-col items-center border border-slate-100 dark:border-white/5 shadow-inner">
                        <div className="text-center mb-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 opacity-60">{t('subjectLabel')}</p>
                            <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                                {loading ? '...' : (aiContent.genre || book.subject)}
                            </p>
                        </div>
                        
                        <div className="w-full h-px bg-slate-200/50 dark:bg-white/10 mb-8"></div>
                        
                        <div className="flex justify-center gap-12 md:gap-24 w-full">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 opacity-60">{t('shelf')}</p>
                                <p className="text-5xl md:text-6xl font-black text-red-600 drop-shadow-sm">{book.shelf}</p>
                            </div>
                            <div className="w-px bg-slate-200/50 dark:bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 opacity-60">{t('row')}</p>
                                {/* تم تغيير اللون إلى الأخضر الإماراتي */}
                                <p className="text-5xl md:text-6xl font-black text-green-600 drop-shadow-sm">{book.row}</p>
                            </div>
                        </div>
                    </div>

                    {/* الملخص */}
                    <div className="w-full bg-slate-50 dark:bg-white/5 p-8 md:p-10 rounded-[2rem] border border-slate-100 dark:border-white/5 relative text-start mb-10 shadow-sm">
                        <div className="flex items-center gap-3 mb-5">
                           <span className={`w-2.5 h-2.5 rounded-full ${loading ? 'animate-ping bg-red-600' : 'bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.5)]'}`}></span>
                           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{t('officialAi')}</p>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-lg md:text-2xl font-bold leading-relaxed">
                           {loading ? <span className="animate-pulse opacity-50">...</span> : `"${aiContent.summary}"`}
                        </p>
                    </div>

                    <button onClick={onClose} className="w-full max-w-xs mx-auto bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-5 rounded-full hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest text-xs md:text-sm shadow-xl active:scale-95">
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 3. Component: BookCard (تغيير الأزرق إلى أخضر) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";

  return (
    <div onClick={onClick} className="group bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-white/5 hover:border-red-600/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden cursor-pointer h-full relative">
      
      {/* الخط الجانبي - أخضر للهوية الوطنية */}
      <div className={`absolute top-0 start-0 w-2 h-full transition-all duration-500 ${isAi ? 'bg-red-600 shadow-[2px_0_10px_rgba(220,38,38,0.2)]' : 'bg-green-600 shadow-[2px_0_10px_rgba(22,163,74,0.2)]'}`}></div>

      <div className="p-8 flex-1 flex flex-col text-start">
        {/* شارة التصنيف - أخضر */}
        <span className={`self-start px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-5 border
            ${isAi ? 'bg-red-50 dark:bg-red-600/10 text-red-600 border-red-200 dark:border-red-600/20' : 'bg-green-50 dark:bg-green-600/10 text-green-600 border-green-200 dark:border-green-600/20'}`}>
            {isAi ? t('aiSubject') : book.subject}
        </span>
        
        <h3 className="font-black text-xl md:text-2xl text-slate-950 dark:text-white leading-tight mb-4 group-hover:text-red-600 transition-colors line-clamp-2">
            {book.title}
        </h3>
        
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-auto truncate flex items-center gap-2">
            <span className="text-lg opacity-50">👤</span> {book.author}
        </p>
      </div>

      <div className="bg-slate-50/50 dark:bg-white/5 px-8 py-5 flex justify-between items-center border-t border-slate-100 dark:border-white/5">
        <div className="flex gap-8 items-center">
            <div className="text-center">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest opacity-60">{t('shelf')}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{book.shelf}</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
            <div className="text-center">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest opacity-60">{t('row')}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{book.row}</p>
            </div>
        </div>
        
        <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all shadow-sm">
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  );
});

// --- 4. Main Component: SearchPage ---
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
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col transition-colors duration-700 py-6 md:py-10 px-4 md:px-6 relative">
            
            {/* الخلفية الديناميكية الموحدة بألوان الهوية الوطنية */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-30">
               <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[150px]"></div>
               {/* تم تغيير اللون الأزرق في الخلفية إلى أخضر إماراتي */}
               <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-green-600/15 rounded-full blur-[150px]"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col animate-fade-in-up pb-20">
                
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">{t('pageTitle')}</h1>
                    <div className="h-1.5 w-24 bg-red-600 mx-auto mt-6 rounded-full shadow-lg"></div>
                </div>

                <div className="sticky top-4 md:top-8 z-[100] mb-12 md:mb-20">
                    <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-[2.5rem] md:rounded-[4rem] p-5 md:p-8 transition-all">
                        <div className="flex flex-col gap-5">
                            
                            <div className="relative group">
                                <input 
                                  type="text" 
                                  placeholder={t('searchPlaceholder')} 
                                  className="w-full py-5 px-8 ps-16 md:ps-20 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-red-600 dark:focus:border-red-600 rounded-3xl outline-none transition-all text-slate-950 dark:text-white font-bold text-base md:text-xl placeholder-slate-400 shadow-inner" 
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                <svg className="absolute start-6 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 text-slate-400 group-focus-within:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {[
                                    { id: 'sortBy', val: sortBy, set: setSortBy, opts: ['alphabetical', 'author'] },
                                    { id: 'allSubjects', val: subjectFilter, set: setSubjectFilter, opts: filters.subjects },
                                    { id: 'allAuthors', val: authorFilter, set: setAuthorFilter, opts: filters.authors },
                                    { id: 'allShelves', val: shelfFilter, set: setShelfFilter, opts: filters.shelves, pre: 'Shelf ' }
                                ].map((filter) => (
                                    <div key={filter.id} className="relative group">
                                        <select 
                                            value={filter.val} 
                                            onChange={(e) => filter.set(e.target.value)} 
                                            className="w-full py-4 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white font-black text-xs md:text-sm cursor-pointer appearance-none outline-none focus:border-red-600 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm"
                                        >
                                            <option value={filter.id === 'sortBy' ? 'alphabetical' : 'all'}>{t(filter.id)}</option>
                                            {filter.opts.map(o => <option key={o} value={o}>{filter.pre && locale === 'en' ? `${filter.pre}${o}` : o}</option>)}
                                        </select>
                                        <div className="absolute end-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-red-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {filteredBooks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
                        <span className="text-8xl mb-6 opacity-20">🔍</span>
                        <p className="font-black text-2xl uppercase tracking-widest">{t('noResults')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                        {filteredBooks.slice(0, visibleCount).map((book) => (
                            <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                        ))}
                    </div>
                )}

                {filteredBooks.length > visibleCount && (
                    <div className="mt-20 text-center">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 16)} 
                            className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black rounded-full px-12 py-5 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white shadow-2xl hover:-translate-y-2 transition-all text-sm md:text-lg uppercase tracking-[0.3em] active:scale-95"
                        >
                            {t('exploreMore')}
                        </button>
                    </div>
                )}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
                @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.92); } 100% { opacity: 1; transform: scale(1); } }
                .animate-zoom-in { animation: zoom-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default SearchPage;
