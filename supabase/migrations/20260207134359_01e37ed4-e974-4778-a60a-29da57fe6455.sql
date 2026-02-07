-- Create table to track story shares
CREATE TABLE public.story_share_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id text NOT NULL,
  story_title text NOT NULL,
  platform text NOT NULL,
  shared_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.story_share_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (track shares)
CREATE POLICY "Anyone can track shares"
  ON public.story_share_analytics
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view share analytics
CREATE POLICY "Admins can view share analytics"
  ON public.story_share_analytics
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to track a share (public, no auth needed)
CREATE OR REPLACE FUNCTION public.track_story_share(
  p_story_id text,
  p_story_title text,
  p_platform text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.story_share_analytics (story_id, story_title, platform)
  VALUES (p_story_id, p_story_title, p_platform);
END;
$$;