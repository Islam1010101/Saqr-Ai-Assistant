import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeCatalogText, matchesCatalogQuery } from '../src/utils/catalogTextSearch.ts';

assert.equal(normalizeCatalogText('أَحْمَد مُرَاد'), 'احمد مراد', 'Arabic vowels and alef variations should not block lookup');
assert.equal(normalizeCatalogText('مكتبة القِراءَة'), 'مكتبه القراءه', 'Arabic taa marbuta normalizes consistently');
assert.equal(normalizeCatalogText('على الطريق'), normalizeCatalogText('علي الطريق'), 'Final ya variants should match');
assert.equal(normalizeCatalogText('كتاب ٢٢'), 'كتاب 22', 'Arabic digits should match English digits');
assert.equal(normalizeCatalogText('كتاب ۲۲'), 'كتاب 22', 'Persian digits should match English digits');
assert.equal(normalizeCatalogText('  À-la  carte! '), 'à la carte', 'Punctuation and whitespace are normalized without inventing terms');
assert.ok(matchesCatalogQuery('أحمد مراد', 'أحمدُ خليل', 'أحمد مَرَاد'), 'Match author without diacritics');
assert.ok(matchesCatalogQuery('كتاب روايات', 'روايات عربية', 'كتاب حديث'), 'Match multiple words across title and subject');
assert.ok(matchesCatalogQuery('رحله', 'رحلة إلى البحر'), 'Arabic taa marbuta search matches');
assert.ok(matchesCatalogQuery('BOOK   22', 'Book no. ٢٢'), 'Case, punctuation, and digit normalization');
assert.ok(matchesCatalogQuery('Pearl diving', 'Heritage stories', 'A book about diving', 'Pearl fishers'), 'Match English tokens across the record');
assert.ok(!matchesCatalogQuery('physiology', 'history'), 'Do not turn unrelated topics into matches');
assert.ok(!matchesCatalogQuery('rare uncommon', 'Rare books'), 'Every significant query token must be present');
assert.ok(matchesCatalogQuery('', 'Any book'), 'Empty search preserves all catalog records');

const page = (path: string) => readFileSync(path, 'utf8');
for (const path of ['pages/SearchPage.tsx', 'pages/ArabicLibraryInternalPage.tsx', 'pages/EnglishLibraryInternalPage.tsx']) {
  const source = page(path);
  assert.ok(source.includes("from '../src/utils/catalogTextSearch'") &&
    source.includes('matchesCatalogQuery(term, b.title, b.author'),
    'Shared normalized search must be used for '+path);
  assert.ok(source.includes("subjectFilter === 'all'") && source.includes("authorFilter === 'all'"),
    'The existing explicit filters must remain unchanged in '+path);
}
console.log('PASS: catalogue title, author, topic, punctuation, diacritics, Arabic digits and filtering');
