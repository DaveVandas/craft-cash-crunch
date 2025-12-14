import { useState, useCallback } from 'react';
import { Celebrity } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useCelebritySearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshAccess } = useAuth();
  const navigate = useNavigate();

  const checkAccess = useCallback(async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to search for celebrities', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/auth'),
        },
      });
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-access');
      if (error) throw error;

      // Keep AuthContext in sync
      await refreshAccess();

      // Lifetime access: always allow
      if (data?.hasLifetimeAccess) {
        return true;
      }

      // Free tier with no searches remaining
      if (data && !data.hasLifetimeAccess && data.searchesRemaining === 0) {
        toast.error('You have used all your free searches', {
          description: 'Unlock unlimited access for just $4.99',
          action: {
            label: 'Upgrade',
            onClick: async () => {
              const { data: paymentData } = await supabase.functions.invoke('create-payment');
              if (paymentData?.url) window.open(paymentData.url, '_blank');
            },
          },
        });
        return false;
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check access';
      console.error('Access check failed:', err);
      toast.error(message);
      return false;
    }
  }, [user, navigate, refreshAccess]);

  const searchCelebrity = useCallback(async (name: string): Promise<Celebrity | null> => {
    if (!(await checkAccess())) return null;

    setLoading(true);
    setError(null);

    try {
      // Increment search count first (backend will no-op for lifetime access)
      await supabase.functions.invoke('increment-search');

      // Then fetch celebrity data
      const { data, error: fnError } = await supabase.functions.invoke('get-celebrity-data', {
        body: { name },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      // Refresh access to update remaining searches after this search
      await refreshAccess();

      return data.celebrity as Celebrity;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch celebrity data';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [checkAccess, refreshAccess]);

  const searchCelebritiesByCategory = useCallback(async (category: string): Promise<Celebrity[]> => {
    if (!(await checkAccess())) return [];

    setLoading(true);
    setError(null);

    try {
      // Increment search count
      await supabase.functions.invoke('increment-search');

      const { data, error: fnError } = await supabase.functions.invoke('get-celebrity-data', {
        body: { category },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      await refreshAccess();

      return data.celebrities as Celebrity[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch celebrities';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [checkAccess, refreshAccess]);

  return {
    loading,
    error,
    searchCelebrity,
    searchCelebritiesByCategory,
  };
};
