import React, { useState, useEffect, useMemo } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';
import { trackActivity } from '../src/utils/tracker';

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

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const UserIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SearchSvg = () => (
  <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseSvg = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const RobotSvg = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" strokeWidth={4} />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth={4} />
  </svg>
);

// --- 3. Component: BookModal ---
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
        <div dir={dir} className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[3rem] border-8 border-sky-400 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-transform shadow-lg active:scale-90 active:translate-y-1">
                    <CloseSvg />
                </button>

                <div className="p-8 md:p-12 overflow-y-auto scrollbar-thin text-center flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-black uppercase tracking-widest mb-6 border-2 border-sky-200 dark:border-sky-800">
                        <RobotSvg /> Saqr AI Insight
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl text-slate-900 dark:text-white font-black leading-tight mb-4 tracking-tight">{book.title}</h2>
                    
                    <div className="flex items-center justify-center gap-2 text-lg text-emerald-600 dark:text-emerald-400 font-bold mb-8 bg-emerald-50 dark:bg-emerald-900/20 w-fit mx-auto px-6 py-2 rounded-full">
                        <UserIcon /> {book.author}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
                        <div className="bg-amber-50 dark:bg-slate-700 p-5 rounded-[2rem] border-4 border-amber-200 dark:border-slate-600 shadow-sm">
                            <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase mb-2">{t('shelf')}</p>
                            <p className="text-4xl font-black text-slate-800 dark:text-white">{book.shelf}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-slate-700 p-5 rounded-[2rem] border-4 border-emerald-200 dark:border-slate-600 shadow-sm">
                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase mb-2">{t('row')}</p>
                            <p className="text-4xl font-black text-slate-800 dark:text-white">{book.row}</p>
                        </div>
                        <div className="col-span-2 bg-sky-50 dark:bg-slate-700 p-5 rounded-[2rem] border-4 border-sky-200 dark:border-slate-600 shadow-sm flex flex-col items-center justify-center">
                            <p className="text-xs font-black text-sky-600 dark:text-sky-400 uppercase mb-2">{t('subjectLabel')}</p>
                            <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">{loading ? '...' : (aiContent.genre || book.subject)}</p>
                        </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border-4 border-slate-200 dark:border-slate-800 relative text-start mb-8 shadow-inner">
                        <div className="flex items-center gap-2 mb-4">
                           <span className={`w-3 h-3 rounded-full ${loading ? 'animate-ping bg-rose-500' : 'bg-emerald-500'}`}></span>
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{t('officialAi')}</p>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-base md:text-xl font-bold leading-relaxed">
                           {loading ? "..." : `"${aiContent.summary}"`}
                        </p>
                    </div>

                    <button onClick={onClose} className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-lg py-5 rounded-[2rem] hover:-translate-y-1 active:translate-y-2 border-b-8 border-slate-700 dark:border-slate-300 active:border-b-0 transition-all shadow-md uppercase tracking-widest">
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 4. Component: BookCard (Realistic Book Design) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";
  // توليد لون عشوائي للغلاف بناءً على الحرف الأول لتنويع شكل الكتب
  const colors = [
    'from-blue-500 to-blue-700 border-blue-800',
    'from-emerald-500 to-emerald-700 border-emerald-800',
    'from-rose-500 to-rose-700 border-rose-800',
    'from-amber-500 to-amber-600 border-amber-700',
    'from-purple-500 to-purple-700 border-purple-800'
  ];
  const colorClass = colors[book.title.length % colors.length];

  return (
    <div onClick={onClick} className="relative group cursor-pointer w-full h-[320px] perspective-1000 flex items-end justify-center pb-2">
      {/* تصميم الكتاب الواقعي */}
      <div className={`book-volume w-[90%] h-full relative transform-style-3d transition-transform duration-500 group-hover:rotate-y-[-15deg] group-hover:-translate-y-4 group-hover:scale-105 rounded-r-2xl border-l-[16px] shadow-[-10px_10px_20px_rgba(0,0,0,0.15)] bg-gradient-to-br ${colorClass}`}>
        
        {/* الغلاف الأمامي (محتوى الكتاب) */}
        <div className="absolute inset-0 flex flex-col p-5 overflow-hidden rounded-r-2xl">
          {/* تأثير اللمعان على الغلاف */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/20 pointer-events-none"></div>

          {/* التصنيف (تاغ علوي) */}
          <div className="mb-auto mt-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30 shadow-sm max-w-full`}>
               {isAi && <RobotSvg />}
               <span className="truncate">{isAi ? t('aiSubject') : book.subject}</span>
            </span>
          </div>
          
          {/* العنوان والمؤلف */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h3 className="font-black text-lg md:text-xl text-white leading-snug drop-shadow-md line-clamp-3 mb-3">
                {book.title}
            </h3>
            <div className="flex items-center gap-2 text-white/80 mt-auto mb-2">
                <UserIcon />
                <p className="text-xs font-bold truncate uppercase">{book.author}</p>
            </div>
          </div>
        </div>

        {/* كعب الكتاب (الجانب الأيسر الثلاثي الأبعاد) */}
        <div className="absolute top-0 left-[-16px] w-[16px] h-full bg-black/30 origin-right transform rotate-y-90 flex flex-col items-center justify-between py-6">
           {/* خطوط تجميلية على كعب الكتاب */}
           <div className="w-full h-1 bg-white/30"></div>
           <div className="text-[10px] text-white/50 font-black -rotate-90 tracking-widest">{book.shelf}</div>
           <div className="w-full h-1 bg-white/30"></div>
        </div>

        {/* صفحات الكتاب (الجانب الأيمن) */}
        <div className="absolute top-2 right-[-6px] w-[6px] h-[calc(100%-4px)] bg-[#fdfbf7] origin-left transform rotate-y-[-90deg] rounded-r-sm shadow-inner border-y border-r border-[#e2e8f0]">
           {/* خطوط الصفحات */}
           <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,#e2e8f0_2px,#e2e8f0_3px)] opacity-50"></div>
        </div>

      </div>

      {/* شريط الإحصائيات أسفل الكتاب (الرف والصف) */}
      <div className="absolute bottom-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-700 flex justify-between items-center z-50">
          <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[9px] text-amber-500 font-black uppercase">{t('shelf')}</p>
                <p className="text-sm font-black text-slate-800 dark:text-white leading-none mt-1">{book.shelf}</p>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <p className="text-[9px] text-emerald-500 font-black uppercase">{t('row')}</p>
                <p className="text-sm font-black text-slate-800 dark:text-white leading-none mt-1">{book.row}</p>
              </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 flex items-center justify-center">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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

    const [showSearch, setShowSearch] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowSearch(false); 
            } else {
                setShowSearch(true); 
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
        <div dir={dir} className="w-full min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300">
            
            {/* 🌟 تصميم طفولي للخلفية */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-sky-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-10 pb-40 relative z-10 antialiased">
                
                {/* Title */}
                <div className="text-center mb-10 md:mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight">{t('pageTitle')}</h1>
                    <div className="flex justify-center gap-3">
                        <div className="w-8 h-2 bg-amber-400 rounded-full" />
                        <div className="w-16 h-2 bg-sky-500 rounded-full" />
                        <div className="w-8 h-2 bg-rose-500 rounded-full" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className={`sticky z-[100] mb-12 transition-all duration-500 ease-in-out ${showSearch ? 'top-4 md:top-6 opacity-100 translate-y-0' : '-top-40 opacity-0 -translate-y-full'}`}>
                    <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-[3rem] border-4 border-amber-300 dark:border-amber-600 shadow-xl max-w-5xl mx-auto">
                        <div className="flex flex-col gap-5">
                            <div className="relative group">
                                <input 
                                  type="text" 
                                  placeholder={t('searchPlaceholder')} 
                                  className="w-full p-4 md:p-5 ps-14 md:ps-16 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-4 border-slate-200 dark:border-slate-700 focus:border-sky-400 rounded-[2rem] outline-none transition-colors text-base md:text-lg font-black shadow-inner" 
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                <div className="absolute start-5 md:start-6 top-1/2 -translate-y-1/2">
                                    <SearchSvg />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
                                            className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-amber-400 transition-colors outline-none focus:border-amber-500 text-slate-700 dark:text-slate-200"
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

                {/* عرض الكتب كأرفف مكتبة حقيقية */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-4 md:gap-x-8 px-2 md:px-8">
                    {filteredBooks.slice(0, visibleCount).map((book) => (
                        <div key={book.id} className="relative">
                           <BookCard 
                               book={book} 
                               t={t} 
                               onClick={() => {
                                   setSelectedBook(book); 
                                   trackActivity('searched', book.title); 
                               }} 
                           />
                           {/* خط الرف الخشبي أسفل الكتاب لإعطاء إيحاء المكتبة */}
                           <div className="absolute -bottom-2 w-[110%] -left-[5%] h-4 bg-[#8B4513] rounded-sm shadow-md border-b-4 border-[#5C2E0B] -z-10"></div>
                        </div>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="py-20 text-center text-slate-400 dark:text-slate-600 flex flex-col items-center">
                        <svg className="w-24 h-24 mb-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-3xl font-black">{t('noResults')}</p>
                    </div>
                )}

                {filteredBooks.length > visibleCount && (
                    <div className="mt-20 text-center">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 16)} 
                            className="bg-sky-500 text-white px-10 py-4 rounded-full font-black text-lg md:text-xl border-b-8 border-sky-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md uppercase tracking-widest"
                        >
                            EXPLORE MORE
                        </button>
                    </div>
                )}

                <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb { background: #475569; }
                
                /* إعدادات الشكل ثلاثي الأبعاد للكتاب */
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-90 { transform: rotateY(90deg); }
                .-rotate-y-15 { transform: rotateY(-15deg); }
                
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
            `}</style>
        </div>
    );
};

export default SearchPage;
