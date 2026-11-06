/**
 * Diacritic- and punctuation-tolerant lookup for EFIPS catalogue records.
 * This changes matching only; it never changes a book's actual title, author,
 * category, edition or verified reading level.
 */
export function normalizeCatalogText(input: unknown): string {
  const digits = '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹';
  return String(input ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ئ/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/[ی]/g, 'ي').replace(/ک/g, 'ك')
    .replace(/[٠-٩۰-۹]/g, digit => String(digits.indexOf(digit) % 10))
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * All meaningful query tokens must occur in the combined searchable fields,
 * regardless of their order or of Arabic spelling variants.
 */
export function matchesCatalogQuery(query: string, ...fields: unknown[]): boolean {
  const normalizedQuery = normalizeCatalogText(query);
  if (!normalizedQuery) return true;
  const searchable = normalizeCatalogText(fields.filter(field => field != null).join(' '));
  return normalizedQuery.split(' ').every(token => searchable.includes(token));
}
