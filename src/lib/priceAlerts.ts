/**
 * On-device price alerts. Alerts are stored in native storage and evaluated
 * whenever the app is opened or resumed; a local notification fires when a
 * target is crossed. This is native background-capable behaviour that a web
 * page cannot provide (Guideline 4.2).
 */

import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { cacheGet, cacheSet } from '@/lib/offlineCache';

const ALERTS_KEY = 'price_alerts';

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: number;
  triggeredAt?: number;
}

export async function getAlerts(): Promise<PriceAlert[]> {
  return (await cacheGet<PriceAlert[]>(ALERTS_KEY))?.value ?? [];
}

export async function saveAlerts(alerts: PriceAlert[]): Promise<void> {
  await cacheSet(ALERTS_KEY, alerts);
}

export async function addAlert(
  symbol: string,
  targetPrice: number,
  direction: 'above' | 'below',
): Promise<PriceAlert[]> {
  const alerts = await getAlerts();
  const next: PriceAlert[] = [
    ...alerts,
    {
      id: `${symbol}-${Date.now()}`,
      symbol: symbol.toUpperCase(),
      targetPrice,
      direction,
      createdAt: Date.now(),
    },
  ];
  await saveAlerts(next);
  return next;
}

export async function removeAlert(id: string): Promise<PriceAlert[]> {
  const next = (await getAlerts()).filter((a) => a.id !== id);
  await saveAlerts(next);
  return next;
}

async function notify(title: string, body: string) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') {
      const req = await LocalNotifications.requestPermissions();
      if (req.display !== 'granted') return;
    }
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Math.floor(Math.random() * 100000) + 2000,
          title,
          body,
          schedule: { at: new Date(Date.now() + 1000) },
        },
      ],
    });
  } catch {
    // notification failure is non-fatal
  }
}

/**
 * Evaluate every pending alert against the latest quote and fire a local
 * notification for any that crossed their target. Returns the updated list.
 */
export async function checkAlerts(): Promise<PriceAlert[]> {
  const alerts = await getAlerts();
  const pending = alerts.filter((a) => !a.triggeredAt);
  if (pending.length === 0) return alerts;

  const symbols = Array.from(new Set(pending.map((a) => a.symbol)));
  const prices = new Map<string, number>();

  for (const symbol of symbols) {
    try {
      const { data } = await supabase.functions.invoke('get-stock-data', {
        body: { symbol },
      });
      const price = Number(data?.price ?? data?.currentPrice ?? data?.quote?.price);
      if (Number.isFinite(price)) prices.set(symbol, price);
    } catch {
      // skip symbol on failure
    }
  }

  let changed = false;
  const updated = alerts.map((alert) => {
    if (alert.triggeredAt) return alert;
    const price = prices.get(alert.symbol);
    if (price === undefined) return alert;
    const hit =
      alert.direction === 'above' ? price >= alert.targetPrice : price <= alert.targetPrice;
    if (!hit) return alert;
    changed = true;
    notify(
      `${alert.symbol} hit your target`,
      `${alert.symbol} is now $${price.toFixed(2)} (${alert.direction} $${alert.targetPrice.toFixed(2)}).`,
    );
    return { ...alert, triggeredAt: Date.now() };
  });

  if (changed) await saveAlerts(updated);
  return updated;
}
