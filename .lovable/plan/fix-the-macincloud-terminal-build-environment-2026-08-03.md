# Fix the MacinCloud Terminal Build Environment

## What went wrong

Two separate problems, neither in the app code:

1. **Wrong folder.** The `git checkout -- package.json package-lock.json` and `git pull origin main` commands failed with "not a git repository" / "did not match any file(s)". The shell prompt shows you were sitting in `~/craft-cash-crunch`, not `~/Desktop/craft-cash-crunch`. Everything after that ran in a non-repo folder, so nothing was actually reset or pulled.
2. **Homebrew is broken on this MacinCloud image.** `brew install node@20` failed with "/opt/homebrew/Cellar is not writable" and then an internal Homebrew crash. That machine's Homebrew install is not usable without admin ownership changes, so we should not use it.

## What Node@20 is (and why it came up)

Node is the JavaScript runtime that runs `npm install` and `npx cap sync ios`. Node 20 LTS is the stable long-term-support version that Capacitor and the Vite build target. Your Mac has Node 25, which is very new — some older native modules can't compile on it.

The specific failure you saw (`node-gyp` building **fibers**) comes from a **stale `package-lock.json`** on that Mac. `fibers` is not a dependency of this project at all — nothing in `package.json` references it. Once the correct, current lock file is in place, that build step disappears, so **Node 25 may work fine and switching Node versions may not be necessary.**

## Plan

### Step 1 — Confirm you are in the real repo
```bash
cd ~/Desktop/craft-cash-crunch
pwd
git status
```
If `git status` errors, we locate the folder first with:
```bash
find ~ -maxdepth 4 -type d -name "craft-cash-crunch" 2>/dev/null
```

### Step 2 — Reset the stale dependency files and sync
```bash
git checkout -- package.json package-lock.json
git pull origin main
rm -rf node_modules
npm install
```

### Step 3 — Only if `npm install` still fails on Node 25
Do **not** use Homebrew. Use `nvm`, which installs into your home folder and needs no admin rights:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
node -v      # expect v20.x
rm -rf node_modules package-lock.json
npm install
```

### Step 4 — Sync into Xcode
```bash
npx cap sync ios
```

Then we continue with the Xcode steps already on the list: enable Sign in with Apple, bump the build number to 5, confirm the Northspan team, Archive, Distribute.

## Notes

- No app code changes are part of this plan — this is purely repairing the build machine's state.
- Homebrew stays untouched; `nvm` is the safe fallback on a hosted Mac.
- Send the output after Step 2's `npm install` before moving on.
