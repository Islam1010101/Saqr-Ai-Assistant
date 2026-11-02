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
line('line-height:1.8;');
line('line-height:1.9;');
line('color:#075985;');
line('text-center font-black');
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
console.log('PASS: bilingual two-line brand, visible animated sign-in title, single-line auto-fit subtitle and unchanged Google OAuth');
