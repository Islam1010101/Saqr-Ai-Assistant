import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 SAQR_TEACHER_LESSON_PARTS,startSaqrTeacherLesson,
 isSaqrLessonContinueConsent,isSaqrLessonPrintConsent,
 readSaqrTeacherLessonPart,advanceSaqrTeacherLesson,
 saqrTeacherLessonPartInstructions,saqrTeacherLessonContinueQuestion,
 saqrTeacherLessonPrintQuestion
} from '../src/utils/saqrTeacherLessonContinuation.ts';

assert.equal(SAQR_TEACHER_LESSON_PARTS.length,6);
assert.equal(isSaqrLessonContinueConsent('أكمل التحضير'),true);
assert.equal(isSaqrLessonContinueConsent('نعم'),true);
assert.equal(isSaqrLessonContinueConsent('Continue'),true);
assert.equal(isSaqrLessonContinueConsent('اكتب قصة عن المكتبة'),false);
assert.equal(isSaqrLessonPrintConsent('نعم'),true);
assert.equal(isSaqrLessonPrintConsent('اطبعهولي'),true);
assert.equal(isSaqrLessonPrintConsent('لا'),false);
assert.equal(isSaqrLessonPrintConsent('تحضير درس جديد'),false);
assert.equal(readSaqrTeacherLessonPart('مقدمة لم تكتمل').finished,false);
assert.equal(readSaqrTeacherLessonPart('قصير [[SAQR_LESSON_PART_DONE]]').finished,false,
 'Marker plus tiny content does not prove completion');
const sample='## أهداف الدرس\n- أن يحدد المتعلم جوانب الموضوع من أمثلة دقيقة وواضحة.\n- أن يشرح الأهداف وفق مستويات بلوم مع تطبيقات متعددة.';
const finished=readSaqrTeacherLessonPart(sample+'\n[[SAQR_LESSON_PART_DONE]]');
assert.ok(finished.finished);
assert.ok(!finished.content.includes('SAQR_LESSON_PART_DONE'));
let plan=startSaqrTeacherLesson('تحضير درس عن استدامة المياه للصف السادس');
assert.ok(saqrTeacherLessonPartInstructions(plan,'ar').includes('استدامة المياه'));
const interrupted=advanceSaqrTeacherLesson(plan,
 readSaqrTeacherLessonPart('## أهداف الدرس\nبدأنا بالأهداف ومخرجات التعلم ولم نكمل بعد'));
assert.equal(interrupted.stage,0);
assert.equal(interrupted.attempts,1);
assert.ok(saqrTeacherLessonPartInstructions(interrupted,'ar').includes('Continue exactly where it stopped'));
for(let i=0;i<SAQR_TEACHER_LESSON_PARTS.length;i++){
 plan=advanceSaqrTeacherLesson(plan,finished);
 assert.equal(plan.stage,i+1);
 assert.equal(plan.done,i===SAQR_TEACHER_LESSON_PARTS.length-1,
  'Print must not be offered before all six parts finish');
}
assert.equal(plan.parts.length,6);
assert.ok(saqrTeacherLessonContinueQuestion('ar').includes('أكمل'));
assert.ok(saqrTeacherLessonPrintQuestion('ar').includes('الطباعة'));
const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes('lessonPart: Boolean(activeTeacherLesson)'));
assert.ok(page.includes('const teacherPartContext = activeTeacherLesson'));
assert.ok(page.includes('readSaqrTeacherLessonPart(reply)'));
assert.ok(page.includes('advanceSaqrTeacherLesson(activeTeacherLesson,part)'));
assert.ok(page.includes('isSaqrLessonPrintConsent(userQuery)'));
assert.ok(page.includes('window.print()'));
assert.ok(page.includes('teacherLesson.parts.join('));
assert.ok(page.includes('SAQR_TEACHER_LESSON_PARTS.length'));
assert.ok(page.includes('const librarySearchIntent = !activeTeacherLesson'));
assert.ok(page.includes('ACTIVE LITTLE AUTHOR CHALLENGE: NO catalogue searches'));
assert.ok(page.includes('className="saqr-certificate-host"'));
const api=readFileSync('api/chat.ts','utf8');
assert.ok(api.includes('lessonPart === true ? 900 : 500'));
assert.ok(api.includes('max_completion_tokens: responseTokenLimit'));
assert.ok(api.includes('max_tokens: responseTokenLimit'));
assert.ok(api.includes('const providers: Provider[]'));
console.log('PASS: six-part teacher lesson continues until completion then offers printable A4 document; other modes isolated');
