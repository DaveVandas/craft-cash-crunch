CREATE TABLE public.celebrity_earnings_cache (
  name_normalized text PRIMARY KEY,
  payload jsonb NOT NULL,
  fetched_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT ON public.celebrity_earnings_cache TO anon;
GRANT SELECT ON public.celebrity_earnings_cache TO authenticated;
GRANT ALL ON public.celebrity_earnings_cache TO service_role;
ALTER TABLE public.celebrity_earnings_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cached celebrity data"
  ON public.celebrity_earnings_cache FOR SELECT
  USING (true);