-- Fix: Strengthen INSERT policy to prevent users from creating affiliate records for other users
-- This prevents potential data harvesting by ensuring user_id must match the authenticated user

-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can apply as affiliates" ON public.affiliates;

-- Create a more secure INSERT policy that enforces user_id = auth.uid()
CREATE POLICY "Users can only apply as themselves"
ON public.affiliates
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add a comment explaining the security rationale
COMMENT ON POLICY "Users can only apply as themselves" ON public.affiliates IS 
'Prevents users from creating affiliate records for other users. Combined with the SELECT policy that restricts viewing to own profile only, this ensures affiliates cannot see other affiliates email addresses or payment details.';