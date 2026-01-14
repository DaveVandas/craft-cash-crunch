/**
 * Creates a Supabase client with guest session ID in headers
 * This is required for RLS policies to validate guest session ownership
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const GUEST_SESSION_KEY = 'mogul_markets_session';

export function getGuestSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GUEST_SESSION_KEY);
}

export function getOrCreateGuestSession(): string {
  let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
  if (!sessionId) {
    sessionId = `guest_${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  }
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
