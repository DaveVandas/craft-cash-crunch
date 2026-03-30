
CREATE OR REPLACE FUNCTION public.is_valid_guest_session(p_session_id text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ip_hash TEXT;
  v_stored_ip_hash TEXT;
  v_session_exists BOOLEAN;
BEGIN
  -- Check if session exists and get stored IP hash
  SELECT ip_hash INTO v_stored_ip_hash
  FROM public.guest_sessions
  WHERE session_id = p_session_id
    AND expires_at > now();

  -- Session not found or expired
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Legacy sessions without IP hash stored - allow (backward compat)
  IF v_stored_ip_hash IS NULL OR v_stored_ip_hash = '' THEN
    RETURN TRUE;
  END IF;

  -- For service_role calls, skip IP check (they already have full access)
  IF current_setting('role', true) = 'service_role' THEN
    RETURN TRUE;
  END IF;

  -- Extract current request IP hash
  BEGIN
    v_ip_hash := current_setting('request.headers', true)::json->>'x-ip-hash';
  EXCEPTION WHEN OTHERS THEN
    v_ip_hash := NULL;
  END;

  -- If IP hash header is missing but stored hash exists, deny access
  IF v_ip_hash IS NULL OR v_ip_hash = '' THEN
    RETURN FALSE;
  END IF;

  -- Verify IP hash matches
  RETURN v_stored_ip_hash = v_ip_hash;
END;
$$;
