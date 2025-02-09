import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { toast } from 'react-hot-toast';

export default function InitialProfileSetup({ session, onComplete }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    preferred_name: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Test Supabase connection
    console.log('Testing Supabase connection...');
    supabaseAdmin
      .from('CustomerProfileInfo')
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error('Supabase test failed:', error);
        } else {
          console.log('Supabase test successful:', data);
        }
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Get the selected tier from localStorage
      const selectedTier = localStorage.getItem('selectedTier') || 'Free';

      const newProfile = {
        first_name: formData.first_name,
        preferred_name: formData.preferred_name,
        email: session.user.email,
        account_tier: selectedTier,
        created_at: new Date().toISOString(),
        last_edited: new Date().toISOString()
      };

      console.log('Upserting profile with:', newProfile);

      const { data, error: supabaseError } = await supabaseAdmin
        .from('CustomerProfileInfo')
        .upsert([newProfile], {
          onConflict: 'email',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw supabaseError;
      }

      console.log('Profile upserted:', data);
      toast.success('Profile created successfully!');
      
      // Store the profile data in localStorage temporarily
      localStorage.setItem('newProfile', JSON.stringify(data));
      
      // Clear the stored tier after successful profile creation
      localStorage.removeItem('selectedTier');
      
      // Use router.replace instead of window.location
      router.replace('/account?new=true');
    } catch (err) {
      console.error('Profile creation error:', err);
      setError(err.message);
      toast.error('Failed to create profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content-container">
        <div className="welcome-setup">
          <h1>Welcome to Custom Content Generator!</h1>
          <p>Please complete your profile to continue</p>
          
          {error && (
            <div className="error-message">
              Error: {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="setup-form">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferred_name">Preferred Name (optional)</label>
              <input
                type="text"
                id="preferred_name"
                name="preferred_name"
                value={formData.preferred_name}
                onChange={handleChange}
                className="form-input"
                placeholder="What should we call you?"
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 