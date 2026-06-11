# Apple Reviewer Demo Account

Create a permanent demo account that Apple's App Review team can use to sign in and test every paywalled feature without paying.

## Credentials (to give Apple)

- **Email:** `appreview@northspan.com`
- **Password:** `WealthReview2026!`

(Strong enough to satisfy Apple's reviewer-account requirements; no real PII; under our control.)

## What gets created

A single migration that:

1. Creates the auth user `appreview@northspan.com` with the password above, email pre-confirmed (so no email-verification step blocks Apple).
2. Lets the existing `handle_new_user` trigger auto-create the `user_access` row, then flips `has_lifetime_access = true` for that user.
3. Creates a matching `profiles` row (handled by `handle_new_user_profile` trigger automatically — no extra work).
4. Idempotent: if the account already exists, just ensures `has_lifetime_access = true` and re-confirms the email. Safe to re-run.

## Why this works

- Account is a real Supabase auth user, so it goes through normal sign-in (no special bypass code path needed in the app — less risk of a reviewer hitting an edge case).
- `user_access.has_lifetime_access = true` unlocks every paywalled feature via the existing `PaywallGate` logic — no app code changes required.
- Email pre-confirmed so reviewers don't have to check an inbox.
- Lives forever — reviewers for v1.1, v1.2, etc. can reuse the same login.

## Technical details

Single migration calling `supabase.auth.admin`–equivalent SQL:

```sql
-- Insert into auth.users with crypted password and confirmed email
-- (uses Supabase's standard auth schema; password hashed via crypt + bcrypt)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), 'authenticated', 'authenticated',
  'appreview@northspan.com',
  crypt('WealthReview2026!', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"App Reviewer"}'::jsonb,
  false
)
ON CONFLICT (email) DO UPDATE
SET email_confirmed_at = COALESCE(auth.users.email_confirmed_at, now()),
    encrypted_password = crypt('WealthReview2026!', gen_salt('bf'));

-- Triggers auto-create user_access + profiles rows.
-- Then grant lifetime:
UPDATE public.user_access
SET has_lifetime_access = true, updated_at = now()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'appreview@northspan.com');
```

No edge function changes, no client code changes, no RLS changes.

## Out of scope

- Bypassing the paywall in code for a special email — not needed; the entitlement flag does the work.
- Test IAP purchases — Apple uses sandbox accounts they create themselves for that; our demo account just needs unlocked access.
- Drafting the App Review Information copy — that's the next step after this lands.

## Files touched

- One new migration file (created by the migration tool).
