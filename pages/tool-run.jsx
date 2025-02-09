import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Navigation from '../components/Navigation';
import { useCustomerProfile } from '../hooks/useCustomerProfile';
import { useToolRunRequests } from '../hooks/useToolRunRequests';
import { useToolUsage } from '../hooks/useToolUsage';
import UsageDisplay from '../components/UsageDisplay';
import { Toaster } from 'react-hot-toast';

export default function ToolRun() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { profile, loading: profileLoading } = useCustomerProfile(session?.user?.id, session);
  const { createToolRunRequest, loading: requestLoading, error: requestError } = useToolRunRequests();
  const { refresh: refreshUsage, ...usage } = useToolUsage(profile);
  
  const [formData, setFormData] = useState({
    website: '',
    email_address: ''
  });

  // Combined auth and profile check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    } else if (status === "authenticated" && !profileLoading) {
      if (!profile) {
        console.log('No profile found, redirecting to account');
        router.push('/account');
      } else {
        console.log('Profile found:', profile);
      }
    }
  }, [status, profileLoading, profile, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!profile) {
        throw new Error('Please wait for profile to load');
      }

      if (!formData.website || !formData.email_address) {
        throw new Error('Please fill in all required fields');
      }

      const { error } = await createToolRunRequest(profile, formData);
      
      if (error) {
        throw new Error(error);
      }

      toast.success('Tool run request submitted successfully!');
      // Clear all fields after successful submission
      setFormData({
        website: '',
        email_address: ''
      });
      
      // Refresh usage data after successful request
      await refreshUsage();
    } catch (err) {
      console.error('Error submitting request:', err);
      toast.error(err.message);
    }
  };

  // Simplified loading checks
  if (status === "loading" || profileLoading) {
    return (
      <>
        <Navigation session={session} />
        <div className="container">
          <div className="content-container">
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!session || !profile) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Navigation session={session} />
      <div className="container">
        <div className="content-container">
          <h1 className="page-title">Run Content Generation Tool</h1>
          
          <UsageDisplay usage={usage} tier={profile?.account_tier} />
          
          <form onSubmit={handleSubmit} className="tool-run-form">
            <div className="form-group">
              <label htmlFor="website">Website URL *</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_address">Email Address *</label>
              <input
                type="email"
                id="email_address"
                name="email_address"
                value={formData.email_address}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="your@email.com"
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={requestLoading}
            >
              {requestLoading ? 'Submitting...' : 'Run Tool'}
            </button>
          </form>

          {requestError && (
            <div className="error-message">
              {requestError}
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
} 