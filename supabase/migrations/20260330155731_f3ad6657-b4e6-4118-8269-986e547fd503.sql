
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
    AND is_valid_guest_session(session_id)
  )
);
