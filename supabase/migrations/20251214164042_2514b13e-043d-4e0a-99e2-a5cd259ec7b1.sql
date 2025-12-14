-- Create table to track celebrity search trends
CREATE TABLE public.search_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  celebrity_name TEXT NOT NULL,
  celebrity_slug TEXT NOT NULL UNIQUE,
  category TEXT,
  search_count INTEGER NOT NULL DEFAULT 1,
  last_searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_trends ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read trends (public data)
CREATE POLICY "Anyone can view search trends"
ON public.search_trends
FOR SELECT
USING (true);

-- Only service role can insert/update (from edge functions)
CREATE POLICY "Service role can manage trends"
ON public.search_trends
FOR ALL
USING (auth.role() = 'service_role');

-- Create index for fast lookups
CREATE INDEX idx_search_trends_count ON public.search_trends (search_count DESC);
CREATE INDEX idx_search_trends_category ON public.search_trends (category);
CREATE INDEX idx_search_trends_last_searched ON public.search_trends (last_searched_at DESC);