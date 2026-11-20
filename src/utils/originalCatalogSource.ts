import {bookData} from '../../api/bookData';

/** Canonical book identities captured before optional admin overlays run.
 * Used only to disambiguate deletions against legacy server-side indices. */
export const originalPhysicalBookSource=new Map(
  bookData.map(book=>[book.id,{
    title:book.title,author:book.author,shelf:book.shelf,row:book.row
  }] as const)
);
