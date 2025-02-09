import { useState, useEffect, useCallback } from 'react';
import { supabaseAdmin } from '../lib/supabaseAdmin';

export function useCustomerProfile(userId, session) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for email:', session.user.email);
        
        const { data, error } = await supabaseAdmin
          .from('CustomerProfileInfo')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        console.log('Profile fetch result:', { data, error });

        if (error) {
          throw error;
        }

        setProfile(data); // Will be null if no profile exists
        setError(null);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchProfile();
  }, [session]);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    localStorage.removeItem('newProfile');
  }, []);

  async function updateProfile(updates) {
    console.log('Updating profile:', updates);
    
    try {
      const { data, error } = await supabaseAdmin
        .from('CustomerProfileInfo')
        .update({
          ...updates,
          last_edited: new Date().toISOString()
        })
        .eq('email', session.user.email)
        .single();

      console.log('Update result:', { data, error });

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error('Profile update error:', err);
      return { data: null, error: err.message };
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    clearProfile,
    setProfile
  };
} 