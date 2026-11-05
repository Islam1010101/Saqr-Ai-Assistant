import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { learningStories } from '../supabase/functions/saqr-learning-narration/stories.ts';
import { learningQuestions } from '../supabase/functions/saqr-learning-narration/questions.ts';

const read = (name: string) => readFileSync(name, 'utf8');
const page = read('src/components/saqrLearning/ReadTogether.tsx');
const missions = read('src/components/saqrLearning/StepByStep.tsx');
const pictures = read('src/components/saqrLearning/PictureLearning.tsx');

assert.equal(learningStories.length, 6, 'Exactly six approved stories');
assert.equal(new Set(learningStories.map(s => s.id)).size, 6, 'No duplicate story IDs');
assert.ok(missions.includes('titleAr:') && pictures.includes('questionAr:'), 'Other learning activities remain intact');
assert.ok(!page.includes('SpeechSynthesisUtterance') && !page.includes('speechSynthesis'), 'No browser TTS');
assert.ok(!page.includes('saqr-learning-narration') && !page.includes('AZURE_SPEECH_KEY'), 'No generated Azure narration');
assert.ok(page.includes('recordedAudioUrl') && page.includes('new Audio(url)'), 'Play actual recordings from /public');
assert.ok(page.includes('const canReuse') && page.includes('audio.readyState >= 1'), 'Reuse audio across sentences to avoid lag');
assert.ok(page.includes('setCurrentLine(startAt)') && page.includes('currentLine === index'), 'Highlight current recorded sentence');
assert.ok(page.includes('afterLine(startAt, id,') && page.includes('setQuestionId(checkpoint.id)'), 'Pause for comprehension questions');
assert.ok(page.includes("difficulty === 'gentle'") && page.includes('answeredRef.current.add(question.id)'),
  'Quiz levels and unique scoring are preserved');
assert.ok(page.includes('prefers-reduced-motion: reduce'), 'Accessibility remains intact');
assert.ok(!page.includes('replayQuestion'), 'Do not synthesize old spoken questions');
assert.ok(page.includes('اقرأ جملة بنفسي'), 'Visual-only reading fallback');

const match = page.match(/const recordedCuts: Record<string, \{ ar: number\[\]; en: number\[\] \}> = ([\s\S]*?);\s*const recordedAudioUrl/);
assert.ok(match, 'Sentence timing manifest is present');
const cuts = JSON.parse(match[1]) as Record<string, Record<'ar'|'en',number[]>>;
const ids = new Set(learningStories.map(s => s.id));
assert.deepEqual(Object.keys(cuts).sort(), [...ids].sort(), 'All stories have timing data');
assert.equal(learningQuestions.length, 30, 'Six stories have five bilingual comprehension questions each');

for (const story of learningStories) {
  assert.equal(story.ar.length, 10, 'Ten Arabic sentences per story');
  assert.equal(story.en.length, 10, 'Ten English sentences per story');
  assert.ok(story.ar.every(line => line.length > 24) && story.en.every(line => line.length > 24));

  for (const lang of ['ar','en'] as const) {
    const path = 'public/audio/saqr-reading/' + story.id + '/' + lang + '.mp3';
    assert.ok(existsSync(path), 'Missing approved recording: ' + path);
    const bytes = readFileSync(path);
    assert.ok(bytes.length > 100000, 'Suspiciously small audio recording: ' + path);
    assert.ok(bytes.subarray(0, 3).toString() === 'ID3' ||
      (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0), 'Invalid MP3 header: ' + path);
    assert.equal(cuts[story.id][lang].length, 10, 'A cut for each spoken sentence');
    assert.ok(cuts[story.id][lang].every((t,i,a) => Number.isFinite(t) && t >= 0 && (i===0 || t > a[i-1])),
      'Sentence starts must be ordered and finite');
  }

  const questions = learningQuestions.filter(q => q.storyId === story.id);
  assert.equal(questions.length,5,'Five comprehension questions per story');
  assert.equal(questions.filter(q => q.level === 1).length,3,'Gentle mode has three questions');
  assert.deepEqual(questions.map(q => q.afterLine),[1,3,5,7,9],'Checkpoints follow the same lines');
  for (const q of questions) {
    assert.ok(ids.has(q.storyId));
    assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length);
    assert.ok(q.options.length >= 3 && q.options.every(o=>o.ar && o.en));
    assert.ok(q.promptAr.length > 9 && q.promptEn.length > 9);
  }
}
assert.equal(learningStories[4].titleEn, 'Saqr and the Secret of the Sun', 'Fifth story is the approved replacement');
assert.equal(learningStories[5].titleEn, 'Saqr and the Treasure of the Sea', 'Sixth story is the approved replacement');
assert.ok(learningQuestions.some(q => q.storyId === learningStories[4].id && q.promptEn.includes('rotation')),
 'New science comprehension questions are in place');
assert.ok(learningQuestions.some(q => q.storyId === learningStories[5].id && q.promptEn.includes('sea')),
 'New UAE sea heritage comprehension questions are in place');
console.log('PASS: 12 approved MP3 files, 60 bilingual sentences, 30 bilingual questions and synchronized highlighting');
