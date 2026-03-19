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

// --- 2. Component: BookModal (النافذة المنبثقة للذكاء الاصطناعي) ---
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
        <div dir={dir} className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40 dark:bg-black/60 animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-slate-200 dark:border-slate-700 animate-zoom-in" onClick={(e) => e.stopPropagation()}>
                
                {/* زر الإغلاق */}
                <button onClick={onClose} className={`absolute top-4 ${locale === 'ar' ? 'left-4' : 'right-4'} z-50 p-2 md:p-3 bg-slate-100 hover:bg-red-100 dark:bg-slate-700 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 transition-colors rounded-full`}>
                    <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* المحتوى النصي والملخص */}
                <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto no-scrollbar">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 text-xs font-bold uppercase tracking-widest mb-4 border border-red-100 dark:border-red-500/20">Saqr AI Insight</span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl text-slate-900 dark:text-white font-black leading-tight mb-2">{book.title}</h2>
                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-bold mb-8">By {book.author}</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 relative">
                        <div className="flex items-center gap-3 mb-4">
                           <span className={`w-2.5 h-2.5 rounded-full ${loading ? 'animate-ping bg-red-500' : 'bg-green-500'}`}></span>
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{t('officialAi')}</p>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-base md:text-xl font-medium leading-[1.8]">
                           {loading ? <span className="animate-pulse">...</span> : `"${aiContent.summary}"`}
                        </p>
                    </div>
                </div>

                {/* العمود الجانبي (بيانات الرف والصف) */}
                <div className="w-full md:w-72 lg:w-80 bg-slate-50 dark:bg-slate-900 p-6 md:p-10 flex flex-col justify-center items-center border-t md:border-t-0 md:border-s border-slate-200 dark:border-slate-700 shrink-0">
                    <div className="w-full space-y-6 md:space-y-8">
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('subjectLabel')}</p>
                            <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight">
                                {loading ? '...' : (aiContent.genre || book.subject)}
                            </p>
                        </div>
                        
                        <div className="h-px w-full bg-slate-200 dark:bg-slate-700"></div>
                        
                        <div className="flex justify-center gap-8 md:gap-12">
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('shelf')}</p>
                                <p className="text-4xl md:text-5xl font-black text-red-600 dark:text-red-500">{book.shelf}</p>
                            </div>
                            <div className="w-px h-16 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('row')}</p>
                                <p className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-500">{book.row}</p>
                            </div>
                        </div>

                        <button onClick={onClose} className="w-full mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-full hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-colors uppercase tracking-widest text-sm">
                            {t('close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 3. Component: BookCard (البطاقات العصرية) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";

  return (
    <div onClick={onClick} className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-red-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer h-full relative">
      
      {/* الخط الجانبي */}
      <div className={`absolute top-0 start-0 w-1.5 h-full transition-colors duration-300 ${isAi ? 'bg-red-500' : 'bg-blue-500'}`}></div>

      <div className="p-6 md:p-8 flex-1 flex flex-col text-start">
        <span className={`self-start px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 border
            ${isAi ? 'bg-red-50 dark:bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/20' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20'}`}>
            {isAi ? t('aiSubject') : book.subject}
        </span>
        
        <h3 className="font-black text-lg md:text-xl text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
            {book.title}
        </h3>
        
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-auto truncate flex items-center gap-2">
            <span className="text-lg">👤</span> {book.author}
        </p>
      </div>

      {/* الفوتر الخاص بالرف والصف */}
      <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-700">
        <div className="flex gap-6 items-center">
            <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('shelf')}</p>
                <p className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1">{book.shelf}</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
            <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('row')}</p>
                <p className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1">{book.row}</p>
            </div>
        </div>
        
        <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-colors">
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-6 md:py-10 px-4 md:px-6">
            
            {/* الخلفية الديناميكية الموحدة */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/20 rounded-full blur-[120px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col animate-fade-in-up pb-20">
                
                {/* العنوان */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('pageTitle')}</h1>
                </div>

                {/* بار البحث والفلاتر (Sticky) */}
                <div className="sticky top-4 md:top-6 z-[100] mb-8 md:mb-12">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 transition-all">
                        <div className="flex flex-col gap-4">
                            
                            {/* حقل البحث */}
                            <div className="relative group">
                                <input 
                                  type="text" 
                                  placeholder={t('searchPlaceholder')} 
                                  className="w-full py-4 px-6 ps-14 md:ps-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500 rounded-2xl outline-none transition-colors text-slate-900 dark:text-white font-medium text-sm md:text-base placeholder-slate-400" 
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                <svg className="absolute start-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            
                            {/* شبكة الفلاتر */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
                                            className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm cursor-pointer appearance-none outline-none focus:border-red-500 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                        >
                                            <option value={filter.id === 'sortBy' ? 'alphabetical' : 'all'}>{t(filter.id)}</option>
                                            {filter.opts.map(o => <option key={o} value={o}>{filter.pre && locale === 'en' ? `${filter.pre}${o}` : o}</option>)}
                                        </select>
                                        <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* شبكة الكتب */}
                {filteredBooks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium text-lg">
                        {t('noResults')}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {filteredBooks.slice(0, visibleCount).map((book) => (
                            <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                        ))}
                    </div>
                )}

                {/* زر استكشف المزيد */}
                {filteredBooks.length > visibleCount && (
                    <div className="mt-16 text-center">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 16)} 
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-full px-10 py-4 hover:shadow-lg hover:-translate-y-1 transition-all text-sm md:text-base uppercase tracking-widest"
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
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
                .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default SearchPage;
