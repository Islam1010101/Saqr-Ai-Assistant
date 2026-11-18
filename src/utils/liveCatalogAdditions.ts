import {useSyncExternalStore} from 'react';
import {supabase} from './supabase';
import {bookData,type Book} from '../../api/bookData';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE,type DigitalLibraryBook} from '../../api/digitalBookData';
import {physicalReadingCatalog} from './readingPassport';

/**
 * A read-only overlay of admin-approved holdings. It never replaces original
 * catalog rows or changes Saqr's intent router, prompts, providers or answers.
 * Pending/unlocated inventory entries are deliberately excluded.
 */
export type AdminCatalogHolding={
 id:string;kind:'physical'|'digital';status:'approved'|'pending';language:'ar'|'en';
 title:string;author:string;isbn:string;cabinet:number|null;shelf_row:number|null;
 subject:string;book_url:string;audio_url:string;summary:string;created_at:string;
};
const activePhysical=new Set<string>();
const activeArabic=new Set<string>();
const activeEnglish=new Set<string>();
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
  ((isbn&&isbn===isbnKey(b.isbn))||(title===normalized(b.title)&&author===normalized(b.author))));
};
const dropOld=()=>{
 for(let i=bookData.length-1;i>=0;i--)if(activePhysical.has(bookData[i].id))bookData.splice(i,1);
 for(let i=physicalReadingCatalog.length-1;i>=0;i--)if(activePhysical.has(
  physicalReadingCatalog[i].key.replace(/^physical:/,'')))physicalReadingCatalog.splice(i,1);
 for(let i=ARABIC_LIBRARY_DATABASE.length-1;i>=0;i--)if(activeArabic.has(String(ARABIC_LIBRARY_DATABASE[i].id)))ARABIC_LIBRARY_DATABASE.splice(i,1);
 for(let i=ENGLISH_LIBRARY_DATABASE.length-1;i>=0;i--)if(activeEnglish.has(String(ENGLISH_LIBRARY_DATABASE[i].id)))ENGLISH_LIBRARY_DATABASE.splice(i,1);
 activePhysical.clear();activeArabic.clear();activeEnglish.clear();
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
   const book:Book={
    id:'efips-added-'+suffix,title:h.title,author:h.author,subject:h.subject||'Unclassified',
    isbn:h.isbn||undefined,isbnStatus:h.isbn?'candidate':undefined,
    shelf:Number(h.cabinet),row:Number(h.shelf_row),language:h.language==='ar'?'AR':'EN',
    summary:noninventedSummary(h),needsReview:true,copies:1
   };
   bookData.push(book);activePhysical.add(book.id);
   physicalReadingCatalog.push({
    key:'physical:'+book.id,title:book.title,author:book.author,subject:book.subject,
    format:'physical',href:'/search',shelf:book.shelf,row:book.row
   });
  }else if(h.kind==='digital'&&/^https:\/\//i.test(h.book_url)){
   const books=h.language==='ar'?ARABIC_LIBRARY_DATABASE:ENGLISH_LIBRARY_DATABASE;
   const duplicate=books.some(book=>String(book.driveLink).split('?')[0]===String(h.book_url).split('?')[0]);
   if(duplicate)continue;
   const id='EFIPS_ADD_'+suffix;
   const book:DigitalLibraryBook={
    id,title:h.title,author:h.author,subject:h.subject||'Unclassified',
    driveLink:h.book_url,audioId:h.audio_url||undefined,
    summary:noninventedSummary(h),
    bio:h.language==='ar'?'لم تُوثق نبذة المؤلف بعد.':'Author biography not yet verified.',
    readingAudience:undefined
   };
   books.push(book);
   (h.language==='ar'?activeArabic:activeEnglish).add(id);
  }else continue;
  added++;
 }
 notify();
 return added;
}
export function refreshAdminCatalogAdditions():Promise<number>{
 if(inflight)return inflight;
 inflight=(async()=>{
  const {data,error}=await supabase.from('efips_admin_catalog_books')
   .select('id,kind,status,language,title,author,isbn,cabinet,shelf_row,subject,book_url,audio_url,summary,created_at')
   .eq('status','approved').order('created_at',{ascending:true}).limit(5000);
  if(error)throw error;
  return applyApprovedAdminHoldings((data||[]) as AdminCatalogHolding[]);
 })().finally(()=>{inflight=null;});
 return inflight;
}
