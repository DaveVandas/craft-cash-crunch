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
import { PageLoader } from '@/components/ui/page-loader';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { AFFILIATE_CODE_KEY, AFFILIATE_VARIANT_KEY } from '@/hooks/useAffiliateAttribution';
import { usePricing } from '@/hooks/usePricing';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const SocialAuthButtons = () => {
  const [busy, setBusy] = useState<'apple' | 'google' | null>(null);
  const handleOAuth = async (provider: 'apple' | 'google') => {
    setBusy(provider);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(`Could not sign in with ${provider === 'apple' ? 'Apple' : 'Google'}`);
        setBusy(null);
        return;
      }
      // If redirected, browser will navigate away. Otherwise, session is set.
      if (!result.redirected) {
        window.location.href = '/';
      }
    } catch {
      toast.error('Sign-in failed. Please try again.');
      setBusy(null);
    }
  };
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-black text-white hover:bg-black/90 hover:text-white border-black"
        onClick={() => handleOAuth('apple')}
        disabled={busy !== null}
      >
        {busy === 'apple' ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2 fill-current" aria-hidden="true">
            <path d="M16.365 1.43c0 1.14-.46 2.234-1.21 3.027-.81.85-2.13 1.51-3.21 1.43-.13-1.1.45-2.27 1.18-3.04.83-.87 2.24-1.5 3.24-1.42zM20.5 17.27c-.56 1.31-.84 1.9-1.57 3.05-1.02 1.61-2.46 3.61-4.24 3.63-1.59.02-2-1.04-4.16-1.03-2.16.01-2.61 1.05-4.2 1.03-1.78-.02-3.14-1.83-4.16-3.44-2.86-4.5-3.16-9.78-1.4-12.59 1.25-1.99 3.22-3.16 5.07-3.16 1.88 0 3.07 1.04 4.62 1.04 1.51 0 2.43-1.04 4.6-1.04 1.65 0 3.39.9 4.64 2.45-4.08 2.24-3.42 8.07.8 10.06z" />
          </svg>
        )}
        Continue with Apple
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleOAuth('google')}
        disabled={busy !== null}
      >
        {busy === 'google' ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" aria-hidden="true">
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.4 3.58v2.97h3.86c2.26-2.09 3.59-5.16 3.59-8.79z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.86-2.97c-1.07.72-2.43 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.27 14.32c-.24-.72-.38-1.49-.38-2.32s.14-1.6.38-2.32V6.59H1.29C.47 8.23 0 10.06 0 12s.47 3.77 1.29 5.41l3.98-3.09z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
          </svg>
        )}
        Continue with Google
      </Button>
    </div>
  );
};

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showReferralInfo = searchParams.get('showReferral') === 'true';
  const refCodeFromUrl = searchParams.get('ref');
  const { user, signIn, signUp, resetPassword, loading: authLoading } = useAuth();
  const { regularPrice } = usePricing();
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
        .from('affiliates_public')
        .select('display_name')
        .eq('affiliate_code', codeToUse.toUpperCase())
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
          await supabase.rpc('set_referral_code', {
            p_code: affiliateCode.toUpperCase(),
            p_source_variant: sourceVariant
          });

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
    return <PageLoader message="Checking authentication..." />;
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
                <SocialAuthButtons />
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>
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
                    Unlock unlimited access for just {regularPrice} — one time, forever
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
