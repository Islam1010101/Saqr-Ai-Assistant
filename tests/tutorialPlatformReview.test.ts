import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tutorial = readFileSync('pages/TutorialPage.tsx','utf8');
const mobileCss = readFileSync('pages/tutorialPageMobileParity.css','utf8');
const showcase = readFileSync('pages/TutorialFeatureShowcase.tsx','utf8');
const showcaseCss = readFileSync('pages/tutorialFeatureShowcase.css','utf8');
const home = readFileSync('pages/HomePage.tsx','utf8');
const highlights = readFileSync('src/data/saqrWhatsNew.ts','utf8');

// The deleted catalog-style directory and its dedicated shortcut must remain
// absent. The original tour's challenges, orbit, reading hub and mobile layout remain.
assert.ok(!tutorial.includes('TutorialPlatformDirectory'), 'Remove standalone directory entirely');
assert.ok(!tutorial.includes('tutorial-directory'), 'No orphaned directory anchor');
assert.ok(!tutorial.includes('كل صفحات صقر'), 'Remove directory-specific shortcut');
assert.ok(tutorial.includes('tutorial-challenges-details'), 'Preserve challenge shortcut');
assert.ok(tutorial.includes('tutorial-identity-details'), 'Preserve heritage shortcut');

const identityList=showcase.slice(showcase.indexOf('const heritageItems:'),showcase.indexOf('const pavilionItem:'));
assert.equal([...identityList.matchAll(/id:'(passport|words|archive|flag|anthem)'/g)].length,5,'All five identity games are previewed');
assert.ok(showcase.includes("id:'anthem'") && showcase.includes('تحدي صوت الاتحاد') && showcase.includes('Voice of the Union'));
assert.ok(showcase.includes("id:'pavilion'") && showcase.includes('tutorial-showcase-pavilion'),'Heritage books are separate from the five games');
assert.ok(showcaseCss.includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'Identity challenges follow live 3-column desktop grid');
assert.ok(showcaseCss.includes('@media(max-width:980px)') && showcaseCss.includes('@media(max-width:580px)'),'Identity grids adapt to tablets/phones');

assert.ok(tutorial.includes('<SaqrOrbitNavigation isAr={isAr} userType="admin" tourMode'),'Re-use actual Saqr orbit visuals safely');
assert.ok(tutorial.includes('className="tutorial-topbar efips-navbar-surface'),'Topbar matches live header');
assert.ok(tutorial.includes('efips-home-dashboard'),'Homepage shell matches live layout');
assert.ok(tutorial.includes('getSaqrNewsTicker(locale)')&&highlights.includes('SAQR_NEWS_HIGHLIGHTS'),'Live bilingual announcements are shared');
assert.ok(tutorial.includes('aria-pressed={newsPaused}')&&tutorial.includes('setNewsPaused(p => !p)'),'News controls actually pause/resume');
assert.ok(tutorial.includes('previewBookType')&&tutorial.includes('setPreviewBookType('));
assert.ok(tutorial.includes('<option value="digital">') && !tutorial.includes('<option value="ar">'),'Single Digital option stays locale-aware');
assert.ok(tutorial.includes('lg:grid-cols-4 gap-4') && tutorial.includes('filter(card=>previewBookType'),'Four initial cards and interactive format filter');
assert.ok(tutorial.includes('suggestionPreviewOpen && createPortal('),'View more preview opens a real dialog');
assert.ok(tutorial.includes('readingPreviewOpen && createPortal('),'Monthly challenge preview remains');
assert.ok(tutorial.includes('details defaultOpen'),'Open challenge descriptions by default');
assert.ok(tutorial.includes('hasSignedInSession'),'Only signed-in visitors can open the real homepage shortcut');
assert.ok(!tutorial.includes('supabase.from('),'Public tour displays no private records');
assert.ok(home.includes('<HomeReadingHub variant="books"')&&home.includes('<SaqrOrbitNavigation'),'Live home remains unchanged');

assert.ok(mobileCss.includes('touch-action:pan-x')&&mobileCss.includes('max-width:660px'),'Mobile nav stays horizontally scrollable');
assert.ok(mobileCss.includes('env(safe-area-inset-bottom)'),'Safe-area padding for mobile browsers');
assert.ok(mobileCss.includes('prefers-reduced-motion:reduce'),'Reduce motion and allow manual reading');
assert.ok(mobileCss.includes('animation-play-state:paused')&&mobileCss.includes('will-change:auto'),'Pause ticker and avoid costly reduced-motion composites');
console.log('PASS: tutorial omits page directory and retains bilingual bubbles, five UAE challenges and responsive interactive previews');
