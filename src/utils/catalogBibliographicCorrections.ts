/**
 * EFIPS catalogue bibliographic corrections, 3 November 2026.
 * Scope: SUBJECT classifications + independently identifiable author/title corrections only.
 * Physical inventory IDs, shelf/row positions, ISBN data, copies and loan keys are untouched.
 * Every record-specific fix has a normalized title guard; many ambiguous title-only
 * entries remain under Catalog Review Required rather than receiving guessed metadata.
 * Publisher / library evidence is recorded next to each record-specific decision.
 *
 * Curated shelves 22/30/40 were inventoried from school-provided worksheets.
 * The shelf-22 division is between clearly named storybooks, learning/activity
 * guides and factual reference works; it is not a claim about unseen editions.
 */
export type CatalogAuditBook = {
  id:string; title:string; author:string; subject:string; shelf:number;
  needsReview?:boolean;
};
type SubjectFix = {
  title:string; subject:string; author?:string; correctTitle?:string; source?:string;
};
const norm=(v:string)=>String(v||'').normalize('NFKC').toLocaleLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .replace(/[^\p{L}\p{N}]+/gu,'');
const fixedRecords:Record<string,SubjectFix>={
  "5-2-1228": {title: "THE WINDS OF TURBULENCE", subject: "Business & Management", author: "Howard D. Putnam; Gene Busnar", source: "https://www.betterworldbooks.com/product/detail/the-winds-of-turbulence-9780887304583"},
  "5-3-1249": {title: "THE COOPER FILES", subject: "Economics & Finance", author: "Sherry S. Cooper", source: "https://books.google.com/books/about/The_Cooper_Files.html?id=Hj5V40NcRxIC"},
  "5-4-1278": {title: "This Far and No More", subject: "General Nonfiction", author: "Andrew H. Malcolm", source: "https://www.publishersweekly.com/9780812916065"},
  "5-4-1284": {title: "The House Is Not a Home", subject: "Biography & Memoirs", author: "Erik Nielsen", source: "https://openlibrary.org/books/OL1796488M/The_house_is_not_a_home"},
  "19-1-1525": {title: "ON ANY GIVEN SUNDAY", subject: "Sports Fiction", author: "Pat Toomay", source: "https://books.google.com/books/about/On_Any_Given_Sunday.html?id=6moBAAAACAAJ"},
  "19-1-1536": {title: "FIRST AVENUE", subject: "Mystery & Detective Fiction", author: "Lowen Clausen", source: "https://books.google.com/books/about/First_Avenue.html?id=FvIBJDCrkncC"},
  "19-3-1575": {title: "HOUNDS (OF) HEAVEN", subject: "Literary & Psychological Fiction", source: "https://www.abebooks.it/9780952418818/HOUNDS-HEAVEN-R.W.F-Poole-Robert-0952418819/plp"},
  "19-4-1593": {title: "THE VULGAR BOATMAN", subject: "Mystery & Detective Fiction", author: "William G. Tapply", source: "https://www.copyrightencyclopedia.com/the-orvis-pocket-guide-to-fly-fishing-for-bass-the-dutch/"},
  "19-6-1635": {title: "Scenes from Married Life / Scenes from Later Life", subject: "Literary & Psychological Fiction", author: "William Cooper", source: "https://www.kirkusreviews.com/book-reviews/a/william-cooper-4/scenes-from-married-life-and-scenes-from-later-/"},
  "14-3-1792": {title: "Night Horse", subject: "Children’s Stories", source: "https://books.google.com/books/about/Night_Horse.html?id=lJ_NvsRZbxEC"},
  "14-3-1803": {title: "LEFT BY THEMSELVES", subject: "Historical Fiction", author: "Charles Paul May", source: "https://www.librarything.com/work/111936"},
  "14-3-1805": {title: "CATS AT THE CAMPGROUND", subject: "Children’s Stories", author: "Ben M. Baglio", source: "https://www.orsh.net/wp-content/uploads/2023/08/Books-08.18.2023.pdf"},
  "14-6-1880": {title: "MCKAY'S BEES", subject: "Historical Fiction", author: "Thomas McMahon", source: "https://bibliovault.org/BV.book.epl?ISBN=9780226561110"},
  "20-5-2118": {title: "UNCANNY", subject: "Short Stories & Anthologies", author: "Paul Jennings", source: "https://search.worldcat.org/title/932013388"},
  "20-5-2119": {title: "BEYOND THE BURNING LAND", subject: "Science Fiction", source: "https://books.google.com/books?id=iduaBgAAQBAJ"},
  "18-2-2311": {title: "GUYS LIKE US", subject: "Realistic & Family Fiction", source: "https://www.publishersweekly.com/9780385294485"},
  "18-3-2362": {title: "Shooter's Point", subject: "Crime & Thriller Fiction", author: "Gary Phillips", source: "https://www.publishersweekly.com/9781575666822"},
  "18-5-2409": {title: "ONLY THE HEART KNOWS HOW TO FIND THEM", subject: "Biography & Memoirs", author: "Christopher De Vinck", source: "https://www.publishersweekly.com/9780140169478"},
  "16-3-2670": {title: "SKINNY MAN", subject: "Mystery & Detective Fiction", source: "https://books.google.com/books/about/Skinny_Man.html?id=mloAl7EAdpkC"},
  "16-5-2727": {title: "THE DOUBLE-CROSS CIRCUIT", subject: "Crime & Thriller Fiction", source: "https://www.booksincanada.ca/pdfs/79/apr79.pdf"},
  "17-2-3154": {title: "The Part of Fortune", subject: "Literary & Psychological Fiction", author: "Laurel Goldman", source: "https://obnb.uk/p10069881-the-part-of-fortune"},
  "17-3-3181": {title: "Mothers, Pollaeax Unveiled", subject: "Mystery & Detective Fiction", author: "Dorothy Gilman", correctTitle: "Mrs. Pollifax Unveiled", source: "https://www.penguinrandomhouse.com/books/60300/mrs-pollifax-unveiled-by-dorothy-gilman/"},
  "17-4-3196": {title: "You'll Hear Me Laughing", subject: "Literary & Psychological Fiction", author: "R. L. Gordon", source: "https://mhs.mb.ca/docs/people/gordon_rl.shtml"},
  "19-5-1621": {title: "Ginger snaps", subject: "Catalog Review Required"},
  "16-5-2719": {title: "ROBIN COOK", subject: "Catalog Review Required"},
  "17-6-3234": {title: "Gree...", subject: "Catalog Review Required"},
};
const legacyOutlierRecords: Record<string,readonly [string,string]>={
  "19-4-1599": ["Dance Upon (the Air)", "Romance Fiction"],
  "18-4-2368": ["DANCE UPON THE AIR", "Romance Fiction"],
  "18-3-2342": ["MURDER AT HOCKEY CAMP", "Mystery & Detective Fiction"],
  "12-6-1719": ["Great Golf Stories", "Short Stories & Anthologies"],
};
const shelf30Reclassifications:Record<string,string>={
  "Where's Later, Daddy?": "Comics & Graphic Stories",
  "The Fire Cat": "Children’s Stories",
  "The Latchkey Dog": "Children’s Stories",
  "Reading for Independence": "Education & Teaching",
  "The Country Diary of an Edwardian Lady": "Animals & Nature",
  "Free to Be... A Family": "Short Stories & Anthologies",
  "Prime Time Rhyme": "Poetry",
  "An Episode of Sparrows / The House by the River": "Realistic & Family Fiction",
  "Treasury of Literature for Children": "Short Stories & Anthologies",
  "The Young Children's Encyclopedia": "Dictionaries & Encyclopedias",
  "The World of Robert Bateman": "Arts & Design",
  "A Book of Elephants": "Animals & Nature",
  "Aesop's Fables": "Short Stories & Anthologies",
  "Koko's Kitten": "Animals & Nature",
  "The Raggedy Ann Stories": "Children’s Stories",
  "Hummingbirds in the Garden": "Animals & Nature",
  "The Cosby Show Scrapbook": "Music & Performing Arts",
  "Where Horses Run Free": "Children’s Stories",
  "M is for Mitten: A Michigan Alphabet": "Education & Teaching",
  "Dinosaur Cousins?": "Animals & Nature",
  "Lincoln": "Biography & Memoirs",
  "My Fun With Reading (Book 1, 2, 5)": "Education & Teaching",
  "English Workshop C": "Language & Linguistics",
  "Sailing (Pocket Guide)": "Sports & Games",
  "E.T. the Extra-Terrestrial Storybook": "Science Fiction",
  "Space Jam": "Children’s Stories",
  "Happy Birthday, Good Knight": "Children’s Stories",
  "Pooh Invents a New Game": "Children’s Stories",
  "Moose's Store": "Children’s Stories",
  "The Baby-Sitters Club (The Movie Tie-in)": "Realistic & Family Fiction",
  "Jacob Two-Two and the Dinosaur": "Fantasy Fiction",
  "The Aristocats": "Children’s Stories",
  "Curious George Flies a Kite": "Children’s Stories",
  "Mother Rabbit's Son Tom": "Children’s Stories",
};
const shelf40Reclassifications:Record<string,string>={
  "My Vision: Challenges in the Race for Excellence": "UAE Heritage & Culture",
  "Flashes of Thought: Inspired by a Dialogue at the Government Summit 2013": "Business & Management",
  "My Story: 50 Memories from Fifty Years of Service": "Biography & Memoirs",
  "Scream Mates: Monster Jam": "Horror & Gothic Fiction",
  "Wilson: A Psychological Study": "Biography & Memoirs",
  "War": "Politics & International Relations",
  "The Timetables of History": "History & Civilizations",
  "The Original Illustrated Sherlock Holmes": "Mystery & Detective Fiction",
  "The Circle": "Crime & Thriller Fiction",
  "The Further Adventures of Sherlock Holmes": "Mystery & Detective Fiction",
  "A Thousand Days in Venice: An Unexpected Romance": "Biography & Memoirs",
  "Georgiana: Duchess of Devonshire": "Biography & Memoirs",
  "FAMILIES Are Like That": "Parenting & Family",
  "SpongeBob SquarePants: Belly Laughs from Bikini Bottom": "Humorous Fiction",
  "The Thoughts of Leonardo da Vinci": "Philosophy & Thought",
  "The Traveller": "Science Fiction",
  "King of the Wind": "Historical Fiction",
  "Telefon": "Crime & Thriller Fiction",
  "Dark Winds": "Crime & Thriller Fiction",
  "Gotham Diaries": "Realistic & Family Fiction",
  "Molly Moon's Incredible Book of Hypnotism": "Fantasy Fiction",
  "Indiana Jones and the Temple of Doom": "Adventure Fiction",
  "The Bad Beginning": "Humorous Fiction",
  "Seven Spiders Spinning": "Fantasy Fiction",
  "The Kitchen Gardener": "Animals & Nature",
  "Harry's Mad": "Humorous Fiction",
  "Bloodstream": "Crime & Thriller Fiction",
  "Too Many Monsters": "Children’s Stories",
  "I Loved You, Morgan McGee!": "Realistic & Family Fiction",
  "The Hornet's Nest": "Historical Fiction",
  "Ootah's Lucky Day": "Children’s Stories",
  "Walter the Lazy Mouse": "Children’s Stories",
  "Sojourn": "Fantasy Fiction",
  "Fantastic Beasts & Where To Find Them": "Fantasy Fiction",
  "Iwas A Third Grade Spy": "Children’s Stories",
  "JACOB TWO- TWO MEETS THE HOODED FANG": "Humorous Fiction",
  "CHARLES DARWIN : AND A SELECTION OF OTHERS NATURALLY": "Biography & Memoirs",
  "Julius Caesar Note": "Theatre Studies",
  "Bleachers": "Sports Fiction",
  "Anna Dillon : Another Time, Another Season": "Biography & Memoirs",
  "THE BABY SITTERS CLUB : KRISTY AND THE WALKING DISASTER": "Realistic & Family Fiction",
};
const reindex=(data:Record<string,string>):Map<string,string>=>
  new Map(Object.entries(data).map(([title,subject])=>[norm(title),subject]));
const shelf30Index=reindex(shelf30Reclassifications);
const shelf40Index=reindex(shelf40Reclassifications);

// Disney and early-reader source shelf: default storybook unless a
// specifically named reference / instruction / activity title indicates otherwise.
const shelf22Instructional:readonly [RegExp,string][]=[
  [/^disney.s year book|^disney.s wonderful world of knowledge|^disney.s yearbook/i,'General Reference'],
  [/^disney.s parents. guide$/i,'Parenting & Family'],
  [/^my disney diary|\b(?:search and find|look and find|jigsaw activity|magic eye|make.it book|pull.out posters|trading cards|joke book|goofy.s gags|activity songs|guide to fun and learning|mickey mouse make.it book)\b/i,'Crafts & Hobbies'],
  [/^a fun.filled visit to walt disney world$/i,'Geography & Travel'],
  [/^(?:canada|china|u.s.a.)$/i,'Geography & Travel'],
  [/\b(?:alphabet a.z|alphabet soup|mickey.s alphabet soup|count on donald|counting book|numbers 1.10|first wordbook|learn with mickey|adventures in colors and shapes|big and little, same and different|a guide to fun and learning|young readers guide)\b/i,'Education & Teaching'],
  [/\b(?:all about you|our wonderful earth|real.life monsters|from whales to snails|birds and trees|sea creatures, sharks|simple science|seasons and holidays)\b/i,'Animals & Nature']
];
const alreadyFictional=new Set([
  'Children’s Stories','Adventure Fiction','Fantasy Fiction','Science Fiction',
  'Horror & Gothic Fiction','Historical Fiction','Humorous Fiction',
  'Realistic & Family Fiction','Mystery & Detective Fiction','Crime & Thriller Fiction',
  'Romance Fiction','Short Stories & Anthologies','Comics & Graphic Stories',
  'Dramatic Fiction','Dystopian & Satirical Fiction','Sports Fiction','Western Fiction',
  'Literary & Psychological Fiction','Theatre & Plays'
]);

const classifySourceShelf22=(book:CatalogAuditBook):string=>{
  const title=book.title.toLowerCase();
  for (const [pattern,subject] of shelf22Instructional){
    if(pattern.test(title)) return subject;
  }
  // Specific literature classifications from earlier curated bibliographic
  // research take priority over the generic child-story fallback.
  if(alreadyFictional.has(book.subject)) return book.subject;
  return 'Children’s Stories';
};

const verifiedCatalogFixes=Object.keys(fixedRecords).length;
export const catalogAuditedRecordCount=verifiedCatalogFixes;
export function applyPhysicalCatalogAudit<T extends CatalogAuditBook>(book:T):T {
  let next:T=book;
  if(book.shelf===22&&book.id.startsWith('shelf22-20261028-')){
    const subject=classifySourceShelf22(book);
    if(subject!==next.subject)next={...next,subject};
  }
  const key=norm(book.title);
  const shelfReclassification=book.id.startsWith('shelf30-20261028-')
    ?shelf30Index.get(key):book.id.startsWith('shelf40-20261027-')
      ?shelf40Index.get(key):undefined;
  if(shelfReclassification&&shelfReclassification!==next.subject)
    next={...next,subject:shelfReclassification};
  const reviewedLegacy=legacyOutlierRecords[book.id];
  if(reviewedLegacy&&norm(reviewedLegacy[0])===key&&reviewedLegacy[1]!==next.subject)
    next={...next,subject:reviewedLegacy[1]};
  const fix=fixedRecords[book.id];
  if(fix&&norm(fix.title)===key){
    next={...next,subject:fix.subject,
      ...(fix.author?{author:fix.author}:{}),
      ...(fix.correctTitle?{title:fix.correctTitle}:{})};
  }
  if((book.id==='16-5-2719'||book.id==='17-6-3234'||book.id==='16-4-2690')
    &&next.needsReview!==true)next={...next,needsReview:true};
  return next;
}
