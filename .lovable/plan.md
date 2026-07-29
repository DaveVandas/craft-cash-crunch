# Apple Resubmission Plan — Round 3 (Build 5)

Four items from the July 28 review. Two are App Store Connect metadata fixes, two need code changes.

---

## 1. Guideline 2.1(b) — In-App Purchases not submitted (ASC only)

Apple could not see the IAPs because each product needs an **App Review Screenshot** attached before it can be submitted. This is a per-product image, separate from the app screenshots.

Steps in App Store Connect:
1. Monetization → In-App Purchases → **Lifetime Access**.
2. Scroll to **App Review Information** → **Screenshot** → upload a 640x920 (or larger) image showing the purchase screen inside the app.
3. Fill the **Review Notes** field (e.g. "Tap the Unlock Lifetime Access button on the paywall to trigger this purchase").
4. Save. Status should move from "Missing Metadata" to **Ready to Submit**.
5. Repeat for **Mogul Cash**.
6. On the iOS App 1.0 version page → **In-App Purchases and Subscriptions** → **+** → add both products so they show the blue "added for review" banner.
7. Apple also asks for a **new binary** with this fix — Build 5 from item 3/4 below covers that.

I can generate the two review screenshots as images if you want them produced from the app's paywall and Mogul Cash purchase screens.

## 2. Guideline 1.5 — Support URL (code + ASC)

The root domain is a marketing/app home page, not a support page.

- Add a new public route `/support` with: what the app does, a "Contact Support" section with the wealthperspective@earningsexplorer.shop address, an FAQ block (account, purchases, restore purchases, data accuracy, account deletion), and links to Privacy, Terms, and Delete Account.
- Link it from the footer and from the native app's menu.
- In App Store Connect → App Information → **Support URL**, set `https://earningsexplorer.shop/support`.

## 3. Guideline 2.1(a) — Error page after tapping Sign in with Apple / Google

Current native flow sends the OAuth redirect to `https://earningsexplorer.shop/auth/callback` through the hosted broker. On a device this leaves the app, and the reviewer landed on an error page. The exact broker response has not been captured, so the plan replaces the fragile path rather than guessing at a one-line fix.

Change to native-first sign-in on iOS:
- **Apple:** use the native Sign in with Apple sheet (`@capacitor-community/apple-sign-in`) and pass the returned identity token to `supabase.auth.signInWithIdToken({ provider: 'apple', token })`. No browser hop, no redirect URL, cannot 404.
- **Google:** use the native Google credential flow and the same `signInWithIdToken` path with `provider: 'google'`.
- Keep the existing web (`lovable.auth.signInWithOAuth`) path unchanged for browser/PWA users; branch on `Capacitor.isNativePlatform()`.
- Add a visible in-app error state instead of a silent navigation if a token exchange fails.
- Keep `/auth/callback` in place as a safety net for web.

Also required in Xcode (I will list the clicks when we get there): enable the **Sign in with Apple** capability on the App target, and add the reversed Google client ID URL scheme to Info.plist.

## 4. Guideline 4.2 — Minimum functionality

Push, share, and haptics were not enough. Add native capabilities that are impossible in a browser:

- **Offline mode:** persist last-viewed celebrity profiles, favorites, and the paper-trading portfolio to native storage (`@capacitor/preferences`) and render them with an offline banner when the device has no connection (`@capacitor/network`).
- **Home Screen quick actions:** long-press the icon for Search, Reality Check, and Mogul Markets (`@capacitor/app` + Info.plist `UIApplicationShortcutItems`).
- **Face ID gate on the portfolio:** extend the existing biometric helper so Mogul Markets requires a biometric unlock when enabled.
- **Native price alerts:** let the user set a target price on a watched stock and fire a scheduled local notification when the app next refreshes — a real on-device notification loop, not just a marketing blast.
- **iPad layout pass:** two-column layout on regular-width devices for the home, profile, and Mogul Markets screens, since the reviewer explicitly called out iPad expectations.
- **Native share sheet with generated image:** keep the existing share cards but route them through the native share sheet with the rendered PNG file rather than a URL only.

## 5. Rebuild and resubmit

1. Sync Lovable → GitHub, then on the Mac: `git pull origin main`, `npm install`, `npx cap sync ios`.
2. Xcode: bump Build to **5**, add the Sign in with Apple capability, Clean Build Folder, Archive, Distribute.
3. In App Store Connect: select Build 5, confirm both IAPs are attached, confirm the Support URL, refresh the demo video if the sign-in UI changed, then **Resubmit to App Review**.

---

## Technical notes

- New packages: `@capacitor-community/apple-sign-in`, `@codetrix-studio/capacitor-google-auth` (or the Google Identity native plugin), `@capacitor/preferences`, `@capacitor/network`.
- Auth branching lives in `src/pages/Auth.tsx`'s `SocialAuthButtons`; the web path through `src/integrations/lovable/index.ts` is untouched.
- Offline cache is a thin wrapper in `src/lib/offlineCache.ts` used by `useCelebrityData`, `useFavorites`, and `useTradingPortfolio`.
- `/support` is a static React page — no backend or schema changes.
- No database migrations are required for any item in this plan.

## Suggested order

1 and 2 first (fast, unblock the metadata), then 3, then 4, then the Build 5 rebuild.
