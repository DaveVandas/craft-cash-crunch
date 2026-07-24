import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * OAuth landing page. Both web and native OAuth flows redirect here
 * (https://earningsexplorer.shop/auth/callback via Universal Link on iOS,
 * and the same origin on web). We parse tokens from the URL if the
 * provider used the implicit/PKCE flow, wait for the Supabase session
 * to hydrate, then bounce the user to the home page.
 *
 * Existed to fix Apple 2.1(a) rejection where reviewers saw a 404 after
 * tapping Sign In on device — the previous flow redirected here but no
 * route was registered.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Try to consume ?code=… (PKCE) from the URL if present.
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(code);
          } catch {
            // ignore — session may already be set from hash
          }
        }

        // Implicit-flow tokens land in the URL hash and supabase-js will
        // pick them up automatically. Just poll briefly for the session.
        const start = Date.now();
        while (!cancelled && Date.now() - start < 4000) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            navigate('/', { replace: true });
            return;
          }
          await new Promise((r) => setTimeout(r, 200));
        }

        // No session materialized — send them back to /auth to try again
        // instead of leaving them on a blank page.
        if (!cancelled) navigate('/auth', { replace: true });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Sign-in failed');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground text-center">
        {error ? `Sign-in problem: ${error}` : 'Finishing sign-in…'}
      </p>
    </div>
  );
};

export default AuthCallback;
