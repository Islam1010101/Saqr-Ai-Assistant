import React, { useState, useMemo, useRef } from 'react';
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
    audioId?: string; // حقل لدعم التمييز الصوتي
}

export const ENGLISH_LIBRARY_DATABASE: Book[] = [
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
    { id: 27, title: "Atomic Habits", author: "James Clear", subject: "Self-Help", driveLink: "https://drive.google.com/file/d/1Qex8tUra71DBS7m9StdFiyPyijrW-jZ2/view", bio: "World-leading expert on habit formation and continuous improvement.", summary: "A practical guide to building good habits and breaking bad ones with tiny changes." },
    { id: 28, title: "The Power of Habit", author: "Charles Duhigg", subject: "Self-Help", driveLink: "https://drive.google.com/file/d/1WMBTKR1yGi9XYBcmybboSz2lbmCOsETj/view", bio: "Pulitzer Prize-winning journalist and expert on organizational psychology.", summary: "Exploring why habits exist and how they can be changed in life and business." },
    { id: 29, title: "Deep Work", author: "Cal Newport", subject: "Self-Help", driveLink: "https://drive.google.com/file/d/1uHrix_Yw67UpVP-WWWq3tmbKWsONyScZ/view", bio: "Academic and author focused on the intersection of digital tech and culture.", summary: "Rules for focused success in a distracted world through deep concentration." },
    { id: 30, title: "How To Win Friends And Influence People", author: "Dale Carnegie", subject: "Self-Help", driveLink: "https://drive.google.com/file/d/17PI6rWut3Uiu9ZCPxWQmbTSS_Wx19dC_/view", bio: "Pioneer in the fields of self-improvement and interpersonal skills.", summary: "The classic guide on how to communicate effectively and build relationships." },
    { id: 31, title: "Mindset", author: "Carol S. Dweck", subject: "Self-Help", driveLink: "https://drive.google.com/file/d/1I3Qw2AiQoRmwMD4wekClIY1Xw78nYGqu/view", bio: "Stanford psychologist who discovered the power of the growth mindset.", summary: "A look at how our beliefs about our abilities dictate our success." },
    { id: 32, title: "The 5 Second Rule", author: "Mel Robbins", subject: "Self-Help", driveLink: "https://drive.google.com/file/d/1TywPMLWwsIJn56Ip6cyiE_X7j9ahj6hR/view", bio: "One of the world's most booked motivational speakers and TV hosts.", summary: "A simple tool to stop hesitating and start taking action in 5 seconds." },
    { id: 33, title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", subject: "Self-Help", driveLink: "https://drive.google.com/file/d/14KC3CukTeGBiExQOygOi9-4ES5MgYCXV/view", bio: "A world-renowned authority on leadership and family dynamics.", summary: "Seven principles for solving personal and professional problems." },
    { id: 34, title: "Who Will Cry When You Die?", author: "Robin Sharma", subject: "Self-Help", driveLink: "https://drive.google.com/file/d/1j9pgm1Kug2IAZ5JdXzG2pb6fCwvSBPYf/view", bio: "He is a Helper and a Writer.", summary: "Live your life so well that when you are gone, people will miss you and remember you with love." },
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
        read: "قراءة الكتاب",
        listen: "استمع للملخص",
        summaryTitle: "ملخص الذكاء الاصطناعي",
        back: "العودة",
        close: "إغلاق",
        bioTitle: "نبذة عن المؤلف",
        exclusive: "رقمياً من",
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
        read: "Read Book",
        listen: "Play Summary",
        summaryTitle: "AI Summary",
        back: "Back",
        close: "Close",
        bioTitle: "About Author",
        exclusive: "Digital by",
        speed: "Speed"
    }
};

// --- 3. المكونات الفرعية (Sub-components) ---

const SchoolLogo = ({ forceWhite = false, className = "" }: { forceWhite?: boolean, className?: string }) => (
    <img 
        src="/school-logo.png" 
        alt="School Logo" 
        className={`h-8 md:h-12 w-auto transition-all duration-500 ${forceWhite ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'} ${className}`}
    />
);

const AudioWaveIcon = () => (
    <div className="flex gap-[3px] items-end h-4">
        <div className="w-1 bg-red-500 animate-audio-bar-1 rounded-t-sm"></div>
        <div className="w-1 bg-red-500 animate-audio-bar-2 rounded-t-sm"></div>
        <div className="w-1 bg-red-500 animate-audio-bar-3 rounded-t-sm"></div>
        <div className="w-1 bg-red-500 animate-audio-bar-2 rounded-t-sm"></div>
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
        <div className="mt-8 animate-fade-in-up">
            <h4 className="text-xs font-bold text-red-600 dark:text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-lg">🎧</span> {t('listen')}
            </h4>
            <div className="p-4 md:p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
                <audio 
                    ref={audioRef} 
                    src={audioSrc} 
                    onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} 
                    onEnded={() => setIsPlaying(false)} 
                />
                
                <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all shrink-0 active:scale-95">
                    {isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    ) : (
                        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" strokeWidth="2" strokeLinejoin="round"/></svg>
                    )}
                </button>
                
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${progress}%` }} />
                </div>
                
                <button onClick={handleSpeed} className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-red-100 hover:text-red-600 dark:hover:bg-slate-700 transition-colors shrink-0">
                    {speed}x
                </button>
            </div>
        </div>
    );
};

// --- 4. الصفحة الرئيسية والمكونات الرئيسية ---

const EnglishLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [authorFilter, setAuthorFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [audioOnly, setAudioOnly] = useState(false);
    const [sortBy, setSortBy] = useState('alphabetical');
    const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

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
        <div dir={dir} className="w-full min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300 py-6 md:py-10 px-4 md:px-6">
            
            {/* الخلفية الديناميكية الموحدة */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/30 rounded-full blur-[120px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-green-600/30 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col animate-fade-in-up pb-20 z-10">
                
                {/* Tooltip */}
                {tooltip && (
                    <div 
                        className="fixed pointer-events-none z-[300] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xl animate-zoom-in max-w-xs"
                        style={{ left: tooltip.x + 15, top: tooltip.y + 15, transform: isAr ? 'translateX(-100%)' : 'none' }}
                    >
                        <p className="text-[10px] font-bold text-red-500 uppercase mb-1 tracking-widest">{t('bioTitle')}</p>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{tooltip.text}</p>
                    </div>
                )}

                {/* الهيدر */}
                <div className="relative text-center mb-10 md:mb-16">
                    <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 flex items-center gap-2 transition-colors font-bold text-sm md:text-base">
                        <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        {t('back')}
                    </button>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight inline-block relative">
                        {t('pageTitle')}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                    </h1>
                </div>

                {/* شريط البحث والفلاتر (Sticky) */}
                <div className="sticky top-4 md:top-6 z-[100] mb-8 md:mb-12">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 transition-all">
                        <div className="flex flex-col gap-4">
                            
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder={t('searchPlaceholder')} 
                                    className="w-full py-4 px-6 ps-12 md:ps-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500 rounded-2xl outline-none transition-colors text-slate-900 dark:text-white font-medium text-sm md:text-base placeholder-slate-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                <svg className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                                <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer outline-none focus:border-red-500 transition-colors appearance-none text-center">
                                    <option value="all">{t('allAuthors')}</option>
                                    {authors.filter(a => a !== "all").map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer outline-none focus:border-red-500 transition-colors appearance-none text-center">
                                    <option value="all">{t('allSubjects')}</option>
                                    {subjects.filter(s => s !== "all").map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer outline-none focus:border-red-500 transition-colors appearance-none text-center lg:col-span-2">
                                    <option value="alphabetical">{t('alphabetical')}</option>
                                    <option value="author">{t('authorSort')}</option>
                                    <option value="subject">{t('subjectSort')}</option>
                                    <option value="audio">{t('audioSort')}</option>
                                </select>
                                <button 
                                    onClick={() => setAudioOnly(!audioOnly)} 
                                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-colors border col-span-2 lg:col-span-1 flex justify-center items-center gap-2 ${audioOnly ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                >
                                    🎧 {t('audioOnly')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* شبكة الكتب */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {filteredBooks.map((book) => (
                        <div key={book.id} onClick={() => setSelectedBook(book)} className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-red-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer h-full relative">
                            
                            <div className={`absolute top-0 start-0 w-1.5 h-full transition-colors duration-300 ${book.audioId ? 'bg-red-500' : 'bg-blue-500'}`}></div>

                            <div className="p-6 md:p-8 flex-1 flex flex-col text-start">
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
                                        ${book.audioId ? 'bg-red-50 dark:bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/20' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20'}`}>
                                        {book.subject}
                                    </span>
                                    {book.audioId && <AudioWaveIcon />}
                                </div>
                                
                                <h3 className="font-black text-lg md:text-xl text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2" dir="ltr">
                                    {book.title}
                                </h3>
                                
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-auto truncate flex items-center gap-2">
                                    <span className="text-lg">👤</span> {book.author}
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-700">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Digital Index</span>
                                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-colors">
                                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl font-bold text-slate-500 dark:text-slate-400">No books found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* نافذة تفاصيل الكتاب (Modal) */}
            {selectedBook && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40 dark:bg-black/60 animate-fade-in" onClick={() => setSelectedBook(null)}>
                    <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-slate-200 dark:border-slate-700 animate-zoom-in" onClick={(e) => e.stopPropagation()}>
                        
                        <button onClick={() => setSelectedBook(null)} className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-50 p-2 md:p-3 bg-slate-100 hover:bg-red-100 dark:bg-slate-700 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 transition-colors rounded-full`}>
                            <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto no-scrollbar flex flex-col">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-2" dir="ltr">{selectedBook.title}</h2>
                            <p 
                                onMouseMove={(e) => handleAuthorHover(e, selectedBook.bio)} 
                                onMouseLeave={(e) => handleAuthorHover(e, null)}
                                className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium mb-8 cursor-help inline-block border-b border-dashed border-slate-300 dark:border-slate-600 w-max pb-1"
                            >
                                By {selectedBook.author}
                            </p>
                            
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 flex-1">
                                <p className="text-xs text-red-600 dark:text-red-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="text-base">✨</span> {t('summaryTitle')}
                                </p>
                                <p className="text-slate-800 dark:text-slate-200 text-base md:text-lg font-medium leading-relaxed">
                                    {selectedBook.summary}
                                </p>
                            </div>

                            {selectedBook.audioId && <SaqrAudioPlayer audioSrc={selectedBook.audioId} t={t} />}
                        </div>

                        <div className="w-full md:w-72 lg:w-80 bg-slate-50 dark:bg-slate-900 p-6 md:p-10 flex flex-col justify-center items-center border-t md:border-t-0 md:border-s border-slate-200 dark:border-slate-700 shrink-0">
                            <div className="w-full text-center flex flex-col items-center gap-2 mb-8">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('exclusive')}</span>
                                <SchoolLogo className="h-12 w-auto mt-2" />
                            </div>
                            
                            <div className="w-full flex flex-col gap-4">
                                <a href={selectedBook.driveLink} target="_blank" rel="noreferrer" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full transition-colors text-center text-sm md:text-base uppercase tracking-widest shadow-md hover:shadow-lg flex justify-center items-center gap-2">
                                    {t('read')}
                                </a>
                                <button onClick={() => setSelectedBook(null)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm uppercase tracking-widest">
                                    {t('close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes audio-bar { 0%, 100% { height: 4px; } 50% { height: 16px; } }
                .animate-audio-bar-1 { animation: audio-bar 0.8s ease-in-out infinite; }
                .animate-audio-bar-2 { animation: audio-bar 1s ease-in-out infinite 0.2s; }
                .animate-audio-bar-3 { animation: audio-bar 0.9s ease-in-out infinite 0.4s; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
                
                @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
                .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default EnglishLibraryInternalPage;
