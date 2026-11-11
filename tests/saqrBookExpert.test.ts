import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  extractSaqrSpecificBookTitle,findSaqrBookTitleHoldings,
  renderSaqrBookHoldingStatus,saqrBookExpertContext
} from '../src/utils/saqrBookExpert.ts';
import {findBookReference,pickVerifiedBook} from '../src/utils/saqrOpenLibrary.js';
import type {SaqrBookMatch} from '../src/utils/saqrCatalogSearch.ts';

for(const [question,title] of [
  ['تعرف كتاب الأمير الصغير؟','الأمير الصغير'],
  ['معلومات عن رواية البؤساء','البؤساء'],
  ['هل كتاب هاري بوتر موجود في المكتبة؟','هاري بوتر'],
  ['الكتاب اسمه العادات الذرية','العادات الذرية'],
  ['كتاب The Hobbit','The Hobbit'],
  ['Tell me about the book "The Hobbit"','The Hobbit'],
  ['Do you have the book Atomic Habits?','Atomic Habits'],
  ['كتاب الخيميائي في المكتبة','الخيميائي']
] as const){
  assert.equal(extractSaqrSpecificBookTitle(question),title,question);
}
for(const query of [
  'كتب عن البيئة','رشحلي كتاب مناسب للأطفال','كتاب عن التاريخ',
  'عايز رواية خيالية عن الفضاء','أبغي قصة خيالية عن النجوم','أريد كتاب سهل عن الكواكب',
  'Recommend some books about science','أفضل كتاب للتعلم','لخص كتاب الأمير الصغير',
  'ناقشني في كتاب البؤساء','تحضير درس عن الكتب','أريد كتبًا للقراءة',''
]){
  assert.equal(extractSaqrSpecificBookTitle(query),null,'Prior feature preserved: '+query);
}
console.log('PASS: specific standalone titles are recognized in Arabic/English; previous book lists, summaries and dialogues are unaffected');

const matches:SaqrBookMatch[]=[
  {title:'Harry Potter and the Philosopher’s Stone',author:'J. K. Rowling',subject:'Fantasy',
   pageLocation:'المكتبة العادية (Physical Library)',shelf:34,row:2,matchBasis:'title'},
  {title:'Harry Potter and the Philosopher’s Stone',author:'J. K. Rowling',subject:'Fantasy',
   pageLocation:'المكتبة الرقمية الإنجليزية (English Digital Library)',
   driveLink:'https://drive.google.com/file/d/testBookID123/view',matchBasis:'title'},
  {title:'Children’s Science Stories',author:'X',subject:'Harry Potter in fiction',
   pageLocation:'المكتبة الرقمية العربية (Arabic Digital Library)',matchBasis:'topic'}
];
const holdings=findSaqrBookTitleHoldings('هاري بوتر',matches);
assert.equal(holdings.length,2);
assert.equal(findSaqrBookTitleHoldings('كوكب زحل',matches).length,0);
assert.ok(!holdings.some(b=>b.title.includes('Science')));
const status=renderSaqrBookHoldingStatus('هاري بوتر',holdings,'ar');
assert.match(status,/34/);assert.match(status,/الصف/);
assert.match(status,/https:\/\/drive\.google\.com\/file\/d\/testBookID123\/view/);
assert.match(status,/المكتبة الرقمية العربية/);
const absent=renderSaqrBookHoldingStatus('كوكب زحل',[],'ar');
assert.match(absent,/لا يوجد سجل مطابق مؤكد/);
assert.match(absent,/لا يثبت عدم وجود نسخة غير مفهرسة/);
assert.doesNotMatch(absent,/غير موجود قطعياً|غير متوفر قطعياً/);
assert.ok(saqrBookExpertContext('كوكب زحل',[],null).includes('First act as an experienced bilingual librarian'));
assert.ok(saqrBookExpertContext('كوكب زحل',[],null).includes('not merely searching the school catalogue'));
console.log('PASS: exact EFIPS holdings are grounded in recorded titles, shelves and URLs; fuzzy topic hits do not imply ownership');

const verified=pickVerifiedBook('Atomic Habits',[
  {key:'/works/OL123W',title:'About Habits',author_name:['Wrong person']},
  {key:'/works/OL456W',title:'Atomic Habits',author_name:['James Clear'],
   first_publish_year:2018,subject:['Psychology','Habits']}
]);
assert.equal(verified?.title,'Atomic Habits');
assert.deepEqual(verified?.authors,['James Clear']);
assert.equal(verified?.firstPublishYear,2018);
assert.equal(verified?.url,'https://openlibrary.org/works/OL456W');
assert.equal(pickVerifiedBook('Atomic Habits',[{key:'/books/OL123M',title:'Atomic Habits'}]),null);
assert.equal(pickVerifiedBook('Atomic Habits',[{key:'/works/OL111W',title:'Unrelated'}]),null);
let fetches=0;
const fakeFetch=(async(input:string|URL|Request,init?:RequestInit)=>{
  fetches++;
  const url=new URL(String(input));
  assert.equal(url.origin,'https://openlibrary.org');
  assert.equal(url.searchParams.get('title'),'Atomic Habits');
  assert.equal(url.searchParams.get('limit'),'8');
  assert.ok(init?.signal);
  return new Response(JSON.stringify({docs:[{key:'/works/OL456W',title:'Atomic Habits',author_name:['James Clear']}]})
    ,{status:200,headers:{'Content-Type':'application/json'}});
}) as typeof fetch;
assert.equal((await findBookReference('Atomic Habits',fakeFetch))?.url,
  'https://openlibrary.org/works/OL456W');
assert.equal(fetches,1);
assert.equal(await findBookReference('https://evil.test/private',fakeFetch),null);
assert.equal(fetches,1);
console.log('PASS: external bibliographic metadata is optionally verified via an allowlisted Open Library host, not EFIPS holdings');

const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes("if(preIntent==='none' && isSaqrCatalogLookup(userQuery) && (explicitCatalogSearch || !namedBookTitle))"),
  'Broad catalog searches keep their old immediate response');
assert.ok(page.includes('resolveSaqrBookFollowUp(userQuery, messages)'),
  'Natural short-turn book resolution is wired into the main chat page');
assert.ok(page.includes("fetch('/api/chat?reference=book&title='+encodeURIComponent(namedBookTitle)"),
  'Only named books trigger external reference lookup');
assert.ok(page.includes('renderSaqrBookHoldingStatus(namedBookTitle,namedBookHoldings'),
  'School holding status is deterministic, even if external metadata is unavailable');
assert.ok(page.includes('saqrBookExpertContext(namedBookTitle,namedBookHoldings,externalBookReference)'));
const chatSource=readFileSync('api/chat.ts','utf8');
assert.ok(chatSource.includes("if (req.method === 'GET' && req.query?.reference === 'book')"),
  'Bibliographic lookup uses the existing Chat serverless function');
assert.ok(chatSource.includes("if (req.method !== 'POST') return res.status(405)"),
  'Unrecognized HTTP methods keep existing behavior');
assert.ok(chatSource.includes("const apiKey = process.env.GROQ_API_KEY?.trim();"),
  'Original Groq chat path remains intact');
assert.ok(chatSource.includes("const completion = await groq.chat.completions.create({"),
  'Existing chat generation is unchanged');
assert.ok(!page.includes('/api/book-reference'),
  'No extra serverless endpoint may be requested on the Hobby plan');
assert.ok(page.includes('isNewDiscussion(userQuery,messages)'));
assert.ok(page.includes('isStoryBeginning(userQuery)'));
assert.ok(page.includes('const SAQR_ELITE_PROMPT ='));
assert.ok(page.includes("if(learningIntent==='research'&&researchHasTopic(userQuery)"));
assert.ok(page.includes("reply = stripSaqrEmoji(reply)"));
console.log('PASS: no prior story, research, discussion, bilingual catalog, emoji or certificate flow was removed');
