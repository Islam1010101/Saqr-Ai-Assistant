import assert from 'node:assert/strict';
import {resolveSaqrBookFollowUp,saqrNaturalDialogueInstructions} from '../src/utils/saqrNaturalDialogue.ts';

const hist=(...messages:string[])=>messages.map(content=>({role:'user',content}));
const simple=resolveSaqrBookFollowUp('طب حاجة أسهل؟',hist('رشحلي كتاب عن الفضاء'));
assert.equal(simple.continued,true);
assert.match(simple.searchQuery,/الفضاء/);
assert.match(simple.searchQuery,/أسهل/);
const english=resolveSaqrBookFollowUp('Can you suggest an easier one?',hist('Recommend a book about space'));
assert.equal(english.continued,true);
assert.match(english.searchQuery,/space/);
const location=resolveSaqrBookFollowUp('طب ده فين؟',hist('عايز كتاب عن التاريخ'));
assert.equal(location.continued,true);
assert.match(location.searchQuery,/التاريخ/);

for(const [question,history] of [
  ['رشحلي كتب عن التاريخ',hist('رشحلي كتاب عن الفضاء')],
  ['عايز تحضير درس عن الكسور',hist('رشحلي كتاب عن الفضاء')],
  ['طب حاجة أسهل؟',hist('جهزلي خطة درس عن الطاقة')],
  ['طب حاجة أسهل؟',hist('رشحلي كتاب عن الفضاء','طيب اشرحلي دورة الماء')],
  ['طب حاجة أسهل؟',hist('تحدي المؤلف الصغير','رشحلي كتاب عن الفضاء')],
] as const){
  const res=resolveSaqrBookFollowUp(question,history);
  assert.equal(res.continued,false,'Unrelated or protected turn must not inherit book context: '+question);
  assert.equal(res.searchQuery,question);
}
const dialogue=saqrNaturalDialogueInstructions({
  question:'مش فاهم الكسور',history:hist('ساعدني في الرياضيات'),
  role:'student',grade:5,locale:'ar',
  resolution:resolveSaqrBookFollowUp('مش فاهم الكسور',hist('ساعدني في الرياضيات'))
});
assert.match(dialogue,/TUTORING/);
assert.match(dialogue,/grade 5/);
assert.match(dialogue,/one small diagnostic question/);
assert.match(dialogue,/UAE Emirati dialect/);
assert.match(dialogue,/formal Modern Standard Arabic/);
const educator=saqrNaturalDialogueInstructions({
  question:'حضّر لي درس',history:[],role:'teacher',grade:null,locale:'ar',
  resolution:resolveSaqrBookFollowUp('حضّر لي درس',[])
});
assert.match(educator,/do not claim a Word or PowerPoint file exists/);
assert.equal(saqrNaturalDialogueInstructions({
  question:'نكمل قصتنا',history:hist('تحدي المؤلف الصغير'),
  role:'student',grade:4,locale:'ar',
  resolution:resolveSaqrBookFollowUp('نكمل قصتنا',hist('تحدي المؤلف الصغير'))
}),'','Little Author flow must not inherit general chat instructions');
console.log('PASS Saqr Brain 2.0: contextual short turns, new-topic isolation, grade-aware tutoring, strict story protection.');
