import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bookData } from '../api/bookData.ts';
import {
  buildChildrenReadingReviewQueue, childrenReviewCsv, CHILDREN_REVIEW_SHELVES
} from '../src/utils/childrenReadingReviewQueue.ts';
import {
  childReadingReferenceCount, childReadingReferenceEntries,
  getChildReadingReference
} from '../src/utils/childrenReadingReferences.ts';

const queue = buildChildrenReadingReviewQueue(bookData);
const mixedShelfCopies = bookData.filter(book =>
  CHILDREN_REVIEW_SHELVES.some(shelf => shelf === book.shelf));
for (const book of mixedShelfCopies) {
  assert.ok(queue.some(entry => entry.id === book.id),
    'Mixed child-book shelf must appear in the review queue even without an external level source: ' + book.id);
}
assert.ok(queue.length >= mixedShelfCopies.length,
  'Queue must cover all physical records on suspected or mixed child-book shelves');
assert.ok(queue.some(entry => entry.shelf === 35 && !entry.candidateTier),
  'Unreferenced Arabic/mixed-shelf books must be surfaced for human inspection, without assigned tiers');
assert.ok(queue.length >= childReadingReferenceCount,
  'Review queue should include all referenced copies and additional children candidates');
assert.equal(childReadingReferenceCount, 13,
  'Ten original references plus three independently sourced shelf 30 titles');
const matchedSourceTitles = new Set(queue.filter(book=>book.sourceAvailable).map(book=>book.title));
for (const item of childReadingReferenceEntries) {
  assert.ok(matchedSourceTitles.has(item.title),
    'Reference title must match a real physical catalogue record: '+item.title);
  assert.ok(queue.some(book=>book.title===item.title && book.shelf===item.shelf &&
    book.sourceUrl===item.sourceUrl && book.candidateTier===item.tier),
    'Reference must preserve its original source and suggested tier');
}
for (const entry of queue) {
  assert.equal(entry.status, 'awaiting_physical_review');
  assert.equal(entry.approvedTier, null, 'Never automatically approve a local-copy level');
  assert.equal(entry.sourceEditionMatched, false,
    'No physical edition has yet been inspected by a reviewer');
  assert.ok(entry.title && entry.author && Number.isInteger(entry.shelf) &&
    Number.isInteger(entry.row));
  assert.ok(bookData.some(book => book.id===entry.id),
    'All entries must be part of the current physical catalogue');
  if (entry.sourceAvailable) {
    assert.ok(entry.candidateTier && entry.sourceName && entry.sourceUrl,
      'A provisional tier must have a specific external source');
    assert.ok(getChildReadingReference(entry), 'Only exact title, author and shelf may produce a reference');
  } else {
    assert.equal(entry.candidateTier, null,
      'Unreferenced titles must never be assigned an inferred tier');
  }
}
const exportCsv = childrenReviewCsv(queue);
assert.ok(exportCsv.startsWith('\uFEFF'), 'CSV must open correctly in Excel in Arabic');
assert.equal(exportCsv.split('\r\n').length, queue.length+1,
  'CSV includes exactly one header and one row for each library record');
assert.ok(exportCsv.includes('Copy ISBN observed (fill in)') &&
  exportCsv.includes('Local copy matches source? (Yes/No)') &&
  exportCsv.includes('Final approved tier (Beginner/Intermediate/Advanced or blank)') &&
  exportCsv.includes('Reviewer name'),
  'Template must require edition matching and human librarian sign-off');
const firstHeader = exportCsv.split('\r\n')[0];
assert.equal((firstHeader.match(/","/g)||[]).length+1,27,
  'Review sheet adds three bibliographic research fields to original review columns');
const malicious = childrenReviewCsv([{...queue[0],title:'=HYPERLINK("bad")'}]);
assert.ok(malicious.includes("'=HYPERLINK("),
  'CSV must escape spreadsheet formulas in user-controlled bibliographic fields');
const panel=readFileSync('src/components/AdminChildrenReadingReview.tsx','utf8');
const dashboard=readFileSync('pages/AdminDashboard.tsx','utf8');
const catalog=readFileSync('pages/SearchPage.tsx','utf8');
assert.ok(dashboard.includes('<AdminChildrenReadingReview isAr={isAr} />') &&
  dashboard.includes("id:'admin-children-reading-review'"),
  'Only the existing admin dashboard mounts the review queue and nav link');
assert.ok(panel.includes('childrenReviewCsv(matches)') &&
  panel.includes("type:'text/csv;charset=utf-8'") &&
  panel.includes('matches.slice(0,limit)'),
  'Queue exports all filtered review records and paginates on screen');
assert.ok(!panel.includes('supabase.from(') &&
  !panel.includes('approvedTier:') &&
  !dashboard.includes('setApprovedReadingTier'),
  'Review-only UI cannot silently mutate source catalog or grant official tiers');
assert.ok(!catalog.includes('readingReferenceDisclaimer') &&
  !catalog.includes("t('readingReference')") &&
  !catalog.includes('readingTierLabel(') &&
  !catalog.includes('readingReferenceEvidence') &&
  catalog.includes("readingTierFilter"),
  'Catalog cards and detail popups fully remove provisional tier, descriptive copy and disclaimer, while preserving existing optional filter');
assert.ok(panel.includes("children-reading-review-shelf") &&
  panel.includes("bibliographicAlertEn") &&
  panel.includes("filter === 'issues'"),
  'Remaining books can be reviewed in per-shelf batches, including flagged metadata inconsistencies');
const flagged = queue.filter(entry=>Boolean(entry.bibliographicAlertEn));
assert.equal(flagged.length,2, 'Two researched catalogue inconsistencies are flagged for librarian validation');
assert.ok(flagged.some(entry=>entry.title.startsWith('M is for Mitten') && entry.bibliographySourceUrl) &&
  flagged.some(entry=>entry.title.startsWith('Give Me a Kiss') && entry.bibliographySourceUrl),
  'Mismatched author and suspicious title are documented with research evidence, not silently corrected');
assert.ok(exportCsv.includes('Bibliographic warning (EN)') &&
  exportCsv.includes('Bibliography evidence link'),
  'Full review export also includes actionable book-specific research flags');
console.log('PASS: '+queue.length+' candidate physical-copy inspections across mixed shelves; '+
  matchedSourceTitles.size+' source-matched titles; '+queue.filter(e=>e.bibliographicAlertEn).length+
  ' flagged metadata checks; zero falsely approved levels; bilingual review template');
