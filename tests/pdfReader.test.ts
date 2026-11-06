import assert from 'node:assert/strict';
import { readerByteRange, readerFileId, readPublicPdfRange, PdfSourceError } from '../src/server/digitalBookPdf.ts';
import { clampPdfPage, parsePdfPage, pdfReadingStorageKey, readPdfState, writePdfState } from '../src/utils/pdfReadingState.ts';
import { fetchPdfByteRange, PDF_BYTE_CHUNK } from '../src/utils/pdfRangeTransport.ts';

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
