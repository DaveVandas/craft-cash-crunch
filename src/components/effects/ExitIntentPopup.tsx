import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, DollarSign } from 'lucide-react';

const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { user, accessInfo } = useAuth();
  const hasLifetimeAccess = accessInfo?.hasLifetimeAccess ?? false;
  const navigate = useNavigate();

  useEffect(() => {
    // Don't show if already paid or has shown this session
    if (hasLifetimeAccess || hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasLifetimeAccess, hasShown]);

  const handleUnlock = () => {
    setOpen(false);
    if (!user) {
      navigate('/auth');
    } else {
      // Trigger payment flow
      navigate('/calculator');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-primary/30 bg-gradient-to-br from-card via-card to-primary/5">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-gold">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-serif">
            Wait! Don't Miss Out
          </DialogTitle>
          <DialogDescription className="text-center">
            <span className="block mt-2 text-lg">
              Unlock <span className="text-primary font-semibold">unlimited</span> celebrity earnings comparisons
            </span>
            <span className="block mt-4 text-2xl font-bold gradient-gold-text">
              Just $4.99 — Forever
            </span>
            <span className="block mt-2 text-sm text-muted-foreground">
              One-time payment. No subscriptions. No hidden fees.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleUnlock} className="bg-primary hover:bg-primary/90">
            <Sparkles className="mr-2 h-4 w-4" />
            Unlock Lifetime Access
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
