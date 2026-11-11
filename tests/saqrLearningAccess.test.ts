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
const orbit=read('src/components/SaqrOrbitNavigation.tsx');
assert.ok(home.includes('<SaqrOrbitNavigation') && orbit.includes("to: '/saqr-learning'") && orbit.includes("roles: ['student', 'admin']"), 'Only student and admin orbit menus expose the private learning route');
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
assert.ok(!page.includes('وضع معاينة الأدمن') && !page.includes('Admin preview mode'), 'Admin preview label is removed');
assert.ok(!page.includes('/saqr-full.png'), 'Old mascot asset is replaced');

const readTogether=read('src/components/saqrLearning/ReadTogether.tsx');
const pictures=read('src/components/saqrLearning/PictureLearning.tsx');
const art=read('src/components/saqrLearning/LearningPictureArt.tsx');
const steps=read('src/components/saqrLearning/StepByStep.tsx');
const toolbar=read('src/components/saqrLearning/SaqrAccessibilityToolbar.tsx');

assert.ok(page.includes('<ReadTogether') && page.includes('<PictureLearning') && page.includes('<StepByStep') &&
  !page.includes('<CalmDisplay'), 'Three supported learning activities remain; calm mode is not a separate card');
assert.ok(!page.includes('<SaqrAccessibilityToolbar') &&
  app.includes('<AuthorizedAccessibilityToolbar />') && app.includes('SaqrAccessibilityContext.Provider'),
  'One shared accessibility toolbar is mounted at the site layout rather than within the learning page');
assert.ok(app.includes('getSaqrLearningAccess().then(result =>') &&
  app.includes("result.viewer === 'admin' || result.features?.calm_display === true") &&
  edge.includes('if(!entitlement?.enabled)'),
  'Server-verified admin or individually permitted student access is required across site pages');
assert.ok(app.includes("location.pathname === '/'") && app.includes('setPermitted(false)'),
  'Public sign-in screen never retains the private toolbar');
assert.ok(app.includes("window.addEventListener('focus', verify)") &&
  app.includes("window.addEventListener('storage', verify)"),
  'Toolbar permission is rechecked when users return or account storage changes');
assert.ok(page.includes('useSaqrAccessibilityDisplay()') && app.includes('onQuietChange: setQuiet'),
  'Calm display setting stays in sync with the learning page and persists on navigation');
assert.ok(!page.includes('saqr-learning-steps') &&
  !page.includes('1. اختار') && !page.includes('2. اسمع') && !page.includes('3. جاوب') &&
  !page.includes('1. Choose') && !page.includes('2. Listen') && !page.includes('3. Answer'),
  'The three redundant bilingual step indicators are removed');
assert.ok(!page.includes('صقر معك خطوة بخطوة، ويمكنك تكرار الأنشطة كما تحب.') &&
  !page.includes('Saqr is with you, one step at a time. Repeat activities whenever you like.'),
  'The specified explanatory sentence is removed in both languages');
assert.ok(page.includes('العودة للمكتبة') && page.includes('Back to library'),
  'Original return-to-library navigation remains intact');
for(const label of ['أنشطة تفاعلية','Interactive activities','بدون مؤقت','No time limits',
 'عربي وإنجليزي','Arabic & English','وضع معاينة الأدمن','Admin preview mode']){
  assert.ok(!page.includes(label), 'Removed hero label must not appear: '+label);
}
assert.ok(!read('src/components/saqrLearning/ReadTogether.tsx').includes('بدون مؤقت'), 'No-timer badge also removed inside the reader');
assert.ok(toolbar.includes('aria-expanded={expanded}') && toolbar.includes('setExpanded'), 'Toolbar opens and closes accessibly');
assert.ok(toolbar.includes("setZoom") && toolbar.includes('baselinePx.current * zoom / 100'),
  'Zoom scales the actual page typography');
assert.ok(toolbar.includes('const MAX_ZOOM = 200;') &&
  toolbar.includes("event.key !== 'Escape'") &&
  toolbar.includes('toggleRef.current?.focus()') &&
  toolbar.includes('overflow-x-hidden overflow-y-auto break-words'),
  '200 percent zoom remains keyboard-accessible and avoids clipped controls on small screens');
assert.ok(toolbar.includes("html.efips-learning-color-safe { filter:contrast") &&
  toolbar.includes("html.efips-learning-grayscale { filter:grayscale"),
  'Color-friendly contrast and grayscale now apply across the whole authorized school site');
assert.ok(toolbar.includes('efips-learning-reduced-motion'),
  'Reduced-motion display setting now applies site-wide for authorized users');
assert.ok(toolbar.includes("insetInlineStart: '12px'") && toolbar.includes('z-[900]') &&
  app.includes("dir === 'rtl' ? 'left-6' : 'right-6'"),
  'Toolbar sits opposite floating Saqr in each reading direction and above normal page layers');
assert.ok(toolbar.includes("onQuietChange(!quiet)"), 'Reduced motion remains accessible inside toolbar');
assert.ok(toolbar.includes("root.style.fontSize = originalSize.current"), 'Zoom settings restore on page exit');
assert.ok(toolbar.includes("root.classList.remove("), 'Presentation modes do not leak into a later school account');
assert.ok(readTogether.includes("'/audio/saqr-reading/'"), 'Read Together uses approved local MP3 assets');
assert.ok(readTogether.includes('new Audio(url)'), 'Reading uses HTMLAudioElement, not browser synthesis');
assert.ok(readTogether.includes('audio.play()') && readTogether.includes('audio.pause()') &&
  readTogether.includes('audio.currentTime ='), 'Playback supports play, pause and precise sentence seeking');
assert.ok(readTogether.includes("const language = isAr ? 'ar' : 'en'"), 'Each language has its own approved recording');
assert.ok(readTogether.includes('currentLine === index') && readTogether.includes('setCurrentLine(startAt)'),
  'The currently heard sentence is highlighted');
assert.ok(readTogether.includes('recordedCuts') && readTogether.includes('audio.ontimeupdate'),
  'Highlight and quiz checkpoints follow actual recording time');
assert.ok(readTogether.includes('const canReuse') && readTogether.includes('audio.readyState >= 1'),
  'Sentences reuse a buffered recording to minimize lag');
assert.ok(!readTogether.includes('speechSynthesis') && !readTogether.includes('AZURE_') &&
  !readTogether.includes("supabase.functions.invoke('saqr-learning-narration'"), 'Remove generated and browser TTS from this activity');
assert.ok(pictures.includes('<LearningPictureArt kind={kind}'), 'Picture game renders actual illustrations');
assert.ok(pictures.includes('rounds.length') && pictures.includes('setPicked(kind)') && pictures.includes('setRound(v => v + 1)'),
  'Picture choices and progression work');
assert.ok(art.includes("kind === 'tree'") && art.includes("kind === 'book'") && art.includes("kind === 'apple'"),
  'Required illustrated assets must exist');
assert.ok(steps.includes('<LearningPictureArt kind={kind}'), 'Step tasks use images');
assert.ok(steps.includes('setBreakTime(v => !v)') && steps.includes('setStep(s => s + 1)'), 'Breaks and task progression work');
assert.ok(!page.includes('setLarge('), 'Page does not expose a duplicate text control');
assert.ok(!page.includes("settings.calm_display && <button"), 'Old standalone calm-view button is removed');
assert.ok(page.includes('<ReadTogether isAr={isAr} large={true}') &&
  page.includes('<PictureLearning isAr={isAr} large={true}') &&
  page.includes('<StepByStep isAr={isAr} large={true}'),
  'Every reading and picture activity defaults to larger readable text');
assert.ok(page.includes('saqr-learning-page--overview') &&
  page.includes('height:calc(100dvh - 96px)') && page.includes('saqr-learning-tools-grid'),
  'Desktop activity overview is compact, while active content retains scrolling');
assert.ok(page.includes('from-[#0E5D88]') && page.includes('from-[#56318A]') &&
  page.includes('from-[#7A4600]') && !page.includes('from-[#075A42]'),
  'Three distinct high-contrast learning cards remain without a separate calm mode');
assert.ok(page.includes('saqr-learning-page--calm .saqr-learning-decoration'), 'Calm mode actually removes animated decorations');
assert.ok(page.includes('saqr-learning-page--calm .saqr-learning-option'), 'Calm mode simplifies activity cards');
assert.ok(!readTogether.includes('القراءة الصوتية الطبيعية ستُضاف') && !page.includes('القراءة الصوتية الطبيعية ستُضاف'),
  'No placeholder audio narration is presented as a working activity');
assert.ok(!pictures.includes('أنظر') && !pictures.includes('أفهم') , 'No placeholder text-only picture cards');
assert.ok(readTogether.includes('audio.play()') && pictures.includes('rounds: Round[]') && steps.includes('steps: Step[]'),
  'All three educational workflows are implemented');
console.log('PASS: progressive recorded reading, learning activities, private accessibility toolbar and display modes are interactive');
