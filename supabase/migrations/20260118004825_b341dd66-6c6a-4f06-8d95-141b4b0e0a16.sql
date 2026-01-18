-- Fix SECURITY DEFINER functions to use empty search_path for security hardening
-- This prevents potential SQL injection through search_path manipulation

-- 1. Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.user_access (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$;

-- 2. Fix handle_new_user_profile function
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- 3. Fix check_rate_limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_ip_address text, p_max_requests integer DEFAULT 30, p_window_seconds integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_record public.rate_limits%ROWTYPE;
  v_now TIMESTAMPTZ := now();
BEGIN
  -- Try to get existing record
  SELECT * INTO v_record FROM public.rate_limits WHERE ip_address = p_ip_address FOR UPDATE;
  
  IF NOT FOUND THEN
    -- First request from this IP
    INSERT INTO public.rate_limits (ip_address, request_count, window_start)
    VALUES (p_ip_address, 1, v_now)
    ON CONFLICT (ip_address) DO NOTHING;
    RETURN FALSE; -- Not rate limited
  END IF;
  
  -- Check if window has expired
  IF v_record.window_start + (p_window_seconds || ' seconds')::INTERVAL < v_now THEN
    -- Reset window
    UPDATE public.rate_limits 
    SET request_count = 1, window_start = v_now
    WHERE ip_address = p_ip_address;
    RETURN FALSE; -- Not rate limited
  END IF;
  
  -- Check if limit exceeded
  IF v_record.request_count >= p_max_requests THEN
    RETURN TRUE; -- Rate limited
  END IF;
  
  -- Increment count
  UPDATE public.rate_limits 
  SET request_count = request_count + 1
  WHERE ip_address = p_ip_address;
  
  RETURN FALSE; -- Not rate limited
END;
$$;

-- 4. Fix cleanup_rate_limits function
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits(p_older_than_minutes integer DEFAULT 10)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - (p_older_than_minutes || ' minutes')::INTERVAL;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

-- 5. Fix handle_affiliate_signup function
CREATE OR REPLACE FUNCTION public.handle_affiliate_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- 6. Fix handle_affiliate_conversion function
CREATE OR REPLACE FUNCTION public.handle_affiliate_conversion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- 7. Fix notify_affiliate_on_commission_change function
CREATE OR REPLACE FUNCTION public.notify_affiliate_on_commission_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only trigger if commission_rate changed and user_id exists
  IF NEW.commission_rate != OLD.commission_rate AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.user_notifications (user_id, type, title, message, action_url, metadata)
    VALUES (
      NEW.user_id,
      'commission_updated',
      '💎 Commission Rate Updated!',
      'Great news! Your commission rate has been updated to $' || NEW.commission_rate || ' per signup by the app owner.',
      '/affiliate-dashboard',
      jsonb_build_object('old_rate', OLD.commission_rate, 'new_rate', NEW.commission_rate)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 8. Fix increment_affiliate_referrals function
CREATE OR REPLACE FUNCTION public.increment_affiliate_referrals(affiliate_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.affiliates
  SET total_referrals = total_referrals + 1,
      updated_at = now()
  WHERE id = affiliate_uuid;
END;
$$;

-- 9. Fix notify_affiliate_on_approval function
CREATE OR REPLACE FUNCTION public.notify_affiliate_on_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only trigger if status changed to 'approved' and user_id exists
  IF NEW.status = 'approved' AND OLD.status != 'approved' AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.user_notifications (user_id, type, title, message, action_url)
    VALUES (
      NEW.user_id,
      'affiliate_approved',
      '🎉 Congratulations, Mogul!',
      'Your affiliate application has been approved! You can now start sharing your link and earning commissions.',
      '/affiliate-dashboard'
    );
  END IF;
  RETURN NEW;
END;
$$;