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

const SETUP_DISMISSED_PREFIX = 'profileSetupDone:';

// Routes where the profile setup prompt must never interrupt the user
const EXCLUDED_PATHS = ['/support', '/terms', '/privacy', '/auth', '/auth/callback', '/reset-password'];

// This guard renders outside <Router>, so track the path via the History API
const usePathname = () => {
  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  );

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', update);
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;
    window.history.pushState = function (...args) {
      originalPush.apply(this, args as Parameters<typeof originalPush>);
      update();
    };
    window.history.replaceState = function (...args) {
      originalReplace.apply(this, args as Parameters<typeof originalReplace>);
      update();
    };
    return () => {
      window.removeEventListener('popstate', update);
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, []);

  return pathname;
};

const ProfileSetupGuard = ({ children }: ProfileSetupGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, fetchFailed } = useUserProfile();
  const pathname = usePathname();
  const [showSetup, setShowSetup] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const hasDisplayName = Boolean(profile?.display_name?.trim());
  const isExcludedPath = EXCLUDED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const storageKey = user ? `${SETUP_DISMISSED_PREFIX}${user.id}` : null;

  const markSetupSeen = () => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, '1');
    } catch {
      // ignore storage failures
    }
  };

  useEffect(() => {
    if (authLoading || profileLoading || !user || isExcludedPath) {
      setShowSetup(false);
      return;
    }

    // Never interrupt when the profile couldn't be loaded — avoids false prompts
    if (fetchFailed) {
      setShowSetup(false);
      return;
    }

    // Already has a name: remember it so the prompt never returns
    if (hasDisplayName) {
      markSetupSeen();
      setShowSetup(false);
      return;
    }

    let alreadySeen = false;
    try {
      alreadySeen = storageKey ? localStorage.getItem(storageKey) === '1' : false;
    } catch {
      alreadySeen = false;
    }

    if (alreadySeen || hasCompletedSetup) {
      setShowSetup(false);
      return;
    }

    // First-time setup only — mark it seen the moment we show it
    markSetupSeen();
    setShowSetup(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, profileLoading, fetchFailed, hasDisplayName, hasCompletedSetup, isExcludedPath, storageKey]);

  const contextValue = useMemo(
    () => ({
      canStartOnboardingTour: Boolean(user && !authLoading && !profileLoading && !showSetup),
      isProfileSetupOpen: showSetup,
    }),
    [user, authLoading, profileLoading, showSetup]
  );

  const handleSetupComplete = () => {
    setShowSetup(false);
    setHasCompletedSetup(true);
    markSetupSeen();
  };

  return (
    <ProfileSetupContext.Provider value={contextValue}>
      {children}
      <ProfileSetupModal
        open={showSetup}
        onComplete={handleSetupComplete}
        onDismiss={handleSetupComplete}
      />
    </ProfileSetupContext.Provider>
  );
};

export default ProfileSetupGuard;
