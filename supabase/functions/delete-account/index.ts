import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the user with the anon client
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Delete user data from all tables (order matters for foreign keys)
    const tables = [
      { table: "trading_achievements", via: "portfolio" },
      { table: "trading_orders", via: "portfolio" },
      { table: "trading_positions", via: "portfolio" },
      { table: "trading_cash_purchases", via: "portfolio" },
      { table: "trading_portfolios", column: "user_id" },
      { table: "favorites", column: "user_id" },
      { table: "user_notifications", column: "user_id" },
      { table: "beta_feedback", column: "user_id" },
      { table: "beta_sessions", column: "user_id" },
      { table: "share_analytics", column: "user_id" },
      { table: "referrals", column: "referrer_id" },
      { table: "user_access", column: "user_id" },
      { table: "profiles", column: "id" },
    ];

    // Get portfolio IDs first for cascading deletes
    const { data: portfolios } = await adminClient
      .from("trading_portfolios")
      .select("id")
      .eq("user_id", userId);
    
    const portfolioIds = portfolios?.map(p => p.id) || [];

    // Delete trading-related data via portfolio IDs
    if (portfolioIds.length > 0) {
      for (const table of ["trading_achievements", "trading_orders", "trading_positions", "trading_cash_purchases"]) {
        await adminClient.from(table).delete().in("portfolio_id", portfolioIds);
      }
      await adminClient.from("trading_portfolios").delete().eq("user_id", userId);
    }

    // Delete from remaining tables
    for (const { table, column, via } of tables) {
      if (via === "portfolio") continue; // Already handled
      if (column) {
        await adminClient.from(table).delete().eq(column, userId);
      }
    }

    // Handle affiliate data - disassociate but keep records for financial audit
    await adminClient
      .from("affiliates")
      .update({ user_id: null, email: "deleted@removed.com", display_name: "Deleted User" })
      .eq("user_id", userId);

    // Finally delete the auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return new Response(JSON.stringify({ error: "Failed to delete account" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Delete account error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
