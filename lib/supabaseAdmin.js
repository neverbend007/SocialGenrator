import { createClient } from '@supabase/supabase-js';

// Debug environment variables
console.log('Admin client environment variables check:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing'
});

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing Supabase URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase service role key');
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 