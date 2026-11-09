import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CODING_IMAGE_BOOK_ID, CODING_IMAGE_BOOK_PAGES, CODING_IMAGE_BOOK_FOLDER_ID } from '../src/data/codingImageBookPilot.ts';
import { ENGLISH_LIBRARY_DATABASE, ARABIC_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
assert.equal(CODING_IMAGE_BOOK_ID,'EN_NEW_20261109_17');
assert.equal(CODING_IMAGE_BOOK_FOLDER_ID,'1z5ZUJZ4hlzGEFp9DQ3WDP1w1avpjO-Wg');
assert.equal(CODING_IMAGE_BOOK_PAGES.length,70,'All observed Coding JPEG pages 1..70 are present');
assert.deepEqual(CODING_IMAGE_BOOK_PAGES.map(item=>item.page),Array.from({length:70},(_,i)=>i+1));
assert.equal(new Set(CODING_IMAGE_BOOK_PAGES.map(item=>item.fileId)).size,70);
for(const image of CODING_IMAGE_BOOK_PAGES)assert.match(image.fileId,/^[A-Za-z0-9_-]{20,}$/);
assert.equal(ENGLISH_LIBRARY_DATABASE.length,77);
assert.equal(ARABIC_LIBRARY_DATABASE.length,452);
const book=ENGLISH_LIBRARY_DATABASE.find(b=>String(b.id)===CODING_IMAGE_BOOK_ID);
assert.ok(book,'Original Coding catalog entry must remain unchanged');
assert.ok(book.driveLink.includes('199Avu7T8tUyLqDcYYuDSl7TyLTWKecFk'));
const englishUI=readFileSync('pages/EnglishLibraryInternalPage.tsx','utf8');
const readerUI=readFileSync('src/components/DigitalBookReader.tsx','utf8');
const images=readFileSync('src/components/ImageBookPages.tsx','utf8');
const style=readFileSync('src/components/digitalBookReader.css','utf8');
assert.ok(englishUI.includes('String(book.id)===CODING_IMAGE_BOOK_ID ? CODING_IMAGE_BOOK_PAGES : undefined'),
  'Use image mode only for the coding pilot');
assert.ok(readerUI.includes('imagePages?.length ? <ImageBookPages'), 'Reader must branch into images when provided');
assert.ok(readerUI.includes('<PdfBookPages'), 'Original PDF.js mode is still present');
assert.ok(images.includes('writePdfState'), 'Bookmark and page progress must be saved');
assert.ok(images.includes('drive.google.com/thumbnail?id='), 'Display individual Drive image thumbnails');
assert.ok(images.includes('drive.google.com/file/d/'), 'Single-page preview fallback for blocked image thumbnails');
assert.ok(images.includes('fastImageWidth = (viewportWidth:number) => viewportWidth <= 720 ? 840 : 1100'),
  'Default reading thumbnails should be smaller on mobile and desktop than the former 1600px default');
assert.ok(images.includes("const [highQuality,setHighQuality]=useState(false)"),
  'Use the quicker image size unless the reader explicitly enables HD');
assert.ok(images.includes('preloadCache=useRef(new Map<string,HTMLImageElement>())'),
  'Keep prefetched images resident instead of cancelling them during page turns');
assert.ok(!images.includes("return()=>{image.src='';}"),
  'Changing pages must not cancel the in-flight next-page request');
assert.ok(images.includes('if(!loaded || thumbnailFailed)return'),
  'Prefetch should not contend with an unloaded visible page on slow connections');
assert.ok(images.includes('img.referrerPolicy=\'no-referrer\''),
  'Use the same request context for the preload and visible image');
assert.ok(images.includes("next.addEventListener('load',thenSecond,{once:true})"),
  'Warm up the second following page once the next image has loaded');

assert.ok(images.includes("'https://lh3.googleusercontent.com/d/'"),'Use separate Google image host for the first attempted page image');
assert.ok(images.includes("'https://drive.google.com/thumbnail?id='"),'Keep original Drive thumbnail as a second image source');
assert.ok(images.includes('window.setTimeout'), 'Require a finite timeout for stalled mobile image loading');
assert.ok(images.includes('setThumbnailFailed(true)'), 'Show single-image Drive preview when both sources are unavailable');
assert.ok(images.includes('className="efips-image-book-quick-preview"'), 'Let readers bypass slow image loading');
assert.ok(style.includes('.efips-image-book-stage'), 'Mobile responsive reader styles must exist');
console.log('PASS: 70 sequential coding image pages, internal EFIPS image reader, unchanged 77 English and 452 Arabic books');
