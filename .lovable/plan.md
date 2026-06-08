# App Store + Play Store Submission Plan

Now that your Apple Developer and Google Play Console accounts are live, here's the end-to-end path to get **Wealth Perspective** into both stores. I'll break it into the work that happens on your machine, the work that happens in the store consoles, and the (small amount of) work that happens in this codebase.

---

## Phase 1 — Local build environment (one-time setup)

Both iOS and Android require building the native shell on your own machine — Lovable's sandbox can't produce the signed binaries.

- **iOS** — A Mac with the latest **Xcode** installed, plus your Apple Developer account signed in inside Xcode.
- **Android** — **Android Studio** installed (any OS). Java/Gradle come bundled.
- Pull the latest project from your GitHub repo, then run:
  ```
  npm install
  npx cap add ios
  npx cap add android
  npm run build
  npx cap sync
  ```

## Phase 2 — Apple App Store (TestFlight → Review)

1. **App Store Connect → My Apps → New App**
   - Bundle ID: `app.lovable.86ba53150e8e45d49ce2019ca156c207` (matches `capacitor.config.ts`)
   - Name: Wealth Perspective
   - Primary language, SKU, and Northspan Industries LLC as the seller
2. **In-App Purchase setup** — Create the **Lifetime Access** non-consumable at **$9.99**, and the **Mogul Cash Pack** consumable at **$4.99**. (Apple requires IAP for digital goods — Stripe is not allowed in the iOS build.) We'll wire RevenueCat to these next.
3. **App metadata** — description, keywords, support URL (earningsexplorer.shop), privacy policy URL, marketing URL, age rating (likely 17+ due to financial/simulated trading content), category: Finance.
4. **Required assets** — App icon (1024×1024), screenshots for 6.7", 6.5", and 5.5" iPhone sizes, optional iPad screenshots, preview video (optional).
5. **Privacy nutrition label** — declare: email, user ID, purchase history, usage data; confirm salary inputs are *not* collected/stored (matches our memory).
6. **Archive & upload** from Xcode → submit to **TestFlight** first → invite internal testers → then submit for App Review.

## Phase 3 — Google Play Store (Internal Testing → Production)

1. **Play Console → Create app**
   - Package name: `app.lovable.86ba53150e8e45d49ce2019ca156c207`
   - Default language, app/game = App, free with in-app purchases
2. **In-App Products** — Create matching SKUs for Lifetime Access ($9.99) and Mogul Cash Pack ($4.99) as managed products.
3. **Store listing** — short description, full description, app icon (512×512), feature graphic (1024×500), phone screenshots (min 2), 7" and 10" tablet screenshots (optional).
4. **Content rating questionnaire**, **Data safety form** (mirror Apple's privacy disclosures), **Target audience** (18+), **Ads declaration** (no ads).
5. **App access** — provide a test login so reviewers can reach gated features.
6. **Generate signed AAB** in Android Studio → upload to **Internal Testing** track → promote to Closed → Open → Production.

## Phase 4 — Code changes needed in this project

These are the only code-side items required before submission:

1. **RevenueCat integration for IAP** — Currently `initiatePayment()` on native shows a "coming soon" toast. We need to:
   - Install `@revenuecat/purchases-capacitor`
   - Add RevenueCat API keys (iOS + Android) as secrets
   - Wire purchase + restore-purchases flows
   - Add a `verify-iap` edge function to grant lifetime access in `profiles`/`user_access` on successful purchase
2. **"Restore Purchases" button** — Apple requires this on any screen offering IAP.
3. **Account deletion in-app** — Already implemented via `DeleteAccountDialog` ✅ (Apple requirement met).
4. **Paper-trading disclaimer splash on first launch** — Already implemented ✅.
5. **Privacy policy + Terms URLs** — Already live on `/privacy` and `/terms` ✅.
6. **App icons & splash screens** — Generate from a 1024×1024 master into `ios/App/App/Assets.xcassets` and `android/app/src/main/res/` (Capacitor Assets plugin handles this).

## Phase 5 — Submission order I recommend

1. Wire RevenueCat + restore purchases (code work — I can do this next).
2. Build & ship to **TestFlight** and **Play Internal Testing** simultaneously — both let you iterate without a full review.
3. Fix anything testers find, then submit both for full review the same week.
4. Apple review averages 24–48 hours; Google averages 1–7 days for a first submission.

---

## Decisions I need from you before building

1. **Do you want me to wire up RevenueCat now?** (Required for IAP — without it, the native apps can't accept payment, which means Apple will reject the build.)
2. **App icon** — do you want to keep the current web favicon design scaled up, or generate a new high-res icon for the stores?
3. **Screenshots** — do you want me to design polished marketing screenshots (with captions/overlays), or just use raw device captures?
4. **Submission timing** — submit to TestFlight/Internal as soon as RevenueCat is wired, or wait until icons/screenshots/marketing assets are also finalized?

Once you answer these I'll switch to build mode and start with whichever piece you want first.
