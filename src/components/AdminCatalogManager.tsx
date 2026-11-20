import React,{useEffect,useMemo,useState} from 'react';
import {FunctionsHttpError} from '@supabase/supabase-js';
import {supabase} from '../utils/supabase';
import {bookData} from '../../api/bookData';
import {NATIONAL_IDENTITY_DIGITAL_BOOKS} from '../../api/nationalIdentityDigitalBooks';
import {isNationalIdentityBook} from '../utils/nationalIdentityCatalog';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE} from '../../api/digitalBookData';
import {samePhysicalHolding,refreshAdminCatalogAdditions,useAdminCatalogRevision,type AdminCatalogHolding} from '../utils/liveCatalogAdditions';

type Mode='physical'|'digital'|'excel';
type Draft={title:string;author:string;isbn:string;cabinet:string;shelf_row:string;subject:string;language:'ar'|'en'|'national';national_identity:boolean;book_url:string;audio_url:string;summary:string};
type TextDraftField=Exclude<keyof Draft,'national_identity'>;
type PhysicalEdit=Pick<Draft,'title'|'author'|'isbn'|'cabinet'|'shelf_row'|'national_identity'>;
const empty=():Draft=>({title:'',author:'',isbn:'',cabinet:'',shelf_row:'',subject:'',language:'ar',national_identity:false,book_url:'',audio_url:'',summary:''});
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
/** Keep backend validation and authorization exactly as before; show its
 * actionable message instead of the generic FunctionsHttpError wrapper.
 */
const catalogErrorText=(code:string,isAr:boolean)=>{
 const translations:Record<string,[string,string]>={
  TITLE_REQUIRED:['ادخل عنوان الكتاب.','Enter the book title.'],
  AUTHOR_REQUIRED:['ادخل اسم المؤلف.','Enter the author name.'],
  ISBN_REQUIRED:['ادخل رقم ISBN الخاص بالكتاب.','Enter the book ISBN.'],
  INVALID_ISBN:['رقم ISBN غير صحيح. تأكد أنه ISBN من 10 أو 13 خانة، وليس الباركود التجاري UPC المكوّن من 12 خانة.','Invalid ISBN: enter a valid 10- or 13-character ISBN, not a 12-digit UPC barcode.'],
  CABINET_NUMBER_REQUIRED:['ادخل رقم الدولاب الصحيح (رقم موجب بدون كسور).','Enter a valid positive whole-number cabinet number.'],
  SHELF_ROW_REQUIRED:['ادخل رقم الرف أو الصف الصحيح (رقم موجب بدون كسور).','Enter a valid positive whole-number shelf/row number.'],
  SUBJECT_REQUIRED:['ادخل الموضوع أو التصنيف الخاص بالكتاب الرقمي.','Enter the digital book subject or category.'],
  DIGITAL_BOOK_HTTPS_URL_REQUIRED:['أدخل رابطًا صحيحًا يبدأ بـ https:// للكتاب الرقمي.','Enter a valid digital book URL starting with https://.'],
  AUDIO_HTTPS_URL_REQUIRED:['رابط الملخص الصوتي غير صحيح؛ يجب أن يبدأ بـ https://.','Enter a valid audio summary URL starting with https://.'],
  PHYSICAL_REQUIRED_FIELDS:['راجع اسم المؤلف ورقم ISBN الصحيح ورقم الدولاب والرف.','Check the author, valid ISBN, cabinet and shelf row.'],
  DIGITAL_REQUIRED_FIELDS:['راجع اسم المؤلف والموضوع ورابط الكتاب والملخص الصوتي إن وُجد.','Check the author, subject, book link and optional audio link.'],
  VERIFIED_SCHOOL_GOOGLE_REQUIRED:['يجب تسجيل الدخول بحساب Google المدرسي المعتمد.','Sign in using your verified school Google account.'],
  AUTH_REQUIRED:['انتهت جلسة الدخول؛ أعد تسجيل الدخول بحساب الأدمن.','Your session has expired; sign in as admin again.'],
  ADMIN_REQUIRED:['هذه العملية متاحة للأدمن فقط.','This action is restricted to administrators.'],
  ADMIN_PROFILE_UNAVAILABLE:['تعذّر التحقق من حساب الأدمن المرتبط بسجل المعلمين.','Your administrator profile could not be verified.'],
  DIRECTORY_UNAVAILABLE:['تعذّر الاتصال بدليل الحسابات المدرسية حاليًا.','The school account directory is temporarily unavailable.'],
  ORIGIN_NOT_ALLOWED:['تعذّر التحقق من عنوان المنصة. افتح الموقع الرسمي وأعد المحاولة.','Open the official library website and try again.'],
  CATALOG_OPERATION_FAILED:['تعذّرت إضافة الكتاب بسبب خطأ في الخدمة. حاول مرة أخرى.','The book service could not complete this request. Try again.'],
  EMPTY_SHEET:['ملف Excel فارغ.','The spreadsheet is empty.'],
  FILE_TOO_LARGE:['الملف كبير جدًا؛ الحد الأقصى 2.5 ميجابايت.','The file is too large; maximum 2.5 MB.'],
  FILE_TOO_MANY_ROWS:['ملف Excel يحتوي على أكثر من 5000 صف.','The spreadsheet exceeds 5,000 rows.'],
  EXCEL_NEEDS_TITLE_AUTHOR_HEADERS:['لازم الملف يحتوي على عمود عنوان الكتاب واسم المؤلف.','The spreadsheet needs title and author columns.'],
  EXCEL_XLSX_OR_CSV_ONLY:['استخدم ملف Excel بصيغة XLSX أو CSV.','Upload an XLSX or CSV file.'],
  IMPORT_BATCH_TOO_LARGE:['عدد الكتب كبير جدًا في الدفعة الواحدة.','Too many books in one import batch.'],
  PENDING_PHYSICAL_NOT_FOUND:['الكتاب المعلق غير موجود أو سبق اعتماده.','This pending book is missing or was already approved.'],
  LOCATION_AUTHOR_REQUIRED:['راجع عنوان الكتاب والمؤلف ومكانه قبل اعتماده.','Complete the author and book location before approval.'],
  PHYSICAL_RECORD_NOT_FOUND:['لم نعثر على هذا السجل لاعتماد التعديل.','The selected physical book record was not found.'],
  DUPLICATE_PHYSICAL_HOLDING:['هناك كتاب مطابق بالفعل في نفس الموقع.','A matching book already exists at that location.'],
  PHYSICAL_EDIT_FAILED:['تعذّر حفظ التعديلات. حاول مرة أخرى.','Could not save changes. Try again.']
 };
 const localized=translations[code];
 return localized?(isAr?localized[0]:localized[1]):code;
};

export default function AdminCatalogManager({isAr}:{isAr:boolean}){
 const [mode,setMode]=useState<Mode>('physical');
 const catalogRevision=useAdminCatalogRevision();
 const [editSearch,setEditSearch]=useState('');
 const [editingId,setEditingId]=useState('');
 const [physicalEdit,setPhysicalEdit]=useState<PhysicalEdit|null>(null);
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
 const update=(field:TextDraftField,value:string)=>setForm(old=>({...old,[field]:value}));
 const service=async(body:Record<string,unknown>)=>{
  const {data:{session}}=await supabase.auth.getSession();
  if(!session?.access_token)throw Error(t('سجّل دخول الأدمن باستخدام Google أولًا.','Verified Google admin sign-in required.'));
  const {data,error}=await supabase.functions.invoke('admin-catalog-books',{
   body,headers:{Authorization:'Bearer '+session.access_token}
  });
  if(error){
   let backendCode:string|undefined;
   // Supabase puts the service's JSON error payload in FunctionsHttpError.context,
   // not in the data argument when the status is 400/403/500.
   if(error instanceof FunctionsHttpError){
    try{
     const response=error.context as Response;
     const payload=await response.clone().json();
     if(typeof payload?.error==='string')backendCode=payload.error;
    }catch{/* Fall back to the original network error without leaking tokens. */}
   }
   throw Error(catalogErrorText(backendCode||error.message||'Catalog request failed',isAr));
  }
  if(!data?.ok)throw Error(catalogErrorText(String(data?.error||'Catalog request failed'),isAr));
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
  }else if(mode==='digital'&&([...ARABIC_LIBRARY_DATABASE,...ENGLISH_LIBRARY_DATABASE,...NATIONAL_IDENTITY_DIGITAL_BOOKS].some(
    b=>String(b.driveLink).split('?')[0]===form.book_url.split('?')[0]))){
    setError(t('رابط هذا الكتاب موجود بالفعل في المكتبة.','This book link is already in the digital library.'));return;
  }
  setBusy(true);
  try{
   const book={...form,cabinet:form.cabinet,shelf_row:form.shelf_row,audio_url:audio?form.audio_url:'',
    national_identity:mode==='physical'?form.national_identity:form.language==='national'};
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
 const physicalMatches=useMemo(()=>{
  const needle=editSearch.trim().normalize('NFKC').toLocaleLowerCase();
  if(!needle)return [];
  return bookData.filter(book=>
   [book.title,book.author,book.isbn||'',String(book.shelf),String(book.row)]
    .some(value=>String(value).normalize('NFKC').toLocaleLowerCase().includes(needle))
  ).slice(0,40);
 },[editSearch,catalogRevision,records]);
 const startPhysicalEdit=(book:(typeof bookData)[number])=>{
  setEditingId(book.id);
  setPhysicalEdit({
   title:book.title,author:book.author,isbn:book.isbn||'',
   cabinet:String(book.shelf),shelf_row:String(book.row),
   national_identity:isNationalIdentityBook(book)
  });
  setError('');setNotice('');
 };
 const savePhysicalEdit=async()=>{
  if(!physicalEdit||!editingId)return;
  const cabinet=Number(physicalEdit.cabinet),shelf_row=Number(physicalEdit.shelf_row);
  if(samePhysicalHolding({
   title:physicalEdit.title,author:physicalEdit.author,isbn:physicalEdit.isbn,cabinet,shelf_row
  },bookData.filter(book=>book.id!==editingId))){
   setError(t('يوجد كتاب مطابق في نفس الموقع.','A matching book already exists at this location.'));return;
  }
  setBusy(true);setError('');setNotice('');
  try{
   await service({action:'edit_physical',catalog_id:editingId,book:physicalEdit});
   await notifyCatalog();await refresh();
   setEditingId('');setPhysicalEdit(null);
   setNotice(t('تم تحديث بيانات الكتاب في الفهرس وأقسام الهوية المرتبطة به.','Book metadata and its identity catalog listing were updated.'));
  }catch(err){setError(String((err as Error).message||err));}
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
 const field=(name:TextDraftField,label:string,required=false,type='text')=>
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
      'السجلات المستوفية للبيانات تُعتمد مباشرة، والورقي غير محدد الموقع يُحفظ للمراجعة فقط.',
      'Records with complete metadata go live; unlocated physical holdings are held for review.')}</p></div>
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
      {field('isbn',t('ISBN (اختياري)','ISBN (optional)'))}
      <p className="md:col-span-2 -mt-1 text-xs text-slate-500 dark:text-slate-400">
       {t('لو الكتاب ملوش ISBN، سيبه فاضي. لو موجود لازم يكون ISBN صحيحًا من 10 أو 13 خانة، مش باركود UPC.',
        'Leave ISBN blank if the book has none. A supplied number must be a valid ISBN-10 or ISBN-13, not a UPC barcode.')}
      </p>
      {field('cabinet',t('رقم الدولاب (Shelf)','Cabinet number (Shelf)'),true,'number')}
      {field('shelf_row',t('رقم الرف / الصف (Row)','Shelf row (Row)'),true,'number')}
      {field('subject',t('الموضوع (اختياري)','Subject (optional)'))}
      <label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 p-3 text-sm font-bold">
       <input type="checkbox" checked={form.national_identity} onChange={e=>setForm(old=>({...old,national_identity:e.target.checked}))} className="h-5 w-5 accent-emerald-700"/>
       {t('إضافة إلى فهرس الهوية الوطنية (دولاب الهوية ودليل الهوية)','Add to National Identity collection and directory')}
      </label>
     </>:<>
      <label className="space-y-1.5"><span className="text-sm font-bold">{t('لغة الكتاب','Book language')}</span>
       <select className={control} value={form.language} onChange={e=>update('language',e.target.value)}>
        <option value="ar">{t('عربي','Arabic')}</option><option value="en">{t('إنجليزي','English')}</option>
        <option value="national">{t('الهوية الوطنية','National Identity')}</option>
       </select></label>
      {field('subject',t('الموضوع / التصنيف','Subject / category'),true)}
      {field('book_url',t('رابط الكتاب (HTTPS)','Book URL (HTTPS)'),true,'url')}
      <p className="md:col-span-2 text-xs text-amber-700 dark:text-amber-300">
       {t('مهم: تأكد أن رابط الكتاب كامل ومتاح لطلاب ومعلمي المدرسة. حفظ الرابط لا يعني التحقق من اكتمال صفحات الكتاب.',
        'Make sure the complete book is shared with school users. Saving a link does not verify that every page is available.')}
      </p>
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
      const edit=(name:TextDraftField,value:string)=>setEdits(old=>({...old,[item.id]:{...draft,[name]:value}}));
      return <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50">
       <div className="font-bold mb-2" dir="auto">{item.title}</div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {(['title','author','isbn','cabinet','shelf_row'] as const).map(name=>
         <label key={name} className="text-xs font-semibold space-y-1"><span>{name==='title'?t('العنوان','Title'):name==='author'?t('المؤلف','Author'):name==='cabinet'?t('الدولاب','Cabinet'):name==='shelf_row'?t('الرف','Row'):'ISBN'}</span>
          <input className={control} type={name==='cabinet'||name==='shelf_row'?'number':'text'} value={draft[name]}
           onChange={e=>edit(name,e.target.value)}/></label>)}
       </div>
       <label className="flex items-center gap-2 mt-3 text-xs font-bold">
        <input type="checkbox" checked={draft.national_identity===true}
         onChange={e=>setEdits(old=>({...old,[item.id]:{...draft,national_identity:e.target.checked}}))} className="h-4 w-4 accent-emerald-700"/>
        {t('إضافة إلى فهرس الهوية الوطنية','Add to National Identity catalog')}
       </label>
       <button type="button" className={primary+' mt-3'} disabled={busy} onClick={()=>void approve(item)}>
        {icon('check')}{t('اعتماد وإضافة للفهرس','Approve and add to catalog')}</button>
      </div>;
     })}
    </div>}
  </div>
  <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm space-y-4">
   <div><h3 className="text-lg font-bold">{t('تعديل بيانات الكتب الورقية','Edit physical catalog books')}</h3>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('ابحث عن أي كتاب ورقي مسجل، ثم عدّل بياناته أو أضفه إلى فهرس الهوية. لن يُحذف السجل الأصلي.','Find an existing physical title to correct its details or flag it for the identity collection without deleting the original.')}</p></div>
   <label className="block space-y-1.5 text-sm font-bold">
    <span>{t('ابحث بالعنوان أو المؤلف أو ISBN أو الموقع','Search title, author, ISBN or location')}</span>
    <input type="search" className={control} value={editSearch} onChange={e=>setEditSearch(e.target.value)}
     placeholder={t('اكتب اسم الكتاب المراد تعديله...','Enter a book to edit...')}/>
   </label>
   {editSearch.trim()&&<div className="max-h-52 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2" aria-label={t('نتائج البحث عن الكتب','Matching physical books')}>
    {physicalMatches.map(book=><button type="button" key={book.id} onClick={()=>startPhysicalEdit(book)}
      className={'text-start p-3 rounded-xl border text-sm hover:border-emerald-500 '+(editingId===book.id?'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40':'border-slate-200 dark:border-slate-700')}>
      <span className="block font-bold" dir="auto">{book.title}</span>
      <span className="block text-xs text-slate-500" dir="auto">{book.author} · {t('دولاب','Cabinet')} {book.shelf} · {t('صف','Row')} {book.row}</span>
    </button>)}
    {!physicalMatches.length&&<p className="text-sm text-slate-500">{t('لا توجد كتب مطابقة.','No matching physical books.')}</p>}
   </div>}
   {physicalEdit&&<form className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4"
     onSubmit={e=>{e.preventDefault();void savePhysicalEdit();}}>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {(['title','author','isbn','cabinet','shelf_row'] as const).map(fieldName=>
       <label key={fieldName} className="text-xs font-bold space-y-1">
        <span>{fieldName==='title'?t('العنوان','Title'):fieldName==='author'?t('المؤلف','Author'):fieldName==='cabinet'?t('الدولاب','Cabinet'):fieldName==='shelf_row'?t('الصف','Row'):'ISBN'}</span>
        <input className={control} required={fieldName!=='isbn'} type={fieldName==='cabinet'||fieldName==='shelf_row'?'number':'text'}
          min={fieldName==='cabinet'||fieldName==='shelf_row'?1:undefined}
          value={physicalEdit[fieldName]}
          onChange={e=>setPhysicalEdit(old=>old?{...old,[fieldName]:e.target.value}:old)}/>
       </label>)}
     </div>
     <label className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 p-3 text-sm font-bold">
      <input type="checkbox" checked={physicalEdit.national_identity} className="h-5 w-5 accent-emerald-700"
       onChange={e=>setPhysicalEdit(old=>old?{...old,national_identity:e.target.checked}:old)}/>
      {t('إظهار في دولاب الهوية الوطنية ودليلها','Show in National Identity collection and directory')}
     </label>
     <div className="flex flex-wrap gap-2">
      <button type="submit" className={primary} disabled={busy}>{icon('check')}{busy?t('جار الحفظ...','Saving...'):t('حفظ التعديلات','Save changes')}</button>
      <button type="button" className={secondary} disabled={busy} onClick={()=>{setEditingId('');setPhysicalEdit(null)}}>{t('إلغاء','Cancel')}</button>
     </div>
    </form>}
  </div>
 </section>;
}
