
-- Fix 1: Lock down celebrity-images storage policies
DROP POLICY IF EXISTS "Service role can upload celebrity images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update celebrity images" ON storage.objects;

CREATE POLICY "Service role can upload celebrity images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'celebrity-images' AND auth.role() = 'service_role'
  );

CREATE POLICY "Service role can update celebrity images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'celebrity-images' AND auth.role() = 'service_role'
  );

-- Fix 2: Replace permissive UPDATE policy on user_access with SECURITY DEFINER RPC
DROP POLICY IF EXISTS "Users can set their own referral code once" ON public.user_access;

CREATE OR REPLACE FUNCTION public.set_referral_code(p_code text, p_source_variant text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_access
  SET referred_by_code = p_code,
      source_variant = COALESCE(p_source_variant, source_variant)
  WHERE user_id = auth.uid()
    AND referred_by_code IS NULL;
END;
$$;

-- Fix 3: Remove affiliates from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.affiliates;
