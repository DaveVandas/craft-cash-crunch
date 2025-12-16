import { useState, useCallback } from 'react';
import { Celebrity } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ANON_SEARCH_KEY = 'wealth_perspective_anon_searches';

const getAnonSearchCount = (): number => {
  try {
    const stored = localStorage.getItem(ANON_SEARCH_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

const incrementAnonSearchCount = (): number => {
  const current = getAnonSearchCount();
  const newCount = current + 1;
  try {
    localStorage.setItem(ANON_SEARCH_KEY, newCount.toString());
  } catch {
    // localStorage not available
  }
  return newCount;
};

export const useCelebrityData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCelebrity = useCallback(async (name: string): Promise<Celebrity | null> => {
    setLoading(true);
    setError(null);

    try {
      const anonCount = getAnonSearchCount();
      
      const { data, error: fnError } = await supabase.functions.invoke('get-celebrity-data', {
        body: { name },
        headers: {
          'X-Anonymous-Search-Count': anonCount.toString(),
        },
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Increment anonymous search count if not logged in
      if (!user) {
        incrementAnonSearchCount();
      }

      return data.celebrity as Celebrity;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch celebrity data';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchCelebritiesByCategory = useCallback(async (category: string): Promise<Celebrity[]> => {
    setLoading(true);
    setError(null);

    try {
      const anonCount = getAnonSearchCount();
      
      const { data, error: fnError } = await supabase.functions.invoke('get-celebrity-data', {
        body: { category },
        headers: {
          'X-Anonymous-Search-Count': anonCount.toString(),
        },
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Increment anonymous search count if not logged in
      if (!user) {
        incrementAnonSearchCount();
      }

      return data.celebrities as Celebrity[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch celebrities';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    fetchCelebrity,
    fetchCelebritiesByCategory
  };
};
