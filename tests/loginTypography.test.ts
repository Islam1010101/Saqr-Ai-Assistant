import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const login = readFileSync('pages/Login.tsx','utf8');
const auth = readFileSync('src/components/GoogleSchoolReturn.tsx','utf8');
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
assert.ok(!hero.includes('/school-logo.png') && !hero.includes('بوابة مكتبة صقر الإمارات') &&
  !hero.includes('أهلاً بعودتك!') && !hero.includes('EFIPS LIBRARY PORTAL'),
  'Remove the old sign-in heading, school crest and extra marketing copy ONLY from the right-hand header');
assert.equal((hero.match(/<svg /g) || []).length, 4, 'Four Emirati heritage SVG icons appear on tap');
assert.ok(hero.includes('onClick={handleEntrySaqrClick}'), 'Saqr image is keyboard/click accessible');
assert.ok(login.includes('window.clearTimeout(entryWelcomeTimeoutRef.current)') &&
  login.includes('setEntryWelcomeVisible(false)'), 'Welcome automatically disappears and timers clean up');
assert.ok(!hero.includes('onClick={() => void handleSchoolGoogleLogin()}'), 'Separate interactive mascot from Google authorization');
console.log('PASS: centered Saqr Enter art, interactive Emirati heritage welcome and unchanged school OAuth');
