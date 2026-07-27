## Resubmission Walkthrough — App Store Connect

Before you start, confirm these are complete in Lovable/code:
- [ ] Build number bumped in Xcode (`1.0` → `1.0.1` or higher, or build `3` → `4`)
- [ ] New archive uploaded successfully from Xcode Organizer
- [ ] Screenshots updated (no price/free/discount text)
- [ ] IAPs attached to the version and ready for review
- [ ] Demo video uploaded to App Review Information

---

### Step 1: Open App Store Connect
1. Go to **https://appstoreconnect.apple.com** and sign in.
2. Click **My Apps**.
3. Click your app tile: **Wealth Perspective**.

### Step 2: Navigate to the iOS App version
1. In the left sidebar, click **iOS App**.
2. Click the version tile: **1.0** (or whatever your current rejected version is).
3. You are now on the **iOS App Version 1.0** page.

### Step 3: Select the new build
1. Scroll down to the **Build** section.
2. Click the blue **+** (or click the current build to change it).
3. Select the new build you just uploaded (e.g., **3** or **4**).
4. Click **Done**.
5. Click **Save** at the top-right if the button is active.

### Step 4: Confirm In-App Purchases are attached
1. Scroll down to **In-App Purchases and Subscriptions**.
2. You should see both:
   - **Lifetime Access**
   - **Mogul Cash**
3. If either is missing, click the **+** button and add them.
4. Verify each product shows the blue banner: *"This item has been added for review, but you can still remove the item."*

### Step 5: Verify Previews and Screenshots
1. Scroll to **iPhone 17 Pro Max** (or whatever device Apple tested).
2. Confirm the screenshots no longer show:
   - dollar amounts
   - the word "free"
   - the word "discount"
   - any promotional pricing language
3. If you still see old screenshots, click **Delete** and re-upload the new set.

### Step 6: App Review Information
1. Scroll to the top of the page and click **App Review Information** in the left sidebar.
2. Fill in:
   - **Sign-in required:** Yes
   - **User Name:** `appreview@northspan.com`
   - **Password:** the password you set for this account
   - **Notes:** Briefly note the fixes: OAuth callback fixed, native biometric/haptics/share added, screenshots updated, beta routes hidden on native, IAPs attached.
3. Confirm the **demo video** is still attached in the **Attachment** section.
4. Click **Save**.

### Step 7: Resolve Unresolved Issues (if any)
1. At the top of the version page, look for a red badge: **"Unresolved Issues"**.
2. If it appears, scroll down to see red/yellow cards.
3. Click into each card and answer the required questions or upload any missing items.
4. Return to the version page and click **Save**.

### Step 8: Submit for Review
1. At the top-right of the iOS App Version 1.0 page, look for one of these buttons:
   - **Submit for Review**
   - **Add for Review**
   - **Update Review**
2. Click it.
3. Apple will show compliance questions (e.g., data use, encryption, gambling, etc.). Answer them accurately.
4. On the final screen, click **Submit**.
5. After submission, the version status should change to **Waiting for Review**.

### Step 9: Verify both app and IAPs are in review
1. Wait a few minutes, then refresh the page.
2. The app version status should be **Waiting for Review**.
3. Go to **Monetization > In-App Purchases** in the sidebar.
4. Both **Lifetime Access** and **Mogul Cash** should also show **Waiting for Review**.

---

### Common Pitfalls to Avoid
- **Don't submit from the Draft Submission panel.** Draft Submissions only manages IAPs; the app version must be submitted from the iOS App Version page.
- **Make sure the build is actually selected.** If you see "No build selected," the submission will fail.
- **Don't include pricing in the app description or screenshots.** Any mention of "$", "free", "discount", or "sale" can trigger another rejection.
- **Use the sandbox tester account for your video**, not the Lovable Cloud auth review account, if the video shows a purchase.

---

Ready to proceed once you confirm the new build is already uploaded to App Store Connect.