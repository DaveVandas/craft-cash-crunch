// Verify and apply in-app purchases from RevenueCat.
//
// Two entry points:
// 1. POST from RevenueCat webhook (authoritative, server-to-server)
//    Header:  Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET>
//    Body:    standard RevenueCat webhook payload
// 2. POST from the app after a successful purchase/restore (best-effort hint)
//    Header:  Authorization: Bearer <user JWT>
//    Body:    { source: "client_sync" }
//    This just confirms the user's current access record; the webhook is the
//    source of truth for granting lifetime access.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const ALLOWED_ORIGINS = [
  "https://earningsexplorer.shop",
  "https://www.earningsexplorer.shop",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin =
    origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".lovable.app"))
      ? origin
      : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

const LIFETIME_ENTITLEMENT = "lifetime";
const MOGUL_CASH_PRODUCT = "wealth_perspective_mogul_cash";
const MOGUL_CASH_AMOUNT = 20000;

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const webhookSecret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");

    // ---- Path 1: RevenueCat webhook ----
    if (webhookSecret && token === webhookSecret) {
      const payload = await req.json();
      const event = payload?.event;
      if (!event) {
        return json({ error: "Missing event" }, 400, corsHeaders);
      }

      const userId: string | undefined =
        event.app_user_id || event.original_app_user_id;
      if (!userId) {
        return json({ ok: true, skipped: "no user id" }, 200, corsHeaders);
      }

      const type = event.type;
      const productId: string | undefined = event.product_id;
      const entitlementIds: string[] = event.entitlement_ids ?? [];

      // Lifetime grant events
      const grantTypes = new Set([
        "INITIAL_PURCHASE",
        "NON_RENEWING_PURCHASE",
        "RENEWAL",
        "UNCANCELLATION",
        "PRODUCT_CHANGE",
        "TRANSFER",
      ]);

      if (
        grantTypes.has(type) &&
        entitlementIds.includes(LIFETIME_ENTITLEMENT)
      ) {
        const { error } = await admin
          .from("user_access")
          .update({
            has_lifetime_access: true,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
        if (error) console.error("Failed granting lifetime:", error);
      }

      // Consumable: Mogul Cash pack
      if (
        grantTypes.has(type) &&
        productId === MOGUL_CASH_PRODUCT
      ) {
        // Find user's active portfolio and credit cash
        const { data: portfolio } = await admin
          .from("trading_portfolios")
          .select("id, cash_balance")
          .eq("user_id", userId)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();
        if (portfolio) {
          await admin
            .from("trading_portfolios")
            .update({
              cash_balance:
                Number(portfolio.cash_balance ?? 0) + MOGUL_CASH_AMOUNT,
            })
            .eq("id", portfolio.id);
        }
      }

      // Refunds / cancellations revoke lifetime
      if (type === "CANCELLATION" || type === "EXPIRATION") {
        // Only revoke if it was a non-renewing lifetime purchase being refunded
        if (entitlementIds.includes(LIFETIME_ENTITLEMENT)) {
          await admin
            .from("user_access")
            .update({ has_lifetime_access: false })
            .eq("user_id", userId);
        }
      }

      return json({ ok: true, type }, 200, corsHeaders);
    }

    // ---- Path 2: Client sync (auth'd user) ----
    if (!authHeader) {
      return json({ error: "Authentication required" }, 401, corsHeaders);
    }

    const { data: userData } = await admin.auth.getUser(token);
    const user = userData.user;
    if (!user) {
      return json({ error: "Invalid session" }, 401, corsHeaders);
    }

    const { data: access } = await admin
      .from("user_access")
      .select("has_lifetime_access")
      .eq("user_id", user.id)
      .maybeSingle();

    return json(
      { ok: true, hasLifetimeAccess: !!access?.has_lifetime_access },
      200,
      corsHeaders,
    );
  } catch (error) {
    console.error("verify-iap error:", error);
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
      corsHeaders,
    );
  }
});

function json(body: unknown, status: number, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}
