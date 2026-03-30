
-- Fix 1: Add validation trigger for trading_achievements to prevent arbitrary achievement insertion
CREATE OR REPLACE FUNCTION public.validate_achievement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  valid_ids TEXT[] := ARRAY[
    'first_trade', 'ten_trades', 'fifty_trades', 'hundred_trades',
    'first_profit', 'big_winner', 'diversified', 'diamond_hands',
    'day_trader', 'penny_pincher', 'bull_run', 'bear_survivor',
    'portfolio_milestone_1k', 'portfolio_milestone_10k', 'portfolio_milestone_50k', 'portfolio_milestone_100k',
    'early_adopter', 'streak_7', 'streak_30'
  ];
BEGIN
  IF NOT (NEW.achievement_id = ANY(valid_ids)) THEN
    RAISE EXCEPTION 'Invalid achievement_id: %', NEW.achievement_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_achievement_before_insert
  BEFORE INSERT ON public.trading_achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_achievement();

-- Fix 2: Strengthen guest session validation to check IP hash binding
CREATE OR REPLACE FUNCTION public.is_valid_guest_session(p_session_id text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ip_hash TEXT;
  v_stored_ip_hash TEXT;
BEGIN
  -- Get the stored IP hash for this session
  SELECT ip_hash INTO v_stored_ip_hash
  FROM public.guest_sessions
  WHERE session_id = p_session_id
    AND expires_at > now();

  -- Session not found or expired
  IF v_stored_ip_hash IS NULL THEN
    -- Check if session exists at all (might have NULL ip_hash for legacy sessions)
    RETURN EXISTS (
      SELECT 1 FROM public.guest_sessions
      WHERE session_id = p_session_id
        AND expires_at > now()
    );
  END IF;

  -- Extract current request IP hash for comparison
  BEGIN
    v_ip_hash := current_setting('request.headers', true)::json->>'x-ip-hash';
  EXCEPTION WHEN OTHERS THEN
    v_ip_hash := NULL;
  END;

  -- If we can't get the IP hash from headers, allow (graceful degradation)
  -- This handles direct DB access and edge function calls
  IF v_ip_hash IS NULL OR v_ip_hash = '' THEN
    RETURN TRUE;
  END IF;

  -- Verify IP hash matches
  RETURN v_stored_ip_hash = v_ip_hash;
END;
$$;
