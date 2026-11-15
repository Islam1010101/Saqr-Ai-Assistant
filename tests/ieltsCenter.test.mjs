import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(path, 'utf8');
const catalog = read('src/data/ieltsResources.ts');
const start = catalog.indexOf(' = [');
const end = catalog.indexOf('];\n\nexport const findIeltsResource',start);
assert.ok(start !== -1 && end !== -1, 'IELTS resource records must be a standalone literal inventory');
const books = JSON.parse(catalog.slice(start + 3, end + 1));

test('IELTS Drive metadata has 19 volumes and 5 specialist references', () => {
  assert.equal(books.length,24);
  const volumes=books.filter(b=>b.category==='cambridge');
  assert.equal(volumes.length,19);
  assert.equal(books.length-volumes.length,5);
  assert.deepEqual(volumes.map(b=>b.sortOrder), Array.from({length:19},(_,i)=>i+1));
  assert.equal(new Set(books.map(b=>b.id)).size,24,'Stable catalog IDs must be unique');
  assert.equal(new Set(books.map(b=>b.driveLink)).size,24,'Each resource links to a distinct PDF');
  assert.ok(books.every(b=>/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view$/.test(b.driveLink)));
  assert.ok(books.every(b=>Number.isSafeInteger(b.fileSizeBytes)&&b.fileSizeBytes>1000));
  assert.ok(books.filter(b=>b.category==='cambridge').every(b=>b.track==='general'||b.track==='unspecified'));
  assert.ok(books.filter(b=>b.category==='cambridge'&&b.sortOrder<=10).every(b=>b.track==='unspecified'));
  assert.ok(books.filter(b=>b.category==='cambridge'&&b.sortOrder>=11).every(b=>b.track==='general'));
});

test('IELTS route and visible discovery links are separate from the existing English catalogue',()=>{
  const app=read('App.tsx'), page=read('pages/IeltsPreparationCenterPage.tsx');
  const english=read('pages/EnglishLibraryInternalPage.tsx');
  const root=read('pages/DigitalLibraryPage.tsx');
  const db=read('api/digitalBookData.ts');
  assert.match(app,/path="\/digital-library\/english\/ielts"/);
  assert.match(app,/ProtectedRoute><IeltsPreparationCenterPage/);
  assert.match(english,/navigate\('\/digital-library\/english\/ielts'\)/);
  assert.doesNotMatch(root,/digital-library\/english\/ielts|مركز IELTS|IELTS Center/);
  assert.equal((english.match(/navigate\('\/digital-library\/english\/ielts'\)/g)||[]).length,1,'Exactly one IELTS entry point must remain in English Library');
  assert.match(db,/export const ENGLISH_LIBRARY_DATABASE: DigitalLibraryBook\[\] = ENGLISH_PHOTO_LIBRARY_20261111/);
  assert.doesNotMatch(db,/IELTS_RESOURCES/);
  assert.match(page,/findIeltsResource\(id\)/);
  assert.match(page,/IeltsDriveViewOnlyReader/);
  assert.match(page,/source={selected.driveLink}/);
  assert.doesNotMatch(page,/DigitalBookReader|schoolOnly=\{true\}|viewOnly=\{true\}/);
  assert.match(page,/new URLSearchParams\(location.search\).get\('open'\)/);
  assert.match(page,/resourceGroups/);
  assert.match(page,/the Official Cambridge Guide/i);
  assert.match(page,/BAND 6\.5\+/);
  assert.match(page,/PRACTICE TESTS/);
  assert.match(page,/\/SAQR%20IELTS\.png/);
  assert.doesNotMatch(page,/EFIPS DIGITAL LIBRARY\s*<\/span>\s*<h1/);
  assert.match(english,/efips-library-topbar/);
  assert.match(english,/aria-label=\{currentLocale==='ar'\?'فتح مركز IELTS':'Open IELTS Center'\}/);
  assert.match(english,/efips-library-page-title[^\n]*\n\s*<div className="mt-5 flex justify-center">/);
  assert.match(english,/shadow-\[0_0_24px_rgba\(16,185,129,0\.5\)\]/);
  assert.match(english,/motion-safe:animate-pulse/);
  assert.match(english,/<svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 drop-shadow-sm"/);
  assert.doesNotMatch(english,/efips-library-topbar[\s\S]*?<\/div>\s*\{\/\* العناوين[^\n]*[\s\S]*?navigate\('\/digital-library\/english\/ielts'\)/);
  assert.doesNotMatch(english,/IELTS STUDY CENTER|\/SAQR%20IELTS\.png/);
  assert.equal((page.match(/to="\/smart-search" state=\{\{ieltsSelfTest:true\}\}/g)||[]).length,1,
    'Only one CTA in the self-test panel launches Saqr');
  assert.doesNotMatch(page,/استكشف المراجع|جميع المراجع من فولدر|تصنيف سلسلة Cambridge|تُفتح ملفات PDF من Google Drive/);
  assert.doesNotMatch(page,/trackFilter|chooseGroup|onClick=\{\(\)=>openCoach/);
});

test('IELTS self-test entry belongs exclusively to the center navigation', () => {
  const chat = read('pages/SmartSearchPage.tsx');
  const page = read('pages/IeltsPreparationCenterPage.tsx');
  const entry = read('src/components/IeltsSaqrEntry.tsx');
  const helper = read('src/utils/ieltsSaqrPractice.ts');

  assert.match(page,/اختبر نفسك مع صقر/);
  assert.match(page,/to="\/smart-search" state=\{\{ieltsSelfTest:true\}\}/);
  assert.doesNotMatch(page,/ielts-skills-title|SKILLS\.map|coachSkill|IELTS_COACH_STARTERS/);
  assert.doesNotMatch(page,/smart-search\?ielts=/);
  assert.match(chat,/chatNavigationState\?\.ieltsSelfTest === true/);
  assert.doesNotMatch(chat,/chatSearch|location\.search\).get\('ielts'\)/);
  assert.match(chat,/showIeltsSkillChoice && !hasConversation/);
  assert.match(chat,/navigate\('\/smart-search', \{ replace: true, state: null \}\)/);
  assert.match(chat,/const practicePrompt = ieltsSaqrPracticeRequest\(skill, locale\)/);
  assert.match(chat,/ieltsLaunchPromptRef\.current = practicePrompt/);
  assert.match(chat,/handleSendMessage\(practicePrompt\)/);
  assert.match(chat,/index === 1 && message\.role === 'user' && ieltsLaunchPromptRef\.current === message\.content/);
  assert.match(chat,/isSaqrLibrarySearchIntent\(userQuery, messages\)/);
  assert.match(chat,/startSaqrTeacherLesson\(userQuery\)/);
  assert.match(entry,/ieltsSaqrOpening\(locale\)/);
  for(const skill of ['listening','reading','writing','speaking','mixed'])
    assert.match(helper,new RegExp("id:'"+skill+"'"));
  assert.match(helper,/IELTS_RESOURCES\.map/);
  assert.match(helper,/do not claim to have read PDF pages/);
  assert.match(helper,/do not claim an official IELTS band score/i);
  assert.match(helper,/rather than a real listening test/);
  assert.match(helper,/do not claim to assess spoken pronunciation/);
});

test('Existing login, readers, book counts and other Saqr routes stay untouched',()=>{
  const callback=read('src/components/GoogleSchoolReturn.tsx');
  assert.doesNotMatch(callback,/ieltsResources|IELTS_CAMBRIDGE_|findIeltsResource/);
  assert.match(callback,/verifySchoolLoginWithRetry/);
  assert.match(callback,/localStorage.setItem\('user_type', role\)/);
  assert.match(callback,/EN_NEW_\[0-9\]\{8\}/);
  const reader=read('src/components/DigitalBookReader.tsx');
  assert.match(reader,/enableSchoolReader/);
  const db=read('api/digitalBookData.ts');
  assert.match(db,/export const ENGLISH_LIBRARY_DATABASE: DigitalLibraryBook\[\] = ENGLISH_PHOTO_LIBRARY_20261111/);
});
