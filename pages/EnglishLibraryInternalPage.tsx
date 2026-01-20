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

// --- 2. قاعدة البيانات ---
const ENGLISH_LIBRARY_DATABASE: Book[] = [
  { id: 1, title: "Me Before You", author: "Jojo Moyes", subject: "Drama", driveLink: "https://drive.google.com/file/d/1eDq03Myjh56IRtLx1LIRJHa39PLnMvgf/view", bio: "British author famous for her emotionally resonant romantic stories.", summary: "A heart-wrenching story of a young woman who becomes a caregiver for a wealthy man." },
  { id: 2, title: "The Great Gatsby", author: "Scott Fitzgerald", subject: "Drama", driveLink: "https://drive.google.com/file/d/1NjrAuiFno2Aa-z6WYkRI17oD2Hxkvs-M/view", bio: "A master of the Jazz Age, famous for his critiques of the American Dream.", summary: " Jay Gatsby's obsessive pursuit of wealth and the woman he loves in the 1920s." },
  { id: 3, title: "The Kite Runner", author: "KHALED HOSSEINI", subject: "Drama", driveLink: "https://drive.google.com/file/d/1O_WhsHwUQIEMVB8x7tNOI-GHNExJcQLT/view", bio: "Afghan-American novelist whose works deal with identity and redemption.", summary: "A deeply moving story of betrayal and redemption set in war-torn Afghanistan." },
  { id: 4, title: "And Then There Were NONE", author: "Agatha Christie", subject: "Mystery", driveLink: "https://drive.google.com/file/d/16_RuSqhdkmsSXVKPdVJlPEvZnTvPmL75/view", bio: "The world's best-selling mystery writer, creator of iconic detectives.", summary: "Ten strangers are invited to an isolated island, only to be murdered one by one." },
  { id: 5, title: "TALES OF THE UNEXPECTED", author: "H. G. WELLS", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1tCYl3rZznYsXOSI0V8IUO0mVX-2L0CV5/view", bio: "Renowned for science fiction, Wells also mastered suspenseful storytelling.", summary: "A collection of suspenseful and eerie stories that challenge reality with unpredictable twists." },
  { id: 6, title: "THE HOUND OF THE BASKERVILLES", author: "CONAN DOYLE", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1l63cxB4Yx9CHdhdhpKTpJkOfx2jp-Aaa/view", bio: "The British author who immortalized the detective genre through Sherlock Holmes.", summary: "Sherlock Holmes investigates the legend of a supernatural spectral hound." },
  { id: 7, title: "The girl on the train", author: "Paula Hawkins", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1D7AfHf78rWe_0ByPWHRo8VuFx4nzuJ4H/view", bio: "Contemporary British author known for psychological thrillers.", summary: "A woman witnesses something shocking and gets entangled in a disappearance." },
  { id: 8, title: "The Silent Patient", author: "Alex Michaelides", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1OBJKH3_9pPLVELEqM3AqC_bmb517x4Nx/view", bio: "British-Cypriot author specializing in psychological crime fiction.", summary: "A famous painter shoots her husband and never speaks again, until a therapist intervenes." },
  { id: 9, title: "How Much Land Does a Man Need?", author: "Leo Tolstoy", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1i7G7xoUBk77DPDYyNzEkxMGsJi5XA2gc/view", bio: "Giant of Russian literature, master of social realism and philosophical inquiry.", summary: "A profound moral fable about a peasant whose greed leads him to a fatal pursuit." },
  { id: 10, title: "The Bet", author: "Anton Chekhov", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1xQj_l55lPaQqIQnj-vKnzETGHHfdq6UB/view", bio: "Russian master of the short story and modern drama.", summary: "A banker and a lawyer make a wager about the meaning of freedom and death." },
  { id: 11, title: "Tolstoy Death Ilyich", author: "Leo Tolstoy", subject: "Philosophical fiction", driveLink: "https://drive.google.com/file/d/1jrDEOd4Dn7Dn2926-OWVRMZkSsrKjEZe/view", bio: "A master of detailing the inner struggles of the human spirit.", summary: "A powerful exploration of mortality and the search for life's true purpose." },
  { id: 12, title: "The Lottery", author: "Shirley Jackson", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1jlYGOA_k4UUHC5Zfq8GwoDxWBTT1djF-/view", bio: "American writer known for gothic fiction and exposing social darkness.", summary: "A chilling story about a village ritual that reveals the terrifying potential for cruelty." },
  { id: 13, title: "THE LANDLADY", author: "ROALD DAHL", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1M6Ya7BUz34pmGpGGZtcV_k_AC0skGFVp/view", bio: "Famous for children's books and macabre adult short fiction.", summary: "A young man stays at a bed and breakfast, unaware of his landlady's sinister secret." },
  { id: 14, title: "The Tell-Tale Heart", author: "Edgar Allan Poe", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1ud80hp2ULpBWHmWT5Qb88wqjrMpVosbk/view", bio: "The father of American short stories and the master of psychological horror.", summary: "A classic psychological horror tale told by an unreliable narrator." },
  { id: 15, title: "Great Lateral thinking puzzles", author: "Poul Sloane", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1pyrs6TQJE5f_71ZnW91U-CpgOS7gsw4Z/view", bio: "Leading author on lateral thinking and innovation puzzles.", summary: "A collection of mind-bending puzzles designed to boost creative thinking." },
  { id: 16, title: "Murdle", author: "g.t. karber", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1RRddB4mWC07Bp76elT7L41jibqxYrHIw/view", bio: "Creator of the best-selling puzzle game that turns mystery into logic.", summary: "Solve intricate logic puzzles to uncover the killer and the motive." },
  { id: 17, title: "The Sherlock Holmes Puzzle Collection", author: "Bernard Myers", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1ntf_ov4RE_PDpCsMWLUeiwhrZYpDc-8n/view", bio: "Specialized in creating brain-teasers inspired by classic detective literature.", summary: "Test your deduction skills with riddles inspired by Sherlock Holmes." },
  { id: 18, title: "What is the Name of This Book", author: "Raymond Smullyan", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/10f7Pmnf0BJYChiHODPJ5wQcjpRwIYP_1/view", bio: "Mathematician and logician who turned complex logic into fun paradoxes.", summary: "A legendary collection of logic puzzles leading to deep mathematical truths." },
  { id: 19, title: "Harry Potter And The Deathly Hallows", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1Tz51w4j6g007_NyDM8zTvL62MVEQxNob/view", bio: "Global icon who created the most successful book series in history.", summary: "The final battle between Harry and Voldemort for the fate of the wizarding world." },
  { id: 20, title: "Harry Potter And The Half Blood Prince", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/16E1rpgPmxEtjHCLv1wHMRb9V4ZOvhcB7/view", bio: "A master of building intricate magical worlds and deep character growth.", summary: "Harry discovers a mysterious book while Voldemort's power continues to rise." },
  { id: 21, title: "Harry Potter And The Order Of The Phoenix", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1_1CvFBN-Degg5EPYAZciSM-_6RuZcmNA/view", bio: "Her books focus on the timeless themes of friendship and bravery.", summary: "Harry forms a secret defense group to prepare for the return of the Dark Lord." },
  { id: 22, title: "Harry Potter And The Goblet Of Fire", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1yaLlEMxF8akcy1nOJ-mhEyTCgC2vQpIb/view", bio: "Award-winning author whose work is translated into over 80 languages.", summary: "Harry is forced to compete in a dangerous tournament between magic schools." },
  { id: 23, title: "Harry Potter And The Prisoner Of Azkaban", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1zPl0DKIUjG3bHMg-Np1RO56Bom-F1n12/view", bio: "Creator of the Wizarding World, one of the most influential writers.", summary: "A dangerous prisoner escapes Azkaban, revealing secrets about Harry's past." },
  { id: 24, title: "Harry Potter And The Chamber Of Secrets", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1JSMD1kKvitxrd50_Dpp9xZWpN14FLYqB/view", bio: "The author who inspired a global generation to love reading.", summary: "A dark entity is petrifying students at Hogwarts, and Harry must find the source." },
  { id: 25, title: "Harry Potter And The Sorcers Stone", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1kSt_ThIZUF6SeRLa1GD0OpLlp9XYkAfK/view", bio: "The debut novel that started a worldwide phenomenon of magic.", summary: "The magical journey begins as young Harry discovers he is a wizard." },
  { id: 26, title: "Fantastic Beasts And Where To Find Them", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1QpXRbcMHTe6_dNXgkJYmF4QE7jN0gwWF/view", bio: "Writer who provided a deeper look at the creatures of her magical universe.", summary: "A guide textbook of magical creatures essential for Hogwarts students." },
  { id: 27, title: "Atomic Habits", author: "James Clear", subject: "H.D", driveLink: "https://drive.google.com/file/d/1Qex8tUra71DBS7m9StdFiyPyijrW-jZ2/view", bio: "World-leading expert on habit formation and continuous improvement.", summary: "A practical guide to building good habits and breaking bad ones with tiny changes." },
  { id: 28, title: "The Power of Habit", author: "Charles Duhigg", subject: "H.D", driveLink: "https://drive.google.com/file/d/1WMBTKR1yGi9XYBcmybboSz2lbmCOsETj/view", bio: "Pulitzer Prize-winning journalist and expert on organizational psychology.", summary: "Exploring why habits exist and how they can be changed in life and business." },
  { id: 29, title: "Deep Work", author: "Cal Newport", subject: "H.D", driveLink: "https://drive.google.com/file/d/1uHrix_Yw67UpVP-WWWq3tmbKWsONyScZ/view", bio: "Academic and author focused on the intersection of digital tech and culture.", summary: "Rules for focused success in a distracted world through deep concentration." },
  { id: 30, title: "How To Win Friends And Influence People", author: "Dale Carnegie", subject: "H.D", driveLink: "https://drive.google.com/file/d/17PI6rWut3Uiu9ZCPxWQmbTSS_Wx19dC_/view", bio: "Pioneer in the fields of self-improvement and interpersonal skills.", summary: "The classic guide on how to communicate effectively and build relationships." },
  { id: 31, title: "Mindset", author: "Carol S. Dweck", subject: "H.D", driveLink: "https://drive.google.com/file/d/1I3Qw2AiQoRmwMD4wekClIY1Xw78nYGqu/view", bio: "Stanford psychologist who discovered the power of the growth mindset.", summary: "A look at how our beliefs about our abilities dictate our success." },
  { id: 32, title: "The 5 Second Rule", author: "Mel Robbins", subject: "H.D", driveLink: "https://drive.google.com/file/d/1TywPMLWwsIJn56Ip6cyiE_X7j9ahj6hR/view", bio: "One of the world's most booked motivational speakers and TV hosts.", summary: "A simple tool to stop hesitating and start taking action in 5 seconds." },
  { id: 33, title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", subject: "H.D", driveLink: "https://drive.google.com/file/d/14KC3CukTeGBiExQOygOi9-4ES5MgYCXV/view", bio: "A world-renowned authority on leadership and family dynamics.", summary: "Seven principles for solving personal and professional problems." },
  { id: 34, title: "Who Will Cry When You Die?", author: "Robin Sharma", subject: "H.D", driveLink: "https://drive.google.com/file/d/1j9pgm1Kug2IAZ5JdXzG2pb6fCwvSBPYf/view", bio: "He is a Helper and a Writer.", summary: "Live your life so well that when you are gone, people will miss you and remember you with love." },
  { id: 35, title: "A Long Walk To Water", author: "Linda Sue Park", subject: "Drama", driveLink: "https://drive.google.com/file/d/11gonabB5vRB8JqrI4pV13qXlxZMrYQJb/view?usp=drive_link", bio: "Linda Sue Park is an award-winning American author known for writing inspiring stories for young readers.", summary: "The book tells the inspiring true story of two children in Sudan who overcome war and thirst to find hope." },
  { id: 36, title: "House On Mango Street", author: "Sandra Cisneros", subject: "Drama", driveLink: "https://drive.google.com/file/d/1gsaHiO-JBPiW4Q0tEgmBnEgDQUBP7txQ/view?usp=drive_link", bio: "Sandra Cisneros is a famous Mexican-American author best known for her novel The House on Mango Street.", summary: "The House on Mango StreetIs a famous novel by Sandra Cisneros that tells the story of Esperanza Cordero, a young girl growing up in a Latino neighborhood in Chicago. The book is written as a series of short stories, or vignettes, where Esperanza describes her humble house, her neighbors, and her dreams of having a home of her own. It explores themes of identity, belonging, and hope using simple but poetic language, making it a perfect and inspiring read for English learners." },
  { id: 37, title: "We Hunt the Flame", author: "Hafsah Faizal", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/189Uv49fixxfY3SMMx0GIn3cVyY6_xrOO/view?usp=drive_link", bio: "Hafsah Faizal is a New York Times bestselling author and the first American Muslim woman to reach that list for young adult fantasy.", summary: "Is an epic fantasy novel set in the magical world of Arawiya, which is inspired by ancient Arabia. The story follows two main characters: Zafira, a brave hunter who disguises herself as a man to feed her people, and Nasir, a prince and an assassin. Together, they go on a dangerous journey to a mysterious forest to find a lost artifact that can bring magic back to their land and stop the darkness. It is a thrilling story about bravery, honor, and finding hope in difficult times." },
  { id: 38, title: "Diary Of A Wimpy", author: "Jeff Kinney", subject: "Adventure", driveLink: "https://drive.google.com/drive/folders/1utmm5R62wk56dPUkErpXdpOJFYRpxn4u?usp=drive_link", bio: "Jeff Kinney is a famous American author and cartoonist, best known for creating the popular Diary of a Wimpy Kid series.", summary: "This popular series follows the funny daily life of a middle school student named Greg Heffley through his personal diary and cartoons." },
  { id: 39, title: "Wonder", author: "R.J. Palacio", subject: "Drama", driveLink: "https://drive.google.com/file/d/1t5wMyRze_1cVCDfdlUbScSQEgiKlLEAd/view?usp=drive_link", bio: "R.J. Palacio is a famous American author best known for writing the inspiring best-selling novel Wonder.", summary: "Is a heartwarming novel about August Pullman, a young boy born with a facial difference. After being homeschooled for years, he starts the fifth grade at a private middle school. The story follows Auggie’s journey as he tries to fit in and shows how his courage affects his classmates and the whole community. It is a beautiful story that teaches readers about the importance of kindness, friendship, and accepting people for who they are." }
];

const translations = {
    ar: {
        pageTitle: "المكتبة الإنجليزية",
        searchPlaceholder: "ابحث عن عنوان أو كاتب...",
        allSubjects: "المواضيع",
        allAuthors: "المؤلفين",
        sortBy: "فرز حسب",
        alphabetical: "أبجدياً (العنوان)",
        authorSort: "المؤلف",
        subjectSort: "الموضوع",
        none: "تلقائي",
        read: "قراءة المحتوى",
        bioTitle: "حول المؤلف",
        summaryTitle: "ملخص صقر الذكي",
        back: "العودة",
        close: "إغلاق",
        locationLabel: "EFIPS"
    },
    en: {
        pageTitle: "English Library",
        searchPlaceholder: "Search title or author...",
        allSubjects: "Subjects",
        allAuthors: "Authors",
        sortBy: "Sort By",
        alphabetical: "Alphabetical (Title)",
        authorSort: "Author",
        subjectSort: "Subject",
        none: "Default",
        read: "Read Content",
        bioTitle: "Author Bio",
        summaryTitle: "Saqr AI Summary",
        back: "Back",
        close: "Close",
        locationLabel: "EFIPS"
    }
};

const trackActivity = (type: 'searched' | 'digital' | 'ai', label: string) => {
    const logs = JSON.parse(localStorage.getItem('efips_activity_logs') || '[]');
    logs.push({ type, label, date: new Date().toISOString() });
    localStorage.setItem('efips_activity_logs', JSON.stringify(logs));
};

const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any; onAuthorHover: (e: React.MouseEvent, bio: string | null) => void }> = ({ book, onClose, t, onAuthorHover }) => {
    if (!book) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose}>
            <div className="glass-panel w-full max-w-4xl rounded-[3rem] border-none shadow-2xl overflow-y-auto max-h-[90vh] md:overflow-hidden relative animate-in zoom-in-95 duration-500 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-2.5 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-lg">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex-1 p-10 md:p-14 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200 dark:border-white/10 text-start">
                    <div className="mb-10">
                        <span className="inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-6 bg-slate-900 text-white shadow-md">{book.subject}</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white leading-[1.1] mb-3 tracking-tighter">{book.title}</h2>
                        <p onMouseMove={(e) => onAuthorHover(e, book.bio)} onMouseLeave={(e) => onAuthorHover(e, null)} className="text-xl text-slate-500 font-bold hover:text-red-600 transition-colors inline-block cursor-help border-b-2 border-dotted border-slate-300 uppercase tracking-tight">By {book.author}</p>
                    </div>
                    <div className="bg-slate-100/50 dark:bg-white/5 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-[10px] text-red-600 font-black uppercase mb-4 tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> {t('summaryTitle')}</p>
                        <p className="text-slate-800 dark:text-slate-200 text-xl font-bold leading-relaxed">{book.summary}</p>
                    </div>
                </div>
                <div className="w-full md:w-[300px] bg-slate-950 dark:bg-black p-10 flex flex-col justify-center items-center text-center text-white relative font-black">
                    <div className="space-y-10 relative z-10 w-full">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{t('locationLabel')}</p>
                            <a 
                                href={book.driveLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={() => trackActivity('digital', book.title)}
                                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-700 active:scale-95 shadow-xl transition-all"
                            >
                                <span className="text-sm uppercase tracking-widest">{t('read')}</span>
                            </a>
                        </div>
                        <button onClick={onClose} className="w-full bg-white text-slate-950 font-black py-3 rounded-xl active:scale-95 text-[10px] uppercase tracking-widest transition-all">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookCard = React.memo(({ book, onClick, t, onAuthorHover }: { book: Book; onClick: () => void; t: any; onAuthorHover: (e: React.MouseEvent, bio: string | null) => void }) => (
    <div 
        onClick={() => {
            trackActivity('searched', book.title);
            onClick();
        }} 
        className="group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-none rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden shadow-md active:scale-95 hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)]"
    >
        <div className="p-6 md:p-8 flex-grow text-start">
             <span className="inline-block px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest mb-4 bg-slate-950 text-white shadow-sm">{book.subject}</span>
            <h2 className="font-black text-xl md:text-2xl text-slate-950 dark:text-white leading-relaxed mb-3 tracking-tighter group-hover:text-green-700 transition-colors line-clamp-2">{book.title}</h2>
            <p onMouseMove={(e) => onAuthorHover(e, book.bio)} onMouseLeave={(e) => onAuthorHover(e, null)} className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 font-black hover:text-red-600 transition-all inline-block underline decoration-dotted underline-offset-4 cursor-help uppercase tracking-tight">By {book.author}</p>
        </div>
        <div className="bg-white/40 dark:bg-black/20 py-4 px-6 md:px-8 border-t border-white/10 mt-auto text-center font-black">
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
    const [sortBy, setSortBy] = useState('none'); // حالة الفرز الجديدة
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

    const handleAuthorHover = (e: React.MouseEvent, bio: string | null) => {
        if (!bio || window.innerWidth < 768) { setTooltip(null); return; }
        setTooltip({ text: bio, x: e.clientX, y: e.clientY - 40 });
    };

    const filters = useMemo(() => ({
        subjects: ["all", ...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.subject))].sort(),
        authors: ["all", ...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.author))].sort()
    }), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        let result = ENGLISH_LIBRARY_DATABASE.filter(b => {
            const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            return matchesTerm && matchesSub && matchesAuth;
        });

        // منطق الفرز المضاف حديثاً
        if (sortBy === 'alphabetical') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'author') {
            result.sort((a, b) => a.author.localeCompare(b.author));
        } else if (sortBy === 'subject') {
            result.sort((a, b) => a.subject.localeCompare(b.subject));
        }

        return result;
    }, [searchTerm, subjectFilter, authorFilter, sortBy]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-24 relative z-10 text-start font-black">
            {tooltip && (
                <div className="fixed pointer-events-none z-[200] glass-panel px-5 py-3 rounded-2xl border-white/40 shadow-2xl animate-in fade-in zoom-in duration-200 max-w-xs transition-opacity" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}>
                    <p className="text-[10px] font-black text-red-600 uppercase mb-1 tracking-widest">{t('bioTitle')}</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white leading-relaxed">{tooltip.text}</p>
                </div>
            )}

            <div className="text-center mt-8 mb-12 relative animate-fade-up">
                <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors group">
                    <svg className={`h-5 w-5 transform group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('back')}</span>
                </button>
                <h1 className="text-4xl sm:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">{t('pageTitle')}</h1>
                <div className="h-1.5 w-24 bg-slate-900 mx-auto mt-6 rounded-full opacity-60"></div>
            </div>

            <div className="sticky top-24 z-50 mb-12 animate-fade-up">
                <div className="glass-panel p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border-none backdrop-blur-3xl max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                        <div className="flex-[2] relative">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-3 md:p-4 ps-12 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-slate-900 rounded-xl md:rounded-2xl outline-none transition-all font-black text-sm md:text-base shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-950 dark:text-white opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="grid grid-cols-3 gap-2 flex-[4]">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[9px] md:text-xs cursor-pointer outline-none focus:border-slate-900 appearance-none text-center shadow-sm">
                                <option value="none">{t('sortBy')}</option>
                                <option value="alphabetical">{t('alphabetical')}</option>
                                <option value="author">{t('authorSort')}</option>
                                <option value="subject">{t('subjectSort')}</option>
                            </select>
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-slate-900 appearance-none text-center shadow-sm">
                                <option value="all">{t('allSubjects')}</option>
                                {filters.subjects.map(o => o !== "all" && <option key={o} value={o}>{o}</option>)}
                            </select>
                            <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[10px] md:text-xs cursor-pointer outline-none focus:border-slate-900 appearance-none text-center shadow-sm">
                                <option value="all">{t('allAuthors')}</option>
                                {filters.authors.map(o => o !== "all" && <option key={o} value={o}>{o}</option>)}
                            </select>
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
