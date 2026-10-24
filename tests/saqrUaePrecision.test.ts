import assert from 'node:assert/strict';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
import {renderSaqrCatalogAnswer} from '../src/utils/saqrCatalogReply.ts';
import {bookData} from '../api/bookData.ts';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE} from '../api/digitalBookData.ts';
const catalogs={
 physical:[{title:'تاريخ دولة الإمارات العربية المتحدة',author:'مؤلف',subject:'تاريخ الإمارات',shelf:11,row:2}],
 arabic:[{title:'مغامرات جحا',author:'كاتب',subject:'أدب عربي/تراث',summary:'قصص من التراث العربي',driveLink:'https://example.org/juha'}],
 english:[{title:'World Heritage Stories',author:'Writer',subject:'Heritage',summary:'Arab heritage and traditions',driveLink:'https://example.org/heritage'}]
};
for(const query of ['كتب عن الإمارات','كتب عن التراث الإماراتي','books about UAE heritage']){
 const matches=searchSaqrBookCatalog(query,catalogs);
 assert.equal(matches.length,1,query);
 assert.equal(matches[0].shelf,11);
 const answer=renderSaqrCatalogAnswer(query,matches,'ar');
 assert.ok(answer.includes('لا توجد نتائج مؤكدة مطابقة للموضوع في هذا الفهرس.'));
 assert.ok(!answer.includes('مغامرات جحا')&&!answer.includes('World Heritage Stories'));
}
assert.equal(searchSaqrBookCatalog('كتب عن الإمارات',{physical:[],arabic:[],english:[]}).length,0);
const digital={...catalogs,arabic:[{title:'تراث الإمارات',author:'كاتبة',subject:'تاريخ دولة الإمارات',driveLink:'https://example.org/uae'}]};
const found=searchSaqrBookCatalog('كتب عن الإمارات',digital);
assert.ok(found.some(x=>x.driveLink==='https://example.org/uae'));
console.log('PASS UAE-specific holdings and empty digital collection safeguards');

const real=searchSaqrBookCatalog('كتب عن الإمارات',{physical:bookData,arabic:ARABIC_LIBRARY_DATABASE,english:ENGLISH_LIBRARY_DATABASE});
assert.ok(real.every(x=>/الإمارات|الامارات|امارات|Emirates|Emirati|UAE|أبوظبي|ابوظبي|Dubai|دبي|الشارقة/i.test(x.title)), 'all real UAE results must be explicitly grounded in a book title');
assert.equal(real.filter(x=>x.driveLink).length,0,'current digital catalogs contain no verified UAE-specific digital title');
const renderedReal=renderSaqrCatalogAnswer('كتب عن الإمارات',real,'ar');
assert.ok(!renderedReal.includes('مغامرات جحا')&&!renderedReal.includes('ألف اختراع واختراع')&&!renderedReal.includes('أدبي'),'real irrelevant matches are excluded');
const crafted={physical:[],arabic:[{title:'دليل أدبي',author:'كاتب',subject:'أدب عالمي',summary:'أعمال أدبية متنوعة',driveLink:'https://example.org/adabi'}],english:[]};
assert.equal(searchSaqrBookCatalog('كتب عن دبي',crafted).length,0,'دبي must not match أدبي');
console.log('PASS actual EFIPS print/digital catalog precision');
