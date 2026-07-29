import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

const SETUP_DISMISSED_PREFIX = 'profileSetupDone:';

// Routes where the profile setup prompt must never interrupt the user
const EXCLUDED_PATHS = ['/support', '/terms', '/privacy', '/auth', '/auth/callback', '/reset-password'];

const ProfileSetupGuard = ({ children }: ProfileSetupGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const location = useLocation();
  const [showSetup, setShowSetup] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const hasDisplayName = Boolean(profile?.display_name?.trim());
  const isExcludedPath = EXCLUDED_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(`${p}/`)
  );

  const previouslyDismissed = (() => {
    if (!user) return false;
    try {
      return localStorage.getItem(`${SETUP_DISMISSED_PREFIX}${user.id}`) === '1';
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    if (authLoading || profileLoading || !user || isExcludedPath) {
      setShowSetup(false);
      return;
    }

    setShowSetup(!hasDisplayName && !hasCompletedSetup && !previouslyDismissed);
  }, [user, authLoading, profileLoading, hasDisplayName, hasCompletedSetup, previouslyDismissed, isExcludedPath]);

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
    if (user) {
      try {
        localStorage.setItem(`${SETUP_DISMISSED_PREFIX}${user.id}`, '1');
      } catch {
        // ignore storage failures
      }
    }
  };


  return (
    <ProfileSetupContext.Provider value={contextValue}>
      {children}
      <ProfileSetupModal open={showSetup} onComplete={handleSetupComplete} />
    </ProfileSetupContext.Provider>
  );
};

export default ProfileSetupGuard;
