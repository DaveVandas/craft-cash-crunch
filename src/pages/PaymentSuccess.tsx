import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshAccess, user, loading: authLoading } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const hasVerifiedRef = useRef(false); // Prevent multiple verifications

  useEffect(() => {
    // Wait for auth to finish loading before verifying
    if (authLoading) return;
    
    const verifyPayment = async () => {
      // Prevent running multiple times
      if (hasVerifiedRef.current) return;
      hasVerifiedRef.current = true;
      
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setVerifying(false);
        return;
      }

      // If no user after auth loaded, show appropriate state
      if (!user) {
        setVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId },
        });

        if (error) throw error;

        if (data.paid) {
          setVerified(true);
          toast.success('Payment verified! You now have lifetime access.');
          await refreshAccess();
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        toast.error('Failed to verify payment. Please contact support.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, authLoading, user]); // Removed refreshAccess from deps to prevent re-runs

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 pb-20 md:pb-0">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="text-center">
            {verifying ? (
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : verified ? (
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-green-500/10">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
              </div>
            )}

            <CardTitle className="font-serif text-2xl">
              {verifying ? 'Verifying Payment...' : verified ? 'Welcome to Unlimited Access!' : 'Payment Processing'}
            </CardTitle>
            <CardDescription>
              {verifying
                ? 'Please wait while we confirm your payment'
                : verified
                ? "You now have lifetime access to all celebrity earnings data"
                : 'Your payment is being processed'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {verified && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <h3 className="font-semibold text-center mb-2">Your Benefits</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Unlimited celebrity searches
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      All comparison features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Shareable social cards
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Lifetime access — no recurring fees
                    </li>
                  </ul>
                </div>

                <Button onClick={() => navigate('/')} className="w-full group">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {!verifying && !verified && !user && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Please sign in to verify your payment.
                </p>
                <Button onClick={() => navigate('/auth')} className="w-full">
                  Sign In
                </Button>
              </div>
            )}

            {!verifying && !verified && user && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  If your payment was successful, it may take a moment to process.
                </p>
                <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                  Return to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default PaymentSuccess;
