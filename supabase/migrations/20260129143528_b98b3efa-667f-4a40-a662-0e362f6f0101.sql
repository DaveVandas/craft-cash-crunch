-- Fix security: Recreate affiliates_public view with security_invoker
-- This view is used for public referral page lookups (/ref/:code)
-- Only approved affiliates should be visible

DROP VIEW IF EXISTS public.affiliates_public;

CREATE VIEW public.affiliates_public
WITH (security_invoker = on) AS
  SELECT 
    id,
    display_name,
    status,
    affiliate_code
  FROM public.affiliates
  WHERE status = 'approved';

-- Grant select to anon and authenticated for referral page lookups
GRANT SELECT ON public.affiliates_public TO anon, authenticated;

-- Fix security: Recreate beta_invites_public view with security_invoker
-- This view excludes sensitive invite_code field
-- Only claimed invites should be visible (for admin tracking)

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