# Fix the overlapping "just $4.99" price line

The IAP reference image (`mogul-cash-iap-reference-1024x1024_v2.png`) has the small word "just" rendered on top of the large `$4.99`, so it's unreadable. This is a fix to the delivered image only — no app code changes.

## What will change

Repaint the price row inside the gold card:

1. Mask the current price line region with the card's background color (`#100d05`) so the collided text is fully cleared.
2. Redraw it as a single centered baseline-aligned row:
   - "just" in small white 72% opacity text
   - a clear gap
   - `$4.99` in the large gold (`#fbbf24`) bold face
   - the whole group centered as a unit inside the card
3. Leave everything else untouched — headline, `+$20,000`, subtitle, divider, "one-time · in-app purchase", benefit chips, footer brand.

Output saved as a new version, `mogul-cash-iap-reference-1024x1024_v3.png`, at the same 1024x1024 size, so the earlier files stay intact.

## Technical notes

- Done with Pillow in a throwaway script: crop-and-fill the price band, then measure both text runs with `ImageFont.getbbox` to compute a combined width and center the group, matching baselines rather than tops so "just" sits on the same line as `$4.99`.
- Uses a bold sans font matching the existing Arial-style rendering.
- The result will be rendered and visually inspected before delivery to confirm no clipping or residual overlap.
