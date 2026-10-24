/**
 * Catalog retrieval for Saqr's existing chat context only.
 * Searches the three existing libraries, without changing Saqr's system prompt,
 * chat API, conversation state, lessons, creative writing or rewards.
 */
type BookRecord = {
  id?: string | number;
  title?: string;
  author?: string;
  subject?: string;
  summary?: string;
  shelf?: number;
  row?: number;
  driveLink?: string;
};
type Catalogs = {
  physical: BookRecord[];
  arabic: BookRecord[];
  english: BookRecord[];
};
export type SaqrBookMatch = {
  title: string;
  author: string;
  subject: string;
  pageLocation: string;
  shelf?: number;
  row?: number;
  driveLink?: string;
  matchBasis: string;
  summary?: string;
};

const normalize = (value: unknown): string => String(value ?? '')
  .normalize('NFKC').toLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

const wordsOf = (text: string): string[] => normalize(text).split(/\s+/).filter(Boolean);

const STOP_WORDS = new Set([
  'a','an','the','and','or','of','to','in','at','is','are','i','me','my','we','you',
  'find','search','show','give','please','want','need','looking','look','have','has',
  'books','book','titles','title','library','available','recommend','recommendations',
  'about','on','for','related','topic','subject','topics','references','read','reading',
  'where','what','any','can','some','with','from','do',
  'اريد','عايز','عاوزه','عايزة','محتاج','محتاجه','ممكن','لو','عندك','عندكم',
  'في','عن','حول','على','الي','من','فيه','فيها','هل','اي','ايه','ما','هي','هو',
  'كتب','كتاب','الكتب','كتبا','كتابي','مكتبه','المكتبه','فهرس','دليل','الموضوع',
  'موضوع','موضوعات','تخصص','اقترح','ترشح','رشحلي','توصيات','ابحث','عاوز',
  'هات','اعطني','اديني','عندي','عليه','هذا','هذه','اللي','هناك','موجود','متاح',
  'فين','اين','اسم','اسماء','واحد','بعض','قائمه','قائمة','لديكم','لي','بدي'
]);

/** Bilingual subject intent: tested against titles, category tags and summaries. */
const TOPICS: Array<{ key:string; query:RegExp; signals:RegExp }> = [
  {key:'Education & Teaching',
    query:/\b(?:educat\w*|teach\w*|pedagog\w*|curricul\w*|classroom|schooling|literacy)\b|تربيه|تعليم|تدريس|المعلم|المعلمين|المناهج|طرق التدريس|التعلم/,
    signals:/\b(?:educat\w*|teach\w*|pedagog\w*|curricul\w*|classroom|schooling|literacy|student learning|phonics)\b|تربيه|تعليم|تدريس|المعلم|المناهج|التعلم/},
  {key:'Mathematics & Statistics',
    query:/\b(?:math(?:s|ematics)?|algebra|geometry|calculus|statistics)\b|رياضيات|الرياضيات|الحساب|الجبر|الهندسه|الاحصاء/,
    signals:/\b(?:math(?:s|ematics)?|algebra|geometry|calculus|statistics|numeracy)\b|رياضيات|حساب|جبر|هندسه|احصاء/},
  {key:'Science & Physics',
    query:/\b(?:science|physics|physicist|astronomy|space|chemistry|biology)\b|علوم|العلوم|الفيزياء|كيمياء|الكيمياء|الاحياء|الفضاء/,
    signals:/\b(?:science|physics|physicist|astronomy|space|chemistry|biology|scientific)\b|علوم|فيزياء|كيمياء|احياء|فضاء/},
  {key:'Technology & Programming',
    query:/\b(?:technology|computer\w*|coding|programming|software|internet|artificial intelligence|ai)\b|التكنولوجيا|التقنيه|الحاسوب|الكمبيوتر|البرمجه|الذكاء الاصطناعي/,
    signals:/\b(?:technology|computer\w*|coding|programming|software|internet|artificial intelligence|informatics)\b|تكنولوجيا|تقنيه|حاسوب|كمبيوتر|برمجه|ذكاء اصطناعي/},
  {key:'History & Culture',
    query:/\b(?:history|historical|heritage|culture|civilization)\b|تاريخ|التاريخ|تراث|التراث|ثقافه|الحضاره/,
    signals:/\b(?:history|historical|heritage|culture|civilization|archaeology)\b|تاريخ|تراث|ثقافه|حضاره|اثار/},
  {key:'UAE & Emirati Heritage',
    query:/\b(?:uae|emirates|emirati|abu dhabi|dubai)\b|الامارات|اماراتي|الاماراتي|ابوظبي|دبي|العين/,
    signals:/\b(?:uae|emirates|emirati|abu dhabi|dubai)\b|الامارات|اماراتي|ابوظبي|دبي|العين/},
  {key:'Psychology',
    query:/\b(?:psycholog\w*|mental health|counsel\w*)\b|علم النفس|نفسي|الصحه النفسيه/,
    signals:/\b(?:psycholog\w*|mental health|counsel\w*|psychiatr\w*)\b|علم النفس|نفسي|الصحه النفسيه/},
  {key:'Health & Medicine',
    query:/\b(?:health|medicine|medical|nursing|disease|nutrition)\b|الصحه|الطب|التمريض|التغذيه/,
    signals:/\b(?:health|medicine|medical|nursing|disease|nutrition)\b|صحه|طب|تمريض|تغذيه/},
  {key:'Business & Management',
    query:/\b(?:business|management|leadership|entrepreneurship|marketing|economics)\b|اداره الاعمال|الاداره|رياده الاعمال|الاقتصاد|القياده/,
    signals:/\b(?:business|management|leadership|entrepreneurship|marketing|economics)\b|اداره|اعمال|الاقتصاد|القياده/},
  {key:'Environment & Sustainability',
    query:/\b(?:environment|ecology|climate|sustainab\w*|renewable energy|recycling)\b|البيئه|الاستدامه|المناخ|الطاقه المتجدده/,
    signals:/\b(?:environment|ecology|climate|sustainab\w*|renewable energy|recycling)\b|بيئه|استدامه|مناخ|طاقه متجدده/},
  {key:'Language & Linguistics',
    query:/\b(?:language|linguistics|grammar|translation|english learning|arabic learning)\b|لغات|اللغات|اللسانيات|الانجليزيه|القواعد اللغويه|النحو/,
    signals:/\b(?:language|linguistics|grammar|translation|english learning|arabic learning)\b|لغات|اللغه|لسانيات|انجليزيه|نحو|الترجمه/},
  {key:'Literature & Fiction',
    query:/\b(?:novels?|fiction|literature|poetry|stories)\b|روايات|الروايات|الادب|الشعر|القصص/,
    signals:/\b(?:novels?|fiction|literature|poetry|stories|short story)\b|روايات|ادب|شعر|قصص/},
  {key:'Children’s Stories',
    query:/\b(?:children\w*|kids|picture books?|fairy tales?)\b|الاطفال|الصغار|قصص الاطفال/,
    signals:/\b(?:children\w*|kids|picture books?|fairy tales?)\b|اطفال|الصغار|قصص الاطفال/},
  {key:'Islamic Studies',
    query:/\b(?:islam(?:ic)?|quran|hadith)\b|اسلام|اسلامي|التربيه الاسلاميه|القران|الحديث|الفقه/,
    signals:/\b(?:islam(?:ic)?|quran|hadith|religion)\b|اسلام|اسلامي|القران|الحديث|الفقه/},
  {key:'Geography & Travel',
    query:/\b(?:geography|geographic|travel|world atlas|countries)\b|جغرافيا|الجغرافيا|البلدان|الاطلس/,
    signals:/\b(?:geography|geographic|travel|world atlas|countries)\b|جغرافيا|البلدان|الاطلس/},
  {key:'Art & Design',
    query:/\b(?:art|painting|design|architecture|drawing)\b|الفنون|الرسم|التصميم|العماره/,
    signals:/\b(?:art|painting|design|architecture|drawing)\b|فنون|الرسم|تصميم|عماره/}
];

// Bilingual concept hints. A match still requires evidence in catalog metadata.
const THEMES: Array<{query:RegExp;evidence:RegExp}> = [
  {query:/فضاء|الكواكب|كواكب|النجوم|مجرات|الفلك|space|astronom|planet|galax|cosmos/,
   evidence:/فضاء|كواكب|نجوم|مجرات|الفلك|space|astronom|planet|galax|cosmos|universe|solar system/},
  {query:/التراث|تراث|الهوية الوطنيه|اماراتي|الامارات|heritage|emirati|uae/,
   evidence:/تراث|الامارات|اماراتي|الهوية الوطنيه|heritage|emirati|uae|united arab emirates|abu dhabi|dubai/},
  {query:/الاستدامه|البيئه|التلوث|المناخ|الطبيعه|environment|ecolog|sustainab|climate/,
   evidence:/استدامه|بيئه|تلوث|مناخ|طبيعه|environment|ecolog|sustainab|climate|pollution|recycl|nature/},
  {query:/الشجاعه|شجاعه|الجرأه|courage|bravery|brave/,
   evidence:/شجاعه|الجرأه|courage|bravery|brave|fearless/},
  {query:/التسامح|التعاطف|الرحمه|الطيبه|الاخلاق|القيم|kindness|empathy|compassion|values|morals/,
   evidence:/تسامح|تعاطف|رحمه|طيبه|اخلاق|القيم|kindness|empathy|compassion|values|morals|ethics/},
  {query:/المياه|الماء|العطش|الري|water|thirst|irrigat/,
   evidence:/مياه|الماء|عطش|الري|water|thirst|irrigat/},
  {query:/البرمجه|الحاسوب|التقنيه|الروبوت|coding|programming|computer|robot/,
   evidence:/برمجه|حاسوب|تقنيه|روبوت|coding|programming|computer|robot|software/},
  {query:/التعليم|التعلم|التدريس|المعلم|education|learning|teaching|pedagog/,
   evidence:/تعليم|تعلم|تدريس|معلم|education|learning|teaching|pedagog|classroom/}
];

// Cross-script aliases are ONLY query-expansion hints. A title is returned
// exclusively when an actual recorded holding contains the counterpart name.
const TITLE_ALIASES: Array<{arabic:RegExp;english:RegExp}> = [
  {arabic:/هاري\s+بوتر/,english:/\bharry\s+potter\b/},
  {arabic:/شيرلوك\s+هولمز|شرلوك\s+هولمز/,english:/\bsherlock\s+holmes\b/},
  {arabic:/الامير\s+الصغير/,english:/\bthe\s+little\s+prince\b/},
  {arabic:/الاسد\s+الملك/,english:/\bthe\s+lion\s+king\b/},
  {arabic:/العادات\s+الذريه/,english:/\batomic\s+habits\b/},
  {arabic:/الهوبيت/,english:/\bthe\s+hobbit\b/},
  {arabic:/وندر|اعجوبه/,english:/\bwonder\b/},
  {arabic:/الف\s+ليله\s+وليله/,english:/\b(?:one\s+thousand\s+and\s+one\s+nights|arabian\s+nights)\b/}
];
// Both Arabic and English queries activate the same verified-title evidence.
export const isCrossLanguageTitleQuery=(question:string):boolean=>{
  const q=normalize(question);
  return TITLE_ALIASES.some(pair=>pair.arabic.test(q)||pair.english.test(q));
};

// A UAE-specific request needs UAE-specific catalog evidence. Words like
// "heritage", "Arab", "history" and "العين" alone do not prove a UAE subject.
// Explicit Unicode-safe geographical terms. Without complete word boundaries,
// "دبي" accidentally matches "أدبي", creating false digital recommendations.
const UAE_TERMS = String.raw\`(?:الامارات(?:يه|ي)?|بالامارات|للامارات|اماراتي(?:ه)?|ابوظبي|ابو\s+ظبي|دبي|الشارقه|راس\s+الخيمه|الفجيره|عجمان|ام\s+القيوين|united\s+arab\s+emirates|uae|emirati|emirates|abu\s+dhabi|dubai|sharjah|ras\s+al\s+khaimah|fujairah|ajman|umm\s+al\s+quwain)\`;
const UAE_GEO_PATTERN = new RegExp(String.raw\`(?:^|[^\p{L}\p{N}])\`+UAE_TERMS+String.raw\`(?=$|[^\p{L}\p{N}])\`,'u');
const isUaeExplicit = (text:string):boolean=>UAE_GEO_PATTERN.test(text);

const bookIntent = /(?:\b(?:books?|novels?|catalog(?:ue)?|library|booklist|read(?:ing)?|reference(?:s)?|recommend\w*|titles?)\b|كتب|كتاب|الكتب|المكتبه|مكتبه|فهرس|مراجع|روايات|اقترح|رشح|ترشح|للقراءه|للقراءة|عندكم|توجد كتب|هل يوجد)/;

/** Preserve exact title/author matching even if the user didn't say "book". */
export const searchSaqrBookCatalog = (question:string, catalogs:Catalogs, limit=12):SaqrBookMatch[] => {
  const normalizedQuery = normalize(question);
  const needsUaeEvidence = isUaeExplicit(normalizedQuery);
  const tokens = [...new Set(wordsOf(question).filter(word=>word.length>=3 && !STOP_WORDS.has(word)))];
  const hasBookIntent = bookIntent.test(normalizedQuery) || isCrossLanguageTitleQuery(question);
  const aliasHints = TITLE_ALIASES.filter(pair=>pair.arabic.test(normalizedQuery)||pair.english.test(normalizedQuery));
  const detectedTopics = hasBookIntent ? TOPICS.filter(topic=>topic.query.test(normalizedQuery)) : [];
  const detectedThemes = hasBookIntent ? THEMES.filter(theme=>theme.query.test(normalizedQuery)) : [];
  if (!tokens.length && !detectedTopics.length && !detectedThemes.length) return [];

  const origins: Array<{records:BookRecord[];source:'physical'|'arabic'|'english';label:string}> = [
    {records:catalogs.physical,source:'physical',label:'المكتبة العادية (Physical Library)'},
    {records:catalogs.arabic,source:'arabic',label:'المكتبة الرقمية العربية (Arabic Digital Library)'},
    {records:catalogs.english,source:'english',label:'المكتبة الرقمية الإنجليزية (English Digital Library)'}
  ];
  type Candidate={score:number;origin:string;value:SaqrBookMatch};
  const candidates:Candidate[]=[];
  for (const origin of origins) {
    for (const book of origin.records ?? []) {
      const title=String(book.title ?? '').trim();
      if (!title) continue;
      const author=String(book.author ?? '').trim();
      const subject=String(book.subject ?? '').trim();
      const titleText=normalize(title);
      const authorText=normalize(author);
      const subjectText=normalize(subject);
      const descriptionText=normalize(book.summary);
      // Do not recommend unrelated Arabic heritage or general histories for UAE.
      if(needsUaeEvidence){
        // Physical catalog subject tags are inferred from the title by
        // bookData.ts; generic falconry/Gulf heritage is NOT proof of UAE.
        const evidence = origin.source==='physical'
          ? [titleText] : [titleText,subjectText,descriptionText];
        if(!evidence.some(isUaeExplicit))continue;
      }
      let score=0;
      let subjectMatch=false;
      let titleMatch=false;
      // Match transliterated titles against real metadata; do not infer holdings.
      for(const pair of aliasHints){
        if(pair.arabic.test(titleText)||pair.english.test(titleText)){
          score+=320;titleMatch=true;
        }
      }
      // Exact phrases and proper book titles are the strongest evidence.
      if(normalizedQuery.length>=4 && (titleText.includes(normalizedQuery) || authorText.includes(normalizedQuery))) {
        score+=180;titleMatch=true;
      }
      for(const word of tokens.slice(0,8)){
        if(titleText.split(' ').some(v=>v===word || (word.length>=5 && v.startsWith(word)))) {score+=32;titleMatch=true;}
        if(authorText.split(' ').some(v=>v===word || (word.length>=5 && v.startsWith(word)))) score+=15;
        if(subjectText.split(' ').some(v=>v===word || (word.length>=5 && v.startsWith(word)))) {score+=23;subjectMatch=true;}
        if(descriptionText.split(' ').some(v=>v===word || (word.length>=5 && v.startsWith(word)))) score+=3;
      }
      for(const topic of detectedTopics){
        if(topic.key===subject) {score+=110;subjectMatch=true;}
        else if(topic.signals.test(subjectText)) {score+=75;subjectMatch=true;}
        if(topic.signals.test(titleText)) {score+=60;titleMatch=true;}
        if(topic.signals.test(descriptionText)) score+=22;
      }
      for(const theme of detectedThemes) {
        if(theme.evidence.test(titleText)) {score+=48;titleMatch=true;}
        if(theme.evidence.test(subjectText)) {score+=65;subjectMatch=true;}
        if(theme.evidence.test(descriptionText)) {score+=30;subjectMatch=true;}
      }
      // A generic category such as General Knowledge is not evidence of a topic.
      if(score<12) continue;
      const value:SaqrBookMatch={
        title,author,subject,pageLocation:origin.label,
        ...(book.summary ? {summary:String(book.summary).slice(0,500)} : {}),
        ...(origin.source==='physical' ? {shelf:book.shelf,row:book.row} : {driveLink:book.driveLink}),
        matchBasis: subjectMatch ? 'Catalog subject/topic' : titleMatch ? 'Book title' : 'Description/author'
      };
      candidates.push({score,origin:origin.source,value});
    }
  }
  candidates.sort((a,b)=>b.score-a.score || a.value.title.localeCompare(b.value.title));
  // Keep the best matches, then make room for genuinely matching digital and
  // print items; the former first-ten-physical ordering hid bilingual results.
  const chosen:Candidate[]=[];
  const seen=new Set<string>();
  const counts:{[key:string]:number}={physical:0,arabic:0,english:0};
  const caps:{[key:string]:number}={physical:7,arabic:4,english:4};
  const add=(entry:Candidate)=>{
    const key=entry.origin+'|'+normalize(entry.value.title);
    if(seen.has(key)) return;
    chosen.push(entry);seen.add(key);counts[entry.origin]++;
  };
  // Reserve genuine results for each catalog before filling by relevance.
  for(const source of ['physical','arabic','english']){
    for(const entry of candidates.filter(item=>item.origin===source).slice(0,2)){
      if(chosen.length>=limit)break;
      add(entry);
    }
  }
  for(const entry of candidates){
    if(chosen.length>=limit)break;
    if(counts[entry.origin]>=caps[entry.origin])continue;
    add(entry);
  }
  for(const entry of candidates){
    if(chosen.length>=limit)break;
    add(entry);
  }
  return chosen.map(entry=>entry.value);
};
