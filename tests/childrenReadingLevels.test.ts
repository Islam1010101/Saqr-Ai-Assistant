import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bookData} from '../api/bookData.ts';
import {classifyBookAudience} from '../api/bookAudience.ts';
import {
 childReadingReferenceEntries,
 childReadingReferenceCount,
 getChildReadingReference,
 readingTierLabel
} from '../src/utils/childrenReadingReferences.ts';

assert.equal(childReadingReferenceCount,13,'The reviewer has thirteen source-backed title candidates, not local-copy approvals');
assert.equal(new Set(childReadingReferenceEntries.map(r=>r.shelf+'|'+r.title.toLowerCase()+'|'+r.author.toLowerCase())).size,13,
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
assert.deepEqual(byTier,{beginner:4,intermediate:7,advanced:2});
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
assert.ok(!source.includes('readingReferenceDisclaimer') &&
 !source.includes("readingReference.sourceUrl") &&
 !source.includes('readingTierLabel(readingReference.tier') &&
 !source.includes('readingReferenceEvidence'),
 'Book cards and detail popups no longer display any provisional reading-level copy');
const adminSource=readFileSync('src/components/AdminChildrenReadingReview.tsx','utf8');
assert.ok(adminSource.includes('entry.sourceUrl') &&
 adminSource.includes('entry.sourceLevel') &&
 adminSource.includes('sourceAvailable'),
 'Only admin review retains provisional sources and proof of edition uncertainty');
console.log('PASS: 13 provisional title references, 4/7/2 source tiers, preserved filter and admin-only review evidence');
