/**
 * Offline-first cache backed by native storage (Capacitor Preferences) with a
 * localStorage fallback on web. Lets the iOS app show previously loaded
 * celebrity profiles, favorites and portfolio data with no network — a
 * capability a plain website cannot offer (Guideline 4.2).
 */

import { Capacitor } from '@capacitor/core';

type Entry<T> = { value: T; savedAt: number };

const PREFIX = 'wp_offline_';

async function nativeStore() {
  if (!Capacitor.isNativePlatform()) return null;
  try {
    const { Preferences } = await import('@capacitor/preferences');
    return Preferences;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T): Promise<void> {
  const payload = JSON.stringify({ value, savedAt: Date.now() } satisfies Entry<T>);
  const store = await nativeStore();
  try {
    if (store) {
      await store.set({ key: PREFIX + key, value: payload });
      return;
    }
    localStorage.setItem(PREFIX + key, payload);
  } catch {
    // storage full or unavailable — cache is best-effort
  }
}

export async function cacheGet<T>(key: string): Promise<{ value: T; savedAt: number } | null> {
  const store = await nativeStore();
  try {
    const raw = store
      ? (await store.get({ key: PREFIX + key })).value
      : localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Entry<T>;
    if (!parsed || typeof parsed.savedAt !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function cacheRemove(key: string): Promise<void> {
  const store = await nativeStore();
  try {
    if (store) {
      await store.remove({ key: PREFIX + key });
      return;
    }
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

/** Recently viewed celebrity profiles, newest first. */
const RECENT_KEY = 'recent_profiles';

export interface RecentProfile {
  id: string;
  name: string;
  image?: string | null;
  headline?: string | null;
  viewedAt: number;
}

export async function addRecentProfile(profile: Omit<RecentProfile, 'viewedAt'>): Promise<void> {
  const existing = (await cacheGet<RecentProfile[]>(RECENT_KEY))?.value ?? [];
  const next = [
    { ...profile, viewedAt: Date.now() },
    ...existing.filter((p) => p.id !== profile.id),
  ].slice(0, 20);
  await cacheSet(RECENT_KEY, next);
}

export async function getRecentProfiles(): Promise<RecentProfile[]> {
  return (await cacheGet<RecentProfile[]>(RECENT_KEY))?.value ?? [];
}
