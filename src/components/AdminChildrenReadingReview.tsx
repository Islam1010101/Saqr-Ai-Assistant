import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabase';
import { bookData } from '../../api/bookData';
import {
  buildChildrenReadingReviewQueue, childrenReviewCsv,
  type ChildrenReadingReviewEntry
} from '../utils/childrenReadingReviewQueue';
import { readingTierLabel } from '../utils/childrenReadingReferences';

type Filter = 'all' | 'sourced' | 'unsourced' | 'issues';
type Review = {original_title?:string;original_author?:string;original_shelf?:number;original_row?:number;catalog_id:string;title:string;author:string;shelf:number;row_number:number;isbn:string;publisher:string;source_name:string;source_url:string;reading_tier:'beginner'|'intermediate'|'advanced'|null;decision:'pending'|'approved'|'rejected';notes:string;reviewed_at?:string;reviewed_by?:string};
type Candidate = Pick<Review,'title'|'author'|'publisher'|'isbn'|'source_name'|'source_url'>;
const fromEntry=(entry:ChildrenReadingReviewEntry):Review=>({original_title:entry.title,original_author:entry.author,original_shelf:entry.shelf,original_row:entry.row,catalog_id:entry.id,title:entry.title,author:entry.author,shelf:entry.shelf,row_number:entry.row,isbn:entry.catalogIsbn,publisher:'',source_name:entry.sourceName,source_url:entry.sourceUrl,reading_tier:entry.candidateTier,decision:'pending',notes:''});
const PAGE_SIZE = 24;

/** Admin-only librarian review tools; no student information and no auto-approval. */
export default function AdminChildrenReadingReview({ isAr }: { isAr: boolean }) {
  const queue = useMemo(() => buildChildrenReadingReviewQueue(bookData), []);
  const [filter, setFilter] = useState<Filter>('all');
  const [shelf, setShelf] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [savedReviews,setSavedReviews] = useState<Record<string,Review>>({});
  const [selected,setSelected] = useState<Review|null>(null);
  const [suggestions,setSuggestions] = useState<Candidate[]>([]);
  const [pending,setPending] = useState(false);
  const [notice,setNotice] = useState('');
  const [serviceReady,setServiceReady] = useState(false);
  const callService=async(body:Record<string,unknown>)=>{
    const {data:session}=await supabase.auth.getSession();
    if(!session.session?.access_token)throw new Error(isAr?'سجل الدخول بحساب Google إداري موثّق أولًا.':'Verified Google admin session required.');
    const {data,error}=await supabase.functions.invoke('admin-children-book-reviews',{body,headers:{Authorization:'Bearer '+session.session.access_token}});
    if(error||!data?.ok)throw new Error(String(data?.error||error?.message||'Service unavailable'));
    return data;
  };
  useEffect(()=>{
    let cancelled=false;
    void callService({action:'list'}).then(data=>{
      if(cancelled)return;
      const records:Review[]=data.records||[];
      setSavedReviews(Object.fromEntries(records.map(r=>[r.catalog_id,r])));
      setServiceReady(true);
    }).catch(error=>{if(!cancelled)setNotice(String(error?.message||error));});
    return ()=>{cancelled=true;};
  },[]);
  const startReview=(entry:ChildrenReadingReviewEntry)=>{setSelected(savedReviews[entry.id]||fromEntry(entry));setSuggestions([]);setNotice('');};
  const lookup=async()=>{
    if(!selected)return;
    setPending(true);setNotice('');
    try{
      const data=await callService({action:'lookup',title:selected.title,author:selected.author,isbn:selected.isbn});
      setSuggestions(data.suggestions||[]);
      if(!(data.suggestions||[]).length)setNotice(isAr?'لا توجد نتائج مطابقة. راجع النسخة يدويًا.':'No matching results. Review the physical copy.');
      if(data.source_errors?.length)setNotice((data.source_errors as string[]).join(', ')+(isAr?' غير متاح حاليًا.':' currently unavailable.'));
    }catch(error:any){setNotice(error.message||String(error));}
    finally{setPending(false);}
  };
  const saveReview=async(decision:Review['decision'])=>{
    if(!selected)return;
    if(decision==='approved'&&(!selected.source_url||!selected.source_name||!selected.reading_tier)){setNotice(isAr?'لا يمكن الاعتماد بدون مصدر ومستوى قراءة راجعه أمين المكتبة.':'Source and manually checked reading tier are required for approval.');return;}
    setPending(true);setNotice('');
    try{
      const data=await callService({action:'save',record:{...selected,decision}});
      const saved=data.record as Review;
      setSavedReviews(old=>({...old,[saved.catalog_id]:saved}));
      setSelected(saved);
      window.dispatchEvent(new Event('efips-catalog-approved-changed'));
      setNotice(isAr?'تم حفظ قرار المراجعة في قاعدة البيانات.':'Review decision saved to database.');
    }catch(error:any){setNotice(error.message||String(error));}
    finally{setPending(false);}
  };
  const update=(field:keyof Review,value:string|number|null)=>setSelected(old=>old?({...old,[field]:value}):old);
  const sourcedCount = queue.filter(entry => entry.sourceAvailable).length;
  const approvedCount=Object.values(savedReviews).filter(r=>r.decision==='approved').length;
  const rejectedCount=Object.values(savedReviews).filter(r=>r.decision==='rejected').length;
  const issueCount = queue.filter(entry => Boolean(entry.bibliographicAlertEn)).length;
  const shelfCounts = useMemo(() => [...new Set(queue.map(entry => savedReviews[entry.id]?.shelf??entry.shelf))]
    .sort((a,b) => a-b).map(number => ({
      number, count: queue.filter(entry => (savedReviews[entry.id]?.shelf??entry.shelf) === number).length
    })), [queue,savedReviews]);
  const matches = useMemo(() => queue.filter(entry => {
    const reviewed=savedReviews[entry.id];
    if (shelf !== 'all' && (reviewed?.shelf??entry.shelf) !== Number(shelf)) return false;
    if (filter === 'issues' && !entry.bibliographicAlertEn) return false;
    if (filter === 'sourced' && !entry.sourceAvailable) return false;
    if (filter === 'unsourced' && entry.sourceAvailable) return false;
    const normalized = query.trim().toLocaleLowerCase();
    return !normalized || [reviewed?.title||entry.title,reviewed?.author||entry.author,String(reviewed?.shelf??entry.shelf),reviewed?.isbn||entry.catalogIsbn]
      .some(field => field.toLocaleLowerCase().includes(normalized));
  }), [queue,filter,query,shelf,savedReviews]);

  const exportReview = () => {
    const content = childrenReviewCsv(matches.map(entry=>({...entry,title:savedReviews[entry.id]?.title||entry.title,author:savedReviews[entry.id]?.author||entry.author,shelf:savedReviews[entry.id]?.shelf??entry.shelf,row:savedReviews[entry.id]?.row_number??entry.row,catalogIsbn:savedReviews[entry.id]?.isbn??entry.catalogIsbn})));
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
            ? 'هذه قائمة فحص لأمين المكتبة تشمل أرفف أطفال محتملة وأرفف مختلطة، وليست قائمة بكتب أطفال مؤكدة أو مستويات معتمدة. تأكد أولًا من ملاءمة الكتاب للأطفال، ثم راجع النسخة الفعلية ونصها وطبعتها قبل اعتماد أي مستوى.'
            : 'This is a librarian inspection queue covering possible children’s books and mixed shelves, not a confirmed children’s list or approved reading levels. First verify suitability for young readers, then inspect the actual school copy, text and edition before approving any tier.'}
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
    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold">
      <span className="text-emerald-700 dark:text-emerald-300">{isAr?'معتمد':'Approved'}: {approvedCount}</span>
      <span className="text-rose-700 dark:text-rose-300">{isAr?'مرفوض':'Rejected'}: {rejectedCount}</span>
      <span className="text-slate-500">{serviceReady?(isAr?'سجل التوثيق متصل':'Review log connected'):(isAr?'سجل التوثيق غير متصل':'Review log unavailable')}</span>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <label htmlFor="children-reading-review-shelf" className="text-sm font-black text-slate-700 dark:text-slate-200">
        {isAr ? 'راجع رفًا محددًا:' : 'Review one shelf:'}
      </label>
      <select id="children-reading-review-shelf" value={shelf}
        onChange={event => {setShelf(event.target.value);setLimit(PAGE_SIZE);}}
        className="min-h-11 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm font-bold text-slate-900 dark:text-white">
        <option value="all">{isAr ? 'كل الأرفف' : 'All shelves'} ({queue.length})</option>
        {shelfCounts.map(item => <option key={item.number} value={String(item.number)}>
          {isAr ? 'رف' : 'Shelf'} {item.number} ({item.count})
        </option>)}
      </select>
      <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
        {isAr ? 'سجلات تحتاج مراجعة بياناتها: ' : 'Bibliographic checks flagged: '}{issueCount}
      </span>
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
          ['unsourced',isAr?'دون مرجع':'No source'],
          ['issues',isAr?'بيانات تحتاج تدقيق':'Metadata checks']
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
            <th scope="col" className="p-3 text-start">{isAr?'الحالة والقرار':'Status & decision'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {matches.slice(0,limit).map((entry:ChildrenReadingReviewEntry) => <tr key={entry.id} className="align-top">
            <td className="p-3 max-w-[240px]">
              <p dir="auto" className="font-black text-slate-900 dark:text-white break-words">{savedReviews[entry.id]?.title||entry.title}</p>
              <p dir="auto" className="text-xs text-slate-600 dark:text-slate-300 break-words mt-1">{savedReviews[entry.id]?.author||entry.author}</p>
              <p className="text-xs font-bold text-sky-800 dark:text-sky-200 mt-1">
                {isAr?'رف':'Shelf'} {savedReviews[entry.id]?.shelf??entry.shelf} · {isAr?'صف':'Row'} {savedReviews[entry.id]?.row_number??entry.row}
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
              {entry.bibliographicAlertEn && <div className="mb-3 rounded-xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 text-amber-950 dark:text-amber-100">
                <p className="font-black">{isAr ? 'راجع بيانات هذا الكتاب' : 'Check bibliographic metadata'}</p>
                <p className="mt-1">{isAr ? entry.bibliographicAlertAr : entry.bibliographicAlertEn}</p>
                <a href={entry.bibliographySourceUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-2 font-bold underline underline-offset-2 focus-visible:outline-2">
                  {isAr ? 'المصدر المقارن' : 'Comparison source'}
                </a>
              </div>}
              {isAr
                ? entry.sourceAvailable
                  ? 'تأكد أولًا من ملاءمة الكتاب للأطفال؛ طابق رقم ISBN والطبعة والصفحات والنص مع المرجع، ثم راجع المفردات والمحتوى.'
                  : 'تأكد أولًا من ملاءمة الكتاب للأطفال، فهو قد يكون من رف مختلط. افحص الطبعة والنص والرسوم والمفردات، ثم ابحث عن مرجع موثوق.'
                : entry.suggestedChecks}
              {entry.title==='Lincoln' && <p className="mt-1 font-black text-amber-800 dark:text-amber-200">
                {isAr?'تأكد أنها سيرة Lincoln: A Photobiography.':'Confirm this is Lincoln: A Photobiography.'}
              </p>}
            </td>
            <td className="p-3">
              <span className="inline-flex rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-black">
                {savedReviews[entry.id]?.decision==='approved'?(isAr?'معتمد':'Approved'):savedReviews[entry.id]?.decision==='rejected'?(isAr?'مرفوض':'Rejected'):(isAr?'بانتظار المراجعة':'Awaiting review')}
              </span>
              <button type="button" onClick={()=>startReview(entry)} className="mt-2 block rounded-xl bg-sky-800 text-white px-3 py-2 text-xs font-bold">{isAr?'مراجعة / تعديل':'Review / Edit'}</button>
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
    {selected&&<div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-3" role="presentation">
      <div role="dialog" aria-modal="true" aria-label={isAr?'تحرير وتوثيق الكتاب':'Edit and verify book'} className="w-full max-w-3xl max-h-[90dvh] overflow-auto rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-2xl text-slate-900 dark:text-white">
        <div className="flex justify-between items-center gap-3 mb-4"><h3 className="text-lg font-black">{isAr?'مراجعة بيانات الكتاب وتوثيقها':'Book metadata & verification'}</h3><button onClick={()=>setSelected(null)} className="rounded-lg border px-3 py-2">{isAr?'إغلاق':'Close'}</button></div>
        <p className="text-xs text-amber-700 dark:text-amber-300 mb-4">{isAr?'التوثيق قرار إداري بعد مطابقة النسخة المدرسية الفعلية. مصادر البحث تقدم اقتراحات ولا تعدل بيانات الكتاب تلقائيًا.':'Approval requires checking the actual school copy. Search results are suggestions only.'}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([['title',isAr?'العنوان':'Title'],['author',isAr?'المؤلف':'Author'],['isbn','ISBN'],['publisher',isAr?'دار النشر':'Publisher'],['shelf',isAr?'رقم الرف':'Shelf'],['row_number',isAr?'الصف / مكان النسخة':'Row / copy location'],['source_name',isAr?'اسم المصدر':'Source name'],['source_url',isAr?'رابط المصدر':'Source URL']] as [keyof Review,string][]).map(([field,label])=><label key={field} className="text-xs font-bold flex flex-col gap-1">{label}<input type={field==='shelf'||field==='row_number'?'number':'text'} min={1} value={String(selected[field]??'')} onChange={e=>update(field,field==='shelf'||field==='row_number'?Number(e.target.value):e.target.value)} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-sm" /></label>)}
          <label className="text-xs font-bold flex flex-col gap-1">{isAr?'مستوى القراءة بعد الفحص':'Reviewed reading tier'}<select className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-sm" value={selected.reading_tier||''} onChange={e=>update('reading_tier',e.target.value||null)}><option value="">{isAr?'بدون اعتماد':'Not assigned'}</option><option value="beginner">{isAr?'مبتدئ':'Beginner'}</option><option value="intermediate">{isAr?'متوسط':'Intermediate'}</option><option value="advanced">{isAr?'متقدم':'Advanced'}</option></select></label>
          <label className="text-xs font-bold flex flex-col gap-1 sm:col-span-2">{isAr?'ملاحظات الفحص':'Review notes'}<textarea rows={3} value={selected.notes} onChange={e=>update('notes',e.target.value)} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-sm"/></label>
        </div>
        <div className="mt-4"><button disabled={pending} type="button" onClick={()=>void lookup()} className="rounded-lg border border-sky-600 text-sky-700 dark:text-sky-300 px-4 py-2 font-bold text-sm disabled:opacity-50">{isAr?'ابحث في Open Library وGoogle Books':'Search Open Library & Google Books'}</button></div>
        {!!suggestions.length&&<div className="mt-3 max-h-48 overflow-auto border rounded-lg divide-y dark:divide-slate-700">{suggestions.map((candidate,i)=><div key={i} className="p-3 flex flex-col sm:flex-row justify-between gap-2 text-xs"><div><b>{candidate.title}</b><p>{candidate.author} · {candidate.publisher}</p><a className="underline text-sky-700 dark:text-sky-300" href={candidate.source_url} rel="noopener noreferrer" target="_blank">{candidate.source_name}</a></div><button type="button" onClick={()=>setSelected(old=>old?({...old,...candidate}):old)} className="rounded-lg border px-3 py-1.5 font-bold self-start">{isAr?'استخدام المقترح':'Use suggestion'}</button></div>)}</div>}
        {notice&&<p role="status" className="my-3 text-sm text-amber-700 dark:text-amber-300">{notice}</p>}
        <div className="flex flex-wrap gap-2 mt-5">
          <button type="button" disabled={pending||!serviceReady} onClick={()=>void saveReview('approved')} className="rounded-xl bg-emerald-700 text-white font-bold px-4 py-2 disabled:opacity-50">{isAr?'اعتماد التوثيق':'Approve'}</button>
          <button type="button" disabled={pending||!serviceReady} onClick={()=>void saveReview('rejected')} className="rounded-xl bg-rose-700 text-white font-bold px-4 py-2 disabled:opacity-50">{isAr?'رفض التوثيق':'Reject'}</button>
          <button type="button" disabled={pending||!serviceReady} onClick={()=>void saveReview('pending')} className="rounded-xl border border-slate-400 px-4 py-2 font-bold disabled:opacity-50">{isAr?'حفظ للتدقيق لاحقًا':'Save for later'}</button>
        </div>
      </div>
    </div>}
    <p className="mt-4 text-xs font-bold leading-6 text-slate-600 dark:text-slate-300">
      {isAr
        ? 'نزّل نموذج المراجعة، وسجّل بيانات الطبعة ورقم ISBN وملاحظة على النص والمفردات والملاءمة العمرية واسم المراجع. لا تغيّر هذه القائمة أي مستوى في فهرس الطلاب تلقائيًا.'
        : 'Download the review sheet to record ISBN, edition, text sample, vocabulary, age suitability and reviewer sign-off. This queue never changes student-facing levels automatically.'}
    </p>
  </section>;
}
