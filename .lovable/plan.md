## Resize screenshots + add 3 testimonial graphics

### 1. Resize to Apple-required dimensions

The current iPhone size on `/store-screenshots` is `1290×2796`, which App Store Connect's 6.5" upload slot rejects. Change it to **1284×2778** (one of the 4 accepted sizes — visually identical, just 6px narrower / 18px shorter). All existing screenshots and the canvas-rendered Lifetime + Mogul Cash graphics scale via a `fit = w / 1290` ratio, so they will re-render correctly at the new size with no layout breakage.

Edit in `src/pages/StoreScreenshots.tsx`:

```ts
'iphone-67': { w: 1284, h: 2778, label: 'iPhone 6.5"/6.7" (1284×2778)' }
```

### 2. Add 3 testimonial graphics (slots 09, 10, 11)

Three new entries in the `screenshots` array, each rendered with the same gold-gradient frame, app-icon footer, and headline/sub-caption styling already used by the existing 8 frames — so the testimonial cards drop into the install sheet feeling like one continuous brand story.

Each card shows:

- ⭐⭐⭐⭐⭐ five-star row (gold, large)
- A short, punchy headline quote (e.g. "Finally gets it.")
- 2–3 line review body (entertaining, on-brand voice)
- Reviewer name + city + "Verified Lifetime Member" badge
- Same gold-bordered card-on-black aesthetic as the Lifetime panel

Proposed copy (App Store guidelines allow stylized testimonials as marketing content — keep them realistic, no fake "Apple Editor" branding):

**Testimonial 1 — "Reality Check Hit Different"**
> "I plugged in my salary expecting a chuckle. I got therapy. Brutal Mode should come with a hug."
> — Marcus T., Austin TX

**Testimonial 2 — "Bezos Earned My Rent in 4 Seconds"**
> "Watching the earnings ticker on a billionaire is somehow more entertaining than Netflix. And weirdly educational."
> — Priya S., Brooklyn NY

**Testimonial 3 — "Paper Trading Made Me Brave"**
> "Mirrored a VIP portfolio with $100k of pretend money. Lost beautifully. Learned everything. Now I actually understand the market."
> — Jordan K., Denver CO

Each renders as a new `Screenshot` entry with a `body: <TestimonialGraphic .../>` component. One reusable React component takes `{ stars, quote, byline }` props.

### 3. Render approach

Add a new `TestimonialGraphic` component near `LifetimeOfferGraphic` in the same file. Uses the same outer wrapper, gold border, and black background so the rendering pipeline (html2canvas capture / ZIP download) requires zero changes.

### Files touched

- `src/pages/StoreScreenshots.tsx` — change `SIZES`, add `TestimonialGraphic`, add 3 entries to the `screenshots` array.

### What you'll do after

Recapture all 11 frames from `/store-screenshots` at the new 1284×2778 size and upload the strongest 10 (Apple's max) to App Store Connect. I recommend keeping all 6 product screens + Lifetime + 3 testimonials = 10 exact.

### Out of scope

Actual App Preview videos. Those require screen-recording from a real iPhone with Xcode — handled later on the Mac, not here.