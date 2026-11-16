import React,{createContext,useContext,useEffect,useState} from 'react';
import {Navigate} from 'react-router-dom';
import {getSchoolFeatureAccess,type SchoolFeatureAccess} from '../utils/efipsFeatureAccess';
import type {EfipsFeature} from '../utils/efipsFeatures';

/**
 * The route is protected by a verified Google school JWT and server-side grant.
 * No grant (or failed verification) means no page mount; a hidden link isn't security.
 */
export const SchoolFeatureContext=createContext<SchoolFeatureAccess|null>(null);
export const useSchoolFeatureContext=()=>useContext(SchoolFeatureContext);

export default function SchoolFeatureRoute({feature,children}:{
 feature:EfipsFeature;
 children:React.ReactNode|((access:SchoolFeatureAccess)=>React.ReactNode);
}){
 const [access,setAccess]=useState<SchoolFeatureAccess|null>(null);
 const [status,setStatus]=useState<'checking'|'allowed'|'denied'|'unavailable'>('checking');
 useEffect(()=>{
  let live=true;
  const check=(force=false)=>{getSchoolFeatureAccess(force).then(result=>{
    if(!live)return;
    setAccess(result);setStatus(result.features[feature]===true?'allowed':'denied');
  }).catch(()=>{if(live){setAccess(null);setStatus('unavailable')}})};
  // A recently verified school JWT may be reused during normal navigation.
  // Returning to the tab always forces a fresh server check; denial stays fail-closed.
  check();
  const onFocus=()=>check(true);
  window.addEventListener('focus',onFocus);
  return ()=>{live=false;window.removeEventListener('focus',onFocus)};
 },[feature]);
 if(status==='checking')return <div role="status" className="flex min-h-[50dvh] items-center justify-center p-8 text-center font-bold text-emerald-700 dark:text-emerald-200">Verifying school access…</div>;
 if(status==='denied')return <Navigate to="/home" replace/>;
 if(status==='unavailable'||!access)return <div role="alert" className="mx-auto my-16 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center font-bold text-amber-900 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-200">تعذر التحقق من صلاحيات الخدمات الآن. حاول تحديث الصفحة. / Unable to verify feature access. Please reload.</div>;
 return <SchoolFeatureContext.Provider value={access}>
   {typeof children==='function'?children(access):children}
 </SchoolFeatureContext.Provider>;
}
