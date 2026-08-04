# Re-export the IAP review screenshot at a valid iPhone size

The uploaded copy of the screenshot came through compressed to 884x1920, so it will not be used as the source. The full-resolution file already saved earlier (`iap-review-screenshot-1260x2736.png`) is the source instead.

## Size note

1260x2736 is not one of Apple's accepted App Store Connect sizes. The accepted 6.9"/6.7" portrait sizes are **1290x2796** and **1284x2778**. To avoid an upload rejection, the primary export will be 1290x2796.

## What will be produced

From the existing full-res source, all flattened RGB (no alpha), exactly 72 DPI, square corners:

1. `iap-review-screenshot-1290x2796.png` — primary, Apple 6.9"/6.7" portrait
2. `iap-review-screenshot-1290x2796.jpg` — same image as JPEG (quality 95), safest for ASC uploads
3. `iap-review-screenshot-1284x2778.png` — fallback size if ASC asks for the older 6.7" slot

Framing: scale the source to fill the target width and center it vertically, padding with the app's dark background (`#09090b`) if any gap remains, so nothing is cropped from the checkout content.

## Technical notes

- Pillow: `convert("RGB")` to drop alpha, `Image.LANCZOS` resampling, save with `dpi=(72, 72)`, PNG saved without an alpha channel and JPEG without transparency.
- Each output is opened and visually inspected before delivery to confirm dimensions, no clipped text, and no rounded corners or transparent edges.
- No app code changes; these are downloadable artifacts only.
