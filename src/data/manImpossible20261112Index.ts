/** November 12 replacement for the Man of the Impossible series, sourced from numbered Drive JPEGs.
 * Includes only folders whose pages were validated as a contiguous 1..N sequence.
 * Identical titles from duplicate source folders are deduplicated, preferring the longest complete edition.
 */
import { MAN_IMPOSSIBLE_20261112_CATALOG_01 } from './manImpossible20261112Catalog01';
import { MAN_IMPOSSIBLE_20261112_CATALOG_02 } from './manImpossible20261112Catalog02';
import { MAN_IMPOSSIBLE_20261112_CATALOG_03 } from './manImpossible20261112Catalog03';
import { MAN_IMPOSSIBLE_20261112_CATALOG_04 } from './manImpossible20261112Catalog04';
import { MAN_IMPOSSIBLE_20261112_CATALOG_05 } from './manImpossible20261112Catalog05';
import { MAN_IMPOSSIBLE_20261112_CATALOG_06 } from './manImpossible20261112Catalog06';
import { MAN_IMPOSSIBLE_20261112_CATALOG_07 } from './manImpossible20261112Catalog07';
import { MAN_IMPOSSIBLE_20261112_CATALOG_08 } from './manImpossible20261112Catalog08';
import { MAN_IMPOSSIBLE_20261112_CATALOG_09 } from './manImpossible20261112Catalog09';
import { MAN_IMPOSSIBLE_20261112_CATALOG_10 } from './manImpossible20261112Catalog10';
import { MAN_IMPOSSIBLE_20261112_CATALOG_11 } from './manImpossible20261112Catalog11';
import { MAN_IMPOSSIBLE_20261112_CATALOG_12 } from './manImpossible20261112Catalog12';
import { MAN_IMPOSSIBLE_20261112_CATALOG_13 } from './manImpossible20261112Catalog13';
import { MAN_IMPOSSIBLE_20261112_CATALOG_14 } from './manImpossible20261112Catalog14';

export type NewImpossibleVolume = {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly subject: string;
  readonly publisher: string;
  readonly bio: string;
  readonly summary: string;
  readonly driveLink: string;
  readonly series: string;
  readonly seriesOrder?: number;
  readonly readingAudience: 'teens';
  readonly pageCount: number;
  readonly keywords: ReadonlyArray<string>;
};

const chunks: ReadonlyArray<ReadonlyArray<NewImpossibleVolume>> = [
  MAN_IMPOSSIBLE_20261112_CATALOG_01,
  MAN_IMPOSSIBLE_20261112_CATALOG_02,
  MAN_IMPOSSIBLE_20261112_CATALOG_03,
  MAN_IMPOSSIBLE_20261112_CATALOG_04,
  MAN_IMPOSSIBLE_20261112_CATALOG_05,
  MAN_IMPOSSIBLE_20261112_CATALOG_06,
  MAN_IMPOSSIBLE_20261112_CATALOG_07,
  MAN_IMPOSSIBLE_20261112_CATALOG_08,
  MAN_IMPOSSIBLE_20261112_CATALOG_09,
  MAN_IMPOSSIBLE_20261112_CATALOG_10,
  MAN_IMPOSSIBLE_20261112_CATALOG_11,
  MAN_IMPOSSIBLE_20261112_CATALOG_12,
  MAN_IMPOSSIBLE_20261112_CATALOG_13,
  MAN_IMPOSSIBLE_20261112_CATALOG_14,
];

const selected = new Map<string, { book: NewImpossibleVolume; chunk: string }>();
chunks.forEach((books, i) => {
  for (const book of books) {
    const key = book.title.normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('ar');
    const existing = selected.get(key);
    if (!existing || book.pageCount > existing.book.pageCount) {
      selected.set(key, { book, chunk: 'RM' + String(i + 1).padStart(2, '0') });
    }
  }
});

export const MAN_IMPOSSIBLE_20261112_CATALOG: ReadonlyArray<NewImpossibleVolume> =
  [...selected.values()].map(item => item.book)
    .sort((a,b) => (a.seriesOrder ?? 9999) - (b.seriesOrder ?? 9999) || a.title.localeCompare(b.title, 'ar', {numeric:true}));

export const MAN_IMPOSSIBLE_20261112_CHUNK_BY_ID: Readonly<Record<string, string>> =
  Object.fromEntries([...selected.values()].map(item => [item.book.id, item.chunk]));

export const MAN_IMPOSSIBLE_20261112_BOOK_IDS: ReadonlyArray<string> =
  MAN_IMPOSSIBLE_20261112_CATALOG.map(book => book.id);
