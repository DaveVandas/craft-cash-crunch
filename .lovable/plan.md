## What is happening

Your Signing & Capabilities page looks mostly correct, but the archive is failing before packaging because Xcode is trying to read a specific `.mobileprovision` file from your Mac that does not exist anymore.

This is not an App Store Connect metadata problem and not an app-code problem. It is a local Xcode signing/profile cache or Release build signing setting problem.

The key clues from your screenshot:

- Archive destination is correct: `Any iOS Device (arm64)`
- Team is correct: `NORTHSPAN INDUSTRIES, LLC`
- Bundle ID is correct: `com.northspan.wealthperspective`
- Automatic signing is checked
- But the build error is still: `Build input file cannot be found ... .mobileprovision`
- Under the Release signing view, Xcode appears to show an `Apple Development` certificate, which is suspicious for an App Store archive. Release/archive should normally resolve to an Apple distribution signing setup.

## Plan to fix it

### 1. Stop retrying Archive for the moment

Do not keep archiving yet. Each retry is using the same broken signing/profile resolution.

### 2. Confirm whether Release is using the wrong signing identity

In Xcode:

1. Click the blue `App` project icon.
2. Select the `App` target.
3. Open `Build Settings`.
4. Make sure the filter is set to `All`, not `Basic`.
5. Search for:

```txt
Code Signing Identity
```

Check the `Release` row.

Expected:

```txt
Apple Distribution
```

If it says:

```txt
Apple Development
```

change the `Release` value to:

```txt
Apple Distribution
```

Then search for:

```txt
Provisioning Profile
```

Expected for Release:

```txt
Automatic
```

Then search for:

```txt
Provisioning Profile Specifier
```

Expected for Release:

```txt
blank / empty
```

If there is a profile name or UUID there, clear it.

### 3. Force Xcode to download/recreate signing profiles

In Xcode:

1. Open `Xcode → Settings...`
2. Go to `Accounts`.
3. Select the Apple ID.
4. Select `NORTHSPAN INDUSTRIES, LLC`.
5. Click `Download Manual Profiles` if available.
6. Close Settings.

Then return to the project:

1. `Signing & Capabilities`
2. Uncheck `Automatically manage signing`
3. Wait a few seconds
4. Re-check `Automatically manage signing`
5. Confirm Team remains `NORTHSPAN INDUSTRIES, LLC`

### 4. Clean after the signing correction

After the signing values are corrected:

1. `Product → Clean Build Folder`
2. Quit Xcode completely
3. Reopen `App.xcworkspace`
4. Confirm destination is `Any iOS Device (arm64)`
5. Try `Product → Archive`

### 5. If it still fails, remove the exact missing profile reference from the local project file

If the same error returns, the next step is not another cache cleanup. We need the exact full missing `.mobileprovision` path/UUID from the error and then remove every remaining reference to it.

In Terminal, from the iOS app folder, run a search like this:

```bash
grep -R "mobileprovision\|PROVISIONING_PROFILE\|CODE_SIGN_IDENTITY" App.xcodeproj/project.pbxproj
```

Then remove only the stale `.mobileprovision` reference or incorrect Release signing value.

### 6. Last-resort local Xcode reset

If Xcode still insists on the missing profile after the project file is clean:

1. Remove the Apple account from `Xcode → Settings → Accounts`
2. Quit Xcode
3. Reopen Xcode
4. Add the Apple account again
5. Re-select the Northspan team
6. Let Xcode recreate the managed profile
7. Archive again

## What I think is most likely

The most likely issue is that the Release archive build is still resolving to a missing local managed provisioning profile, and possibly using an `Apple Development` signing identity instead of the correct distribution signing setup for archive.

The next thing I would check first is the `Build Settings → Code Signing Identity → Release` value.