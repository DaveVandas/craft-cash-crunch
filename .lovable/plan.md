# Create iOS IAP Products & Wire Up RevenueCat Offerings

Both Apple keys are now connected. Next we need to (1) create the two purchasable products in App Store Connect, (2) attach them to an Entitlement + Offering in RevenueCat, and (3) drop the real RevenueCat SDK keys into the app code. Until step 3 is done, native builds will log `[IAP] RevenueCat API key not configured` and purchases won't fire.

The two products we need (already referenced everywhere in the codebase):

| Product ID | Type | Price | Purpose |
|---|---|---|---|
| `wealth_perspective_lifetime` | Non-Consumable | $9.99 USD | Unlocks lifetime access (Entitlement: `lifetime`) |
| `wealth_perspective_mogul_cash` | Consumable | $4.99 USD | Adds $20,000 virtual paper-trading cash |

---

## Step 1 — Create the two products in App Store Connect

In App Store Connect → your app → **Monetization → In-App Purchases → +**

**Product A — Lifetime Access**
- Type: **Non-Consumable**
- Reference Name: `Wealth Perspective Lifetime`
- Product ID: `wealth_perspective_lifetime` (must match exactly)
- Price: **$9.99 USD** (Tier 10)
- Localization (English, U.S.):
  - Display Name: `Lifetime Access`
  - Description: `Unlock unlimited celebrity earnings lookups, Reality Check, Compare Mode, Debt Destroyer, Mogul Markets, and every premium feature — forever. One payment, no subscriptions.`
- Review Screenshot: 1284×2778 paywall screenshot (we already generate these on `/store-screenshots`)
- Review Notes: `Non-consumable lifetime unlock. Tap "Get Lifetime Access" on the paywall to trigger the purchase sheet.`

**Product B — Mogul Cash**
- Type: **Consumable**
- Reference Name: `Mogul Cash $20,000`
- Product ID: `wealth_perspective_mogul_cash`
- Price: **$4.99 USD** (Tier 5)
- Localization:
  - Display Name: `$20,000 Mogul Cash`
  - Description: `Add $20,000 of virtual paper-trading cash to your Mogul Markets portfolio. For simulated trading only — no real money or securities involved.`
- Review Screenshot: Mogul Markets "Buy Cash" modal
- Review Notes: `Consumable virtual currency for paper trading simulation only. Not real money, not redeemable, not a security.`

Save each product → status will become **Ready to Submit**. They go live for sandbox testing immediately; they only need to be attached to a build at the time you submit the app for review.

## Step 2 — Wire products into RevenueCat

In the RevenueCat dashboard for your iOS app:

1. **Products** → Import / + New → add both product IDs exactly as above.
2. **Entitlements** → + New → identifier `lifetime` → attach product `wealth_perspective_lifetime`. (The Mogul Cash consumable does NOT get an entitlement — it's tracked per-purchase via the webhook.)
3. **Offerings** → create one called `default` (or mark an existing one as current) with two Packages:
   - Package: `$rc_lifetime` → product `wealth_perspective_lifetime`
   - Package: `mogul_cash` (custom identifier) → product `wealth_perspective_mogul_cash`
4. Mark the offering as **Current**.
5. **Project Settings → API Keys** → copy the iOS **public** SDK key (starts with `appl_`).

## Step 3 — Drop the SDK key into the app

Replace the placeholder in `src/lib/iap.ts`:

```ts
const REVENUECAT_IOS_API_KEY = 'appl_REPLACE_ME';   // ← paste real key
```

Android key stays `goog_REPLACE_ME` for now since we're not shipping Play yet. (We could also move both to env vars, but since these are public SDK keys safe to ship in the bundle, inline is fine and matches the file's existing comment.)

## Step 4 — Confirm the webhook is set

In RevenueCat → **Project Settings → Integrations → Webhooks**, confirm:
- URL: `https://gzhrgnoowzhifpbnnevp.supabase.co/functions/v1/verify-iap`
- Authorization header value matches the `REVENUECAT_WEBHOOK_SECRET` secret already configured in Lovable Cloud.

This is what actually grants `has_lifetime_access = true` and credits Mogul Cash after a successful purchase — the client-side `syncEntitlementToBackend()` call is just a hint.

## Step 5 — Sandbox test

1. In App Store Connect → **Users and Access → Sandbox Testers** → create a test Apple ID (use an email you don't already have on an Apple account).
2. On a real iOS device, sign out of the App Store, build the app via Xcode, launch it, hit the paywall → "Get Lifetime Access" → sign in with the sandbox tester when prompted → complete purchase ($0 in sandbox).
3. Verify: paywall disappears, RevenueCat dashboard shows the transaction under the test user, and `user_access.has_lifetime_access` flips to `true` in the database.
4. Repeat for Mogul Cash → verify `trading_portfolios.cash_balance` increases by 20,000.

---

## What I'll do in build mode

The only code change is **Step 3**: paste the real `appl_…` key into `src/lib/iap.ts` once you have it. Everything else (Steps 1, 2, 4, 5) happens in the Apple and RevenueCat dashboards — I'll walk you through each screen but those clicks are yours.

When you're ready, share the iOS SDK key from RevenueCat → Project Settings → API Keys, and I'll wire it in.
