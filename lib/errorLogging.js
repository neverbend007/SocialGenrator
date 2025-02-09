import { supabaseAdmin } from './supabaseAdmin';

// Simplified error types to match exactly what we see in the database
export const ErrorTypes = {
  NETWORK: 'network',
  UNKNOWN: 'unknown'
  // Add other types as we need them, but keep them exactly matching the database values
};

export async function logError({ 
  page,
  custId = null,
  originPage = null,
  errorType = 'unknown',
  errorSummary = 'Unknown error',
  error
}) {
  try {
    const errorData = {
      created_at: new Date().toISOString(),
      page: page || 'unknown',
      cust_id: custId,
      origin_page: originPage || page || 'unknown',
      error_type: errorType.toLowerCase(), // Ensure lowercase to match database
      error_summary: errorSummary // Keep the exact error summary
    };

    // Store in database
    const { data, error: dbError } = await supabaseAdmin
      .from('Errors')
      .insert([errorData])
      .select()
      .single();

    if (dbError) {
      console.error('Failed to log error:', dbError);
    }

    return data;
  } catch (err) {
    console.error('Error logging failed:', err);
    return null;
  }
} 