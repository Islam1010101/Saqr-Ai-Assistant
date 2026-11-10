import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { NEW_ENGLISH_DIGITAL_BOOKS_20261109 } from '../src/data/newEnglishDigitalBooks20261109.ts';
import { searchSaqrBookCatalog } from '../src/utils/saqrCatalogSearch.ts';

const normalize=(s:string)=>String(s).normalize('NFKC').toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu,'');
const added=ENGLISH_LIBRARY_DATABASE.filter(b=>/^EN_NEW_20261109_(?:0[1-9]|1[0-4])$/.test(String(b.id)));
const earlier=ENGLISH_LIBRARY_DATABASE.filter(b=>!String(b.id).startsWith('EN_NEW_20261109_'));

assert.equal(NEW_ENGLISH_DIGITAL_BOOKS_20261109.length,14);
assert.equal(added.length,14,'Every selected English book must be added once');
assert.equal(earlier.length,54,'Preserve the original English catalogue and expanded series');
assert.equal(ARABIC_LIBRARY_DATABASE.length,498,'Keep established Arabic records and include six verified titles');
assert.equal(new Set(ENGLISH_LIBRARY_DATABASE.map(b=>String(b.id))).size,ENGLISH_LIBRARY_DATABASE.length);
assert.equal(new Set(added.map(b=>normalize(b.title))).size,added.length);
assert.equal(new Set(added.map(b=>b.driveLink)).size,added.length);
assert.ok(added.every(b=>b.title&&b.author&&b.bio&&b.summary&&b.subject&&b.readingAudience),
  'Each new title must have complete author, topic, summary and editorial age recommendation');
assert.ok(added.every(b=>b.requiresSchoolGoogleAccess===true),
  'School-only PDFs must never be mistaken for publicly embeddable PDFs');
assert.ok(added.every(b=>/^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view$/.test(b.driveLink)));
const earlierTitles=new Set(earlier.map(b=>normalize(b.title)));
const earlierLinks=new Set(earlier.map(b=>b.driveLink));
assert.ok(added.every(b=>!earlierTitles.has(normalize(b.title))&&!earlierLinks.has(b.driveLink)),
  'Do not overwrite or duplicate an earlier English holding');
const page=readFileSync(new URL('../pages/EnglishLibraryInternalPage.tsx', import.meta.url),'utf8');
assert.ok(page.includes('schoolOnly={Boolean(book.requiresSchoolGoogleAccess)}'),
  'School-only books must open inside the EFIPS digital reader');
assert.ok(!page.includes('book.requiresSchoolGoogleAccess ? (<a'),
  'A separate Drive tab must not be the primary school-only reading action');
const reader=readFileSync(new URL('../src/components/DigitalBookReader.tsx', import.meta.url),'utf8');
assert.ok(reader.includes('(!schoolOnly || !!schoolAccess) && <div className="efips-reader-native"'),
  'School-only PDFs must never go through the anonymous byte-range PDF.js proxy');
assert.ok(reader.includes('src={preview} loading="eager"'),
  'School-only PDF preview must be embedded inside the existing reader');
for(const title of [
  'Knowledge Encyclopedia','Dog Man: Big Jim Believes',
  'Hamlet: The Manga Edition','Gravity Falls: Lost Legends'
]){
 const match=added.find(b=>b.title===title);
 assert.ok(match,'Missing verified new title '+title);
 const q=title==='Knowledge Encyclopedia'?'books Knowledge Encyclopedia':'books '+title;
 const results=searchSaqrBookCatalog(q,{
   physical:[],arabic:[],english:ENGLISH_LIBRARY_DATABASE
 });
 assert.ok(results.some(b=>b.title===title&&b.driveLink===match.driveLink),
   'Saqr must find correct new title and school Drive link '+title);
}
console.log('PASS: 14 curated school-domain English PDFs, 54 previous titles retained, zero duplicate IDs/links, Saqr referrals and embedded school reader');
