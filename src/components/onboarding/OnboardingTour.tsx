import { useEffect, useState } from 'react';
import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const TOUR_COMPLETED_KEY = 'onboarding_tour_completed';

const OnboardingTour = () => {
  const { user } = useAuth();
  const [shouldRunTour, setShouldRunTour] = useState(false);
  const [setupReady, setSetupReady] = useState(false);

  // Determine whether profile setup is complete. We re-check on mount and
  // whenever the ProfileSetupModal dispatches the 'profile-setup-complete' event,
  // because useUserProfile state is per-instance and won't update here.
  useEffect(() => {
    if (!user) {
      setSetupReady(false);
      return;
    }

    let cancelled = false;

    const checkProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data?.display_name) {
        setSetupReady(true);
      }
    };

    checkProfile();

    const onComplete = () => setSetupReady(true);
    window.addEventListener('profile-setup-complete', onComplete);

    return () => {
      cancelled = true;
      window.removeEventListener('profile-setup-complete', onComplete);
    };
  }, [user]);

  useEffect(() => {
    if (!user || !setupReady) return;

    const tourCompleted = localStorage.getItem(`${TOUR_COMPLETED_KEY}_${user.id}`);
    if (tourCompleted) return;

    // Small delay to let the profile modal fully close and DOM settle
    const timer = setTimeout(() => {
      setShouldRunTour(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [user, setupReady]);

  useEffect(() => {
    if (!shouldRunTour || !user) return;

    const steps: DriveStep[] = [
      {
        element: '[data-tour="search"]',
        popover: {
          title: '🔍 Search Any Celebrity',
          description: 'Type any name to see their earnings in real-time. Watch them make money as you browse!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '[data-tour="quick-actions"]',
        popover: {
          title: '⚡ Quick Actions',
          description: 'Jump straight to our most popular tools — compare earnings, take a quiz, or check your reality.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '[data-tour="celebrity-spotlight"]',
        popover: {
          title: '🌟 Daily Spotlight',
          description: 'Every day we feature a new celebrity with mind-blowing earning stats. Share them with friends!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '[data-tour="wealth-wisdom"]',
        popover: {
          title: '💡 Wealth Wisdom',
          description: 'Daily mindset lessons and quotes from billionaires. Think like the 1%!',
          side: 'top',
          align: 'center',
        },
      },
      {
        popover: {
          title: '🎉 You\'re All Set!',
          description: 'Explore the app, share with friends, and if you want to earn money — check out our affiliate program in the side hustle section!',
        },
      },
    ];

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      stagePadding: 8,
      stageRadius: 8,
      popoverClass: 'onboarding-popover',
      steps,
      onDestroyStarted: () => {
        if (user) {
          localStorage.setItem(`${TOUR_COMPLETED_KEY}_${user.id}`, 'true');
        }
        driverObj.destroy();
      },
    });

    driverObj.drive();

    return () => {
      driverObj.destroy();
    };
  }, [shouldRunTour, user]);

  return null;
};

export default OnboardingTour;
