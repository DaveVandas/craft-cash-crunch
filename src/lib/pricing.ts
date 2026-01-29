import { Capacitor } from '@capacitor/core';

export type Platform = 'web' | 'ios' | 'android';

export interface PricingTier {
  regular: number;
  discount: number;
  discountPercent: number;
  currency: string;
  currencySymbol: string;
}

export interface PricingConfig {
  platform: Platform;
  lifetimeAccess: PricingTier;
  mogulCash: {
    price: number;
    amount: number;
    currency: string;
    currencySymbol: string;
  };
  isNativeApp: boolean;
}

// Platform-specific pricing
// Web: Lower price (Stripe ~3% fees)
// Native: Higher price to offset 30% App Store/Play Store fees
const PRICING: Record<Platform, PricingTier> = {
  web: {
    regular: 6.99,
    discount: 5.99,
    discountPercent: 14,
    currency: 'USD',
    currencySymbol: '$',
  },
  ios: {
    regular: 9.99,
    discount: 7.99,
    discountPercent: 20,
    currency: 'USD',
    currencySymbol: '$',
  },
  android: {
    regular: 9.99,
    discount: 7.99,
    discountPercent: 20,
    currency: 'USD',
    currencySymbol: '$',
  },
};

// Mogul Cash pricing (same across platforms for now)
const MOGUL_CASH = {
  price: 4.99,
  amount: 20000,
  currency: 'USD',
  currencySymbol: '$',
};

/**
 * Detect the current platform
 */
export function detectPlatform(): Platform {
  try {
    if (Capacitor.isNativePlatform()) {
      const platform = Capacitor.getPlatform();
      if (platform === 'ios') return 'ios';
      if (platform === 'android') return 'android';
    }
  } catch {
    // Capacitor not available, assume web
  }
  return 'web';
}

/**
 * Get the full pricing configuration for the current platform
 */
export function getPricingConfig(): PricingConfig {
  const platform = detectPlatform();
  
  return {
    platform,
    lifetimeAccess: PRICING[platform],
    mogulCash: MOGUL_CASH,
    isNativeApp: platform !== 'web',
  };
}

/**
 * Format a price for display
 */
export function formatPrice(amount: number, currencySymbol: string = '$'): string {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

/**
 * Get display strings for lifetime access pricing
 */
export function getLifetimeAccessPricing() {
  const config = getPricingConfig();
  const { lifetimeAccess } = config;
  
  return {
    regularPrice: formatPrice(lifetimeAccess.regular, lifetimeAccess.currencySymbol),
    discountPrice: formatPrice(lifetimeAccess.discount, lifetimeAccess.currencySymbol),
    discountPercent: lifetimeAccess.discountPercent,
    platform: config.platform,
    isNativeApp: config.isNativeApp,
    // Raw values for calculations
    regularAmount: lifetimeAccess.regular,
    discountAmount: lifetimeAccess.discount,
  };
}

/**
 * Check if we should use Stripe (web) or IAP (native)
 */
export function getPaymentMethod(): 'stripe' | 'apple_iap' | 'google_play' {
  const platform = detectPlatform();
  
  switch (platform) {
    case 'ios':
      return 'apple_iap';
    case 'android':
      return 'google_play';
    default:
      return 'stripe';
  }
}

/**
 * Quick access to current platform's regular price string
 * Useful for toast messages and static text
 */
export function getCurrentRegularPrice(): string {
  const config = getPricingConfig();
  return formatPrice(config.lifetimeAccess.regular, config.lifetimeAccess.currencySymbol);
}

/**
 * Quick access to current platform's discount price string
 */
export function getCurrentDiscountPrice(): string {
  const config = getPricingConfig();
  return formatPrice(config.lifetimeAccess.discount, config.lifetimeAccess.currencySymbol);
}
