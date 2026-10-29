import { supabase } from './supabase';

export type GoogleStudent = { id:number; student_id:string; name_ar:string; name_en:string; grade:string; points:number; created_at?:string };

const callbackFlag = 'efips_student_google';

export async function startGoogleStudentSignIn(): Promise<void> {
  const redirectTo = window.location.origin + window.location.pathname + '?' + callbackFlag + '=1';
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, queryParams: { hd: 'falcon-school.com', prompt: 'select_account' } }
  });
  if (error) throw error;
}

export async function completeGoogleStudentSignIn(): Promise<GoogleStudent | null> {
  const query = new URLSearchParams(window.location.search);
  if (query.get(callbackFlag) !== '1') return null;
  if (query.get('error')) throw new Error('GOOGLE_OAUTH_ERROR');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) throw new Error('GOOGLE_SESSION_MISSING');
  const { data, error } = await supabase.functions.invoke('google-school-student', {
    headers: { Authorization: 'Bearer ' + session.access_token }, body: {}
  });
  if (error || !data?.profile?.student_id) throw new Error('GOOGLE_ROSTER_MISMATCH');
  return data.profile as GoogleStudent;
}
