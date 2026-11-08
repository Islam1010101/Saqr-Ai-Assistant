import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withSaqrFollowUpQuestion, endsWithSaqrQuestion, isProtectedSaqrStory } from '../src/utils/saqrFollowUp.ts';

const finish = (reply:string, question:string, locale:'ar'|'en'='ar',
  kind:'auto'|'named-book'|'catalog'|'identity'|'introduction'|'schedule'|'reading-list'|'research'|'tutoring'|'lesson'|'discussion'|'error'='auto',
  history:Array<{role:string;content:string}>=[]) =>
  withSaqrFollowUpQuestion(reply,{locale,question,kind,history});

const titleReply='**العادات الذرية**\n\nكتاب من تأليف جيمس كلير.\n\n### مكتبة EFIPS\n\nلم أجد سجلًا مطابقًا مؤكدًا في الفهرس.';
const titleFinal=finish(titleReply,'تعرف كتاب العادات الذرية؟','ar','named-book');
assert.ok(titleFinal.startsWith(titleReply), 'All original book explanation and holdings evidence remain');
assert.ok(titleFinal.trim().endsWith('هل تحب أن نتناقش في فكرة من هذا الكتاب أو نبحث عن كتب مشابهة؟'));
assert.ok(endsWithSaqrQuestion(titleFinal));

const englishReply='**Atomic Habits**\n\nAuthor: James Clear.\n\nNo confirmed EFIPS catalog record.';
const englishFinal=finish(englishReply,'Tell me about the book Atomic Habits','en','named-book');
assert.ok(englishFinal.startsWith(englishReply));
assert.match(englishFinal,/Would you like to discuss an idea from this book or explore similar titles\?$/);

const catalogReply='## نتائج البحث\n\n1. **كتاب علوم** — الرف 4\n\n[فتح الفهرس](https://example.com)';
const catalogFinal=finish(catalogReply,'كتب في العلوم','ar','catalog');
assert.ok(catalogFinal.startsWith(catalogReply));
assert.ok(endsWithSaqrQuestion(catalogFinal));
assert.ok(catalogFinal.includes('[فتح الفهرس](https://example.com)'));
assert.equal(catalogFinal.split('هل ترغب في أن أساعدك').length,2,'Exactly one follow-up is appended');

for(const [reply,question,kind] of [
  ['أهلًا بك في صقر.','من أنت؟','introduction'],
  ['كتب جناح الهوية الوطنية: 4 نتائج.','كتب جناح الهوية الوطنية','identity'],
  ['افتح الجدول لإتمام الحجز؛ لا يتم إنشاء حجز من الدردشة.','جدول المكتبة','schedule'],
  ['ليس عندك كتب محفوظة.','استعاراتي','reading-list'],
  ['عنوان البحث: الماء\n\nالنتائج...','اكتب بحث علمي عن الماء','research'],
  ['ناتج المعادلة يساوي 15.','حل المسألة','tutoring'],
  ['نواتج تعلم الدرس: ...','تحضير درس','lesson'],
  ['هذه وجهة نظر محتملة.','نناقش التطور؟','discussion'],
  ['حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.','ابحث عن كتاب','error'],
  ['أهلاً! أنا صقر المكتبة.','مرحبا','auto']
] as const){
  const out=finish(reply,question,'ar',kind);
  assert.ok(out.startsWith(reply));
  assert.ok(endsWithSaqrQuestion(out),'Question missing in '+kind);
}
const onlyOne='هل ترغب أن نناقش الأفكار أكثر؟';
assert.equal(finish(onlyOne,'عن كتاب','ar','catalog'),onlyOne,'Do not repeat an existing last question');
assert.equal(finish('**هل تحب نبدأ؟**','مرحبا'), '**هل تحب نبدأ؟**','Markdown bold question remains unchanged');
assert.equal(finish('What would you read next?', 'Find books', 'en', 'catalog'),
 'What would you read next?','Existing English question remains unchanged');
assert.equal(finish('هل يناسبك هذا؟\n\n### مراجع\n[عرض المصدر](https://example.com)','بحث عن كتاب', 'ar','catalog').split('؟').length,3,
 'If a question was not actually the final sentence, add a new one at the end');
assert.equal(finish('','كتب','ar','catalog'),'','Do not invent a response from an empty result');

const protectedHistory=[{role:'user',content:'ابدأ قصة في تحدي المؤلف الصغير'}];
const story='ذهب صقر إلى قلعة الجاهلي واكتشف خريطة قديمة.';
assert.ok(isProtectedSaqrStory('ابدأ قصة في تحدي المؤلف الصغير'));
assert.ok(isProtectedSaqrStory('تابع',protectedHistory));
assert.equal(finish(story,'ابدأ قصة في تحدي المؤلف الصغير'),'ذهب صقر إلى قلعة الجاهلي واكتشف خريطة قديمة.');
assert.equal(finish(story,'الآن أريد أن أكمل','ar','auto',protectedHistory),story,
  'The story must still be one sentence with NO questions');
const certificate='أحسنت! [WINNER: Sara | Grade: 5 | Content: A story]';
assert.equal(finish(certificate,'انتهت','ar','auto',protectedHistory),certificate);
assert.equal(finish(certificate,'اكتب شهادة','ar','auto'),certificate,'Never attach text after certificate tags');

const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes("content:finishSaqrReply(answer,'catalog')"),'Direct catalog route is covered');
assert.ok(page.includes("content:finishSaqrReply(response,'reading-list')"),'Reading-list route is covered');
assert.ok(page.includes("content:finishSaqrReply(saqrIntroductionReply("),'Introduction route is covered');
assert.ok(page.includes("content:finishSaqrReply((ar?'## كتب جناح الهوية الوطنية"),'National identity route is covered');
assert.ok(page.includes("content:finishSaqrReply(locale==='ar'"),'Schedule route is covered');
assert.ok(page.includes("content: finishSaqrReply(reply, namedBookTitle ? 'named-book'"),'Generative/book route is covered');
assert.ok(page.includes("content: finishSaqrReply(locale === 'ar'"),'Network error route is covered');
assert.ok(page.includes('renderSaqrBookHoldingStatus(namedBookTitle,namedBookHoldings'),
  'Book-holdings report still comes before the closing question');
assert.ok(page.includes("if (reply.includes('[WINNER:'))"),
  'Certificate extraction logic must remain untouched');
assert.ok(page.includes('isStoryBeginning(userQuery)'),
  'Little Author generator must remain untouched');
assert.ok(page.includes('setResearchAnswer(reply)'), 'Research PDF retains original generated content');
assert.ok(page.includes("reply = stripSaqrEmoji(reply)"),'Original reply sanitization remains');

console.log('PASS: Saqr ends normal responses with one relevant Arabic/English question; existing questions, story/challenge, certificates, knowledge, research PDF, catalogs and functions are preserved');
