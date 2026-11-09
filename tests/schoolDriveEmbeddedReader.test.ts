import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ENGLISH_LIBRARY_DATABASE, ARABIC_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { digitalReaderSource } from '../src/utils/digitalReaderSource.ts';

const englishUi=readFileSync('pages/EnglishLibraryInternalPage.tsx','utf8');
const readerUi=readFileSync('src/components/DigitalBookReader.tsx','utf8');
const readerServer=readFileSync('src/server/digitalBookPdf.ts','utf8');

const schoolBooks=ENGLISH_LIBRARY_DATABASE.filter(book=>book.requiresSchoolGoogleAccess);
assert.equal(schoolBooks.length,23,'Keep the 14 + 7 + 2 school-only English books in the catalog');
assert.equal(ENGLISH_LIBRARY_DATABASE.length,77,'Do not remove or duplicate English books');
assert.equal(ARABIC_LIBRARY_DATABASE.length,452,'Do not alter Arabic books');
assert.ok(englishUi.includes('schoolOnly={Boolean(book.requiresSchoolGoogleAccess)}'),
  'Pass school-only mode to the existing fullscreen EFIPS reader');
assert.ok(!englishUi.includes('book.requiresSchoolGoogleAccess ? (<a'),
  'Do not open a new Google Drive browser tab as the primary reading action');
assert.ok(englishUi.includes('digitalReaderSource(book.driveLink) ? (<button'),
  'Reuse the same internal read button for both school and public books');
assert.ok(readerUi.includes('!schoolOnly && <div className="efips-reader-native"'),
  'Never try to download restricted PDFs with the anonymous PDF.js proxy');
assert.ok(readerUi.includes('src={preview} loading="eager"'),
  'Render Google Drive preview directly inside the existing fullscreen reader');
assert.ok(readerUi.includes('embeddedSchoolPreview'),
  'Keep school-restricted files in a dedicated embedded preview mode');
assert.ok(!readerUi.includes('الكتاب معروض داخل واجهة مكتبة صقر عبر Google Drive'),
  'Remove the confusing banner above the school-only PDF preview');
assert.ok(readerUi.includes('{!embeddedSchoolPreview && <div className="efips-reader-preview-controls"'),
  'Do not cover school-only book pages with the old preview status toolbar');
assert.ok(readerUi.includes('{!schoolOnly && <a href={source}'),
  'Do not promote external Google Drive as a primary action for school-only books');
assert.ok(readerUi.includes('href={source} target="_blank"'),
  'Keep an alternate signed-in Drive tab for browsers blocking third-party cookies');

for(const book of schoolBooks){
  const id=String(book.id);
  assert.ok(digitalReaderSource(book.driveLink)?.endsWith('/preview'),
    'School-only books must have Google Drive iframe previews: '+book.title);
  assert.ok(id.startsWith('EN_NEW_20261109_'),'School-only additions need stable IDs');
}
assert.ok(readerServer.includes('if (!book || book.requiresSchoolGoogleAccess) return null;'),
  'Anonymous PDF proxy must explicitly reject all school-only Drive books');
assert.ok(readerServer.includes("readPublicPdfRange"),
  'Keep the original public PDF byte-range flow unchanged');
console.log('PASS: all 23 school-only books open inside EFIPS preview, never the public byte-range API; existing readers unchanged');
