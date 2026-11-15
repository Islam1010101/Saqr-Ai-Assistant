import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

// The existing shared book reader is unchanged outside the opt-in IELTS view-only UI.
const BASELINE = 'fa6c9a6a47ae5f1deb43e1cdd5e57b84aa931f5c';
const read = path => readFileSync(path,'utf8');
const reader = read('src/components/DigitalBookReader.tsx');
const page = read('pages/IeltsPreparationCenterPage.tsx');
const css = read('src/components/digitalBookReader.css');
const allowedReaderPatches = [
  [
    "schoolOnly = false, viewOnly = false, sourceSizeBytes",
    "schoolOnly = false, sourceSizeBytes"
  ],
  [
    "  /** IELTS-only read-in-browser mode: no Drive iframe preview, download or print actions. */\n  viewOnly?: boolean;\n",
    ""
  ],
  [
    "  // Google preview is never the default in view-only mode because its toolbar can\n  // offer Download/Print when the owner has not restricted them. A fallback is\n  // allowed only if Google explicitly reports downloading is blocked.\n",
    ""
  ],
  [
    "  const allowDrivePreview = !viewOnly && (!schoolOnly || (Number.isSafeInteger(sourceSizeBytes) && Number(sourceSizeBytes) > 0 && Number(sourceSizeBytes) <= 20 * 1024 * 1024));",
    "  const allowDrivePreview = !schoolOnly || (Number.isSafeInteger(sourceSizeBytes) && Number(sourceSizeBytes) > 0 && Number(sourceSizeBytes) <= 20 * 1024 * 1024);"
  ],
  [
    "  const reportReaderError = (failure: Error) => {\n    setError(failure);\n    const code=(failure as Error & {code?:string}).code || failure.message;\n    const restrictedDrivePreview=viewOnly && schoolOnly && code==='SCHOOL_DRIVE_DOWNLOAD_BLOCKED';\n    setShowPreview(restrictedDrivePreview ? Boolean(preview) : !schoolOnly && !viewOnly);\n  };",
    "  const reportReaderError = (failure: Error) => { setError(failure); setShowPreview(!schoolOnly); };"
  ],
  [
    "    <section className={`efips-book-reader${imagePages?.length ? ' efips-book-reader--images' : ''}${viewOnly ? ' efips-book-reader--view-only' : ''}`} dir={ar ? 'rtl' : 'ltr'}\n      onContextMenu={viewOnly ? event => event.preventDefault() : undefined}\n      onDragStart={viewOnly ? event => event.preventDefault() : undefined}\n      onKeyDownCapture={viewOnly ? event => {\n        if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === 's' || event.key.toLowerCase() === 'p')) {\n          event.preventDefault();\n          event.stopPropagation();\n        }\n      } : undefined}>",
    "    <section className={`efips-book-reader${imagePages?.length ? ' efips-book-reader--images' : ''}`} dir={ar ? 'rtl' : 'ltr'}>"
  ],
  [
    "        {viewOnly && <span className=\"efips-reader-view-only-label\" role=\"status\">{ar ? 'قراءة داخل الموقع فقط' : 'Read online only'}</span>}\n",
    ""
  ],
  [
    "          {!schoolOnly && !viewOnly && <a href={source}",
    "          {!schoolOnly && <a href={source}"
  ],
  [
    "            {viewOnly && <p role=\"status\" className=\"px-4 py-2 text-center text-xs font-bold text-emerald-800 dark:text-emerald-200\">{ar?'معاينة قراءة مقيدة من مالك الملف على Google Drive.':'Google Drive owner-restricted viewing preview.'}</p>}\n",
    ""
  ]
];

test('shared PDF reader is byte-identical to production after removing IELTS-only additions',()=>{
  let original = reader;
  for(const [addition, previous] of allowedReaderPatches){
    assert.equal(original.split(addition).length-1,1,'Expected exactly one narrowly scoped view-only reader addition');
    original = original.replace(addition,previous);
  }
  const production = execFileSync('git',['show',BASELINE+':src/components/DigitalBookReader.tsx'],{encoding:'utf8'});
  assert.equal(original,production,'No old reader, auth, pagination or Google OAuth behavior may change');
});

test('IELTS only uses read-only, authenticated in-site PDF viewer with no standard Drive preview',()=>{
  assert.match(page,/schoolOnly=\{true\}/);
  assert.match(page,/viewOnly=\{true\}/);
  assert.doesNotMatch(page,/href=\{selected\.driveLink\}|target="_blank"[^>]*selected\.driveLink/);
  assert.match(reader,/const allowDrivePreview = !viewOnly &&/);
  assert.match(reader,/restrictedDrivePreview=viewOnly && schoolOnly && code==='SCHOOL_DRIVE_DOWNLOAD_BLOCKED'/);
  assert.match(reader,/const schoolAccess = schoolOnly && schoolFileId && schoolToken/);
  assert.match(reader,/session\.user\.id===user\.id/);
  assert.match(reader,/@falcon-school\.com/);
  assert.match(reader,/!schoolOnly && !viewOnly && <a href=\{source\}/);
  assert.match(css,/@media print\s*\{\s*\.efips-book-reader--view-only \.efips-reader-stage/);
});

test('No other book reader or Saqr reasoning functions are modified',()=>{
  const pdf=read('src/components/PdfBookPages.tsx');
  assert.match(pdf,/createSchoolDrivePdfBookTask/);
  assert.doesNotMatch(pdf,/ielts|viewOnly/i);
  const saqr=read('pages/SmartSearchPage.tsx');
  assert.match(saqr,/SAQR_ELITE_PROMPT/);
  assert.match(saqr,/startSaqrTeacherLesson/);
  assert.match(saqr,/isSaqrLibrarySearchIntent/);
});
