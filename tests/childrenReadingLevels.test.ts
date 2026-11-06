import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bookData} from '../api/bookData.ts';
import {classifyBookAudience} from '../api/bookAudience.ts';
import {
 childReadingReferenceEntries,
 childReadingReferenceCount,
 getChildReadingReference,
 readingTierLabel
} from '../api/childrenReadingReferences.ts';

assert.equal(childReadingReferenceCount,10,'The pilot contains exactly ten evidence-matched titles');
assert.equal(new Set(childReadingReferenceEntries.map(r=>r.shelf+'|'+r.title.toLowerCase()+'|'+r.author.toLowerCase())).size,10,
 'The review cannot create duplicate title/author/shelf entries');
const byTier={beginner:0,intermediate:0,advanced:0};
for(const evidence of childReadingReferenceEntries){
 assert.equal(evidence.status,'reference_only','Never claim the school edition has been checked');
 assert.equal(evidence.editionMatched,false,'School edition requires manual inspection');
 assert.equal(evidence.shelf,30,'Pilot covers the identified children-oriented shelf 30 titles');
 assert.ok(evidence.sourceUrl.startsWith('https://'),'Every reading tier needs a clickable reference');
 assert.ok(evidence.publisherLevel.length>8 && evidence.noteAr.length>30 && evidence.noteEn.length>30);
 const matches=bookData.filter(b=>b.shelf===evidence.shelf && getChildReadingReference(b)===evidence);
 assert.ok(matches.length>0,'Reviewed entry is absent from the actual EFIPS catalog: '+evidence.title);
 assert.ok(matches.every(b=>classifyBookAudience(b)==='children'),'Reviewed child book should appear in the children filter');
 for(const match of matches){
  assert.equal(match.title,evidence.title,'Keep catalog title unchanged');
  assert.equal(match.author,evidence.author,'Keep catalog author unchanged');
 }
 assert.ok(readingTierLabel(evidence.tier,'en').length>4 && readingTierLabel(evidence.tier,'ar').length>3);
 byTier[evidence.tier]++;
}
assert.deepEqual(byTier,{beginner:3,intermediate:5,advanced:2});
assert.equal(getChildReadingReference({title:'Lincoln',author:'Another writer',shelf:30}),undefined,
 'Do not match a common title with the wrong author');
assert.equal(getChildReadingReference({title:'Lincoln',author:'Russell Freedman',shelf:29}),undefined,
 'Do not silently copy a reference to a different shelf or edition');
assert.equal(getChildReadingReference({title:'Snow White and the Seven Dwarfs',author:'Walt Disney Company',shelf:22}),undefined,
 'The vast unreviewed Disney inventory must stay unclassified');
assert.equal(classifyBookAudience({title:'Snow White and the Seven Dwarfs',author:'Walt Disney Company',shelf:22,subject:'Fiction'}),'teens',
 'Preserve existing audience fallback for unreviewed records');
const source=readFileSync('pages/SearchPage.tsx','utf8');
assert.ok(source.includes('getChildReadingReference(b)?.tier === readingTierFilter') &&
 source.includes('value={readingTierFilter}') &&
 source.includes('onChange={e=>{setReadingTierFilter('),'The filter selects only evidence-matched tiers');
assert.ok(source.includes("readingReferenceDisclaimer") &&
 source.includes('edition has not yet been checked') &&
 source.includes("readingReference.sourceUrl"),
 'The detail view must warn about unverified editions and link to source');
assert.ok(source.includes('readingTierLabel(readingReference.tier'),
 'Book cards and detail view show only a reference-based band');
console.log('PASS: 10 provisional reading references, 3/5/2 tier pilot, source links, precise title matching and review warnings');
