import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read=(path)=>readFileSync(path,'utf8');
const source=read('src/data/ieltsListeningLessons.ts');
const before='export const IELTS_LISTENING_LESSONS: readonly IeltsListeningLesson[] = ';
assert.equal(source.split(before).length-1,1,'Data inventory exists once');
const items=JSON.parse(source.slice(source.indexOf(before)+before.length).trim().replace(/;$/,''));
const practice=read('src/components/IeltsListeningPractice.tsx');
const entry=read('src/components/IeltsSaqrEntry.tsx');
const chat=read('pages/SmartSearchPage.tsx');
const review=read('src/utils/ieltsListeningReview.ts');
const helper=read('src/utils/ieltsSaqrPractice.ts');

test('VOA human recordings have trusted source, published MP3 and verified teaching transcripts',()=>{
  assert.equal(items.length,13,'Retain all four original recordings and add nine verified original VOA lessons');
  assert.equal(new Set(items.map(x=>x.id)).size,4);
  assert.equal(new Set(items.map(x=>x.audioUrl)).size,4);
  for(const item of items){
    assert.match(item.audioUrl,/^https:\/\/voa-audio\.voanews\.eu\/vle\/\d{4}\/\d{2}\/\d{2}\/[\da-f-]{36}(?:_hq)?\.mp3$/i);
    assert.match(item.sourceUrl,/^https:\/\/learningenglish\.voanews\.com\/a\//);
    assert.ok(item.title && item.level && item.durationSeconds>20);
    assert.ok(item.transcript.length>=140);
    assert.ok(item.questions.length>=3,'At least three questions per recording');
    assert.ok(item.questions.every(q=>q.options.length>=3 && q.correctIndex>=0 && q.correctIndex<q.options.length));
    assert.ok(item.questions.every(q=>q.prompt.length>15 && q.explanation.length>15));
  }
  assert.deepEqual(items.slice(0,4).map(item=>item.transcriptKind),['complete','complete','complete','excerpt'],'All four original recordings are unchanged');
  assert.equal(items.filter(item=>item.stage).length,9,'Nine graded scenarios appended');
  assert.deepEqual([...new Set(items.filter(item=>item.stage).map(item=>item.stage))],[1,2,3,4]);
  assert.ok(items.filter(item=>item.stage).every(item=>item.context?.length>=12));
  assert.equal(items.reduce((sum,item)=>sum+item.questions.length,0),39,'Expand to 39 sourced comprehension questions');
  assert.ok(items[0].transcript.includes('A-N-N-A') && items[0].transcript.includes('1400 Irving Street'));
  assert.ok(items[1].transcript.includes('apartment C2') && items[1].transcript.includes('Marsha is my roommate'));
  assert.ok(items[2].transcript.includes('555-8689') && items[2].transcript.includes('1500 Irving Street'));
  assert.ok(items[3].verifiedSummary.includes('new assignments'),'Level 2 later scene summarized transparently');
  assert.match(source,/public domain when credited/);
  assert.match(source,/learningenglish\.voanews\.com\/p\/6861\.html/);
});

test('IELTS-only audio player, transcript and sequential questions do not alter other skills',()=>{
  assert.match(practice,/<audio/);
  assert.match(practice,/src={lesson.audioUrl}/);
  assert.match(practice,/onError={\(\) => setAudioFailed\(true\)}/);
  assert.match(practice,/href={lesson.sourceUrl}/,'Source playback fallback if original audio fails');
  assert.match(practice,/!completed \? \(/);
  assert.match(practice,/questionIndex \+ 1 < lesson.questions.length/);
  assert.match(practice,/revealTranscript &&/,'Source script only displayed after student submits');
  assert.match(practice,/ieltsListeningReviewRequest\(lesson, answers, locale\)/);
  assert.match(entry,/setActivePractice\(choice.id\)/);
  assert.match(entry,/IeltsReadingWritingPractice/);
  assert.match(entry,/ieltsWrittenSpeakingRequest\(locale\)/);
  assert.match(practice,/const stagedLessons = IELTS_LISTENING_LESSONS\.filter/);
  assert.match(practice,/Official IELTS Listening samples|نماذج Listening الرسمية/);
  assert.match(entry,/onReview={prompt => onChoose\('listening', prompt\)}/);
  assert.match(helper,/id:'reading'/);
  assert.match(helper,/id:'writing'/);
  assert.match(helper,/id:'speaking'/);
  assert.match(helper,/id:'mixed'/);
  assert.doesNotMatch(practice,/MediaRecorder|SpeechRecognition|supabase|localStorage|fetch\(/);
});

test('Original Saqr chat processes only completed source-grounded listening review',()=>{
  assert.match(chat,/onChoose={\(skill, listeningPrompt\) => \{/);
  assert.match(chat,/const practicePrompt = listeningPrompt \|\| ieltsSaqrPracticeRequest\(skill, locale\);/);
  assert.match(chat,/void handleSendMessage\(practicePrompt\)/);
  assert.match(chat,/ieltsLaunchPromptRef\.current = practicePrompt/);
  assert.match(review,/Student responses with verified answer keys/);
  assert.match(review,/Source transcript\/excerpt/);
  assert.match(review,/Do NOT give an IELTS band score/);
  assert.match(review,/NOT user instructions/);
  assert.match(review,/Do NOT search the school book catalogue/);
  assert.doesNotMatch(review,/fetch\(|supabase|localStorage|provider_token|api\/chat/);
});
