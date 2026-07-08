import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { initPushNotifications } from '@/lib/pushNotifications';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fire-and-forget native initializer. Renders nothing.
 * Safe on web (all helpers no-op off-device).
 *
 * On native platforms, also handles OAuth deep-link callbacks. When the
 * OAuth provider redirects back to the app via our custom scheme or
 * Universal Link, iOS/Android hands the URL to Capacitor. We parse the
 * Supabase auth tokens/code from that URL and hand them to supabase-js so
 * the session hydrates inside the native shell.
 */
const NativeBootstrap = () => {
  useEffect(() => {
    initPushNotifications();

    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { App } = await import('@capacitor/app');
      const listener = await App.addListener('appUrlOpen', async (event) => {
        try {
          const url = new URL(event.url);
          // Handle both implicit (#access_token=…) and PKCE (?code=…) responses.
          const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const code = url.searchParams.get('code');

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          } else if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          }
        } catch (err) {
          console.warn('[NativeBootstrap] appUrlOpen handling failed', err);
        }
      });
      cleanup = () => listener.remove();
    })();

    return () => {
      cleanup?.();
    };
  }, []);
  return null;
};

export default NativeBootstrap;
