# Build 5 Archive — Confirmed Facts and One Clean Command Path

You're right that the last few messages chased symptoms. Here is what the repo actually says, verified now, and a single sequence to follow.

## What the project actually is (verified, not guessed)

- **Capacitor 8** (`@capacitor/core`, `@capacitor/ios` both v8). Capacitor 8 generates a **Swift Package Manager** package, not a Podfile. Your Terminal output confirmed it twice: `[info] Writing Package.swift` during sync, and `No 'Podfile' found` when we tried CocoaPods. **CocoaPods is not part of this project** — that instruction was wrong and should be dropped entirely.
- **Node version was never the problem.** `npm install` completed cleanly on Node 25 (794 packages, 7s). The earlier `fibers` error came from a stale local lockfile, which the `git pull` replaced. **Skip Homebrew and nvm.**
- **The `ios/` folder is not in the repo.** It exists only on your Mac. `git pull` never touches it. It is created and maintained by `npx cap sync ios`. That is why local Xcode state (icons, signing) survives pulls.
- **Root cause of the failed archive**, straight from your sync output: `[warn] capacitor-native-biometric does not have a Package.swift` and `Some installed packages are not compatible with SPM`. Two biometric plugins were installed — the legacy `capacitor-native-biometric@4.2.2` (no SPM support) and `@capgo/capacitor-native-biometric@8.6.0` (SPM-ready). One package without `Package.swift` fails resolution for the entire generated Swift package, and Xcode reports the failure against whichever product it hits first — `RevenuecatPurchasesCapacitor`. RevenueCat itself was never broken.
- **That legacy plugin has been removed** from `package.json`, and both code paths (`src/lib/nativeBiometric.ts`, `src/lib/nativeFeatures.ts`) now use the `@capgo` plugin. No functionality is lost. This change is already in the repo, ready for you to pull.
- Remaining plugins, all SPM-compatible: apple-sign-in, app, browser, haptics, local-notifications, network, preferences, push-notifications, share, capgo biometric, revenuecat.

## Is the old route still valid?

Yes. The route that worked before is unchanged:

```text
git pull  ->  npm install  ->  npx cap sync ios  ->  Xcode archive
```

Nothing about that path was wrong. The only new variable this round was the duplicate biometric plugin, which is now removed. No pods, no Node switch, no nvm.

## The command sequence

Run each line separately, waiting for the prompt to return. Never paste a block.

```bash
cd ~/Desktop/craft-cash-crunch
```
```bash
git pull origin main
```
```bash
rm -rf node_modules package-lock.json
```
```bash
npm install
```
```bash
npx cap sync ios
```

**The one thing to check before touching Xcode:** the sync output must contain **no** line reading `does not have a Package.swift` and **no** `Some installed packages are not compatible with SPM`. If either appears, stop and send the output — the archive will fail again otherwise. The two `[warn]` lines about SPM in earlier runs were exactly this signal, and we should treat them as blocking from now on.

## Xcode steps

1. `npx cap open ios` (opens `App.xcworkspace`).
2. **File > Packages > Reset Package Caches**, then **File > Packages > Resolve Package Versions**. Wait for resolution to finish with no red errors in the issue navigator.
3. Target **App > Signing & Capabilities**: confirm **Sign in with Apple** and **Push Notifications** are present.
4. Target **App > General**: Version `1.0`, Build `5`.
5. **Product > Clean Build Folder** (Shift+Cmd+K).
6. Device selector set to **Any iOS Device (arm64)**.
7. **Product > Archive**, then **Distribute App > App Store Connect**.

## If the archive still fails

Send the exact text of the first error in the issue navigator, not just the summary line. "Missing package product X" is a downstream symptom — the actual cause is always in the package resolution log (**Report navigator**, the `Resolve Package Graph` entry). That log names the offending package directly, so we stop guessing.

## Checkpoints for me

- Output of `npx cap sync ios` — I confirm the SPM warnings are gone.
- Screenshot of Signing & Capabilities before archiving.
