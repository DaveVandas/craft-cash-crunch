import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const { user, accessInfo, initiatePayment, loading } = useAuth();
  
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
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-primary/30 bg-gradient-to-br from-card via-card to-primary/10">
        <CardContent className="p-8 text-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/30 to-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="font-serif text-2xl font-bold mb-3">
            Time to Join the <span className="gradient-gold-text">Winners Circle</span>
          </h2>
          
          <p className="text-muted-foreground mb-6">
            You've explored the wealth gap — now unlock unlimited access to all features for just <span className="text-primary font-bold">$6.99</span> (one time, forever).
          </p>

          <div className="space-y-3 text-left mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Unlimited celebrity searches</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Reality Check calculator</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Wealth Showdown comparisons</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Wealth Quiz & all premium features</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 italic">
            "You can afford $7 once to hang in this winners circle, right?!" 💪
          </p>

          {user ? (
            <Button 
              onClick={initiatePayment}
              className="w-full h-12 text-lg bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
            >
              <Crown className="mr-2 h-5 w-5" />
              Get Lifetime Access - $6.99
            </Button>
          ) : (
            <div className="space-y-3">
              <Link to="/auth" className="block">
                <Button 
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Sign Up & Get Lifetime Access
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Already have an account? <Link to="/auth" className="text-primary hover:underline">Sign in</Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaywallGate;
