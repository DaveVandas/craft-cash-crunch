-- Recreate beta_invites_public view with security_invoker = true
-- This ensures the view respects the caller's RLS policies from the base table
DROP VIEW IF EXISTS public.beta_invites_public;

CREATE VIEW public.beta_invites_public
WITH (security_invoker = true)
AS
SELECT id,
    created_by,
    expires_at,
    claimed_by,
    claimed_at,
    created_at,
    recipient_name,
    status
FROM public.beta_invites
WHERE status = 'claimed'::text;