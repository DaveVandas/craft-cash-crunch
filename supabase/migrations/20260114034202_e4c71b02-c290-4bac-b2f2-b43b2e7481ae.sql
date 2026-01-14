
-- Create affiliates table with variable commission rates
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  affiliate_code TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  commission_rate NUMERIC NOT NULL DEFAULT 1.00,
  payout_method TEXT DEFAULT 'paypal',
  payout_details TEXT,
  is_vip BOOLEAN NOT NULL DEFAULT false,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_earnings NUMERIC NOT NULL DEFAULT 0.00,
  pending_payout NUMERIC NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate referrals tracking table
CREATE TABLE public.affiliate_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id),
  referred_email TEXT,
  commission_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  converted_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate payouts table for tracking payments
CREATE TABLE public.affiliate_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payout_method TEXT NOT NULL,
  transaction_id TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Affiliates policies
CREATE POLICY "Admins can manage all affiliates"
ON public.affiliates FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own affiliate profile"
ON public.affiliates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create affiliate application"
ON public.affiliates FOR INSERT
WITH CHECK (true);

-- Affiliate referrals policies
CREATE POLICY "Admins can manage all referrals"
ON public.affiliate_referrals FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Affiliates can view their own referrals"
ON public.affiliate_referrals FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.affiliates
  WHERE affiliates.id = affiliate_referrals.affiliate_id
  AND affiliates.user_id = auth.uid()
));

CREATE POLICY "Service role can manage referrals"
ON public.affiliate_referrals FOR ALL
USING (auth.role() = 'service_role');

-- Affiliate payouts policies
CREATE POLICY "Admins can manage all payouts"
ON public.affiliate_payouts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Affiliates can view their own payouts"
ON public.affiliate_payouts FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.affiliates
  WHERE affiliates.id = affiliate_payouts.affiliate_id
  AND affiliates.user_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX idx_affiliates_status ON public.affiliates(status);
CREATE INDEX idx_affiliate_referrals_affiliate ON public.affiliate_referrals(affiliate_id);
CREATE INDEX idx_affiliate_referrals_status ON public.affiliate_referrals(status);
