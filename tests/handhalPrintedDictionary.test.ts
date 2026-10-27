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
assert.ok(!page.includes('nh-game-path'));
assert.ok(page.includes('disabled={!selectedCorrect} onClick={()=>selectEntry(index+1)}'));
assert.ok(page.includes('الرف 6، الصف 2'));
assert.ok(page.includes('printedDetectiveCases'));
assert.ok(!page.includes('noorlib.ir'));
assert.ok(!page.includes('dictionaryMeaning'));
assert.ok(page.includes('submitAnswer(originalIndex)'));
console.log('PASS verified photographed word bank, ten randomized progressive prompts, next-question lock and hidden sidebar');

const catalog=readFileSync('pages/SearchPage.tsx','utf8');
assert.ok(!catalog.includes('>فرز حسب<'));
assert.ok(!catalog.includes('>يحتاج مراجعة<'));
assert.ok(!catalog.includes('<option value="review">'));
assert.ok(!catalog.includes('<option value="teens">'));
assert.ok(catalog.includes('Grades 4–8'));
assert.ok(catalog.includes('Disney_wordmark.svg'));
assert.ok(catalog.includes('top-14 z-10 h-7 w-[70px]'));
assert.ok(!catalog.includes('bg-white/90 px-3 py-2'));
console.log('PASS simplified catalog controls and transparent Disney logo positioned above title');
