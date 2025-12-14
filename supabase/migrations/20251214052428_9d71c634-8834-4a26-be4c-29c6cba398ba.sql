-- Drop the overly permissive UPDATE policy that allows users to bypass payment
-- All user_access updates should go through Edge Functions with service_role
DROP POLICY IF EXISTS "Users can update their own search count" ON public.user_access;