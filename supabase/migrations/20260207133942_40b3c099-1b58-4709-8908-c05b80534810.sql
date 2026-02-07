-- Create a function to get email subscriber count (safe to expose, just returns a number)
CREATE OR REPLACE FUNCTION public.get_subscriber_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.email_subscribers WHERE is_active = true;
$$;