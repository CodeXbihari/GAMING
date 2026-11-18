import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://elfosfndhdlmczmzxeqa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_PBEniYSlXp74h2Z2ucdCMQ_jkncXQZE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
