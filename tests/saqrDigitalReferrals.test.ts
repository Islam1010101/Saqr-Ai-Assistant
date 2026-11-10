import assert from 'node:assert/strict';
import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { searchSaqrBookCatalog } from '../src/utils/saqrCatalogSearch.ts';
import { DIGITAL_SERIES_VOLUMES } from '../src/data/digitalSeriesVolumes.js';
import { renderSaqrCatalogAnswer } from '../src/utils/saqrCatalogReply.ts';

// Saqr must refer to the new individual digital PDFs, never to a series folder.
// No changes to the physical catalog or the AI's model/prompt are needed.
const catalog = { physical: [], arabic: ARABIC_LIBRARY_DATABASE, english: ENGLISH_LIBRARY_DATABASE };
const seriesKeys = Object.keys(DIGITAL_SERIES_VOLUMES);
const newVolumes = [...ARABIC_LIBRARY_DATABASE, ...ENGLISH_LIBRARY_DATABASE]
  .filter(book => seriesKeys.some(id => String(book.id).startsWith(id + '-')));
assert.equal(newVolumes.length, 412, 'Keep the complete 412-book individual-series expansion');
assert.equal(new Set(newVolumes.map(book => String(book.id))).size, newVolumes.length);
for (const volume of newVolumes) {
  assert.match(volume.driveLink, /^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view$/);
  assert.ok(volume.title && volume.series, 'A volume requires its own title and a parent series');
}
for (const [series, ar] of [
  ['مجموعة روايات أجاثا كريستي', true],
  ['المكتبة الخضراء للأطفال', true],
  ['3D قصص الأنبياء', true],
  ['Diary Of A Wimpy', false],
] as const) {
  const matches = searchSaqrBookCatalog((ar ? 'كتب ' : 'Books in ') + series, catalog);
  const volume = matches.find(result => result.series === series);
  assert.ok(volume, 'Saqr must find individual volumes by their series: ' + series);
  assert.match(volume.driveLink || '', /^https:\/\/drive\.google\.com\/file\/d\//);
  const prefix = ar ? 'digital:ar:' : 'digital:en:';
  assert.ok(volume.bookKey?.startsWith(prefix), 'A digital referral uses a stable individual book key');
  const holding = (ar ? ARABIC_LIBRARY_DATABASE : ENGLISH_LIBRARY_DATABASE)
    .find(book => prefix + String(book.id) === volume.bookKey);
  assert.equal(volume.driveLink, holding?.driveLink, 'The referral URL must come from the recorded volume');
  const answer = renderSaqrCatalogAnswer((ar ? 'كتب ' : 'Books in ') + series, matches, ar ? 'ar' : 'en');
  assert.ok(answer.includes(series), 'Catalog answer must identify the parent series');
  assert.ok(answer.includes(volume.driveLink!), 'Catalog answer must link directly to the individual PDF');
}
console.log('PASS: all 412 individual digital-series volumes remain referral-ready and searchable in Saqr');
