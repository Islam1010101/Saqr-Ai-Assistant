import { bookData, type Book } from '../../api/bookData';
import { supabase } from './supabase';

export type ApprovedPhysicalCorrection = {
  catalog_id:string;title:string;author:string;shelf:number;row_number:number;
  isbn:string;publisher:string;reading_tier:'beginner'|'intermediate'|'advanced'|null;
  original_title:string;original_author:string;original_shelf:number;original_row:number;
};
const originals = new Map<string,Book>();
const allowedFields = ['title','author','shelf','row','isbn','isbnStatus','publisher','level'] as const;

/** Restores original catalog data before applying current approved rows; rejected edits cannot linger. */
export function applyApprovedPhysicalCorrections(rows:ApprovedPhysicalCorrection[]):number {
  const byId=new Map(bookData.map(book=>[book.id,book]));
  for(const [id,original] of originals) {
    const book=byId.get(id);
    if(book)for(const field of allowedFields)(book as any)[field]=(original as any)[field];
  }
  let changed=0;
  for(const correction of rows) {
    const book=byId.get(correction.catalog_id);
    if(!book || !correction.title?.trim() || !correction.author?.trim() || !Number.isInteger(correction.shelf) || !Number.isInteger(correction.row_number))continue;
    if(!originals.has(book.id))originals.set(book.id,{...book});
    book.title=correction.title;book.author=correction.author;
    book.shelf=correction.shelf;book.row=correction.row_number;
    if(correction.isbn)book.isbn=correction.isbn;
    if(correction.publisher)book.publisher=correction.publisher;
    if(correction.reading_tier)book.level=correction.reading_tier;
    changed++;
  }
  return changed;
}
export async function syncApprovedPhysicalCatalog():Promise<number> {
  const {data,error}=await supabase.functions.invoke('admin-children-book-reviews',{body:{action:'catalog'}});
  if(error||!data?.ok||!Array.isArray(data.records))throw new Error('Approved catalog sync unavailable');
  return applyApprovedPhysicalCorrections(data.records);
}
