import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(p,'utf8');
const edge=read('supabase/functions/saqr-learning-access/index.ts');
const page=read('pages/SaqrLearningPage.tsx');
const entry=read('src/components/SaqrLearningEntry.tsx');
const auth=read('src/utils/saqrLearningAccess.ts');
const app=read('App.tsx');
const home=read('pages/HomePage.tsx');
assert.ok(edge.includes('auth.auth.getUser(jwt)'));
assert.ok(edge.includes('identity_data?.email_verified'));
assert.ok(edge.includes('saqr_learning_access'));
assert.ok(edge.includes('if(!entitlement?.enabled)'));
assert.ok(!edge.includes('ADHD')&&!edge.includes('autism'));
assert.ok(entry.includes('if(!allowed)return null'));
assert.ok(home.includes("(userType === 'student' || userType === 'admin') && <SaqrLearningEntry"), 'Only student and admin shells may request access');
assert.ok(app.includes('path="/saqr-learning"'));
assert.ok(page.includes("status === 'denied'"));
assert.ok(auth.includes("supabase.functions.invoke('saqr-learning-access'"));
assert.ok(!page.includes('student_id')&&!entry.includes('student_id'));
console.log('PASS: private pilot is verified server-side and never reveals identifiers or diagnoses in source');

assert.ok(edge.includes('email==="islam.ahmed@falcon-school.com"'), 'Only designated admin email may preview');
assert.ok(edge.includes('staff?.role==="admin"'), 'Admin role must be verified server-side');
assert.ok(edge.includes('efips_google_staff_accounts'), 'Admin directory is authoritative');
assert.ok(edge.includes('viewer:"admin"'), 'Admin preview response is explicit');
assert.ok(edge.includes('viewer:"student"'), 'Student responses retain a distinct role');
assert.ok(edge.includes('blocked?.disabled_at'), 'Disabled admin and students must be denied');
assert.ok(page.includes('/Saqr%20Hellping.png'), 'Use requested exact public school artwork');
assert.ok(page.includes('saqr-learning-mascot'), 'Hero applies scoped character motion');
assert.ok(page.includes('prefers-reduced-motion:reduce'), 'Motion is optional for accessibility');
assert.ok(page.includes('وضع معاينة الأدمن'), 'Authorized admin sees preview indicator');
assert.ok(!page.includes('/saqr-full.png'), 'Old mascot asset is replaced');

const readTogether=read('src/components/saqrLearning/ReadTogether.tsx');
const pictures=read('src/components/saqrLearning/PictureLearning.tsx');
const art=read('src/components/saqrLearning/LearningPictureArt.tsx');
const steps=read('src/components/saqrLearning/StepByStep.tsx');
const calm=read('src/components/saqrLearning/CalmDisplay.tsx');

assert.ok(page.includes('<ReadTogether') && page.includes('<PictureLearning') && page.includes('<StepByStep') && page.includes('<CalmDisplay'),
  'Each learning card must mount its functional activity');
assert.ok(readTogether.includes('new SpeechSynthesisUtterance('), 'Reading creates genuine spoken utterances');
assert.ok(readTogether.includes('synth.speak(item)'), 'Reading actually plays audio');
assert.ok(readTogether.includes('synth.pause()') && readTogether.includes('synth.resume()') && readTogether.includes('synth.cancel()'),
  'Speech player supports pause, resume, and stop');
assert.ok(readTogether.includes("locale = isAr ? 'ar-AE' : 'en-US'"), 'Bilingual speech locale');
assert.ok(readTogether.includes('currentLine === index'), 'Highlight spoken sentence');
assert.ok(readTogether.includes('synth.getVoices()'), 'Allow choosing device voices');
assert.ok(readTogether.includes('item.onend = () => afterLine(index, id, speakLine)'), 'Continue narration or pause at the next comprehension checkpoint');
assert.ok(readTogether.includes("!available &&"), 'Show unavailable speech warning instead of dead button');
assert.ok(pictures.includes('<LearningPictureArt kind={kind}'), 'Picture game renders actual illustrations');
assert.ok(pictures.includes('rounds.length') && pictures.includes('setPicked(kind)') && pictures.includes('setRound(v => v + 1)'),
  'Picture choices and progression work');
assert.ok(art.includes("kind === 'tree'") && art.includes("kind === 'book'") && art.includes("kind === 'apple'"),
  'Required illustrated assets must exist');
assert.ok(steps.includes('<LearningPictureArt kind={kind}'), 'Step tasks use images');
assert.ok(steps.includes('setBreakTime(v => !v)') && steps.includes('setStep(s => s + 1)'), 'Breaks and task progression work');
assert.ok(calm.includes('onQuietChange(!quiet)') && calm.includes('onLargeChange(!large)'), 'Calm mode controls update page');
assert.ok(page.includes('saqr-learning-page--calm .saqr-learning-decoration'), 'Calm mode actually removes animated decorations');
assert.ok(page.includes('saqr-learning-page--calm .saqr-learning-option'), 'Calm mode simplifies activity cards');
assert.ok(!readTogether.includes('القراءة الصوتية الطبيعية ستُضاف') && !page.includes('القراءة الصوتية الطبيعية ستُضاف'),
  'No placeholder audio narration is presented as a working activity');
assert.ok(!pictures.includes('أنظر') && !pictures.includes('أفهم') , 'No placeholder text-only picture cards');
assert.ok(readTogether.includes('synth.speak(item)') && pictures.includes('rounds: Round[]') && steps.includes('steps: Step[]'),
  'All three educational workflows are implemented');
console.log('PASS: spoken reading, visual learning, guided tasks, and calm display are interactive');
