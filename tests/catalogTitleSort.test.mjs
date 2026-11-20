import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const helper=read('src/utils/catalogTitleSort.ts');

test('Common sorting helper uses locale-aware Arabic and en-US title comparison',()=>{
 assert.match(helper,/Intl\.Collator\('ar-AE'/);
 assert.match(helper,/Intl\.Collator\('en-US'/);
 assert.match(helper,/compareCatalogTitles/);
 assert.match(helper,/Script=Arabic/);
 assert.doesNotMatch(helper,/bookData\.(?:sort|splice)/);
});

test('The physical book directory shows titles alphabetically in the interface language',()=>{
 const code=read('pages/SearchPage.tsx');
 assert.ok(code.includes('result.sort((a,b)=>compareCatalogTitles(a.title,b.title,currentLocale))'));
 assert.ok(code.includes('matchesCatalogQuery'));
 assert.ok(code.includes('getPhysicalLoanBadge'));
 assert.ok(code.includes("shelfFilter === '22'"));
});

test('All three digital libraries display titles in their book language, without series priority',()=>{
 const ar=read('pages/ArabicLibraryInternalPage.tsx');
 const en=read('pages/EnglishLibraryInternalPage.tsx');
 const heritage=read('pages/NationalIdentityDigitalBooksPage.tsx');
 assert.ok(ar.includes("compareCatalogTitles(a.title,b.title,'ar')"));
 assert.ok(en.includes("compareCatalogTitles(a.title,b.title,'en')"));
 assert.ok(!ar.includes('a.seriesOrder??9999'));
 assert.ok(!en.includes('a.seriesOrder??9999'));
 assert.ok(heritage.includes('ArabicLibraryInternalPage'));
 assert.ok(heritage.includes('NATIONAL_IDENTITY_DIGITAL_BOOKS'));
 assert.ok(ar.includes("sortBy === 'author'"));
 assert.ok(en.includes("sortBy === 'audio'"));
});

test('National Identity print book directory sorts after filtering without mutating the catalog',()=>{
 const identity=read('src/components/NationalIdentityBookCorner.tsx');
 assert.ok(identity.includes('[...searchNationalIdentityBooks(query)].sort((a,b)=>compareCatalogTitles(a.title,b.title,lang))'));
 assert.ok(identity.includes('useAdminCatalogRevision()'));
 assert.ok(identity.includes('books.slice(0,12)'));
});
