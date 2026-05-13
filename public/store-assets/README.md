# App Store Asset Pack — Wealth Perspective

Generated from `public/app-icons/ios-1024x1024.png` (1024×1024 opaque master).

Drop these into your native projects after running `npx cap add ios` / `npx cap add android`.

---

## iOS — `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

Replace **every** PNG in `AppIcon.appiconset/` with the matching size from `ios/`:

| Slot | File |
|---|---|
| iPhone Notification 20pt @2x/@3x | `AppIcon-40x40.png`, `AppIcon-60x60.png` |
| iPhone Settings 29pt @2x/@3x | `AppIcon-58x58.png`, `AppIcon-87x87.png` |
| iPhone Spotlight 40pt @2x/@3x | `AppIcon-80x80.png`, `AppIcon-120x120.png` |
| iPhone App 60pt @2x/@3x | `AppIcon-120x120.png`, `AppIcon-180x180.png` |
| iPad Notifications 20pt @1x/@2x | `AppIcon-20x20.png`, `AppIcon-40x40.png` |
| iPad Settings 29pt @1x/@2x | `AppIcon-29x29.png`, `AppIcon-58x58.png` |
| iPad Spotlight 40pt @1x/@2x | `AppIcon-40x40.png`, `AppIcon-80x80.png` |
| iPad App 76pt @1x/@2x | `AppIcon-76x76.png`, `AppIcon-152x152.png` |
| iPad Pro App 83.5pt @2x | `AppIcon-167x167.png` |
| **App Store Marketing 1024pt** | `AppIcon-1024x1024.png` |

> Apple requires the 1024 to be **opaque** with **square corners** (the OS applies the mask). All files in this pack already comply.

### iOS Splash
`ios/App/App/Assets.xcassets/Splash.imageset/` — replace with `splash/splash-2732x2732.png` (universal). The Capacitor SplashScreen plugin handles scaling.

---

## Android — `android/app/src/main/res/`

Copy the entire `android/` folder contents into `android/app/src/main/res/`, **merging** with the existing `mipmap-*` and `values/` folders.

What you get:
- **Legacy launcher icon** (`ic_launcher.png`, `ic_launcher_round.png`) for every density
- **Adaptive icon** (Android 8+): foreground + background color + monochrome (Android 13 themed icons)
- **Adaptive icon XML** in `mipmap-anydpi-v26/`
- **Background color** in `values/ic_launcher_background.xml` (`#0a0a0a`)

### Android Splash
Capacitor expects splash assets at `android/app/src/main/res/drawable-*/splash.png`.
Use the matching density file from `splash/android-*.png` and rename to `splash.png` in each density folder.

### Play Store listing
Upload `android/playstore/ic_launcher-playstore.png` (512×512) when you create the listing in Google Play Console.

---

## After dropping in assets

```bash
npx cap sync
npx cap open ios       # verify in Xcode
npx cap open android   # verify in Android Studio
```

In Xcode: open `Assets.xcassets` → `AppIcon` and confirm all slots show your icon (no warning triangles).
In Android Studio: right-click `res/mipmap-anydpi-v26/ic_launcher.xml` → "Show in Resource Manager" to preview.

---

## What's NOT in this pack (you'll add manually in the store consoles)

- **App Store screenshots** — 6.7" iPhone (1290×2796) and 12.9" iPad (2048×2732), at minimum 3 per device
- **Play Store feature graphic** — 1024×500
- **Play Store screenshots** — phone + tablet, 2–8 each
- **App preview videos** (optional)

If you want, I can generate marketing screenshots from your live app once Round 3 is underway.
