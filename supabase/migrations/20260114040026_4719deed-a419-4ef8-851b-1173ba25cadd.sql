-- Drop existing policies for trading_portfolios
DROP POLICY IF EXISTS "Users can view their own portfolio" ON public.trading_portfolios;
DROP POLICY IF EXISTS "Users can create their own portfolio" ON public.trading_portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolio" ON public.trading_portfolios;

-- Create new secure policies for trading_portfolios
CREATE POLICY "Users can view their own portfolio" 
ON public.trading_portfolios FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (session_id IS NOT NULL AND session_id = public.get_request_session_id())
);

CREATE POLICY "Users can create their own portfolio" 
ON public.trading_portfolios FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  (user_id IS NULL AND session_id IS NOT NULL AND session_id = public.get_request_session_id())
);

CREATE POLICY "Users can update their own portfolio" 
ON public.trading_portfolios FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  (session_id IS NOT NULL AND session_id = public.get_request_session_id())
);

-- Drop existing policies for trading_positions
DROP POLICY IF EXISTS "Users can view their own positions" ON public.trading_positions;
DROP POLICY IF EXISTS "Users can create positions in their portfolio" ON public.trading_positions;
DROP POLICY IF EXISTS "Users can update their own positions" ON public.trading_positions;
DROP POLICY IF EXISTS "Users can delete their own positions" ON public.trading_positions;

-- Create new secure policies for trading_positions (via portfolio join)
CREATE POLICY "Users can view their own positions" 
ON public.trading_positions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_positions.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);

CREATE POLICY "Users can create positions in their portfolio" 
ON public.trading_positions FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_positions.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);

CREATE POLICY "Users can update their own positions" 
ON public.trading_positions FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_positions.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);

CREATE POLICY "Users can delete their own positions" 
ON public.trading_positions FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_positions.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);

-- Drop existing policies for trading_orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.trading_orders;
DROP POLICY IF EXISTS "Users can create orders in their portfolio" ON public.trading_orders;

-- Create new secure policies for trading_orders
CREATE POLICY "Users can view their own orders" 
ON public.trading_orders FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_orders.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);

CREATE POLICY "Users can create orders in their portfolio" 
ON public.trading_orders FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_orders.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);

-- Drop existing policies for trading_achievements
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.trading_achievements;
DROP POLICY IF EXISTS "Users can create achievements in their portfolio" ON public.trading_achievements;

-- Create new secure policies for trading_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.trading_achievements FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_achievements.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);

CREATE POLICY "Users can create achievements in their portfolio" 
ON public.trading_achievements FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_achievements.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);

-- Drop existing policies for trading_cash_purchases
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.trading_cash_purchases;
DROP POLICY IF EXISTS "Users can create purchases for their portfolio" ON public.trading_cash_purchases;

-- Create new secure policies for trading_cash_purchases
CREATE POLICY "Users can view their own purchases" 
ON public.trading_cash_purchases FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_cash_purchases.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);

CREATE POLICY "Users can create purchases for their portfolio" 
ON public.trading_cash_purchases FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trading_portfolios 
    WHERE trading_portfolios.id = trading_cash_purchases.portfolio_id 
    AND (
      trading_portfolios.user_id = auth.uid() OR 
      (trading_portfolios.session_id IS NOT NULL AND trading_portfolios.session_id = public.get_request_session_id())
    )
  )
);