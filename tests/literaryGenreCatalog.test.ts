import assert from 'node:assert/strict';
import {bookData,getLocalizedSubject} from '../api/bookData.ts';
import {classifyLiteraryGenre,literaryGenreLabels,literaryGenreSubjectNames} from '../api/literaryGenreCatalog.ts';
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
  ['The Great Fire','History & Civilizations']
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
// Unverified ambiguous fiction remains general rather than being guessed.
assert.ok(unresolvedLiterary.length>0,'Keep an explicit conservative review queue');
const oldGenres=new Set(['Mystery & Crime Fiction','Fantasy & Science Fiction','Adventure Stories']);
console.log('GENRE_LEGACY_REVIEW',JSON.stringify(bookData.filter(b=>oldGenres.has(b.subject)).map(b=>[b.title,b.author,b.subject,b.shelf])));
console.log('GENRE_AUDIT_TOTAL',bookData.length);
console.log('GENRE_AUDIT_COUNTS',JSON.stringify(counts));
console.log('PASS: full physical catalog scanned, genres verified and other records preserved');
