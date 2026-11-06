import assert from 'node:assert/strict';
import { readerByteRange, readerFileId, readPublicPdfRange, PdfSourceError } from '../src/server/digitalBookPdf.ts';
import { clampPdfPage, parsePdfPage, pdfReadingStorageKey, readPdfState, writePdfState } from '../src/utils/pdfReadingState.ts';

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
