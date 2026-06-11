# Polish store screenshots

Four targeted fixes to `/store-screenshots`. No new components, no scope creep.

## 1. Dynamic Island covers "Wealth Perspective" header

The bezel's Dynamic Island sits over the app's top nav, hiding the "Wealth Perspective" wordmark on every screen.

Fix in `PhoneBezel.tsx`:
- Shrink the Dynamic Island (~22% of width instead of 34%, ~6% tall instead of 8.5%) so it reads as a notch, not a black bar across the header
- Add ~40px of top padding inside the inner screen so the app's header clears the island
- Keep the titanium ring and corner radii unchanged

## 2. Money rain overlaps Elon's photo and earnings in screenshot #1

Recapture `/profile/elon-musk` with the money-rain effect disabled (or scroll just past it) so the hero photo, name, and annual-earnings number are fully readable. The captured PNG (`01-earnings.png.asset.json`) gets replaced.

Implementation: navigate via `browser--view_preview`, append `?norain=1` style query OR scroll the page down ~120px so the ticker section — not the falling emoji — fills the frame, then re-screenshot and re-upload via `lovable-assets`.

## 3. "vandasdave" → "You" on the Compare frame

Screenshot #3 (`/compare`) currently shows the logged-in username "vandasdave" on the left side. Recapture with the salary/you side relabeled. Two options, will use whichever the live `/compare` page supports cleanly:
- Sign out before capture so the left card shows the generic "You" placeholder
- Or capture with a celebrity-vs-celebrity matchup (Bezos vs Oprah) where neither side shows the username

Replace `03-compare.png.asset.json` with the new capture.

## 4. HD clarity

Current captures are 390×844 (1× viewport) then upscaled into a 900px-wide bezel — they look soft. Recapture all 6 screens at 2× device pixel ratio:

- `browser--set_viewport_size` to 390×844
- Use `browser--screenshot` (which honors DPR); if needed, take full-page then crop
- Target output: 780×1688 PNG, which renders crisp inside the 900px bezel at retina export resolution (1290×2796 marketing frame)

All 6 `.asset.json` pointers get replaced with the higher-resolution PNGs.

## Files touched

- **edit** `src/components/marketing/PhoneBezel.tsx` — smaller island, inner top padding
- **replace** all 6 files in `src/assets/store-screens/*.asset.json` — re-captured at higher resolution, with money rain off (#1) and "You" label fixed (#3)
- No change to `StoreScreenshots.tsx` structure

## Workflow

1. Edit `PhoneBezel` first so re-captures are framed correctly
2. Re-capture all 6 screens in sequence at 390×844, retina
3. Upload each via `lovable-assets create` and overwrite the pointer JSONs
4. Verify visually at both iPhone 6.7" and Android sizes in the preview

## Note on auth

If `/mogul-markets`, `/celebrity-portfolios`, or `/compare` show login walls in the browser session, I'll pause and ask you to sign in (or sign out, for fix #3) in the preview before continuing.
