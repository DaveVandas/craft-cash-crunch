# Step 2: Connect to Your Mac & Install Xcode

You should have an email from MacInCloud with:
- **Server address** (e.g. `server123.macincloud.com`)
- **Username** (e.g. `user1234`)
- **Password**
- **Port** (usually `30001`)

Keep that email open in another window — you'll paste from it.

---

## Part A — Connect via Remote Desktop

### If you're on Windows
1. Open **Microsoft Remote Desktop** (the one you installed from the Microsoft Store).
2. Click **+ Add** → **PCs**.
3. **PC name:** `server123.macincloud.com:30001` (your server address + colon + port).
4. **User account:** click **Add User Account** → enter your MacInCloud username + password → Save.
5. Click **Save**, then double-click the new tile to connect.
6. If it asks about an unverified certificate, click **Connect anyway**.

### If you're on a Mac
1. Open **Microsoft Remote Desktop**.
2. **+ → Add PC**.
3. **PC name:** `server123.macincloud.com:30001`.
4. **User account:** Add → username + password.
5. **Add**, then double-click to connect.

You should land on a Mac desktop within ~30 seconds.

---

## Part B — Quick Mac orientation (skip if you're already a Mac user)

Three things that trip up Windows folks:

- **No Start menu.** The Apple logo (top-left) is the closest equivalent. Apps live in **Finder → Applications**, or use **Spotlight Search**: press `Cmd + Space`, type the app name, hit Enter.
- **Cmd, not Ctrl.** Copy = `Cmd+C`. Paste = `Cmd+V`. Quit app = `Cmd+Q`. Switch apps = `Cmd+Tab`.
- **Close vs Quit.** The red circle (top-left of a window) only **closes the window** — the app keeps running. Use `Cmd+Q` to fully quit.

The dock at the bottom = pinned + running apps. Finder (blue smiley face) = file explorer. App Store (blue "A" icon) = where Xcode lives.

---

## Part C — Install Xcode (the long part)

1. Click the **App Store** icon in the dock (or `Cmd+Space` → type "App Store" → Enter).
2. If it asks you to sign in: use your **personal Apple ID** (the same one tied to your Apple Developer Program membership — you'll need that for submission later). If you don't have one, click **Create Apple ID** and make one now.
3. In the App Store search bar (top-left), type **Xcode** and press Enter.
4. Click **Get** → **Install** on the Xcode result.
5. **Wait.** Xcode is ~15 GB. On MacInCloud's connection this typically takes **30–60 minutes**. The blue progress bar in the App Store is your friend.

⚠️ **Don't disconnect during the download.** You can minimize the Remote Desktop window and do other things, but if you fully disconnect the Mac may pause the download. Leave it running.

### While Xcode downloads, do these in parallel:

**On your local computer (not the Mac):**
- Sign up for the **Apple Developer Program** ($99/year) at https://developer.apple.com/programs/enroll/ — this takes 24-48 hrs to approve, so start now.
- Create an **App Store Connect** record placeholder at https://appstoreconnect.apple.com (you can do this once developer membership is approved).

---

## Part D — First Xcode launch

Once installed:
1. Open **Xcode** from the dock or Applications.
2. It'll prompt for **additional components** — click **Install** (~5 min).
3. Accept the license agreement (it'll ask for your Mac password).
4. Sign into Xcode with your Apple ID: **Xcode menu → Settings → Accounts → +** → Apple ID → enter credentials.
5. Close Xcode for now. You're ready for Step 3.

---

## When you're done, ping me with:
**"Xcode installed and signed in — start Step 3"**

Step 3 will be: getting our project's iOS build onto the Mac (via git clone), running `npx cap sync ios`, and opening it in Xcode for the first time.

## Common gotchas
- **App Store says "Sign In Required" repeatedly** → sign out (App Store menu → Sign Out), sign back in.
- **Xcode download stuck at 0%** → close App Store, reopen, click Xcode again — it resumes.
- **Apple ID asks for 2FA code** → it sends to your trusted device (your phone), not the Mac. Have your phone ready.
- **Remote Desktop disconnects randomly** → reconnect; your Mac session is preserved server-side, downloads continue.
