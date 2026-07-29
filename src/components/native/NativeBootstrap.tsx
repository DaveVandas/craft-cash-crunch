import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { initPushNotifications } from '@/lib/pushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { isBiometricEnabled, verifyBiometric } from '@/lib/nativeBiometric';

/**
 * Fire-and-forget native initializer. Renders nothing.
 * Safe on web (all helpers no-op off-device).
 *
 * On native platforms:
 *  - Handles OAuth deep-link callbacks (iOS Universal Link / custom scheme).
 *  - Prompts Face ID / Touch ID on cold launch when the user opted in.
 */
const NativeBootstrap = () => {
  useEffect(() => {
    initPushNotifications();

    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      // 1. Optional biometric unlock on cold launch. If the user enrolled
      //    Face ID, ask for verification once per app start before showing
      //    protected content. A failed check simply signs the user out —
      //    they can still use the app anonymously.
      if (isBiometricEnabled()) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const ok = await verifyBiometric('Unlock your Wealth Perspective account');
          if (!ok) {
            await supabase.auth.signOut();
          }
        }
      }

      const { App } = await import('@capacitor/app');
      const { Browser } = await import('@capacitor/browser');

      const listener = await App.addListener('appUrlOpen', async (event) => {
        try {
          const url = new URL(event.url);
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

          // Dismiss the in-app browser tab used for Google sign-in.
          try {
            await Browser.close();
          } catch {
            /* no browser open */
          }
        } catch (err) {
          console.warn('[NativeBootstrap] appUrlOpen handling failed', err);
        }
      });

      // Evaluate on-device price alerts on launch and every time the app
      // returns to the foreground.
      checkAlerts().catch(() => undefined);
      const stateListener = await App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) checkAlerts().catch(() => undefined);
      });

      cleanup = () => {
        listener.remove();
        stateListener.remove();
      };
    })();

    return () => {
      cleanup?.();
    };
  }, []);
  return null;
};

export default NativeBootstrap;

