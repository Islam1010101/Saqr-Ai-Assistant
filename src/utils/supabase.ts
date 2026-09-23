import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mgbzzgnprbddajyfieop.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rIlOfaDSlrW89SMO1uVKVg_eLUw7x9W';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
