import React, {useEffect, useMemo, useState} from 'react';
import {orisonWorkbookPending, type OrisonPendingReview} from '../data/orisonWorkbookCatalog';
import {supabase} from '../utils/supabase';

type Edit={
  source_key:string;title:string;author:string;isbn:string;barcodes:string[];
  publisher:string;shelf:number|null;row_number:number|null;
  decision:'pending'|'approved'|'rejected';notes:string
};
const asDraft=(item:OrisonPendingReview):Edit=>({
  source_key:item.source_key,title:item.title,author:item.author,
  isbn:item.isbn,barcodes:item.barcodes,publisher:'',
  shelf:null,row_number:null,decision:'pending',notes:''
});
const PAGE_SIZE=25;

/** Admin-only review queue. Items have no public shelf until explicitly approved. */
export default function AdminOrisonInventoryReview({isAr}:{isAr:boolean}){
  const queue=useMemo(()=>[...orisonWorkbookPending],[]);
  const [saved,setSaved]=useState<Record<string,Edit>>({});
  const [selected,setSelected]=useState<Edit|null>(null);
  const [query,setQuery]=useState('');
  const [status,setStatus]=useState<'all'|'pending'|'approved'|'rejected'>('all');
  const [limit,setLimit]=useState(PAGE_SIZE);
  const [ready,setReady]=useState(false);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState('');
  const [suggestions,setSuggestions]=useState<Array<{title:string;author:string;isbn:string;publisher:string;source_name:string;source_url:string}>>([]);
  const service=async(body:Record<string,unknown>)=>{
    const {data:session}=await supabase.auth.getSession();
    if(!session.session?.access_token)throw Error(isAr?'سجّل الدخول بحساب أدمن موثّق أولًا.':'Verified administrator login required.');
    const {data,error}=await supabase.functions.invoke('admin-children-book-reviews',{
      body,headers:{Authorization:'Bearer '+session.session.access_token}
    });
    if(error||!data?.ok)throw Error(String(data?.error||error?.message||'Review service unavailable'));
    return data;
  };
  useEffect(()=>{
    let alive=true;
    void service({action:'import_list'}).then(data=>{
      if(!alive)return;
      setSaved(Object.fromEntries((data.records||[]).map((record:Edit)=>[record.source_key,record])));
      setReady(true);
    }).catch(error=>{if(alive)setNotice(String(error?.message||error));});
    return ()=>{alive=false;};
  },[]);
  const filtered=useMemo(()=>queue.filter(item=>{
    const edited=saved[item.source_key],state=edited?.decision||'pending',q=query.trim().toLocaleLowerCase();
    if(status!=='all'&&status!==state)return false;
    return !q||[edited?.title||item.title,edited?.author||item.author,edited?.isbn||item.isbn,item.barcodes.join(' ')]
      .some(value=>String(value).toLocaleLowerCase().includes(q));
  }),[queue,saved,query,status]);
  const approved=queue.filter(x=>saved[x.source_key]?.decision==='approved').length;
  const rejected=queue.filter(x=>saved[x.source_key]?.decision==='rejected').length;
  const ambiguous=queue.filter(x=>x.review_reason==='ambiguous').length;
  const change=(field:keyof Edit,value:string|number|null)=>setSelected(old=>old?({...old,[field]:value}):old);
  const open=(item:OrisonPendingReview)=>{
    setSelected(saved[item.source_key]||asDraft(item));
    setNotice('');setSuggestions([]);
  };
  const save=async(decision:Edit['decision'])=>{
    if(!selected)return;
    if(decision==='approved'&&(!selected.shelf||!selected.row_number)){
      setNotice(isAr?'لن يتم الاعتماد قبل تحديد الرف والصف.':'Enter shelf and row before approval.');return;
    }
    setBusy(true);setNotice('');
    try{
      const data=await service({action:'import_save',record:{...selected,decision}});
      const record=data.record as Edit;
      setSaved(previous=>({...previous,[record.source_key]:record}));
      setSelected(record);
      setNotice(isAr?'تم حفظ قرار المراجعة.':'Review decision saved.');
      if(decision==='approved'||selected.decision==='approved')
        window.dispatchEvent(new Event('efips-catalog-approved-changed'));
    }catch(error:any){setNotice(String(error.message||error));}
    finally{setBusy(false);}
  };
  const lookup=async()=>{
    if(!selected)return;
    setBusy(true);setNotice('');
    try{
      const data=await service({action:'lookup',title:selected.title,author:selected.author,isbn:selected.isbn});
      setSuggestions(data.suggestions||[]);
      if(!(data.suggestions||[]).length)setNotice(isAr?'لا توجد نتائج مطابقة؛ افحص النسخة يدويًا.':'No close matches; inspect the copy manually.');
    }catch(error:any){setNotice(String(error.message||error));}
    finally{setBusy(false);}
  };
  return <section className="lg:col-span-4 rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900 p-5 md:p-7 text-slate-900 dark:text-white">
    <div className="mb-5 space-y-2">
      <h2 className="text-xl font-black">{isAr?'مراجعة الكتب غير محددة الموقع':'Unlocated book review'}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-7">
        {isAr?'هذه القائمة من جرد Orison، وليست جزءًا من الفهرس العام. راجع الكتاب وحدد الرف والصف، ثم اضغط اعتماد لإضافته إلى فهرس صقر. البيانات القديمة لا تُستبدل.':'These stock records stay out of the public catalog until a librarian verifies shelf and row and approves publication. Existing data is preserved.'}
      </p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {([
        [isAr?'سجلات للمراجعة':'Review candidates',queue.length],
        [isAr?'معتمد':'Approved',approved],
        [isAr?'مرفوض':'Rejected',rejected],
        [isAr?'تطابق غير مؤكد':'Uncertain matches',ambiguous]
      ] as Array<[string,number]>).map(([label,n])=><div key={label} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <b className="text-2xl tabular-nums">{n}</b><p className="text-xs mt-1 text-slate-600 dark:text-slate-300">{label}</p>
      </div>)}
    </div>
    <div className="flex flex-wrap gap-3 mb-3">
      <input aria-label={isAr?'بحث في كتب الجرد':'Search inventory review'} type="search" value={query}
        onChange={e=>{setQuery(e.target.value);setLimit(PAGE_SIZE);}}
        placeholder={isAr?'عنوان، مؤلف، باركود، ISBN':'Title, author, barcode, ISBN'}
        className="flex-1 min-w-[190px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
      <select aria-label={isAr?'حالة المراجعة':'Review status'} value={status}
        onChange={e=>{setStatus(e.target.value as typeof status);setLimit(PAGE_SIZE);}}
        className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
        <option value="all">{isAr?'كل الحالات':'All'}</option>
        <option value="pending">{isAr?'قيد المراجعة':'Pending'}</option>
        <option value="approved">{isAr?'معتمد':'Approved'}</option>
        <option value="rejected">{isAr?'مرفوض':'Rejected'}</option>
      </select>
    </div>
    {notice&&<p role="status" className="text-sm text-amber-700 dark:text-amber-300 mb-3">{notice}</p>}
    <p className="text-xs text-slate-500 mb-3">{isAr?'عدد النتائج: ':'Results: '}{filtered.length} · {ready?(isAr?'متصل بقاعدة البيانات':'Database connected'):(isAr?'الاتصال قيد التحقق':'Review connection pending')}</p>
    <div className="max-h-[540px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[730px] text-sm">
        <thead className="sticky top-0 bg-emerald-50 dark:bg-slate-800"><tr>
          <th className="p-3 text-start">{isAr?'الكتاب':'Book'}</th>
          <th className="p-3 text-start">{isAr?'الباركود و ISBN':'Barcode / ISBN'}</th>
          <th className="p-3 text-start">{isAr?'الموقع':'Location'}</th>
          <th className="p-3 text-start">{isAr?'المراجعة':'Review'}</th>
        </tr></thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {filtered.slice(0,limit).map(item=>{
            const record=saved[item.source_key]||asDraft(item);
            return <tr key={item.source_key}>
              <td className="p-3 max-w-[270px]">
                <p dir="auto" className="font-bold break-words">{record.title}</p>
                <p dir="auto" className="text-xs text-slate-500 dark:text-slate-300 mt-1">{record.author}</p>
                {item.review_reason==='ambiguous'&&<p className="text-xs text-amber-700 dark:text-amber-300">{isAr?'تطابق الطبعة يحتاج فحصًا':'Edition match needs checking'}</p>}
              </td>
              <td className="p-3 text-xs" dir="ltr">{item.barcodes.join(', ')}<p className="mt-1">{record.isbn||'—'}</p></td>
              <td className="p-3 text-xs">{record.shelf&&record.row_number?record.shelf+' / '+record.row_number:(isAr?'غير محدد':'Not set')}</td>
              <td className="p-3">
                <p className="text-xs mb-2">{record.decision==='approved'?(isAr?'معتمد':'Approved'):record.decision==='rejected'?(isAr?'مرفوض':'Rejected'):(isAr?'قيد المراجعة':'Pending')}</p>
                <button disabled={!ready} onClick={()=>open(item)} className="rounded-lg bg-emerald-700 text-white p-2 text-xs disabled:opacity-50">{isAr?'مراجعة / تعديل':'Review / edit'}</button>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
      {!filtered.length&&<p className="p-5 text-slate-500">{isAr?'لا توجد نتائج':'No results'}</p>}
    </div>
    {filtered.length>limit&&<button className="mt-4 px-4 py-2 rounded-lg border" onClick={()=>setLimit(n=>n+PAGE_SIZE)}>{isAr?'عرض المزيد':'Show more'}</button>}
    {selected&&<div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-3">
      <div role="dialog" aria-modal="true" aria-label={isAr?'تحرير كتاب الجرد':'Edit inventory book'} className="w-full max-w-2xl max-h-[90dvh] overflow-auto rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-xl">
        <div className="flex justify-between items-center mb-4"><h3 className="font-black text-lg">{isAr?'مراجعة بيانات الكتاب':'Review book metadata'}</h3>
          <button onClick={()=>setSelected(null)} className="border rounded-lg px-3 py-2">{isAr?'إغلاق':'Close'}</button></div>
        <p className="text-xs text-amber-700 dark:text-amber-300 mb-4">{isAr?'حفظ للمراجعة لا ينشر الكتاب؛ الاعتماد بعد توثيق الرف والصف فقط.':'Save for later does not publish. Only approval with a verified shelf and row publishes.'}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([['title',isAr?'العنوان':'Title'],['author',isAr?'المؤلف':'Author'],['isbn','ISBN'],['publisher',isAr?'الناشر':'Publisher']] as Array<[keyof Edit,string]>).map(([field,label])=><label key={field} className="text-xs font-bold">{label}
            <input value={String(selected[field]??'')} onChange={e=>change(field,e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" /></label>)}
          {([['shelf',isAr?'الرف':'Shelf'],['row_number',isAr?'الصف':'Row']] as Array<[keyof Edit,string]>).map(([field,label])=><label key={field} className="text-xs font-bold">{label}
            <input type="number" min={1} max={999} value={selected[field]??''} onChange={e=>change(field,e.target.value===''?null:Number(e.target.value))}
              className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" /></label>)}
          <label className="sm:col-span-2 text-xs font-bold">{isAr?'ملاحظات':'Notes'}
            <textarea rows={3} value={selected.notes} onChange={e=>change('notes',e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" /></label>
        </div>
        <div className="text-xs text-slate-500 mt-3">{isAr?'الباركودات':'Barcodes'}: {selected.barcodes.join(', ')}</div>
        <button disabled={busy} onClick={()=>void lookup()} className="mt-4 border border-emerald-600 rounded-lg p-2 text-xs">{isAr?'بحث Open Library / Google Books':'Look up Open Library / Google Books'}</button>
        {!!suggestions.length&&<div className="mt-3 max-h-40 overflow-auto rounded-lg border">
          {suggestions.map((candidate,i)=><div key={i} className="p-3 border-b text-xs flex justify-between gap-2">
            <div><b>{candidate.title}</b><p>{candidate.author} · {candidate.publisher}</p><a href={candidate.source_url} target="_blank" rel="noopener noreferrer" className="underline text-emerald-600">{candidate.source_name}</a></div>
            <button className="rounded-lg border px-2 self-start" onClick={()=>setSelected(o=>o?({...o,title:candidate.title||o.title,author:candidate.author||o.author,isbn:candidate.isbn||o.isbn,publisher:candidate.publisher||o.publisher}):o)}>{isAr?'استخدام':'Use'}</button>
          </div>)}
        </div>}
        {notice&&<p role="status" className="text-xs mt-3 text-amber-700 dark:text-amber-300">{notice}</p>}
        <div className="flex gap-2 flex-wrap mt-5">
          <button disabled={busy||!ready} onClick={()=>void save('pending')} className="border rounded-lg px-4 py-2 disabled:opacity-50">{isAr?'حفظ للمراجعة':'Save for later'}</button>
          <button disabled={busy||!ready} onClick={()=>void save('approved')} className="bg-emerald-700 text-white rounded-lg px-4 py-2 disabled:opacity-50">{isAr?'اعتماد وإضافة للفهرس':'Approve and publish'}</button>
          <button disabled={busy||!ready} onClick={()=>void save('rejected')} className="bg-rose-700 text-white rounded-lg px-4 py-2 disabled:opacity-50">{isAr?'رفض':'Reject'}</button>
        </div>
      </div>
    </div>}
  </section>;
}
