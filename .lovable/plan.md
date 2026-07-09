## Plan of Attack — Remaining Apple Rejection Items (#4, #5, #6)

Goal: clear the last three App Review blockers before re-archiving and re-submitting to App Store Connect.

---

### Item 4 — Guideline 2.2 (Beta Testing / non-functional features)

Reviewers see routes or UI that aren't meant for the public 1.0 build. We'll hide them on native builds without deleting the web functionality.

- Add a small helper `isNative()` gate (already exists in `src/lib/nativeFeatures.ts`) and use it to conditionally hide these on iOS:
  - `/beta` — BetaInvite route (invite-only, looks broken to a reviewer without a code)
  - `/admin` — Admin dashboard route
  - `/become-affiliate`, `/affiliate-dashboard` — affiliate program (100-slot waitlist, reads as unfinished)
  - `/store-screenshots` — internal marketing tool
  - `/landing/a|b|c|d` — A/B marketing landing pages
- In `App.tsx`, wrap those `<Route>`s in a `!isNative &&` guard so on the iOS build they resolve to `NotFound`.
- Audit visible entry points that link to those routes (Header, Footer, MobileNav, Admin links) and hide the links on native.
- Remove/hide any "Coming Soon" chips or disabled tiles on the More panel and Home page for the native build.
- Verify `BetaFeedbackModal` never auto-opens for a plain reviewer account.

Deliverable: reviewer signing in with `appreview@northspan.com` sees only shipping features — no admin, beta, affiliate, or marketing routes.

---

### Item 5 — Guideline 2.1(b) (IAP products not found in binary)

Two independent fixes:

1. **Product ID alignment**
   - Confirm both product IDs in `src/lib/iap.ts` exactly match App Store Connect:
     - `wealth_perspective_lifetime` (non-consumable)
     - `wealth_perspective_mogul_cash` (consumable)
   - Confirm both products are attached to the app record in ASC and in **Ready to Submit** state, and that the current build (Build 1) has them selected under **In-App Purchases and Subscriptions → Add to this version**.

2. **RevenueCat / StoreKit wiring**
   - Fill in the real Android key (`goog_...`) in `src/lib/iap.ts` (currently `goog_REPLACE_ME`).
   - Ensure the iOS `REVENUECAT_IOS_API_KEY` matches what's in the RevenueCat dashboard for the same bundle ID `com.northspan.wealthperspective`.
   - In RevenueCat, confirm the Offering named `default` contains both products so `Purchases.getOfferings()` returns them.
   - Add a StoreKit Configuration file in Xcode (`Products.storekit`) mirroring the two product IDs so the reviewer/tester sees the sheet even before Apple finishes propagating.
   - Add a small "Restore Purchases" button on the paywall (Apple requires it for any non-consumable). We'll expose `restorePurchases()` from `src/lib/iap.ts` on `PaywallGate`.

Deliverable: tapping "Unlock Lifetime" in the native build opens the real StoreKit sheet, and Restore works.

---

### Item 6 — Guideline 2.3.7 (Screenshots mention price)

Current ASC screenshots include:
- Lifetime graphic: **"$9.99"**, **"one payment · yours forever"** (`captureLifetimePng` in `StoreScreenshots.tsx`)
- Testimonial cards referencing dollar amounts inside quotes (e.g., "$100k of pretend money", "in 4 seconds") — the money-in-quotes ones are OK (they're user testimonial context, not price claims), but we'll double-check.

Fixes in `src/pages/StoreScreenshots.tsx`:
- Replace the "$9.99" mega-price with a non-price hero line, e.g. **"One Payment"** / **"Yours Forever"** with subline "No subscriptions. Ever." — remove any dollar figure.
- Update the `LifetimeOfferGraphic` React preview to match (used for iPad export).
- Keep the 10 feature bullets; just strip the price.
- Regenerate the iPhone 6.5"/6.7", 5.5" (if used), and iPad 13" versions from `/store-screenshots`, then re-upload to ASC replacing screenshot #7 (Lifetime).
- Scan the other 10 screenshots visually and swap any that show a price ticker/badge.

Deliverable: no screenshot contains a dollar amount tied to app pricing.

---

### Sequencing

1. Ship code changes for #4 (route/link guards) and #6 (screenshot canvas edits) in one build.
2. Ship code changes for #5 (Android key, restore button, StoreKit file scaffolding) in the same commit if possible.
3. On your Mac: `git pull && npm i && npm run build && npx cap sync ios && npx cap open ios`.
4. Regenerate screenshots at `/store-screenshots` in a desktop browser, download the zip, re-upload the Lifetime frame in ASC.
5. In ASC → App Review → confirm both IAPs are attached to Build 1.
6. Bump build number in Xcode (Build 2), Archive → Upload → Submit for Review with a short "Response to Reviewer" note listing each guideline and what changed.

---

### Technical notes (details, skip if not needed)

- Native-only route gating pattern:
  ```tsx
  import { isNative } from '@/lib/nativeFeatures';
  const native = isNative();
  // ...
  {!native && <Route path="/admin" element={<Admin />} />}
  ```
- Restore button placement: `src/components/paywall/PaywallGate.tsx`, secondary button under primary CTA, only rendered when `isNativePlatform()`.
- StoreKit config file (`ios/App/App/Products.storekit`) is scaffolded via Xcode: File → New → File → StoreKit Configuration File, then in the scheme's Run → Options → StoreKit Configuration select it. Product IDs must match `LIFETIME_PRODUCT_ID` and `MOGUL_CASH_PRODUCT_ID`.
- No database migrations, no edge function changes, no design-token changes.
