-- Enable realtime for affiliate-related tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.affiliates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.affiliate_referrals;