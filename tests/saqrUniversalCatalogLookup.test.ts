import assert from 'node:assert/strict';
import {bookData} from '../api/bookData.ts';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE} from '../api/digitalBookData.ts';
import {NATIONAL_IDENTITY_DIGITAL_BOOKS} from '../api/nationalIdentityDigitalBooks.ts';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
import {catalogBookMatchesEntity,isSaqrExplicitNamedCatalogRequest,resolveSaqrCatalogEntity} from '../src/utils/saqrCatalogEntitySearch.ts';
import {isSaqrLibrarySearchIntent} from '../src/utils/saqrIntentRouter.ts';
import {renderSaqrCatalogAnswer} from '../src/utils/saqrCatalogReply.ts';

const catalogs={physical:bookData,arabic:[...ARABIC_LIBRARY_DATABASE,...NATIONAL_IDENTITY_DIGITAL_BOOKS],english:ENGLISH_LIBRARY_DATABASE};
const keys=new Set([
  ...bookData.map(book=>book.title+'|'+book.author),
  ...catalogs.arabic.map(book=>book.title+'|'+book.author),
  ...catalogs.english.map(book=>book.title+'|'+book.author)
]);
function verify(query:string,kind:'author'|'title',atLeast=1){
 const entity=resolveSaqrCatalogEntity(query,catalogs);
 assert.ok(entity,'Catalogue must recognize a recorded author or title: '+query);
 assert.equal(entity.kind,kind,'Expected '+kind+' lookup: '+query);
 const found=searchSaqrBookCatalog(query,catalogs,30);
 assert.ok(found.length>=atLeast,'Expected catalog books for '+query);
 for(const book of found){
   assert.ok(keys.has(book.title+'|'+book.author),'Never fabricate a library book: '+book.title);
   assert.ok(catalogBookMatchesEntity(book,entity),
     'Do not inject unrelated category/summary matches: '+book.title+' for '+query);
 }
 return found;
}
// Actual, distinct authors across the physical, Arabic and English catalogs.
verify('مؤلفات نجيب محفوظ','author');
verify('روايات أحمد خالد توفيق','author');
verify('روايات أجاثا كريسيتي','author',5); // Typo in a real author name
verify('Agatha Christie novels','author');
verify('books by William Shakespeare','author');
verify('books by Dav Pilkey','author');
verify('books by Craig Hickman','author'); // Recorded middle initial is optional
verify('مؤلفات محفوظ','author'); // Exact distinctive author surname
// Titles, digitized series, stand-alone works and physical shelves.
const harry=verify('ابحث عن هاري بوتر','title',7);
assert.ok(harry.filter(b=>b.pageLocation.includes('العربية')).length>=7);
verify('ابحث عن أرض النفاق','title');
verify('find Creating Excellence','title');
verify('ابحث عن Secrecy','title');
verify('ابحث عن Macbeth','title');
verify('find Cat Kid Comic Club','title');
verify('ابحث عن محمد بن زايد القائد الاستثنائي','title');
const agatha=verify('روايات اجاثا كريسيتي','author',5);
const names=agatha.map(x=>x.title).join(' | ');
assert.doesNotMatch(names,/Disney|Great Golf Stories|Anthology of Elizabethan|أدب الأطفال/i);
assert.match(renderSaqrCatalogAnswer('روايات اجاثا كريسيتي',agatha,'ar'),/المكتبة الرقمية العربية/);
// Cross-script matching works from the stored names, not lists of special-case authors.
const cross=verify('Agatha Christie novels','author');
assert.ok(cross.some(b=>b.pageLocation.includes('العربية')),'English author name finds matching Arabic editions');
assert.ok(cross.some(b=>b.pageLocation.includes('الإنجليزية')),'Same query finds catalogued English editions');
assert.equal(isSaqrLibrarySearchIntent('Agatha Christie novels'),true);
assert.equal(isSaqrExplicitNamedCatalogRequest('ابحث عن نجيب محفوظ'),true);
assert.equal(resolveSaqrCatalogEntity('كتب عن الفضاء',catalogs),null,'Topic requests remain broad topic searches');
assert.equal(resolveSaqrCatalogEntity('كتب عن تاريخ الإمارات',catalogs),null);
assert.equal(resolveSaqrCatalogEntity('كتب بقلم مؤلف غير موجود تمامًا',catalogs),null,
  'Unknown author names must not be silently treated as verified holdings');
assert.equal(isSaqrLibrarySearchIntent('تحدي المؤلف الصغير'),false,
  'Creative-writing requests stay outside the catalog path');
console.log('PASS: universal EFIPS catalog matching across real Arabic, English and physical titles/authors');
