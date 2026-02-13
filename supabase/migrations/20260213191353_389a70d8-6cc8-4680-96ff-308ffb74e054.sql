
-- Block anonymous/public SELECT on affiliates table (PII protection)
CREATE POLICY "Block public SELECT on affiliates"
ON public.affiliates
FOR SELECT
USING (false);

-- Block anonymous/public SELECT on user_access table (payment data protection)
CREATE POLICY "Block public SELECT on user_access"
ON public.user_access
FOR SELECT
USING (false);
