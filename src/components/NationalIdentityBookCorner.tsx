import React,{useMemo,useState} from 'react';
import {nationalIdentityBooks,searchNationalIdentityBooks} from '../utils/nationalIdentityCatalog';
const FlagBook=()=> <svg viewBox="0 0 64 64" width="52" height="52" fill="none" aria-hidden="true"><rect x="9" y="7" width="46" height="51" rx="5" fill="#fff" stroke="#08794A" strokeWidth="3"/><path d="M10 9h11v47H10" fill="#d82534"/><path d="M21 9h33v15H21" fill="#08874C"/><path d="M21 41h33v15H21" fill="#141414"/></svg>;
export default function NationalIdentityBookCorner({lang}:{lang:'ar'|'en'}){
 const ar=lang==='ar';
 const [query,setQuery]=useState('');
 const [showAll,setShowAll]=useState(false);
 const books=useMemo(()=>searchNationalIdentityBooks(query),[query]);
 const displayed=query.trim()||showAll?books:books.slice(0,12);
 return <section className="mt-8 rounded-[2rem] border-2 border-emerald-700/30 dark:border-emerald-600/40 overflow-hidden bg-[#F9FBF7] dark:bg-[#0C1511]" aria-label={ar?'ركن الهوية الوطنية':'National Identity Book Corner'}>
   <div className="flex h-2" aria-hidden="true"><span className="w-1/4 bg-red-600"/><span className="w-1/4 bg-emerald-600"/><span className="w-1/4 bg-white"/><span className="w-1/4 bg-black"/></div>
   <div className="p-5 sm:p-8">
     <div className="flex flex-wrap gap-4 justify-between items-center"><div className="flex items-center gap-3"><FlagBook/><div><p className="font-bold text-xs text-emerald-700 dark:text-emerald-300">{ar?'من ذاكرة الوطن':'Emirati Heritage'}</p><h2 className="font-black text-2xl mt-1">{ar?'ركن الهوية الوطنية':'National Identity Book Corner'}</h2><p className="text-sm mt-2 text-slate-600 dark:text-slate-300">{ar?'كتب الرف 41 والكتب الإماراتية المؤكدة في الفهرس الورقي':'Shelf 41 and UAE-specific verified physical titles'}</p></div></div><strong className="text-2xl text-emerald-700 dark:text-emerald-300">{nationalIdentityBooks.length} <span className="text-sm">{ar?'كتاب':'books'}</span></strong></div>
     <label htmlFor="nh-book-search" className="font-bold text-sm block mt-7 mb-2">{ar?'ابحث بالعنوان أو المؤلف':'Search title or author'}</label>
     <input id="nh-book-search" type="search" value={query} onChange={e=>{setQuery(e.target.value);setShowAll(false)}} className="block w-full max-w-xl p-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-950 focus:border-emerald-600 outline-none" placeholder={ar?'عنوان الكتاب أو اسم المؤلف...':'Book title or author...'}/>
     <p role="status" className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">{ar?'نتائج البحث: ':'Results: '}{books.length}</p>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">{displayed.map(book=><article key={book.id} className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
       <div className="flex h-1.5" aria-hidden="true"><span className="w-1/4 bg-red-600"/><span className="w-1/4 bg-emerald-600"/><span className="w-1/4 bg-white"/><span className="w-1/4 bg-black"/></div>
       <div className="p-5"><div className="flex items-center justify-between"><FlagBook/><span className="text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 px-3 py-2">{ar?'رف':'Shelf'} {book.shelf}</span></div><h3 className="font-black text-base leading-7 mt-3">{book.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{ar?'المؤلف':'Author'}: {book.author}</p><p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-2">{ar?'الصف':'Row'} {book.row}</p></div>
     </article>)}</div>
     {!displayed.length&&<p className="text-center p-8 text-sm">{ar?'لا توجد نتائج مطابقة للعنوان أو المؤلف.':'No matching book title or author.'}</p>}
     {!query.trim()&&!showAll&&books.length>12&&<button onClick={()=>setShowAll(true)} className="mt-5 rounded-xl px-5 py-3 bg-emerald-700 text-white font-bold">{ar?'عرض كل الكتب':'Show all books'}</button>}
     <p className="text-xs mt-5 text-slate-500 dark:text-slate-400">{ar?'هذه عناوين ورقية مسجلة بالفهرس؛ التوفر للاستعارة يحتاج تحققًا.':'These are recorded physical titles; current loan availability is not confirmed.'}</p>
   </div>
 </section>;
}