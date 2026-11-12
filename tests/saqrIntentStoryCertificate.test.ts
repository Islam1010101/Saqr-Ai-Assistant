import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {isSaqrLibrarySearchIntent,isSaqrCreativeTurn} from '../src/utils/saqrIntentRouter.ts';

const history=(...s:string[])=>s.map(content=>({role:'user',content}));
const yes=[
  'رشحلي كتاب عن الفضاء',
  'ابحث عن كتب عن الفضاء',
  'كتاب عن الكواكب',
  'عايز رواية خيالية عن الفضاء',
  'فين كتاب الأمير الصغير في المكتبة؟',
  'هل عندكم كتاب هاري بوتر؟',
  'أبغي كتب عن البيئة',
  'كتب جول فيرن',
  'مؤلفات أحمد خالد توفيق',
  'Find books about space',
  'Recommend a book about planets',
  'Search for books by Jules Verne',
  'وين الرف 14؟'
];
for(const q of yes)assert.equal(isSaqrLibrarySearchIntent(q),true,'Book/library lookup must be supported: '+q);
const no=[
  'تحدي المؤلف الصغير',
  'ابدأ تحدي التأليف بقصة إماراتية',
  'ساعدني نكتب قصة عن الوطن',
  'اكتب لي قصة عن الفضاء',
  'احكيلي قصة لطيفة',
  'اشرح لي الفضاء',
  'حدثني عن الكواكب',
  'حضّر لي درس عن الفضاء',
  'صمم نشاط في المكتبة',
  'اعمل ورشة للطلاب في المكتبة',
  'اكتب قصة عن كتاب في المكتبة',
  'صمم شهادة المؤلف الصغير',
  'عايز اعرف عن هاري بوتر',
  'من هو الكاتب جول فيرن؟',
  'مين كتب هاري بوتر؟',
  'خلنا نتناقش عن رواية خيالية',
  'Write an original story about space',
  'Prepare a lesson on reading',
  'How does a library work?',
  'Hello'
];
for(const q of no)assert.equal(isSaqrLibrarySearchIntent(q),false,'Normal chat/creative requests must NOT retrieve books: '+q);
assert.ok(isSaqrCreativeTurn('تحدي المؤلف الصغير'));
assert.ok(isSaqrCreativeTurn('ومشى البطل خلف الخريطة',history('تحدي المؤلف الصغير')));
assert.equal(isSaqrLibrarySearchIntent('هذا تكملة قصتي عن كتاب قديم',history('تحدي المؤلف الصغير')),false);
assert.equal(isSaqrLibrarySearchIntent('طب عايز حاجة أسهل',history('رشحلي كتاب عن الفضاء')),true,
  'A genuine recommendation follow-up remains connected to the library');
assert.equal(isSaqrLibrarySearchIntent('ابحث عن كتاب الفضاء في المكتبة',history('تحدي المؤلف الصغير')),true,
  'Explicit new book request overrides an old story conversation');
assert.equal(isSaqrLibrarySearchIntent('طب عايز حاجة أسهل',history('تحدي المؤلف الصغير','رشحلي كتاب عن الفضاء')),true,
  'Book follow-ups stay connected after leaving a prior story challenge');
const server=readFileSync('api/chat.ts','utf8');
assert.ok(!server.includes("import { isSaqrLibrarySearchIntent }"),
  'No extensionless TypeScript import in Vercel Node.js serverless entry');
assert.ok(server.includes('function isSaqrApiLibrarySearch(text:string):boolean'));
assert.ok(server.includes("const { messages = [], locale = 'en', catalogueIntent }"));
assert.ok(server.includes("typeof catalogueIntent === 'boolean'"));
assert.ok(server.includes('catalogueIntent : isSaqrApiLibrarySearch(userMsg)'));
assert.ok(server.includes('const found = catalogRequested ? findBooks(userMsg) : [];'));
assert.ok(server.includes('Normal educational or creative chat (NOT a school catalogue search)'));
assert.ok(server.includes('No school-catalogue search was requested.'));
const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes('const librarySearchIntent = isSaqrLibrarySearchIntent(userQuery, messages);'));
assert.ok(page.includes('catalogueIntent: librarySearchIntent'));
assert.ok(!server.includes("from '../src/utils/saqrIntentRouter'"));
assert.ok(page.includes('const foundBooks = librarySearchIntent ? searchSaqrBookCatalog('));
assert.ok(page.includes("const searchContext = !librarySearchIntent"));
assert.ok(page.includes("const namedBookTitle=librarySearchIntent && preIntent==='none'"));
assert.ok(page.includes("if(librarySearchIntent && preIntent==='none' && isSaqrCatalogLookup"));
assert.ok(page.includes('if(librarySearchIntent && /(?:ركن|جناح)'));
assert.ok(page.includes('ACTIVE LITTLE AUTHOR CHALLENGE: NO catalogue searches'));
assert.ok(page.includes('formal Modern Standard Arabic'));
assert.ok(page.includes('ONLY the student'));
assert.ok(page.includes('true name naturally once'));
assert.ok(page.includes("src=\"/school-logo.png\" className=\"cert-logo\""));
assert.ok(page.includes('className="cert-seal-disc"><img src="/school-logo.png"'));
assert.ok(page.includes('className="cert-seal" dir="ltr"'));
assert.ok(existsSync('public/school-logo.png'),'Use the original tracked EFIPS logo, not an external endpoint');
const downloader=page.slice(page.indexOf('const handleDownloadCertificatePDF'),page.indexOf('const handleQuickPrompt'));
assert.ok(downloader.includes('width:794') && downloader.includes('height:1123'),'Certificate canvas is A4-sized');
assert.ok(downloader.includes("pdf.addImage("));
assert.ok(!downloader.includes('pdf.addPage('),'Must not export a blank second page');
assert.ok(!downloader.includes('Math.ceil(canvas.height'),'Must not use multi-page slicing');
assert.ok(page.includes('width:794px;min-height:1123px;height:1123px;max-height:1123px;overflow:hidden;'));
assert.ok(page.includes('.cert-body h1 {box-sizing:border-box;width:100%;text-align:center;'));
console.log('PASS: catalog routing only for explicit library discovery, creative story isolation, role-aware UAE chat and one-page original-logo certificate.');
