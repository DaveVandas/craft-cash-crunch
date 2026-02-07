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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Helper to return 200 with error field (prevents frontend global error dialog)
function errorResponse(message: string, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify({ success: false, error: message, searchCount: null }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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
      return errorResponse("Unauthorized", corsHeaders);
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user) {
      return errorResponse("Unauthorized", corsHeaders);
    }

    // Parse body for celebrity info (optional - for tracking trends)
    let celebrityName: string | null = null;
    let celebritySlug: string | null = null;
    let category: string | null = null;
    try {
      const body = await req.json();
      celebrityName = body.celebrityName || null;
      celebritySlug = body.celebritySlug || null;
      category = body.category || null;
    } catch {
      // No body or invalid JSON - that's fine
    }

    // Track search trend if celebrity info provided
    if (celebrityName && celebritySlug) {
      const { data: existingTrend } = await supabaseClient
        .from("search_trends")
        .select("id, search_count")
        .eq("celebrity_slug", celebritySlug)
        .maybeSingle();

      if (existingTrend) {
        await supabaseClient
          .from("search_trends")
          .update({
            search_count: existingTrend.search_count + 1,
            last_searched_at: new Date().toISOString(),
            category: category || undefined,
          })
          .eq("id", existingTrend.id);
      } else {
        await supabaseClient
          .from("search_trends")
          .insert({
            celebrity_name: celebrityName,
            celebrity_slug: celebritySlug,
            category: category || null,
            search_count: 1,
          });
      }
      console.log(`Tracked search trend for: ${celebrityName}`);
    }

    // Get current access record
    const { data: accessData, error: fetchError } = await supabaseClient
      .from("user_access")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Failed to fetch access record:", fetchError);
      return errorResponse("Failed to fetch access record", corsHeaders);
    }

    // Don't increment if user has lifetime access
    if (accessData?.has_lifetime_access) {
      return new Response(JSON.stringify({ 
        success: true, 
        error: null,
        searchCount: accessData.search_count 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Increment search count
    const newCount = (accessData?.search_count || 0) + 1;
    const { error: updateError } = await supabaseClient
      .from("user_access")
      .update({ search_count: newCount })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Failed to update search count:", updateError);
      return errorResponse("Failed to update search count", corsHeaders);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      error: null,
      searchCount: newCount 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error incrementing search:", error);
    return errorResponse(errorMessage, corsHeaders);
  }
});
