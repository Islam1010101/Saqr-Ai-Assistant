/** Read-only checked-out matching; no borrower identifiers enter the catalog. */
export type PublicActiveLoan = {
    book_name: string;
    book_shelf: string | null;
    book_row: string | null;
};
export type PhysicalBookLocation = {
    title: string;
    shelf: number | string;
    row: number | string;
    copies?: number;
};
export const normalizedBookTitle = (value: unknown): string =>
    String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
const loc = (value: unknown): string => String(value ?? '').normalize('NFKC').trim();

export function getPhysicalLoanBadge(
    book: PhysicalBookLocation,
    loans: readonly PublicActiveLoan[],
    titleCounts: ReadonlyMap<string, number>,
): 'out' | 'some' | null {
    const title = normalizedBookTitle(book.title);
    if (!title) return null;
    const matching = loans.filter(loan => normalizedBookTitle(loan.book_name) === title);
    if (!matching.length) return null;
    // Exact shelf and row identify the copy when present.
    const exact = matching.filter(loan =>
        loc(loan.book_shelf) !== '' && loc(loan.book_row) !== '' &&
        loc(loan.book_shelf) === loc(book.shelf) && loc(loan.book_row) === loc(book.row));
    const unknownLocation = matching.filter(loan => !loc(loan.book_shelf) || !loc(loan.book_row));
    const copies = Math.max(1, Number.isFinite(Number(book.copies)) ? Math.floor(Number(book.copies)) : 1);
    if (exact.length) return exact.length >= copies ? 'out' : 'some';
    if (!unknownLocation.length) return null;
    // A legacy loan with no location must not identify an arbitrary duplicate copy as absent.
    if ((titleCounts.get(title) || 0) !== 1) return 'some';
    return unknownLocation.length >= copies ? 'out' : 'some';
}
