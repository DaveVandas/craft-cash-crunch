
-- Simplify is_valid_guest_session: rely on cryptographic UUID randomness
-- IP/UA hashes remain in guest_sessions for server-side anomaly detection only
CREATE OR REPLACE FUNCTION public.is_valid_guest_session(p_session_id text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.guest_sessions
    WHERE session_id = p_session_id
      AND expires_at > now()
  )
$$;
