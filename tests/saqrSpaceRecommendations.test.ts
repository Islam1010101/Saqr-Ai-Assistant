import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
import {resolveSaqrCatalogEntity} from '../src/utils/saqrCatalogEntitySearch.ts';
import {isSaqrCatalogLookup,isSaqrRecommendationRequest,renderSaqrCatalogAnswer} from '../src/utils/saqrCatalogReply.ts';

for(const question of ['رشحلي كتاب عن الفضاء','اقترح كتاب عن الفضاء','ممكن ترشحلي كتاب عن الفضاء؟','عايز رواية خيالية عن الفضاء','أبغي قصة خيالية عن النجوم','Recommend a book about space','Suggest some space books']){
  assert.equal(isSaqrRecommendationRequest(question),true,question);
  assert.equal(isSaqrCatalogLookup(question),false,
    'Recommendations must reach Saqr model for dialogue, not raw catalog listing: '+question);
}
for(const question of ['ابحث عن كتب الفضاء','دورلي على كتاب الفضاء','Find Harry Potter books']){
  assert.equal(isSaqrCatalogLookup(question),true,
    'Explicit search keeps the deterministic catalog route: '+question);
}

const catalogs={
  physical:[
    {title:'الفضاء التأويلي',author:'د. عبد السلام المسدي',subject:'Astronomy & Space',shelf:39,row:4},
    {title:'في الفضاء الفسيح: علماء الفلك',author:'دويجو قيران',subject:'Astronomy & Space',shelf:35,row:2},
    {title:'افتح النوافذ واكتشف : الفضاء',author:'SHAYNIE EDWARD',subject:'Astronomy & Space',shelf:35,row:4},
    {title:'علم الفضاء للأطفال الفضوليين',author:'ربيع ديركي',subject:'Astronomy & Space',shelf:35,row:4},
    {title:'Astronomy in Color',author:'Peter Lancaster Brown',subject:'Astronomy & Space',shelf:15,row:2},
    {title:'SPACE WAR',author:'X',subject:'Astronomy & Space',shelf:3,row:5},
    {title:'Amazing History',author:'Y',subject:'History & Culture',shelf:2,row:1}
  ],
  arabic:[
    {title:'الفيزياء للصغار',author:'ليونيد سيكوروك',subject:'علوم'},
    {title:'أعظم 100عالم غيروا العالم',author:'جون بالتشين',subject:'علوم'},
    {title:'أسطورة فى جانب النجوم',author:'أحمد خالد توفيق',subject:'Science & Physics',
      series:'سلسلة ما وراء الطبيعة',driveLink:'https://drive.google.com/file/d/storySpaceSample/view'}
  ],
  english:[
    {title:"Knowledge Encyclopedia Space!: The Universe as You've Never Seen It Before",
      author:'DK',subject:'Space Science & Astronomy',driveLink:'https://drive.google.com/file/d/abc/view'},
    {title:'1000 Inventions and Discoveries',author:'Roger Bridgman',subject:'Science & Technology'},
    {title:'DKfindout! Coding',author:'DK',subject:'Coding & Computer Science'}
  ]
};
const matches=searchSaqrBookCatalog('رشحلي كتاب عن الفضاء',catalogs,12);
const titles=matches.map(x=>x.title);
assert.ok(matches.length>=4,'Genuine space holdings remain accessible');
for(const forbidden of ['الفضاء التأويلي','SPACE WAR','الفيزياء للصغار','أعظم 100عالم غيروا العالم',
  'أسطورة فى جانب النجوم','1000 Inventions and Discoveries','DKfindout! Coding']){
  assert.ok(!titles.includes(forbidden),'Unrelated item must not be a space recommendation: '+forbidden);
}
for(const expected of ['في الفضاء الفسيح: علماء الفلك','افتح النوافذ واكتشف : الفضاء',
 'علم الفضاء للأطفال الفضوليين','Astronomy in Color',
 "Knowledge Encyclopedia Space!: The Universe as You've Never Seen It Before"]){
  assert.ok(titles.includes(expected),'Genuine astronomy/space title should be discoverable: '+expected);
}
// Fiction is never treated as educational astronomy just because the title
// contains «النجوم», even if its catalogue subject is an overly broad science tag.
const ordinarySpaceSearch=searchSaqrBookCatalog('ابحث عن كتب الفضاء',catalogs);
assert.ok(!ordinarySpaceSearch.some(b=>b.title==='أسطورة فى جانب النجوم'));
const fictionalSpace=searchSaqrBookCatalog('رشحلي رواية خيال عن النجوم',catalogs);
assert.ok(fictionalSpace.some(b=>b.title==='أسطورة فى جانب النجوم'),
  'An explicit fantasy/story request may include the novel');
const actualGenreRequest=searchSaqrBookCatalog('عايز رواية خيالية عن الفضاء',catalogs);
console.error('DEBUG SPACE GENRE', JSON.stringify({titles:actualGenreRequest.map(b=>b.title), namedEntity:resolveSaqrCatalogEntity('عايز رواية خيالية عن الفضاء',catalogs)}));
assert.ok(actualGenreRequest.some(b=>b.title==='أسطورة فى جانب النجوم'),
  'Genre requests should discover recorded star-themed fiction');
assert.ok(!actualGenreRequest.some(b=>b.title==='Astronomy in Color'),
  'Fiction searches must not be filled with astronomy reference titles');
assert.ok(!actualGenreRequest.some(b=>b.title==='علم الفضاء للأطفال الفضوليين'),
  'Fiction requests must not include astronomy non-fiction');
const namedStory=searchSaqrBookCatalog('ابحث عن أسطورة فى جانب النجوم',catalogs);
assert.ok(namedStory.some(b=>b.title==='أسطورة فى جانب النجوم'),
  'Named-book search must retain genuine fictional library holdings');

const englishMatches=searchSaqrBookCatalog('Recommend a book about space',catalogs);
assert.ok(englishMatches.some(b=>b.title.startsWith('Knowledge Encyclopedia Space!')));
assert.ok(englishMatches.every(x=>!x.title.includes('Coding') && !x.title.includes('1000 Inventions')));
// An exact named figurative title should remain discoverable without suggesting it for astronomy.
assert.ok(searchSaqrBookCatalog('كتاب الفضاء التأويلي',catalogs)
  .some(x=>x.title==='الفضاء التأويلي'));
const listing=renderSaqrCatalogAnswer('ابحث عن كتب الفضاء',matches,'ar');
assert.ok(listing.includes('نتائج البحث في فهارس مكتبة EFIPS'),'Explicit search still shows verified catalog');

const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes('recommendationTurn = librarySearchIntent && (isSaqrRecommendationRequest(userQuery)'));
assert.ok(page.includes("Never say 'بصفتي مكتبة المدرسة'"));
assert.ok(page.includes('Differentiate science/non-fiction books about space'));
assert.ok(page.includes('Use the true name naturally once'));
assert.ok(page.includes('RECOMMENDATION CONVERSATION, NOT A CATALOG DUMP'));
assert.ok(page.includes('linkedBookTurn.continued'),'Recommendation follow-ups retain the topic');
assert.ok(page.includes("content: reply"),'Generated recommendations are not given a canned extra question');
const library=readFileSync('api/bookData.ts','utf8');
assert.ok(library.includes("title.trim() === 'الفضاء التأويلي'"));
assert.ok(library.includes("return 'Language & Linguistics'"));
console.log('PASS: space book recommendations are focused, librarian-guided, grounded, and preserve explicit catalog search.');
