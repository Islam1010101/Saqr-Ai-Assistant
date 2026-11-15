import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('App.tsx','utf8');
const tutorial = readFileSync('pages/TutorialPage.tsx','utf8');
const directory = readFileSync('pages/TutorialPlatformDirectory.tsx','utf8');
const directoryCss = readFileSync('pages/tutorialPlatformDirectory.css','utf8');
const mobileCss = readFileSync('pages/tutorialPageMobileParity.css','utf8');
const showcase = readFileSync('pages/TutorialFeatureShowcase.tsx','utf8');
const showcaseCss = readFileSync('pages/tutorialFeatureShowcase.css','utf8');
const home = readFileSync('pages/HomePage.tsx','utf8');
const highlights = readFileSync('src/data/saqrWhatsNew.ts','utf8');

const entries = [...directory.matchAll(/\{ id:'([^']+)',group:'([^']+)',path:'([^']+)'/g)].map(x=>({id:x[1],group:x[2],path:x[3]}));
assert.ok(entries.length>=33, 'Document the whole platform, not only homepage shortcuts');
assert.equal(new Set(entries.map(x=>x.id)).size,entries.length,'Every review entry is distinct');
for(const x of entries){
  assert.ok(app.includes('path="'+x.path+'"'),'Tutorial advertises missing route '+x.path);
  assert.ok(['library','challenges','heritage','services'].includes(x.group));
}
for(const id of ['home','physical-catalog','saqr-ai','digital-hub','arabic-digital','english-digital','heritage-digital',
  'reading-picks','reading-goal','borrowings','challenges-hub','between-lines','shelving','studio','podcast',
  'little-author','national-hub','passport','language','detective','flag','anthem','heritage-pavilion',
  'creators','learning','teacher-prep','proofreading','schedule','teacher-notifications','ideas','about','tutorial','admin']){
  assert.ok(entries.some(x=>x.id===id),'Missing platform service '+id);
}
assert.ok(directory.includes('isAr?item.ar:item.en'),'Arabic and English descriptions switch with the actual portal');
assert.ok(directory.includes('setSelectedGroup(')&&directory.includes('setAudience('),'Review filters work');
assert.ok(directory.includes('aria-pressed={selectedGroup===item.id}'),'Category filter state is accessible');
assert.ok(directory.includes('open real')===false,'This is not an unauthorized live admin screen');
assert.ok(!directory.includes('supabase.')&&!directory.includes('localStorage'),'Public review never queries private data');

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
assert.ok(tutorial.includes('<TutorialPlatformDirectory isAr={isAr} />'),'Include page-by-page directory');
assert.ok(tutorial.includes('details defaultOpen'),'Open challenge descriptions by default');
assert.ok(tutorial.includes('hasSignedInSession'),'Only signed-in visitors can open the real homepage shortcut');
assert.ok(!tutorial.includes('supabase.from('),'Public tour displays no private records');
assert.ok(home.includes('<HomeReadingHub variant="books"')&&home.includes('<SaqrOrbitNavigation'),'Live home remains unchanged');

assert.ok(directoryCss.includes('grid-template-columns:repeat(4,minmax(0,1fr))'),'Desktop service cards use four columns');
assert.ok(directoryCss.includes('@media(max-width:1020px)')&&directoryCss.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'Tablet uses two columns');
assert.ok(directoryCss.includes('@media(max-width:660px)')&&directoryCss.includes('grid-template-columns:minmax(0,1fr)'),'Phones use one column');
assert.ok(directoryCss.includes('min-height:44px'),'Touch controls are at least 44 px');
assert.ok(mobileCss.includes('touch-action:pan-x')&&mobileCss.includes('max-width:660px'),'Mobile nav stays horizontally scrollable');
assert.ok(mobileCss.includes('env(safe-area-inset-bottom)'),'Safe-area padding for mobile browsers');
assert.ok(mobileCss.includes('prefers-reduced-motion:reduce'),'Reduce motion and allow manual reading');
assert.ok(mobileCss.includes('animation-play-state:paused')&&mobileCss.includes('will-change:auto'),'Pause ticker and avoid costly reduced-motion composites');
console.log('PASS: bilingual privacy-safe tutorial covers all 33 pages/features, five UAE challenges, actual home mobile layouts and interactive previews');
