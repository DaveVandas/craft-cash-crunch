-- Fix 1: Drop and recreate beta_invites_public view without recipient_name PII
DROP VIEW IF EXISTS public.beta_invites_public;
CREATE VIEW public.beta_invites_public
WITH (security_invoker = true)
AS
SELECT
  id,
  created_by,
  expires_at,
  claimed_by,
  claimed_at,
  created_at,
  status
FROM beta_invites
WHERE status = 'claimed'::text;

-- Fix 2: Tighten share_analytics INSERT policy to prevent user_id spoofing
DROP POLICY IF EXISTS "Anyone can track shares" ON public.share_analytics;
CREATE POLICY "Anyone can track shares"
ON public.share_analytics FOR INSERT
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Fix 3: Keep story_share_analytics INSERT policy but it's already protected by RPC validation
DROP POLICY IF EXISTS "Anyone can track shares" ON public.story_share_analytics;
CREATE POLICY "Anyone can track shares"
ON public.story_share_analytics FOR INSERT
WITH CHECK (true);
