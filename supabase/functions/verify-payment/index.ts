import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { session_id } = await req.json();
    if (!session_id) throw new Error("Session ID required");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Security check 1: Verify the session belongs to the authenticated user
      if (session.metadata?.user_id !== user.id) {
        console.error("Session user_id mismatch:", {
          sessionUserId: session.metadata?.user_id,
          authenticatedUserId: user.id,
        });
        return new Response(JSON.stringify({ error: "Session does not belong to authenticated user" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        });
      }

      // Security check 2: Verify this payment_intent hasn't been used by another user
      const { data: existingUsage } = await supabaseClient
        .from("user_access")
        .select("id, user_id")
        .eq("stripe_payment_intent_id", session.payment_intent as string)
        .maybeSingle();

      if (existingUsage && existingUsage.user_id !== user.id) {
        console.error("Payment intent already used by another user:", {
          paymentIntent: session.payment_intent,
          existingUserId: existingUsage.user_id,
          attemptingUserId: user.id,
        });
        return new Response(JSON.stringify({ error: "Payment session has already been used" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 409,
        });
      }

      // Update user_access to grant lifetime access
      const { error: updateError } = await supabaseClient
        .from("user_access")
        .update({
          has_lifetime_access: true,
          stripe_customer_id: session.customer as string,
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating user access:", updateError);
        throw new Error("Failed to update access");
      }

      return new Response(JSON.stringify({ success: true, paid: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ success: true, paid: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
