import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARABIC_LIBRARY_DATABASE} from '../api/digitalBookData.ts';
import {NATIONAL_IDENTITY_DIGITAL_BOOKS} from '../api/nationalIdentityDigitalBooks.ts';
import {NEW_PHOTO_ONLY_ARABIC_BOOKS} from '../src/data/photoOnlyArabicCatalog20261110.ts';
import {VERIFIED_HARRY_POTTER_ARABIC_PAGES_A} from '../src/data/photoOnlyHarryPotter20261110A.ts';
import {VERIFIED_HARRY_POTTER_ARABIC_PAGES_B} from '../src/data/photoOnlyHarryPotter20261110B.ts';
import {VERIFIED_NG_PAGES_A} from '../src/data/photoOnlyNationalGeographic20261110A.ts';
import {VERIFIED_NG_PAGES_B} from '../src/data/photoOnlyNationalGeographic20261110B.ts';
import {VERIFIED_NG_PAGES_C} from '../src/data/photoOnlyNationalGeographic20261110C.ts';
import {VERIFIED_NEW_UAE_HERITAGE_PAGES} from '../src/data/photoOnlyNewHeritage20261110.ts';

const full=Object.assign({},VERIFIED_HARRY_POTTER_ARABIC_PAGES_A,VERIFIED_HARRY_POTTER_ARABIC_PAGES_B,
 VERIFIED_NG_PAGES_A,VERIFIED_NG_PAGES_B,VERIFIED_NG_PAGES_C,VERIFIED_NEW_UAE_HERITAGE_PAGES);
assert.equal(NEW_PHOTO_ONLY_ARABIC_BOOKS.length,39);
assert.equal(ARABIC_LIBRARY_DATABASE.length,497,'Keep the original 488 records plus 5 nonduplicate additional Arabic editions');
assert.equal(NATIONAL_IDENTITY_DIGITAL_BOOKS.length,9,'Keep 6 original heritage records, plus 3 verified new titles');
assert.deepEqual(Object.keys(full).sort(),NEW_PHOTO_ONLY_ARABIC_BOOKS.map(b=>String(b.id)).sort());
assert.equal(new Set(NEW_PHOTO_ONLY_ARABIC_BOOKS.map(b=>b.id)).size,39);
assert.equal(NEW_PHOTO_ONLY_ARABIC_BOOKS.filter(b=>String(b.id).startsWith('AR_PH_HP_')).length,7);
assert.equal(NEW_PHOTO_ONLY_ARABIC_BOOKS.filter(b=>String(b.id).startsWith('AR_NG_')).length,29);
assert.equal(NEW_PHOTO_ONLY_ARABIC_BOOKS.filter(b=>String(b.id).startsWith('NI_PH_')).length,3);
let total=0;
for(const book of NEW_PHOTO_ONLY_ARABIC_BOOKS){
  const id=String(book.id),pages=full[id];
  assert.ok(book.title.trim() && book.author.trim() && book.publisher?.trim()
    && book.bio.trim() && book.summary.trim() && book.subject.trim(),id+' needs complete bibliographic metadata');
  assert.equal(pages.length,book.pageCount,id+' page count');
  assert.deepEqual(pages.map(p=>p.page),Array.from({length:pages.length},(_,i)=>i+1),id+' must be sequential 1..N');
  assert.equal(new Set(pages.map(p=>p.fileId)).size,pages.length,id+' repeated Drive file');
  assert.ok(book.driveLink.startsWith('https://drive.google.com/drive/folders/'));
  assert.ok(pages.every(p=>/^[A-Za-z0-9_-]{20,}$/.test(p.fileId)));
  const catalog=id.startsWith('NI_PH_')?NATIONAL_IDENTITY_DIGITAL_BOOKS:ARABIC_LIBRARY_DATABASE;
  assert.ok(catalog.find(b=>b.id===id),id+' missing from library');
  total+=pages.length;
}
const arabic=readFileSync('pages/ArabicLibraryInternalPage.tsx','utf8');
const lazy=readFileSync('src/components/PhotoOnlyArabicBookReader.tsx','utf8');
const shared=readFileSync('src/components/ImageBookPages.tsx','utf8');
assert.ok(arabic.includes("React.lazy(() => import('../src/components/PhotoOnlyArabicBookReader'))"));
assert.ok(lazy.includes('imagePages={pages}') && lazy.includes("digitalBookKey('ar',book)"));
assert.ok(shared.includes('writePdfState') && shared.includes('driveReaderImage'));
console.log('PASS:',NEW_PHOTO_ONLY_ARABIC_BOOKS.length,'new photo books,',total,'verified pages, summaries and bibliography, Saqr search catalogs retained');
