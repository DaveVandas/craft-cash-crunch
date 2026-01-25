/**
 * Creates a Supabase client with guest session ID in headers
 * This is required for RLS policies to validate guest session ownership
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const GUEST_SESSION_KEY = 'mogul_markets_session';
const GUEST_SESSION_EXPIRY_KEY = 'mogul_markets_session_expiry';
const SESSION_EXPIRY_DAYS = 7;

function isValidGuestSessionId(sessionId: string | null): sessionId is string {
  return typeof sessionId === 'string' && sessionId.startsWith('guest_') && sessionId.length > 'guest_'.length;
}

/**
 * Check if the session is expired
 */
function isSessionExpired(): boolean {
  if (typeof window === 'undefined') return true;
  const expiryStr = localStorage.getItem(GUEST_SESSION_EXPIRY_KEY);
  if (!expiryStr) return true;
  return Date.now() > parseInt(expiryStr, 10);
}

/**
 * Set session expiry to 7 days from now
 */
function setSessionExpiry(): void {
  const expiryTime = Date.now() + (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  localStorage.setItem(GUEST_SESSION_EXPIRY_KEY, expiryTime.toString());
}

/**
 * Clear expired session data
 */
function clearSession(): void {
  localStorage.removeItem(GUEST_SESSION_KEY);
  localStorage.removeItem(GUEST_SESSION_EXPIRY_KEY);
}

export function getGuestSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Check if session is expired
  if (isSessionExpired()) {
    clearSession();
    return null;
  }

  const sessionId = localStorage.getItem(GUEST_SESSION_KEY);

  // Migrate legacy / invalid session IDs (prevents backend from rejecting them)
  if (!isValidGuestSessionId(sessionId)) {
    clearSession();
    return null;
  }

  return sessionId;
}

export function getOrCreateGuestSession(): string {
  // Check for existing valid session
  const existingSession = localStorage.getItem(GUEST_SESSION_KEY);

  // If we have a legacy/invalid session id, wipe it so we don't get rejected by backend checks
  if (existingSession && !isValidGuestSessionId(existingSession)) {
    clearSession();
  }

  const existingAfterCleanup = localStorage.getItem(GUEST_SESSION_KEY);

  if (existingAfterCleanup && !isSessionExpired() && isValidGuestSessionId(existingAfterCleanup)) {
    // Rotate expiry on active use (sliding expiration)
    setSessionExpiry();
    return existingAfterCleanup;
  }
  
  // Clear any expired session and create new one
  clearSession();
  const sessionId = `guest_${crypto.randomUUID()}`;
  localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  setSessionExpiry();
  
  return sessionId;
}

/**
 * Returns a Supabase client with the guest session ID header set
 * This allows RLS policies to validate session ownership
 */
export function createSupabaseWithSession(sessionId?: string | null) {
  const effectiveSessionId = sessionId ?? getGuestSessionId();
  
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: effectiveSessionId ? {
        'x-session-id': effectiveSessionId,
      } : {},
    },
  });
}
