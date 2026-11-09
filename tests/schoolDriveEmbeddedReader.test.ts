import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ENGLISH_LIBRARY_DATABASE, ARABIC_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { readerFileId } from '../src/server/digitalBookPdf.ts';
import { digitalReaderSource } from '../src/utils/digitalReaderSource.ts';

const englishUi=readFileSync('pages/EnglishLibraryInternalPage.tsx','utf8');
const readerUi=readFileSync('src/components/DigitalBookReader.tsx','utf8');

const schoolBooks=ENGLISH_LIBRARY_DATABASE.filter(book=>book.requiresSchoolGoogleAccess);
assert.equal(schoolBooks.length,21,'Keep the 14 + 7 school-only English books in the catalog');
assert.equal(ENGLISH_LIBRARY_DATABASE.length,75,'Do not remove or duplicate English books');
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
  'Provide a clear, school-login-aware restricted-file reading mode');
assert.ok(readerUi.includes('href={source} target="_blank"'),
  'Keep an alternate signed-in Drive tab for browsers blocking third-party cookies');

for(const book of schoolBooks){
  const id=String(book.id);
  assert.ok(digitalReaderSource(book.driveLink)?.endsWith('/preview'),
    'School-only books must have Google Drive iframe previews: '+book.title);
  assert.equal(readerFileId('digital:en:'+id),null,
    'Do not leak school-only PDFs through anonymous /api/digital-book: '+book.title);
}
assert.equal(readerFileId('digital:en:9'),'1i7G7xoUBk77DPDYyNzEkxMGsJi5XA2gc',
  'Previous public English PDF reader must stay functional');
const existingVolume=ENGLISH_LIBRARY_DATABASE.find(b=>b.series==='Diary Of A Wimpy');
assert.ok(existingVolume && readerFileId('digital:en:'+existingVolume.id),
  'Existing series PDF transport must not change');
console.log('PASS: all 21 school-only books open inside EFIPS preview, never the public byte-range API; existing readers unchanged');
