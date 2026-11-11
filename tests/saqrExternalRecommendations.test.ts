import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {annotateSaqrExternalRecommendations} from '../src/utils/saqrExternalRecommendations.ts';
import {formatSaqrRecommendationReply} from '../src/utils/saqrRecommendationPresentation.ts';

const fullCatalog=[
 {title:'Journey to the Center of the Earth'}, // Jules Verne book at shelf 14 row 3
 {title:'في الفضاء الفسيح: علماء الفلك'},
 {title:'Knowledge Encyclopedia Space!: The Universe as You\'ve Never Seen It Before'},
 {title:'علم الفضاء للأطفال الفضوليين'}
];
const external='- **رحلة إلى القمر** — مكتبة عادية: الرف 14، الصف 3';
const verified='- **في الفضاء الفسيح: علماء الفلك** — الرف 35، الصف 2';
const marked=annotateSaqrExternalRecommendations(external+'\n'+verified,fullCatalog,'ar');
assert.match(marked,/رحلة إلى القمر/);
assert.match(marked,/اقتراح من خارج فهرس EFIPS/);
assert.match(marked,/المكتبة الورقية أو الرقمية/);
assert.doesNotMatch(marked,/الرف 14، الصف 3/,'External book must never be given a school shelf');
assert.match(marked,/الرف 35، الصف 2/,'A true verified holding retains its shelf and row');
assert.equal((marked.match(/اقتراح من خارج فهرس EFIPS/g)||[]).length,1);
const matchedBySameRow=annotateSaqrExternalRecommendations(
  '- **Journey to the Center of the Earth** — الرف 14، الصف 3',fullCatalog,'ar');
assert.doesNotMatch(matchedBySameRow,/اقتراح من خارج/,'Matching title is not outside the school');
assert.match(matchedBySameRow,/الرف 14، الصف 3/);
const prose=annotateSaqrExternalRecommendations(
  'من الكتب المعروفة رواية «رحلة إلى القمر» للكاتب جول فيرن.',fullCatalog,'ar');
assert.match(prose,/اقتراح من خارج/,'Inline quoted outside book should also be labeled');
const english=annotateSaqrExternalRecommendations(
  '- **From the Earth to the Moon** — shelf 14, row 3',fullCatalog,'en');
assert.match(english,/External suggestion/);
assert.doesNotMatch(english,/shelf 14, row 3/);
const noMatched=annotateSaqrExternalRecommendations(
  '- **رحلة إلى القمر** — رواية من خارج المكتبة',[],'ar');
assert.match(noMatched,/رحلة إلى القمر/);
assert.equal((noMatched.match(/اقتراح من خارج فهرس EFIPS/g)||[]).length,0,
  'Already explicitly labeled outside book should not repeat the label');
assert.equal(annotateSaqrExternalRecommendations('هلا، شو تحب تقرأ؟',fullCatalog,'ar'),
  'هلا، شو تحب تقرأ؟','Natural prose without a book suggestion must be untouched');
const checked=formatSaqrRecommendationReply(marked,[
 {title:'في الفضاء الفسيح: علماء الفلك',author:'دويجو قيران',subject:'Astronomy',
  shelf:35,row:2,pageLocation:'المكتبة العادية (Physical Library)',matchBasis:'Book title'}
],'ar');
assert.match(checked,/رحلة إلى القمر/,'Known outside-book suggestions survive the location fallback');
assert.match(checked,/خارج فهرس EFIPS/);
const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes("annotateSaqrExternalRecommendations(reply"));
assert.ok(page.includes('...bookData, ...ARABIC_LIBRARY_DATABASE, ...NATIONAL_IDENTITY_DIGITAL_BOOKS'));
assert.ok(page.includes('If there are no verified topic matches') || page.includes('If there are no verified'));
console.log('PASS: external book suggestions are preserved and clearly distinguished from verified EFIPS physical/digital holdings.');
