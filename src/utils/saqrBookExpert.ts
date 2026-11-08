import type { SaqrBookMatch } from './saqrCatalogSearch.ts';

/**
 * Additive title-only expert librarian route. Broad subject searches, book
 * recommendations, classroom work, summaries, discussion and creative writing
 * continue through their original handlers.
 */
const normalize = (text: string): string => String(text || '')
  .normalize('NFKC').toLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

const stopTitle = /^(?:عن|حول|في|ل|لل|بال|عن\s+موضوع|للأطفال|للاطفال|للمعلمين|للطلبة|من|علم|حول\s+موضوع|about|on|for|in|to|some|any|a|an|the|books|more|recommended)\s/i;
const generalRequests = /(?:رشح|اقترح|توصيات|أقترح|recommend|suggest|best books|books about|novels about|كتب عن|روايات عن|كتاب عن|كتاب في موضوع|كتاب لتعلم|كتاب لتعليم|book about|a book about|books for|كتاب مناسب|كتب مناسبة|كتب للاطفال)/i;
const suffixes = /(?:[,،؛]\s*|\s+)(?:هل\s+(?:هو\s+)?(?:موجود|متوفر)|(?:موجود|متوفر)\s+(?:عندكم|في\s+المكتبة)|هل\s+عندكم|is\s+(?:it|this)\s+available|do\s+you\s+have\s+(?:it|this))[\s\S]*$/i;

export function extractSaqrSpecificBookTitle(question: string): string | null {
  const text = String(question || '').trim();
  if (!text || text.length > 350 || /https?:\/\//i.test(text) || generalRequests.test(text)) return null;
  const hasBookWord = /(?:كتاب|الكتاب|رواي[ةه]|الرواي[ةه]|قص[ةه]|القصة|\bbook\b|\bnovel\b|\bstory\b)/i.test(text);
  if (!hasBookWord) return null;
  const quoted = /["“”«]([^"“”«»]{2,140})["“”»]/u.exec(text);
  const patterns = [
    /(?:الكتاب|كتاب|الرواية|رواية|القصة|قصة)\s+(?:اسمه|اسمها|اللي\s+اسمه|بعنوان|تحت\s+عنوان|المسم[ىي]|عنوانه)\s*[:：]?\s*(.+)$/i,
    /(?:عن|حول|بخصوص|تعرف|تعرفي|اعرف)\s+(?:الكتاب|كتاب|الرواية|رواية|القصة|قصة)\s+(.+)$/i,
    /(?:كتاب|رواية|قصة)\s+(.+)$/i,
    /(?:\b(?:the\s+)?(?:book|novel|story)\s+(?:called|named|titled)\s+)(.+)$/i,
    /(?:\b(?:about|know|read|review|discuss)\s+(?:the\s+)?(?:book|novel|story)\s+)(.+)$/i,
    /(?:\b(?:the\s+)?(?:book|novel)\s+)(.+)$/i
  ];
  const captured = quoted?.[1] || patterns.map(p => p.exec(text)?.[1] || '').find(Boolean) || '';
  const title = captured
    .replace(suffixes, '')
    .replace(/\s+(?:للكاتب|للمؤلف|للمؤلفة|للكاتبة|by\s+(?:the\s+author\s+)?)[^،,.؟?]+$/i, '')
    .replace(/^(?:اسمه|اسمها|بعنوان|اسم\s+الكتاب)\s*/i, '')
    .replace(/[؟?!.،,؛;:\s]+$/g, '').trim();
  if (!title || title.length < 2 || title.length > 140 || stopTitle.test(title) ||
      /^(?:كتاب|رواية|قصة|book|novel|story|موجود|متوفر|الأطفال|التعليم)$/i.test(title)) return null;
  return title;
}

// Cross-script aliases are only used to validate REAL recorded EFIPS holdings;
// they never create an invented library record.
const knownBilingualTitles: [string,string][] = [
  ['هاري بوتر','harry potter'],['شيرلوك هولمز','sherlock holmes'],
  ['شرلوك هولمز','sherlock holmes'],['الامير الصغير','the little prince'],
  ['العادات الذرية','atomic habits'],['الهوبيت','the hobbit'],
  ['الاسد الملك','the lion king'],['الف ليلة وليلة','arabian nights']
];
const variantsOf = (title: string): string[] => {
  const q=normalize(title);
  const variants=[q];
  for(const [ar,en] of knownBilingualTitles){
    if(q===normalize(ar))variants.push(normalize(en));
    if(q===normalize(en))variants.push(normalize(ar));
  }
  return variants;
};

export const findSaqrBookTitleHoldings=(title:string,matches:readonly SaqrBookMatch[]):SaqrBookMatch[]=>{
  const variants=variantsOf(title).filter(v=>v.length>=3);
  return matches.filter(book=>{
    const recorded=normalize(book.title);
    return variants.some(v=>
      recorded===v ||
      (v.length>=5 && recorded.startsWith(v+' ')) ||
      (recorded.length>=5 && v.startsWith(recorded+' '))
    );
  });
};

const collectionOf=(book:SaqrBookMatch):'physical'|'arabic'|'english'=>
  book.pageLocation.includes('العادية') ? 'physical' :
  book.pageLocation.includes('العربية') ? 'arabic' : 'english';

const label=(value:string):string=>value.replace(/[\x00-\x1f<>]/g,'').trim();

export type SaqrExternalBookReference={
  title:string;
  authors:string[];
  firstPublishYear?:number;
  subjects?:string[];
  url:string;
};
export function saqrBookExpertContext(title:string,holdings:readonly SaqrBookMatch[],
  external:SaqrExternalBookReference|null):string {
  const records=holdings.map(book=>({
    title:book.title,author:book.author,collection:collectionOf(book),
    ...(book.shelf!==undefined?{shelf:book.shelf,row:book.row}:{}),
    ...(book.driveLink?{driveLink:book.driveLink}:{})
  }));
  return 'VETERAN SCHOOL LIBRARIAN / SPECIFIC BOOK QUERY ONLY:\n'+
    'The reader is asking about one named literary work or book, not merely searching the school catalogue. '+
    'First act as an experienced bilingual librarian: explain the book and its known author, original publication era when reliable, genre, main ideas, and a short accurate spoiler-light description when confident. '+
    'Differentiate authors, works and editions; never make up exact ISBNs, page counts, characters, plot events, quotes or publishing data. '+
    'If the title is ambiguous or you cannot reliably recognize it, ask for the author or edition while still giving any useful trustworthy context. '+
    'If external reference metadata is provided, use it as verified bibliographic evidence and cite its supplied link; this is NOT a school holding. '+
    'If external verification is absent, explicitly distinguish general model knowledge from verified bibliographic facts and be transparent about uncertainty. '+
    'The app will append a separate exact EFIPS catalogue holdings section AFTER your book explanation. DO NOT claim EFIPS owns, lends or provides the book in your explanation, and never invent a shelf or PDF link.\n'+
    'BOOK TITLE: '+JSON.stringify(title)+'\n'+
    'EXTERNAL OPEN LIBRARY REFERENCE (if found, not school holdings): '+JSON.stringify(external)+'\n'+
    'EXACT EFIPS TITLE-MATCHED HOLDINGS ONLY: '+JSON.stringify(records);
}

export function renderSaqrBookHoldingStatus(title:string,holdings:readonly SaqrBookMatch[],locale:'ar'|'en'):string {
  const ar=locale==='ar';
  const sections:[string,string,string][]=[
    ['physical',ar?'المكتبة الورقية':'Physical library',ar?'الرف':'Shelf'],
    ['arabic',ar?'المكتبة الرقمية العربية':'Arabic digital library',''],
    ['english',ar?'المكتبة الرقمية الإنجليزية':'English digital library','']
  ];
  const out=[ar?'### التحقق من توافر الكتاب في EFIPS':'### EFIPS library holdings check'];
  for(const [key,name] of sections){
    const books=holdings.filter(b=>collectionOf(b)===key);
    if(!books.length){out.push('- **'+name+':** '+(ar?'لا يوجد سجل مطابق مؤكد في الفهرس الحالي.':'No confirmed matching record in the current catalog.'));continue;}
    const parts=books.slice(0,5).map(book=>{
      const name=label(book.title);
      if(key==='physical')return '**'+name+'** ('+(ar?'الدولاب':'Shelf')+' '+book.shelf+'، '+(ar?'الصف':'Row')+' '+book.row+')';
      if(!book.driveLink || !/^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view(?:\?.*)?$/.test(book.driveLink))
        return '**'+name+'**';
      return '['+name+']('+book.driveLink+')';
    });
    out.push('- **'+name+':** '+parts.join('؛ '));
  }
  out.push(ar?'هذه نتيجة مطابقة لعنوان الكتاب في فهارس المدرسة، وليست تأكيدًا لحالة الإعارة الآن. عدم وجود سجل لا يثبت عدم وجود نسخة غير مفهرسة.':'These are title-matched school catalog records, not live loan availability. Missing records do not rule out uncatalogued copies.');
  return out.join('\n\n');
}
