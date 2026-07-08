
-- Bind guest sessions to a server-issued secret token to prevent x-session-id spoofing.
ALTER TABLE public.guest_sessions ADD COLUMN IF NOT EXISTS token_hash text;

CREATE OR REPLACE FUNCTION public.get_request_session_id()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT gs.session_id
  FROM public.guest_sessions gs
  WHERE gs.session_id = NULLIF(current_setting('request.headers', true)::json->>'x-session-id', '')
    AND gs.token_hash IS NOT NULL
    AND gs.token_hash = encode(
      extensions.digest(
        NULLIF(current_setting('request.headers', true)::json->>'x-session-token', ''),
        'sha256'
      ),
      'hex'
    )
    AND gs.expires_at > now()
  LIMIT 1
$$;
