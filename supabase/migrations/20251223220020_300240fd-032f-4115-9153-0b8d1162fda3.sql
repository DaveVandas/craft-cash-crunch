-- Create rate_limits table for persistent rate limiting
CREATE TABLE public.rate_limits (
  ip_address TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access rate limits (edge functions use service role)
CREATE POLICY "Service role can manage rate limits"
ON public.rate_limits
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create function to check and update rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip_address TEXT,
  p_max_requests INTEGER DEFAULT 30,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record rate_limits%ROWTYPE;
  v_now TIMESTAMPTZ := now();
BEGIN
  -- Try to get existing record
  SELECT * INTO v_record FROM rate_limits WHERE ip_address = p_ip_address FOR UPDATE;
  
  IF NOT FOUND THEN
    -- First request from this IP
    INSERT INTO rate_limits (ip_address, request_count, window_start)
    VALUES (p_ip_address, 1, v_now)
    ON CONFLICT (ip_address) DO NOTHING;
    RETURN FALSE; -- Not rate limited
  END IF;
  
  -- Check if window has expired
  IF v_record.window_start + (p_window_seconds || ' seconds')::INTERVAL < v_now THEN
    -- Reset window
    UPDATE rate_limits 
    SET request_count = 1, window_start = v_now
    WHERE ip_address = p_ip_address;
    RETURN FALSE; -- Not rate limited
  END IF;
  
  -- Check if limit exceeded
  IF v_record.request_count >= p_max_requests THEN
    RETURN TRUE; -- Rate limited
  END IF;
  
  -- Increment count
  UPDATE rate_limits 
  SET request_count = request_count + 1
  WHERE ip_address = p_ip_address;
  
  RETURN FALSE; -- Not rate limited
END;
$$;

-- Create cleanup function to remove old entries (can be called periodically)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits(p_older_than_minutes INTEGER DEFAULT 10)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM rate_limits 
  WHERE window_start < now() - (p_older_than_minutes || ' minutes')::INTERVAL;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;