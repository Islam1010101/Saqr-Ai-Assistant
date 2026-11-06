import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PdfSourceError, readerFileId, readerByteRange, readPublicPdfRange } from '../src/server/digitalBookPdf.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ code: 'METHOD_NOT_ALLOWED' }); }
  const key = typeof req.query.book === 'string' ? req.query.book : '';
  const fileId = readerFileId(key);
  if (!fileId) return res.status(404).json({ code: 'BOOK_NOT_FOUND' });
  const info = req.query.info === '1';
  const range = info ? [0, 1023] : readerByteRange(req.query.start, req.query.end);
  if (!range) return res.status(400).json({ code: 'INVALID_RANGE' });
  try {
    const { data, length } = await readPublicPdfRange(fileId, range[0], range[1]);
    if (info) return res.status(200).json({ length });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Range', `bytes ${range[0]}-${range[0] + data.length - 1}/${length}`);
    res.setHeader('Content-Length', String(data.length));
    return res.status(206).send(Buffer.from(data));
  } catch (error) {
    const failure = error instanceof PdfSourceError ? error : new PdfSourceError('SOURCE_UNAVAILABLE', 502);
    return res.status(failure.status).json({ code: failure.code });
  }
}
