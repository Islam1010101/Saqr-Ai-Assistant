import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- 1. تعريف واجهة البيانات ---
interface Book {
  id: number;
  title: string;
  author: string;
  subject: string;
  driveLink: string;
  bio: string;
  summary: string;
}

// --- 2. قاعدة البيانات الكاملة والمصلحة (26 عنواناً) ---
const ENGLISH_LIBRARY_DATABASE: Book[] = [
  { id: 1, title: "Me Before You", author: "Jojo Moyes", subject: "Drama", driveLink: "https://drive.google.com/file/d/1eDq03Myjh56IRtLx1LIRJHa39PLnMvgf/view", bio: "A popular British romance novelist known for her emotionally resonant stories.", summary: "A heart-wrenching story of a young woman who becomes a caregiver for a wealthy man." },
  { id: 2, title: "The Great Gatsby", author: "F. Scott Fitzgerald", subject: "Drama", driveLink: "https://drive.google.com/file/d/1NjrAuiFno2Aa-z6WYkRI17oD2Hxkvs-M/view", bio: "A legendary American novelist famous for his critiques of the American Dream.", summary: "Set in the 1920s, this follows Jay Gatsby's obsessive pursuit of wealth and love." },
  { id: 3, title: "The Kite Runner", author: "Khaled Hosseini", subject: "Drama", driveLink: "https://drive.google.com/file/d/1O_WhsHwUQIEMVB8x7tNOI-GHNExJcQLT/view", bio: "Afghan-American novelist whose works deal with identity against conflict.", summary: "A deeply moving story of betrayal and redemption set in a changing Afghanistan." },
  { id: 4, title: "And Then There Were None", author: "Agatha Christie", subject: "Mystery", driveLink: "https://drive.google.com/file/d/16_RuSqhdkmsSXVKPdVJlPEvZnTvPmL75/view", bio: "The world's best-selling mystery writer and creator of iconic detectives.", summary: "Ten strangers are invited to an isolated island, only to be murdered one by one." },
  { id: 5, title: "Tales of the Unexpected", author: "H. G. Wells", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1tCYl3rZznYsXOSI0V8IUO0mVX-2L0CV5/view", bio: "The 'Father of Science Fiction' who mastered eerie and suspenseful storytelling.", summary: "A collection of suspenseful stories that challenge reality with unpredictable twists." },
  { id: 6, title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1l63cxB4Yx9CHdhdhpKTpJkOfx2jp-Aaa/view", bio: "The British author who immortalized the genre through Sherlock Holmes.", summary: "Holmes investigates the legend of a supernatural hound haunting the moors." },
  { id: 7, title: "The Girl on the Train", author: "Paula Hawkins", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1D7AfHf78rWe_0ByPWHRo8VuFx4nzuJ4H/view", bio: "British author known for psychological thrillers dealing with memory.", summary: "A woman witnesses something shocking and gets entangled in a disappearance." },
  { id: 8, title: "The Silent Patient", author: "Alex Michaelides", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1OBJKH3_9pPLVELEqM3AqC_bmb517x4Nx/view", bio: "British-Cypriot author specializing in high-stakes psychological mysteries.", summary: "A famous painter shoots her husband and never speaks again." },
  { id: 9, title: "How Much Land Does a Man Need?", author: "Leo Tolstoy", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1i7G7xoUBk77DPDYyNzEkxMGsJi5XA2gc/view", bio: "A titan of Russian literature and master of philosophical inquiry.", summary: "A profound moral fable about a peasant whose greed leads him to a fatal pursuit." },
  { id: 10, title: "The Bet", author: "Anton Chekhov", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1xQj_l55lPaQqIQnj-vKnzETGHHfdq6UB/view", bio: "Russian physician and master of the short story and character development.", summary: "A banker and a lawyer enter a wager over life imprisonment vs death." },
  { id: 11, title: "The Death of Ivan Ilyich", author: "Leo Tolstoy", subject: "Philosophical", driveLink: "https://drive.google.com/file/d/1jrDEOd4Dn7Dn2926-OWVRMZkSsrKjEZe/view", bio: "Tolstoy focused on deep spiritual questions and the meaning of life.", summary: "A man's sudden illness forces him to confront his social life's hollowness." },
  { id: 12, title: "The Lottery", author: "Shirley Jackson", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1jlYGOA_k4UUHC5Zfq8GwoDxWBTT1djF-/view", bio: "American writer known for gothic fiction and suburban darkness.", summary: "A chilling story about a small town's terrifying annual tradition." },
  { id: 13, title: "The Landlady", author: "Roald Dahl", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1M6Ya7BUz34pmGpGGZtcV_k_AC0skGFVp/view", bio: "Dahl wrote macabre and sinister tales for adults with twist endings.", summary: "A young man stays at a B&B, only to realize the hostess has a deadly secret." },
  { id: 14, title: "The Tell-Tale Heart", author: "Edgar Allan Poe", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1ud80hp2ULpBWHmWT5Qb88wqjrMpVosbk/view", bio: "The father of the American short story and master of macabre horror.", summary: "A classic horror story told by a narrator insisting on their sanity." },
  { id: 15, title: "Great Lateral Thinking Puzzles", author: "Paul Sloane", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1pyrs6TQJE5f_71ZnW91U-CpgOS7gsw4Z/view", bio: "Leading expert on creative thinking and innovation.", summary: "A collection of mind-bending puzzles designed to improve lateral thinking." },
  { id: 16, title: "Murdle", author: "G.T. Karber", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1RRddB4mWC07Bp76elT7L41jibqxYrHIw/view", bio: "Creator who transformed mystery into an interactive deductive game.", summary: "A clever logic puzzle where you find the killer, weapon, and crime scene." },
  { id: 17, title: "The Sherlock Holmes Puzzle Collection", author: "Bernard Myers", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1ntf_ov4RE_PDpCsMWLUeiwhrZYpDc-8n/view", bio: "Specialized in brain-teasers inspired by detective literature.", summary: "Test your powers of deduction with riddles that challenge Sherlock himself." },
  { id: 18, title: "What is the Name of This Book?", author: "Raymond Smullyan", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/10f7Pmnf0BJYChiHODPJ5wQcjpRwIYP_1/view", bio: "Mathematician and logician who turned principles into fun paradoxes.", summary: "A collection leading from simple riddles to deep mathematical truths." },
  { id: 19, title: "Harry Potter and the Deathly Hallows", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1Tz51w4j6g007_NyDM8zTvL62MVEQxNob/view", bio: "Globally renowned author who created the Harry Potter franchise.", summary: "The epic conclusion where Harry destroys Voldemort's Horcruxes." },
  { id: 20, title: "Harry Potter and the Half-Blood Prince", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/16E1rpgPmxEtjHCLv1wHMRb9V4ZOvhcB7/view", bio: "Her stories focus on bravery, friendship, and battle against evil.", summary: "Harry discovers an old potions book belonging to the 'Half-Blood Prince'." },
  { id: 21, title: "Harry Potter and the Order of the Phoenix", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1_1CvFBN-Degg5EPYAZciSM-_6RuZcmNA/view", bio: "Rowling's work has made reading magic for millions.", summary: "Facing disbelief about Voldemort's return, Harry forms Dumbledore's Army." },
  { id: 22, title: "Harry Potter and the Goblet of Fire", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1yaLlEMxF8akcy1nOJ-mhEyTCgC2vQpIb/view", bio: "The wizarding world books have been translated into over 80 languages.", summary: "Harry is unexpectedly chosen to compete in the Triwizard Tournament." },
  { id: 23, title: "Harry Potter and the Prisoner of Azkaban", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1zPl0DKIUjG3bHMg-Np1RO56Bom-F1n12/view", bio: "Rowling now uses her fame to support many global charities.", summary: "A dangerous prisoner escapes Azkaban, leading Harry to secrets about his past." },
  { id: 24, title: "Harry Potter and the Chamber of Secrets", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1JSMD1kKvitxrd50_Dpp9xZWpN14FLYqB/view", bio: "The author who brought magic back to the 21st century.", summary: "Harry finds a dark entity petrifying students within a secret chamber." },
  { id: 25, title: "Harry Potter and the Sorcerer's Stone", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1kSt_ThIZUF6SeRLa1GD0OpLlp9XYkAfK/view", bio: "Her debut novel launched the most successful series in history.", summary: "The magical journey begins as young Harry discovers he is a wizard." },
  { id: 26, title: "Fantastic Beasts and Where to Find Them", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1QpXRbcMHTe6_dNXgkJYmF4QE7jN0gwWF/view", bio: "Rowling wrote this guide to explore the creatures of her world.", summary: "An essential textbook for Hogwarts students about magical creatures." }
];

const translations = {
    ar: {
        pageTitle: "المكتبة الإنجليزية",
        searchPlaceholder: "ابحث عن عنوان أو كاتب...",
        allSubjects: "المواضيع",
        allAuthors: "المؤلفين",
        read: "قراءة المحتوى",
        bioTitle: "حول المؤلف",
        summaryTitle: "ملخص صقر الذكي",
        back: "العودة للبوابة",
        close: "إغلاق",
        locationLabel: "EFIPS"
    },
    en: {
        pageTitle: "English Library",
        searchPlaceholder: "Search title or author...",
        allSubjects: "Subjects",
        allAuthors: "Authors",
        read: "Read Content",
        bioTitle: "Author Bio",
        summaryTitle: "Saqr AI Summary",
        back: "Back to Portal",
        close: "Close",
        locationLabel: "EFIPS"
    }
};

const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any; onAuthorHover: (e: React.MouseEvent, bio: string | null) => void }> = ({ book, onClose, t, onAuthorHover }) => {
    if (!book) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-4xl rounded-[3rem] border-none shadow-2xl overflow-y-auto max-h-[90vh] md:overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 end-4 md:top-6 md:end-6 z-50 p-2.5 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-lg">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex-1 p-8 md:p-14 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200 dark:border-white/10 text-start">
                    <div className="mb-10">
                        <span className="inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-6 bg-slate-950 text-white shadow-md">{book.subject}</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white leading-[1.1] mb-3 tracking-tighter">{book.title}</h2>
                        <p onMouseMove={(e) => onAuthorHover(e, book.bio)} onMouseLeave={(e) => onAuthorHover(e, null)} className="text-xl text-slate-500 font-bold hover:text-red-600 transition-colors inline-block cursor-help border-b-2 border-dotted border-slate-300">By {book.author}</p>
                    </div>
                    <div className="bg-slate-100/50 dark:bg-white/5 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-[10px] text-red-600 font-black uppercase mb-4 tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> {t('summaryTitle')}</p>
                        <p className="text-slate-800 dark:text-slate-200 text-xl font-bold leading-relaxed">{book.summary}</p>
                    </div>
                </div>
                <div className="w-full md:w-[300px] bg-slate-950 dark:bg-black p-10 flex flex-col justify-center items-center text-center text-white relative">
                    <div className="space-y-10 relative z-10 w-full">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{t('locationLabel')}</p>
                            <a href={book.driveLink} target="_blank" rel="noopener noreferrer" className="w-full bg-red-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-700 active:scale-95 shadow-xl transition-all"><span className="text-sm uppercase tracking-widest">{t('read')}</span></a>
                        </div>
                        <button onClick={onClose} className="w-full bg-white text-slate-950 font-black py-3 rounded-xl active:scale-95 text-[10px] uppercase tracking-widest transition-all">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookCard = React.memo(({ book, onClick, t, onAuthorHover }: { book: Book; onClick: () => void; t: any; onAuthorHover: (e: React.MouseEvent, bio: string | null) => void }) => (
    <div onClick={onClick} className="group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-none rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden shadow-md active:scale-95 hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)]">
        <div className="p-6 md:p-8 flex-grow text-start">
             <span className="inline-block px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest mb-5 bg-slate-950 text-white shadow-sm">{book.subject}</span>
            <h2 className="font-black text-xl md:text-2xl text-slate-950 dark:text-white leading-relaxed mb-3 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">{book.title}</h2>
            <p onMouseMove={(e) => onAuthorHover(e, book.bio)} onMouseLeave={(e) => onAuthorHover(e, null)} className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 font-black hover:text-red-600 transition-all inline-block underline decoration-dotted underline-offset-4 cursor-help">By {book.author}</p>
        </div>
        <div className="bg-white/40 dark:bg-black/20 py-4 px-6 md:px-8 border-t border-white/10 mt-auto text-center">
            <p className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.4em] opacity-40">{t('locationLabel')}</p>
        </div>
    </div>
));

const EnglishLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

    const handleAuthorHover = (e: React.MouseEvent, bio: string | null) => {
        if (!bio || window.innerWidth < 768) { setTooltip(null); return; }
        setTooltip({ text: bio, x: e.clientX, y: e.clientY - 40 });
    };

    const filters = useMemo(() => ({
        subjects: ["all", ...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.subject))].sort(),
        authors: ["all", ...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.author))].sort(),
    }), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return ENGLISH_LIBRARY_DATABASE.filter(b => {
            const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            return matchesTerm && matchesSub && matchesAuth;
        });
    }, [searchTerm, subjectFilter, authorFilter]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-24 relative z-10 text-start">
            {tooltip && (
                <div className="fixed pointer-events-none z-[200] glass-panel px-5 py-3 rounded-2xl border-white/40 shadow-2xl animate-in fade-in zoom-in duration-300 max-w-xs" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}>
                    <p className="text-[10px] font-black text-red-600 uppercase mb-1 tracking-widest">{t('bioTitle')}</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{tooltip.text}</p>
                </div>
            )}

            <div className="text-center mt-8 mb-12 relative animate-fade-up">
                <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors group">
                    <svg className={`h-5 w-5 transform group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('back')}</span>
                </button>
                <h1 className="text-4xl sm:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">{t('pageTitle')}</h1>
                <div className="h-1.5 w-24 bg-slate-950 mx-auto mt-6 rounded-full opacity-60"></div>
            </div>

            <div className="sticky top-24 z-50 mb-12 animate-fade-up">
                <div className="glass-panel p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border-none backdrop-blur-3xl max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                        <div className="flex-[2] relative">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-3 md:p-4 ps-12 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-slate-950 rounded-xl md:rounded-2xl outline-none transition-all font-black text-sm md:text-base shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-950 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="grid grid-cols-2 gap-2 flex-[3]">
                            {[{ val: subjectFilter, set: setSubjectFilter, opts: filters.subjects, lbl: t('allSubjects') }, { val: authorFilter, set: setAuthorFilter, opts: filters.authors, lbl: t('allAuthors') }].map((f, i) => (
                                <select key={i} value={f.val} onChange={(e) => f.set(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-slate-950 appearance-none text-center shadow-sm">
                                    <option value="all">{f.lbl}</option>
                                    {f.opts.map(o => o !== "all" && <option key={o} value={o}>{o}</option>)}
                                </select>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-fade-up">
                {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} onAuthorHover={handleAuthorHover} />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} onAuthorHover={handleAuthorHover} />
        </div>
    );
};

export default EnglishLibraryInternalPage;
