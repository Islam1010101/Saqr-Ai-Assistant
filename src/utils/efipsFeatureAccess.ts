import { supabase } from './supabase';
import type { EfipsFeatureMap } from './efipsFeatures';

/** Verified, server-authoritative school entitlements. Never trust user_type/localStorage. */
export type SchoolFeatureAccess = {role:'student'|'teacher'|'admin';features:EfipsFeatureMap};
let cache:{token:string;expires:number;promise:Promise<SchoolFeatureAccess>}|null=null;

export function clearSchoolFeatureAccessCache(){cache=null;}

export async function getSchoolFeatureAccess(force=false):Promise<SchoolFeatureAccess> {
  const {data:{session},error}=await supabase.auth.getSession();
  if(error||!session?.access_token)throw new Error('SCHOOL_SIGN_IN_REQUIRED');
  const token=session.access_token;
  if(!force&&cache&&cache.token===token&&Date.now()<cache.expires)return cache.promise;
  const promise=supabase.functions.invoke('efips-feature-access',{
    body:{action:'my-access'},headers:{Authorization:'Bearer '+token}
  }).then(({data,error})=>{
    if(error||!data?.ok||!data.features||
       !['student','teacher','admin'].includes(data.role))throw new Error('FEATURE_ACCESS_UNAVAILABLE');
    return {role:data.role,features:data.features} as SchoolFeatureAccess;
  });
  cache={token,expires:Date.now()+12000,promise};
  try{return await promise;}catch(error){if(cache?.promise===promise)cache=null;throw error;}
}
