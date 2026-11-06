import React, { useMemo, useState } from 'react';
import { bookData } from '../../api/bookData';
import {
  buildChildrenReadingReviewQueue, childrenReviewCsv,
  type ChildrenReadingReviewEntry
} from '../utils/childrenReadingReviewQueue';
import { readingTierLabel } from '../utils/childrenReadingReferences';

type Filter = 'all' | 'sourced' | 'unsourced';
const PAGE_SIZE = 24;

/** Admin-only librarian review tools; no student information and no auto-approval. */
export default function AdminChildrenReadingReview({ isAr }: { isAr: boolean }) {
  const queue = useMemo(() => buildChildrenReadingReviewQueue(bookData), []);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const sourcedCount = queue.filter(entry => entry.sourceAvailable).length;
  const matches = useMemo(() => queue.filter(entry => {
    if (filter === 'sourced' && !entry.sourceAvailable) return false;
    if (filter === 'unsourced' && entry.sourceAvailable) return false;
    const normalized = query.trim().toLocaleLowerCase();
    return !normalized || [entry.title,entry.author,String(entry.shelf),entry.catalogIsbn]
      .some(field => field.toLocaleLowerCase().includes(normalized));
  }), [queue,filter,query]);

  const exportReview = () => {
    const content = childrenReviewCsv(matches);
    const url = URL.createObjectURL(new Blob([content], {type:'text/csv;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'EFIPS-children-reading-levels-physical-review.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const changeFilter = (next:Filter) => { setFilter(next); setLimit(PAGE_SIZE); };

  return <section id="admin-children-reading-review" aria-labelledby="children-reading-review-heading"
    className="efips-panel lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900 p-5 md:p-7 shadow-sm scroll-mt-24">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2 max-w-3xl">
        <h2 id="children-reading-review-heading" className="text-xl font-black text-sky-900 dark:text-sky-200">
          {isAr ? 'مراجعة واعتماد مستويات قراءة كتب الأطفال' : 'Children’s Reading Level Review'}
        </h2>
        <p className="text-sm font-semibold leading-7 text-slate-700 dark:text-slate-300">
          {isAr
            ? 'هذه قائمة عمل لأمين المكتبة، وليست مستويات معتمدة. تُراجع نسخة الكتاب الفعلية ومحتواه ورقم الطبعة قبل اعتماد أي مستوى. المراجع الخارجية للعنوان وحده لا تثبت مطابقة نسخة المدرسة.'
            : 'This is a librarian review queue, not a list of approved levels. Inspect the actual school edition, text and ISBN before approving a reading tier. A title-level external source is not proof that the school copy matches.'}
        </p>
      </div>
      <button type="button" onClick={exportReview}
        disabled={matches.length === 0}
        className="min-h-12 rounded-2xl bg-sky-800 px-5 py-3 text-white text-sm font-black hover:bg-sky-900 disabled:opacity-40 focus-visible:outline-4 focus-visible:outline-amber-500">
        {isAr ? 'تنزيل نموذج مراجعة Excel / CSV' : 'Download review sheet (Excel / CSV)'}
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
        <p className="text-3xl font-black tabular-nums">{queue.length}</p>
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{isAr ? 'سجلات مرشحة للمراجعة' : 'Candidate records to review'}</p>
      </div>
      <div className="rounded-2xl bg-sky-50 dark:bg-sky-950/30 p-4 border border-sky-200 dark:border-sky-900">
        <p className="text-3xl font-black tabular-nums">{sourcedCount}</p>
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{isAr ? 'لها مراجع خارجية (غير معتمدة)' : 'External references (not approved)'}</p>
      </div>
      <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-900">
        <p className="text-3xl font-black tabular-nums">{queue.length - sourcedCount}</p>
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{isAr ? 'تحتاج توثيق مستوى من المصدر' : 'Need level source and copy review'}</p>
      </div>
    </div>
    <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
      <label className="sr-only" htmlFor="children-reading-review-search">
        {isAr ? 'ابحث في قائمة مراجعة كتب الأطفال' : 'Search the children reading review queue'}
      </label>
      <input id="children-reading-review-search" type="search" value={query}
        onChange={event => {setQuery(event.target.value);setLimit(PAGE_SIZE);}}
        placeholder={isAr ? 'عنوان الكتاب، المؤلف، الرف أو ISBN…' : 'Title, author, shelf or ISBN…'}
        className="min-h-12 w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-base text-slate-900 dark:text-white focus-visible:outline-4 focus-visible:outline-sky-500" />
      <div className="flex flex-wrap gap-2" role="group" aria-label={isAr ? 'فلتر المراجعة' : 'Review queue filter'}>
        {([
          ['all',isAr?'الكل':'All'],
          ['sourced',isAr?'بمرجع':'With source'],
          ['unsourced',isAr?'دون مرجع':'No source']
        ] as [Filter,string][]).map(([value,label]) => <button key={value} type="button"
          aria-pressed={filter === value} onClick={() => changeFilter(value)}
          className={'min-h-11 rounded-xl border-2 px-3 text-sm font-black focus-visible:outline-4 focus-visible:outline-sky-500 '+
            (filter===value?'bg-sky-800 border-sky-800 text-white':'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white')}>
          {label}
        </button>)}
      </div>
    </div>
    <p role="status" className="my-3 text-sm font-bold text-slate-600 dark:text-slate-300">
      {isAr ? 'السجلات المطابقة: ' : 'Matching records: '}{matches.length}
    </p>
    <div className="max-h-[560px] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[790px] text-start text-sm">
        <thead className="sticky top-0 z-10 bg-sky-50 dark:bg-slate-800 text-slate-900 dark:text-white">
          <tr>
            <th scope="col" className="p-3 text-start">{isAr?'الكتاب وموقعه':'Book and location'}</th>
            <th scope="col" className="p-3 text-start">{isAr?'مستوى من مرجع خارجي':'External reference tier'}</th>
            <th scope="col" className="p-3 text-start">{isAr?'المطلوب قبل الاعتماد':'Checks before approval'}</th>
            <th scope="col" className="p-3 text-start">{isAr?'الحالة':'Status'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {matches.slice(0,limit).map((entry:ChildrenReadingReviewEntry) => <tr key={entry.id} className="align-top">
            <td className="p-3 max-w-[240px]">
              <p dir="auto" className="font-black text-slate-900 dark:text-white break-words">{entry.title}</p>
              <p dir="auto" className="text-xs text-slate-600 dark:text-slate-300 break-words mt-1">{entry.author}</p>
              <p className="text-xs font-bold text-sky-800 dark:text-sky-200 mt-1">
                {isAr?'رف':'Shelf'} {entry.shelf} · {isAr?'صف':'Row'} {entry.row}
              </p>
            </td>
            <td className="p-3">
              {entry.candidateTier ? <>
                <p className="font-black text-sky-900 dark:text-sky-200">
                  {readingTierLabel(entry.candidateTier, isAr?'ar':'en')}
                  <span className="text-xs font-semibold"> {isAr?'(استرشادي)':'(provisional)'}</span>
                </p>
                <p dir="auto" className="mt-1 text-xs text-slate-700 dark:text-slate-300">{entry.sourceLevel}</p>
                <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-block underline underline-offset-2 font-bold text-sky-700 dark:text-sky-300 focus-visible:outline-2">
                  {entry.sourceName}
                </a>
              </> : <p className="font-bold text-amber-800 dark:text-amber-200">
                {isAr?'لم يُوثّق بعد':'Not yet sourced'}
              </p>}
            </td>
            <td className="p-3 max-w-[280px] text-xs leading-6 text-slate-700 dark:text-slate-300">
              {isAr
                ? entry.sourceAvailable
                  ? 'طابق رقم ISBN والطبعة والصفحات ونص الكتاب مع المرجع. راجع المفردات وملاءمة المحتوى.'
                  : 'افحص الطبعة والنص والرسوم والمفردات، ثم ابحث عن مرجع موثوق للمستوى.'
                : entry.suggestedChecks}
              {entry.title==='Lincoln' && <p className="mt-1 font-black text-amber-800 dark:text-amber-200">
                {isAr?'تأكد أنها سيرة Lincoln: A Photobiography.':'Confirm this is Lincoln: A Photobiography.'}
              </p>}
            </td>
            <td className="p-3">
              <span className="inline-flex rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs font-black text-amber-900 dark:text-amber-200">
                {isAr?'بانتظار فحص النسخة':'Awaiting physical review'}
              </span>
            </td>
          </tr>)}
        </tbody>
      </table>
      {matches.length===0 && <div className="p-6 text-center text-slate-600 dark:text-slate-300">
        {isAr?'لا توجد سجلات مطابقة.':'No matching records.'}
      </div>}
    </div>
    {matches.length>limit && <button type="button" onClick={()=>setLimit(v=>v+PAGE_SIZE)}
      className="mt-4 min-h-11 rounded-xl border-2 border-sky-600 px-5 py-2 font-black text-sky-900 dark:text-sky-200 focus-visible:outline-4 focus-visible:outline-sky-500">
      {isAr?'عرض المزيد':'Show more'}
    </button>}
    <p className="mt-4 text-xs font-bold leading-6 text-slate-600 dark:text-slate-300">
      {isAr
        ? 'نزّل نموذج المراجعة، وسجّل بيانات الطبعة ورقم ISBN وملاحظة على النص والمفردات والملاءمة العمرية واسم المراجع. لا تغيّر هذه القائمة أي مستوى في فهرس الطلاب تلقائيًا.'
        : 'Download the review sheet to record ISBN, edition, text sample, vocabulary, age suitability and reviewer sign-off. This queue never changes student-facing levels automatically.'}
    </p>
  </section>;
}
