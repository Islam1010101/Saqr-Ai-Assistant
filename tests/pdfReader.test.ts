import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { DIGITAL_SERIES_VOLUMES } from '../src/data/digitalSeriesVolumes.js';
import './newSeriesPhotoCoverage20261111.test.ts';

import { readerByteRange, readerFileId, readPublicPdfRange, PdfSourceError, publicDownloadConfirmation } from '../src/server/digitalBookPdf.ts';
import { clampPdfPage, parsePdfPage, pdfReadingStorageKey, readPdfState, writePdfState } from '../src/utils/pdfReadingState.ts';
import { fetchPdfBootstrap, fetchPdfByteRange, PDF_BYTE_CHUNK } from '../src/utils/pdfRangeTransport.ts';

// Vercel's production Node ESM runtime does not rewrite literal .ts import paths.
// The previous deployment failed with ERR_MODULE_NOT_FOUND for digitalSeriesVolumes.ts.
assert.doesNotMatch(readFileSync('api/digitalBookData.ts','utf8'),
  /from\\s*['"][^'"]+\\.ts['"]/, 'Runtime imports must resolve to compiled .js files');
console.log('PASS: Vercel server import paths reference emitted JavaScript, not missing TypeScript sources');

// Regression: a folder link must not masquerade as a PDF; all series volumes are direct files.
const allDigitalBooks = [...ARABIC_LIBRARY_DATABASE,...ENGLISH_LIBRARY_DATABASE];
assert.equal(Object.keys(DIGITAL_SERIES_VOLUMES).length,9);
assert.equal(Object.values(DIGITAL_SERIES_VOLUMES).reduce((sum,books)=>sum+books.length,0),402);
assert.equal(ARABIC_LIBRARY_DATABASE.length,502);
assert.equal(ARABIC_LIBRARY_DATABASE.filter(b=>b.title==='الأعمال الكاملة للشاعر صلاح جاهين').length,1,'Do not duplicate the original photographed Salah Jahin book');
assert.equal(ENGLISH_LIBRARY_DATABASE.length,73,'Use the current verified English photo catalog only');
assert.ok(ENGLISH_LIBRARY_DATABASE.every(b=>/^(?:EN_PH_|EN_DRIVE_)/.test(String(b.id))&&b.photoBatch),'No legacy English PDF books can enter the official index');
assert.equal(allDigitalBooks.length,575); // 502 Arabic + 73 English (national identity digital is separate).
assert.ok(allDigitalBooks.every(b=>/^https:\/\/drive\.google\.com\/(?:file\/d\/|drive\/folders\/)/.test(b.driveLink)),
  'All books need a real school Drive file or photo-folder source');
assert.equal(ARABIC_LIBRARY_DATABASE.filter(b=>Boolean(b.audioId)).length,23,'Keep all original audio summaries');
assert.ok(allDigitalBooks.every(b=>Boolean(b.readingAudience)),'Every digital volume needs a suggested reading group');
const greenVolume = ARABIC_LIBRARY_DATABASE.find(b=>b.series==='المكتبة الخضراء للأطفال');
assert.ok(greenVolume);
assert.equal(greenVolume.readingAudience,'children');
assert.equal(readerFileId('digital:ar:'+greenVolume.id), greenVolume.driveLink.match(/\/file\/d\/([^/]+)/)?.[1]);
const currentEnglishBook = ENGLISH_LIBRARY_DATABASE.find(b=>b.title==='Diary of a Wimpy Kid: The Meltdown');
assert.ok(currentEnglishBook?.photoBatch,'Current Wimpy Kid edition remains available in the English photo reader');
console.log('PASS: 402 Arabic source-series volumes, 575 active Arabic/English digital cards, and current photo-only English indexing');

assert.equal(readerFileId('https://example.com/private.pdf'), null);
assert.equal(readerFileId('digital:ar:AR_1'), null); // collection, not a single PDF
assert.equal(readerFileId('digital:en:9'),null,'Retired English PDF URLs must not remain accessible');
const schoolOnlyEnglish=ENGLISH_LIBRARY_DATABASE.filter(b=>b.requiresSchoolGoogleAccess);
assert.equal(schoolOnlyEnglish.length,73,'All 73 current English photo entries use school access');
for(const book of schoolOnlyEnglish){
  assert.equal(readerFileId('digital:en:'+book.id),null,
    'Anonymous public PDF proxy must not serve restricted school book: '+book.title);
}
assert.equal(readerFileId('digital:en:'+currentEnglishBook.id),null,
  'Current English photo books must never be served as raw public PDFs');
assert.ok(readerFileId('digital:ar:NI_1'));
for (const [a,b] of [['-1','10'],['0','1048576'],['20','10'],['1.5','20'],['0','999999999']]) assert.equal(readerByteRange(a,b),null);
assert.deepEqual(readerByteRange('0','1048575'),[0,1048575]);
const bytes=new TextEncoder().encode('%PDF-1.7\n0123456789');
const fetcher=(async (_input: unknown, options: RequestInit) => {
  assert.equal((options.headers as Record<string,string>).Range,'bytes=0-9');
  return new Response(bytes.slice(0,10),{status:206,headers:{'Content-Type':'application/pdf','Content-Range':`bytes 0-9/${bytes.length}`}});
}) as typeof fetch;
const result=await readPublicPdfRange('test',0,9,fetcher);
assert.equal(result.length,bytes.length);assert.deepEqual(result.data,bytes.slice(0,10));
const restricted=(async()=>new Response("Sorry, the owner hasn't given you permission to download this file.",{headers:{'Content-Type':'text/html'}})) as typeof fetch;
await assert.rejects(readPublicPdfRange('test',0,9,restricted),e=>e instanceof PdfSourceError&&e.code==='SOURCE_DOWNLOAD_DISABLED'&&e.status===403);
let calls=0;
const redirect=(async()=>{calls++;return new Response(null,{status:302,headers:{location:'http://127.0.0.1/private'}});}) as typeof fetch;
await assert.rejects(readPublicPdfRange('test',0,9,redirect),PdfSourceError);assert.equal(calls,1);
const noRange=(async()=>new Response(bytes,{headers:{'Content-Type':'application/pdf','Content-Length':String(bytes.length)}})) as typeof fetch;
assert.deepEqual((await readPublicPdfRange('test',5,10,noRange)).data,bytes.slice(5,11));
const truncated=(async()=>new Response(bytes.slice(0,5),{status:206,headers:{'Content-Type':'application/pdf','Content-Range':`bytes 0-9/${bytes.length}`}})) as typeof fetch;
await assert.rejects(readPublicPdfRange('test',0,9,truncated),PdfSourceError);

const warning='<title>Google Drive - Virus scan warning</title>is too large for Google to scan for viruses.'+
 '<form id="download-form" action="https://drive.usercontent.google.com/download">'+
 '<input type="hidden" name="id" value="test"><input type="hidden" name="export" value="download">'+
 '<input type="hidden" name="confirm" value="t"><input type="hidden" name="uuid" value="public-test-nonce"></form>';
assert.equal(publicDownloadConfirmation(warning,'test')?.searchParams.get('id'),'test');
assert.equal(publicDownloadConfirmation(warning,'another-book'),null);
assert.equal(publicDownloadConfirmation(warning.replace('https://drive.usercontent.google.com/download','https://example.com/download'),'test'),null);
assert.equal(publicDownloadConfirmation(warning.replace('Virus scan warning','File is infected'),'test'),null);
let confirmationRequests=0;
const confirmationFetcher=(async(input: URL|string|Request)=>{
 confirmationRequests++;
 if(confirmationRequests===1)return new Response(warning,{headers:{'Content-Type':'text/html'}});
 const url=new URL(String(input));
 assert.equal(url.origin,'https://drive.usercontent.google.com');assert.equal(url.searchParams.get('uuid'),'public-test-nonce');
 return new Response(bytes.slice(0,10),{status:206,headers:{'Content-Type':'application/pdf','Content-Range':'bytes 0-9/150000000'}});
}) as typeof fetch;
assert.equal((await readPublicPdfRange('test',0,9,confirmationFetcher)).length,150000000);
assert.equal(confirmationRequests,2);
console.log('PASS: large-file confirmation stays on the same allowed public book and rejects unsafe forms');

// One request must return the first real bytes AND total length. Never wait
// for a separate Drive metadata request, then download the first chunk again.
const bootstrapBytes=new TextEncoder().encode('%PDF-1.7\nnew single-request bootstrap');
let bootstrapRequests=0;
const bootstrapFetcher=(async (input: string | URL | Request) => {
  bootstrapRequests++;
  const url=new URL(String(input),'https://example.invalid');
  assert.equal(url.searchParams.get('info'),null);
  assert.equal(url.searchParams.get('start'),'0');
  assert.equal(url.searchParams.get('end'),String(PDF_BYTE_CHUNK-1));
  return new Response(bootstrapBytes,{status:206,headers:{
    'Content-Type':'application/pdf','Content-Range':`bytes 0-${bootstrapBytes.length-1}/${bootstrapBytes.length}`
  }});
}) as typeof fetch;
const bootstrap=await fetchPdfBootstrap('/api/digital-book?book=example',new AbortController().signal,bootstrapFetcher);
assert.equal(bootstrapRequests,1);
assert.equal(bootstrap.length,bootstrapBytes.length);
assert.deepEqual(bootstrap.initialData,bootstrapBytes);
const bootstrapFailure=(async()=>new Response(JSON.stringify({code:'SOURCE_RANGE_UNSUPPORTED'}),{
  status:422,headers:{'Content-Type':'application/json'}
})) as typeof fetch;
await assert.rejects(fetchPdfBootstrap('/api/digital-book?book=example',new AbortController().signal,bootstrapFailure),
  e=>e instanceof Error&&e.message==='SOURCE_RANGE_UNSUPPORTED');
const brokenBootstrap=(async()=>new Response(bootstrapBytes.subarray(0,5),{status:206,headers:{
  'Content-Range':`bytes 0-${bootstrapBytes.length-1}/${bootstrapBytes.length}`
}})) as typeof fetch;
await assert.rejects(fetchPdfBootstrap('/api/digital-book?book=example',new AbortController().signal,brokenBootstrap),
  e=>e instanceof Error&&e.message==='SOURCE_NOT_PDF');
const readerSource=readFileSync('src/components/DigitalBookReader.tsx','utf8');
assert.ok(readerSource.includes('useState(() => allowDrivePreview && Boolean(preview))'),
  'Drive preview must render immediately, not after a timer');
assert.ok(!readerSource.includes('setTimeout(() => setShowPreview(true)'),
  'Never delay the book preview behind a loading timer');
assert.ok(!readerSource.includes('waitingForIdentity'),
  'The book preview must not wait for a second Supabase identity request');
assert.ok(readerSource.includes('className="efips-reader-native" aria-hidden={showPreview}'));
assert.ok(readerSource.includes('onReady={() => setReady(true)}'));
assert.ok(readerSource.includes('استخدام القارئ وحفظ موضع القراءة'));
console.log('PASS: single-request PDF bootstrap, verified bytes, immediate preview without timers or auth gates, and preserved background reader');

const arabicDigitalUi=readFileSync('pages/ArabicLibraryInternalPage.tsx','utf8');
const englishDigitalUi=readFileSync('pages/EnglishLibraryInternalPage.tsx','utf8');
const readerStyles=readFileSync('src/components/digitalBookReader.css','utf8');
const catalogStyles=readFileSync('src/components/digitalLibraryResponsive.css','utf8');
assert.ok(readerSource.includes('src="/school-logo.png"'), 'Use the existing official school emblem');
assert.ok(!readerSource.includes('>EFIPS Library</div>'), 'No text branding above book title');
assert.ok(readerSource.includes('<h2 dir="auto">{title}</h2>'), 'Keep the original book title');
assert.match(readerStyles,/\.efips-book-reader h2[^}]*text-align:\s*center/);
assert.match(readerStyles,/@media \(max-width: 700px\)/);
assert.match(readerStyles,/@media \(max-height: 520px\) and \(orientation: landscape\)/);
assert.match(catalogStyles,/@media \(min-width: 601px\) and \(max-width: 1024px\)/);
assert.match(catalogStyles,/@media \(max-width: 600px\)/);
for (const ui of [arabicDigitalUi,englishDigitalUi]) {
  assert.doesNotMatch(ui,/تصنيف مقترح|Suggested group|\(مقترح\)|\(suggested\)/,
    'Hide the provisional label without altering the book metadata');
  assert.match(ui,/book\.readingAudience/, 'Preserve the existing reading-group classification');
  assert.match(ui,/audienceFilter/, 'Preserve classification filters');
  assert.match(ui,/digitalBookKey/, 'Preserve individual book reading keys');
}
console.log('PASS: official school branding, centered reader heading, responsive screen sizes and unchanged classification logic');

const dialogSource=readFileSync('src/components/DigitalLibraryDialog.tsx','utf8');
assert.ok(dialogSource.includes("variant === 'reader' ? ' efips-digital-dialog-backdrop-reader'"),
  'Only reading dialog may use fullscreen overlay, details retain original layout');
assert.match(readerStyles,/\.efips-digital-dialog-backdrop\.efips-digital-dialog-backdrop-reader\s*\{[^}]*padding:\s*0/s,
  'Fullscreen reader backdrop must have no inset');
assert.match(readerStyles,/\.efips-digital-dialog-backdrop-reader\s*>\s*\.efips-digital-dialog-panel\.efips-digital-dialog-reader\s*\{[^}]*max-width:\s*none;[^}]*height:\s*100dvh;[^}]*max-height:\s*100dvh;[^}]*border:\s*0;[^}]*border-radius:\s*0/s,
  'Reader dialog must cover the entire visible screen without borders or corners');
assert.match(readerStyles,/\.efips-digital-dialog-backdrop-reader \.efips-reader-stage\s*\{[^}]*flex:\s*1 1 auto/s,
  'PDF viewing area must expand to use all remaining height');
console.log('PASS: reader is full viewport only; book details popup, buttons and PDF state are preserved');

assert.ok(dialogSource.includes("return variant === 'reader' ? createPortal(dialog, document.body) : dialog;"),
  'Only the reader should portal to document.body, above the app main stacking context');
assert.ok(dialogSource.includes("document.body.classList.add('efips-reader-open')"));
assert.ok(dialogSource.includes("document.body.classList.remove('efips-reader-open')"),
  'Closing the book must restore global site navigation');
assert.match(readerStyles,/body\.efips-reader-open \.efips-navbar-surface\s*\{[^}]*visibility:\s*hidden\s*!important;/s,
  'The floating site navbar must be hidden while reading');
assert.match(readerStyles,/\.efips-digital-dialog-backdrop\.efips-digital-dialog-backdrop-reader\s*\{[^}]*z-index:\s*2000001/s,
  'The portal must appear above other fixed site overlays');
assert.match(readerStyles,/\.efips-digital-dialog-backdrop-reader \.efips-book-reader \.efips-reader-header\s*\{[^}]*linear-gradient/s,
  'Reader chrome must use the EFIPS emerald/teal design');
assert.match(readerStyles,/@media \(prefers-reduced-motion: reduce\)/,
  'Reader-only animation must honor reduced motion preferences');
assert.ok(readerSource.includes('className="efips-reader-nav"'), 'Keep the original reader navigation buttons');
assert.ok(readerSource.includes('loading="eager"'), 'Do not alter instant book preview');
console.log('PASS: book reading hides global navbar, restores it on close, and preserves book controls with branded effects');




const large = Uint8Array.from({length:3*PDF_BYTE_CHUNK+19},(_,index)=>(index*31)%256);
let requests=0;
const rangeFetcher=(async(input: string | URL | Request)=>{
 const url=new URL(String(input),'https://test.invalid');
 const begin=Number(url.searchParams.get('start')),end=Number(url.searchParams.get('end'));
 assert.ok(end-begin+1<=PDF_BYTE_CHUNK);requests++;
 return new Response(large.slice(begin,end+1),{status:206});
}) as typeof fetch;
const assembled=await fetchPdfByteRange('/api/digital-book?book=test',17,large.length,new AbortController().signal,rangeFetcher);
assert.deepEqual(assembled,large.slice(17));assert.equal(requests,4);
await assert.rejects(fetchPdfByteRange('/api/digital-book?book=test',0,10,new AbortController().signal,(async()=>new Response(new Uint8Array(5),{status:206})) as typeof fetch));
console.log('PASS: large multi-part range assembly preserves all bytes and bounded responses');

const values=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(k:string)=>values.get(k)||null,setItem:(k:string,v:string)=>values.set(k,v)}});
const key=pdfReadingStorageKey('student-A','digital:en:'+String(ENGLISH_LIBRARY_DATABASE[0].id),'file-v1');
assert.notEqual(key,pdfReadingStorageKey('student-B','digital:en:'+String(ENGLISH_LIBRARY_DATABASE[0].id),'file-v1'));
assert.notEqual(key,pdfReadingStorageKey('student-A','digital:en:'+String(ENGLISH_LIBRARY_DATABASE[0].id),'file-v2'));
assert.equal(writePdfState(key,{page:4,bookmarks:[2,4],zoom:1.5}),true);
assert.deepEqual(readPdfState(key),{page:4,bookmarks:[2,4],zoom:1.5});
values.set(key!,JSON.stringify({page:4,bookmarks:[2,4],zoom:.25}));
assert.equal(readPdfState(key).zoom,.75,'The PDF.js reader keeps its existing 75% minimum');
assert.equal(readPdfState(key,.25).zoom,.25,'The image reader restores the saved 25% zoom');

assert.equal(readPdfState(pdfReadingStorageKey('student-B','digital:en:'+String(ENGLISH_LIBRARY_DATABASE[0].id),'file-v1')).page,1);
assert.equal(clampPdfPage(100,6),6);assert.equal(clampPdfPage(-1,6),1);assert.equal(parsePdfPage('٣٢'),32);
values.set(key!,JSON.stringify({page:-5,bookmarks:[-1,2,2,'5'],zoom:900}));
assert.deepEqual(readPdfState(key),{page:1,bookmarks:[2],zoom:2});
Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('Storage blocked');}});
assert.equal(writePdfState(key,{page:3,bookmarks:[],zoom:1}),false);
assert.equal(readPdfState(key).page,1);
console.log('PASS: catalogue allowlist, bounded PDF ranges, download restrictions, redirect safety, resume, bookmark validation and account separation');

const { default: api } = await import('../api/digital-book.ts');
let status = 0;
let responseBody: unknown;
const response = { setHeader() {}, status(code: number) { status = code; return this; }, json(body: unknown) { responseBody = body; return this; } };
await api({ method: 'GET', query: { book: 'not-a-catalogue-book' } } as any, response as any);
assert.equal(status, 404); assert.deepEqual(responseBody, { code: 'BOOK_NOT_FOUND' });
console.log('PASS: emitted API module loads under Node ESM and handles requests');
