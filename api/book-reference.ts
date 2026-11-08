import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Public bibliographic metadata ONLY. This service neither searches nor
 * modifies school books, student accounts or borrowing information.
 * Open Library references are not evidence of EFIPS ownership.
 */
type SourceBook={
  title:string; authors:string[]; firstPublishYear?:number;
  subjects?:string[]; url:string;
};
const normalize=(input:string):string=>input.normalize('NFKC').toLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[^\p{L}\p{N}]+/gu,' ').trim();

type OpenLibraryDoc={
  key?:unknown; title?:unknown; author_name?:unknown;
  first_publish_year?:unknown; subject?:unknown;
};
const matchesTitle=(requested:string,returned:string):boolean=>{
  const want=normalize(requested),got=normalize(returned);
  if(!want || !got)return false;
  return got===want || (want.length>=5 && got.startsWith(want+' ')) ||
    (got.length>=5 && want.startsWith(got+' '));
};
export function pickVerifiedBook(title:string,docs:OpenLibraryDoc[]):SourceBook|null{
  const matched=docs.find(doc=>typeof doc.title==='string' && matchesTitle(title,doc.title));
  if(!matched || typeof matched.title!=='string')return null;
  const id=typeof matched.key==='string'?matched.key:'';
  const workId=id.match(/(?:^|\/)(OL\d+W)$/)?.[1];
  if(!workId)return null;
  const authors=(Array.isArray(matched.author_name)?matched.author_name:[])
    .filter((a):a is string=>typeof a==='string' && a.length>0).slice(0,4)
    .map(a=>a.slice(0,120));
  const year=Number(matched.first_publish_year);
  const firstPublishYear=Number.isInteger(year)&&year>=1450&&year<=2100 ? year:undefined;
  const subjects=(Array.isArray(matched.subject)?matched.subject:[])
    .filter((s):s is string=>typeof s==='string'&&s.length>0).slice(0,6)
    .map(s=>s.slice(0,90));
  return {
    title:matched.title.slice(0,200),
    authors,
    ...(firstPublishYear!==undefined?{firstPublishYear}:{}),
    ...(subjects.length?{subjects}:{}),
    url:'https://openlibrary.org/works/'+workId
  };
}
export async function findBookReference(title:string,fetcher:typeof fetch=fetch):Promise<SourceBook|null>{
  if(title.length<2 || title.length>140 || /https?:|[\r\n]/i.test(title))return null;
  const query=new URL('https://openlibrary.org/search.json');
  query.searchParams.set('title',title);
  query.searchParams.set('fields','key,title,author_name,first_publish_year,subject');
  query.searchParams.set('limit','8');
  const response=await fetcher(query.toString(),{
    signal:AbortSignal.timeout(3500),
    headers:{'Accept':'application/json'}
  });
  if(!response.ok)throw new Error('Bibliographic source unavailable');
  const body=await response.json() as {docs?:unknown};
  if(!Array.isArray(body?.docs))return null;
  return pickVerifiedBook(title,body.docs.slice(0,8));
}
export default async function handler(req:VercelRequest,res:VercelResponse) {
  if(req.method!=='GET')return res.status(405).json({status:'error'});
  const title=typeof req.query.title==='string'?req.query.title.trim():'';
  if(title.length<2 || title.length>140 || /https?:|[\r\n]/i.test(title))
    return res.status(400).json({status:'invalid_title'});
  res.setHeader('Cache-Control','public, max-age=600, s-maxage=3600');
  try {
    const book=await findBookReference(title);
    return res.status(200).json(book?{status:'verified',book}:{status:'not_found'});
  } catch {
    // External metadata downtime must not prevent Saqr answering from
    // his existing knowledge, with explicit uncertainty.
    return res.status(200).json({status:'unavailable'});
  }
}
