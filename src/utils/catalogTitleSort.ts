/**
 * Title-only display order for book catalogs.
 * Arabic titles use Arabic collation and Latin titles use American English.
 * Mixed-language catalogs show the interface language first; no data is mutated.
 */
const arabicTitleCollator = new Intl.Collator('ar-AE', {
  usage: 'sort', sensitivity: 'base', numeric: true, ignorePunctuation: true
});
const englishTitleCollator = new Intl.Collator('en-US', {
  usage: 'sort', sensitivity: 'base', numeric: true, ignorePunctuation: true
});

const isArabicTitle = (title: string): boolean => {
  const firstLetter = String(title).normalize('NFKC').match(/\p{L}/u)?.[0] || '';
  return /\p{Script=Arabic}/u.test(firstLetter);
};

export const compareCatalogTitles = (a: string, b: string, preferredLocale: string = 'ar'): number => {
  const aArabic = isArabicTitle(a);
  const bArabic = isArabicTitle(b);
  if (aArabic !== bArabic) {
    return aArabic === preferredLocale.startsWith('ar') ? -1 : 1;
  }
  return (aArabic ? arabicTitleCollator : englishTitleCollator)
    .compare(String(a).trim(), String(b).trim());
};
