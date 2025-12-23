import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileSetupModal from '@/components/onboarding/ProfileSetupModal';

interface ProfileSetupGuardProps {
  children: React.ReactNode;
}

const ProfileSetupGuard = ({ children }: ProfileSetupGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [showSetup, setShowSetup] = useState(false);
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
  };

  return (
    <>
      {children}
      <ProfileSetupModal open={showSetup} onComplete={handleSetupComplete} />
    </>
  );
};

export default ProfileSetupGuard;
