import React, {useState} from 'react';
import {supabase} from '../utils/supabase';
import {FEATURE_CATALOG, type FeatureKey} from '../utils/featurePermissions';

type Props={
  isAr:boolean;
  email:string;
  name:string;
  role:'student'|'teacher';
  initial:Partial<Record<FeatureKey,boolean>>;
  onClose:()=>void;
  onSaved:(feature:FeatureKey,allowed:boolean|null)=>void;
};

/**
 * Teacher: role default / explicit grant / explicit deny.
 * Student: role default / explicit deny ONLY. Never an elevation.
 * The Edge Function validates the school identity, role and feature again.
 */
export default function AdminFeaturePermissions({isAr,email,name,role,initial,onClose,onSaved}:Props) {
  const [values,setValues]=useState<Partial<Record<FeatureKey,boolean>>>(initial);
  const [busy,setBusy]=useState<FeatureKey|null>(null);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const groups=[
    {label:isAr?'الصفحات والخدمات':'Pages and services',items:FEATURE_CATALOG.slice(0,8)},
    {label:isAr?'الهوية الوطنية':'National identity',items:FEATURE_CATALOG.slice(8,14)},
    {label:isAr?'الألعاب والتحديات':'Challenges and activities',items:FEATURE_CATALOG.slice(14)}
  ];
  const save=async(key:FeatureKey,next:'default'|'allow'|'deny')=>{
    if(role==='student'&&next==='allow')return;
    const allowed=next==='default'?null:next==='allow';
    setBusy(key);setError('');setNotice('');
    try{
      const {data:{session},error:sessionError}=await supabase.auth.getSession();
      if(sessionError||!session?.access_token)throw new Error(isAr?'يرجى تسجيل الدخول مجددًا بحساب المدير.':'Please sign in as an administrator again.');
      const {data,error:requestError}=await supabase.functions.invoke('admin-verified-library',{
        body:{action:'feature-permission',email,feature_key:key,allowed},
        headers:{Authorization:'Bearer '+session.access_token}
      });
      if(requestError||data?.ok!==true)throw new Error(data?.error || (isAr?'تعذر حفظ صلاحية الخدمة.':'Unable to save this feature.'));
      setValues(before=>{const copy={...before};if(allowed===null)delete copy[key];else copy[key]=allowed;return copy;});
      onSaved(key,allowed);
      setNotice(isAr?'تم تحديث الخدمة فقط دون تغيير دور المستخدم أو باقي الصلاحيات.':'Updated this service only; role and other services remain unchanged.');
    }catch(reason){setError(reason instanceof Error?reason.message:String(reason));}
    finally{setBusy(null);}
  };
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 sm:p-6" dir={isAr?'rtl':'ltr'}>
    <section role="dialog" aria-modal="true" aria-labelledby="feature-permissions-title" className="w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-emerald-300 dark:border-emerald-800 shadow-2xl p-4 sm:p-7">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 id="feature-permissions-title" className="text-xl font-black text-emerald-800 dark:text-emerald-200">{isAr?'التحكم في خدمات المستخدم':'User service permissions'}</h2>
          <p className="font-bold mt-2 text-sm">{name} <span className="text-xs font-normal text-slate-500" dir="ltr">({email})</span></p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{role==='teacher'?(isAr?'المعلم: إضافة أو منع خدمة مستقلة، دون منحه صلاحيات المدير.':'Teacher: grant or deny individual services without admin rights.'):(isAr?'الطالب: منع خدمة متاحة أو استعادة الوضع الأصلي فقط؛ لا يمكن إضافة خدمات.':'Student: deny an existing service or restore its role default, never grant additional access.')}</p>
        </div>
        <button type="button" onClick={onClose} aria-label={isAr?'إغلاق':'Close'} className="rounded-full bg-slate-100 dark:bg-slate-800 border px-3 py-2 font-black">×</button>
      </div>
      {error&&<div role="alert" className="mb-3 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm font-bold text-rose-800">{error}</div>}
      {notice&&<div role="status" className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{notice}</div>}
      {groups.map(group=><section key={group.label} className="mb-5">
        <h3 className="text-base font-black text-emerald-800 dark:text-emerald-300 mb-2">{group.label}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {group.items.map(item=>{
            const value=values[item.key]===true?'allow':values[item.key]===false?'deny':'default';
            return <label key={item.key} className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 p-3">
              <span className="text-sm font-bold">{isAr?item.ar:item.en}</span>
              <select aria-label={(isAr?item.ar:item.en)+' — '+(isAr?'الصلاحية':'permission')}
                value={value} disabled={busy!==null}
                onChange={e=>void save(item.key,e.target.value as 'default'|'allow'|'deny')}
                className="w-full rounded-lg border border-emerald-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm font-bold">
                <option value="default">{isAr?'حسب الدور الافتراضي':'Role default'}</option>
                {role==='teacher'&&<option value="allow">{isAr?'السماح بهذه الخدمة':'Allow this service'}</option>}
                <option value="deny">{isAr?'منع هذه الخدمة':'Deny this service'}</option>
              </select>
            </label>;
          })}
        </div>
      </section>)}
      <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
        <button type="button" onClick={onClose} className="rounded-xl bg-emerald-700 text-white font-black px-6 py-3">{isAr?'إغلاق':'Close'}</button>
      </div>
    </section>
  </div>;
}
