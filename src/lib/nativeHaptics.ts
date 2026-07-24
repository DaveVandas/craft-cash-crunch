import { Capacitor } from '@capacitor/core';

/**
 * Native haptic feedback helpers. All calls are no-ops on web so callers
 * don't need to guard. Provides a native-only signal for App Store
 * Guideline 4.2 (minimum functionality) beyond push/share.
 */

type ImpactStyle = 'light' | 'medium' | 'heavy';
type NotifyType = 'success' | 'warning' | 'error';

async function loadHaptics() {
  if (!Capacitor.isNativePlatform()) return null;
  try {
    return await import('@capacitor/haptics');
  } catch {
    return null;
  }
}

export async function hapticImpact(style: ImpactStyle = 'light') {
  const mod = await loadHaptics();
  if (!mod) return;
  try {
    const styleEnum = mod.ImpactStyle?.[style === 'light' ? 'Light' : style === 'medium' ? 'Medium' : 'Heavy'];
    await mod.Haptics.impact({ style: styleEnum });
  } catch {
    // ignore
  }
}

export async function hapticNotify(type: NotifyType = 'success') {
  const mod = await loadHaptics();
  if (!mod) return;
  try {
    const notif = mod.NotificationType?.[type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Error'];
    await mod.Haptics.notification({ type: notif });
  } catch {
    // ignore
  }
}

export async function hapticSelection() {
  const mod = await loadHaptics();
  if (!mod) return;
  try {
    await mod.Haptics.selectionStart();
    await mod.Haptics.selectionChanged();
    await mod.Haptics.selectionEnd();
  } catch {
    // ignore
  }
}
