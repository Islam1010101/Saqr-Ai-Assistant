import type {SaqrBookMatch} from './saqrCatalogSearch.ts';

/**
 * Recover from AI providers that return a one-line Markdown table instead of
 * a natural book recommendation. Only actual catalogue records are rendered;
 * unsupported AI-generated book descriptions and age claims are discarded.
 * Normal prose and non-recommendation flows are never rewritten.
 */
const normalize=(value:string):string=>String(value||'').normalize('NFKC').toLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[^\p{L}\p{N}]+/gu,'');
const escapeMd=(value:string):string=>String(value||'').replace(/([\\\x60*_{}\[\]<>])/g,'\\$1').trim();
const validLink=(url:string|undefined):string|null=>{
  if(!url)return null;
  try {
    const parsed=new URL(url.trim());
    return parsed.protocol==='https:'?parsed.toString():null;
  }catch{return null;}
};

export function hasMalformedSaqrRecommendationTable(reply:string):boolean{
  const text=String(reply||'');
  // Standard Markdown tables also fail in the current renderer (no GFM plug-in).
  // Count multiple pipe delimiters, not ordinary prose punctuation.
  return /(?:^|\n)\s*(?:\*\*)?\s*\|[^\n]*\|[^\n]*\|[^\n]*\|/m.test(text) ||
    /\|\s*(?:العنوان|الكتاب|title|book)\s*\|/i.test(text);
}

export function formatSaqrRecommendationReply(
  reply:string,matches:ReadonlyArray<SaqrBookMatch>,locale:'ar'|'en'
):string{
  if(!hasMalformedSaqrRecommendationTable(reply)||!matches.length)return reply;
  const normalizedReply=normalize(reply);
  const identified=matches.map(book=>({book,pos:normalizedReply.indexOf(normalize(book.title))}))
    .filter(x=>x.pos>=0).sort((a,b)=>a.pos-b.pos);
  // Preserve the titles selected by the model, but replace unverified claims.
  const selected=(identified.length?identified.map(x=>x.book):matches).slice(0,3);
  const arabic=locale==='ar';
  const head=arabic
    ? 'لقيت لك شوية كتب عن الموضوع ده في فهارس مكتبة المدرسة. دول ممكن تبدأ بيهم:'
    : 'I found a few books on this topic in our school catalogue. Here are some good starting points:';
  const items=selected.map(book=>{
    const where=book.shelf!==undefined
      ? (arabic
        ? 'موجود في المكتبة الورقية، الرف '+book.shelf+'، الصف '+book.row
        : 'Physical library, shelf '+book.shelf+', row '+book.row)
      : (arabic?'في المكتبة الرقمية':'In the digital library');
    const href=book.shelf===undefined?validLink(book.driveLink):null;
    const link=href?' — ['+(arabic?'فتح الكتاب':'Open book')+']('+href+')':'';
    return '- **'+escapeMd(book.title)+'** — '+where+link+'.';
  });
  const note=arabic
    ? 'الترشيحات مبنية على بيانات الفهرس، مش مراجعة لمحتوى كل كتاب، وما بتأكدش توافر النسخة للاستعارة دلوقتي.'
    : 'These suggestions use catalogue records, not a verified reading of every book or live loan availability.';
  const question=arabic
    ? 'تحب تقرأ بالعربي ولا بالإنجليزي؟'
    : 'Would you prefer to read in Arabic or English?';
  return [head,items.join('\n'),note,question].join('\n\n');
}
