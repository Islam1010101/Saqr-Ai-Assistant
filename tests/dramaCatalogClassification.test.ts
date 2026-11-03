import assert from 'node:assert/strict';
import { bookData, getLocalizedSubject } from '../api/bookData.ts';

// Do not confuse dramatic fiction (novels) with stage scripts or theatre research.
// Every item comes from an existing physical EFIPS catalog record; exact-title
// matching keeps other books, authors, shelves, ISBNs and IDs untouched.
const plays = [
  ['MACBETH', 19, 6],
  ["A Midsummer Night's Dream", 15, 2],
  ['As You Like It', 15, 3],
  ['Hamlet', 40, 4],
  ['Measure for Measure', 40, 4],
  ['Fifteen American One-Act (Plays)', 21, 1],
  ['The Ecstasy of Rita Joe', 14, 1]
] as const;
const studies = [
  ['النص والعرض المسرحي في الإمارات', 33, 1],
  ['Julius Caesar Note', 40, 4],
  ['المسرح، العدد 38 (نوفمبر 2022)', 41, 8]
] as const;
const dramaticNovelTitles = [
  'Oliver Twist', 'David Copperfield', 'Great Expectations', 'A Tale of Two Cities',
  'Little Women', 'Silas Marner', 'The Great Gatsby', 'The Pearl',
  'The Old Man and the Sea', 'The Scarlet Letter', 'The Red Badge of Courage',
  'A Separate Peace', 'The Idiot', 'War and Peace', 'Bridge to Terabithia',
  'Jacob Have I Loved', 'Sounder', 'The Great Gilly Hopkins',
  'The Planet of Junior Brown', 'The Summer of the Swans',
  'The Notebook', 'The Bridges of Madison County'
] as const;
const normalized = (value: string):string => value.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

for (const [title, shelf, row] of plays) {
  const match = bookData.find(b => normalized(b.title) === normalized(title) && b.shelf === shelf && b.row === row);
  assert.ok(match, 'Missing catalogued play: '+title);
  assert.equal(match.subject, 'Theatre & Plays', 'Play must be a theatrical text: '+title);
}
for (const [title, shelf, row] of studies) {
  const match = bookData.find(b => normalized(b.title) === normalized(title) && b.shelf === shelf && b.row === row);
  assert.ok(match, 'Missing theatre study: '+title);
  assert.equal(match.subject, 'Theatre Studies', 'Theatre notes/research must not be grouped with plays: '+title);
}
for (const title of dramaticNovelTitles) {
  const found = bookData.filter(b => normalized(b.title) === normalized(title));
  assert.ok(found.length > 0, 'Missing dramatic novel from physical catalog: '+title);
  assert.ok(found.every(b => b.subject === 'Dramatic Fiction'), 'Novel cannot be presented as a theatrical script: '+title);
}
// Distinct subject labels automatically populate the existing subject selector.
assert.equal(getLocalizedSubject('Dramatic Fiction', 'ar'), 'الدراما الروائية والاجتماعية');
assert.equal(getLocalizedSubject('Theatre & Plays', 'ar'), 'المسرح والمسرحيات');
assert.equal(getLocalizedSubject('Theatre Studies', 'ar'), 'الدراسات المسرحية');
assert.equal(getLocalizedSubject('Theatre & Plays', 'en'), 'Theatre & Plays');

const categories = new Set(['Dramatic Fiction','Theatre & Plays','Theatre Studies']);
assert.equal(bookData.filter(b=>b.subject === 'Theatre & Plays').length, plays.length);
assert.equal(bookData.filter(b=>b.subject === 'Theatre Studies').length, studies.length);
assert.equal(bookData.filter(b=>b.subject === 'Dramatic Fiction').length,
  dramaticNovelTitles.reduce((n,title)=>n+bookData.filter(b=>normalized(b.title)===normalized(title)).length,0));

// Reject title keywords, adaptations, and non-dramatic catalog items.
for (const title of ["CHILD'S PLAY", 'Play As Development','PLAY BETTER GOLF','POWER PLAY',
  'Brer Rabbit Plays Some Tricks','The Prince','The Adventures of Tom Sawyer','Animal Farm']) {
  assert.ok(bookData.filter(b=>normalized(b.title)===normalized(title)).every(b=>!categories.has(b.subject)),
    'Do not turn ordinary fiction, non-fiction or a false-positive Play keyword into drama: '+title);
}
assert.equal(new Set(bookData.map(b=>b.id)).size,bookData.length,
  'Book record IDs and borrowing/history keys must remain unique');
console.log('PASS: 22 dramatic fiction titles, 7 plays and 3 theatre-study titles separated with protected inventory identity');
