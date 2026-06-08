import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getPaymentMethod } from '@/lib/pricing';
import {
  initIAP,
  purchaseLifetimeAccess,
  restorePurchases as restoreIAPPurchases,
  syncEntitlementToBackend,
  isNativePlatform,
} from '@/lib/iap';

interface AccessInfo {
  hasAccess: boolean;
  hasLifetimeAccess: boolean;
  searchCount: number;
  searchesRemaining: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  paymentLoading: boolean;
  accessInfo: AccessInfo | null;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; data: { user: User | null } | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  refreshAccess: () => Promise<void>;
  initiatePayment: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null);

  const refreshAccess = async () => {
    try {
      // Always get the latest session from the auth client so we don't depend on stale state
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;

      if (!currentSession) {
        setAccessInfo(null);
        return;
      }

      const { data: accessData, error } = await supabase.functions.invoke('check-access');
      
      if (error) {
        return;
      }
      
      // Handle stale session - if server says we need auth, clear local state
      if (accessData?.requiresAuth) {
        setUser(null);
        setSession(null);
        setAccessInfo(null);
        // Clear local storage manually since signOut might fail with stale session
        await supabase.auth.signOut({ scope: 'local' });
        return;
      }
      
      if (accessData?.error) {
        return;
      }
      
      setAccessInfo(accessData as AccessInfo);
    } catch (_err) {
      // Error checking access - handled silently
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer access check to avoid deadlock
        if (session) {
          setTimeout(() => refreshAccess(), 0);
        } else {
          setAccessInfo(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session) {
        setTimeout(() => refreshAccess(), 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error, data: data ? { user: data.user } : null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    // Use local scope to avoid 403 errors when server session is already invalid
    await supabase.auth.signOut({ scope: 'local' });
    setUser(null);
    setSession(null);
    setAccessInfo(null);
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  const initiatePayment = async () => {
    if (paymentLoading) return; // Prevent double-clicks

    // Native (iOS/Android) builds MUST use in-app purchase per Apple/Google policy.
    // RevenueCat IAP is not yet wired — show a friendly message instead of opening Stripe.
    const method = getPaymentMethod();
    if (method !== 'stripe') {
      toast.info('In-app purchase coming soon', {
        description: 'Lifetime access via the App Store will unlock here shortly.',
      });
      return;
    }

    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment');
      
      if (error) {
        toast.error('Unable to start payment. Please try again.', {
          description: 'If this persists, please contact support.',
        });
        return;
      }
      
      if (data?.error) {
        toast.error('Payment service unavailable', {
          description: data.error || 'Please try again later.',
        });
        return;
      }
      
      if (data?.url) {
        // Use window.location.href for better reliability (avoids popup blockers)
        window.location.href = data.url;
      } else {
        toast.error('Unable to open payment page', {
          description: 'Please try again or contact support.',
        });
      }
    } catch (_err) {
      toast.error('Something went wrong', {
        description: 'Please try again later.',
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        paymentLoading,
        accessInfo,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        refreshAccess,
        initiatePayment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
