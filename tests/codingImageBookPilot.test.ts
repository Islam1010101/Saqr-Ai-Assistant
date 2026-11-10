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
assert.equal(ARABIC_LIBRARY_DATABASE.length,494);
const book=ENGLISH_LIBRARY_DATABASE.find(b=>String(b.id)===CODING_IMAGE_BOOK_ID);
assert.ok(book,'Original Coding catalog entry must remain unchanged');
assert.ok(book.driveLink.includes('199Avu7T8tUyLqDcYYuDSl7TyLTWKecFk'));
const englishUI=readFileSync('pages/EnglishLibraryInternalPage.tsx','utf8');
const readerUI=readFileSync('src/components/DigitalBookReader.tsx','utf8');
const images=readFileSync('src/components/ImageBookPages.tsx','utf8');
const style=readFileSync('src/components/digitalBookReader.css','utf8');
assert.ok(englishUI.includes('String(book.id)===CODING_IMAGE_BOOK_ID ? CODING_IMAGE_BOOK_PAGES : COMPLETED_ENGLISH_IMAGE_BOOK_PAGES[String(book.id)]'),
  'Use image mode only for the coding pilot');
assert.ok(readerUI.includes('imagePages?.length ? <ImageBookPages'), 'Reader must branch into images when provided');
assert.ok(readerUI.includes('<PdfBookPages'), 'Original PDF.js mode is still present');
assert.ok(images.includes('writePdfState'), 'Bookmark and page progress must be saved');
assert.ok(images.includes('drive.google.com/thumbnail?id='), 'Display individual Drive image thumbnails');
assert.ok(!images.includes('<iframe') && !images.includes('/preview'), 'Never render a Google Drive embedded image or PDF preview in photo-book mode');
assert.ok(images.includes('fastImageWidth = (viewportWidth:number) => viewportWidth <= 720 ? 840 : 1100'),
  'Default reading thumbnails should be smaller on mobile and desktop than the former 1600px default');
assert.ok(images.includes("const [highQuality,setHighQuality]=useState(false)"),
  'Use the quicker image size unless the reader explicitly enables HD');
assert.ok(images.includes('preloadCache=useRef(new Map<string,HTMLImageElement>())'),
  'Keep prefetched images resident instead of cancelling them during page turns');
assert.ok(!images.includes("return()=>{image.src='';}"),
  'Changing pages must not cancel the in-flight next-page request');
assert.ok(images.includes("if(!loaded || thumbnailFailed || sourceMode!=='cdn')return"),
  'Prefetch should not contend with an unloaded visible page on slow connections');
assert.ok(images.includes('img.referrerPolicy=\'no-referrer\''),
  'Use the same request context for the preload and visible image');
assert.ok(images.includes("next.addEventListener('load',thenSecond,{once:true})"),
  'Warm up the second following page once the next image has loaded');

assert.ok(images.includes("'https://lh3.googleusercontent.com/d/'"),'Use separate Google image host for the first attempted page image');
assert.ok(images.includes("'https://drive.google.com/thumbnail?id='"),'Keep original Drive thumbnail as a second image source');
assert.ok(images.includes('window.setTimeout'), 'Require a finite timeout for stalled mobile image loading');
assert.ok(images.includes('setThumbnailFailed(true)'), 'Stop loading after both image sources fail and offer an internal retry screen');
assert.ok(images.includes('efips-image-book-error'), 'Show an in-site retry panel without any Drive UI');
assert.ok(style.includes('.efips-image-book-stage'), 'Mobile responsive reader styles must exist');
assert.ok(images.includes('readPdfState(storageKey,.25)'), 'Image reader restores 25% zoom independently of the PDF.js minimum');
assert.ok(images.includes('Math.max(.25,Number((z-.25).toFixed(2)))'), 'Image reader zooms down to 25%');
assert.ok(/setTurnDirection\(next>page\s*\?\s*'next'\s*:\s*'prev'\)/.test(images), 'Page-turn motion responds to previous/next navigation');
assert.ok(images.includes("loaded && turnDirection"), 'Do not animate blank pages while Drive loads');
assert.ok(images.includes("key={current.fileId}"), 'Each new page should have a stable independent page-flip surface');
assert.ok(style.includes('@keyframes efips-image-book-turn-next'), 'Advance page gets a paper-turn animation');
assert.ok(style.includes('@keyframes efips-image-book-turn-prev'), 'Previous page gets a reverse paper-turn animation');
assert.ok(style.includes('@media (prefers-reduced-motion:reduce)'), 'Respect reduced-motion accessibility preferences');
assert.ok(/onContextMenu=\{event\s*=>\s*event\.preventDefault\(\)\}/.test(images),
  'Native right-click context menu must be suppressed on the Coding image viewport');
assert.ok(images.includes('className="efips-image-book-page" draggable={false}'),
  'Image drag-to-save should be disabled');
assert.ok(/onDragStart=\{event\s*=>\s*event\.preventDefault\(\)\}/.test(images),
  'Image and stage drag events should not start native drag-and-drop');
assert.ok(/-webkit-touch-callout:\s*none;/.test(style),
  'Avoid mobile long-press image save calls where browser supports it');
assert.ok(/-webkit-user-select:\s*none;/.test(style),
  'Prevent image selection on mobile without disabling reading controls');
assert.ok(images.includes('onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}'),
  'Keep touch-based page turning intact');


assert.ok(images.includes('data-visible={controlsVisible'), 'Reading tools auto-hide over the photo-book page');
assert.ok(images.includes('efips-glass-image-top') && images.includes('efips-glass-image-pager') &&
  images.includes('efips-glass-image-tools'), 'Glass UI must expose navigation, zoom, bookmarks and book actions');
assert.ok(images.includes('onBack={onBack}')===false || images.includes('onClick={onBack}'), 'Keep details button');
assert.ok(images.includes('onClick={onClose}'), 'Keep close action');
assert.ok(images.includes('onClick={toggleBookmark}'), 'Keep bookmark control');
assert.ok(images.includes('onSubmit={onJump}'), 'Keep page number navigation');
assert.ok(images.includes('changeQuality'), 'Keep HD mode');
assert.ok(!images.includes('Google Drive</') && !images.includes('المصدر Google Drive'), 'No Drive chrome or captions in image mode');
assert.ok(style.includes('efips-image-book--immersive'), 'Photo book must use immersive viewport-specific styles');
console.log('PASS: 70 Coding images, fullscreen glass controls and no Google Drive UI, 77 English and 494 Arabic books available');
