import assert from 'node:assert/strict';
import {bookData,getLocalizedSubject} from '../api/bookData.ts';
import {classifyLiteraryGenre,literaryGenreLabels,literaryGenreSubjectNames} from '../src/utils/literaryGenreCatalog.ts';
import {legacyLiteratureAuditedRecords,legacyLiteratureReviewNeeded,refineLegacyLiterature} from '../src/utils/legacyLiteratureClassification.ts';
import {physicalBookAdditions} from '../api/bookAdditions.ts';
import {shelf22SourceRecords} from '../api/shelf22Catalog.ts';
import {shelf30SourceRecords} from '../api/shelf30Catalog.ts';
import {shelf40Books} from '../api/shelf40Catalog.ts';
import {reviewedShelf41Books} from '../api/shelf41ReviewedCatalog.ts';

const norm=(s:string)=>s.normalize('NFKC').toLocaleLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu,'');
const find=(title:string)=>{
  const matches=bookData.filter(b=>norm(b.title)===norm(title));
  assert.ok(matches.length>0,'Missing catalog title: '+title);
  return matches;
};
const assertSubject=(title:string,subject:string)=>{
  const books=find(title);
  assert.ok(books.every(b=>b.subject===subject),
    'Expected '+subject+' for '+title+' but got '+books.map(b=>b.subject).join(','));
};
assert.ok(bookData.length>=3700,'Audit must inspect the full catalog, not a sample');
assert.equal(new Set(bookData.map(b=>b.id)).size,bookData.length,'Unique IDs/borrowings preserved');
assert.ok(bookData.every(b=>b.title&&b.author&&b.subject&&b.shelf>0&&b.row>0),
  'No physical catalog metadata lost');
for(const [genre,label] of Object.entries(literaryGenreLabels)){
  assert.equal(getLocalizedSubject(genre,'ar'),label,'Bilingual genre label: '+genre);
  assert.equal(getLocalizedSubject(genre,'en'),genre,'English genre label: '+genre);
  assert.ok(literaryGenreSubjectNames.has(genre));
}
const examples: Array<[string,string]>=[
  ['The Turn of the Screw','Horror & Gothic Fiction'],
  ['Cell','Horror & Gothic Fiction'],
  ['Goosebumps: MONSTER BLOOD','Horror & Gothic Fiction'],
  ['The Hobbit','Fantasy Fiction'],
  ['DRAGONSONG','Fantasy Fiction'],
  ['NARNIA (The Lion, the Witch and the Wardrobe)','Fantasy Fiction'],
  ['Prey','Science Fiction'],
  ['A Wrinkle in Time','Science Fiction'],
  ['Animorphs: The Invasion','Science Fiction'],
  ['The Notebook','Romance Fiction'],
  ['Message in a Bottle','Romance Fiction'],
  ['The Heiress Bride','Romance Fiction'],
  ['The Mystery Of Tally-Ho Cottage','Mystery & Detective Fiction'],
  ['Emil and the Detectives','Mystery & Detective Fiction'],
  ['NANCY DREW MYSTERY STORIES','Mystery & Detective Fiction'],
  ['SHERLOCK HOLMES : A STUDY IN SCARLET','Mystery & Detective Fiction'],
  ['ADVENTURES ON TRAIN : MURDER ON THE SAFARI STAR','Mystery & Detective Fiction'],
  ['The Da Vinci Code','Crime & Thriller Fiction'],
  ['THE APPEAL','Crime & Thriller Fiction'],
  ['Dragonfire','Crime & Thriller Fiction'],
  ['MOBY DICK','Adventure Fiction'],
  ['Journey to the Center of the Earth','Adventure Fiction'],
  ['A Tale of Two Cities','Historical Fiction'],
  ['WAR AND PEACE','Historical Fiction'],
  ['THE RED BADGE OF COURAGE','Historical Fiction'],
  ['FUDGE-A-MANIA','Humorous Fiction'],
  ['DIARY OF A WIMPY KID : THE DEEP END','Humorous Fiction'],
  ['Little Women','Realistic & Family Fiction'],
  ['Bridge to Terabithia','Realistic & Family Fiction'],
  ['Anne of Green Gables','Realistic & Family Fiction'],
  ['THE WONDERFUL STORY OF HENRY SUGAR AND SIX MORE','Short Stories & Anthologies'],
  ['Animal Farm','Dystopian & Satirical Fiction'],
  ['Garfield Weighs In','Comics & Graphic Stories'],
  ['Bleachers','Sports Fiction'],
  ['Valley of the Sun','Western Fiction'],
  ['MACBETH','Theatre & Plays'],
  ['The Ecstasy of Rita Joe','Theatre & Plays'],
  ['Julius Caesar Note','Theatre Studies'],
  ['GREAT EXPECTATIONS','Dramatic Fiction']
];
for(const [title,genre] of examples)assertSubject(title,genre);
// Non-fiction and unrelated genres remain unchanged: wordplay is not a genre.
const badExamples=[
  "CHILD'S PLAY",'PLAY BETTER GOLF','Play As Development',
  'TARBELL COURSE IN MAGIC VOL. 6','Microwave Magic',
  'The Key To Your Child\'s Heart','The Armchair Detective Book of Lists',
  'Science Comics : Rockets Defying Gravity',
  'ULTIMATE FOOTBALL HEROES : SON'
];
const genreSet=new Set(Object.keys(literaryGenreLabels));
for(const title of badExamples){
  const books=bookData.filter(b=>norm(b.title)===norm(title));
  for(const b of books)assert.ok(!genreSet.has(b.subject),
    'Unrelated work wrongly given a fiction genre: '+b.title);
}
for(const [title,subject] of [
  ['Guide to Novell NetWare 5.0/5.11 Network Administration','Computers & Programming'],
  ['THE ARMCHAIR DETECTIVE BOOK OF LISTS','Literary Studies & Criticism'],
  ['HOW TO WRITE A BOOK REPORT','Education & Teaching'],
  ['E.M. FORSTER: A LIFE','Biography & Memoirs'],
  ['FATAL VISION','General Nonfiction'],
  ['THE OLD PATAGONIAN EXPRESS','Geography & Travel'],
  ['The Great Fire','History & Civilizations'],
  ["Pojo's Total Unofficial Dragonball Z",'General Reference'],
  ['Adventures in Colors and Shapes','Education & Teaching'],
  ['MURDER & WALKING SPIRITS','Literary & Psychological Fiction']
] as const)assertSubject(title,subject);
const sample={id:'X',title:'The Hobbit',author:'J. R. R. Tolkien',
  subject:'Literature & Fiction',shelf:18,row:5,isbn:'9780000000001',
  copies:2,summary:'unchanged'};
const output=classifyLiteraryGenre(sample);
assert.equal(output.subject,'Fantasy Fiction');
assert.deepEqual({...output,subject:sample.subject},sample,
  'Classification may only change subject; never location, copies, ISBN, or description');
assert.equal(classifyLiteraryGenre({...sample,title:'UNKNOWN NOVEL',author:'Anonymous Writer'}).subject,sample.subject,
  'No forced genre for uncertain work');
for(const list of [physicalBookAdditions,shelf22SourceRecords,shelf30SourceRecords,
  shelf40Books,reviewedShelf41Books])
  for(const item of list){
    assert.ok(bookData.some(b=>b.title===item.title&&b.row===item.row&&b.shelf===item.shelf),
      'Book source must remain indexed: '+item.title);
  }
const counts=Object.fromEntries([...genreSet,'Dramatic Fiction','Theatre & Plays','Theatre Studies',
  'Literature & Fiction','Children’s Stories','Mystery & Crime Fiction',
  'Fantasy & Science Fiction','Adventure Stories'].map(genre=>[genre,bookData.filter(b=>b.subject===genre).length]));
const unresolvedLiterary=bookData.filter(b=>b.subject==='Literature & Fiction');
assert.equal(unresolvedLiterary.length,0,'No broad literature category remains in the physical catalog');
const reviewQueue=bookData.filter(b=>b.subject==='Catalog Review Required');
assert.ok(reviewQueue.length>0&&reviewQueue.length<=legacyLiteratureReviewNeeded,
  'Ambiguous titles must have an explicit bounded review queue, not guessed genres');
assert.equal(legacyLiteratureAuditedRecords,484,'Review each originally generic raw-inventory record');
assert.ok(legacyLiteratureReviewNeeded<120,'Bibliographic verification must reduce ambiguous records');
assert.equal(refineLegacyLiterature({...sample,id:'not-in-catalog',title:'Indeterminate book'}).subject,
  'Catalog Review Required','Unknown editions must not be assigned speculative fiction genres');
assertSubject('THE SAMSON OP(TION)','Politics & International Relations');
assertSubject('THE EHRLICHMAN CHINA CARD','Historical Fiction');
assertSubject('WIRED','Biography & Memoirs');
assertSubject("In a Child's Name",'General Nonfiction');
assertSubject('Rose Cottage','Romance Fiction');
assertSubject('Welcome to the Great Mysterious','Realistic & Family Fiction');

const oldGenres=new Set(['Mystery & Crime Fiction','Fantasy & Science Fiction','Adventure Stories']);
assert.equal(bookData.filter(b=>oldGenres.has(b.subject)).length,0,
  'All legacy combined fiction genres have been separated or restored to correct nonfiction');
console.log('GENRE_AUDIT_TOTAL',bookData.length);
console.log('GENRE_AUDIT_COUNTS',JSON.stringify(counts));
console.log('PASS: full physical catalog scanned, genres verified and other records preserved');



const findOneId=(id:string)=>{const b=bookData.find(x=>x.id===id);assert.ok(b,'Missing library book ID '+id);return b!;};
for(const [id,subject] of [
 ['5-2-1228','Business & Management'],
 ['5-3-1249','Economics & Finance'],
 ['5-4-1278','General Nonfiction'],
 ['5-4-1284','Biography & Memoirs'],
 ['19-1-1525','Sports Fiction'],
 ['19-1-1536','Mystery & Detective Fiction'],
 ['19-4-1593','Mystery & Detective Fiction'],
 ['19-6-1635','Literary & Psychological Fiction'],
 ['14-3-1803','Historical Fiction'],
 ['14-3-1805','Children’s Stories'],
 ['14-6-1880','Historical Fiction'],
 ['20-5-2118','Short Stories & Anthologies'],
 ['18-2-2311','Realistic & Family Fiction'],
 ['18-3-2362','Crime & Thriller Fiction'],
 ['18-5-2409','Biography & Memoirs'],
 ['16-3-2670','Mystery & Detective Fiction'],
 ['16-5-2727','Crime & Thriller Fiction'],
 ['17-2-3154','Literary & Psychological Fiction'],
 ['17-3-3181','Mystery & Detective Fiction'],
 ['17-4-3196','Literary & Psychological Fiction'],
 ['19-4-1599','Romance Fiction'],
 ['18-4-2368','Romance Fiction'],
 ['18-3-2342','Mystery & Detective Fiction'],
 ['12-6-1719','Short Stories & Anthologies']
] as const) assert.equal(findOneId(id).subject,subject,'Verified genre: '+id);
assert.equal(findOneId('5-3-1249').author,'Sherry S. Cooper');
assert.equal(findOneId('18-5-2409').author,'Christopher De Vinck');
assert.equal(findOneId('17-4-3196').author,'R. L. Gordon');
assert.equal(findOneId('17-3-3181').title,'Mrs. Pollifax Unveiled');
assert.equal(findOneId('uploaded-20261028-002').title,'الاسم الحركي نبضة');
assert.equal(findOneId('uploaded-20261028-002').subject,'Children’s Stories');
assert.equal(findOneId('addition-20261026-57').subject,'Biography & Memoirs');
assert.equal(findOneId('addition-20261026-64').subject,'Children’s Stories');
assert.equal(findOneId('shelf40-20261027-010').subject,'Education & Teaching');
assert.equal(findOneId('21-1-2451').author,'Victor Malarek');
assert.equal(findOneId('12-1-1653').subject,'Catalog Review Required');

assert.equal(findOneId('17-3-3181').author,'Dorothy Gilman');
assert.equal(findOneId('19-2-1564').author,'Lynda Trent');
assert.equal(findOneId('16-2-2655').subject,'Biography & Memoirs');
assert.equal(findOneId('17-2-3160').title,'A Difficulty with Dwarves');
assert.equal(findOneId('16-5-2737').author,'Page Cooper (editor)');
assert.equal(findOneId('addition-20261026-35').subject,'Literary & Psychological Fiction');
assert.equal(findOneId('addition-20261026-62').subject,'Realistic & Family Fiction');
assert.equal(findOneId('shelf40-20261027-018').subject,'Short Stories & Anthologies');
assertSubject('Anna Dillon : Another Time, Another Season','Historical Fiction');
assertSubject('Dark Winds','Horror & Gothic Fiction');
for(const [id,subject] of [
 ['21-1-2446','Sociology & Society'],
 ['21-1-2470','Crime & Thriller Fiction'],
 ['21-3-2503','Biography & Memoirs'],
 ['21-4-2538','History & Civilizations'],
 ['21-5-2560','Environment & Sustainability'],
 ['21-6-2595','Law & Government'],
 ['18-3-2354','Crafts & Hobbies'],
 ['addition-20261026-37','Children’s Stories'],
 ['addition-20261026-45','Astronomy & Space'],
 ['addition-20261026-50','Biography & Memoirs'],
 ['addition-20261026-54','UAE Heritage & Culture'],
 ['shelf40-20261027-006','Humorous Fiction'],
 ['shelf40-20261027-032','Catalog Review Required'],
 ['shelf40-20261027-083','Catalog Review Required'],
 ['shelf30-20261028-045','Children’s Stories'],
 ['uploaded-20261028-001','Children’s Stories']
] as const)assert.equal(findOneId(id).subject,subject,'Whole-inventory correction: '+id);
assert.equal(bookData.filter(b=>b.subject==='General Knowledge').length,0,
  'Clearly identified catalog works should not remain in an unspecific general subject');


for(const [id,genre] of [
 ['shelf30-20261028-012','Animals & Nature'],
 ['shelf30-20261028-036','Children’s Stories'],
 ['shelf30-20261028-027','Dictionaries & Encyclopedias'],
 ['shelf40-20261027-016','Biography & Memoirs'],
 ['shelf40-20261027-077','Fantasy Fiction'],
 ['shelf40-20261027-081','Fantasy Fiction']
] as const) assert.equal(findOneId(id).subject,genre,'Correct shelf 30/40: '+id);
const id22Books=bookData.filter(b=>b.id.startsWith('shelf22-20261028-'));
assert.ok(id22Books.length>=200,'Whole Disney shelf must be scanned');
assert.ok(id22Books.every(b=>b.subject!=='General Knowledge'&&b.subject!=='General Nonfiction'),
 'No shelf-22 storybooks may remain under broad general knowledge');
assert.ok(bookData.filter(b=>b.subject==='Catalog Review Required').length<110,
 'The remaining bibliography review queue must decrease');
console.log('EFIPS_AUDIT_VALIDATED_SOURCE_SHELF22',id22Books.length);
console.log('EFIPS_AUDIT_REVIEW_QUEUE_FINAL',bookData.filter(b=>b.subject==='Catalog Review Required').length);

const categoryCounts=Object.fromEntries([...new Set(bookData.map(b=>b.subject))].sort().map(k=>[k,bookData.filter(b=>b.subject===k).length]));
const anomalies={
  review:bookData.filter(b=>b.subject==='Catalog Review Required').map(b=>({id:b.id,title:b.title,author:b.author,shelf:b.shelf,row:b.row})),
  unknownAuthor:bookData.filter(b=>/^(unknown author|مؤلف غير معروف|غير محدد|unknown)$/i.test(b.author)).map(b=>({id:b.id,title:b.title,subject:b.subject,shelf:b.shelf})),
  mismatchedLanguage:bookData.filter(b=>b.language==='EN'&&/[\u0600-\u06ff]/.test(b.title)).map(b=>({id:b.id,title:b.title,language:b.language})),
  placeholderTitles:bookData.filter(b=>/(author name only|^unknown$|^untitled$|^\?+$|^[. ]+$|^gree\.{3}|^robin cook$)/i.test(b.title)).map(b=>({id:b.id,title:b.title,subject:b.subject})),
  authorGenreMismatch:bookData.filter(b=>/\b(?:grisham|dickens|tolkien|stephen king|asimov|jane austen|shakespeare|nora roberts|james patterson|clive cussler)\b/i.test(b.author)&&!/fiction|stories|theatre|plays|poetry|mystery|adventure|fantasy|science fiction|romance|crime|thriller|western|historical|humorous|dystopian|comics|sports|review/i.test(b.subject)).map(b=>({id:b.id,title:b.title,author:b.author,subject:b.subject})),
  highRiskMisclassification:bookData.filter(b=>
     /^(Medicine & Healthcare|Mathematics & Statistics|Law & Government|Politics & International Relations|History & Civilizations|Sports & Games|Animals & Nature|Music & Performing Arts|Geography & Travel|Parenting & Family|General Knowledge|General Nonfiction|General Reference|Education & Teaching|UAE Heritage & Culture)$/.test(b.subject) &&
     /\b(novel|fiction|mystery|short stories|stories|adventures|tales|haunted|detective|romance|fantasy|thriller|poems|diary of|sherlock|narnia|harry potter|wonderland|goosebumps|murder|killed|pirates|frankenstein|sherlock holmes|book thief|gothic|dystopi)\b/i.test(b.title)
  ).map(b=>({id:b.id,title:b.title,author:b.author,subject:b.subject})),
  exactDuplicateIds:bookData.filter((b,i)=>bookData.findIndex(x=>x.id===b.id)!==i).map(b=>b.id),
  malformedISBN:bookData.filter(b=>b.isbn&&!(/^\d{9}[\dX]$/i.test(b.isbn)||/^\d{13}$/.test(b.isbn))).map(b=>({id:b.id,title:b.title,isbn:b.isbn})),
  flagNeedsReview:bookData.filter(b=>b.needsReview).map(b=>({id:b.id,title:b.title,author:b.author,subject:b.subject}))
};
console.log('EFIPS_AUDIT_DISTRIBUTION '+JSON.stringify(categoryCounts));
for (const [key,arr] of Object.entries(anomalies)){
  console.log('EFIPS_AUDIT_'+key.toUpperCase()+'_COUNT '+arr.length);
  console.log('EFIPS_AUDIT_'+key.toUpperCase()+'_SAMPLE '+JSON.stringify(arr.slice(0,key==='review'?125:key==='highRiskMisclassification'?140:50)));
}


// Final whole-catalog data quality: ISBN-10 and ISBN-13 checksums are both legitimate.
const validIsbn=(isbn:string)=>{
  const compact=isbn.replace(/[\s-]/g,'').toUpperCase();
  if(/^\d{13}$/.test(compact))return [...compact].reduce((sum,d,i)=>sum+Number(d)*(i%2===0?1:3),0)%10===0;
  if(/^\d{9}[\dX]$/.test(compact))return [...compact].reduce((sum,d,i)=>sum+(10-i)*(d==='X'?10:Number(d)),0)%11===0;
  return false;
};
const invalidIsbnRecords=bookData.filter(b=>b.isbn&&!validIsbn(b.isbn));
assert.equal(invalidIsbnRecords.length,0,'All candidate ISBN-10/ISBN-13 entries must pass check digit validation');
console.log('EFIPS_AUDIT_ISBN_BAD_CHECKSUM '+JSON.stringify(invalidIsbnRecords.map(b=>({id:b.id,title:b.title,isbn:b.isbn}))));
console.log('EFIPS_AUDIT_GENERAL_KNOWLEDGE_RECORDS '+JSON.stringify(bookData.filter(b=>b.subject==='General Knowledge').map(b=>({id:b.id,title:b.title,author:b.author,shelf:b.shelf}))));
