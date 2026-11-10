import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {NEW_PHOTO_ONLY_ARABIC_BOOKS} from '../src/data/photoOnlyArabicCatalog20261110.ts';
import {VERIFIED_HARRY_POTTER_ARABIC_PAGES_A} from '../src/data/photoOnlyHarryPotter20261110A.ts';
import {VERIFIED_HARRY_POTTER_ARABIC_PAGES_B} from '../src/data/photoOnlyHarryPotter20261110B.ts';
import {VERIFIED_NG_PAGES_A} from '../src/data/photoOnlyNationalGeographic20261110A.ts';
import {VERIFIED_NG_PAGES_B} from '../src/data/photoOnlyNationalGeographic20261110B.ts';
import {VERIFIED_NG_PAGES_C} from '../src/data/photoOnlyNationalGeographic20261110C.ts';
import {VERIFIED_NEW_UAE_HERITAGE_PAGES} from '../src/data/photoOnlyNewHeritage20261110.ts';
import {digitalReaderSource} from '../src/utils/digitalReaderSource.ts';
const modal=readFileSync('pages/ArabicLibraryInternalPage.tsx','utf8');
const wrapper=readFileSync('src/components/PhotoOnlyArabicBookReader.tsx','utf8');
const reader=readFileSync('src/components/DigitalBookReader.tsx','utf8');
const images=Object.assign({},VERIFIED_HARRY_POTTER_ARABIC_PAGES_A,VERIFIED_HARRY_POTTER_ARABIC_PAGES_B,
 VERIFIED_NG_PAGES_A,VERIFIED_NG_PAGES_B,VERIFIED_NG_PAGES_C,VERIFIED_NEW_UAE_HERITAGE_PAGES);
assert.equal(NEW_PHOTO_ONLY_ARABIC_BOOKS.length,39);
assert.ok(modal.includes('const hasInternalReader = isPhotoOnlyBook'),'Photo-only source must be allowed internal read route');
assert.ok(modal.includes('{hasInternalReader ? (<button type="button" onClick={() => setReaderOpen(true)}'),'Read button must open modal, not external Drive folder');
assert.ok(modal.includes('if (isPhotoOnlyBook) {'),'Modal reader route must use exact same photo predicate');
assert.ok(wrapper.includes('imagePages={pages}'),'Photo-only reader must supply verified JPEG pages');
assert.ok(reader.includes('imagePages?.length ? <ImageBookPages'),'EFIPS image reader must render actual page images');
for(const b of NEW_PHOTO_ONLY_ARABIC_BOOKS) {
 assert.match(String(b.id),/^(?:AR_PH_HP_|AR_NG_|NI_PH_)/);
 assert.ok(b.driveLink.includes('/drive/folders/'),'Photo-only books are stored as Drive folders');
 assert.equal(digitalReaderSource(b.driveLink),null,'Drive folder links must never be embedded as PDF preview');
 assert.ok(images[String(b.id)]?.length,'Image manifest missing for '+b.title);
}
console.log('PASS: 39 photo-only Arabic and UAE books open EFIPS internal image viewer, never Drive folder');
