-- Drop the existing affiliates_public view and recreate with minimal public fields
-- The view should only expose what's needed for public referral lookups

DROP VIEW IF EXISTS public.affiliates_public;

-- Create a minimal public view with only the fields needed for referral attribution
CREATE VIEW public.affiliates_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    affiliate_code,
    display_name,
    status
  FROM public.affiliates
  WHERE status = 'approved';

-- Add a policy to allow public SELECT on affiliates for the view to work
-- But only for approved affiliates and only minimal fields through the view
CREATE POLICY "Public can view approved affiliate codes via view"
ON public.affiliates
FOR SELECT
TO anon
USING (status = 'approved');

-- Authenticated users can also view approved affiliates (for referral lookup)
CREATE POLICY "Authenticated can view approved affiliates for referral"
ON public.affiliates
FOR SELECT
TO authenticated
USING (status = 'approved' OR auth.uid() = user_id);