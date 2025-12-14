-- Fix 1: Add restrictive write policies to celebrity_images table
-- Only service role can insert celebrity images
CREATE POLICY "Service role can insert celebrity images"
ON public.celebrity_images
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Only service role can update celebrity images  
CREATE POLICY "Service role can update celebrity images"
ON public.celebrity_images
FOR UPDATE
USING (auth.role() = 'service_role');

-- Only service role can delete celebrity images
CREATE POLICY "Service role can delete celebrity images" 
ON public.celebrity_images
FOR DELETE
USING (auth.role() = 'service_role');

-- Fix 2: Update has_role function with improved security
-- Use empty search_path and fully qualified table names
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;