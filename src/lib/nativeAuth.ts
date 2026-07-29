/**
 * Native (iOS/Android) social sign-in.
 *
 * Web keeps using the hosted Lovable OAuth broker. On device that broker
 * bounced users out to an external HTTPS page, which is what App Review saw
 * as an "error page" (Guideline 2.1a). Native now uses:
 *
 *  - Apple:  the system Sign in with Apple sheet, exchanging the returned
 *            identity token directly with the backend (no browser hop).
 *  - Google: an in-app secure browser tab redirecting back into the app via
 *            the `wealthperspective://auth/callback` custom scheme, which
 *            NativeBootstrap consumes on `appUrlOpen`.
 */

import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

export const NATIVE_REDIRECT_URI = 'wealthperspective://auth/callback';

export function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

function randomNonce(length = 32): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Native Sign in with Apple. Returns true when a session was established.
 * Throws with a readable message on failure so the caller can show it inline.
 */
export async function signInWithAppleNative(): Promise<boolean> {
  const { SignInWithApple } = await import('@capacitor-community/apple-sign-in');

  const rawNonce = randomNonce();
  const hashedNonce = await sha256Hex(rawNonce);

  const result = await SignInWithApple.authorize({
    clientId: 'com.northspan.wealthperspective',
    redirectURI: NATIVE_REDIRECT_URI,
    scopes: 'email name',
    state: randomNonce(16),
    nonce: hashedNonce,
  });

  const idToken = result.response?.identityToken;
  if (!idToken) {
    throw new Error('Apple did not return an identity token.');
  }

  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: idToken,
    nonce: rawNonce,
  });

  if (error) throw error;
  return true;
}

/**
 * Native Google sign-in through an in-app browser tab. The provider redirects
 * to our custom scheme, the OS hands the URL back to the app, and
 * NativeBootstrap exchanges the code/tokens for a session.
 */
export async function signInWithGoogleNative(): Promise<void> {
  const { Browser } = await import('@capacitor/browser');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: NATIVE_REDIRECT_URI,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('Could not start Google sign-in.');

  await Browser.open({ url: data.url, presentationStyle: 'popover' });
}
