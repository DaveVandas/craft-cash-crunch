-- Add RevenueCat transaction tracking to user_access (lifetime purchases)
ALTER TABLE public.user_access
  ADD COLUMN IF NOT EXISTS revenuecat_transaction_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS user_access_revenuecat_txn_unique
  ON public.user_access (revenuecat_transaction_id)
  WHERE revenuecat_transaction_id IS NOT NULL;

-- Idempotency on existing Stripe payment_intent as well
CREATE UNIQUE INDEX IF NOT EXISTS user_access_stripe_payment_intent_unique
  ON public.user_access (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

-- Add RevenueCat transaction tracking to trading_cash_purchases (Mogul Cash)
ALTER TABLE public.trading_cash_purchases
  ADD COLUMN IF NOT EXISTS revenuecat_transaction_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS trading_cash_purchases_revenuecat_txn_unique
  ON public.trading_cash_purchases (revenuecat_transaction_id)
  WHERE revenuecat_transaction_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS trading_cash_purchases_stripe_payment_intent_unique
  ON public.trading_cash_purchases (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;