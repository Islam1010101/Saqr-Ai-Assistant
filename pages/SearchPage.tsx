import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// Debounce Hook لضمان استجابة سريعة
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
    pageTitle: "الفهرس الوطني الذكي",
    searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
    allSubjects: "جميع التصنيفات",
    allAuthors: "جميع المؤلفين",
    results: "مصدر متاح",
    shelf: "الرف",
    row: "الصف",
    noResults: "لا توجد نتائج.",
    aiSubject: "تصنيف ذكي عبر صقر",
    details: "معلومات المصدر"
  },
  en: {
    pageTitle: "National Smart Index",
    searchPlaceholder: "Search title or author...",
    allSubjects: "All Genres",
    allAuthors: "All Authors",
    results: "Resources Available",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found.",
    aiSubject: "Saqr AI Classified",
    details: "Resource Info"
  }
};

// --- بطاقة الكتاب المصغرة (توهج + زجاج) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
    // منطق الذكاء الاصطناعي للموضوعات غير المعروفة
    const displaySubject = useMemo(() => {
        if (!book.subject || book.subject === "Unknown" || book.subject === "غير معروف") {
            return t('aiSubject'); // وسم الذكاء الاصطناعي
        }
        return book.subject;
    }, [book.subject, t]);

    return (
        <div 
            onClick={onClick}
            className="group relative glass-panel bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/5 rounded-[2rem] hover:scale-[1.02] hover:border-red-600/50 hover:shadow-[0_0_25px_rgba(220,38,38,0.2)] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden shadow-lg"
        >
            <div className="p-6 flex-grow relative z-10">
                <div className="flex justify-between items-start mb-4">
                     <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${book.subject === 'Unknown' ? 'bg-red-600/10 text-red-600 border-red-600/20' : 'bg-green-600/10 text-green-700 border-green-600/20'}`}>
                        {displaySubject}
                     </span>
                     <div className="text-xl opacity-30 group-hover:opacity-100 group-hover:rotate-12 transition-all">📖</div>
                </div>
                <h3 className="font-black text-lg md:text-xl text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">
                    {book.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{book.author}</p>
            </div>
            
            <div className="bg-white/40 dark:bg-black/20 py-4 px-6 border-t border-white/20 dark:border-white/5 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(5,150,105,0.5)]"></div>
                    <span className="font-black text-slate-900 dark:text-white text-[10px] uppercase">
                        S:{book.shelf} - R:{book.row}
                    </span>
                </div>
                <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M9 5l7 7-7 7" /></svg>
            </div>
        </div>
    );
});

const SearchPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];
    
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(24);

    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const filters = useMemo(() => ({
        subjects: [...new Set(bookData.map(b => b.subject))].filter(s => s !== "Unknown").sort(),
        authors: [...new Set(bookData.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
    }), []);

    const filteredBooks = useMemo(() => {
        const term = debouncedSearchTerm.toLowerCase().trim();
        return bookData.filter(b => {
            const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            return matchesTerm && matchesSub && matchesAuth;
        });
    }, [debouncedSearchTerm, subjectFilter, authorFilter]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-24 relative z-10">
            
            {/* بار البحث المطور - أصغر وأكثر رشاقة */}
            <div className="sticky top-24 z-50 mb-12 animate-fade-up">
                <div className="glass-panel p-4 md:p-6 rounded-[2.5rem] shadow-2xl border-white/40 dark:border-white/5 backdrop-blur-2xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative group">
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="w-full p-4 md:p-5 ps-14 md:ps-16 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-[1.5rem] md:rounded-[2rem] outline-none transition-all font-black text-base md:text-xl shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 start-5 md:start-6 flex items-center pointer-events-none text-red-600">
                                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <select 
                                value={subjectFilter} 
                                onChange={(e) => setSubjectFilter(e.target.value)} 
                                className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 font-black text-sm cursor-pointer outline-none transition-all shadow-sm"
                            >
                                <option value="all">{t('allSubjects')}</option>
                                {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="bg-slate-950 text-white dark:bg-white dark:text-black px-6 flex items-center rounded-2xl font-black text-lg">
                                {filteredBooks.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* شبكة الكتب - كروت أصغر وأكثر تنظيماً */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-fade-up">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard 
                        key={book.id} 
                        book={book} 
                        onClick={() => {}} // يمكن ربطه بالمودال لاحقاً
                        t={t} 
                    />
                ))}
            </div>

            {/* حالة عدم وجود نتائج */}
            {filteredBooks.length === 0 && (
                <div className="glass-panel text-center py-32 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-white/5">
                    <div className="text-7xl mb-6 opacity-10">🔎</div>
                    <p className="text-slate-400 dark:text-slate-500 text-xl font-black">{t('noResults')}</p>
                </div>
            )}

            {/* عرض المزيد */}
            {filteredBooks.length > visibleCount && (
                <div className="mt-16 text-center">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 24)}
                        className="bg-red-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
