# Real App Screenshots in iPhone Bezels

Rebuild `/store-screenshots` so each of the 6 marketing frames showcases a **real screenshot of the live app** inside a clean iPhone-style bezel, on the existing gold-gradient background with headline + sub-caption + brand footer.

## What changes

### 1. Capture 6 real app screens
Use `browser--view_preview` at iPhone viewport (390 × 844) on these routes, then `browser--screenshot` each:

| # | Frame | Route captured |
|---|---|---|
| 1 | Real-time celeb earnings | `/profile/elon-musk` (ticker mid-tick) |
| 2 | Reality Check | `/calculator` with $65,000 entered → result |
| 3 | Compare head-to-head | `/compare` with Bezos vs Oprah loaded |
| 4 | Trade Like a Mogul | `/mogul-markets` portfolio view |
| 5 | VIP Portfolios | `/celebrity-portfolios` |
| 6 | Wealth IQ Quiz | `/quiz` mid-question with streak |

Each PNG gets uploaded via `lovable-assets` CLI → `.asset.json` pointers stored in `src/assets/store-screens/`.

### 2. New `<PhoneBezel>` component
A pure-CSS iPhone 15 Pro frame:
- Thin (~14 px scaled) titanium-gray border
- 60 px outer corner radius, 48 px inner
- Pill-shaped Dynamic Island centered at top
- Subtle inner highlight + outer drop shadow (gold-tinted to match brand)
- Accepts `src` prop, renders the screenshot inside cropped to the inner frame

### 3. Replace the 6 illustrated bodies
In `StoreScreenshots.tsx`, swap each `body` JSX for `<PhoneBezel src={…} />`. Keep:
- Gold gradient backgrounds + ambient glow
- Headlines and sub-captions (already approved copy)
- "Wealth Perspective" footer brand mark
- 1290×2796 (iPhone) and 1080×1920 (Android) export dimensions
- Existing 1/3-scale preview grid

The 7th "Lifetime Access" frame keeps its illustrated treatment (no app screen to show — it's a pricing card).

## Technical details

```text
┌─ Gold gradient card 1290×2796 ──┐
│  Headline (7xl black white)     │
│  Sub-caption (3xl white/70)     │
│                                 │
│      ┌──────────────────┐       │
│      │ ▔▔▔ Island ▔▔▔   │       │ ← PhoneBezel
│      │                  │       │   ~900px wide
│      │   real app PNG   │       │   ~1900px tall
│      │   (390×844 src)  │       │   centered
│      │                  │       │
│      └──────────────────┘       │
│                                 │
│  [icon] Wealth Perspective      │
└─────────────────────────────────┘
```

Bezel implementation: nested divs — outer `bg-zinc-800` ring, inner `bg-black` mask, `<img>` filling inner, absolutely-positioned Dynamic Island pill. No external assets needed for the frame itself.

## Files touched

- **new** `src/components/marketing/PhoneBezel.tsx`
- **new** `src/assets/store-screens/01-earnings.png.asset.json` … `06-quiz.png.asset.json` (6 files, uploaded via CLI)
- **edit** `src/pages/StoreScreenshots.tsx` — replace 6 `body` blocks with `<PhoneBezel>` calls

## Workflow

1. Build `PhoneBezel` component first
2. Capture all 6 screens via browser tool, save to `/tmp/`, upload each via `lovable-assets create`
3. Wire pointers into `StoreScreenshots.tsx`
4. Verify visually in preview at both iPhone and Android sizes

## Notes

- If a screen requires login (e.g. `/mogul-markets`) and the session isn't authenticated in the browser tool, I'll pause and ask you to sign in in the preview first.
- The 7th Lifetime Access frame stays illustrated since it's a pricing/value summary, not a UI showcase.
- Capture instructions in the footer get updated to reflect the new "Capture node screenshot" target.
