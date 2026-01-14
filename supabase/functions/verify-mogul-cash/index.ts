import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CASH_AMOUNT = 20000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { portfolioId, sessionId } = await req.json();
    
    if (!portfolioId) {
      throw new Error("Portfolio ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Verify the session if provided
    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status !== "paid") {
        throw new Error("Payment not completed");
      }
      
      // Check metadata matches
      if (session.metadata?.portfolioId !== portfolioId) {
        throw new Error("Portfolio mismatch");
      }
    }

    // Get current portfolio balance
    const { data: portfolio, error: fetchError } = await supabaseAdmin
      .from("trading_portfolios")
      .select("cash_balance")
      .eq("id", portfolioId)
      .single();
    
    if (fetchError || !portfolio) {
      throw new Error("Portfolio not found");
    }

    const newBalance = Number(portfolio.cash_balance) + CASH_AMOUNT;

    // Update cash balance
    const { error: updateError } = await supabaseAdmin
      .from("trading_portfolios")
      .update({ cash_balance: newBalance })
      .eq("id", portfolioId);
    
    if (updateError) {
      throw new Error("Failed to update balance");
    }

    // Record the purchase
    await supabaseAdmin
      .from("trading_cash_purchases")
      .insert({
        portfolio_id: portfolioId,
        amount_purchased: CASH_AMOUNT,
        price_paid: 4.99,
        stripe_payment_intent_id: sessionId || null,
      });

    return new Response(JSON.stringify({ 
      success: true, 
      newBalance,
      amountAdded: CASH_AMOUNT,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error verifying Mogul Cash purchase:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
