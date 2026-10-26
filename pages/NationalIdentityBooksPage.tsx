import React from 'react';
import {Link} from 'react-router-dom';
import {useLanguage} from '../App';
import NationalIdentityBookCorner from '../src/components/NationalIdentityBookCorner';
import './nationalHeritageTheme.css';

/**
 * An independent, protected page within Saqr & National Identity.
 * Book-card styles and catalog queries are reused unchanged.
 * Does not create or modify any learning-progress, loans or game state.
 */
const NationalIdentityBooksPage:React.FC=()=>{
  const {locale,dir}=useLanguage();
  const lang:'ar'|'en'=locale==='ar'?'ar':'en';
  const ar=lang==='ar';
  return <div dir={dir} className="national-heritage relative min-h-[100dvh] overflow-hidden bg-white dark:bg-black text-slate-900 dark:text-slate-100">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -end-40 w-96 h-96 rounded-full bg-emerald-200/20 dark:bg-emerald-700/10 blur-3xl"/>
      <div className="absolute top-1/2 -start-40 w-96 h-96 rounded-full bg-amber-200/15 dark:bg-amber-600/10 blur-3xl"/>
    </div>
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-16">
      <nav aria-label={ar?'التنقل':'Navigation'} className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/saqr-national-identity" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-950 text-emerald-800 dark:text-emerald-200 text-sm font-black hover:shadow-md focus-visible:outline-2 focus-visible:outline-emerald-600 transition">
          <svg className={'w-5 h-5 '+(ar?'rotate-180':'')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {ar?'العودة إلى صقر وهوية وطن':'Back to Saqr & National Identity'}
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
          <img src="/school-logo.png" alt="EFIPS" className="w-9 h-9 object-contain"/>
          <span>{ar?'مكتبة مدرسة صقر الإمارات':'EFIPS School Library'}</span>
        </div>
      </nav>
      <NationalIdentityBookCorner lang={lang}/>
    </div>
  </div>;
};
export default NationalIdentityBooksPage;
