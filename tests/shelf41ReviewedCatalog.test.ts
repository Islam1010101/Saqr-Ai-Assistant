import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bookData} from '../api/bookData.ts';
import {reviewedShelf41Books} from '../api/shelf41ReviewedCatalog.ts';
import {nationalIdentityBooks,searchNationalIdentityBooks} from '../src/utils/nationalIdentityCatalog.ts';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
assert.equal(reviewedShelf41Books.length,83);
assert.equal(reviewedShelf41Books.reduce((n,x)=>n+x.copies,0),104);
assert.ok(reviewedShelf41Books.every(b=>b.shelf===41&&b.row>=1&&b.row<=13));
const norm=(x:string)=>x.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const distinct=new Set(reviewedShelf41Books.map(x=>x.row+'|'+norm(x.title)));
assert.equal(distinct.size,reviewedShelf41Books.length);
for(const item of reviewedShelf41Books){
 assert.ok(bookData.some(b=>b.shelf===41&&b.row===item.row&&norm(b.title)===norm(item.title)),'Missing in physical catalog: '+item.title);
 assert.ok(nationalIdentityBooks.some(b=>b.shelf===41&&b.row===item.row&&norm(b.title)===norm(item.title)),'Missing in identity page: '+item.title);
}
assert.ok(searchNationalIdentityBooks('القائد الاستثنائي').some(b=>b.title.includes('القائد الاستثنائي')));
assert.ok(searchNationalIdentityBooks('محمد سيف').some(b=>b.author.includes('محمد سيف')));
assert.ok(searchSaqrBookCatalog('القائد الاستثنائي',{physical:bookData,arabic:[],english:[]}).some(b=>b.title.includes('القائد الاستثنائي')));
assert.equal(bookData.filter(b=>b.shelf===34).length,0);
assert.ok(bookData.filter(b=>b.shelf===41).length>=83);
assert.ok(bookData.some(b=>b.title==='أحمد بن ماجد أسد البحار'&&b.id.startsWith('addition-')));
console.log('PASS 83 verified unique shelf 41 records, 104 copies, stable physical ids and both search channels');
