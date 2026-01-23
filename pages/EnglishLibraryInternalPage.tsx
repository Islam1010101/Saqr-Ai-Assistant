import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- 1. تعريف واجهة البيانات وقاعدة البيانات ---
interface Book {
  id: number;
  title: string;
  author: string;
  subject: string;
  driveLink: string;
  bio: string;
  summary: string;
  publisher?: string;
  audioId?: string; // أضفت هذا الحقل لدعم التمييز الصوتي
}

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
  { id: 25, title: "Harry Potter And The Sorcers Stone", author: "J. K. Rowling", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1gV4n_PFlxcaT1QPUlwka0y0puPCcXAOL/view?usp=drive_link", bio: "The debut novel that started a worldwide phenomenon of magic.", summary: "The magical journey begins as young Harry discovers he is a wizard." },
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
        sortBy: "فرز حسب",
        alphabetical: "العنوان",
        authorSort: "المؤلف",
        subjectSort: "الموضوع",
        audioSort: "الصوتيات أولاً",
        allAuthors: "كل المؤلفين",
        allSubjects: "كل الموضوعات",
        audioOnly: "صوتيات فقط",
        read: "قراءة المحتوى",
        listen: "تلخيص صقر الصوتي",
        summaryTitle: "ملخص صقر الرقمي",
        back: "العودة",
        close: "إغلاق",
        bioTitle: "نبذة عن المؤلف",
        exclusive: "حصرياً",
        speed: "السرعة"
    },
    en: {
        pageTitle: "English Library",
        searchPlaceholder: "Search title or author...",
        sortBy: "Sort By",
        alphabetical: "Title",
        authorSort: "Author",
        subjectSort: "Subject",
        audioSort: "Audio First",
        allAuthors: "All Authors",
        allSubjects: "All Subjects",
        audioOnly: "Audio Only",
        read: "Read Content",
        listen: "Saqr Audio Summary",
        summaryTitle: "Saqr Digital Summary",
        back: "Back",
        close: "Close",
        bioTitle: "About Author",
        exclusive: "Exclusively",
        speed: "Speed"
    }
};

// --- 3. المكونات الفرعية (Sub-components) ---

const SchoolLogo = ({ forceWhite = false, className = "" }: { forceWhite?: boolean, className?: string }) => (
    <img 
        src="/school-logo.png" 
        alt="School Logo" 
        className={`h-8 w-auto rotate-[15deg] transition-all duration-500 ${forceWhite ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'} ${className}`}
    />
);

const AudioWaveIcon = () => (
    <div className="flex gap-0.5 items-end h-4">
        <div className="w-0.5 bg-red-600 animate-audio-bar-1"></div>
        <div className="w-0.5 bg-red-600 animate-audio-bar-2"></div>
        <div className="w-0.5 bg-red-600 animate-audio-bar-3"></div>
        <div className="w-0.5 bg-red-600 animate-audio-bar-2"></div>
    </div>
);

const SaqrAudioPlayer: React.FC<{ audioSrc: string; t: any }> = ({ audioSrc, t }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleSpeed = () => {
        const speeds = [1, 1.5, 2, 0.5];
        const nextSpeed = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
        setSpeed(nextSpeed);
        if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
    };

    return (
        <div className="mt-8 animate-fade-up">
            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="text-lg">🎧</span> {t('listen')}
            </h4>
            <div className="p-5 rounded-[2.5rem] bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/20 shadow-inner flex items-center gap-4">
                <audio ref={audioRef} src={audioSrc} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} />
                <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                    {isPlaying ? <span className="text-xl">⏸</span> : <span className="text-xl ps-1">▶</span>}
                </button>
                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <button onClick={handleSpeed} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-[9px] font-black hover:bg-red-600 transition-colors uppercase">{speed}x</button>
            </div>
        </div>
    );
};

// --- 4. الصفحة الرئيسية والمكونات الرئيسية ---

const EnglishLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [authorFilter, setAuthorFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [audioOnly, setAudioOnly] = useState(false);
    const [sortBy, setSortBy] = useState('alphabetical');
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

    // استخراج الفلاتر الفريدة من البيانات
    const authors = useMemo(() => ["all", ...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.author))].sort(), []);
    const subjects = useMemo(() => ["all", ...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.subject))].sort(), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        let result = ENGLISH_LIBRARY_DATABASE.filter(b => {
            const matchesSearch = b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesAuthor = authorFilter === 'all' || b.author === authorFilter;
            const matchesSubject = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAudio = audioOnly ? !!b.audioId : true;
            return matchesSearch && matchesAuthor && matchesSubject && matchesAudio;
        });

        if (sortBy === 'author') result = [...result].sort((a, b) => a.author.localeCompare(b.author));
        else if (sortBy === 'subject') result = [...result].sort((a, b) => a.subject.localeCompare(b.subject));
        else if (sortBy === 'audio') result = [...result].sort((a, b) => (b.audioId ? 1 : 0) - (a.audioId ? 1 : 0));
        else result = [...result].sort((a, b) => a.title.localeCompare(b.title));

        return result;
    }, [searchTerm, authorFilter, subjectFilter, audioOnly, sortBy]);

    const handleAuthorHover = (e: React.MouseEvent, bio: string | null) => {
        if (!bio || window.innerWidth < 768) { setTooltip(null); return; }
        setTooltip({ text: bio, x: e.clientX, y: e.clientY });
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-40 relative z-10 font-black antialiased">
            
            {/* Glass Bio Tooltip */}
            {tooltip && (
                <div 
                    className="fixed pointer-events-none z-[300] bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/20 p-6 rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-200 max-w-xs"
                    style={{ left: tooltip.x + 20, top: tooltip.y + 20, transform: locale === 'ar' ? 'translateX(-100%)' : 'none' }}
                >
                    <p className="text-[10px] font-black text-red-600 uppercase mb-2 tracking-widest">{t('bioTitle')}</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{tooltip.text}</p>
                </div>
            )}

            {/* العنوان العلوي */}
            <div className="text-center mt-12 mb-20 animate-fade-up">
                <button onClick={() => navigate(-1)} className="absolute start-0 top-0 text-slate-400 hover:text-red-600 flex items-center gap-2 transition-all">
                    <span className="text-2xl">←</span> {t('back')}
                </button>
                <h1 className="text-4xl md:text-[6rem] font-black text-slate-950 dark:text-white tracking-tighter leading-none">{t('pageTitle')}</h1>
                <div className="h-2 w-32 bg-red-600 mx-auto mt-8 rounded-full shadow-lg" />
            </div>

            {/* شريط البحث والفلترة المطور */}
            <div className="sticky top-6 z-50 mb-16 px-2 md:px-0">
                <div className="glass-panel p-4 md:p-6 rounded-[2.5rem] md:rounded-[4rem] bg-white/80 dark:bg-slate-900/80 border-none shadow-2xl flex flex-col gap-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder={t('searchPlaceholder')} 
                            className="w-full p-5 ps-12 bg-white dark:bg-black/40 text-slate-950 dark:text-white rounded-[1.5rem] md:rounded-[2.5rem] outline-none border-2 border-transparent focus:border-red-600 transition-all font-black text-lg"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute start-5 top-1/2 -translate-y-1/2 opacity-40 text-xl">🔍</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="p-3 px-4 rounded-2xl bg-white dark:bg-slate-800 font-black text-[10px] cursor-pointer outline-none border border-white/10 shadow-sm">
                            <option value="all">{t('allAuthors')}</option>
                            {authors.filter(a => a !== "all").map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-3 px-4 rounded-2xl bg-white dark:bg-slate-800 font-black text-[10px] cursor-pointer outline-none border border-white/10 shadow-sm">
                            <option value="all">{t('allSubjects')}</option>
                            {subjects.filter(s => s !== "all").map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 px-4 rounded-2xl bg-white dark:bg-slate-800 font-black text-[10px] cursor-pointer outline-none border border-white/10 shadow-sm">
                            <option value="alphabetical">{t('alphabetical')}</option>
                            <option value="author">{t('authorSort')}</option>
                            <option value="subject">{t('subjectSort')}</option>
                            <option value="audio">{t('audioSort')}</option>
                        </select>
                        <button onClick={() => setAudioOnly(!audioOnly)} className={`p-3 px-4 rounded-2xl font-black text-[10px] transition-all border ${audioOnly ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30' : 'bg-white dark:bg-slate-800 text-slate-500 border-white/10'}`}>🎧 {t('audioOnly')}</button>
                    </div>
                </div>
            </div>

            {/* عرض الكتب */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {filteredBooks.map((book) => (
                    <div key={book.id} onClick={() => setSelectedBook(book)} className="group relative glass-panel rounded-[2.5rem] p-1 cursor-pointer transition-all duration-500 hover:-translate-y-3 h-full animate-fade-up border-none shadow-lg">
                        <div className="relative overflow-hidden rounded-[2.4rem] bg-white/20 dark:bg-slate-900/40 backdrop-blur-md h-full flex flex-col">
                            {/* حافة الهوية */}
                            <div className={`absolute top-0 start-0 w-1.5 h-full ${book.audioId ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-slate-400'}`} />
                            
                            <div className="p-8 relative z-10 flex-grow text-start">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white ${book.audioId ? 'bg-red-600 shadow-md' : 'bg-slate-500 shadow-md'}`}>{book.subject}</span>
                                    {book.audioId && <AudioWaveIcon />}
                                </div>
                                <h2 className="font-black text-xl md:text-2xl text-slate-950 dark:text-white leading-tight mb-4 group-hover:text-red-600 transition-colors line-clamp-2">{book.title}</h2>
                                <div className="flex items-center gap-2 opacity-60"><span className="text-sm">👤</span><p className="text-[10px] font-bold uppercase truncate tracking-widest">{book.author}</p></div>
                            </div>
                            <div className="bg-black/5 dark:bg-white/5 py-5 px-8 border-t border-white/10 mt-auto flex items-center justify-between relative z-10">
                                <div className="text-[8px] font-black opacity-30 uppercase tracking-widest text-red-600">Saqr English</div>
                                <SchoolLogo className="group-hover:rotate-[20deg]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* نافذة تفاصيل الكتاب (Modal) */}
            {selectedBook && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl animate-fade-up" onClick={() => setSelectedBook(null)}>
                    <div className="relative w-full max-w-4xl glass-panel rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedBook(null)} className="absolute top-6 end-6 z-50 p-2 bg-red-600 text-white rounded-full hover:rotate-90 transition-all shadow-xl"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                        
                        <div className="flex-1 p-8 md:p-14 text-start">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter">{selectedBook.title}</h2>
                            <p 
                                onMouseMove={(e) => handleAuthorHover(e, selectedBook.bio)} 
                                onMouseLeave={(e) => handleAuthorHover(e, null)}
                                className="text-xl text-red-600 font-bold mb-8 cursor-help inline-block border-b-2 border-dotted border-red-200"
                            >
                                By {selectedBook.author}
                            </p>
                            <div className="p-6 rounded-[2rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner">
                                <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {t('summaryTitle')}</p>
                                <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed">{selectedBook.summary}</p>
                            </div>
                            {selectedBook.audioId && <SaqrAudioPlayer audioSrc={selectedBook.audioId} t={t} />}
                        </div>

                        <div className="w-full md:w-[320px] bg-slate-950 p-10 flex flex-col justify-center items-center text-white border-s border-white/10 shrink-0">
                            <div className="space-y-12 w-full text-center flex flex-col items-center">
                                {/* الشعار الأبيض الملكي فوق الزر */}
                                <div className="flex flex-col items-center gap-2">
                                    <SchoolLogo forceWhite={true} className="h-16 w-auto mb-2" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">{t('exclusive')}</span>
                                </div>
                                
                                <div className="w-full space-y-4">
                                    <a href={selectedBook.driveLink} target="_blank" rel="noreferrer" className="w-full block bg-red-600 text-white font-black py-5 rounded-2xl hover:bg-red-700 transition-all text-center uppercase tracking-widest shadow-xl shadow-red-600/20">{t('read')}</a>
                                    <button onClick={() => setSelectedBook(null)} className="w-full bg-white/10 text-white border border-white/20 font-black py-4 rounded-xl hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest">{t('close')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes audio-bar { 0%, 100% { height: 4px; } 50% { height: 14px; } }
                .animate-audio-bar-1 { animation: audio-bar 0.6s ease-in-out infinite; }
                .animate-audio-bar-2 { animation: audio-bar 0.8s ease-in-out infinite 0.2s; }
                .animate-audio-bar-3 { animation: audio-bar 0.7s ease-in-out infinite 0.4s; }
                
                /* منع أي ميلان للخطوط نهائياً في هذه الصفحة */
                * { font-style: normal !important; }
            `}</style>
        </div>
    );
};

export default EnglishLibraryInternalPage;
