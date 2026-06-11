## Goal

Add an 8th store-screenshot frame dedicated to the **Mogul Cash $20,000 pack** so the App Store IAP listing has its own catchy image (separate from the Lifetime paywall).

## Concept — "Stack the Deck"

A bold, gold-on-black hero card that reads like a money drop:

```
   UPGRADE YOUR BANKROLL
   Mogul Cash · Trade Bigger

   ┌────────────────────────────┐
   │                            │
   │        +$20,000            │   ← huge gold numerals
   │     virtual paper cash     │
   │                            │
   │   ─────────────────────    │
   │         just $4.99         │   ← price chip
   │     one-time · in-app      │
   └────────────────────────────┘

   💵💵💵  (subtle cash-stack motif)

   ✦ Instantly added to your portfolio
   ✦ Trade real-ticker stocks risk-free
   ✦ Simulation only — no real money

   [ Wealth Perspective logo ]
```

Same gold/amber luxury treatment as the Lifetime frame (radial glow, `#fbbf24` border, `#100d05` card, `#fde68a` heading) so the two IAP screenshots feel like a matched set without being identical.

## Implementation

All work in `src/pages/StoreScreenshots.tsx` only — copy-only/UI change, no backend.

1. **New screenshot entry** `08-mogul-cash` added to the `screenshots` array, after the Lifetime frame:
   - caption: `"Stack the Deck. Trade Bigger."`
   - subCaption: `"Add $20,000 in virtual paper cash"`
   - accent: `from-emerald-500 via-amber-400 to-yellow-600`
   - body: `<MogulCashOfferGraphic />` (on-screen preview component)

2. **New `MogulCashOfferGraphic`** — mirrors `LifetimeOfferGraphic`'s structure (hero card + 3 benefit chips) using the same Tailwind classes so the on-screen preview matches the export.

3. **New `captureMogulCashPng(dims)`** — built the same way as `captureLifetimePng`, since canvas export is what fixed the Lifetime download issue. Draws:
   - Dark `#09090b` background + two radial gold glows
   - Header: "UPGRADE YOUR BANKROLL" + tagline
   - Hero card (gold-bordered, dark fill): `+$20,000`, "virtual paper cash", divider, `$4.99`, "one-time · in-app purchase"
   - 3 benefit chips (instant credit / risk-free trading / simulation-only disclaimer)
   - Footer with app icon + "Wealth Perspective"

4. **`MogulCashCanvasPreview`** — same pattern as `LifetimeCanvasPreview` so the on-page preview renders from the canvas (guarantees download matches what you see).

5. **`capturePng` switch** — extend the existing `if (s.id === '07-lifetime')` short-circuit to also route `08-mogul-cash` to `captureMogulCashPng(dims)`.

6. **Preview renderer** — wherever `LifetimeCanvasPreview` is rendered for frame 7, render `MogulCashCanvasPreview` for frame 8.

## Output

After implementing, the `/store-screenshots` page will show a new 8th tile, downloadable at both 1290×2796 (iPhone) and 1080×1920 (Android), ready to upload as the screenshot for IAP Product B (Mogul Cash).

## Out of scope

- No changes to Stripe/IAP product config
- No changes to the Lifetime frame
- No new assets uploaded (all rendered procedurally on canvas, matching the Lifetime approach)
