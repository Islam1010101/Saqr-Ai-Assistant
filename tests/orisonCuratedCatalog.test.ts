import assert from 'node:assert/strict';
import {bookData} from '../api/bookData.ts';
import {orisonCuratedRecords} from '../api/orisonCurated20261109.ts';

const titleKey=(s:string)=>s.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
const imported=bookData.filter(book=>book.id.startsWith('orison-20261109-'));
const old=bookData.filter(book=>!book.id.startsWith('orison-20261109-'));
const oldTitles=new Set(old.map(book=>titleKey(book.title)));
const allBarcodes=orisonCuratedRecords.flatMap(source=>source.barcodes);

assert.equal(orisonCuratedRecords.length,56,'The reviewed Orison file should contain 56 ISBN-edition records');
assert.equal(allBarcodes.length,68,'The selected batch should represent 68 barcoded copies');
assert.equal(new Set(allBarcodes).size,allBarcodes.length,'No repeated accession barcodes');
assert.ok(orisonCuratedRecords.every(r=>r.isbn&&r.title&&r.author&&r.barcodes.length>0));
assert.ok(orisonCuratedRecords.every(r=>[22,23,24,26].includes(r.shelf)));
assert.equal(new Set(bookData.map(book=>book.id)).size,bookData.length,'Preserve all existing IDs and unique new IDs');
assert.ok(imported.every(book=>!oldTitles.has(titleKey(book.title))),'Do not duplicate an existing title');
assert.equal(new Set(imported.map(book=>titleKey(book.title))).size,imported.length,'Do not duplicate imported titles');
for(const book of imported){
  const matching=orisonCuratedRecords.filter(row=>titleKey(row.title)===titleKey(book.title));
  assert.ok(matching.length,'Every added catalog book must have an Orison source record: '+book.title);
  assert.ok(matching.some(r=>r.shelf===book.shelf),'Shelf must follow the school category map: '+book.title);
  assert.equal(book.copies,new Set(matching.flatMap(r=>r.barcodes)).size,'Preserve barcode-derived copy count');
  assert.equal(book.isbnStatus,'candidate','Unverified edition ISBN must never be presented as verified');
}
console.log('PASS: Curated Orison candidate records '+orisonCuratedRecords.length+
  '; barcoded copies '+allBarcodes.length+'; additive catalog titles '+imported.length);
