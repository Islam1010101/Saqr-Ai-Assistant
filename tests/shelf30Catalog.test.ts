import assert from 'node:assert/strict';
import {bookData} from '../api/bookData.ts';
import {shelf30SourceRecords} from '../api/shelf30Catalog.ts';
assert.equal(shelf30SourceRecords.length,50);
const norm=(v:string)=>v.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
for(const src of shelf30SourceRecords){
 const found=bookData.find(b=>b.shelf===30&&b.row===src.row&&norm(b.title)===norm(src.title));
 assert.ok(found,'Missing physical catalog record: '+src.title);
 assert.equal(found.author,src.author,'Original CSV author not preserved for '+src.title);
 assert.equal(found.language,'EN');
}
assert.equal(new Set(bookData.map(b=>b.id)).size,bookData.length,'No duplicate catalog IDs');
console.log('PASS: 50 CSV records on shelf 30, correct location and author, unique IDs');
