import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { useCustomerProfile } from '../hooks/useCustomerProfile';
import { useToolUsage } from '../hooks/useToolUsage';
import { toast, Toaster } from 'react-hot-toast';
import DeleteAccountModal from '../components/DeleteAccountModal';
import { supabase } from '../lib/supabaseClient';
import InitialProfileSetup from '../components/InitialProfileSetup';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import AccountUsageIndicator from '../components/AccountUsageIndicator';

export default function Account() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { profile, loading, error, updateProfile, setProfile } = useCustomerProfile(session?.user?.id, session);
  const usage = useToolUsage(profile);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    preferred_name: '',
    email: '',
    account_tier: ''
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [needsInitialSetup, setNeedsInitialSetup] = useState(false);

  useEffect(() => {
    console.log('Account page state:', {
      status,
      loading,
      profile,
      error,
      needsInitialSetup
    });
  }, [status, loading, profile, error, needsInitialSetup]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (router.query.new === 'true') {
      const newProfileData = localStorage.getItem('newProfile');
      if (newProfileData) {
        try {
          const parsedProfile = JSON.parse(newProfileData);
          setProfile(parsedProfile);
          setNeedsInitialSetup(false);
          localStorage.removeItem('newProfile'); // Clean up
          router.replace('/account'); // Remove query param
        } catch (err) {
          console.error('Error parsing new profile:', err);
        }
      }
    }
  }, [router.query.new]);

  useEffect(() => {
    async function checkExistingProfile() {
      if (session?.user?.email) {
        try {
          const { data, error } = await supabaseAdmin
            .from('CustomerProfileInfo')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error checking profile:', error);
            return;
          }

          // Only show setup if explicitly on account page and no profile exists
          setNeedsInitialSetup(!data && router.pathname === '/account');
          
          if (data) {
            setProfile(data);
          }
        } catch (err) {
          console.error('Failed to check profile:', err);
        }
      }
    }

    if (status === "authenticated" && !loading) {
      checkExistingProfile();
    }
  }, [session, status, loading, router.pathname]);

  useEffect(() => {
    if (status === "authenticated" && !loading) {
      if (profile) {
        setNeedsInitialSetup(false);
      }
    }
  }, [status, loading, profile]);

  useEffect(() => {
    if (profile) {
      console.log('Updating form data with profile:', profile);
      setFormData({
        first_name: profile.first_name || '',
        preferred_name: profile.preferred_name || '',
        email: profile.email || '',
        account_tier: profile.account_tier || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await updateProfile(formData);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Profile updated successfully!');
      setEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      console.log('Starting account deletion process');
      
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (!response.ok) {
        throw new Error(data.error + (data.details ? `: ${data.details}` : ''));
      }

      // Clear all local storage data
      localStorage.clear();
      
      // Clear any profile state
      setProfile(null);
      setFormData({
        first_name: '',
        preferred_name: '',
        email: '',
        account_tier: ''
      });

      console.log('Account deleted successfully, signing out...');
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete account: ' + error.message);
      setIsDeleteModalOpen(false);
    }
  };

  if (status === "loading") {
    return (
      <>
        <Navigation session={session} />
        <div className="container">
          <div className="content-container">
            <p>Loading session...</p>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Navigation session={session} />
        <div className="container">
          <div className="content-container">
            <p>Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation session={session} />
        <div className="container">
          <div className="content-container">
            <h1 className="page-title">Error</h1>
            <p className="feature-text">Error loading profile: {error}</p>
          </div>
        </div>
      </>
    );
  }

  if (needsInitialSetup) {
    console.log('Rendering InitialProfileSetup');
    return (
      <>
        <Navigation session={session} />
        <InitialProfileSetup 
          session={session} 
          onComplete={() => {
            setNeedsInitialSetup(false);
            router.reload();
          }}
        />
      </>
    );
  }

  return (
    <>
      <Navigation session={session} />
      <div className="container">
        <div className="content-container">
          <h1 className="page-title">My Account</h1>

          <div className="account-section">
            <h2 className="section-title">Usage Overview</h2>
            <AccountUsageIndicator usage={usage} tier={profile?.account_tier} />
          </div>

          <div className="account-section">
            <h2 className="section-title">Profile Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>First Name</label>
                <p>{profile?.first_name || 'Not set'}</p>
              </div>
              <div className="info-item">
                <label>Preferred Name</label>
                <p>{profile?.preferred_name || 'Not set'}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{profile?.email || session.user.email}</p>
              </div>
              <div className="info-item">
                <label>Account Tier</label>
                <p>{profile?.account_tier || 'Free'}</p>
              </div>
              <div className="info-item">
                <label>Account Created</label>
                <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</p>
              </div>
              <div className="info-item">
                <label>Last Updated</label>
                <p>{profile?.last_edited ? new Date(profile.last_edited).toLocaleDateString() : 'Never'}</p>
              </div>
            </div>
          </div>

          {!editing ? (
            <button onClick={() => setEditing(true)} className="edit-button">
              Edit Profile
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <h2>Edit Profile</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="preferred_name">Preferred Name</label>
                  <input
                    type="text"
                    id="preferred_name"
                    name="preferred_name"
                    value={formData.preferred_name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="button-group">
                <button type="submit" className="save-button">Save Changes</button>
                <button type="button" onClick={() => setEditing(false)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="danger-zone-container">
            <h2 className="danger-zone-title">Danger Zone</h2>
            <div className="danger-zone-content">
              <div className="danger-zone-warning">
                <h3>Delete Account</h3>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="delete-account-button"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
} 