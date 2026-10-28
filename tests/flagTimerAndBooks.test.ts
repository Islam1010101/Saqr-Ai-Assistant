import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bookData} from '../api/bookData.ts';
import {uploadedLibraryBooks} from '../api/uploadedCatalog20261028.ts';
assert.equal(uploadedLibraryBooks.length,6);
const normalize=(s:string)=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
for(const item of uploadedLibraryBooks){
  assert.equal(item.isbn.length,13);
  const sum=[...item.isbn.slice(0,12)].reduce((v,x,i)=>v+Number(x)*(i%2?3:1),0);
  assert.equal((10-sum%10)%10,Number(item.isbn[12]),'ISBN check digit mismatch');
  const found=bookData.find(b=>b.shelf===item.shelf&&b.row===item.row&&normalize(b.title)===normalize(item.title));
  assert.ok(found,'Not in physical library catalog: '+item.title);
  assert.equal(found.author,item.author);
  assert.equal(found.isbn,item.isbn);
  assert.equal(found.language,'AR');
}
assert.equal(new Set(bookData.map(b=>b.id)).size,bookData.length);
const flag=readFileSync('pages/FlagDayChallenge.tsx','utf8');
for(const required of ['const ANSWER_SECONDS = 5;','deadlineRef.current=performance.now()+ANSWER_SECONDS*1000','if(performance.now()>=deadlineRef.current)handleOptionSelect(null)','answerLockedRef.current=true',"setLastResult(finalIndex===null?'timeout':'wrong')",'setFlagLevel(previous=>Math.max(0,previous-1))','setQuestionTurn(v=>v+1)','role="timer"'])assert.ok(flag.includes(required),'Missing flag timeout guard: '+required);
console.log('PASS: six physical catalog additions, valid candidate ISBN digits, unique IDs and 5-second flag timer');
