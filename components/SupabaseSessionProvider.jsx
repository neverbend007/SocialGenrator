import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '../lib/supabaseClient';

export default function SupabaseSessionProvider({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    async function setupSupabaseSession() {
      if (session?.user?.email) {
        try {
          // Sign in to Supabase using email
          const { data, error } = await supabase.auth.signInWithPassword({
            email: session.user.email,
            // Use a consistent password or token here
            password: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 'default-password'
          });

          if (error) {
            console.error('Supabase auth error:', error);
          } else {
            console.log('Supabase session established');
          }
        } catch (err) {
          console.error('Failed to setup Supabase session:', err);
        }
      }
    }

    setupSupabaseSession();
  }, [session]);

  return children;
} 