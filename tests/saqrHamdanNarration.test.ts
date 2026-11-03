import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { learningStories } from '../supabase/functions/saqr-learning-narration/stories.ts';

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
assert.ok(edge.includes('const spokenText = locale === "ar" ? story.ar'), 'Narration content only comes from approved educational bank');
assert.ok(edge.includes('story.id === body.storyId') && edge.includes('lineIndex'), 'Accept bounded story and sentence IDs');
assert.ok(!edge.includes('body.text') && !edge.includes('body.ssml'), 'No arbitrary user text is sent to external TTS');
assert.ok(page.includes("supabase.functions.invoke('saqr-learning-narration'"), 'Browser invokes protected narration');
assert.ok(page.includes('data instanceof Blob'), 'Browser plays returned MP3 instead of synthesizing a false Hamdan voice');
assert.ok(page.includes("setAzureReady(ready ? 'ready' : 'not-configured')"), 'Azure availability is explicit');
assert.ok(page.includes('voiceSource === \'device\''), 'Device speech fallback stays available when Azure is unconfigured');
assert.ok(page.includes('setCurrentLine(index)'), 'Highlights spoken story sentence');
assert.ok(!page.includes('Ocp-Apim-Subscription-Key'), 'Never expose the Azure subscription key in the browser');
console.log('PASS: six long bilingual stories, expanded missions and verified secure Azure voice pathway');
