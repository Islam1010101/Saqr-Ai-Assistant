import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {formatSaqrRecommendationReply,hasMalformedSaqrRecommendationTable,polishSaqrRecommendationProse}
  from '../src/utils/saqrRecommendationPresentation.ts';

const books=[
 {title:'في الفضاء الفسيح: علماء الفلك',author:'دويجو قيران',subject:'Astronomy & Space',
  pageLocation:'المكتبة العادية (Physical Library)',shelf:35,row:2,matchBasis:'title'},
 {title:"Knowledge Encyclopedia Space!: The Universe as You've Never Seen It Before",author:'DK',
  subject:'Space Science & Astronomy',pageLocation:'المكتبة الرقمية الإنجليزية (English Digital Library)',
  driveLink:'https://drive.google.com/file/d/exampleSpaceID/view',matchBasis:'title'},
 {title:'Astronomy in Color',author:'Peter Lancaster Brown',subject:'Astronomy & Space',
  pageLocation:'المكتبة العادية (Physical Library)',shelf:15,row:2,matchBasis:'title'}
];
const bad='### توصية بكتب عن الفضاء\n\n**| العنوان | المؤلف | الموقع | لماذا يناسبك | |---------|--------|--------|--------| | في الفضاء الفسيح: علماء الفلك | دويجو قيران | رف 35 | محتوى مناسب للمرحلة المتوسطة حسب تجربة صقر | | Knowledge Encyclopedia Space!: The Universe as You\'ve Never Seen It Before | DK | https://drive.google.com/file/d/exampleSpaceID/view | كتاب مناسب لطلاب الابتدائي | | Astronomy in Color | Peter Lancaster Brown | رف 15 | قرأت محتواه بالكامل |**\n\n---\n\nما هو الصف الدراسي؟';
assert.ok(hasMalformedSaqrRecommendationTable(bad),'Malformed one-line table is detected');
const repaired=formatSaqrRecommendationReply(bad,books,'ar');
assert.doesNotMatch(repaired,/\|\s*العنوان|\|---------|\*\*\||\*\*\s*ما هو الصف الدراسي/);
assert.doesNotMatch(repaired,/قرأت محتواه|مناسب للمرحلة المتوسطة|مناسب لطلاب الابتدائي/);
assert.match(repaired,/في الفضاء الفسيح: علماء الفلك/);
assert.match(repaired,/الرف 35، الصف 2/);
assert.match(repaired,/Knowledge Encyclopedia Space!/);
assert.match(repaired,/https:\/\/drive\.google\.com\/file\/d\/exampleSpaceID\/view/);
assert.match(repaired,/Astronomy in Color/);
assert.equal((repaired.match(/تحب تقرأ بالعربي ولا بالإنجليزي؟/g)||[]).length,1);
assert.ok(repaired.indexOf('في الفضاء الفسيح')<repaired.indexOf('Knowledge Encyclopedia'),
  'AI-selected title order is retained');
const ordinary='ممكن تبدأ بـ **Astronomy in Color**، موجود على الرف 15، الصف 2. تحب تقرأ بالعربي؟';
assert.equal(formatSaqrRecommendationReply(ordinary,books,'ar'),ordinary,
  'Good natural prose is completely untouched');
assert.equal(formatSaqrRecommendationReply(bad,[], 'ar'),bad,'Never invent books without holdings');
const english=formatSaqrRecommendationReply(
  '| Title | Author | Link |\n|---|---|---|\n| Astronomy in Color | Peter Lancaster Brown | physical |',
  books,'en');
assert.match(english,/Physical library/);
assert.doesNotMatch(english,/\|---/);
assert.match(english,/Would you prefer to read in Arabic or English/);
const overbold=[
 '**أهلاً بك يا أستاذ. بصفتي مكتبة المدرسة، يسعدني أن أرشح لك بعض الكتب المتميزة عن الفضاء.**',
 '',
 '**إليك ترشيحاتي لكتب الفضاء:**',
 '',
 '- **(ASTRONOMY) - المكتبة العادية، رف 6، صف 4: مرجع عن علم الفلك.**',
 '- **Astronomy in Color**',
].join('\n');
const cleaned=polishSaqrRecommendationProse(overbold);
assert.doesNotMatch(cleaned,/بصفتي مكتبة المدرسة/);
assert.doesNotMatch(cleaned,/\*\*أهلاً بك|\*\*إليك ترشيحاتي|\*\*\(ASTRONOMY\)/);
assert.match(cleaned,/\*\*Astronomy in Color\*\*/,'Book title styling is preserved');
assert.equal(polishSaqrRecommendationProse(ordinary),ordinary,
  'Already natural conversation and emphasis are unchanged');
const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes('formatSaqrRecommendationReply(reply, foundBooks'));
assert.ok(page.includes('polishSaqrRecommendationProse('));
assert.ok(page.includes('Never produce a Markdown table'));
assert.ok(page.includes('if (recommendationTurn)'),'Fallback is restricted to recommendation turns');
console.log('PASS: AI recommendation tables are repaired into grounded, natural chat replies in Arabic and English');
