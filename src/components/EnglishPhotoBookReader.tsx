import React,{useEffect,useState} from 'react';
import type {DigitalLibraryBook} from '../../api/digitalBookData';
import type {ImageBookPage} from './ImageBookPages';
import DigitalBookReader from './DigitalBookReader';
import {digitalBookKey} from '../utils/readingPassport';

type PageModule={default:Readonly<Record<string,ReadonlyArray<ImageBookPage>>>};
const PHOTO_PAGE_LOADERS:Readonly<Record<string,()=>Promise<PageModule>>>={
 b01:()=>import('../data/englishPhotoPages/b01'),
 b02:()=>import('../data/englishPhotoPages/b02'),
 b03:()=>import('../data/englishPhotoPages/b03'),
 b04:()=>import('../data/englishPhotoPages/b04'),
 b05:()=>import('../data/englishPhotoPages/b05'),
 b06:()=>import('../data/englishPhotoPages/b06'),
 b07:()=>import('../data/englishPhotoPages/b07'),
 b08:()=>import('../data/englishPhotoPages/b08'),
 b09:()=>import('../data/englishPhotoPages/b09'),
 b10:()=>import('../data/englishPhotoPages/b10'),
 b11:()=>import('../data/englishPhotoPages/b11'),
 b12:()=>import('../data/englishPhotoPages/b12'),
 b13:()=>import('../data/englishPhotoPages/b13'),
 b14:()=>import('../data/englishPhotoPages/b14'),
 b15:()=>import('../data/englishPhotoPages/b15'),
};

/** Only the chosen book's page manifest is fetched. Existing immersive glass reader stays untouched. */
export default function EnglishPhotoBookReader({book,locale,onBack,onClose}:{
 book:DigitalLibraryBook;locale:string;onBack:()=>void;onClose:()=>void;
}){
 const [pages,setPages]=useState<ReadonlyArray<ImageBookPage>|null>(null);
 const [error,setError]=useState(false);
 useEffect(()=>{
   let active=true;setPages(null);setError(false);
   const load=book.photoBatch&&PHOTO_PAGE_LOADERS[book.photoBatch];
   if(!load){setError(true);return()=>{active=false};}
   void load().then(module=>{
     if(!active)return;
     const found=module.default[String(book.id)];
     if(!found?.length || found.some((entry,i)=>entry.page!==i+1||!entry.fileId)){
       setError(true);return;
     }
     setPages(found);
   }).catch(()=>{if(active)setError(true);});
   return()=>{active=false};
 },[book.id,book.photoBatch]);
 if(!pages?.length)return <section className="efips-book-reader flex flex-col items-center justify-center gap-4 p-8 text-center" role="status">
   <h2 dir="auto" className="font-bold text-xl">{book.title}</h2>
   <p>{error?(locale==='ar'?'تعذر تحميل النسخة المصورة لهذا الكتاب.':'The image edition could not be loaded.'):
     (locale==='ar'?'جاري تجهيز صفحات الكتاب داخل قارئ صقر...':'Preparing the pages in EFIPS Reader...')}</p>
   <button type="button" onClick={onBack} className="rounded-xl bg-emerald-700 px-6 py-3 text-white font-bold">
     {locale==='ar'?'العودة لتفاصيل الكتاب':'Back to book details'}
   </button>
 </section>;
 return <DigitalBookReader title={book.title} source={book.driveLink}
    bookKey={digitalBookKey('en',book)} locale={locale}
    schoolOnly={Boolean(book.requiresSchoolGoogleAccess)}
    imagePages={pages} onBack={onBack} onClose={onClose}/>;
}
