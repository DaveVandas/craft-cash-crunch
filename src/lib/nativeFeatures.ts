/**
 * Native-first feature helpers (Capacitor).
 *
 * All helpers are safe to call on the web — they no-op or fall back gracefully.
 * They only invoke real native APIs when running inside the Capacitor shell
 * (iOS / Android). This lets the same components run on web + native.
 */

import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { NativeBiometric, BiometryType } from '@capgo/capacitor-native-biometric';

export const isNative = (): boolean => Capacitor.isNativePlatform();

/* -------------------------------------------------------------------------- */
/*  Haptics                                                                    */
/* -------------------------------------------------------------------------- */

type HapticStrength = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

/**
 * Trigger a haptic tap. Silently no-ops on web / unsupported devices.
 * Wrap in try/catch defensively — never let a haptic failure break a UI action.
 */
export const haptic = async (strength: HapticStrength = 'light'): Promise<void> => {
  if (!isNative()) return;
  try {
    switch (strength) {
      case 'light':
        return await Haptics.impact({ style: ImpactStyle.Light });
      case 'medium':
        return await Haptics.impact({ style: ImpactStyle.Medium });
      case 'heavy':
        return await Haptics.impact({ style: ImpactStyle.Heavy });
      case 'selection':
        return await Haptics.selectionStart().then(() => Haptics.selectionEnd());
      case 'success':
        return await Haptics.notification({ type: NotificationType.Success });
      case 'warning':
        return await Haptics.notification({ type: NotificationType.Warning });
      case 'error':
        return await Haptics.notification({ type: NotificationType.Error });
    }
  } catch {
    /* ignore */
  }
};

/* -------------------------------------------------------------------------- */
/*  Native Share Sheet                                                         */
/* -------------------------------------------------------------------------- */

export interface NativeShareOptions {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
}

/**
 * Present the true iOS/Android share sheet via Capacitor.
 * Returns true when the share was presented (or user cancelled cleanly),
 * false when the platform can't share and the caller should fall back.
 */
export const nativeShare = async (opts: NativeShareOptions): Promise<boolean> => {
  if (isNative()) {
    try {
      const { value } = await Share.canShare();
      if (!value) return false;
      await Share.share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
        dialogTitle: opts.dialogTitle ?? opts.title,
      });
      return true;
    } catch (err) {
      // User cancelling counts as success — nothing else to do.
      const msg = (err as Error)?.message ?? '';
      if (/cancel/i.test(msg)) return true;
      return false;
    }
  }

  // Web fallback: Web Share API (mobile Safari / Chrome).
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: opts.title, text: opts.text, url: opts.url });
      return true;
    } catch (err) {
      if ((err as Error).name === 'AbortError') return true;
      return false;
    }
  }
  return false;
};

/* -------------------------------------------------------------------------- */
/*  Biometric (Face ID / Touch ID / Fingerprint)                               */
/* -------------------------------------------------------------------------- */

export const isBiometricAvailable = async (): Promise<boolean> => {
  if (!isNative()) return false;
  try {
    const result = await NativeBiometric.isAvailable();
    return !!result.isAvailable;
  } catch {
    return false;
  }
};

export const getBiometricLabel = async (): Promise<string> => {
  if (!isNative()) return 'Biometrics';
  try {
    const r = await NativeBiometric.isAvailable();
    switch (r.biometryType) {
      case BiometryType.FACE_ID:
        return 'Face ID';
      case BiometryType.TOUCH_ID:
        return 'Touch ID';
      case BiometryType.FINGERPRINT:
        return 'Fingerprint';
      case BiometryType.FACE_AUTHENTICATION:
        return 'Face Unlock';
      case BiometryType.IRIS_AUTHENTICATION:
        return 'Iris';
      default:
        return 'Biometrics';
    }
  } catch {
    return 'Biometrics';
  }
};

/**
 * Prompt the user for Face ID / Touch ID confirmation.
 * Returns true on success, false on cancel / failure.
 */
export const biometricVerify = async (reason: string): Promise<boolean> => {
  if (!isNative()) return true; // No-op on web (nothing to verify against).
  try {
    const available = await isBiometricAvailable();
    if (!available) return true;
    await NativeBiometric.verifyIdentity({
      reason,
      title: 'Wealth Perspective',
      subtitle: reason,
      description: 'Confirm to continue',
    });
    return true;
  } catch {
    return false;
  }
};
