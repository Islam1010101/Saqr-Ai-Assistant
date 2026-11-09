import assert from 'node:assert/strict';
import { ENGLISH_LIBRARY_DATABASE, ARABIC_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { EXTRA_ENGLISH_DIGITAL_BOOKS_20261109 } from '../src/data/extraEnglishDigitalBooks20261109.ts';
import { searchSaqrBookCatalog } from '../src/utils/saqrCatalogSearch.ts';
const expected=new Set(['EN_NEW_20261109_15','EN_NEW_20261109_16','EN_NEW_20261109_17','EN_NEW_20261109_18']);
const extra=ENGLISH_LIBRARY_DATABASE.filter(book=>expected.has(String(book.id)));
assert.equal(EXTRA_ENGLISH_DIGITAL_BOOKS_20261109.length,4);
assert.equal(extra.length,4,'All four titles must be ready in the catalog preview');
assert.equal(ENGLISH_LIBRARY_DATABASE.length,72,'Never overwrite 68 previously published records');
assert.equal(ARABIC_LIBRARY_DATABASE.length,452,'Never alter the Arabic books');
assert.equal(new Set(ENGLISH_LIBRARY_DATABASE.map(book=>String(book.id))).size,72);
for(const book of extra){
  assert.ok(book.title&&book.author&&book.subject&&book.summary&&book.driveLink);
  assert.equal(book.requiresSchoolGoogleAccess,true,'Only authenticated school Drive preview permitted');
  assert.equal(book.reviewStatus,'pending','Local download restrictions must be verified before publishing');
  assert.match(book.driveLink,/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view$/);
  const results=searchSaqrBookCatalog(book.title,{physical:[],arabic:[],english:ENGLISH_LIBRARY_DATABASE});
  assert.ok(results.some(result=>result.driveLink===book.driveLink),
    'Saqr must find the exact book only after publication: '+book.title);
}
console.log('PASS: four new titles staged, previous 68 unchanged, Saqr search and school-only preview metadata');
