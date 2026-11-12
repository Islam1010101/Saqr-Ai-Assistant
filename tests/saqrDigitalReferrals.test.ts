import assert from 'node:assert/strict';
import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { searchSaqrBookCatalog } from '../src/utils/saqrCatalogSearch.ts';
import { DIGITAL_SERIES_VOLUMES } from '../src/data/digitalSeriesVolumes.js';
import { PHOTO_SERIES_FOLDERS_20261111 } from '../src/data/photoSeriesFolders20261111.js';
import { renderSaqrCatalogAnswer } from '../src/utils/saqrCatalogReply.ts';

// Saqr must link to an individual book (its PDF or its verified photo-edition folder), not a collection root.
// No changes to the physical catalog or the AI's model/prompt are needed.
const catalog = { physical: [], arabic: ARABIC_LIBRARY_DATABASE, english: ENGLISH_LIBRARY_DATABASE };
const seriesKeys = Object.keys(DIGITAL_SERIES_VOLUMES);
const newVolumes = [...ARABIC_LIBRARY_DATABASE, ...ENGLISH_LIBRARY_DATABASE]
  .filter(book => seriesKeys.some(id => String(book.id).startsWith(id + '-')));
assert.equal(newVolumes.length, 242, 'All 242 currently catalogued Arabic-series volumes remain findable; retired English PDF series are excluded');
assert.equal(new Set(newVolumes.map(book => String(book.id))).size, newVolumes.length);
for (const volume of newVolumes) {
  const photoFolderId = PHOTO_SERIES_FOLDERS_20261111[String(volume.id)];
  if (photoFolderId) assert.equal(volume.driveLink, 'https://drive.google.com/drive/folders/' + photoFolderId);
  else assert.match(volume.driveLink, /^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view$/);
  assert.ok(volume.title && volume.series, 'A volume requires its own title and a parent series');
}
for (const [series, ar] of [
  ['مجموعة روايات أجاثا كريستي', true],
  ['المكتبة الخضراء للأطفال', true],
  ['3D قصص الأنبياء', true],
] as const) {
  const matches = searchSaqrBookCatalog((ar ? 'كتب ' : 'Books in ') + series, catalog);
  const volume = matches.find(result => result.series === series);
  assert.ok(volume, 'Saqr must find individual volumes by their series: ' + series);
  assert.match(volume.driveLink || '', /^https:\/\/drive\.google\.com\/(?:file\/d\/|drive\/folders\/)/);
  const prefix = ar ? 'digital:ar:' : 'digital:en:';
  assert.ok(volume.bookKey?.startsWith(prefix), 'A digital referral uses a stable individual book key');
  const holding = (ar ? ARABIC_LIBRARY_DATABASE : ENGLISH_LIBRARY_DATABASE)
    .find(book => prefix + String(book.id) === volume.bookKey);
  assert.equal(volume.driveLink, holding?.driveLink, 'The referral URL must come from the recorded volume');
  const answer = renderSaqrCatalogAnswer((ar ? 'كتب ' : 'Books in ') + series, matches, ar ? 'ar' : 'en');
  assert.ok(answer.includes(series), 'Catalog answer must identify the parent series');
  assert.ok(answer.includes(volume.driveLink!), 'Catalog answer must link to the verified individual-book source');
}
for (const title of ['Knowledge Encyclopedia','Diary of a Wimpy Kid: The Meltdown']) {
  const hits=searchSaqrBookCatalog('Books '+title,catalog);
  assert.ok(hits.some(book=>book.title===title && book.driveLink===ENGLISH_LIBRARY_DATABASE.find(entry=>entry.title===title)?.driveLink),
    'Saqr must refer to the new photo edition: '+title);
}
console.log('PASS: 242 active Arabic series volumes and new English photo books retain Saqr catalog referrals');
