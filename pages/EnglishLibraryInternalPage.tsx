import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- 1. تعريف واجهة البيانات وقاعدة البيانات ---
interface Book {
    id: number | string;
    title: string;
    author: string;
    subject: string;
    driveLink: string;
    bio: string;
    summary: string;
    publisher?: string;
    audioId?: string;
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
    { id: 39, title: "Wonder", author: "R.J. Palacio", subject: "Drama", driveLink: "https://drive.google.com/file/d/1t5wMyRze_1cVCDfdlUbScSQEgiKlLEAd/view?usp=drive_link", bio: "R.J. Palacio is a famous American author best known for writing the inspiring best-selling novel Wonder.", summary: "Is a heartwarming novel about August Pullman, a young boy born with a facial difference. After being homeschooled for years, he starts the fifth grade at a private middle school. The story follows Auggie’s journey as he tries to fit in and shows how his courage affects his classmates and the whole community. It is a beautiful story that teaches readers about the importance of kindness, friendship, and accepting people for who they are." },
    { id: 40, title: "The Lion King", author: "Disney", subject: "Drama", driveLink: "https://drive.google.com/file/d/19R-gTf1LQ3Ef2NB7zvTQsIPTwvAQ_jzf/view?usp=drive_link", bio: "They are a powerhouse trio of Disney screenwriters who successfully blended Shakespearean tragedy with family-friendly animation to create a global masterpiece.", summary: "After the murder of his royal father, a young lion prince flees into exile only to return years later to reclaim his throne and restore the circle of life." },
    { id: 41, title: "Pocahontas", author: "Disney", subject: "Drama", driveLink: "https://drive.google.com/file/d/1FG1TyHNOCg4Gp2vq9c1ZAXW4w32UGAhZ/view?usp=drive_link", bio: "This talented team of screenwriters specialized in blending historical legends with emotional storytelling, focusing on themes of nature, courage, and cross-cultural understanding.", summary: "A brave Native American woman forms a deep bond with an English explorer and strives to prevent a violent conflict between their two worlds." },
    { id: 42, title: "Brother Bear", author: "Disney", subject: "Drama", driveLink: "https://drive.google.com/file/d/1xBUw3yI6g7fRO7u4FUalY9DHW3yHpOA8/view?usp=drive_link", bio: "This versatile team of screenwriters collaborated to craft a spiritually-driven story that blends ancient folklore with a deep message about empathy and the circle of life.", summary: "An impulsive young Inuit hunter is transformed into a bear to learn the true meaning of brotherhood and love through the eyes of the creature he once hated." },
    { id: 43, title: "Barry’s Buzzy World", author: "Vicky Barker", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1UVPPdnb0omkh79ce0-04vrpcv6Xdnq6L/view?usp=drive_link", bio: "She is an award-winning illustrator and designer of children’s books, known for making educational and environmental topics fun and accessible for young readers.", summary: "A vibrant, educational story that follows a bee named Barry to teach children about the fascinating life of bees and their vital role in our ecosystem." },
    { id: 44, title: "Clam-I-Am!", author: "Tish Rabe", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1tTAcOYOh70mzEgDjdy6vgI5jVmPerhEf/view?usp=drive_link", bio: "She is a prolific children's book author who has written over 170 books, most notably for "The Cat in the Hat's Learning Library," where she specializes in making complex science and nature topics fun for young readers.", summary: "Guided by the Cat in the Hat, this educational story takes readers on a trip to the beach to discover the fascinating lives of clams, crabs, and other sea creatures." }
];

const translations = {
  ar: {
    pageTitle: "المكتبة الإنجليزية",
    searchPlaceholder: "ابحث عن عنوان أو مؤلف...",
    allSubjects: "المواضيع",
    allAuthors: "المؤلفين",
    sortBy: "فرز حسب",
    alphabetical: "أبجدياً",
    authorName: "المؤلف",
    none: "تلقائي",
    noResults: "لا توجد نتائج.",
    close: "إغلاق",
    subjectLabel: "الموضوع",
    audioOnly: "صوتيات فقط",
    audioSort: "الصوتيات أولاً",
    read: "قراءة المحتوى",
    listen: "تلخيص صقر الصوتي",
    back: "العودة",
    ageClassification: "التصنيف العمري",
    bioLabel: "نبذة عن المؤلف:",
    summaryLabel: "نبذة عن الكتاب"
  },
  en: {
    pageTitle: "English Library",
    searchPlaceholder: "Search title or author...",
    allSubjects: "Subjects",
    allAuthors: "Authors",
    sortBy: "Sort By",
    alphabetical: "Alphabetical",
    authorName: "Author",
    none: "Default",
    noResults: "No results found.",
    close: "Close",
    subjectLabel: "Topic",
    audioOnly: "Audio Only",
    audioSort: "Audio First",
    read: "Read Content",
    listen: "Saqr Audio Summary",
    back: "Back",
    ageClassification: "Age Group",
    bioLabel: "Author Bio:",
    summaryLabel: "Book Summary"
  }
};

// --- 2. المكونات الرسومية ---
const ReflectionLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-40" />
    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] animate-[shine_10s_infinite] opacity-30" />
  </div>
);

const AudioWaveIcon = () => (
    <div className="flex gap-[2px] items-end h-3">
        <div className="w-[2px] bg-white/80 animate-audio-bar-1"></div>
        <div className="w-[2px] bg-white/80 animate-audio-bar-2"></div>
        <div className="w-[2px] bg-white/80 animate-audio-bar-3"></div>
        <div className="w-[2px] bg-white/80 animate-audio-bar-2"></div>
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
        <div className="mt-6 animate-fade-up">
            <h4 className="text-xs font-semibold text-[#00732f] uppercase tracking-widest mb-3 flex items-center gap-2">🎧 {t('listen')}</h4>
            <div className="p-4 md:p-5 rounded-[2rem] bg-slate-50/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-sm flex items-center gap-4">
                <audio ref={audioRef} src={audioSrc} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} />
                <button onClick={togglePlay} className="w-12 h-12 shrink-0 rounded-full bg-[#00732f] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all">
                    {isPlaying ? <span className="text-xl">⏸</span> : <span className="text-xl ps-1">▶</span>}
                </button>
                <div className="flex-1">
                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <button onClick={handleSpeed} className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white text-[10px] font-semibold hover:bg-slate-300 transition-colors uppercase min-w-[45px]">{speed}x</button>
            </div>
        </div>
    );
};

// --- 3. Component: BookModal ---
const BookModal: React.FC<{ book: any | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale } = useLanguage();
    const [ageGroup, setAgeGroup] = useState('');
    const [loading, setLoading] = useState(false);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const handleStart = (e: any) => {
        dragging.current = true;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        offset.current = { x: clientX - position.x, y: clientY - position.y };
    };

    const handleMove = (e: any) => {
        if (!dragging.current) return;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        setPosition({ x: clientX - offset.current.x, y: clientY - offset.current.y });
    };

    const handleEnd = () => dragging.current = false;

    useEffect(() => {
        if (book) {
            window.addEventListener('mousemove', handleMove, { passive: false });
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [book]);

    useEffect(() => {
        if (!book) { setPosition({ x: 0, y: 0 }); return; }
        setLoading(true);
        const fetchAgeGroup = async () => {
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{
                            role: 'system',
                            content: `Analyze the book titled "${book.title}". Return JSON ONLY: {"ageGroup": "Children or Teens or Adults"}`
                        }]
                    })
                });
                const data = await response.json();
                setAgeGroup(JSON.parse(data.reply.replace(/```json|```/g, '').trim()).ageGroup);
            } catch (err) {
                let fallbackAge = "Adults";
                if (book.subject.toLowerCase().includes("children")) fallbackAge = "Children";
                else if (book.subject.toLowerCase().includes("fantasy") || book.subject.toLowerCase().includes("adventure")) fallbackAge = "Teens & Adults";
                setAgeGroup(fallbackAge);
            } finally { setLoading(false); }
        };
        fetchAgeGroup();
    }, [book]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60 animate-fade-in" onClick={onClose}>
            <div 
                className="relative w-full max-w-3xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] transition-transform duration-75 ease-out select-none"
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                onClick={(e) => e.stopPropagation()}
            >
                <div 
                    onMouseDown={handleStart} 
                    onTouchStart={handleStart}
                    className="absolute top-0 left-0 right-0 h-16 cursor-grab active:cursor-grabbing z-40 bg-transparent"
                    style={{ touchAction: 'none' }}
                    title="Drag to move"
                />

                <button onClick={onClose} className="absolute top-4 end-4 z-50 p-2 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-red-600 hover:text-white rounded-full transition-all shadow-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 p-8 overflow-y-auto no-scrollbar text-start flex flex-col mt-4 md:mt-0">
                    <h2 className="text-2xl md:text-3xl text-slate-950 dark:text-white font-semibold leading-tight mb-2" dir="ltr">{book.title}</h2>
                    
                    <div className="relative group/author inline-block mb-6 w-fit z-50">
                        <p className="text-base text-[#00732f] font-medium cursor-help border-b border-dashed border-[#00732f]/50 pb-0.5">By {book.author}</p>
                        <div className="absolute top-full mt-2 start-0 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl opacity-0 invisible group-hover/author:opacity-100 group-hover/author:visible transition-all shadow-xl pointer-events-none">
                            <strong className="block mb-1 text-red-400 font-medium">{t('bioLabel')}</strong>
                            <span className="font-normal">{book.bio}</span>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50/50 dark:bg-white/5 p-6 rounded-[2rem] border border-white/20 shadow-inner text-start flex-grow">
                        <div className="flex items-center gap-2 mb-3">
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">{t('summaryLabel')}</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-sm md:text-base font-normal leading-relaxed">
                           {book.summary}
                        </p>
                    </div>

                    {book.audioId && <SaqrAudioPlayer audioSrc={book.audioId} t={t} />}
                </div>

                <div className="w-full md:w-[280px] bg-slate-100/50 dark:bg-black/20 p-8 flex flex-col justify-center items-center border-t md:border-t-0 md:border-s border-slate-200 dark:border-white/10 shrink-0 relative z-30">
                    <div className="w-full text-center space-y-6">
                        <div className="bg-white/60 dark:bg-slate-800/60 p-5 rounded-2xl border border-white/30 shadow-sm">
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">{t('subjectLabel')}</p>
                            <p className="text-lg font-medium text-slate-900 dark:text-white truncate">{book.subject}</p>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm">
                            <p className="text-[10px] font-medium text-red-400 uppercase tracking-widest mb-1">{t('ageClassification')}</p>
                            <p className="text-xl font-semibold text-red-600 truncate">{loading ? '...' : (ageGroup || 'General')}</p>
                        </div>

                        <div className="space-y-3 pt-6">
                            <a href={book.driveLink} target="_blank" rel="noreferrer" className="w-full block bg-[#00732f] text-white font-medium py-3.5 rounded-2xl hover:bg-green-700 transition-all text-center uppercase tracking-widest text-sm shadow-md shadow-green-900/20">{t('read')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. Component: BookCard ---
const BookCard = React.memo(({ book, onClick, t }: { book: any; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";
  const hasAudio = !!book.audioId;

  const themeColor = (hasAudio || isAi) ? 'bg-red-600' : 'bg-[#00732f]';
  const borderColor = hasAudio ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/30 dark:border-white/10';

  return (
    <div onClick={onClick} className="group relative glass-panel rounded-[2rem] p-0.5 cursor-pointer transition-all duration-500 hover:-translate-y-2 h-full active:scale-[0.98] shadow-sm hover:shadow-xl">
      <div className={`relative overflow-hidden rounded-[1.9rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl h-full flex flex-col border transition-all duration-500 ${borderColor}`}>
        
        <ReflectionLayer />
        
        <div className={`absolute top-0 start-0 w-1.5 h-full z-30 transition-all duration-500 ${themeColor}`} />

        <div className="p-6 relative z-10 flex-grow text-start flex flex-col">
          <div className="flex justify-between items-start mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border border-white/20 shadow-sm text-white ${themeColor}`}>
                 {book.subject}
              </span>
              {hasAudio && (
                <div className="bg-red-600 p-1.5 rounded-full shadow-md animate-pulse">
                  <AudioWaveIcon />
                </div>
              )}
          </div>
          
          <h3 className={`font-semibold text-lg text-slate-900 dark:text-white leading-tight mb-3 transition-colors line-clamp-3 ${hasAudio ? 'group-hover:text-red-600' : 'group-hover:text-[#00732f]'}`} dir="ltr">
              {book.title}
          </h3>
          
          <div className="mt-auto pt-2">
              <div className="relative group/author inline-block" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2 opacity-80 cursor-help border-b border-transparent hover:border-slate-400 pb-0.5 transition-all">
                      <span className="text-sm">👤</span>
                      <p className="text-[12px] font-medium truncate uppercase tracking-wide">{book.author}</p>
                  </div>
                  <div className="absolute bottom-full mb-2 start-0 w-48 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-xl opacity-0 invisible group-hover/author:opacity-100 group-hover/author:visible transition-all duration-300 shadow-xl z-50 pointer-events-none font-normal">
                      <strong className="block text-red-400 mb-1 font-medium">{t('bioLabel')}</strong>
                      {book.bio}
                      <div className="absolute top-full start-4 border-4 border-transparent border-t-slate-900" />
                  </div>
              </div>
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-black/20 py-4 px-6 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-end relative z-10 backdrop-blur-md">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${hasAudio ? 'group-hover:border-red-600 group-hover:bg-red-50 text-red-600' : 'group-hover:border-[#00732f] group-hover:bg-green-50 text-slate-400'}`}>
              <span className="text-[10px]">➔</span>
            </div>
        </div>
      </div>
    </div>
  );
});

// --- 5. Main Component: EnglishLibraryInternalPage ---
const EnglishLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const t = (key: keyof typeof translations.en) => translations[locale][key] as string;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [sortBy, setSortBy] = useState('alphabetical'); 
    const [audioOnly, setAudioOnly] = useState(false);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [visibleCount, setVisibleCount] = useState(16);

    const [showSearch, setShowSearch] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setShowSearch(false);
            } else {
                setShowSearch(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filters = useMemo(() => ({
        subjects: [...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.subject))].filter(s => s !== "Unknown").sort(),
        authors: [...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.author))].filter(a => a !== 'Unknown Author').sort(),
    }), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        let result = ENGLISH_LIBRARY_DATABASE.filter(b => {
            const matchesSearch = b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
            const matchesSubject = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuthor = authorFilter === 'all' || b.author === authorFilter;
            const matchesAudio = audioOnly ? !!b.audioId : true;
            return matchesSearch && matchesSubject && matchesAuthor && matchesAudio;
        });

        if (sortBy === 'author') result = [...result].sort((a, b) => a.author.localeCompare(b.author, locale));
        else if (sortBy === 'subject') result = [...result].sort((a, b) => a.subject.localeCompare(b.subject, locale));
        else if (sortBy === 'audio') result = [...result].sort((a, b) => (b.audioId ? 1 : 0) - (a.audioId ? 1 : 0));
        else result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale));
        return result;
    }, [searchTerm, subjectFilter, authorFilter, audioOnly, sortBy, locale]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 md:px-6 pb-20 relative z-10 antialiased overflow-x-hidden">
            
            <div className="text-center mt-12 mb-16 animate-fade-up">
                <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-600 font-medium flex items-center gap-2 transition-all"><span className="text-xl">←</span> {t('back')}</button>
                <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">{t('pageTitle')}</h1>
                <div className="flex justify-center gap-2 mt-4"><div className="w-12 h-1 bg-red-600 rounded-full" /><div className="w-12 h-1 bg-[#00732f] rounded-full" /></div>
            </div>

            <div className={`sticky z-[100] transition-all duration-500 ease-in-out ${showSearch ? 'top-6 opacity-100 translate-y-0' : '-top-40 opacity-0 -translate-y-full'} mb-12`}>
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-lg rounded-[2rem] p-4 md:p-5">
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <input 
                              type="text" 
                              placeholder={t('searchPlaceholder')} 
                              className="w-full p-4 ps-12 bg-white/60 dark:bg-black/40 text-slate-900 dark:text-white border-2 border-transparent focus:border-red-500 rounded-xl outline-none transition-all text-base font-medium shadow-inner" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <svg className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-sm outline-none cursor-pointer hover:bg-white transition-all text-slate-700 dark:text-slate-200">
                                <option value="all">{t('allAuthors')}</option>
                                {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-sm outline-none cursor-pointer hover:bg-white transition-all text-slate-700 dark:text-slate-200">
                                <option value="all">{t('allSubjects')}</option>
                                {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-sm outline-none cursor-pointer hover:bg-white transition-all text-slate-700 dark:text-slate-200">
                                <option value="alphabetical">{t('alphabetical')}</option>
                                <option value="audio">{t('audioSort')}</option>
                            </select>
                            <button onClick={() => setAudioOnly(!audioOnly)} className={`p-3 rounded-lg font-medium text-sm transition-all shadow-sm ${audioOnly ? 'bg-red-600 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                                🎧 {t('audioOnly')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            {filteredBooks.length === 0 && (
                <div className="py-20 text-center opacity-40">
                    <span className="text-5xl mb-4 block">📚</span>
                    <p className="text-xl font-medium text-slate-500">{t('noResults')}</p>
                </div>
            )}

            {filteredBooks.length > visibleCount && (
                <div className="mt-16 text-center">
                    <button onClick={() => setVisibleCount(v => v + 16)} className="bg-[#00732f] text-white px-10 py-3.5 rounded-full font-medium text-base hover:bg-red-600 hover:scale-105 transition-all shadow-lg active:scale-95">
                        EXPLORE MORE BOOKS
                    </button>
                </div>
            )}

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600&display=swap');
                * { font-family: 'Cairo', sans-serif !important; font-style: normal !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes zoom-in-custom {
                  0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                  100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-zoom-in { animation: zoom-in-custom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
                
                @keyframes audio-bar { 0%, 100% { height: 4px; } 50% { height: 12px; } }
                .animate-audio-bar-1 { animation: audio-bar 0.6s ease-in-out infinite; }
                .animate-audio-bar-2 { animation: audio-bar 0.8s ease-in-out infinite 0.2s; }
                .animate-audio-bar-3 { animation: audio-bar 0.7s ease-in-out infinite 0.4s; }
            `}</style>
        </div>
    );
};

export default EnglishLibraryInternalPage;
