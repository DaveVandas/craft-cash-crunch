# Repair the iOS Package Graph and Archive Build 5

## Confirmed diagnosis

- Xcode now fails on `Unable to resolve module dependency: 'Capacitor'`, after the version-alignment preflight passed.
- Capacitor CLI, Core, iOS, and Android are installed at `8.4.2`; the installed plugin manifests no longer show the earlier Capacitor 7/8 conflict.
- The generated `ios` project is not stored in this repository. It exists only on the Mac, where its local Swift package reference has been repeatedly removed and re-added.
- Therefore the remaining fault is Xcode's generated/local Swift Package Manager graph, not the web app or Apple signing configuration.

## Repair

1. Back up only the native assets that must survive regeneration: the AppIcon set, launch assets, entitlements, and any plist values.
2. Quit Xcode and remove the broken generated iOS platform and Xcode package caches.
3. Recreate the iOS platform with the pinned Capacitor `8.4.2` toolchain instead of manually repairing `CapApp-SPM` again.
4. Run the web build and `npx cap sync ios` so `CapApp-SPM`, plugin products, and the Xcode target linkage are generated together from one clean dependency graph.
5. Restore the backed-up icon assets, then restore only the required capabilities: Push Notifications, Sign in with Apple, and `applinks:earningsexplorer.shop`.

## Strengthen the preflight gate

- Extend `ios:preflight` to fail if the iOS project, generated `CapApp-SPM` manifest, Xcode local-package reference, or required Capacitor product links are missing.
- Add a real command-line Xcode package-resolution/build check for Mac use, so “preflight passed” means Xcode can import `Capacitor`, not merely that `Package.swift` contains an 8.x version string.
- Keep all Capacitor foundation packages pinned to the same exact release and preserve the lockfile.

## Validate before archiving

1. Run the strengthened preflight and require every check to pass.
2. Open the newly generated `ios/App/App.xcodeproj` and wait for package resolution to finish without errors.
3. Confirm Build `5`, signing team, app icons, and all three capabilities.
4. Build for `Any iOS Device (arm64)` first; only after that succeeds, run Archive.

## Mac workflow after implementation

I will provide the recovery commands one line at a time, including explicit backup and restore commands, so no native assets are lost.