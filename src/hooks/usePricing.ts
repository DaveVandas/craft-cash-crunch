import { useMemo } from 'react';
import { 
  getPricingConfig, 
  getLifetimeAccessPricing, 
  getPaymentMethod,
  type PricingConfig,
  type Platform 
} from '@/lib/pricing';

interface UsePricingReturn {
  // Full config
  config: PricingConfig;
  
  // Lifetime access specifics
  regularPrice: string;
  discountPrice: string;
  discountPercent: number;
  
  // Platform info
  platform: Platform;
  isNativeApp: boolean;
  
  // Payment routing
  paymentMethod: 'stripe' | 'apple_iap' | 'google_play';
  canUseStripe: boolean;
  
  // Mogul Cash
  mogulCashPrice: string;
  mogulCashAmount: number;
}

/**
 * Hook to access platform-aware pricing throughout the app
 */
export function usePricing(): UsePricingReturn {
  return useMemo(() => {
    const config = getPricingConfig();
    const lifetimeAccess = getLifetimeAccessPricing();
    const paymentMethod = getPaymentMethod();
    
    return {
      config,
      regularPrice: lifetimeAccess.regularPrice,
      discountPrice: lifetimeAccess.discountPrice,
      discountPercent: lifetimeAccess.discountPercent,
      platform: config.platform,
      isNativeApp: config.isNativeApp,
      paymentMethod,
      canUseStripe: paymentMethod === 'stripe',
      mogulCashPrice: `${config.mogulCash.currencySymbol}${config.mogulCash.price.toFixed(2)}`,
      mogulCashAmount: config.mogulCash.amount,
    };
  }, []);
}
