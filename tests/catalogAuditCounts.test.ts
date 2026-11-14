import assert from 'node:assert/strict';
import {bookData} from '../api/bookData.ts';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE} from '../api/digitalBookData.ts';
import {NATIONAL_IDENTITY_DIGITAL_BOOKS} from '../api/nationalIdentityDigitalBooks.ts';
import {nationalIdentityBooks} from '../src/utils/nationalIdentityCatalog.ts';
const physical=bookData.length,arabic=ARABIC_LIBRARY_DATABASE.length,english=ENGLISH_LIBRARY_DATABASE.length,
  nationalDigital=NATIONAL_IDENTITY_DIGITAL_BOOKS.length,nationalPhysical=nationalIdentityBooks.length;
assert.equal(ENGLISH_LIBRARY_DATABASE.length,73,'Only the new English photo collection may be counted');
assert.ok(ENGLISH_LIBRARY_DATABASE.every(book=>/^(?:EN_PH_|EN_DRIVE_)/.test(String(book.id))));
const links=[...ARABIC_LIBRARY_DATABASE,...ENGLISH_LIBRARY_DATABASE,...NATIONAL_IDENTITY_DIGITAL_BOOKS];
const titles=books=>new Set(books.map(b=>String(b.title||'').trim().toLowerCase())).size;
const duplicatedIds=books=>books.length-new Set(books.map(b=>String(b.id))).size;
const summary={
 physical,physicalNational:nationalPhysical,physicalShelf41:bookData.filter(b=>b.shelf===41).length,
 arabicDigital:arabic,englishDigital:english,nationalIdentityDigital:nationalDigital,
 digitalTotal:arabic+english+nationalDigital,
 catalogTotal:physical+arabic+english+nationalDigital,
 digitalUniqueIds:{arabic:arabic-duplicatedIds(ARABIC_LIBRARY_DATABASE),
 english:english-duplicatedIds(ENGLISH_LIBRARY_DATABASE),
 national:nationalDigital-duplicatedIds(NATIONAL_IDENTITY_DIGITAL_BOOKS)},
 distinctTitles:{physical:titles(bookData),nationalPhysical:titles(nationalIdentityBooks),
 arabic:titles(ARABIC_LIBRARY_DATABASE),english:titles(ENGLISH_LIBRARY_DATABASE),
 nationalDigital:titles(NATIONAL_IDENTITY_DIGITAL_BOOKS)},
 digitalLinkCount:links.filter(b=>/^https:\/\//.test(String(b.driveLink||''))).length,
 identitySubsetOfPhysical:nationalIdentityBooks.every(b=>bookData.some(row=>row.id===b.id))
};
if(summary.catalogTotal!==summary.physical+summary.digitalTotal || !summary.identitySubsetOfPhysical)throw Error('Catalog count integrity failed');
assert.equal(duplicatedIds(ENGLISH_LIBRARY_DATABASE),0,'Duplicate English catalog IDs found');
assert.equal(summary.digitalUniqueIds.english,english,'All 73 English book IDs must remain unique');
console.log('EFIPS_CATALOG_AUDIT_RESULT='+JSON.stringify(summary));