import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, Sparkles, ArrowLeft, CheckCircle, Gift, Users } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { AFFILIATE_CODE_KEY, AFFILIATE_VARIANT_KEY } from '@/hooks/useAffiliateAttribution';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showReferralInfo = searchParams.get('showReferral') === 'true';
  const refCodeFromUrl = searchParams.get('ref');
  const { user, signIn, signUp, resetPassword, loading: authLoading } = useAuth();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [affiliateName, setAffiliateName] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    // If we've stored a remembered email, prefill it
    const storedEmail = localStorage.getItem('wp_remember_email');
    const storedRemember = localStorage.getItem('wp_remember_me');
    if (storedEmail && storedRemember === 'true') {
      setEmail(storedEmail);
      setRememberMe(true);
    }

    // Check for affiliate referral code (from URL or localStorage)
    const storedAffiliateCode = localStorage.getItem(AFFILIATE_CODE_KEY);
    const codeToUse = refCodeFromUrl || storedAffiliateCode;
    
    if (codeToUse) {
      setAffiliateCode(codeToUse);
      // Fetch affiliate name for display
      supabase
        .from('affiliates')
        .select('display_name')
        .eq('affiliate_code', codeToUse.toUpperCase())
        .eq('status', 'approved')
        .single()
        .then(({ data }) => {
          if (data) {
            setAffiliateName(data.display_name);
          }
        });
    }

    if (user) {
      navigate('/');
    }
  }, [user, navigate, refCodeFromUrl]);

  const validateInputs = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message);
      }
    } else {
      if (rememberMe) {
        localStorage.setItem('wp_remember_email', email);
        localStorage.setItem('wp_remember_me', 'true');
      } else {
        localStorage.removeItem('wp_remember_email');
        localStorage.setItem('wp_remember_me', 'false');
      }
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return;
    }
    setErrors({});

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setResetEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const { error, data } = await signUp(email, password);
    
    if (error) {
      setLoading(false);
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message);
      }
    } else {
      // If we have an affiliate code, attribute this signup to them
      if (affiliateCode && data?.user) {
        try {
          // Get the source variant from localStorage
          const sourceVariant = localStorage.getItem(AFFILIATE_VARIANT_KEY) || 'direct';
          
          // Update the user's user_access with the referral code and source variant
          await supabase
            .from('user_access')
            .update({ 
              referred_by_code: affiliateCode.toUpperCase(),
              source_variant: sourceVariant
            })
            .eq('user_id', data.user.id);

          // Find the affiliate and create a referral record
          const { data: affiliateData } = await supabase
            .from('affiliates')
            .select('id, commission_rate')
            .eq('affiliate_code', affiliateCode.toUpperCase())
            .eq('status', 'approved')
            .single();

          if (affiliateData) {
            // Create affiliate_referral record
            await supabase.from('affiliate_referrals').insert({
              affiliate_id: affiliateData.id,
              referred_user_id: data.user.id,
              referred_email: email,
              commission_amount: affiliateData.commission_rate,
              status: 'pending',
            });

            // Update affiliate's total_referrals count
            await supabase.rpc('increment_affiliate_referrals', { 
              affiliate_uuid: affiliateData.id 
            }).then(() => {
              // Clear the stored affiliate code and variant
              localStorage.removeItem(AFFILIATE_CODE_KEY);
              localStorage.removeItem(AFFILIATE_VARIANT_KEY);
            });
          }
        } catch (err) {
          console.error('Error attributing referral:', err);
        }
      }

      setLoading(false);
      toast.success('Account created successfully!');
      navigate('/');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="font-serif text-2xl">
              {showForgotPassword ? 'Reset Password' : 'Welcome to Wealth Perspective'}
            </CardTitle>
            <CardDescription>
              {showForgotPassword 
                ? 'Enter your email to receive a password reset link' 
                : 'Sign in or create an account to unlock celebrity earnings insights'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {showForgotPassword ? (
              resetEmailSent ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-green-500/10">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">Check your email</h3>
                  <p className="text-muted-foreground text-sm">
                    We've sent a password reset link to <strong>{email}</strong>. 
                    Click the link in the email to reset your password.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                      setEmail('');
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Send Reset Link
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setErrors({});
                    }}
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 inline mr-1" />
                    Back to Sign In
                  </button>
                </form>
              )
            ) : (
              <>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            autoComplete="email"
                          />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            autoComplete="current-password"
                          />
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded border-border bg-background"
                          />
                          <span className="text-muted-foreground">Remember me</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-primary hover:underline"
                        >
                          Forgot your password?
                        </button>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Create Account
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        By signing up, you agree to our terms of service
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>

                {showReferralInfo && (
                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-primary">Earn Free Lifetime Access!</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sign up now and invite 3 friends to get <span className="text-primary font-medium">unlimited access for free</span>. 
                      Share your unique referral link after creating your account.
                    </p>
                  </div>
                )}

                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm text-center">
                    <span className="font-semibold text-primary">3 free searches</span>
                    <span className="text-muted-foreground"> included with every account</span>
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    Unlock unlimited access for just $6.99 — one time, forever
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
