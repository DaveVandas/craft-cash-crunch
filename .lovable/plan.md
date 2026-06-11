

# Mac-Free Pre-Flight Plan

Everything below can be done from your current browser/iPad on the existing Lovable project. When we hit a step that genuinely requires macOS + Xcode, we stop and hand off to the Mac.

---

## Phase 1 — App Store Connect setup (browser only)

All done at appstoreconnect.apple.com. No code, no Mac.

1. **Create the app record**
   - Platform: iOS
   - Name: `Wealth Perspective`
   - Bundle ID: `com.northspan.wealthperspective` (must match `capacitor.config.ts` — already correct)
   - SKU: `wealth-perspective-001`
   - Primary language: English (U.S.)

2. **Create the two In-App Purchase products** (must match `src/lib/iap.ts` exactly)
   - `wealth_perspective_lifetime` — Non-Consumable — $9.99 — display name "Lifetime Access"
   - `wealth_perspective_mogul_cash` — Consumable — $4.99 — display name "$20,000 Mogul Cash"
   - Add localization, review screenshot (1024×1024 of the paywall), and "Ready to Submit" status.

3. **Create a Sandbox Tester account**
   - Users and Access → Sandbox → Test Accounts → +
   - Use a never-before-used email alias. Region = US. Save the password.

4. **Fill App Information**
   - Category: Finance (primary), Entertainment (secondary)
   - Privacy Policy URL: `https://earningsexplorer.shop/privacy`
   - Support URL: `https://earningsexplorer.shop`
   - Marketing URL (optional): `https://earningsexplorer.shop`

5. **App Privacy questionnaire** — declare what we collect (email, usage data, purchase history) and link it to the user.

---

## Phase 2 — Pre-flight audit inside Lovable (we do this together, here)

These are App Store rejection landmines we can fix now without any native build.

1. **Sign in with Apple** — Required by Apple any time you offer third-party social login (we have Google). Add a "Sign in with Apple" button to the Auth page, wired through Supabase Auth's Apple provider.

2. **Restore Purchases button** — Apple requires a visible "Restore Purchases" control on any paywall. Add to `PaywallGate.tsx` calling `restorePurchases()` from `src/lib/iap.ts` (function already exists).

3. **iOS copy audit** — Apple rejects apps that mention web prices or external payment links on iOS. We'll detect `Capacitor.isNativePlatform()` and:
   - Hide the "$6.99 Web price" mention
   - Hide any Stripe / "buy on web" CTAs
   - Show only the IAP price ($9.99) on native

4. **Account deletion discoverability** — Already built (`DeleteAccountDialog.tsx`). Verify it's reachable from a Settings/Profile screen in ≤2 taps.

5. **1024×1024 marketing icon** — Confirm `public/app-icons/ios-1024x1024.png` is final, no transparency, no rounded corners (Apple adds them).

6. **Splash screen polish** — Verify all six splash sizes already in `public/splash-screens/` look right.

7. **Legal links** — Privacy + Terms reachable from paywall and Settings (already in Footer; need to verify on native where Footer may not show).

8. **`capacitor.config.ts`** — Already correctly gated by `CAP_DEV=1`. No remote URL ships in production builds. ✅

---

## Phase 3 — App Store metadata + assets (browser only)

1. **Screenshots** — 6.7" iPhone (1290×2796) and 6.5" iPhone (1242×2688) required. We already have a `/store-screenshots` route generating these in-app — we'll capture each one and upload.

2. **App preview video** (optional but converts well) — 15–30 sec.

3. **Description, keywords, promotional text, "What's New"** — write all copy now in Lovable so it's ready to paste.

4. **Age rating questionnaire**

5. **Export Compliance** — declare "uses standard HTTPS encryption only" (true for us).

---

## Phase 4 — RevenueCat final wiring (browser only)

1. Confirm both products (`wealth_perspective_lifetime`, `wealth_perspective_mogul_cash`) are attached in RevenueCat → Products, linked to App Store Connect.
2. Confirm the `lifetime` Entitlement contains `wealth_perspective_lifetime`.
3. Confirm the "Current" Offering contains the lifetime package.
4. Webhook already verified 200 OK. ✅

---

## Phase 5 — Hand-off package for the Mac (we prepare, you execute later)

When you do get Mac access, you'll have a one-page runbook ready. We'll write it now:

1. Export project to GitHub (one click in Lovable).
2. On the Mac: `git clone …` → `npm install` → `npx cap add ios` → `npm run build` → `npx cap sync ios` → `npx cap open ios`.
3. In Xcode: sign in with Apple ID, select team, enable "In-App Purchase" capability, run on a physical iPhone signed into the Sandbox Tester account.
4. Test the $9.99 lifetime purchase end-to-end → confirm RevenueCat dashboard shows the event → confirm `has_lifetime_access` flips to `true` in the database.
5. Product → Archive → Distribute App → App Store Connect.
6. Submit for review in App Store Connect.

---

## What I propose we build first

The single highest-leverage Mac-free coding work is **Phase 2 items 1–3** (Sign in with Apple, Restore Purchases button, iOS-aware paywall copy), because all three are guaranteed App Store rejections if missing. Everything else in Phase 1, 3, 4 is account/dashboard work you can do in parallel from the iPad.

Approve this plan and I'll start with Phase 2 in build mode.

