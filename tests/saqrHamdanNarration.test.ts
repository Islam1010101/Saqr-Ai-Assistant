import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { learningStories } from '../supabase/functions/saqr-learning-narration/stories.ts';
import { learningQuestions } from '../supabase/functions/saqr-learning-narration/questions.ts';
import { questionSupport } from '../src/components/saqrLearning/readingQuestionSupport.ts';
import { questionClipTimes, feedbackClipTimes, questionRecordingUrl, feedbackRecordingUrl } from '../src/components/saqrLearning/recordedQuestionClips.ts';

const read = (name: string) => readFileSync(name, 'utf8');
const page = read('src/components/saqrLearning/ReadTogether.tsx');
const retiredEndpoint = read('supabase/functions/saqr-learning-narration/index.ts');
const missions = read('src/components/saqrLearning/StepByStep.tsx');
const pictures = read('src/components/saqrLearning/PictureLearning.tsx');

assert.ok(retiredEndpoint.includes('RECORDED_AUDIO_ONLY') && retiredEndpoint.includes('410'),
  'The obsolete generated narration endpoint must be retired');
assert.ok(!retiredEndpoint.includes('AZURE_SPEECH_KEY') && !retiredEndpoint.includes('cognitiveservices'),
  'The backend must not synthesize new audio');
assert.equal(learningStories.length, 6, 'Exactly six approved stories');
assert.equal(new Set(learningStories.map(s => s.id)).size, 6, 'No duplicate story IDs');
assert.ok(missions.includes('titleAr:') && pictures.includes('questionAr:'), 'Other learning activities remain intact');
assert.ok(!page.includes('SpeechSynthesisUtterance') && !page.includes('speechSynthesis'), 'No browser TTS');
assert.ok(!page.includes("supabase.functions.invoke('saqr-learning-narration'") && !page.includes('AZURE_SPEECH_KEY'), 'No generated Azure narration');
assert.ok(page.includes('recordedAudioUrl') && page.includes('new Audio(url)'), 'Play actual recordings from /public');
assert.ok(page.includes('const canReuse') && page.includes('audio.readyState >= 1'), 'Reuse audio across sentences to avoid lag');
assert.ok(page.includes('setCurrentLine(startAt)') && page.includes('currentLine === index'), 'Highlight current recorded sentence');
assert.ok(page.includes('afterLine(startAt, id,') && page.includes('setQuestionId(checkpoint.id)'), 'Pause for comprehension questions');
assert.ok(page.includes("difficulty === 'gentle'") && page.includes('answeredRef.current.add(question.id)'),
  'Quiz levels and unique scoring are preserved');
assert.ok(page.includes('q.afterLine === 1 || q.afterLine === 5 || q.afterLine === 9'),
  'The gentle three-question path starts easy, reaches medium and ends hard');
assert.ok(page.includes("question.level === 1") && page.includes("question.level === 2"),
  'The active question visibly indicates its difficulty');
assert.ok(!page.includes('بدون مؤقت'), 'Remove the redundant no-timer label');
assert.ok(page.includes('prefers-reduced-motion: reduce'), 'Accessibility remains intact');
assert.ok(!page.includes('replayQuestion'), 'Do not synthesize old spoken questions');
assert.ok(page.includes('اقرأ جملة بنفسي'), 'Visual-only reading fallback');

const match = page.match(/const recordedCuts: Record<string, \{ ar: number\[\]; en: number\[\] \}> = ([\s\S]*?);\s*const recordedAudioUrl/);
assert.ok(match, 'Sentence timing manifest is present');
const cuts = JSON.parse(match[1]) as Record<string, Record<'ar'|'en',number[]>>;
const ids = new Set(learningStories.map(s => s.id));
assert.deepEqual(Object.keys(questionClipTimes).sort(), [...ids].sort(),
  'Twelve question MP3 recordings are aligned to the six story IDs');
for (const language of ['ar', 'en'] as const) {
  const feedbackPath = 'public' + feedbackRecordingUrl(language);
  assert.ok(existsSync(feedbackPath), 'Missing recorded feedback: '+feedbackPath);
  const feedbackBytes = readFileSync(feedbackPath);
  assert.ok(feedbackBytes.length > 50000, 'Unexpectedly small feedback MP3');
  const feedback = feedbackClipTimes[language];
  assert.ok(feedback.correct[0] >= 0 && feedback.correct[1] <= feedback.retry[0] &&
    feedback.retry[0] < feedback.retry[1], 'Feedback clips must not overlap');
}
assert.deepEqual(Object.keys(cuts).sort(), [...ids].sort(), 'All stories have timing data');
assert.equal(learningQuestions.length, 30, 'Six stories have five bilingual comprehension questions each');
assert.ok(page.includes("wrongFirstRef.current.add(question.id)") &&
  page.includes("setFirstTryCount(value => value + 1)") &&
  page.includes("setHintedCount(value => value + 1)"),
  'Session measures distinguish first-try correct answers from prompts needing another attempt');
assert.ok(page.includes("wrongFirstRef.current.clear()") &&
  page.includes("setFirstTryCount(0)") &&
  page.includes("setHintedCount(0)"),
  'Session measures reset on restart, story and language changes');
assert.ok(page.includes('Current attempt summary') &&
  page.includes('does not assess reading level or educational needs'),
  'The completion screen explains the limits of its educational summary');
assert.deepEqual(Object.keys(questionSupport).sort(), learningQuestions.map(q => q.id).sort(),
  'All thirty existing questions have specific bilingual educational hints and explanations');
assert.ok(page.includes('replayStoryClue') && page.includes('new Audio(recordedAudioUrl('),
  'Reading assistance replays the approved story MP3 rather than synthesizing questions');
assert.ok(page.includes('playRecordedQuiz') && page.includes('questionClipTimes[storyId]?.[language]'),
  'Recorded questions and individual answer choices play from the approved MP3 bank');
assert.ok(page.includes('playRecordedFeedback') && page.includes("kind: 'correct' | 'retry'"),
  'Approved encouragement plays for correct answers and another try');
assert.ok(page.includes("playRecordedQuiz([0, ...choiceOrder.map(optionIndex => optionIndex + 1)])"),
  'Question autoplay and replay use the on-screen randomized choices, not hidden options');
assert.ok(page.includes("playRecordedQuiz([optionIndex + 1])"),
  'Every visible answer offers an independent listening control');
assert.ok(!page.includes('SpeechSynthesisUtterance') && !page.includes('speechSynthesis'),
  'Question and feedback recordings never fall back to synthesized speech');
assert.ok(page.includes('stopClue()') && page.includes('audio.onended = clear'),
  'Clue playback stops cleanly before subsequent story audio or navigation');
assert.ok(page.includes('support.hintAr') && page.includes('support.hintEn') &&
  page.includes('support?.explanationAr') && page.includes('support?.explanationEn'),
  'Questions provide bilingual hints after errors and explanations after correct answers');
assert.ok(page.includes('lines[support.evidenceLine]'),
  'The explanation shows direct evidence from the approved story text');
assert.ok(!page.includes('SpeechSynthesisUtterance') && !page.includes('speechSynthesis'),
  'Approved narration is not replaced by browser speech synthesis');

for (const story of learningStories) {
  assert.equal(story.ar.length, 10, 'Ten Arabic sentences per story');
  assert.equal(story.en.length, 10, 'Ten English sentences per story');
  assert.ok(story.ar.every(line => line.length > 24) && story.en.every(line => line.length > 24));

  for (const lang of ['ar','en'] as const) {
    const spokenQuestionsPath = 'public' + questionRecordingUrl(story.id,lang);
    assert.ok(existsSync(spokenQuestionsPath), 'Missing user-recorded question MP3: '+spokenQuestionsPath);
    const spokenBytes = readFileSync(spokenQuestionsPath);
    assert.ok(spokenBytes.length > 500000, 'Question recording seems incomplete: '+spokenQuestionsPath);
    assert.ok(spokenBytes.subarray(0, 3).toString() === 'ID3' ||
      (spokenBytes[0] === 0xff && (spokenBytes[1] & 0xe0) === 0xe0),
      'Question recording must be a valid MP3');
    const segments = questionClipTimes[story.id][lang];
    assert.equal(segments.length,20, 'Five recorded questions and fifteen choices for each language');
    assert.ok(segments.every((clip,i) => clip[0] >= 0 && clip[1] > clip[0] &&
      (i === 0 || clip[0] > segments[i-1][1])), 'Question clips must be ordered and nonoverlapping');
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
  assert.deepEqual(questions.map(q => q.level),[1,1,2,2,3],
    'Difficulty climbs from two easy prompts through medium to harder reasoning');
  assert.deepEqual(questions.map(q => q.afterLine),[1,3,5,7,9],'Checkpoints follow the same lines');
  for (const q of questions) {
    const support = questionSupport[q.id];
    assert.ok(support, 'Question-specific support is required for '+q.id);
    assert.ok(Number.isInteger(support.evidenceLine) && support.evidenceLine >= 0 &&
      support.evidenceLine < story.ar.length, 'Referenced story evidence must exist');
    assert.ok(support.hintAr.length >= 20 && support.hintEn.length >= 20,
      'Hints must contain helpful educational guidance in both languages');
    assert.ok(support.explanationAr.length >= 27 && support.explanationEn.length >= 27,
      'Specific explanations must be meaningful in both languages');
    assert.ok(!support.hintAr.includes(q.options[q.correctIndex].ar) &&
      !support.hintEn.includes(q.options[q.correctIndex].en),
      'Hints must invite thinking, not simply display the correct answer');
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
assert.ok(learningQuestions.find(q => q.id === 'little-tree-5')?.promptEn.includes('patience'),
 'The tree story closes with an inference question');
assert.ok(learningQuestions.find(q => q.id === 'school-morning-5')?.promptEn.includes('Why'),
 'The morning story closes by interpreting its lesson');
assert.ok(learningQuestions.find(q => q.id === 'my-small-project-5')?.promptEn.includes('Why'),
 'Heritage questions progress to deeper reflection');
console.log('PASS: 12 approved MP3 files, 60 bilingual sentences, 30 bilingual questions and synchronized highlighting');
