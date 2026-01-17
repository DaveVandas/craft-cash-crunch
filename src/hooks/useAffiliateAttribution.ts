import { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

const AFFILIATE_CODE_KEY = 'wp_affiliate_referral_code';
const AFFILIATE_VARIANT_KEY = 'wp_affiliate_source_variant';

/**
 * Determine the landing variant from the current path
 */
function getVariantFromPath(pathname: string): string {
  if (pathname.startsWith('/ref/')) return 'ref';
  if (pathname === '/landing-a') return 'landing-a';
  if (pathname === '/landing-b') return 'landing-b';
  if (pathname === '/landing-c') return 'landing-c';
  if (pathname === '/landing-d') return 'landing-d';
  if (pathname === '/') return 'home';
  return 'other';
}

/**
 * Hook to check for affiliate referral code in URL query params
 * and persist it to localStorage for attribution tracking.
 * Also tracks which landing page variant the user came from.
 * 
 * Usage: Add to any landing page or entry point
 * Supports URLs like: ?ref=MOGUL123
 */
export function useAffiliateAttribution() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    
    if (refCode && refCode.trim()) {
      const code = refCode.toUpperCase().trim();
      const variant = getVariantFromPath(location.pathname);
      
      // Store the affiliate code for attribution after signup
      localStorage.setItem(AFFILIATE_CODE_KEY, code);
      localStorage.setItem(AFFILIATE_VARIANT_KEY, variant);
      
      console.log('[Affiliate] Attribution stored:', code, 'from variant:', variant);
    }
  }, [searchParams, location.pathname]);
}

/**
 * Get stored affiliate attribution data
 */
export function getStoredAttribution(): { code: string | null; variant: string | null } {
  return {
    code: localStorage.getItem(AFFILIATE_CODE_KEY),
    variant: localStorage.getItem(AFFILIATE_VARIANT_KEY),
  };
}

/**
 * Clear stored attribution (call after successful signup)
 */
export function clearStoredAttribution() {
  localStorage.removeItem(AFFILIATE_CODE_KEY);
  localStorage.removeItem(AFFILIATE_VARIANT_KEY);
}

export { AFFILIATE_CODE_KEY, AFFILIATE_VARIANT_KEY };
