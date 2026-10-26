import assert from 'node:assert/strict';
import {bookData} from '../api/bookData.ts';
import {physicalBookAdditions} from '../api/bookAdditions.ts';
import {audienceByShelf} from '../api/shelfAudience.ts';
import {nationalIdentityBooks,searchNationalIdentityBooks} from '../src/utils/nationalIdentityCatalog.ts';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
const moved=['الهندسة للأطفال الفضوليين','موسوعة العلوم','الكيمياء للأطفال الفضوليين','موسوعة الديناصورات','علم الفضاء للأطفال الفضوليين','الفيزياء للأطفال الفضوليين','موسوعة التكنولوجيا','موسوعة كوكب الأرض'];
assert.equal(physicalBookAdditions.length,64);
assert.equal(physicalBookAdditions.some(b=>b.shelf===34),false);
assert.equal(bookData.filter(b=>b.shelf===34).length,0);
for(const title of moved){
 const item=bookData.find(b=>b.title===title);
 assert.ok(item,'Missing: '+title);
 assert.equal(item.shelf,35,title);
 assert.equal(item.row,4,title);
}
assert.equal(audienceByShelf(35),'youthTeens');
assert.equal(audienceByShelf(41),'nationalIdentity');
assert.equal(bookData.some(b=>b.shelf===41),true);
assert.ok(nationalIdentityBooks.some(x=>x.shelf===41));
assert.ok(searchNationalIdentityBooks('محمد بن زايد').some(x=>x.title.includes('محمد بن زايد')));
assert.ok(searchNationalIdentityBooks('عائشة').some(x=>x.author.includes('عائشة')));
const found=searchSaqrBookCatalog('كتب عن الإمارات',{physical:bookData,arabic:[],english:[]},30);
assert.ok(found.some(x=>x.shelf===41),'Saqr must find national identity shelf 41');
const sherlock=searchSaqrBookCatalog('شيرلوك هولمز',{physical:bookData,arabic:[],english:[]});
assert.ok(sherlock.some(x=>x.title.includes('SHERLOCK HOLMES')));
console.log('PASS relocated books, audience, national identity corner and Saqr search');
