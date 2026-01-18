-- Block anonymous users from reading rate limit data (IP addresses, request counts)
CREATE POLICY "Block public SELECT on rate limits" 
ON public.rate_limits 
FOR SELECT 
TO anon 
USING (false);