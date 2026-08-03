# Make the iOS Archive Reproducible

## Confirmed cause

The current Xcode error, `Unable to resolve module dependency: 'Capacitor'`, is the final symptom of one package-version conflict:

- The repository has Capacitor Core/iOS 8.4.x, but the locked Capacitor CLI is still 8.0.2.
- CLI 8.0.2 regenerates `CapApp-SPM` with a Capacitor **7.x** Swift-package constraint.
- RevenueCat and the current native social-login plugin require the Capacitor **8.x** Swift package.
- Swift Package Manager cannot resolve both ranges, so Xcode first reports missing `CapApp-SPM` and later fails to import `Capacitor` while archiving.

The earlier biometric conflict is already removed. Signing, capabilities, icons, and the associated domain are not causing this build failure.

## Implementation

1. **Align the Capacitor generator and runtime**
   - Pin `@capacitor/cli`, `@capacitor/core`, and `@capacitor/ios` to the same tested 8.4.2 release.
   - Keep the native plugins on Capacitor-8-compatible releases.

2. **Repair dependency reproducibility**
   - Regenerate the npm lockfile so every dependency declared in `package.json` is actually represented, including Browser, Network, Preferences, and Social Login.
   - Reconcile the competing lockfile state so local npm installs cannot silently use a different Capacitor graph from the project environment.

3. **Add a native-build preflight check**
   - Add a small command that verifies the installed CLI/Core/iOS versions are compatible before Xcode is opened.
   - Verify the generated `ios/App/CapApp-SPM/Package.swift` requires `capacitor-swift-pm` from `8.0.0`, not `7.0.0`.
   - Make the check stop with a clear message instead of allowing another doomed archive attempt.

4. **Validate the repository changes**
   - Confirm the web project still builds through the normal project checks.
   - Confirm all native plugins expose Swift Package Manager manifests and no legacy Apple-sign-in or biometric package remains.

## One clean Mac rebuild after the fix is merged

Run each command separately from `~/Desktop/craft-cash-crunch`:

```bash
git pull origin main
rm -rf node_modules
npm ci
npm run ios:preflight
rm -rf ios/App/CapApp-SPM/.build
rm -rf ~/Library/Developer/Xcode/DerivedData/*
npx cap sync ios
npm run ios:preflight
npx cap open ios
```

The second preflight must confirm that the generated package uses Capacitor Swift PM 8.x. If it fails, do not open Xcode or archive.

In Xcode:

1. **File → Packages → Reset Package Caches**
2. **File → Packages → Resolve Package Versions** and wait for zero red package errors
3. Confirm Build `5`, signing, Sign in with Apple, Push Notifications, and `applinks:earningsexplorer.shop`
4. **Product → Clean Build Folder**
5. Select **Any iOS Device (arm64)**
6. **Product → Archive**

## Success criteria

- Capacitor CLI/Core/iOS resolve on the same 8.4.2 line.
- Generated `CapApp-SPM/Package.swift` references `capacitor-swift-pm` from `8.0.0`.
- Xcode resolves the package graph without `CapApp-SPM`, RevenueCat, or `Capacitor` module errors.
- Build 5 archives successfully without changing the already-correct signing and capability setup.