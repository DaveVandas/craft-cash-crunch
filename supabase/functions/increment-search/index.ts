import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to return 200 with error field (prevents frontend global error dialog)
function errorResponse(message: string) {
  return new Response(JSON.stringify({ success: false, error: message, searchCount: null }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
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
      return errorResponse("Unauthorized");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user) {
      return errorResponse("Unauthorized");
    }

    // Get current access record
    const { data: accessData, error: fetchError } = await supabaseClient
      .from("user_access")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Failed to fetch access record:", fetchError);
      return errorResponse("Failed to fetch access record");
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
      return errorResponse("Failed to update search count");
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
    return errorResponse(errorMessage);
  }
});
