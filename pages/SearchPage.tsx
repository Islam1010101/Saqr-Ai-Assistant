import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
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

// --- 2. Component: BookModal (تصميم زجاجي، أصغر، ومنظم في المنتصف) ---
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
                            content: `Analyze "${book.title}" by "${book.author}". Provide 2-sentence summary and Genre. Language: ${locale === 'ar' ? 'Arabic' : 'English'}. JSON: {"summary": "...", "genre": "..."}`
                        }]
                    })
                });
                const data = await response.json();
                const parsed = JSON.parse(data.reply.replace(/```json|```/g, '').trim());
                setAiContent(parsed);
            } catch (err) {
                setAiContent({ 
                    summary: book.summary || (locale === 'ar' ? "كتاب متميز يفتح آفاق المعرفة." : "An exceptional book for knowledge."),
                    genre: book.subject !== "Unknown" ? book.subject : (locale === 'ar' ? "عام" : "General")
                });
            } finally { setLoading(false); }
        };
        fetchAiDeepDive();
    }, [book, locale]);

    if (!book) return null;

    const modalContent = (
        <div dir={dir} className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] border border-white/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-zoom-in">
                
                <button onClick={onClose} className="absolute top-4 end-4 z-50 p-2 bg-red-600 text-white rounded-full hover:rotate-90 transition-all shadow-md active:scale-90">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="p-8 overflow-y-auto no-scrollbar text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-bold uppercase tracking-widest mb-4">Saqr AI Insight</span>
                    <h2 className="text-2xl md:text-3xl text-slate-900 dark:text-white font-bold leading-tight mb-2">{book.title}</h2>
                    <p className="text-base text-[#00732f] font-semibold mb-6">By {book.author}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-100/50 dark:bg-white/5 p-3 rounded-2xl border border-white/20">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">{t('shelf')}</p>
                            <p className="text-2xl font-bold text-red-600">{book.shelf}</p>
                        </div>
                        <div className="bg-slate-100/50 dark:bg-white/5 p-3 rounded-2xl border border-white/20">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">{t('row')}</p>
                            <p className="text-2xl font-bold text-[#00732f]">{book.row}</p>
                        </div>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/30 bg-white/40 dark:bg-white/5 shadow-inner text-start mb-6">
                        <div className="flex items-center gap-2 mb-3">
                           <span className={`w-2 h-2 rounded-full ${loading ? 'animate-ping bg-red-500' : 'bg-green-500'}`}></span>
                           <p className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase">{t('officialAi')}</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-sm md:text-base font-medium leading-relaxed">
                           {loading ? "..." : `"${aiContent.summary}"`}
                        </p>
                    </div>

                    <button onClick={onClose} className="w-full bg-[#00732f] text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-all transform active:scale-95 shadow-lg uppercase tracking-widest text-[10px]">{t('close')}</button>
                </div>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

// --- 3. Component: BookCard (الهوية الإماراتية والزجاج) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";
  return (
    <div onClick={onClick} className="group relative rounded-[2rem] p-0.5 cursor-pointer transition-all duration-500 hover:-translate-y-2 h-full active:scale-[0.98]">
      <div className="relative overflow-hidden rounded-[1.9rem] bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl h-full flex flex-col border border-white/20 shadow-xl">
        <div className={`absolute top-0 start-0 w-1.5 h-full z-30 ${isAi ? 'bg-red-600' : 'bg-[#00732f]'}`} />
        <div className="p-6 flex-grow text-start">
           <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider mb-4 
                          ${isAi ? 'bg-red-600 text-white' : 'bg-[#00732f] text-white'}`}>
              {isAi ? t('aiSubject') : book.subject}
           </span>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
              {book.title}
          </h3>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate uppercase">👤 {book.author}</p>
        </div>
        <div className="bg-white/20 dark:bg-white/5 py-3 px-6 border-t border-white/10 mt-auto flex items-center justify-between">
            <div className="flex gap-4 items-center">
                <div className="text-center">
                  <p className="text-[7px] text-red-600 font-bold">S</p>
                  <p className="text-sm font-bold dark:text-white">{book.shelf}</p>
                </div>
                <div className="w-px h-5 bg-slate-400/20" />
                <div className="text-center">
                  <p className="text-[7px] text-[#00732f] font-bold">R</p>
                  <p className="text-sm font-bold dark:text-white">{book.row}</p>
                </div>
            </div>
            <div className="w-7 h-7 rounded-full border border-red-600/20 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
              <span className="text-[10px]">➔</span>
            </div>
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

    // --- منطق إخفاء شريط البحث عند التمرير ---
    const [showSearch, setShowSearch] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setShowSearch(false);
            } else {
                setShowSearch(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredBooks = useMemo(() => {
        const term = debouncedSearchTerm.toLowerCase().trim();
        let result = bookData.filter(b => {
            const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            const matchesShelf = shelfFilter === 'all' || b.shelf.toString() === shelfFilter;
            return matchesTerm && matchesSub && matchesAuth && matchesShelf;
        });
        if (sortBy === 'alphabetical') result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale));
        else if (sortBy === 'author') result = [...result].sort((a, b) => a.author.localeCompare(b.author, locale));
        return result;
    }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter, sortBy, locale]);

    const filters = useMemo(() => ({
        subjects: [...new Set(bookData.map(b => b.subject))].filter(s => s !== "Unknown").sort(),
        authors: [...new Set(bookData.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
        shelves: [...new Set(bookData.map(b => b.shelf.toString()))].sort((a, b) => parseInt(a) - parseInt(b))
    }), []);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 md:px-6 pb-20 relative z-10 antialiased font-medium">
            
            {/* بار البحث الزجاجي المتحرك */}
            <div className={`sticky z-[100] transition-all duration-500 ease-in-out ${showSearch ? 'top-4 md:top-6 opacity-100' : '-top-20 opacity-0'}`}>
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-5">
                    <div className="flex flex-col gap-4">
                        <div className="relative group">
                            <input 
                              type="text" 
                              placeholder={t('searchPlaceholder')} 
                              className="w-full p-4 md:p-5 ps-12 md:ps-16 bg-white/40 dark:bg-black/30 text-slate-950 dark:text-white border border-transparent focus:border-red-500 rounded-2xl outline-none transition-all text-sm md:text-base font-semibold" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <svg className="absolute start-5 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {[
                                { id: 'sortBy', val: sortBy, set: setSortBy, opts: ['alphabetical', 'author'] },
                                { id: 'allSubjects', val: subjectFilter, set: setSubjectFilter, opts: filters.subjects },
                                { id: 'allAuthors', val: authorFilter, set: setAuthorFilter, opts: filters.authors },
                                { id: 'allShelves', val: shelfFilter, set: setShelfFilter, opts: filters.shelves, pre: 'S: ' }
                            ].map((f) => (
                                <select key={f.id} value={f.val} onChange={(e) => f.set(e.target.value)} className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 text-[10px] font-bold outline-none cursor-pointer hover:bg-white transition-all">
                                    <option value={f.id === 'sortBy' ? 'alphabetical' : 'all'}>{t(f.id)}</option>
                                    {f.opts.map(o => <option key={o} value={o}>{f.pre ? `${f.pre}${o}` : o}</option>)}
                                </select>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center my-12">
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{t('pageTitle')}</h1>
                <div className="flex justify-center gap-1.5"><div className="w-10 h-1 bg-red-600 rounded-full" /><div className="w-10 h-1 bg-[#00732f] rounded-full" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            {filteredBooks.length > visibleCount && (
                <div className="mt-16 text-center">
                    <button onClick={() => setVisibleCount(v => v + 16)} className="bg-[#00732f] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-red-600 transition-all shadow-xl tracking-widest uppercase active:scale-95">
                        Explore More
                    </button>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                .animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default SearchPage;
