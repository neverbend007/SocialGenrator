import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug environment variables
console.log('Admin client environment variables check:', {
  url: supabaseUrl,
  serviceRole: supabaseServiceRole ? 'exists' : 'missing'
});

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL');
}
if (!supabaseServiceRole) {
  throw new Error('Missing Supabase service role key');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}); 