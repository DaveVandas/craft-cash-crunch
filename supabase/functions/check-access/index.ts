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

function getCorsHeaders(origin: string | null): Record<string, string> {
  // Allow production, localhost, and preview/staging domains
  const allowedOrigin = origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.lovable.app'))
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Credentials': 'true',
  };
}

const FREE_SEARCH_LIMIT = 3;

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        hasAccess: false, 
        searchesRemaining: 0,
        requiresAuth: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user) {
      return new Response(JSON.stringify({ 
        hasAccess: false, 
        searchesRemaining: 0,
        requiresAuth: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get user access record
    const { data: accessData, error } = await supabaseClient
      .from("user_access")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching access:", error);
      throw new Error("Failed to check access");
    }

    // If no record exists (shouldn't happen due to trigger), create one
    if (!accessData) {
      const { data: newAccess, error: insertError } = await supabaseClient
        .from("user_access")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (insertError) throw new Error("Failed to create access record");

      return new Response(JSON.stringify({
        hasAccess: true,
        hasLifetimeAccess: false,
        searchCount: 0,
        searchesRemaining: FREE_SEARCH_LIMIT,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const hasLifetimeAccess = accessData.has_lifetime_access;
    const searchCount = accessData.search_count;
    
    // Check for active beta access
    const hasBetaAccess = accessData.beta_expires_at 
      ? new Date(accessData.beta_expires_at) > new Date() 
      : false;
    
    const searchesRemaining = (hasLifetimeAccess || hasBetaAccess) ? -1 : Math.max(0, FREE_SEARCH_LIMIT - searchCount);
    const hasAccess = hasLifetimeAccess || hasBetaAccess || searchCount < FREE_SEARCH_LIMIT;

    return new Response(JSON.stringify({
      hasAccess,
      hasLifetimeAccess,
      hasBetaAccess,
      betaExpiresAt: accessData.beta_expires_at,
      searchCount,
      searchesRemaining,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error checking access:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
