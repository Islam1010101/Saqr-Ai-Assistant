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

/** end is exclusive, just like PDF.js PDFDataRangeTransport.requestDataRange. */
export async function readSchoolPdfRange(
  fileId: string, providerToken: string, begin: number, end: number,
  signal: AbortSignal, fetcher: typeof fetch = fetch
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
    await response.body?.cancel();
    throw new SchoolDrivePdfError('SCHOOL_DRIVE_PERMISSION_REQUIRED');
  }
  if(response.status!==206){
    // Never accidentally download a multi-hundred-megabyte file when Range
    // is ignored. Google Drive can preview more files than it can range-serve.
    await response.body?.cancel();
    throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
  }
  const match=/^bytes\s+(\d+)-(\d+)\/(\d+)$/i.exec(response.headers.get('content-range')||'');
  if(!match){await response.body?.cancel();throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');}
  const first=Number(match[1]),last=Number(match[2]),length=Number(match[3]);
  if(first!==begin || !Number.isSafeInteger(last) || !Number.isSafeInteger(length)
    || length < 5 || length > SCHOOL_PDF_MAX_BYTES || last < first
    || last >= length || last >= end){
    await response.body?.cancel();
    throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
  }
  const expected=last-first+1;
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(bytes.length!==expected)throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
  if(begin===0 && new TextDecoder().decode(bytes.subarray(0,5))!=='%PDF-')
    throw new SchoolDrivePdfError('SOURCE_NOT_PDF');
  return {bytes,length};
}

export async function bootstrapSchoolPdf(fileId:string, token:string, signal:AbortSignal,
  fetcher:typeof fetch=fetch):Promise<SchoolPdfRange>{
  return readSchoolPdfRange(fileId,token,0,SCHOOL_PDF_CHUNK_BYTES,signal,fetcher);
}

export async function fetchSchoolPdfByteRange(
  fileId:string,token:string,begin:number,end:number,signal:AbortSignal,fetcher:typeof fetch=fetch
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
      const response=await readSchoolPdfRange(fileId,token,start,finish,signal,fetcher);
      if(response.bytes.length!==finish-start)throw new SchoolDrivePdfError('SCHOOL_DRIVE_RANGE_UNAVAILABLE');
      output.set(response.bytes,start-begin);
    }
  }));
  return output;
}
