## Remaining Apple Rejection Fixes (Items 1, 4, 5, 6)

Tackling the four open items in one pass. Each is scoped, low-risk, and independent.

---

### 1. OAuth deep-linking for native iOS

**Problem:** `SocialAuthButtons` in `src/pages/Auth.tsx` uses `window.location.origin` as `redirect_uri`. Inside the Capacitor shell that resolves to `capacitor://localhost`, which the OAuth broker won't allow back to — sign-in with Apple/Google stalls in the in-app browser.

**Fix:**
- Add a custom URL scheme + Universal Link to `capacitor.config.ts` (`ios.scheme` + `App.appUrlOpen` listener).
- Install `@capacitor/app` if not already present; add a listener in `NativeBootstrap` that catches the OAuth callback URL and forwards the tokens to Supabase (`supabase.auth.setSession` / exchange code).
- In `Auth.tsx`, when `Capacitor.isNativePlatform()`, pass `redirect_uri: 'https://earningsexplorer.shop/auth/callback'` (a real https URL is required for Apple) and rely on Universal Links to bounce back into the app.
- Confirm Site URL + Redirect URLs in Cloud auth settings include the universal link + custom scheme.
- Apple sign-in on native should prefer the native Sign in with Apple flow when available; keep Google via the web OAuth broker.

---

### 4. Audit for beta / incomplete features in production

Sweep the app for anything a reviewer could flag as unfinished:
- Grep for `TODO`, `FIXME`, `Coming soon`, `Beta`, `WIP`, `placeholder` across `src/`.
- Review `BetaInvite`, `BetaManagement`, `BetaFeedbackModal`, `AffiliateManagement`, `Admin` — hide admin/beta-only routes from unauthenticated/native builds via a `IS_NATIVE_APP` guard where needed.
- Verify all footer/nav links resolve to a real page (no dead links).
- Ensure any dev-only debug UI (`OGImageGallery`, `DeploymentGuide`, `StoreScreenshots`, `Admin` sub-pages) is gated behind admin role or hidden in production builds.
- Produce a short punch-list of anything that must be removed vs. gated, then apply the changes.

---

### 5. Remove pricing from screenshots + regenerate

**Problem:** `StoreScreenshots.tsx` frame `07-lifetime` (`LifetimeOfferGraphic`) hard-codes **`$9.99`** and slide `08-mogul-cash` implies a paid consumable. Apple wants no price text in marketing screenshots (prices come from ASC).

**Fix:**
- Replace the giant `$9.99` block with a value-forward callout: "One payment. Yours forever." + benefits grid (already present).
- Rework `08-mogul-cash` slide caption/subCaption to remove "add $20,000" purchase framing — pivot to "Stack virtual paper cash. Trade bigger." with no dollar/consumable reference.
- Remove "Verified Lifetime Member" badge from testimonial slides (implies purchase tier). Swap to neutral "Verified Reviewer".
- Regenerate the six iPhone + six iPad PNGs via the existing capture flow (`StoreScreenshots` page, "Download all" button) and re-upload the updated assets under `src/assets/store-screens/` (asset.json pointers via `lovable-assets`).

---

### 6. Verify IAP wiring vs App Store Connect

**Sanity checks on `src/lib/iap.ts` + `supabase/functions/verify-iap`:**
- Confirm product IDs match ASC exactly:
  - `wealth_perspective_lifetime` (non-consumable)
  - `wealth_perspective_mogul_cash` (consumable, $20,000 credit)
- Confirm entitlement id `lifetime` matches RevenueCat dashboard.
- Confirm iOS API key `appl_ubRRjRROoIVixzVclDghLfoBKGK` is the correct project key (user to visually confirm — I can't read the RC dashboard).
- Confirm `REVENUECAT_WEBHOOK_SECRET` is set as a Supabase secret and the RC webhook points to `https://gzhrgnoowzhifpbnnevp.supabase.co/functions/v1/verify-iap`.
- Ensure "Restore Purchases" button is visible on every paywall surface (Apple requirement) — audit `PaywallGate`.
- Add explicit consumable handling verification: after purchase, `Purchases.purchasePackage` for Mogul Cash must call `syncEntitlementToBackend()` too (currently only lifetime does).

---

### Technical details

- Files to touch: `capacitor.config.ts`, `src/components/native/NativeBootstrap.tsx` (add deep-link listener), `src/pages/Auth.tsx`, `src/pages/StoreScreenshots.tsx`, `src/contexts/AuthContext.tsx` (Mogul Cash restore sync), `src/components/paywall/PaywallGate.tsx` (Restore button audit).
- New dep (only if missing): `@capacitor/app`.
- Deliverable for #5: regenerated PNG zip (iPhone 6.7" + iPad 13") for you to drop into ASC.
- Deliverable for #6: a checklist you can tick off in RC/ASC dashboards.

---

### Suggested execution order

1. Screenshots (#5) — quickest visible win, unblocks ASC upload.
2. Beta audit (#4) — surface anything else that needs a fix before shipping.
3. IAP verify (#6) — mostly configuration confirmation + one code tweak.
4. OAuth deep-link (#1) — largest change; test on device after archive.

Ready to switch to build mode and start with #5, or would you rather I begin with a different item?
