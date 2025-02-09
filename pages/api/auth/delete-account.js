import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Deleting profile for email:', session.user.email);

    // First verify the profile exists
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('CustomerProfileInfo')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      throw fetchError;
    }

    if (!existingProfile) {
      console.log('No profile found to delete');
      return res.status(200).json({ message: 'No profile to delete' });
    }

    console.log('Found profile to delete:', existingProfile);

    // Delete from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from('CustomerProfileInfo')
      .delete()
      .eq('email', session.user.email);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      throw deleteError;
    }

    // Verify deletion
    const { data: checkProfile, error: checkError } = await supabaseAdmin
      .from('CustomerProfileInfo')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error verifying deletion:', checkError);
      throw checkError;
    }

    if (checkProfile) {
      console.error('Profile still exists after deletion');
      throw new Error('Failed to delete profile');
    }

    console.log('Profile deleted successfully');
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      error: 'Failed to delete account',
      details: error.message 
    });
  }
} 