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
    pageTitle: "الفهرس الوطني الذكي",
    searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
    allSubjects: "المواضيع",
    allAuthors: "المؤلفين",
    allShelves: "الرفوف",
    shelf: "الرف",
    row: "الصف",
    noResults: "لا توجد نتائج.",
    aiSubject: "تحليل صقر الذكي",
    close: "إغلاق",
    subjectLabel: "التصنيف الموضوعي"
  },
  en: {
    pageTitle: "National Smart Index",
    searchPlaceholder: "Search title or author...",
    allSubjects: "Subjects",
    allAuthors: "Authors",
    allShelves: "Shelves",
    shelf: "Shelf",
    row: "Row",
    noResults: "No results found.",
    aiSubject: "Saqr AI Inferred",
    close: "Close",
    subjectLabel: "Subject Category"
  }
};

// --- نافذة تفاصيل الكتاب (تصغير الخطوط + ذكاء اصطناعي كامل) ---
const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale } = useLanguage();
    const [aiSummary, setAiSummary] = useState<string>('');
    const [aiCategory, setAiCategory] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!book) { setAiSummary(''); setAiCategory(''); return; }
        
        const fetchAiKnowledge = async () => {
            setIsAiLoading(true);
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ 
                            role: 'system', 
                            content: `Book: "${book.title}" by "${book.author}". 
                            Output JSON: {"summary": "2 sentences", "category": "1 word genre in ${locale === 'ar' ? 'Arabic' : 'English'}"}` 
                        }],
                        locale
                    }),
                });
                const data = await response.json();
                // محاولة بارس الرد أو استخدامه مباشرة
                const parsed = typeof data.reply === 'string' ? JSON.parse(data.reply) : data;
                setAiSummary(parsed.summary || data.reply);
                setAiCategory(parsed.category || '');
            } catch (error) { 
                setAiSummary(book.summary || 'Strategic insights are unavailable.'); 
            } finally { setIsAiLoading(false); }
        };
        fetchAiKnowledge();
    }, [book, locale]);

    if (!book) return null;

    const finalSubject = aiCategory || (book.subject !== "Unknown" ? book.subject : t('aiSubject'));

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-3xl rounded-[2.5rem] border-2 border-white/50 dark:border-white/10 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-4 end-4 z-50 p-2 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200 dark:border-white/10">
                    <div className="mb-6">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter">{book.title}</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-bold">By {book.author}</p>
                    </div>
                    
                    <div className="bg-slate-100/50 dark:bg-white/5 p-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-[9px] text-red-600 font-black uppercase mb-3 tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                            Smart Summary
                        </p>
                        {isAiLoading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-3 bg-slate-300 dark:bg-white/10 rounded w-full"></div>
                                <div className="h-3 bg-slate-300 dark:bg-white/10 rounded w-2/3"></div>
                            </div>
                        ) : (
                            <p className="text-slate-800 dark:text-slate-200 text-lg font-medium leading-relaxed italic">"{aiSummary || book.summary}"</p>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-[280px] bg-slate-950 dark:bg-black p-8 flex flex-col justify-center items-center text-center text-white">
                    <div className="space-y-8 w-full">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2">{t('subjectLabel')}</p>
                            <p className="text-xl font-black text-white">{isAiLoading ? '...' : finalSubject}</p>
                        </div>

                        <div className="flex justify-center gap-8">
                            <div><p className="text-[10px] opacity-50 uppercase">{t('shelf')}</p><p className="text-4xl font-black">{book.shelf}</p></div>
                            <div className="w-px h-10 bg-white/20"></div>
                            <div><p className="text-[10px] opacity-50 uppercase">{t('row')}</p><p className="text-4xl font-black">{book.row}</p></div>
                        </div>

                        <button onClick={onClose} className="w-full bg-white text-slate-950 font-black py-3 rounded-xl active:scale-95 text-[10px] uppercase tracking-widest transition-all">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب (تصغير الحجم + توهج) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
    const isAi = !book.subject || book.subject === "Unknown";
    return (
        <div 
            onClick={onClick} 
            className="group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-white/5 rounded-[2rem] transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden shadow-md active:scale-95 hover:border-red-600/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.25)]"
        >
            <div className="p-5 flex-grow">
                 <span className={`inline-block px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest mb-4 ${isAi ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                    {isAi ? t('aiSubject') : book.subject}
                 </span>
                <h3 className="font-black text-md text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">{book.title}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold italic">{book.author}</p>
            </div>
            <div className="bg-white/40 dark:bg-black/20 py-3 px-5 border-t border-white/5 mt-auto">
                <p className="font-black text-slate-900 dark:text-white text-[9px] uppercase opacity-60">S:{book.shelf} — R:{book.row}</p>
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
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [visibleCount, setVisibleCount] = useState(20);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filters = useMemo(() => ({
        subjects: [...new Set(bookData.map(b => b.subject))].filter(s => s !== "Unknown").sort(),
        authors: [...new Set(bookData.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
        shelves: [...new Set(bookData.map(b => b.shelf.toString()))].sort((a, b) => parseInt(a) - parseInt(b))
    }), []);

    const filteredBooks = useMemo(() => {
        const term = debouncedSearchTerm.toLowerCase().trim();
        return bookData.filter(b => {
            const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            const matchesShelf = shelfFilter === 'all' || b.shelf.toString() === shelfFilter;
            return matchesTerm && matchesSub && matchesAuth && matchesShelf;
        });
    }, [debouncedSearchTerm, subjectFilter, authorFilter, shelfFilter]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-24 relative z-10">
            <div className="sticky top-24 z-50 mb-8 animate-fade-up">
                <div className="glass-panel p-4 rounded-[2rem] shadow-xl border-white/40 dark:border-white/5 backdrop-blur-2xl">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-[2] relative">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-4 ps-12 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl outline-none transition-all font-black text-md shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="flex-[3] grid grid-cols-3 gap-2">
                            {[
                                { val: subjectFilter, set: setSubjectFilter, options: filters.subjects, label: t('allSubjects') },
                                { val: authorFilter, set: setAuthorFilter, options: filters.authors, label: t('allAuthors') },
                                { val: shelfFilter, set: setShelfFilter, options: filters.shelves, label: t('allShelves') }
                            ].map((f, i) => (
                                <select key={i} value={f.val} onChange={(e) => f.set(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 font-black text-[9px] md:text-xs cursor-pointer outline-none focus:border-green-600 appearance-none">
                                    <option value="all">{f.label}</option>
                                    {f.options.map(o => <option key={o} value={o}>{i === 2 ? `S: ${o}` : o}</option>)}
                                </select>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-up">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            {filteredBooks.length > visibleCount && (
                <div className="mt-16 text-center">
                    <button onClick={() => setVisibleCount(prev => prev + 20)} className="bg-slate-950 text-white dark:bg-white dark:text-black px-12 py-4 rounded-2xl font-black text-md shadow-xl hover:scale-105 active:scale-90 transition-all uppercase tracking-widest">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
