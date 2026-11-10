import assert from 'node:assert/strict';
import { ENGLISH_LIBRARY_DATABASE, ARABIC_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { EXTRA_ENGLISH_DIGITAL_BOOKS_20261109 } from '../src/data/extraEnglishDigitalBooks20261109.ts';
import { searchSaqrBookCatalog } from '../src/utils/saqrCatalogSearch.ts';
const expected=new Set(['EN_NEW_20261109_15','EN_NEW_20261109_16','EN_NEW_20261109_17','EN_NEW_20261109_18','EN_NEW_20261109_19','EN_NEW_20261109_20','EN_NEW_20261109_21','EN_NEW_20261109_22','EN_NEW_20261109_23']);
const extra=ENGLISH_LIBRARY_DATABASE.filter(book=>expected.has(String(book.id)));
assert.equal(EXTRA_ENGLISH_DIGITAL_BOOKS_20261109.length,9);
assert.equal(extra.length,9,'All nine titles must be present in the catalog');
assert.equal(ENGLISH_LIBRARY_DATABASE.length,77,'Keep original 68 plus 9 supplementary editions');
assert.equal(ARABIC_LIBRARY_DATABASE.length,488,'Never alter the Arabic books');
assert.equal(new Set(ENGLISH_LIBRARY_DATABASE.map(book=>String(book.id))).size,77);
for(const book of extra){
  assert.ok(book.title&&book.author&&book.subject&&book.summary&&book.driveLink);
  assert.equal(book.requiresSchoolGoogleAccess,true,'Only authenticated school Drive preview permitted');
  assert.equal(book.reviewStatus,'pending','Download restrictions and copy rights are not independently verified by the connector');
  assert.match(book.driveLink,/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view$/);
  const results=searchSaqrBookCatalog(book.title,{physical:[],arabic:[],english:ENGLISH_LIBRARY_DATABASE});
  assert.ok(results.some(result=>result.driveLink===book.driveLink),
    'Saqr must find the exact book only after publication: '+book.title);
}
const catKid=extra.filter(b=>b.series==='Cat Kid Comic Club').sort((a,b)=>(a.seriesOrder||0)-(b.seriesOrder||0));
assert.deepEqual(catKid.map(b=>b.seriesOrder),[1,2,4],'Preserve Cat Kid book order (no invented book 3)');
assert.ok(catKid.every(b=>b.author==='Dav Pilkey'&&b.subject==='Graphic Novels & Humor'));
console.log('PASS: nine supplementary English editions, initial 68 unchanged, Saqr search and school-only Drive preview metadata');
