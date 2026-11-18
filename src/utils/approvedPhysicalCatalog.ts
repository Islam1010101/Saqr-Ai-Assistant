import { bookData, type Book } from '../../api/bookData';
import { supabase } from './supabase';
import { physicalReadingCatalog } from './readingPassport';

export type ApprovedPhysicalCorrection = {
  catalog_id:string;title:string;author:string;shelf:number;row_number:number;
  isbn:string;publisher:string;reading_tier:'beginner'|'intermediate'|'advanced'|null;
  original_title:string;original_author:string;original_shelf:number;original_row:number;
};
const originals = new Map<string,Book>();
const importIds=new Set<string>();
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
  // Reading passports and Saqr's reading-context index hold cached records.
  // Update their existing objects in place so saved/completed book keys remain stable.
  const current=new Map(bookData.map(book=>['physical:'+book.id,book]));
  for(const entry of physicalReadingCatalog){
    const book=current.get(entry.key);
    if(!book)continue;
    entry.title=book.title;entry.author=book.author;entry.shelf=book.shelf;entry.row=book.row;
  }
  return changed;
}
export type ApprovedOrisonImport={
  source_key:string;title:string;author:string;isbn:string;barcodes:string[];
  publisher:string;shelf:number;row_number:number
};
const same=(s:string)=>String(s||'').normalize('NFKC').toLocaleLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu,'');
export function applyApprovedOrisonImports(imports:ApprovedOrisonImport[]):number {
  // A rejected/unapproved import must immediately disappear from all in-memory catalogues.
  for(let i=bookData.length-1;i>=0;i--)if(importIds.has(bookData[i].id))bookData.splice(i,1);
  for(let i=physicalReadingCatalog.length-1;i>=0;i--)
    if(importIds.has(physicalReadingCatalog[i].key.replace(/^physical:/,'')))physicalReadingCatalog.splice(i,1);
  importIds.clear();
  let count=0;
  for(const row of imports){
    if(!/^orison-xlsx-20261118-[0-9]{5,12}$/.test(row.source_key)||
       !row.title?.trim()||!row.author?.trim()||
       !Number.isInteger(row.shelf)||row.shelf<1||
       !Number.isInteger(row.row_number)||row.row_number<1)continue;
    const isbn=String(row.isbn||'').replace(/[^0-9X]/gi,'');
    // Guard old holdings; approvals can never replace or duplicate a known catalog record.
    const duplicate=bookData.some(b=>b.id===row.source_key||
      (isbn&&String(b.isbn||'').replace(/[^0-9X]/gi,'')===isbn)||
      (same(b.title)===same(row.title)&&same(b.author)===same(row.author)));
    if(duplicate)continue;
    const lang=/[\u0600-\u06ff]/.test(row.title)?'AR':'EN';
    const barcodes=Array.isArray(row.barcodes)?row.barcodes:[];
    const book:Book={id:row.source_key,title:row.title,author:row.author,
      shelf:row.shelf,row:row.row_number,language:lang,subject:'General Knowledge',
      level:'General',summary:lang==='AR'?'كتاب ورقي معتمد الموقع. ملخص المحتوى لم يُوثق بعد.':
      'Physical library holding with an approved location; content synopsis not yet verified.',
      barcodes,copies:barcodes.length||1,needsReview:true,
      ...(row.isbn?{isbn:row.isbn,isbnStatus:'candidate' as const}:{}),
      ...(row.publisher?{publisher:row.publisher}:{})};
    bookData.push(book);
    physicalReadingCatalog.push({key:'physical:'+book.id,title:book.title,author:book.author,
      subject:book.subject,format:'physical',href:'/search',shelf:book.shelf,row:book.row});
    importIds.add(book.id);
    count++;
  }
  return count;
}
export async function syncApprovedPhysicalCatalog():Promise<number> {
  const {data,error}=await supabase.functions.invoke('admin-children-book-reviews',{body:{action:'catalog'}});
  if(error||!data?.ok||!Array.isArray(data.records)||!Array.isArray(data.imports))throw new Error('Approved catalog sync unavailable');
  const corrected=applyApprovedPhysicalCorrections(data.records);
  return corrected+applyApprovedOrisonImports(data.imports);
}
