import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page=readFileSync('pages/AboutPage.tsx','utf8');
const style=readFileSync('pages/aboutVisual.css','utf8');
const app=readFileSync('App.tsx','utf8');
const tutorial=readFileSync('pages/TutorialPage.tsx','utf8');

assert.ok(app.includes('<Route path="/about" element={<AboutPage />} />'),'Keep About public and its route unchanged');
assert.ok(page.includes("const { locale: lang, dir, setLocale } = useLanguage();"),'Use existing shared AR/EN state');
assert.ok(page.includes("const { theme, toggleTheme } = useTheme();"),'Keep platform light/dark theme in sync');
assert.ok(page.includes("const t = (key: keyof typeof translations.ar) => translations[lang][key];"),'Use one translation source');
assert.ok(page.includes('dir={dir}'),'Arabic RTL and English LTR use same app direction');
assert.ok(page.includes("setLocale(isAr ? 'en' : 'ar')"),'Public About language toggle works');
assert.ok(page.includes('onClick={toggleTheme}'),'Theme toggle remains wired');
for(const entry of [
  'schoolHistory','historyText','librarySection','libraryIntro','wing1','wing1Desc','wing2','wing2Desc',
  'wing3','wing3Desc','wing4','wing4Desc','wing5','wing5Desc','libServices','servicesList','operatingHours',
  'monThu','fri','satSun','contactLink','motto'
]){
  const re=new RegExp('(?:^|\\n)\\s*'+entry+':','g');
  assert.equal([...page.matchAll(re)].length,2,'Both AR/EN need '+entry);
}
assert.ok(page.includes("{isAr ? 'تعرف إلى مكتبتنا' : 'Library Overview'}"),'Library eyebrow translates');
assert.ok(page.includes("{isAr ? 'جناح الهوية الوطنية' : 'National Identity Wing'}"),'Heritage label translates');
assert.ok(page.includes("{isAr ? 'مع صقر… المعرفة أقرب' : 'EXPLORE WITH SAQR'}"),'Saqr brand label translates');

for(const [key,id] of [
  ['school','about-school'],['wings','about-wings'],['services','about-services'],
  ['hours','about-hours'],['contact','about-contact']
]){
  assert.ok(page.includes("id: '"+key+"', target: '"+id+"'"),'Bubble '+key+' points at '+id);
  assert.ok(page.includes('id="'+id+'"'),'Bubble '+key+' target is present');
}
assert.ok(page.includes('<nav className="about-bubble-nav"'),'Use real accessible Saqr-like bubble navigation');
assert.ok(page.includes('<AboutBubbleIcon kind={link.id}/>'),'Bubble icons are SVG, not emoji art');
assert.ok(page.includes('onClick={() => jumpTo(link.target)}'),'Bubbles actually scroll to the correct section');
assert.ok(page.includes("document.getElementById(id)?.scrollIntoView({"),'Bubbles are local safe section jumps');
assert.ok(page.includes("prefers-reduced-motion: reduce"),'Respect reduced motion when scrolling');
assert.ok(!page.includes('href="#about-'),'Avoid breaking HashRouter with document-fragment navigation');

assert.ok(page.includes('src="/school-logo.png"'),'Use official school logo asset');
assert.ok(page.includes('className="about-hero-logo" width="272" height="272"'),'Reserve size for crisp school crest');
assert.ok(page.includes('className="about-logo-disc"'),'School logo is presented on a clean light disc');
assert.ok(page.includes('loading="eager" decoding="async"'),'Logo loaded immediately without layout shift');
assert.ok(page.includes('src="/Saqr.png"'),'Use official Saqr mascot rather than generated art');
assert.ok(page.includes("alt={isAr ? 'شعار مدرسة صقر الإمارات الدولية الخاصة'"),'Accessible bilingual school logo');
assert.ok(style.includes('.efips-about-v2 .about-logo-disc'),'Logo disc styling present');
assert.ok(style.includes('background:#fff')&&style.includes('object-fit:contain')&&style.includes('filter:none'),'Keep logo details clear, without filters');
assert.ok(style.includes('.about-logo-disc .about-hero-logo')&&style.includes('animation:none'),'No bouncing or blurry crest');

assert.ok(page.includes('rootMargin: \'160px 0px 160px 0px\''),'Reveal before content enters viewport');
assert.ok(page.includes('observer.disconnect()'),'Reveal only once');
assert.ok(page.includes('else if (!entered)'),'Content never disappears during scroll back');
assert.ok(!page.includes('animate-blob'),'Remove large continuously animated blur from component');
assert.ok(!page.includes('blur-[60px]'),'Remove identity card huge blurs');
assert.ok(!page.includes("@import url('https://fonts.googleapis.com"),'Avoid per-page blocking remote font import');
assert.ok(!page.includes("* { font-family:"),'Never set a global font from the About page');
assert.ok(page.includes('className="about-ambient"'),'Keep static subtle UAE backgrounds');
assert.ok(style.includes('.efips-about-v2 .about-ambient')&&style.includes('radial-gradient'),'Use static gradients');
assert.ok(style.includes('.about-hero-ring,')&&style.includes('animation:none'),'Rings are static instead of perpetual spins');

assert.ok(style.includes('@media(max-width:980px)'),'Tablet layout adapts');
assert.ok(style.includes('@media(max-width:650px)'),'Mobile layout stacks correctly');
assert.ok(style.includes('@media(max-width:380px)'),'Compact narrow screens supported');
assert.ok(style.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'Phone bubbles in two-column tap-friendly grid');
assert.ok(style.includes('.about-bubble--contact{grid-column:1/-1}'),'Fifth bubble spans width on narrow screens');
assert.ok(style.includes('min-height:53px'),'Mobile bubbles have sufficiently large touch targets');
assert.ok(style.includes('env(safe-area-inset-bottom)'),'iPhone browser safe-area preserved');
assert.ok(style.includes('touch-action:manipulation'),'Touch interactions are instant');
assert.ok(style.includes('@media(hover:none),(pointer:coarse)'),'Tap devices avoid hover movement');
assert.ok(style.includes('@media(prefers-reduced-motion:reduce)'),'Reduce motion for accessibility');
assert.ok(style.includes('.dark .efips-about-v2'),'Keep dark mode');
assert.ok(style.includes('.about-service-item')&&style.includes('border-radius:50%'),'Library services use Saqr-style bubbles');

assert.ok(page.includes('href="https://www.falcon-school.com"'),'Keep existing school site link');
assert.ok(page.includes('href="mailto:islam.ahmed@falcon-school.com"'),'Keep librarian contact unchanged');
assert.ok(page.includes('t(\'monThu\')')&&page.includes('t(\'fri\')')&&page.includes('t(\'satSun\')'),'Operating hours preserved');
assert.ok(tutorial.includes('school-logo.png'),'Same crest used in the live visual tour');
assert.ok(!page.includes('supabase.from('),'Public page never retrieves personal records');

console.log('PASS: bilingual About, five functional Saqr bubbles, clear official school crest, responsive Safari/mobile layout and privacy-safe existing links');
