import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../../api/digitalBookData.ts';
import { NATIONAL_IDENTITY_DIGITAL_BOOKS } from '../../api/nationalIdentityDigitalBooks.ts';
import type { Book } from '../../api/bookData.ts';
import type { ReadingBook, ReadingQuestion, ReadingRole } from './saqrReadingQuestBank.ts';
import { heritageReadingQuestDefinitions } from './saqrReadingQuestHeritageSources.ts';
import { arabicDigitalReadingQuestDefinitions } from './saqrReadingQuestArabicDigitalSources.ts';
import { englishDigitalReadingQuestDefinitions } from './saqrReadingQuestEnglishDigitalSources.ts';

/**
 * Additive source-reviewed digital challenge bank.
 * A book must have at least 5 independently checked questions to be playable.
 * This intentionally does not generate unverified content from titles or guesses.
 * The rest of the digital libraries remain available through their normal pages.
 */
const definitions = [
  ...heritageReadingQuestDefinitions,
  ...arabicDigitalReadingQuestDefinitions,
  ...englishDigitalReadingQuestDefinitions,
] as const;
const catalog = [
  ...ARABIC_LIBRARY_DATABASE,
  ...ENGLISH_LIBRARY_DATABASE,
  ...NATIONAL_IDENTITY_DIGITAL_BOOKS,
];
const allIds = new Set<string>();
export const digitalReadingChallengeBooks: ReadingBook[] = definitions.flatMap(def => {
  const locale = String(def.id).startsWith('EN_') || /^\d+$/.test(String(def.id)) ? 'en' : 'ar';
  const digital = catalog.find(book => String(book.id) === String(def.id) && (
    locale === 'ar' ? (String(book.id).startsWith('AR_') || String(book.id).startsWith('NI_')) : typeof book.id === 'number'
  ));
  const key = 'digital:' + locale + ':' + String(def.id);
  if (!digital || def.qs.length < 5 || allIds.has(key)) {
    console.warn('Digital reading challenge record needs review:', key);
    return [];
  }
  allIds.add(key);
  const book: Book & {driveLink: string} = {
    id: String(digital.id),
    title: digital.title,
    author: digital.author,
    subject: digital.subject,
    summary: digital.summary,
    publisher: digital.publisher,
    shelf: 0,
    row: 0,
    language: locale === 'ar' ? 'AR' : 'EN',
    driveLink: digital.driveLink,
  };
  const questions: ReadingQuestion[] = def.qs.map((q,index) => ({
    id: key + '-' + String(index+1),
    prompt: q[0],
    answers: [q[1], q[2], q[3]] as [string, string, string],
    correct: 0,
    reference: q[4] + ' — ' + def.sourceLabel,
  }));
  return [{
    key,
    role: def.role as ReadingRole,
    locale,
    sourceUrl: def.sourceUrl,
    sourceLabel: def.sourceLabel,
    book,
    questions,
  }];
});
