import assert from 'node:assert/strict';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
import {decideSaqrMode,isNewDiscussion,discussionOpening,saqrExtraContext} from '../src/utils/saqrSafeEnhancements.ts';
const books={
 physical:[{title:'Teaching Students',author:'Teacher',subject:'Education & Teaching',summary:'Classroom lessons',shelf:9,row:3}],
 arabic:[{title:'قصص من تراث الإمارات',author:'مؤلف',subject:'تراث',summary:'حياة البحر في الإمارات',driveLink:'https://example.org/ar'}],
 english:[{title:'How Children Learn',author:'Expert',subject:'Education',summary:'Teaching and classroom learning',driveLink:'https://example.org/en'},{title:'Wonder',author:'Palacio',subject:'Drama',summary:'A story about kindness and empathy',driveLink:'https://example.org/wonder'}]
};
const education=searchSaqrBookCatalog('أريد كتب عن التربية والتعليم',books);
assert.ok(education.some(x=>x.title==='Teaching Students'&&x.shelf===9&&x.row===3),'physical location');
assert.ok(education.some(x=>x.title==='How Children Learn'&&x.driveLink==='https://example.org/en'),'English digital concept');
assert.ok(searchSaqrBookCatalog('Books about Emirati heritage',books).some(x=>x.title==='قصص من تراث الإمارات'),'Arabic digital concept');
assert.ok(searchSaqrBookCatalog('كتب عن التعاطف',books).some(x=>x.title==='Wonder'),'English summary semantic clue');
assert.ok(searchSaqrBookCatalog('كائنات غير موجودة بالمرّة',books).length===0,'no invented holding');
assert.equal(isNewDiscussion('خلينا نتناقش',[]),true);
assert.equal(discussionOpening('ar'),'تحب نتناقش في إيه؟ في موضوع معين ولا كتاب قرأته؟');
assert.equal(decideSaqrMode('أنا شايف إن القراءة مفيدة',[{role:'user',content:'خلينا نتناقش'}]),'discussion');
assert.equal(decideSaqrMode('تحضير درس علوم',[{role:'user',content:'خلينا نتناقش'}]),'none');
assert.equal(decideSaqrMode('تحدي المؤلف الصغير',[]),'none');
const info=saqrExtraContext({question:'إنت مين وإيه الخدمات',history:[],role:'student',grade:8,locale:'ar',matches:[]});
assert.equal(info.mode,'about');
for(const term of ['Cultural Passport','Emirati Language','Heritage Research Detective','Flag of Glory'])assert.ok(info.context.includes(term),term);
console.log('PASS Saqr catalog/discussion/heritage regressions');
