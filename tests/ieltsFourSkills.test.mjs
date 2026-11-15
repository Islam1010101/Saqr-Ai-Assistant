import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(path,'utf8');
const ex=read('src/utils/ieltsExamPractice.ts');
const ui=read('src/components/IeltsReadingWritingPractice.tsx');
const entry=read('src/components/IeltsSaqrEntry.tsx');
const center=read('pages/IeltsPreparationCenterPage.tsx');
const chat=read('pages/SmartSearchPage.tsx');
const listening=read('src/data/ieltsListeningLessons.ts');
const runner=read('src/components/IeltsListeningPractice.tsx');

test('Official materials are external accredited IELTS references, never copied exam questions',()=>{
  assert.match(ex,/IELTS_OFFICIAL_SAMPLE_LINKS/);
  for(const id of ['listening','academic-reading','general-reading','academic-writing','general-writing','writing-criteria'])
    assert.match(ex,new RegExp("id:'"+id+"'"),'Missing official sample '+id);
  assert.match(ex,/https:\/\/www\.ielts\.org\/take-a-test\/preparation-resources\/sample-test-questions\/academic-test/);
  assert.match(ex,/https:\/\/www\.ielts\.org\/take-a-test\/preparation-resources\/sample-test-questions\/general-training-test/);
  assert.match(ex,/https:\/\/ielts\.org\/take-a-test\/preparation-resources\/writing-test-resources/);
  assert.match(center,/IELTS_OFFICIAL_SAMPLE_LINKS\.map/);
  assert.match(center,/target="_blank" rel="noopener noreferrer"/);
  assert.match(center,/نموذج.+IELTS|النماذج الأصلية من موقع IELTS/);
  assert.match(ex,/NOT AN OFFICIAL IELTS EXAM/);
  assert.match(ex,/DO NOT reproduce its copyrighted passages/);
  assert.match(ex,/never copy any official copyrighted sample question/);
});

test('Independent reading and writing model builder honours Academic, General, task types and written criteria',()=>{
  assert.match(ex,/export function ieltsReadingPracticeRequest/);
  assert.match(ex,/export function ieltsWritingPracticeRequest/);
  assert.match(ex,/Generate an entirely ORIGINAL informational/);
  assert.match(ex,/entirely ORIGINAL General Training everyday reading material/);
  assert.match(ex,/True\/False\/Not Given/);
  assert.match(ex,/matching headings/);
  assert.match(ex,/Do NOT reveal the answer key until the student responds/);
  assert.match(ex,/Task 1 with a self-contained small numeric data TABLE/);
  assert.match(ex,/ORIGINAL General Training Task 1 letter-writing situation/);
  assert.match(ex,/ORIGINAL Writing Task 2 essay prompt/);
  assert.match(ex,/at least 150 words/);
  assert.match(ex,/at least 250 words/);
  for(const criterion of ['Task Achievement/Task Response','Coherence and Cohesion','Lexical Resource','Grammatical Range and Accuracy'])
    assert.ok(ex.includes(criterion),'Missing original assessment criterion '+criterion);
  assert.match(ui,/setTrack/);
  assert.match(ui,/setStage/);
  assert.match(ui,/setTask/);
  assert.match(ui,/IELTS_OFFICIAL_SAMPLE_LINKS\.filter/);
  assert.match(ui,/onStart\(reading/);
  assert.match(ui,/ieltsReadingPracticeRequest\(locale,track,stage\)/);
  assert.match(ui,/ieltsWritingPracticeRequest\(locale,track,stage,task\)/);
});

test('Speaking is a text-only three-part conversation with the original Saqr send handler',()=>{
  assert.match(ex,/export function ieltsWrittenSpeakingRequest/);
  assert.match(ex,/TEXT-ONLY INTERACTIVE CHAT SIMULATION/);
  assert.match(ex,/TYPES in ENGLISH/);
  assert.match(ex,/One question per chat turn and WAIT/);
  assert.match(ex,/4–5 Part 1 questions/);
  assert.match(ex,/Part 2 ORIGINAL cue-card/);
  assert.match(ex,/4–5 Part 3 discussion questions/);
  assert.match(ex,/DO NOT claim you assessed pronunciation/);
  assert.match(entry,/onChoose\('speaking', ieltsWrittenSpeakingRequest\(locale\)\)/);
  assert.match(entry,/choice.id==='listening' \|\| choice.id==='reading' \|\| choice.id==='writing'/);
  assert.match(chat,/const practicePrompt = listeningPrompt \|\| ieltsSaqrPracticeRequest\(skill, locale\)/);
  assert.match(chat,/void handleSendMessage\(practicePrompt\)/);
  assert.doesNotMatch(ui+ex,/SpeechRecognition|MediaRecorder|new Audio\(|fetch\(|localStorage|signInWithOAuth/);
});

test('Graded listening lessons are independently sourced, all prior lessons retained, and 39 questions align with their sources',()=>{
  const marker='export const IELTS_LISTENING_LESSONS: readonly IeltsListeningLesson[] = ';
  const lessons=JSON.parse(listening.split(marker)[1].trim().replace(/;$/,''));
  assert.equal(lessons.length,13);
  assert.equal(lessons.reduce((n,x)=>n+x.questions.length,0),39);
  assert.deepEqual(lessons.slice(0,4).map(x=>x.id),['voa-welcome-1','voa-anna-2','voa-im-here-3','voa-budget-cuts-4']);
  assert.deepEqual(lessons.slice(4).map(x=>x.stage),[1,1,2,2,2,2,3,4,4]);
  assert.equal(lessons.filter(x=>x.stage===4).length,2);
  assert.ok(lessons.every(x=>x.questions.every(q=>q.correctIndex>=0&&q.correctIndex<q.options.length)));
  for(const item of lessons.slice(4)){
    assert.match(item.sourceUrl,/^https:\/\/learningenglish\.voanews\.com\/a\//);
    assert.match(item.audioUrl,/^https:\/\/voa-audio\.voanews\.eu\/vle\//);
    assert.ok(item.transcriptKind==='complete' || item.transcriptKind==='excerpt');
  }
  assert.match(runner,/stageNames/);
  assert.match(runner,/changeStage/);
  assert.match(runner,/stagedLessons\.map/);
  assert.match(runner,/href="https:\/\/www\.ielts\.org\/take-a-test\/preparation-resources\/sample-test-questions\/academic-test"/);
});
