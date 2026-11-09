/**
 * Google Workspace PDFs may be over Google Drive's embedded preview limit.
 * Read only user-authorized byte ranges from the official Drive API.
 * Bearer tokens are supplied from the current Supabase Google OAuth session,
 * never embedded in catalog data or sent to our Vercel server.
 *
 * Google may deny content requests when file owners disable download. Do not
 * bypass that decision: fail closed with SCHOOL_DRIVE_DOWNLOAD_BLOCKED.
 */
export const SCHOOL_PDF_MAX_BYTES = 1024 * 1024 * 1024; // 1 GiB: largest catalog PDF is < 1 GiB.
export const SCHOOL_PDF_CHUNK_BYTES = 1024 * 1024;

export function schoolDriveFileId(source: string): string | null {
  try {
    const url = new URL(source);
    if (url.protocol !== 'https:' || url.hostname !== 'drive.google.com'
      || url.username || url.password || url.port) return null;
    return url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]{10,150})(?:\/|$)/)?.[1] || null;
  } catch { return null; }
}

export class SchoolDrivePdfError extends Error {
  readonly code: string;
  constructor(code: string) { super(code); this.name='SchoolDrivePdfError'; this.code=code; }
}
export type SchoolPdfRange = { bytes: Uint8Array; length: number };
export async function fetchSchoolPdfMetadata(
  fileId: string, token: string, signal: AbortSignal, fetcher:typeof fetch=fetch
):Promise<{length:number}>{
  if(!/^[A-Za-z0-9_-]{10,150}$/.test(fileId) || !token || token.length<15)
    throw new SchoolDrivePdfError('SCHOOL_DRIVE_PERMISSION_REQUIRED');
  let response:Response;
  try{
    response=await fetcher('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(fileId)
      +'?fields=size%2CmimeType%2Ccapabilities%2FcanDownload',{
      method:'GET',signal,cache:'no-store',credentials:'omit',redirect:'error',
      headers:{Authorization:'Bearer '+token}
    });
  }catch(error){
    if(signal.aborted)throw error;
    throw new SchoolDrivePdfError('SCHOOL_DRIVE_NETWORK');
  }
  if(response.status===401)throw new SchoolDrivePdfError('SCHOOL_DRIVE_TOKEN_EXPIRED');
  if(response.status===403)throw new SchoolDrivePdfError('SCHOOL_DRIVE_PERMISSION_REQUIRED');
  if(!response.ok)throw new SchoolDrivePdfError('SCHOOL_DRIVE_NETWORK');
  const metadata=await response.json().catch(()=>null);
  const length=Number(metadata?.size);
  if(metadata?.capabilities?.canDownload===false)
    throw new SchoolDrivePdfError('SCHOOL_DRIVE_DOWNLOAD_BLOCKED');
  if(metadata?.mimeType!=='application/pdf' || !Number.isSafeInteger(length)
    || length<5 || length>SCHOOL_PDF_MAX_BYTES)
    throw new SchoolDrivePdfError('SOURCE_NOT_PDF');
  return {length};
}

/** end is exclusive, just like PDF.js PDFDataRangeTransport.requestDataRange. */
export async function readSchoolPdfRange(
  fileId: string, providerToken: string, begin: number, end: number,
  signal: AbortSignal, fetcher: typeof fetch = fetch, knownLength?:number
): Promise<SchoolPdfRange> {
  if(!/^[A-Za-z0-9_-]{10,150}$/.test(fileId) || typeof providerToken !== 'string'
    || providerToken.length < 15 || providerToken.length > 4096
    || !Number.isSafeInteger(begin) || !Number.isSafeInteger(end)
    || begin < 0 || end <= begin || end - begin > SCHOOL_PDF_CHUNK_BYTES
    || end > SCHOOL_PDF_MAX_BYTES) throw new SchoolDrivePdfError('INVALID_RANGE');
  const url='https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(fileId)+'?alt=media';
  let response: Response;
  try {
    response=await fetcher(url,{
      method:'GET',signal,cache:'no-store',credentials:'omit',redirect:'error',
      headers:{Authorization:'Bearer '+providerToken,Range:`bytes=${begin}-${end-1}`,'Accept-Encoding':'identity'}
    });
  } catch(error){
    if(signal.aborted) throw error;
    throw new SchoolDrivePdfError('SCHOOL_DRIVE_NETWORK');
  }
  if(response.status===401){ await response.body?.cancel(); throw new SchoolDrivePdfError('SCHOOL_DRIVE_TOKEN_EXPIRED'); }
  if(response.status===403){
    const limited=await response.text().catch(()=>'');
    const isDownloadBlocked=/cannotdownload|download is restricted|downloads? (?:are|is) (?:not allowed|disabled|restricted)/i.test(limited.slice(0,3000));
    throw new SchoolDrivePdfError(isDownloadBlocked
      ?'SCHOOL_DRIVE_DOWNLOAD_BLOCKED':'SCHOOL_DRIVE_PERMISSION_REQUIRED');
  }
  if(response.status!==206){
    // Never accidentally download a multi-hundred-megabyte file when Range
    // is ignored. Google Drive can preview more files than it can range-serve.
    await response.body?.cancel();
    throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
  }
  const match=/^bytes\s+(\d+)-(\d+)\/(\d+)$/i.exec(response.headers.get('content-range')||'');
  // Some cross-origin responses conceal the Content-Range header even when
  // Google actually sends 206. A separately authorized metadata size avoids
  // misdiagnosing an otherwise valid partial response in those browsers.
  const length=match?Number(match[3]):knownLength;
  const first=match?Number(match[1]):begin;
  const last=match?Number(match[2]):Math.min(end,Number(length))-1;
  if(first!==begin || !Number.isSafeInteger(last) || !Number.isSafeInteger(length)
    || length < 5 || length > SCHOOL_PDF_MAX_BYTES || last < first
    || last >= length || last >= end){
    await response.body?.cancel();
    throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
  }
  const expected=last-first+1;
  if(!response.body)throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
  // Bound memory even when an upstream server mistakenly sends extra bytes.
  const bytes=new Uint8Array(expected);
  const reader=response.body.getReader();
  let written=0;
  try{
    while(written<expected){
      const {value,done}=await reader.read();
      if(done)break;
      if(value.length>expected-written)throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
      bytes.set(value,written);written+=value.length;
    }
  } finally {await reader.cancel().catch(()=>{});}
  if(written!==expected)throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
  if(begin===0 && new TextDecoder().decode(bytes.subarray(0,5))!=='%PDF-')
    throw new SchoolDrivePdfError('SOURCE_NOT_PDF');
  return {bytes,length};
}

export async function bootstrapSchoolPdf(fileId:string, token:string, signal:AbortSignal,
  fetcher:typeof fetch=fetch):Promise<SchoolPdfRange>{
  const {length}=await fetchSchoolPdfMetadata(fileId,token,signal,fetcher);
  return readSchoolPdfRange(fileId,token,0,Math.min(SCHOOL_PDF_CHUNK_BYTES,length),
    signal,fetcher,length);
}

export async function fetchSchoolPdfByteRange(
  fileId:string,token:string,begin:number,end:number,signal:AbortSignal,
  fetcher:typeof fetch=fetch,knownLength?:number
):Promise<Uint8Array>{
  if(!Number.isSafeInteger(begin)||!Number.isSafeInteger(end)||begin<0||end<=begin
    ||end>SCHOOL_PDF_MAX_BYTES)throw new SchoolDrivePdfError('INVALID_RANGE');
  const output=new Uint8Array(end-begin);
  const starts=Array.from({length:Math.ceil((end-begin)/SCHOOL_PDF_CHUNK_BYTES)},
    (_,i)=>begin+i*SCHOOL_PDF_CHUNK_BYTES);
  let next=0;
  await Promise.all(Array.from({length:Math.min(3,starts.length)},async()=>{
    while(next<starts.length){
      const start=starts[next++];
      const finish=Math.min(end,start+SCHOOL_PDF_CHUNK_BYTES);
      const response=await readSchoolPdfRange(fileId,token,start,finish,signal,fetcher,knownLength);
      if(response.bytes.length!==finish-start)throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
      output.set(response.bytes,start-begin);
    }
  }));
  return output;
}
