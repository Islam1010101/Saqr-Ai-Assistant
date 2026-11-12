import assert from 'node:assert/strict';
import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { NATIONAL_IDENTITY_DIGITAL_BOOKS } from '../api/nationalIdentityDigitalBooks.ts';
import { DIGITAL_SERIES_VOLUMES } from '../src/data/digitalSeriesVolumes.js';
import { MAN_IMPOSSIBLE_20261112_CATALOG, MAN_IMPOSSIBLE_20261112_CHUNK_BY_ID } from '../src/data/manImpossible20261112Index.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_01 } from '../src/data/manImpossible20261112Pages01.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_02 } from '../src/data/manImpossible20261112Pages02.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_03 } from '../src/data/manImpossible20261112Pages03.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_04 } from '../src/data/manImpossible20261112Pages04.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_05 } from '../src/data/manImpossible20261112Pages05.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_06 } from '../src/data/manImpossible20261112Pages06.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_07 } from '../src/data/manImpossible20261112Pages07.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_08 } from '../src/data/manImpossible20261112Pages08.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_09 } from '../src/data/manImpossible20261112Pages09.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_10 } from '../src/data/manImpossible20261112Pages10.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_11 } from '../src/data/manImpossible20261112Pages11.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_12 } from '../src/data/manImpossible20261112Pages12.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_13 } from '../src/data/manImpossible20261112Pages13.ts';
import { MAN_IMPOSSIBLE_20261112_PAGES_14 } from '../src/data/manImpossible20261112Pages14.ts';

const allPages: Record<string, ReadonlyArray<{page:number;fileId:string}>>=Object.assign({},MAN_IMPOSSIBLE_20261112_PAGES_01,MAN_IMPOSSIBLE_20261112_PAGES_02,MAN_IMPOSSIBLE_20261112_PAGES_03,MAN_IMPOSSIBLE_20261112_PAGES_04,MAN_IMPOSSIBLE_20261112_PAGES_05,MAN_IMPOSSIBLE_20261112_PAGES_06,MAN_IMPOSSIBLE_20261112_PAGES_07,MAN_IMPOSSIBLE_20261112_PAGES_08,MAN_IMPOSSIBLE_20261112_PAGES_09,MAN_IMPOSSIBLE_20261112_PAGES_10,MAN_IMPOSSIBLE_20261112_PAGES_11,MAN_IMPOSSIBLE_20261112_PAGES_12,MAN_IMPOSSIBLE_20261112_PAGES_13,MAN_IMPOSSIBLE_20261112_PAGES_14);
const books=MAN_IMPOSSIBLE_20261112_CATALOG;
const byId=new Map(ARABIC_LIBRARY_DATABASE.map(book=>[String(book.id),book]));
assert.equal(books.length,167,'Only complete, distinct refresh editions should be published');
assert.equal(Object.keys(allPages).length,168,'Includes one strictly verified but duplicated source folder');
assert.equal(new Set(books.map(book=>book.title.normalize('NFKC').replace(/\s+/g,' ').trim().toLocaleLowerCase('ar'))).size,books.length);
assert.equal(Object.keys(MAN_IMPOSSIBLE_20261112_CHUNK_BY_ID).length,books.length);
let totalPages=0;
for(const book of books){
  assert.ok(book.id.startsWith('AR_RM_20261112_'));
  assert.equal(byId.get(book.id)?.driveLink,book.driveLink,'Book missing from the shared Saqr catalog');
  assert.match(book.driveLink,/^https:\/\/drive\.google\.com\/drive\/folders\/[\w-]+$/);
  const pages=allPages[book.id];
  assert.ok(pages?.length>1);
  assert.equal(pages.length,book.pageCount);
  assert.equal(new Set(pages.map(item=>item.fileId)).size,pages.length);
  for(let i=0;i<pages.length;i++){
    assert.equal(pages[i].page,i+1,'Missing page for '+book.title);
    assert.match(pages[i].fileId,/^[\w-]+$/);
  }
  totalPages+=pages.length;
}
assert.equal(totalPages,13216,'Complete, deduplicated Drive photo pages');
for(const book of ARABIC_LIBRARY_DATABASE){
  assert.ok(!String(book.id).startsWith('AR_18-'),'Old PDF Man of Impossible volume still present');
  assert.ok(!String(book.id).startsWith('AR_IM_20261111_'),'Old extra photo edition still present');
  assert.notEqual(String(book.id),'AR_18','Old Man of Impossible series parent remains');
}
assert.equal(DIGITAL_SERIES_VOLUMES.AR_18.length,160,'Legacy source is not destructively modified');
assert.equal(ARABIC_LIBRARY_DATABASE.length,502,'Other Arabic library holdings must remain unchanged');
assert.equal(ENGLISH_LIBRARY_DATABASE.length,71);
assert.equal(NATIONAL_IDENTITY_DIGITAL_BOOKS.length,9);
console.log('PASS: 167 unique complete Man of the Impossible Drive photo editions, 13,216 pages, original series removed; reader manifests intact');
