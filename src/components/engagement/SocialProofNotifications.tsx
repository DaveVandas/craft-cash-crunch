import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const actionPhrases = ['just searched for', 'is comparing', 'discovered', 'just explored'];

const SocialProofNotifications = () => {
  const [isActive, setIsActive] = useState(false);
  const { user } = useAuth();
  const timerRef = useRef<number | null>(null);

  // Start/stop based on auth state
  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only show to non-logged-in users
    if (user) {
      setIsActive(false);
      return;
    }

    // Start after a 10-second delay
    timerRef.current = window.setTimeout(() => {
      setIsActive(true);
    }, 10000);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [user]);

  // Show notifications on a cadence (and stop immediately if user logs in)
  useEffect(() => {
    if (!isActive || user) return;

    let cancelled = false;

    const fetchAndShowNotification = async () => {
      // Extra safety: never show if user is present
      if (cancelled || user) return;

      try {
        const { data, error } = await supabase
          .from('search_trends')
          .select('celebrity_name, category')
          .order('last_searched_at', { ascending: false })
          .limit(10);

        if (cancelled || user) return;
        if (error || !data || data.length === 0) return;

        const randomSearch = data[Math.floor(Math.random() * data.length)];
        const randomAction = actionPhrases[Math.floor(Math.random() * actionPhrases.length)];

        const userNames = ['Someone', 'A user', 'A visitor', 'Someone curious'];
        const randomUser = userNames[Math.floor(Math.random() * userNames.length)];

        toast({
          title: (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{randomUser} {randomAction}</span>
            </div>
          ) as unknown as string,
          description: (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              <span className="font-semibold text-primary">{randomSearch.celebrity_name}</span>
              {randomSearch.category && (
                <span className="text-xs text-muted-foreground">({randomSearch.category})</span>
              )}
            </div>
          ) as unknown as string,
          duration: 4000,
        });
      } catch (err) {
        console.error('Social proof error:', err);
      }
    };

    const scheduleNext = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const randomDelay = 45000 + Math.random() * 45000; // 45-90 seconds
      timerRef.current = window.setTimeout(async () => {
        await fetchAndShowNotification();
        if (!cancelled && !user) scheduleNext();
      }, randomDelay);
    };

    // Show first notification after becoming active
    fetchAndShowNotification();
    scheduleNext();

    return () => {
      cancelled = true;
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, user]);

  return null;
};

export default SocialProofNotifications;
