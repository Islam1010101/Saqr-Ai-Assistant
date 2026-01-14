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
    aiSubject: "تصنيف صقر الذكي",
    close: "إغلاق",
    subjectLabel: "المجال المعرفي"
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
    aiSubject: "Saqr AI Classified",
    close: "Close",
    subjectLabel: "Knowledge Field"
  }
};

// --- نافذة تفاصيل الكتاب (تصميم مدمج + ذكاء اصطناعي مفعل) ---
const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale } = useLanguage();
    const [aiSummary, setAiSummary] = useState<string>('');
    const [aiGenre, setAiGenre] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!book) { setAiSummary(''); setAiGenre(''); return; }
        const fetchAiData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ role: 'system', content: `Summarize "${book.title}" by "${book.author}" in 2 sentences. Also provide a 1-word genre in ${locale === 'ar' ? 'Arabic' : 'English'}.` }],
                        locale
                    }),
                });
                const data = await res.json();
                // نفترض أن الـ AI يعيد نصاً يحتوي على التصنيف والملخص
                setAiSummary(data.reply);
                setAiGenre(data.genre || ''); // إذا كان الـ API يدعم فصل التصنيف
            } catch (e) { setAiSummary(book.summary || 'Processing...'); }
            finally { setIsLoading(false); }
        };
        fetchAiData();
    }, [book, locale]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-2xl rounded-[2.5rem] border-2 border-white/50 dark:border-white/10 shadow-2xl overflow-hidden relative animate-in zoom-in-95 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-4 end-4 z-50 p-2 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200 dark:border-white/10">
                    <div className="mb-4">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter">{book.title}</h2>
                        <p className="text-sm text-slate-500 font-bold italic">Author: {book.author}</p>
                    </div>
                    
                    <div className="bg-slate-100/50 dark:bg-white/5 p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-[8px] text-red-600 font-black uppercase mb-2 tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                            AI Summary
                        </p>
                        {isLoading ? <div className="space-y-2 animate-pulse"><div className="h-2 bg-slate-300 dark:bg-white/10 rounded w-full"></div><div className="h-2 bg-slate-300 dark:bg-white/10 rounded w-2/3"></div></div> :
                        <p className="text-slate-800 dark:text-slate-200 text-sm md:text-base font-medium leading-relaxed italic italic">"{aiSummary || book.summary}"</p>}
                    </div>
                </div>

                <div className="w-full md:w-[240px] bg-slate-950 dark:bg-black p-8 flex flex-col justify-center items-center text-center text-white">
                    <div className="space-y-6 w-full">
                        {/* التصنيف فوق الرف بطلبك */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">{t('subjectLabel')}</p>
                            <p className="text-lg font-black text-white">{isLoading ? '...' : (aiGenre || (book.subject !== "Unknown" ? book.subject : t('aiSubject')))}</p>
                        </div>

                        <div className="flex justify-center gap-6">
                            <div><p className="text-[9px] opacity-50 uppercase">{t('shelf')}</p><p className="text-3xl font-black">{book.shelf}</p></div>
                            <div className="w-px h-8 bg-white/20"></div>
                            <div><p className="text-[9px] opacity-50 uppercase">{t('row')}</p><p className="text-3xl font-black">{book.row}</p></div>
                        </div>

                        <button onClick={onClose} className="w-full bg-white text-slate-950 font-black py-2 rounded-lg active:scale-95 text-[9px] uppercase tracking-widest">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- كارت الكتاب (رجيق + توهج) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
    const isAi = !book.subject || book.subject === "Unknown";
    return (
        <div 
            onClick={onClick} 
            className="group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-white/5 rounded-[1.5rem] transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden shadow-sm active:scale-95 hover:border-red-600/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]"
        >
            <div className="p-4 flex-grow">
                 <span className={`inline-block px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest mb-3 ${isAi ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                    {isAi ? t('aiSubject') : book.subject}
                 </span>
                <h3 className="font-black text-sm text-slate-950 dark:text-white leading-tight mb-1 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">{book.title}</h3>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold opacity-70 italic">{book.author}</p>
            </div>
            <div className="bg-white/40 dark:bg-black/20 py-2 px-4 border-t border-white/5 mt-auto text-center">
                <p className="font-black text-slate-900 dark:text-white text-[8px] uppercase tracking-widest opacity-50">S:{book.shelf} — R:{book.row}</p>
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
                <div className="glass-panel p-3 rounded-[1.5rem] shadow-lg border-white/40 dark:border-white/5 backdrop-blur-2xl max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-[2] relative">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-3 ps-10 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-xl outline-none transition-all font-black text-sm shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="flex-[3] grid grid-cols-3 gap-2">
                            {[{ val: subjectFilter, set: setSubjectFilter, opts: filters.subjects, lbl: t('allSubjects') }, { val: authorFilter, set: setAuthorFilter, opts: filters.authors, lbl: t('allAuthors') }, { val: shelfFilter, set: setShelfFilter, opts: filters.shelves, lbl: t('allShelves') }].map((f, i) => (
                                <select key={i} value={f.val} onChange={(e) => f.set(e.target.value)} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[8px] md:text-[10px] cursor-pointer outline-none focus:border-green-600 appearance-none text-center">
                                    <option value="all">{f.lbl}</option>
                                    {f.opts.map(o => <option key={o} value={o}>{i === 2 ? `S:${o}` : o}</option>)}
                                </select>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* شبكة الـ 5 كروت */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-fade-up">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            {filteredBooks.length > visibleCount && (
                <div className="mt-12 text-center">
                    <button onClick={() => setVisibleCount(prev => prev + 20)} className="bg-slate-950 text-white dark:bg-white dark:text-black px-10 py-3 rounded-xl font-black text-xs shadow-xl hover:scale-105 active:scale-90 transition-all uppercase tracking-widest">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
