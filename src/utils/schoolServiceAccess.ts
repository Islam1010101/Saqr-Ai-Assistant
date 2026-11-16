import { useEffect, useState } from 'react';
import { supabase } from './supabase';

/** Per-service grants are never a login role or an admin privilege. */
export const SCHOOL_SERVICE_CATALOG = [
  {key:'catalog',ar:'دليل المكتبة الورقية',en:'Physical book catalog'},
  {key:'digital_library',ar:'المكتبة الرقمية',en:'Digital library'},
  {key:'creators',ar:'بوابة المبدعين',en:'Creators portal'},
  {key:'national_identity',ar:'صقر وهوية وطن',en:'Saqr & UAE identity'},
  {key:'schedule',ar:'جدول حصص المكتبة',en:'Library schedule'},
  {key:'saqr_learning',ar:'صقر يساعدني',en:'Saqr Helps Me'},
  {key:'challenges',ar:'تحديات صقر',en:'Saqr challenges hub'},
  {key:'sort_library',ar:'تحدي رتّب المكتبة',en:'Organize the Library challenge'},
  {key:'studio',ar:'استديو صقر',en:'Saqr Studio'},
  {key:'reading_quest',ar:'بين السطور مع صقر',en:'Between the Lines'},
  {key:'podcast',ar:'بودكاست صقر',en:'Saqr Podcast'},
] as const;
export type SchoolServiceKey = typeof SCHOOL_SERVICE_CATALOG[number]['key'];
export type SchoolRole = 'student' | 'teacher' | 'admin';
export type ServiceOverride = 'default' | 'allow' | 'deny';
export type SchoolFeatureSnapshot = {
  role:SchoolRole;
  features:Record<SchoolServiceKey,boolean>;
  overrides:Partial<Record<SchoolServiceKey,boolean>>;
};

const SERVICES = new Set<string>(SCHOOL_SERVICE_CATALOG.map(item => item.key));
let activeRequest: Promise<SchoolFeatureSnapshot|null>|null = null;
let cache:{userId:string;value:SchoolFeatureSnapshot;time:number}|null = null;

/** The Edge Function confirms live Google school identity, roster membership,
 * staff-admin role and every override; NEVER trust localStorage or user metadata.
 */
export async function loadSchoolServiceAccess(force=false): Promise<SchoolFeatureSnapshot|null> {
  const {data:{session},error} = await supabase.auth.getSession();
  if(error||!session?.access_token||!session.user?.id){cache=null;return null;}
  if(!force&&cache?.userId===session.user.id&&Date.now()-cache.time<10000)return cache.value;
  if(activeRequest)return activeRequest;
  activeRequest=(async()=>{
    const {data,error:lookupError}=await supabase.functions.invoke('efips-feature-access',{
      body:{action:'my-access'},
      headers:{Authorization:'Bearer '+session.access_token}
    });
    if(lookupError||data?.ok!==true||!data.features||!['student','teacher','admin'].includes(data.role))
      throw new Error('SCHOOL_FEATURE_ACCESS_UNAVAILABLE');
    const features={} as Record<SchoolServiceKey,boolean>;
    const overrides:Partial<Record<SchoolServiceKey,boolean>>={};
    for(const service of SCHOOL_SERVICE_CATALOG){
      features[service.key]=data.features[service.key]===true;
      if(typeof data.overrides?.[service.key]==='boolean')overrides[service.key]=data.overrides[service.key];
    }
    const value:SchoolFeatureSnapshot={role:data.role,features,overrides};
    cache={userId:session.user.id,value,time:Date.now()};
    return value;
  })().finally(()=>{activeRequest=null;});
  return activeRequest;
}

export function invalidateSchoolServiceAccess(){
  cache=null;
  window.dispatchEvent(new Event('efips-features-changed'));
}

export function useSchoolServiceAccess(){
  const [snapshot,setSnapshot]=useState<SchoolFeatureSnapshot|null>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let active=true;
    const refresh=()=>{
      loadSchoolServiceAccess(true).then(value=>{if(active){setSnapshot(value);setLoading(false);}})
        .catch(()=>{if(active){setSnapshot(null);setLoading(false);}});
    };
    refresh();
    window.addEventListener('focus',refresh);
    window.addEventListener('efips-features-changed',refresh);
    return()=>{active=false;window.removeEventListener('focus',refresh);window.removeEventListener('efips-features-changed',refresh);};
  },[]);
  return {snapshot,loading};
}

export function useSchoolServiceAllowed(key:SchoolServiceKey){
  const {snapshot,loading}=useSchoolServiceAccess();
  return {allowed:snapshot?.features[key]===true,loading,role:snapshot?.role||null};
}

export function schoolServiceForRoute(path:string):SchoolServiceKey|null {
  if(path==='/schedule')return 'schedule';
  if(path==='/saqr-learning')return 'saqr_learning';
  if(path==='/saqr-national-identity'||path.startsWith('/saqr-national-identity/'))return 'national_identity';
  if(path==='/saqr-challenges')return 'challenges';
  if(path==='/game')return 'sort_library';
  if(path==='/saqr-studio')return 'studio';
  if(path==='/saqr-reading-quest')return 'reading_quest';
  if(path==='/podcast')return 'podcast';
  if(path==='/creators')return 'creators';
  if(path==='/digital-library'||path.startsWith('/digital-library/'))return 'digital_library';
  if(path==='/search')return 'catalog';
  return null;
}

export function isSchoolServiceKey(key:string):key is SchoolServiceKey{return SERVICES.has(key);}
