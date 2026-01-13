import React, { useState, useEffect, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// Debounce Hook لضمان سلاسة البحث
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

// نظام تسجيل النشاط (Analytics) لمتابعة اهتمامات الطلاب
const logActivity = (type: 'search' | 'view', value: string) => {
    try {
        const logs: any[] = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
        logs.push({ timestamp: Date.now(), type, value });
        localStorage.setItem('saqr_activity_logs', JSON.stringify(logs));
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

const translations = {
  ar: {
    pageTitle: "البحث في المكتبة",
    searchPlaceholder: "ابحث عن كتاب، مؤلف، أو موضوع...",
    allSubjects: "كل المواضيع",
    allAuthors: "كل المؤلفين",
    allShelves: "كل الرفوف",
    results: "نتائج البحث",
    shelf: "الرف",
    row: "الصف",
    noResults: "لم يتم العثور على نتائج تطابق بحثك.",
    similarRecommendations: "كتب مشابهة",
    close: "إغلاق",
    author: "المؤلف",
    subject: "الموضوع",
    level: "المستوى",
    language: "اللغة",
    location: "موقع الكتاب في المكتبة",
    summary: "ملخص الكتاب (بذكاء صقر)",
    langEN: "الإنجليزية",
    langAR: "العربية"
  },
  en: {
    pageTitle: "Library Search",
    searchPlaceholder: "Search by title, author, or topic...",
    allSubjects: "All Subjects",
    allAuthors: "All Authors",
    allShelves: "All Shelves",
    results: "Search Results",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found matching your search.",
    similarRecommendations: "Similar Books",
    close: "Close",
    author: "Author",
    subject: "Subject",
    level: "Level",
    language: "Language",
    location: "Book Location",
    summary: "Book Summary (Saqr AI)",
    langEN: "English",
    langAR: "Arabic"
  }
};

// --- نافذة تفاصيل الكتاب (Modal) الزجاجية الفخمة ---
const BookModal: React.FC<{
  book: Book | null;
  onClose: () => void;
  onFilterByAuthor: (author: string) => void;
}> = ({ book, onClose, onFilterByAuthor }) => {
    const { locale, dir } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (!book) return;
        const generateSummary = async () => {
            setIsLoading(true);
            setSummary(''); 
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: `Short 2-line summary for: "${book.title}" by ${book.author}` }],
                        locale: locale,
                    }),
                });
                const data = await response.json();
                setSummary(data.reply || (locale === 'ar' ? 'لم يتم العثور على ملخص.' : 'No summary found.'));
            } catch (error) {
                setSummary(book.summary || (locale === 'ar' ? 'حدث خطأ في جلب الملخص.' : 'Error fetching summary.'));
            } finally {
                setIsLoading(false);
            }
        };
        generateSummary();
    }, [book, locale]); 

    if (!book) return null;

    return (
        <div dir={dir} className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel rounded-[3.5rem] w-full max-w-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] transform animate-in zoom-in-95 duration-300 border-white/20" onClick={(e) => e.stopPropagation()}>
                <div className="p-10">
                    <div className="flex justify-between items-start gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-950 dark:text-white leading-tight tracking-tighter">{book.title}</h2>
                            <p className="text-xl text-green-700 dark:text-green-400 font-black mt-2">{book.author}</p>
                        </div>
                        <button onClick={onClose} className="p-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-all active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
                        <div className="glass-panel p-5 rounded-3xl border-white/10 bg-white/30">
                            <h4 className="font-black text-gray-500 dark:text-gray-400 text-xs uppercase mb-2 tracking-widest">{t_search('subject')}</h4>
                            <p className="text-gray-900 dark:text-gray-100 font-black text-lg">{book.subject}</p>
                        </div>
                        <div className="glass-panel p-5 rounded-3xl border-white/10 bg-white/30">
                            <h4 className="font-black text-gray-500 dark:text-gray-400 text-xs uppercase mb-2 tracking-widest">{t_search('level')}</h4>
                            <p className="text-gray-900 dark:text-gray-100 font-black text-lg">{book.level}</p>
                        </div>
                        <div className="glass-panel p-5 rounded-3xl border-white/10 bg-white/30">
                            <h4 className="font-black text-gray-500 dark:text-gray-400 text-xs uppercase mb-2 tracking-widest">{t_search('language')}</h4>
                            <p className="text-gray-900 dark:text-gray-100 font-black text-lg">{book.language === 'EN' ? t_search('langEN') : t_search('langAR')}</p>
                        </div>
                    </div>

                    <div className="bg-green-700 p-8 rounded-[2.5rem] border border-green-600 shadow-2xl shadow-green-700/30 mb-10">
                        <h4 className="font-black text-green-50 mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {t_search('location')}
                        </h4>
                        <p className="text-white font-black text-4xl tracking-tighter">{`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}</p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em] text-xs">{t_search('summary')}</h4>
                        {isLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="bg-black/10 dark:bg-white/10 h-5 rounded-full w-full"></div>
                                <div className="bg-black/10 dark:bg-white/10 h-5 rounded-full w-4/5"></div>
                            </div>
                        ) : (
                           <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-xl font-medium">{summary}</p>
                        )}
                    </div>
                </div>

                <div className="p-8 flex flex-wrap justify-end gap-4 bg-black/5 dark:bg-white/5 border-t border-white/10 backdrop-blur-md">
                    <button onClick={onClose} className="glass-button-red px-10 py-4 rounded-2xl font-black text-lg active:scale-95">{t_search('close')}</button>
                    <button 
                        onClick={() => book && onFilterByAuthor(book.author)}
                        className="glass-button-green px-10 py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95"
                    >
                        {t_search('similarRecommendations')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب (Card) البريميوم ---
const BookCard: React.FC<{ book: Book; onClick: () => void }> = ({ book, onClick }) => {
    const { locale } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    return (
        <div
            onClick={onClick}
            className="glass-panel rounded-[2.5rem] hover:shadow-[0_20px_50px_rgba(0,115,47,0.15)] hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col group active:scale-95 border-white/20"
        >
            <div className="p-8 flex-grow">
                <h3 className="font-black text-2xl text-gray-950 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2 leading-tight tracking-tight mb-3">{book.title}</h3>
                <p className="text-lg text-green-700/80 dark:text-green-400/80 font-black mb-6">{book.author}</p>
                <div className="flex flex-wrap gap-2">
                    <span className="bg-green-700/10 text-green-700 dark:bg-green-700/20 dark:text-green-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-green-700/20">{book.subject}</span>
                </div>
            </div>
            <div className="bg-white/40 dark:bg-black/40 py-5 px-8 border-t border-white/10 backdrop-blur-sm">
                <p className="font-black text-gray-900 dark:text-white text-base tracking-tighter flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}
                </p>
            </div>
        </div>
    );
};

// --- المكون الرئيسي لصفحة البحث الزجاجية ---
const SearchPage: React.FC = () => {
    const { locale } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [shelfFilter, setShelfFilter] = useState('all');
    
    const [filteredBooks, setFilteredBooks] = useState<Book[]>(bookData);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const subjects = [...new Set(bookData.map((b: Book) => b.subject))].filter(Boolean).sort();
    const authors = [...new Set(bookData.map((b: Book) => b.author))].filter(a => a !== 'Unknown Author' && a !== 'مؤلف غير معروف').sort();
    const shelves = [...new Set(bookData.map((b: Book) => b.shelf.toString()))].sort((a, b) => parseInt(a) - parseInt(b));

    const handleSearch = useCallback(() => {
        let books = [...bookData];

        if (debouncedSearchTerm) {
            logActivity('search', debouncedSearchTerm.trim());
            const term = debouncedSearchTerm.toLowerCase();
            books = books.filter(b =>
                b.title.toLowerCase().includes(term) ||
                b.author.toLowerCase().includes(term) ||
                b.subject.toLowerCase().includes(term) ||
                b.shelf.toString().includes(term)
            );
        }

        if (subjectFilter !== 'all') books = books.filter(b => b.subject === subjectFilter);
        if (authorFilter !== 'all') books = books.filter(b => b.author === authorFilter);
        if (shelfFilter !== 'all') books = books.filter(b => b.shelf.toString() === shelfFilter);
        
        setFilteredBooks(books);
    }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);
    
    useEffect(() => { handleSearch(); }, [handleSearch]);

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        logActivity('view', book.id);
    };

    const handleFilterByAuthor = (authorName: string) => {
      setAuthorFilter(authorName); 
      setSubjectFilter('all');     
      setShelfFilter('all');
      setSearchTerm('');          
      setSelectedBook(null);       
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-24">
            {/* رأس الصفحة الفخم */}
            <div className="text-center mb-16 animate-in fade-in slide-in-from-top-6 duration-1000">
                <h1 className="text-5xl md:text-7xl font-black text-gray-950 dark:text-white mb-6 tracking-tighter leading-none">{t_search('pageTitle')}</h1>
                <div className="h-2 w-32 bg-green-700 mx-auto rounded-full shadow-[0_0_20px_rgba(0,115,47,0.4)]"></div>
            </div>
            
            {/* حاوية البحث والفلاتر العائمة */}
            <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] shadow-2xl mb-20 sticky top-24 z-30 border-white/30 backdrop-blur-2xl transition-all duration-500 hover:shadow-green-700/10">
                <div className="relative mb-10">
                    <input
                        type="text"
                        placeholder={t_search('searchPlaceholder')}
                        className="w-full p-8 ps-20 text-gray-950 bg-white/50 dark:bg-gray-900/50 dark:text-white border-2 border-transparent focus:border-green-700 focus:bg-white/90 dark:focus:bg-gray-800 rounded-[2.5rem] outline-none transition-all shadow-2xl font-black text-2xl placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-8 flex items-center pointer-events-none">
                        <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* الفلاتر الذكية */}
                    {[ 
                        { val: subjectFilter, set: setSubjectFilter, opts: subjects, all: t_search('allSubjects'), label: '' },
                        { val: authorFilter, set: setAuthorFilter, opts: authors, all: t_search('allAuthors'), label: '' },
                        { val: shelfFilter, set: setShelfFilter, opts: shelves, all: t_search('allShelves'), label: t_search('shelf') }
                    ].map((filter, idx) => (
                        <div key={idx} className="relative group">
                            <select 
                                value={filter.val} 
                                onChange={(e) => filter.set(e.target.value)} 
                                className="w-full p-6 rounded-2xl bg-white/30 dark:bg-gray-900/60 border border-white/10 focus:ring-4 focus:ring-green-700/20 dark:text-white appearance-none font-black text-lg cursor-pointer transition-all shadow-sm"
                            >
                                <option value="all" className="bg-white dark:bg-gray-900">{filter.all}</option>
                                {filter.opts.map((opt: string) => (
                                    <option key={opt} value={opt} className="bg-white dark:bg-gray-900">{filter.label ? `${filter.label} ${opt}` : opt}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 end-6 flex items-center pointer-events-none text-green-700 font-black">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* عرض النتائج */}
            <div className="flex items-center justify-between mb-12 px-6">
                <h2 className="text-4xl font-black text-gray-950 dark:text-gray-100 tracking-tighter">{t_search('results')}</h2>
                <div className="flex items-center gap-4">
                    <span className="bg-green-700 text-white px-8 py-3 rounded-full text-2xl font-black shadow-[0_10px_30px_rgba(0,115,47,0.4)] animate-in slide-in-from-right duration-500">
                        {filteredBooks.length}
                    </span>
                </div>
            </div>
            
            {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {filteredBooks.map((book: Book) => (
                        <BookCard key={book.id} book={book} onClick={() => handleBookClick(book)} />
                    ))}
                </div>
            ) : (
                <div className="glass-panel text-center py-32 rounded-[4rem] border-2 border-dashed border-white/30 animate-in zoom-in duration-700">
                    <div className="text-9xl mb-8 drop-shadow-2xl">🔍</div>
                    <p className="text-gray-400 dark:text-gray-500 text-3xl font-black tracking-tighter">{t_search('noResults')}</p>
                </div>
            )}

            <BookModal 
              book={selectedBook} 
              onClose={() => setSelectedBook(null)}
              onFilterByAuthor={handleFilterByAuthor}
            />
        </div>
    );
};

export default SearchPage;
