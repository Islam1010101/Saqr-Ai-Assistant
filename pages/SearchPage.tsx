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

// --- 2. مكونات التصميم الزجاجي ---
const ReflectionLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-40" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] animate-[shine_10s_infinite] opacity-30" />
  </div>
);

// --- 3. Component: BookModal (الربط الفعلي بالـ AI) ---
const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale } = useLanguage();
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
                            content: `Analyze the book "${book.title}" by "${book.author}". Provide: 1. A 2-sentence inspiring summary. 2. A specific knowledge category (Genre). Language: ${locale === 'ar' ? 'Arabic' : 'English'}. Format: JSON {"summary": "...", "genre": "..."}`
                        }]
                    })
                });
                const data = await response.json();
                const parsed = JSON.parse(data.reply.replace(/```json|```/g, ''));
                setAiContent(parsed);
            } catch (err) {
                setAiContent({ 
                    summary: book.summary || (locale === 'ar' ? "كتاب قيم يثري المحتوى المعرفي للمكتبة." : "A valuable addition to the library's knowledge base."),
                    genre: book.subject 
                });
            } finally { setLoading(false); }
        };

        fetchAiDeepDive();
    }, [book, locale]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl animate-fade-up" onClick={onClose}>
            <div className="relative w-full max-w-5xl bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] overflow-y-auto md:overflow-hidden" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-3 bg-red-600 text-white rounded-full hover:rotate-90 transition-transform shadow-lg">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 p-8 md:p-16 text-start">
                    <span className="inline-block px-4 py-1 rounded-full bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-widest mb-4">Book Profile</span>
                    <h2 className="text-3xl md:text-6xl text-slate-950 dark:text-white font-black leading-[1.1] mb-4 tracking-tighter">{book.title}</h2>
                    <p className="text-xl md:text-2xl text-red-600 font-bold mb-10 opacity-80">By {book.author}</p>
                    
                    <div className="glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/30 bg-white/40 dark:bg-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">✨</div>
                        <div className="flex items-center gap-3 mb-6">
                           <span className={`w-3 h-3 rounded-full ${loading ? 'animate-ping bg-red-500' : 'bg-green-500'}`}></span>
                           <p className="text-xs text-green-600 font-black uppercase tracking-[0.2em]">{t('officialAi')}</p>
                        </div>
                        <p className="text-slate-800 dark:text-slate-100 text-lg md:text-2xl font-medium italic leading-relaxed">
                           {loading ? "..." : `"${aiContent.summary}"`}
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-[350px] bg-slate-950/95 dark:bg-black/80 p-8 md:p-12 flex flex-col justify-center items-center text-white border-s border-white/10 backdrop-blur-xl">
                    <div className="space-y-10 w-full text-center">
                        <div className="bg-gradient-to-br from-red-600/20 to-transparent p-8 rounded-[2.5rem] border border-red-600/30">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">{t('subjectLabel')}</p>
                            <p className="text-2xl font-black leading-tight">{loading ? '...' : (aiContent.genre || book.subject)}</p>
                        </div>
                        <div className="flex justify-center gap-12">
                            <div className="group"><p className="text-[10px] opacity-40 mb-2 group-hover:text-red-500 transition-colors uppercase">Shelf</p><p className="text-5xl font-black">{book.shelf}</p></div>
                            <div className="w-px h-16 bg-white/10"></div>
                            <div className="group"><p className="text-[10px] opacity-40 mb-2 group-hover:text-green-500 transition-colors uppercase">Row</p><p className="text-5xl font-black">{book.row}</p></div>
                        </div>
                        <button onClick={onClose} className="w-full bg-white text-black font-black py-5 rounded-[1.5rem] hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-xl uppercase tracking-widest text-xs">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. Component: BookCard (التصميم الجلوسي المطور) ---
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
      className="group relative glass-panel glass-card-interactive rounded-[2.5rem] p-1 cursor-pointer transition-all duration-500 hover:-translate-y-3 animate-fade-up border-none h-full active:scale-[0.98]"
    >
      <div className="relative overflow-hidden rounded-[2.4rem] bg-white/20 dark:bg-slate-900/40 backdrop-blur-md h-full flex flex-col border border-white/20">
        <ReflectionLayer />
        
        {/* خط الهوية الجانبي المطور */}
        <div className={`absolute top-0 start-0 w-2 h-full z-30 transition-all duration-500 group-hover:w-3 ${isAi ? 'bg-red-600 shadow-[4px_0_15px_rgba(220,38,38,0.3)]' : 'bg-[#00732f] shadow-[4px_0_15px_rgba(0,115,47,0.3)]'}`} />

        <div className="p-7 md:p-9 relative z-10 flex-grow text-start">
           <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] mb-6 shadow-sm border border-white/20
                          ${isAi ? 'bg-red-600 text-white' : 'bg-[#00732f] text-white'}`}>
              {isAi ? t('aiSubject') : book.subject}
           </span>
          
          <h3 className="font-black text-xl md:text-2xl text-slate-950 dark:text-white leading-[1.2] mb-4 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">
              {book.title}
          </h3>
          
          <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-all">
              <span className="text-lg">👤</span>
              <p className="text-[11px] font-bold uppercase tracking-wider truncate">{book.author}</p>
          </div>
        </div>

        {/* تذييل الكارت الشفاف */}
        <div className="bg-black/5 dark:bg-white/5 py-5 px-8 border-t border-white/10 mt-auto flex items-center justify-between relative z-10 backdrop-blur-xl">
            <div className="flex gap-6 items-center">
                <div className="text-center">
                  <p className="text-[9px] text-red-600 font-black mb-1">S</p>
                  <p className="text-lg font-black dark:text-white leading-none">{book.shelf}</p>
                </div>
                <div className="w-px h-8 bg-slate-400/30" />
                <div className="text-center">
                  <p className="text-[9px] text-[#00732f] font-black mb-1">R</p>
                  <p className="text-lg font-black dark:text-white leading-none">{book.row}</p>
                </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-red-600/20 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:scale-110">
              <span className="text-sm font-black">➔</span>
            </div>
        </div>
      </div>
    </div>
  );
});

// --- 5. Main Component: SearchPage ---
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
        <div dir={dir} className="max-w-7xl mx-auto px-4 md:px-6 pb-40 relative z-10 antialiased font-black">
            
            {/* بار البحث الزجاجي - مع تجاوب للموبايل */}
            <div className="sticky top-4 md:top-6 z-[100] mb-12 md:mb-20 animate-fade-up">
                <div className="glass-panel p-4 md:p-6 rounded-[2.5rem] md:rounded-[4rem] bg-white/80 dark:bg-slate-900/80 border-none shadow-2xl backdrop-blur-3xl">
                    <div className="flex flex-col gap-4">
                        <div className="relative group">
                            <input 
                              type="text" 
                              placeholder={t('searchPlaceholder')} 
                              className="w-full p-5 md:p-7 ps-14 md:ps-20 bg-white/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-[2rem] md:rounded-[3rem] outline-none transition-all text-base md:text-xl shadow-inner shadow-black/5 font-black" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <svg className="absolute start-6 md:start-8 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 text-red-600 opacity-70 group-focus-within:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        
                        {/* شبكة الفلاتر - متجاوبة */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                            {[
                                { id: 'sortBy', val: sortBy, set: setSortBy, opts: ['alphabetical', 'author'] },
                                { id: 'allSubjects', val: subjectFilter, set: setSubjectFilter, opts: filters.subjects },
                                { id: 'allAuthors', val: authorFilter, set: setAuthorFilter, opts: filters.authors },
                                { id: 'allShelves', val: shelfFilter, set: setShelfFilter, opts: filters.shelves, pre: 'S: ' }
                            ].map((filter) => (
                                <div key={filter.id} className="relative group">
                                    <select 
                                        value={filter.val} 
                                        onChange={(e) => filter.set(e.target.value)} 
                                        className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/40 dark:bg-slate-800/60 border border-white/20 font-black text-[10px] md:text-xs cursor-pointer appearance-none text-center backdrop-blur-md hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm outline-none focus:border-red-600"
                                    >
                                        <option value={filter.id === 'sortBy' ? 'alphabetical' : 'all'}>{t(filter.id)}</option>
                                        {filter.opts.map(o => <option key={o} value={o}>{filter.pre ? `${filter.pre}${o}` : o}</option>)}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity">▼</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* شبكة الكتب - 1 في الموبايل، 2 تابلت، 4 ديسكتوب */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            {/* زر الاستكشاف بمظهر نخبوي */}
            {filteredBooks.length > visibleCount && (
                <div className="mt-24 md:mt-32 text-center">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 16)} 
                        className="glass-button-red mx-auto px-12 md:px-20 py-5 md:py-6 text-lg md:text-xl tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95"
                    >
                        EXPLORE MORE
                    </button>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />
        </div>
    );
};

export default SearchPage;
