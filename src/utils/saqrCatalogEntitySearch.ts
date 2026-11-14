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
  'يا','فضلك','شكرا','يريت','ياريت','تجيبلي','جيبلي','هاتلي','اشوف','شوف','عايزه','عاوزه','عاوزة','بتاع','بتاعة','بتاعت','حابه','حابب','لدينا','فيه',
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
const words=(text:string):string[]=>String(text||'')
  .replace(/^\s*(?:يا\s+)?صقر[\s،,.:]+(?=(?:ابحث|إبحث|دور|دورلي|وريني|هاتلي|find|search|show))/i,'')
  .normalize('NFKC').toLocaleLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .split(/[^\p{L}\p{N}]+/gu)
  // Filter ORIGINAL Arabic spelling first: "على" is a preposition,
  // while "علي" is a real person's name. Never merge them as stop words.
  .filter(word=>!!word && !NOISE.has(word) && !NOISE.has(normalize(word)))
  .map(normalize).filter(Boolean);
// User query tokens already omit connective words. Apply the same rule
// to recorded titles so "Death Of a Salesman" matches its complete title,
// rather than an unrelated "In Death" series volume.
const FIELD_CONNECTORS=new Set(['a','an','the','and','of','in','on','to','for','at']);
const normalizedFieldWords=(text:string):string[]=>normalize(text).split(' ')
  .filter(word=>!!word&&!FIELD_CONNECTORS.has(word)&&!['د','dr','mr','mrs','prof'].includes(word))
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
  // distance() returns cap+1 for every word farther than cap; that
  // sentinel must NOT count as a legitimate second typo in phraseMatch().
  // Otherwise "Death ... Salesman" falsely matches "Death ... series".
  const edits=distance(a,b,cap);
  return edits<=cap?edits:99;
};
// Conservative phonetic fallback for names written in a different script.
// It works from each ACTUAL catalog entry, not a list of famous writers.
// Require at least two matching words and a long combined consonant skeleton;
// never use this for one-word category/topic matches.
const arabicRoman:Readonly<Record<string,string>>={
  'ا':'a','ب':'b','ت':'t','ث':'th','ج':'g','ح':'h','خ':'kh','د':'d','ذ':'dh',
  'ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'a',
  'غ':'gh','ف':'f','ق':'k','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w',
  'ي':'y','ئ':'y','ؤ':'w','ء':'','پ':'b','ڤ':'f','چ':'k'
};
const phonetic=(word:string):string=>{
  const arabic=/[\u0600-\u06ff]/.test(word);
  let latin=arabic?[...word].map(c=>arabicRoman[c]??c).join(''):word;
  latin=latin.replace(/sch/g,'sh').replace(/ch|ck|kh|qu/g,'k')
    .replace(/th/g,'t').replace(/ph/g,'f').replace(/gh/g,'g')
    .replace(/c/g,'k').replace(/j/g,'g').replace(/q/g,'k').replace(/p/g,'b')
    .replace(/v/g,'f').replace(/[aeiouy]/g,'').replace(/(?!^)w/g,'')
    .replace(/(.)\1+/g,'$1');
  return latin;
};
const phoneticPhraseMatch=(needle:readonly string[],haystack:readonly string[]):boolean=>{
  if(needle.length<2||haystack.length<needle.length)return false;
  for(let i=0;i<=haystack.length-needle.length;i++){
    const words=haystack.slice(i,i+needle.length);
    const left=needle.map(phonetic),right=words.map(phonetic);
    if(left.some((x,j)=>x.length<2||right[j].length<2) ||
       left.join('').length<5 || right.join('').length<5)continue;
    let errors=0;
    for(let j=0;j<left.length;j++)errors+=distance(left[j],right[j],1);
    if(errors<=1)return true;
  }
  return false;
};
const phraseMatch=(needle:readonly string[],haystack:readonly string[]):'exact'|'close'|null=>{
  if(needle.length<2)return null;
  // Also try omitting single-letter middle initials in a recorded name:
  // Craig R. Hickman is still found by "Craig Hickman".
  const variants=[haystack,haystack.filter(word=>word.length>1)];
  for(const field of variants){
    if(field.length<needle.length)continue;
    // Phonetics are a strict cross-script fallback, never a replacement for
    // direct title/author matches in the same writing system.
    const crossScript=/[\u0600-\u06ff]/.test(needle.join(''))!==/[\u0600-\u06ff]/.test(field.join(''));
    if(crossScript){
      if(phoneticPhraseMatch(needle,field))return 'close';
      continue;
    }
    for(let i=0;i<=field.length-needle.length;i++){
      let errors=0,failed=false;
      for(let j=0;j<needle.length;j++){
        const diff=tokenDifference(needle[j],field[i+j]);
        if(diff>2){failed=true;break;}
        errors+=diff;
        if(errors>2){failed=true;break;}
      }
      if(!failed)return errors===0?'exact':'close';
    }
  }
  return null;
};
const isGenericTopicRequest=(q:string):boolean=>
  // Generic subject requests stay generic even with a genre/style adjective:
  // "رواية خيالية عن الفضاء" is NOT a named title ("خيالية الفضاء").
  /(?:\b(?:books?|novels?|stories)\s+(?:about|on)\b|(?:كتب|كتاب|روايات|قصص|رواي[ةه]|قص[ةه])\s+(?:(?:خيال(?:ي[ةه])?|علمي[ةه]?|مصور[ةه]?|سهل[ةه]?|مبسط[ةه]?|مشوق[ةه]?|fantasy|science fiction)\s+)*(?:عن|حول|في)(?:\s|$))/i.test(normalize(q));
const hasNamedField=(book:CatalogEntityRecord,entity:SaqrCatalogEntity):boolean=>{
  const fields=entity.kind==='author'?[book.author||'']:
    entity.kind==='series'?[book.series||'']:[book.title||'',book.series||''];
  return fields.some(value=>phraseMatch(entity.tokens,normalizedFieldWords(value))!==null);
};
export const isSaqrExplicitNamedCatalogRequest=(query:string):boolean=>
  /(?:(?:^|[\s،,:])(?:ابحث|إبحث|ابحثلي|دور|دورلي|هاتلي|وريني|find|search|show|look\s+for)(?:\s|$)|(?:^|\s)(?:مؤلفات|روايات|كتب|للكاتب|للمؤلف)(?:\s|$)|\b(?:books?\s+by|novels?\s+by|works?\s+by)\b|\b(?:books?|novels?)\s*$)/i.test(query);
export const resolveSaqrCatalogEntity=(
  query:string,collections:CatalogEntityCollections
):SaqrCatalogEntity|null=>{
  const q=String(query||'').trim(),tokens=normalizedQueryWords(q);
  const single=tokens.length===1 && tokens[0].length>=3;
  if(q.length>180||tokens.length>8 || tokens.join('').length<3 ||
     (!single && tokens.length<2) || isGenericTopicRequest(q))return null;
  // A single name is searched only as an EXACT recorded standalone title,
  // or an author's distinctive surname with an explicit author cue.
  if(single){
    if(!isSaqrExplicitNamedCatalogRequest(q))return null;
    const authorCue=/(?:مؤلفات|للكاتب|للمؤلف|الكاتب|\b(?:by|author|writer)\b)/i.test(q);
    const collection=[...collections.physical,...collections.arabic,...collections.english];
    if(authorCue && tokens[0].length>=4 && collection.some(book=>{
      const author=normalizedFieldWords(book.author||'');
      return author.length>=2 && author[author.length-1]===tokens[0];
    }))return {kind:'author',tokens,confidence:'exact'};
    if(collection.some(book=>{
      const title=normalizedFieldWords(book.title||'');
      return title.length===1 && title[0]===tokens[0];
    }))return {kind:'title',tokens,confidence:'exact'};
    return null;
  }
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
export const catalogBookMatchesEntity=(book:CatalogEntityRecord,entity:SaqrCatalogEntity):boolean=>{
  if(entity.tokens.length===1){
    const word=entity.tokens[0];
    if(entity.kind==='title'){
      const title=normalizedFieldWords(book.title||'');
      return title.length===1 && title[0]===word;
    }
    if(entity.kind==='author'){
      const author=normalizedFieldWords(book.author||'');
      return author.length>=2 && author[author.length-1]===word;
    }
    return false;
  }
  return hasNamedField(book,entity);
};
export const isSaqrNamedAuthorQuery=(query:string,catalogs:CatalogEntityCollections):boolean=>
  resolveSaqrCatalogEntity(query,catalogs)?.kind==='author';
