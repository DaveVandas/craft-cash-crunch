## Wire the iOS RevenueCat SDK key

Single one-line code change to enable IAP in the iOS build.

### Change

In `src/lib/iap.ts`, replace the placeholder:

```ts
const REVENUECAT_IOS_API_KEY = 'appl_REPLACE_ME';
```

with:

```ts
const REVENUECAT_IOS_API_KEY = 'appl_ubRRjRROoIVixzVclDghLfoBKGK';
```

Leave `REVENUECAT_ANDROID_API_KEY` as `goog_REPLACE_ME` for now (Android isn't being submitted yet — it just no-ops on Android with a console warning).

### Why this is safe in client code

Public RevenueCat app-specific keys (the `appl_…` and `goog_…` keys from Project Settings → API Keys) are intentionally designed to ship in client bundles. They can only initiate purchases scoped to the user's own RevenueCat App User ID. The secret key (`sk_…`) is not being touched.

### After applying

We'll move to **Step 4 — Webhook verification** (confirm the RevenueCat → Lovable Cloud `verify-iap` webhook is wired with the `REVENUECAT_WEBHOOK_SECRET`), then **Step 5 — Sandbox test**.
