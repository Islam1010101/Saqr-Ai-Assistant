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
    aiSubject: "تصنيف صقر AI",
    details: "معلومات المصدر",
    close: "إغلاق",
    subjectLabel: "موضوع الكتاب"
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
    aiSubject: "Saqr AI Classification",
    details: "Resource Info",
    close: "Close",
    subjectLabel: "Book Subject"
  }
};

// --- نافذة تفاصيل الكتاب (توزيع كتل البيانات + الربط الذكي) ---
const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale } = useLanguage();
    const [aiSummary, setAiSummary] = useState<string>('');
    const [inferredSubject, setInferredSubject] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!book) { setAiSummary(''); setInferredSubject(''); return; }
        
        const fetchAiData = async () => {
            setIsAiLoading(true);
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ 
                            role: 'system', 
                            content: `You are Saqr AI. For the book "${book.title}" by "${book.author}": 
                            1. Summarize it in 2 sentences. 
                            2. If current subject is "Unknown", provide a 1-word category in ${locale === 'ar' ? 'Arabic' : 'English'}.` 
                        }],
                        locale
                    }),
                });
                const data = await response.json();
                setAiSummary(data.reply || '');
                // استخلاص الموضوع إذا كان مفقوداً (بناءً على رد الـ AI المتوقع)
                if (!book.subject || book.subject === "Unknown") {
                    setInferredSubject(data.inferredCategory || t('aiSubject'));
                }
            } catch (error) { 
                setAiSummary(book.summary || 'Summary processing...'); 
            } finally { setIsAiLoading(false); }
        };
        fetchAiData();
    }, [book, locale, t]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 backdrop-blur-3xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-4xl rounded-[3.5rem] border-2 border-white/50 dark:border-white/10 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                
                {/* زر الإغلاق */}
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-3 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-lg">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* الجانب الأيمن: العنوان والملخص */}
                <div className="flex-1 p-10 md:p-14 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200 dark:border-white/10">
                    <div className="mb-8">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white leading-tight mb-4 tracking-tighter">{book.title}</h2>
                        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-bold italic">By {book.author}</p>
                    </div>
                    
                    <div className="bg-slate-100/50 dark:bg-white/5 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 relative">
                        <p className="text-[10px] text-red-600 font-black uppercase mb-4 flex items-center gap-2 tracking-widest">
                            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-lg"></span>
                            Official Summary
                        </p>
                        {isAiLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-full"></div>
                                <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-5/6"></div>
                            </div>
                        ) : (
                            <p className="text-slate-800 dark:text-slate-200 text-xl md:text-2xl font-medium leading-relaxed italic animate-fade-in">
                                "{aiSummary || book.summary}"
                            </p>
                        )}
                    </div>
                </div>

                {/* الجانب الأيسر: ترتيب البيانات (الموضوع فوق الرف) */}
                <div className="w-full md:w-[360px] bg-slate-950 dark:bg-black p-10 flex flex-col justify-center items-center text-center text-white relative">
                    <div className="space-y-10 relative z-10 w-full">
                        {/* كتلة الموضوع (في القمة بطلبك) */}
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-3">{t('subjectLabel')}</p>
                            <p className="text-2xl font-black text-white tracking-tight">
                                {inferredSubject || (book.subject !== "Unknown" ? book.subject : t('aiSubject'))}
                            </p>
                        </div>

                        {/* كتلة الرفوف */}
                        <div>
                            <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-6">Physical Location</p>
                            <div className="flex justify-center gap-10">
                                <div><p className="text-xs opacity-50 uppercase mb-1">{t('shelf')}</p><p className="text-5xl font-black">{book.shelf}</p></div>
                                <div className="w-px h-16 bg-white/20"></div>
                                <div><p className="text-xs opacity-50 uppercase mb-1">{t('row')}</p><p className="text-5xl font-black">{book.row}</p></div>
                            </div>
                        </div>

                        <button onClick={onClose} className="w-full bg-white text-slate-950 font-black py-5 rounded-2xl active:scale-95 text-xs uppercase tracking-[0.2em] shadow-2xl transition-all">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- بطاقة الكتاب (5 كروت + توهج) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
    const isAi = !book.subject || book.subject === "Unknown";
    return (
        <div 
            onClick={onClick} 
            className="group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/5 rounded-[2.5rem] transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden shadow-lg active:scale-95 hover:border-red-600/60 hover:shadow-[0_0_30px_rgba(220,38,38,0.35)]"
        >
            <div className="p-7 flex-grow">
                 <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-5 ${isAi ? 'bg-red-600 text-white shadow-md' : 'bg-green-600 text-white shadow-md'}`}>
                    {isAi ? t('aiSubject') : book.subject}
                 </span>
                <h3 className="font-black text-lg text-slate-950 dark:text-white leading-tight mb-3 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">{book.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">{book.author}</p>
            </div>
            <div className="bg-white/40 dark:bg-black/20 py-5 px-7 border-t border-white/10 mt-auto">
                <p className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest opacity-70">S:{book.shelf} — R:{book.row}</p>
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
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleInteraction = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 800);
    };

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
            {/* شريط البحث */}
            <div className="sticky top-24 z-50 mb-12 animate-fade-up">
                <div className="glass-panel p-5 rounded-[2.5rem] shadow-2xl border-white/40 dark:border-white/5 backdrop-blur-3xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-[2] relative group">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-5 ps-14 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-[2rem] outline-none transition-all font-black text-lg shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-5 top-1/2 -translate-y-1/2 h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="flex-[3] grid grid-cols-3 gap-3">
                            {[
                                { val: subjectFilter, set: setSubjectFilter, options: filters.subjects, label: t('allSubjects') },
                                { val: authorFilter, set: setAuthorFilter, options: filters.authors, label: t('allAuthors') },
                                { val: shelfFilter, set: setShelfFilter, options: filters.shelves, label: t('allShelves') }
                            ].map((f, i) => (
                                <select key={i} value={f.val} onChange={(e) => f.set(e.target.value)} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 font-black text-[10px] md:text-sm cursor-pointer outline-none focus:border-green-600 transition-all appearance-none">
                                    <option value="all">{f.label}</option>
                                    {f.options.map(o => <option key={o} value={o}>{i === 2 ? `S: ${o}` : o}</option>)}
                                </select>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* شبكة الـ 5 كروت */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-up">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            {/* زر عرض المزيد */}
            {filteredBooks.length > visibleCount && (
                <div className="mt-20 text-center">
                    <button onMouseDown={handleInteraction} onClick={() => setVisibleCount(prev => prev + 20)} className="relative overflow-hidden bg-slate-950 text-white dark:bg-white dark:text-black px-20 py-5 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 active:scale-90 transition-all uppercase tracking-[0.3em]">
                        {ripples.map(r => <span key={r.id} className="ripple-effect bg-red-600/20" style={{ left: r.x, top: r.y }} />)}
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
