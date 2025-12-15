import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CountdownOffer from '@/components/engagement/CountdownOffer';

const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { user, accessInfo } = useAuth();

  useEffect(() => {
    // Don't show if:
    // 1. User is logged in and has lifetime access
    // 2. User is logged in and accessInfo is still loading (wait for it)
    // 3. Already shown this session
    const isPremium = accessInfo?.hasLifetimeAccess === true;
    const isLoadingAccess = user && accessInfo === null;
    
    if (isPremium || isLoadingAccess || hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [user, accessInfo, hasShown]);

  return <CountdownOffer open={open} onOpenChange={setOpen} />;
};

export default ExitIntentPopup;
