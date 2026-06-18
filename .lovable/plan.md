# Step 1: Rent Your Mac on MacInCloud

No code changes needed — `capacitor.config.ts` is already production-safe (dev server is gated behind the `CAP_DEV` flag, so a normal build ships the bundled `dist/`).

This step happens entirely on macincloud.com. Below is exactly what to click.

---

## 1. Go to the signup page
Open: **https://www.macincloud.com/managed-server-plans**

## 2. Pick the plan
- Plan: **Managed Server**
- Billing: **Monthly — $25/month** (cancel anytime; one month is plenty for first submission)
- Click **Order Now** / **Sign Up**

## 3. Create your account
- Email + password
- Payment: credit card
- Confirm the order

## 4. Wait for provisioning email (~15 min – 2 hrs)
MacInCloud emails you when your Mac is ready. The email contains:
- **Server address** (looks like `server123.macincloud.com`)
- **Username** (e.g. `user1234`)
- **Password**
- **Port** (usually `30001` or similar)

Keep this email open — you'll need all four values in Step 2.

## 5. Install your Remote Desktop client (do this while waiting)
- **Windows:** Microsoft Store → search **Microsoft Remote Desktop** → Install (free)
- **Mac:** App Store → search **Microsoft Remote Desktop** → Install (free; the built-in Screen Sharing also works but RDP is more reliable with MacInCloud)

---

## What to do once you get the provisioning email
Reply with **"Got my Mac credentials — start Step 2"** and I'll walk you through:
- Connecting via Remote Desktop (screen-by-screen)
- First-login Mac orientation (it'll look unfamiliar if you're on Windows)
- Installing Xcode from the Mac App Store (~15 GB, 30-60 min download)

## If anything goes sideways
- Provisioning taking > 4 hours → use MacInCloud live chat (bottom-right of their site); they're fast
- Can't decide between Pay-As-You-Go vs Monthly → Monthly is cheaper if you'll spend > 2 hours total (you will)
- Card declined → they accept PayPal as a fallback

---

## Reminder on the meter
Once the Mac is provisioned, the $25 is spent regardless. Plan to do Steps 2–5 within a single sitting (2–3 hours) so you can **cancel renewal the same day** from your MacInCloud account dashboard. Cancelling stops next month's charge; you keep access through the end of the current month.

No action needed from me right now — go rent the Mac and ping me when the credentials email arrives.