
# Apple Resubmission Plan — Round 2

Tackling all four rejection items plus the polish issues you flagged. Keep everything in one sequenced list so nothing gets dropped.

---

## 1. Guideline 2.1(a) — Login 404 bug (BLOCKER)

**Root cause:** Native OAuth (Apple/Google) sends the reviewer to `https://earningsexplorer.shop/auth/callback` via Universal Link. That path doesn't exist in the router (only `/auth`), so the site returns the SPA NotFound page — Apple sees a "404".

**Fix:**
- Add a real `/auth/callback` route that renders a small handler page. It waits for the Supabase session (populated either by the web hash tokens or by `NativeBootstrap` on device), then redirects to `/`.
- Keep the Universal Link path working (AASA file already lists `/auth/callback` and `/auth/*`).
- Add a graceful loading state so if the reviewer opens the URL in Safari it also resolves cleanly instead of 404.

## 2. Guideline 4.2 — Minimum functionality (BLOCKER)

Apple explicitly said push + share are not enough. Adding four native-only capabilities:

- **Biometric login (Face ID / Touch ID)** — install `capacitor-native-biometric`; after first successful password/OAuth login on native, offer "Enable Face ID". On subsequent launches show a Face ID prompt on the Auth screen to unlock the stored session.
- **Native Share Sheet** — replace web `navigator.share` fallbacks in celebrity/result share flows with `@capacitor/share` when `Capacitor.isNativePlatform()`.
- **Haptic feedback** — install `@capacitor/haptics`; fire light/medium/success/error haptics on: trade execute, favorite toggle, quiz answer submit, search result tap, sign-in success.
- **Home Screen Widget (iOS)** — scaffold a WidgetKit extension in the iOS project showing "Today's Celebrity Spotlight" (name + daily earning rate). Instructions to add the target in Xcode included in the plan doc; the widget reads a shared App Group value the app writes on each spotlight refresh.

## 3. Guideline 2.3.7 — Pricing in screenshots (BLOCKER)

- Remove screenshot slide 07 (`LifetimeOfferGraphic` + `LifetimeCanvasPreview`) entirely from `StoreScreenshots.tsx`.
- Also scrub any leftover "one-time", "no subscriptions", "risk-free", "+$20,000", "LIFETIME ACCESS" strings from remaining slides.
- You then regenerate the 6 remaining screenshots and re-upload them to App Store Connect.

## 4. Guideline 2.2 — Beta / incomplete features (BLOCKER)

Audit and cleanup on native builds:

- Hide the Beta Feedback modal trigger in `Header.tsx` on native (`Capacitor.isNativePlatform()`).
- Hide "Invite Friends" affiliate CTA on native if it references beta perks.
- Confirm Admin, Landing variants, Beta, Become-Affiliate, Affiliate-Dashboard, Store-Screenshots routes are already gated (they are) and also remove any nav links pointing at them from mobile menus / footer on native.
- Sweep `Header.tsx`, `Footer.tsx`, `MobileNav.tsx`, `Index.tsx` for links to those routes and wrap in `!isNative`.

---

## 5. Polish / low-hanging fruit

- **Overlapping text on iPhone 17 Pro Max** (Quiz + general lookup pages):
  - Audit Quiz question card, answer buttons, streak/timer badges, and profile hero on `Profile.tsx` for fixed widths / absolute positioning that collides at 402pt-wide safe area.
  - Convert offenders to flex/grid with `min-w-0`, `truncate`, `flex-wrap`, and responsive font sizes.
- **Inconsistent earnings when searching the same person twice:**
  - `get-celebrity-data` already runs Gemini at `temperature: 0`, but different prompt runs still drift because the AI recomputes net worth each call.
  - Fix: cache the AI response per celebrity in the existing `celebrities` table (or a `celebrity_earnings_cache` table) keyed by normalized name, with a TTL (e.g. 24h). Second lookup returns cached row, guaranteeing identical numbers within the window. Falls back to fresh AI call after TTL.

---

## Sequence of work

1. Screenshot cleanup (2.3.7) — code change only, you regenerate + re-upload.
2. `/auth/callback` route (2.1a).
3. Native features batch (4.2): biometrics, haptics, native share, widget scaffold.
4. Beta-surface sweep on native (2.2).
5. Overlapping-text audit on Quiz + Profile.
6. Earnings caching migration + edge function update.

After each block I'll pause so you can pull → `npm install` → `npx cap sync ios` → archive on your Mac and spot-check before moving on.

---

## Technical details

- New route: `src/pages/AuthCallback.tsx`; registered in `src/App.tsx` above the `*` catch-all.
- New deps: `capacitor-native-biometric`, `@capacitor/haptics`, `@capacitor/share`. All optional on web via `Capacitor.isNativePlatform()` guards.
- Widget: add a new Xcode target `WealthPerspectiveWidget` (WidgetKit, Swift). Shared App Group `group.com.northspan.wealthperspective`. App writes JSON via `Preferences` plugin (`@capacitor/preferences`) on daily spotlight refresh; widget reads it in its timeline provider. Manual Xcode step documented; no CocoaPods needed.
- Earnings cache: new `celebrity_earnings_cache` table (name_normalized text PK, payload jsonb, fetched_at timestamptz). GRANTs to authenticated + service_role, RLS with SELECT for authenticated. Edge function checks cache first, writes on miss.
- No changes to `capacitor.config.ts`, `AASA`, or Lovable Cloud auth URL allowlist (already correct).

Ready for your go-ahead to switch to build mode and start with block 1.
