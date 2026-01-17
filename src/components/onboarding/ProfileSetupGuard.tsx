import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileSetupModal from '@/components/onboarding/ProfileSetupModal';
import WelcomeTour from '@/components/onboarding/WelcomeTour';

interface ProfileSetupGuardProps {
  children: React.ReactNode;
}

const TOUR_COMPLETED_KEY = 'wealth_perspective_tour_completed';

const ProfileSetupGuard = ({ children }: ProfileSetupGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [showSetup, setShowSetup] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);

  useEffect(() => {
    // Only show setup modal if:
    // 1. User is logged in
    // 2. Profile is loaded
    // 3. Profile has no display_name set
    // 4. User hasn't completed setup in this session
    if (!authLoading && !profileLoading && user && profile && !profile.display_name && !hasCompletedSetup) {
      setShowSetup(true);
    }
  }, [user, profile, authLoading, profileLoading, hasCompletedSetup]);

  const handleSetupComplete = () => {
    setShowSetup(false);
    setHasCompletedSetup(true);
    
    // Check if user has seen the tour before
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!tourCompleted) {
      // Small delay to let the setup modal close smoothly
      setTimeout(() => {
        setShowTour(true);
      }, 300);
    }
  };

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
  };

  return (
    <>
      {children}
      <ProfileSetupModal open={showSetup} onComplete={handleSetupComplete} />
      <WelcomeTour open={showTour} onComplete={handleTourComplete} />
    </>
  );
};

export default ProfileSetupGuard;
