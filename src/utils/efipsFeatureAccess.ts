import { supabase } from './supabase';
import type { EfipsFeatureMap } from './efipsFeatures';

/** Only server-verified entitlements can populate this memory-only UI snapshot.
 * Server-side page guards and sensitive operations still authenticate independently.
 */
export type SchoolFeatureAccess = {role:'student'|'teacher'|'admin';features:EfipsFeatureMap};
type Verified = {token:string;verifiedAt:number;access:SchoolFeatureAccess};
const CACHE_MS=30_000;
let verified:Verified|null=null;
let pending:{token:string;promise:Promise<SchoolFeatureAccess>}|null=null;
let authGeneration=0;

export function clearSchoolFeatureAccessCache(){
  authGeneration++;
  verified=null;
  pending=null;
}

/** Instant, already-verified UI display on same-tab navigation; never persisted. */
export function getCachedSchoolFeatureAccess():SchoolFeatureAccess|null {
  return verified && Date.now()-verified.verifiedAt<CACHE_MS ? verified.access : null;
}

// Clear on school-account changes, Google sign-out or token rotation.
// Do not call async auth methods from this callback (Supabase lock safety).
supabase.auth.onAuthStateChange((event,session)=>{
  if(event==='SIGNED_OUT' ||
     (verified && session?.access_token!==verified.token) ||
     (pending && session?.access_token && session.access_token!==pending.token)){
    clearSchoolFeatureAccessCache();
  }
});

export async function getSchoolFeatureAccess(force=false):Promise<SchoolFeatureAccess> {
  const {data:{session},error}=await supabase.auth.getSession();
  if(error||!session?.access_token){
    clearSchoolFeatureAccessCache();
    throw new Error('SCHOOL_SIGN_IN_REQUIRED');
  }
  const token=session.access_token;
  if(!force && verified?.token===token && Date.now()-verified.verifiedAt<CACHE_MS)
    return verified.access;
  // Header, route guard and orbit may mount together. A forced refresh cannot
  // spawn another request while one is already active for the SAME JWT.
  if(pending?.token===token)return pending.promise;
  const version=authGeneration;
  const promise=supabase.functions.invoke('efips-feature-access',{
    body:{action:'my-access'},headers:{Authorization:'Bearer '+token}
  }).then(({data,error})=>{
    if(error||!data?.ok||!data.features||
       !['student','teacher','admin'].includes(data.role))
      throw new Error('FEATURE_ACCESS_UNAVAILABLE');
    if(authGeneration!==version)throw new Error('SCHOOL_SESSION_CHANGED');
    const result={role:data.role,features:data.features} as SchoolFeatureAccess;
    verified={token,verifiedAt:Date.now(),access:result};
    return result;
  });
  pending={token,promise};
  try{return await promise;}
  finally{if(pending?.promise===promise)pending=null;}
}
