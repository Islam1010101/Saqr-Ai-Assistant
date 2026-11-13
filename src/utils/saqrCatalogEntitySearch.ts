/**
 * Dataset-driven named-work/author/series lookup for every EFIPS catalogue.
 * Never infer holdings from a subject, a synopsis, or an author's biography.
 * A generic topic request stays on the existing topic-search path.
 */
export type CatalogEntityRecord = {
  title?:string; author?:string; series?:string; subject?:string;
};
export type CatalogEntityCollections = {
  physical: ReadonlyArray<CatalogEntityRecord>;
  arabic: ReadonlyArray<CatalogEntityRecord>;
  english: ReadonlyArray<CatalogEntityRecord>;
};
export type SaqrCatalogEntity = {
  kind:'author'|'title'|'series';
  /** Normalized meaningful query words; no hard-coded author/title names. */
  tokens:readonly string[];
  confidence:'exact'|'close';
};
const normalize=(text:string):string=>String(text||'').normalize('NFKC').toLocaleLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[^\p{L}\p{N}]+/gu,' ').trim();
// Generic request words are NOT part of an author's name or a book title.
// In particular: "روايات أجاثا..." and "Agatha Christie novels".
const NOISE=new Set([
  'اين','فين','هل','اي','ايه','ما','ماذا','اسم','اسماء','لديكم','عندكم','عندي',
  'ابحث','ابحثلي','دور','دورلي','دورلي','دورلي','وريني','هات','هاتلي','عايز','عاوز','اريد','ابي','ابغي',
  'اعطني','ارني','ممكن','لو','سمحت','اقترح','رشحلي','ترشحلي','اللي','في','عن','على','حول',
  'مكتبه','المكتبه','فهرس','الفهرس','مدرستنا','المدرسه','الرقميه','العربيه','الانجليزيه','الورقيه',
  'كتاب','الكتاب','كتب','الكتب','روايه','الروايه','روايات','الروايات','قصه','قصص',
  'مؤلفات','مؤلفاته','مؤلف','المؤلف','مؤلفه','المؤلفه','كاتب','الكاتب','كاتبه','الكاتبه',
  'اعمال','الاعمال','سلسله','السلسله','مجموعه','المجموعه','بعنوان','اسمه','اسمها',
  'للكاتب','للكاتبه','للمؤلف','للمؤلفه','ل','لي','من','ب','مع','خاصه','جميع','كل','باقي',
  'find','search','show','look','for','me','please','i','want','a','an','the','in','our','your',
  'library','efips','books','book','novel','novels','stories','story','works','works','written',
  'by','author','writer','series','titles','title','all','any','about','of','and','read','reading',
  'recommend','suggest','give','need','have','do','you','is','there','are','where','can','some'
]);
const words=(text:string):string[]=>normalize(text).split(' ')
  .filter(word=>!!word && !NOISE.has(word) && (word.length>1 || /^\d+$/.test(word)));
const normalizedFieldWords=(text:string):string[]=>normalize(text).split(' ')
  .filter(word=>!!word && !['د','dr','mr','mrs','prof'].includes(word))
  .map(word=>word.startsWith('ال')&&word.length>=6?word.slice(2):word);
const normalizedQueryWords=(text:string):string[]=>words(text)
  .map(word=>word.startsWith('ال')&&word.length>=6?word.slice(2):word);
const distance=(a:string,b:string,cap:number):number=>{
  if(Math.abs(a.length-b.length)>cap)return cap+1;
  const row=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){
    let prev=row[0];row[0]=i;let min=row[0];
    for(let j=1;j<=b.length;j++){
      const old=row[j];
      row[j]=Math.min(row[j]+1,row[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));
      prev=old;min=Math.min(min,row[j]);
    }
    if(min>cap)return cap+1;
  }
  return row[b.length];
};
const tokenDifference=(a:string,b:string):number=>{
  if(a===b)return 0;
  // Allow one clear typo in a long word; two edits only for very long words.
  const cap=Math.min(a.length,b.length)>=10?2:1;
  if(Math.min(a.length,b.length)<5)return 99;
  return distance(a,b,cap);
};
const phraseMatch=(needle:readonly string[],haystack:readonly string[]):'exact'|'close'|null=>{
  if(haystack.length<needle.length||needle.length<2)return null;
  for(let i=0;i<=haystack.length-needle.length;i++){
    let errors=0,failed=false;
    for(let j=0;j<needle.length;j++){
      const diff=tokenDifference(needle[j],haystack[i+j]);
      if(diff>2){failed=true;break;}
      errors+=diff;
      if(errors>2){failed=true;break;}
    }
    if(!failed)return errors===0?'exact':'close';
  }
  return null;
};
const isGenericTopicRequest=(q:string):boolean=>
  /(?:\b(?:books?|novels?|stories)\s+(?:about|on)\b|(?:كتب|كتاب|روايات|قصص|روايه)\s+(?:عن|حول|في)(?:\s|$))/i.test(q);
const hasNamedField=(book:CatalogEntityRecord,entity:SaqrCatalogEntity):boolean=>{
  const fields=entity.kind==='author'?[book.author||'']:
    entity.kind==='series'?[book.series||'']:[book.title||'',book.series||''];
  return fields.some(value=>phraseMatch(entity.tokens,normalizedFieldWords(value))!==null);
};
export const isSaqrExplicitNamedCatalogRequest=(query:string):boolean=>
  /(?:^(?:ابحث|إبحث|ابحثلي|دور|دورلي|هاتلي|وريني|find|search|show|look\s+for)(?:\s|$)|(?:^|\s)(?:مؤلفات|روايات|كتب|للكاتب|للمؤلف)(?:\s|$)|\b(?:books?\s+by|novels?\s+by|works?\s+by)\b|\b(?:books?|novels?)\s*$)/i.test(query);
export const resolveSaqrCatalogEntity=(
  query:string,collections:CatalogEntityCollections
):SaqrCatalogEntity|null=>{
  const q=String(query||'').trim(),tokens=normalizedQueryWords(q);
  if(q.length>180||tokens.length<2||tokens.length>8 || tokens.join('').length<5 ||
     isGenericTopicRequest(q))return null;
  const authorCue=/(?:مؤلفات|مؤلفاته|للمؤلف|للكاتب|الكاتب|\b(?:by|author|writer)\b)/i.test(q);
  const titleCue=/(?:بعنوان|اسمه|اسمها|عنوان|\b(?:called|titled|named)\b)/i.test(q);
  const collection=[...collections.physical,...collections.arabic,...collections.english];
  let best:{score:number;value:SaqrCatalogEntity}|null=null;
  for(const book of collection){
    const checks:Array<{kind:SaqrCatalogEntity['kind'];field:string;weight:number}>=[
      {kind:'author',field:book.author||'',weight:authorCue?150:titleCue?98:125},
      {kind:'title',field:book.title||'',weight:titleCue?150:120},
      {kind:'series',field:book.series||'',weight:110}
    ];
    for(const item of checks){
      if(!item.field||/^(?:unknown author|مؤلف غير معروف|مؤلف غير مسجل|غير محدد|authors?|various|multiple authors?)$/i.test(item.field.trim()))continue;
      const quality=phraseMatch(tokens,normalizedFieldWords(item.field));
      if(!quality)continue;
      const score=item.weight+(quality==='exact'?12:0);
      if(!best||score>best.score){
        best={score,value:{kind:item.kind,tokens,confidence:quality}};
      }
    }
  }
  return best?.value||null;
};
export const catalogBookMatchesEntity=(book:CatalogEntityRecord,entity:SaqrCatalogEntity):boolean=>
  hasNamedField(book,entity);
export const isSaqrNamedAuthorQuery=(query:string,catalogs:CatalogEntityCollections):boolean=>
  resolveSaqrCatalogEntity(query,catalogs)?.kind==='author';
