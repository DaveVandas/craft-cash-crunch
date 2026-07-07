/**
 * Mobile-friendly share utilities.
 * Prefers the true native share sheet (Capacitor) on iOS/Android,
 * then Web Share API on mobile browsers, then clipboard fallback.
 */

import { nativeShare, isNative, haptic } from './nativeFeatures';

// Detect if running in a mobile browser (used for web-only fallbacks).
export const isMobile = (): boolean => {
  if (isNative()) return true;
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ((navigator as unknown as { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile ?? false);
};

/**
 * Handle sharing for platforms without direct web share APIs (Instagram, TikTok).
 * - Native app: opens the real iOS/Android share sheet via Capacitor.
 * - Mobile web: opens Web Share API.
 * - Desktop / unsupported: copies to clipboard.
 */
export const handleMobileAppShare = async (
  shareText: string,
  shareUrl: string,
  title: string,
  onCopyFallback: () => Promise<void>,
  toastMessage: { success: string; description: string }
): Promise<boolean> => {
  // 1) True native share sheet (iOS/Android via Capacitor).
  if (isNative()) {
    haptic('light');
    const ok = await nativeShare({ title, text: shareText, url: shareUrl });
    if (ok) return true;
  }

  // 2) Web Share API on mobile browsers.
  if (isMobile() && typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text: shareText, url: shareUrl });
      return true;
    } catch (err) {
      if ((err as Error).name === 'AbortError') return true;
      // fall through to copy
    }
  }

  // 3) Desktop / unsupported — copy to clipboard.
  await onCopyFallback();
  return false;
};

