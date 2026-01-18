import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  'https://earningsexplorer.shop',
  'https://www.earningsexplorer.shop',
  'https://craft-cash-crunch.lovable.app',
  'https://id-preview--86ba5315-0e8e-45d4-9ce2-019ca156c207.lovable.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  logStep("Function started");

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    logStep("Auth header present", { hasAuth: !!authHeader });
    
    if (!authHeader) {
      logStep("ERROR: No authorization header");
      throw new Error("No authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      logStep("ERROR: Auth error", { error: userError.message });
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user) {
      logStep("ERROR: User not authenticated");
      throw new Error("User not authenticated");
    }
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const body = await req.json();
    const { session_id } = body;
    logStep("Request body parsed", { session_id: session_id ? session_id.substring(0, 20) + '...' : null });
    
    if (!session_id) {
      logStep("ERROR: No session_id provided");
      throw new Error("Session ID required");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not set");
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    logStep("Stripe key verified");

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    logStep("Retrieving Stripe session", { session_id: session_id.substring(0, 20) + '...' });
    const session = await stripe.checkout.sessions.retrieve(session_id);
    logStep("Session retrieved", { 
      payment_status: session.payment_status,
      customer: session.customer,
      payment_intent: session.payment_intent,
      metadata_user_id: session.metadata?.user_id
    });

    if (session.payment_status === "paid") {
      logStep("Payment status is PAID, proceeding with verification");
      
      // Security check 1: Verify the session belongs to the authenticated user
      if (session.metadata?.user_id !== user.id) {
        logStep("ERROR: Session user_id mismatch", {
          sessionUserId: session.metadata?.user_id,
          authenticatedUserId: user.id,
        });
        return new Response(JSON.stringify({ error: "Session does not belong to authenticated user" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        });
      }
      logStep("Security check 1 passed: user_id matches");

      // Security check 2: Verify this payment_intent hasn't been used by another user
      const { data: existingUsage, error: existingError } = await supabaseClient
        .from("user_access")
        .select("id, user_id, has_lifetime_access")
        .eq("stripe_payment_intent_id", session.payment_intent as string)
        .maybeSingle();

      if (existingError) {
        logStep("ERROR: Failed to check existing usage", { error: existingError.message });
      }
      
      logStep("Existing usage check", { existingUsage });

      if (existingUsage && existingUsage.user_id !== user.id) {
        logStep("ERROR: Payment intent already used by another user", {
          paymentIntent: session.payment_intent,
          existingUserId: existingUsage.user_id,
          attemptingUserId: user.id,
        });
        return new Response(JSON.stringify({ error: "Payment session has already been used" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 409,
        });
      }
      logStep("Security check 2 passed: payment_intent not used by another user");

      // Check current user_access record
      const { data: currentAccess, error: accessError } = await supabaseClient
        .from("user_access")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      logStep("Current user_access record", { currentAccess, error: accessError?.message });

      // Update user_access to grant lifetime access
      logStep("Updating user_access to grant lifetime access");
      const { data: updateData, error: updateError } = await supabaseClient
        .from("user_access")
        .update({
          has_lifetime_access: true,
          stripe_customer_id: session.customer as string,
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq("user_id", user.id)
        .select();

      if (updateError) {
        logStep("ERROR: Failed to update user_access", { error: updateError.message, code: updateError.code });
        throw new Error(`Failed to update access: ${updateError.message}`);
      }
      
      logStep("SUCCESS: user_access updated", { updateData });

      // Notify admins of a new sale (bell notification)
      try {
        const saleAmount = 6.99;
        const referredByCode = (currentAccess as any)?.referred_by_code ?? null;

        const { data: adminRoles, error: adminRolesError } = await supabaseClient
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (adminRolesError) {
          logStep("WARN: Failed to fetch admin roles", { error: adminRolesError.message });
        } else {
          const adminIds = (adminRoles ?? []).map((r) => r.user_id).filter(Boolean);

          if (adminIds.length > 0) {
            const paymentIntentId = session.payment_intent as string;

            // Prevent duplicate notifications if verify-payment is called multiple times
            const { data: existingNotifs, error: existingNotifsError } = await supabaseClient
              .from('user_notifications')
              .select('user_id')
              .in('user_id', adminIds)
              .eq('type', 'admin_sale')
              .contains('metadata', { stripe_payment_intent_id: paymentIntentId });

            if (existingNotifsError) {
              logStep("WARN: Failed to check existing admin notifications", { error: existingNotifsError.message });
            }

            const alreadyNotified = new Set((existingNotifs ?? []).map((n) => (n as any).user_id));

            const notificationsToInsert = adminIds
              .filter((adminId) => !alreadyNotified.has(adminId))
              .map((adminId) => ({
                user_id: adminId,
                type: 'admin_sale',
                title: 'New sale 💰',
                message: `Lifetime access purchased ($${saleAmount.toFixed(2)})${referredByCode ? ` • ref: ${referredByCode}` : ''}`,
                action_url: '/admin',
                metadata: {
                  stripe_payment_intent_id: paymentIntentId,
                  purchaser_user_id: user.id,
                  amount: saleAmount,
                  referred_by_code: referredByCode,
                },
              }));

            if (notificationsToInsert.length > 0) {
              const { error: notifyError } = await supabaseClient
                .from('user_notifications')
                .insert(notificationsToInsert);

              if (notifyError) {
                logStep("WARN: Failed to insert admin sale notifications", { error: notifyError.message });
              } else {
                logStep("Admin sale notifications inserted", { count: notificationsToInsert.length });
              }
            } else {
              logStep("Admin sale notifications skipped (already notified)");
            }
          }
        }
      } catch (notifyErr) {
        logStep("WARN: Admin notification block failed", { error: notifyErr instanceof Error ? notifyErr.message : String(notifyErr) });
      }

      // Verify the update worked
      const { data: verifyAccess } = await supabaseClient
        .from("user_access")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      logStep("Verification after update", { verifyAccess });

      return new Response(JSON.stringify({ success: true, paid: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Payment status is NOT paid", { status: session.payment_status });
    return new Response(JSON.stringify({ success: true, paid: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR in verify-payment", { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
