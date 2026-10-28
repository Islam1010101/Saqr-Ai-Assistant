import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readingChallengeBooks,getRoleReadingBooks,shuffleReading} from '../src/utils/saqrReadingQuestBank.ts';
import {bookData} from '../api/bookData.ts';
const groups=[['student','ar'],['student','en'],['teacher','ar'],['teacher','en']] as const;
assert.ok(bookData.length>=3000,'The complete EFIPS catalog should be loaded');
assert.equal(readingChallengeBooks.length,59,'All 59 catalog-matched books must be playable');
assert.equal(readingChallengeBooks.reduce((n,b)=>n+b.questions.length,0),555);
for(const [role,locale] of groups){
 const books=getRoleReadingBooks(role,locale);
 assert.ok(books.length>=4,`Not enough validated books for ${role}/${locale}`);
 for(const entry of books){
  assert.equal(entry.role,role);assert.equal(entry.locale,locale);
  assert.equal(entry.book.language.toLowerCase(),locale);
  assert.ok(entry.book.shelf>0&&entry.book.row>0);
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
console.log('PASS 59 EFIPS books; 555 questions; bilingual role separation; unique book selection; 5-10 question rounds; student hub and teacher shortcut');

assert.ok(!page.includes('books.map(({key,book,questions})'),'Do not spoil all books before the journey');
assert.ok(page.includes('setAmount(v=>Math.max(1,v-1))'));
assert.ok(page.includes('setAmount(v=>Math.min(books.length,v+1))'));
assert.ok(page.includes('active.book.book.shelf'));

assert.ok(!page.includes('books.map(({key,book,questions})'),'Do not show all book titles before starting');
assert.ok(page.includes('setAmount(v=>Math.max(1,v-1))'));
assert.ok(page.includes('setAmount(v=>Math.min(books.length,v+1))'));
assert.ok(page.includes('active.book.book.shelf'));

assert.ok(!page.includes('مصدر المحتوى'),'No external source label should appear during quiz');
assert.ok(!page.includes('active.book.sourceUrl'),'Only the physical book is the displayed challenge source');
assert.ok(page.includes('sq-question-panel'),'Questions must use the new focused visual panel');
assert.ok(!hub.includes('ثلاث تجارب · عالم واحد من الإبداع'),'Remove the redundant slogan');
