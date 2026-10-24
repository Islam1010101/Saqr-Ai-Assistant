/**
 * Optional, client-only reading enhancements for Saqr.
 * NEVER changes /api/chat, main identity prompt, story challenges or lesson plans.
 * A reader's role/grade are advisory (not authentication or permissions).
 */
import { classifyBookAudience, type BookAudience } from '../../api/bookAudience.ts';
import type { SaqrBookMatch } from './saqrCatalogSearch.ts';

export type SaqrMode = 'none'|'catalog'|'recommend'|'discussion'|'about';
export type ReaderInfo = {role:'student'|'teacher'|'admin'|'guest';grade:number|null};
export type ChatTurn = {role:string;content:string};
export type ReadingSuggestion = {title:string;audience:BookAudience;verifiedAge:false;location:string};
export const normalizeReader=(x:unknown):ReaderInfo=>{
  const v=(x && typeof x==='object'? x : {}) as Record<string,unknown>;
  const role= typeof v.role==='string' && ['student','teacher','admin','guest'].includes(v.role)
    ? v.role as ReaderInfo['role'] : 'guest';
  const grade=typeof v.grade==='number' && Number.isInteger(v.grade) && v.grade>=1 && v.grade<=12 ? v.grade : null;
  return {role,grade};
};
const lesson = /تحضير\s*(?:درس|حصة)|خطة\s*درس|عرض\s*تقديمي|lesson\s*plan|prepare\s*(?:a\s*)?lesson|presentation\s*(?:slides|structure)|mcgraw/i;
const challenge = /تحدي\s*المؤلف|المؤلف\s*الصغير|نؤلف\s*قص[ةه]|نألف\s*قص[ةه]|ابدأ\s*قص[ةه]|let.s\s*(?:write|create)\s*(?:a\s*)?story|little\s*author/i;
const about = /(?:who are you|what can you do|what does (?:this|the) (?:site|portal) offer|about saqr|your services|your features|introduce yourself|عرف\s*نفسك|عرفني\s*بنفسك|مين\s*انت|من\s*انت|ماذا\s*تقدم|خدماتك|مميزات\s*الموقع|ماذا\s*يقدم\s*الموقع|تقدر\s*تعمل\s*ايه)/i;
const dialogue = /(?:discuss|discussion|debate|talk about|let.s talk|let.s discuss|analy[sz]e with me|نناقش|نتناقش|ناقشني|خلينا نتكلم|حوار\s*حول|نتكلم\s*عن|تحدث\s*معي|تحاور\s*معي)/i;
const recommendations = /(?:recommend|suggest (?:a |some )?books?|suitable books|reading list|books? for (?:grade|children|teenagers)|رشح\s*لي|رشحلي|ترشح|اقترح\s*لي|توصيات|كتب\s*مناسب[ةه]|لليافعين|للصغار|حسب\s*مستواي)/i;
const books = /(?:\bbooks?\b|novels?|library catalog|ebooks?|catalogue|shelf|where (?:is|can i find)|كتب|كتاب|الكتب|الروايات|رف|الرف|المكتبة|المكتبه|دليل\s*الكتب|مراجع)/i;
/** Strict opt-in, so ordinary chat and all author/lesson flow is byte-for-byte unchanged. */
export function decideSaqrMode(question:string, history:ChatTurn[]):SaqrMode{
  const q=question.trim();
  if(!q||lesson.test(q)||challenge.test(q))return 'none';
  // Continue Little Author's original strict interaction throughout that conversation.
  if(history.some(m=>m.role==='user'&&challenge.test(m.content)))return 'none';
  if(about.test(q))return 'about';
  if(history.some((m,i)=>m.role==='user' && dialogue.test(m.content) && !history.slice(i+1).some(n=>n.role==='user' && (lesson.test(n.content)||challenge.test(n.content)))))return 'discussion';
  if(dialogue.test(q))return 'discussion';
  if(recommendations.test(q))return 'recommend';
  if(books.test(q))return 'catalog';
  return 'none';
}

const area=(profile:ReaderInfo):'young'|'middle'|'teen'|'unknown'=>
  profile.role!=='student'||profile.grade===null?'unknown':
  profile.grade<=5?'young':profile.grade<=8?'middle':'teen';

export function rankForReader(matches:SaqrBookMatch[],profile:ReaderInfo):ReadingSuggestion[]{
  const band=area(profile);
  const items=matches.map(b=>({
    title:b.title,
    audience:classifyBookAudience({title:b.title,subject:b.subject,shelf:b.shelf??0}),
    verifiedAge:false as const,
    location:b.shelf!==undefined ? 'Shelf '+b.shelf+', Row '+b.row : b.pageLocation+(b.driveLink?' | '+b.driveLink:'')
  }));
  const safe=band==='young'||band==='middle'?items.filter(x=>x.audience!=='specialist'):items;
  const priority=(k:BookAudience):number=>{
    if(band==='young')return k==='children'?0:k==='review'?2:3;
    if(band==='middle')return k==='teens'?0:k==='children'?1:k==='review'?2:3;
    if(band==='teen')return k==='teens'?0:k==='review'?1:k==='children'?2:3;
    if(profile.role==='teacher'||profile.role==='admin')return k==='specialist'?0:k==='review'?1:2;
    return k==='review'?1:0;
  };
  return safe.sort((a,b)=>priority(a.audience)-priority(b.audience)).slice(0,7);
}

const site='https://www.efipslibrary.com';
const services=[
  ['Physical book catalog','/#/search','all'],
  ['Arabic digital library','/#/digital-library/arabic','all'],
  ['English digital library','/#/digital-library/english','all'],
  ['Reading goals, reading lists, borrowed-book due dates and reminders','/#/home','all'],
  ['Book a library period','/#/schedule','teacher'],
  ['Creators portal','/#/creators','student'],
  ['Little Author interactive storytelling and existing certificate','/#/smart-search','all'],
  ['Saqr & UAE National Identity','/#/saqr-national-identity','all'],
  ['Saqr Studio','/#/saqr-studio','all'],
  ['Podcast','/#/podcast','all']
] as const;
// Verified institutional home/resource portals; NO external live search or title availability claim.
const references=[
  {tag:'education',name:'UAE Ministry of Education',url:'https://www.moe.gov.ae/en/'},
  {tag:'education',name:'Library of Congress Classroom Materials',url:'https://www.loc.gov/programs/teachers/classroom-materials/'},
  {tag:'heritage',name:'UNESCO Intangible Cultural Heritage',url:'https://ich.unesco.org/'},
  {tag:'heritage',name:'UAE Government Portal',url:'https://u.ae/en/'},
  {tag:'science',name:'NASA Learning Resources',url:'https://www.nasa.gov/learning-resources/'},
  {tag:'science',name:'OpenStax',url:'https://openstax.org/subjects'},
  {tag:'history',name:'Library of Congress Primary Sources',url:'https://www.loc.gov/programs/teachers/classroom-materials/primary-source-sets/'},
  {tag:'general',name:'UNESCO Digital Library',url:'https://unesdoc.unesco.org/'}
] as const;
export function trustedTopicSources(q:string,reader:ReaderInfo){
  const s=q.toLowerCase().replace(/[إأآٱ]/g,'ا').replace(/ة/g,'ه');
  const topic = /education|teaching|pedagog|curricul|تربيه|تعليم|معلم/.test(s)?'education':
    /heritage|culture|uae|emirat|تراث|الامارات|هويه\s*وطنيه/.test(s)?'heritage':
    /science|space|physics|astronomy|chemistry|biology|علوم|فضاء|كيمياء|فيزياء/.test(s)?'science':
    /history|historical|تاريخ|وثائق/.test(s)?'history':'general';
  const permitted=references.filter(v=>v.tag===topic);
  return permitted.filter(x=>!(reader.role==='student' && reader.grade!==null && reader.grade<9 && x.name==='OpenStax')).slice(0,2);
}
const heritageGuide = [
  'Saqr & National Identity contains four challenges, all located at /#/saqr-national-identity:',
  '1. Saqr Cultural Passport: discover all seven UAE emirates and earn each emirate stamp after answering.',
  '2. Treasures of Emirati Language: explore traditional Emirati vocabulary and use terms in original sentences.',
  '3. Heritage Research Detective (محقق ذاكرة وطن): assess evidence, read source references and check historical claims.',
  '4. Flag of Glory challenge (تحدي راية المجد): answer UAE Flag Day landmark questions to raise the flag in the game.',
  'These are website experiences, not functions you can complete or award through chat. Do not invent points, rewards or completion statuses.'
].join('\\n');
export const discussionOpening=(locale:'ar'|'en'):string => locale==='ar'
  ? 'تحب نتناقش في إيه؟ في موضوع معين ولا كتاب قرأته؟'
  : 'What would you like to discuss: a particular topic or a book you have read?';
export const isNewDiscussion=(question:string,history:ChatTurn[]):boolean =>
  /(?:discuss|discussion|debate|talk about|let.s talk|let.s discuss|نناقش|نتناقش|ناقشني|خلينا نتكلم|تحاور)/i.test(question) &&
  !/(?:حول|عن|about|book\\s+|كتاب\\s+|التراث|التعليم|البيئه|الامارات)/i.test(question) &&
  !history.some(m=>m.role==='user' && /(?:discuss|discussion|نناقش|نتناقش|ناقشني|تحاور)/i.test(m.content));

export function saqrExtraContext(args:{
  question:string;history:ChatTurn[];role:ReaderInfo['role'];grade:number|null;
  locale:'ar'|'en';matches:SaqrBookMatch[];
}):{mode:SaqrMode;context:string;recommendations:ReadingSuggestion[]} {
  const reader=normalizeReader({role:args.role,grade:args.grade});
  const mode=decideSaqrMode(args.question,args.history);
  if(mode==='none')return {mode,context:'',recommendations:[]};
  const lang=args.locale==='ar'?'Arabic':'English';
  const age = reader.grade===null?'unknown reading level':'grade '+reader.grade;
  const lead='OPTIONAL BOOK-GUIDANCE FORMAT (not a change to your identity, lessons, presentations or Little Author rules). Answer in '+lang+'. Reader '+reader.role+', '+age+'. Never use grade to authorize access. ';
  if(mode==='about'){
    const links=services.filter(([,,who])=>who==='all'||who==='teacher'&&(reader.role==='teacher'||reader.role==='admin')||who==='student'&&(reader.role==='student'||reader.role==='admin'))
      .map(([name,path])=>name+': '+site+path).join('\n');
    return {mode,recommendations:[],context:lead+'When asked to introduce yourself, present verified EFIPS library capabilities: book discovery, shelf locations, digital reading, guided dialogue, lesson plans and slide outlines for teachers, Little Author story challenge and its existing certificate. Explain all four National Identity challenges accurately from the following verified page guide: \\n'+heritageGuide+'\\n Explain website services with relevant real links; do not claim to make bookings, approve loans, or have searched external sites.\n'+links};
  }
  if(mode==='discussion'){
    const links=trustedTopicSources(args.question,reader).map(x=>x.name+': '+x.url).join('\n');
    return {mode,recommendations:[],context:lead+
      'GUIDED DISCUSSION, not a quiz. If the user has not chosen a topic or book, ask what they would like to discuss first and do not invent a topic. In subsequent turns, interpret the user's specific answer before asking one connected question. Respond to the reader’s last point, distinguish facts from interpretations and ask ONE open-ended question per turn. Student: approachable, curious and age-sensitive. Teacher: deeper explanation and teaching discussion angles. If discussing a particular book, avoid invented plots or quotes. You may point to matching catalog books only if they appear in the verified EFIPS results. The following are trusted institutional EXTERNAL PORTALS (not evidence of a specific source page or book availability):\n'+links+'\nUse short headings and a clear answer.'};
  }
  if(mode==='catalog'){
    return {mode,recommendations:[],context:lead+
      'BOOK FINDER: When matches were provided in the existing EFIPS LIBRARY RECORDS FOUND context, list the EXACT recorded titles and recorded Shelf/Row for physical items or actual digital links. Group by collection, use a numbered list and one concise evidence-based reason. If no matches were supplied, say the catalog match was not confirmed, not that the book does not exist. Do not invent sources, availability, links or shelf numbers.'};
  }
  const recs=rankForReader(args.matches,reader);
  const list=recs.map((b,i)=>String(i+1)+'. '+JSON.stringify(b.title)+' — '+b.location+' (provisional level: '+b.audience+')').join('\n');
  return {mode,recommendations:recs,context:lead+
    'RECOMMENDATION FORMAT: suggest up to five matched real catalog books from the ranked list, with exact title, shelf/row or digital link and a short reason based on catalog subject. Do NOT treat inferred age bands as verified, or claim to have read the book. For unknown levels, advise optional librarian review; younger students should not be automatically directed to specialist books. If none are suitable, say so without fabricating matches. End with at most ONE short follow-up question.\n'+(list||'No verified, suitable suggestion in the matched catalog. Do not fabricate recommendations.')};
}
export type QualityCheck={mode:SaqrMode;score:number;checks:Record<string,boolean>};
/** Testable local heuristic only; never writes or collects chat logs. */
export function checkSaqrAnswer(answer:string,mode:SaqrMode,matches:SaqrBookMatch[]):QualityCheck{
  const checks:Record<string,boolean>={
    notEmpty:answer.trim().length>8,
    reasonableLength:answer.length<18000,
    noUnprotectedWinnerTag:mode==='none'||!answer.includes('[WINNER:')
  };
  if(mode==='discussion')checks.oneQuestion=/[؟?]/.test(answer);
  if(mode==='catalog'||mode==='recommend'){
    checks.verifiableTitle=matches.length===0 || matches.some(b=>answer.toLowerCase().includes(b.title.toLowerCase()));
    const nums=[...answer.matchAll(/(?:shelf|الرف)\s*[:#]?\s*(\d+)/gi)];
    checks.shelvesFromCatalog=nums.every(m=>matches.some(b=>b.shelf===Number(m[1])));
  }
  return {mode,score:Math.round(100*Object.values(checks).filter(Boolean).length/Object.keys(checks).length),checks};
}
