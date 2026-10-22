import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

const EVENT = 'efips-cloud-auth-changed';
export const isVerifiedReader = (user: User | null): user is User =>
  !!user?.id && !!user.email && !!user.email_confirmed_at;

export const getVerifiedReader = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  return !error && isVerifiedReader(data.user) ? data.user : null;
};

export const useCloudReader = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      const found = await getVerifiedReader();
      if (mounted) { setUser(found); setLoading(false); }
    };
    void refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // Auth callback must not await Supabase queries synchronously.
      setTimeout(() => { void refresh(); window.dispatchEvent(new Event(EVENT)); }, 0);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);
  return { user, loading };
};
export const CLOUD_AUTH_EVENT = EVENT;

export const requestReaderCode = async (email: string): Promise<void> => {
  const trimmed = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.length > 254)
    throw new Error('Enter a valid email address.');
  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: { shouldCreateUser: true, emailRedirectTo: window.location.origin + window.location.pathname + '#/home' }
  });
  if (error) throw error;
};
export const verifyReaderCode = async (email: string, token: string): Promise<void> => {
  if (!/^\d{6,8}$/.test(token.trim())) throw new Error('Invalid verification code');
  const { error } = await supabase.auth.verifyOtp({
    email: email.trim(), token: token.trim(), type: 'email'
  });
  if (error) throw error;
};

export const loadCloudSaved = async (uid: string): Promise<string[]> => {
  const { data, error } = await supabase.from('efips_read_later')
    .select('book_key').eq('user_id', uid).limit(1000);
  if (error) throw error;
  return (data || []).map(row => String(row.book_key));
};
export const persistCloudSaved = async (uid: string, key: string, saved: boolean): Promise<void> => {
  const user = await getVerifiedReader();
  if (!user || user.id !== uid) throw new Error('A verified account is required');
  if (saved) {
    const { error } = await supabase.from('efips_read_later').upsert(
      { user_id: uid, book_key: key }, { onConflict: 'user_id,book_key', ignoreDuplicates: true }
    );
    if (error) throw error;
  } else {
    const { error } = await supabase.from('efips_read_later').delete()
      .eq('user_id', uid).eq('book_key', key);
    if (error) throw error;
  }
};

export const currentReadingMonth = (): string => {
  const now = new Date();
  return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-01';
};
export const loadReadingProgress = async (uid: string, month: string) => {
  const [goals, completions] = await Promise.all([
    supabase.from('efips_reading_goals').select('target_books').eq('user_id', uid).eq('goal_month',month).maybeSingle(),
    supabase.from('efips_reading_completions').select('book_key,completed_on').eq('user_id',uid).limit(1000)
  ]);
  if(goals.error) throw goals.error;
  if(completions.error) throw completions.error;
  return { goal: goals.data?.target_books == null ? null : Number(goals.data.target_books),
    completed: (completions.data || []).map(r=>({key: String(r.book_key),date: String(r.completed_on)})) };
};
export const saveReadingGoal = async(uid:string,month:string,target:number) => {
  const user = await getVerifiedReader(); if(!user || user.id!==uid) throw new Error('Verification required');
  const {error}=await supabase.from('efips_reading_goals').upsert({user_id:uid,goal_month:month,target_books:target,updated_at:new Date().toISOString()},{onConflict:'user_id,goal_month'});
  if(error) throw error;
};
export const saveReadingCompletion = async(uid:string,key:string,date:string|null) => {
  const user=await getVerifiedReader(); if(!user || user.id!==uid) throw new Error('Verification required');
  if(date) {
    const {error}=await supabase.from('efips_reading_completions').upsert({user_id:uid,book_key:key,completed_on:date},{onConflict:'user_id,book_key'});
    if(error) throw error;
  } else {
    const {error}=await supabase.from('efips_reading_completions').delete().eq('user_id',uid).eq('book_key',key);
    if(error) throw error;
  }
};
