# iOS Launch Day Checklist — Wealth Perspective

A complete, ordered guide to take you from "code in Lovable" → "build in App Store Connect → Submitted for Review." Includes both Codemagic (recommended) and MacInCloud (backup) paths. The only code change required is a pre-flight edit to `capacitor.config.ts`.

---

## Part 1: Pre-Flight (do these once, in order)

### Step A — Export Lovable to GitHub (15 min)
1. In Lovable, click the **+** menu (bottom-left of chat) → **GitHub** → **Connect project**
2. Authorize the Lovable GitHub App on GitHub when prompted
3. Pick your GitHub account (create a free one at github.com if you don't have one)
4. Click **Create Repository** — name it something like `wealth-perspective`
5. Done. Every Lovable change now auto-pushes to that repo.

### Step B — Code change: comment out the dev server URL (5 min)
This is the ONLY code change required before submission. Currently `capacitor.config.ts` points the native app at the Lovable preview URL for hot-reload during development. For production, the app must load from the bundled assets, not from the sandbox.

I'll make this change for you in build mode. It involves commenting out (not deleting) the `server.url` block in `capacitor.config.ts` so it's easy to re-enable for future dev work.

### Step C — Apple Developer prerequisites (already done)
- Apple Developer account active ✅
- App ID / Bundle ID created in App Store Connect: `app.lovable.86ba53150e8e45d49ce2019ca156c207` ✅
- App record created in App Store Connect with metadata, screenshots, IAPs configured ✅

---

## Part 2A: Recommended Path — Codemagic (no Mac needed)

### Step 1 — Sign up (5 min)
- Go to codemagic.io → Sign up with GitHub
- Authorize Codemagic to read your `wealth-perspective` repo

### Step 2 — Add the app (5 min)
- Click **Add application** → pick `wealth-perspective` → choose **Capacitor** as the project type
- Codemagic auto-detects iOS and Android targets

### Step 3 — Connect Apple Developer (15 min)
- In Codemagic: **Teams → Personal account → Integrations → Developer Portal**
- Sign in with your Apple ID
- Codemagic generates and stores the signing certificate + provisioning profile automatically (it uses Apple's API key flow — you'll create one App Store Connect API Key at appstoreconnect.apple.com → Users and Access → Keys → "+", with Admin role, download the `.p8` file, paste into Codemagic)

### Step 4 — Configure the iOS workflow (10 min)
- In your app's Codemagic settings, pick the **iOS workflow** template
- Set:
  - Bundle identifier: `app.lovable.86ba53150e8e45d49ce2019ca156c207`
  - Build for distribution: **App Store**
  - Automatic code signing: **ON**
  - Publishing: **App Store Connect → enabled**
- Save

### Step 5 — Start build (1 click, ~25 min wait)
- Click **Start new build → iOS workflow**
- Codemagic clones from GitHub, runs `npm install`, `npm run build`, `npx cap sync ios`, archives the iOS app, signs it, and uploads to App Store Connect
- You'll get an email when complete

### Step 6 — Attach build in App Store Connect (5 min)
- Log into App Store Connect → your app → **TestFlight → Builds** — confirm build appears (takes 15-30 min after Codemagic finishes for Apple to process)
- Go to **App Store → 1.0 Prepare for Submission** → scroll to **Build** section → click **+** → select the build → Save
- Click **Add for Review** → **Submit for Review**

### Step 7 — Wait for review (24-72 hours typically)
- Apple emails you the result
- If approved: choose manual release or automatic
- If rejected: read the reviewer notes, fix the issue, resubmit (often a 1-line fix and another Codemagic build)

**Total time, first launch: ~2-3 hours active work + 25 min build + 1-3 days review.**

---

## Part 2B: Backup Path — MacInCloud + Xcode

Use only if Codemagic doesn't work for you or you want hands-on control.

### Step 1 — Rent a Mac (10 min)
- macincloud.com → **Managed Server** plan ($30/mo, cancel anytime)
- Choose Pay-As-You-Go or Monthly
- Get remote desktop credentials by email
- Connect using:
  - Windows: **Microsoft Remote Desktop** (free from Microsoft Store)
  - Mac: built-in **Screen Sharing** app

### Step 2 — One-time setup on the rented Mac (30 min)
Open Terminal and run:
```bash
# Install Node.js
brew install node

# Clone your GitHub repo
git clone https://github.com/YOUR_USERNAME/wealth-perspective.git
cd wealth-perspective

# Install dependencies
npm install

# Add iOS platform
npx cap add ios

# Build web app
npm run build

# Sync to iOS native project
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### Step 3 — Sign into Apple Developer in Xcode (10 min)
- Xcode menu → **Settings → Accounts → +** → Apple ID → sign in
- Open project navigator → click "App" → **Signing & Capabilities** tab
- Check **Automatically manage signing**
- Pick your team from the dropdown
- Xcode generates certificates and provisioning profile automatically

### Step 4 — Archive and upload (20 min)
- At top of Xcode, change device target from "iPhone Simulator" to **Any iOS Device (arm64)**
- Menu → **Product → Archive** (wait ~5-10 min)
- When the Organizer window opens, click **Distribute App**
- Select **App Store Connect → Upload → Next** through all defaults
- Click **Upload** — takes 5-10 min
- You'll see "Upload Successful"

### Step 5 — Attach build & submit (same as Codemagic Step 6 above)

### Step 6 — Future updates
Each time you ship an update:
```bash
cd wealth-perspective
git pull
npm install
npm run build
npx cap sync ios
```
Then bump version in Xcode → Archive → Distribute. Then cancel MacInCloud until next update.

---

## Part 3: Cost Summary

| Item | One-time | Recurring |
|---|---|---|
| Apple Developer | — | $99/year (already paid) |
| GitHub | — | Free |
| Codemagic (free tier) | — | $0 (500 build min/mo) |
| MacInCloud (if used) | — | $30 per month you rent |
| **Recommended path first launch** | **$0** | $99/yr |
| **Backup path first launch** | **$30** | $99/yr |

---

## Part 4: Important Reminders

- **No, this is not a one-way door.** After approval, every code update flows the same way: Lovable → GitHub → Codemagic (or MacInCloud) → App Store Connect → Apple Review (~1 day for updates).
- **You can keep developing in Lovable during Apple review.** Changes won't affect the version under review.
- **First review takes 1-3 days; updates usually approve in 24 hours** unless flagged.
- **If rejected**, common fixes for an app like yours: clarify IAP behavior, add demo login if Apple can't access content, tighten any health/finance disclaimers. We'll handle reviewer feedback together.

---

## Technical Details (for reference)

Code change required in `capacitor.config.ts` before any production build:

```ts
// Comment out (do not delete) this block — only used for dev hot-reload:
// server: {
//   url: 'https://86ba5315-0e8e-45d4-9ce2-019ca156c207.lovableproject.com?forceHideBadge=true',
//   cleartext: true,
// },
```

Bundle ID stays as `app.lovable.86ba53150e8e45d49ce2019ca156c207` (matches App Store Connect record and your IAP product IDs `wealth_perspective_lifetime` and `wealth_perspective_mogul_cash`).

When you approve this plan, I'll switch to build mode and make the `capacitor.config.ts` edit. The rest of the steps happen outside Lovable (GitHub UI, Codemagic dashboard, App Store Connect).
