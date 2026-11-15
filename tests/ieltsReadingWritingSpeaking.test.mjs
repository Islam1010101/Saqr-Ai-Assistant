import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(path,'utf8');
const exam=read('src/utils/ieltsExamPractice.ts');
const ui=read('src/components/IeltsReadingWritingPractice.tsx');
const entry=read('src/components/IeltsSaqrEntry.tsx');
const center=read('pages/IeltsPreparationCenterPage.tsx');
const chat=read('pages/SmartSearchPage.tsx');
const graded=read('src/data/ieltsListeningExpanded.ts');
const listening=read('src/components/IeltsListeningPractice.tsx');

test('All original graded listening stages and official links remain unchanged',()=>{
  assert.match(graded,/IELTS_GRADED_LISTENING_LESSONS/);
  assert.match(graded,/IELTS_LISTENING_EXTRA/);
  assert.match(listening,/IELTS_GRADED_LISTENING_LESSONS\.filter/);
  assert.match(listening,/isListeningAnswerCorrect/);
  assert.match(listening,/https:\/\/ielts\.org\/take-a-test\/preparation-resources\/sample-test-questions\/academic-test/);
  assert.match(entry,/onReview={prompt => onChoose\('listening', prompt\)}/);
  assert.doesNotMatch(entry,/IeltsListeningPractice\s*\(/);
});

test('Six official publisher resources are linked, never copied or claimed as Saqr-authored official exams',()=>{
  for (const id of ['listening','academic-reading','general-reading','academic-writing','general-writing','writing-criteria'])
    assert.match(exam,new RegExp("id:'"+id+"'"));
  assert.match(exam,/https:\/\/www\.ielts\.org\/take-a-test\/preparation-resources\/sample-test-questions\/academic-test/);
  assert.match(exam,/https:\/\/www\.ielts\.org\/take-a-test\/preparation-resources\/sample-test-questions\/general-training-test/);
  assert.match(exam,/https:\/\/ielts\.org\/take-a-test\/preparation-resources\/writing-test-resources/);
  assert.match(center,/IELTS_OFFICIAL_SAMPLE_LINKS\.map/);
  assert.match(center,/target="_blank" rel="noopener noreferrer"/);
  assert.match(exam,/not official IELTS or Cambridge/);
  assert.match(exam,/DO NOT reproduce its copyrighted passages/);
  assert.match(exam,/never copy any official copyrighted sample question/);
});

test('Reading creates original Academic or General Training content and mixed IELTS-format questions',()=>{
  assert.match(exam,/export function ieltsReadingPracticeRequest/);
  assert.match(exam,/Generate an entirely ORIGINAL informational/);
  assert.match(exam,/entirely ORIGINAL General Training everyday reading material/);
  assert.match(exam,/True\/False\/Not Given/);
  assert.match(exam,/matching headings/);
  assert.match(exam,/Do NOT reveal the answer key until the student responds/);
  assert.match(ui,/setTrack/);
  assert.match(ui,/setStage/);
  assert.match(ui,/ieltsReadingPracticeRequest\(locale,track,stage\)/);
});

test('Writing creates original Task 1 Academic data or General letter and Task 2 essay with correct lengths and criteria',()=>{
  assert.match(exam,/export function ieltsWritingPracticeRequest/);
  assert.match(exam,/Task 1 with a self-contained small numeric data TABLE/);
  assert.match(exam,/ORIGINAL General Training Task 1 letter-writing situation/);
  assert.match(exam,/ORIGINAL Writing Task 2 essay prompt/);
  assert.match(exam,/at least 150 words/);
  assert.match(exam,/at least 250 words/);
  for(const criterion of ['Task Achievement/Task Response','Coherence and Cohesion','Lexical Resource','Grammatical Range and Accuracy'])
    assert.ok(exam.includes(criterion));
  assert.match(ui,/setTask/);
  assert.match(ui,/IELTS_OFFICIAL_SAMPLE_LINKS\.filter/);
  assert.match(ui,/ieltsWritingPracticeRequest\(locale,track,stage,task\)/);
});

test('Text-only speaking uses Saqr existing message handler with no audio scoring claims',()=>{
  assert.match(exam,/export function ieltsWrittenSpeakingRequest/);
  assert.match(exam,/TEXT-ONLY INTERACTIVE CHAT SIMULATION/);
  assert.match(exam,/TYPES in ENGLISH/);
  assert.match(exam,/One question per chat turn and WAIT/);
  assert.match(exam,/Part 1 questions/);
  assert.match(exam,/Part 2 ORIGINAL cue-card/);
  assert.match(exam,/Part 3 discussion questions/);
  assert.match(exam,/DO NOT claim you assessed pronunciation/);
  assert.match(entry,/onChoose\('speaking', ieltsWrittenSpeakingRequest\(locale\)\)/);
  assert.match(entry,/IeltsReadingWritingPractice/);
  assert.match(entry,/setActivePractice\(choice.id\)/);
  assert.match(chat,/const practicePrompt = listeningPrompt \|\| ieltsSaqrPracticeRequest\(skill, locale\)/);
  assert.match(chat,/void handleSendMessage\(practicePrompt\)/);
  assert.doesNotMatch(exam+ui,/SpeechRecognition|MediaRecorder|fetch\(|localStorage|signInWithOAuth/);
});
