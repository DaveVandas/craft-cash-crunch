# Fix Apple Reviewer Demo Account Login

## What's wrong

The account `appreview@northspan.com` exists and has `email_confirmed_at` set, but login fails with HTTP 500. Auth logs show the exact cause:

> `error finding user: sql: Scan error on column index 3, name "confirmation_token": converting NULL to string is unsupported`

This is a well-known Supabase/GoTrue quirk: when a user is inserted directly into `auth.users` via SQL, several token columns end up as `NULL`, but GoTrue's Go code expects empty strings (`''`) and crashes when it tries to scan `NULL` into a string. The original seed migration didn't set these columns, so they defaulted to `NULL`.

Confirmed in the DB right now for this user:
- `confirmation_token` = NULL ← the one crashing login
- `recovery_token` = NULL
- `email_change` = NULL
- `email_change_token_new` = NULL

## The fix

One tiny migration that updates ONLY this demo user's token columns to `''`:

```sql
UPDATE auth.users
SET confirmation_token = '',
    recovery_token = '',
    email_change = '',
    email_change_token_new = '',
    email_change_token_current = COALESCE(email_change_token_current, ''),
    reauthentication_token = COALESCE(reauthentication_token, '')
WHERE email = 'appreview@northspan.com';
```

Scoped to the single reviewer account — no other users touched, no schema changes, no RLS changes.

## Also: patch the original seed migration pattern

Update the seed migration file so if anyone ever re-runs it (or we create a second reviewer account), it inserts those token columns as `''` from the start and this bug never recurs.

## After the migration

You'll be able to sign in with:
- **Username:** `appreview@northspan.com`
- **Password:** `WealthReview2026!`

and the existing `has_lifetime_access = true` flag will unlock every paywalled feature for Apple's reviewer.

## Files touched

- One new migration (the UPDATE above)
- Edit to the existing seed migration file to add empty-string token defaults for future safety
