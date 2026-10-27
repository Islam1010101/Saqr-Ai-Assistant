import assert from 'node:assert/strict';
import {verifiedPassport} from '../src/utils/verifiedPassportEvidence.ts';
import {verifiedDetective} from '../src/utils/verifiedDetectiveEvidence.ts';
assert.equal(verifiedPassport.length,7);
assert.equal(verifiedDetective.length,25);
const sources=new Set();
for(const record of verifiedPassport){
 assert.equal(record.questions.length,4);
 for(const q of record.questions){
  for(const lang of ['ar','en'] as const){
   assert.ok(record.story[lang].toLowerCase().includes(q.evidence[lang].toLowerCase()),'Passport not article-grounded: '+record.id+' '+q.id+' '+lang);
   assert.equal(q.choices.length,3);
   assert.ok(q.choices[q.correct][lang].length>1);
  }
  assert.equal(q.source,record.source);
  assert.ok(q.source.startsWith('https://'));
  sources.add(q.source);
 }
}
for(const card of verifiedDetective){
 for(const lang of ['ar','en'] as const){
  assert.ok(card.story[lang].toLowerCase().includes(card.evidence[lang].toLowerCase()),'Detective not article-grounded: '+card.id+' '+lang);
  assert.ok(card.choices[card.correct][lang]);
 }
 assert.ok(card.source.startsWith('https://'));
 sources.add(card.source);
}
assert.ok(sources.size>=9);
assert.deepEqual([...new Set(verifiedDetective.map(x=>x.difficulty))].sort(),[1,2,3,4]);
const fs=await import('node:fs');const page=fs.readFileSync('pages/NationalIdentityPage.tsx','utf8');
assert.ok(page.includes('verifiedPassport.map('));assert.ok(page.includes('verifiedDetective.map('));
assert.ok(page.includes("storageKey = useMemo"));
assert.ok(page.includes("setFlagChallengeOpen(true)"));
assert.ok(page.includes("mode==='language'"));
console.log('PASS evidence anchored bilingually: 28 passport questions, 25 detective cases; progress/game guards remain');
