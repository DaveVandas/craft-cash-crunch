-- Create guest_sessions table for server-side session tracking
-- This addresses session spoofing risk by adding server-side validation with expiry

CREATE TABLE public.guest_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  last_activity_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_hash text, -- SHA-256 hash of IP for anomaly detection, not actual IP
  user_agent_hash text -- SHA-256 hash of user agent
);

-- Enable RLS
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

-- Service role can manage all sessions
CREATE POLICY "Service role can manage guest sessions"
  ON public.guest_sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Block direct public access
CREATE POLICY "Block public SELECT on guest sessions"
  ON public.guest_sessions
  FOR SELECT
  USING (false);

-- Create index for fast session lookups
CREATE INDEX idx_guest_sessions_session_id ON public.guest_sessions(session_id);
CREATE INDEX idx_guest_sessions_expires_at ON public.guest_sessions(expires_at);

-- Create function to validate guest session exists and is not expired
CREATE OR REPLACE FUNCTION public.is_valid_guest_session(p_session_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.guest_sessions
    WHERE session_id = p_session_id
      AND expires_at > now()
  )
$$;

-- Update trading_portfolios RLS to require valid guest session
DROP POLICY IF EXISTS "Users can view their own portfolio" ON public.trading_portfolios;
CREATE POLICY "Users can view their own portfolio"
  ON public.trading_portfolios
  FOR SELECT
  USING (
    (auth.uid() = user_id) 
    OR (
      session_id IS NOT NULL 
      AND session_id = get_request_session_id()
      AND is_valid_guest_session(session_id)
    )
  );

DROP POLICY IF EXISTS "Users can update their own portfolio" ON public.trading_portfolios;
CREATE POLICY "Users can update their own portfolio"
  ON public.trading_portfolios
  FOR UPDATE
  USING (
    (auth.uid() = user_id) 
    OR (
      session_id IS NOT NULL 
      AND session_id = get_request_session_id()
      AND is_valid_guest_session(session_id)
    )
  );

DROP POLICY IF EXISTS "Users can create their own portfolio" ON public.trading_portfolios;
CREATE POLICY "Users can create their own portfolio"
  ON public.trading_portfolios
  FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) 
    OR (
      user_id IS NULL 
      AND session_id IS NOT NULL 
      AND session_id = get_request_session_id()
    )
  );

-- Update trading_positions policies
DROP POLICY IF EXISTS "Users can view their own positions" ON public.trading_positions;
CREATE POLICY "Users can view their own positions"
  ON public.trading_positions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_positions.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

DROP POLICY IF EXISTS "Users can create positions in their portfolio" ON public.trading_positions;
CREATE POLICY "Users can create positions in their portfolio"
  ON public.trading_positions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_positions.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

DROP POLICY IF EXISTS "Users can update their own positions" ON public.trading_positions;
CREATE POLICY "Users can update their own positions"
  ON public.trading_positions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_positions.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

DROP POLICY IF EXISTS "Users can delete their own positions" ON public.trading_positions;
CREATE POLICY "Users can delete their own positions"
  ON public.trading_positions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_positions.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

-- Update trading_orders policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.trading_orders;
CREATE POLICY "Users can view their own orders"
  ON public.trading_orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_orders.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

DROP POLICY IF EXISTS "Users can create orders in their portfolio" ON public.trading_orders;
CREATE POLICY "Users can create orders in their portfolio"
  ON public.trading_orders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_orders.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

-- Update trading_achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.trading_achievements;
CREATE POLICY "Users can view their own achievements"
  ON public.trading_achievements
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_achievements.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

DROP POLICY IF EXISTS "Users can create achievements in their portfolio" ON public.trading_achievements;
CREATE POLICY "Users can create achievements in their portfolio"
  ON public.trading_achievements
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_achievements.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

-- Update trading_cash_purchases policies
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.trading_cash_purchases;
CREATE POLICY "Users can view their own purchases"
  ON public.trading_cash_purchases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_cash_purchases.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

DROP POLICY IF EXISTS "Users can create purchases for their portfolio" ON public.trading_cash_purchases;
CREATE POLICY "Users can create purchases for their portfolio"
  ON public.trading_cash_purchases
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trading_portfolios
      WHERE trading_portfolios.id = trading_cash_purchases.portfolio_id
      AND (
        trading_portfolios.user_id = auth.uid()
        OR (
          trading_portfolios.session_id IS NOT NULL
          AND trading_portfolios.session_id = get_request_session_id()
          AND is_valid_guest_session(trading_portfolios.session_id)
        )
      )
    )
  );

-- Function to cleanup expired guest sessions (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_guest_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM public.guest_sessions 
  WHERE expires_at < now();
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;