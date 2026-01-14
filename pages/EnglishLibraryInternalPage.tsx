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

// --- 2. قاعدة البيانات الكاملة (26 عنواناً) ---
const ENGLISH_LIBRARY_DATABASE: Book[] = [
  { id: 1, title: "Me Before You", author: "Jojo Moyes", subject: "Drama", driveLink: "https://drive.google.com/file/d/1eDq03Myjh56IRtLx1LIRJHa39PLnMvgf/view", bio: "A popular British romance novelist known for her emotionally resonant stories that explore love and life-altering decisions.", summary: "A heart-wrenching story of a young woman who becomes a caregiver for a wealthy man, leading to an unexpected bond." },
  { id: 2, title: "The Great Gatsby", author: "F. Scott Fitzgerald", subject: "Drama", driveLink: "https://drive.google.com/file/d/1NjrAuiFno2Aa-z6WYkRI17oD2Hxkvs-M/view", bio: "A legendary American novelist of the Jazz Age, famous for his critiques of the American Dream and high society.", summary: "Set in the 1920s, this masterpiece follows Jay Gatsby's obsessive pursuit of wealth and the woman he loves." },
  { id: 3, title: "The Kite Runner", author: "Khaled Hosseini", subject: "Drama", driveLink: "https://drive.google.com/file/d/1O_WhsHwUQIEMVB8x7tNOI-GHNExJcQLT/view", bio: "An Afghan-American novelist whose works often deal with family, history, and identity against conflict.", summary: "A deeply moving story of betrayal and redemption set in a changing Afghanistan." },
  { id: 4, title: "And Then There Were None", author: "Agatha Christie", subject: "Mystery", driveLink: "https://drive.google.com/file/d/16_RuSqhdkmsSXVKPdVJlPEvZnTvPmL75/view", bio: "The world's best-selling mystery writer, creator of some of the most iconic literary detectives.", summary: "Ten strangers are invited to an isolated island, only to be murdered one by one." },
  { id: 5, title: "Tales of the Unexpected", author: "H. G. Wells", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1tCYl3rZznYsXOSI0V8IUO0mVX-2L0CV5/view", bio: "Commonly called the 'Father of Science Fiction', Wells also mastered suspenseful and eerie storytelling.", summary: "A collection of suspenseful and eerie stories that challenge reality with unpredictable twists." },
  { id: 6, title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1l63cxB4Yx9CHdhdhpKTpJkOfx2jp-Aaa/view", bio: "The British author who immortalized the detective genre through his creation of Sherlock Holmes.", summary: "Sherlock Holmes investigates the legend of a supernatural spectral hound haunting the moors." },
  { id: 7, title: "The Girl on the Train", author: "Paula Hawkins", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1D7AfHf78rWe_0ByPWHRo8VuFx4nzuJ4H/view", bio: "A contemporary British author known for psychological thrillers that deal with memory and perception.", summary: "A woman witnesses something shocking from a train window and gets entangled in a disappearance." },
  { id: 8, title: "The Silent Patient", author: "Alex Michaelides", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1OBJKH3_9pPLVELEqM3AqC_bmb517x4Nx/view", bio: "A British-Cypriot author who specializes in high-stakes psychological mysteries and plot twists.", summary: "A famous painter shoots her husband and never speaks again, until a therapist tries to uncover her motive." },
  { id: 9, title: "How Much Land Does a Man Need?", author: "Leo Tolstoy", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1i7G7xoUBk77DPDYyNzEkxMGsJi5XA2gc/view", bio: "A titan of Russian literature, master of social realism and philosophical inquiry into the human condition.", summary: "A profound moral fable about a peasant whose greed leads him to a fatal pursuit for land." },
  { id: 10, title: "The Bet", author: "Anton Chekhov", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1xQj_l55lPaQqIQnj-vKnzETGHHfdq6UB/view", bio: "A Russian physician and master of the short story, known for subtle character development.", summary: "A banker and a lawyer enter a bizarre wager over whether life imprisonment is better than death." },
  { id: 11, title: "The Death of Ivan Ilyich", author: "Leo Tolstoy", subject: "Philosophical fiction", driveLink: "https://drive.google.com/file/d/1jrDEOd4Dn7Dn2926-OWVRMZkSsrKjEZe/view", bio: "In his later works, Tolstoy focused on deep spiritual questions, mortality, and the meaning of life.", summary: "A powerful exploration of a man's sudden illness, forcing him to confront his social life's hollowness." },
  { id: 12, title: "The Lottery", author: "Shirley Jackson", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1jlYGOA_k4UUHC5Zfq8GwoDxWBTT1djF-/view", bio: "An American writer known for her gothic fiction and stories that expose darkness in suburban life.", summary: "A chilling story about a small town's annual tradition that reveals the terrifying potential for cruelty." },
  { id: 13, title: "The Landlady", author: "Roald Dahl", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1M6Ya7BUz34pmGpGGZtcV_k_AC0skGFVp/view", bio: "Famous for children's books, Dahl also wrote macabre and sinister tales for adults with twist endings.", summary: "A young man stays at a bed and breakfast, only to realize his polite hostess has a deadly secret." },
  { id: 14, title: "The Tell-Tale Heart", author: "Edgar Allan Poe", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1ud80hp2ULpBWHmWT5Qb88wqjrMpVosbk/view", bio: "The father of the American short story, master of the macabre and psychological horror.", summary: "A classic horror story told by a narrator who insists on their sanity while describing a murder." },
  { id: 15, title: "Great Lateral Thinking Puzzles", author: "Paul Sloane", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1pyrs6TQJE5f_71ZnW91U-CpgOS7gsw4Z/view", bio: "A leading expert on creative thinking and innovation, famous for his challenging logic puzzles.", summary: "A collection of mind-bending puzzles designed to challenge your brain and improve lateral thinking." },
  { id: 16, title: "Murdle", author: "G.T. Karber", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1RRddB4mWC07Bp76elT7L41jibqxYrHIw/view", bio: "A logic puzzle creator who transformed the mystery genre into a fun and interactive deductive game.", summary: "A clever logic puzzle where you use clues to find the killer, the weapon, and the crime scene." },
  { id: 17, title: "The Sherlock Holmes Puzzle Collection", author: "Bernard Myers", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1ntf_ov4RE_PDpCsMWLUeiwhrZYpDc-8n/view", bio: "An author specialized in creating intricate brain-teasers inspired by classic detective literature.", summary: "Test your powers of deduction with puzzles and riddles that would challenge Sherlock Holmes himself." },
  { id: 18, title: "What is the Name of This Book?", author: "Raymond Smullyan", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/10f7Pmnf0BJYChiHODPJ5wQcjpRwIYP_1/view", bio: "A renowned mathematician and logician who turned complex logical principles into fun paradoxes.", summary: "A legendary collection of logic puzzles leading from simple riddles to deep mathematical truths." },
  { id: 19, title: "Harry Potter and the Deathly Hallows", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1Tz51w4j6g007_NyDM8zTvL62MVEQxNob/view", bio: "A globally renowned British author who created the Harry Potter franchise.", summary: "The epic conclusion where Harry Potter set out to destroy Voldemort's Horcruxes to end the dark wizard's reign." },
  { id: 20, title: "Harry Potter and the Half-Blood Prince", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/16E1rpgPmxEtjHCLv1wHMRb9V4ZOvhcB7/view", bio: "Celebrating intricate world-building and making reading a magic experience for millions.", summary: "Harry discovers an old potions book belonging to the mysterious 'Half-Blood Prince'." },
  { id: 21, title: "Harry Potter and the Order of the Phoenix", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1_1CvFBN-Degg5EPYAZciSM-_6RuZcmNA/view", bio: "Her stories focus on bravery, friendship, and the battle against evil.", summary: "Facing disbelief about Voldemort's return, Harry helps form Dumbledore's Army." },
  { id: 22, title: "Harry Potter and the Goblet of Fire", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1yaLlEMxF8akcy1nOJ-mhEyTCgC2vQpIb/view", bio: "Her wizarding world books have been translated into over 80 languages.", summary: "Harry is unexpectedly chosen to compete in the dangerous Triwizard Tournament." },
  { id: 23, title: "Harry Potter and the Prisoner of Azkaban", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1zPl0DKIUjG3bHMg-Np1RO56Bom-F1n12/view", bio: "Rowling now uses her fame to support many global charitable causes.", summary: "A dangerous prisoner escapes Azkaban, leading Harry to uncover secrets about his past." },
  { id: 24, title: "Harry Potter and the Chamber of Secrets", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1JSMD1kKvitxrd50_Dpp9xZWpN14FLYqB/view", bio: "The author who brought magic back to the 21st century, inspiring a generation.", summary: "Harry finds a dark entity petrifying students within a secret chamber." },
  { id: 25, title: "Harry Potter and the Sorcerer's Stone", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1kSt_ThIZUF6SeRLa1GD0OpLlp9XYkAfK/view", bio: "Her debut novel launched the most successful book series in history.", summary: "The magical journey begins as young Harry discovers he is a wizard." },
  { id: 26, title: "Fantastic Beasts and Where to Find Them", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1QpXRbcMHTe6_dNXgkJYmF4QE7jN0gwWF/view", bio: "Rowling wrote this guide to provide a deeper look at the creatures of her world.", summary: "An essential textbook for Hogwarts students about incredible magical creatures." }
];

const translations = {
    ar: {
        pageTitle: "المكتبة الإنجليزية",
        searchPlaceholder: "ابحث عن عنوان أو كاتب...",
        allSubjects: "المواضيع",
        allAuthors: "المؤلفين",
        read: "قراءة المصدر",
        bioTitle: "نبذة عن المؤلف",
        summaryTitle: "ملخص صقر الذكي",
        back: "العودة للبوابة",
        close: "إغلاق",
        locationLabel: "الموقع الرقمي"
    },
    en: {
        pageTitle: "English Library",
        searchPlaceholder: "Search title or author...",
        allSubjects: "Subjects",
        allAuthors: "Authors",
        read: "Read Source",
        bioTitle: "Author Biography",
        summaryTitle: "Saqr AI Summary",
        back: "Back to Portal",
        close: "Close",
        locationLabel: "Digital Location"
    }
};

const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    if (!book) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-4xl rounded-[3rem] border-2 border-white/50 dark:border-white/10 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-2.5 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-lg">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex-1 p-10 md:p-14 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200 dark:border-white/10 text-start">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 bg-slate-900 text-white shadow-md">{book.subject}</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter">{book.title}</h2>
                        <p className="text-lg text-slate-500 font-bold">By {book.author}</p>
                    </div>
                    <div className="mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                         <p className="text-[9px] text-slate-600 dark:text-slate-400 font-black uppercase mb-2 tracking-widest">{t('bioTitle')}</p>
                         <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">"{book.bio}"</p>
                    </div>
                    <div className="bg-slate-100/50 dark:bg-white/5 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-[10px] text-red-600 font-black uppercase mb-3 tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> {t('summaryTitle')}</p>
                        <p className="text-slate-800 dark:text-slate-200 text-lg font-medium leading-relaxed">"{book.summary}"</p>
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
    <div onClick={onClick} className="group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-white/5 rounded-[2.5rem] transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden shadow-md active:scale-95 hover:border-slate-950/40 hover:shadow-[0_0_25px_rgba(0,0,0,0.25)]">
        <div className="p-8 flex-grow text-start">
             <span className="inline-block px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest mb-5 bg-slate-950 text-white shadow-sm">{book.subject}</span>
            <h3 className="font-black text-xl text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">{book.title}</h3>
            <p onMouseMove={(e) => onAuthorHover(e, book.bio)} onMouseLeave={(e) => onAuthorHover(e, null)} className="text-[11px] text-slate-500 dark:text-slate-400 font-bold hover:text-red-600 transition-all inline-block">By {book.author}</p>
        </div>
        <div className="bg-white/40 dark:bg-black/20 py-4 px-8 border-t border-white/10 mt-auto">
            <p className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.3em] opacity-30 text-center">English Collection</p>
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
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

    const handleAuthorHover = (e: React.MouseEvent, bio: string | null) => {
        if (!bio) { setTooltip(null); return; }
        setTooltip({ text: bio, x: e.clientX, y: e.clientY - 40 });
    };

    const filters = useMemo(() => ({
        subjects: ["all", ...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.subject))].sort(),
    }), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return ENGLISH_LIBRARY_DATABASE.filter(b => {
            const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            return matchesTerm && matchesSub;
        });
    }, [searchTerm, subjectFilter]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-24 relative z-10">
            {tooltip && (
                <div className="fixed pointer-events-none z-[200] glass-panel px-5 py-3 rounded-2xl border-white/40 shadow-2xl animate-in fade-in zoom-in duration-300 max-w-xs" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}>
                    <p className="text-[10px] font-black text-red-600 uppercase mb-1 tracking-widest">{t('bioTitle')}</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{tooltip.text}</p>
                </div>
            )}

            <div className="text-center mt-8 mb-12 relative animate-fade-up">
                <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors group">
                    <svg className={`h-5 w-5 transform group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('back')}</span>
                </button>
                <h1 className="text-5xl sm:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">{t('pageTitle')}</h1>
                <div className="h-1.5 w-24 bg-slate-900 mx-auto mt-6 rounded-full opacity-60"></div>
            </div>

            <div className="sticky top-24 z-50 mb-12 animate-fade-up">
                <div className="glass-panel p-3 rounded-[1.5rem] shadow-lg border-white/40 dark:border-white/5 backdrop-blur-2xl max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-[2] relative">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-3 ps-10 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-slate-900 rounded-xl outline-none transition-all font-black text-sm shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-900 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="flex-1 relative">
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] cursor-pointer outline-none focus:border-slate-900 appearance-none text-center shadow-sm">
                                {filters.subjects.map(s => <option key={s} value={s}>{s === 'all' ? t('allSubjects') : s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-up">
                {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} onAuthorHover={handleAuthorHover} />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />
        </div>
    );
};

export default EnglishLibraryInternalPage;
