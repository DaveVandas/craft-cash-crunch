import { Capacitor } from '@capacitor/core';

/**
 * Prefer the iOS/Android native share sheet on device (via @capacitor/share)
 * and fall back to the Web Share API / clipboard on browsers. Provides an
 * additional native-only signal for App Store Guideline 4.2.
 */
export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
}

export async function nativeShare(opts: ShareOptions): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { Share } = await import('@capacitor/share');
      const can = await Share.canShare();
      if (can.value) {
        await Share.share({
          title: opts.title,
          text: opts.text,
          url: opts.url,
          dialogTitle: opts.dialogTitle ?? opts.title,
        });
        return true;
      }
    } catch {
      // fall through to web
    }
  }

  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await (navigator as Navigator & { share: (d: ShareOptions) => Promise<void> }).share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
      });
      return true;
    } catch {
      return false;
    }
  }

  // Final fallback: copy the URL
  try {
    if (opts.url && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(opts.url);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}
