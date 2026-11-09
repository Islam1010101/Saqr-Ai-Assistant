import assert from 'node:assert/strict';
import {
  schoolDriveFileId, SchoolDrivePdfError, readSchoolPdfRange, bootstrapSchoolPdf,
  fetchSchoolPdfByteRange, fetchSchoolPdfMetadata, SCHOOL_PDF_CHUNK_BYTES
} from '../src/utils/schoolDrivePdfRanges.ts';

const id='1nZYM6Mt1k34I7ZJVwelmj8WiXZjhqcRc';
const token='school-consented-token-for-tests';
assert.equal(schoolDriveFileId('https://drive.google.com/file/d/'+id+'/view'),id);
assert.equal(schoolDriveFileId('https://example.com/file/d/'+id+'/view'),null);
assert.equal(schoolDriveFileId('http://drive.google.com/file/d/'+id+'/view'),null);
assert.equal(schoolDriveFileId('https://drive.google.com/drive/folders/'+id),null);
const bytes=new TextEncoder().encode('%PDF-1.7\nRange content for EFIPS reader 2026.');
const calls:string[]=[];
const metadataFetcher=(async(input:URL|string|Request,options:RequestInit)=>{
  const u=String(input);
  const h=options.headers as Record<string,string>;
  assert.ok(u.startsWith('https://www.googleapis.com/drive/v3/files/'+id));
  assert.equal(h.Authorization,'Bearer '+token);
  assert.equal(options.credentials,'omit');
  assert.equal(options.cache,'no-store');
  assert.equal(options.redirect,'error');
  calls.push(u);
  if(u.includes('?fields=')){
    return new Response(JSON.stringify({mimeType:'application/pdf',
      size:String(bytes.length),capabilities:{canDownload:true}}),{
      status:200,headers:{'Content-Type':'application/json'}
    });
  }
  const range=/bytes=(\d+)-(\d+)/.exec(h.Range);
  assert.ok(range);
  const begin=Number(range[1]),end=Math.min(Number(range[2])+1,bytes.length);
  // Content-Range deliberately hidden, simulating opaque browser response header.
  return new Response(bytes.slice(begin,end),{status:206});
}) as typeof fetch;
const boot=await bootstrapSchoolPdf(id,token,new AbortController().signal,metadataFetcher);
assert.equal(boot.length,bytes.length);
assert.deepEqual(boot.bytes,bytes);
assert.equal(calls.length,2);
const slice=await fetchSchoolPdfByteRange(id,token,8,20,new AbortController().signal,metadataFetcher,bytes.length);
assert.deepEqual(slice,bytes.slice(8,20));
const invalid=(async()=>new Response('not a ranged pdf',{status:200})) as typeof fetch;
await assert.rejects(
  readSchoolPdfRange(id,token,0,24,new AbortController().signal,invalid),
  (e:unknown)=>e instanceof SchoolDrivePdfError&&e.code==='SCHOOL_DRIVE_RANGE_UNAVAILABLE');
const noPermission=(async()=>new Response(JSON.stringify({mimeType:'application/pdf',size:bytes.length,capabilities:{canDownload:false}}),{status:200})) as typeof fetch;
await assert.rejects(fetchSchoolPdfMetadata(id,token,new AbortController().signal,noPermission),
  (e:unknown)=>e instanceof SchoolDrivePdfError&&e.code==='SCHOOL_DRIVE_DOWNLOAD_BLOCKED');
const denied=(async()=>new Response('forbidden',{status:403})) as typeof fetch;
await assert.rejects(readSchoolPdfRange(id,token,0,12,new AbortController().signal,denied),
  (e:unknown)=>e instanceof SchoolDrivePdfError&&e.code==='SCHOOL_DRIVE_PERMISSION_REQUIRED');
await assert.rejects(readSchoolPdfRange(id,token,0,SCHOOL_PDF_CHUNK_BYTES+2,new AbortController().signal,metadataFetcher),
  (e:unknown)=>e instanceof SchoolDrivePdfError&&e.code==='INVALID_RANGE');
assert.ok(!calls.some(c=>c.includes(token)),'Do not put OAuth bearer token in URLs');
console.log('PASS: school OAuth PDF range transport, CORS header fallback, no whole-file download, download-block denial, no token in URLs');
