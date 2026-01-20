import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

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

const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale } = useLanguage();
    const [aiSummary, setAiSummary] = useState<string>('');
    const [aiGenre, setAiGenre] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // دالة للتحقق مما إذا كان النص هو نص احتياطي (Placeholder)
    const isPlaceholder = (text: string) => {
        return !text || text.toLowerCase().includes('available soon') || text.includes('ستتوفر قريباً');
    };

    useEffect(() => {
        if (!book) { setAiSummary(''); setAiGenre(''); return; }
        
        const fetchAiData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ 
                            role: 'system', 
                            content: `Provide a real inspiring 2-sentence summary for the book "${book.title}" by "${book.author}". If you don't know the specific book, provide an inspiring general summary based on its title. Language: ${locale === 'ar' ? 'Arabic' : 'English'}. Return JSON: {"summary": "...", "genre": "..."}` 
                        }],
                        locale
                    }),
                });
                const data = await res.json();
                let replyText = (data.reply || "").replace(/```json|```/gi, '').trim();
                const parsed = JSON.parse(replyText);
                
                // التأكد من أن الملخص القادم من AI ليس فارغاً
                if (parsed.summary && !isPlaceholder(parsed.summary)) {
                    setAiSummary(parsed.summary);
                } else {
                    throw new Error("Invalid AI Summary");
                }
                setAiGenre(parsed.genre);
            } catch (e) { 
                // في حالة الفشل، إذا كان النص الأصلي placeholder، نعرض نصاً ملهماً عاماً بدلاً من "available soon"
                if (isPlaceholder(book.summary || '')) {
                    setAiSummary(locale === 'ar' ? "هذا الكتاب يعد رحلة معرفية فريدة تفتح آفاقاً جديدة للقارئ في مجاله." : "This book offers a unique intellectual journey, opening new horizons for the reader in its field.");
                } else {
                    setAiSummary(book.summary || '');
                }
            }
            finally { setIsLoading(false); }
        };
        fetchAiData();
    }, [book, locale]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-4xl rounded-[3rem] border-none shadow-2xl overflow-y-auto max-h-[90vh] md:overflow-hidden relative animate-in zoom-in-95 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 end-4 z-50 p-2 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 shadow-lg">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex-1 p-8 md:p-14 flex flex-col justify-center text-start font-black">
                    <h2 className="text-3xl md:text-5xl text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter">{book.title}</h2>
                    <p className="text-lg text-red-600 dark:text-red-500 font-bold uppercase mb-8">By {book.author}</p>
                    <div className="bg-slate-100/50 dark:bg-white/5 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 shadow-inner">
                        <p className="text-[10px] text-green-600 font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                           <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span> {t('officialAi')}
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 text-lg md:text-xl font-medium leading-relaxed italic">
                           {isLoading ? "..." : `"${aiSummary || book.summary}"`}
                        </p>
                    </div>
                </div>
                <div className="w-full md:w-[320px] bg-slate-950 dark:bg-black p-8 flex flex-col justify-center items-center text-white relative border-s border-white/5">
                    <div className="space-y-8 w-full relative z-10 text-center">
                        <div className="bg-red-600/10 p-5 rounded-2xl border border-red-600/20">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">{t('subjectLabel')}</p>
                            <p className="text-xl font-black">{isLoading ? '...' : (aiGenre || book.subject)}</p>
                        </div>
                        <div className="flex justify-center gap-8">
                            <div><p className="text-[10px] opacity-50 uppercase mb-1">{t('shelf')}</p><p className="text-4xl font-black">{book.shelf}</p></div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div><p className="text-[10px] opacity-50 uppercase mb-1">{t('row')}</p><p className="text-4xl font-black">{book.row}</p></div>
                        </div>
                        <button onClick={onClose} className="w-full bg-white text-black font-black py-4 rounded-xl active:scale-95 text-xs uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
    const isAi = !book.subject || book.subject === "Unknown";
    return (
        <div 
            onClick={onClick} 
            className="group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-none rounded-[2rem] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden shadow-lg hover:shadow-2xl dark:hover:shadow-red-600/10 active:scale-95 hover:-translate-y-2"
        >
            <div className={`absolute top-0 start-0 w-1.5 h-full ${isAi ? 'bg-red-600 shadow-[2px_0_15px_rgba(220,38,38,0.4)]' : 'bg-green-600 shadow-[2px_0_15px_rgba(34,197,94,0.4)]'}`}></div>
            
            <div className="p-7 md:p-9 flex-grow text-start font-black">
                 <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-5 ${isAi ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-green-600 text-white shadow-lg shadow-green-600/20'}`}>
                    {isAi ? t('aiSubject') : book.subject}
                 </span>
                <h3 className="font-black text-xl md:text-2xl text-slate-950 dark:text-white leading-tight mb-3 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2 drop-shadow-sm">
                    {book.title}
                </h3>
                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-base">👤</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-tight truncate">{book.author}</p>
                </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-black/40 py-4 px-8 border-t border-slate-100 dark:border-white/5 mt-auto flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-red-600 font-black">S</span>
                        <span className="text-xs dark:text-white font-black">{book.shelf}</span>
                    </div>
                    <div className="w-px h-3 bg-slate-300 dark:bg-white/10"></div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-green-600 font-black">R</span>
                        <span className="text-xs dark:text-white font-black">{book.row}</span>
                    </div>
                </div>
                <div className="text-[14px] opacity-30 group-hover:opacity-100 group-hover:text-red-600 transition-all">➔</div>
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
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-32 relative z-10 font-black antialiased">
            <div className="sticky top-20 z-50 mb-12 animate-fade-up">
                <div className="glass-panel p-3 md:p-5 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border-none backdrop-blur-3xl max-w-6xl mx-auto bg-white/90 dark:bg-slate-900/80">
                    <div className="flex flex-col gap-3 md:gap-4">
                        <div className="relative">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-4 ps-14 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl md:rounded-3xl outline-none transition-all font-black text-base shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-5 top-1/2 -translate-y-1/2 h-6 w-6 text-red-600 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 rounded-xl md:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-red-600 appearance-none text-center shadow-md">
                                <option value="none">{t('sortBy')}</option>
                                <option value="alphabetical">{t('alphabetical')}</option>
                                <option value="author">{t('authorName')}</option>
                            </select>
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-3 rounded-xl md:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-red-600 appearance-none text-center shadow-md">
                                <option value="all">{t('allSubjects')}</option>
                                {filters.subjects.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="p-3 rounded-xl md:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-red-600 appearance-none text-center shadow-md">
                                <option value="all">{t('allAuthors')}</option>
                                {filters.authors.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <select value={shelfFilter} onChange={(e) => setShelfFilter(e.target.value)} className="p-3 rounded-xl md:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-red-600 appearance-none text-center shadow-md col-span-2 lg:col-span-1">
                                <option value="all">{t('allShelves')}</option>
                                {filters.shelves.map(o => <option key={o} value={o}>{`S: ${o}`}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 animate-fade-up">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            {filteredBooks.length > visibleCount && (
                <div className="mt-20 text-center">
                    <button onClick={() => setVisibleCount(prev => prev + 16)} className="bg-slate-950 dark:bg-white text-white dark:text-black px-12 md:px-20 py-5 rounded-2xl md:rounded-[2.5rem] font-black text-lg md:text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all uppercase tracking-[0.2em] dark:shadow-white/10 border-2 border-transparent dark:hover:border-red-600">
                        Explore More
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
