-- Block SELECT access on email_subscribers for non-service-role users
-- Service role already has ALL access via existing policy
CREATE POLICY "Block public SELECT on subscribers"
ON public.email_subscribers
FOR SELECT
USING (false);