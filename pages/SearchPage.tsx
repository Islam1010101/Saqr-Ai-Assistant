import React, { useState, useEffect, useCallback } from 'react';
import { bookData } from '../data/bookData';
import { Book } from '../types';
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


// Log to localStorage
const logActivity = (type: 'search' | 'view', value: string) => {
    try {
        const logs: any[] = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
        logs.push({ timestamp: Date.now(), type, value });
        localStorage.setItem('saqr_activity_logs', JSON.stringify(logs));
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

// --- TRANSLATIONS ---
const translations = {
  ar: {
    pageTitle: "البحث في المكتبة",
    searchPlaceholder: "ابحث عن كتاب بالعنوان، الموضوع، أو المؤلف...",
    allSubjects: "كل المواضيع",
    allAuthors: "كل المؤلفين",
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
    searchPlaceholder: "Search for a book by title, topic, or author...",
    allSubjects: "All Subjects",
    allAuthors: "All Authors",
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


// --- BOOK MODAL ---
const BookModal: React.FC<{
  book: Book | null;
  onClose: () => void;
  onFilterByAuthor: (author: string) => void;
}> = ({ book, onClose, onFilterByAuthor }) => {
    const { locale, dir } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    
    // هذه الأسطر موجودة لديك وجاهزة
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // ✨ --- هذا الكود سليم والخاص بالـ AI --- ✨
    useEffect(() => {
        if (!book) return;

        const generateSummary = async () => {
            setIsLoading(true);
            setSummary(''); // مسح الملخص القديم

            try {
                // 1. نجهز "السؤال" الذي سنسأله للـ AI
                const prompt =
                    locale === 'ar'
                        ? `أرجو تقديم ملخص قصير جداً (سطرين فقط) باللغة العربية
                           للكتاب التالي:
                           العنوان: "${book.title}"
                           المؤلف: ${book.author}`
                        : `Please provide a very short summary (2 lines only) in English
                           for the following book:
                           Title: "${book.title}"
                           Author: ${book.author}`;

                // 2. نستدعي API الشات الذي قمنا بإصلاحه
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: prompt }], // نرسل السؤال فقط
                        locale: locale,
                    }),
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || 'API call failed');
                }

                // 3. عند وصول الرد، نضعه في "الذاكرة" (summary)
                const data = await response.json();
                setSummary(data.reply || (locale === 'ar' ? 'لم يتم العثور على ملخص.' : 'No summary found.'));

            } catch (error) {
                console.error("Failed to generate summary:", error);
                // في حالة فشل الـ API، نستخدم الملخص الأصلي من ملف البيانات (إن وجد)
                setSummary(book.summary || (locale === 'ar' ? 'عذراً، حدث خطأ أثناء جلب الملخص.' : 'Error fetching summary.'));
            } finally {
                setIsLoading(false);
            }
        };

        generateSummary();

    }, [book, locale]); // سيعمل هذا الكود كلما تم اختيار كتاب جديد


    if (!book) return null;

    return (
        <div dir={dir} className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{book.title}</h2>
                            <p className="text-md text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            <h4 className="font-bold text-gray-600 dark:text-gray-400">{t_search('subject')}</h4>
                            <p className="text-gray-800 dark:text-gray-200">{book.subject}</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            <h4 className="font-bold text-gray-600 dark:text-gray-400">{t_search('level')}</h4>
                            <p className="text-gray-800 dark:text-gray-200">{book.level}</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            <h4 className="font-bold text-gray-600 dark:text-gray-400">{t_search('language')}</h4>
                            <p className="text-gray-800 dark:text-gray-200">{book.language === 'EN' ? t_search('langEN') : t_search('langAR')}</p>
                        </div>
                        <div className="bg-uae-green/10 p-3 rounded-lg col-span-2 md:col-span-3">
                            <h4 className="font-bold text-uae-green">{t_search('location')}</h4>
                            <p className="text-uae-green font-semibold text-lg">{`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-bold text-gray-600 dark:text-gray-400 mb-2">{t_search('summary')}</h4>
                        {/* هذا الجزء سيعمل بشكل ممتاز مع الكود الجديد */}
                        {isLoading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-full"></div>
                                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-5/6"></div>
                                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                            </div>
                        ) : (
                           <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
                        )}
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-end gap-3 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">{t_search('close')}</button>
                    
                    {/* ✨ --- تم إصلاح الزر هنا --- ✨ */}
                    <button 
                        onClick={() => book && onFilterByAuthor(book.author)}
                        className="px-4 py-2 text-sm font-medium text-white bg-uae-green rounded-lg hover:bg-green-800 transition-colors"
                    >
                        {t_search('similarRecommendations')}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- BOOK CARD ---
const BookCard: React.FC<{ book: Book; onClick: () => void }> = ({ book, onClick }) => {
    const { locale } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl dark:hover:shadow-green-900/20 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group"
        >
            <div className="p-5 flex-grow">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-uae-green transition-colors">{book.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">{book.subject}</span>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 text-center py-3 px-5 border-t border-gray-100 dark:border-gray-700">
                <p className="font-semibold text-uae-green">{`${t_search('shelf')} ${book.shelf} – ${t_search('row')} ${book.row}`}</p>
            </div>
        </div>
    );
};


// --- MAIN SEARCH PAGE COMPONENT ---
const SearchPage: React.FC = () => {
    const { locale } = useLanguage();
    const t_search = (key: keyof typeof translations.ar) => translations[locale][key];
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>(bookData);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const subjects = [...new Set(bookData.map(b => b.subject))].filter(Boolean).sort();
    const authors = [...new Set(bookData.map(b => b.author))].filter(a => a !== 'Unknown Author').sort();

    const handleSearch = useCallback(() => {
        if (debouncedSearchTerm.trim()) {
            logActivity('search', debouncedSearchTerm.trim());
        }
        let books = bookData;

        if (debouncedSearchTerm) {
            const lowercasedTerm = debouncedSearchTerm.toLowerCase();
            books = books.filter(book =>
                book.title.toLowerCase().includes(lowercasedTerm) ||
                book.author.toLowerCase().includes(lowercasedTerm) ||
                book.subject.toLowerCase().includes(lowercasedTerm)
            );
        }

        if (subjectFilter !== 'all') {
            books = books.filter(book => book.subject === subjectFilter);
        }
        if (authorFilter !== 'all') {
            books = books.filter(book => book.author === authorFilter);
        }
        
        setFilteredBooks(books);
    }, [debouncedSearchTerm, subjectFilter, authorFilter]);
    
    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        logActivity('view', book.id);
    };

    const handleCloseModal = () => {
        setSelectedBook(null);
    };

    // ✨ --- تم إضافة الدالة هنا --- ✨
    const handleFilterByAuthor = (authorName: string) => {
      setAuthorFilter(authorName); // ضبط فلتر المؤلف
      setSubjectFilter('all');    // إلغاء فلتر الموضوع
      setSearchTerm('');          // إلغاء البحث النصي
      setSelectedBook(null);      // إغلاق المودال
      
      // (اختياري) سحب الشاشة للأعلى لرؤية النتائج
      window.scrollTo(0, 0); 
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-6">{t_search('pageTitle')}</h1>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm mb-6 sticky top-28 z-30">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder={t_search('searchPlaceholder')}
                        className="w-full p-3 ps-10 text-gray-800 bg-white dark:bg-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-uae-green focus:border-transparent outline-none transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-uae-green focus:border-transparent outline-none">
                        <option value="all">{t_search('allSubjects')}</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                     <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-uae-green focus:border-transparent outline-none">
                        <option value="all">{t_search('allAuthors')}</option>
                        {authors.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">{`${t_search('results')} (${filteredBooks.length})`}</h2>
            
            {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBooks.map(book => (
                        <BookCard key={book.id} book={book} onClick={() => handleBookClick(book)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{t_search('noResults')}</p>
                </div>
            )}

            {/* ✨ --- تم إصلاح تمرير الـ Props هنا --- ✨ */}
            <BookModal 
              book={selectedBook} 
              onClose={handleCloseModal}
              onFilterByAuthor={handleFilterByAuthor}
            />
        </div>
    );
};

export default SearchPage;
