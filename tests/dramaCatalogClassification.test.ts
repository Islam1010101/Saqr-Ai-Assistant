import assert from 'node:assert/strict';
import { bookData, getLocalizedSubject } from '../api/bookData.ts';

// These exact catalogued works were reviewed by title and provenance.
// Plays are distinct from literary fiction; notes and theatre journals are studies.
const plays = [
  ['MACBETH', 19, 6],
  ["A Midsummer Night's Dream", 15, 2],
  ['As You Like It', 15, 3],
  ['Hamlet', 40, 4],
  ['Measure for Measure', 40, 4],
  ['Fifteen American One-Act (Plays)', 21, 1]
] as const;
const studies = [
  ['النص والعرض المسرحي في الإمارات', 33, 1],
  ['Julius Caesar Note', 40, 4],
  ['المسرح، العدد 38 (نوفمبر 2022)', 41, 8]
] as const;
const normalized = (value: string) => value.normalize('NFKC').trim().toLocaleLowerCase();
for (const [title, shelf, row] of plays) {
  const match = bookData.find(b => normalized(b.title) === normalized(title) && b.shelf === shelf && b.row === row);
  assert.ok(match, 'Missing indexed play: ' + title);
  assert.equal(match.subject, 'Drama & Plays', 'Play incorrectly kept under general literature: ' + title);
}
for (const [title, shelf, row] of studies) {
  const match = bookData.find(b => normalized(b.title) === normalized(title) && b.shelf === shelf && b.row === row);
  assert.ok(match, 'Missing indexed theatre study: ' + title);
  assert.equal(match.subject, 'Theatre & Drama Studies', 'Study incorrectly classified as play or fiction: ' + title);
}
assert.equal(getLocalizedSubject('Drama & Plays', 'ar'), 'الدراما والمسرحيات');
assert.equal(getLocalizedSubject('Theatre & Drama Studies', 'ar'), 'الدراسات المسرحية والدراما');
assert.equal(getLocalizedSubject('Drama & Plays', 'en'), 'Drama & Plays');
// Exactly these nine known records are new categories. All other subjects remain untouched.
assert.equal(bookData.filter(b => b.subject === 'Drama & Plays').length, plays.length);
assert.equal(bookData.filter(b => b.subject === 'Theatre & Drama Studies').length, studies.length);
for (const title of ["CHILD'S PLAY", 'Play As Development', 'PLAY BETTER GOLF', 'POWER PLAY', 'Brer Rabbit Plays Some Tricks']) {
  assert.ok(bookData.filter(b=>normalized(b.title) === normalized(title)).every(b=>
    b.subject !== 'Drama & Plays' && b.subject !== 'Theatre & Drama Studies'),
    'Title keyword caused false positive drama classification: '+title);
}
assert.equal(new Set(bookData.map(b=>b.id)).size, bookData.length,
  'Do not alter catalog record IDs or create duplicate entries');
console.log('PASS: nine verified dramatic works and theatre studies are separated from literature without false positives');
