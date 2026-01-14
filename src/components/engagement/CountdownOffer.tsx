import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Zap, Sparkles } from 'lucide-react';

interface CountdownOfferProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CountdownOffer = ({ open, onOpenChange }: CountdownOfferProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const { user, initiatePayment } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if offer was already seen and get expiry time
    const offerExpiry = localStorage.getItem('countdown_offer_expiry');
    let expiryDate: Date;

    if (offerExpiry) {
      expiryDate = new Date(offerExpiry);
    } else {
      // Set 24 hour countdown from now
      expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      localStorage.setItem('countdown_offer_expiry', expiryDate.toISOString());
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClaim = async () => {
    onOpenChange(false);
    if (!user) {
      navigate('/auth');
    } else {
      try {
        await initiatePayment();
      } catch (err) {
        console.error('Payment error:', err);
      }
    }
  };

  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-primary/50 bg-gradient-to-br from-card via-card to-primary/10 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <DialogHeader className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          
          <DialogTitle className="text-center text-2xl font-serif">
            Limited Time Offer!
          </DialogTitle>
          
          <DialogDescription className="text-center">
            <span className="block mt-2 text-lg">
              Get lifetime access at a <span className="text-primary font-bold">special price</span>
            </span>
            
            {/* Countdown Timer */}
            {!isExpired && (
              <div className="flex justify-center gap-3 mt-4">
                <div className="bg-secondary/50 rounded-lg p-2 min-w-[60px]">
                  <div className="text-2xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="text-2xl font-bold text-primary self-center">:</div>
                <div className="bg-secondary/50 rounded-lg p-2 min-w-[60px]">
                  <div className="text-2xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-muted-foreground">Mins</div>
                </div>
                <div className="text-2xl font-bold text-primary self-center">:</div>
                <div className="bg-secondary/50 rounded-lg p-2 min-w-[60px]">
                  <div className="text-2xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-muted-foreground">Secs</div>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-1">
              <span className="block text-sm text-muted-foreground line-through">$6.99</span>
              <span className="block text-3xl font-bold gradient-gold-text">$5.99</span>
              <span className="block text-sm text-muted-foreground">Save 14% - One-time payment</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4 relative z-10">
          <Button 
            onClick={handleClaim} 
            className="bg-primary hover:bg-primary/90"
            disabled={isExpired}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isExpired ? 'Offer Expired' : 'Claim $5.99 Deal'}
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <Clock className="mr-2 h-4 w-4" />
            I'll pay full price later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountdownOffer;
