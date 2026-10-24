import assert from 'node:assert/strict';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
import {isSaqrCatalogLookup,renderSaqrCatalogAnswer} from '../src/utils/saqrCatalogReply.ts';
import {detectLearningIntent,saqrLearningInstructions} from '../src/utils/saqrLearning.ts';
import {saqrExtraContext} from '../src/utils/saqrSafeEnhancements.ts';
const catalogs={physical:[{title:'Animal Tales',author:'Someone',shelf:14,row:3}],arabic:[],english:[{title:'Harry Potter And The Chamber Of Secrets',author:'J. K. Rowling',subject:'Fantasy',driveLink:'https://example.org/harry'}]};
for(const query of ['هاري بوتر','عايز هاري بوتر','Harry Potter']){
 const result=searchSaqrBookCatalog(query,catalogs);
 assert.ok(result.some(x=>x.title.includes('Harry Potter')),query);
 assert.ok(isSaqrCatalogLookup(query),query);
 assert.ok(renderSaqrCatalogAnswer(query,result,'ar').includes('https://example.org/harry'));
}
assert.equal(searchSaqrBookCatalog('هاري بوتر',{physical:[],arabic:[],english:[]}).length,0);
assert.equal(detectLearningIntent('عايز احجز حصة مكتبة','teacher'),'schedule');
assert.equal(detectLearningIntent('احجزلي حصة','teacher'),'schedule');
assert.equal(detectLearningIntent('الخميس الحصة 3','teacher',[{role:'user',content:'عايز احجز حصة مكتبة'}]),'schedule');
assert.ok(saqrLearningInstructions('research','student',9,'ar').includes('ONE relevant learner-check question'));
assert.ok(saqrLearningInstructions('tutoring','student',6,'ar').includes('evaluate their answer'));
assert.ok(saqrExtraContext({question:'أنا فهمت ان القراءة تفيدني',history:[{role:'user',content:'خلينا نتناقش'}],role:'student',grade:6,locale:'ar',matches:[]}).context.includes('substantive'));
console.log('PASS cross-script verified-title, scheduling and learning follow-up checks');
