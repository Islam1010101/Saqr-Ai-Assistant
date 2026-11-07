import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { DIGITAL_SERIES_VOLUMES } from '../src/data/digitalSeriesVolumes.js';

import { readerByteRange, readerFileId, readPublicPdfRange, PdfSourceError, publicDownloadConfirmation } from '../src/server/digitalBookPdf.ts';
import { clampPdfPage, parsePdfPage, pdfReadingStorageKey, readPdfState, writePdfState } from '../src/utils/pdfReadingState.ts';
import { fetchPdfByteRange, PDF_BYTE_CHUNK } from '../src/utils/pdfRangeTransport.ts';

// Vercel's production Node ESM runtime does not rewrite literal .ts import paths.
// The previous deployment failed with ERR_MODULE_NOT_FOUND for digitalSeriesVolumes.ts.
assert.doesNotMatch(readFileSync('api/digitalBookData.ts','utf8'),
  /from\\s*['"][^'"]+\\.ts['"]/, 'Runtime imports must resolve to compiled .js files');
console.log('PASS: Vercel server import paths reference emitted JavaScript, not missing TypeScript sources');

// Regression: a folder link must not masquerade as a PDF; all series volumes are direct files.
const allDigitalBooks = [...ARABIC_LIBRARY_DATABASE,...ENGLISH_LIBRARY_DATABASE];
assert.equal(Object.keys(DIGITAL_SERIES_VOLUMES).length,10);
assert.equal(Object.values(DIGITAL_SERIES_VOLUMES).reduce((sum,books)=>sum+books.length,0),412);
assert.equal(ARABIC_LIBRARY_DATABASE.length,452);
assert.equal(ENGLISH_LIBRARY_DATABASE.length,54);
assert.equal(allDigitalBooks.length,506); // six heritage e-books are managed in their own list
assert.ok(allDigitalBooks.every(b=>b.driveLink.includes('/file/d/')), 'No digital library card may point to a Drive folder');
assert.equal(ARABIC_LIBRARY_DATABASE.filter(b=>Boolean(b.audioId)).length,23,'Keep all original audio summaries');
assert.ok(allDigitalBooks.every(b=>Boolean(b.readingAudience)),'Every digital volume needs a suggested reading group');
const greenVolume = ARABIC_LIBRARY_DATABASE.find(b=>b.series==='المكتبة الخضراء للأطفال');
assert.ok(greenVolume);
assert.equal(greenVolume.readingAudience,'children');
assert.equal(readerFileId('digital:ar:'+greenVolume.id), greenVolume.driveLink.match(/\/file\/d\/([^/]+)/)?.[1]);
const wimpy = ENGLISH_LIBRARY_DATABASE.find(b=>b.series==='Diary Of A Wimpy');
assert.ok(wimpy);
assert.equal(wimpy.readingAudience,'children');
console.log('PASS: 412 per-volume PDFs, 506 digital library cards, suggested audiences, audio integrity and server allowlisting');

assert.equal(readerFileId('https://example.com/private.pdf'), null);
assert.equal(readerFileId('digital:ar:AR_1'), null); // collection, not a single PDF
assert.equal(readerFileId('digital:en:9'), '1i7G7xoUBk77DPDYyNzEkxMGsJi5XA2gc');
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
const key=pdfReadingStorageKey('student-A','digital:en:9','file-v1');
assert.notEqual(key,pdfReadingStorageKey('student-B','digital:en:9','file-v1'));
assert.notEqual(key,pdfReadingStorageKey('student-A','digital:en:9','file-v2'));
assert.equal(writePdfState(key,{page:4,bookmarks:[2,4],zoom:1.5}),true);
assert.deepEqual(readPdfState(key),{page:4,bookmarks:[2,4],zoom:1.5});
assert.equal(readPdfState(pdfReadingStorageKey('student-B','digital:en:9','file-v1')).page,1);
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
