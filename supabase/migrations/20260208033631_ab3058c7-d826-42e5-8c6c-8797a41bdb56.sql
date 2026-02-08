-- Function to get total affiliate count (pending + approved)
CREATE OR REPLACE FUNCTION public.get_affiliate_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.affiliates;
$$;