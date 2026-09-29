import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mgbzzgnprbddajyfieop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYnp6Z25wcmJkZGFqeWZpZW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNDgzMzgsImV4cCI6MjEwNTcyNDMzOH0.vA0UDiXOltingkfNZMDRHGBKgZ5cW-lrvS1YYar-nTI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
