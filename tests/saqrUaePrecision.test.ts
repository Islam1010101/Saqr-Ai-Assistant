import assert from 'node:assert/strict';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
import {renderSaqrCatalogAnswer} from '../src/utils/saqrCatalogReply.ts';
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
