import { useState, useEffect, useCallback } from 'react';
import { supabaseAdmin } from '../lib/supabaseAdmin';

export function useToolUsage(profile) {
  const [usage, setUsage] = useState({
    used: 0,
    remaining: 0,
    spent: 0,
    isLoading: true,
    error: null
  });

  const fetchUsage = useCallback(async () => {
    if (!profile) return;

    try {
      setUsage(prev => ({ ...prev, isLoading: true }));
      
      // Get the first day of current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Get tool runs for current month
      const { data: runs, error } = await supabaseAdmin
        .from('ToolRunRequests')
        .select('*')
        .eq('cust_id', profile.id)
        .gte('created_at', startOfMonth.toISOString());

      if (error) throw error;

      const monthlyRuns = runs?.length || 0;
      let remainingRuns = 0;
      let spent = 0;

      switch (profile.account_tier) {
        case 'Single Use':
          spent = monthlyRuns * 5; // $5 per run
          remainingRuns = 1; // Always can buy another single run
          break;
        case 'Pro':
          remainingRuns = Math.max(0, 50 - monthlyRuns);
          break;
        case 'Business':
          remainingRuns = Math.max(0, 200 - monthlyRuns);
          break;
        case 'Enterprise':
          remainingRuns = Infinity;
          break;
        default:
          remainingRuns = 0;
      }

      setUsage({
        used: monthlyRuns,
        remaining: remainingRuns,
        spent: spent,
        isLoading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching tool usage:', err);
      setUsage(prev => ({
        ...prev,
        isLoading: false,
        error: err.message
      }));
    }
  }, [profile]);

  // Initial fetch
  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { ...usage, refresh: fetchUsage };
} 