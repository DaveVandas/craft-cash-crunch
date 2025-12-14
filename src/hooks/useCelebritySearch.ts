import { useState, useCallback } from 'react';
import { Celebrity } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useCelebritySearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, accessInfo, refreshAccess } = useAuth();
  const navigate = useNavigate();

  const accessLoaded = accessInfo !== null;

  const checkAccess = useCallback((): boolean => {
    if (!user) {
      toast.error('Please sign in to search for celebrities', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/auth'),
        },
      });
      return false;
    }

    if (!accessInfo?.hasLifetimeAccess && accessInfo?.searchesRemaining === 0) {
      toast.error('You have used all your free searches', {
        description: 'Unlock unlimited access for just $4.99',
        action: {
          label: 'Upgrade',
          onClick: async () => {
            const { data } = await supabase.functions.invoke('create-payment');
            if (data?.url) window.open(data.url, '_blank');
          },
        },
      });
      return false;
    }

    return true;
  }, [user, accessInfo, navigate]);

  const searchCelebrity = useCallback(async (name: string): Promise<Celebrity | null> => {
    if (!checkAccess()) return null;

    setLoading(true);
    setError(null);

    try {
      // Increment search count first
      await supabase.functions.invoke('increment-search');

      // Then fetch celebrity data
      const { data, error: fnError } = await supabase.functions.invoke('get-celebrity-data', {
        body: { name }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      // Refresh access to update remaining searches
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
    if (!checkAccess()) return [];

    setLoading(true);
    setError(null);

    try {
      // Increment search count
      await supabase.functions.invoke('increment-search');

      const { data, error: fnError } = await supabase.functions.invoke('get-celebrity-data', {
        body: { category }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

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
    hasAccess: accessInfo?.hasAccess ?? false,
    searchesRemaining: accessInfo?.searchesRemaining ?? 0,
    hasLifetimeAccess: accessInfo?.hasLifetimeAccess ?? false,
    accessLoaded,
  };
};
