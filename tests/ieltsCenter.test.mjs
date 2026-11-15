import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(path, 'utf8');
const catalog = read('src/data/ieltsResources.ts');
const start = catalog.indexOf(' = [');
const end = catalog.indexOf('];\n\nexport const findIeltsResource',start);
assert.ok(start !== -1 && end !== -1, 'IELTS resource records must be a standalone literal inventory');
const books = JSON.parse(catalog.slice(start + 3, end + 1));

test('IELTS Drive metadata has 19 volumes and 5 specialist references', () => {
  assert.equal(books.length,24);
  const volumes=books.filter(b=>b.category==='cambridge');
  assert.equal(volumes.length,19);
  assert.equal(books.length-volumes.length,5);
  assert.deepEqual(volumes.map(b=>b.sortOrder), Array.from({length:19},(_,i)=>i+1));
  assert.equal(new Set(books.map(b=>b.id)).size,24,'Stable catalog IDs must be unique');
  assert.equal(new Set(books.map(b=>b.driveLink)).size,24,'Each resource links to a distinct PDF');
  assert.ok(books.every(b=>/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view$/.test(b.driveLink)));
  assert.ok(books.every(b=>Number.isSafeInteger(b.fileSizeBytes)&&b.fileSizeBytes>1000));
  assert.ok(books.filter(b=>b.category==='cambridge').every(b=>b.track==='general'||b.track==='unspecified'));
  assert.ok(books.filter(b=>b.category==='cambridge'&&b.sortOrder<=10).every(b=>b.track==='unspecified'));
  assert.ok(books.filter(b=>b.category==='cambridge'&&b.sortOrder>=11).every(b=>b.track==='general'));
});

test('IELTS route and visible discovery links are separate from the existing English catalogue',()=>{
  const app=read('App.tsx'), page=read('pages/IeltsPreparationCenterPage.tsx');
  const english=read('pages/EnglishLibraryInternalPage.tsx');
  const root=read('pages/DigitalLibraryPage.tsx');
  const db=read('api/digitalBookData.ts');
  assert.match(app,/path="\/digital-library\/english\/ielts"/);
  assert.match(app,/ProtectedRoute><IeltsPreparationCenterPage/);
  assert.match(english,/navigate\('\/digital-library\/english\/ielts'\)/);
  assert.match(root,/to="\/digital-library\/english\/ielts"/);
  assert.match(db,/export const ENGLISH_LIBRARY_DATABASE: DigitalLibraryBook\[\] = ENGLISH_PHOTO_LIBRARY_20261111/);
  assert.doesNotMatch(db,/IELTS_RESOURCES/);
  assert.match(page,/findIeltsResource\(id\)/);
  assert.match(page,/schoolOnly=\{true\}/);
  assert.match(page,/sourceSizeBytes=\{selected.fileSizeBytes\}/);
  assert.match(page,/DigitalBookReader/);
  assert.match(page,/new URLSearchParams\(location.search\).get\('open'\)/);
  assert.match(page,/Study references/);
});

test('IELTS coach adds prompts outside Saqr; the existing AI chat contains no IELTS changes',()=>{
  const chat=read('pages/SmartSearchPage.tsx');
  const page=read('pages/IeltsPreparationCenterPage.tsx');
  assert.doesNotMatch(chat,/IELTS_COACH_STARTERS|ieltsResources|location.search\).get\('ielts'/);
  assert.match(chat,/isSaqrLibrarySearchIntent\(userQuery, messages\)/);
  assert.match(chat,/startSaqrTeacherLesson\(userQuery\)/);
  assert.match(page,/IELTS_COACH_STARTERS\[coachSkill\]/);
  assert.match(page,/navigator.clipboard.writeText/);
  assert.match(page,/to="\/smart-search"/);
  assert.doesNotMatch(page,/smart-search\?ielts=/);
  for(const skill of ['reading','writing','listening','speaking'])
    assert.match(catalog,new RegExp('  '+skill+': "Act as my IELTS '));
  assert.match(catalog,/do not claim to evaluate my pronunciation/i);
  assert.match(catalog,/not a real listening test/i);
});

test('Existing Google login and school reader stay untouched by IELTS',()=>{
  const callback=read('src/components/GoogleSchoolReturn.tsx');
  assert.doesNotMatch(callback,/ieltsResources|IELTS_CAMBRIDGE_|findIeltsResource/);
  assert.match(callback,/verifySchoolLoginWithRetry/);
  assert.match(callback,/localStorage.setItem\('user_type', role\)/);
  assert.match(callback,/EN_NEW_\[0-9\]\{8\}/);
  const reader=read('src/components/DigitalBookReader.tsx');
  assert.match(reader,/enableSchoolReader/);
});
