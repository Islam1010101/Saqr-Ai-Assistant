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

/**
 * Protect real school locations. It is not enough for a shelf to exist:
 * the exact title must also be associated with the shelf AND row in the
 * verified catalogue records supplied for this recommendation.
 */
export function hasUnsupportedSaqrRecommendationShelf(
  reply:string,matches:ReadonlyArray<SaqrBookMatch>
):boolean{
  const location=/(?:الرف|رف|shelf)\s*[:：#-]?\s*(\d{1,3})[\s\S]{0,75}?(?:الصف|صف|row)\s*[:：#-]?\s*(\d{1,3})/gi;
  for(const claimed of String(reply||'').matchAll(location)){
    const shelf=Number(claimed[1]),row=Number(claimed[2]);
    const preceding=String(reply||'').slice(Math.max(0,(claimed.index||0)-230),(claimed.index||0)+claimed[0].length);
    const verified=matches.some(book=>
      book.shelf===shelf&&book.row===row&&
      normalize(preceding).includes(normalize(book.title))
    );
    if(!verified)return true;
  }
  return false;
}

export function formatSaqrRecommendationReply(
  reply:string,matches:ReadonlyArray<SaqrBookMatch>,locale:'ar'|'en'
):string{
  const invalidLocation=hasUnsupportedSaqrRecommendationShelf(reply,matches);
  if(!hasMalformedSaqrRecommendationTable(reply)&&!invalidLocation)return reply;
  if(!matches.length) return invalidLocation
    ? (locale==='ar'
      ? 'ما قدرت أأكد عنوان مطابق في الفهرس الإلكتروني الحالي، لكن هذا ما يعني إن الكتاب مب موجود فعليًا. خلنا نبحث باسم الكتاب أو المؤلف عشان نتأكد.'
      : 'I could not verify a matching title in our current electronic catalogue. That does not rule out a physical copy. Let’s check the exact title or author.')
    : reply;
  const normalizedReply=normalize(reply);
  const identified=matches.map(book=>({book,pos:normalizedReply.indexOf(normalize(book.title))}))
    .filter(x=>x.pos>=0).sort((a,b)=>a.pos-b.pos);
  // Preserve the titles selected by the model, but replace unverified claims.
  const selected=(identified.length?identified.map(x=>x.book):matches).slice(0,3);
  const arabic=locale==='ar';
  const head=arabic
    ? 'من فهرس المكتبة، هذي بعض الكتب اللي ممكن تناسب طلبك:'
    : 'I found a few books on this topic in our school catalogue. Here are some good starting points:';
  const items=selected.map(book=>{
    const where=book.shelf!==undefined
      ? (arabic
        ? 'في المكتبة الورقية، الرف '+book.shelf+'، الصف '+book.row
        : 'Physical library, shelf '+book.shelf+', row '+book.row)
      : (arabic?'في المكتبة الرقمية':'In the digital library');
    const href=book.shelf===undefined?validLink(book.driveLink):null;
    const link=href?' — ['+(arabic?'فتح الكتاب':'Open book')+']('+href+')':'';
    return '- **'+escapeMd(book.title)+'** — '+where+link+'.';
  });
  const note=arabic
    ? 'هذي ترشيحات من بيانات الفهرس، وما تعني تأكيد توافر النسخة للإعارة الحين.'
    : 'These suggestions use catalogue records, not a verified reading of every book or live loan availability.';
  const question=arabic
    ? 'تفضّل كتب بالعربي ولا بالإنجليزي؟'
    : 'Would you prefer to read in Arabic or English?';
  return [head,items.join('\n'),note,question].join('\n\n');
}

/**
 * A narrow presentation cleanup for generated *recommendation* prose.
 * Preserve book-title emphasis, paragraph text and verified links. This does
 * not run on lessons, discussion, research, certificates or ordinary catalog
 * lookup routes.
 */
export function polishSaqrRecommendationProse(reply:string):string{
  return String(reply||'')
    .replace(/بصفتي مكتبة المدرسة[،,]?\s*/g,'')
    .split('\n').map(line=>{
      const allBold=line.match(/^(\s*(?:-\s*)?)\*\*(.+)\*\*(\s*)$/);
      if(!allBold)return line;
      const inner=allBold[2];
      // Unbold whole conversational sentences and full multi-clause bullets,
      // not short standalone book titles.
      if(inner.length<55 && !/[.:؟!]$/.test(inner))return line;
      return allBold[1]+inner+allBold[3];
    }).join('\n');
}
