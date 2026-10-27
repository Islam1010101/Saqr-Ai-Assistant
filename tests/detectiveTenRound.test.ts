import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newDetectiveRound,DETECTIVE_ROUND_SIZE} from '../src/utils/detectiveRound.ts';
import {verifiedDetective} from '../src/utils/verifiedDetectiveEvidence.ts';
import {verifiedHeritageBookQuestions} from '../src/utils/verifiedHeritageBookQuestions.ts';
const bank=[...verifiedDetective,...verifiedHeritageBookQuestions];
assert.equal(bank.length,36);
assert.equal(DETECTIVE_ROUND_SIZE,10);
const seen=new Set<string>();
for(let n=0;n<100;n++){
 const round=newDetectiveRound(bank);
 assert.equal(round.length,10);
 assert.equal(new Set(round.map(q=>q.id)).size,10);
 assert.ok(round.every((q,i)=>i===0||(round[i-1].difficulty||1)<=(q.difficulty||1)));
 assert.ok(round.every(q=>bank.some(x=>x.id===q.id)));
 seen.add(round.map(x=>x.id).join('|'));
}
assert.ok(seen.size>1,'rounds should vary');
const page=readFileSync('pages/NationalIdentityPage.tsx','utf8');
assert.ok(page.includes('return newDetectiveRound(source)'));
assert.ok(page.includes('total:DETECTIVE_ROUND_SIZE'));
assert.ok(page.includes('progress.cases.includes(x.id)'));
assert.ok(page.includes('setRound(n=>n+1)'));
console.log('PASS detective: 10 unique randomized questions per round, progression, replay and unchanged bank');
