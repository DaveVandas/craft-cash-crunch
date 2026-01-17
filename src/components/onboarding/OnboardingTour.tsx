import { useEffect, useState } from 'react';
import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuth } from '@/contexts/AuthContext';

const TOUR_COMPLETED_KEY = 'onboarding_tour_completed';

const OnboardingTour = () => {
  const { user } = useAuth();
  const [shouldRunTour, setShouldRunTour] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check if tour was already completed
    const tourCompleted = localStorage.getItem(`${TOUR_COMPLETED_KEY}_${user.id}`);
    if (tourCompleted) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setShouldRunTour(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

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
        // Mark tour as completed
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
