-- Create referrals table for tracking user invites
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_email TEXT NOT NULL,
  referred_user_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own referrals
CREATE POLICY "Users can view their own referrals"
  ON public.referrals
  FOR SELECT
  USING (auth.uid() = referrer_id);

-- Users can insert their own referrals
CREATE POLICY "Users can insert their own referrals"
  ON public.referrals
  FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- Service role can manage all referrals
CREATE POLICY "Service role can manage referrals"
  ON public.referrals
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add referral_code column to user_access to track who referred them
ALTER TABLE public.user_access ADD COLUMN IF NOT EXISTS referred_by_code TEXT;

-- Create index for faster lookups
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referral_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_referred_user_id ON public.referrals(referred_user_id);