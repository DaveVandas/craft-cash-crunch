import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Lock, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePricing } from '@/hooks/usePricing';

const ANON_SEARCH_KEY = 'wealth_perspective_anon_searches';

const getAnonSearchCount = (): number => {
  try {
    return parseInt(localStorage.getItem(ANON_SEARCH_KEY) || '0', 10);
  } catch {
    return 0;
  }
};

interface PaywallGateProps {
  children: React.ReactNode;
}

const PaywallGate = ({ children }: PaywallGateProps) => {
  const { user, accessInfo, initiatePayment, loading, paymentLoading } = useAuth();
  const { regularPrice, canUseStripe } = usePricing();
  
  // Check if user should be blocked
  const anonSearchCount = getAnonSearchCount();
  const isAnonBlocked = !user && anonSearchCount >= 3;
  const isUserBlocked = user && accessInfo && !accessInfo.hasAccess;
  const shouldBlock = isAnonBlocked || isUserBlocked;

  if (loading) {
    return <>{children}</>;
  }

  if (!shouldBlock) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 pb-24">
      <Card className="max-w-md w-full border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 shadow-lg">
        <CardContent className="p-6 md:p-8 text-center space-y-5">
          {/* Icon */}
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-primary/30 to-amber-500/30 flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          
          {/* Headline */}
          <div>
            <h2 className="font-serif text-xl md:text-2xl font-bold mb-2">
              Time to Join the <span className="gradient-gold-text">Winners Circle</span>
            </h2>
            
            <p className="text-sm md:text-base text-muted-foreground">
              You've explored the wealth gap — now unlock unlimited access for just <span className="text-primary font-bold">{regularPrice}</span> (one time, forever).
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-2.5 text-left p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Unlimited celebrity searches</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Reality Check calculator</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Wealth Showdown comparisons</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Wealth Quiz & all premium features</span>
            </div>
          </div>

          {/* Persuasive Text */}
          <p className="text-sm text-muted-foreground italic">
            "You can afford {regularPrice} once to hang in this winners circle, right?!" 💪
          </p>

          {/* CTA Buttons */}
          {user ? (
            canUseStripe ? (
              <Button 
                onClick={initiatePayment}
                disabled={paymentLoading}
                size="lg"
                className="w-full text-base md:text-lg bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 shadow-gold"
              >
                {paymentLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Crown className="mr-2 h-5 w-5" />
                )}
                {paymentLoading ? 'Processing...' : `Get Lifetime Access - ${regularPrice}`}
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  // TODO: Implement IAP when ready
                  console.log('Native IAP not yet implemented');
                }}
                size="lg"
                className="w-full text-base md:text-lg bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 shadow-gold"
              >
                <Crown className="mr-2 h-5 w-5" />
                Get Lifetime Access - {regularPrice}
              </Button>
            )
          ) : (
            <div className="space-y-3">
              <Button 
                asChild
                size="lg"
                className="w-full text-sm md:text-base bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 shadow-gold px-4"
              >
                <Link to="/auth">
                  <Crown className="mr-2 h-5 w-5 shrink-0" />
                  <span className="truncate">Sign Up & Get Lifetime Access</span>
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account? <Link to="/auth" className="text-primary hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaywallGate;
