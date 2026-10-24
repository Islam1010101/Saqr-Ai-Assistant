import assert from 'node:assert/strict';
import { decideSaqrMode, rankForReader, saqrExtraContext, trustedTopicSources, checkSaqrAnswer } from '../src/utils/saqrSafeEnhancements.ts';
import type { SaqrBookMatch } from '../src/utils/saqrCatalogSearch.ts';

const physical=(title:string,subject:string,shelf:number):SaqrBookMatch=>({
  title,author:'EFIPS catalog',subject,shelf,row:2,pageLocation:'Physical Library',matchBasis:'Catalog subject/topic'
});
const cases: Array<[string,()=>void]> = [
  ['Book lookup Arabic',()=>assert.equal(decideSaqrMode('أريد كتبًا عن التربية',[]),'catalog')],
  ['Book lookup English',()=>assert.equal(decideSaqrMode('Books about education',[]),'catalog')],
  ['Reading suggestions',()=>assert.equal(decideSaqrMode('Recommend books for grade 9',[]),'recommend')],
  ['Discussion Arabic',()=>assert.equal(decideSaqrMode('ناقشني حول التراث',[]),'discussion')],
  ['Discussion English',()=>assert.equal(decideSaqrMode('Discuss the book with me',[]),'discussion')],
  ['About Saqr',()=>assert.equal(decideSaqrMode('عرفني بنفسك',[]),'about')],
  ['Protect lesson plan',()=>assert.equal(decideSaqrMode('تحضير درس اللغة العربية',[]),'none')],
  ['Protect presentation',()=>assert.equal(decideSaqrMode('presentation slides about reading',[]),'none')],
  ['Protect Little Author',()=>assert.equal(decideSaqrMode('تحدي المؤلف الصغير',[]),'none')],
  ['Protect story follow-ups',()=>assert.equal(decideSaqrMode('قال الطفل مرحبا',[{role:'user',content:'تحدي المؤلف الصغير'}]),'none')],
  ['Ordinary conversation untouched',()=>assert.equal(decideSaqrMode('ما هي عاصمة الإمارات؟',[]),'none')],
  ['No automatic specialist to young students',()=>{
    const list=rankForReader([physical('Professional Accounting','Finance',4),physical('Children Storybook','Children Stories',35)],{role:'student',grade:4});
    assert.equal(list.length,1);assert.equal(list[0].audience,'children');
  }],
  ['Advisory level not falsely verified',()=>{
    const list=rankForReader([physical('Children Storybook','Children',35)],{role:'student',grade:4});
    assert.equal(list[0].verifiedAge,false);
  }],
  ['Catalog response suggestions preserve locations',()=>{
    const book=physical('Children Storybook','Children',35);
    const x=saqrExtraContext({question:'رشحلي كتب',history:[],role:'student',grade:4,locale:'ar',matches:[book]});
    assert.match(x.context,/Shelf 35, Row 2/);
  }],
  ['External sources from institutional allowlist',()=>{
    const list=trustedTopicSources('تعليم المعلمين',{role:'teacher',grade:null});
    assert.ok(list.length>0);assert.ok(list.every(x=>x.url.startsWith('https://')));
  }],
  ['Site capabilities have real routes',()=>{
    const x=saqrExtraContext({question:'عرفني بنفسك',history:[],role:'student',grade:9,locale:'ar',matches:[]});
    assert.ok(x.context.includes('https://www.efipslibrary.com/#/search'));
  }],
  ['Question in discussion quality',()=>assert.equal(checkSaqrAnswer('What do you think about this?', 'discussion',[]).checks.oneQuestion,true)],
  ['Unverified shelf detected',()=>{
    const list=[physical('Storybook','Children',35)];
    assert.equal(checkSaqrAnswer('Storybook Shelf 99', 'catalog',list).checks.shelvesFromCatalog,false);
  }]
];
for(const [name,test] of cases){test();console.log('PASS',name)}
console.log('PASSED '+cases.length+'/'+cases.length);
