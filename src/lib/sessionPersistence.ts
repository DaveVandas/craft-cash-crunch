import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

/**
 * Native session persistence ("stay signed in").
 *
 * iOS/Android WebViews can evict localStorage (storage pressure, app updates,
 * "Clear website data"), which silently signs the user out. We mirror the
 * Supabase session into native Preferences (Keychain-backed on iOS) and
 * restore it on cold launch so users stay signed in between sessions.
 */
const KEY = 'wp_native_session';

const getPrefs = async () => {
  const { Preferences } = await import('@capacitor/preferences');
  return Preferences;
};

export const initNativeSessionPersistence = async () => {
  if (!Capacitor.isNativePlatform()) return () => undefined;

  const Preferences = await getPrefs();

  // 1. Restore a stored session if the WebView lost it.
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const { value } = await Preferences.get({ key: KEY });
      if (value) {
        const stored = JSON.parse(value) as {
          access_token: string;
          refresh_token: string;
        };
        if (stored?.refresh_token) {
          await supabase.auth.setSession({
            access_token: stored.access_token,
            refresh_token: stored.refresh_token,
          });
        }
      }
    }
  } catch (err) {
    console.warn('[session] restore failed', err);
  }

  // 2. Keep the mirror in sync (refreshes rotate the refresh token).
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      try {
        if (event === 'SIGNED_OUT' || !session) {
          await Preferences.remove({ key: KEY });
          return;
        }
        await Preferences.set({
          key: KEY,
          value: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });
      } catch (err) {
        console.warn('[session] persist failed', err);
      }
    })();
  });

  return () => subscription.unsubscribe();
};
