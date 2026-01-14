
-- Fix the overly permissive INSERT policy on affiliates
DROP POLICY IF EXISTS "Anyone can create affiliate application" ON public.affiliates;

-- Create a more secure policy - only authenticated users can apply
CREATE POLICY "Authenticated users can apply as affiliates"
ON public.affiliates FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
