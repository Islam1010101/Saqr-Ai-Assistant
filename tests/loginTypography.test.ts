import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const login = readFileSync('pages/Login.tsx','utf8');
const auth = readFileSync('src/components/GoogleSchoolReturn.tsx','utf8');
const app = readFileSync('App.tsx','utf8');
const line = (value: string) => assert.ok(login.includes(value), 'Missing responsive typography: '+value);

// Exact two lines, with Arabic and English text separated into explicit spans.
// A line-height larger than 1.5 keeps Arabic dots and glyph extents visible.
line('<span className="efips-brand-heading-line">المكتبة الرقمية</span>');
line('<span className="efips-brand-heading-line">لصقر الإمارات</span>');
line('<span className="efips-brand-heading-line">EFIPS</span>');
line('<span className="efips-brand-heading-line">DIGITAL LIBRARY</span>');
line('.efips-brand-heading-line {');
line('white-space:nowrap;');
line('line-height:1.67;');
line('line-height:1.85;');
line('overflow:visible;');
line('.efips-login-title {');
line('line-height:1.85;');
line('line-height:1.9;');
line('color:#065c38;');
line('-webkit-text-fill-color:#065c38;');
line('efips-login-hero');
line('efips-entry-saqr');
line('handleEntrySaqrClick');
line('efips-heritage-burst');
line('efips-heritage-welcome-fade');
line('efips-heritage-icon-reveal');
line('entryWelcomeTimeoutRef');
assert.ok(!login.includes('efips-login-uae-halo'), 'Outdated animated header halo must be removed');
assert.ok(!login.includes('efips-login-uae-flag'), 'Outdated floating logo effect must be removed');
line('#CE1126');
line('#00843D');
line('prefers-reduced-motion:reduce');
assert.ok(!login.includes('الدخول باستخدام البريد الإلكتروني الخاص بالمدرسة فقط'),
  'Remove redundant Arabic school-email notice');
assert.ok(!login.includes('Sign in using your school email account only'),
  'Remove redundant English school-email notice');
assert.ok(!login.includes('efips-school-email-notice'),
  'Remove the entire obsolete notice card without changing school-only OAuth');
assert.ok(!login.includes('efips-login-title-enter'), 'Old title effect should be replaced');
line('text-center text-3xl font-black');
line("lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'");
// A measurement-based fit keeps the complete original promotional sentence in
// precisely one visible row across languages, font changes and device widths.
line("اكتشف عالماً من المعرفة، العب، وتعلم مع مساعدك الذكي");
line("Discover a world of knowledge, play, and learn with Saqr!");
line('ResizeObserver');
line('subtitleTextRef.current');
line('subtitleContainerRef.current');
line('document.fonts?.ready');
line('text.scrollWidth');
line('container.clientWidth');
line('scaleX(');
assert.ok(!login.includes("'مكتبة صقر الإمارات' : 'EFIPS Library'"));
assert.ok(!login.includes('text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3'));
// The desktop landing view must keep its entire login panel, tour, and partner
// logos within the visible viewport; mobile layouts keep natural scrolling.
line('@media (min-width:1024px) and (min-height:600px)');
line('height:min(790px, calc(100dvh - 28px))!important;');
line('.efips-login-partner img {height:clamp(56px,9dvh,86px)!important;}');
line('justify-content:space-evenly!important;');
line('height:min(790px, calc(100dvh - 28px))!important;');
assert.ok(app.includes("location.pathname === '/' ? 'hidden' : location.pathname === '/saqr-learning' ? 'lg:hidden'"),
  'Hide the login footer across breakpoints and preserve the Saqr overview desktop rule');

// Two phone panels must match in height, and video-side content must stack
// vertically, while controls remain accessible on short screens.
line('grid-template-rows:repeat(2,minmax(0,1fr))!important;');
line('height:max(690px,calc(100dvh - 74px))!important;');
line('flex-direction:column!important;');
line('.efips-login-school {');
line('.efips-login-brand-copy {');
line('.efips-login-brand-mascot {');
line('.efips-login-signin {');
line('@media (max-width:359px)');
assert.ok(login.includes('.efips-login-brand-panel {\n            display:flex!important;') &&
  login.includes('.efips-login-school {\n            display:flex!important;') &&
  !login.includes('grid-template-columns:minmax(0,1.55fr)'),
  'The brand panel and school header must be vertically ordered on every phone');
assert.ok(app.includes("location.pathname === '/' ? 'hidden'"),
  'Hide redundant shared footer on the phone login screen to minimize scrolling');
// Desktop brand text is deliberately larger while the single-viewport card
// and interactive sign-in elements retain their existing sizing and placement.
line('font-size:clamp(38px,5.7dvh,54px)!important;');
line('font-size:clamp(17px,2.5dvh,21px)!important;');
line('max-width:540px!important;');
line('text-wrap:balance;transform:none!important;');

// Visual edits must not change Google-only auth or redirect.
line("provider: 'google'");
line("queryParams: { prompt: 'select_account' }");
line("redirectTo: window.location.origin + '/?efips_google_student=1'");
assert.ok(!login.includes('name="school-email"'));
assert.ok(auth.includes("supabase.functions.invoke('google-school-login'"));
line('flex flex-col justify-start bg-white relative z-10');
line('flex items-start justify-center px-3 pb-6 pt-20');
line('efips-login-hero relative mb-5');
line('src="/SAQR%20ENTER.png"');
line('حياك الله في صقر');
line('role="status"');
line('aria-label={lang ===');
line('focus-visible:outline-emerald-500');
assert.ok(!login.includes('flex flex-col justify-center bg-white relative z-10'), 'Sign-in panel should not vertically center below a large empty gap');
assert.ok(login.includes("prefers-reduced-motion:reduce"), 'Animations must honor accessibility settings');
assert.ok(login.includes("className=\"efips-login-title mt-4"), 'Keep centered responsive login title immediately under Saqr');
const hero = login.slice(login.indexOf('          {/* The sign-in header'), login.indexOf('          {/* Google-only entry'));
assert.ok(hero.includes('src="/SAQR%20ENTER.png"'), 'The requested Saqr Enter PNG must be used');
assert.ok(hero.includes('src="/school-logo.png"') && hero.includes('efips-entry-school-watermark') &&
  hero.includes('opacity-[0.15]'), 'Use only the existing school crest as a subtle watermark behind Saqr');
assert.ok(!hero.includes('بوابة مكتبة صقر الإمارات') &&
  !hero.includes('أهلاً بعودتك!') && !hero.includes('EFIPS LIBRARY PORTAL'),
  'Do not reintroduce old marketing headers into the right-hand hero');
assert.equal((hero.match(/<svg /g) || []).length, 4, 'Four Emirati heritage SVG icons appear on tap');
assert.ok(hero.includes('onClick={handleEntrySaqrClick}'), 'Saqr image is keyboard/click accessible');
assert.ok(login.includes('window.clearTimeout(entryWelcomeTimeoutRef.current)') &&
  login.includes('setEntryWelcomeVisible(false)'), 'Welcome automatically disappears and timers clean up');
assert.ok(!hero.includes('onClick={() => void handleSchoolGoogleLogin()}'), 'Separate interactive mascot from Google authorization');

const partnerBlock = login.slice(login.indexOf('efips-login-partners mt-5'), login.indexOf('</nav>', login.indexOf('efips-login-partners mt-5')));
const orderedLinks = [...partnerBlock.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(orderedLinks,['https://www.moe.gov.ae/','https://www.cognia.org/','https://www.adek.gov.ae/'],
  'Partner logos must retain Ministry (right), Cognia (center), ADEK (left) with a fixed RTL grid');
assert.ok(partnerBlock.includes('dir="rtl"') && (partnerBlock.match(/<img /g) || []).length === 3,
  'All three partner links must display a logo and fixed right-to-left ordering');
assert.ok(login.includes('from-white/65 via-white/55 to-sky-50/60') &&
  !login.includes('via-emerald-50/85 to-white/80 backdrop-blur-[1px]'),
  'Video must be more visible through a neutral, unblurred overlay');
console.log('PASS: centered Saqr Enter art, interactive Emirati heritage welcome and unchanged school OAuth');
