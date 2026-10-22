import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../App';
import { ARABIC_LIBRARY_DATABASE } from '../../pages/ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from '../../pages/EnglishLibraryInternalPage';
import { digitalBookKey, physicalReadingCatalog, type ReadingBook, useReadingPassport } from '../utils/readingPassport';
import { getLocalizedSubject } from '../../api/bookData';

const digitalCatalog: ReadingBook[] = [
  ...ARABIC_LIBRARY_DATABASE.map(book => ({
    key: digitalBookKey('ar', book), title: book.title, author: book.author,
    subject: book.subject, format: 'ar' as const, href: book.driveLink
  })),
  ...ENGLISH_LIBRARY_DATABASE.map(book => ({
    key: digitalBookKey('en', book), title: book.title, author: book.author,
    subject: book.subject, format: 'en' as const, href: book.driveLink
  }))
];
const catalog = [...physicalReadingCatalog, ...digitalCatalog];
const catalogByKey = new Map(catalog.map(book => [book.key, book]));
const labelFor = (b: ReadingBook, ar: boolean) =>
  b.format === 'physical' ? (ar ? 'كتاب ورقي' : 'Physical') :
  b.format === 'ar' ? (ar ? 'رقمي عربي' : 'Arabic digital') : (ar ? 'رقمي إنجليزي' : 'English digital');

const HomeReadingHub: React.FC<{ variant?: 'challenge' | 'books' }> = ({ variant = 'books' }) => {
  const { locale, dir } = useLanguage();
  const ar = locale === 'ar';
  const { data, toggleSaved, toggleCompleted, setGoal } = useReadingPassport();
  const [category, setCategory] = useState<'all' | 'physical' | 'ar' | 'en'>('all');
  const [tab, setTab] = useState<'saved' | 'suggested'>('saved');
  const [expanded, setExpanded] = useState(false);
  const savedBooks = useMemo(() => data.saved.map(key => catalogByKey.get(key)).filter((book): book is ReadingBook => !!book), [data.saved]);
  const completedBooks = useMemo(() => data.completed.map(key => catalogByKey.get(key)).filter((book): book is ReadingBook => !!book), [data.completed]);
  const preferredSubjects = useMemo(() => {
    const count = new Map<string, number>();
    [...savedBooks, ...completedBooks].forEach(book => count.set(book.subject, (count.get(book.subject) || 0) + 1));
    return Array.from(count).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([subject]) => subject);
  }, [savedBooks, completedBooks]);
  const suggestions = useMemo(() => {
    const pool = catalog.filter(book => (category === 'all' || book.format === category) &&
      !data.completed.includes(book.key) && !data.saved.includes(book.key));
    const matched = preferredSubjects.length ? pool.filter(book => preferredSubjects.includes(book.subject)) : [];
    const ranked = matched.length ? matched : pool;
    if (category !== 'all') return ranked.slice(0, 12);
    // Balance print, Arabic digital and English digital recommendations in the overview.
    const groups = {
      physical: ranked.filter(book => book.format === 'physical'),
      ar: ranked.filter(book => book.format === 'ar'),
      en: ranked.filter(book => book.format === 'en')
    };
    const mixed: ReadingBook[] = [];
    for (let index = 0; index < 12; index++) {
      for (const group of [groups.physical, groups.ar, groups.en]) {
        if (mixed.length < 12 && group.length) mixed.push(group.shift()!);
      }
      if (mixed.length >= 12 || !groups.physical.length && !groups.ar.length && !groups.en.length) break;
    }
    return mixed;
  }, [category, data.completed, data.saved, preferredSubjects]);
  const today = new Date();
  const thisMonth = String(today.getFullYear()) + '-' + String(today.getMonth() + 1).padStart(2, '0');
  const count = data.completed.filter(key => (data.completedOn[key] || '').startsWith(thisMonth)).length;
  const progress = Math.min(100, Math.round(count / data.goal * 100));
  const visible = tab === 'saved' ? savedBooks.filter(book => category === 'all' || book.format === category) : suggestions;
  const shown = expanded ? visible : visible.slice(0, 6);

  return (
    <section id={variant === 'challenge' ? 'monthly-reading-challenge' : 'reading-passport'} dir={dir} className="homepage-alerts relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-emerald-200 dark:border-emerald-900/80 bg-gradient-to-br from-white via-emerald-50/70 to-teal-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 shadow-[0_18px_55px_rgba(15,118,110,0.13)] p-4 sm:p-6 md:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 -end-16 w-52 h-52 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -start-16 w-52 h-52 bg-amber-300/20 dark:bg-teal-400/10 rounded-full blur-3xl" />
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg" aria-hidden="true">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v14M3 18V4c4-1 7-1 9 2 2-3 5-3 9-2v14c-4-1-7-1-9 2-2-3-5-3-9-2Z"/></svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{variant === 'challenge' ? (ar ? 'تحدي القراءة الشهري' : 'Monthly Reading Challenge') : (ar ? 'مكتبتي واقتراحات القراءة' : 'My Books & Reading Suggestions')}</h2>
              <p className="text-xs sm:text-sm mt-1 font-semibold text-slate-600 dark:text-slate-300">{variant === 'challenge' ? (ar ? 'أنجز هدفك الشهري خطوة بخطوة واحتفل بكل كتاب' : 'Reach your monthly reading goal, one book at a time') : (ar ? 'كتبك المحفوظة واقتراحات من المكتبة الورقية والرقمية' : 'Saved books and suggestions from the physical and digital libraries')}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 shadow-sm px-4 py-3 text-emerald-800 dark:text-emerald-200 font-black text-sm">
            {ar ? 'المحفوظة' : 'Saved'}: {savedBooks.length} · {ar ? 'المقروءة' : 'Read'}: {completedBooks.length}
          </div>
        </div>

        {variant === 'challenge' && (
          <>
            <div className="relative rounded-3xl border border-emerald-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex flex-wrap justify-between gap-4 items-center">
                <div>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300 mb-2">
                    <svg className="w-6 h-6 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m8 21 4-3 4 3V6H8v15ZM5 6V3h14v3M8 10h8"/></svg>
                    <span className="text-sm font-black">{ar?'جواز القارئ':'Reading Passport'}</span>
                  </div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">{ar?'هدف هذا الشهر':'This month’s goal'}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">{ar?'سجّل الكتب التي أنهيتها واختر هدفك.':'Track completed books and set a personal goal.'}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <strong className="text-3xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">{count}<span className="text-base text-slate-400">/{data.goal}</span></strong>
                  <label htmlFor="reading-goal" className="sr-only">{ar?'الهدف الشهري':'Monthly goal'}</label>
                  <select id="reading-goal" value={data.goal} onChange={e=>setGoal(Number(e.target.value))} className="rounded-xl border border-emerald-200 dark:border-slate-600 bg-emerald-50 dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm font-bold">{[1,2,3,4,5,6,8,10,12,15,20].map(n=><option value={n} key={n}>{n}</option>)}</select>
                </div>
              </div>
              <div role="progressbar" aria-label={ar?'تقدم القراءة الشهري':'Monthly reading progress'} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="mt-5 rounded-full h-4 bg-emerald-100 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 rounded-full transition-all duration-700 ease-out" style={{width:progress+'%'}} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{progress === 100 ? (ar?'أحسنت! اكتمل تحديك الشهري.':'Wonderful! Your monthly challenge is complete.') : (ar?'كل كتاب يقربك من تحقيق هدفك!':'Every finished book brings you closer!')}</p>
                <a href="#reading-passport" className="text-xs sm:text-sm font-black text-teal-700 dark:text-teal-300 underline-offset-4 hover:underline">{ar?'عرض قائمة القراءة':'Open reading list'}</a>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{ar?'الإنجازات مسجلة على هذا الجهاز فقط وليست نقاطًا رسمية.':'Progress stays on this device and does not award official points.'}</p>
          </>
        )}
        {variant === 'books' && (
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-between mb-5">
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={()=>{setTab('saved');setExpanded(false);}} className={'px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all '+(tab==='saved'?'bg-emerald-600 text-white shadow-md':'bg-white/85 dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700')}>{ar?'القراءة لاحقًا':'Read later'} ({savedBooks.length})</button>
            <button type="button" onClick={()=>{setTab('suggested');setExpanded(false);}} className={'px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all '+(tab==='suggested'?'bg-emerald-600 text-white shadow-md':'bg-white/85 dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700')}>{ar?'اقتراحات القراءة':'Book suggestions'}</button>
          </div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">{ar?'نوع الكتاب':'Book type'} <select value={category} onChange={e=>{setCategory(e.target.value as typeof category);setExpanded(false);}} className="rounded-xl ms-2 px-3 py-2 border border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            <option value="all">{ar?'الكل':'All'}</option><option value="physical">{ar?'ورقي':'Physical'}</option><option value="ar">{ar?'رقمي عربي':'Arabic digital'}</option><option value="en">{ar?'رقمي إنجليزي':'English digital'}</option>
          </select></label>
        </div>
        {shown.length ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{shown.map(book=>{
          const saved = data.saved.includes(book.key), completed=data.completed.includes(book.key);
          return <article key={book.key} className="homepage-alert-card group relative rounded-2xl border border-emerald-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 p-4 sm:p-5 shadow-sm hover:shadow-xl touch-manipulation transition-all active:scale-[.99] flex flex-col gap-3 min-w-0">
            <span className="self-start rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 px-3 py-1 text-[11px] text-emerald-800 dark:text-emerald-200 font-black">{labelFor(book, ar)}</span>
            <div dir="auto"><h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white break-words">{book.title}</h4><p className="text-sm font-semibold text-slate-500 dark:text-slate-300 mt-1">{book.author}</p></div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{book.format==='physical'?getLocalizedSubject(book.subject,locale):book.subject}{book.shelf!==undefined?' · '+(ar?'رف':'Shelf')+' '+book.shelf:''}</p>
            <div className="mt-auto flex flex-wrap gap-2">
              {book.format==='physical'?<Link to="/search" className="rounded-xl bg-sky-600 text-white px-3 py-2 text-xs font-bold">{ar?'دليل المكتبة':'Open catalog'}</Link>:<a href={book.href} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-sky-600 text-white px-3 py-2 text-xs font-bold">{ar?'قراءة الكتاب':'Read book'}</a>}
              <button type="button" onClick={()=>toggleSaved(book.key)} className="rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 px-3 py-2 text-xs font-bold">{saved?(ar?'إزالة من القائمة':'Unsave'):(ar?'القراءة لاحقًا':'Save for later')}</button>
              <button type="button" onClick={()=>toggleCompleted(book.key)} className="rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 px-3 py-2 text-xs font-bold">{completed?(ar?'إلغاء تمت القراءة':'Undo read'):(ar?'تمت القراءة':'Finished')}</button>
            </div>
          </article>;
        })}</div>:<p className="py-8 text-center text-slate-600 dark:text-slate-300 font-bold bg-white/60 dark:bg-slate-800/60 rounded-2xl">{tab==='saved'?(ar?'قائمة القراءة لاحقًا فارغة. احفظ كتابًا من المكتبة الرقمية أو دليل المكتبة.':'No saved books yet. Save a title from the digital or physical catalog.'):(ar?'لا توجد اقتراحات متاحة لهذا النوع.':'No suggestions for this book type.')}</p>}
        {!expanded && visible.length>6 && <button type="button" onClick={()=>setExpanded(true)} className="block mx-auto mt-5 text-sm font-black px-6 py-3 rounded-xl border border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors">{ar?'عرض المزيد':'Show more'} ({visible.length-6})</button>}
        )}
      </div>
    </section>
  );
};
export default HomeReadingHub;
