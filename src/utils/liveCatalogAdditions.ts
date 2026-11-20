import {useSyncExternalStore} from 'react';
import {supabase} from './supabase';
import {bookData,type Book} from '../../api/bookData';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE,type DigitalLibraryBook} from '../../api/digitalBookData';
import {physicalReadingCatalog} from './readingPassport';
import {NATIONAL_IDENTITY_DIGITAL_BOOKS} from '../../api/nationalIdentityDigitalBooks';
import {refreshNationalIdentityBooks} from './nationalIdentityCatalog';

/**
 * A read-only overlay of admin-approved holdings. It never replaces original
 * catalog rows or changes Saqr's intent router, prompts, providers or answers.
 * Pending/unlocated inventory entries are deliberately excluded.
 */
export type AdminCatalogHolding={
 id:string;kind:'physical'|'digital';status:'approved'|'pending';language:'ar'|'en';
 title:string;author:string;isbn:string;cabinet:number|null;shelf_row:number|null;
 subject:string;book_url:string;audio_url:string;summary:string;created_at:string;national_identity?:boolean;
 publisher?:string;bio?:string;
};
const activePhysical=new Set<string>();
const activeArabic=new Set<string>();
const activeEnglish=new Set<string>();
const activeNationalDigital=new Set<string>();
const listeners=new Set<()=>void>();
let revision=0;
let inflight:Promise<number>|null=null;
const notify=()=>{revision++;listeners.forEach(callback=>callback());};
export const useAdminCatalogRevision=()=>useSyncExternalStore(
 callback=>{listeners.add(callback);return()=>{listeners.delete(callback);};},
 ()=>revision,()=>0
);
const normalized=(v:unknown)=>String(v??'').normalize('NFKC').toLocaleLowerCase()
 .replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا')
 .replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\p{L}\p{N}]+/gu,'');
const isbnKey=(v:unknown)=>String(v??'').toUpperCase().replace(/[\s-]/g,'');
export const samePhysicalHolding=(candidate:{
 title:string;author:string;isbn?:string;cabinet?:number|null;shelf_row?:number|null
},records:ReadonlyArray<{title:string;author:string;isbn?:string;shelf:number;row:number}> = bookData)=>{
 const title=normalized(candidate.title),author=normalized(candidate.author),isbn=isbnKey(candidate.isbn);
 return records.some(b=>b.shelf===candidate.cabinet&&b.row===candidate.shelf_row&&
  (isbn&&isbnKey(b.isbn)?isbn===isbnKey(b.isbn):
   title===normalized(b.title)&&author===normalized(b.author)));
};
const dropOld=()=>{
 for(let i=bookData.length-1;i>=0;i--)if(activePhysical.has(bookData[i].id))bookData.splice(i,1);
 for(let i=physicalReadingCatalog.length-1;i>=0;i--)if(activePhysical.has(
  physicalReadingCatalog[i].key.replace(/^physical:/,'')))physicalReadingCatalog.splice(i,1);
 for(let i=ARABIC_LIBRARY_DATABASE.length-1;i>=0;i--)if(activeArabic.has(String(ARABIC_LIBRARY_DATABASE[i].id)))ARABIC_LIBRARY_DATABASE.splice(i,1);
 for(let i=ENGLISH_LIBRARY_DATABASE.length-1;i>=0;i--)if(activeEnglish.has(String(ENGLISH_LIBRARY_DATABASE[i].id)))ENGLISH_LIBRARY_DATABASE.splice(i,1);
 for(let i=NATIONAL_IDENTITY_DIGITAL_BOOKS.length-1;i>=0;i--)if(activeNationalDigital.has(String(NATIONAL_IDENTITY_DIGITAL_BOOKS[i].id)))NATIONAL_IDENTITY_DIGITAL_BOOKS.splice(i,1);
 activePhysical.clear();activeArabic.clear();activeEnglish.clear();activeNationalDigital.clear();
};
const noninventedSummary=(h:AdminCatalogHolding)=>
 h.summary?.trim() || (h.language==='ar'
  ? 'كتاب أُضيف إلى فهرس المكتبة؛ ملخص المحتوى لم يُوثّق بعد.'
  : 'Catalogued library holding; the content synopsis has not yet been verified.');
export function applyApprovedAdminHoldings(holdings:ReadonlyArray<AdminCatalogHolding>):number {
 dropOld();
 let added=0;
 for(const h of holdings){
  if(h.status!=='approved'||!h.title?.trim()||!h.author?.trim())continue;
  const suffix=String(h.id||'').replace(/-/g,'');
  if(!/^[a-f0-9]{32}$/i.test(suffix))continue;
  if(h.kind==='physical'){
   if(!Number.isInteger(h.cabinet)||!Number.isInteger(h.shelf_row)||Number(h.cabinet)<1||Number(h.shelf_row)<1)continue;
   if(samePhysicalHolding({title:h.title,author:h.author,isbn:h.isbn,cabinet:h.cabinet,shelf_row:h.shelf_row}))continue;
   const book:Book&{nationalIdentity?:boolean}={
    id:'efips-added-'+suffix,title:h.title,author:h.author,subject:h.subject||'Unclassified',
    isbn:h.isbn||undefined,isbnStatus:h.isbn?'candidate':undefined,
    shelf:Number(h.cabinet),row:Number(h.shelf_row),language:h.language==='ar'?'AR':'EN',
    summary:noninventedSummary(h),needsReview:true,copies:1,
    nationalIdentity:h.national_identity===true
   };
   bookData.push(book);activePhysical.add(book.id);
   physicalReadingCatalog.push({
    key:'physical:'+book.id,title:book.title,author:book.author,subject:book.subject,
    format:'physical',href:'/search',shelf:book.shelf,row:book.row
   });
  }else if(h.kind==='digital'&&/^https:\/\//i.test(h.book_url)){
   const books=h.national_identity===true?NATIONAL_IDENTITY_DIGITAL_BOOKS:(h.language==='ar'?ARABIC_LIBRARY_DATABASE:ENGLISH_LIBRARY_DATABASE);
   const duplicate=books.some(book=>String(book.driveLink).split('?')[0]===String(h.book_url).split('?')[0]);
   if(duplicate)continue;
   const id='EFIPS_ADD_'+suffix;
   const book:DigitalLibraryBook={
    id,title:h.title,author:h.author,subject:h.subject||'Unclassified',
    driveLink:h.book_url,audioId:h.audio_url||undefined,
    summary:noninventedSummary(h),
    publisher:h.publisher||undefined,
    bio:h.bio||(h.language==='ar'?'لم تُوثق نبذة المؤلف بعد.':'Author biography not yet verified.'),
    readingAudience:undefined
   };
   books.push(book);
   (h.national_identity===true?activeNationalDigital:(h.language==='ar'?activeArabic:activeEnglish)).add(id);
  }else continue;
  added++;
 }
 refreshNationalIdentityBooks();
 notify();
 return added;
}

export type AdminPhysicalEdit={
 catalog_id:string;title:string;author:string;isbn:string;cabinet:number;shelf_row:number;
 national_identity:boolean;
};
/** Small metadata-only overlays for existing printed books. They keep original book IDs stable. */
export function applyAdminPhysicalEdits(rows:ReadonlyArray<AdminPhysicalEdit>):number{
 const byId=new Map(bookData.map(book=>[book.id,book]));
 let changed=0;
 for(const edit of rows){
  if(!edit.catalog_id||edit.catalog_id.startsWith('efips-added-')||
     !edit.title?.trim()||!edit.author?.trim()||
     !Number.isInteger(edit.cabinet)||edit.cabinet<1||
     !Number.isInteger(edit.shelf_row)||edit.shelf_row<1)continue;
  const book=byId.get(edit.catalog_id) as (Book&{nationalIdentity?:boolean})|undefined;
  if(!book)continue;
  book.title=edit.title;book.author=edit.author;
  book.shelf=edit.cabinet;book.row=edit.shelf_row;
  book.isbn=edit.isbn||undefined;
  book.isbnStatus=edit.isbn?'candidate':undefined;
  book.nationalIdentity=edit.national_identity===true;
  const readingEntry=physicalReadingCatalog.find(entry=>entry.key==='physical:'+book.id);
  if(readingEntry){
   readingEntry.title=book.title;readingEntry.author=book.author;
   readingEntry.shelf=book.shelf;readingEntry.row=book.row;
  }
  changed++;
 }
 refreshNationalIdentityBooks();
 notify();
 return changed;
}


export type AdminCatalogControl={
 library:'physical'|'ar'|'en'|'national';book_id:string;action:'update'|'delete';
 title:string;author:string;subject:string;publisher:string;bio:string;
 summary:string;book_url:string;audio_url:string;
};

/** Apply published corrections and permanent exclusions in all active catalog arrays.
 * Book IDs remain stable. Historical loans/reading logs are not deleted.
 */
export function applyAdminCatalogControls(rows:ReadonlyArray<AdminCatalogControl>):number{
 let affected=0;
 for(const row of rows){
  const books=row.library==='physical'?bookData:
   row.library==='ar'?ARABIC_LIBRARY_DATABASE:
   row.library==='en'?ENGLISH_LIBRARY_DATABASE:NATIONAL_IDENTITY_DIGITAL_BOOKS;
  const index=books.findIndex(book=>String(book.id)===row.book_id);
  if(index<0)continue;
  if(row.action==='delete'){
   books.splice(index,1);
   if(row.library==='physical'){
    for(let i=physicalReadingCatalog.length-1;i>=0;i--)
     if(physicalReadingCatalog[i].key==='physical:'+row.book_id)physicalReadingCatalog.splice(i,1);
   }
   affected++;
   continue;
  }
  if(row.action!=='update'||row.library==='physical')continue;
  const book=books[index] as DigitalLibraryBook;
  if(!row.title?.trim()||!row.author?.trim()||!row.subject?.trim()||
     !/^https:\/\//i.test(row.book_url))continue;
  book.title=row.title;book.author=row.author;book.subject=row.subject;
  book.publisher=row.publisher||undefined;
  book.bio=row.bio;book.summary=row.summary;
  book.driveLink=row.book_url;book.audioId=row.audio_url||undefined;
  affected++;
 }
 refreshNationalIdentityBooks();
 notify();
 return affected;
}

export function refreshAdminCatalogAdditions():Promise<number>{
 if(inflight)return inflight;
 inflight=(async()=>{
  const {data,error}=await supabase.from('efips_admin_catalog_books')
   .select('id,kind,status,language,title,author,isbn,cabinet,shelf_row,subject,book_url,audio_url,summary,created_at,national_identity,publisher,bio')
   .eq('status','approved').order('created_at',{ascending:true}).limit(5000);
  if(error)throw error;
  const count=applyApprovedAdminHoldings((data||[]) as AdminCatalogHolding[]);
  const edits=await supabase.from('efips_admin_physical_edits')
   .select('catalog_id,title,author,isbn,cabinet,shelf_row,national_identity')
   .order('edited_at',{ascending:true}).limit(10000);
  if(edits.error)throw edits.error;
  applyAdminPhysicalEdits((edits.data||[]) as AdminPhysicalEdit[]);
  const controls=await supabase.from('efips_admin_catalog_controls')
   .select('library,book_id,action,title,author,subject,publisher,bio,summary,book_url,audio_url')
   .order('updated_at',{ascending:true}).limit(15000);
  if(controls.error)throw controls.error;
  applyAdminCatalogControls((controls.data||[]) as AdminCatalogControl[]);
  return count;
 })().finally(()=>{inflight=null;});
 return inflight;
}
