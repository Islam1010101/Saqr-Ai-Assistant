import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PdfSourceError, readerFileId, readerByteRange, readPublicPdfRange } from '../src/server/digitalBookPdf.js';

/** Hide removed original titles from the platform's public PDF proxy as well. */
async function removedCatalogPdf(key:string):Promise<boolean>{
  const match=/^digital:(ar|en):([A-Za-z0-9_-]{1,80})$/.exec(key);
  if(!match)return false;
  const anon=process.env.SUPABASE_ANON_KEY?.trim()||process.env.VITE_SUPABASE_ANON_KEY?.trim();
  if(!anon)return false;
  try{
    const url='https://mgbzzgnprbddajyfieop.supabase.co/rest/v1/efips_admin_catalog_controls'+
      '?select=library&action=eq.delete&book_id=eq.'+encodeURIComponent(match[2]);
    const response=await fetch(url,{headers:{apikey:anon,authorization:'Bearer '+anon},signal:AbortSignal.timeout(2000)});
    if(!response.ok)return false;
    const results=await response.json() as Array<{library:string}>;
    const valid=match[1]==='en'?['en']:['ar','national'];
    return Array.isArray(results)&&results.some(item=>valid.includes(item.library));
  }catch{return false;}
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ code: 'METHOD_NOT_ALLOWED' }); }
  const key = typeof req.query.book === 'string' ? req.query.book : '';
  if (await removedCatalogPdf(key)) return res.status(404).json({ code: 'BOOK_NOT_FOUND' });
  const fileId = readerFileId(key);
  if (!fileId) return res.status(404).json({ code: 'BOOK_NOT_FOUND' });
  const info = req.query.info === '1';
  const range = info ? [0, 1023] : readerByteRange(req.query.start, req.query.end);
  if (!range) return res.status(400).json({ code: 'INVALID_RANGE' });
  try {
    const { data, length } = await readPublicPdfRange(fileId, range[0], range[1]);
    if (info) return res.status(200).json({ length });
    // These are already public, allow-listed Drive PDFs. Cache each verified
    // byte chunk privately in the reader's browser for faster page revisits.
    // Do not cache errors, denied files, or the legacy metadata response.
    res.setHeader('Cache-Control', 'private, max-age=600');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Range', `bytes ${range[0]}-${range[0] + data.length - 1}/${length}`);
    res.setHeader('Content-Length', String(data.length));
    return res.status(206).send(Buffer.from(data));
  } catch (error) {
    const failure = error instanceof PdfSourceError ? error : new PdfSourceError('SOURCE_UNAVAILABLE', 502);
    return res.status(failure.status).json({ code: failure.code });
  }
}
