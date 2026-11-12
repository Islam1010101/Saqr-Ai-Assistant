import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { searchSaqrBookCatalog } from '../src/utils/saqrCatalogSearch.ts';

const BATCH_IDS=Array.from({length:15},(_,i)=>'b'+String(i+1).padStart(2,'0'));
const allPages:Record<string,ReadonlyArray<{page:number;fileId:string}>>={};
for(const batch of BATCH_IDS){
 const loaded=await import('../src/data/englishPhotoPages/'+batch+'.ts');
 Object.assign(allPages,loaded.default);
}
const records=ENGLISH_LIBRARY_DATABASE;
assert.equal(records.length,71,'The current Drive contains 71 fully numbered EFIPS reading entries');
assert.equal(new Set(records.map(x=>String(x.id))).size,71,'Book IDs must be unique');
assert.ok(records.every(x=>/^(?:EN_PH_|EN_DRIVE_)/.test(String(x.id))),'Only current English photo IDs, never retired PDFs');
assert.equal(new Set(records.map(x=>x.driveLink)).size,71,'Each image edition needs its own current folder');
assert.equal(Object.keys(allPages).length,71,'A manifest must exist for every indexed title');
let totalPages=0;
for(const book of records){
 assert.ok(book.photoBatch&&BATCH_IDS.includes(book.photoBatch),'Missing lazy reader batch for '+book.title);
 assert.ok(book.id&&book.title&&book.author&&book.bio&&book.summary&&book.subject,'Missing book metadata for '+book.title);
 assert.ok(book.summary.length>=55&&!/Illustrated photo-page edition/i.test(book.summary),'Generic summary remains for '+book.title);
 assert.ok(book.bio.length>=35&&!/details are being reviewed/i.test(book.bio),'Generic author bio remains for '+book.title);
 assert.ok(/^https:\/\/drive\.google\.com\/drive\/folders\/[A-Za-z0-9_-]+$/.test(book.driveLink),'Not a current Drive folder '+book.title);
 assert.equal(book.requiresSchoolGoogleAccess,true,'Keep current school-only reader behavior');
 const p=allPages[String(book.id)];
 assert.ok(p?.length,'Missing image page manifest for '+book.title);
 assert.equal(p.length,book.pageCount,'Page-count mismatch for '+book.title);
 for(let i=0;i<p.length;i++){
  assert.equal(p[i].page,i+1,'Missing or duplicate page number in '+book.title);
  assert.match(p[i].fileId,/^[A-Za-z0-9_-]+$/,'Invalid Drive image ID in '+book.title);
 }
 totalPages+=p.length;
}
assert.equal(totalPages,14514,'Current photo Drive library page count');
for(const excluded of ['Dog Man: Sneak Peek at New Movie','Murdle','The Sherlock Holmes Puzzle Collection']){
 assert.ok(!records.some(x=>x.title===excluded),'Do not label incomplete book samples as complete books: '+excluded);
}
for(const title of ['Knowledge Encyclopedia','The Magical Yet','Deep Work: Rules for Focused Success in a Distracted World','Diary of a Wimpy Kid: The Meltdown']){
 const result=searchSaqrBookCatalog('books '+title,{physical:[],arabic:[],english:records});
 assert.ok(result.some(x=>x.title===title),'Saqr shared catalogue could not find '+title);
}
const reader=readFileSync(new URL('../src/components/EnglishPhotoBookReader.tsx',import.meta.url),'utf8');
assert.ok(BATCH_IDS.every(batch=>reader.includes('englishPhotoPages/'+batch)),'Glass reader must support every photo batch');
console.log('PASS: 71 current Drive books, 14,514 sequential images, title-specific metadata, reader mappings and shared Saqr catalogue');
