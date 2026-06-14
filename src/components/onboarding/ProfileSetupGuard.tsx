import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileSetupModal from '@/components/onboarding/ProfileSetupModal';

interface ProfileSetupContextValue {
  canStartOnboardingTour: boolean;
  isProfileSetupOpen: boolean;
}

const ProfileSetupContext = createContext<ProfileSetupContextValue>({
  canStartOnboardingTour: true,
  isProfileSetupOpen: false,
});

export const useProfileSetupStatus = () => useContext(ProfileSetupContext);

interface ProfileSetupGuardProps {
  children: React.ReactNode;
}

const ProfileSetupGuard = ({ children }: ProfileSetupGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [showSetup, setShowSetup] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const hasDisplayName = Boolean(profile?.display_name?.trim());

  useEffect(() => {
    if (authLoading || profileLoading || !user) {
      setShowSetup(false);
      return;
    }

    setShowSetup(!hasDisplayName && !hasCompletedSetup);
  }, [user, authLoading, profileLoading, hasDisplayName, hasCompletedSetup]);

  const contextValue = useMemo(
    () => ({
      canStartOnboardingTour: Boolean(user && !authLoading && !profileLoading && !showSetup && (hasDisplayName || hasCompletedSetup)),
      isProfileSetupOpen: showSetup,
    }),
    [user, authLoading, profileLoading, showSetup, hasDisplayName, hasCompletedSetup]
  );

  const handleSetupComplete = () => {
    setShowSetup(false);
    setHasCompletedSetup(true);
  };

  return (
    <ProfileSetupContext.Provider value={contextValue}>
      {children}
      <ProfileSetupModal open={showSetup} onComplete={handleSetupComplete} />
    </ProfileSetupContext.Provider>
  );
};

export default ProfileSetupGuard;
