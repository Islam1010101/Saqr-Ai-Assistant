/**
 * Librarian triage of children's physical books.
 *
 * A browsing audience is not a verified reading level. External level sources
 * must be matched against the actual EFIPS copy before school approval.
 * These entries are candidates only; nothing here changes the source catalog.
 */
import type { Book } from '../../api/bookData.ts';
import { classifyBookAudience } from '../../api/bookAudience.ts';
import { getChildReadingReference, type ChildReadingTier } from './childrenReadingReferences.ts';

export type ChildrenReadingReviewEntry = {
  id: string;
  title: string;
  author: string;
  shelf: number;
  row: number;
  catalogIsbn: string;
  catalogIsbnStatus: 'candidate' | 'verified' | '';
  candidateTier: ChildReadingTier | null;
  sourceLevel: string;
  sourceName: string;
  sourceUrl: string;
  suggestedChecks: string;
  sourceAvailable: boolean;
  sourceEditionMatched: false;
  approvedTier: null;
  status: 'awaiting_physical_review';
};

export function buildChildrenReadingReviewQueue(books: readonly Book[]): ChildrenReadingReviewEntry[] {
  const entries = books.flatMap((book): ChildrenReadingReviewEntry[] => {
    const reference = getChildReadingReference(book);
    if (!reference && classifyBookAudience(book) !== 'children') return [];
    const suggestedChecks = reference
      ? (book.title === 'Lincoln'
        ? 'Confirm that this is Lincoln: A Photobiography, not a different book called Lincoln.'
        : 'Compare the ISBN, edition, actual pages and text to the linked reference.')
      : 'Inspect the printed edition, text sample, illustrations, vocabulary and page count; locate a reliable level source.';
    return [{
      id: book.id,
      title: book.title,
      author: book.author,
      shelf: book.shelf,
      row: book.row,
      catalogIsbn: book.isbn ?? '',
      catalogIsbnStatus: book.isbnStatus ?? '',
      candidateTier: reference?.tier ?? null,
      sourceLevel: reference?.publisherLevel ?? '',
      sourceName: reference?.sourceName ?? '',
      sourceUrl: reference?.sourceUrl ?? '',
      suggestedChecks,
      sourceAvailable: Boolean(reference),
      sourceEditionMatched: false,
      approvedTier: null,
      status: 'awaiting_physical_review' as const
    }];
  });
  // References first for quick edition checking, then uncited candidates.
  return entries.sort((a,b) => Number(b.sourceAvailable)-Number(a.sourceAvailable) ||
    a.shelf-b.shelf || a.row-b.row || a.title.localeCompare(b.title));
}

/** Excel-compatible, formula-safe, UTF-8 CSV review template. */
export function childrenReviewCsv(entries: readonly ChildrenReadingReviewEntry[]): string {
  const header = [
    'Catalog ID','Title / العنوان','Author / المؤلف','Shelf / الرف','Row / الصف',
    'Catalog ISBN (unverified when candidate)','ISBN status',
    'Suggested tier (NOT APPROVED)','Reference level','Source name','Source URL',
    'Copy ISBN observed (fill in)','Edition / publisher (fill in)','Pages observed (fill in)',
    'Text sample checked? (Yes/No)','Vocabulary and sentence complexity notes',
    'Illustration support and accessibility notes','Age/content suitability checked? (Yes/No)',
    'Local copy matches source? (Yes/No)','Final approved tier (Beginner/Intermediate/Advanced or blank)',
    'Reviewer name','Review date','Review outcome (Approve/Review further)','Corrective actions / notes'
  ];
  const escapeCell = (input:unknown):string => {
    let text = String(input ?? '').replace(/\r\n?/g, '\n');
    if (/^[\s]*[=+@-]/.test(text)) text = "'" + text; // Excel formula injection defense
    return '"' + text.replace(/"/g,'""') + '"';
  };
  const rows = entries.map(entry => [
    entry.id,entry.title,entry.author,entry.shelf,entry.row,
    entry.catalogIsbn,entry.catalogIsbnStatus,
    entry.candidateTier ?? '',entry.sourceLevel,entry.sourceName,entry.sourceUrl,
    '','','','','','','','','','','','',''
  ]);
  return '\uFEFF' + [header, ...rows].map(row=>row.map(escapeCell).join(',')).join('\r\n');
}
