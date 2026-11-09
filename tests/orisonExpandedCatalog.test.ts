import assert from 'node:assert/strict';
import {bookData} from '../api/bookData.ts';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';

const clean=(s:string)=>String(s||'').normalize('NFKC').toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu,'');
const base=bookData.filter(book=>!book.id.startsWith('orison-expanded-20261109-'));
const additions=bookData.filter(book=>book.id.startsWith('orison-expanded-20261109-'));
const beforeTitles=new Set(base.map(x=>clean(x.title)));
const beforeIsbns=new Set(base.map(x=>String(x.isbn||'').replace(/[^0-9X]/g,'')));

assert.equal(bookData.filter(book=>book.id.startsWith('orison-20261109-')).length,49,
  'First published Orison batch must not change');
assert.ok(additions.length>=80,'Expanded review must add a meaningful set of titles');
assert.equal(new Set(bookData.map(b=>b.id)).size,bookData.length,'No existing IDs changed or duplicated');
assert.ok(additions.every(b=>!beforeTitles.has(clean(b.title))),
  'No new book may repeat a title in the earlier holdings');
assert.ok(additions.every(b=>!beforeIsbns.has(String(b.isbn||'').replace(/[^0-9X]/g,''))),
  'No new book may repeat an existing ISBN');
assert.equal(new Set(additions.map(b=>clean(b.title))).size,additions.length);
assert.ok(additions.every(b=>b.title&&b.author&&b.isbn&&b.copies&&b.shelf>0),
  'All new entries must carry complete title, author, edition identifier, and shelf');
assert.ok(additions.every(b=>![0,34,41].includes(b.shelf)),
  'No new Orison entries may appear in reserved or undefined shelf locations');
const sample=additions.find(book=>book.shelf===23)||additions[0];
const found=searchSaqrBookCatalog(sample.title,{
  physical:bookData,arabic:[],english:[]
});
assert.ok(found.some(b=>clean(b.title)===clean(sample.title)),
  'Saqr must find imported titles from the same physical catalog');
console.log('PASS: Additional Orison catalog titles '+additions.length+
  '; initial Orison batch preserved 49; catalog total '+bookData.length);
