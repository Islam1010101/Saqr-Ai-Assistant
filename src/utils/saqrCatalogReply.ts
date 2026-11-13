import type {SaqrBookMatch} from './saqrCatalogSearch.ts';
import {isCrossLanguageTitleQuery, isSaqrNamedAuthorQuery} from './saqrCatalogSearch.ts';

// Verified holding answers are assembled from recorded catalog data, not LLM guesses.
const overview = /(?:^|\s)(?:books?|novels?|catalog(?:ue)?|ebooks?|titles?|reading\s+list)(?:\s|$)|كتب|كتاب|فهرس|المكتبة|مكتبة|روايات|اقترح|رشح|الرف|مكان\s+الكتاب/i;
const summarize = /(?:لخص|تلخيص|ملخص|ملخّص|اشرح\s+(?:لي\s+)?(?:الكتاب|رواية)|summary|summari[sz]e|what is the (?:book|story) about|analy[sz]e (?:this|the) book|حلل\s+(?:هذا\s+)?(?:الكتاب|الرواية))/i;
const discussion = /(?:ناقشني|نتناقش|نناقش|مناقش[ةه]|خلينا نتكلم|discuss|discussion|debate)/i;
// Learning about a named book is a librarian explanation, not a catalog list.
const learnMore = /(?:اعرف|أعرف|معرفه|معرفة|معلومات|تفاصيل|نبذه|نبذة|عرفني|احكيلي|اخبرني|أخبرني|tell me|learn more|know more|more (?:information|details) about)/i;
// Recommendations are a librarian conversation, not a raw catalogue dump.
// Keep explicit "find/search/show" requests on the verified catalogue fast path.
const broadGenreRequest = /(?:(?:عايز|عاوز|أبغي|ابغي|أبغى|أبي|ابي|أريد|اريد|محتاج|تبا)\s+(?:لي\s+)?(?:كتاب|رواي[ةه]|قص[ةه]|كتب|روايات)\s+(?:(?:خيالي[ةه]?|علمي[ةه]?|مصور[ةه]?|سهل[ةه]?|مبسط[ةه]?|مشوق[ةه]?)\s+)*(?:عن|في|حول)\s+|(?:i want|i need|looking for)\s+(?:a\s+|some\s+)?(?:books?|novels?|stories)\s+(?:(?:science fiction|fantasy|easy|short)\s+)*(?:about|on|set in)\s+)/i;
const recommend = /(?:رشح(?:لي|لى|\s*لي|\s*لى)?|ترشح|ترشيح|اقترح|اقتراح|توصي[ةه]|توصيات|نصيحة\s*بكتاب|\brecommend\w*\b|\bsuggest\w*\b)/i;
export const isSaqrRecommendationRequest = (query:string):boolean => recommend.test(query)||broadGenreRequest.test(query);
export const isSaqrCatalogLookup = (query:string):boolean =>
  (overview.test(query)||isCrossLanguageTitleQuery(query)) && !isSaqrRecommendationRequest(query) && !summarize.test(query) && !discussion.test(query) && !learnMore.test(query);

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
  const namedAuthorSearch=isSaqrNamedAuthorQuery(question);
  const valid=matches.filter(book=>scope==='all'||collection(book)===scope);
  if(!valid.length) return ar
    ? 'لم أعثر على نتيجة مؤكدة تطابق بحثك في الفهرس المحدد. هذا لا يعني أن الكتاب غير موجود في مكان آخر. جرّب تحديد موضوع أدق أو عنوان أو مؤلف.'
    : 'I could not confirm a matching title in the selected EFIPS catalog. That does not mean it is unavailable elsewhere. Try a narrower topic, title or author.';
  const groups:[string,string][]=[['physical',ar?'الكتب الورقية':'Physical library'],['arabic',ar?'المكتبة الرقمية العربية':'Arabic digital library'],['english',ar?'المكتبة الرقمية الإنجليزية':'English digital library']];
  const output:string[]=[ar?'## نتائج البحث في فهارس مكتبة EFIPS':'## Verified EFIPS catalog results'];
  for(const [kind,label] of groups){
    const items=valid.filter(book=>collection(book)===kind);
    if(!items.length){
      // Author-name searches show only collections holding books by that
      // author, not irrelevant empty groups or broad genre suggestions.
      if(!namedAuthorSearch && (scope==='all' || scope===kind)){
        output.push('### '+label);
        output.push(ar?'لا توجد نتائج مؤكدة مطابقة للموضوع في هذا الفهرس.':'No verified catalog results match this topic in this collection.');
      }
      continue;
    }
    output.push('### '+label);
    for(const [i,book] of items.entries()){
      const title=escapeMd(book.title),author=escapeMd(book.author|| (ar?'غير مسجل':'Not recorded'));
      const source=kind==='physical'
        ? (ar?'الرف':'Shelf')+': '+(book.shelf ?? (ar?'غير مسجل':'Not recorded'))+' — '+(ar?'الصف':'Row')+': '+(book.row ?? (ar?'غير مسجل':'Not recorded'))
        : digitalLink(book.driveLink)
          ? '['+(ar?'فتح الكتاب الرقمي':'Open digital book')+']('+digitalLink(book.driveLink)+')'
          : (ar?'الرابط غير مسجل في الفهرس':'No catalog link recorded');
      const reason=escapeMd(book.subject || (ar?'دون تصنيف مفصل':'No detailed subject'));
      // Show the actual volume and its parent series only for the new
      // individual-series records; standalone and physical results are unchanged.
      const seriesInfo=kind!=='physical' && book.series
        ? '  \n   '+(ar?'السلسلة':'Series')+': '+escapeMd(book.series)
          +(book.seriesOrder!==undefined?' — '+(ar?'الجزء':'Volume')+': '+book.seriesOrder:'')
        : '';
      output.push((i+1)+'. **'+title+'**  \n   '+(ar?'المؤلف':'Author')+': '+author+'  \n   '+(kind==='physical'?(ar?'المكان':'Location'):(ar?'الرابط':'Link'))+': '+source+'  \n   '+(ar?'الموضوع المسجل':'Catalog subject')+': '+reason+seriesInfo);
    }
  }
  output.push(ar?'المعلومات مأخوذة من فهارس المكتبة؛ ولا تعني تأكيد توافر النسخة للاستعارة الآن.':'These details come from EFIPS catalog records, not live borrowing availability.');
  return output.join('\n\n');
}
