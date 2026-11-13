/**
 * Short, opt-in reader interview for open-ended "what should I read?" requests.
 * A two-question conversation precedes ALL suggestions. This is intentionally
 * separate from named-book searches, lesson planning and Little Author.
 */
import type { SaqrBookMatch } from './saqrCatalogSearch.ts';
import { classifyBookAudience } from '../../api/bookAudience.ts';

export type ReaderTurn = {role:string;content:string};
export type InterviewStep =
  | {kind:'none'}
  | {kind:'ask-interests';reply:string}
  | {kind:'ask-age';interests:string;reply:string}
  | {kind:'recommend';interests:string;age:number|null;grade:number|null;locale:'ar'|'en';reply?:never}
  | {kind:'repeat-age';reply:string};

const INTERESTS = {
  ar:'أكيد! خلنا نختار كتاب على ذوقك. شو هواياتك، وإيش المواضيع أو أنواع القصص اللي تحبها؟ مثل المغامرات، العلوم، الرياضة، الغموض أو تاريخ الإمارات.',
  en:'Of course! I would love to help you find a book you will enjoy. What are your hobbies, and what topics or stories do you like—adventure, science, sports, mysteries, UAE heritage, or something else?'
};
const AGE = {
  ar:'حلو! عشان أختار لك مستوى قراءة مناسب، كم عمرك؟ أو في أي صف دراسي أنت؟',
  en:'Nice! To find a book at the right reading level, how old are you, or what school grade are you in?'
};
const AGE_RETRY = {
  ar:'بس احتاج أعرف عمرك أو صفك الدراسي عشان ما أرشح لك كتاب أصعب أو أسهل من اللازم. كم عمرك، أو أي صف؟',
  en:'Just one more thing: how old are you, or what grade are you in? That will help me avoid suggesting a book that is too easy or too difficult.'
};
const normalize = (s:string) => s.toLowerCase().replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').trim();
const focusedRequest=/(?:\b(?:about|on|about the|for my class|by)\s+\S+|\b(?:fantasy|mystery|science|space|history|sports|adventure|horror|romance|coding|animals|comics)\b|(?:عن|حول|في)\s+(?:الفضاء|العلوم|الرياضه|التاريخ|التراث|المغامرات|موضوع|الحيوانات|البرمجه|قصه|روايه))/i;
const readIntent=/(?:\b(?:read|reading|books?|novels?|stories|recommend|suggest|advi[cs]e|advace)\b|(?:اقرا|اقرأ|أقرأ|قراءه|كتاب|كتب|روايه|روايات|رشح|اقترح))/i;
const openRequest=/(?:\b(?:i\s+(?:want|wanna|need|would\s+like|like)|what\s+(?:book|books)|can\s+you|could\s+you|please|recommend|suggest|advise|advice|advace|which\s+book)\b|(?:عايز|عاوز|نفسي|ابغي|ابي|اريد|محتاج|رشحلي|ترشحلي|اقترحلي|تنصحني|اختارلي))/i;
const explicitNewTask=/(?:\b(?:lesson|worksheet|quiz|homework|presentation|write\s+(?:a|my)\s+story|find\s+in\s+the\s+library|where\s+is)\b|(?:تحضير|ورقه\s*عمل|واجب|اختبار|تحدي|المؤلف\s*الصغير|درس|فهرس|وين\s*الكتاب|اين\s*الكتاب))/i;
const cancel=/(?:\b(?:cancel|stop|never\s*mind|forget\s*it|no\s*thanks)\b|(?:الغ[يى]|خلاص|مش\s*عايز|لا\s*شكرا|وقف))/i;
export const isOpenEndedBookAdvice=(text:string):boolean=>{
  const q=normalize(String(text||''));
  return q.length>0 && readIntent.test(q) && openRequest.test(q) &&
    !focusedRequest.test(q) && !explicitNewTask.test(q);
};
const parseNumber=(value:string):number|null=>{
  // Accept English and Arabic-Indic digits.
  const numeric=String(value).replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  const hit=numeric.match(/(?:^|[^\d])(\d{1,2})(?=$|[^\d])/);
  return hit?Number(hit[1]):null;
};
export const parseReadingAge=(text:string):{age:number|null;grade:number|null}=>{
  const n=parseNumber(text);
  if(n===null)return {age:null,grade:null};
  const explicitGrade=/(?:\b(?:grade|year|class)\b|الصف|صف\s|سنه\s*دراسي)/i.test(text);
  if(explicitGrade)return {age:null,grade:n>=1&&n<=12?n:null};
  return {age:n>=5&&n<=100?n:null,grade:null};
};
export function getReadingInterviewStep(
  query:string,history:ReadonlyArray<ReaderTurn>,locale:'ar'|'en'
):InterviewStep{
  const q=String(query||'').trim();
  if(!q||cancel.test(q)||explicitNewTask.test(q))return {kind:'none'};
  const lastAssistant=[...history].reverse().find(m=>m.role==='assistant')?.content?.trim();
  const responseLanguage: 'ar'|'en' =
    lastAssistant===INTERESTS.en||lastAssistant===AGE.en||lastAssistant===AGE_RETRY.en ? 'en' :
    lastAssistant===INTERESTS.ar||lastAssistant===AGE.ar||lastAssistant===AGE_RETRY.ar ? 'ar' :
    /[\u0600-\u06ff]/.test(q) ? 'ar' : /[a-z]{2,}/i.test(q) ? 'en' : locale;
  if(lastAssistant===INTERESTS.ar||lastAssistant===INTERESTS.en){
    // If both hobby and age were supplied at once, skip the redundant question.
    const parsed=parseReadingAge(q);
    if(parsed.age!==null||parsed.grade!==null){
      const interests=q.replace(/(?:\b(?:age|aged|grade|year|class)\s*)?\b\d{1,2}\b(?:\s*years?\s*old)?/gi,'').trim();
      return {kind:'recommend',interests:interests||q,age:parsed.age,grade:parsed.grade,locale:responseLanguage};
    }
    if(q.length<2)return {kind:'ask-interests',reply:INTERESTS[responseLanguage]};
    return {kind:'ask-age',interests:q,reply:AGE[responseLanguage]};
  }
  if(lastAssistant===AGE.ar||lastAssistant===AGE.en||lastAssistant===AGE_RETRY.ar||lastAssistant===AGE_RETRY.en){
    const parsed=parseReadingAge(q);
    if(parsed.age===null&&parsed.grade===null)return {kind:'repeat-age',reply:AGE_RETRY[responseLanguage]};
    const previousQuestionIndex=history.map(turn=>turn.role==='assistant' && (turn.content===INTERESTS.ar||turn.content===INTERESTS.en)).lastIndexOf(true);
    const interests=previousQuestionIndex>=0
      ? history.slice(previousQuestionIndex+1).find(turn=>turn.role==='user')?.content||''
      : '';
    return {kind:'recommend',interests:interests||'books',age:parsed.age,grade:parsed.grade,locale:responseLanguage};
  }
  if(isOpenEndedBookAdvice(q))return {kind:'ask-interests',reply:INTERESTS[responseLanguage]};
  return {kind:'none'};
}
type CatalogBook={
  title:string;author?:string;subject?:string;summary?:string;
  shelf?:number;row?:number;language?:string;
  driveLink?:string;readingAudience?:string;reviewedAgeGroup?:string
};
const normTitle=(s:string)=>normalize(s).replace(/[^\p{L}\p{N}]+/gu,' ');
const matching=(book:SaqrBookMatch,records:ReadonlyArray<CatalogBook>):CatalogBook|undefined=>
  records.find(r=>normTitle(r.title)===normTitle(book.title) &&
    (book.shelf===undefined ? r.driveLink===book.driveLink : r.shelf===book.shelf&&r.row===book.row));
const bandFor=(book:SaqrBookMatch,source:CatalogBook):'children'|'teens'|'adults'|'unknown'=>{
  if(book.shelf===undefined){
    const age=source.reviewedAgeGroup||source.readingAudience;
    return age==='children'||age==='teens'||age==='adults'?age:'unknown';
  }
  const audience=classifyBookAudience({title:source.title,author:source.author,
    subject:source.subject||'',shelf:source.shelf||0});
  if(audience==='children')return 'children';
  if(audience==='youth'||audience==='teens')return 'teens';
  if(audience==='specialist')return 'adults';
  return 'unknown';
};
export function renderReadingInterviewSuggestions(args:{
  matches:ReadonlyArray<SaqrBookMatch>;physical:ReadonlyArray<CatalogBook>;
  arabic:ReadonlyArray<CatalogBook>;english:ReadonlyArray<CatalogBook>;
  interests:string;age:number|null;grade:number|null;locale:'ar'|'en'
}):string{
  const ar=args.locale==='ar',target=ar?'ar':'en';
  const range=args.age!==null?(args.age<=12?'children':args.age<=17?'teens':'adults')
    :(args.grade!==null?(args.grade<=6?'children':'teens'):'unknown');
  const pool=args.matches.flatMap(book=>{
    const physical=book.shelf!==undefined;
    const records=physical?args.physical:book.pageLocation.includes('العربية')?args.arabic:args.english;
    const source=matching(book,records);
    if(!source)return [];
    const lang=physical?(source.language==='AR'?'ar':source.language==='EN'?'en':null)
      :(book.pageLocation.includes('العربية')?'ar':'en');
    if(lang!==target)return [];
    const audience=bandFor(book,source);
    // Never automatically select adult/specialist material for minors.
    if(range==='children' && audience!=='children')return [];
    if(range==='teens' && audience!=='children' && audience!=='teens')return [];
    if(range==='adults' && audience==='children')return [];
    if(range==='unknown' && audience==='adults')return [];
    return [{book,source,audience}];
  });
  const selected:typeof pool=[];
  const seen=new Set<string>();
  for(const candidate of pool){
    const key=normTitle(candidate.book.title);
    if(seen.has(key))continue;
    seen.add(key);
    selected.push(candidate);
    if(selected.length>=3)break;
  }
  const opener=ar?'بناءً على اهتماماتك، هذه كتب وجدتها في فهرس مكتبتنا:'
    :'Based on what you enjoy, these are books I found in our school catalogue:';
  if(!selected.length)return ar
    ? 'عرفت اهتماماتك ومستواك، لكن ما لقيت حاليًا عنوانًا موثقًا يطابقها ومناسبًا لسنك باللغة العربية في فهرس المدرسة. تحب نجرّب موضوعًا قريبًا أو لغة ثانية؟'
    : 'Thanks, that helps! I could not confirm a matching book for those interests and reading level in the current English EFIPS catalogue. Would you like to try a related topic or another language?';
  const rows=selected.map(({book,source},i)=>{
    const where=book.shelf!==undefined
      ? (ar?`الرف ${book.shelf}، الصف ${book.row}`:`Shelf ${book.shelf}, row ${book.row}`)
      : (book.driveLink && /^https:\/\//.test(book.driveLink)
        ? `[${ar?'فتح الكتاب الرقمي':'Open digital book'}](${book.driveLink})`
        : (ar?'في المكتبة الرقمية':'In the digital library'));
    const note=(source.subject||book.subject||'').trim().slice(0,100);
    return `${i+1}. **${book.title}**${source.author?' — '+source.author:''}\n   ${where}${note?' · '+note:''}`;
  });
  const caveat=ar?'الاختيار مبني على بيانات الفهرس وتصنيفات قراءة إرشادية، وليس فحصًا كاملًا لمحتوى كل طبعة؛ والموقع لا يؤكد توافر الإعارة لحظيًا.'
    :'These suggestions use catalogue metadata and provisional reading levels, not a full review of each edition or live borrowing availability.';
  const followUp=ar?'أي واحد شدّ انتباهك؟ أقدر أعرّفك عنه أكثر.':'Which one catches your eye? I can tell you more about it.';
  return [opener,rows.join('\n\n'),caveat,followUp].join('\n\n');
}
