import { classifyBookAudience, type BookAudience } from '../../api/bookAudience';
import type { SaqrBookMatch } from './saqrCatalogSearch';

/* Saqr's additive, optional response layer. No changes to his main prompt,
 * Little Author challenge, teaching workflows, roles or other site logic.
 * Client reader data is advisory ONLY, never authorization.
 */
export type ReaderProfile={role:'student'|'teacher'|'admin'|'guest';grade:number|null};
export type ReplyMode='protected'|'help'|'discussion'|'recommend'|'catalog'|'general';
export const cleanReader=(v:unknown):ReaderProfile=>{
  const x=(v&&typeof v==='object'?v:{}) as Record<string,unknown>;
  const role=['student','teacher','admin','guest'].includes(String(x.role))?x.role as ReaderProfile['role']:'guest';
  const grade=typeof x.grade==='number'&&Number.isInteger(x.grade)&&x.grade>=1&&x.grade<=12?x.grade:null;
  return {role,grade};
};
const protectedMode=/تحضير\s*(?:درس|حصه)|خطة\s*درس|عرض\s*تقديمي|lesson\s*plan|prepare\s*(?:a\s*)?lesson|presentation\s*(?:slides|structure)|mcgraw|تحدي\s*المؤلف|المؤلف\s*الصغير|نؤلف\s*قصه|نألف\s*قصه|ابدأ\s*قصه|let.s\s*(?:write|create)\s*(?:a\s*)?story|little\s*author/i;
const catalogWords=/\b(?:books?|novels?|library|catalog|shelf|row|ebook|reading list|where is|find me|title)\b|كتب|كتاب|الكتب|مكتبه|المكتبه|الرف|الفهرس|روايه|الروايات|مراجع/i;
const recommendWords=/\b(?:recommend|suggest|best books|reading list|suitable|age appropriate|for grade)\b|رشح|ترشح|اقترح|توصيات|مناسب\s*ل|لليافعين|للصغار|للمتخصصين/i;
const discussWords=/\b(?:discuss|discussion|debate|talk about|analyse|analyze|explore this topic)\b|ناقشني|نتناقش|نقاش|نناقش|اتكلم\s*مع|نتكلم\s*عن|حوار\s*حول|حلل\s*معي|تحدث\s*معي/i;
const helpWords=/\b(?:who are you|what can you do|your features|your services|about saqr|what does this site offer)\b|من\s*انت|مين\s*انت|عرف\s*نفسك|عرفني\s*بنفسك|خدماتك|مميزاتك|تقدر\s*تعمل\s*ايه|ماذا\s*تقدم|مميزات\s*الموقع|خدمات\s*الموقع/i;
export const resolveReplyMode=(q:string,history:Array<{role:string;content:string}>=[]):ReplyMode=>{
  if(protectedMode.test(q)||history.slice(-12).some(m=>m.role==='user'&&/تحدي\s*المؤلف|ابدأ\s*قصه|نؤلف\s*قصه|little\s*author/i.test(m.content)))return 'protected';
  if(helpWords.test(q))return 'help';
  if(discussWords.test(q))return 'discussion';
  if(recommendWords.test(q))return 'recommend';
  if(catalogWords.test(q))return 'catalog';
  return 'general';
};
export const discoveryQuery=(query:string,mode:ReplyMode):string=>
  mode==='discussion'&&!catalogWords.test(query)?query+' كتب books':query;

const band=(p:ReaderProfile):'young'|'middle'|'teen'|'unknown'=>
  p.role!=='student'||p.grade===null?'unknown':p.grade<=5?'young':p.grade<=8?'middle':'teen';
export type SuggestedBook={book:SaqrBookMatch;audience:BookAudience};
export const rankReading=(books:SaqrBookMatch[],p:ReaderProfile):SuggestedBook[]=>{
  const level=band(p);
  const tagged=books.map(book=>({book,audience:classifyBookAudience({title:book.title,subject:book.subject,shelf:book.shelf??0})}));
  const eligible=level==='young'||level==='middle'?tagged.filter(x=>x.audience!=='specialist'):tagged;
  const score=(a:BookAudience)=>{
    if(level==='young')return a==='children'?0:a==='review'?2:4;
    if(level==='middle')return a==='teens'?0:a==='children'?1:a==='review'?2:4;
    if(level==='teen')return a==='teens'?0:a==='review'?1:a==='children'?2:4;
    if(p.role==='teacher'||p.role==='admin')return a==='specialist'?0:a==='review'?1:2;
    return a==='review'?1:0;
  };
  return eligible.sort((a,b)=>score(a.audience)-score(b.audience)).slice(0,8);
};
export type TrustedSource={topic:string;title:string;url:string;audience:'all'|'teacher'|'older'};
export const trustedSources:TrustedSource[]=[
  {topic:'education',title:'UAE Ministry of Education',url:'https://www.moe.gov.ae/en/',audience:'all'},
  {topic:'education',title:'Library of Congress Classroom Materials',url:'https://www.loc.gov/programs/teachers/classroom-materials/',audience:'teacher'},
  {topic:'heritage',title:'UNESCO Intangible Cultural Heritage',url:'https://ich.unesco.org/',audience:'all'},
  {topic:'heritage',title:'UAE Government Portal',url:'https://u.ae/en/',audience:'all'},
  {topic:'science',title:'NASA Learning Resources',url:'https://www.nasa.gov/learning-resources/',audience:'all'},
  {topic:'science',title:'OpenStax Open Textbooks',url:'https://openstax.org/subjects',audience:'older'},
  {topic:'history',title:'Library of Congress Primary Sources',url:'https://www.loc.gov/programs/teachers/classroom-materials/primary-source-sets/',audience:'all'},
  {topic:'general',title:'UNESCO Digital Library',url:'https://unesdoc.unesco.org/',audience:'all'}
];
export const resourcesFor=(q:string,p:ReaderProfile):TrustedSource[]=>{
  const s=q.toLowerCase().replace(/[إأآٱ]/g,'ا').replace(/ة/g,'ه');
  const terms=[
    {type:'education',re:/educat|teach|pedagog|curricul|classroom|تربيه|تعليم|المناهج|المعلم/},
    {type:'heritage',re:/uae|emirat|heritage|culture|الامارات|تراث|هويه\s*وطنيه|ابوظبي/},
    {type:'science',re:/science|space|physics|astronomy|math|chemistry|biology|stem|علوم|فضاء|رياضيات|فيزياء|كيمياء/},
    {type:'history',re:/history|historical|وثائق|تاريخ|مصادر\s*اوليه/}
  ];
  const topic=terms.find(t=>t.re.test(s))?.type||'general';
  return trustedSources.filter(x=>x.topic===topic && !(x.audience==='teacher'&&p.role==='student') &&
    !(x.audience==='older'&&(band(p)==='young'||band(p)==='middle'))).slice(0,2);
};
export const verifiedRoutes=[
  {name:'Physical book catalogue',route:'/#/search',audience:'all'},
  {name:'Arabic digital library',route:'/#/digital-library/arabic',audience:'all'},
  {name:'English digital library',route:'/#/digital-library/english',audience:'all'},
  {name:'Reading lists and borrowing reminders (Home)',route:'/#/home',audience:'all'},
  {name:'Library schedule booking',route:'/#/schedule',audience:'staff'},
  {name:'Creators Portal',route:'/#/creators',audience:'students'},
  {name:'Saqr and UAE National Identity games',route:'/#/saqr-national-identity',audience:'students'},
  {name:'Saqr Studio',route:'/#/saqr-studio',audience:'all'},
  {name:'Podcast',route:'/#/podcast',audience:'all'},
  {name:'Feedback',route:'/#/feedback',audience:'all'}
];
export const enhanceSaqrResponse=(mode:ReplyMode,q:string,p:ReaderProfile,locale:'ar'|'en',matches:SaqrBookMatch[]):string=>{
  if(mode==='protected'||mode==='general')return '';
  const intro='ADDITIONAL FORMATTING AND DISCOVERY ONLY; preserve all prior Saqr personality, lesson, presentation, story and certificate rules.\n';
  const audience='Reader: '+p.role+(p.grade===null?' (grade unknown)':', Grade '+p.grade)+'. Use developmentally suitable language without assuming reading ability.\n';
  const language='Answer in '+(locale==='ar'?'Arabic':'English')+'.';
  if(mode==='help'){
    const routes=verifiedRoutes.filter(x=>x.audience==='all'||(x.audience==='staff'&&(p.role==='teacher'||p.role==='admin'))||(x.audience==='students'&&(p.role==='student'||p.role==='admin')))
      .map(x=>'- '+x.name+': https://www.efipslibrary.com'+x.route).join('\n');
    return intro+audience+'Introduce yourself as Saqr, EFIPS AI librarian. Explain book discovery, shelf/row and digital links, book/topic dialogue, level-aware suggestions, teacher lesson plans and slide outlines, Little Author and its existing certificate. Present relevant verified site sections from this list:\n'+routes+'\nDo not claim to directly reserve the library or issue loans. Give concise examples. '+language;
  }
  if(mode==='catalog'){
    return intro+audience+'Catalog lookup: Organize 3–7 exact catalog titles into a numbered readable list, showing the actual physical shelf AND row or exact digital link. Clearly identify the source collection. Give only catalog-evidenced relevance. If there are no matches, say not verified in this catalog, not unavailable everywhere. End with at most one useful follow-up. '+language;
  }
  if(mode==='recommend'){
    const recs=rankReading(matches,p).map((x,i)=>String(i+1)+'. '+JSON.stringify(x.book.title)+' | Inferred level: '+x.audience+' | '+x.book.pageLocation+(x.book.shelf!==undefined?' Shelf '+x.book.shelf+', Row '+x.book.row:'')+(x.book.driveLink?' '+x.book.driveLink:'')).join('\n');
    return intro+audience+'Reading recommendations: Recommend at most 5 actual catalog books based on the ranking below. The age level is INFERRED from metadata and NOT a verified age rating. Prefer the learner grade; never automatically recommend specialist books to Grades 1–8. For uncertain age levels, say school library review is advisable. Do not invent a book synopsis. Give clearly formatted titles, shelf/row or digital links and one metadata-supported reason. If grade is unknown you may ask once, without preventing initial advice.\n'+(recs||'No verified candidate for this reading level.')+'\n'+language;
  }
  const externals=resourcesFor(q,p).map(x=>'- '+x.title+': '+x.url).join('\n');
  return intro+audience+'Guided BOOK OR TOPIC DISCUSSION: students get age-appropriate short explanations and exactly ONE thoughtful open question per turn (not an exam); teachers get nuanced interpretation, classroom inquiry ideas and one question. Respond to the previous turn to sustain a real dialogue. Separate facts from interpretations. For specific books do not invent chapters, quotations or details missing from the catalog. Offer relevant EFIPS book titles and verified shelves/links if present in catalog context. If user requests broader sources, these verified official portals can be recommended as EXTERNAL references, not as school holdings or live searched results:\n'+(externals||'No topic-specific verified source portal in current directory.')+'\nBrief headings, clear paragraphs, one next question. '+language;
};
export type ReplyQuality={mode:ReplyMode;score:number;checks:Record<string,boolean>};
export const evaluateSaqrReply=(reply:string,mode:ReplyMode,matches:SaqrBookMatch[]):ReplyQuality=>{
  const text=String(reply||'');
  const checks:Record<string,boolean>={
    nonempty:text.trim().length>20,
    readableLength:text.length<16000,
    certificateProtected:mode==='protected'||!text.includes('[WINNER:'),
    noOfficialCertificateClaim:!/certified school record|معتمد رسميا من المدرسه/i.test(text)
  };
  if(mode==='catalog'||mode==='recommend'){
    checks.titleGrounded=matches.length===0||matches.some(x=>text.toLowerCase().includes(x.title.toLowerCase()));
    const locations=[...text.matchAll(/(?:shelf|الرف)\s*[:#]?\s*(\d+)/gi)];
    checks.shelfGrounded=locations.every(m=>matches.some(x=>x.shelf===Number(m[1])));
  }
  if(mode==='discussion')checks.hasQuestion=/[؟?]/.test(text);
  return {mode,score:Math.round(100*Object.values(checks).filter(Boolean).length/Object.keys(checks).length),checks};
};
