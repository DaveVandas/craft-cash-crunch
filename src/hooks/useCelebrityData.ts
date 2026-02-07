import { useState, useCallback } from 'react';
import { Celebrity } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ANON_SEARCH_KEY = 'wealth_perspective_anon_searches';
const CELEBRITY_CACHE_KEY = 'wealth_perspective_celebrity_cache';
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry {
  celebrity: Celebrity;
  timestamp: number;
}

interface CelebrityCache {
  [name: string]: CacheEntry;
}

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

// Session-based celebrity cache to ensure consistency
const getCelebrityCache = (): CelebrityCache => {
  try {
    const stored = sessionStorage.getItem(CELEBRITY_CACHE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const setCelebrityCache = (cache: CelebrityCache): void => {
  try {
    sessionStorage.setItem(CELEBRITY_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // sessionStorage not available or quota exceeded
  }
};

const getCachedCelebrity = (name: string): Celebrity | null => {
  const cache = getCelebrityCache();
  const normalizedName = name.trim().toLowerCase();
  const entry = cache[normalizedName];
  
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION_MS) {
    console.log(`Using cached data for: ${name}`);
    return entry.celebrity;
  }
  
  return null;
};

const cacheCelebrity = (name: string, celebrity: Celebrity): void => {
  const cache = getCelebrityCache();
  const normalizedName = name.trim().toLowerCase();
  
  // Also cache by the celebrity's actual name for cross-reference
  const actualName = celebrity.name.trim().toLowerCase();
  
  cache[normalizedName] = { celebrity, timestamp: Date.now() };
  if (actualName !== normalizedName) {
    cache[actualName] = { celebrity, timestamp: Date.now() };
  }
  
  setCelebrityCache(cache);
};

export const useCelebrityData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCelebrity = useCallback(async (name: string): Promise<Celebrity | null> => {
    // Check cache first for consistency
    const cached = getCachedCelebrity(name);
    if (cached) {
      return cached;
    }
    
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

      const celebrity = data.celebrity as Celebrity;
      
      // Cache the result for consistency across the session
      if (celebrity) {
        cacheCelebrity(name, celebrity);
      }

      return celebrity;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch celebrity data';
      setError(message);
      // Don't show toast for limit reached - PaywallGate handles it
      if (!message.toLowerCase().includes('free searches') && !message.toLowerCase().includes('sign up')) {
        toast.error(message);
      }
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

      const celebrities = data.celebrities as Celebrity[];
      
      // Cache each celebrity for consistency
      celebrities.forEach(celeb => {
        cacheCelebrity(celeb.name, celeb);
      });

      return celebrities;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch celebrities';
      setError(message);
      // Don't show toast for limit reached - PaywallGate handles it
      if (!message.toLowerCase().includes('free searches') && !message.toLowerCase().includes('sign up')) {
        toast.error(message);
      }
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
