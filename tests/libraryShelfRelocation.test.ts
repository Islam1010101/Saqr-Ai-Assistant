import assert from 'node:assert/strict';
import {bookData} from '../api/bookData.ts';
import {physicalBookAdditions} from '../api/bookAdditions.ts';
import {audienceByShelf} from '../api/shelfAudience.ts';
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
console.log('PASS shelf 34 relocation, row preservation and 64 source books');
