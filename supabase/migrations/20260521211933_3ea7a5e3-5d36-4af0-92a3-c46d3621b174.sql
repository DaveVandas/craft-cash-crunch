-- Block authenticated users from reading rate_limits (only service_role should access)
CREATE POLICY "Block authenticated SELECT on rate limits"
ON public.rate_limits
FOR SELECT
TO authenticated
USING (false);