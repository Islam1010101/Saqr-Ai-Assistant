import React from 'react';
import DigitalLibraryDialog from './DigitalLibraryDialog';
import {digitalReaderSource} from '../utils/digitalReaderSource';

/** Only new admin-entered links use this viewer.
 * Existing photographed English and Arabic editions keep their original
 * verified photo readers and school Drive permission flows unchanged.
 */
export default function NewCatalogDigitalReader({title,source,locale,onBack,onClose}:{
 title:string;source:string;locale:string;onBack:()=>void;onClose:()=>void;
}){
 const ar=locale==='ar';
 const drivePreview=digitalReaderSource(source);
 const isPdf=(()=>{
  try{return new URL(source).protocol==='https:'&&/\.pdf$/i.test(new URL(source).pathname);}
  catch{return false;}
 })();
 const embedded=drivePreview||(isPdf?source:null);
 return <DigitalLibraryDialog title={title} variant="reader" onClose={onClose}>
  <section className="efips-book-reader flex flex-col min-h-[78vh] bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
   dir={ar?'rtl':'ltr'}>
   <header className="efips-reader-header flex flex-wrap gap-3 items-center justify-between">
    <img src="/school-logo.png" width={48} height={48} alt="EFIPS" className="object-contain"/>
    <h2 className="font-bold text-lg" dir="auto">{title}</h2>
    <nav className="efips-reader-nav flex flex-wrap gap-2" aria-label={ar?'أدوات القراءة':'Reading controls'}>
     <button type="button" onClick={onBack}>{ar?'تفاصيل الكتاب':'Book details'}</button>
     <a href={source} target="_blank" rel="noopener noreferrer">{ar?'المصدر الأصلي':'Original source'}</a>
     <button type="button" data-book-close onClick={onClose}>{ar?'إغلاق':'Close'}</button>
    </nav>
   </header>
   {embedded?<iframe src={embedded} title={title} className="block w-full flex-1 min-h-[70vh] bg-slate-100 dark:bg-slate-800"
    referrerPolicy="no-referrer" allow="fullscreen" loading="eager"/>:
    <div className="flex-1 grid place-content-center text-center p-8 space-y-4">
     <h3 className="text-lg font-bold">{ar?'عرض صفحات الكتاب':'Book pages'}</h3>
     <p className="text-sm">{ar?'المصدر لا يدعم العرض المدمج. افتح رابط الكتاب في مصدره الأصلي.':
      'This link does not support an embedded PDF reader. Open the source instead.'}</p>
     <a href={source} target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-emerald-300 underline">
      {ar?'فتح رابط القراءة':'Open reading link'}</a>
    </div>}
  </section>
 </DigitalLibraryDialog>;
}
