# Apple Resubmission — Remaining Checklist (Build 5)

This is a procedural checklist of the App Store Connect steps still outstanding. No code changes are needed — all code work for Round 3 is complete.

## Already done

- Build 5 archived in Xcode with clean signing, all 3 capabilities (Push, Sign in with Apple, Associated Domains), and the crown app icon.
- Build 5 uploaded to App Store Connect; export-compliance / encryption prompt answered.
- IAP review screenshots uploaded for both Lifetime Access and Mogul Cash.
- IAP per-product metadata submitted — both products at "Ready to Submit" (they finalize once the main build is approved).

## Remaining steps before you hit Submit for Review

1. **Publish the web app so `/support` is live (fixes Guideline 1.5)**
   - The Support URL Apple will check is `https://earningsexplorer.shop/support`. Earlier this returned a 404 because the latest build (which contains the `/support` route) had not been published to the custom domain.
   - Publish the current project so the `/support` route resolves. Verify it loads in a browser before submitting.
   - In ASC → App Information → confirm **Support URL = `https://earningsexplorer.shop/support`**.

2. **iPhone 6.7" marketing screenshots (Tab 2)**
   - Confirm at least 6 frames are uploaded (earnings, reality check, compare, mogul markets, VIP portfolios, quiz).
   - Re-confirm **no screenshot contains pricing text** ("$6.99", "$9.99", "one payment", "risk-free") — fixes Guideline 2.3.7.
   - Valid size: 1284×2777 or 1290×2796.

3. **iPad 13" marketing screenshots (Tab 2)**
   - Apple requires these because iPad support is declared.
   - Same frames at iPad size (2048×2732), no pricing text.

4. **Attach both IAPs to the iOS App 1.0 version page (fixes Guideline 2.1(b))**
   - On the iOS App 1.0 version page → In-App Purchases and Subscriptions → **+** → add Lifetime Access and Mogul Cash.
   - Confirm the blue "added for review" banner appears. (Submitting per-product metadata is separate from attaching them to the version — both are required.)

5. **App Review Information (Tab 6)**
   - Contact Name / Email (`wealthperspective@earningsexplorer.shop`) / Phone.
   - Review Notes: explain native Apple/Google sign-in sheets and how to trigger each IAP via the Sandbox Tester account. Note that paper trading is simulated only.
   - Demo account / sign-in note if any feature requires an account.

6. **Build selection (Tab 7)**
   - Confirm the build row shows Build 5 with a green check. If it still shows Build 4, remove it and select Build 5.

7. **Submit for Review (Tab 8)**
   - Top-right → Add for Review / Submit for Review.
   - Confirm the export-compliance prompt (encryption exemption) is answered.

## Quick final checklist

- [ ] `/support` is live and Support URL set in ASC
- [ ] iPhone 6.7" screenshots uploaded (no pricing)
- [ ] iPad 13" screenshots uploaded (no pricing)
- [ ] Both IAPs attached to the version page (blue banner)
- [ ] App Review Information filled (contact + sandbox note)
- [ ] Build 5 selected
- [ ] Export compliance answered
- [ ] Submit for Review

## Note

If publishing the app is the blocker for step 1, that should happen before you submit to Apple so the reviewer's Support URL check passes on the first try.
