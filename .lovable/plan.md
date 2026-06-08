# Wealth Perspective — Full Store Submission Playbook

This is the complete, ordered path from where you are right now (Apple Dev + Google Play accounts live, RevenueCat account created, iOS App Store Connect API key being uploaded) to **live in both stores**. Each phase lists exactly what you do, what I do in code, and every ID/key that has to flow between systems.

---

## Master ID reference (keep this open while you work)

These must match **exactly** across every system. Copy this block somewhere safe.

| Item | Value | Used in |
|---|---|---|
| iOS Bundle ID | `com.northspan.wealthperspective` | Apple Dev portal, App Store Connect, RevenueCat iOS app, `capacitor.config.ts` |
| Android Package Name | `com.northspan.wealthperspective` | Play Console, RevenueCat Android app, `capacitor.config.ts` |
| Lifetime Product ID | `wealth_perspective_lifetime` | App Store Connect IAP, Play Console IAP, RevenueCat product, `src/lib/iap.ts` |
| Mogul Cash Product ID | `wealth_perspective_mogul_cash` | App Store Connect IAP, Play Console IAP, RevenueCat product, `src/lib/iap.ts` |
| RevenueCat Entitlement ID | `lifetime` | RevenueCat entitlement, `src/lib/iap.ts` |
| Lifetime price (native) | $9.99 USD | App Store Connect, Play Console |
| Mogul Cash price (native) | $4.99 USD | App Store Connect, Play Console |

---

## Phase 0 — What's already done ✅

- Apple Developer account ($99/yr) — active
- Google Play Console account ($25 one-time) — active
- RevenueCat account + project created
- RevenueCat iOS app entry created with Bundle ID `com.northspan.wealthperspective`
- App Store Connect API key (`.p8` + Key ID + Issuer ID) being uploaded to RevenueCat right now
- `capacitor.config.ts` already uses the correct Bundle ID
- Codebase already has: `src/lib/iap.ts` (RevenueCat wrapper), `verify-iap` edge function, `PaywallGate` with Restore Purchases button, Delete Account dialog, paper-trading disclaimer splash, Privacy + Terms pages

---

## Phase 1 — Finish RevenueCat iOS setup (you, ~10 min, today)

1. Confirm App Store Server API shows **Connected** (green) in RevenueCat after the `.p8` upload.
2. In RevenueCat → **Project Settings → API keys**, copy the **public iOS SDK key** (starts with `appl_`). Save it — I need it in Phase 4.
3. In RevenueCat → **Entitlements**, create one entitlement:
   - Identifier: `lifetime`
   - Display name: Lifetime Access
4. Leave Products empty for now — we create them in App Store Connect first (Phase 2), then attach them here in Phase 3.

---

## Phase 2 — Create the iOS app + products in App Store Connect (you, ~30 min)

### 2a. Register the Bundle ID (Apple Developer portal)
1. https://developer.apple.com → **Certificates, IDs & Profiles → Identifiers → +**
2. Select **App IDs → App**
3. Description: `Wealth Perspective`
4. Bundle ID: **Explicit** → `com.northspan.wealthperspective`
5. Capabilities: enable **In-App Purchase** (and Sign in with Apple if you want it later)
6. Register.

### 2b. Create the app listing (App Store Connect)
1. https://appstoreconnect.apple.com → **My Apps → +** → New App
2. Platform: iOS · Name: `Wealth Perspective` · Primary Language: English (U.S.) · Bundle ID: pick the one you just registered · SKU: `wealth-perspective-001` · Full Access
3. Under **App Information**: Category = Finance · Secondary = Lifestyle · Content Rights filled · Age Rating questionnaire (likely 17+ for simulated trading)

### 2c. Create In-App Purchases
**Lifetime** (non-consumable):
- Reference Name: `Wealth Perspective Lifetime`
- Product ID: **`wealth_perspective_lifetime`** ← must match exactly
- Price: Tier 10 ($9.99)
- Localization (English): Display Name `Lifetime Access`, Description `One-time payment for unlimited access to all features, forever.`
- Review screenshot: a 640×920+ PNG of the paywall (I'll generate one in Phase 5)

**Mogul Cash** (consumable):
- Reference Name: `Mogul Cash Pack`
- Product ID: **`wealth_perspective_mogul_cash`**
- Price: Tier 5 ($4.99)
- Display Name `$20,000 Mogul Cash`, Description `Adds $20,000 of virtual paper-trading cash to your portfolio.`

Both IAPs start in **"Ready to Submit"** state. They get reviewed alongside the first app build.

### 2d. Paid Apps Agreement
**App Store Connect → Agreements, Tax, and Banking** → sign the Paid Apps agreement, fill bank + tax info. **Apple will not let IAPs go live without this.** Allow 24–48h to clear.

---

## Phase 3 — Wire products into RevenueCat iOS (you, ~5 min)

Back in RevenueCat:
1. **Products → + New** → Identifier `wealth_perspective_lifetime` → Store: App Store → attach to entitlement `lifetime`
2. **Products → + New** → `wealth_perspective_mogul_cash` → App Store → no entitlement (it's a consumable, handled by webhook crediting cash)
3. **Offerings → Current** → add a package called `lifetime` containing the lifetime product

---

## Phase 4 — Code work I'll do (build mode, ~15 min once you give me the keys)

When you switch me to build mode and paste the two public SDK keys, I will:

1. **Paste iOS + Android SDK keys** into `src/lib/iap.ts` (replacing the `appl_REPLACE_ME` / `goog_REPLACE_ME` placeholders). These are publishable keys — safe to ship in the client bundle.
2. **Add the `REVENUECAT_WEBHOOK_SECRET`** secret via the secrets tool (you'll enter a random string; I'll paste the same string into RevenueCat → Integrations → Webhooks).
3. **Configure the RevenueCat webhook URL** for you to paste in:
   `https://gzhrgnoowzhifpbnnevp.supabase.co/functions/v1/verify-iap`
   Authorization header: `Bearer <REVENUECAT_WEBHOOK_SECRET>`
4. **Verify** `initIAP()` is called after sign-in (it already is in `AuthContext`), and the **Restore Purchases** button on `PaywallGate` is wired (it is).
5. **Test the webhook** by sending a RevenueCat test event and confirming `user_access.has_lifetime_access` flips to `true`.

No other code changes are required for IAP to work.

---

## Phase 5 — Marketing assets (parallel with Phase 6)

Required before submission:

| Asset | Spec | Source |
|---|---|---|
| App icon | 1024×1024 PNG, no transparency | I'll generate from your gold-crown brand |
| iPhone 6.7" screenshots | 1290×2796, 3–10 images | `/StoreScreenshots` page already exists — capture from preview |
| iPhone 6.5" screenshots | 1242×2688 | Same |
| iPad screenshots | 2048×2732 (optional but recommended) | Same |
| Feature graphic (Android) | 1024×500 | I'll generate |
| Android phone screenshots | 1080×1920+, min 2 | Same source as iOS |

Tell me **"generate store assets"** in build mode and I'll produce all of them.

---

## Phase 6 — Local native build (you, on your Mac, ~30 min first time)

Lovable's sandbox can't sign native binaries. On your Mac:
```bash
git pull
npm install
npx cap add ios
npx cap add android
npm run build
npx cap sync
npx cap open ios     # launches Xcode
```
In Xcode:
1. Select the `App` target → **Signing & Capabilities** → Team: your Apple Dev team → Bundle ID auto-fills `com.northspan.wealthperspective`
2. Enable **In-App Purchase** capability
3. Bump Build number to `1`, Version `1.0.0`
4. **Product → Archive** → Distribute App → **App Store Connect → Upload**

After ~15 min processing, the build appears in App Store Connect → TestFlight.

---

## Phase 7 — TestFlight (you, ~1 day)

1. App Store Connect → **TestFlight** → add yourself as Internal Tester
2. Install TestFlight on your iPhone, accept invite, install build
3. Verify: sign in, hit paywall, tap **Get Lifetime Access** → Apple sandbox purchase sheet appears → complete with sandbox account → `has_lifetime_access` flips → paywall disappears
4. Test **Restore Purchases** by deleting + reinstalling
5. Test consumable: buy Mogul Cash → portfolio gains $20,000

If anything breaks, RevenueCat → Customers shows the live event trail.

---

## Phase 8 — Submit iOS for review (you, ~5 min, then Apple ~24–48h)

App Store Connect → app listing:
1. Fill: description, keywords, support URL (`https://earningsexplorer.shop`), marketing URL, privacy policy URL (`https://earningsexplorer.shop/privacy`)
2. Upload screenshots from Phase 5
3. Attach the TestFlight build to the version
4. **Attach both IAPs** to this version (checkbox on each IAP)
5. **App Privacy** section — declare: Email, User ID, Purchase History, Usage Data; explicitly mark Financial Info (salary) as **not collected** (matches our memory)
6. Sign-in info for reviewer: create a test account, paste credentials in **App Review Information**
7. Submit for Review

---

## Phase 9 — Google Play setup (you, ~45 min, can run in parallel with Phase 7)

### 9a. Create the app
Play Console → **Create app** → Name: Wealth Perspective · Default language: en-US · App · Free · accept declarations

### 9b. Service account for RevenueCat (Android equivalent of the `.p8`)
1. https://console.cloud.google.com → create project `wealth-perspective-iap`
2. Enable **Google Play Android Developer API**
3. **IAM → Service Accounts → Create** → name `revenuecat-iap` → role: none at GCP level → Done
4. On the new service account: **Keys → Add Key → JSON** → downloads a `.json` file (treat like the `.p8` — never paste contents in chat)
5. Copy the service account **email** (e.g. `revenuecat-iap@...iam.gserviceaccount.com`)
6. Play Console → **Users and permissions → Invite new user** → paste that email → grant: View app information, Manage orders, Manage store presence, **Financial data**
7. RevenueCat → Apps → + → Google Play → Package: `com.northspan.wealthperspective` → upload the `.json`

### 9c. Create Play IAPs
Play Console → your app → **Monetize → In-app products**:
- `wealth_perspective_lifetime` — managed product — $9.99 — Active
- `wealth_perspective_mogul_cash` — managed product — $4.99 — Active

### 9d. Wire into RevenueCat Android
Same as Phase 3 but for Play Store; reuse the same `lifetime` entitlement and `lifetime` offering package.

---

## Phase 10 — Android build + Internal Testing (you, ~30 min)

```bash
npx cap open android   # launches Android Studio
```
In Android Studio:
1. **Build → Generate Signed Bundle / APK → Android App Bundle**
2. Create a new keystore (save the `.jks` + passwords somewhere safe — losing them locks you out of updates forever)
3. Build release `.aab`
4. Play Console → **Testing → Internal testing → Create new release** → upload `.aab` → add yourself to testers → publish

Install via the internal testing link on an Android device, repeat the Phase 7 purchase tests.

---

## Phase 11 — Submit Android for review (you, ~10 min, Google ~1–7 days)

Play Console required sections (all must be green):
- **App content**: privacy policy URL, ads (No), app access (test account), content rating questionnaire, target audience (18+), news (No), COVID-19 (No), data safety (mirror iOS disclosures), government app (No), financial features (declare *informational only, no real-money trading*)
- **Main store listing**: short desc, full desc, icon (512×512), feature graphic (1024×500), screenshots
- Promote Internal release → **Production**

---

## Phase 12 — Post-launch checklist

- Monitor RevenueCat → Customers for failed purchases
- Monitor `verify-iap` edge function logs for webhook errors
- Apple disbursement: ~33 days after first sale (monthly)
- Google disbursement: ~15th of next month
- Both stores require app updates at least every ~12 months to stay listed

---

## What I need from you to start Phase 4

1. RevenueCat **iOS public SDK key** (`appl_...`)
2. RevenueCat **Android public SDK key** (`goog_...`) — you'll have this after Phase 9b
3. A random strong string you want to use as `REVENUECAT_WEBHOOK_SECRET` (or let me generate one)

You can give me #1 now (Phase 4 partial — iOS only), and #2 + #3 later after Phase 9. Or wait and do Phase 4 once for both platforms. Your call.

Switch me to build mode whenever you're ready and tell me which path you want.
