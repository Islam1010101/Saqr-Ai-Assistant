import { supabase } from './supabase';
export type LearningFeatures = {
  read_together: boolean;
  picture_guidance: boolean;
  focus_steps: boolean;
  calm_display: boolean;
};
export async function getSaqrLearningAccess(): Promise<{allowed:boolean;features:LearningFeatures|null}> {
  const sessionResult = await supabase.auth.getSession();
  const token = sessionResult.data.session?.access_token;
  if (sessionResult.error || !token) return {allowed:false,features:null};
  const result = await supabase.functions.invoke('saqr-learning-access', {
    body:{action:'my-access'},
    headers:{Authorization:'Bearer '+token}
  });
  if(result.error || !result.data || typeof result.data.allowed!=='boolean') throw new Error('ACCESS_UNAVAILABLE');
  if(!result.data.allowed) return {allowed:false,features:null};
  const data = result.data.features || {};
  return {allowed:true,features:{
    read_together:data.read_together===true,
    picture_guidance:data.picture_guidance===true,
    focus_steps:data.focus_steps===true,
    calm_display:data.calm_display===true
  }};
}