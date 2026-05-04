import { createClient } from '@supabase/supabase-js';

// Use placeholder values to prevent the app from crashing on boot if env vars are missing
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!supabaseUrl.includes('supabase.co') || supabaseUrl.includes('placeholder')) {
  console.warn('Supabase URL is missing or invalid. Please set VITE_SUPABASE_URL in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
