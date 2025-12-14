import { useState, useCallback } from 'react';
import { Celebrity } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getFallbackCelebrity } from '@/lib/fallbackCelebrities';

export const useCelebritySearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshAccess } = useAuth();
  const navigate = useNavigate();

  const searchCelebrity = useCallback(async (name: string): Promise<Celebrity | null> => {
    if (!user) {
      toast.error('Please sign in to search for celebrities', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/auth'),
        },
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch celebrity data first so we have the info to track
      const { data, error: fnError } = await supabase.functions.invoke('get-celebrity-data', {
        body: { name },
      });

      // Handle network-level errors
      if (fnError) {
        const message = 'Network error. Please check your connection and try again.';
        setError(message);
        toast.error(message);
        return null;
      }

      // If we got celebrity data, increment search with tracking info
      if (data?.celebrity) {
        const celebrity = data.celebrity as Celebrity;
        const celebritySlug = celebrity.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        await supabase.functions.invoke('increment-search', {
          body: {
            celebrityName: celebrity.name,
            celebritySlug,
            category: celebrity.profession,
          },
        });
      } else {
        // No celebrity data, still increment search count
        await supabase.functions.invoke('increment-search');
      }
      if (fnError) {
        const message = 'Network error. Please check your connection and try again.';
        setError(message);
        toast.error(message);
        return null;
      }

      // Handle soft errors returned as 200 with error field
      if (data?.error) {
        const errorCode = data.errorCode || 'ERROR';
        
        if (errorCode === 'AUTH_REQUIRED') {
          toast.error(data.error, {
            action: {
              label: 'Sign In',
              onClick: () => navigate('/auth'),
            },
          });
          setError(data.error);
          return null;
        } else if (errorCode === 'LIMIT_REACHED') {
          toast.error(data.error, {
            description: 'Unlock unlimited access for just $4.99',
            action: {
              label: 'Upgrade',
              onClick: async () => {
                const { data: paymentData } = await supabase.functions.invoke('create-payment');
                if (paymentData?.url) window.open(paymentData.url, '_blank');
              },
            },
          });
          setError(data.error);
          return null;
        } else {
          // For AI_ERROR, PARSE_ERROR, etc., try fallback data first
          const fallback = getFallbackCelebrity(name);
          if (fallback) {
            console.log('Using fallback data for:', name);
            return fallback;
          }
          // No fallback available, show error
          toast.error("We couldn't fetch data right now. Please try again in a moment.");
          setError(data.error);
          return null;
        }
      }

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
  }, [user, navigate]);

  const searchCelebritiesByCategory = useCallback(async (category: string): Promise<Celebrity[]> => {
    if (!user) {
      toast.error('Please sign in to browse categories', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/auth'),
        },
      });
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Increment search count
      const incrementRes = await supabase.functions.invoke('increment-search');
      if (incrementRes.data?.error) {
        console.warn('Increment search soft error:', incrementRes.data.error);
      }

      const { data, error: fnError } = await supabase.functions.invoke('get-celebrity-data', {
        body: { category },
      });

      if (fnError) {
        const message = 'Network error. Please check your connection and try again.';
        setError(message);
        toast.error(message);
        return [];
      }

      if (data?.error) {
        toast.error(data.error);
        setError(data.error);
        return [];
      }

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
  }, [user, navigate]);

  return {
    loading,
    error,
    searchCelebrity,
    searchCelebritiesByCategory,
  };
};
