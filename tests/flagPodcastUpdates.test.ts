import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {flagQuestionBank,FLAG_STEPS,chooseFlagQuestion,difficultyForStep} from '../src/utils/uaeFlagQuestions.ts';
assert.equal(FLAG_STEPS,10);
assert.ok(flagQuestionBank.length>=20);
assert.equal(new Set(flagQuestionBank.map(x=>x.id)).size,flagQuestionBank.length);
for(const q of flagQuestionBank){assert.equal(q.ar.options.length,4);assert.equal(q.en.options.length,4);assert.ok(q.ar.question&&q.en.question&&q.ar.fact&&q.en.fact);assert.ok(q.correct>=0&&q.correct<4);}
assert.equal(difficultyForStep(0),'easy');assert.equal(difficultyForStep(4),'medium');assert.equal(difficultyForStep(9),'hard');
let ids=[];for(let i=0;i<10;i++){const q=chooseFlagQuestion(i,ids);assert.ok(!ids.includes(q.id));ids.push(q.id);}
const game=readFileSync('pages/FlagDayChallenge.tsx','utf8');
const podcast=readFileSync('pages/PodcastPage.tsx','utf8');
const national=readFileSync('pages/NationalIdentityPage.tsx','utf8');
assert.ok(game.includes('FLAG_STEPS'));assert.ok(game.includes("const {locale}=useLanguage()"));
assert.ok(game.includes('setStepsCompleted(nextStep)'));
assert.ok(podcast.includes('recordingToMp3(audioBlob)'));
assert.ok(podcast.includes('uploadInFlight.current=true'));
assert.ok(podcast.includes("mimeType:'audio/mpeg'"));
assert.ok(!podcast.includes('episodeTitle'));
assert.ok(!national.includes('قسم مستقل للكتب والمراجع، وليس من التحديات أو الألعاب.'));
console.log('PASS bilingual 10-question bank, school labels and single MP3 submission wiring');

const cards=readFileSync('pages/SearchPage.tsx','utf8');
const mp3=readFileSync('src/utils/podcastMp3.ts','utf8');
assert.ok(cards.includes('book.shelf === 22'));
assert.ok(cards.includes('Disney_wordmark.svg'));
assert.ok(cards.includes('book.shelf === 40'));
assert.ok(cards.includes('aria-hidden="true"'));
assert.ok(cards.includes('toggleSaved(readingKey)'));
assert.ok(!podcast.includes('episodeTitle'));
assert.ok(!podcast.includes('saqr-podcast-title'));
assert.ok(podcast.includes('safePodcastFileName(studentName,studentGrade)'));
assert.ok(podcast.includes("grade:studentGrade.trim()"));
assert.ok(podcast.includes('setStudentName(user.name_en || user.name_ar'));
assert.ok(mp3.includes('[name,grade].map'));
console.log('PASS no podcast title and shelf-specific book-card decorations');
assert.ok(!readFileSync('pages/SearchPage.tsx','utf8').includes('Saqr AI Insight'));
console.log('PASS removed visible Saqr AI Insight detail badge');
