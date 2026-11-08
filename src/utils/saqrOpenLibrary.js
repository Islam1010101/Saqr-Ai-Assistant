/** Source-verified public bibliography only; not evidence of school ownership.
 *  Standalone module reused inside the EXISTING /api/chat serverless function.
 *  No extra Vercel function or changes to Chat POST processing.
 */
const normalize=(input)=>String(input||'').normalize('NFKC').toLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[^\p{L}\p{N}]+/gu,' ').trim();

const matchesTitle=(requested,returned)=>{
  const want=normalize(requested),got=normalize(returned);
  if(!want || !got)return false;
  return got===want || (want.length>=5 && got.startsWith(want+' ')) ||
    (got.length>=5 && want.startsWith(got+' '));
};

export function pickVerifiedBook(title,docs){
  const matched=docs.find(doc=>typeof doc?.title==='string' && matchesTitle(title,doc.title));
  if(!matched || typeof matched.title!=='string')return null;
  const id=typeof matched.key==='string'?matched.key:'';
  const workId=id.match(/(?:^|\/)(OL\d+W)$/)?.[1];
  if(!workId)return null;
  const authors=(Array.isArray(matched.author_name)?matched.author_name:[])
    .filter(a=>typeof a==='string' && a.length>0).slice(0,4)
    .map(a=>a.slice(0,120));
  const year=Number(matched.first_publish_year);
  const firstPublishYear=Number.isInteger(year)&&year>=1450&&year<=2100 ? year:undefined;
  const subjects=(Array.isArray(matched.subject)?matched.subject:[])
    .filter(s=>typeof s==='string'&&s.length>0).slice(0,6)
    .map(s=>s.slice(0,90));
  return {
    title:matched.title.slice(0,200), authors,
    ...(firstPublishYear!==undefined?{firstPublishYear}:{}),
    ...(subjects.length?{subjects}:{}),
    url:'https://openlibrary.org/works/'+workId
  };
}

export async function findBookReference(title,fetcher=fetch){
  if(typeof title!=='string' || title.length<2 || title.length>140 || /https?:|[\r\n]/i.test(title))
    return null;
  const query=new URL('https://openlibrary.org/search.json');
  query.searchParams.set('title',title);
  query.searchParams.set('fields','key,title,author_name,first_publish_year,subject');
  query.searchParams.set('limit','8');
  const response=await fetcher(query.toString(),{
    signal:AbortSignal.timeout(3500),
    headers:{'Accept':'application/json'}
  });
  if(!response.ok)throw new Error('Bibliographic source unavailable');
  const body=await response.json();
  if(!Array.isArray(body?.docs))return null;
  return pickVerifiedBook(title,body.docs.slice(0,8));
}
