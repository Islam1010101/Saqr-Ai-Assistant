import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readingChallengeBooks,getRoleReadingBooks,shuffleReading} from '../src/utils/saqrReadingQuestBank.ts';
import {bookData} from '../api/bookData.ts';
import {digitalReadingChallengeBooks} from '../src/utils/saqrReadingQuestDigitalBank.ts';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE} from '../api/digitalBookData.ts';
import {NATIONAL_IDENTITY_DIGITAL_BOOKS} from '../api/nationalIdentityDigitalBooks.ts';
import {heritageReadingQuestDefinitions} from '../src/utils/saqrReadingQuestHeritageSources.ts';
import {heritageDriveTextQuestions} from '../src/utils/saqrReadingQuestDriveTextSources.ts';
const groups=[['student','ar'],['student','en'],['teacher','ar'],['teacher','en']] as const;
assert.ok(bookData.length>=3000,'The complete EFIPS catalog should be loaded');
assert.equal(readingChallengeBooks.length,59,'All 59 catalog-matched books must be playable');
assert.equal(readingChallengeBooks.reduce((n,b)=>n+b.questions.length,0),555);
assert.equal(digitalReadingChallengeBooks.length,34,'Three text-reviewed digital titles are added without removing 31 current records');
assert.equal(digitalReadingChallengeBooks.reduce((n,b)=>n+b.questions.length,0),200,'Original 155 + 30 heritage page-grounded + 15 new title questions');
const digitalCatalog = [...ARABIC_LIBRARY_DATABASE,...ENGLISH_LIBRARY_DATABASE,...NATIONAL_IDENTITY_DIGITAL_BOOKS];
assert.equal(new Set(digitalReadingChallengeBooks.map(b=>b.key)).size,digitalReadingChallengeBooks.length);
assert.equal(digitalReadingChallengeBooks.filter(b=>b.key.includes(':NI_')).length,6,'All six National Identity e-books must be playable');
for (const def of heritageReadingQuestDefinitions) {
 const actual=digitalReadingChallengeBooks.find(b=>b.key==='digital:ar:'+def.id);
 assert.ok(actual,`Missing existing heritage book: ${def.id}`);
 assert.equal(actual.questions.length,def.qs.length+heritageDriveTextQuestions[def.id].length);
 for(let i=0;i<def.qs.length;i++){
   assert.equal(actual.questions[i].prompt,def.qs[i][0],'The original heritage questions must remain in the same order');
   assert.equal(actual.questions[i].id,actual.key+'-'+(i+1),'Previous question IDs must not change');
 }
 for (const q of actual.questions.slice(def.qs.length)) assert.match(q.reference,/PDF|ملف|صورة/);
}
for(const id of ['digital:ar:AR_50','digital:en:28','digital:en:32'])assert.ok(digitalReadingChallengeBooks.some(b=>b.key===id));
for(const record of digitalReadingChallengeBooks){
  const match=digitalCatalog.find(book=>String(book.id)===record.book.id);
  assert.ok(match,`Digital book missing from actual EFIPS catalog: ${record.key}`);
  assert.equal(record.book.driveLink,match.driveLink,'Reader link must come directly from catalog');
  assert.equal(record.book.shelf,0,'Digital books must not claim a physical shelf');
  assert.ok(record.sourceUrl.startsWith('https://'));
  assert.ok(record.questions.every(q=>q.reference.trim()));
}

for(const [role,locale] of groups){
 const books=getRoleReadingBooks(role,locale);
 assert.ok(books.length>=4,`Not enough validated books for ${role}/${locale}`);
 assert.ok(books.length>readingChallengeBooks.filter(b=>b.role===role&&b.locale===locale).length,`New digital books must extend ${role}/${locale}`);
 for(const entry of books){
  assert.equal(entry.role,role);assert.equal(entry.locale,locale);
  assert.equal(entry.book.language.toLowerCase(),locale);
  if(entry.book.driveLink){assert.equal(entry.book.shelf,0);assert.equal(entry.book.row,0);}
  else assert.ok(entry.book.shelf>0&&entry.book.row>0);
  assert.ok(entry.questions.length>=5&&entry.questions.length<=30);
  assert.equal(new Set(entry.questions.map(q=>q.id)).size,entry.questions.length);
  for(const q of entry.questions){
    assert.ok(q.prompt.trim());
    assert.ok(q.reference.trim());
    assert.equal(new Set(q.answers).size,3);
    assert.equal(q.correct,0);
  }
 }
 const selected=shuffleReading(books).slice(0,Math.min(3,books.length));
 assert.equal(new Set(selected.map(x=>x.key)).size,selected.length);
}
const page=readFileSync('pages/SaqrReadingQuestPage.tsx','utf8');
const home=readFileSync('pages/HomePage.tsx','utf8');
const hub=readFileSync('pages/SaqrChallengesHubPage.tsx','utf8');
assert.ok(page.includes('getRoleReadingBooks(role,ar?'));
assert.ok(page.includes('Math.min(10,book.questions.length)'));
assert.ok(page.includes('compactName(ar?session.ar||session.en:session.en||session.ar)'));
assert.ok(home.includes('to="/saqr-challenges"'));
assert.ok(home.includes('to="/saqr-reading-quest"'));
assert.ok(!home.includes('to="/game"'),'Game shortcut must be inside student challenges hub');
assert.ok(!home.includes('to="/saqr-studio"'),'Studio shortcut must be inside student challenges hub');
for(const path of ['/saqr-reading-quest','/game','/saqr-studio'])assert.ok(hub.includes(path));
assert.ok(home.includes("userType === 'teacher' && ("));
console.log('PASS 59 unchanged physical books + 32 reviewed digital books (including Gatsby); 555 unchanged physical questions + digital questions; role and language separation');

assert.ok(!page.includes('books.map(({key,book,questions})'),'Do not spoil all books before the journey');
assert.ok(page.includes('setAmount(v=>Math.max(1,v-1))'));
assert.ok(page.includes('setAmount(v=>Math.min(books.length,v+1))'));
assert.ok(page.includes('active.book.book.shelf'));
assert.ok(page.includes('active.book.book.driveLink'),'Digital books need reading link instead of fictitious shelf');

assert.ok(!page.includes('books.map(({key,book,questions})'),'Do not show all book titles before starting');
assert.ok(page.includes('setAmount(v=>Math.max(1,v-1))'));
assert.ok(page.includes('setAmount(v=>Math.min(books.length,v+1))'));
assert.ok(page.includes('active.book.book.shelf'));
assert.ok(page.includes('active.book.book.driveLink'),'Digital books need reading link instead of fictitious shelf');

assert.ok(!page.includes('مصدر المحتوى'),'No external source label should appear during quiz');
assert.ok(!page.includes('active.book.sourceUrl'),'Only the physical book is the displayed challenge source');
assert.ok(page.includes('sq-question-panel'),'Questions must use the new focused visual panel');
assert.ok(!hub.includes('ثلاث تجارب · عالم واحد من الإبداع'),'Remove the redundant slogan');

const quest=readFileSync('pages/SaqrReadingQuestPage.tsx','utf8');
assert.ok(quest.includes("session.role==='student'?'student':'teacher'"),'Admin must see teacher books instead of student books');
assert.ok(quest.includes("session.role==='admin'?'مدير النظام'"),'Admin needs distinct greeting');
assert.ok(home.includes('bg-[#56c5e6]'),'Ask Saqr needs vivid cyan palette');
assert.ok(home.includes('efips-nav-tile--soft'),'Home buttons use unified responsive styles');
