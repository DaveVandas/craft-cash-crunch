Step 1 (publish) is done. Here's the rest:

## Step 2: Verify AASA is live

Run in your terminal:

```bash
curl -I https://earningsexplorer.shop/.well-known/apple-app-site-association
```

Expect `HTTP/2 200` with no redirect. Then confirm the body is valid JSON:

```bash
curl -s https://earningsexplorer.shop/.well-known/apple-app-site-association | jq .
```

You should see the `applinks` object with `97V3AR3HKS.com.northspan.wealthperspective` and the `/auth/*` paths.

Optional: Apple's CDN validator — https://app-site-association.cdn-apple.com/a/v1/earningsexplorer.shop (may take a few minutes to populate after first publish).

## Step 3: Add redirect URLs in Lovable Cloud

Open the backend and add both URLs to the auth redirect allow-list so the OAuth callback works from the native app:

- `https://earningsexplorer.shop/auth/callback`
- `wealthperspective://auth/callback` (custom scheme from `capacitor.config.ts`)

<presentation-actions>
<presentation-open-backend>View Backend</presentation-open-backend>
</presentation-actions>

Navigate to: Users → Authentication Settings → URL Configuration → Redirect URLs.

## Step 4: Sync and archive in Xcode

On your Mac, from the repo root:

```bash
git pull
npm install
npm run build
npx cap sync ios
npx cap open ios
```

In Xcode:
1. Select the `App` target → Signing & Capabilities → confirm Team = `97V3AR3HKS` and Bundle ID = `com.northspan.wealthperspective`.
2. Confirm the **Associated Domains** capability includes `applinks:earningsexplorer.shop`.
3. Set the scheme to `Any iOS Device (arm64)`.
4. Product → Archive → Distribute App → App Store Connect.

## After archiving

Once the build is processed in App Store Connect, test the Universal Link end-to-end: sign in via Google on the device, confirm the redirect opens the app (not Safari) and the session hydrates via `NativeBootstrap`.

## Technical notes

- The `apple-app-site-association` file at `public/.well-known/` ships with the static build, and Lovable hosting serves `.well-known/*` without a redirect and with `Content-Type: application/json` — no extra config needed.
- `NativeBootstrap.tsx` already handles both PKCE (`?code=`) and implicit (`#access_token=`) callbacks from `appUrlOpen`, so no code changes are required for Step 4.
- If the AASA fetch fails from Apple's CDN, the most common cause is a redirect (e.g. `http → https`) — the `curl -I` in Step 2 catches this.
