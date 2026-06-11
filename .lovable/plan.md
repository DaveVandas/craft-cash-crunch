## Current state

The `/store-screenshots` page has no download button. The instructions tell you to open DevTools → right-click → "Capture node screenshot," which exports a PNG (not JPEG). That's tedious for 7 frames × 2 device sizes = 14 captures.

## Format question

Apple's App Store and Google Play both **require PNG or JPEG** for screenshots, but **PNG is strongly preferred** (lossless, no compression artifacts on gradients/text). I'll keep PNG as the default — JPEG would visibly degrade the gold gradients and white type.

## Plan

1. **Add a "Download PNG" button** under each frame on `/store-screenshots`.
2. **Render at full resolution for capture.** Use `html2canvas` (already installed) on a hidden full-size version of the frame (1290×2796 for iPhone, 1080×1920 for Android) so output matches store requirements exactly — no upscaling, no scale-transform blur.
3. **Filename convention:** `wealth-perspective_iphone-67_01-earnings.png` so they sort correctly when you drag the whole folder into App Store Connect.
4. **Add a "Download All" button** at the top that zips and downloads all 7 frames for the currently selected device size in one click. (Uses `jszip` — small add, ~30KB.)
5. Keep the on-screen scaled preview exactly as it is today.

## Technical notes

- `html2canvas` with `{ scale: 1, useCORS: true, backgroundColor: null }` against the unscaled DOM node.
- Render the unscaled capture node off-screen (`position: fixed; left: -99999px`) only while capturing, then remove — avoids layout shift and keeps the preview grid intact.
- One file touched: `src/pages/StoreScreenshots.tsx`. Add `jszip` via `bun add jszip`.
- No changes to `PhoneBezel.tsx` or the asset pipeline.
