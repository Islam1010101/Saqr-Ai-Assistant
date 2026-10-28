import assert from 'node:assert/strict';
import {shelf22SourceRecords} from '../api/shelf22Catalog.ts';
import {bookData} from '../api/bookData.ts';

assert.equal(shelf22SourceRecords.length,268);
assert.equal(shelf22SourceRecords.reduce((total,book)=>total+book.copies,0),366);
const normalized=(s:string)=>s.normalize('NFKC').toLocaleLowerCase().replace(/[^\\p{L}\\p{N}]/gu,'');
const shelf22=bookData.filter(book=>book.shelf===22);
for(const source of shelf22SourceRecords){
  const book=shelf22.find(b=>b.row===source.row&&normalized(b.title)===normalized(source.title));
  assert.ok(book,'Missing cabinet 22 book: '+source.title);
  assert.equal(book.author,source.author||'Unknown Author');
  assert.equal(book.copies,source.copies);
  assert.equal(book.isbn,source.isbn);
  assert.equal(book.language,'EN');
}
assert.equal(new Set(bookData.map(book=>book.id)).size,bookData.length,'Duplicate catalog IDs');
console.log('PASS: cabinet 22 includes 268 catalog records representing 366 copies');
