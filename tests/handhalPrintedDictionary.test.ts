import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dictionaryTasks,newDictionaryRound,handhalDictionary} from '../src/utils/heritageSourceFirst.ts';
import {handhalEntries} from '../src/utils/handhalScannedEntries.ts';
assert.ok(handhalEntries.length>=30);
assert.equal(dictionaryTasks.length,handhalEntries.length);
assert.equal(new Set(dictionaryTasks.map(x=>x.word)).size,dictionaryTasks.length);
assert.equal(handhalDictionary.shelf,6);assert.equal(handhalDictionary.row,2);
for(const question of dictionaryTasks){
 assert.equal(question.options.length,3);assert.ok(question.correct>=0&&question.correct<=2);
 assert.ok(question.options[question.correct].ar.includes(handhalEntries.find(e=>e.word===question.word)?.meaning||'INVALID'));
 assert.ok(/[\u064B-\u065F]/.test(question.word),'unvocalized '+question.word);
 assert.ok(question.sourcePdfPage>0);
}
for(let i=0;i<20;i++){
 const round=newDictionaryRound();
 assert.equal(round.length,10);
 assert.equal(new Set(round.map(x=>x.word)).size,10);
 assert.ok(round.every((q,j)=>j===0||round[j-1].difficulty<=q.difficulty));
}
const page=readFileSync('pages/NationalIdentityPage.tsx','utf8');
assert.ok(page.includes('newDictionaryRound()'));
assert.ok(page.includes("mode!=='language' && <aside"));
assert.ok(page.includes("mode==='language'&&!selectedCorrect"));
assert.ok(page.includes("l('الرف 6','Shelf 6')"));
assert.ok(page.includes("l('الصف 2','Row 2')"));
assert.ok(!page.includes('noorlib.ir'));
assert.ok(!page.includes('dictionaryMeaning'));
assert.ok(page.includes('submitAnswer(originalIndex)'));
console.log('PASS verified photographed word bank, ten randomized progressive prompts, next-question lock and hidden sidebar');
