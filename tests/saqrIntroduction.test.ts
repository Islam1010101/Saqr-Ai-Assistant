import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {detectSaqrIntroduction,saqrIntroductionReply} from '../src/utils/saqrIntroductionReplies.ts';
for(const input of ['من أنت','مين انت','ماذا تفعل','عرفني بنفسك','who are you','what can you do','Introduce yourself']){
 assert.equal(detectSaqrIntroduction(input),'assistant',input);
}
for(const input of ['ما هي بوابة المكتبة','ما هو موقع المكتبة','عرفني عن بوابة المكتبة','what is the library portal','tell me about the library website','what services does the portal offer']){
 assert.equal(detectSaqrIntroduction(input),'portal',input);
}
for(const input of ['ابحث عن كتاب الفضاء','حلل كتاب','أريد خطة درس','Let us discuss a book','Find a novel about UAE','من مؤلف كتاب الأيام؟','كيف تعمل خاصية استعارة الكتاب؟','what is quantum physics?']){
 assert.equal(detectSaqrIntroduction(input),null,'Do not hijack unrelated Saqr flow: '+input);
}
for(const kind of ['assistant','portal'] as const)for(const locale of ['ar','en'] as const){
 const response=saqrIntroductionReply(kind,locale);
 assert.ok(response.length>500);
 assert.ok(response.split('\n').filter(s=>s.startsWith('- ')).length>=6);
 assert.ok(response.includes('www.efipslibrary.com')||kind==='assistant');
}
const chat=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(chat.includes('const introductionIntent=detectSaqrIntroduction(userQuery)'));
assert.ok(chat.includes("setSaqrState('idle')"));
const home=readFileSync('pages/HomePage.tsx','utf8');
assert.ok(home.includes('@keyframes marquee-rtl { 0% { transform: translateX(0); }'));
assert.ok(home.includes('@keyframes marquee-ltr { 0% { transform: translateX(0); }'));
console.log('PASS Saqr: isolated bilingual self and portal introductions; other tasks unaffected; news visible at initial frame');
