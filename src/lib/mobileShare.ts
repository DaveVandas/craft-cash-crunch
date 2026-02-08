/**
 * Mobile-friendly share utilities
 * Uses native share sheet on mobile for Instagram/TikTok instead of just copying to clipboard
 */

// Detect if running in a mobile browser
export const isMobile = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ((navigator as unknown as { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile ?? false);
};

/**
 * Handle sharing for platforms without direct web share APIs (Instagram, TikTok)
 * On mobile: Opens the native share sheet where user can select the app
 * On desktop: Falls back to copying text to clipboard
 */
export const handleMobileAppShare = async (
  shareText: string,
  shareUrl: string,
  title: string,
  onCopyFallback: () => Promise<void>,
  toastMessage: { success: string; description: string }
): Promise<boolean> => {
  // On mobile, try native share sheet first
  if (isMobile() && navigator.share) {
    try {
      await navigator.share({
        title,
        text: shareText,
        url: shareUrl,
      });
      return true; // User shared successfully or cancelled
    } catch (err) {
      // AbortError means user cancelled - that's fine
      if ((err as Error).name === 'AbortError') {
        return true;
      }
      // Other errors - fall through to copy
    }
  }
  
  // Desktop or mobile share failed - copy to clipboard
  await onCopyFallback();
  return false;
};

