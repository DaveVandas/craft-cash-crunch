import { useCallback, useState } from 'react';
import { Celebrity } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getFallbackCelebrity } from '@/lib/fallbackCelebrities';
import { getCurrentRegularPrice, getPaymentMethod } from '@/lib/pricing';

// Open the upgrade flow appropriately for the current platform.
// Native (iOS/Android) builds must NOT link out to Stripe — Apple/Google reject this.
const startUpgradeFlow = async () => {
  if (getPaymentMethod() !== 'stripe') {
    toast.info('In-app purchase coming soon', {
      description: 'Lifetime access via the App Store will unlock here shortly.',
    });
    return;
  }
  const { data: paymentData } = await supabase.functions.invoke('create-payment');
  if (paymentData?.url) window.open(paymentData.url, '_blank');
};

const ANON_SEARCH_KEY = 'wealth_perspective_anon_searches';

type GetCelebrityDataResponse = {
  celebrity: Celebrity | null;
  celebrities?: Celebrity[] | null;
  error?: string | null;
  errorCode?: string | null;
};

// Get anonymous search count from localStorage
const getAnonSearchCount = (): number => {
  try {
    const stored = localStorage.getItem(ANON_SEARCH_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

// Increment anonymous search count in localStorage
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

export const useCelebritySearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshAccess } = useAuth();

  const invokeGetCelebrityData = useCallback(async (body: { name?: string; category?: string }) => {
    const anonCount = getAnonSearchCount();

    const { data, error: fnError } = await supabase.functions.invoke('get-celebrity-data', {
      body,
      headers: {
        // Used by the backend to enforce anonymous free-search limits
        'X-Anonymous-Search-Count': anonCount.toString(),
      },
    });

    if (fnError) {
      throw fnError;
    }

    return data as GetCelebrityDataResponse;
  }, []);

  const searchCelebrity = useCallback(async (name: string): Promise<Celebrity | null> => {
    setLoading(true);
    setError(null);

    try {
      const data = await invokeGetCelebrityData({ name });

      // Handle soft errors returned as 200 with error field
      if (data?.error) {
        const errorCode = data.errorCode || 'ERROR';

        if (errorCode === 'AUTH_REQUIRED' || errorCode === 'ANON_LIMIT_REACHED') {
          const price = getCurrentRegularPrice();
          toast("You've sampled the goods — now join the winners circle 🏆", {
            description: `${price} once. Unlimited access. No subscriptions. Real mogul energy.`,
            action: {
              label: 'Unlock Lifetime Access',
              onClick: async () => {
                const { data: paymentData } = await supabase.functions.invoke('create-payment');
                if (paymentData?.url) window.open(paymentData.url, '_blank');
              },
            },
            duration: 8000,
          });
          setError(data.error);
          return null;
        } else if (errorCode === 'LIMIT_REACHED') {
          const price = getCurrentRegularPrice();
          toast.error(data.error, {
            description: `Unlock unlimited access for just ${price}`,
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
            return fallback;
          }
          toast.error("We couldn't fetch data right now. Please try again in a moment.");
          setError(data.error);
          return null;
        }
      }

      // Success! Increment anonymous count if not logged in
      if (!user) {
        incrementAnonSearchCount();
      }

      // If we got celebrity data and user is logged in, increment search with tracking info
      if (data?.celebrity && user) {
        const celebrity = data.celebrity as Celebrity;
        const celebritySlug = celebrity.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

        await supabase.functions.invoke('increment-search', {
          body: {
            celebrityName: celebrity.name,
            celebritySlug,
            category: celebrity.profession,
          },
        });

        await refreshAccess();
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
  }, [invokeGetCelebrityData, refreshAccess, user]);

  const searchCelebritiesByCategory = useCallback(async (category: string): Promise<Celebrity[]> => {
    setLoading(true);
    setError(null);

    try {
      const data = await invokeGetCelebrityData({ category });

      if (data?.error) {
        const errorCode = data.errorCode || 'ERROR';

        if (errorCode === 'AUTH_REQUIRED' || errorCode === 'ANON_LIMIT_REACHED') {
          const price = getCurrentRegularPrice();
          toast("You've sampled the goods — now join the winners circle 🏆", {
            description: `${price} once. Unlimited access. No subscriptions. Real mogul energy.`,
            action: {
              label: 'Unlock Lifetime Access',
              onClick: async () => {
                const { data: paymentData } = await supabase.functions.invoke('create-payment');
                if (paymentData?.url) window.open(paymentData.url, '_blank');
              },
            },
            duration: 8000,
          });
        } else {
          toast.error(data.error);
        }
        setError(data.error);
        return [];
      }

      if (!user) {
        incrementAnonSearchCount();
      } else {
        await supabase.functions.invoke('increment-search');
        await refreshAccess();
      }

      return (data.celebrities || []) as Celebrity[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch celebrities';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [invokeGetCelebrityData, refreshAccess, user]);

  return {
    loading,
    error,
    searchCelebrity,
    searchCelebritiesByCategory,
  };
};
