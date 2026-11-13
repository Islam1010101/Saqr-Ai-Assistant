import assert from 'node:assert/strict';
import {bookData} from '../api/bookData.ts';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE} from '../api/digitalBookData.ts';
import {NATIONAL_IDENTITY_DIGITAL_BOOKS} from '../api/nationalIdentityDigitalBooks.ts';
import {isSaqrLibrarySearchIntent} from '../src/utils/saqrIntentRouter.ts';
import {searchSaqrBookCatalog,isSaqrNamedAuthorQuery} from '../src/utils/saqrCatalogSearch.ts';
import {isSaqrCatalogLookup,renderSaqrCatalogAnswer} from '../src/utils/saqrCatalogReply.ts';

const catalogs={
 physical:bookData,
 arabic:[...ARABIC_LIBRARY_DATABASE,...NATIONAL_IDENTITY_DIGITAL_BOOKS],
 english:ENGLISH_LIBRARY_DATABASE
};
const authorQueries=[
 'روايات اجاثا كريسيتي',
 'روايات أجاثا كريستي',
 'كتب اجاثا كريستي',
 'Agatha Christie novels'
];
for(const query of authorQueries){
 assert.equal(isSaqrNamedAuthorQuery(query),true,'Recognize the requested novelist: '+query);
 const matches=searchSaqrBookCatalog(query,catalogs,12);
 assert.ok(matches.length>=5,'Return a meaningful selection from actual school holdings: '+query);
 assert.ok(matches.every(book=>/اجاثا\s+كريستي|agatha\s+christie/i.test((book.author+' '+(book.series||''))
    .replace(/[أإآٱ]/g,'ا'))),'Do not include unrelated genres/children books: '+query);
 assert.ok(matches.every(book=>book.driveLink||Number.isFinite(book.shelf)),
  'Every recommendation must exist in the physical or digital catalogue: '+query);
 const answer=renderSaqrCatalogAnswer(query,matches,'ar');
 assert.match(answer,/المكتبة الرقمية العربية/);
 assert.doesNotMatch(answer,/Disney|Great Golf Stories|أدب الأطفال|رصاصة في الرأس.*غير موجود/);
 assert.doesNotMatch(answer,/الكتب الورقية\s+لا توجد نتائج|المكتبة الرقمية الإنجليزية\s+لا توجد نتائج/,
  'Do not clutter author results with empty collection sections');
}
assert.equal(isSaqrLibrarySearchIntent('روايات اجاثا كريسيتي'),true);
assert.equal(isSaqrCatalogLookup('روايات اجاثا كريسيتي'),true);
assert.equal(isSaqrLibrarySearchIntent('ابحث عن هاري بوتر'),true,
 'An explicit named-title lookup must work without the word book');
assert.equal(isSaqrCatalogLookup('ابحث عن هاري بوتر'),true);
const hp=searchSaqrBookCatalog('ابحث عن هاري بوتر',catalogs,20);
const arabicHp=hp.filter(book=>book.pageLocation.includes('العربية'));
assert.ok(arabicHp.length>=7,'All seven recorded Arabic Harry Potter volumes must be discoverable');
assert.ok(arabicHp.every(book=>/هاري\s+بوتر/.test(book.title+' '+(book.series||''))));
const hpReply=renderSaqrCatalogAnswer('ابحث عن هاري بوتر',hp,'ar');
assert.match(hpReply,/هاري بوتر وحجر الفيلسوف/);
assert.match(hpReply,/فتح الكتاب الرقمي/);
assert.doesNotMatch(hpReply,/لم أعثر على نتيجة مؤكدة/);
assert.equal(isSaqrLibrarySearchIntent('تحدي المؤلف الصغير'),false,
 'Creative-writing requests must never trigger the library search');
console.log('PASS: author-specific Christie results are clean; all seven Arabic Harry Potter books are discoverable');
