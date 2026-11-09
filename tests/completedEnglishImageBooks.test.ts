import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COMPLETED_ENGLISH_IMAGE_BOOK_PAGES,COMPLETED_ENGLISH_IMAGE_BOOK_COUNTS} from '../src/data/completedEnglishImageBooks20261109.ts';
import {ENGLISH_LIBRARY_DATABASE,ARABIC_LIBRARY_DATABASE} from '../api/digitalBookData.ts';
import {CODING_IMAGE_BOOK_ID,CODING_IMAGE_BOOK_PAGES} from '../src/data/codingImageBookPilot.ts';

// These two Drive photo-book folders have complete, strictly sequential JPEG pages.
const expected:Record<string,{count:number;pdfId:string}> = {
  EN_NEW_20261109_08:{count:312,pdfId:'1'},
  EN_NEW_20261109_15:{count:96,pdfId:'1DaMllJU2OKeznGEJTH_eiRE-CLvOqCRQ'}
};
assert.deepEqual(Object.keys(COMPLETED_ENGLISH_IMAGE_BOOK_PAGES).sort(),Object.keys(expected).sort(),
  'Only the two completed books are enabled in image mode');
for(const [bookId,info] of Object.entries(expected)){
  const pages=COMPLETED_ENGLISH_IMAGE_BOOK_PAGES[bookId];
  assert.ok(pages,'Missing completed photo book: '+bookId);
  assert.equal(pages.length,info.count,bookId+' must contain its full contiguous JPEG page sequence');
  assert.equal(COMPLETED_ENGLISH_IMAGE_BOOK_COUNTS[bookId],info.count);
  assert.deepEqual(pages.map(p=>p.page),Array.from({length:info.count},(_,i)=>i+1),
    bookId+' must have no gaps or duplicates in page numbering');
  assert.equal(new Set(pages.map(p=>p.fileId)).size,info.count);
  for(const {fileId} of pages)assert.match(fileId,/^[A-Za-z0-9_-]{20,}$/);
  const catalog=ENGLISH_LIBRARY_DATABASE.find(book=>String(book.id)===bookId);
  assert.ok(catalog,'Existing English catalog card must remain');
  assert.equal(catalog.requiresSchoolGoogleAccess,true);
  if(bookId==='EN_NEW_20261109_15')assert.ok(catalog.driveLink.includes(info.pdfId));
}
assert.equal(ENGLISH_LIBRARY_DATABASE.length,77,'Do not create duplicate English catalog records');
assert.equal(ARABIC_LIBRARY_DATABASE.length,452,'Never change the Arabic library');
assert.equal(CODING_IMAGE_BOOK_ID,'EN_NEW_20261109_17');
assert.equal(CODING_IMAGE_BOOK_PAGES.length,70,'The existing Coding pilot remains unchanged');
const ui=readFileSync('pages/EnglishLibraryInternalPage.tsx','utf8');
const reader=readFileSync('src/components/ImageBookPages.tsx','utf8');
assert.ok(ui.includes('COMPLETED_ENGLISH_IMAGE_BOOK_PAGES[String(book.id)]'));
assert.ok(ui.includes('String(book.id)===CODING_IMAGE_BOOK_ID ? CODING_IMAGE_BOOK_PAGES'));
assert.ok(reader.includes('onContextMenu={event => event.preventDefault()}'),
  'Existing simple right-click suppression must apply to the two completed books');
assert.ok(reader.includes('Math.max(.25,Number((z-.25).toFixed(2)))'), 'Retain 25% zoom');
assert.ok(reader.includes('efips-image-book-sheet--'), 'Retain page turn animation');
assert.ok(reader.includes('writePdfState'), 'Retain bookmarks and progress');
console.log('PASS: DK 312 pages and Disney 96 pages complete, isolated to image reader without catalog changes');
