import React,{useEffect,useState} from 'react';
import {supabase} from '../../utils/supabase';
import {SCHOOL_SERVICE_CATALOG,type SchoolServiceKey,type ServiceOverride,type SchoolRole} from '../utils/schoolServiceAccess';

type Role = SchoolRole;
type ReadResult = {
  ok:boolean;
  email:string;
  role:Role;
  features:Record<SchoolServiceKey,boolean>;
  overrides:Partial<Record<SchoolServiceKey,boolean>>;
  error?:string;
};

export default function AdminFeaturePermissionsDialog({
  email,name,isAr,onClose,
}:{
  email:string;
  name:string;
  isAr:boolean;
  onClose:()=>void;
}){
  const [data,setData]=useState<ReadResult|null>(null);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState<SchoolServiceKey|null>(null);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  const label=(ar:string,en:string)=>isAr?ar:en;
  const invoke=async(action:'admin-read'|'admin-set',key?:SchoolServiceKey,mode?:ServiceOverride)=>{
    const {data:{session},error:sessionError}=await supabase.auth.getSession();
    if(sessionError||!session?.access_token)throw Error(label('يرجى تسجيل الدخول مجددًا بحساب مسؤول المدرسة.','Please sign in again with your school admin account.'));
    const result=await supabase.functions.invoke('efips-feature-access',{
      body:{action,email,feature_key:key,mode},
      headers:{Authorization:'Bearer '+session.access_token},
    });
    if(result.error||result.data?.ok!==true)throw Error(result.data?.error||label('فشل التحقق من صلاحيات الخدمة.','Service permissions could not be verified.'));
    return result.data as ReadResult;
  };
  useEffect(()=>{
    let alive=true;
    setLoading(true);
    invoke('admin-read').then(result=>{if(alive){setData(result);setLoading(false);}})
      .catch(err=>{if(alive){setError(err instanceof Error?err.message:String(err));setLoading(false);}});
    return()=>{alive=false;};
  },[email]);

  const setPermission=async(key:SchoolServiceKey,mode:ServiceOverride)=>{
    if(!data||busy)return;
    setBusy(key);setError('');setMessage('');
    try{
      const next=await invoke('admin-set',key,mode);
      setData(next);
      setMessage(label('تم حفظ صلاحية الخدمة ديه فقط، والدور باقي زي ما هو.','Only this service setting was saved; the account role is unchanged.'));
    }catch(err){setError(err instanceof Error?err.message:String(err));}
    finally{setBusy(null);}
  };
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 p-2 backdrop-blur-sm sm:p-5"
      role="presentation" onMouseDown={event=>{if(event.currentTarget===event.target)onClose();}}>
      <section role="dialog" aria-modal="true" aria-labelledby="efips-service-permissions-title"
        className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-emerald-200 bg-white shadow-2xl dark:border-emerald-800 dark:bg-slate-950">
        <header className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-cyan-50 p-5 dark:border-slate-700 dark:from-emerald-950 dark:to-slate-900">
          <div className="min-w-0">
            <p className="text-xs font-black tracking-wide text-emerald-700 dark:text-emerald-300">EFIPS · SERVICE ACCESS</p>
            <h2 id="efips-service-permissions-title" className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{label('خدمات وصلاحيات المستخدم','Individual service permissions')}</h2>
            <p className="mt-2 break-words text-sm font-bold text-slate-700 dark:text-slate-200">{name} <span dir="ltr" className="block text-xs font-medium text-slate-500">{email}</span></p>
            {data&&<span className="mt-2 inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-black text-emerald-800 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200">
              {data.role==='admin'?label('دور الحساب: أدمن','Role: Admin'):data.role==='teacher'?label('دور الحساب: معلم','Role: Teacher'):label('دور الحساب: طالب','Role: Student')}
            </span>}
          </div>
          <button type="button" onClick={onClose} className="min-h-11 shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-sm dark:bg-slate-800 dark:text-white">
            {label('إغلاق','Close')}
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold leading-7 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            {label('كل خدمة مستقلة تمامًا: سماح يضيف الخدمة فقط، منع يخفيها ويمنع فتح رابطها، وافتراضي يرجع قواعد دور المستخدم المعتادة. ده مش تغيير للدور ومش بيدي صلاحيات الإدارة أو حجز الحصص للطلاب.',
              'Each service is independent: Allow adds only this service, Deny hides it and blocks its route, and Default restores the original role rules. This does not grant admin controls or student booking rights.')}
          </p>
          {loading&&<p role="status" className="py-6 text-center text-sm font-bold text-emerald-800 dark:text-emerald-200">{label('جاري التحقق من صلاحيات الحساب...','Verifying account permissions...')}</p>}
          {error&&<p role="alert" className="mb-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100">{error}</p>}
          {message&&<p role="status" className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">{message}</p>}
          {data&&<div className="grid gap-3 sm:grid-cols-2">
            {SCHOOL_SERVICE_CATALOG.map(item=>{
              const override=data.overrides[item.key];
              const selected:ServiceOverride=override===true?'allow':override===false?'deny':'default';
              const effective=data.features[item.key];
              return <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-sm font-black text-slate-900 dark:text-white">{isAr?item.ar:item.en}</strong>
                  <span className={'rounded-full px-2.5 py-1 text-[11px] font-black '+
                    (effective?'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200':'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200')}>
                    {effective?label('ظاهر','Available'):label('غير متاح','Unavailable')}
                  </span>
                </div>
                <fieldset disabled={busy!==null} className="mt-3">
                  <legend className="sr-only">{isAr?item.ar:item.en}</legend>
                  <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={(isAr?item.ar:item.en)+' — '+label('إعداد السماح','Access setting')}>
                    {(['default','allow','deny'] as const).map(mode=>
                      <button key={mode} type="button" onClick={()=>void setPermission(item.key,mode)}
                        aria-pressed={selected===mode}
                        className={'min-h-10 rounded-lg border px-1.5 py-2 text-xs font-black transition focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-50 '+
                          (selected===mode?
                            (mode==='allow'?'border-emerald-700 bg-emerald-700 text-white':mode==='deny'?'border-rose-700 bg-rose-700 text-white':'border-slate-700 bg-slate-800 text-white'):
                            'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100')}>
                        {mode==='default'?label('افتراضي','Default'):mode==='allow'?label('سماح','Allow'):label('منع','Deny')}
                      </button>
                    )}
                  </div>
                </fieldset>
              </div>;
            })}
          </div>}
        </div>
        <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          {label('المتاح هنا منح أو سحب خدمة فقط. صلاحيات الإدارة وتغيير دور الحساب تظل في أدواتها المستقلة.', 'Service access only. Administrative privileges and account-role changes remain separate.')}
        </footer>
      </section>
    </div>
  );
}
