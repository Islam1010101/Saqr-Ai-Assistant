import assert from 'node:assert/strict';
import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { NATIONAL_IDENTITY_DIGITAL_BOOKS } from '../api/nationalIdentityDigitalBooks.ts';
import { DIGITAL_SERIES_VOLUMES } from '../src/data/digitalSeriesVolumes.js';
import { PHOTO_SERIES_FOLDERS_20261111 } from '../src/data/photoSeriesFolders20261111.js';
import { EXTRA_MAN_OF_IMPOSSIBLE_PHOTO_BOOKS_20261111 } from '../src/data/extraManOfImpossibleCatalog20261111.js';
import { NEW_SERIES_PHOTO_CHUNK_BY_ID } from '../src/data/newSeriesPhotoRouting20261111.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AB } from '../src/data/seriesArabicPhotoPages20261110AB.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AC } from '../src/data/seriesArabicPhotoPages20261110AC.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AD } from '../src/data/seriesArabicPhotoPages20261110AD.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AE } from '../src/data/seriesArabicPhotoPages20261110AE.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AF } from '../src/data/seriesArabicPhotoPages20261110AF.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AG } from '../src/data/seriesArabicPhotoPages20261110AG.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AH } from '../src/data/seriesArabicPhotoPages20261110AH.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AI } from '../src/data/seriesArabicPhotoPages20261110AI.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AJ } from '../src/data/seriesArabicPhotoPages20261110AJ.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AK } from '../src/data/seriesArabicPhotoPages20261110AK.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AL } from '../src/data/seriesArabicPhotoPages20261110AL.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AM } from '../src/data/seriesArabicPhotoPages20261110AM.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AN } from '../src/data/seriesArabicPhotoPages20261110AN.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AO } from '../src/data/seriesArabicPhotoPages20261110AO.ts';
import { SERIES_ARABIC_PHOTO_PAGES_AP } from '../src/data/seriesArabicPhotoPages20261110AP.ts';

const manifests = [SERIES_ARABIC_PHOTO_PAGES_AB,SERIES_ARABIC_PHOTO_PAGES_AC,SERIES_ARABIC_PHOTO_PAGES_AD,SERIES_ARABIC_PHOTO_PAGES_AE,SERIES_ARABIC_PHOTO_PAGES_AF,SERIES_ARABIC_PHOTO_PAGES_AG,SERIES_ARABIC_PHOTO_PAGES_AH,SERIES_ARABIC_PHOTO_PAGES_AI,SERIES_ARABIC_PHOTO_PAGES_AJ,SERIES_ARABIC_PHOTO_PAGES_AK,SERIES_ARABIC_PHOTO_PAGES_AL,SERIES_ARABIC_PHOTO_PAGES_AM,SERIES_ARABIC_PHOTO_PAGES_AN,SERIES_ARABIC_PHOTO_PAGES_AO,SERIES_ARABIC_PHOTO_PAGES_AP];
const allPages = Object.assign({}, ...manifests);
const originals = [...DIGITAL_SERIES_VOLUMES.AR_18.map(volume => 'AR_18-' + volume.fileId),
  ...DIGITAL_SERIES_VOLUMES.AR_43.map(volume => 'AR_43-' + volume.fileId)];
const extraIds = EXTRA_MAN_OF_IMPOSSIBLE_PHOTO_BOOKS_20261111.map(book => book.id);
const expected = [...originals,...extraIds];
assert.equal(originals.length,170,'Preserve original 160 thriller + 10 prophet-book stable IDs');
assert.equal(extraIds.length,25,'Only verified complete distinct special editions should be added');
assert.equal(new Set(expected).size,195,'No duplicate book identity');
assert.deepEqual(Object.keys(PHOTO_SERIES_FOLDERS_20261111).sort(),originals.slice().sort());
assert.deepEqual(Object.keys(NEW_SERIES_PHOTO_CHUNK_BY_ID).sort(),expected.slice().sort());
assert.deepEqual(Object.keys(allPages).sort(),expected.slice().sort());
assert.equal(ARABIC_LIBRARY_DATABASE.length,520,'495 established Arabic records plus 25 verified editions');
assert.equal(ENGLISH_LIBRARY_DATABASE.length,77,'English digital holdings unchanged');
assert.equal(NATIONAL_IDENTITY_DIGITAL_BOOKS.length,9,'National heritage holdings unchanged');
const byId = new Map(ARABIC_LIBRARY_DATABASE.map(book=>[String(book.id),book]));
let total = 0;
for(const id of expected){
  const book=byId.get(id);
  assert.ok(book,'Missing catalog record '+id);
  assert.match(book.driveLink,/^https:\/\/drive\.google\.com\/drive\/folders\/[\w-]+$/,'Old PDF link remained '+id);
  if(id.startsWith('AR_18-')||id.startsWith('AR_43-'))
    assert.equal(book.driveLink,'https://drive.google.com/drive/folders/'+PHOTO_SERIES_FOLDERS_20261111[id]);
  const pages=allPages[id];
  assert.ok(pages?.length,'Missing verified pages '+id);
  assert.equal(new Set(pages.map(p=>p.fileId)).size,pages.length,'Duplicate file '+id);
  for(let i=0;i<pages.length;i++){
    assert.equal(pages[i].page,i+1,'Missing or out-of-order page for '+id);
    assert.match(pages[i].fileId,/^[\w-]+$/,'Invalid Drive image ID '+id);
  }
  if(id.startsWith('AR_IM_'))assert.equal(book.pageCount,pages.length,'Extra edition page count mismatch '+id);
  total+=pages.length;
}
assert.equal(total,14635,'Complete original and special photo pages as verified in Drive');
assert.ok(!extraIds.includes('AR_IM_20261111_11'),'Empty special Baron folder is excluded');
assert.ok(!extraIds.includes('AR_IM_20261111_33'),'One-page incomplete Ice Prisoner folder is excluded');
console.log('PASS: 170 original series volume PDFs replaced with photo sources; 25 complete special editions; 14,635 verified pages in on-site reader');
