import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bookData} from '../api/bookData.ts';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
import {isPhysicalCatalogMetadataNote,isPhysicalCatalogPlaceholder} from '../src/utils/physicalCatalogSummaries20261113.ts';

const added=[
  'Elizabeth Gail And Strange Birthday Party',
  '100 Peaple Who Changed America',
  'SACAGAWEA',
  'Colourful London',
  'The Decline & Fall Of Welfare State',
  'The Good Fat Bad Fat',
  'african american quilting : The Warmth of Tradition',
  'Buttermilk Hill',
  'Cyber Qust',
  'Puppy Care And Training',
  'Death Of a Salesman',
  'The White Stallion',
  'Megan',
  'Helping Your PreSchool Child',
  'The 10 Funniest People'
];
const normalize=(s:string)=>s.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
assert.equal(new Set(bookData.map(book=>book.id)).size,bookData.length,'All book IDs remain unique');
for(const title of added){
 const matches=bookData.filter(book=>normalize(book.title)===normalize(title));
 assert.equal(matches.length,1,'New book appears once in the physical catalogue: '+title);
 const item=matches[0];
 assert.ok(item.shelf>0&&item.row>0&&item.author&&item.summary,'New book has essential fields: '+title);
 assert.equal(item.language,'EN','All 15 new records are English-language titles');
 assert.ok(!isPhysicalCatalogPlaceholder(item.summary),'New records must not use Coming Soon placeholders');
 assert.ok(item.summary.length>=65,'New record has a meaningful description: '+title);
 const results=searchSaqrBookCatalog(title,{physical:bookData,arabic:[],english:[]},20);
 assert.ok(results.some(result=>normalize(result.title)===normalize(title)),
  'Saqr catalog can locate new book: '+title);
}
assert.equal(bookData.filter(book=>normalize(book.title)===normalize('Secrecy') &&
 book.author==='Belva Plain'&&book.shelf===15&&book.row===2).length,1,
 'Secrecy duplicate removed while keeping its original record');
const ww3=bookData.find(book=>book.title==='WW III (World War III)'&&book.author==='Ian Slater');
assert.equal(ww3?.id,'15-2-3011','Old IDs after removed duplicate must not shift');
for(const book of bookData){
 assert.ok(book.summary && book.summary.trim(),'Missing summary field: '+book.id);
 if(isPhysicalCatalogMetadataNote(book.summary)){
  assert.ok(book.language==='AR'?book.summary.startsWith('ملاحظة فهرسية:'):
   book.summary.startsWith('Catalogue note:'),'Summary note must follow book language: '+book.id);
 }
}
for(const title of ['SACAGAWEA','Buttermilk Hill','The White Stallion','Death Of a Salesman']){
 const b=bookData.find(x=>normalize(x.title)===normalize(title));
 assert.ok(b&&!isPhysicalCatalogMetadataNote(b.summary),'Recognizable work has a real source-grounded synopsis: '+title);
}
const arabicNote=bookData.find(x=>x.language==='AR'&&isPhysicalCatalogMetadataNote(x.summary));
const englishNote=bookData.find(x=>x.language==='EN'&&isPhysicalCatalogMetadataNote(x.summary));
assert.ok(arabicNote?.summary.startsWith('ملاحظة فهرسية:')&&englishNote?.summary.startsWith('Catalogue note:'));
const server=readFileSync('api/chat.ts','utf8');
for(const title of added)
 assert.ok(server.includes(JSON.stringify(title)),'Saqr server fallback knows: '+title);
assert.equal((server.match(/"title": "Secrecy", "author": "Belva Plain", "shelf": 15, "row": 2/g)||[]).length,1);
console.log('EFIPS_PHYSICAL_CATALOG_UPDATE='+JSON.stringify({
 totalPhysical:bookData.length,added:added.length,languageAwareSummaries:true,
 serverFallbackSynced:true,idsPreserved:true
}));
