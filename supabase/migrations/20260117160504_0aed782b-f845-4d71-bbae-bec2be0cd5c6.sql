CREATE OR REPLACE FUNCTION public.increment_affiliate_referrals(affiliate_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE affiliates
  SET total_referrals = total_referrals + 1,
      updated_at = now()
  WHERE id = affiliate_uuid;
END;
$$;