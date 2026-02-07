import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  'https://earningsexplorer.shop',
  'https://www.earningsexplorer.shop',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    // Allow preview and staging domains
    return hostname.endsWith('.lovable.app');
  } catch {
    return false;
  }
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    
    // Validate session ID format (must be guest_ prefix followed by UUID)
    if (!sessionId || typeof sessionId !== 'string') {
      throw new Error('Session ID is required');
    }
    
    if (!sessionId.startsWith('guest_') || sessionId.length < 'guest_'.length + 36) {
      throw new Error('Invalid session ID format');
    }

    // Extract the UUID part and validate it
    const uuidPart = sessionId.substring('guest_'.length);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuidPart)) {
      throw new Error('Invalid session ID UUID format');
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Hash IP and User-Agent for anomaly detection (we don't store actual values)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Simple hash function for privacy
    const hashString = async (str: string): Promise<string> => {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    };

    const ipHash = await hashString(clientIp);
    const userAgentHash = await hashString(userAgent);

    // Insert or update session with sliding expiry
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    
    const { error } = await supabaseAdmin
      .from('guest_sessions')
      .upsert({
        session_id: sessionId,
        expires_at: expiresAt.toISOString(),
        last_activity_at: new Date().toISOString(),
        ip_hash: ipHash,
        user_agent_hash: userAgentHash,
      }, {
        onConflict: 'session_id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('Error registering guest session:', error);
      throw new Error('Failed to register session');
    }

    console.log(`Guest session registered: ${sessionId.substring(0, 20)}...`);

    return new Response(
      JSON.stringify({ 
        success: true,
        expiresAt: expiresAt.toISOString(),
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in register-guest-session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
