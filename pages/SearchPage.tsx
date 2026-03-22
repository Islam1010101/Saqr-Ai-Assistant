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
    subjectLabel: "الموضوع",
    officialAi: "تحليل صقر الذكي"
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
    subjectLabel: "Topic",
    officialAi: "Saqr AI Analysis"
  }
};

// --- 2. مكونات التصميم الزجاجي المطور ---
const ReflectionLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-40" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] animate-[shine_10s_infinite] opacity-30" />
  </div>
);

// --- 3. Component: BookModal (أصغر، مرتب، وبألوان الهوية) ---
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
        <div dir={dir} className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-in fade-in duration-300" onClick={onClose}>
            {/* النافذة المنبثقة: تم تصغير الحجم max-w-2xl وتنظيم المحتوى */}
            <div className="relative w-full max-w-2xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-5 end-5 z-50 p-2 bg-red-600 text-white rounded-full hover:rotate-90 transition-transform shadow-lg active:scale-90">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="p-8 md:p-12 overflow-y-auto no-scrollbar text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-widest mb-4">Saqr AI Insight</span>
                    <h2 className="text-2xl md:text-4xl text-slate-950 dark:text-white font-black leading-tight mb-2 tracking-tight">{book.title}</h2>
                    <p className="text-lg text-[#00732f] font-bold mb-8">By {book.author}</p>
                    
                    {/* شبكة البيانات المصغرة */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-100/50 dark:bg-white/5 p-4 rounded-3xl border border-white/20">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('shelf')}</p>
                            <p className="text-3xl font-black text-red-600">{book.shelf}</p>
                        </div>
                        <div className="bg-slate-100/50 dark:bg-white/5 p-4 rounded-3xl border border-white/20">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('row')}</p>
                            <p className="text-3xl font-black text-[#00732f]">{book.row}</p>
                        </div>
                        <div className="col-span-2 bg-[#00732f]/10 p-4 rounded-3xl border border-[#00732f]/20">
                            <p className="text-[10px] font-black text-[#00732f] uppercase mb-1">{t('subjectLabel')}</p>
                            <p className="text-lg font-black dark:text-white">{loading ? '...' : (aiContent.genre || book.subject)}</p>
                        </div>
                    </div>

                    {/* الملخص */}
                    <div className="glass-panel p-6 rounded-[2rem] border border-white/30 bg-white/40 dark:bg-white/5 relative shadow-inner text-start mb-8">
                        <div className="flex items-center gap-2 mb-4">
                           <span className={`w-2 h-2 rounded-full ${loading ? 'animate-ping bg-red-500' : 'bg-green-500'}`}></span>
                           <p className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase">{t('officialAi')}</p>
                        </div>
                        <p className="text-slate-800 dark:text-slate-100 text-base md:text-lg font-medium leading-relaxed">
                           {loading ? "..." : `"${aiContent.summary}"`}
                        </p>
                    </div>

                    <button onClick={onClose} className="w-full bg-slate-950 dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-xl uppercase tracking-widest text-xs">{t('close')}</button>
                </div>
            </div>
        </div>
    );
};

// --- 4. Component: BookCard (الهوية الإماراتية والزجاج) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";

  return (
    <div onClick={onClick} className="group relative glass-panel rounded-[2.5rem] p-1 cursor-pointer transition-all duration-500 hover:-translate-y-3 h-full active:scale-[0.98]">
      <div className="relative overflow-hidden rounded-[2.4rem] bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl h-full flex flex-col border border-white/20 shadow-lg">
        <ReflectionLayer />
        <div className={`absolute top-0 start-0 w-2 h-full z-30 transition-all duration-500 group-hover:w-3 ${isAi ? 'bg-red-600' : 'bg-[#00732f]'}`} />

        <div className="p-7 relative z-10 flex-grow text-start">
           <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider mb-4 border border-white/20
                          ${isAi ? 'bg-red-600 text-white' : 'bg-[#00732f] text-white'}`}>
              {isAi ? t('aiSubject') : book.subject}
           </span>
          
          <h3 className="font-black text-lg md:text-xl text-slate-950 dark:text-white leading-tight mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
              {book.title}
          </h3>
          
          <div className="flex items-center gap-2 opacity-60">
              <span className="text-sm">👤</span>
              <p className="text-[10px] font-bold truncate uppercase">{book.author}</p>
          </div>
        </div>

        <div className="bg-black/5 dark:bg-white/5 py-4 px-7 border-t border-white/10 mt-auto flex items-center justify-between relative z-10">
            <div className="flex gap-5 items-center">
                <div className="text-center">
                  <p className="text-[8px] text-red-600 font-black">S</p>
                  <p className="text-base font-black dark:text-white leading-none">{book.shelf}</p>
                </div>
                <div className="w-px h-6 bg-slate-400/30" />
                <div className="text-center">
                  <p className="text-[8px] text-[#00732f] font-black">R</p>
                  <p className="text-base font-black dark:text-white leading-none">{book.row}</p>
                </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-red-600/30 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all shadow-md">
              <span className="text-xs">➔</span>
            </div>
        </div>
      </div>
    </div>
  );
});

// --- 5. Main Component: SearchPage (مع ميزة إخفاء شريط البحث بالتمرير) ---
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

    // --- منطق إخفاء/إظهار شريط البحث ---
    const [showSearch, setShowSearch] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowSearch(false); // إخفاء عند النزول
            } else {
                setShowSearch(true); // إظهار عند الصعود
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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
        <div dir={dir} className="max-w-7xl mx-auto px-4 md:px-6 pb-40 relative z-10 antialiased">
            
            {/* بار البحث الزجاجي - مع خاصية التحرك الذكية */}
            <div className={`sticky z-[100] mb-12 md:mb-20 transition-all duration-500 ease-in-out ${showSearch ? 'top-4 md:top-8 opacity-100 translate-y-0' : '-top-40 opacity-0 -translate-y-full'}`}>
                <div className="glass-panel p-4 md:p-6 rounded-[2.5rem] md:rounded-[4rem] bg-white/70 dark:bg-slate-900/70 border border-white/20 shadow-2xl backdrop-blur-3xl">
                    <div className="flex flex-col gap-4">
                        <div className="relative group">
                            <input 
                              type="text" 
                              placeholder={t('searchPlaceholder')} 
                              className="w-full p-4 md:p-6 ps-14 md:ps-20 bg-white/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-[1.8rem] md:rounded-[2.5rem] outline-none transition-all text-base md:text-lg font-black shadow-inner" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <svg className="absolute start-6 md:start-8 top-1/2 -translate-y-1/2 h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {[
                                { id: 'sortBy', val: sortBy, set: setSortBy, opts: ['alphabetical', 'author'] },
                                { id: 'allSubjects', val: subjectFilter, set: setSubjectFilter, opts: filters.subjects },
                                { id: 'allAuthors', val: authorFilter, set: setAuthorFilter, opts: filters.authors },
                                { id: 'allShelves', val: shelfFilter, set: setShelfFilter, opts: filters.shelves, pre: 'S: ' }
                            ].map((filter) => (
                                <div key={filter.id} className="relative">
                                    <select 
                                        value={filter.val} 
                                        onChange={(e) => filter.set(e.target.value)} 
                                        className="w-full p-3 rounded-2xl bg-white/40 dark:bg-slate-800/60 border border-white/20 font-black text-[10px] md:text-xs cursor-pointer appearance-none text-center backdrop-blur-md hover:bg-white dark:hover:bg-slate-700 transition-all outline-none focus:border-red-600"
                                    >
                                        <option value={filter.id === 'sortBy' ? 'alphabetical' : 'all'}>{t(filter.id)}</option>
                                        {filter.opts.map(o => <option key={o} value={o}>{filter.pre ? `${filter.pre}${o}` : o}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* العنوان */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white mb-4 uppercase tracking-tighter">{t('pageTitle')}</h1>
                <div className="flex justify-center gap-2">
                    <div className="w-12 h-1.5 bg-red-600 rounded-full" />
                    <div className="w-12 h-1.5 bg-[#00732f] rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            {filteredBooks.length === 0 && (
                <div className="py-20 text-center opacity-30">
                    <p className="text-4xl font-black">{t('noResults')}</p>
                </div>
            )}

            {filteredBooks.length > visibleCount && (
                <div className="mt-20 text-center">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 16)} 
                        className="bg-[#00732f] text-white px-12 py-5 rounded-full font-black text-lg hover:bg-red-600 transition-all transform hover:scale-105 active:scale-95 shadow-2xl tracking-widest"
                    >
                        EXPLORE MORE
                    </button>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes shine {
                  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }
            `}</style>
        </div>
    );
};

export default SearchPage;
