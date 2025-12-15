import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { TrendingUp, Users } from 'lucide-react';

const actionPhrases = [
  'just searched for',
  'is comparing',
  'discovered',
  'just explored',
];

const SocialProofNotifications = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Start after a 10-second delay
    const startTimer = setTimeout(() => {
      setIsActive(true);
    }, 10000);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const fetchAndShowNotification = async () => {
      try {
        const { data, error } = await supabase
          .from('search_trends')
          .select('celebrity_name, category')
          .order('last_searched_at', { ascending: false })
          .limit(10);

        if (error || !data || data.length === 0) return;

        // Pick a random recent search
        const randomSearch = data[Math.floor(Math.random() * data.length)];
        const randomAction = actionPhrases[Math.floor(Math.random() * actionPhrases.length)];
        
        // Generate anonymous user identifier
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

    // Show first notification after becoming active
    fetchAndShowNotification();

    // Then show notifications every 45-90 seconds randomly
    const showRandomNotification = () => {
      const randomDelay = 45000 + Math.random() * 45000; // 45-90 seconds
      return setTimeout(() => {
        fetchAndShowNotification();
        showRandomNotification();
      }, randomDelay);
    };

    const timer = showRandomNotification();

    return () => clearTimeout(timer);
  }, [isActive]);

  return null; // This component doesn't render anything visible
};

export default SocialProofNotifications;
