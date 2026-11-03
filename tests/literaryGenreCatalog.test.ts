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
  malformedISBN:bookData.filter(b=>b.isbn&&!/^\d{13}$/.test(b.isbn)).map(b=>({id:b.id,title:b.title,isbn:b.isbn,isbnStatus:b.isbnStatus})),
  flagNeedsReview:bookData.filter(b=>b.needsReview).map(b=>({id:b.id,title:b.title,author:b.author,subject:b.subject}))
};
console.log('EFIPS_AUDIT_DISTRIBUTION '+JSON.stringify(categoryCounts));
for (const [key,arr] of Object.entries(anomalies)){
  console.log('EFIPS_AUDIT_'+key.toUpperCase()+'_COUNT '+arr.length);
  console.log('EFIPS_AUDIT_'+key.toUpperCase()+'_SAMPLE '+JSON.stringify(arr.slice(0,key==='review'?125:key==='highRiskMisclassification'?140:50)));
}
