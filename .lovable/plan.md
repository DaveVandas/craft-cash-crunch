# Fix "Buy Cash" doing nothing

## What's happening

The Buy Cash button is wired up — it does call the backend — but the request is blocked by the browser before it ever reaches Stripe.

Verified from here: the backend function only accepts requests from `earningsexplorer.shop`, `www.earningsexplorer.shop`, `localhost`, and `*.lovable.app`. The Lovable preview you're testing in runs on `*.lovableproject.com`, which is not on that list, so the browser rejects the response and the click silently fails ("Failed to fetch" in the network log).

This affects the published site's preview/testing surfaces and any other Lovable preview domain — the same origin list is copied into 16 backend functions, so several other features (access checks, search counting, stock data, guest sessions) fail the same way in preview.

## Fix

1. Add the preview domain pattern (`*.lovableproject.com`, plus `*.sandbox.lovable.dev`) to the allowed-origins check in all 16 functions that use it, keeping the existing production domains intact.
2. Move that check into one shared helper so the list lives in a single place instead of being duplicated per function, and update each function to import it.
3. Redeploy the affected functions.
4. Re-test Buy Cash end to end: click → Stripe checkout opens.

## Also worth fixing in the same pass

- The checkout URL is opened with `window.open(...)` after an async call, which some browsers block as a popup. Switch to navigating the current tab (or opening the tab synchronously) so the checkout reliably appears even when popups are restricted.
- On native (iOS), the button routes to in-app purchase instead of Stripe — that path is unchanged by this fix.

## Technical details

- Files: `supabase/functions/*/index.ts` (16 functions with a local `ALLOWED_ORIGINS` / `getCorsHeaders`), new `supabase/functions/_shared/cors.ts`, and `src/pages/MogulMarkets.tsx` for the popup handling.
- Origin match becomes: exact match against the production/localhost list, or hostname ending in `.lovable.app`, `.lovableproject.com`, or `.sandbox.lovable.dev`.
- No database or schema changes; no changes to Stripe products or price IDs.
