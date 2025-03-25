
import { createClient } from '@supabase/supabase-js';

// These environment variables should be set in your deployment environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get a publicly accessible URL for a file
export const getPublicFileUrl = (path: string) => {
  const { data } = supabase.storage.from('pdfs').getPublicUrl(path);
  return data?.publicUrl || '';
};
