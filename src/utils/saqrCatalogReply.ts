import type {SaqrBookMatch} from './saqrCatalogSearch.ts';

// Verified holding answers are assembled from recorded catalog data, not LLM guesses.
const overview = /(?:^|\s)(?:books?|novels?|catalog(?:ue)?|ebooks?|titles?|reading\s+list)(?:\s|$)|كتب|كتاب|فهرس|المكتبة|مكتبة|روايات|اقترح|رشح|الرف|مكان\s+الكتاب/i;
const summarize = /(?:لخص|تلخيص|ملخص|ملخّص|اشرح\s+(?:لي\s+)?(?:الكتاب|رواية)|summary|summari[sz]e|what is the (?:book|story) about|analy[sz]e (?:this|the) book|حلل\s+(?:هذا\s+)?(?:الكتاب|الرواية))/i;
const discussion = /(?:ناقشني|نتناقش|نناقش|مناقش[ةه]|خلينا نتكلم|discuss|discussion|debate)/i;
export const isSaqrCatalogLookup = (query:string):boolean =>
  overview.test(query) && !summarize.test(query) && !discussion.test(query);

export const selectSaqrCatalogScope=(question:string):'physical'|'arabic'|'english'|'all'=>{
  if(/المكتبة\s*(?:الرقمية\s*)?(?:ال[إا]نجليزية|ال[إا]نكليزية)|english\s+(?:digital\s+)?library|english\s+(?:ebooks?|catalog)/i.test(question))return 'english';
  if(/المكتبة\s*(?:الرقمية\s*)?العربية|arabic\s+(?:digital\s+)?library|arabic\s+(?:ebooks?|catalog)/i.test(question))return 'arabic';
  if(/(?:المكتبة\s*(?:الورقية|العادية)|فهرس\s*(?:الكتب\s*)?الورقي|physical\s+library|print\s+catalog)/i.test(question))return 'physical';
  return 'all';
};
const collection=(book:SaqrBookMatch):'physical'|'arabic'|'english'=>
  book.pageLocation.includes('العادية') ? 'physical':
  book.pageLocation.includes('العربية') ? 'arabic':'english';

const escapeMd=(value:string)=>String(value).replace(/([\\\x60*_{}\[\]<>])/g,'\\$1').trim();
const digitalLink=(url:string|undefined):string|null=>{
  if(!url)return null;
  try {
    const u=new URL(url.trim());
    return u.protocol==='https:' ? u.toString() : null;
  } catch{return null;}
};

export function renderSaqrCatalogAnswer(question:string,matches:SaqrBookMatch[],locale:'ar'|'en'):string{
  const ar=locale==='ar';
  const scope=selectSaqrCatalogScope(question);
  const valid=matches.filter(book=>scope==='all'||collection(book)===scope);
  if(!valid.length) return ar
    ? 'لم أعثر على نتيجة مؤكدة تطابق بحثك في الفهرس المحدد. هذا لا يعني أن الكتاب غير موجود في مكان آخر. جرّب تحديد موضوع أدق أو عنوان أو مؤلف.'
    : 'I could not confirm a matching title in the selected EFIPS catalog. That does not mean it is unavailable elsewhere. Try a narrower topic, title or author.';
  const groups:[string,string][]=[['physical',ar?'الكتب الورقية':'Physical library'],['arabic',ar?'المكتبة الرقمية العربية':'Arabic digital library'],['english',ar?'المكتبة الرقمية الإنجليزية':'English digital library']];
  const output:string[]=[ar?'## نتائج البحث في فهارس مكتبة EFIPS':'## Verified EFIPS catalog results'];
  for(const [kind,label] of groups){
    const items=valid.filter(book=>collection(book)===kind);
    if(!items.length)continue;
    output.push('### '+label);
    for(const [i,book] of items.entries()){
      const title=escapeMd(book.title),author=escapeMd(book.author|| (ar?'غير مسجل':'Not recorded'));
      const source=kind==='physical'
        ? (ar?'الرف':'Shelf')+': '+(book.shelf ?? (ar?'غير مسجل':'Not recorded'))+' — '+(ar?'الصف':'Row')+': '+(book.row ?? (ar?'غير مسجل':'Not recorded'))
        : digitalLink(book.driveLink)
          ? '['+(ar?'فتح الكتاب الرقمي':'Open digital book')+']('+digitalLink(book.driveLink)+')'
          : (ar?'الرابط غير مسجل في الفهرس':'No catalog link recorded');
      const reason=escapeMd(book.subject || (ar?'دون تصنيف مفصل':'No detailed subject'));
      output.push((i+1)+'. **'+title+'**  \n   '+(ar?'المؤلف':'Author')+': '+author+'  \n   '+(kind==='physical'?(ar?'المكان':'Location'):(ar?'الرابط':'Link'))+': '+source+'  \n   '+(ar?'الموضوع المسجل':'Catalog subject')+': '+reason);
    }
  }
  output.push(ar?'المعلومات مأخوذة من فهارس المكتبة؛ ولا تعني تأكيد توافر النسخة للاستعارة الآن.':'These details come from EFIPS catalog records, not live borrowing availability.');
  return output.join('\n\n');
}
