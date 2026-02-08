import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AFFILIATE_CAP = 100;

interface AffiliateCapacity {
  count: number;
  isFull: boolean;
  spotsRemaining: number;
  loading: boolean;
}

/**
 * Hook to check current affiliate program capacity
 * Returns whether the program is full (100 affiliates reached)
 */
export function useAffiliateCapacity(): AffiliateCapacity {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data, error } = await supabase.rpc('get_affiliate_count');
        
        if (error) {
          console.error('Error fetching affiliate count:', error);
          setCount(0);
        } else {
          setCount(data || 0);
        }
      } catch (err) {
        console.error('Error in affiliate capacity check:', err);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return {
    count,
    isFull: count >= AFFILIATE_CAP,
    spotsRemaining: Math.max(0, AFFILIATE_CAP - count),
    loading,
  };
}

export { AFFILIATE_CAP };
