import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page=readFileSync('pages/AboutPage.tsx','utf8');
const css=readFileSync('pages/aboutVisual.css','utf8');
const app=readFileSync('App.tsx','utf8');
const tutorial=readFileSync('pages/TutorialPage.tsx','utf8');

// Keep the original public route, original school facts, five library wings,
// published hours, official school site and librarian contact.
assert.ok(app.includes('<Route path="/about" element={<AboutPage />} />'));
assert.ok(page.includes("const { locale: lang, dir } = useLanguage();"),
  'About uses exactly the login-page language from the shared LanguageProvider');
assert.ok(app.includes("localStorage.getItem('saqr_lang')"),
  'User language choice persists between login and About');
assert.ok(page.includes('dir={dir}') && page.includes('translations[lang][key]'),
  'Arabic RTL / English LTR use shared app locale, not an About-only setting');
assert.ok(!page.includes('setLocale(') && !page.includes('toggleTheme') && !page.includes('useTheme'),
  'No separate language or dark-mode switch in About');
assert.ok(page.includes('data-about-theme="light"'));
assert.ok(css.includes('color-scheme:light') && css.includes('background:#f5f9f7'),
  'Page always uses the light background even when other pages are dark');
assert.ok(!page.includes('dark:') && !css.includes('.dark .efips-about-v3'),
  'No dark-mode dependent colors within About');

for (const key of [
  'schoolHistory','historyText','visitWebsite','librarySection','libraryIntro',
  'wing1','wing1Desc','wing2','wing2Desc','wing3','wing3Desc',
  'wing4','wing4Desc','wing5','wing5Desc','libServices','servicesList',
  'contactSection','operatingHours','monThu','fri','satSun','contactLink','motto'
]) {
  const count=[...page.matchAll(new RegExp('(?:^|\\n)\\s*'+key+':','g'))].length;
  assert.equal(count,2,'Bilingual school content missing for '+key);
}
assert.ok(page.includes('2007') && page.includes('15000') && page.includes('15,000'),
  'Original school/library history retained');
assert.ok(page.includes("t('wing5Desc')") && page.includes("t('libraryIntro')"),
  'Library descriptions retained');
assert.ok(page.includes("t('motto')") && page.includes("t('historyText')"),
  'School history and closing motto retained');
assert.ok(page.includes("key: 'monThu'") && page.includes("key: 'fri'") &&
  page.includes("key: 'satSun'") && page.includes('t(row.key)'),
  'All opening hours remain sourced from existing localized translations');

// Cairo only for this page. No italic styles anywhere in the page.
assert.ok(css.includes("font-family:'Cairo','Tajawal',sans-serif !important"));
assert.ok(page.includes("fonts.googleapis.com/css2?family=Cairo:") && page.includes('display=swap'),
  'Load Cairo on About asynchronously and use a friendly fallback');
assert.ok(css.includes("font-style:normal!important") && !page.includes('italic'),
  'No slanted or italic headings, labels or closing quotation');
assert.ok(!page.includes("@import url('https://fonts.googleapis.com") && !css.includes('@import'),
  'Avoid CSS-blocking Google Fonts imports');

// School crest is an obvious clickable link inside the centered, slightly
// right-aligned arrangement. The school story is below, on white not green.
assert.ok(page.includes("const schoolWebsite = 'https://www.falcon-school.com'"));
assert.ok(page.includes('<a href={schoolWebsite} target="_blank" rel="noopener noreferrer"'),
  'Logo and original site action open official school website');
assert.ok(page.includes('className="about3-crest-link"') &&
  page.includes('src="/school-logo.png"'), 'Use official logo image as a link');
assert.ok(page.includes('className="about3-hero-visual"') &&
  page.indexOf('className="about3-hero-copy"')>page.indexOf('className="about3-hero-visual"'),
  'School writing is below the crest/bubbles');
assert.ok(css.includes('transform:translateX(17px)') &&
  css.includes('background:#fff'), 'Center crest with slight right lean on a white background');
assert.ok(css.includes('.about3-crest-link img') && css.includes('object-fit:contain') &&
  css.includes('filter:none'), 'Clear sharp logo without blur or distortion');

const navKeys=['school','library','services','hours','contact'];
assert.equal(navKeys.filter(key=>page.includes("id: '"+key+"'")).length,5,
  'Five clickable header bubbles remain');
for (const id of ['about-school','about-wings','about-services','about-hours','about-contact']) {
  assert.ok(page.includes('id="'+id+'"'),'Missing header bubble target '+id);
}
assert.ok(page.includes('onClick={() => jumpTo(bubble.target)}') &&
  page.includes('scrollIntoView('), 'Header bubbles actually navigate to sections');
assert.ok(page.includes('aria-label={l('), 'Accessible bilingual link descriptions');
assert.ok(!page.includes('supabase.from('), 'Public About never exposes private data');

// Five circular wing buttons, Saqr in the middle and hover/focus hints;
// mobile taps toggle the detailed panel under the orbit.
assert.ok(page.includes('className="about3-wings-center"') &&
  page.includes('src="/Saqr.png"'), 'Only official Saqr artwork used');
assert.ok(page.includes('className="about3-wings-orbit"'));
assert.ok(page.includes('wings.map((wing,index)') &&
  page.includes("t('wing1Desc')") && page.includes("t('wing5Desc')"));
assert.ok(page.includes("role=\"tooltip\"") && page.includes('wing.desc'),
  'Every wing offers the full description on hover');
assert.ok(page.includes('onMouseEnter={() => setHoverWing(index)}') &&
  page.includes('onFocus={() => setHoverWing(index)}'),
  'Hover and keyboard focus both reveal the details');
assert.ok(page.includes('onClick={() => setOpenWing(current => current===index ? null : index)}'),
  'Touch users can tap to reveal/hide detailed text');
assert.ok(page.includes('aria-expanded={openWing === index}') &&
  page.includes('aria-live="polite"'), 'Accessible wing interactions');
assert.ok(css.includes('.about3-wing-bubble') && css.includes('border-radius:50%'),
  'Five school wings use rounded orbit bubbles');
assert.ok(css.includes('.about3-wing-slot--5') && css.includes('.about3-wings-center'),
  'Fifth heritage wing and mascot both present');

// Contact and operating times remain functional, clear and elegant.
assert.ok(page.includes('className="about3-contact-grid"'));
assert.ok(page.includes('className="about3-hours-panel"') &&
  page.includes('className="about3-contact-panel"'));
assert.ok(page.includes('<Icon kind={row.icon}/>') &&
  page.includes('<Icon kind="mail"/>'), 'Appropriate SVG icons for hours and contact');
assert.ok(page.includes("const librarianEmail = 'islam.ahmed@falcon-school.com'") &&
  page.includes("href={'mailto:'+librarianEmail}"), 'Original working email link retained');
assert.ok(page.includes('href={schoolWebsite}'), 'School homepage link retained');

// Ensure phone, tablet and Safari layouts have no overlapping circles, loops
// or GPU-heavy fixed blurred animation.
for (const breakpoint of ['@media(max-width:970px)','@media(max-width:760px)',
  '@media(max-width:650px)','@media(max-width:365px)']) {
  assert.ok(css.includes(breakpoint),'Missing responsive breakpoint '+breakpoint);
}
assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),
  'Mobile circles become a readable two-column layout');
assert.ok(css.includes('.about3-wing-slot--5{grid-column:1/-1}'),
  'Fifth wing remains centered on phones');
assert.ok(css.includes('env(safe-area-inset-bottom)'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
assert.ok(css.includes('touch-action:manipulation') && css.includes('min-height:51px'),
  'Touch controls are large enough and responsive');
assert.ok(!/backdrop-filter\s*:/.test(css) && !css.includes('infinite') && !/\bfilter\s*:\s*blur\(/.test(css),
  'Avoid per-frame blur, infinite animations and compositing jank');
assert.ok(!page.includes('IntersectionObserver') && !page.includes('setInterval(') &&
  !page.includes('requestAnimationFrame('), 'About has no scroll observers or animation timers');
assert.ok(tutorial.includes('school-logo.png'),
  'The public tour continues using the unchanged school crest');

console.log('PASS: forced-light bilingual Cairo About, linked central crest, five Saqr wing orbits with hints, original school facts and responsive Safari performance');
