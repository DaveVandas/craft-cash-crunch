-- Fix 1: Remove overly permissive SELECT policies on affiliates table that expose emails

-- Drop the permissive public and authenticated policies
DROP POLICY IF EXISTS "Public can view approved affiliate codes via view" ON public.affiliates;
DROP POLICY IF EXISTS "Authenticated can view approved affiliates for referral" ON public.affiliates;

-- The existing "Users can view their own affiliate profile" policy already allows owner access
-- The existing "Admins can manage all affiliates" policy already allows admin access
-- No new policies needed - owners and admins can already access their data

-- Fix 2: Recreate beta_invites_public view without sensitive invite_code column
-- and with security_invoker enabled

DROP VIEW IF EXISTS public.beta_invites_public;

CREATE VIEW public.beta_invites_public
WITH (security_invoker = on) AS
SELECT 
    id,
    created_by,
    expires_at,
    claimed_by,
    claimed_at,
    created_at,
    recipient_name,
    status
FROM public.beta_invites
WHERE status = 'claimed';

-- Add comment explaining the security fix
COMMENT ON VIEW public.beta_invites_public IS 'Public view of beta invites - excludes invite_code and recipient_email for security, only shows claimed invites';