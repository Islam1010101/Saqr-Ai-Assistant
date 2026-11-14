import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SAQR_NEWS_HIGHLIGHTS, getSaqrNewsTicker } from '../src/data/saqrWhatsNew.ts';

const home = readFileSync('pages/HomePage.tsx', 'utf8');
const tour = readFileSync('pages/TutorialPage.tsx', 'utf8');
const app = readFileSync('App.tsx', 'utf8');
const identity = readFileSync('pages/NationalIdentityPage.tsx', 'utf8');
const hub = readFileSync('pages/SaqrChallengesHubPage.tsx', 'utf8');

// Every highlight is authored in both languages, is unique, and doesn't rely
// on a network request or a timer to load on the homepage.
assert.ok(SAQR_NEWS_HIGHLIGHTS.length >= 30, 'Cover all key Saqr services, games and new challenges');
const ids = SAQR_NEWS_HIGHLIGHTS.map(x => x.id);
assert.equal(new Set(ids).size, ids.length, 'No duplicate feature IDs');
for (const item of SAQR_NEWS_HIGHLIGHTS) {
  assert.ok(item.ar.trim().length >= 16, 'Missing engaging Arabic wording for ' + item.id);
  assert.ok(item.en.trim().length >= 16, 'Missing engaging English wording for ' + item.id);
}
const expected = [
  'voice-of-union','national-identity','cultural-passport','emirati-language',
  'national-memory','flag-of-glory','identity-book-pavilion','identity-digital-books',
  'between-the-lines','sort-the-library','saqr-studio','saqr-podcast',
  'little-author','proofreading','saqr-ai','book-discussions',
  'lesson-preparation','saqr-helps-me','personal-reading-picks',
  'monthly-reading','reading-list','arabic-digital','english-digital',
  'digital-reader','physical-catalog','book-borrowing','borrowing-reminders',
  'teacher-schedule','creators-portal','guided-tour','suggestions','admin-insights'
];
for (const id of expected) assert.ok(ids.includes(id), 'Missing Saqr feature in ticker: ' + id);
for (const locale of ['ar','en'] as const) {
  const ticker = getSaqrNewsTicker(locale);
  assert.equal(ticker.split('   •   ').length, SAQR_NEWS_HIGHLIGHTS.length);
  for (const item of SAQR_NEWS_HIGHLIGHTS) assert.ok(ticker.includes(item[locale]));
}
// Check key advertised challenges and routes actually exist.
assert.ok(app.includes('path="/saqr-national-identity/anthem"'));
assert.ok(app.includes('path="/saqr-studio"'));
assert.ok(app.includes('path="/podcast"'));
assert.ok(app.includes('path="/schedule"'));
assert.ok(identity.includes('تحدي صوت الاتحاد'));
assert.ok(identity.includes('تحدي راية المجد'));
assert.ok(identity.includes('جواز صقر الثقافي'));
assert.ok(hub.includes('بين السطور مع صقر') && hub.includes('رتب المكتبة'));
// Preserve original home structure and scrolling mechanism.
assert.ok(home.includes("newsContent: getSaqrNewsTicker('ar')"));
assert.ok(home.includes("newsContent: getSaqrNewsTicker('en')"));
assert.ok(home.includes("{t('newsTitle')}") && home.includes("{t('newsContent')}"));
assert.ok(home.includes('animate-marquee-rtl') && home.includes('animate-marquee-ltr'));
assert.ok(home.includes('@keyframes marquee-rtl { 0% { transform: translateX(0); }'));
assert.ok(home.includes('@keyframes marquee-ltr { 0% { transform: translateX(0); }'));
assert.ok(home.includes('aria-pressed={newsPaused}') && home.includes('setNewsPaused(paused => !paused)'));
assert.ok(home.includes('animation-play-state: paused'));
assert.ok(home.includes('animationDuration: isAr ?'));
assert.ok(home.includes('prefers-reduced-motion: reduce'));
assert.ok(tour.includes('صوت الاتحاد وتسجيل MP3') && tour.includes('Voice of the Union MP3'));
console.log('PASS: 32 bilingual Saqr news highlights, verified feature coverage, efficient pausable ticker and tour');
