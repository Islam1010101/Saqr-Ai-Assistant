import { supabase } from './supabase';

/**
 * Independent per-service visibility. This does NOT confer a new school role or
 * administrative privilege. All values come from the verified Edge Function.
 */
export const FEATURE_CATALOG = [
  {key:'catalog', ar:'دليل المكتبة', en:'Library catalog'},
  {key:'saqr_ai', ar:'صقر الذكي', en:'Ask Saqr AI'},
  {key:'digital_library', ar:'المكتبة الرقمية', en:'Digital library'},
  {key:'ielts', ar:'مركز IELTS', en:'IELTS centre'},
  {key:'creators', ar:'بوابة المبدعين', en:'Creators portal'},
  {key:'saqr_learning', ar:'صقر يساعدني', en:'Saqr Helps Me'},
  {key:'schedule', ar:'جدول حصص المكتبة', en:'Library timetable'},
  {key:'national_identity', ar:'صقر وهوية وطن', en:'National identity'},
  {key:'passport', ar:'جواز صقر الثقافي', en:'Cultural passport'},
  {key:'emirati_language', ar:'كنوز لغتنا الإماراتية', en:'Emirati language'},
  {key:'heritage_detective', ar:'محقق ذاكرة وطن', en:'Heritage detective'},
  {key:'flag_glory', ar:'تحدي راية المجد', en:'Flag glory challenge'},
  {key:'voice_union', ar:'تحدي صوت الاتحاد', en:'Voice of the Union'},
  {key:'national_books', ar:'كتب الهوية الوطنية', en:'National identity books'},
  {key:'challenges', ar:'مركز تحديات صقر', en:'Challenges hub'},
  {key:'reading_quest', ar:'بين السطور مع صقر', en:'Between the Lines'},
  {key:'sort_library', ar:'رتب المكتبة', en:'Sort the library'},
  {key:'saqr_studio', ar:'استديو صقر', en:'Saqr Studio'},
  {key:'podcast', ar:'بودكاست صقر', en:'Saqr podcast'},
  {key:'suggestions', ar:'المقترحات', en:'Suggestions'},
] as const;
export type FeatureKey = typeof FEATURE_CATALOG[number]['key'];
export type FeatureFlags = Record<FeatureKey, boolean>;
export type SchoolRole = 'student' | 'teacher' | 'admin';
export type FeatureAccess = {
  ready: boolean;
  role: SchoolRole | null;
  features: FeatureFlags | null;
  error: boolean;
};
export const EMPTY_FEATURE_ACCESS: FeatureAccess = {ready:false,role:null,features:null,error:false};
export const canUseFeature = (access: FeatureAccess, key: FeatureKey): boolean =>
  access.ready && !access.error && access.features?.[key] === true;
export const FEATURE_PATHS: [string, FeatureKey][] = [
  ['/digital-library/english/ielts','ielts'],
  ['/digital-library','digital_library'],
  ['/saqr-national-identity/anthem','voice_union'],
  ['/saqr-national-identity/books','national_books'],
  ['/saqr-national-identity','national_identity'],
  ['/saqr-learning','saqr_learning'],
  ['/saqr-challenges','challenges'],
  ['/saqr-reading-quest','reading_quest'],
  ['/saqr-studio','saqr_studio'],
  ['/game','sort_library'],
  ['/podcast','podcast'],
  ['/schedule','schedule'],
  ['/creators','creators'],
  ['/search','catalog'],
  ['/smart-search','saqr_ai'],
  ['/feedback','suggestions'],
];
export const featureForPath = (path: string): FeatureKey | null =>
  FEATURE_PATHS.find(([route]) => path === route || path.startsWith(route + '/'))?.[1] || null;

export async function getMyFeatureAccess(): Promise<FeatureAccess> {
  const session = await supabase.auth.getSession();
  const jwt = session.data.session?.access_token;
  if (session.error || !jwt) return {ready:true,role:null,features:null,error:true};
  const {data,error} = await supabase.functions.invoke('efips-feature-access', {
    body:{action:'my-features'}, headers:{Authorization:'Bearer ' + jwt}
  });
  if (error || !data || !data.ok || !['student','teacher','admin'].includes(data.role) || !data.features)
    return {ready:true,role:null,features:null,error:true};
  // Never trust extra feature names or non-boolean answers from the transport.
  const features = Object.fromEntries(FEATURE_CATALOG.map(({key}) => [key, data.features[key] === true])) as FeatureFlags;
  return {ready:true,role:data.role as SchoolRole,features,error:false};
}
