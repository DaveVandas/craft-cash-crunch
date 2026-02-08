/**
 * Creates a Supabase client with guest session ID in headers
 * This is required for RLS policies to validate guest session ownership
 * 
 * Server-side session tracking is enforced via guest_sessions table
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const GUEST_SESSION_KEY = 'mogul_markets_session';
const GUEST_SESSION_EXPIRY_KEY = 'mogul_markets_session_expiry';
const GUEST_SESSION_REGISTERED_KEY = 'mogul_markets_session_registered';
const SESSION_EXPIRY_DAYS = 30; // Extended to 30 days to prevent data loss

function isValidGuestSessionId(sessionId: string | null): sessionId is string {
  return typeof sessionId === 'string' && sessionId.startsWith('guest_') && sessionId.length > 'guest_'.length;
}

/**
 * Check if the session is expired
 * IMPORTANT: Returns false for missing expiry to preserve legacy sessions
 */
function isSessionExpired(): boolean {
  if (typeof window === 'undefined') return true;
  const expiryStr = localStorage.getItem(GUEST_SESSION_EXPIRY_KEY);
  // If no expiry is set, the session is NOT expired (preserve legacy sessions)
  if (!expiryStr) return false;
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
  localStorage.removeItem(GUEST_SESSION_REGISTERED_KEY);
}

/**
 * Register session with server for server-side tracking and expiry validation
 * This is required for RLS policies to work properly
 */
async function registerSessionWithServer(sessionId: string): Promise<boolean> {
  // Check if already registered in this browser session
  const registeredSession = localStorage.getItem(GUEST_SESSION_REGISTERED_KEY);
  if (registeredSession === sessionId) {
    return true; // Already registered
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/register-guest-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'x-session-id': sessionId,
      },
      body: JSON.stringify({ sessionId }),
    });
    
    if (response.ok) {
      localStorage.setItem(GUEST_SESSION_REGISTERED_KEY, sessionId);
      return true;
    }
    
    console.error('Failed to register guest session:', await response.text());
    return false;
  } catch (error) {
    console.error('Error registering guest session:', error);
    return false;
  }
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
    // Register with server asynchronously (fire and forget for existing sessions)
    registerSessionWithServer(existingAfterCleanup);
    return existingAfterCleanup;
  }
  
  // Clear any expired session and create new one
  clearSession();
  const sessionId = `guest_${crypto.randomUUID()}`;
  localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  setSessionExpiry();
  
  // Register the new session with the server
  registerSessionWithServer(sessionId);
  
  return sessionId;
}

/**
 * Returns a Supabase client with the guest session ID header set
 * This allows RLS policies to validate session ownership
 * 
 * NOTE: global.headers may not be passed to functions.invoke() calls.
 * For edge function calls, use invokeWithSession() or pass headers explicitly.
 */
export function createSupabaseWithSession(sessionId?: string | null) {
  const effectiveSessionId = sessionId ?? getGuestSessionId();
  
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
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

  // Monkey-patch functions.invoke to always include session header
  const originalInvoke = client.functions.invoke.bind(client.functions);
  client.functions.invoke = async (functionName: string, options?: { body?: unknown; headers?: Record<string, string> }) => {
    const mergedHeaders = {
      ...(effectiveSessionId ? { 'x-session-id': effectiveSessionId } : {}),
      ...options?.headers,
    };
    return originalInvoke(functionName, {
      ...options,
      headers: mergedHeaders,
    });
  };

  return client;
}
