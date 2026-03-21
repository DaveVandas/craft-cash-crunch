import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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

const CASH_AMOUNT = 20000;

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { portfolioId, sessionId } = await req.json();
    
    // SECURITY: Both portfolioId and sessionId are required
    if (!portfolioId) {
      throw new Error("Portfolio ID is required");
    }
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // SECURITY: Extract user authentication if present
    const authHeader = req.headers.get('Authorization');
    let authenticatedUserId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      // Use anon client to verify the JWT token
      const supabaseAnon = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      const { data: { user } } = await supabaseAnon.auth.getUser(token);
      authenticatedUserId = user?.id ?? null;
    }
    
    // Get request session ID for guest users
    const requestSessionId = req.headers.get('x-session-id');

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // SECURITY: Always verify the Stripe session - never skip this step
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }
    
    // Validate metadata matches the portfolio
    if (session.metadata?.portfolioId !== portfolioId) {
      throw new Error("Portfolio mismatch");
    }

    // SECURITY: Idempotency check - prevent replay attacks
    // Check if this payment_intent has already been used
    const paymentIntentId = typeof session.payment_intent === 'string' 
      ? session.payment_intent 
      : session.payment_intent?.id;
    
    if (paymentIntentId) {
      const { data: existingPurchase } = await supabaseAdmin
        .from("trading_cash_purchases")
        .select("id")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .maybeSingle();
      
      if (existingPurchase) {
        throw new Error("Payment already processed");
      }
    }

    // Get current portfolio with ownership info
    const { data: portfolio, error: fetchError } = await supabaseAdmin
      .from("trading_portfolios")
      .select("cash_balance, user_id, session_id")
      .eq("id", portfolioId)
      .single();
    
    if (fetchError || !portfolio) {
      throw new Error("Portfolio not found");
    }
    
    // SECURITY: Verify ownership - user must own the portfolio
    // For authenticated users: verify user_id matches
    // For guest users: verify session_id matches the request header
    const isAuthenticatedOwner = authenticatedUserId && portfolio.user_id === authenticatedUserId;
    const isGuestOwner = !portfolio.user_id && requestSessionId && portfolio.session_id === requestSessionId;
    
    if (!isAuthenticatedOwner && !isGuestOwner) {
      console.error(`Ownership verification failed: portfolioId=${portfolioId}, authenticatedUserId=${authenticatedUserId}, requestSessionId=${requestSessionId}, portfolio.user_id=${portfolio.user_id}, portfolio.session_id=${portfolio.session_id}`);
      throw new Error("Unauthorized: You do not own this portfolio");
    }
    
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

    // Record the purchase with payment_intent for idempotency
    await supabaseAdmin
      .from("trading_cash_purchases")
      .insert({
        portfolio_id: portfolioId,
        amount_purchased: CASH_AMOUNT,
        price_paid: 4.99,
        stripe_payment_intent_id: paymentIntentId || sessionId,
      });

    console.log(`Mogul Cash purchase verified: portfolio=${portfolioId}, amount=${CASH_AMOUNT}, payment_intent=${paymentIntentId}`);

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
