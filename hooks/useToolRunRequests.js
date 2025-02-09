import { useState } from 'react';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logError, ErrorTypes } from '../lib/errorLogging';

const WEBHOOK_URL = 'https://neverbend007.app.n8n.cloud/webhook-test/61b8c114-8bf9-4ad0-9f5b-035f99ab1baf';

export function useToolRunRequests() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createToolRunRequest = async (customerProfile, formData) => {
    setLoading(true);
    setError(null);

    try {
      if (!customerProfile?.id) {
        throw new Error('Customer profile not found');
      }

      // First create the request record in the database
      const newRequest = {
        cust_id: customerProfile.id,
        website: formData.website,
        email_address: formData.email_address,
        created_at: new Date().toISOString()
      };

      console.log('Creating tool run request:', newRequest);

      const { data: requestData, error: supabaseError } = await supabaseAdmin
        .from('ToolRunRequests')
        .insert([newRequest])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Call the n8n webhook directly
      const webhookData = {
        website: formData.website,
        email: formData.email_address,
        requestId: requestData.id
      };
      
      console.log('Calling webhook with data:', webhookData);

      const webhookResponse = await axios.post(WEBHOOK_URL, webhookData);

      // Log the webhook response
      console.log('Webhook response:', {
        status: webhookResponse.status,
        data: webhookResponse.data,
        headers: webhookResponse.headers
      });

      if (webhookResponse.data.error) {
        throw new Error(webhookResponse.data.error);
      }

      console.log('Tool run request created and webhook called successfully:', {
        requestId: requestData.id,
        webhookStatus: webhookResponse.status
      });

      toast.success('Request sent');
      return { data: requestData, error: null };
    } catch (err) {
      console.error('Failed to create tool run request:', err);
      
      let errorType = 'network';
      let errorSummary = 'Network Error';

      // Log the error with correct type and summary
      await logError({
        page: 'tool-run',
        originPage: 'tool-run',
        custId: customerProfile?.id,
        errorType: errorType,
        errorSummary: errorSummary,
        error: err
      });
      
      toast.error('Request not completed, please contact support');
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createToolRunRequest,
    loading,
    error
  };
} 