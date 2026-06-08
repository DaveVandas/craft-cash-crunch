/**
 * In-App Purchase wrapper around RevenueCat for iOS and Android.
 *
 * IMPORTANT — Before shipping native builds:
 * 1. Create a RevenueCat account and project at https://app.revenuecat.com
 * 2. Add your iOS and Android apps and link them to App Store Connect / Play Console
 * 3. Configure your Entitlements (we use "lifetime") and Products:
 *      - iOS App Store product ID:   wealth_perspective_lifetime
 *      - Android Play product ID:    wealth_perspective_lifetime
 *      - iOS Mogul Cash consumable:  wealth_perspective_mogul_cash
 *      - Android Mogul Cash:         wealth_perspective_mogul_cash
 * 4. Copy the Apple and Google public SDK keys from the RevenueCat dashboard
 *    (Project Settings → API keys) and paste them below.
 * 5. In RevenueCat, add a webhook pointing to:
 *      https://gzhrgnoowzhifpbnnevp.supabase.co/functions/v1/verify-iap
 *    with an Authorization header that matches REVENUECAT_WEBHOOK_SECRET.
 */

import { Capacitor } from '@capacitor/core';
import {
  Purchases,
  LOG_LEVEL,
  type CustomerInfo,
} from '@revenuecat/purchases-capacitor';
import { supabase } from '@/integrations/supabase/client';

// === PUBLIC SDK KEYS — safe to ship in client bundles ===
// Replace with the keys from RevenueCat → Project Settings → API keys.
const REVENUECAT_IOS_API_KEY = 'appl_REPLACE_ME';
const REVENUECAT_ANDROID_API_KEY = 'goog_REPLACE_ME';

export const ENTITLEMENT_ID = 'lifetime';
export const LIFETIME_PRODUCT_ID = 'wealth_perspective_lifetime';
export const MOGUL_CASH_PRODUCT_ID = 'wealth_perspective_mogul_cash';

let initialized = false;

export function isNativePlatform(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/**
 * Initialise the RevenueCat SDK. Safe to call multiple times.
 * Must be called after the user signs in so purchases can be attributed.
 */
export async function initIAP(userId?: string): Promise<void> {
  if (!isNativePlatform()) return;

  const platform = Capacitor.getPlatform();
  const apiKey =
    platform === 'ios' ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;

  if (apiKey.includes('REPLACE_ME')) {
    console.warn('[IAP] RevenueCat API key not configured for', platform);
    return;
  }

  if (!initialized) {
    await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
    await Purchases.configure({ apiKey, appUserID: userId });
    initialized = true;
  } else if (userId) {
    await Purchases.logIn({ appUserID: userId });
  }
}

/**
 * Trigger the native purchase sheet for lifetime access.
 * Returns true if the user now has the lifetime entitlement.
 */
export async function purchaseLifetimeAccess(userId: string): Promise<boolean> {
  if (!isNativePlatform()) {
    throw new Error('IAP is only available on iOS and Android builds.');
  }

  await initIAP(userId);

  const offerings = await Purchases.getOfferings();
  const lifetimePackage =
    offerings.current?.availablePackages.find(
      (p) => p.product.identifier === LIFETIME_PRODUCT_ID,
    ) ?? offerings.current?.lifetime;

  if (!lifetimePackage) {
    throw new Error('Lifetime product is not available in the store yet.');
  }

  const result = await Purchases.purchasePackage({
    aPackage: lifetimePackage,
  });

  return hasLifetimeEntitlement(result.customerInfo);
}

/**
 * Restore previously purchased entitlements (Apple requires this on any
 * paywall surface). Returns true if lifetime access was restored.
 */
export async function restorePurchases(userId: string): Promise<boolean> {
  if (!isNativePlatform()) return false;

  await initIAP(userId);
  const { customerInfo } = await Purchases.restorePurchases();
  return hasLifetimeEntitlement(customerInfo);
}

function hasLifetimeEntitlement(info: CustomerInfo): boolean {
  return Boolean(info.entitlements.active[ENTITLEMENT_ID]);
}

/**
 * Tell our backend to grant lifetime access for the current user.
 * Called after a successful purchase or successful restore.
 */
export async function syncEntitlementToBackend(): Promise<void> {
  const { error } = await supabase.functions.invoke('verify-iap', {
    body: { source: 'client_sync' },
  });
  if (error) {
    console.warn('[IAP] verify-iap sync failed', error);
  }
}
