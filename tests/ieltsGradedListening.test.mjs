import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read=path=>readFileSync(path,'utf8');
const src=read('src/data/ieltsListeningExpanded.ts');
const marker='export const IELTS_LISTENING_EXTRA: readonly IeltsGradedListeningLesson[] = ';
const end=';\n\nexport const IELTS_GRADED_LISTENING_LESSONS';
const offset=src.indexOf(marker),last=src.indexOf(end,offset);
assert.ok(offset>=0&&last>offset,'Extra VOA data must remain a standalone reviewable JSON collection');
const extra=JSON.parse(src.slice(offset+marker.length,last));
const oldSrc=read('src/data/ieltsListeningLessons.ts');
const oldMarker='export const IELTS_LISTENING_LESSONS: readonly IeltsListeningLesson[] = ';
const old=JSON.parse(oldSrc.slice(oldSrc.indexOf(oldMarker)+oldMarker.length).trim().replace(/;$/,''));
const player=read('src/components/IeltsListeningPractice.tsx');
const grading=read('src/utils/ieltsListeningGrading.ts');
const review=read('src/utils/ieltsListeningReview.ts');
const chat=read('pages/SmartSearchPage.tsx');

test('10 newly sourced VOA MP3 conversations extend 4 original lessons without replacing any',()=>{
  assert.equal(extra.length,10);
  assert.equal(old.length,4);
  assert.equal(extra.length+old.length,14);
  const all=[...old,...extra];
  assert.equal(new Set(all.map(item=>item.id)).size,14,'No overwritten original VOA lessons');
  assert.equal(new Set(all.map(item=>item.audioUrl)).size,14,'No duplicate MP3 links');
  assert.equal(all.reduce((n,item)=>n+item.questions.length,0),52,'52 questions in total');
  for(const item of extra){
    assert.match(item.sourceUrl,/^https:\/\/learningenglish\.voanews\.com\/a\//);
    assert.match(item.audioUrl,/^https:\/\/voa-audio\.voanews\.eu\/vle\/\d{4}\/\d{2}\/\d{2}\/[\da-f-]{36}_hq\.mp3$/i);
    assert.ok(item.transcript.length>=200, 'Every source excerpt has substantial grounded text');
    assert.equal(item.transcriptKind,'excerpt','Never advertise abridged source material as a full transcript');
    assert.equal(item.questions.length,4);
    assert.ok([1,2,3,4].includes(item.stage));
    assert.ok(item.contextAr.length>8&&item.contextEn.length>8);
    for(const question of item.questions){
      assert.ok(question.prompt.length>16 && question.explanation.length>20);
      if(question.kind){
        assert.ok(['note-completion','table-completion','short-answer'].includes(question.kind));
        assert.equal(question.options.length,0);
        assert.equal(question.correctIndex,-1);
        assert.ok(question.answerText.length>0);
      }else{
        assert.ok(question.options.length>=3);
        assert.ok(question.correctIndex>=0&&question.correctIndex<question.options.length);
      }
    }
  }
  assert.deepEqual([...new Set(extra.map(x=>x.stage))],[1,2,3,4]);
  assert.equal(extra.filter(x=>x.questions.some(q=>q.kind==='note-completion')).length>3,true);
  assert.equal(extra.filter(x=>x.questions.some(q=>q.kind==='table-completion')).length>1,true);
});

test('Stage selector and official IELTS links are additive and clearly distinguish original work',()=>{
  assert.match(src,/IELTS_LISTENING_LESSONS\.map\(\(lesson,index\)=>\(\{\.\.\.lesson,\.\.\.originalStages\[index\]\}\)\)/);
  assert.match(src,/\.sort\(\(a,b\)=>a\.stage-b\.stage\)/);
  assert.match(player,/IELTS_GRADED_LISTENING_LESSONS\.filter\(item => item\.stage === stage\)/);
  assert.match(player,/\(\[1,2,3,4\] as const\)\.map\(level => \(/);
  assert.match(player,/isListeningCompletion\(current\)/);
  assert.match(player,/onChange=\{event => chooseAnswer\(event\.target\.value\)\}/);
  assert.match(player,/isListeningAnswerCorrect\(question, answers\[index\]\)/);
  assert.match(player,/ielts\.org\/take-a-test\/preparation-resources\/sample-test-questions\/academic-test/);
  assert.match(player,/takeielts\.britishcouncil\.org\/prepare\/ielts-free-practice-mock-tests\/academic\/listening/);
  assert.match(player,/not copied official IELTS tests/);
  assert.match(player,/These are Saqr learning stages, not official IELTS test parts or band predictions/);
  assert.match(player,/revealTranscript &&/);
  assert.match(player,/src=\{lesson.audioUrl\}/);
  assert.match(player,/href=\{lesson.sourceUrl\}/);
  assert.doesNotMatch(player,/fetch\(|supabase|MediaRecorder|SpeechRecognition/);
  assert.doesNotMatch(src,/ielts\.inspera\.com|ielts\.org\/cdn\/|takeielts\.britishcouncil\.org\/sites\/default\/files\//);
});

test('Only IELTS listening feedback functions changed, original Saqr intelligence remains stable',()=>{
  assert.match(review,/listeningAnswerSummary\(q,answers\[i\]\)/);
  assert.match(review,/Source and attribution: VOA Learning English/);
  assert.match(review,/Do NOT give an IELTS band score/);
  assert.match(grading,/normaliseListeningAnswer/);
  assert.match(grading,/acceptedAnswers/);
  assert.match(grading,/question\.correctIndex/);
  assert.match(grading,/question\.answerText/);
  assert.match(chat,/const practicePrompt = listeningPrompt \|\| ieltsSaqrPracticeRequest\(skill, locale\);/);
  assert.match(chat,/void handleSendMessage\(practicePrompt\);/);
  assert.doesNotMatch(grading,/supabase|fetch\(|localStorage|provider_token|api\/chat/);
});
