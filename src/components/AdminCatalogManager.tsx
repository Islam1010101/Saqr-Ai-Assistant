import React,{useEffect,useMemo,useState} from 'react';
import {supabase} from '../utils/supabase';
import {bookData} from '../../api/bookData';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE} from '../../api/digitalBookData';
import {samePhysicalHolding,refreshAdminCatalogAdditions,type AdminCatalogHolding} from '../utils/liveCatalogAdditions';

type Mode='physical'|'digital'|'excel';
type Draft={title:string;author:string;isbn:string;cabinet:string;shelf_row:string;subject:string;language:'ar'|'en';book_url:string;audio_url:string;summary:string};
const empty=():Draft=>({title:'',author:'',isbn:'',cabinet:'',shelf_row:'',subject:'',language:'ar',book_url:'',audio_url:'',summary:''});
type RecordRow=AdminCatalogHolding&{source:string;review_note:string};
const icon=(name:'book'|'upload'|'cloud'|'check'|'refresh')=>{
 const paths={
  book:<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
  upload:<><path d="M12 16V3m0 0-5 5m5-5 5 5"/><path d="M4 16v4h16v-4"/></>,
  cloud:<><path d="M20 16a4 4 0 0 0-.6-7.9A7 7 0 0 0 6 9a4 4 0 0 0 1 8h12"/><path d="M12 19v-8m0 0-3 3m3-3 3 3"/></>,
  check:<><path d="m4 12 5 5L20 6"/></>,
  refresh:<><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5 9a7 7 0 0 1 12-2l3 5M4 12l3 5a7 7 0 0 0 12-2"/></>
 };
 return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};
const control='w-full min-w-0 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';
const primary='inline-flex justify-center items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 px-5 py-3 text-white text-sm font-bold';
const secondary='inline-flex justify-center items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800';
export default function AdminCatalogManager({isAr}:{isAr:boolean}){
 const [mode,setMode]=useState<Mode>('physical');
 const [form,setForm]=useState<Draft>(empty);
 const [audio,setAudio]=useState(false);
 const [records,setRecords]=useState<RecordRow[]>([]);
 const [edits,setEdits]=useState<Record<string,Draft>>({});
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState('');
 const [error,setError]=useState('');
 const [file,setFile]=useState<File|null>(null);
 const [progress,setProgress]=useState('');
 const t=(ar:string,en:string)=>isAr?ar:en;
 const update=(field:keyof Draft,value:string)=>setForm(old=>({...old,[field]:value}));
 const service=async(body:Record<string,unknown>)=>{
  const {data:{session}}=await supabase.auth.getSession();
  if(!session?.access_token)throw Error(t('سجّل دخول الأدمن باستخدام Google أولًا.','Verified Google admin sign-in required.'));
  const {data,error}=await supabase.functions.invoke('admin-catalog-books',{
   body,headers:{Authorization:'Bearer '+session.access_token}
  });
  if(error||!data?.ok)throw Error(String(data?.error||error?.message||'Catalog request failed'));
  return data;
 };
 const refresh=async()=>{
  const data=await service({action:'list'});
  setRecords(Array.isArray(data.records)?data.records:[]);
 };
 useEffect(()=>{let live=true;void service({action:'list'})
  .then(data=>{if(live)setRecords(Array.isArray(data.records)?data.records:[]);})
  .catch(err=>{if(live)setError(String(err.message||err));});
  return()=>{live=false;};
 },[]);
 const notifyCatalog=async()=>{
  await refreshAdminCatalogAdditions();
  window.dispatchEvent(new Event('efips-admin-catalog-changed'));
 };
 const submit=async(event:React.FormEvent)=>{
  event.preventDefault();setError('');setNotice('');
  if(mode==='physical'){
   const cabinet=Number(form.cabinet),shelf_row=Number(form.shelf_row);
   if(samePhysicalHolding({title:form.title,author:form.author,isbn:form.isbn,cabinet,shelf_row})){
    setError(t('الكتاب موجود بالفعل في نفس الدولاب والرف.','A matching book already exists in this cabinet and row.'));return;
   }
  }else if(mode==='digital'&&([...ARABIC_LIBRARY_DATABASE,...ENGLISH_LIBRARY_DATABASE].some(
    b=>String(b.driveLink).split('?')[0]===form.book_url.split('?')[0]))){
    setError(t('رابط هذا الكتاب موجود بالفعل في المكتبة.','This book link is already in the digital library.'));return;
  }
  setBusy(true);
  try{
   const book={...form,cabinet:form.cabinet,shelf_row:form.shelf_row,audio_url:audio?form.audio_url:''};
   const result=await service({action:mode==='physical'?'add_physical':'add_digital',book});
   if(!result.added)throw Error(t('الكتاب موجود مسبقًا في قائمة الإضافات.','This book was already added.'));
   await notifyCatalog();
   await refresh();
   setForm(empty());setAudio(false);
   setNotice(t('تم حفظ الكتاب وظهر في الفهرس المناسب وبحث صقر والعدادات.','Book saved to its library, Saqr catalog search and totals.'));
  }catch(err){setError(String((err as Error).message||err));}
  finally{setBusy(false);}
 };
 const fileBase64=async(file:File)=>{
  const data=new Uint8Array(await file.arrayBuffer());
  let value='';for(let i=0;i<data.length;i+=16384)value+=String.fromCharCode(...data.subarray(i,i+16384));
  return btoa(value);
 };
 const uploadExcel=async()=>{
  if(!file)return;setBusy(true);setNotice('');setError('');setProgress('');
  try{
   if(file.size>2500000)throw Error(t('أقصى حجم للملف 2.5 ميجابايت.','Maximum file size is 2.5 MB.'));
   const body=file.name.toLowerCase().endsWith('.csv')
    ?{action:'parse_excel',filename:file.name,csv_text:await file.text()}
    :{action:'parse_excel',filename:file.name,file_base64:await fileBase64(file)};
   const parsed=await service(body);
   const rows=Array.isArray(parsed.records)?parsed.records:[];
   if(!rows.length)throw Error(t('الملف لا يحتوي على كتب صالحة للاستيراد.','No importable books found.'));
   const existing=new Set<string>();
   const pending:Record<string,unknown>[]=[];
   let skipped=0;
   for(const item of rows){
    const r=item as {title:string;author:string;isbn?:string;cabinet?:string; shelf_row?:string};
    const cabinet=Number(r.cabinet),shelf_row=Number(r.shelf_row);
    const located=Number.isInteger(cabinet)&&cabinet>0&&Number.isInteger(shelf_row)&&shelf_row>0;
    if(located&&samePhysicalHolding({title:r.title,author:r.author,isbn:r.isbn,cabinet,shelf_row})){skipped++;continue;}
    const key=[r.title,r.author,r.isbn,cabinet||'?',shelf_row||'?'].join('|').normalize('NFKC').toLowerCase();
    if(existing.has(key)){skipped++;continue;}existing.add(key);pending.push(item);
   }
   let added=0,review=0,invalid=0;
   for(let start=0;start<pending.length;start+=100){
    setProgress(t('استيراد '+(start+1)+'–'+Math.min(start+100,pending.length)+' من '+pending.length,
      'Importing '+(start+1)+'–'+Math.min(start+100,pending.length)+' of '+pending.length));
    const result=await service({action:'import_physical',rows:pending.slice(start,start+100)});
    added+=Number(result.added||0);review+=Number(result.pending||0);invalid+=Number(result.invalid||0);
   }
   await notifyCatalog();await refresh();
   setProgress('');setFile(null);
   const el=document.getElementById('admin-catalog-xlsx') as HTMLInputElement|null;
   if(el)el.value='';
   setNotice(t('تمت إضافة '+(added-review)+' للفهـرس، و'+review+' للمراجعة، وتخطي '+(skipped+invalid)+' مكرر/غير صالح.',
    'Added '+(added-review)+' to catalog, '+review+' for review; skipped '+(skipped+invalid)+' duplicates/invalid rows.'));
  }catch(err){setError(String((err as Error).message||err));setProgress('');}
  finally{setBusy(false);}
 };
 const pending=useMemo(()=>records.filter(item=>item.status==='pending'),[records]);
 const approved=records.filter(item=>item.status==='approved');
 const stats=[
  {label:t('الورقي المضاف','Physical added'),value:approved.filter(item=>item.kind==='physical').length},
  {label:t('العربي الرقمي','Arabic digital'),value:approved.filter(item=>item.kind==='digital'&&item.language==='ar').length},
  {label:t('الإنجليزي الرقمي','English digital'),value:approved.filter(item=>item.kind==='digital'&&item.language==='en').length},
  {label:t('بانتظار المراجعة','Needs review'),value:pending.length}
 ];
 const field=(name:keyof Draft,label:string,required=false,type='text')=>
  <label key={name} className="block space-y-1.5 min-w-0"><span className="text-sm font-bold">{label}</span>
   <input className={control} type={type} value={form[name]} required={required} min={type==='number'?1:undefined}
    onChange={e=>update(name,e.target.value)} dir={name==='isbn'||name.endsWith('url')?'ltr':'auto'}/>
  </label>;
 const approve=async(item:RecordRow)=>{
  const values=edits[item.id]||{...empty(),...item,cabinet:String(item.cabinet||''),shelf_row:String(item.shelf_row||'')};
  setBusy(true);setError('');setNotice('');
  try{
   if(samePhysicalHolding({title:values.title,author:values.author,isbn:values.isbn,cabinet:Number(values.cabinet),shelf_row:Number(values.shelf_row)}))
    throw Error(t('هذا الكتاب موجود بالفعل في الموقع المحدد.','This book already exists at that location.'));
   await service({action:'approve_pending',id:item.id,book:values});
   await notifyCatalog();await refresh();
   setNotice(t('تم اعتماد الكتاب وإضافته للفهرس وصقر.','Approved and added to catalog and Saqr.'));
  }catch(err){setError(String((err as Error).message||err));}
  finally{setBusy(false);}
 };
 return <section dir={isAr?'rtl':'ltr'} className="lg:col-span-4 space-y-4" aria-label={t('إدارة إضافة الكتب','Manage new library books')}>
  <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
   <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
    <div><h3 className="font-bold text-lg sm:text-xl">{t('إضافة كتب للفهرس وعقل صقر','Add books to the catalog and Saqr')}</h3>
     <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t(
      'الكتب المكتملة تُعتمد مباشرة، والورقي غير محدد الموقع يُحفظ للمراجعة فقط.',
      'Complete records go live; unlocated physical holdings are held for review.')}</p></div>
    <button type="button" className={secondary} disabled={busy} onClick={()=>void refresh().catch(e=>setError(String(e.message)))}>
     {icon('refresh')}{t('تحديث','Refresh')}</button>
   </div>
   <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
    {stats.map((card,i)=><div key={card.label} className="p-3 sm:p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
     <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.label}</span>
     <div className="text-xl sm:text-2xl font-bold mt-1 tabular-nums">{card.value}</div>
     <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div className={'h-full '+(i===3?'bg-amber-500':'bg-emerald-500')} style={{width:(card.value?Math.max(6,card.value/Math.max(1,...stats.map(s=>s.value))*100):0)+'%'}}/></div>
    </div>)}
   </div>
   <nav className="flex flex-wrap gap-2 mb-5" aria-label={t('نوع الإضافة','Add book type')}>
    {([{key:'physical',label:t('كتاب ورقي','Physical book'),symbol:'book'},
      {key:'digital',label:t('كتاب رقمي','Digital book'),symbol:'cloud'},
      {key:'excel',label:t('استيراد Excel','Excel import'),symbol:'upload'}] as const).map(item=>
      <button type="button" key={item.key} onClick={()=>{setMode(item.key);setNotice('');setError('');}}
       aria-pressed={mode===item.key}
       className={(mode===item.key?'bg-emerald-700 text-white border-emerald-700':'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700')+
       ' inline-flex gap-2 items-center rounded-xl border px-4 py-2.5 text-sm font-bold'}>
       {icon(item.symbol)}{item.label}</button>)}
   </nav>
   {mode!=='excel'?<form onSubmit={submit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
     {field('title',t('عنوان الكتاب','Book title'),true)}
     {field('author',t('اسم المؤلف','Author'),true)}
     {mode==='physical'?<>
      {field('isbn','ISBN',true)}
      {field('cabinet',t('رقم الدولاب (Shelf)','Cabinet number (Shelf)'),true,'number')}
      {field('shelf_row',t('رقم الرف / الصف (Row)','Shelf row (Row)'),true,'number')}
      {field('subject',t('الموضوع (اختياري)','Subject (optional)'))}
     </>:<>
      <label className="space-y-1.5"><span className="text-sm font-bold">{t('لغة الكتاب','Book language')}</span>
       <select className={control} value={form.language} onChange={e=>update('language',e.target.value)}>
        <option value="ar">{t('عربي','Arabic')}</option><option value="en">{t('إنجليزي','English')}</option>
       </select></label>
      {field('subject',t('الموضوع / التصنيف','Subject / category'),true)}
      {field('book_url',t('رابط الكتاب (HTTPS)','Book URL (HTTPS)'),true,'url')}
      <label className="flex items-center gap-2 text-sm font-bold py-2">
       <input type="checkbox" checked={audio} onChange={e=>setAudio(e.target.checked)} className="w-4 h-4 accent-emerald-700"/>
       {t('يوجد ملخص صوتي','Audio summary available')}</label>
      {audio&&field('audio_url',t('رابط الملخص الصوتي','Audio summary URL'),true,'url')}
      <label className="md:col-span-2 space-y-1.5 block"><span className="text-sm font-bold">{t('نبذة مختصرة موثّقة (اختيارية)','Verified synopsis (optional)')}</span>
       <textarea rows={3} className={control} value={form.summary} onChange={e=>update('summary',e.target.value)} placeholder={t('اتركها فارغة إذا لم تقرأ المحتوى بالفعل.','Leave blank unless based on the actual book.')}/></label>
     </>}
    </div>
    <button type="submit" disabled={busy} className={primary}>{icon('check')}{busy?t('جار الحفظ...','Saving...'):t('حفظ وإضافة للفهرس وصقر','Save to library and Saqr')}</button>
   </form>:<div className="space-y-4">
    <p className="text-sm text-slate-600 dark:text-slate-300 leading-7">{t(
     'يدعم Excel بصيغة XLSX أو CSV. الأعمدة: Title، Author، ISBN، Shelf number (رقم الدولاب)، Row (رقم الرف)، Subject اختياري. الكتب بلا مكان ستظهر في قائمة المراجعة.',
     'Upload XLSX or CSV with Title, Author, ISBN, Shelf number (cabinet), Row (shelf row); Subject is optional. Unlocated books go to review.')}</p>
    <input id="admin-catalog-xlsx" className={control} type="file" accept=".xlsx,.csv" disabled={busy}
     onChange={e=>setFile(e.target.files?.[0]||null)} aria-label={t('اختر ملف الكتب','Choose books file')}/>
    <button type="button" onClick={()=>void uploadExcel()} disabled={!file||busy} className={primary}>{icon('upload')}
     {busy?t('جار الاستيراد...','Importing...'):t('اقرأ الملف وأضف الكتب','Read file and add books')}</button>
    {progress&&<p role="status" className="text-xs font-bold text-sky-700 dark:text-sky-300">{progress}</p>}
   </div>}
   {error&&<p role="alert" className="mt-4 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/30 p-3 text-rose-800 dark:text-rose-200 text-sm">{error}</p>}
   {notice&&<p role="status" className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-emerald-800 dark:text-emerald-200 text-sm">{notice}</p>}
  </div>
  <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
   <div className="flex items-center justify-between gap-3 mb-4">
    <h3 className="font-bold text-lg">{t('كتب Excel بانتظار تحديد الموقع أو تصحيح البيانات','Excel books awaiting location or metadata review')}</h3>
    <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-amber-800 dark:text-amber-200 text-sm font-bold">{pending.length}</span>
   </div>
   {!pending.length?<p className="text-sm text-slate-500">{t('لا توجد إضافات معلقة حاليًا.','No pending additions.')}</p>:
    <div className="space-y-3 max-h-[560px] overflow-auto">
     {pending.map(item=>{
      const draft=edits[item.id]||{...empty(),...item,cabinet:String(item.cabinet||''),shelf_row:String(item.shelf_row||'')};
      const edit=(name:keyof Draft,value:string)=>setEdits(old=>({...old,[item.id]:{...draft,[name]:value}}));
      return <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50">
       <div className="font-bold mb-2" dir="auto">{item.title}</div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {(['title','author','isbn','cabinet','shelf_row'] as const).map(name=>
         <label key={name} className="text-xs font-semibold space-y-1"><span>{name==='title'?t('العنوان','Title'):name==='author'?t('المؤلف','Author'):name==='cabinet'?t('الدولاب','Cabinet'):name==='shelf_row'?t('الرف','Row'):'ISBN'}</span>
          <input className={control} type={name==='cabinet'||name==='shelf_row'?'number':'text'} value={draft[name]}
           onChange={e=>edit(name,e.target.value)}/></label>)}
       </div>
       <button type="button" className={primary+' mt-3'} disabled={busy} onClick={()=>void approve(item)}>
        {icon('check')}{t('اعتماد وإضافة للفهرس','Approve and add to catalog')}</button>
      </div>;
     })}
    </div>}
  </div>
 </section>;
}
