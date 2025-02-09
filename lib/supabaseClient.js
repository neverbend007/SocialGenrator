import { createClient } from '@supabase/supabase-js';

// Debug environment variables
console.log('Environment variables check:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'exists' : 'missing',
  serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing'
});

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing Supabase URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase anon key');
}

console.log('Initializing Supabase with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  if (session) {
    console.log('Session found:', session.user.email);
  }
});

// Test the connection
supabase.from('CustomerProfileInfo').select('*').limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection successful, test data:', data);
    }
  }); 