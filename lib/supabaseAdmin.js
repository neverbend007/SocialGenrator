import { createClient } from '@supabase/supabase-js';

// Debug environment variables
console.log('Admin client environment check:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'missing',
  serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing',
  nodeEnv: process.env.NODE_ENV
});

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not defined');
  throw new Error('Missing Supabase URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  throw new Error('Missing Supabase service role key');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}); 