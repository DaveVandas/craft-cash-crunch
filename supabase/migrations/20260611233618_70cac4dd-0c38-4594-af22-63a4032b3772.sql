-- Seed Apple App Review demo account with permanent lifetime access
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'appreview@northspan.com';

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated',
      'appreview@northspan.com',
      crypt('WealthReview2026!', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"App Reviewer"}'::jsonb,
      false
    );
  ELSE
    UPDATE auth.users
    SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
        encrypted_password = crypt('WealthReview2026!', gen_salt('bf')),
        updated_at = now()
    WHERE id = v_user_id;
  END IF;

  -- Ensure user_access row exists (trigger should have created it for new inserts)
  INSERT INTO public.user_access (user_id, has_lifetime_access)
  VALUES (v_user_id, true)
  ON CONFLICT (user_id) DO UPDATE
    SET has_lifetime_access = true,
        updated_at = now();
END $$;