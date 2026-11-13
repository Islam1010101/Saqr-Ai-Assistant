import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  getReadingInterviewStep,isOpenEndedBookAdvice,parseReadingAge,
  renderReadingInterviewSuggestions
} from '../src/utils/saqrReadingConsultation.ts';

const request='i want read a book  what you advace to me';
assert.equal(isOpenEndedBookAdvice(request),true,'Reader misspellings are understood');
assert.equal(isOpenEndedBookAdvice('Recommend a book about space'),false,
  'Topic-specific recommendations must keep the existing Saqr route');
assert.equal(isOpenEndedBookAdvice('I need a lesson plan for my class'),false);
assert.equal(isOpenEndedBookAdvice('عايز اقرا كتاب، ترشحلي إيه؟'),true);
const opener=getReadingInterviewStep(request,[],'ar');
assert.equal(opener.kind,'ask-interests');
if(opener.kind!=='ask-interests')throw new Error('Expected reader interests question');
assert.match(opener.reply,/hobbies/i,'English user text should start an English conversation');
const beforeAge=[{role:'assistant',content:opener.reply},{role:'user',content:'adventure and science'}];
const ageQuestion=getReadingInterviewStep('adventure and science',beforeAge.slice(0,1),'ar');
assert.equal(ageQuestion.kind,'ask-age');
if(ageQuestion.kind!=='ask-age')throw new Error('Expected age question');
assert.match(ageQuestion.reply,/how old are you/i);
const history=[...beforeAge,{role:'assistant',content:ageQuestion.reply}];
const final=getReadingInterviewStep('13 years old',history,'ar');
assert.equal(final.kind,'recommend');
if(final.kind!=='recommend')throw new Error('Expected book suggestions');
assert.equal(final.age,13);
assert.equal(final.interests,'adventure and science');
assert.equal(final.locale,'en','Follow-up digits must not switch to Arabic');
assert.equal(getReadingInterviewStep('stop',history,'en').kind,'none');
assert.equal(getReadingInterviewStep('prepare a worksheet',history,'en').kind,'none');
assert.equal(getReadingInterviewStep('teenager',history,'en').kind,'repeat-age');
assert.deepEqual(parseReadingAge('أنا في الصف 7'),{age:null,grade:7});
assert.deepEqual(parseReadingAge('عمري ١٢'),{age:12,grade:null});
const arOpener=getReadingInterviewStep('عايز اقرأ كتاب، تنصحني بإيه؟',[],'en');
assert.equal(arOpener.kind,'ask-interests');
if(arOpener.kind!=='ask-interests')throw new Error('Expected Arabic interests question');
assert.match(arOpener.reply,/هواياتك/);
const sampleMatches=[
 {title:'Science Adventures',author:'School Publisher',subject:'Science',
  pageLocation:'المكتبة الرقمية الإنجليزية (English Digital Library)',
  driveLink:'https://drive.google.com/file/d/teenStory/view',matchBasis:'subject'},
 {title:'The Accountant Handbook',author:'Technical Press',subject:'Professional Studies',
  pageLocation:'المكتبة الرقمية الإنجليزية (English Digital Library)',
  driveLink:'https://drive.google.com/file/d/adultBook/view',matchBasis:'subject'},
 {title:'Fabricated outside school',author:'None',subject:'Adventure',
  pageLocation:'المكتبة الرقمية الإنجليزية (English Digital Library)',
  driveLink:'https://drive.google.com/file/d/unlisted/view',matchBasis:'subject'}
];
const englishCatalog=[
 {title:'Science Adventures',author:'School Publisher',subject:'Science',
  driveLink:'https://drive.google.com/file/d/teenStory/view',readingAudience:'teens'},
 {title:'The Accountant Handbook',author:'Technical Press',subject:'Professional Studies',
  driveLink:'https://drive.google.com/file/d/adultBook/view',readingAudience:'adults'}
];
const message=renderReadingInterviewSuggestions({
 matches:sampleMatches,physical:[],arabic:[],english:englishCatalog,
 interests:'science and adventure',age:13,grade:null,locale:'en'
});
assert.match(message,/Science Adventures/);
assert.match(message,/teenStory/);
assert.doesNotMatch(message,/Accountant Handbook|Fabricated outside school/,
  'Age-inappropriate and unverified titles are never included');
assert.doesNotMatch(message,/\|\s*Genre\s*\|/,'No broken Markdown tables');
const noMatches=renderReadingInterviewSuggestions({
 matches:sampleMatches.slice(1),physical:[],arabic:[],english:englishCatalog,
 interests:'astronomy',age:10,grade:null,locale:'en'
});
assert.match(noMatches,/could not confirm a matching book/i,
  'No fabricated titles are allowed when matches are missing');
const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes('getReadingInterviewStep(userQuery,messages'));
assert.ok(page.includes('renderReadingInterviewSuggestions({'));
assert.ok(page.includes('if(readingInterview.kind!==\'none\' && !creativeTurn)'));
console.log('PASS: Saqr asks hobbies and age, then suggests only verified age-aware school books');
