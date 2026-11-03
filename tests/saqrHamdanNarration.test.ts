import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { learningStories } from '../supabase/functions/saqr-learning-narration/stories.ts';
import { learningQuestions } from '../supabase/functions/saqr-learning-narration/questions.ts';

const read = (name: string) => readFileSync(name,'utf8');
const edge = read('supabase/functions/saqr-learning-narration/index.ts');
const page = read('src/components/saqrLearning/ReadTogether.tsx');
const mission = read('src/components/saqrLearning/StepByStep.tsx');
const pictures = read('src/components/saqrLearning/PictureLearning.tsx');

assert.ok(learningStories.length >= 6, 'Expand the number of selectable stories');
assert.equal(new Set(learningStories.map(story=>story.id)).size, learningStories.length);
for(const story of learningStories) {
  assert.ok(story.ar.length>=10 && story.en.length>=10, 'Each story has extended Arabic and English narration');
  assert.equal(story.ar.length,story.en.length,'Bilingual sentences align');
  assert.ok(story.ar.every(line=>line.length>24) && story.en.every(line=>line.length>24),'Lines contain real story prose');
}
assert.ok((mission.match(/titleAr:/g)||[]).length >= 14,'Extend guided learning missions');
assert.ok((pictures.match(/questionAr:/g)||[]).length >= 8,'Extend picture learning rounds');
assert.ok(edge.includes('ar-AE-HamdanNeural'), 'Use the actual verified UAE Hamdan neural voice');
assert.ok(edge.includes('en-US-GuyNeural'), 'English narration retains an English voice');
assert.ok(edge.includes('AZURE_SPEECH_KEY') && edge.includes('AZURE_SPEECH_REGION'), 'Azure keys remain server-side');
assert.ok(edge.includes('auth.auth.getUser(jwt)') && edge.includes('saqr_learning_access'), 'Preserve protected learning access');
assert.ok(edge.includes('staff?.role !== "admin"'), 'Admin preview is checked server-side');
assert.ok(edge.includes('const spokenText = question'), 'Narration is constrained to approved classroom text');
assert.ok(edge.includes('item.id === body.storyId') && edge.includes('lineIndex'), 'Accept bounded story and sentence IDs');
assert.ok(!edge.includes('body.text') && !edge.includes('body.ssml'), 'No arbitrary user text is sent to external TTS');
assert.ok(page.includes("supabase.functions.invoke('saqr-learning-narration'"), 'Browser invokes protected narration');
assert.ok(page.includes('data instanceof Blob'), 'Browser plays returned MP3 instead of synthesizing a false Hamdan voice');
assert.ok(page.includes("setAzureReady(ready ? 'ready' : 'not-configured')"), 'Azure availability is explicit');
assert.ok(page.includes('voiceSource === \'device\''), 'Device speech fallback stays available when Azure is unconfigured');
assert.ok(page.includes('setCurrentLine(index)'), 'Highlights spoken story sentence');
assert.ok(!page.includes('Ocp-Apim-Subscription-Key'), 'Never expose the Azure subscription key in the browser');
console.log('PASS: six long bilingual stories, expanded missions and verified secure Azure voice pathway');

assert.ok(edge.includes('"Content-Type": "application/octet-stream"'), 'Supabase binary parser requires octet-stream');
assert.ok(edge.includes('"X-Saqr-Audio-Type": "audio/mpeg"'), 'Keep accurate MP3 media type metadata');
assert.ok(page.includes("new Blob([response.data], { type: 'audio/mpeg' })"), 'Browser audio Blob has an explicit MP3 type');
assert.ok(page.includes("URL.createObjectURL(mp3)"), 'MP3 blob is passed to the player without text conversion');
assert.ok(!edge.includes('"Content-Type": "audio/mpeg", "X-Saqr-Voice"'), 'Do not regress to text parsing of MP3 binary');

assert.equal(learningQuestions.length, 30, 'Six stories have five bilingual reading checkpoints each');
const storyIds = new Set(learningStories.map(s=>s.id));
for(const story of learningStories) {
  const quiz = learningQuestions.filter(q=>q.storyId===story.id);
  assert.equal(quiz.length,5,'Every story has 5 questions');
  assert.equal(quiz.filter(q=>q.level===1).length,3,'Every story has a shorter three-question gentle mode');
  assert.deepEqual(quiz.map(q=>q.afterLine),[1,3,5,7,9],'Questions stop after selected lines');
  for(const question of quiz){
    assert.ok(storyIds.has(question.storyId));
    assert.ok(question.correctIndex>=0 && question.correctIndex<question.options.length);
    assert.ok(question.options.length>=3);
    assert.ok(question.promptAr.length>9 && question.promptEn.length>9);
    assert.ok(question.options.every(o=>o.ar&&o.en));
  }
}
assert.ok(edge.includes('speak-question')&&edge.includes('learningQuestions.find'), 'Azure can narrate only approved questions');
assert.ok(edge.includes('item.storyId === body.storyId && item.id === body.questionId'), 'Question ID must match story ID');
assert.ok(!edge.includes('body.prompt')&&!edge.includes('body.questionText'), 'No freeform student audio text input');
assert.ok(page.includes("action: 'speak-question'"), 'Browser requests approved spoken questions');
assert.ok(page.includes('afterLine(index, id,'), 'Narration pauses at question checkpoints');
assert.ok(page.includes('setQuestionId(checkpoint.id)'), 'Question UI opens after speech');
assert.ok(page.includes('replayQuestion'), 'A child can repeat each spoken question');
assert.ok(page.includes("difficulty === 'gentle'"), 'Simpler questions and fewer choices are available');
assert.ok(page.includes('answeredRef.current.add(question.id)'), 'Correct answers count once');
assert.ok(page.includes('read one sentence')||page.includes('اقرأ جملة بنفسي'), 'Manual visual-only reading fallback');
assert.ok(page.includes('prefers-reduced-motion: reduce'), 'Respect reduced-motion for question scrolling');
console.log('PASS: 30 bilingual comprehension questions with protected Hamdan narration and accessible child controls');
