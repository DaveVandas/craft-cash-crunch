-- Create trading portfolios table
CREATE TABLE public.trading_portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  cash_balance DECIMAL(15, 2) NOT NULL DEFAULT 10000.00,
  total_invested DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_portfolio UNIQUE (user_id),
  CONSTRAINT unique_session_portfolio UNIQUE (session_id),
  CONSTRAINT has_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Create trading positions table
CREATE TABLE public.trading_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.trading_portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  shares DECIMAL(15, 6) NOT NULL,
  avg_cost_per_share DECIMAL(15, 4) NOT NULL,
  current_price DECIMAL(15, 4),
  last_price_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_portfolio_ticker UNIQUE (portfolio_id, ticker)
);

-- Create trading orders table
CREATE TABLE public.trading_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.trading_portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('buy', 'sell', 'short', 'cover')),
  order_status TEXT NOT NULL DEFAULT 'executed' CHECK (order_status IN ('pending', 'executed', 'cancelled', 'failed')),
  shares DECIMAL(15, 6) NOT NULL,
  price_per_share DECIMAL(15, 4) NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trading achievements table
CREATE TABLE public.trading_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.trading_portfolios(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_portfolio_achievement UNIQUE (portfolio_id, achievement_id)
);

-- Create trading cash purchases table (for Stripe upsells)
CREATE TABLE public.trading_cash_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.trading_portfolios(id) ON DELETE CASCADE,
  amount_purchased DECIMAL(15, 2) NOT NULL,
  price_paid DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trading_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_cash_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trading_portfolios
CREATE POLICY "Users can view their own portfolio" 
ON public.trading_portfolios FOR SELECT 
USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can create their own portfolio" 
ON public.trading_portfolios FOR INSERT 
WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND session_id IS NOT NULL));

CREATE POLICY "Users can update their own portfolio" 
ON public.trading_portfolios FOR UPDATE 
USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- RLS Policies for trading_positions
CREATE POLICY "Users can view their own positions" 
ON public.trading_positions FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_positions.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

CREATE POLICY "Users can create positions in their portfolio" 
ON public.trading_positions FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_positions.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

CREATE POLICY "Users can update their own positions" 
ON public.trading_positions FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_positions.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

CREATE POLICY "Users can delete their own positions" 
ON public.trading_positions FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_positions.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

-- RLS Policies for trading_orders
CREATE POLICY "Users can view their own orders" 
ON public.trading_orders FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_orders.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

CREATE POLICY "Users can create orders in their portfolio" 
ON public.trading_orders FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_orders.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

-- RLS Policies for trading_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.trading_achievements FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_achievements.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

CREATE POLICY "Users can create achievements in their portfolio" 
ON public.trading_achievements FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_achievements.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

-- RLS Policies for trading_cash_purchases
CREATE POLICY "Users can view their own purchases" 
ON public.trading_cash_purchases FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_cash_purchases.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

CREATE POLICY "Users can create purchases for their portfolio" 
ON public.trading_cash_purchases FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.trading_portfolios 
  WHERE id = trading_cash_purchases.portfolio_id 
  AND (user_id = auth.uid() OR session_id IS NOT NULL)
));

-- Add updated_at triggers
CREATE TRIGGER update_trading_portfolios_updated_at
BEFORE UPDATE ON public.trading_portfolios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trading_positions_updated_at
BEFORE UPDATE ON public.trading_positions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();