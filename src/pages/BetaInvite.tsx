import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const BetaInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signUp, signIn, refreshAccess } = useAuth();
  
  const code = searchParams.get('code') || '';
  
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [invalidReason, setInvalidReason] = useState('');
  const [recipientName, setRecipientName] = useState('');
  
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate the invite code on mount
  useEffect(() => {
    const validateCode = async () => {
      if (!code) {
        setIsValid(false);
        setInvalidReason('No invite code provided');
        setValidating(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('beta-invite', {
          body: { action: 'validate', code },
        });

        if (error) throw error;
        
        if (data?.valid) {
          setIsValid(true);
          setRecipientName(data.recipientName || '');
        } else {
          setIsValid(false);
          setInvalidReason(data?.reason || 'Invalid invite');
        }
      } catch (err) {
        console.error('Error validating invite:', err);
        setIsValid(false);
        setInvalidReason('Failed to validate invite');
      } finally {
        setValidating(false);
      }
    };

    validateCode();
  }, [code]);

  // If user is already logged in, try to claim the invite
  useEffect(() => {
    const claimIfLoggedIn = async () => {
      if (user && isValid && code) {
        await claimInvite();
      }
    };
    claimIfLoggedIn();
  }, [user, isValid, code]);

  const claimInvite = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('beta-invite', {
        body: { action: 'claim', code },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Welcome to the beta!', {
        description: 'You have 7 days of unlimited access.',
      });
      
      await refreshAccess();
      navigate('/');
    } catch (err) {
      console.error('Error claiming invite:', err);
      toast.error('Failed to activate invite');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Email already registered. Please sign in instead.');
            setMode('signin');
          } else {
            throw error;
          }
          return;
        }
        
        toast.success('Account created! Activating your beta access...');
        
        // Sign in after signup
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
      
      // The useEffect will handle claiming once user is set
    } catch (err: any) {
      console.error('Auth error:', err);
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Validating your invite...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-destructive/50">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Invalid Invite</CardTitle>
            <CardDescription>{invalidReason}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline">
              <Link to="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-primary/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {recipientName ? `Welcome, ${recipientName}!` : 'You\'re Invited!'}
          </CardTitle>
          <CardDescription className="text-base">
            You've been selected as an exclusive beta tester for <span className="text-primary font-medium">Wealth Perspective</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Your Beta Access Includes:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
              <li>• 7 days of unlimited access</li>
              <li>• All premium features unlocked</li>
              <li>• Early access before launch</li>
              <li>• Direct influence on the final product</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Create a password' : 'Your password'}
                required
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                mode === 'signup' ? 'Create Account & Start Beta' : 'Sign In & Start Beta'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setMode('signin')} 
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Need an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setMode('signup')} 
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetaInvite;