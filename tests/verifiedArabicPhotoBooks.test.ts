import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARABIC_LIBRARY_DATABASE} from '../api/digitalBookData.ts';
import {NATIONAL_IDENTITY_DIGITAL_BOOKS} from '../api/nationalIdentityDigitalBooks.ts';
import {VERIFIED_ARABIC_IMAGE_PAGES_A} from '../src/data/verifiedArabicImageBooks20261110A.ts';
import {VERIFIED_ARABIC_IMAGE_PAGES_B} from '../src/data/verifiedArabicImageBooks20261110B.ts';
import {VERIFIED_NATIONAL_IDENTITY_IMAGE_PAGES} from '../src/data/verifiedNationalIdentityImageBooks20261110.ts';

const expected:Record<string,{pages:number;pdf:string}> = {
  AR_41:{pages:199,pdf:'1_4IKkimJy1MmApcRz_0HA9_wKWy6H-Mp'},
  AR_44:{pages:104,pdf:'1l_-lECWoN0C3ARPD70oaD_4Ee3J6wb3p'},
  AR_45:{pages:416,pdf:'1aOHxire8Y9UWIdV6cO0Hc1nw2VWpEBYf'},
  AR_50:{pages:222,pdf:'1manKVHamsvHDO-37IxmecGeKOtKxpJhB'},
  AR_52:{pages:160,pdf:'1A98xA-eWvm8Z_Gktfg-XmSLmT0Xkz9wB'},
  AR_53:{pages:174,pdf:'1X0h06VJmX9BUWhZsDPx6TTGIDdV6YzsK'},
  AR_54:{pages:284,pdf:'1GZpt4CrcZomX4WHyoh6E2HcOdjrDCsBE'},
  AR_55:{pages:172,pdf:'1CwrvdNwi5yPQFvkce_OV_nHy0ipcvi0V'},
  AR_56:{pages:362,pdf:'1ddbyuo2M2dfh-86lM3as1uoYDoB4fz1K'},
  AR_57:{pages:244,pdf:'1ocR16ZTGPIioAOMEMr1BY189jHFP3MJ_'},
  AR_58:{pages:42,pdf:'1m_d_qCj9CIEeAI7d8CDdJ02Yv30odXkE'},
  AR_60:{pages:577,pdf:'1Nr4GIjwLKwfJFYkWzPgOaZMB5_6veZph'},
  NI_1:{pages:97,pdf:'1qmi3qg9qaRqrYyd3owuif0u8caHkZu1-'},
  NI_2:{pages:48,pdf:'1SZx8nBWuokEGGLzN8Kq2PBCKGQi0xA_G'},
  NI_3:{pages:266,pdf:'1BTEwJPbYJG0WHlnT4MtGew1am6SrK9JW'},
  NI_4:{pages:226,pdf:'1KDamhV1sX73vOWAGnlxOKDnLOM4d5ZSc'},
  NI_5:{pages:336,pdf:'1nk_Q5CqC3LaltHgh0t9ZbEGrM6O6wV7q'},
  NI_6:{pages:55,pdf:'1bLlXtIAY2yYEr2x-_-3RIu69a9X7HaNB'},
};
const manifests=[VERIFIED_ARABIC_IMAGE_PAGES_A,VERIFIED_ARABIC_IMAGE_PAGES_B,VERIFIED_NATIONAL_IDENTITY_IMAGE_PAGES];
const pagesById=Object.assign({},...manifests);
assert.deepEqual(Object.keys(pagesById).sort(),Object.keys(expected).sort());
assert.equal(ARABIC_LIBRARY_DATABASE.length,494,'Preserve previous Arabic titles and include six complete additional editions');
assert.equal(NATIONAL_IDENTITY_DIGITAL_BOOKS.length,9,'Do not duplicate heritage books');
let total=0;
for(const [id,meta] of Object.entries(expected)){
 const pages=pagesById[id];
 assert.equal(pages.length,meta.pages,id+' must match original PDF page count');
 assert.deepEqual(pages.map(p=>p.page),Array.from({length:meta.pages},(_,i)=>i+1),id+' page numbers must be contiguous');
 assert.equal(new Set(pages.map(p=>p.fileId)).size,pages.length,id+' has repeated Drive image IDs');
 for(const page of pages)assert.match(page.fileId,/^[A-Za-z0-9_-]{20,}$/,'real Drive image ID');
 const book=(id.startsWith('NI_')?NATIONAL_IDENTITY_DIGITAL_BOOKS:ARABIC_LIBRARY_DATABASE)
   .find(b=>String(b.id)===id);
 assert.ok(book,'Catalog metadata must exist for '+id);
 assert.equal(book.pageCount,meta.pages,'Book pageCount matches verified PDF');
 assert.ok(book.driveLink.includes(meta.pdf),'Preserve the original PDF link as record of source');
 if(id.startsWith('NI_'))assert.ok(['تراث وطني','شعر إماراتي'].includes(book.subject),'Heritage category remains intact');
 total+=pages.length;
}
const page=readFileSync('pages/ArabicLibraryInternalPage.tsx','utf8');
const lazy=readFileSync('src/components/VerifiedArabicPhotoBookReader.tsx','utf8');
const imageReader=readFileSync('src/components/ImageBookPages.tsx','utf8');
assert.ok(page.includes("React.lazy(() => import('../src/components/VerifiedArabicPhotoBookReader'))"),'Images must only load on opening a book');
for(const id of Object.keys(expected))assert.ok(page.includes("'"+id+"'"),id+' is not routed to image reader');
assert.ok(lazy.includes('imagePages={pages}'),'Use original full screen EFIPS image reader');
assert.ok(lazy.includes("digitalBookKey('ar', book)"),'Preserve reading progress and bookmarks');
assert.ok(imageReader.includes('writePdfState') && imageReader.includes('driveReaderImage'),'Keep established reading features');
console.log('PASS:',Object.keys(expected).length,'PDF-verified Arabic/heritage books,',total,'pages, existing full-screen image reader, no duplicate catalogs');
