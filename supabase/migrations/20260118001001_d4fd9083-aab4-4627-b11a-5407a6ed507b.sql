-- Create a function to handle affiliate attribution when user signs up
-- This runs with SECURITY DEFINER so it can bypass RLS
CREATE OR REPLACE FUNCTION public.handle_affiliate_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_affiliate_id UUID;
  v_commission_rate NUMERIC;
  v_affiliate_user_id UUID;
BEGIN
  -- Only process if referred_by_code is set
  IF NEW.referred_by_code IS NOT NULL THEN
    -- Find the affiliate by code
    SELECT id, commission_rate, user_id 
    INTO v_affiliate_id, v_commission_rate, v_affiliate_user_id
    FROM public.affiliates 
    WHERE affiliate_code = UPPER(NEW.referred_by_code) 
      AND status = 'approved'
    LIMIT 1;
    
    IF v_affiliate_id IS NOT NULL THEN
      -- Create affiliate_referral record (use upsert to avoid duplicates)
      INSERT INTO public.affiliate_referrals (
        affiliate_id, 
        referred_user_id, 
        commission_amount, 
        status
      )
      VALUES (
        v_affiliate_id, 
        NEW.user_id, 
        v_commission_rate, 
        'pending'
      )
      ON CONFLICT DO NOTHING;
      
      -- Update affiliate's total_referrals count
      UPDATE public.affiliates 
      SET total_referrals = total_referrals + 1,
          updated_at = now()
      WHERE id = v_affiliate_id;
      
      -- Notify the affiliate about the new signup
      IF v_affiliate_user_id IS NOT NULL THEN
        INSERT INTO public.user_notifications (user_id, type, title, message, action_url)
        VALUES (
          v_affiliate_user_id,
          'referral_signup',
          '🎉 New Signup!',
          'Someone just signed up using your referral link! They''ll convert to a paid referral once they purchase.',
          '/affiliate-dashboard'
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on user_access for new signups with referral codes
DROP TRIGGER IF EXISTS on_user_signup_with_referral ON public.user_access;
CREATE TRIGGER on_user_signup_with_referral
AFTER INSERT OR UPDATE OF referred_by_code ON public.user_access
FOR EACH ROW
WHEN (NEW.referred_by_code IS NOT NULL)
EXECUTE FUNCTION public.handle_affiliate_signup();

-- Also create a function to handle conversion when user pays
CREATE OR REPLACE FUNCTION public.handle_affiliate_conversion()
RETURNS TRIGGER AS $$
DECLARE
  v_affiliate_id UUID;
  v_commission_rate NUMERIC;
  v_affiliate_user_id UUID;
  v_total_referrals INTEGER;
BEGIN
  -- Only process when has_lifetime_access changes to true AND referred_by_code is set
  IF NEW.has_lifetime_access = true 
     AND (OLD.has_lifetime_access IS NULL OR OLD.has_lifetime_access = false)
     AND NEW.referred_by_code IS NOT NULL THEN
    
    -- Find the affiliate by code
    SELECT a.id, a.commission_rate, a.user_id, a.total_referrals 
    INTO v_affiliate_id, v_commission_rate, v_affiliate_user_id, v_total_referrals
    FROM public.affiliates a
    WHERE a.affiliate_code = UPPER(NEW.referred_by_code) 
      AND a.status = 'approved'
    LIMIT 1;
    
    IF v_affiliate_id IS NOT NULL THEN
      -- Check if they should get the higher rate (after 1000 referrals)
      IF v_total_referrals >= 1000 AND v_commission_rate < 2.00 THEN
        v_commission_rate := 2.00;
      END IF;
      
      -- Update the referral to converted status
      UPDATE public.affiliate_referrals 
      SET status = 'converted',
          converted_at = now(),
          commission_amount = v_commission_rate
      WHERE affiliate_id = v_affiliate_id 
        AND referred_user_id = NEW.user_id
        AND status = 'pending';
      
      -- Update affiliate's total_earnings and pending_payout
      UPDATE public.affiliates 
      SET total_earnings = total_earnings + v_commission_rate,
          pending_payout = pending_payout + v_commission_rate,
          updated_at = now()
      WHERE id = v_affiliate_id;
      
      -- Notify the affiliate about the conversion!
      IF v_affiliate_user_id IS NOT NULL THEN
        INSERT INTO public.user_notifications (user_id, type, title, message, action_url)
        VALUES (
          v_affiliate_user_id,
          'referral_converted',
          '💰 Cha-Ching! You just earned $' || v_commission_rate || '!',
          'Your referral just made a purchase! You''ve earned $' || v_commission_rate || ' in commission.',
          '/affiliate-dashboard'
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for conversion
DROP TRIGGER IF EXISTS on_user_payment_conversion ON public.user_access;
CREATE TRIGGER on_user_payment_conversion
AFTER UPDATE OF has_lifetime_access ON public.user_access
FOR EACH ROW
WHEN (NEW.has_lifetime_access = true AND (OLD.has_lifetime_access IS NULL OR OLD.has_lifetime_access = false))
EXECUTE FUNCTION public.handle_affiliate_conversion();

-- Allow users to update their own referred_by_code during signup (only if it's currently null)
CREATE POLICY "Users can set their own referral code once" 
ON public.user_access 
FOR UPDATE 
USING (auth.uid() = user_id AND referred_by_code IS NULL)
WITH CHECK (auth.uid() = user_id);