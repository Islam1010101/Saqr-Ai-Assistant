import React,{useState} from 'react';
import {supabase} from '../utils/supabase';
import {EFIPS_FEATURES,type EfipsFeature,type FeatureOverride} from '../utils/efipsFeatures';
import {clearSchoolFeatureAccessCache} from '../utils/efipsFeatureAccess';

type FeatureRecord={role:'student'|'teacher'|'admin';features:Record<string,boolean>;
 defaults:Record<string,boolean>;overrides:Record<string,boolean>};
export default function AdminUserFeaturePermissions({email,name,isAr}:{
 email:string;name:string;isAr:boolean;
}){
 const [open,setOpen]=useState(false);
 const [record,setRecord]=useState<FeatureRecord|null>(null);
 const [loading,setLoading]=useState(false);
 const [busy,setBusy]=useState('');
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const send=async(body:object)=>{
  const {data:{session}}=await supabase.auth.getSession();
  if(!session?.access_token)throw Error(isAr?'يرجى إعادة تسجيل دخول الأدمن':'Admin login required');
  const {data,error}=await supabase.functions.invoke('efips-feature-access',{
   body,headers:{Authorization:'Bearer '+session.access_token}
  });
  if(error||!data?.ok)throw Error(data?.error||'FEATURE_ACCESS_UNAVAILABLE');
  return data as FeatureRecord;
 };
 const load=async()=>{
  setOpen(true);setLoading(true);setError('');setNotice('');
  try{setRecord(await send({action:'admin-get',email}));}
  catch(e){setError(e instanceof Error?e.message:String(e));}
  finally{setLoading(false);}
 };
 const change=async(feature:EfipsFeature,value:FeatureOverride)=>{
  if(record?.role==='student'&&value==='allow')return;
  if(record?.role==='admin')return;
  setBusy(feature);setError('');setNotice('');
  try{
   const updated=await send({action:'admin-set',email,feature,value:value==='inherit'?null:value==='allow'});
   setRecord(updated);clearSchoolFeatureAccessCache();
   setNotice(isAr?'تم حفظ صلاحية الخدمة لهذا المستخدم فقط.':'Only this user’s service access was updated.');
  }catch(e){setError(e instanceof Error?e.message:String(e));}
  finally{setBusy('')}
 };
 const groups=['core','special','identity','challenges'] as const;
 const titles:{[key:string]:[string,string]}={
  core:['خدمات المكتبة','Library services'],
  special:['خدمات خاصة','Special services'],
  identity:['الهوية الوطنية والتحديات','National identity & challenges'],
  challenges:['تحديات صقر','Saqr challenges'],
 };
 return <>
  <button type="button" onClick={()=>void load()} disabled={!email}
   className="rounded-lg border-2 border-emerald-500 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-900 transition hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
   {isAr?'صلاحيات الخدمات':'Services access'}
  </button>
  {open&&<div role="presentation" className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm" onClick={()=>setOpen(false)}>
   <section role="dialog" aria-modal="true" aria-label={isAr?'إدارة صلاحيات الخدمات':'Manage service access'} dir={isAr?'rtl':'ltr'}
    onClick={e=>e.stopPropagation()}
    className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-emerald-200 bg-white p-4 shadow-2xl dark:border-emerald-900 dark:bg-slate-900 sm:p-7">
    <header className="mb-4 flex items-start justify-between gap-3">
     <div>
      <h2 className="text-xl font-black text-emerald-900 dark:text-emerald-100">{isAr?'صلاحيات الخدمات والتحديات':'Individual service & challenge access'}</h2>
      <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">{name}</p>
      <p dir="ltr" className="text-start text-xs text-slate-500 dark:text-slate-400">{email}</p>
      <p className="mt-2 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">
        {record?.role==='student'
          ? (isAr?'الطالب: يمكنك منع خدمة متاحة أو استعادة الإعداد الأصلي فقط. لا يمكن منح خدمات إضافية.':'Student: you can deny an existing service or restore its default. Additional grants are not allowed.')
          : (isAr?'المعلم: يمكن إضافة أي خدمة طلابية أو منع خدمة حالية، دون تغيير دوره أو منحه صلاحيات المدير.':'Teacher: grant student-facing services or deny existing ones without changing the teacher role or granting admin rights.')}
      </p>
     </div>
     <button type="button" onClick={()=>setOpen(false)} aria-label={isAr?'إغلاق':'Close'}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-slate-300 text-xl font-black text-slate-700 dark:border-slate-600 dark:text-white">×</button>
    </header>
    {loading&&<p role="status" className="py-5 text-sm font-bold">{isAr?'جاري تحميل صلاحيات المستخدم...':'Loading verified permissions...'}</p>}
    {error&&<p role="alert" className="mb-3 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
    {notice&&<p role="status" className="mb-3 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{notice}</p>}
    {record&&groups.map(group=><div key={group} className="mb-4 rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
      <h3 className="mb-2 text-sm font-black text-emerald-800 dark:text-emerald-200">{titles[group][isAr?0:1]}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
       {EFIPS_FEATURES.filter(item=>item.group===group).map(item=>{
        const override=record.overrides[item.id];
        const value=override===true?'allow':override===false?'deny':'inherit';
        return <label key={item.id} className="flex min-h-16 items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/70">
         <span className="min-w-0">
          <strong className="block text-xs font-black leading-6 text-slate-900 dark:text-white">{isAr?item.ar:item.en}</strong>
          <span className={'text-[11px] font-bold '+(record.features[item.id]?'text-emerald-700 dark:text-emerald-300':'text-slate-500 dark:text-slate-400')}>
            {record.features[item.id]?(isAr?'مسموح حاليًا':'Currently available'):(isAr?'غير متاح حاليًا':'Currently unavailable')}
          </span>
         </span>
         <select value={value} onChange={e=>void change(item.id,e.target.value as FeatureOverride)}
          disabled={busy!==''} aria-label={(isAr?'صلاحية ':'Access to ')+(isAr?item.ar:item.en)}
          className="max-w-[130px] shrink-0 rounded-lg border border-emerald-200 bg-white p-2 text-xs font-bold text-emerald-900 disabled:opacity-50 dark:border-emerald-700 dark:bg-slate-900 dark:text-emerald-100">
          <option value="inherit">{isAr?'حسب الدور':'By role'}</option>
          {record.role==='teacher' && <option value="allow">{isAr?'سماح':'Allow'}</option>}
          <option value="deny">{isAr?'منع':'Deny'}</option>
         </select>
        </label>;
       })}
      </div>
    </div>)}
    <p className="mt-2 text-[11px] font-bold leading-6 text-slate-500 dark:text-slate-400">
      {isAr?'تغيير كل خدمة مستقل. للمعلمين: سماح أو منع. للطلاب: منع أو استعادة حسب الدور فقط. لا تُمنح أي صلاحيات إدارية.':'Each service is independent. Teachers: allow or deny. Students: deny or restore the role default only. No administrator rights are granted.'}
    </p>
   </section>
  </div>}
 </>;
}
