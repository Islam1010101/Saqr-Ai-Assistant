import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { REMAINING_ENGLISH_IMAGE_BOOK_PAGES, REMAINING_ENGLISH_IMAGE_BOOK_COUNTS } from '../src/data/remainingEnglishImageBooks20261109.ts';
import { COMPLETED_ENGLISH_IMAGE_BOOK_PAGES } from '../src/data/completedEnglishImageBooks20261109.ts';
import { CODING_IMAGE_BOOK_PAGES } from '../src/data/codingImageBookPilot.ts';
import { ENGLISH_LIBRARY_DATABASE, ARABIC_LIBRARY_DATABASE } from '../api/digitalBookData.ts';

const expected:Record<string,{pages:number;pdf:string}> = {
  EN_NEW_20261109_05:{pages:368,pdf:'1TF4kIiavKRlffcTifzTr_0R5AcyeL5iP'},
  EN_NEW_20261109_07:{pages:260,pdf:'1cu-yhRFUhFW9j6esGTK20Uf1o7tm7j0s'},
  EN_NEW_20261109_10:{pages:237,pdf:'1DptTmoK-yki9_Du0PPHUotrf4NcfFQRn'},
  EN_NEW_20261109_16:{pages:216,pdf:'1woiMo6Oosx8knF9H9Wir1trXH1-y03dl'},
  EN_NEW_20261109_18:{pages:312,pdf:'1nZYM6Mt1k34I7ZJVwelmj8WiXZjhqcRc'},
};

assert.deepEqual(Object.keys(REMAINING_ENGLISH_IMAGE_BOOK_PAGES).sort(),Object.keys(expected).sort(),
  'Enable only five new verified completed English photo books');
let verified=0;
for (const [id,expectedBook] of Object.entries(expected)){
  const pages=REMAINING_ENGLISH_IMAGE_BOOK_PAGES[id];
  assert.equal(pages.length,expectedBook.pages);
  assert.equal(REMAINING_ENGLISH_IMAGE_BOOK_COUNTS[id],expectedBook.pages);
  assert.deepEqual(pages.map(p=>p.page),Array.from({length:expectedBook.pages},(_,i)=>i+1),
    id+' must be strictly ordered 1..N without gaps or repeated page numbers');
  assert.equal(new Set(pages.map(p=>p.fileId)).size,pages.length,
    id+' must not repeat image file IDs');
  for(const p of pages)assert.match(p.fileId,/^[A-Za-z0-9_-]{20,}$/);
  const book=ENGLISH_LIBRARY_DATABASE.find(book=>String(book.id)===id);
  assert.ok(book,id+' has original catalog metadata');
  assert.equal(book.requiresSchoolGoogleAccess,true);
  assert.ok(book.driveLink.includes(expectedBook.pdf),id+' retains the original PDF file and link');
  verified+=pages.length;
}
assert.equal(verified,1393);
assert.equal(ENGLISH_LIBRARY_DATABASE.length,77,'Do not change English library catalog counts');
assert.equal(ARABIC_LIBRARY_DATABASE.length,498,'Preserve Arabic records while adding six verified image titles');
assert.equal(CODING_IMAGE_BOOK_PAGES.length,70,'Existing Coding pilot unchanged');
assert.equal(COMPLETED_ENGLISH_IMAGE_BOOK_PAGES['EN_NEW_20261109_08'].length,312,'Existing DK image book unchanged');
assert.equal(COMPLETED_ENGLISH_IMAGE_BOOK_PAGES['EN_NEW_20261109_15'].length,96,'Existing Disney image book unchanged');
const english=readFileSync('pages/EnglishLibraryInternalPage.tsx','utf8');
const reader=readFileSync('src/components/RemainingEnglishPhotoBookReader.tsx','utf8');
const image=readFileSync('src/components/ImageBookPages.tsx','utf8');
const dataModule='remainingEnglishImageBooks20261109';
assert.ok(english.includes("React.lazy(() => import('../src/components/RemainingEnglishPhotoBookReader'))"),
  'Load the large manifest only when one of five books is opened');
assert.ok(!english.includes("import { REMAINING_ENGLISH_IMAGE_BOOK_PAGES }"),'Never import the huge manifest in the main catalog');
for(const id of Object.keys(expected))assert.ok(english.includes("'"+id+"'"),'Missing selection for '+id);
assert.ok(reader.includes('imagePages={pages}'),'Render page images in existing Saqr reader');
assert.ok(reader.includes("digitalBookKey('en',book)"),'Use existing reading-progress keys');
assert.ok(image.includes('driveReaderImage'), 'Use same image host with timeout and fallback as Coding');
assert.ok(image.includes('efips-image-book-error') && !image.includes('<iframe'), 'Show internal retry, never an embedded Drive preview');
assert.ok(image.includes('writePdfState'), 'Save reading progress');
assert.ok(image.includes('efips-glass-image-top') && image.includes('efips-glass-image-tools'),
  'All five books share the same glass overlay controls');
console.log('PASS: five photo books, 1,393 pages, lazy loading, glass reader and preserved 77/498 catalog');
