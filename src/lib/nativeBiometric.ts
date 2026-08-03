import { Capacitor } from '@capacitor/core';

/**
 * Face ID / Touch ID unlock helper. On successful password/OAuth sign-in
 * we ask the user (once) whether they want to enable Face ID for
 * subsequent launches. If enabled, the Auth screen prompts for biometric
 * verification and — on success — the persisted Supabase session (already
 * in localStorage via supabase-js) is used to keep them signed in.
 *
 * On web everything is a no-op / returns null.
 */

const BIOMETRIC_ENABLED_KEY = 'wp_biometric_enabled';

async function loadPlugin() {
  if (!Capacitor.isNativePlatform()) return null;
  try {
    return await import('@capgo/capacitor-native-biometric');
  } catch {
    return null;
  }
}

export async function isBiometricAvailable(): Promise<boolean> {
  const mod = await loadPlugin();
  if (!mod) return false;
  try {
    const res = await mod.NativeBiometric.isAvailable();
    return !!res.isAvailable;
  } catch {
    return false;
  }
}

export function isBiometricEnabled(): boolean {
  try {
    return localStorage.getItem(BIOMETRIC_ENABLED_KEY) === '1';
  } catch {
    return false;
  }
}

export function setBiometricEnabled(v: boolean) {
  try {
    localStorage.setItem(BIOMETRIC_ENABLED_KEY, v ? '1' : '0');
  } catch {
    // ignore
  }
}

export async function verifyBiometric(reason = 'Unlock Wealth Perspective'): Promise<boolean> {
  const mod = await loadPlugin();
  if (!mod) return true; // web: no biometric guard
  try {
    await mod.NativeBiometric.verifyIdentity({
      reason,
      title: 'Face ID',
      subtitle: 'Verify to continue',
      description: reason,
    });
    return true;
  } catch {
    return false;
  }
}
