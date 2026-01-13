import React, { useState, useEffect, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// Debounce Hook
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

// تسجيل النشاط
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
    searchPlaceholder: "ابحث عن كتاب بالعنوان، الموضوع، أو الرف...",
    allSubjects: "كل المواضيع",
    allAuthors: "كل المؤلفين",
    allShelves: "كل الرفوف",
    results: "نتائج البحث",
    shelf: "الرف",
    row: "الصف",
    noResults: "لم يتم العثور على نتائج تطابق بحثك.",
    similarRecommendations: "توصيات مشابهة",
    close: "إغلاق",
    author: "المؤلف",
    subject: "الموضوع",
    level: "المستوى",
    language: "اللغة",
    location: "الموقع",
    summary: "ملخص",
    langEN: "الإنجليزية",
    langAR: "العربية"
  },
  en: {
    pageTitle: "Library Search",
    searchPlaceholder: "Search by title, topic, or shelf...",
    allSubjects: "All Subjects",
    allAuthors: "All Authors",
    allShelves: "All Shelves",
    results: "Search Results",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found matching your search.",
    similarRecommendations: "Similar Recommendations",
    close: "Close",
    author: "Author",
    subject: "Subject",
    level: "Level",
    language: "Language",
    location: "Location",
    summary: "Summary",
    langEN: "English",
    langAR: "Arabic"
  }
};

// --- نافذة تفاصيل الكتاب (Modal) الزجاجية ---
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
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
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
        <div dir={dir} className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            {/* الحاوية الزجاجية للمودال */}
            <div className="glass-panel rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{book.title}</h2>
                            <p className="text-lg text-green-700 dark:text-green-400 font-bold mt-1">{book.author}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="glass-panel p-4 rounded-2xl border-white/10">
                            <h4 className="font-bold text-gray-400 dark:text-gray-500 text-xs uppercase mb-1">{t_search('subject')}</h4>
                            <p className="text-gray-800 dark:text-gray-200 font-bold">{book.subject}</p>
                        </div>
                        <div className="glass-panel p-4 rounded-2xl border-white/10">
                            <h4 className="font-bold text-gray-400 dark:text-gray-500 text-xs uppercase mb-1">{t_search('level')}</h4>
                            <p className="text-gray-800 dark:text-gray-200 font-bold">{book.level}</p>
                        </div>
                        <div className="glass-panel p-4 rounded-2xl border-white/10">
                            <h4 className="font-bold text-gray-400 dark:text-gray-500 text-xs uppercase mb-1">{t_search('language')}</h4>
                            <p className="text-gray-800 dark:text-gray-200 font-bold">{book.language === 'EN' ? t_search('langEN') : t_search('langAR')}</p>
                        </div>
                        <div className="bg-green-700/10 p-5 rounded-2xl col-span-2 md:col-span-3 border border-green-700/20 shadow-inner">
                            <h4 className="font-bold text-green-700 dark:text-green-500 mb-1">{t_search('location')}</h4>
                            <p className="text-green-700 dark:text-green-400 font-black text-2xl tracking-tighter">{`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest text-xs">{t_search('summary')}</h4>
                        {isLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="bg-white/20 h-4 rounded-full w-full"></div>
                                <div className="bg-white/20 h-4 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                           <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">{summary}</p>
                        )}
                    </div>
                </div>

                {/* أزرار الهوية الزجاجية في المودال */}
                <div className="p-6 flex justify-end gap-3 bg-white/10 dark:bg-black/20 border-t border-white/10 backdrop-blur-md">
                    <button onClick={onClose} className="glass-button-red px-8 py-3 rounded-xl font-bold active:scale-95">{t_search('close')}</button>
                    <button 
                        onClick={() => book && onFilterByAuthor(book.author)}
                        className="glass-button-green px-8 py-3 rounded-xl font-bold active:scale-95"
                    >
                        {t_search('similarRecommendations')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب (Card) الزجاجية ---
const BookCard: React.FC<{ book: Book; onClick: () => void }> = ({ book, onClick }) => {
    const { locale } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    return (
        <div
            onClick={onClick}
            className="glass-panel rounded-[2rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col group active:scale-95 border-white/10"
        >
            <div className="p-7 flex-grow">
                <h3 className="font-black text-xl text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2 leading-tight tracking-tight">{book.title}</h3>
                <p className="text-md text-green-700/60 dark:text-green-400/60 mt-2 font-black">{book.author}</p>
                <div className="mt-5">
                    <span className="bg-white/20 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-xs font-black border border-white/10 uppercase tracking-wider">{book.subject}</span>
                </div>
            </div>
            <div className="bg-white/20 dark:bg-black/30 py-4 px-6 border-t border-white/5 backdrop-blur-sm">
                <p className="font-black text-green-700 dark:text-green-500 text-sm tracking-tighter">{`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}</p>
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
    
    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

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
        <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter">{t_search('pageTitle')}</h1>
                <div className="h-1.5 w-24 bg-green-700 mx-auto rounded-full shadow-[0_0_15px_rgba(0,115,47,0.3)]"></div>
            </div>
            
            {/* حاوية الفلاتر الزجاجية */}
            <div className="glass-panel p-6 sm:p-10 rounded-[3rem] shadow-2xl mb-12 sticky top-28 z-30 border-white/20 transition-all duration-500">
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder={t_search('searchPlaceholder')}
                        className="w-full p-6 ps-16 text-gray-900 bg-white/30 dark:bg-gray-900/40 dark:text-white border-2 border-transparent focus:border-green-600 focus:bg-white/90 dark:focus:bg-gray-800 rounded-3xl outline-none transition-all shadow-inner font-bold text-xl placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-6 flex items-center pointer-events-none">
                        <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="relative group">
                        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-white/20 dark:bg-gray-900/60 border border-white/10 focus:ring-4 focus:ring-green-600/20 dark:text-white appearance-none font-black cursor-pointer transition-all">
                            <option value="all" className="bg-white dark:bg-gray-900">{t_search('allSubjects')}</option>
                            {subjects.map((s: string) => <option key={s} value={s} className="bg-white dark:bg-gray-900">{s}</option>)}
                        </select>
                        <div className="absolute inset-y-0 end-5 flex items-center pointer-events-none text-green-700 font-black">▼</div>
                    </div>
                    <div className="relative group">
                        <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-white/20 dark:bg-gray-900/60 border border-white/10 focus:ring-4 focus:ring-green-600/20 dark:text-white appearance-none font-black cursor-pointer transition-all">
                            <option value="all" className="bg-white dark:bg-gray-900">{t_search('allAuthors')}</option>
                            {authors.map((a: string) => <option key={a} value={a} className="bg-white dark:bg-gray-900">{a}</option>)}
                        </select>
                        <div className="absolute inset-y-0 end-5 flex items-center pointer-events-none text-green-700 font-black">▼</div>
                    </div>
                    <div className="relative group">
                        <select value={shelfFilter} onChange={(e) => setShelfFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-white/20 dark:bg-gray-900/60 border border-white/10 focus:ring-4 focus:ring-green-600/20 dark:text-white appearance-none font-black cursor-pointer transition-all">
                            <option value="all" className="bg-white dark:bg-gray-900">{t_search('allShelves')}</option>
                            {shelves.map((s: string) => <option key={s} value={s} className="bg-white dark:bg-gray-900">{t_search('shelf')} {s}</option>)}
                        </select>
                        <div className="absolute inset-y-0 end-5 flex items-center pointer-events-none text-green-700 font-black">▼</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-10 px-4">
                <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">{t_search('results')}</h2>
                <span className="bg-green-700 text-white px-6 py-2 rounded-full text-lg font-black shadow-2xl shadow-green-700/40 animate-pulse">{filteredBooks.length}</span>
            </div>
            
            {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredBooks.map((book: Book) => (
                        <BookCard key={book.id} book={book} onClick={() => handleBookClick(book)} />
                    ))}
                </div>
            ) : (
                <div className="glass-panel text-center py-24 rounded-[4rem] border-2 border-dashed border-white/20 animate-in zoom-in duration-500">
                    <div className="text-8xl mb-6">🔍</div>
                    <p className="text-gray-400 dark:text-gray-500 text-2xl font-black tracking-tight">{t_search('noResults')}</p>
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
