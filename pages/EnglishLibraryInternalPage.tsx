import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';
import { trackActivity } from '../src/utils/tracker';

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
    { id: 44, title: "Clam-I-Am!", author: "Tish Rabe", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1tTAcOYOh70mzEgDjdy6vgI5jVmPerhEf/view?usp=drive_link", bio: "She is a prolific children's book author who has written over 170 books, most notably for The Cat in the Hat's Learning Library, where she specializes in making complex science and nature topics fun for young readers.", summary: "Guided by the Cat in the Hat, this educational story takes readers on a trip to the beach to discover the fascinating lives of clams, crabs, and other sea creatures." },
    { id: 45, title: "The Sand Witch", author: "Jon Jensen", subject: "Fantasy", driveLink: "https://drive.google.com/file/d/1hm7f4MZ952FHzkSpYgsz81yu15wbbwoT/view?usp=drive_link", bio: "A creative author and illustrator recognized for his ability to weave clever wordplay and imaginative scenarios into charming children's stories that celebrate creativity and the outdoors.", summary: "A young girl's day at the beach turns into a whimsical, pun-filled adventure after she decides to build a witch out of sand instead of a traditional sandcastle." }
];

const translations = {
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
  },
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
  }
};

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const UserIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SearchSvg = () => (
  <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseSvg = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const RobotSvg = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" strokeWidth={4} />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth={4} />
  </svg>
);

const HeadphonesIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
  </svg>
);

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
);
const PauseIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
);

// --- مشغل الصوت ---
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
        <div className="mt-8 animate-fade-in-up w-full max-w-lg mx-auto">
            <h4 className="text-xs font-black text-sky-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <HeadphonesIcon /> {t('listen')}
            </h4>
            <div className="p-4 md:p-5 rounded-[2rem] bg-sky-50 dark:bg-slate-800 border-4 border-sky-200 dark:border-sky-900/50 shadow-sm flex items-center gap-4">
                <audio ref={audioRef} src={audioSrc} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} />
                <button onClick={togglePlay} className="w-12 h-12 shrink-0 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform">
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div className="flex-1">
                    <div className="h-3 w-full bg-sky-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-sky-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <button onClick={handleSpeed} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 text-[10px] font-black hover:bg-sky-100 transition-colors uppercase min-w-[45px] shadow-sm border-2 border-sky-200 dark:border-sky-900">{speed}x</button>
            </div>
        </div>
    );
};

// --- 3. Component: BookModal ---
const BookModal: React.FC<{ book: any | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const [ageGroup, setAgeGroup] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!book) return;
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="relative w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-[3rem] border-8 border-sky-400 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300 cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 end-4 z-50 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-transform shadow-lg active:scale-90 active:translate-y-1">
                    <CloseSvg />
                </button>

                <div className="flex-1 p-8 overflow-y-auto scrollbar-thin text-start flex flex-col mt-4 md:mt-0">
                    <h2 className="text-3xl md:text-4xl text-slate-900 dark:text-white font-black leading-tight mb-4" dir="ltr">{book.title}</h2>
                    
                    <div className="relative group/author inline-flex items-center gap-2 mb-8 bg-sky-50 dark:bg-slate-700 w-fit px-4 py-2 rounded-full border-2 border-sky-200 dark:border-slate-600 cursor-help">
                        <UserIcon />
                        <p className="text-base text-sky-600 dark:text-sky-400 font-bold">{book.author}</p>
                        <div className="absolute top-full mt-2 start-0 w-64 p-4 bg-slate-900 text-white text-xs rounded-2xl opacity-0 invisible group-hover/author:opacity-100 group-hover/author:visible transition-all shadow-xl z-50 font-medium leading-relaxed">
                            <strong className="block mb-2 text-sky-400 font-black uppercase">{t('bioLabel')}</strong>
                            {book.bio}
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border-4 border-slate-200 dark:border-slate-700 shadow-inner text-start flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                           <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{t('summaryLabel')}</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-base md:text-lg font-bold leading-relaxed">
                           {book.summary}
                        </p>
                    </div>

                    {book.audioId && <SaqrAudioPlayer audioSrc={book.audioId} t={t} />}
                </div>

                <div className="w-full md:w-[280px] bg-slate-100 dark:bg-slate-900/50 p-8 flex flex-col justify-center items-center border-t-4 md:border-t-0 md:border-s-4 border-slate-200 dark:border-slate-700 shrink-0">
                    <div className="w-full text-center space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border-4 border-slate-200 dark:border-slate-600 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('subjectLabel')}</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white truncate">{book.subject}</p>
                        </div>
                        
                        <div className="bg-sky-50 dark:bg-slate-800 p-5 rounded-[2rem] border-4 border-sky-200 dark:border-slate-600 shadow-sm">
                            <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">{t('ageClassification')}</p>
                            <p className="text-2xl font-black text-sky-600 truncate">{loading ? '...' : (ageGroup || 'General')}</p>
                        </div>

                        <div className="pt-6">
                            <a href={book.driveLink} target="_blank" rel="noreferrer" className="w-full block bg-emerald-500 text-white font-black py-4 rounded-[2rem] hover:-translate-y-1 active:translate-y-2 border-b-8 border-emerald-700 active:border-b-0 transition-all text-center uppercase tracking-widest text-base shadow-md">
                                {t('read')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. Component: BookCard (Realistic Book Design) ---
const BookCard = React.memo(({ book, onClick, t }: { book: any; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";
  const hasAudio = !!book.audioId;

  // توليد لون عشوائي للغلاف بناءً على الحرف الأول
  const colors = [
    'from-sky-400 to-sky-600 border-sky-700',
    'from-emerald-400 to-emerald-600 border-emerald-700',
    'from-rose-400 to-rose-600 border-rose-700',
    'from-amber-400 to-amber-500 border-amber-600',
    'from-purple-400 to-purple-600 border-purple-700'
  ];
  const colorClass = colors[book.title.length % colors.length];

  return (
    <div onClick={onClick} className="relative group cursor-pointer w-full h-[320px] perspective-1000 flex items-end justify-center pb-2">
      {/* تصميم الكتاب الواقعي */}
      <div className={`book-volume w-[90%] h-full relative transform-style-3d transition-transform duration-500 group-hover:rotate-y-[-15deg] group-hover:-translate-y-4 group-hover:scale-105 rounded-r-2xl border-l-[16px] shadow-[-10px_10px_20px_rgba(0,0,0,0.15)] bg-gradient-to-br ${colorClass}`}>
        
        {/* الغلاف الأمامي */}
        <div className="absolute inset-0 flex flex-col p-5 overflow-hidden rounded-r-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/20 pointer-events-none"></div>

          <div className="mb-auto mt-2 flex justify-between items-start">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30 shadow-sm max-w-[70%]`}>
               {isAi && <RobotSvg />}
               <span className="truncate">{isAi ? t('aiSubject') : book.subject}</span>
            </span>
            {hasAudio && (
              <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full border border-white/30 text-white animate-pulse">
                <HeadphonesIcon />
              </div>
            )}
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h3 className="font-black text-lg md:text-xl text-white leading-snug drop-shadow-md line-clamp-3 mb-3" dir="ltr">
                {book.title}
            </h3>
            <div className="flex items-center gap-2 text-white/80 mt-auto mb-2">
                <UserIcon />
                <p className="text-xs font-bold truncate uppercase">{book.author}</p>
            </div>
          </div>
        </div>

        {/* كعب الكتاب */}
        <div className="absolute top-0 left-[-16px] w-[16px] h-full bg-black/30 origin-right transform rotate-y-90 flex flex-col items-center justify-between py-6">
           <div className="w-full h-1 bg-white/30"></div>
           <div className="text-[10px] text-white/50 font-black -rotate-90 tracking-widest">{book.publisher?.substring(0, 10)}</div>
           <div className="w-full h-1 bg-white/30"></div>
        </div>

        {/* صفحات الكتاب */}
        <div className="absolute top-2 right-[-6px] w-[6px] h-[calc(100%-4px)] bg-[#fdfbf7] origin-left transform rotate-y-[-90deg] rounded-r-sm shadow-inner border-y border-r border-[#e2e8f0]">
           <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,#e2e8f0_2px,#e2e8f0_3px)] opacity-50"></div>
        </div>
      </div>
    </div>
  );
});

// --- 5. Main Component: EnglishLibraryInternalPage ---
const EnglishLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const t = (key: keyof typeof translations.en) => translations[locale as keyof typeof translations]?.[key] as string;
    
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
        <div dir={dir} className="w-full min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300">
            
            {/* 🌟 تصميم طفولي للخلفية */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-400/20 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-amber-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 relative z-10 antialiased overflow-x-hidden">
                
                {/* العنوان والزر */}
                <div className="text-center mt-12 mb-16 relative">
                    <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-slate-200 hover:-translate-x-1 active:translate-y-1 border-b-4 border-slate-300 dark:border-slate-700 active:border-b-0 transition-all flex items-center gap-2 shadow-sm">
                        <span className="text-xl leading-none rtl:rotate-180">←</span> {t('back')}
                    </button>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tight uppercase">{t('pageTitle')}</h1>
                    <div className="flex justify-center gap-3 mt-6">
                        <div className="w-16 h-2 bg-sky-500 rounded-full" />
                        <div className="w-8 h-2 bg-amber-400 rounded-full" />
                    </div>
                </div>

                {/* شريط البحث المبهج */}
                <div className={`sticky z-[100] transition-all duration-500 ease-in-out ${showSearch ? 'top-4 md:top-6 opacity-100 translate-y-0' : '-top-40 opacity-0 -translate-y-full'} mb-16`}>
                    <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-[3rem] border-4 border-sky-300 dark:border-sky-600 shadow-xl max-w-5xl mx-auto">
                        <div className="flex flex-col gap-5">
                            <div className="relative group">
                                <input 
                                  type="text" 
                                  placeholder={t('searchPlaceholder')} 
                                  className="w-full p-4 md:p-5 ps-14 md:ps-16 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-4 border-slate-200 dark:border-slate-700 focus:border-sky-400 rounded-[2rem] outline-none transition-colors text-base md:text-lg font-black shadow-inner" 
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                <div className="absolute start-5 md:start-6 top-1/2 -translate-y-1/2 text-sky-500">
                                    <SearchSvg />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-sky-400 transition-colors outline-none focus:border-sky-500 text-slate-700 dark:text-slate-200">
                                    <option value="all">{t('allAuthors')}</option>
                                    {filters.authors.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-sky-400 transition-colors outline-none focus:border-sky-500 text-slate-700 dark:text-slate-200">
                                    <option value="all">{t('allSubjects')}</option>
                                    {filters.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-black text-xs md:text-sm cursor-pointer appearance-none text-center hover:border-sky-400 transition-colors outline-none focus:border-sky-500 text-slate-700 dark:text-slate-200">
                                    <option value="alphabetical">{t('alphabetical')}</option>
                                    <option value="audio">{t('audioSort')}</option>
                                </select>
                                <button onClick={() => setAudioOnly(!audioOnly)} className={`w-full p-3 md:p-4 rounded-2xl font-black text-xs md:text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 ${audioOnly ? 'bg-sky-500 text-white border-sky-700 animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 border-2'}`}>
                                    <HeadphonesIcon /> {t('audioOnly')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* عرض الكتب كأرفف مكتبة حقيقية */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-4 md:gap-x-8 px-2 md:px-8">
                    {filteredBooks.slice(0, visibleCount).map((book) => (
                        <div key={book.id} className="relative">
                           <BookCard 
                               book={book} 
                               t={t} 
                               onClick={() => {
                                   setSelectedBook(book); 
                                   trackActivity('digital', book.title); 
                               }} 
                           />
                           {/* خط الرف الخشبي أسفل الكتاب */}
                           <div className="absolute -bottom-2 w-[110%] -left-[5%] h-4 bg-[#8B4513] rounded-sm shadow-md border-b-4 border-[#5C2E0B] -z-10"></div>
                        </div>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="py-20 text-center text-slate-400 dark:text-slate-600 flex flex-col items-center">
                        <svg className="w-24 h-24 mb-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-3xl font-black">{t('noResults')}</p>
                    </div>
                )}

                {filteredBooks.length > visibleCount && (
                    <div className="mt-20 text-center">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 16)} 
                            className="bg-sky-500 text-white px-10 py-4 rounded-full font-black text-lg md:text-xl border-b-8 border-sky-700 hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-md uppercase tracking-widest"
                        >
                            EXPLORE MORE
                        </button>
                    </div>
                )}

                <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                * { font-family: 'Cairo', sans-serif !important; }
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb { background: #475569; }
                
                /* إعدادات الشكل ثلاثي الأبعاد للكتاب */
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-90 { transform: rotateY(90deg); }
                .-rotate-y-15 { transform: rotateY(-15deg); }
                
                @keyframes blob {
                  0% { transform: translate(0px, 0px) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                  100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
                
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default EnglishLibraryInternalPage;
