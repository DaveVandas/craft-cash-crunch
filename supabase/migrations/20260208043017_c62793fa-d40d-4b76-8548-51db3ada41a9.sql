-- Create share analytics table for tracking all share events
CREATE TABLE public.share_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature TEXT NOT NULL,  -- 'compare', 'calculator', 'quiz', 'mogul-markets', 'profile', 'invite', 'affiliate', etc.
  platform TEXT NOT NULL,  -- 'twitter', 'facebook', 'whatsapp', 'native', 'copy', 'instagram', 'tiktok', 'linkedin'
  share_type TEXT NOT NULL DEFAULT 'link',  -- 'link', 'image', 'text'
  context JSONB DEFAULT '{}',  -- additional context like celebrity name, affiliate code, etc.
  user_id UUID REFERENCES auth.users(id),  -- null for guests
  session_id TEXT,  -- for guest tracking
  device_type TEXT,  -- 'mobile', 'desktop', 'tablet'
  referrer TEXT,  -- where the share originated from
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.share_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (tracking should work for guests too)
CREATE POLICY "Anyone can track shares"
ON public.share_analytics
FOR INSERT
WITH CHECK (true);

-- Only admins can read share analytics
CREATE POLICY "Admins can read share analytics"
ON public.share_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create index for common queries
CREATE INDEX idx_share_analytics_feature ON public.share_analytics(feature);
CREATE INDEX idx_share_analytics_platform ON public.share_analytics(platform);
CREATE INDEX idx_share_analytics_created_at ON public.share_analytics(created_at DESC);

-- Create function for easy share tracking
CREATE OR REPLACE FUNCTION public.track_share(
  p_feature TEXT,
  p_platform TEXT,
  p_share_type TEXT DEFAULT 'link',
  p_context JSONB DEFAULT '{}',
  p_device_type TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id TEXT;
BEGIN
  -- Get session ID from request context
  BEGIN
    v_session_id := get_request_session_id();
  EXCEPTION WHEN OTHERS THEN
    v_session_id := NULL;
  END;
  
  INSERT INTO share_analytics (feature, platform, share_type, context, user_id, session_id, device_type, referrer)
  VALUES (
    p_feature,
    p_platform,
    p_share_type,
    p_context,
    auth.uid(),
    v_session_id,
    p_device_type,
    p_referrer
  );
END;
$$;