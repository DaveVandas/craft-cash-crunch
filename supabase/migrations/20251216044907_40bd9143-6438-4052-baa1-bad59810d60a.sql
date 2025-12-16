-- Create email subscribers table for newsletter
CREATE TABLE public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  source TEXT DEFAULT 'blog'
);

-- Enable RLS
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert their own email)
CREATE POLICY "Anyone can subscribe" 
ON public.email_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Service role can manage all subscribers
CREATE POLICY "Service role can manage subscribers" 
ON public.email_subscribers 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create index for email lookups
CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(email);