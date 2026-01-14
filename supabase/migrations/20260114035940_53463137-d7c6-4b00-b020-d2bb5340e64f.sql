-- Create a function to get the session ID from request headers
CREATE OR REPLACE FUNCTION public.get_request_session_id()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.headers', true)::json->>'x-session-id',
      ''
    ),
    ''
  )
$$;