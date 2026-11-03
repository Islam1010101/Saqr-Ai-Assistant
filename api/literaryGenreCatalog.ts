/**
 * EFIPS physical library — conservative fiction GENRE refinements, 2026-11.
 * The complete current bookData inventory is scanned at runtime. We only
 * replace the existing subject when the actual record provides dependable
 * bibliographic evidence: a reviewed work title, or a clearly identifiable
 * author/series within an already-fictional record.
 *
 * Single PRIMARY genre is used to work with the existing exact-match subject
 * dropdown. No new columns, no changes to book IDs, location, ISBN, borrowing,
 * book views, reading passport or the Saqr engine.
 *
 * Genre definitions model school-library SCIS/OverDrive/Open Library categories.
 * Unknown editions and ambiguous titles stay in their original subject.
 */
export type LiteraryBook = {
  id: string; title: string; author: string; subject: string;
  shelf: number; row: number;
};
export const literaryGenreLabels: Record<string,string> = {
  'Horror & Gothic Fiction': 'الرعب والأدب القوطي',
  'Fantasy Fiction': 'الفانتازيا',
  'Science Fiction': 'الخيال العلمي',
  'Romance Fiction': 'الروايات الرومانسية',
  'Mystery & Detective Fiction': 'الغموض والتحقيقات',
  'Crime & Thriller Fiction': 'الجريمة والتشويق',
  'Adventure Fiction': 'روايات المغامرات',
  'Historical Fiction': 'الروايات التاريخية',
  'Humorous Fiction': 'الأدب الكوميدي',
  'Realistic & Family Fiction': 'الروايات الواقعية والعائلية',
  'Short Stories & Anthologies': 'القصص القصيرة والمختارات',
  'Dystopian & Satirical Fiction': 'الأدب الديستوبي والساخر',
  'Comics & Graphic Stories': 'القصص المصورة والكوميكس',
  'Sports Fiction': 'الروايات الرياضية',
  'Western Fiction': 'روايات الغرب الأمريكي'
};

export const literaryGenreSubjectNames = new Set<string>([
  ...Object.keys(literaryGenreLabels),
  'Literature & Fiction', 'Dramatic Fiction', 'Theatre & Plays',
  'Theatre Studies', 'Children’s Stories', 'Adventure Stories',
  'Mystery & Crime Fiction', 'Fantasy & Science Fiction',
  'Literary Studies & Criticism', 'Poetry'
]);

const norm = (s:string):string => String(s || '').normalize('NFKC')
  .toLocaleLowerCase().replace(/[\u064b-\u065f\u0670\u0640]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي')
  .replace(/[^\p{L}\p{N}]+/gu, '');

const reviewedGroups: Record<string,string[]> = {
  "Horror & Gothic Fiction": [
    "The Turn of the Screw",
    "Cell",
    "Intensity",
    "The Beast",
    "The Shroud",
    "Werewolf Trace",
    "My Best Friend Is Invisible",
    "Spooky America: Ghost Stories",
    "The Dark Half",
    "The Curse of the Mummy's Tomb",
    "Night of the Living Dummy",
    "Monster Blood",
    "Great Short Tales of Mystery and Terror",
    "The Hound of the Baskervilles"
  ],
  "Fantasy Fiction": [
    "The Hobbit",
    "The Silmarillion",
    "The Two Towers (The Lord of the Rings, Part Two)",
    "The Lord of the Rings",
    "The Wizard of Oz",
    "The Wonderful Wizard of Oz",
    "The Wishing-Chair Again",
    "The Magic Watering Can",
    "Jeremy Thatcher, Dragon Hatcher",
    "The Monster's Ring",
    "Dragonsong",
    "Dragonsdawn",
    "The Dragons of Blueland",
    "A World of Dragons",
    "The Sorcerer's Apprentice",
    "The Lion, the Witch and the Wardrobe",
    "Stanley and the Magic Lamp",
    "The Secrets of Droon",
    "The Titan of Twilight",
    "The Dragon's Child",
    "The Seventh Princess",
    "Ogre, Ogre",
    "The Dark Chronicles",
    "Freedom's Gate",
    "Squire",
    "Beowulf",
    "The Chronicles of Narnia",
    "The Locket"
  ],
  "Science Fiction": [
    "The Time Machine",
    "A Wrinkle in Time",
    "Prey",
    "The Black Hole",
    "Aliens Ate My Homework",
    "Space Brat 3: The Wrath of Squat",
    "I Was a Sixth Grade Alien",
    "The Lost World",
    "The Phantom Menace",
    "The Empire Strikes Back (Storybook)",
    "Star Trek (The Motion Picture)",
    "Star Trek The Next Generation (Imzadi)",
    "Deep Space Nine (Star Trek)",
    "The Traveller",
    "The War of the Worlds"
  ],
  "Romance Fiction": [
    "The Notebook",
    "Message in a Bottle",
    "The Bridges of Madison County",
    "Bridges of Madison County",
    "The Heiress Bride",
    "High Tide",
    "The Ladies of Missalonghi",
    "More Than Friends",
    "Wishes",
    "Lake Effect",
    "Everything to Gain",
    "The Trouble With Angels",
    "Morning Glory",
    "Bitter Years",
    "The Offering",
    "Long Time Coming",
    "Hot Ice",
    "The Romantic",
    "The Love Corner"
  ],
  "Mystery & Detective Fiction": [
    "Emil and the Detectives",
    "The Mummy Case",
    "Murder at the Book Club",
    "Slay It with Flowers",
    "Custard's Last Stand",
    "The Mystery of Old Abe",
    "The Mystery Of Tally-Ho Cottage",
    "The Dark Stairs",
    "The Castle Mystery",
    "The Secret of the Old Mill",
    "The Great Shark Mystery",
    "The Case of the Invisible Cat",
    "The Case of the Fiddling Ghost",
    "The Mystery in San Francisco",
    "The Secret Seven and the Lion Hunt",
    "The Mystery of the Empty House",
    "The Mystery of the Smiling Cat",
    "Fifth Grade Detective",
    "The House on the Cliff",
    "The Case of the Cheerleading Camp Mystery",
    "The Case of the Tapping Heels",
    "The Secret of the Old Clock",
    "Cam Jansen and the Mystery of the Stolen Corn Popper",
    "The Murder at Hockey Camp"
  ],
  "Crime & Thriller Fiction": [
    "The Da Vinci Code",
    "Angels & Demons",
    "Jack and Jill",
    "Jack & Jill",
    "The Appeal",
    "The Partner",
    "The Last Juror",
    "The Broker",
    "The Big Nowhere",
    "Paranoia",
    "The Devil's Banker",
    "Rising Sun",
    "The Empty Chair",
    "Blowout",
    "The Mediterranean Caper",
    "The Bourne Deception",
    "The 4th of July",
    "4th of July",
    "Heat Lightning",
    "Point of Origin",
    "Unnatural Exposure",
    "Black Notice",
    "Dead Watch",
    "Third Degree",
    "Dead Sleep"
  ],
  "Adventure Fiction": [
    "Twenty Thousand Leagues Under the Sea",
    "20,000 Leagues Under the Sea",
    "20000 Leagues Under the Sea",
    "Journey to the Center of the Earth",
    "Journey To The Centre Of The Earth",
    "Treasure Island",
    "Moby Dick",
    "The Swiss Family Robinson",
    "King Solomon's Mines",
    "White Fang",
    "Captains Courageous",
    "Island of the Blue Dolphins",
    "The Adventures of Tom Sawyer",
    "Tom Sawyer",
    "Adventures of Huckleberry Finn",
    "The Prince and the Pauper",
    "The Man Who Would Be King",
    "Island Book One: Shipwreck",
    "Island Book Three: The Danger",
    "Dive",
    "Peter Pan",
    "The Adventures of Pinocchio",
    "The Story of Peter Pan",
    "The Famous Five",
    "The Young Black Stallion",
    "The Black Stallion"
  ],
  "Historical Fiction": [
    "A Tale of Two Cities",
    "War and Peace",
    "The Red Badge of Courage",
    "The First Four Years",
    "Little Town on the Prairie",
    "Little House in the Big Woods",
    "Gabi's Dresser",
    "Lara's War",
    "The Scarlet Letter",
    "The Golden Road",
    "Rivals for the Crown",
    "The Patriot",
    "The Heretic's Daughter",
    "The Prince and the Pauper",
    "The Book Thief",
    "The Count of Monte Cristo",
    "The Three Musketeers",
    "The Story Girl Earns Her Name",
    "The Immigrants"
  ],
  "Humorous Fiction": [
    "Superfudge",
    "Fudge-a-Mania",
    "Tales of a Fourth Grade Nothing",
    "Fourth Grade Rats",
    "Sideways Stories from Wayside School",
    "Wayside School Is Falling Down",
    "George's Marvelous Medicine",
    "George's Marvellous Medicine",
    "Flat Stanley",
    "Stanley, Flat Again!",
    "Ramona's World",
    "Ramona the Brave",
    "Ramona Forever",
    "Beezus and Ramona",
    "The Great Brain",
    "Amelia Bedelia",
    "Amelia Bedelia Road Trip!",
    "How to Eat Fried Worms",
    "James and the Giant Peach",
    "The Cat in the Hat",
    "Soupy Saturdays with the Pain & the Great One",
    "The Great Pet Hoax",
    "Class Clown"
  ],
  "Realistic & Family Fiction": [
    "Little Women",
    "Eight Cousins",
    "Anne of Green Gables",
    "Anne of the Island",
    "Heidi",
    "Bridge to Terabithia",
    "Sounder",
    "Jacob Have I Loved",
    "The Great Gilly Hopkins",
    "The Planet of Junior Brown",
    "The Summer of the Swans",
    "The Moffatts on the Road",
    "The Middle Moffat",
    "A Summer to Die",
    "The Family Under the Bridge",
    "Amber Brown Is Not a Crayon",
    "Amber Brown Sees Red",
    "Ramona and Her Father",
    "More Perfect than the Moon",
    "Rabble Starkey",
    "Secrets",
    "Little Bear's Friend",
    "Searching for David's Heart",
    "Bud, Not Buddy",
    "The Hundred and One Dalmatians",
    "The Loner"
  ],
  "Short Stories & Anthologies": [
    "The Wonderful Story of Henry Sugar and Six More",
    "Great Short Tales of Mystery and Terror",
    "The Anastasia Syndrome (and Other Stories)",
    "Great Adventure Stories",
    "Classic Tales",
    "Storytime",
    "Of the Best (Reader's Digest)",
    "Fairy Tales",
    "Best from the Panchatantra (Book 2)",
    "The Book of Short Stories",
    "The Best of Analog",
    "The Best of (Analog)",
    "An Episode of Sparrows / The House by the River"
  ],
  "Dystopian & Satirical Fiction": [
    "Animal Farm",
    "1984",
    "Nineteen Eighty-Four",
    "The Giver",
    "The Hunger Games",
    "Brave New World",
    "The Running Man"
  ],
  "Comics & Graphic Stories": [
    "Garfield Weighs In",
    "Valley of the Far Side",
    "Herman: The Fourth Treasury",
    "Superman Doomsday & Beyond",
    "Bionicle: The Early Years #2",
    "The Adventures of Tintin"
  ],
  "Sports Fiction": [
    "Soccer Scoop",
    "The Hockey Machine",
    "Haunting at Home Plate",
    "Two Under Par",
    "Stone Fox",
    "The Fastest Turtle in the West",
    "Sporting Stories"
  ],
  "Western Fiction": [
    "Valley of the Sun",
    "The Catracks",
    "Desperado Lawman"
  ]
};
const knownWork = new Map<string,string>();
for(const [genre,titles] of Object.entries(reviewedGroups))
  for(const title of titles) knownWork.set(norm(title),genre);

// These known works are often labelled 'dramatic' but have a more precise
// primary genre. Realistic fiction is not fantasy simply because it contains
// imaginative play. Historical fiction is not a play or a history textbook.
const preciseGenreByWork: Record<string,string> = {
  'Bridge to Terabithia': 'Realistic & Family Fiction',
  'A Tale of Two Cities': 'Historical Fiction',
  'War and Peace': 'Historical Fiction',
  'The Red Badge of Courage': 'Historical Fiction',
  'The Scarlet Letter': 'Historical Fiction',
  'Animal Farm': 'Dystopian & Satirical Fiction',
  'The Turn of the Screw': 'Horror & Gothic Fiction',
  'A Wrinkle in Time': 'Science Fiction',
  'The Great Gatsby': 'Dramatic Fiction',
  'Julius Caesar Note': 'Theatre Studies'
};
for(const [title,genre] of Object.entries(preciseGenreByWork))
  knownWork.set(norm(title),genre);

// The legacy drama/theatre classification is preserved for other titles.
const keepTheatre = new Set(['Theatre & Plays','Theatre Studies']);
const eligibleExistingGenres = new Set([
  'Literature & Fiction','Dramatic Fiction','Children’s Stories',
  'Mystery & Crime Fiction','Fantasy & Science Fiction',
  'Adventure Stories','Realistic & Family Fiction'
]);

type GenreRule={genre:string;test:RegExp};
const knownSeries: GenreRule[]=[
  {genre:'Horror & Gothic Fiction',test:/\bgoosebumps\b|\bfear street\b|\bnight of the living dummy\b|\bmonster blood\b/i},
  {genre:'Fantasy Fiction',test:/\b(?:harry potter|narnia|bionicle|droon|the wishing.chair|dragonlance|discworld|middle.earth)\b/i},
  {genre:'Science Fiction',test:/\b(?:animorphs|star trek|star wars|stargate|space brat|i was a sixth grade alien|aliens ate my homework)\b/i},
  {genre:'Mystery & Detective Fiction',test:/\b(?:nancy drew|hardy boys|cam jansen|the boxcar children|secret seven|famous five)\b/i},
  {genre:'Realistic & Family Fiction',test:/\b(?:baby.sitters (?:club|little sister)|amber brown|american girl)\b/i},
  {genre:'Humorous Fiction',test:/\b(?:ramona|fudge.a.mania|superfudge|flat stanley|wayside school)\b/i}
];

// Broad-author defaults apply ONLY to already fictional catalog subjects,
// and only to writers whose work in this collection is strongly genre-bound.
// Specific title/series evidence always takes precedence over these defaults.
const authorGenres: GenreRule[]=[
  {genre:'Horror & Gothic Fiction',test:/\b(?:r\.?\s*l\.?\s*stine|stephen king|dean koontz|john coyne)\b/i},
  {genre:'Fantasy Fiction',test:/\b(?:j\.?\s*r\.?\s*r\.?\s*tolkien|terry brooks|anne mccaffrey|piers anthony|j\.?\s*k\.?\s*rowling)\b/i},
  {genre:'Romance Fiction',test:/\b(?:danielle stee(?:l|le)|nora roberts|debbie macomber|judith krantz|nicholas sparks|jude deveraux|lavyrle spencer|barbara delinsky|jackie collins|barbara taylor bradford|sandra brown|jane graves)\b/i},
  {genre:'Mystery & Detective Fiction',test:/\b(?:agatha christie|carolyn keene|franklin w\.?\s*dixon|enid blyton|gertrude chandler warner|mary higgins clark|elizabeth peters|tamar myers|kate collins)\b/i},
  {genre:'Crime & Thriller Fiction',test:/\b(?:john grisham|james patterson|patricia cornwell|lee child|john sandford|jeffery deaver|tom clancy|dan brown|sidney sheldon|greg iles|clive cussler|david baldacci|stuart woods|j\.?\s*d\.?\s*robb|joseph finder)\b/i},
  {genre:'Historical Fiction',test:/\b(?:laura ingalls wilder|kathy kacer|sharon kay penman)\b/i},
  {genre:'Sports Fiction',test:/\b(?:matt christopher|john reynolds gardiner)\b/i},
  {genre:'Western Fiction',test:/\b(?:louis l.amour|lauran paine|charles g\.?\s*west)\b/i},
  {genre:'Realistic & Family Fiction',test:/\b(?:ann m\.?\s*martin|beverly cleary|l\.?\s*m\.?\s*montgomery|katherine paterson|betsy byars|judy blume|eleanor estes|paula danziger|jennifer l\.?\s*holm)\b/i}
];

const highConfidenceTitleRules: GenreRule[]=[
  {genre:'Horror & Gothic Fiction',test:/\b(?:goosebumps|fear street|nightmare on|horror stor(?:y|ies)|haunted house)\b/i},
  {genre:'Fantasy Fiction',test:/\b(?:dragon hatch|wizard of oz|magical kingdom|enchanted forest|lord of the rings|the hobbit)\b/i},
  {genre:'Science Fiction',test:/\b(?:space brat|animorphs|star trek|star wars|science fiction|sci.fi)\b/i},
  {genre:'Mystery & Detective Fiction',test:/\b(?:nancy drew|hardy boys|cam jansen|sherlock holmes|mystery of|detective stories)\b/i},
  {genre:'Short Stories & Anthologies',test:/\b(?:short stor(?:y|ies) collection|short tales of|treasury of stories)\b/i}
];

export function classifyLiteraryGenre<T extends LiteraryBook>(book:T):T {
  if (keepTheatre.has(book.subject)) return book;
  const titleKey=norm(book.title);
  // Curated work-level decisions may correct a broad/incorrect earlier subject.
  const verified=knownWork.get(titleKey);
  if (verified) return book.subject===verified?book:{...book,subject:verified};
  if (!eligibleExistingGenres.has(book.subject)) return book;
  const combined=book.title+' '+book.author;
  for(const rule of knownSeries)
    if(rule.test.test(combined))
      return book.subject===rule.genre?book:{...book,subject:rule.genre};
  for(const rule of authorGenres)
    if(rule.test.test(book.author))
      return book.subject===rule.genre?book:{...book,subject:rule.genre};
  // Only high-specificity fiction keywords; never auto-classify Drama,
  // Romance or Thriller from ambiguous words like 'love', 'heart', 'play',
  // 'secret', 'murder', or an author's unrelated nonfiction work.
  for(const rule of highConfidenceTitleRules)
    if(rule.test.test(book.title))
      return book.subject===rule.genre?book:{...book,subject:rule.genre};
  return book;
}
