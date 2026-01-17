import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const AFFILIATE_CODE_KEY = 'wp_affiliate_referral_code';

/**
 * Hook to check for affiliate referral code in URL query params
 * and persist it to localStorage for attribution tracking.
 * 
 * Usage: Add to any landing page or entry point
 * Supports URLs like: ?ref=MOGUL123
 */
export function useAffiliateAttribution() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    
    if (refCode && refCode.trim()) {
      // Store the affiliate code for attribution after signup
      // Only override if there's a valid code (don't clear existing attribution)
      localStorage.setItem(AFFILIATE_CODE_KEY, refCode.toUpperCase().trim());
      console.log('[Affiliate] Attribution stored:', refCode.toUpperCase().trim());
    }
  }, [searchParams]);
}

export { AFFILIATE_CODE_KEY };
