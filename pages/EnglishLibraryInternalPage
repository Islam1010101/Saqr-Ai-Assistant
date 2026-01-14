import React, { useState, useMemo } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- English Library Database (Full List: 26 Titles) ---
const ENGLISH_LIBRARY_DATABASE = [
  // --- Original Titles ---
  { id: 1, title: "Me Before You", author: "Jojo Moyes", subject: "Drama", driveLink: "https://drive.google.com/file/d/1eDq03Myjh56IRtLx1LIRJHa39PLnMvgf/view?usp=drive_link", bio: "A popular British romance novelist known for her emotionally resonant stories that explore love and life-altering decisions.", summary: "A heart-wrenching story of a young woman who becomes a caregiver for a wealthy man, leading to an unexpected bond." },
  { id: 2, title: "The Great Gatsby", author: "Scott Fitzgerald", subject: "Drama", driveLink: "https://drive.google.com/file/d/1NjrAuiFno2Aa-z6WYkRI17oD2Hxkvs-M/view?usp=drive_link", bio: "A legendary American novelist of the Jazz Age, famous for his critiques of the American Dream and high society.", summary: "Set in the 1920s, this masterpiece follows Jay Gatsby's obsessive pursuit of wealth and the woman he loves." },
  { id: 3, title: "the kite runner", author: "KHALED HOSSEINI", subject: "Drama", driveLink: "https://drive.google.com/file/d/1O_WhsHwUQIEMVB8x7tNOI-GHNExJcQLT/view?usp=drive_link", bio: "An Afghan-American novelist whose works often deal with family, history, and identity against conflict.", summary: "A deeply moving story of betrayal and redemption set in a changing Afghanistan." },
  { id: 4, title: "And Then There Were NONE", author: "Agatha Christie", subject: "Mystery", driveLink: "https://drive.google.com/file/d/16_RuSqhdkmsSXVKPdVJlPEvZnTvPmL75/view?usp=drive_link", bio: "The world's best-selling mystery writer, creator of some of the most iconic literary detectives.", summary: "Ten strangers are invited to an isolated island, only to be murdered one by one." },
  { id: 5, title: "TALES OF THE UNEXPECTED", author: "H. G. WELLS", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1tCYl3rZznYsXOSI0V8IUO0mVX-2L0CV5/view?usp=drive_link", bio: "Commonly called the 'Father of Science Fiction', Wells also mastered suspenseful and eerie storytelling.", summary: "A collection of suspenseful and eerie stories that challenge reality with unpredictable twists." },
  { id: 6, title: "THE HOUND OF THE BASKERVILLES", author: "CONAN DOYEE", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1l63cxB4Yx9CHdhdhpKTpJkOfx2jp-Aaa/view?usp=drive_link", bio: "The British author who immortalized the detective genre through his creation of Sherlock Holmes.", summary: "Sherlock Holmes investigates the legend of a supernatural spectral hound haunting the moors." },
  { id: 7, title: "The girl on the train ", author: "Paula Hawkins", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1D7AfHf78rWe_0ByPWHRo8VuFx4nzuJ4H/view?usp=drive_link", bio: "A contemporary British author known for psychological thrillers that deal with memory and perception.", summary: "A woman witnesses something shocking from a train window and gets entangled in a disappearance." },
  { id: 8, title: "The Silent Patient", author: "Alex Michaelides", subject: "Mystery", driveLink: "https://drive.google.com/file/d/1OBJKH3_9pPLVELEqM3AqC_bmb517x4Nx/view?usp=drive_link", bio: "A British-Cypriot author who specializes in high-stakes psychological mysteries and plot twists.", summary: "A famous painter shoots her husband and never speaks again, until a therapist tries to uncover her motive." },
  { id: 9, title: "How Much Land Does a Man Need?", author: "Leo Tolstoy", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1i7G7xoUBk77DPDYyNzEkxMGsJi5XA2gc/view?usp=drive_link", bio: "A titan of Russian literature, master of social realism and philosophical inquiry into the human condition.", summary: "A profound moral fable about a peasant whose greed leads him to a fatal pursuit for land." },
  { id: 10, title: "The Bet", author: "Anton Chekhov", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1xQj_l55lPaQqIQnj-vKnzETGHHfdq6UB/view?usp=drive_link", bio: "A Russian physician and master of the short story, known for subtle character development.", summary: "A banker and a lawyer enter a bizarre wager over whether life imprisonment is better than death." },
  { id: 11, title: "Tolstoy Death Ilyich", author: "Leo Tolstoy", subject: "Philosophical fiction", driveLink: "https://drive.google.com/file/d/1jrDEOd4Dn7Dn2926-OWVRMZkSsrKjEZe/view?usp=drive_link", bio: "In his later works, Tolstoy focused on deep spiritual questions, mortality, and the meaning of life.", summary: "A powerful exploration of a man's sudden illness, forcing him to confront his social life's hollowness." },
  { id: 12, title: "The Lottery", author: "Shirley Jackson", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1jlYGOA_k4UUHC5Zfq8GwoDxWBTT1djF-/view?usp=drive_link", bio: "An American writer known for her gothic fiction and stories that expose darkness in suburban life.", summary: "A chilling story about a small town's annual tradition that reveals the terrifying potential for cruelty." },
  { id: 13, title: "THE LANDLADY", author: "ROALD DAHL", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1M6Ya7BUz34pmGpGGZtcV_k_AC0skGFVp/view?usp=drive_link", bio: "Famous for children's books, Dahl also wrote macabre and sinister tales for adults with twist endings.", summary: "A young man stays at a bed and breakfast, only to realize his polite hostess has a deadly secret." },
  { id: 14, title: "The Tell-Tale Heart", author: "Edgar Allan Poe", subject: "Short Story", driveLink: "https://drive.google.com/file/d/1ud80hp2ULpBWHmWT5Qb88wqjrMpVosbk/view?usp=drive_link", bio: "The father of the American short story, master of the macabre and psychological horror.", summary: "A classic horror story told by a narrator who insists on their sanity while describing a murder." },
  { id: 15, title: "Great Lateral thinking puzzles", author: "Poul Sloane", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1pyrs6TQJE5f_71ZnW91U-CpgOS7gsw4Z/view?usp=drive_link", bio: "A leading expert on creative thinking and innovation, famous for his challenging logic puzzles.", summary: "A collection of mind-bending puzzles designed to challenge your brain and improve lateral thinking." },
  { id: 16, title: "Murdle", author: "g.t. karber", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1RRddB4mWC07Bp76elT7L41jibqxYrHIw/view?usp=drive_link", bio: "A logic puzzle creator who transformed the mystery genre into a fun and interactive deductive game.", summary: "A clever logic puzzle where you use clues to find the killer, the weapon, and the crime scene." },
  { id: 17, title: "The Sherlock Holmes Puzzle Collection", author: "Bernard Myers", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/1ntf_ov4RE_PDpCsMWLUeiwhrZYpDc-8n/view?usp=drive_link", bio: "An author specialized in creating intricate brain-teasers inspired by classic detective literature.", summary: "Test your powers of deduction with puzzles and riddles that would challenge Sherlock Holmes himself." },
  { id: 18, title: "What is the Name of This Book", author: "Raymond Smullyan", subject: "Puzzles", driveLink: "https://drive.google.com/file/d/10f7Pmnf0BJYChiHODPJ5wQcjpRwIYP_1/view?usp=drive_link", bio: "A renowned mathematician and logician who turned complex logical principles into fun paradoxes.", summary: "A legendary collection of logic puzzles leading from simple riddles to deep mathematical truths." },

  // --- New Harry Potter & Fantastic Beasts Series ---
  { 
    id: 19, title: "Harry Potter And The Deathly Hallows", author: "J. K. Rowling", subject: "Fantasy", 
    driveLink: "https://drive.google.com/file/d/1Tz51w4j6g007_NyDM8zTvL62MVEQxNob/view?usp=drive_link", 
    bio: "A globally renowned British author who created the Harry Potter franchise, transforming modern literature for all ages.", 
    summary: "The epic conclusion where Harry Potter set out to destroy Voldemort's Horcruxes to end the dark wizard's reign." 
  },
  { 
    id: 20, title: "Harry Potter And The Half Blood Prince", author: "J. K. Rowling", subject: "Fantasy", 
    driveLink: "https://drive.google.com/file/d/16E1rpgPmxEtjHCLv1wHMRb9V4ZOvhcB7/view?usp=drive_link", 
    bio: "Rowling is celebrated for her intricate world-building and for making reading a magic experience for millions.", 
    summary: "Harry discovers an old potions book belonging to the mysterious 'Half-Blood Prince' while preparing for war." 
  },
  { 
    id: 21, title: "Harry Potter And The Order Of The Phoenix", author: "J. K. Rowling", subject: "Fantasy", 
    driveLink: "https://drive.google.com/file/d/1_1CvFBN-Degg5EPYAZciSM-_6RuZcmNA/view?usp=drive_link", 
    bio: "One of the most influential writers of our time, her stories focus on bravery, friendship, and the battle against evil.", 
    summary: "Facing disbelief about Voldemort's return, Harry helps form Dumbledore's Army to prepare his fellow students." 
  },
  { 
    id: 22, title: "Harry Potter And The Goblet Of Fire", author: "J. K. Rowling", subject: "Fantasy", 
    driveLink: "https://drive.google.com/file/d/1yaLlEMxF8akcy1nOJ-mhEyTCgC2vQpIb/view?usp=drive_link", 
    bio: "Her wizarding world books have been translated into over 80 languages, becoming a staple of global culture.", 
    summary: "Harry is unexpectedly chosen to compete in the dangerous Triwizard Tournament, a trap set by dark forces." 
  },
  { 
    id: 23, title: "Harry Potter And The Prisoner Of Azkaban", author: "J. K. Rowling", subject: "Fantasy", 
    driveLink: "https://drive.google.com/file/d/1zPl0DKIUjG3bHMg-Np1RO56Bom-F1n12/view?usp=drive_link", 
    bio: "Before her success, Rowling was a teacher and researcher; she now uses her fame to support many charitable causes.", 
    summary: "A dangerous prisoner escapes Azkaban, leading Harry to uncover shocking secrets about his family's past." 
  },
  { 
    id: 24, title: "Harry Potter And The Chamber Of Secrets", author: "J. K. Rowling", subject: "Fantasy", 
    driveLink: "https://drive.google.com/file/d/1JSMD1kKvitxrd50_Dpp9xZWpN14FLYqB/view?usp=drive_link", 
    bio: "The author who brought magic back to the 21st century, inspiring a generation to read and imagine.", 
    summary: "Harry returns to Hogwarts only to find a dark entity is petrifying students, hidden within a secret chamber." 
  },
  { 
    id: 25, title: "Harry Potter And The Sorcers Stone", author: "J. K. Rowling", subject: "Fantasy", 
    driveLink: "https://drive.google.com/file/d/1kSt_ThIZUF6SeRLa1GD0OpLlp9XYkAfK/view?usp=drive_link", 
    bio: "Her debut novel launched the most successful book series in history, making her an icon of creative storytelling.", 
    summary: "The magical journey begins as young Harry Potter discovers he is a wizard and attends Hogwarts for the first time." 
  },
  { 
    id: 26, title: "Fantastic Beasts And Where To Find Them", author: "J. K. Rowling", subject: "Fantasy", 
    driveLink: "https://drive.google.com/file/d/1QpXRbcMHTe6_dNXgkJYmF4QE7jN0gwWF/view?usp=sharing", 
    bio: "Expanding her magical universe, Rowling wrote this guide to provide a deeper look at the creatures of her world.", 
    summary: "An essential textbook for Hogwarts students that details the world's most incredible magical creatures." 
  }
];

const EnglishLibraryInternalPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedBio, setSelectedBio] = useState<any>(null);
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  const subjects = useMemo(() => [...new Set(ENGLISH_LIBRARY_DATABASE.map(b => b.subject))], []);

  const filteredContent = useMemo(() => {
    return ENGLISH_LIBRARY_DATABASE.filter(item => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(term) || item.author.toLowerCase().includes(term);
      const matchesSub = subjectFilter === 'all' || item.subject === subjectFilter;
      return matchesSearch && matchesSub;
    });
  }, [searchTerm, subjectFilter]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    (e.currentTarget as HTMLElement).style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    (e.currentTarget as HTMLElement).style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const handleInteraction = (e: React.MouseEvent, action: () => void) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setRipples(prev => [...prev, { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(action, 400);
  };

  return (
    <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-1000 relative">
      
      <button onClick={() => navigate(-1)} className="mb-10 flex items-center gap-2 text-gray-500 hover:text-red-600 font-black transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform group-hover:-translate-x-1 ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        {isAr ? 'العودة للمكتبة الرقمية' : 'Back'}
      </button>

      {/* Smart Search & Filters */}
      <div onMouseMove={handleMouseMove} className="glass-panel glass-card-interactive p-8 rounded-[2.5rem] shadow-2xl mb-12 border-white/30 sticky top-24 z-30 backdrop-blur-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
          <div className="lg:col-span-2 relative">
            <input 
              type="text" 
              placeholder={isAr ? "Search title or author..." : "Search title or author..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 ps-12 rounded-2xl bg-white/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-red-600 outline-none font-black text-gray-950 dark:text-white transition-all shadow-inner"
            />
            <svg className="absolute start-4 top-4 h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="p-4 rounded-2xl bg-white/40 dark:bg-gray-800/60 border border-white/10 dark:text-white font-black cursor-pointer appearance-none shadow-sm">
            <option value="all">{isAr ? "All Subjects" : "All Subjects"}</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredContent.map((item) => (
          <div key={item.id} onMouseMove={handleMouseMove} className="glass-panel glass-card-interactive group relative overflow-hidden p-8 rounded-[3rem] border-white/20 flex flex-col justify-between hover:scale-[1.03] transition-all duration-500 h-full shadow-lg">
            {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/20" style={{ left: r.x, top: r.y }} />)}
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <span className="bg-red-600 text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md">{item.subject}</span>
                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">📖</span>
              </div>
              
              <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-2 group-hover:text-red-600 transition-colors leading-tight tracking-tighter line-clamp-2 h-14 overflow-hidden">{item.title}</h2>
              <p className="text-green-700 dark:text-green-400 font-black text-sm mb-4">{item.author}</p>
              
              {/* AI Summary */}
              <div className="bg-black/5 dark:bg-white/5 p-5 rounded-[1.5rem] border border-white/10 mb-6">
                <p className="text-[9px] text-red-600 font-black uppercase mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
                  Saqr AI Summary
                </p>
                <p className="text-gray-700 dark:text-gray-300 font-medium italic text-sm leading-relaxed line-clamp-3">"{item.summary}"</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 z-10">
              <button 
                onClick={(e) => handleInteraction(e as any, () => setSelectedBio(item))}
                className="w-full bg-white/40 dark:bg-white/5 border border-red-500/30 text-gray-900 dark:text-white font-black py-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-xs active:scale-95"
              >
                Author Bio
              </button>
              <a 
                href={item.driveLink} 
                target="_blank" 
                rel="noopener noreferrer"
                onMouseDown={(e) => handleInteraction(e as any, () => {})}
                className="relative overflow-hidden w-full bg-gray-950 text-white dark:bg-white dark:text-gray-950 font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all group/btn"
              >
                {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <span>Read Content</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Author Bio Modal */}
      {selectedBio && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-lg p-10 rounded-[3rem] border-white/20 shadow-2xl relative animate-in zoom-in-95">
             <button onClick={() => setSelectedBio(null)} className="absolute top-6 end-6 p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <h3 className="text-3xl font-black text-gray-950 dark:text-white mb-2">{selectedBio.author}</h3>
             <p className="text-red-600 font-black uppercase text-xs tracking-widest mb-6">Historical Bio (AI Bio)</p>
             <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-medium">"{selectedBio.bio}"</p>
             <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 flex justify-center">
                <img src="/school-logo.png" alt="EFIIPS" className="h-10 opacity-30 logo-white-filter" />
             </div>
          </div>
        </div>
      )}

      {/* Branding Footer */}
      <div className="mt-24 flex flex-col items-center gap-4 opacity-15 grayscale">
          <img src="/school-logo.png" alt="EFIIPS" className="h-24 w-auto logo-white-filter" />
          <p className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-500">Emirates Falcon International Private School</p>
      </div>
    </div>
  );
};

export default EnglishLibraryInternalPage;
